"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { EDUCATION_DATA } from "@/lib/resume";

export function AboutNarrativeScene() {
  const sectionRef = useRef<HTMLElement>(null);
  const marquee1Ref = useRef<HTMLDivElement>(null);
  const marquee2Ref = useRef<HTMLDivElement>(null);
  const focusStatementRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !sectionRef.current) {
      return;
    }

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop: Full cinematic horizontal scrub and focus expansion
      mm.add("(min-width: 1024px)", () => {
        // Horizontal text travel scrubbed to scroll
        const scrollTl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        scrollTl
          .fromTo(
            marquee1Ref.current,
            { x: 140 },
            { x: -180, ease: "none" },
            0
          )
          .fromTo(
            marquee2Ref.current,
            { x: -180 },
            { x: 140, ease: "none" },
            0
          );

        // Foreground focus statement expansion
        gsap.fromTo(
          focusStatementRef.current,
          { scale: 0.9, opacity: 0.3, y: 50 },
          {
            scale: 1.04,
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: focusStatementRef.current,
              start: "top 85%",
              end: "top 45%",
              scrub: 0.6,
            },
          }
        );

        // Two-column editorial entrance
        gsap.fromTo(
          leftColRef.current,
          { x: -80, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: leftColRef.current,
              start: "top 80%",
            },
          }
        );

        gsap.fromTo(
          rightColRef.current,
          { x: 80, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.0,
            ease: "power3.out",
            scrollTrigger: {
              trigger: rightColRef.current,
              start: "top 80%",
            },
          }
        );
      });

      // Mobile/Tablet: Graceful vertical reveals with subtle parallax
      mm.add("(max-width: 1023px)", () => {
        gsap.fromTo(
          [leftColRef.current, rightColRef.current],
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.2,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About Christian Angcla"
      className="py-24 sm:py-32 border-t border-border-subtle relative overflow-hidden"
    >
      {/* Background Kinetic Text Marquee Ribbons */}
      <div className="w-full overflow-hidden select-none pointer-events-none opacity-20 dark:opacity-15 mb-12 sm:mb-16">
        <div
          ref={marquee1Ref}
          className="whitespace-nowrap font-mono text-3xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tight text-foreground will-change-transform"
        >
          ENGINEERING DEPENDABLE SYSTEMS • ARCHITECTING FOR SCALE • RELIABLE RESILIENCE •
        </div>
        <div
          ref={marquee2Ref}
          className="whitespace-nowrap font-mono text-3xl sm:text-5xl lg:text-7xl font-black uppercase tracking-tight text-primary mt-2 will-change-transform"
        >
          FOR REAL-WORLD COMMUNITIES • DEFENSIVE DATA PIPELINES • HUMAN-CENTRIC CODE •
        </div>
      </div>

      <div className="mx-auto w-[92vw] max-w-[1536px] px-3 sm:px-6 lg:px-8 xl:px-12">
        {/* Section Eyebrow Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border-subtle">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary">
              01 // NARRATIVE &amp; PHILOSOPHY
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Bridging robust software engineering with immediate community impact.
            </h2>
          </div>
          <div className="text-xs font-mono text-text-subtle">
            National University Manila • CCIT
          </div>
        </div>

        {/* Central Expanding Focus Statement */}
        <div
          ref={focusStatementRef}
          className="my-10 sm:my-14 p-6 sm:p-10 rounded-2xl border border-primary/30 bg-surface/60 backdrop-blur-md shadow-xl text-center will-change-transform"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-primary font-bold block mb-2">
            CORE ENGINEERING MISSION
          </span>
          <p className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-foreground leading-tight max-w-4xl mx-auto">
            &ldquo;Transforming complex geospatial and civic challenges into
            accessible, resilient digital tools that communities can trust in moments of need.&rdquo;
          </p>
        </div>

        {/* Two-Column Editorial Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left 7 Columns: Personal Narrative */}
          <div
            ref={leftColRef}
            className="lg:col-span-7 flex flex-col gap-6 text-sm sm:text-base lg:text-lg text-text-muted leading-relaxed will-change-transform"
          >
            <p className="text-lg sm:text-xl font-semibold text-foreground leading-snug">
              Designing defensive full-stack architectures and high-performance interactive interfaces.
            </p>

            <p>
              As a 3rd-year Information Technology student at{" "}
              <span className="text-foreground font-semibold">
                National University Manila
              </span>
              , I specialize in Mobile and Web Applications. My work focuses on building
              resilient software tools—from predictive geospatial hydrological flood
              threshold monitoring for Marikina City to localized neighborhood
              economic empowerment networks.
            </p>

            <p>
              Beyond traditional academic frameworks, I pursue independent
              systems engineering in modern reactive web architectures, strict TypeScript
              type-safety contracts, and hardware-accelerated 3D graphics with Three.js.
              I believe software engineering achieves its highest potential when rigorous
              defensive stability is paired with an unforgettable user experience.
            </p>

            {/* Navigation Quick Links */}
            <div className="mt-4 flex flex-wrap items-center gap-6 pt-5 border-t border-border-subtle">
              <Link
                href="/#capabilities"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-foreground hover:text-primary transition-colors"
              >
                <span>Technical Disciplines ↓</span>
              </Link>
              <Link
                href="/#projects"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-foreground hover:text-primary transition-colors"
              >
                <span>Selected Works ↓</span>
              </Link>
              <Link
                href="/#credentials"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-text-muted hover:text-foreground transition-colors"
              >
                <span>Qualifications &amp; Résumé ↓</span>
              </Link>
            </div>
          </div>

          {/* Right 5 Columns: Verified Academic Snapshot Card */}
          <div
            ref={rightColRef}
            className="lg:col-span-5 flex flex-col gap-6 border-t lg:border-t-0 lg:border-l border-border-subtle pt-8 lg:pt-0 lg:pl-10 will-change-transform"
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-widest text-text-subtle">
                Academic Institution
              </span>
              <div className="text-lg sm:text-xl font-bold text-foreground mt-1">
                {EDUCATION_DATA[0].institution}
              </div>
              <div className="text-xs sm:text-sm text-text-muted mt-0.5">
                {EDUCATION_DATA[0].location}
              </div>
            </div>

            <div className="pt-5 border-t border-border-subtle">
              <span className="font-mono text-xs uppercase tracking-widest text-text-subtle">
                Degree &amp; Track Specialization
              </span>
              <div className="text-sm sm:text-base font-bold text-foreground mt-1">
                {EDUCATION_DATA[0].degree}
              </div>
              <div className="text-xs sm:text-sm text-primary font-medium mt-0.5">
                {EDUCATION_DATA[0].field}
              </div>
            </div>

            <div className="pt-5 border-t border-border-subtle grid grid-cols-2 gap-4 font-mono text-xs">
              <div>
                <span className="text-text-subtle">ACADEMIC STANDING:</span>
                <div className="text-foreground font-bold text-xs sm:text-sm mt-1">
                  {EDUCATION_DATA[0].status}
                </div>
              </div>
              <div>
                <span className="text-text-subtle">TIMELINE:</span>
                <div className="text-foreground font-bold text-xs sm:text-sm mt-1">
                  {EDUCATION_DATA[0].period}
                </div>
              </div>
            </div>

            {/* Core Competency Badges */}
            <div className="pt-5 border-t border-border-subtle">
              <span className="font-mono text-xs uppercase tracking-widest text-text-subtle block mb-3">
                Core Stack Focus
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  "TypeScript",
                  "React 19 / Next.js 15",
                  "Three.js / WebGL",
                  "Flutter / Dart",
                  "PostgreSQL / Supabase",
                  "Tailwind CSS",
                ].map((stack) => (
                  <span
                    key={stack}
                    className="rounded-lg border border-border-subtle bg-surface px-2.5 py-1 font-mono text-[11px] text-text-muted hover:border-primary/50 hover:text-foreground transition-colors"
                  >
                    {stack}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
