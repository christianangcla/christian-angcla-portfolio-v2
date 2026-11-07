"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Extend window definition to hold the live Lenis instance
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function scrollToChapter(chapterId: string) {
  if (typeof window === "undefined") return;
  // Scene-based cinematic stage takes over navigation when mounted
  if (window.__v5Stage?.goToId(chapterId)) return;
  const target = document.getElementById(chapterId);
  if (!target) return;

  if (window.__lenis) {
    window.__lenis.scrollTo(target, { offset: -60, duration: 1.4 });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Register ScrollTrigger plugin with GSAP
    gsap.registerPlugin(ScrollTrigger);

    if (prefersReducedMotion) {
      return;
    }

    // Initialize single Lenis momentum scroll instance
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.6,
    });

    window.__lenis = lenis;

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis updates through GSAP's optimized ticker loop
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      delete window.__lenis;
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return <>{children}</>;
}
