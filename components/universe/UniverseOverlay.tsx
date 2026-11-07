"use client";

import React, { useSyncExternalStore, useCallback } from "react";
import Image from "next/image";
import { FEATURED_PROJECTS, Project } from "@/lib/projects";
import {
  DESTINATIONS,
  DestinationId,
  getNavigationSnapshot,
  getNavigationServerSnapshot,
  subscribeNavigation,
  travelTo,
  setDossierOpen,
  navigateNextPlanet,
  navigatePrevPlanet,
} from "@/lib/universeNavigation";
import {
  setSimulationMode,
  getSimulationModeSnapshot,
  getSimulationModeServerSnapshot,
  subscribeSimulationMode,
} from "@/components/visual/CosmicWorld";

interface FocusArea {
  id: string;
  code: string;
  title: string;
  label: string;
  description: string;
  methods: string[];
  specs: { label: string; value: string }[];
}

const FOCUS_AREAS: FocusArea[] = [
  {
    id: "software-engineering",
    code: "// 01. ARCHITECTURE",
    title: "Software Engineering",
    label: "Web & Distributed Systems",
    description:
      "Designing modular web applications and REST APIs using Next.js, TypeScript, and Node.js. Emphasizing clean component boundaries, readable state management, and separation of concerns.",
    methods: ["Next.js App Router", "TypeScript Typings", "Node.js REST Services", "Server/Client Boundaries"],
    specs: [
      { label: "PARADIGM", value: "Component-Driven" },
      { label: "TYPING", value: "Strict / Zero Any" },
      { label: "STATE", value: "External Stores" },
    ],
  },
  {
    id: "quality-security",
    code: "// 02. RELIABILITY",
    title: "Quality & Security",
    label: "Defensive System Rigor",
    description:
      "Learning defensive engineering patterns, API validation, password hashing, and testable system designs. Prioritizing secure credential hygiene and robust error boundaries across the stack.",
    methods: ["API Input Sanitization", "Credential Isolation", "Defensive Exception Handling", "Static Code Audits"],
    specs: [
      { label: "DEFENSE", value: "Input Sanitization" },
      { label: "AUTH", value: "Bcrypt & Tokens" },
      { label: "SAFETY", value: "Zero Credential Leak" },
    ],
  },
  {
    id: "ai-assisted-dev",
    code: "// 03. AUGMENTATION",
    title: "AI-Assisted Engineering",
    label: "Verification-Loop Development",
    description:
      "Partnering with AI coding agents through explicit architectural handoffs, rigorous verification loops, and testable specifications to build ambitious systems efficiently.",
    methods: ["Architectural Prompting", "Automated Lint/Build Loops", "Stepwise Refinement", "Strict Scope Control"],
    specs: [
      { label: "METHOD", value: "Verification-First" },
      { label: "TOOLING", value: "Antigravity + LLM" },
      { label: "DISCIPLINE", value: "Strict Scope Isolation" },
    ],
  },
  {
    id: "creative-tech",
    code: "// 04. INTERACTION",
    title: "Creative Technology",
    label: "Interactive Graphics & Shaders",
    description:
      "Exploring WebGL, Three.js 3D mathematical geometry, and responsive kinetic motion to build digital experiences that communicate through mechanics rather than static text.",
    methods: ["Three.js Scene Graphs", "Hermite Interpolation", "GPU Buffer Geometries", "Kinetic Flight Kinematics"],
    specs: [
      { label: "CANVAS", value: "Hardware Accelerated" },
      { label: "FRAME RATE", value: "Target 60 FPS" },
      { label: "INTERPOLATION", value: "Cubic Hermite Splines" },
    ],
  },
];

