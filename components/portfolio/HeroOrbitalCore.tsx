"use client";

import React, { useState, useEffect, useRef } from "react";

interface DisciplineNode {
  id: string;
  label: string;
  domain: string;
  tech: string;
  cx: number;
  cy: number;
  angle: number;
  color: string;
}

const NODES: DisciplineNode[] = [
  {
    id: "web",
    label: "Web Architecture",
    domain: "01 // FULL-STACK",
    tech: "Next.js 15 • TypeScript • React 19",
    cx: 260,
    cy: 80,
    angle: 45,
    color: "#a855f7",
  },
  {
    id: "mobile",
    label: "Mobile Systems",
    domain: "02 // ANDROID",
    tech: "Kotlin • Jetpack Compose • MVVM",
    cx: 400,
    cy: 220,
    angle: 135,
    color: "#38bdf8",
  },
  {
    id: "data",
    label: "Defensive Data",
    domain: "03 // BACKEND",
    tech: "PostgreSQL • REST APIs • Security",
    cx: 260,
    cy: 360,
    angle: 225,
    color: "#34d399",
  },
  {
    id: "graphics",
    label: "Spatial Graphics",
    domain: "04 // WEBGL",
    tech: "Three.js • Shaders • Physics",
    cx: 120,
    cy: 220,
    angle: 315,
    color: "#f59e0b",
  },
];

export function HeroOrbitalCore() {
  const [activeNode, setActiveNode] = useState<DisciplineNode>(NODES[0]);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);
      setMouseOffset({
        x: Math.max(-1, Math.min(1, x)) * 10,
        y: Math.max(-1, Math.min(1, y)) * 10,
      });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[420px] lg:max-w-[480px] aspect-square flex items-center justify-center select-none overflow-hidden"
      style={{
        perspective: "1000px",
      }}
    >
      {/* Subtle Backlight Gradient Wash */}
      <div
        className="pointer-events-none absolute -inset-6 rounded-full opacity-35 dark:opacity-45 blur-3xl transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle, ${activeNode.color}35 0%, rgba(56,189,248,0.12) 45%, transparent 70%)`,
        }}
      />

      {/* Tilt Container */}
      <div
        className="relative w-full h-full transition-transform duration-300 ease-out flex items-center justify-center overflow-hidden"
        style={{
          transform: `rotateX(${-mouseOffset.y}deg) rotateY(${mouseOffset.x}deg)`,
        }}
      >
        <svg
          viewBox="0 0 520 440"
          className="w-full h-full overflow-hidden drop-shadow-2xl"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Radar Beam Gradient */}
            <linearGradient id="radarSweepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#a855f7" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="coreGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Coordinate Crosshairs */}
          <line x1="260" y1="20" x2="260" y2="420" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="3 3" />
          <line x1="60" y1="220" x2="460" y2="220" stroke="currentColor" strokeOpacity="0.06" strokeDasharray="3 3" />

          {/* Concentric Precision Orbital Rings */}
          <circle cx="260" cy="220" r="180" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" />
          <circle cx="260" cy="220" r="140" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="260" cy="220" r="95" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1.2" />
          <circle cx="260" cy="220" r="50" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1.5" />

          {/* Radar Sweep Arc */}
          <g className="origin-[260px_220px] animate-radar-sweep">
            <path
              d="M 260 220 L 260 40 A 180 180 0 0 1 387 93 Z"
              fill="url(#radarSweepGrad)"
            />
            <line x1="260" y1="220" x2="260" y2="40" stroke="#a855f7" strokeWidth="1.5" strokeOpacity="0.75" />
          </g>

          {/* Active Vector to Selected Node */}
          <line
            x1="260"
            y1="220"
            x2={activeNode.cx}
            y2={activeNode.cy}
            stroke={activeNode.color}
            strokeWidth="1.8"
            strokeDasharray="4 3"
            className="transition-all duration-300"
          />

          {/* 4 Technical Pillar Nodes */}
          {NODES.map((node) => {
            const isSelected = activeNode.id === node.id;
            return (
              <g
                key={node.id}
                className="cursor-pointer group"
                onClick={() => setActiveNode(node)}
                onMouseEnter={() => setActiveNode(node)}
              >
                {/* Node Target Ring */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={isSelected ? "22" : "16"}
                  fill="var(--surface)"
                  stroke={isSelected ? node.color : "currentColor"}
                  strokeOpacity={isSelected ? 1 : 0.25}
                  strokeWidth={isSelected ? 2 : 1}
                  className="transition-all duration-300 group-hover:stroke-primary"
                />

                {/* Inner Node Core */}
                <circle
                  cx={node.cx}
                  cy={node.cy}
                  r={isSelected ? "6" : "4"}
                  fill={isSelected ? node.color : "currentColor"}
                  fillOpacity={isSelected ? 1 : 0.4}
                  className="transition-all duration-300"
                />

                {/* Outer Ping on Active Node */}
                {isSelected && (
                  <circle
                    cx={node.cx}
                    cy={node.cy}
                    r="28"
                    stroke={node.color}
                    strokeWidth="1"
                    fill="none"
                    className="animate-ping-pulse opacity-60"
                  />
                )}
              </g>
            );
          })}

          {/* Central Lab Reactor Core */}
          <circle
            cx="260"
            cy="220"
            r="16"
            fill="var(--surface-raised)"
            stroke="#a855f7"
            strokeWidth="2"
            filter="url(#coreGlow)"
          />
          <circle cx="260" cy="220" r="5" fill="#a855f7" className="animate-pulse" />
        </svg>

        {/* Floating Telemetry HUD Card inside Core */}
        <div className="absolute -bottom-4 sm:bottom-0 left-1/2 -translate-x-1/2 w-[90%] max-w-[340px] rounded-xl border border-border-subtle bg-surface/85 backdrop-blur-xl p-3 shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between text-[11px] font-mono pb-1.5 border-b border-border-subtle">
            <span className="text-primary font-bold">{activeNode.domain}</span>
            <span className="flex items-center gap-1.5 text-text-subtle">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>ACTIVE SYSTEM</span>
            </span>
          </div>

          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-sm font-bold text-foreground">
              {activeNode.label}
            </span>
            <span className="text-[10px] font-mono text-text-muted">
              TAP NODE
            </span>
          </div>

          <div className="mt-1 text-xs text-text-muted font-mono leading-tight">
            {activeNode.tech}
          </div>
        </div>
      </div>
    </div>
  );
}
