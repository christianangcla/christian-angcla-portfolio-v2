"use client";

import React, { useSyncExternalStore } from "react";
import { PhaseOnePortfolio } from "@/components/portfolio/PhaseOnePortfolio";
import { UniverseOverlay } from "@/components/universe/UniverseOverlay";
import {
  getNavigationSnapshot,
  getNavigationServerSnapshot,
  subscribeNavigation,
} from "@/lib/universeNavigation";

export default function Home() {
  const nav = useSyncExternalStore(
    subscribeNavigation,
    getNavigationSnapshot,
    getNavigationServerSnapshot
  );

  return (
    <div className="relative w-full min-h-screen bg-transparent text-foreground">
      {nav.experienceMode === "expedition" ? (
        <UniverseOverlay />
      ) : (
        <PhaseOnePortfolio />
      )}
    </div>
  );
}
