"use client";

import { useEffect, useState, type CSSProperties, type RefObject } from "react";
import { createPortal } from "react-dom";
import "./ambient.css";

/**
 * Living-space scenery behind every stage scene (except the hero, which has its own 3D).
 * - Layers: drifting aurora, two parallax star tiles, perspective grid horizon.
 * - Assets: ringed planet, satellite, orbit ring, glass crystal, comets. They pop in when a
 *   scene becomes current, float forever, shift with the pointer, and roll with wheel / scene changes.
 * Everything animates transform + opacity only and uses plain CSS (no extra WebGL context).
 * The stage engine, navigation, and 3D scene are untouched; scenery is portalled into each scene.
 */

function Scenery({ uid, variant }: { uid: string; variant: number }) {
  return (
    <div className={`amb amb--v${variant}`} aria-hidden="true">
      <div className="amb-aurora amb-aurora--a" />
      <div className="amb-aurora amb-aurora--b" />
      <div className="amb-aurora amb-aurora--c" />
      <div className="amb-stars amb-stars--far" />
      <div className="amb-stars amb-stars--near" />
      <div className="amb-grid" />

      <div className="amb-asset amb-planet" style={{ "--i": 0, "--d": 26 } as CSSProperties}>
        <div className="amb-par">
          <div className="amb-float amb-float--slow">
            <div className="amb-roll">
              <svg viewBox="0 0 240 240" width="100%" height="100%">
                <defs>
                  <radialGradient id={`${uid}-pl`} cx="35%" cy="30%" r="75%">
                    <stop offset="0" stopColor="#9bd7ff" />
                    <stop offset="0.45" stopColor="#3b86d1" />
                    <stop offset="1" stopColor="#0a1d3a" />
                  </radialGradient>
                  <linearGradient id={`${uid}-rg`} x1="0" x2="1">
                    <stop offset="0" stopColor="#9bd7ff" stopOpacity="0" />
                    <stop offset="0.5" stopColor="#bfe4ff" stopOpacity="0.9" />
                    <stop offset="1" stopColor="#4fa8ff" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <ellipse cx="120" cy="120" rx="112" ry="26" fill="none" stroke={`url(#${uid}-rg)`} strokeWidth="5" transform="rotate(-18 120 120)" opacity="0.55" />
                <circle cx="120" cy="120" r="66" fill={`url(#${uid}-pl)`} />
                <path d="M62 110c30 10 78 12 116-6M58 134c36 12 84 12 124-8" stroke="#d6eeff" strokeOpacity="0.18" strokeWidth="5" fill="none" strokeLinecap="round" />
                <path d="M30 150c40 34 150 32 190-22" fill="none" stroke={`url(#${uid}-rg)`} strokeWidth="5" opacity="0.9" transform="rotate(-18 120 120)" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="amb-asset amb-satellite" style={{ "--i": 1, "--d": 44 } as CSSProperties}>
        <div className="amb-par">
          <div className="amb-float amb-float--drift">
            <div className="amb-roll amb-roll--half">
              <svg viewBox="0 0 220 120" width="100%" height="100%">
                <rect x="6" y="40" width="70" height="40" rx="3" fill="#0f2f55" stroke="#4fa8ff" strokeOpacity="0.7" />
                <rect x="144" y="40" width="70" height="40" rx="3" fill="#0f2f55" stroke="#4fa8ff" strokeOpacity="0.7" />
                <path d="M26 40v40M46 40v40M164 40v40M184 40v40M6 60h70M144 60h70" stroke="#4fa8ff" strokeOpacity="0.35" />
                <rect x="76" y="50" width="12" height="20" fill="#1c4a7d" />
                <rect x="132" y="50" width="12" height="20" fill="#1c4a7d" />
                <rect x="88" y="34" width="44" height="52" rx="8" fill="#1a3a60" stroke="#9bd7ff" strokeOpacity="0.8" />
                <circle cx="110" cy="60" r="11" fill="#0a1d34" stroke="#9bd7ff" />
                <circle cx="110" cy="60" r="4" fill="#6ac5ff" />
                <path d="M110 34V16" stroke="#9bd7ff" strokeWidth="2" />
                <circle cx="110" cy="13" r="4" fill="#bfe4ff" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="amb-asset amb-orbit" style={{ "--i": 2, "--d": 18 } as CSSProperties}>
        <div className="amb-par">
          <div className="amb-float amb-float--spin">
            <svg viewBox="0 0 200 200" width="100%" height="100%">
              <ellipse cx="100" cy="100" rx="92" ry="34" fill="none" stroke="#6ac5ff" strokeOpacity="0.4" strokeDasharray="3 7" />
              <ellipse cx="100" cy="100" rx="64" ry="92" fill="none" stroke="#4fa8ff" strokeOpacity="0.22" transform="rotate(35 100 100)" />
              <circle cx="192" cy="100" r="6" fill="#bfe4ff" />
              <circle cx="100" cy="100" r="9" fill="#4fa8ff" fillOpacity="0.55" />
            </svg>
          </div>
        </div>
      </div>

      <div className="amb-asset amb-crystal" style={{ "--i": 3, "--d": 60 } as CSSProperties}>
        <div className="amb-par">
          <div className="amb-float amb-float--tumble">
            <div className="amb-roll amb-roll--rev">
              <svg viewBox="0 0 100 130" width="100%" height="100%">
                <defs>
                  <linearGradient id={`${uid}-cr`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="#d6eeff" stopOpacity="0.85" />
                    <stop offset="1" stopColor="#2d78c8" stopOpacity="0.25" />
                  </linearGradient>
                </defs>
                <path d="M50 4 92 44 76 118 24 118 8 44Z" fill={`url(#${uid}-cr)`} stroke="#bfe4ff" strokeOpacity="0.75" />
                <path d="M50 4 32 44 24 118M50 4l18 40 8 74M8 44h84M32 44l18 74 18-74" fill="none" stroke="#bfe4ff" strokeOpacity="0.35" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="amb-comet amb-comet--1">
        <i />
      </div>
      <div className="amb-comet amb-comet--2">
        <i />
      </div>
    </div>
  );
}

export function AmbientScenery({ rootRef }: { rootRef: RefObject<HTMLElement | null> }) {
  const [scenes, setScenes] = useState<HTMLElement[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const list = Array.from(root.querySelectorAll<HTMLElement>(":scope > .v5-scene")).slice(1);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setScenes(list);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    // Performance: lighter backdrop on low-end devices, pause while the tab is hidden
    const nav = navigator as Navigator & { deviceMemory?: number };
    const lite = (navigator.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
    const html = document.documentElement;
    if (lite) html.classList.add("amb-lite");
    const onVisibility = () => html.classList.toggle("amb-hidden", document.hidden);
    document.addEventListener("visibilitychange", onVisibility);

    // Pointer parallax + wheel/scene-change roll, written as CSS variables on the stage root.
    let px = 0;
    let py = 0;
    let tx = 0;
    let ty = 0;
    let roll = 0;
    let rollTarget = 0;
    let raf = 0;

    const tick = () => {
      px += (tx - px) * 0.07;
      py += (ty - py) * 0.07;
      roll += (rollTarget - roll) * 0.07;
      root.style.setProperty("--amb-px", px.toFixed(3));
      root.style.setProperty("--amb-py", py.toFixed(3));
      root.style.setProperty("--amb-roll", roll.toFixed(2));
      const settled =
        Math.abs(tx - px) < 0.002 && Math.abs(ty - py) < 0.002 && Math.abs(rollTarget - roll) < 0.05;
      raf = settled ? 0 : requestAnimationFrame(tick);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onPointer = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
      kick();
    };
    const onWheel = (e: WheelEvent) => {
      rollTarget += Math.max(-60, Math.min(60, e.deltaY * 0.2));
      kick();
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });

    // Every scene change gives the assets a quarter-turn roll
    const observer = new MutationObserver((records) => {
      for (const r of records) {
        const el = r.target as HTMLElement;
        if (el.classList.contains("is-current") && !(r.oldValue ?? "").includes("is-current")) {
          rollTarget += 90;
          kick();
          break;
        }
      }
    });
    observer.observe(root, {
      subtree: true,
      attributes: true,
      attributeFilter: ["class"],
      attributeOldValue: true,
    });

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      html.classList.remove("amb-lite", "amb-hidden");
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("wheel", onWheel);
    };
  }, [rootRef]);

  return (
    <>
      {scenes.map((scene, i) => createPortal(<Scenery uid={`amb${i}`} variant={i % 4} />, scene, `amb-${i}`))}
    </>
  );
}
