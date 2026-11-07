"use client";

import { useCallback, useEffect, useState } from "react";
import "./boot-intro.css";

/**
 * Short boot sequence shown once per browser session, fading into the hero.
 * Click, Enter, Space or Escape skips it. With reduced motion it is a brief plain fade.
 * Animates transform + opacity only.
 */
const STORAGE_KEY = "lab-boot-intro-seen";
const LINES = [
  "INITIALIZING ODYSSEY-01",
  "CALIBRATING NAVIGATION ARRAY",
  "SYNCING STAR CHARTS",
  "ALL SYSTEMS NOMINAL",
];
const BOOT_MS = 3000;
const REDUCED_MS = 500;
const FADE_MS = 650;

export function BootIntro() {
  const [phase, setPhase] = useState<"boot" | "out" | "done">("boot");
  const [pct, setPct] = useState(0);

  const finish = useCallback(() => {
    setPhase((p) => (p === "boot" ? "out" : p));
  }, []);

  // Decide whether to play, then drive the progress counter
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* storage unavailable: just play */
    }
    if (seen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("done");
      return;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? REDUCED_MS : BOOT_MS;
    // The clock only counts painted frames (each capped at 40ms) and only starts once the page
    // has loaded, so main-thread jank during hydration / WebGL setup can't make the intro skip by.
    let elapsed = 0;
    let last = 0;
    let raf = 0;
    let cancelled = false;
    const tick = (now: number) => {
      if (cancelled) return;
      if (!last) last = now;
      elapsed += Math.min(now - last, 40);
      last = now;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 1.6);
      setPct(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    const begin = () => {
      if (cancelled || raf) return;
      raf = requestAnimationFrame(tick);
    };
    const ready = () => {
      const fonts = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts;
      (fonts ? fonts.ready : Promise.resolve()).then(begin, begin);
    };
    if (document.readyState === "complete") ready();
    else window.addEventListener("load", ready, { once: true });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") finish();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("load", ready);
      window.removeEventListener("keydown", onKey);
    };
  }, [finish]);

  // After the fade-out, remember and unmount
  useEffect(() => {
    if (phase !== "out") return;
    const id = window.setTimeout(() => {
      try {
        sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
      setPhase("done");
    }, FADE_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  if (phase === "done") return null;

  return (
    <div
      className={`boot ${phase === "out" ? "is-out" : ""}`}
      role="status"
      aria-label="Loading portfolio"
      onPointerDown={finish}
    >
      <div className="boot-aurora" aria-hidden="true" />
      <div className="boot-panel" aria-hidden="true">
        <div className="boot-ring">
          <svg viewBox="0 0 80 80" width="100%" height="100%" fill="none" strokeLinecap="round">
            <circle cx="40" cy="40" r="34" stroke="rgba(155,215,255,0.18)" strokeWidth="2" />
            <path d="M40 6a34 34 0 0 1 34 34" stroke="#9bd7ff" strokeWidth="2.5" />
            <circle cx="40" cy="40" r="4" fill="#bfe4ff" />
          </svg>
        </div>
        <ul className="boot-lines">
          {LINES.map((line, i) => (
            <li key={line} className={pct >= i * 24 + 4 ? "is-on" : ""}>
              <span className="boot-tick">›</span> {line}
            </li>
          ))}
        </ul>
        <div className="boot-bar">
          <span className="boot-bar-fill" style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
        <div className="boot-pct">{String(pct).padStart(3, "0")}%</div>
        <div className="boot-skip">CLICK OR PRESS ENTER TO SKIP</div>
      </div>
    </div>
  );
}
