"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROFILE_INFO } from "@/lib/resume";
import { enterExpedition } from "@/lib/universeNavigation";

export function ContactClosingScene() {
  const [copied, setCopied] = useState(false);
  const [manilaTime, setManilaTime] = useState("");

  const sectionRef = useRef<HTMLElement>(null);
  const lineLeftRef = useRef<HTMLSpanElement>(null);
  const lineRightRef = useRef<HTMLSpanElement>(null);
  const contactCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setManilaTime(new Intl.DateTimeFormat("en-US", options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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

    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Desktop: Converging Typography & Card Reveal
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        });

        tl.fromTo(
          lineLeftRef.current,
          { x: -120, opacity: 0 },
          { x: 0, opacity: 1, duration: 1.0, ease: "power3.out" }
        )
          .fromTo(
            lineRightRef.current,
            { x: 120, opacity: 0 },
            { x: 0, opacity: 1, duration: 1.0, ease: "power3.out" },
            "-=0.8"
          )
          .fromTo(
            contactCardRef.current,
            { scale: 0.92, opacity: 0, y: 40 },
            { scale: 1, opacity: 1, y: 0, duration: 1.1, ease: "back.out(1.3)" },
            "-=0.6"
          );
      });

      // Mobile/Tablet: Vertical entrance
      mm.add("(max-width: 1023px)", () => {
        gsap.fromTo(
          contactCardRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
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
      id="contact"
      aria-label="Contact Christian Angcla"
      className="py-24 sm:py-36 border-t border-border-subtle relative overflow-hidden"
    >
      <div className="mx-auto w-[92vw] max-w-[1536px] px-3 sm:px-6 lg:px-8 xl:px-12">
        {/* Converging Kinetic Typography Header */}
        <div className="text-center overflow-hidden">
          <span className="font-mono text-xs font-semibold uppercase tracking-widest text-primary block mb-3">
            05 // TRANSMISSION &amp; CONTACT
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-foreground leading-[1.05]">
            <span
              ref={lineLeftRef}
              className="inline-block mr-3 sm:mr-5 will-change-transform"
            >
              Let&apos;s Build Something
            </span>
            <span
              ref={lineRightRef}
              className="inline-block text-primary will-change-transform"
            >
              Extraordinary.
            </span>
          </h2>
          <p className="mt-5 text-base sm:text-xl text-text-muted max-w-2xl mx-auto font-normal">
            Currently open for 2026 Software Engineering internships, full-stack web
            architectures, and high-impact technical collaborations.
          </p>
        </div>

        {/* Central Focal Action Console */}
        <div
          ref={contactCardRef}
          className="mt-14 max-w-3xl mx-auto rounded-3xl border border-primary/30 bg-surface/80 backdrop-blur-xl p-8 sm:p-12 shadow-2xl text-center will-change-transform"
        >
          {/* Live Telemetry Status Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-border-subtle text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-foreground font-semibold">
                ACCEPTING INQUIRIES
              </span>
            </div>

            <div className="text-text-muted">
              MANILA TIME:{" "}
              <span className="text-foreground font-bold">
                {manilaTime || "UTC+8"}
              </span>
            </div>
          </div>

          {/* Direct Email Display with 1-Click Copy */}
          <div className="my-8">
            <div className="font-mono text-xs text-text-subtle uppercase tracking-widest mb-2">
              Primary Electronic Mail
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight break-all">
              {PROFILE_INFO.email}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${PROFILE_INFO.email}?subject=Project%20Collaboration%20Inquiry%20-%20Christian%20Angcla`}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-8 text-sm font-semibold text-background shadow-lg transition-transform hover:scale-105"
            >
              <span>Compose Email Directly ↗</span>
            </a>

            <button
              type="button"
              onClick={copyEmail}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border-subtle bg-surface px-6 text-sm font-mono font-medium text-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <span>{copied ? "Copied to Clipboard! ✓" : "Copy to Clipboard"}</span>
            </button>
          </div>

          {/* Social Profiles & Expedition Portal */}
          <div className="mt-8 pt-6 border-t border-border-subtle flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-4 text-text-muted">
              <a
                href={PROFILE_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                GitHub ↗
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                LinkedIn ↗
              </a>
            </div>

            <button
              type="button"
              onClick={() => enterExpedition("origin")}
              className="inline-flex items-center gap-1.5 text-primary hover:text-foreground transition-colors font-bold"
            >
              <span>Launch 3D Space Expedition ✦</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
