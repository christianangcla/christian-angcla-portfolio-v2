// ============================================================================
// Christian's Lab // Universe Navigation System & Coordinate Map
// Manages deterministic 3D world coordinates, travel transitions, and HUD state
// ============================================================================

export type DestinationId =
  | "origin"
  | "disciplines"
  | "floodguard"
  | "bulldogs-exchange"
  | "intertwine"
  | "birdie"
  | "simulation"
  | "beacon";

export interface DestinationConfig {
  id: DestinationId;
  code: string;
  label: string;
  category: string;
  coordinates: string;
  description: string;
  // 3D Scene Vectors
  camPos: [number, number, number];
  lookAt: [number, number, number];
  shipPos: [number, number, number];
  shipRot: [number, number, number]; // [pitch, yaw, roll] in radians
  type: "origin" | "core" | "planet" | "sandbox" | "beacon";
  projectSlug?: string;
}

export const DESTINATIONS: Record<DestinationId, DestinationConfig> = {
  origin: {
    id: "origin",
    code: "SECTOR_00",
    label: "LAUNCH BAY",
    category: "EXPEDITION BASE",
    coordinates: "00.0000° N, 00.0000° E // SOL_CORE",
    description:
      "Observation bay overlooking Christian's Lab stellar core and surrounding planetary orbits.",
    camPos: [0.0, 1.2, 9.2],
    lookAt: [0.0, 0.4, 0.0],
    shipPos: [0.0, -0.7, 6.6],
    shipRot: [0.08, 0.0, 0.0],
    type: "origin",
  },
  disciplines: {
    id: "disciplines",
    code: "SECTOR_01",
    label: "ENGINEERING CORE",
    category: "DISCIPLINARY MATRIX",
    coordinates: "SEC_ALPHA // 4_DISCIPLINES",
    description:
      "Core engineering disciplines: Software Architecture, Defensive Reliability, AI Augmentation, and Creative Technology.",
    camPos: [-5.8, 2.4, 3.8],
    lookAt: [-7.2, 1.8, -1.8],
    shipPos: [-6.1, 1.2, 2.4],
    shipRot: [0.06, -0.35, -0.12],
    type: "core",
  },
  floodguard: {
    id: "floodguard",
    code: "SECTOR_02A",
    label: "FLOODGUARD",
    category: "HYDROLOGICAL RADAR WORLD",
    coordinates: "14.6507° N, 121.0964° E // MARIKINA",
    description:
      "Predictive flood monitoring and early-warning geospatial radar world.",
    camPos: [7.8, 2.0, 1.8],
    lookAt: [10.2, 1.4, -4.0],
    shipPos: [8.2, 0.9, 0.4],
    shipRot: [0.06, 0.38, 0.12],
    type: "planet",
    projectSlug: "floodguard",
  },
  "bulldogs-exchange": {
    id: "bulldogs-exchange",
    code: "SECTOR_02B",
    label: "BULLDOGS EXCHANGE",
    category: "COMMERCE LEDGER NEXUS",
    coordinates: "14.6042° N, 120.9946° E // SAMPALOC",
    description:
      "Full-stack campus commerce exchange with RBAC governance and transactional inventory controls.",
    camPos: [3.4, 3.8, -1.2],
    lookAt: [5.2, 3.1, -6.4],
    shipPos: [3.8, 2.8, -2.4],
    shipRot: [0.05, 0.24, 0.08],
    type: "planet",
    projectSlug: "bulldogs-exchange",
  },
  intertwine: {
    id: "intertwine",
    code: "SECTOR_02C",
    label: "INTERTWINE",
    category: "REACTIVE MOBILE RESONANCE",
    coordinates: "FREQ_868_MHZ // DART_REACTIVE",
    description:
      "Cross-platform Flutter mobile networking and dynamic interaction world.",
    camPos: [5.6, -2.8, -6.8],
    lookAt: [7.8, -3.8, -12.0],
    shipPos: [6.0, -3.4, -7.8],
    shipRot: [-0.06, 0.34, 0.12],
    type: "planet",
    projectSlug: "intertwine",
  },
  birdie: {
    id: "birdie",
    code: "SECTOR_02D",
    label: "HOW TO TRAIN YOUR BIRDIE",
    category: "2D SPACE SHOOTER",
    coordinates: "VECTOR_2D // JAVA_LIBGDX",
    description:
      "2D Android space shooter game built with Java and LibGDX for NU Tech Fiesta.",
    camPos: [-4.6, 4.4, -8.8],
    lookAt: [-6.8, 4.2, -14.0],
    shipPos: [-5.0, 3.6, -9.8],
    shipRot: [0.08, -0.3, -0.12],
    type: "planet",
    projectSlug: "how-to-train-your-birdie",
  },
  simulation: {
    id: "simulation",
    code: "SECTOR_03",
    label: "SIMULATION MATRIX",
    category: "QUANTUM PARTICLE FIELD",
    coordinates: "2000_BODIES // N_BODY_GRAV",
    description:
      "Interactive 2,000-particle kinetic field responsive to cursor physics.",
    camPos: [0.0, 5.8, -0.6],
    lookAt: [0.0, 5.4, -6.0],
    shipPos: [0.0, 4.2, 0.6],
    shipRot: [0.12, 0.0, 0.0],
    type: "sandbox",
  },
  beacon: {
    id: "beacon",
    code: "SECTOR_04",
    label: "BEACON TERMINAL",
    category: "DEEP SPACE UPLINK",
    coordinates: "FREQ_UPLINK // MANILA_RELAY",
    description:
      "Direct transmission beacon for engineering collaborations and contact.",
    camPos: [0.0, -4.6, -10.2],
    lookAt: [0.0, -5.8, -16.0],
    shipPos: [0.0, -5.4, -9.0],
    shipRot: [-0.08, 0.0, 0.0],
    type: "beacon",
  },
};

