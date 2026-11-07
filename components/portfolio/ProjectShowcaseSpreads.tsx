"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FEATURED_PROJECTS, Project } from "@/lib/projects";
import { enterExpedition, DestinationId } from "@/lib/universeNavigation";

// ----------------------------------------------------------------------------
// 1. FloodGuard Interactive Hydrological Risk Simulator HUD
// ----------------------------------------------------------------------------
function FloodGuardInteractiveHUD() {
  const [waterLevel, setWaterLevel] = useState(14.8);
  const isAlarm = waterLevel >= 16.5;

  return (
    <div className="mt-4 rounded-xl border border-border-subtle bg-surface/80 p-4 font-mono text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
        <span className="text-emerald-400 font-bold">MARIKINA RIVER BASIN TELEMETRY</span>
        <span className={`flex items-center gap-1.5 font-bold ${isAlarm ? "text-rose-400" : "text-emerald-400"}`}>
          <span className={`h-2 w-2 rounded-full ${isAlarm ? "bg-rose-500 animate-ping" : "bg-emerald-400"}`} />
          <span>{isAlarm ? "ALARM LEVEL 3: EVACUATE" : "NORMAL MONITORING"}</span>
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px]">
        <div>
          <span className="text-text-subtle block">WATER LEVEL:</span>
          <span className="text-sm font-bold text-foreground">{waterLevel.toFixed(1)}m / 18.0m max</span>
        </div>
        <div>
          <span className="text-text-subtle block">GEOSPATIAL COORDS:</span>
          <span className="text-foreground">14.6507° N, 121.1029° E</span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-text-subtle block">SAFE CORRIDORS:</span>
          <span className="text-emerald-400">Routes 01 &amp; 03 Active</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border-subtle flex items-center justify-between">
        <span className="text-[10px] text-text-subtle">SIMULATE MONSOON THRESHOLD:</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setWaterLevel(14.2)}
            className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors ${
              waterLevel === 14.2 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50" : "bg-surface border-border-subtle text-text-muted hover:text-foreground"
            }`}
          >
            Normal Flow
          </button>
          <button
            type="button"
            onClick={() => setWaterLevel(17.4)}
            className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors ${
              waterLevel === 17.4 ? "bg-rose-500/20 text-rose-400 border-rose-500/50" : "bg-surface border-border-subtle text-text-muted hover:text-foreground"
            }`}
          >
            Peak Typhoon
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 3. Intertwine Interactive ViewModel & StateFlow Simulator
// ----------------------------------------------------------------------------
function IntertwineInteractiveHUD() {
  const [flowState, setFlowState] = useState<"IDLE" | "SYNCING" | "EMITTED">("IDLE");
  const [eventLog, setEventLog] = useState("ViewModel StateFlow initialized");

  const triggerEvent = () => {
    setFlowState("SYNCING");
    setEventLog("Dispatching CoroutineScope(Dispatchers.IO)...");
    setTimeout(() => {
      setFlowState("EMITTED");
      setEventLog("StateFlow.emit(UiState.Success(data)): UI Recomposed");
      setTimeout(() => setFlowState("IDLE"), 1500);
    }, 500);
  };

  return (
    <div className="mt-4 rounded-xl border border-border-subtle bg-surface/80 p-4 font-mono text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
        <span className="text-primary font-bold">FLUTTER &amp; PROVIDER STATE SIMULATOR</span>
        <span className="px-2 py-0.5 rounded bg-primary/20 text-primary text-[10px] font-bold">
          {flowState}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px]">
        <div>
          <span className="text-text-subtle block">REACTIVE FLOW:</span>
          <span className="text-foreground">Unidirectional MVVM State</span>
        </div>
        <button
          type="button"
          onClick={triggerEvent}
          className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/50 text-primary font-bold hover:bg-primary hover:text-black transition-colors"
        >
          Dispatch User Intent
        </button>
      </div>

      <div className="mt-2 text-[10px] text-text-muted truncate">
        {eventLog}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// 4. Playable Mini 2D Canvas Physics Engine Preview for Birdie
// ----------------------------------------------------------------------------
function BirdieInteractiveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let birdY = 60;
    let velocity = 0;
    const gravity = 0.28;
    let animId: number;

    const flap = () => {
      velocity = -4.5;
      setScore((s) => s + 1);
    };

    canvas.addEventListener("click", flap);

    const loop = () => {
      velocity += gravity;
      birdY += velocity;

      // Floor & ceiling bounce
      if (birdY > 115) {
        birdY = 115;
        velocity = -2;
      }
      if (birdY < 10) {
        birdY = 10;
        velocity = 0;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background subtle grid
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw Bird
      ctx.fillStyle = "#f59e0b";
      ctx.fillRect(40, birdY, 14, 12);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(48, birdY + 2, 4, 4);
      ctx.fillStyle = "#000000";
      ctx.fillRect(50, birdY + 3, 2, 2);

      // Trailing velocity vector
      ctx.strokeStyle = "rgba(245, 158, 11, 0.4)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(40, birdY + 6);
      ctx.lineTo(20, birdY + 6 - velocity * 1.5);
      ctx.stroke();

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener("click", flap);
    };
  }, []);

  return (
    <div className="mt-4 rounded-xl border border-border-subtle bg-surface/80 p-4 font-mono text-xs">
      <div className="flex items-center justify-between pb-2 border-b border-border-subtle">
        <span className="text-amber-400 font-bold">2D GAME PHYSICS LOOP • CLICK CANVAS TO FLAP</span>
        <span className="text-text-subtle text-[11px]">FLAPS: {score}</span>
      </div>

      <div className="mt-2 relative w-full h-[120px] rounded-lg overflow-hidden bg-black/40 border border-border-subtle">
        <canvas ref={canvasRef} width={400} height={130} className="w-full h-full cursor-pointer" />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Master Projects Spreads Component with Pinned Horizontal Scrub
// ----------------------------------------------------------------------------
export function ProjectShowcaseSpreads() {
  const containerRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const [activeProjectIdx, setActiveProjectIdx] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop: Pinned Horizontal Exhibition Track
      mm.add("(min-width: 1024px)", () => {
        if (!horizontalTrackRef.current) return;

        const totalProjects = FEATURED_PROJECTS.length;
        // Move track by (totalProjects - 1) * 100vw
        const xTranslation = -(totalProjects - 1) * 100;

        const pinTl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => `+=${window.innerWidth * (totalProjects - 0.5)}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const currentIdx = Math.min(
                totalProjects - 1,
                Math.floor(self.progress * totalProjects)
              );
              setActiveProjectIdx(currentIdx);
            },
          },
        });

        pinTl.to(horizontalTrackRef.current, {
          xPercent: xTranslation,
          ease: "none",
        });
      });

      // Mobile/Tablet: Sequential scroll-triggered entrance reveals (no pinning)
      mm.add("(max-width: 1023px)", () => {
        const articles = containerRef.current?.querySelectorAll(".mobile-project-card");
        articles?.forEach((art) => {
          gsap.fromTo(
            art,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power2.out",
              scrollTrigger: {
                trigger: art,
                start: "top 80%",
              },
            }
          );
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full relative">
      {/* -------------------------------------------------------------
          DESKTOP: Pinned Horizontal Cinematic Exhibition Track
          ------------------------------------------------------------- */}
      <div className="hidden lg:block w-full h-screen overflow-hidden">
        {/* Persistent Exhibition Top HUD Bar */}
        <div className="absolute top-6 left-8 right-8 z-20 flex items-center justify-between border-b border-border-subtle pb-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-primary">
              PROJECT EXHIBITION
            </span>
            <span className="text-text-subtle text-xs">/</span>
            <span className="font-mono text-xs text-text-muted">
              SCENE 0{activeProjectIdx + 1} OF 0{FEATURED_PROJECTS.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {FEATURED_PROJECTS.map((p, i) => (
              <div
                key={p.slug}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeProjectIdx === i
                    ? "w-8 bg-primary"
                    : "w-2 bg-border-subtle"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Horizontal Sliding Filmstrip */}
        <div
          ref={horizontalTrackRef}
          className="flex flex-nowrap h-full w-[400vw] will-change-transform pt-16"
        >
          {FEATURED_PROJECTS.map((proj: Project, idx: number) => {
            return (
              <div
                key={proj.slug}
                className="w-screen h-full flex items-center justify-center px-12 xl:px-20"
              >
                <div className="w-full max-w-[1536px] grid grid-cols-12 gap-12 items-center">
                  {/* Left Column: Visual & Simulator */}
                  <div className="col-span-6 flex flex-col">
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-border-subtle bg-surface-muted shadow-2xl">
                      <Image
                        src={proj.image}
                        alt={`${proj.title} user interface`}
                        fill
                        sizes="50vw"
                        className="object-cover transition-transform duration-700 hover:scale-105"
                      />
                    </div>

                    {/* Dedicated Interactive Mini Simulation */}
                    {proj.slug === "floodguard" && <FloodGuardInteractiveHUD />}
                    {proj.slug === "intertwine" && <IntertwineInteractiveHUD />}
                    {proj.slug === "how-to-train-your-birdie" && <BirdieInteractiveCanvas />}
                  </div>

                  {/* Right Column: Project Typography & Actions */}
                  <div className="col-span-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-text-subtle mb-3">
                        <span className="text-primary font-bold">
                          0{idx + 1} • {proj.category}
                        </span>
                        <span>{proj.status} • {proj.year}</span>
                      </div>

                      <h3 className="text-4xl xl:text-5xl font-extrabold text-foreground tracking-tight">
                        {proj.title}
                      </h3>

                      <p className="mt-2 text-lg font-medium text-primary">
                        {proj.tagline}
                      </p>

                      <p className="mt-4 text-sm xl:text-base text-text-muted leading-relaxed">
                        {proj.description}
                      </p>

                      {/* Verified Highlights */}
                      <div className="mt-6 pt-5 border-t border-border-subtle">
                        <span className="font-mono text-xs uppercase tracking-widest text-text-subtle block mb-2.5">
                          Verified Engineering Highlights
                        </span>
                        <ul className="space-y-1.5 text-xs xl:text-sm text-text-muted">
                          {proj.highlights.map((h, hIdx) => (
                            <li key={hIdx} className="flex items-start gap-2">
                              <span className="text-primary font-bold">›</span>
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Tech Stack Pills */}
                      <div className="mt-5 flex flex-wrap gap-2">
                        {proj.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md border border-border-subtle bg-surface/80 px-2.5 py-1 font-mono text-xs text-text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Deck */}
                    <div className="mt-6 pt-5 border-t border-border-subtle flex items-center gap-4">
                      <a
                        href="https://github.com/ChristianAngcla"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-xs font-semibold text-background hover:opacity-90 transition-opacity"
                      >
                        <span>Inspect Codebase</span>
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

                      <button
                        type="button"
                        onClick={() =>
                          enterExpedition(
                            proj.slug === "how-to-train-your-birdie"
                              ? "birdie"
                              : (proj.slug as DestinationId)
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-full border border-primary/50 bg-primary/10 px-5 py-2.5 text-xs font-semibold text-primary hover:bg-primary hover:text-black transition-colors"
                      >
                        <span>3D Space Orbit ✦</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* -------------------------------------------------------------
          MOBILE / TABLET: Fluid Vertical Spreads (Zero Horizontal Overflow)
          ------------------------------------------------------------- */}
      <div className="block lg:hidden divide-y divide-border-subtle mt-8">
        {FEATURED_PROJECTS.map((proj: Project, idx: number) => {
          return (
            <article
              key={proj.slug}
              className="mobile-project-card py-12 flex flex-col gap-6"
            >
              {/* Visual with Interactive Simulator */}
              <div className="flex flex-col">
                <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-border-subtle bg-surface-muted shadow-xl">
                  <Image
                    src={proj.image}
                    alt={`${proj.title} user interface`}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                </div>

                {proj.slug === "floodguard" && <FloodGuardInteractiveHUD />}
                {proj.slug === "intertwine" && <IntertwineInteractiveHUD />}
                {proj.slug === "how-to-train-your-birdie" && <BirdieInteractiveCanvas />}
              </div>

              {/* Information & Description */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between text-xs font-mono text-text-subtle mb-2">
                  <span className="text-primary font-bold">0{idx + 1} • {proj.category}</span>
                  <span>{proj.status} • {proj.year}</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                  {proj.title}
                </h3>

                <p className="mt-1 text-sm font-medium text-primary">
                  {proj.tagline}
                </p>

                <p className="mt-3 text-sm text-text-muted leading-relaxed">
                  {proj.description}
                </p>

                {/* Verified Engineering Highlights */}
                <div className="mt-4 pt-4 border-t border-border-subtle">
                  <span className="font-mono text-xs uppercase tracking-widest text-text-subtle block mb-2">
                    Verified Highlights
                  </span>
                  <ul className="space-y-1.5 text-xs text-text-muted">
                    {proj.highlights.map((h, hIdx) => (
                      <li key={hIdx} className="flex items-start gap-2">
                        <span className="text-primary font-bold">›</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {proj.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-border-subtle bg-surface px-2 py-0.5 font-mono text-[11px] text-text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTAs */}
                <div className="mt-6 pt-4 border-t border-border-subtle flex flex-wrap items-center gap-3">
                  <a
                    href="https://github.com/ChristianAngcla"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2 text-xs font-semibold text-background hover:opacity-90 transition-opacity"
                  >
                    <span>Inspect Codebase</span>
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      enterExpedition(
                        proj.slug === "how-to-train-your-birdie"
                          ? "birdie"
                          : (proj.slug as DestinationId)
                      )
                    }
                    className="inline-flex items-center gap-1.5 rounded-full border border-primary/50 bg-primary/10 px-4 py-2 text-xs font-semibold text-primary"
                  >
                    <span>3D Space Orbit ✦</span>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