export function UniverseOverlay() {
  const nav = useSyncExternalStore(
    subscribeNavigation,
    getNavigationSnapshot,
    getNavigationServerSnapshot
  );

  const simMode = useSyncExternalStore(
    subscribeSimulationMode,
    getSimulationModeSnapshot,
    getSimulationModeServerSnapshot
  );

  const activeConfig = DESTINATIONS[nav.targetDestination] || DESTINATIONS.origin;
  const isTraveling = nav.flightStatus === "traveling";

  // Active Project for Planetary Destinations
  const currentProject: Project | undefined = FEATURED_PROJECTS.find(
    (p) => p.slug === activeConfig.projectSlug
  );

  const handleCloseDossier = useCallback(() => {
    setDossierOpen(false);
  }, []);

  const handleOpenDossier = useCallback(() => {
    setDossierOpen(true);
  }, []);

  // Only render when in expedition mode
  if (nav.experienceMode !== "expedition") {
    return null;
  }

  // During flight transition, keep the view clean and cinematic so the user enjoys the warp flight!
  if (isTraveling) {
    return (
      <div className="pointer-events-none fixed inset-0 z-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-primary/50 bg-background/80 px-8 py-5 backdrop-blur-xl shadow-[0_0_50px_rgba(168,85,247,0.3)] animate-pulse">
          <div className="flex items-center gap-3 font-mono text-sm font-bold text-foreground">
            <span className="h-3 w-3 rounded-full bg-primary animate-ping" />
            <span>WARP VECTOR ENGAGED // EN ROUTE TO {activeConfig.label}</span>
          </div>
          <div className="w-64 h-1.5 rounded-full bg-surface-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-100"
              style={{ width: `${Math.round(nav.flightProgress * 100)}%` }}
            />
          </div>
          <div className="font-mono text-[11px] text-text-subtle">
            {activeConfig.coordinates}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-20 w-full min-h-screen pointer-events-none flex flex-col justify-center">
      {/* =====================================================================
          DESTINATION 00: ORIGIN // LAUNCH BAY VIEW
          ===================================================================== */}
      {nav.targetDestination === "origin" && (
        <section
          aria-label="Expedition Launch Bay"
          className="pointer-events-auto mx-auto w-[92vw] max-w-6xl px-4 py-20 lg:py-28"
        >
          <div className="max-w-3xl rounded-3xl border border-border-strong/80 bg-surface/85 p-8 sm:p-12 lg:p-16 backdrop-blur-2xl shadow-2xl">
            {/* Identity Badge */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-border-strong/90 bg-surface-raised/90 px-4 py-1.5 text-xs font-mono text-text-muted shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span>
                SYS_ONLINE <span className="text-primary font-bold">{"//"}</span> SOFTWARE DEVELOPER INTERN @ DOST-ASTI <span className="text-primary font-bold">{"//"}</span> NU MANILA
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl text-foreground leading-[1.06]">
              Building systems.{" "}
              <span className="block mt-1 bg-gradient-to-r from-primary via-soft-ultraviolet to-sky-400 bg-clip-text text-transparent">
                Exploring the unknown.
              </span>
            </h1>

            {/* Narrative */}
            <p className="mt-6 text-base sm:text-lg leading-relaxed text-text-muted">
              Welcome aboard <span className="font-semibold text-foreground">Christian’s Lab</span> — the personal engineering laboratory and interactive digital universe of{" "}
              <span className="font-semibold text-foreground">Christian Constantino Angcla</span>. Navigating full-stack architecture, defensive engineering, and verified community builds across an explorable 3D solar system.
            </p>

            {/* Primary Travel CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => travelTo("floodguard")}
                className="group relative inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-primary px-8 text-sm font-semibold text-midnight-void shadow-[0_0_30px_rgba(168,85,247,0.45)] transition-all duration-300 hover:bg-primary-hover hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(168,85,247,0.65)]"
              >
                <span>Launch Expedition ›</span>
              </button>

              <button
                type="button"
                onClick={() => travelTo("disciplines")}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-border-strong bg-surface-raised/80 px-6 text-sm font-medium text-foreground transition-all duration-300 hover:border-primary/60 hover:bg-surface-raised"
              >
                <span>Inspect Engineering Core</span>
              </button>
            </div>

            {/* Quick Destination Portal Cards */}
            <div className="mt-10 border-t border-border-subtle/80 pt-6">
              <div className="text-[11px] font-mono uppercase tracking-widest text-text-subtle mb-3">
                Direct Coordinates to Documented Builds
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {FEATURED_PROJECTS.map((proj) => (
                  <button
                    key={proj.slug}
                    type="button"
                    onClick={() => travelTo(proj.slug === "how-to-train-your-birdie" ? "birdie" : (proj.slug as DestinationId))}
                    className="flex flex-col p-3 rounded-xl border border-border-subtle bg-surface-raised/40 hover:border-primary hover:bg-surface-raised text-left transition-all group"
                  >
                    <span className="font-mono text-[10px] text-primary">WARP VECTOR</span>
                    <span className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                      {proj.title}
                    </span>
                    <span className="text-[10px] text-text-subtle truncate mt-0.5">
                      {proj.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          DESTINATION 01: ENGINEERING CORE // DISCIPLINARY MATRIX VIEW
          ===================================================================== */}
      {nav.targetDestination === "disciplines" && (
        <section
          aria-label="Disciplinary Engineering Core"
          className="pointer-events-auto mx-auto w-[92vw] max-w-6xl px-4 py-20 lg:py-28"
        >
          <div className="rounded-3xl border border-border-strong/80 bg-surface/85 p-6 sm:p-10 lg:p-12 backdrop-blur-2xl shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-border-subtle/60">
              <div>
                <div className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
                  [ CHAPTER 01 // DISCIPLINARY CORE STATION ]
                </div>
                <h2 className="mt-1 text-2xl sm:text-4xl font-extrabold text-foreground">
                  Architectural Matrix & Technical Rigor
                </h2>
              </div>
              <button
                type="button"
                onClick={() => travelTo("floodguard")}
                className="self-start sm:self-auto inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2 font-mono text-xs font-semibold text-black hover:bg-primary-hover transition-colors"
              >
                <span>Travel to Planetary Worlds ›</span>
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {FOCUS_AREAS.map((area) => (
                <div
                  key={area.id}
                  className="rounded-2xl border border-border-subtle/80 bg-surface-raised/50 p-6 backdrop-blur-md hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-mono text-text-subtle mb-2">
                    <span className="text-primary font-bold">{area.code}</span>
                    <span>{area.label}</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{area.title}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-text-muted leading-relaxed">
                    {area.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-border-subtle/60 flex flex-wrap gap-1.5">
                    {area.methods.map((method) => (
                      <span
                        key={method}
                        className="rounded px-2 py-0.5 text-[11px] font-mono border border-border-subtle bg-surface text-text-muted"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          DESTINATION 02: PLANETARY WORLDS // HOLOGRAPHIC MISSION DOSSIER
          ===================================================================== */}
      {currentProject && activeConfig.type === "planet" && (
        <section
          aria-label={`Orbital Dossier for ${currentProject.title}`}
          className="pointer-events-auto mx-auto w-[92vw] max-w-6xl px-4 py-16 lg:py-24"
        >
          {nav.dossierOpen ? (
            <div className="relative rounded-3xl border border-border-strong/90 bg-surface/90 p-6 sm:p-10 lg:p-12 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.6)]">
              {/* Header Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border-subtle/60 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded border border-primary/40 bg-primary/10 text-primary font-bold uppercase tracking-wider">
                    {activeConfig.category}
                  </span>
                  <span className="text-text-subtle hidden sm:inline">
                    {"//"} {activeConfig.coordinates}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-2 text-foreground font-semibold">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{currentProject.status}</span>
                  </span>

                  {/* Close Dossier Button */}
                  <button
                    type="button"
                    onClick={handleCloseDossier}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border-strong bg-surface-raised px-3 py-1.5 font-mono text-xs text-text-muted hover:text-foreground hover:border-primary transition-colors"
                    title="Close dossier to view full 3D planet (Esc)"
                  >
                    <span>CLOSE DOSSIER [✕]</span>
                  </button>
                </div>
              </div>

              {/* Dossier Content Grid */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Widescreen Tactical Viewport (Left 5 Cols) */}
                <div className="lg:col-span-5 flex flex-col gap-3">
                  <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-border-strong/90 bg-surface-muted shadow-2xl group">
                    <Image
                      src={currentProject.image}
                      alt={`${currentProject.title} screenshot interface`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 42vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-70" />

                    {/* HUD Reticles */}
                    <div className="pointer-events-none absolute top-3 left-3 font-mono text-[10px] text-primary">
                      ┌ ORBITAL LOCK
                    </div>
                    <div className="pointer-events-none absolute bottom-3 right-3 font-mono text-[10px] text-text-subtle">
                      SCAN OK ┘
                    </div>
                  </div>

                  <div className="flex items-center justify-between font-mono text-xs text-text-subtle px-1">
                    <span>BUILD CYCLE: {currentProject.year}</span>
                    <span className="text-primary font-semibold">AUTHENTIC ASSET</span>
                  </div>
                </div>

                {/* Technical Dossier Narrative (Right 7 Cols) */}
                <div className="lg:col-span-7 flex flex-col justify-between">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">
                      {currentProject.title}
                    </h2>
                    <p className="mt-1 text-base sm:text-lg font-medium text-primary">
                      {currentProject.tagline}
                    </p>

                    <p className="mt-4 text-sm sm:text-base leading-relaxed text-text-muted">
                      {currentProject.description}
                    </p>

                    {/* Verified Highlights */}
                    <div className="mt-6 border-t border-border-subtle/80 pt-5">
                      <div className="text-[11px] font-mono uppercase tracking-widest text-text-subtle mb-3">
                        Verified Engineering Highlights
                      </div>
                      <ul className="space-y-2 text-xs sm:text-sm text-text-muted">
                        {currentProject.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="font-mono text-primary font-bold shrink-0">›</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech Stack */}
                    <div className="mt-6 border-t border-border-subtle/80 pt-4 flex flex-wrap gap-2">
                      {currentProject.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-border-subtle bg-surface-raised px-2.5 py-1 text-xs font-mono text-text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Planetary Cycler */}
                  <div className="mt-8 border-t border-border-subtle/80 pt-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-3">
                      {currentProject.repoUrls && currentProject.repoUrls.length > 0 ? (
                        currentProject.repoUrls.map((repo) => (
                          <a
                            key={repo.url}
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 font-mono text-xs font-semibold text-black hover:bg-primary-hover hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
                          >
                            <span>{repo.label}</span>
                            <span aria-hidden="true">↗</span>
                          </a>
                        ))
                      ) : currentProject.repoUrl ? (
                        <a
                          href={currentProject.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 font-mono text-xs font-semibold text-black hover:bg-primary-hover hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
                        >
                          <span>Source</span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      ) : null}
                      {currentProject.demoUrl && (
                        <a
                          href={currentProject.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-xl border border-primary/60 bg-surface-raised px-5 py-2.5 font-mono text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-all"
                        >
                          <span>Live Demo</span>
                          <span aria-hidden="true">↗</span>
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2 font-mono text-xs">
                      <button
                        type="button"
                        onClick={navigatePrevPlanet}
                        className="px-3 py-2 rounded-lg border border-border-subtle bg-surface-raised hover:border-primary text-text-muted hover:text-foreground transition-colors"
                      >
                        ‹ PREV PLANET
                      </button>
                      <button
                        type="button"
                        onClick={navigateNextPlanet}
                        className="px-3 py-2 rounded-lg border border-border-subtle bg-surface-raised hover:border-primary text-text-muted hover:text-foreground transition-colors"
                      >
                        NEXT PLANET ›
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Minimized Pill When Dossier is Closed (Leaves full 3D planet unobstructed!) */
            <div className="flex flex-col items-start gap-3">
              <button
                type="button"
                onClick={handleOpenDossier}
                className="group flex items-center gap-3 rounded-2xl border border-primary/70 bg-surface/90 px-6 py-4 backdrop-blur-xl shadow-2xl hover:bg-primary hover:text-black transition-all"
              >
                <span className="h-3 w-3 rounded-full bg-primary animate-pulse group-hover:bg-black" />
                <span className="font-mono text-sm font-bold">
                  ORBITING {currentProject.title} — [ OPEN DOSSIER / SPACE ]
                </span>
              </button>
              <div className="font-mono text-xs text-text-subtle bg-surface/70 px-3 py-1 rounded-lg backdrop-blur-sm">
                Use Galaxy Map below or arrow keys to travel to other worlds.
              </div>
            </div>
          )}
        </section>
      )}

      {/* =====================================================================
          DESTINATION 03: SIMULATION MATRIX VIEW
          ===================================================================== */}
      {nav.targetDestination === "simulation" && (
        <section
          aria-label="Quantum Particle Simulation"
          className="pointer-events-auto mx-auto w-[92vw] max-w-4xl px-4 py-20 lg:py-28"
        >
          <div className="rounded-3xl border border-border-strong/80 bg-surface/85 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl">
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
              [ CHAPTER 03 // QUANTUM PARTICLE MATRIX ]
            </div>
            <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold text-foreground">
              Interactive 2,000-Body Particle Sandbox
            </h2>
            <p className="mt-3 text-sm sm:text-base text-text-muted leading-relaxed">
              Real-time WebGL buffer geometry computed dynamically across 2,000 live point bodies. Move your cursor across the viewport to warp the particle trajectories.
            </p>

            {/* Simulation Mode Selector */}
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setSimulationMode("gravity")}
                className={`px-5 py-2.5 rounded-xl font-mono text-xs font-semibold border transition-all ${
                  simMode === "gravity"
                    ? "border-primary bg-primary text-black shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                    : "border-border-strong bg-surface-raised text-text-muted hover:text-foreground"
                }`}
              >
                GRAVITY WELL (Cursor Attractor)
              </button>

              <button
                type="button"
                onClick={() => setSimulationMode("flow")}
                className={`px-5 py-2.5 rounded-xl font-mono text-xs font-semibold border transition-all ${
                  simMode === "flow"
                    ? "border-primary bg-primary text-black shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                    : "border-border-strong bg-surface-raised text-text-muted hover:text-foreground"
                }`}
              >
                COSMIC FLOW (Harmonic Vector Field)
              </button>

              <button
                type="button"
                onClick={() => setSimulationMode("pulse")}
                className={`px-5 py-2.5 rounded-xl font-mono text-xs font-semibold border transition-all ${
                  simMode === "pulse"
                    ? "border-primary bg-primary text-black shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                    : "border-border-strong bg-surface-raised text-text-muted hover:text-foreground"
                }`}
              >
                SUPERNOVA PULSE (Harmonic Shockwave)
              </button>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================================
          DESTINATION 04: BEACON TERMINAL VIEW
          ===================================================================== */}
      {nav.targetDestination === "beacon" && (
        <section
          aria-label="Deep Space Transmission Beacon"
          className="pointer-events-auto mx-auto w-[92vw] max-w-4xl px-4 py-20 lg:py-28"
        >
          <div className="rounded-3xl border border-border-strong/80 bg-surface/85 p-6 sm:p-10 lg:p-12 backdrop-blur-2xl shadow-2xl">
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
              [ CHAPTER 04 // BEACON TERMINAL ]
            </div>
            <h2 className="mt-2 text-3xl sm:text-5xl font-extrabold text-foreground">
              Initiate Transmission & Collaboration
            </h2>
            <p className="mt-4 text-base sm:text-lg text-text-muted leading-relaxed">
              Open to software engineering internships, technical collaborations, and full-stack systems engineering inquiries. Dispatch a transmission directly below.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="mailto:christianangcla4@gmail.com"
                className="inline-flex h-12 items-center gap-3 rounded-xl bg-primary px-8 text-sm font-semibold text-black shadow-[0_0_24px_rgba(168,85,247,0.4)] hover:bg-primary-hover hover:scale-[1.02] transition-all"
              >
                <span>christianangcla4@gmail.com</span>
              </a>

              <a
                href="/Christian-Angcla-Resume.pdf"
                download="Christian-Angcla-Resume.pdf"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-border-strong bg-surface-raised px-6 text-sm font-semibold text-foreground hover:border-primary transition-colors"
              >
                <span>Download Resume (PDF) ↓</span>
              </a>

              <a
                href="https://github.com/ChristianAngcla"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-border-strong bg-surface-raised px-6 text-sm font-semibold text-foreground hover:border-primary transition-colors"
              >
                <span>GitHub Profile</span>
              </a>

              <a
                href="https://linkedin.com/in/christianangcla"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-border-strong bg-surface-raised px-6 text-sm font-semibold text-foreground hover:border-primary transition-colors"
              >
                <span>LinkedIn Profile</span>
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-border-subtle/80 flex items-center justify-between font-mono text-xs text-text-subtle">
              <span>CHRISTIAN CONSTANTINO ANGCLA</span>
              <span>DOST-ASTI // NU MANILA</span>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
