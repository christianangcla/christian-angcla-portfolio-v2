"use client";

import React, { useSyncExternalStore, useCallback } from "react";
import Image from "next/image";
import { FEATURED_PROJECTS, Project } from "@/lib/projects";
import { ScrollReveal } from "@/components/visual/ScrollReveal";
import {
  setActiveProject,
  subscribeActiveProject,
  getActiveProjectSnapshot,
  getActiveProjectServerSnapshot,
  ProjectSlug,
} from "@/components/visual/CosmicWorld";

interface WorldMeta {
  code: string;
  worldType: string;
  coordinates: string;
  accentText: string;
  accentBorder: string;
  accentBg: string;
  glowColor: string;
  pulseClass: string;
}

const WORLD_METAS: Record<ProjectSlug, WorldMeta> = {
  floodguard: {
    code: "PLANET_01",
    worldType: "HYDROLOGICAL RADAR WORLD",
    coordinates: "14.6507° N, 121.0964° E // MARIKINA",
    accentText: "text-sky-400",
    accentBorder: "border-sky-500/60",
    accentBg: "bg-sky-500/10",
    glowColor: "rgba(56, 189, 248, 0.25)",
    pulseClass: "bg-sky-400 shadow-[0_0_12px_#38bdf8]",
  },
  quickita: {
    code: "PLANET_02",
    worldType: "CONNECTED NODE NETWORK",
    coordinates: "CLUSTER_MERN // HYPERLOCAL_MESH",
    accentText: "text-emerald-400",
    accentBorder: "border-emerald-500/60",
    accentBg: "bg-emerald-500/10",
    glowColor: "rgba(52, 211, 153, 0.25)",
    pulseClass: "bg-emerald-400 shadow-[0_0_12px_#34d399]",
  },
  intertwine: {
    code: "PLANET_03",
    worldType: "REACTIVE MOBILE RESONANCE",
    coordinates: "FREQ_868_MHZ // DART_REACTIVE",
    accentText: "text-purple-400",
    accentBorder: "border-purple-500/60",
    accentBg: "bg-purple-500/10",
    glowColor: "rgba(168, 85, 247, 0.25)",
    pulseClass: "bg-purple-400 shadow-[0_0_12px_#a855f7]",
  },
  "how-to-train-your-birdie": {
    code: "PLANET_04",
    worldType: "ARCADE COLLISION MATRIX",
    coordinates: "VECTOR_2D // 60_FPS_CANVAS",
    accentText: "text-amber-400",
    accentBorder: "border-amber-500/60",
    accentBg: "bg-amber-500/10",
    glowColor: "rgba(251, 191, 36, 0.25)",
    pulseClass: "bg-amber-400 shadow-[0_0_12px_#fbbf24]",
  },
};

