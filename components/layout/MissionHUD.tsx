"use client";

import React, { useEffect, useState } from "react";
import { scrollToChapter } from "@/components/scroll/SmoothScroll";

interface ChapterNav {
  id: string;
  code: string;
  label: string;
}

const CHAPTERS: ChapterNav[] = [
  { id: "hero", code: "00", label: "ORIGIN" },
  { id: "disciplines", code: "01", label: "DISCIPLINARY CORE" },
  { id: "systems", code: "02", label: "ORBITAL SYSTEMS" },
  { id: "sandbox", code: "03", label: "SIMULATION MATRIX" },
  { id: "transmission", code: "04", label: "BEACON TERMINAL" },
];

export function MissionHUD() {
  const [activeChapter, setActiveChapter] = useState("hero");
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.__lenis ? window.__lenis.scroll : window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;
      setScrollPercent(Math.round(progress * 100));

      // Determine active chapter based on section positions
      for (let i = CHAPTERS.length - 1; i >= 0; i--) {
        const el = document.getElementById(CHAPTERS[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45) {
            setActiveChapter(CHAPTERS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <aside
      aria-label="Mission Flight Telemetry"
      className="pointer-events-none fixed inset-0 z-40 select-none"
    >
      {/* Top Left: Mission Coordinate Readout */}
      <div className="absolute top-20 left-4 sm:left-8 flex items-center gap-2 text-[10px] font-mono text-text-subtle tracking-wider opacity-70 hover:opacity-100 transition-opacity">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--status-green,#10b981)] animate-ping" />
        <span className="hidden sm:inline">COORD // 14.5995° N, 120.9842° E</span>
        <span className="sm:hidden">SYS // ONLINE</span>
      </div>

      {/* Right Edge: Chapter Flight Instrument */}
      <nav
        aria-label="Chapter Waypoints"
        className="pointer-events-auto absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3.5 z-40"
      >
        {CHAPTERS.map((chapter) => {
          const isActive = activeChapter === chapter.id;
          return (
            <button
              key={chapter.id}
              type="button"
              onClick={() => scrollToChapter(chapter.id)}
              className="group flex items-center justify-end gap-3 py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
              aria-label={`Jump to Chapter ${chapter.code}: ${chapter.label}`}
              aria-current={isActive ? "true" : undefined}
            >
              <span
                className={`hidden md:block font-mono text-[10px] uppercase tracking-widest transition-all duration-300 ${
                  isActive
                    ? "text-primary font-bold translate-x-0 opacity-100"
                    : "text-text-subtle translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-75"
                }`}
              >
                {chapter.label}
              </span>
              <span
                className={`font-mono text-xs transition-colors duration-200 ${
                  isActive
                    ? "text-primary font-bold"
                    : "text-text-subtle group-hover:text-foreground"
                }`}
              >
                {chapter.code}
              </span>
              <span
                className={`h-4 transition-all duration-300 rounded-full ${
                  isActive
                    ? "w-1 bg-primary shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                    : "w-0.5 bg-border-strong group-hover:bg-primary/50"
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* Bottom Bar: Minimal Mission Progress Line */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-border-subtle/30">
        <div
          className="h-full bg-gradient-to-r from-primary via-soft-ultraviolet to-sky-400 transition-all duration-100 ease-out"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>
    </aside>
  );
}
