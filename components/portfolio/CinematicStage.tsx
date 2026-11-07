"use client";

import { useEffect, useRef, useState, type MutableRefObject, type RefObject } from "react";
import gsap from "gsap";
import { RollingNumber } from "@/components/ui/RollingNumber";

export interface SceneDef {
  id: string;
  label: string;
}

declare global {
  interface Window {
    __v5Stage?: { goToId: (id: string) => boolean };
  }
}

export type TransitionKind =
  | "shutter"
  | "slide"
  | "iris"
  | "split"
  | "diagonal"
  | "door"
  | "zoom"
  | "liquid"
  | "glitch"
  | "cube"
  | "blinds"
  | "warp";

/** Shared mutable state for the canvas overlay: warp streaks, shockwave ring, white flash, diagonal slash. */
export interface WarpState {
  v: number;
  ring: number;
  flash: number;
  slash: number;
}

// Signature transition into each scene (keyed by scene index).
const TRANSITIONS: Record<number, TransitionKind> = {
  1: "liquid",
  2: "glitch",
  3: "cube",
  4: "diagonal",
  5: "blinds",
  6: "door",
  7: "split",
  8: "zoom",
  9: "iris",
  10: "cube",
  11: "diagonal",
  12: "blinds",
  13: "door",
  14: "liquid",
  15: "iris",
};

const SCRAMBLE_SELECTOR =
  ".v5-section-label, .v5-overline, .v5-contact-overline, .v5-project-meta, .v5-mono, .v5-visual-coordinate, .v5-project-index";
const SCRAMBLE_GLYPHS = "01<>/\\|[]{}#$%&*+-=ABCDEFGHJKLMNPQRSTUVWXYZ";

/** Sci-fi "decode" effect on mono labels: glyphs resolve left-to-right from noise. */
function scrambleLabels(scene: HTMLElement, delay: number) {
  const items: { node: Text; original: string }[] = [];
  scene.querySelectorAll<HTMLElement>(SCRAMBLE_SELECTOR).forEach((el) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode() as Text | null;
    while (node) {
      if (node.data.trim()) items.push({ node, original: node.data });
      node = walker.nextNode() as Text | null;
    }
  });
  const restore = () => items.forEach(({ node, original }) => (node.data = original));
  const state = { p: 0 };
  const tween = gsap.to(state, {
    p: 1,
    duration: 1.05,
    delay,
    ease: "power1.inOut",
    onStart: () => items.forEach(({ node, original }) => (node.data = original.replace(/\S/g, "·"))),
    onUpdate: () => {
      items.forEach(({ node, original }) => {
        const reveal = state.p * (original.length + 6);
        let out = "";
        for (let i = 0; i < original.length; i++) {
          const ch = original[i];
          if (/\s/.test(ch) || i < reveal - 6) out += ch;
          else if (i < reveal) out += SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)];
          else out += "·";
        }
        node.data = out;
      });
    },
    onComplete: restore,
  });
  return { tween, restore };
}

const EDGE_H = "linear-gradient(90deg, transparent, #bfe4ff 20%, #ffffff 50%, #bfe4ff 80%, transparent)";
const EDGE_V = "linear-gradient(180deg, transparent, #bfe4ff 20%, #ffffff 50%, #bfe4ff 80%, transparent)";

const pad = (n: number) => String(n).padStart(2, "0");

// Every inline style a scene reveal can leave behind; cleared on teardown.
const REVEAL_SELECTOR = [
  ".v5-mask-line",
  ".v5-section-label",
  ".v5-overline",
  ".v5-contact-overline",
  ".v5-project-index",
  ".v5-project-meta",
  ".v5-heading-row > p",
  ".v5-about-story > *",
  ".v5-marquee",
  ".v5-skill-index button",
  ".v5-skill-content",
  ".v5-project-visual",
  ".v5-project-img",
  ".v5-project-info > *",
  ".v5-archive-entry",
  ".v5-archive-card",
  ".v5-cred-card",
  ".v5-lab-card",
  ".v5-future-card",
  ".v5-credential-list > *",
  ".v5-archive-content > a",
  ".v5-contact-rings",
  ".v5-contact-cta",
  ".v5-contact-footer > *",
].join(", ");

