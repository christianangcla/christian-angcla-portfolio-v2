"use client";

import React from "react";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

interface RollingNumberProps {
  /** Formatted numeric string to display, e.g. "01", "14", "04" */
  value: string | number;
  className?: string;
}

/**
 * Renders an existing dynamic number as vertically rolling digit columns.
 * - Animates `transform` only (translate3d on a 0–9 vertical strip).
 * - Staggers each digit column by `calc(index * var(--dur-roll-stagger))`.
 * - Natively interruptible: mid-roll changes retarget from the current transform.
 * - Respects `prefers-reduced-motion: reduce` via CSS (instant snap).
 */
export function RollingNumber({ value, className }: RollingNumberProps) {
  const formatted = String(value);
  const chars = formatted.split("");
  let digitOrder = 0;

  return (
    <span className={`v5-rolling-number ${className ?? ""}`.trim()} aria-label={formatted}>
      <span className="sr-only">{formatted}</span>
      {chars.map((char, idx) => {
        const num = Number.parseInt(char, 10);
        if (Number.isNaN(num)) {
          return (
            <span key={`sep-${idx}`} className="v5-rolling-sep" aria-hidden="true">
              {char}
            </span>
          );
        }

        const staggerIndex = digitOrder++;
        return (
          <span
            key={`digit-${idx}`}
            className="v5-rolling-digit-mask"
            aria-hidden="true"
          >
            <span
              className="v5-rolling-digit-strip"
              style={
                {
                  "--digit-index": staggerIndex,
                  transform: `translate3d(0, -${num * 10}%, 0)`,
                } as React.CSSProperties
              }
            >
              {DIGITS.map((d) => (
                <span key={d} className="v5-rolling-digit-cell">
                  {d}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