export function FeaturedProjects() {
  const activeSlug = useSyncExternalStore(
    subscribeActiveProject,
    getActiveProjectSnapshot,
    getActiveProjectServerSnapshot
  );

  const activeProject: Project =
    FEATURED_PROJECTS.find((p) => p.slug === activeSlug) || FEATURED_PROJECTS[0];
  const activeMeta = WORLD_METAS[activeSlug as ProjectSlug] || WORLD_METAS.floodguard;

  const currentIndex = FEATURED_PROJECTS.findIndex((p) => p.slug === activeSlug);

  const handleSelect = useCallback((slug: ProjectSlug) => {
    setActiveProject(slug);
  }, []);

  const handlePrev = useCallback(() => {
    const prevIndex = (currentIndex - 1 + FEATURED_PROJECTS.length) % FEATURED_PROJECTS.length;
    setActiveProject(FEATURED_PROJECTS[prevIndex].slug as ProjectSlug);
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % FEATURED_PROJECTS.length;
    setActiveProject(FEATURED_PROJECTS[nextIndex].slug as ProjectSlug);
  }, [currentIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    },
    [handlePrev, handleNext]
  );

  return (
    <section
      id="systems"
      className="py-24 lg:py-32 border-t border-border-subtle/50 relative overflow-hidden"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label="Chapter 02 Orbital Systems Command"
    >
      <div className="mx-auto w-[92vw] max-w-[1536px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <ScrollReveal direction="up" delay={50}>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-8 border-b border-border-subtle/60">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-primary">
                <span>[ CHAPTER 02 // ORBITAL SYSTEMS & PROTOTYPES ]</span>
              </div>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
                Orbital Worlds & Holographic Dossiers
              </h2>
              <p className="mt-3 text-sm sm:text-base text-text-muted leading-relaxed">
                Four engineering builds rendered as orbiting planetary destinations in the 3D space world. Select any world to revolve the 3D planetary carousel and inspect the verified technical dossier below.
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-1 font-mono text-xs text-text-subtle">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                <span className="text-foreground font-semibold">CAROUSEL SYNCHRONIZED</span>
              </div>
              <span>4 PLANETARY BODIES IN ORBIT</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Spatial Planetary Selector Bar (Replaces static card grid) */}
        <div className="mt-8">
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4"
            role="tablist"
            aria-label="Planetary Orbit Selectors"
          >
            {FEATURED_PROJECTS.map((project) => {
              const slug = project.slug as ProjectSlug;
              const meta = WORLD_METAS[slug];
              const isSelected = slug === activeSlug;

              return (
                <button
                  key={project.slug}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`panel-${project.slug}`}
                  id={`tab-${project.slug}`}
                  onClick={() => handleSelect(slug)}
                  className={`group relative flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-300 backdrop-blur-md ${
                    isSelected
                      ? `border-primary/90 bg-surface-raised/90 shadow-[0_0_24px_${meta.glowColor}] ring-1 ring-primary/40`
                      : "border-border-subtle/70 bg-surface/50 hover:bg-surface/80 hover:border-border-strong/80"
                  }`}
                >
                  {/* Top Status & Index */}
                  <div className="w-full flex items-center justify-between font-mono text-[11px] mb-2">
                    <span className={isSelected ? meta.accentText : "text-text-subtle"}>
                      {meta.code}
                    </span>
                    <span
                      className={`h-2 w-2 rounded-full transition-transform duration-300 ${
                        isSelected ? `${meta.pulseClass} scale-125` : "bg-text-subtle/40"
                      }`}
                    />
                  </div>

                  {/* Title */}
                  <div
                    className={`font-mono text-sm sm:text-base font-bold tracking-tight transition-colors ${
                      isSelected ? "text-foreground" : "text-text-muted group-hover:text-foreground"
                    }`}
                  >
                    {project.title}
                  </div>

                  {/* Category Pill */}
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-text-subtle truncate max-w-full">
                    {project.category}
                  </div>

                  {/* Active Destination Indicator */}
                  {isSelected && (
                    <div className="mt-3 pt-2 w-full border-t border-border-subtle/60 flex items-center justify-between text-[10px] font-mono">
                      <span className={meta.accentText}>[ 3D CAMERA LOCKED ]</span>
                      <span className="text-text-subtle">ACTIVE</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Holographic Cockpit Terminal & Mission Dossier */}
        <div
          id={`panel-${activeProject.slug}`}
          role="tabpanel"
          aria-labelledby={`tab-${activeProject.slug}`}
          className="mt-8 relative rounded-2xl border border-border-strong/80 bg-surface/85 backdrop-blur-xl p-6 sm:p-8 lg:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Subtle HUD Grid Background Overlay */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* Top Terminal Status Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border-subtle/60 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-0.5 rounded border ${activeMeta.accentBorder} ${activeMeta.accentBg} ${activeMeta.accentText} font-semibold uppercase tracking-wider`}>
                {activeMeta.worldType}
              </span>
              <span className="text-text-subtle hidden sm:inline">
                {"//"} {activeMeta.coordinates}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 font-mono text-xs text-foreground">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span>{activeProject.status}</span>
              </span>
              <span className="text-text-subtle font-mono text-xs">
                ORBITAL CYCLE: {activeProject.year}
              </span>
            </div>
          </div>

          {/* Asymmetric Widescreen Mission Dossier Layout */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Bay Alpha: Tactical Viewport (Left 5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-border-strong/90 bg-surface-muted shadow-2xl group">
                <Image
                  src={activeProject.image}
                  alt={`${activeProject.title} user interface visualization`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  priority
                />

                {/* Scanline and Vignette Effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-75" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.5)_100%)]" />

                {/* Tactical HUD Corner Reticles */}
                <div className="pointer-events-none absolute top-3 left-3 font-mono text-[10px] text-primary/80">
                  ┌ RADAR LOCK
                </div>
                <div className="pointer-events-none absolute top-3 right-3 font-mono text-[10px] text-primary/80">
                  0{currentIndex + 1} {"//"} 04 ┐
                </div>
                <div className="pointer-events-none absolute bottom-3 left-3 font-mono text-[10px] text-text-subtle">
                  └ {activeMeta.code}
                </div>
                <div className="pointer-events-none absolute bottom-3 right-3 font-mono text-[10px] text-text-subtle">
                  SCAN OK ┘
                </div>
              </div>

              {/* Viewport Telemetry Sub-panel */}
              <div className="rounded-lg border border-border-subtle bg-surface-raised/50 p-3.5 font-mono text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${activeMeta.pulseClass}`} />
                  <span className="text-text-subtle">CELESTIAL BEACON:</span>
                  <span className="text-foreground font-semibold">{activeProject.slug}.orb</span>
                </div>
                <span className="text-primary text-[11px]">VERIFIED ASSET</span>
              </div>
            </div>

            {/* Bay Bravo: Technical Dossier & Architecture Narrative (Right 7 Cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* System Title & Tagline */}
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                  {activeProject.title}
                </h3>
                <p className="mt-2 text-base sm:text-lg font-medium text-primary">
                  {activeProject.tagline}
                </p>

                {/* Verified Narrative */}
                <p className="mt-5 text-sm sm:text-base leading-relaxed text-text-muted">
                  {activeProject.description}
                </p>

                {/* Verified Engineering Highlights */}
                <div className="mt-6 border-t border-border-subtle/80 pt-5">
                  <div className="text-[11px] font-mono uppercase tracking-widest text-text-subtle mb-3 flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>Verified Engineering Highlights</span>
                  </div>
                  <ul className="space-y-2.5">
                    {activeProject.highlights.map((highlight, hIndex) => (
                      <li key={hIndex} className="flex items-start gap-3 text-xs sm:text-sm text-text-muted">
                        <span className="font-mono text-primary font-bold shrink-0 mt-0.5">›</span>
                        <span className="leading-snug">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Core Propulsion & Stack (Tags) */}
                <div className="mt-6 border-t border-border-subtle/80 pt-5">
                  <div className="text-[11px] font-mono uppercase tracking-widest text-text-subtle mb-3">
                    System Architecture & Tech Stack
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md border border-border-subtle bg-surface-raised px-3 py-1 text-xs font-mono text-text-muted transition-colors hover:border-primary/50 hover:text-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Deck & World Cycler */}
              <div className="mt-8 border-t border-border-subtle/80 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <a
                  href="https://github.com/ChristianAngcla"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 rounded-lg border border-primary/60 bg-primary/10 px-5 py-2.5 font-mono text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-black hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                >
                  <span>Inspect Codebase Repository</span>
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                  </svg>
                </a>

                {/* Planetary System Cycler Controls */}
                <div className="flex items-center gap-2 font-mono text-xs">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous Planetary World"
                    className="inline-flex items-center gap-1 px-3 py-2 rounded border border-border-subtle bg-surface-raised/70 text-text-muted hover:text-foreground hover:border-primary/50 transition-colors"
                  >
                    <span>‹ PREV WORLD</span>
                  </button>
                  <span className="px-2 text-text-subtle text-[11px]">
                    0{currentIndex + 1} / 0{FEATURED_PROJECTS.length}
                  </span>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next Planetary World"
                    className="inline-flex items-center gap-1 px-3 py-2 rounded border border-border-subtle bg-surface-raised/70 text-text-muted hover:text-foreground hover:border-primary/50 transition-colors"
                  >
                    <span>NEXT WORLD ›</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