/**
 * Directional, per-scene entrance choreography. Text slices up through masks,
 * panels slam in from opposite sides, imagery pushes in like a camera dolly.
 */
function buildReveal(scene: HTMLElement, dir: number, delay = 0) {
  const t = gsap.timeline({ delay });
  const q = (selector: string) => gsap.utils.toArray<HTMLElement>(selector, scene);
  const add = (
    targets: HTMLElement[],
    from: gsap.TweenVars,
    to: gsap.TweenVars,
    position: number | string
  ) => {
    if (targets.length) t.fromTo(targets, from, to, position);
  };

  const side = scene.querySelector(".v5-project-reverse") ? 1 : -1;

  add(
    q(".v5-mask-line"),
    { yPercent: 118, rotate: 3 * dir, skewY: 5 },
    { yPercent: 0, rotate: 0, skewY: 0, duration: 1.05, stagger: 0.11, ease: "power4.out" },
    0
  );
  add(
    q(".v5-section-label, .v5-overline, .v5-contact-overline, .v5-project-index, .v5-project-meta"),
    { opacity: 0, x: -48 },
    { opacity: 1, x: 0, duration: 0.8, stagger: 0.06, ease: "power3.out" },
    0.05
  );
  add(
    q(".v5-heading-row > p"),
    { opacity: 0, y: 26 },
    { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
    0.45
  );

  // 01 About
  add(
    q(".v5-about-story > *"),
    { opacity: 0, x: 80 },
    { opacity: 1, x: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" },
    0.3
  );
  add(
    q(".v5-marquee"),
    { opacity: 0, xPercent: -28 },
    { opacity: 1, xPercent: 0, duration: 1.4, ease: "expo.out" },
    0.35
  );

  // 02 Capabilities
  add(
    q(".v5-skill-index button"),
    { opacity: 0, x: -110 },
    { opacity: 1, x: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" },
    0.4
  );
  add(
    q(".v5-skill-content"),
    { opacity: 0, x: 140, clipPath: "inset(0% 0% 0% 100%)" },
    { opacity: 1, x: 0, clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.out" },
    0.5
  );

  // 03 Projects
  add(
    q(".v5-project-visual"),
    {
      x: side * 150,
      scale: 1.1,
      clipPath: side > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
    },
    { x: 0, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.25, ease: "expo.out" },
    0.15
  );
  add(
    q(".v5-project-img"),
    { scale: 1.45 },
    { scale: 1.06, duration: 2.6, ease: "power2.out" },
    0.1
  );
  add(
    q(".v5-project-info > *"),
    { opacity: 0, x: -side * 80 },
    { opacity: 1, x: 0, duration: 0.85, stagger: 0.07, ease: "power3.out" },
    0.4
  );

  // 04 Archive & Lab / Future Works grids
  add(
    q(".v5-archive-entry, .v5-archive-card"),
    { opacity: 0, y: 28 },
    { opacity: 1, y: 0, duration: 0.65, stagger: 0.06, ease: "power3.out" },
    0.25
  );
  add(
    q(".v5-credential-list > *, .v5-cred-card, .v5-archive-content > a"),
    { opacity: 0, y: 22 },
    { opacity: 1, y: 0, duration: 0.6, stagger: 0.04, ease: "power3.out" },
    0.35
  );
  add(
    q(".v5-lab-card, .v5-future-card"),
    { opacity: 0, y: 40, scale: 0.97 },
    { opacity: 1, y: 0, scale: 1, duration: 0.85, stagger: 0.1, ease: "power3.out" },
    0.35
  );

  // 05 Contact
  add(
    q(".v5-contact-rings"),
    { opacity: 0 },
    { opacity: 1, duration: 1.8, ease: "power2.out" },
    0
  );
  add(
    q(".v5-contact-cta"),
    { opacity: 0, y: 40 },
    { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" },
    0.7
  );
  add(
    q(".v5-contact-footer > *"),
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power2.out" },
    0.95
  );

  return t;
}

/**
 * Scene-based cinematic navigation: one wheel / swipe / key / click advances a
 * single scene. Adjacent scenes use bespoke high-impact transitions; larger jumps use a warp.
 */
export function useCinematicStage(
  rootRef: RefObject<HTMLDivElement | null>,
  warp: MutableRefObject<WarpState>,
  defs: SceneDef[]
) {
  const [index, setIndex] = useState(0);
  const goRef = useRef<(to: number) => void>(() => {});

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scenes = Array.from(root.querySelectorAll<HTMLElement>(":scope > .v5-scene"));
    if (scenes.length !== defs.length) return;

    const warpState = warp.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const edge = root.querySelector<HTMLElement>(".v5-wipe-edge");
    const innerOf = (el: HTMLElement) => el.querySelector<HTMLElement>(":scope > .v5-scene-inner")!;
    const idToIndex = (id: string) => defs.findIndex((d) => d.id === id);

    let cur = 0;
    let animating = false;
    let lastWheel = 0;
    let acc = 0;
    let master: gsap.core.Timeline | null = null;
    let reveal: gsap.core.Timeline | null = null;
    let scramble: { tween: gsap.core.Tween; restore: () => void } | null = null;

    const stopScramble = () => {
      scramble?.tween.kill();
      scramble?.restore();
      scramble = null;
    };

    document.documentElement.classList.add("v5-stage-active");

    const setHash = (i: number) => {
      try {
        const path = window.location.pathname;
        window.history.replaceState(window.history.state, "", i === 0 ? path : `${path}#${defs[i].id}`);
      } catch {
        /* history may be unavailable */
      }
    };

    // Deep link support
    const start = idToIndex(window.location.hash.slice(1));
    scenes[start > 0 ? start : 0].classList.add("is-current");
    if (start > 0) {
      cur = start;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIndex(start);
      if (!reduce) {
        reveal = buildReveal(scenes[start], 1, 0.15);
        scramble = scrambleLabels(scenes[start], 0.2);
      }
    }

    const finish = (from: number, to: number) => {
      scenes[from].classList.remove("is-current");
      innerOf(scenes[from]).scrollTop = 0;
      gsap.set([scenes[from], innerOf(scenes[from])], { clearProps: "all" });
      gsap.set(scenes[to], { clearProps: "clipPath,zIndex,opacity,transform,transformOrigin,backfaceVisibility" });
      gsap.set(innerOf(scenes[to]), { clearProps: "all" });
      if (edge) gsap.set(edge, { opacity: 0 });
      [scenes[from], scenes[to]].forEach((el) =>
        ["mask-image", "-webkit-mask-image", "mask-size", "-webkit-mask-size", "mask-repeat", "-webkit-mask-repeat", "--p"].forEach(
          (n) => el.style.removeProperty(n)
        )
      );
      warpState.ring = 0;
      warpState.flash = 0;
      warpState.slash = 0;
      cur = to;
      animating = false;
      lastWheel = performance.now();
    };

    const heroProgress = (from: number, to: number, duration: number) => {
      if (from !== 0 && to !== 0) return;
      const state = { p: from === 0 ? 0 : 1 };
      const target = from === 0 ? 1 : 0;
      const emit = () =>
        window.dispatchEvent(new CustomEvent("v5:stage-progress", { detail: state.p }));
      gsap.to(state, { p: target, duration, ease: "power2.inOut", onUpdate: emit, onComplete: emit });
    };

    const go = (to: number) => {
      if (animating || to === cur || to < 0 || to >= scenes.length) return;
      const from = cur;
      const dir = to > from ? 1 : -1;
      const jump = Math.abs(to - from);
      const outEl = scenes[from];
      const inEl = scenes[to];
      const outInner = innerOf(outEl);
      const inInner = innerOf(inEl);

      animating = true;
      acc = 0;
      setIndex(to);
      setHash(to);
      inInner.scrollTop = 0;

      if (reduce) {
        inEl.classList.add("is-current");
        finish(from, to);
        return;
      }

      // Each scene has its own signature entrance; going back replays it in reverse.
      const kind: TransitionKind = jump === 1 ? TRANSITIONS[dir > 0 ? to : from] ?? "shutter" : "warp";
      gsap.set(outEl, { zIndex: kind === "door" ? 2 : 1 });
      gsap.set(inEl, { zIndex: kind === "door" ? 1 : 2 });

      reveal?.kill();
      stopScramble();
      const tl = gsap.timeline({ onComplete: () => finish(from, to) });
      master = tl;

      if (kind !== "warp") {
        inEl.classList.add("is-current");
        const D = 1.1;
        const ease = "expo.inOut";
        const full = "inset(0% 0% 0% 0%)";

        const clip = (a: string, b: string) =>
          tl.fromTo(inEl, { clipPath: a }, { clipPath: b, duration: D, ease }, 0);
        const push = (fromVars: gsap.TweenVars, toVars: gsap.TweenVars = {}) =>
          tl.fromTo(
            inInner,
            fromVars,
            { xPercent: 0, yPercent: 0, scale: 1, ...toVars, duration: D + 0.05, ease },
            0
          );
        const pull = (vars: gsap.TweenVars) =>
          tl.to(outInner, { opacity: 0.15, filter: "blur(7px)", duration: D * 0.95, ease, ...vars }, 0);
        const sweepEdge = (axis: "x" | "y") => {
          if (!edge) return;
          if (axis === "y") {
            gsap.set(edge, { left: 0, right: 0, bottom: "auto", width: "auto", height: 2, backgroundImage: EDGE_H });
            tl.fromTo(
              edge,
              { top: dir > 0 ? "100%" : "0%", opacity: 1 },
              { top: dir > 0 ? "0%" : "100%", duration: D, ease },
              0
            );
          } else {
            gsap.set(edge, { top: 0, bottom: 0, right: "auto", height: "auto", width: 2, backgroundImage: EDGE_V });
            tl.fromTo(
              edge,
              { left: dir > 0 ? "100%" : "0%", opacity: 1 },
              { left: dir > 0 ? "0%" : "100%", duration: D, ease },
              0
            );
          }
          tl.to(edge, { opacity: 0, duration: 0.2 }, D - 0.15);
        };
        const pulse = (at: number, flash: number, ring = true) => {
          if (ring) {
            tl.set(warpState, { ring: 0.01 }, at).to(
              warpState,
              { ring: 1, duration: D * 1.05, ease: "power2.out" },
              at
            );
          }
          tl.set(warpState, { flash }, at).to(
            warpState,
            { flash: 0, duration: 0.68, ease: "power2.out" },
            at
          );
        };

        switch (kind) {
          case "liquid": { // Turbulent plasma displacement dissolve + shockwave
            const dOut = document.getElementById("v5-liq-out");
            const dIn = document.getElementById("v5-liq-in");
            const st = { o: 0, i: 180 };
            dOut?.setAttribute("scale", "0");
            dIn?.setAttribute("scale", "180");
            gsap.set(outInner, { filter: "url(#v5-liquid-out)" });
            gsap.set(inInner, { filter: "url(#v5-liquid-in)" });
            tl.to(
              st,
              { o: 210, duration: D, ease: "power2.in", onUpdate: () => dOut?.setAttribute("scale", String(st.o)) },
              0
            );
            tl.to(
              st,
              { i: 0, duration: D * 1.15, ease: "power3.out", onUpdate: () => dIn?.setAttribute("scale", String(st.i)) },
              0.22
            );
            tl.fromTo(inEl, { opacity: 0 }, { opacity: 1, duration: D * 0.72, ease: "power2.inOut" }, 0.18);
            tl.fromTo(inInner, { scale: 1.22 }, { scale: 1, duration: D * 1.18, ease: "expo.out" }, 0.08);
            tl.to(outInner, { scale: 1.14, opacity: 0, duration: D * 0.9, ease: "power2.in" }, 0.04);
            pulse(0.16, 0.35, true);
            break;
          }
          case "glitch": { // RGB chromatic split + cyber jitter + hard flash cut
            const gr = document.getElementById("v5-gl-r");
            const gb = document.getElementById("v5-gl-b");
            const g = { d: 0 };
            const apply = () => {
              gr?.setAttribute("dx", String(g.d));
              gb?.setAttribute("dx", String(-g.d));
            };
            const cut = 0.48;
            gsap.set(inEl, { opacity: 0 });
            gsap.set([outInner, inInner], { filter: "url(#v5-glitch)" });
            tl.to(g, { d: 52, duration: cut, ease: "power2.in", onUpdate: apply }, 0);
            tl.to(
              outInner,
              {
                keyframes: [
                  { x: -24, skewX: 6, scaleY: 1.03, duration: 0.07 },
                  { x: 32, skewX: -8, scaleY: 0.97, duration: 0.06 },
                  { x: -18, skewX: 4, scaleY: 1.04, duration: 0.06 },
                  { x: 42, skewX: 10, scaleY: 0.96, duration: 0.05 },
                  { x: 0, skewX: 0, scaleY: 1, duration: 0.05 },
                ],
                ease: "none",
              },
              0.12
            );
            tl.set(outEl, { opacity: 0 }, cut);
            tl.set(inEl, { opacity: 1 }, cut);
            tl.fromTo(
              inInner,
              { x: -38, skewX: -8, scale: 1.06 },
              { x: 0, skewX: 0, scale: 1, duration: 0.55, ease: "expo.out" },
              cut
            );
            tl.to(g, { d: 0, duration: 0.58, ease: "power3.out", onUpdate: apply }, cut);
            pulse(cut, 0.78, true);
            break;
          }
          case "cube": { // 3D architectural vault rotation
            const w = root.clientWidth || window.innerWidth;
            gsap.set([outEl, inEl], {
              transformOrigin: `50% 50% ${-w / 2}px`,
              backfaceVisibility: "hidden",
            });
            tl.fromTo(
              inEl,
              { rotateY: dir * 90 },
              { rotateY: 0, duration: D * 1.12, ease: "power3.inOut" },
              0
            );
            tl.to(
              outEl,
              { rotateY: -dir * 90, duration: D * 1.12, ease: "power3.inOut" },
              0
            );
            tl.fromTo(
              inInner,
              { filter: "brightness(0.28)" },
              { filter: "brightness(1)", duration: D, ease },
              0
            );
            tl.to(outInner, { filter: "brightness(0.22)", duration: D, ease }, 0);
            pulse(D * 0.45, 0.25, false);
            break;
          }
          case "blinds": { // Kinetic horizontal louvres snap open + scale push
            const bands = 8;
            const m = `linear-gradient(${dir > 0 ? 180 : 0}deg, #000 var(--p), transparent calc(var(--p) + 0.6%))`;
            ["mask-image", "-webkit-mask-image"].forEach((n) => inEl.style.setProperty(n, m));
            ["mask-size", "-webkit-mask-size"].forEach((n) => inEl.style.setProperty(n, `100% ${100 / bands}%`));
            ["mask-repeat", "-webkit-mask-repeat"].forEach((n) => inEl.style.setProperty(n, "repeat-y"));
            tl.fromTo(inEl, { "--p": "0%" }, { "--p": "100%", duration: D * 1.08, ease: "power2.inOut" }, 0);
            push({ scale: 1.14, yPercent: dir * 8 });
            pull({ scale: 0.92, opacity: 0.25 });
            pulse(0.15, 0.25, false);
            break;
          }
          case "slide": // Horizontal panel wipe with a vertical light edge
            clip(dir > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)", full);
            push({ xPercent: dir * 16, scale: 1.1 });
            pull({ xPercent: -dir * 20, scale: 0.9 });
            sweepEdge("x");
            break;
          case "iris": // Circular singularity aperture opens from center + shockwave
            clip("circle(0% at 50% 50%)", "circle(150% at 50% 50%)");
            push({ scale: 1.35 });
            pull({ scale: 0.85 });
            pulse(0.02, 0.42, true);
            break;
          case "split": // Twin blast doors breach from center line
            clip("inset(0% 50% 0% 50%)", full);
            push({ scale: 1.2 });
            pull({ scale: 0.92 });
            pulse(0.05, 0.35, true);
            break;
          case "diagonal": { // Katana laser blade slices diagonally across the frame
            const a =
              dir > 0
                ? ["polygon(-5% 0%, -5% 0%, -45% 100%, -45% 100%)", "polygon(-5% 0%, 145% 0%, 105% 100%, -45% 100%)"]
                : ["polygon(105% 0%, 105% 0%, 145% 100%, 145% 100%)", "polygon(-45% 0%, 105% 0%, 145% 100%, -5% 100%)"];
            clip(a[0], a[1]);
            push({ xPercent: dir * 12, yPercent: dir * 7, scale: 1.14 });
            pull({ xPercent: -dir * 14, scale: 0.9 });
            tl.set(warpState, { slash: 0.01 }, 0)
              .to(warpState, { slash: 1, duration: D, ease }, 0)
              .set(warpState, { slash: 0 }, D);
            pulse(0.08, 0.35, false);
            break;
          }
          case "door": // 3D hangar blast door swing
            gsap.set(outEl, {
              transformOrigin: dir > 0 ? "0% 50%" : "100% 50%",
              backfaceVisibility: "hidden",
            });
            tl.to(outEl, { rotateY: dir > 0 ? -102 : 102, duration: D * 1.06, ease: "power3.inOut" }, 0);
            tl.to(outInner, { filter: "brightness(0.32)", duration: D, ease }, 0);
            push({ scale: 0.8, opacity: 0.25 }, { opacity: 1 });
            pulse(0.18, 0.25, false);
            break;
          case "zoom": // Hyper-dolly portal push-through
            tl.fromTo(inEl, { opacity: 0 }, { opacity: 1, duration: D * 0.68, ease: "power2.out" }, D * 0.14);
            push({ scale: 0.58, filter: "blur(16px)" }, { filter: "blur(0px)" });
            pull({ scale: 1.85, opacity: 0, filter: "blur(12px)" });
            pulse(D * 0.18, 0.55, true);
            break;
          default: // Shutter: vertical wipe with a glowing edge
            clip(dir > 0 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)", full);
            push({ yPercent: dir * 16, scale: 1.14 });
            pull({ yPercent: -dir * 20, scale: 0.9 });
            sweepEdge("y");
        }
        reveal = buildReveal(inEl, dir, 0.38);
        scramble = scrambleLabels(inEl, 0.45);
        heroProgress(from, to, 1.1);
      } else {
        // WARP JUMP: the outgoing scene rushes past the camera, the next one emerges
        const cut = 0.58;
        tl.to(warpState, { v: 1, duration: cut, ease: "power3.in" }, 0)
          .to(
            outInner,
            { scale: 2.2, opacity: 0, filter: "blur(16px)", duration: cut, ease: "power3.in" },
            0
          )
          .add(() => inEl.classList.add("is-current"), cut)
          .fromTo(
            inInner,
            { scale: 0.48, opacity: 0, filter: "blur(16px)" },
            { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.95, ease: "power3.out" },
            cut
          )
          .to(warpState, { v: 0, duration: 0.95, ease: "power2.out" }, cut + 0.05)
          .set(warpState, { flash: 0.85, ring: 0.01 }, cut)
          .to(warpState, { flash: 0, duration: 0.78, ease: "power2.out" }, cut)
          .to(warpState, { ring: 1, duration: 1.05, ease: "power2.out" }, cut);
        reveal = buildReveal(inEl, dir, cut + 0.18);
        scramble = scrambleLabels(inEl, cut + 0.25);
        heroProgress(from, to, 1.2);
      }
    };

    goRef.current = go;

    // ---- input: wheel -------------------------------------------------------
    const canScroll = (inner: HTMLElement, dir: number) => {
      const max = inner.scrollHeight - inner.clientHeight;
      if (max <= 2) return false;
      return dir > 0 ? inner.scrollTop < max - 2 : inner.scrollTop > 2;
    };

    const onWheel = (e: WheelEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select")) return;
      e.preventDefault();
      const now = performance.now();
      const gap = now - lastWheel;
      lastWheel = now;
      if (animating) return;
      const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      if (Math.abs(dy) < 3) return;
      const dir = dy > 0 ? 1 : -1;
      const inner = innerOf(scenes[cur]);
      if (canScroll(inner, dir)) {
        inner.scrollTop += dy;
        return;
      }
      // Ignore trackpad inertia tails; require a fresh gesture
      if (gap < 120) return;
      acc += dy;
      if (Math.abs(acc) > 30) {
        acc = 0;
        go(cur + dir);
      }
    };

    // ---- input: touch -------------------------------------------------------
    let touchY = 0;
    let touchStartScrollable: { up: boolean; down: boolean } = { up: false, down: false };
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
      const inner = innerOf(scenes[cur]);
      touchStartScrollable = { up: canScroll(inner, -1), down: canScroll(inner, 1) };
    };
    const onTouchEnd = (e: TouchEvent) => {
      const dy = touchY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < 64) return;
      const dir = dy > 0 ? 1 : -1;
      if ((dir > 0 && touchStartScrollable.down) || (dir < 0 && touchStartScrollable.up)) return;
      go(cur + dir);
    };

    // ---- input: keyboard ----------------------------------------------------
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select")) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const onControl = !!target?.closest("button, a, [role='tab']");
      switch (e.key) {
        case "ArrowDown":
        case "PageDown":
          e.preventDefault();
          go(cur + 1);
          break;
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          go(cur - 1);
          break;
        case " ":
          if (onControl) return;
          e.preventDefault();
          go(cur + (e.shiftKey ? -1 : 1));
          break;
        case "Home":
          e.preventDefault();
          go(0);
          break;
        case "End":
          e.preventDefault();
          go(scenes.length - 1);
          break;
      }
    };

    // ---- input: in-page hash links (header, footer, CTAs) -------------------
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      const match = href.match(/^\/?#([\w-]+)$/);
      if (!match) return;
      const i = idToIndex(match[1]);
      if (i < 0) return;
      e.preventDefault();
      e.stopPropagation();
      go(i);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick, true);
    window.__v5Stage = {
      goToId: (id: string) => {
        const i = idToIndex(id);
        if (i < 0) return false;
        go(i);
        return true;
      },
    };

    return () => {
      window.removeEventListener("wheel", onWheel);
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick, true);
      delete window.__v5Stage;
      master?.kill();
      reveal?.kill();
      stopScramble();
      gsap.killTweensOf(warpState);
      warpState.v = 0;
      warpState.ring = 0;
      warpState.flash = 0;
      warpState.slash = 0;
      document.documentElement.classList.remove("v5-stage-active");
      scenes.forEach((scene) => {
        scene.classList.remove("is-current");
        gsap.set([scene, innerOf(scene)], { clearProps: "all" });
        gsap.set(scene.querySelectorAll(REVEAL_SELECTOR), {
          clearProps: "transform,opacity,clipPath,filter",
        });
      });
      goRef.current = () => {};
    };
  }, [rootRef, warp, defs]);

  return { index, goTo: (to: number) => goRef.current(to) };
}