export const DESTINATION_LIST: DestinationId[] = [
  "origin",
  "disciplines",
  "floodguard",
  "bulldogs-exchange",
  "intertwine",
  "birdie",
  "simulation",
  "beacon",
];

export const PLANETARY_DESTINATIONS: DestinationId[] = [
  "floodguard",
  "bulldogs-exchange",
  "intertwine",
  "birdie",
];

export type ExperienceMode = "portfolio" | "expedition";

export interface NavigationState {
  experienceMode: ExperienceMode;
  currentDestination: DestinationId;
  previousDestination: DestinationId | null;
  targetDestination: DestinationId;
  flightStatus: "idle" | "traveling" | "arrived";
  flightProgress: number; // 0 to 1
  dossierOpen: boolean;
}

export const INITIAL_NAVIGATION_STATE: NavigationState = Object.freeze({
  experienceMode: "portfolio",
  currentDestination: "origin",
  previousDestination: null,
  targetDestination: "origin",
  flightStatus: "idle",
  flightProgress: 1.0,
  dossierOpen: true,
});

let currentState: NavigationState = INITIAL_NAVIGATION_STATE;

const navListeners = new Set<() => void>();

function notify() {
  navListeners.forEach((fn) => fn());
}

export function subscribeNavigation(callback: () => void) {
  navListeners.add(callback);
  return () => {
    navListeners.delete(callback);
  };
}

export function getNavigationSnapshot(): NavigationState {
  return currentState;
}

export function getNavigationServerSnapshot(): NavigationState {
  return INITIAL_NAVIGATION_STATE;
}

export function setExperienceMode(mode: ExperienceMode) {
  if (currentState.experienceMode === mode) return;
  currentState = {
    ...currentState,
    experienceMode: mode,
  };
  notify();
}

export function enterExpedition(targetId?: DestinationId) {
  const dest = targetId || currentState.targetDestination || "origin";
  currentState = {
    ...currentState,
    experienceMode: "expedition",
    targetDestination: dest,
    dossierOpen: true,
  };
  notify();
}

export function exitExpedition() {
  if (currentState.experienceMode === "portfolio") return;
  currentState = {
    ...currentState,
    experienceMode: "portfolio",
  };
  notify();
}

export function travelTo(destinationId: DestinationId) {
  // If already at destination and arrived:
  if (destinationId === currentState.targetDestination && currentState.flightStatus === "arrived") {
    // If dossier is closed, open it and notify
    if (!currentState.dossierOpen) {
      currentState = { ...currentState, dossierOpen: true };
      notify();
    }
    return;
  }

  // If already traveling to this target, avoid redundant state updates
  if (destinationId === currentState.targetDestination && currentState.flightStatus === "traveling") {
    return;
  }

  currentState = {
    ...currentState,
    previousDestination: currentState.currentDestination,
    targetDestination: destinationId,
    flightStatus: "traveling",
    flightProgress: 0.0,
    dossierOpen: false, // Close dossier during warp
  };
  notify();
}

export function updateFlightProgress(progress: number) {
  if (currentState.flightStatus !== "traveling") return;

  if (progress >= 1.0) {
    currentState = {
      ...currentState,
      currentDestination: currentState.targetDestination,
      flightStatus: "arrived",
      flightProgress: 1.0,
      dossierOpen: true, // Automatically open dossier on arrival
    };
    notify();
  } else {
    // Only notify when the integer percentage changes to eliminate unnecessary 60Hz re-renders
    const currentPct = Math.round(currentState.flightProgress * 100);
    const newPct = Math.round(progress * 100);
    if (newPct !== currentPct) {
      currentState = {
        ...currentState,
        flightProgress: progress,
      };
      notify();
    }
  }
}

export function setDossierOpen(open: boolean) {
  if (currentState.dossierOpen === open) return;
  currentState = {
    ...currentState,
    dossierOpen: open,
  };
  notify();
}

export function toggleDossier() {
  currentState = {
    ...currentState,
    dossierOpen: !currentState.dossierOpen,
  };
  notify();
}

export function navigateNext() {
  const currentIndex = DESTINATION_LIST.indexOf(currentState.targetDestination);
  const nextIndex = (currentIndex + 1) % DESTINATION_LIST.length;
  travelTo(DESTINATION_LIST[nextIndex]);
}

export function navigatePrev() {
  const currentIndex = DESTINATION_LIST.indexOf(currentState.targetDestination);
  const prevIndex = (currentIndex - 1 + DESTINATION_LIST.length) % DESTINATION_LIST.length;
  travelTo(DESTINATION_LIST[prevIndex]);
}

export function navigateNextPlanet() {
  const currentPlanet = PLANETARY_DESTINATIONS.includes(currentState.targetDestination)
    ? currentState.targetDestination
    : PLANETARY_DESTINATIONS[0];
  const currentIndex = PLANETARY_DESTINATIONS.indexOf(currentPlanet);
  const nextIndex = (currentIndex + 1) % PLANETARY_DESTINATIONS.length;
  travelTo(PLANETARY_DESTINATIONS[nextIndex]);
}

export function navigatePrevPlanet() {
  const currentPlanet = PLANETARY_DESTINATIONS.includes(currentState.targetDestination)
    ? currentState.targetDestination
    : PLANETARY_DESTINATIONS[0];
  const currentIndex = PLANETARY_DESTINATIONS.indexOf(currentPlanet);
  const prevIndex = (currentIndex - 1 + PLANETARY_DESTINATIONS.length) % PLANETARY_DESTINATIONS.length;
  travelTo(PLANETARY_DESTINATIONS[prevIndex]);
}
