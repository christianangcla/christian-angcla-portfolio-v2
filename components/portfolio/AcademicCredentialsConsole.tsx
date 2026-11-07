"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EDUCATION_DATA, PROFILE_INFO } from "@/lib/resume";

interface TimelineMilestone {
  year: string;
  phase: string;
  summary: string;
  coursework: string[];
  competency: string;
}

const MILESTONES: TimelineMilestone[] = [
  {
    year: "2023",
    phase: "Year 1 // Foundation & Algorithms",
    summary: "Rigorous focus on core computer science foundations, discrete mathematics, and object-oriented programming.",
    coursework: ["Computer Programming & Logic", "Data Structures & Algorithms", "Discrete Mathematics", "Database Fundamentals"],
    competency: "Algorithmic Foundations",
  },
  {
    year: "2024",
    phase: "Year 2 // Web Systems & Architecture",
    summary: "Full-stack web architectures, client-server component models, RESTful APIs, and relational schema normalization.",
    coursework: ["Web Systems & Technologies", "Object-Oriented Programming (OOP)", "Advanced Database Systems", "Network Architecture"],
    competency: "Full-Stack Web Pipelines",
  },
  {
    year: "2025",
    phase: "Year 3 // Mobile Applications & Spatial Prototypes",
    summary: "Android cross-platform mobile development with Flutter & Dart, geospatial hydrological modeling, and hardware-accelerated 3D graphics.",
    coursework: ["Mobile Application Development", "Defensive Programming", "Systems Integration & Architecture", "Software Engineering Methods"],
    competency: "Reactive Mobile & WebGL",
  },
  {
    year: "2026",
    phase: "Year 3-4 // Production Systems & Internships",
    summary: "Targeting 2026 software engineering internships, distributed reactive architectures, and community-driven technology deployment.",
    coursework: ["Capstone System Implementation", "Cloud Computing & DevOps", "Information Assurance & Security", "Interactive WebGL Exploration"],
    competency: "Production Engineering Readiness",
  },
];

export function AcademicCredentialsConsole() {
  const [selectedMilestone, setSelectedMilestone] = useState<TimelineMilestone>(MILESTONES[2]);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const milestoneNodesRef = useRef<HTMLDivElement>(null);

  const copyEmail = () => {
    navigator.clipboard.writeText(PROFILE_INFO.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Draw SVG circuit path scrubbed to scroll
      if (pathRef.current) {
        const length = pathRef.current.getTotalLength();
        gsap.set(pathRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(pathRef.current, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 70%",
            end: "bottom 80%",
            scrub: 0.8,
          },
        });
      }

      // 2. Sequential milestone entrance
      if (milestoneNodesRef.current) {
        const nodes = milestoneNodesRef.current.children;
        gsap.fromTo(
          nodes,
          { x: -30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: milestoneNodesRef.current,
              start: "top 80%",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      {/* CV & Qualifications Top Header Strip */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border-subtle">
        <div>
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            04 // QUALIFICATIONS &amp; CREDENTIALS
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Academic qualifications &amp; verified engineering timeline.
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`mailto:${PROFILE_INFO.email}?subject=Official%20Resume%20Inquiry%20-%20Christian%20Angcla`}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-xs font-semibold text-background hover:opacity-90 transition-opacity shadow-md"
          >
            <span>Request Official Résumé PDF ↗</span>
          </a>

          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface px-4 py-2.5 text-xs font-mono font-medium text-text-muted hover:text-foreground hover:border-primary transition-colors"
          >
            <span>{copied ? "Copied! ✓" : "Copy Email"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Progressive Timeline & Curriculum Breakdown */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Progressively Drawn Timeline Track */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="flex items-center justify-between font-mono text-xs text-text-subtle pb-2 border-b border-border-subtle">
            <span className="text-primary font-bold">PROGRESSIVE TIMELINE TRACK</span>
            <span>2023 — 2026 HORIZON</span>
          </div>

          {/* Interactive Milestone Selector Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {MILESTONES.map((m) => {
              const isSelected = m.year === selectedMilestone.year;
              return (
                <button
                  key={m.year}
                  type="button"
                  onClick={() => setSelectedMilestone(m)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "bg-surface-raised border-primary text-foreground shadow-md scale-[1.02]"
                      : "bg-surface/50 border-border-subtle text-text-muted hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  <div className="font-mono text-lg font-bold text-foreground">
                    {m.year}
                  </div>
                  <div className="text-[11px] font-mono text-primary font-medium truncate mt-0.5">
                    {m.competency}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Detailed Selected Milestone Card */}
          <div className="rounded-2xl border border-primary/30 bg-surface/70 backdrop-blur-md p-6 shadow-xl">
            <div className="flex items-center justify-between font-mono text-xs text-text-subtle pb-3 border-b border-border-subtle">
              <span className="text-primary font-bold">{selectedMilestone.phase}</span>
              <span>ACADEMIC FOCUS</span>
            </div>

            <p className="mt-4 text-sm sm:text-base text-foreground leading-relaxed">
              {selectedMilestone.summary}
            </p>

            <div className="mt-6 pt-5 border-t border-border-subtle">
              <span className="font-mono text-xs uppercase tracking-widest text-text-subtle block mb-3">
                Key Coursework &amp; Competencies
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedMilestone.coursework.map((course, cIdx) => (
                  <div
                    key={cIdx}
                    className="flex items-center gap-2 p-2.5 rounded-lg border border-border-subtle bg-surface/60 text-xs font-mono text-text-muted"
                  >
                    <span className="text-primary font-bold">#0{cIdx + 1}</span>
                    <span className="truncate">{course}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Academic Credentials Snapshot */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="flex items-center justify-between font-mono text-xs text-text-subtle pb-2 border-b border-border-subtle">
            <span className="text-primary font-bold">VERIFIED INSTITUTION</span>
            <span>CHED ACCREDITED</span>
          </div>

          <div className="p-6 rounded-2xl border border-border-subtle bg-surface/70 backdrop-blur-md shadow-xl flex flex-col gap-5">
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-text-subtle">
                University
              </span>
              <div className="text-xl font-bold text-foreground mt-1">
                {EDUCATION_DATA[0].institution}
              </div>
              <div className="text-xs text-text-muted mt-0.5">
                {EDUCATION_DATA[0].location}
              </div>
            </div>

            <div className="pt-4 border-t border-border-subtle">
              <span className="font-mono text-xs uppercase tracking-widest text-text-subtle">
                Degree Program
              </span>
              <div className="text-base font-bold text-foreground mt-1">
                {EDUCATION_DATA[0].degree}
              </div>
              <div className="text-xs text-primary font-medium mt-0.5">
                {EDUCATION_DATA[0].field}
              </div>
            </div>

            <div className="pt-4 border-t border-border-subtle grid grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <span className="text-text-subtle">STANDING:</span>
                <div className="text-foreground font-bold mt-1">
                  {EDUCATION_DATA[0].status}
                </div>
              </div>
              <div>
                <span className="text-text-subtle">GRADUATION:</span>
                <div className="text-foreground font-bold mt-1">
                  Expected 2026
                </div>
              </div>
            </div>

            {/* Direct Official Contact Verification */}
            <div className="pt-4 border-t border-border-subtle font-mono text-xs">
              <span className="text-text-subtle block mb-1">OFFICIAL CONTACT:</span>
              <div className="text-foreground font-semibold truncate">
                {PROFILE_INFO.email}
              </div>
              <div className="text-text-muted text-[11px] mt-0.5">
                {PROFILE_INFO.location}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
