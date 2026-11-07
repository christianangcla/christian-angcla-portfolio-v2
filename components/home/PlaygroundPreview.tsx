"use client";

import React, { useSyncExternalStore } from "react";
import { ScrollReveal } from "@/components/visual/ScrollReveal";
import {
  setSimulationMode,
  subscribeSimulationMode,
  getSimulationModeSnapshot,
  getSimulationModeServerSnapshot,
} from "@/components/visual/CosmicWorld";

interface ExperimentCard {
  title: string;
  category: string;
  status: string;
  code: string;
  description: string;
}

const UPCOMING_EXPERIMENTS: ExperimentCard[] = [
  {
    title: "Real-time Shader Lab",
    code: "EXP_01",
    category: "WebGL / GLSL",
    status: "In Conception",
    description: "Custom fragment shaders exploring procedural Perlin noise, fluid caustics, and organic light dispersion.",
  },
  {
    title: "Graph & Pathfinding Sandbox",
    code: "EXP_02",
    category: "Spatial Algorithmics",
    status: "Queued",
    description: "Interactive visualization of Dijkstra, A*, and spatial flood evacuation routing algorithms in real time.",
  },
  {
    title: "2D Rigid Body Physics",
    code: "EXP_03",
    category: "Interactive Engine",
    status: "Prototyping",
    description: "A lightweight physics sandbox testing impulse resolution, restitution, friction, and dynamic particle systems.",
  },
];

export function PlaygroundPreview() {
  const currentMode = useSyncExternalStore(
    subscribeSimulationMode,
    getSimulationModeSnapshot,
    getSimulationModeServerSnapshot
  );

  return (
    <section id="sandbox" className="py-28 lg:py-36 border-t border-border-subtle/50">
      <div className="mx-auto w-[92vw] max-w-[1536px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <ScrollReveal direction="up" delay={50}>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-12 border-b border-border-subtle/60">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-mono font-bold text-primary">
                <span>[ CHAPTER 03 // SIMULATION MATRIX ]</span>
              </div>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
                Interactive Proving Ground
              </h2>
              <p className="mt-4 text-base sm:text-lg text-text-muted leading-relaxed">
                Test and manipulate live particle physics directly within the WebGL scene below, while previewing experimental research queued for future milestones.
              </p>
            </div>
            <div className="font-mono text-xs text-text-subtle">
              SIMULATION_ACTIVE // 2,000 PARTICLES
            </div>
          </div>
        </ScrollReveal>

        {/* Live Interactive Simulation Console */}
        <ScrollReveal direction="up" delay={150}>
          <div className="mt-10 overflow-hidden rounded-2xl border border-primary/40 bg-surface/85 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border-subtle/80 pb-6">
              <div>
                <span className="font-mono text-[11px] text-primary uppercase tracking-widest font-bold">
                  SIMULATION CONTROLLER // 01. PARTICLE MATRIX
                </span>
                <p className="mt-1 text-sm text-text-muted">
                  Move your pointer across the viewport to manipulate the active gravitational force.
                </p>
              </div>

              {/* Mode Selectors */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSimulationMode("gravity")}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                    currentMode === "gravity"
                      ? "bg-primary text-midnight-void shadow-[0_0_16px_rgba(168,85,247,0.4)]"
                      : "bg-surface-raised border border-border-subtle text-text-muted hover:text-foreground"
                  }`}
                >
                  GRAVITY WELL
                </button>

                <button
                  type="button"
                  onClick={() => setSimulationMode("flow")}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                    currentMode === "flow"
                      ? "bg-cyan-400 text-midnight-void shadow-[0_0_16px_rgba(56,189,248,0.4)]"
                      : "bg-surface-raised border border-border-subtle text-text-muted hover:text-foreground"
                  }`}
                >
                  COSMIC FLOW
                </button>

                <button
                  type="button"
                  onClick={() => setSimulationMode("pulse")}
                  className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold transition-all ${
                    currentMode === "pulse"
                      ? "bg-soft-ultraviolet text-midnight-void shadow-[0_0_16px_rgba(216,180,254,0.4)]"
                      : "bg-surface-raised border border-border-subtle text-text-muted hover:text-foreground"
                  }`}
                >
                  SUPERNOVA PULSE
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-text-subtle">
              <span>ACTIVE_MODE: {currentMode.toUpperCase()}</span>
              <span>POINTER_INPUT: SYNCHRONIZED</span>
            </div>
          </div>
        </ScrollReveal>

        {/* Experiment Queues */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          {UPCOMING_EXPERIMENTS.map((exp, index) => (
            <ScrollReveal
              key={exp.title}
              direction="up"
              delay={100 + index * 100}
              className="h-full"
            >
              <div className="group relative flex h-full flex-col justify-between rounded-2xl border border-dashed border-border-strong/90 bg-surface/75 backdrop-blur-md p-7 sm:p-8 transition-all duration-300 hover:border-primary hover:bg-surface/90 hover:shadow-[0_16px_40px_rgba(168,85,247,0.14)]">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-primary">{exp.code} {"//"} {exp.category}</span>
                    <span className="rounded-full border border-border-subtle bg-surface-muted px-2.5 py-0.5 text-[10px] text-text-subtle">
                      {exp.status}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {exp.title}
                  </h3>

                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-text-muted">
                    {exp.description}
                  </p>
                </div>

                <div className="mt-8 border-t border-border-subtle/80 pt-5 flex items-center justify-between text-[11px] font-mono text-text-subtle">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    <span>In Active Design</span>
                  </span>
                  <span>Target: Milestone 4</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
