"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import "./v53.css";
import { PortfolioHero } from "./PortfolioHero";
import { StageRail, WarpCanvas, useCinematicStage, type SceneDef } from "./CinematicStage";
import { FEATURED_PROJECTS } from "@/lib/projects";
import { enterExpedition } from "@/lib/universeNavigation";
import {
  CREDENTIALS_DATA,
  EDUCATION_DATA,
  EXPERIENCE_DATA,
  FUTURE_WORKS_DATA,
  LAB_PILLARS,
  PROFILE_INFO,
  SKILL_CATEGORIES,
} from "@/lib/resume";

const projectWorlds: Record<string, string> = {
  floodguard: "v5-world-flood",
  "bulldogs-exchange": "v5-world-network",
  intertwine: "v5-world-intertwine",
  "how-to-train-your-birdie": "v5-world-birdie",
};

// One scene per full-screen "shot"; order must match the <div className="v5-scene"> wrappers below.
const SCENE_DEFS: SceneDef[] = [
  { id: "hero", label: "Launch" },
  { id: "lab", label: "The Lab" },
  { id: "about", label: "The Pilot" },
  { id: "capabilities", label: "Disciplines" },
  { id: "projects", label: "Selected Work" },
  ...FEATURED_PROJECTS.map((project) => ({ id: `work-${project.slug}`, label: project.title })),
  { id: "credentials", label: "05.1 · Experience" },
  { id: "archive-education", label: "05.2 · Education" },
  { id: "archive-certifications", label: "05.3 · Certifications" },
  { id: "archive-leadership", label: "05.4 · Leadership" },
  { id: "future-works", label: "Future Works" },
  { id: "contact", label: "Transmission" },
];

const ARCHIVE_CHAPTERS = [
  { id: "credentials", code: "01 · EXPERIENCE", transitionTag: "3D CUBE VAULT" },
  { id: "archive-education", code: "02 · EDUCATION", transitionTag: "KATANA SLASH" },
  { id: "archive-certifications", code: "03 · CERTIFICATIONS", transitionTag: "VENETIAN LOUVRES" },
  { id: "archive-leadership", code: "04 · LEADERSHIP", transitionTag: "3D VAULT DOOR" },
];

