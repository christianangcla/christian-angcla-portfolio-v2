"use client";

import React from "react";
import Link from "next/link";
import { enterExpedition } from "@/lib/universeNavigation";
import { PROFILE_INFO } from "@/lib/resume";

export function SiteFooter() {
  const currentYear = 2026;

  return (
    <footer className="w-full border-t border-border-subtle bg-surface/50 transition-colors duration-200 mt-20">
      <div className="mx-auto w-[92vw] max-w-[1536px] px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Identity & Status */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <span className="font-bold tracking-tight text-foreground text-lg">
                Christian’s <span className="text-primary">Lab</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface-raised px-2.5 py-0.5 text-xs text-text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Recruiter Ready</span>
              </span>
            </div>
            <p className="max-w-md text-xs sm:text-sm leading-relaxed text-text-muted">
              {PROFILE_INFO.fullName} • {PROFILE_INFO.tagline}. Engineering scalable full-stack web applications, defensive architecture, and interactive computing.
            </p>
          </div>

          {/* Quick Editorial Links */}
          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-text-muted">
            <Link href="/#hero" className="transition-colors hover:text-foreground">
              Overview
            </Link>
            <Link href="/#about" className="transition-colors hover:text-foreground">
              About
            </Link>
            <Link href="/#capabilities" className="transition-colors hover:text-foreground">
              Disciplines
            </Link>
            <Link href="/#projects" className="transition-colors hover:text-foreground">
              Projects
            </Link>
            <Link href="/#credentials" className="transition-colors hover:text-foreground">
              Qualifications
            </Link>
            <Link href="/#contact" className="transition-colors hover:text-foreground">
              Contact
            </Link>
            <a
              href="/Christian-Angcla-Resume.pdf"
              download="Christian-Angcla-Resume.pdf"
              className="transition-colors hover:text-foreground"
            >
              Resume ↓
            </a>
            <button
              type="button"
              onClick={() => enterExpedition("origin")}
              className="text-primary font-mono font-bold hover:underline"
            >
              [ 3D Expedition ✦ ]
            </button>
          </nav>
        </div>

        {/* Bottom Colophon Bar */}
        <div className="mt-8 border-t border-border-subtle pt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-text-subtle font-mono">
          <p>© {currentYear} {PROFILE_INFO.fullName}. National University Manila.</p>
          <p>
            Christian’s Lab <span className="text-primary">v3.0</span> • Professional Portfolio & 3D Universe
          </p>
        </div>
      </div>
    </footer>
  );
}
