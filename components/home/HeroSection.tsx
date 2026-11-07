import React from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/visual/ScrollReveal";

export function HeroSection() {
  return (
    <section id="hero" className="relative min-h-[94vh] flex items-center overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 xl:pt-24 xl:pb-40">
      <div className="mx-auto w-[92vw] max-w-[1536px] px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          {/* Left Column: Mission Telemetry, Editorial Typography & Core CTAs */}
          <div className="flex flex-col items-start lg:col-span-7 xl:col-span-7">
            <ScrollReveal direction="up" delay={50}>
              {/* Telemetry / Identity Header Tag */}
              <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-border-strong/80 bg-surface/40 px-4 py-1.5 text-xs font-mono text-text-muted shadow-sm backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--status-green,#10b981)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--status-green,#10b981)]" />
                </span>
                <span className="tracking-wide">
                  SYS_CORE_ACTIVE <span className="text-primary font-bold">{"//"}</span> BSIT 3RD YEAR <span className="text-primary font-bold">{"//"}</span> NATIONAL UNIVERSITY
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={150}>
              {/* Master Statement with Editorial Contrast */}
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl xl:text-8xl text-foreground leading-[1.04]">
                Building systems.{" "}
                <span className="block mt-2 bg-gradient-to-r from-primary via-soft-ultraviolet to-sky-400 bg-clip-text text-transparent">
                  Exploring the unknown.
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={250}>
              {/* Engineering Identity Description */}
              <p className="mt-8 max-w-2xl text-base leading-relaxed text-text-muted sm:text-lg lg:text-xl font-normal">
                Welcome to <span className="font-semibold text-foreground">Christian’s Lab</span> — the personal engineering laboratory and portfolio of{" "}
                <span className="font-medium text-foreground">Christian Constantino Angcla</span>. Dedicated to architecting reliable full-stack applications, exploring interactive graphics, and turning complex community problems into accessible digital tools.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={350}>
              {/* Interactive Primary & Secondary CTAs */}
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="/#systems"
                  className="group relative inline-flex h-12 items-center justify-center gap-2.5 rounded-xl bg-primary px-8 text-sm font-semibold text-midnight-void shadow-[0_0_28px_rgba(168,85,247,0.42)] transition-all duration-300 hover:bg-primary-hover hover:scale-[1.02] hover:shadow-[0_0_36px_rgba(168,85,247,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <span>Explore Featured Builds</span>
                  <svg
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>

                <Link
                  href="/#transmission"
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-border-strong/80 bg-surface/40 px-8 text-sm font-semibold text-foreground backdrop-blur-sm transition-all duration-300 hover:border-primary hover:bg-surface/80 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Initiate Transmission
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={450}>
              {/* Laboratory Telemetry & Key Specs */}
              <div className="mt-14 grid grid-cols-3 gap-4 sm:gap-6 border-t border-border-subtle/60 pt-8 w-full max-w-xl">
                <div className="rounded-xl border border-border-subtle/80 bg-surface/35 p-4 backdrop-blur-sm transition-colors hover:border-border-strong">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-text-subtle">
                    {"// SPEC_01"}
                  </div>
                  <div className="mt-1 text-2xl sm:text-3xl font-black text-primary font-mono">
                    04
                  </div>
                  <div className="text-xs text-text-muted font-medium mt-0.5">
                    Documented Systems
                  </div>
                </div>

                <div className="rounded-xl border border-border-subtle/80 bg-surface/35 p-4 backdrop-blur-sm transition-colors hover:border-border-strong">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-text-subtle">
                    {"// SPEC_02"}
                  </div>
                  <div className="mt-1 text-2xl sm:text-3xl font-black text-foreground font-mono">
                    3rd Yr
                  </div>
                  <div className="text-xs text-text-muted font-medium mt-0.5">
                    BSIT Degree (NU)
                  </div>
                </div>

                <div className="rounded-xl border border-border-subtle/80 bg-surface/35 p-4 backdrop-blur-sm transition-colors hover:border-border-strong">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-text-subtle">
                    {"// SPEC_03"}
                  </div>
                  <div className="mt-1 text-2xl sm:text-3xl font-black text-foreground font-mono">
                    v2.0
                  </div>
                  <div className="text-xs text-text-muted font-medium mt-0.5">
                    Modular Foundation
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Column: Spatial Telemetry Portal Framing the 3D Artifact */}
          <div className="relative flex justify-center items-center lg:col-span-5 xl:col-span-5 pointer-events-none">
            <ScrollReveal direction="none" delay={200} className="w-full max-w-[480px] aspect-square relative flex items-center justify-center">
              {/* Subtle HUD Reticle Ring framing the 3D artifact */}
              <div className="absolute inset-0 rounded-full border border-dashed border-primary/25 animate-[spin_80s_linear_infinite]" />
              <div className="absolute inset-8 rounded-full border border-border-strong/30" />
              
              {/* Orbital Telemetry Markers */}
              <div className="absolute top-2 left-6 bg-surface/60 backdrop-blur-sm border border-border-subtle px-2.5 py-1 rounded text-[10px] font-mono text-text-subtle">
                ARTIFACT // GYRO_SINGULARITY
              </div>
              <div className="absolute bottom-4 right-6 bg-surface/60 backdrop-blur-sm border border-border-subtle px-2.5 py-1 rounded text-[10px] font-mono text-primary">
                ORBITAL_PLANE // 00
              </div>
              
              {/* Hairline Crosshairs */}
              <div className="absolute inset-x-0 top-1/2 h-px bg-primary/10" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-primary/10" />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