export function PhaseOnePortfolio() {
  const [activeSkill, setActiveSkill] = useState(0);
  const [galleryIndexBySlug, setGalleryIndexBySlug] = useState<Record<string, number>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const skillContentRef = useRef<HTMLDivElement>(null);
  const warp = useRef({ v: 0, ring: 0, flash: 0, slash: 0 });

  // Tab change animation
  const handleSkillSelect = (index: number) => {
    if (index === activeSkill) return;
    if (skillContentRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.fromTo(
        skillContentRef.current,
        { opacity: 0.35, y: 12, filter: "blur(4px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.45, ease: "power2.out" }
      );
    }
    setActiveSkill(index);
  };

  const { index, goTo } = useCinematicStage(containerRef, warp, SCENE_DEFS);
  const totalProjects = String(FEATURED_PROJECTS.length).padStart(2, "0");

  const certificationItems = CREDENTIALS_DATA.filter((c) =>
    c.badge.includes("CERTIFICATION") || c.badge.includes("CISCO")
  );
  const leadershipItems = CREDENTIALS_DATA.filter(
    (c) => !c.badge.includes("CERTIFICATION") && !c.badge.includes("CISCO")
  );

  return (
    <div ref={containerRef} className="v5-portfolio v5-stage" data-lenis-prevent>
      {/* 00: HERO LAUNCH */}
      <div className="v5-scene" data-scene="hero">
        <div className="v5-scene-inner">
          <PortfolioHero />
        </div>
      </div>

      {/* 01: INTRODUCTION TO CHRISTIAN'S LAB */}
      <div className="v5-scene" data-scene="lab">
        <div className="v5-scene-inner">
          <section id="lab" className="v5-section v5-lab-intro">
            <div className="v5-section-label">01 <span>/</span> INTRODUCTION TO CHRISTIAN&apos;S LAB</div>
            <div className="v5-heading-row v5-heading-row--compact">
              <div>
                <p className="v5-overline">PERSONAL R&amp;D PROVING GROUND · INTERACTIVE DIGITAL UNIVERSE</p>
                <h2 className="v5-display">
                  <span className="v5-text-mask"><span className="v5-mask-line">Inside the Lab.</span></span>
                  <span className="v5-text-mask"><span className="v5-mask-line"><span>Where theory ships.</span></span></span>
                </h2>
              </div>
              <div className="v5-lab-summary-box">
                <p>
                  <strong>Christian&apos;s Lab</strong> is my interactive software engineering laboratory—built to architect, stress-test, and ship full-stack web platforms, cross-platform Android applications, predictive regression models, and 3D spatial interfaces.
                </p>
                <div className="v5-lab-actions">
                  <button
                    type="button"
                    className="v5-btn-secondary"
                    onClick={() => enterExpedition("origin")}
                  >
                    Enter 3D Solar Expedition ✦
                  </button>
                </div>
              </div>
            </div>

            <div className="v5-lab-grid">
              {LAB_PILLARS.map((pillar, idx) => (
                <article className="v5-lab-card" key={pillar.code}>
                  <div className="v5-lab-card-top">
                    <span className="v5-lab-code">{pillar.code}</span>
                    <span className="v5-lab-index">0{idx + 1}</span>
                  </div>
                  <h3>{pillar.title}</h3>
                  <p className="v5-lab-subtitle">{pillar.subtitle}</p>
                  <p className="v5-lab-desc">{pillar.description}</p>
                  <div className="v5-lab-metrics">
                    <span className="v5-lab-dot" />
                    <span>{pillar.metrics}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* 02: THE PILOT */}
      <div className="v5-scene" data-scene="about">
        <div className="v5-scene-inner">
          <section id="about" className="v5-section v5-about">
            <div className="v5-section-label">02 <span>/</span> THE PILOT</div>
            <div className="v5-about-grid">
              <div>
                <p className="v5-overline">SOFTWARE DEVELOPER INTERN · DOST-ASTI</p>
                <h2 className="v5-display">
                  <span className="v5-text-mask"><span className="v5-mask-line">I build technology</span></span>
                  <span className="v5-text-mask"><span className="v5-mask-line"><span>for real-world</span></span></span>
                  <span className="v5-text-mask"><span className="v5-mask-line">problems.</span></span>
                </h2>
              </div>
              <div className="v5-about-story">
                <div className="v5-orbit-emblem" aria-hidden="true">
                  <span /><i /><b />
                </div>
                <p>{PROFILE_INFO.summary}</p>
                <div className="v5-facts">
                  <div>
                    <span>CURRENT ROLE</span>
                    <b>Software Developer Intern · DOST-ASTI</b>
                  </div>
                  <div>
                    <span>EDUCATION</span>
                    <b>BSIT (Mobile &amp; Web) · NU Manila</b>
                  </div>
                  <div>
                    <span>HONORS &amp; GRANTS</span>
                    <b>DOST-SEI JLSS · BLUE Scholar · Dean&apos;s Lister</b>
                  </div>
                  <div>
                    <span>LOCATION</span>
                    <b>{PROFILE_INFO.location}</b>
                  </div>
                </div>
              </div>
            </div>
            <div className="v5-marquee" aria-hidden="true">
              <span>DOST-ASTI SOFTWARE DEVELOPER INTERN · DOST-SEI JLSS SCHOLAR · BUILD WITH INTENTION · </span>
              <span>DOST-ASTI SOFTWARE DEVELOPER INTERN · DOST-SEI JLSS SCHOLAR · BUILD WITH INTENTION · </span>
            </div>
          </section>
        </div>
      </div>

      {/* 03: ENGINEERING DISCIPLINES */}
      <div className="v5-scene" data-scene="capabilities">
        <div className="v5-scene-inner">
          <section id="capabilities" className="v5-section v5-expertise">
            <div className="v5-section-label">03 <span>/</span> ENGINEERING DISCIPLINES</div>
            <div className="v5-heading-row">
              <h2 className="v5-display">
                <span className="v5-text-mask"><span className="v5-mask-line">A system of</span></span>
                <span className="v5-text-mask"><span className="v5-mask-line"><span>connected skills.</span></span></span>
              </h2>
              <p>Four disciplines. One evolving engineering practice across full-stack web, Android, cloud infrastructure, and automated testing.</p>
            </div>
            <div className="v5-skill-stage">
              <div className="v5-skill-index" role="tablist" aria-label="Engineering disciplines">
                {SKILL_CATEGORIES.map((skill, idx) => (
                  <button
                    key={skill.code}
                    type="button"
                    role="tab"
                    aria-selected={activeSkill === idx}
                    className={activeSkill === idx ? "is-active" : ""}
                    onClick={() => handleSkillSelect(idx)}
                  >
                    <small>0{idx + 1}</small>
                    <span>{skill.title}</span>
                    <b className="v5-tab-arrow">↗</b>
                  </button>
                ))}
              </div>
              <div ref={skillContentRef} className="v5-skill-content" role="tabpanel">
                <div className="v5-skill-orbit" aria-hidden="true">
                  <span /><span /><span /><i />
                </div>
                <p className="v5-mono">{SKILL_CATEGORIES[activeSkill].code} • DOMAIN ACTIVE</p>
                <h3>{SKILL_CATEGORIES[activeSkill].title}</h3>
                <p className="v5-skill-description">{SKILL_CATEGORIES[activeSkill].description}</p>
                <div className="v5-skill-tags">
                  {SKILL_CATEGORIES[activeSkill].skills.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <div className="v5-skill-number">0{activeSkill + 1}</div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 04: SELECTED ENGINEERING WORK */}
      <div className="v5-scene" data-scene="projects">
        <div className="v5-scene-inner">
          <section id="projects" className="v5-projects">
            <div className="v5-section v5-project-intro">
              <div className="v5-section-label">04 <span>/</span> SELECTED ENGINEERING WORK</div>
              <div className="v5-heading-row">
                <h2 className="v5-display">
                  <span className="v5-text-mask"><span className="v5-mask-line">Four problems.</span></span>
                  <span className="v5-text-mask"><span className="v5-mask-line"><span>Four different worlds.</span></span></span>
                </h2>
                <p>Full-stack and mobile builds spanning predictive flood forecasting, role-scoped e-commerce, social connection, and 2D Android game systems.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {FEATURED_PROJECTS.map((project, projIdx) => {
        const gallery = project.gallery ?? [];
        // -1 = Dual View (both screenshots visible), 0 = first screenshot, 1 = second screenshot
        const activeImgIdx = galleryIndexBySlug[project.slug] ?? -1;

        return (
          <div className="v5-scene" data-scene={`work-${project.slug}`} key={project.slug}>
            <div className="v5-scene-inner">
              <article
                className={`v5-project-exhibition ${projIdx % 2 ? "v5-project-reverse" : ""} ${projectWorlds[project.slug] ?? ""}`}
              >
                <div className="v5-project-index">0{projIdx + 1} <span>/ {totalProjects}</span></div>
                <div className={`v5-project-visual ${gallery.length > 1 ? "v5-project-visual--gallery" : ""}`}>
                  {gallery.length > 1 ? (
                    <>
                      <div className="v5-gallery-topbar">
                        <span className="v5-visual-coordinate v5-visual-coordinate--inline">
                          {project.category}
                        </span>
                        <div className="v5-gallery-tabs" role="tablist" aria-label={`${project.title} screenshots`}>
                          <button
                            type="button"
                            role="tab"
                            aria-selected={activeImgIdx === -1}
                            className={`v5-gallery-tab ${activeImgIdx === -1 ? "is-active" : ""}`}
                            onClick={() =>
                              setGalleryIndexBySlug((prev) => ({
                                ...prev,
                                [project.slug]: -1,
                              }))
                            }
                          >
                            DUAL VIEW (2)
                          </button>
                          {gallery.map((item, gIdx) => (
                            <button
                              key={item.src}
                              type="button"
                              role="tab"
                              aria-selected={activeImgIdx === gIdx}
                              className={`v5-gallery-tab ${activeImgIdx === gIdx ? "is-active" : ""}`}
                              onClick={() =>
                                setGalleryIndexBySlug((prev) => ({
                                  ...prev,
                                  [project.slug]: gIdx,
                                }))
                              }
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {activeImgIdx === -1 ? (
                        <div className="v5-gallery-dual">
                          {gallery.map((item, gIdx) => (
                            <button
                              key={item.src}
                              type="button"
                              className="v5-gallery-frame"
                              onClick={() =>
                                setGalleryIndexBySlug((prev) => ({
                                  ...prev,
                                  [project.slug]: gIdx,
                                }))
                              }
                              title={`Expand ${item.label}`}
                            >
                              <div className="v5-gallery-frame-bar">
                                <span className="v5-gallery-dots">
                                  <i /><i /><i />
                                </span>
                                <span className="v5-gallery-frame-title">{item.label}</span>
                                <span className="v5-gallery-frame-action">EXPAND ↗</span>
                              </div>
                              <div className="v5-gallery-frame-Viewport">
                                <Image
                                  src={item.src}
                                  alt={`${project.title} — ${item.label}`}
                                  fill
                                  sizes="(max-width: 800px) 100vw, 55vw"
                                  className="v5-gallery-contain-img"
                                />
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="v5-gallery-single">
                          <div className="v5-gallery-frame v5-gallery-frame--single">
                            <div className="v5-gallery-frame-bar">
                              <span className="v5-gallery-dots">
                                <i /><i /><i />
                              </span>
                              <span className="v5-gallery-frame-title">
                                {gallery[activeImgIdx]?.label}
                              </span>
                              <button
                                type="button"
                                className="v5-gallery-back-btn"
                                onClick={() =>
                                  setGalleryIndexBySlug((prev) => ({
                                    ...prev,
                                    [project.slug]: -1,
                                  }))
                                }
                              >
                                ← SHOW BOTH PICTURES
                              </button>
                            </div>
                            <div className="v5-gallery-frame-Viewport">
                              <Image
                                src={gallery[activeImgIdx]?.src ?? project.image}
                                alt={`${project.title} — ${gallery[activeImgIdx]?.label}`}
                                fill
                                sizes="(max-width: 800px) 100vw, 60vw"
                                className="v5-gallery-contain-img"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="v5-visual-bottom">
                        <span>BULLDOGS EXCHANGE · LIVE APPLICATION CAPTURES (2)</span>
                        <span>0{projIdx + 1} / {totalProjects}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Image
                        src={project.image}
                        alt={`${project.title} project artwork`}
                        fill
                        sizes="(max-width: 800px) 100vw, 60vw"
                        className="v5-project-img"
                        priority={projIdx === 0}
                      />
                      <div className="v5-project-visual-shade" />
                      <div className="v5-visual-coordinate">{project.category}</div>
                      <div className="v5-visual-crosshair" aria-hidden="true">+</div>
                      <div className="v5-visual-bottom">
                        <span>PROJECT VISUAL</span>
                        <span>0{projIdx + 1} / {totalProjects}</span>
                      </div>
                    </>
                  )}
                </div>
                <div className="v5-project-info">
                  <div className="v5-project-meta">
                    <span>{project.year}</span>
                    <span>{project.status}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p className="v5-project-tagline">{project.tagline}</p>
                  <p className="v5-project-description">{project.description}</p>
                  <ul className="v5-project-highlights">
                    {project.highlights.map((highlight) => (
                      <li key={highlight}>{highlight}</li>
                    ))}
                  </ul>
                  <div className="v5-project-tech">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                  {((project.repoUrls && project.repoUrls.length > 0) ||
                    project.repoUrl ||
                    project.demoUrl ||
                    project.demoVideoUrl) && (
                    <div className="flex flex-wrap items-center gap-5 pt-1">
                      {project.repoUrls && project.repoUrls.length > 0 ? (
                        project.repoUrls.map((repo) => (
                          <a
                            key={repo.url}
                            className="v5-project-action"
                            href={repo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {repo.label} <span className="v5-cta-arrow">↗</span>
                          </a>
                        ))
                      ) : project.repoUrl ? (
                        <a
                          className="v5-project-action"
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Source <span className="v5-cta-arrow">↗</span>
                        </a>
                      ) : null}
                      {project.demoUrl && (
                        <a
                          className="v5-project-action"
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Live Demo <span className="v5-cta-arrow">↗</span>
                        </a>
                      )}
                      {project.demoVideoUrl && (
                        <a
                          className="v5-project-action"
                          href={project.demoVideoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Demo Video <span className="v5-cta-arrow">↗</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            </div>
          </div>
        );
      })}

      {/* 05.1: THE WORK BEHIND THE WORK — PAGE 1: PROFESSIONAL & CAPSTONE EXPERIENCE */}
      <div className="v5-scene" data-scene="credentials">
        <div className="v5-scene-inner">
          <section id="credentials" className="v5-section v5-archive-page">
            <div className="v5-archive-topbar">
              <div className="v5-section-label">
                05.1 <span>/</span> THE WORK BEHIND THE WORK · EXPERIENCE
              </div>
              <nav className="v5-archive-chapter-nav" aria-label="Archive chapters">
                {ARCHIVE_CHAPTERS.map((chap) => (
                  <a
                    key={chap.id}
                    href={`#${chap.id}`}
                    className={`v5-archive-chapter-pill ${chap.id === "credentials" ? "is-active" : ""}`}
                  >
                    <span>{chap.code}</span>
                  </a>
                ))}
              </nav>
            </div>

            <div className="v5-heading-row v5-heading-row--archive">
              <div>
                <p className="v5-overline">ARCHIVE CHAPTER 01 OF 04 · PROFESSIONAL &amp; CAPSTONE ENGINEERING</p>
                <h2 className="v5-display">
                  <span className="v5-text-mask"><span className="v5-mask-line">The work</span></span>
                  <span className="v5-text-mask"><span className="v5-mask-line"><span>behind the work.</span></span></span>
                </h2>
              </div>
              <p>
                Software Developer Intern at <strong>DOST-ASTI</strong> (November 2026 – Present) and Mobile Developer / Full-Stack Contributor on a team capstone for <strong>FloodGuard</strong> at <strong>NU Manila</strong>.
              </p>
            </div>

            <div className="v5-archive-two-col v5-archive-bento--exp">
              {EXPERIENCE_DATA.map((exp, idx) =>
                exp.highlights.length === 0 ? (
                  <article
                    className="v5-archive-card v5-archive-card--spacious v5-archive-card--banner"
                    key={exp.id}
                  >
                    <div className="v5-archive-banner-main">
                      <span className="v5-archive-period">{exp.period}</span>
                      <h3 className="v5-archive-role">{exp.role}</h3>
                      <strong className="v5-archive-org">{exp.organization}</strong>
                    </div>
                    <span className="v5-card-watermark" aria-hidden="true">
                      {exp.period}
                    </span>
                  </article>
                ) : (
                  <article
                    className="v5-archive-card v5-archive-card--spacious"
                    key={exp.id}
                  >
                    <div className="v5-archive-card-meta">
                      <span className="v5-archive-badge">{exp.badge}</span>
                      <span className="v5-archive-period">{exp.period}</span>
                    </div>
                    <div className="v5-archive-title-row">
                      <h3 className="v5-archive-role">{exp.role}</h3>
                      <span className="v5-archive-num">0{idx + 1}</span>
                    </div>
                    <div className="v5-archive-org-row">
                      <strong className="v5-archive-org">{exp.organization}</strong>
                      {exp.location && <span className="v5-archive-loc">{exp.location}</span>}
                    </div>
                    <ul className="v5-archive-bullets v5-archive-bullets--spacious">
                      {exp.highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <span className="v5-card-watermark" aria-hidden="true">
                      {exp.period}
                    </span>
                  </article>
                )
              )}
            </div>
          </section>
        </div>
      </div>

      {/* 05.2: THE WORK BEHIND THE WORK — PAGE 2: EDUCATION & SCHOLARSHIPS */}
      <div className="v5-scene" data-scene="archive-education">
        <div className="v5-scene-inner">
          <section id="archive-education" className="v5-section v5-archive-page">
            <div className="v5-archive-topbar">
              <div className="v5-section-label">
                05.2 <span>/</span> THE WORK BEHIND THE WORK · EDUCATION &amp; HONORS
              </div>
              <nav className="v5-archive-chapter-nav" aria-label="Archive chapters">
                {ARCHIVE_CHAPTERS.map((chap) => (
                  <a
                    key={chap.id}
                    href={`#${chap.id}`}
                    className={`v5-archive-chapter-pill ${chap.id === "archive-education" ? "is-active" : ""}`}
                  >
                    <span>{chap.code}</span>
                  </a>
                ))}
              </nav>
            </div>

            <div className="v5-heading-row v5-heading-row--archive">
              <div>
                <p className="v5-overline">ARCHIVE CHAPTER 02 OF 04 · ACADEMIC FOUNDATION &amp; NATIONAL GRANTS</p>
                <h2 className="v5-display">
                  <span className="v5-text-mask"><span className="v5-mask-line">Academic rigor</span></span>
                  <span className="v5-text-mask"><span className="v5-mask-line"><span>&amp; scholarships.</span></span></span>
                </h2>
              </div>
              <p>
                Backed by national merit scholarships—<strong>DOST-SEI JLSS Scholar</strong>, <strong>Doña Miguela M. Jhocson BLUE Scholar</strong>, and consistent <strong>Dean&apos;s Lister</strong> at <strong>National University – Manila</strong>.
              </p>
            </div>

            <div className="v5-archive-two-col v5-archive-bento--edu">
              {EDUCATION_DATA.map((education, idx) => (
                <article className="v5-archive-card v5-archive-card--spacious" key={education.institution}>
                  <div className="v5-archive-card-meta">
                    <span className="v5-archive-badge">{education.status}</span>
                    <span className="v5-archive-period">{education.period}</span>
                  </div>
                  <div className="v5-archive-title-row">
                    <h3 className="v5-archive-role">{education.degree}</h3>
                    <span className="v5-archive-num">0{idx + 1}</span>
                  </div>
                  <div className="v5-archive-org-row">
                    <strong className="v5-archive-org">
                      {education.institution} · {education.field}
                    </strong>
                    <span className="v5-archive-loc">{education.location}</span>
                  </div>
                  <ul className="v5-archive-bullets v5-archive-bullets--spacious">
                    {education.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <span className="v5-card-watermark" aria-hidden="true">
                    {education.period}
                  </span>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* 05.3: THE WORK BEHIND THE WORK — PAGE 3: TECHNICAL CERTIFICATIONS */}
      <div className="v5-scene" data-scene="archive-certifications">
        <div className="v5-scene-inner">
          <section id="archive-certifications" className="v5-section v5-archive-page">
            <div className="v5-archive-topbar">
              <div className="v5-section-label">
                05.3 <span>/</span> THE WORK BEHIND THE WORK · CERTIFICATIONS
              </div>
              <nav className="v5-archive-chapter-nav" aria-label="Archive chapters">
                {ARCHIVE_CHAPTERS.map((chap) => (
                  <a
                    key={chap.id}
                    href={`#${chap.id}`}
                    className={`v5-archive-chapter-pill ${chap.id === "archive-certifications" ? "is-active" : ""}`}
                  >
                    <span>{chap.code}</span>
                  </a>
                ))}
              </nav>
            </div>

            <div className="v5-heading-row v5-heading-row--archive">
              <div>
                <p className="v5-overline">ARCHIVE CHAPTER 03 OF 04 · VERIFIED INDUSTRY CREDENTIALS</p>
                <h2 className="v5-display">
                  <span className="v5-text-mask"><span className="v5-mask-line">Certified across</span></span>
                  <span className="v5-text-mask"><span className="v5-mask-line"><span>security &amp; data.</span></span></span>
                </h2>
              </div>
              <p>
                Industry-examined credentials validating technical proficiency across <strong>cybersecurity defense</strong>, <strong>relational database systems</strong>, <strong>project management</strong>, and <strong>network infrastructure</strong>.
              </p>
            </div>

            <div className="v5-cred-grid v5-cred-grid--spacious v5-archive-bento--certs">
              {certificationItems.map((credential, idx) => (
                <article className="v5-cred-card v5-cred-card--spacious" key={credential.id}>
                  <div>
                    <div className="v5-cred-top">
                      <span className="v5-cred-badge">{credential.badge}</span>
                      <span className="v5-cred-period">{credential.period}</span>
                    </div>
                    <div className="v5-archive-title-row">
                      <h4>{credential.title}</h4>
                      <span className="v5-archive-num">0{idx + 1}</span>
                    </div>
                    <strong className="v5-cred-issuer">{credential.issuer}</strong>
                    <p>{credential.summary}</p>
                  </div>
                  <div className="v5-cred-bottom-row">
                    <div className="v5-cred-footer">
                      <span className="v5-lab-dot" />
                      <span>VERIFIED CREDENTIAL · EXAMINED &amp; ISSUED</span>
                    </div>
                    <span className="v5-card-watermark" aria-hidden="true">
                      {credential.period}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* 05.4: THE WORK BEHIND THE WORK — PAGE 4: LEADERSHIP, GOVERNANCE & COMPETITIONS */}
      <div className="v5-scene" data-scene="archive-leadership">
        <div className="v5-scene-inner">
          <section id="archive-leadership" className="v5-section v5-archive-page">
            <div className="v5-archive-topbar">
              <div className="v5-section-label">
                05.4 <span>/</span> THE WORK BEHIND THE WORK · LEADERSHIP &amp; ACTIVITIES
              </div>
              <nav className="v5-archive-chapter-nav" aria-label="Archive chapters">
                {ARCHIVE_CHAPTERS.map((chap) => (
                  <a
                    key={chap.id}
                    href={`#${chap.id}`}
                    className={`v5-archive-chapter-pill ${chap.id === "archive-leadership" ? "is-active" : ""}`}
                  >
                    <span>{chap.code}</span>
                  </a>
                ))}
              </nav>
            </div>

            <div className="v5-heading-row v5-heading-row--archive">
              <div>
                <p className="v5-overline">ARCHIVE CHAPTER 04 OF 04 · COMMUNITY GOVERNANCE &amp; COMPETITIONS</p>
                <h2 className="v5-display">
                  <span className="v5-text-mask"><span className="v5-mask-line">Leadership &amp;</span></span>
                  <span className="v5-text-mask"><span className="v5-mask-line"><span>stewardship.</span></span></span>
                </h2>
              </div>
              <p>
                Executive finance leadership across tech communities—<strong>AWS Learning Club</strong> and <strong>JBECP NU Chapter</strong>—alongside competitive <strong>Capture the Flag (CTF)</strong> cybersecurity representation.
              </p>
            </div>

            <div className="v5-cred-grid v5-cred-grid--spacious v5-cred-grid--three v5-archive-bento--lead">
              {leadershipItems.map((credential, idx) => (
                <article className="v5-cred-card v5-cred-card--spacious" key={credential.id}>
                  <div>
                    <div className="v5-cred-top">
                      <span className="v5-cred-badge">{credential.badge}</span>
                      <span className="v5-cred-period">{credential.period}</span>
                    </div>
                    <div className="v5-archive-title-row">
                      <h4>{credential.title}</h4>
                      <span className="v5-archive-num">0{idx + 1}</span>
                    </div>
                    <strong className="v5-cred-issuer">{credential.issuer}</strong>
                    <p>{credential.summary}</p>
                  </div>
                  <div className="v5-cred-bottom-row">
                    <div className="v5-cred-footer">
                      <span className="v5-lab-dot" />
                      <span>VERIFIED RECORD · NATIONAL UNIVERSITY MANILA</span>
                    </div>
                    <span className="v5-card-watermark" aria-hidden="true">
                      {credential.period}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* 06: FUTURE WORKS & R&D HORIZON */}
      <div className="v5-scene" data-scene="future-works">
        <div className="v5-scene-inner">
          <section id="future-works" className="v5-section v5-future">
            <div className="v5-section-label">06 <span>/</span> FUTURE WORKS &amp; R&amp;D HORIZON</div>
            <div className="v5-heading-row v5-heading-row--compact">
              <div>
                <p className="v5-overline">ONGOING RESEARCH · UPCOMING BUILDS · 2026 — 2027 ROADMAP</p>
                <h2 className="v5-display">
                  <span className="v5-text-mask"><span className="v5-mask-line">Next on</span></span>
                  <span className="v5-text-mask"><span className="v5-mask-line"><span>the horizon.</span></span></span>
                </h2>
              </div>
              <p>
                A laboratory never stands still. Here are the active research tracks, architectural upgrades, and next-generation systems currently on the workbench at <strong>Christian&apos;s Lab</strong>.
              </p>
            </div>

            <div className="v5-future-grid">
              {FUTURE_WORKS_DATA.map((item) => (
                <article className="v5-future-card" key={item.code}>
                  <div className="v5-future-top">
                    <span className="v5-future-code">{item.code}</span>
                    <span className="v5-future-status">
                      <i className="v5-future-pulse" />
                      {item.status}
                    </span>
                  </div>
                  <h3>{item.title}</h3>
                  <strong className="v5-future-domain">{item.domain}</strong>
                  <p>{item.description}</p>
                  <div className="v5-future-tags">
                    {item.stack.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* 07: FINAL TRANSMISSION */}
      <div className="v5-scene" data-scene="contact">
        <div className="v5-scene-inner">
          <footer id="contact" className="v5-contact">
            <div className="v5-contact-rings" aria-hidden="true" />
            <p className="v5-section-label">07 <span>/</span> FINAL TRANSMISSION</p>
            <p className="v5-contact-overline">
              <span className="v5-beacon-dot" /> TRANSMISSION CHANNEL OPEN · DOST-ASTI SOFTWARE DEVELOPER INTERN
            </p>
            <h2>
              <span className="v5-text-mask"><span className="v5-mask-line">Have a problem</span></span>
              <span className="v5-text-mask"><span className="v5-mask-line">worth solving?</span></span>
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a className="v5-contact-cta" href={`mailto:${PROFILE_INFO.email}`}>
                Let&apos;s build it <span className="v5-cta-arrow">↗</span>
              </a>
              <a
                className="v5-button-secondary"
                href="/Christian-Angcla-Resume.pdf"
                download="Christian-Angcla-Resume.pdf"
              >
                Download Resume (PDF) <span className="v5-cta-arrow">↓</span>
              </a>
            </div>
            <div className="v5-contact-footer">
              <span>{PROFILE_INFO.fullName}</span>
              <a href="/Christian-Angcla-Resume.pdf" download="Christian-Angcla-Resume.pdf">
                RESUME (PDF) ↓
              </a>
              <a href={PROFILE_INFO.linkedin} target="_blank" rel="noopener noreferrer">
                LINKEDIN ↗
              </a>
              <a href={PROFILE_INFO.github} target="_blank" rel="noopener noreferrer">
                GITHUB ↗
              </a>
              <a href={`mailto:${PROFILE_INFO.email}`}>{PROFILE_INFO.email}</a>
              <span>{PROFILE_INFO.location}</span>
            </div>
          </footer>
        </div>
      </div>

      <div className="v5-wipe-edge" aria-hidden="true" />
      <WarpCanvas warp={warp} />
      <StageRail defs={SCENE_DEFS} index={index} onSelect={goTo} />
    </div>
  );
}