/**
 * Hyperspace streak + shockwave ring + katana slash + flash overlay,
 * plus hidden SVG displacement & chromatic-glitch filter definitions.
 */
export function WarpCanvas({ warp }: { warp: MutableRefObject<WarpState> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const stars = Array.from({ length: 280 }, () => ({
      a: Math.random() * Math.PI * 2,
      r: Math.random() * 0.9,
      s: 0.4 + Math.random() * 1.3,
    }));
    let w = 0;
    let h = 0;
    let drawn = false;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const frame = () => {
      raf = requestAnimationFrame(frame);
      const { v, ring, flash, slash } = warp.current;
      const active = v > 0.004 || (ring > 0.004 && ring < 0.996) || flash > 0.004 || (slash > 0.004 && slash < 0.996);
      if (!active) {
        if (drawn) {
          ctx.clearRect(0, 0, w, h);
          drawn = false;
        }
        return;
      }
      drawn = true;
      ctx.clearRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.hypot(w, h) / 2;

      // 1. Hyperspace radial streaks
      if (v > 0.004) {
        const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.65);
        glow.addColorStop(0, `rgba(190, 228, 255, ${0.42 * v * v})`);
        glow.addColorStop(0.4, `rgba(70, 150, 235, ${0.2 * v})`);
        glow.addColorStop(1, "rgba(5, 9, 20, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);

        ctx.lineCap = "round";
        for (const star of stars) {
          star.r += 0.004 + v * 0.075 * star.s;
          if (star.r > 1.05) star.r = Math.random() * 0.06;
          const tail = Math.max(0, star.r - v * star.s * 0.3 * star.r);
          const cos = Math.cos(star.a);
          const sin = Math.sin(star.a);
          ctx.strokeStyle = `rgba(165, 218, 255, ${Math.min(1, 0.2 + 0.8 * v) * Math.min(1, star.r * 2)})`;
          ctx.lineWidth = 0.6 + star.s * 1.1 * v;
          ctx.beginPath();
          ctx.moveTo(cx + cos * tail * maxR, cy + sin * tail * maxR);
          ctx.lineTo(cx + cos * star.r * maxR, cy + sin * star.r * maxR);
          ctx.stroke();
        }
      }

      // 2. Expanding shockwave ring
      if (ring > 0.004 && ring < 0.996) {
        const rad = ring * maxR * 1.12;
        const alpha = (1 - ring) * (1 - ring);
        ctx.save();
        ctx.strokeStyle = `rgba(165, 225, 255, ${alpha * 0.85})`;
        ctx.lineWidth = 2 + (1 - ring) * 14;
        ctx.shadowColor = "rgba(79, 168, 255, 0.95)";
        ctx.shadowBlur = 28;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.stroke();

        if (rad > 28) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(cx, cy, rad * 0.86, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 3. Diagonal katana laser slash
      if (slash > 0.004 && slash < 0.996) {
        const sx = (-0.25 + slash * 1.5) * w;
        const alpha = Math.sin(slash * Math.PI);
        ctx.save();
        ctx.strokeStyle = `rgba(225, 245, 255, ${alpha * 0.95})`;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = "rgba(79, 168, 255, 1)";
        ctx.shadowBlur = 32;
        ctx.beginPath();
        ctx.moveTo(sx + w * 0.2, -20);
        ctx.lineTo(sx - w * 0.2, h + 20);
        ctx.stroke();
        ctx.restore();
      }

      // 4. Luminous impact flash
      if (flash > 0.004) {
        const fg = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
        fg.addColorStop(0, `rgba(235, 247, 255, ${flash * 0.78})`);
        fg.addColorStop(0.55, `rgba(110, 190, 255, ${flash * 0.36})`);
        fg.addColorStop(1, `rgba(12, 30, 58, ${flash * 0.14})`);
        ctx.fillStyle = fg;
        ctx.fillRect(0, 0, w, h);
      }
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [warp]);

  return (
    <>
      <canvas ref={canvasRef} className="v5-warp" aria-hidden="true" />
      <svg className="v5-fx-defs" width="0" height="0" aria-hidden="true">
        <defs>
          <filter id="v5-liquid-out" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.014 0.03" numOctaves="2" seed="3" result="noise" />
            <feDisplacementMap id="v5-liq-out" in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="v5-liquid-in" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.014 0.03" numOctaves="2" seed="9" result="noise" />
            <feDisplacementMap id="v5-liq-in" in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id="v5-glitch" x="-15%" y="-15%" width="130%" height="130%">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="r"
            />
            <feOffset id="v5-gl-r" in="r" dx="0" dy="0" result="ro" />
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="gb"
            />
            <feOffset id="v5-gl-b" in="gb" dx="0" dy="0" result="gbo" />
            <feBlend in="ro" in2="gbo" mode="screen" />
          </filter>
        </defs>
      </svg>
    </>
  );
}

export function StageRail({
  defs,
  index,
  onSelect,
}: {
  defs: SceneDef[];
  index: number;
  onSelect: (i: number) => void;
}) {
  const last = Math.max(defs.length - 1, 1);
  return (
    <>
      <div className="v5-stage-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${index / last})` }} />
      </div>
      <nav className="v5-rail" aria-label="Scene navigation">
        <p className="v5-rail-count" aria-live="polite">
          <RollingNumber value={pad(index + 1)} />
          <i>/</i>
          <span>{pad(defs.length)}</span>
        </p>
        <ul>
          {defs.map((def, i) => (
            <li key={def.id}>
              <button
                type="button"
                className={i === index ? "is-active" : ""}
                aria-label={`Go to ${def.label}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => onSelect(i)}
              >
                <span className="v5-rail-label">{def.label}</span>
                <span className="v5-rail-tick" />
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
