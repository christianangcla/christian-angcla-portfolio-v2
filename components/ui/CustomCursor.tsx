"use client";

import { useEffect, useRef } from "react";
import "./polish.css";

/**
 * Cursor reticle: a precise dot plus a sci-fi corner-bracket reticle that sit exactly on the pointer
 * (written synchronously in the pointermove handler, so there is zero follow lag). Over interactive
 * elements the reticle turns 90° and the dot swells; on pointer-down it sinks immediately. Position
 * uses `transform`; size/turn feedback uses the `scale`/`rotate` properties with a short ease-out.
 * Fine-pointer, motion-OK devices only. No haptics, no user-select.
 */
const INTERACTIVE = "a[href], button, [role='button'], summary, label, input, select, textarea";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let hover = false;
    let down = false;

    const applyScale = () => {
      ring.style.scale = down ? "0.7" : hover ? "1.25" : "1";
      ring.style.rotate = hover ? "90deg" : "0deg";
      dot.style.scale = hover ? "1.6" : "1";
      ring.classList.toggle("is-hover", hover);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      // Position via the `translate` property (applied before rotate/scale), so scale and
      // rotate pivot around the pointer instead of scaling the pointer offset
      const t = `${e.clientX}px ${e.clientY}px`;
      dot.style.translate = t;
      ring.style.translate = t;
      dot.style.opacity = ring.style.opacity = "1";
      const isHover = !!(e.target as HTMLElement | null)?.closest?.(INTERACTIVE);
      if (isHover !== hover) {
        hover = isHover;
        applyScale();
      }
    };
    const onDown = () => {
      down = true;
      applyScale();
    };
    const onUp = () => {
      down = false;
      applyScale();
    };
    const onLeave = () => {
      dot.style.opacity = ring.style.opacity = "0";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        <svg viewBox="0 0 40 40" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M4 13V6a2 2 0 0 1 2-2h7M27 4h7a2 2 0 0 1 2 2v7M36 27v7a2 2 0 0 1-2 2h-7M13 36H6a2 2 0 0 1-2-2v-7" />
        </svg>
      </div>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
