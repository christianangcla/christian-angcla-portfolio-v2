"use client";

import { useEffect, type RefObject } from "react";

/**
 * Pointer-driven 3D tilt + moving glare for cards inside the cinematic stage.
 * Uses an inline perspective transform (skipped while a GSAP reveal owns the transform) and a glare
 * layer moved with `transform`/`opacity` only. Mouse + motion-OK only; the loop sleeps when settled.
 */
const CARD_SELECTOR =
  ".v5-archive-card, .v5-cred-card, .v5-lab-card, .v5-future-card, .v5-project-visual, .v5-skill-content";
const MAX_TILT = 9; // degrees
const BIG_PANEL = ".v5-skill-content"; // large panels tilt gently so text stays calm
const BIG_TILT = 3;
const GLARE = 360; // px, matches .tilt-glare i

export function CardTilt({ rootRef }: { rootRef: RefObject<HTMLElement | null> }) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    interface State {
      el: HTMLElement;
      glare: HTMLElement;
      glareDot: HTMLElement;
      rx: number;
      ry: number;
      trx: number;
      try_: number;
      gx: number;
      gy: number;
      active: boolean;
      owns: boolean;
    }
    const states = new Map<HTMLElement, State>();
    let raf = 0;

    const ensure = (el: HTMLElement): State => {
      let s = states.get(el);
      if (s) return s;
      if (getComputedStyle(el).position === "static") el.style.position = "relative";
      const glare = document.createElement("span");
      glare.className = "tilt-glare";
      glare.setAttribute("aria-hidden", "true");
      const dot = document.createElement("i");
      glare.appendChild(dot);
      el.appendChild(glare);
      s = { el, glare, glareDot: dot, rx: 0, ry: 0, trx: 0, try_: 0, gx: 0, gy: 0, active: false, owns: false };
      states.set(el, s);
      return s;
    };

    const tick = () => {
      let busy = false;
      states.forEach((s, el) => {
        s.rx += (s.trx - s.rx) * 0.22;
        s.ry += (s.try_ - s.ry) * 0.22;
        const mag = Math.hypot(s.rx, s.ry);
        if (!s.active && mag < 0.02) {
          if (s.owns) el.style.removeProperty("transform");
          el.classList.remove("tilt-active");
          s.owns = false;
          s.glare.style.opacity = "0";
          return;
        }
        busy = true;
        // A reveal animation (GSAP) may own the transform; never fight it
        if (!s.owns && el.style.transform && el.style.transform !== "none") return;
        s.owns = true;
        el.classList.add("tilt-active");
        const lift = Math.min(1, mag / MAX_TILT) * -6;
        el.style.transform = `perspective(900px) translate3d(0, ${lift.toFixed(2)}px, 0) rotateX(${(-s.rx).toFixed(3)}deg) rotateY(${s.ry.toFixed(3)}deg)`;
        s.glareDot.style.transform = `translate3d(${(s.gx - GLARE / 2).toFixed(1)}px, ${(s.gy - GLARE / 2).toFixed(1)}px, 0)`;
        s.glare.style.opacity = s.active ? "1" : "0";
      });
      raf = busy ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    let current: State | null = null;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const el = (e.target as HTMLElement | null)?.closest?.<HTMLElement>(CARD_SELECTOR) ?? null;
      if (current && current.el !== el) {
        current.active = false;
        current.trx = 0;
        current.try_ = 0;
        current = null;
      }
      if (el) {
        const s = ensure(el);
        const r = el.getBoundingClientRect();
        const nx = ((e.clientX - r.left) / r.width - 0.5) * 2; // -1..1
        const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
        const max = el.matches(BIG_PANEL) ? BIG_TILT : MAX_TILT;
        s.trx = ny * max;
        s.try_ = nx * max;
        s.gx = e.clientX - r.left;
        s.gy = e.clientY - r.top;
        s.active = true;
        current = s;
      }
      kick();
    };
    const onLeave = () => {
      if (current) {
        current.active = false;
        current.trx = 0;
        current.try_ = 0;
        current = null;
        kick();
      }
    };
    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
      states.forEach((s) => {
        s.el.style.removeProperty("rotate");
        if (s.owns) s.el.style.removeProperty("transform");
        s.glare.remove();
      });
      states.clear();
    };
  }, [rootRef]);

  return null;
}
