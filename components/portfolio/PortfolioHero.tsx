"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { enterExpedition } from "@/lib/universeNavigation";
import { PROFILE_INFO } from "@/lib/resume";
import { HeroEnvironment } from "./HeroEnvironment";
import { DownloadResumeLink } from "@/components/ui/DownloadResumeLink";

export function PortfolioHero() {
  const heroRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const element = heroRef.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      // 1. Entrance Choreography
      const entrance = gsap.timeline({ defaults: { ease: "power3.out" } });
      entrance
        .fromTo(
          ".v5-hero-kicker",
          { opacity: 0, y: 22, letterSpacing: "0.28em" },
          { opacity: 1, y: 0, letterSpacing: "0.19em", duration: 0.85 }
        )
        .fromTo(
          ".v5-name-line",
          { yPercent: 115, rotate: 2 },
          { yPercent: 0, rotate: 0, duration: 1.15, stagger: 0.12, ease: "power4.out" },
          "-=0.4"
        )
        .fromTo(
          ".v5-hero-role",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.45"
        )
        .fromTo(
          ".v5-hero-description",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.75 },
          "-=0.4"
        )
        .fromTo(
          ".v5-hero-actions > *",
          { opacity: 0, y: 22, scale: 0.96 },
          { opacity: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.09, ease: "back.out(1.2)" },
          "-=0.35"
        )
        .fromTo(
          ".v5-hero-readout",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
          "-=0.3"
        )
        .fromTo(
          ".v5-scroll-cue",
          { opacity: 0, scaleY: 0 },
          { opacity: 1, scaleY: 1, duration: 0.6 },
          "-=0.2"
        );

      // 2. Continuous Scroll Scrubbing
      gsap.to(".v5-hero-copy", {
        y: -95,
        opacity: 0.1,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top top",
          end: "bottom top",
          scrub: 0.75,
        },
      });

      gsap.to(".v5-hero-topline", {
        y: -30,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top top",
          end: "45% top",
          scrub: true,
        },
      });

      gsap.to(".v5-readout-left", {
        x: -45,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "10% top",
          end: "50% top",
          scrub: true,
        },
      });

      gsap.to(".v5-readout-right", {
        x: 45,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "10% top",
          end: "50% top",
          scrub: true,
        },
      });

      gsap.to(".v5-scroll-cue", {
        opacity: 0,
        y: 20,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top top",
          end: "25% top",
          scrub: true,
        },
      });
    }, element);

    // Subtle pointer parallax on hero copy
    const copyEl = copyRef.current;
    const handlePointerMove = (e: PointerEvent) => {
      if (!copyEl) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 16;
      const y = (e.clientY / window.innerHeight - 0.5) * 12;
      gsap.to(copyEl, { x, y, duration: 1.2, ease: "power2.out" });
    };
    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      context.revert();
    };
  }, []);

  return (
    <section ref={heroRef} id="hero" className="v5-hero" aria-labelledby="v5-hero-title">
      <div className="v5-hero-atmosphere" aria-hidden="true" />
      <HeroEnvironment />
      <div className="v5-hero-grain" aria-hidden="true" />
      <div className="v5-hero-topline">
        <span>CHRISTIAN&apos;S LAB <i>/</i> DOST-ASTI SOFTWARE DEVELOPER INTERN</span>
        <span>MANILA · CAINTA, RIZAL · PH</span>
      </div>

      <div className="v5-hero-inner">
        <div ref={copyRef} className="v5-hero-copy">
          <p className="v5-hero-kicker">
            <span className="v5-beacon-dot" /> SOFTWARE DEVELOPER INTERN @ DOST-ASTI · BSIT @ NU MANILA
          </p>
          <h1 id="v5-hero-title" className="v5-hero-name">
            <span className="v5-name-mask"><span className="v5-name-line">Christian</span></span>
            <span className="v5-name-mask"><span className="v5-name-line v5-name-accent">Angcla.</span></span>
          </h1>
          <p className="v5-hero-role">
            Building systems.<br />
            <em>Exploring the unknown.</em>
          </p>
          <p className="v5-hero-description">{PROFILE_INFO.summary}</p>
          <div className="v5-hero-actions">
            <Link href="/#projects" className="v5-button-primary">
              Explore selected work <span className="v5-cta-arrow">↗</span>
            </Link>
            <button
              type="button"
              onClick={() => enterExpedition("origin")}
              className="v5-button-secondary"
            >
              <span className="v5-launch-dot" /> Launch 3D expedition
            </button>
            <DownloadResumeLink
              label="Download resume"
              className="v5-github-link"
            />
            <a
              href={PROFILE_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              className="v5-github-link"
            >
              Open GitHub <span>↗</span>
            </a>
            <a
              href={PROFILE_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="v5-github-link"
            >
              Open LinkedIn <span>↗</span>
            </a>
          </div>
        </div>
      </div>

      <div className="v5-hero-readout v5-readout-left">
        <span>CURRENT ROLE // DOST-ASTI</span>
        <b>SOFTWARE DEVELOPER INTERN</b>
      </div>
      <div className="v5-hero-readout v5-readout-right">
        <span>SCHOLARSHIP // HONORS</span>
        <b>DOST-SEI JLSS &amp; DEAN&apos;S LISTER</b>
      </div>
      <a className="v5-scroll-cue" href="#about" aria-label="Scroll to exploration">
        <span /> SCROLL TO EXPLORE
      </a>
    </section>
  );
}
