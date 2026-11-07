"use client";

import React, { useState } from "react";
import { ScrollReveal } from "@/components/visual/ScrollReveal";

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
      "Leveraging agentic AI pair-programming, codebase indexing, and multi-step verification workflows. Maintaining documentation integrity and test verification while developing faster and safer.",
    methods: ["Multi-Step Verification", "Codebase Indexing", "Test-Driven Reviews", "Spec Integrity"],
    specs: [
      { label: "WORKFLOW", value: "Verification Loops" },
      { label: "REVIEW", value: "Deep Code Inspection" },
      { label: "INTEGRITY", value: "Preserve Legacy Work" },
    ],
  },
  {
    id: "creative-tech",
    code: "// 04. INTERACTION",
    title: "Creative Technology",
    label: "3D Graphics & Kinetic UI",
    description:
      "Exploring WebGL 3D rendering, interactive canvas mechanics, 2D game loops, and responsive microinteractions. Crafting visual interfaces that feel tactile, responsive, and engaging.",
    methods: ["Three.js WebGL Scenegraph", "Kinetic Gyroscopic Math", "Canvas API Game Loops", "Fluid UI Interpolation"],
    specs: [
      { label: "GRAPHICS", value: "Three.js & WebGL" },
      { label: "PHYSICS", value: "Verlet & Euler" },
      { label: "FPS", value: "60–120 Target" },
    ],
  },
];

export function FocusAreas() {
  const [selectedId, setSelectedId] = useState(FOCUS_AREAS[0].id);
  const activeArea = FOCUS_AREAS.find((a) => a.id === selectedId) || FOCUS_AREAS[0];

  return (
    <section id="disciplines" className="relative py-28 lg:py-36 border-t border-border-subtle/50">
      <div className="mx-auto w-[92vw] max-w-[1536px] px-4 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Header */}
        <ScrollReveal direction="up" delay={50}>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-12 border-b border-border-subtle/60">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-primary">
                <span>[ CHAPTER 01 // DISCIPLINARY CONSTELLATION ]</span>
              </div>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-foreground">
                Engineering Disciplines & Rigor
              </h2>
              <p className="mt-4 text-base sm:text-lg text-text-muted leading-relaxed">
                A connected spatial matrix spanning architectural systems engineering, reliability, agentic AI workflows, and creative computing.
              </p>
            </div>
            <div className="hidden md:block font-mono text-xs text-text-subtle">
              SYS_MATRIX // 4 CONNECTED NODES
            </div>
          </div>
        </ScrollReveal>

        {/* Spatial Constellation Matrix */}
        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Interactive Node Selector Tabs */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {FOCUS_AREAS.map((area) => {
              const isSelected = area.id === selectedId;
              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => setSelectedId(area.id)}
                  className={`group relative flex flex-col items-start p-6 rounded-2xl border text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isSelected
                      ? "border-primary bg-surface/85 shadow-[0_0_24px_rgba(168,85,247,0.22)]"
                      : "border-border-subtle/80 bg-surface/35 hover:border-border-strong hover:bg-surface/60"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`font-mono text-[11px] font-bold tracking-wider transition-colors ${
                        isSelected ? "text-primary" : "text-text-subtle group-hover:text-foreground"
                      }`}
                    >
                      {area.code}
                    </span>
                    <span
                      className={`text-xs font-mono transition-transform duration-300 ${
                        isSelected ? "text-primary translate-x-1" : "text-text-subtle opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      SELECT_NODE →
                    </span>
                  </div>

                  <h3 className="mt-2 text-xl font-bold tracking-tight text-foreground">
                    {area.title}
                  </h3>
                  <p className="mt-1 text-xs font-mono text-text-muted">
                    {area.label}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Telemetry Inspector Panel */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-surface/80 p-8 sm:p-10 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between border-b border-border-subtle/80 pb-6">
                <div>
                  <span className="font-mono text-[11px] text-primary uppercase tracking-widest font-bold">
                    NODE_TELEMETRY // {activeArea.code}
                  </span>
                  <h3 className="mt-1 text-2xl sm:text-3xl font-extrabold text-foreground">
                    {activeArea.title}
                  </h3>
                </div>
                <div className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
                  ACTIVE_INSPECTION
                </div>
              </div>

              {/* Description */}
              <p className="mt-6 text-sm sm:text-base leading-relaxed text-text-muted">
                {activeArea.description}
              </p>

              {/* Methods List */}
              <div className="mt-8">
                <div className="text-[10px] font-mono uppercase tracking-wider text-text-subtle mb-3">
                  Applied Engineering Methods
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeArea.methods.map((method) => (
                    <div
                      key={method}
                      className="flex items-center gap-2.5 rounded-lg border border-border-subtle/80 bg-surface-raised/60 px-3.5 py-2 text-xs font-mono text-foreground"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{method}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="mt-8 border-t border-border-subtle/80 pt-6">
                <div className="text-[10px] font-mono uppercase tracking-wider text-text-subtle mb-3">
                  Telemetry Parameters
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {activeArea.specs.map((spec) => (
                    <div key={spec.label} className="rounded-lg bg-surface/50 p-3 border border-border-subtle/60">
                      <div className="text-[9px] font-mono text-text-subtle uppercase">{spec.label}</div>
                      <div className="text-xs font-mono font-bold text-foreground mt-0.5">{spec.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
