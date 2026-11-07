"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

interface DownloadResumeLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "download"> {
  label?: string;
  href?: string;
  downloadName?: string;
  iconClassName?: string;
}

/**
 * Accessible Download Resume link with interruptible press feedback and
 * a 1.2s animated icon sequence:
 * 1. Arrow drops down (transform + opacity, 180ms)
 * 2. Circle ring draws (270ms)
 * 3. Checkmark tick draws (200ms) -> 470ms total ring+tick (--dur-tick)
 * 4. Returns smoothly to the arrow after ~1.2s total (or reverses immediately if pressed again mid-animation).
 * Announces "Download started" via aria-live="polite" without changing visible button text.
 */
export function DownloadResumeLink({
  label = "Download resume",
  href = "/Christian-Angcla-Resume.pdf",
  downloadName = "Christian-Angcla-Resume.pdf",
  className = "",
  iconClassName = "",
  onClick,
  ...rest
}: DownloadResumeLinkProps) {
  const [isTickActive, setIsTickActive] = useState(false);
  const [announceText, setAnnounceText] = useState("");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      onClick?.(e);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      // If clicked again mid-animation, reverse immediately from current interpolated state
      if (isTickActive) {
        setIsTickActive(false);
        setAnnounceText("");
        return;
      }

      setIsTickActive(true);
      setAnnounceText("Download started");

      timerRef.current = setTimeout(() => {
        setIsTickActive(false);
        setAnnounceText("");
        timerRef.current = null;
      }, 1250);
    },
    [isTickActive, onClick]
  );

  return (
    <a
      href={href}
      download={downloadName}
      onClick={handleClick}
      data-tick-state={isTickActive ? "active" : "idle"}
      className={`v5-download-link ${className}`.trim()}
      {...rest}
    >
      <span>{label}</span>
      <span
        className={`v5-download-icon-stage ${iconClassName}`.trim()}
        aria-hidden="true"
      >
        {/* Default Download Arrow (drops down on click) */}
        <svg
          className="v5-download-arrow-svg"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 3.75v11.5" />
          <path d="M5.75 11.25 10 15.5l4.25-4.25" />
        </svg>

        {/* Animated Ring + Checkmark Tick (draws circle 270ms, then tick 200ms) */}
        <svg
          className="v5-download-tick-svg"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle
            className="v5-download-tick-ring"
            cx="10"
            cy="10"
            r="7.75"
            strokeWidth="1.65"
            pathLength="1"
          />
          <path
            className="v5-download-tick-mark"
            d="M6.4 10.3 8.9 12.8 13.8 7.5"
            strokeWidth="1.9"
            pathLength="1"
          />
        </svg>
      </span>
      <span className="sr-only" role="status" aria-live="polite">
        {announceText}
      </span>
    </a>
  );
}
