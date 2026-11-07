"use client";

import React, { useEffect, useSyncExternalStore, useCallback, useState } from "react";
import {
  DESTINATIONS,
  DESTINATION_LIST,
  getNavigationSnapshot,
  getNavigationServerSnapshot,
  subscribeNavigation,
  travelTo,
  toggleDossier,
  navigateNext,
  navigatePrev,
  exitExpedition,
} from "@/lib/universeNavigation";

export function GalaxyNav() {
  const nav = useSyncExternalStore(
    subscribeNavigation,
    getNavigationSnapshot,
    getNavigationServerSnapshot
  );

  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const activeConfig = DESTINATIONS[nav.targetDestination] || DESTINATIONS.origin;
  const isTraveling = nav.flightStatus === "traveling";
  const isAtOrigin = nav.targetDestination === "origin";

  // Keyboard navigation shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key >= "1" && e.key <= "8") {
        const index = parseInt(e.key, 10) - 1;
        if (index < DESTINATION_LIST.length) {
          e.preventDefault();
          travelTo(DESTINATION_LIST[index]);
        }
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        navigateNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigatePrev();
      } else if (e.key === "Escape") {
        e.preventDefault();
        if (nav.dossierOpen) {
          toggleDossier();
        }
      } else if (e.key === " " && !e.repeat) {
        // Space toggles dossier when not scrolling
        if (nav.targetDestination !== "origin") {
          e.preventDefault();
          toggleDossier();
        }
      }
    },
    [nav.dossierOpen, nav.targetDestination]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Optional wheel navigation (gentle debounced step)
  useEffect(() => {
    let lastWheelTime = 0;
    const handleWheel = (e: WheelEvent) => {
      // Only process significant vertical scroll
      if (Math.abs(e.deltaY) < 45) return;

      const now = performance.now();
      if (now - lastWheelTime < 600) return; // Debounce 600ms
      lastWheelTime = now;

      if (e.deltaY > 0) {
        navigateNext();
      } else {
        navigatePrev();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, []);

  // Only render the cockpit navigation console when in expedition mode
  if (nav.experienceMode !== "expedition") {
    return null;
  }

  return (
    <aside
      aria-label="Universe Flight Navigation & Cockpit Console"
      className="pointer-events-none fixed inset-0 z-40 select-none flex flex-col justify-between p-3 sm:p-6"
    >
      {/* Top Cockpit Telemetry Bar */}
      <header className="flex items-center justify-between gap-4 pointer-events-auto">
        {/* Left: Vessel Identity & Telemetry */}
        <div className="flex items-center gap-3 rounded-xl border border-border-strong/80 bg-surface/80 px-3.5 py-2 backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isTraveling
                  ? "bg-amber-400 animate-ping shadow-[0_0_10px_#f59e0b]"
                  : "bg-emerald-400 shadow-[0_0_8px_#10b981]"
              }`}
            />
            <span className="font-mono text-xs font-bold text-foreground">
              ODYSSEY-01 // RECON
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-text-subtle border-l border-border-subtle pl-3">
            <span>TARGET:</span>
            <span className="text-primary font-semibold">{activeConfig.label}</span>
            <span className="text-text-subtle">{"//"} {activeConfig.coordinates}</span>
          </div>

          {/* Flight Warp Status Indicator */}
          <div className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-border-subtle bg-surface-raised">
            {isTraveling ? (
              <span className="text-amber-400 font-bold">HYPERSPACE IN TRANSIT...</span>
            ) : (
              <span className="text-emerald-400 font-semibold">ORBIT STABILIZED</span>
            )}
          </div>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2">
          {/* Exit Expedition back to Portfolio */}
          <button
            type="button"
            onClick={exitExpedition}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-border-strong bg-surface/90 px-3.5 py-2 font-mono text-xs font-semibold text-text-muted hover:text-foreground hover:border-primary transition-colors backdrop-blur-md shadow-md"
            title="Return to Professional Portfolio"
          >
            <span>✕ Return to portfolio</span>
          </button>

          {/* Return to Base / Origin Button */}
          {!isAtOrigin && (
            <button
              type="button"
              onClick={() => travelTo("origin")}
              className="group inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-primary/50 bg-primary/10 px-3.5 py-2 font-mono text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-black hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] backdrop-blur-md shadow-md"
              title="Return to Launch Bay (Key: 1)"
            >
              <span>‹ Return to base</span>
            </button>
          )}

          {/* Toggle Dossier Visibility Button */}
          {activeConfig.type === "planet" && (
            <button
              type="button"
              onClick={toggleDossier}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-3.5 py-2 font-mono text-xs font-semibold backdrop-blur-md shadow-md transition-colors ${
                nav.dossierOpen
                  ? "border-border-strong bg-surface/85 text-text-muted hover:text-foreground hover:border-primary"
                  : "border-primary bg-primary text-black font-bold shadow-[0_0_20px_rgba(168,85,247,0.5)] animate-pulse"
              }`}
              title="Toggle Dossier Inspection (Space / Esc)"
            >
              <span>{nav.dossierOpen ? "Hide dossier [Esc]" : "Inspect dossier [Space]"}</span>
            </button>
          )}

          {/* Mobile Map Expand Toggle */}
          <button
            type="button"
            onClick={() => setIsMapExpanded(!isMapExpanded)}
            className="md:hidden inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-border-strong bg-surface/85 px-3 py-2 font-mono text-xs text-foreground backdrop-blur-md"
            aria-label="Toggle navigation console"
          >
            <span>Toggle map</span>
            <span className="text-primary font-bold">{isMapExpanded ? "▲" : "▼"}</span>
          </button>
        </div>
      </header>

      {/* Center Right: Quick Waypoint Orbit Ladder */}
      <nav
        aria-label="Galactic Destination Ladder"
        className="hidden lg:flex pointer-events-auto absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 flex-col gap-2 rounded-2xl border border-border-strong/70 bg-surface/70 p-3 backdrop-blur-xl shadow-2xl"
      >
        <div className="text-[10px] font-mono uppercase tracking-widest text-text-subtle px-2 pb-1 border-b border-border-subtle/50 mb-1">
          GALAXY DESTINATIONS
        </div>
        {DESTINATION_LIST.map((id, index) => {
          const config = DESTINATIONS[id];
          const isSelected = nav.targetDestination === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => travelTo(id)}
              className={`group flex items-center justify-between gap-3 px-3 py-1.5 rounded-lg text-left font-mono text-xs transition-all ${
                isSelected
                  ? "bg-primary/20 border border-primary/60 text-foreground font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  : "text-text-muted hover:text-foreground hover:bg-surface-raised/70 border border-transparent"
              }`}
              aria-label={`Warp to ${config.label}`}
              aria-current={isSelected ? "location" : undefined}
            >
              <div className="flex items-center gap-2">
                <span className={isSelected ? "text-primary" : "text-text-subtle font-normal"}>
                  0{index + 1}
                </span>
                <span className="tracking-wide text-[11px]">{config.label}</span>
              </div>
              <span
                className={`h-1.5 w-1.5 rounded-full transition-transform ${
                  isSelected ? "bg-primary scale-125 shadow-[0_0_8px_#a855f7]" : "bg-text-subtle/40"
                }`}
              />
            </button>
          );
        })}
      </nav>

      {/* Bottom Cockpit Console & Destination Dock */}
      <footer
        className={`pointer-events-auto transition-all duration-300 ${
          isMapExpanded ? "block" : "hidden md:block"
        }`}
      >
        <div className="mx-auto max-w-5xl rounded-2xl border border-border-strong/80 bg-surface/90 p-3 backdrop-blur-2xl shadow-2xl">
          {/* Navigation Sector Ribbon */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-2.5 border-b border-border-subtle/60 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold">[ GALAXY NAVIGATION MAP ]</span>
              <span className="text-text-subtle hidden sm:inline">
                SELECT SECTOR TO ENGAGE WARP DRIVE
              </span>
            </div>

            {/* Quick Prev / Next Buttons */}
            <div className="flex items-center gap-2 text-[11px]">
              <button
                type="button"
                onClick={navigatePrev}
                className="inline-flex min-h-[44px] items-center px-3 py-1.5 rounded border border-border-strong bg-surface-raised/60 hover:border-primary/60 hover:text-foreground text-text-muted transition-colors"
                title="Previous Destination (Left Arrow)"
              >
                ‹ View prev sector
              </button>
              <span className="text-text-subtle">KEYBOARD 1–8</span>
              <button
                type="button"
                onClick={navigateNext}
                className="inline-flex min-h-[44px] items-center px-3 py-1.5 rounded border border-border-strong bg-surface-raised/60 hover:border-primary/60 hover:text-foreground text-text-muted transition-colors"
                title="Next Destination (Right Arrow)"
              >
                View next sector ›
              </button>
            </div>
          </div>

          {/* Destination Selector Grid */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2.5"
            role="tablist"
            aria-label="Universe Navigation Sectors"
          >
            {DESTINATION_LIST.map((id, idx) => {
              const config = DESTINATIONS[id];
              const isSelected = nav.targetDestination === id;

              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  onClick={() => travelTo(id)}
                  className={`group flex flex-col p-2.5 rounded-xl border text-left font-mono transition-all duration-200 ${
                    isSelected
                      ? "border-primary bg-primary/20 shadow-[0_0_16px_rgba(168,85,247,0.35)] ring-1 ring-primary/40"
                      : "border-border-subtle/60 bg-surface/60 hover:bg-surface-raised hover:border-border-strong"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] w-full text-text-subtle mb-1">
                    <span className={isSelected ? "text-primary font-bold" : ""}>
                      0{idx + 1}
                    </span>
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isSelected ? "bg-primary animate-pulse" : "bg-text-subtle/30"
                      }`}
                    />
                  </div>
                  <div
                    className={`text-xs font-bold truncate ${
                      isSelected ? "text-foreground" : "text-text-muted group-hover:text-foreground"
                    }`}
                  >
                    {config.label}
                  </div>
                  <div className="text-[9px] text-text-subtle truncate uppercase tracking-tight mt-0.5">
                    {config.category}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </footer>
    </aside>
  );
}
