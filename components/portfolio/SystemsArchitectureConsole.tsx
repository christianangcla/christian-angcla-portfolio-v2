"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SKILL_CATEGORIES } from "@/lib/resume";

interface SchematicNode {
  name: string;
  type: string;
  detail: string;
  metric: string;
}

interface DisciplineSchematic {
  title: string;
  subtitle: string;
  color: string;
  nodes: SchematicNode[];
  dataFlowDescription: string;
}

const SCHEMATICS: Record<string, DisciplineSchematic> = {
  DOM_SYS: {
    title: "Next.js 15 Full-Stack Component Pipeline",
    subtitle: "Server Component Boundary & Streaming Hydration",
    color: "#a855f7",
    nodes: [
      { name: "Browser Viewport", type: "Client Shell", detail: "React 19 Concurrent Root, partial hydration, event handlers", metric: "60 FPS Render" },
      { name: "Edge Middleware", type: "Routing / Auth", detail: "Sub-10ms request routing, token verification, header inspection", metric: "<10ms Latency" },
      { name: "Server Component", type: "Node Runtime", detail: "Zero-bundle-size server execution, direct DB query, streaming SSR", metric: "0KB Bundle Impact" },
      { name: "Data Cache", type: "Persistent Cache", detail: "Revalidation tags, ISR static generation, response memoization", metric: "Tag Revalidation" },
    ],
    dataFlowDescription: "Bidirectional streaming pipeline with optimistic UI updates and strict TypeScript contracts.",
  },
  SRV_API: {
    title: "Defensive API & Schema Validation Gateway",
    subtitle: "Strict Input Sanitation & Relational Persistence",
    color: "#34d399",
    nodes: [
      { name: "Client Request", type: "REST / JSON", detail: "HTTPS payload, CSRF headers, rate-limiting fingerprint", metric: "TLS 1.3 Sealed" },
      { name: "Schema Guard", type: "Zod Validation", detail: "Strict runtime type-checking, payload sanitization, 400 rejection", metric: "100% Zod Validated" },
      { name: "Auth & Policies", type: "Row Level Security", detail: "JWT token validation, Supabase RLS permission enforcement", metric: "RLS Enforcement" },
      { name: "PostgreSQL DB", type: "ACID Storage", detail: "Relational foreign keys, indexing, defensive rollback transactions", metric: "ACID Compliant" },
    ],
    dataFlowDescription: "Multi-tier security verification stopping malformed payloads before database interaction.",
  },
  GPU_MOB: {
    title: "Mobile MVVM & Hardware-Accelerated 3D Pipeline",
    subtitle: "Reactive StateFlow & Three.js WebGL Frame Loop",
    color: "#38bdf8",
    nodes: [
      { name: "Compose / Flutter", type: "Declarative UI", detail: "Stateless composables, fluid gestures, dynamic theme adaptation", metric: "Declarative Tree" },
      { name: "State Container", type: "ViewModel Flow", detail: "Lifecycle-aware state persistence, CoroutineScope event dispatch", metric: "StateFlow Stream" },
      { name: "WebGL Engine", type: "Three.js Graph", detail: "BufferGeometries, PointsMaterial, directional lighting rig", metric: "DrawCall Batch" },
      { name: "GPU Rasterizer", type: "Hardware Canvas", detail: "60 FPS draw-calls, additive particle blending, viewport projection", metric: "Hardware VSync" },
    ],
    dataFlowDescription: "Hardware-accelerated mathematical trajectory computing and reactive mobile event dispatch.",
  },
  ENG_METH: {
    title: "Engineering Verification & Defensive Testing CI",
    subtitle: "Strict Typing, Static Analysis & Error Isolation",
    color: "#f59e0b",
    nodes: [
      { name: "TypeScript Guard", type: "Compiler Check", detail: "Strict null checks, generic constraint boundaries, zero any escape", metric: "Strict Typing" },
      { name: "ESLint Rigor", type: "Static Analysis", detail: "Automated lint rules, React 19 compiler compliance, zero dead code", metric: "Clean Rules" },
      { name: "Error Boundaries", type: "Runtime Safety", detail: "Graceful component degradation, fallback UI isolation, crash proofing", metric: "Zero App Crash" },
      { name: "Version Integrity", type: "Git Verification", detail: "Branch hygiene, atomic task separation, reproducible build audits", metric: "Atomic Commits" },
    ],
    dataFlowDescription: "Multi-layer verification pipeline ensuring reliable, crash-free execution in production.",
  },
};

