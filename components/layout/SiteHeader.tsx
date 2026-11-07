"use client";

import React, { useState, useEffect, useSyncExternalStore } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import {
  getNavigationSnapshot,
  getNavigationServerSnapshot,
  subscribeNavigation,
  enterExpedition,
  exitExpedition,
} from "@/lib/universeNavigation";

interface NavItem {
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/#hero" },
  { label: "About", href: "/#about" },
  { label: "Disciplines", href: "/#capabilities" },
  { label: "Projects", href: "/#projects" },
  { label: "Qualifications", href: "/#credentials" },
  { label: "Contact", href: "/#contact" },
];

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const nav = useSyncExternalStore(
    subscribeNavigation,
    getNavigationSnapshot,
    getNavigationServerSnapshot
  );

  const isExpedition = nav.experienceMode === "expedition";

  // Close mobile menu on ESC key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavClick = () => {
    if (isExpedition) {
      exitExpedition();
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full max-w-[100vw] overflow-x-clip border-b border-border-subtle bg-background/85 backdrop-blur-xl transition-colors duration-200">
      <div className="mx-auto flex h-16 w-full max-w-[1536px] items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link
          href="/#hero"
          onClick={handleNavClick}
          className="group inline-flex items-center gap-1.5 sm:gap-2 rounded-lg py-1 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary shrink-0"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border-strong bg-surface text-foreground font-mono text-xs font-bold transition-transform duration-200 group-hover:scale-105 group-hover:border-primary">
            CA
          </span>
          <span className="flex items-baseline gap-1 text-xs sm:text-base font-bold tracking-tight text-foreground whitespace-nowrap">
            <span className="hidden sm:inline">Christian </span>
            <span className="sm:hidden">Christian </span>
            <span>Angcla</span>
            <span className="text-text-subtle font-normal text-xs hidden md:inline">/ Lab</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          aria-label="Main Editorial Navigation"
          className="hidden items-center gap-1 xl:gap-2 md:flex"
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className="rounded-lg px-3 py-1.5 text-xs lg:text-sm font-medium text-text-muted transition-colors duration-150 hover:bg-surface-raised hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Action Deck (Resume + 3D Expedition Launcher + Theme Toggle) */}
        <div className="hidden items-center gap-2.5 md:flex shrink-0">
          <a
            href="/Christian-Angcla-Resume.pdf"
            download="Christian-Angcla-Resume.pdf"
            className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-surface px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors duration-200 hover:border-primary hover:bg-surface-raised hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            title="Download Resume (PDF)"
          >
            <span>Resume</span>
            <span aria-hidden="true">↓</span>
          </a>

          {!isExpedition ? (
            <button
              type="button"
              onClick={() => enterExpedition("origin")}
              className="group inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary backdrop-blur-md shadow-sm transition-all duration-200 hover:bg-primary hover:text-black hover:shadow-[0_0_20px_rgba(168,85,247,0.35)]"
              title="Launch Interactive 3D Space Expedition"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse group-hover:bg-black" />
              <span>Launch 3D Expedition ✦</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={exitExpedition}
              className="inline-flex items-center gap-1.5 rounded-full border border-border-strong bg-surface px-4 py-1.5 text-xs font-semibold text-text-muted hover:text-foreground hover:border-primary transition-all"
            >
              <span>✕ Return to Portfolio</span>
            </button>
          )}

          <ThemeToggle />
        </div>

        {/* Mobile Navigation Controls (Ultra-compact, zero-overflow on 390px) */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:hidden shrink-0">
          {!isExpedition ? (
            <button
              type="button"
              onClick={() => enterExpedition("origin")}
              className="inline-flex items-center gap-1 rounded-full border border-primary/50 bg-primary/15 px-2.5 py-1 text-xs font-bold text-primary"
              title="Launch 3D Expedition"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span>3D ✦</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={exitExpedition}
              className="inline-flex items-center gap-1 rounded-full border border-border-strong bg-surface px-2.5 py-1 text-xs font-semibold text-text-muted"
            >
              <span>✕ Exit</span>
            </button>
          )}

          <ThemeToggle />

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-subtle bg-surface text-foreground transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {mobileMenuOpen ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-b border-border-subtle bg-background/95 px-4 pt-2 pb-6 backdrop-blur-2xl md:hidden"
        >
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
                className="rounded-lg px-3 py-2 text-left text-base font-medium text-text-muted transition-colors hover:bg-surface-raised hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="/Christian-Angcla-Resume.pdf"
              download="Christian-Angcla-Resume.pdf"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-1 inline-flex items-center justify-between rounded-lg border border-border-strong bg-surface px-3 py-2 text-base font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <span>Download Resume (PDF)</span>
              <span aria-hidden="true">↓</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
