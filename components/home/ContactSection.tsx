import React from "react";
import { ScrollReveal } from "@/components/visual/ScrollReveal";

export function ContactSection() {
  return (
    <section id="transmission" className="py-28 lg:py-36 border-t border-border-subtle/50">
      <div className="mx-auto w-[92vw] max-w-[1536px] px-4 sm:px-6 lg:px-8 xl:px-12">
        <ScrollReveal direction="up" delay={100}>
          <div className="relative overflow-hidden rounded-3xl border border-border-strong/90 bg-gradient-to-br from-surface/85 via-surface-raised/75 to-surface/85 p-8 sm:p-12 lg:p-16 xl:p-20 shadow-2xl backdrop-blur-md">
            {/* Ambient Background Violet & Cyan Glows */}
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-[500px] w-[500px] rounded-full blur-3xl opacity-35 dark:opacity-45"
              style={{
                background:
                  "radial-gradient(circle, rgba(168,85,247,0.45) 0%, rgba(56,189,248,0.2) 40%, transparent 70%)",
              }}
            />
            <div
              className="pointer-events-none absolute -left-20 -bottom-20 h-[400px] w-[400px] rounded-full blur-3xl opacity-20 dark:opacity-30"
              style={{
                background:
                  "radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)",
              }}
            />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-mono font-bold uppercase tracking-widest text-primary">
                <span>[ CHAPTER 04 // BEACON TERMINAL ]</span>
              </div>

              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight">
                Initiate Engineering Collaboration
              </h2>

              <p className="mt-6 text-base sm:text-lg leading-relaxed text-text-muted">
                Open to software engineering internships, technical collaborations, and full-stack systems engineering inquiries. Explore my codebases or dispatch a direct transmission below.
              </p>

              {/* Direct Verified Action Cards */}
              <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6">
                {/* Verified Email Link */}
                <a
                  href="mailto:christianangcla4@gmail.com"
                  className="group inline-flex h-12 items-center gap-3 rounded-xl bg-primary px-8 text-sm font-semibold text-midnight-void shadow-[0_0_24px_rgba(168,85,247,0.35)] transition-all duration-300 hover:bg-primary-hover hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(168,85,247,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="2.2"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                  <span>christianangcla4@gmail.com</span>
                </a>

                {/* Verified GitHub Link */}
                <a
                  href="https://github.com/ChristianAngcla"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex h-12 items-center gap-3 rounded-xl border border-border-strong/90 bg-surface/90 px-8 text-sm font-semibold text-foreground transition-all duration-300 hover:border-primary hover:bg-surface-raised hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <svg
                    className="h-4 w-4 transition-transform duration-200 group-hover:scale-110"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>github.com/ChristianAngcla</span>
                </a>
              </div>

              {/* Status Note */}
              <div className="mt-8 flex items-center gap-2 text-xs font-mono text-text-subtle">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--status-green,#10b981)]" />
                <span>Status: Available for 2026–2027 Engineering Opportunities</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