export function SystemsArchitectureConsole() {
  const [selectedKey, setSelectedKey] = useState<string>("DOM_SYS");
  const [inspectedNode, setInspectedNode] = useState<SchematicNode | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const busPathRef = useRef<SVGPathElement>(null);
  const nodeCardsRef = useRef<HTMLDivElement>(null);

  const activeCategory = SKILL_CATEGORIES.find((c) => c.code === selectedKey) || SKILL_CATEGORIES[0];
  const activeSchematic = SCHEMATICS[selectedKey] || SCHEMATICS.DOM_SYS;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Initial Scroll-Triggered Assembly
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      if (busPathRef.current) {
        const length = busPathRef.current.getTotalLength();
        gsap.set(busPathRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        tl.to(busPathRef.current, {
          strokeDashoffset: 0,
          duration: 1.5,
          ease: "power2.inOut",
        });
      }

      if (nodeCardsRef.current) {
        const cards = nodeCardsRef.current.children;
        tl.fromTo(
          cards,
          { y: 30, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.15,
            duration: 0.8,
            ease: "back.out(1.4)",
          },
          "-=1.0"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [selectedKey]);

  return (
    <div ref={containerRef} className="w-full">
      {/* 4 Architectural Domain Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 border-b border-border-subtle pb-5">
        {SKILL_CATEGORIES.map((cat, idx) => {
          const isActive = cat.code === selectedKey;
          const schematic = SCHEMATICS[cat.code] || SCHEMATICS.DOM_SYS;
          return (
            <button
              key={cat.code}
              type="button"
              onClick={() => {
                setSelectedKey(cat.code);
                setInspectedNode(null);
              }}
              className={`flex flex-col items-start p-3.5 sm:p-4 rounded-xl text-left transition-all duration-300 border ${
                isActive
                  ? "bg-surface-raised border-primary/60 shadow-lg text-foreground scale-[1.01]"
                  : "bg-surface/50 border-border-subtle text-text-muted hover:border-primary/40 hover:text-foreground hover:bg-surface-raised/40"
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-mono text-xs font-bold text-primary">
                  0{idx + 1}
                </span>
                {isActive && (
                  <span
                    className="h-2 w-2 rounded-full animate-ping"
                    style={{ backgroundColor: schematic.color }}
                  />
                )}
              </div>
              <div className="font-bold text-xs sm:text-sm text-foreground mt-2">
                {cat.title}
              </div>
              <div className="text-[11px] font-mono text-text-subtle truncate max-w-full mt-0.5">
                {cat.description}
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Architecture Console Body */}
      <div className="mt-8 rounded-2xl border border-border-subtle bg-surface/70 backdrop-blur-md p-5 sm:p-8 shadow-xl">
        {/* Schematic Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
          <div>
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: activeSchematic.color }}
              />
              <span className="font-mono text-xs font-semibold tracking-wider uppercase text-text-subtle">
                PIPELINE SPECIFICATION
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-1">
              {activeSchematic.title}
            </h3>
            <p className="text-xs sm:text-sm text-text-muted mt-0.5">
              {activeSchematic.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-text-subtle">TELEMETRY:</span>
            <span className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary font-bold">
              PASSING ALL CHECKS
            </span>
          </div>
        </div>

        {/* Animated Vector Pipeline Schematic (Desktop & Tablet) */}
        <div className="hidden sm:block my-8 relative">
          <svg className="w-full h-12" viewBox="0 0 800 48" fill="none">
            {/* Background conduit line */}
            <line x1="40" y1="24" x2="760" y2="24" stroke="currentColor" strokeOpacity="0.1" strokeWidth="2" strokeDasharray="4 4" />
            
            {/* Animated drawing bus path */}
            <path
              ref={busPathRef}
              d="M 40 24 L 760 24"
              stroke={activeSchematic.color}
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Signal pulse packet traveling along path */}
            <circle cx="200" cy="24" r="5" fill={activeSchematic.color} className="animate-ping" opacity="0.6" />
            <circle cx="400" cy="24" r="5" fill={activeSchematic.color} className="animate-ping" opacity="0.6" />
            <circle cx="600" cy="24" r="5" fill={activeSchematic.color} className="animate-ping" opacity="0.6" />

            {/* Junction Nodes on SVG */}
            <circle cx="100" cy="24" r="6" fill="#12121A" stroke={activeSchematic.color} strokeWidth="2" />
            <circle cx="300" cy="24" r="6" fill="#12121A" stroke={activeSchematic.color} strokeWidth="2" />
            <circle cx="500" cy="24" r="6" fill="#12121A" stroke={activeSchematic.color} strokeWidth="2" />
            <circle cx="700" cy="24" r="6" fill="#12121A" stroke={activeSchematic.color} strokeWidth="2" />
          </svg>
        </div>

        {/* 4 Interactive Schematic Nodes */}
        <div
          ref={nodeCardsRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {activeSchematic.nodes.map((node, i) => {
            const isHovered = inspectedNode?.name === node.name;
            return (
              <div
                key={node.name}
                onMouseEnter={() => setInspectedNode(node)}
                onClick={() => setInspectedNode(node)}
                className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isHovered
                    ? "bg-surface-raised border-primary shadow-lg scale-[1.02]"
                    : "bg-surface/50 border-border-subtle hover:border-primary/40 hover:bg-surface-raised/40"
                }`}
              >
                <div className="flex items-center justify-between font-mono text-[11px] text-text-subtle">
                  <span>STAGE 0{i + 1}</span>
                  <span className="text-primary font-bold">{node.metric}</span>
                </div>
                <div className="font-bold text-sm text-foreground mt-2">
                  {node.name}
                </div>
                <div className="text-xs text-primary font-medium mt-0.5">
                  {node.type}
                </div>
                <p className="text-xs text-text-muted mt-2 leading-relaxed">
                  {node.detail}
                </p>
              </div>
            );
          })}
        </div>

        {/* Active Node Detail Readout */}
        <div className="mt-6 pt-5 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold">FLOW CONTRACT:</span>
            <span className="text-text-muted">
              {inspectedNode
                ? `Inspecting [${inspectedNode.name}]: ${inspectedNode.detail}`
                : activeSchematic.dataFlowDescription}
            </span>
          </div>
          <span className="text-[11px] text-text-subtle whitespace-nowrap">
            Hover or tap any stage to inspect
          </span>
        </div>

        {/* Verified Technical Skills Matrix */}
        <div className="mt-8 pt-6 border-t border-border-subtle">
          <span className="font-mono text-xs uppercase tracking-widest text-text-subtle block mb-3">
            VERIFIED STACK FOR {activeCategory.title.toUpperCase()}
          </span>
          <div className="flex flex-wrap gap-2">
            {activeCategory.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-lg border border-border-subtle bg-surface px-3 py-1 font-mono text-xs text-text-muted hover:border-primary hover:text-foreground transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
