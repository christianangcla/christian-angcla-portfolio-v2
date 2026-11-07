"use client";

import React, { useEffect, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";
import { useTheme } from "@/components/theme/ThemeProvider";
import {
  DESTINATIONS,
  getNavigationSnapshot,
  subscribeNavigation,
  updateFlightProgress,
  travelTo,
  DestinationId,
} from "@/lib/universeNavigation";

let cachedWebGLSupport: boolean | null = null;

function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;
  if (cachedWebGLSupport !== null) return cachedWebGLSupport;
  try {
    const canvas = document.createElement("canvas");
    const gl = (canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    // Do not call loseContext() here: forcing context loss on a probe canvas while other
    // canvases initialise can destabilise the tab's GPU channel.
    const supported = !!(window.WebGLRenderingContext && gl);
    cachedWebGLSupport = supported;
    return supported;
  } catch {
    cachedWebGLSupport = false;
    return false;
  }
}

// Global active simulation mode state for Chapter 03 Interactive Playground
export type SimulationMode = "gravity" | "flow" | "pulse";
let currentSimulationMode: SimulationMode = "gravity";
const simListeners = new Set<() => void>();

export function setSimulationMode(mode: SimulationMode) {
  if (currentSimulationMode === mode) return;
  currentSimulationMode = mode;
  simListeners.forEach((l) => l());
}

export function subscribeSimulationMode(callback: () => void) {
  simListeners.add(callback);
  return () => {
    simListeners.delete(callback);
  };
}

export function getSimulationModeSnapshot(): SimulationMode {
  return currentSimulationMode;
}

export function getSimulationModeServerSnapshot(): SimulationMode {
  return "gravity";
}

// Planetary Navigation Compatibility Layer
export type ProjectSlug = "floodguard" | "bulldogs-exchange" | "intertwine" | "how-to-train-your-birdie";

export function setActiveProject(slug: ProjectSlug) {
  const destId: DestinationId = slug === "how-to-train-your-birdie" ? "birdie" : slug;
  travelTo(destId);
}

export function subscribeActiveProject(callback: () => void) {
  return subscribeNavigation(callback);
}

export function getActiveProjectSnapshot(): ProjectSlug {
  const nav = getNavigationSnapshot();
  if (nav.targetDestination === "birdie") return "how-to-train-your-birdie";
  if (["floodguard", "bulldogs-exchange", "intertwine"].includes(nav.targetDestination)) {
    return nav.targetDestination as ProjectSlug;
  }
  return "floodguard";
}

export function getActiveProjectServerSnapshot(): ProjectSlug {
  return "floodguard";
}

// Smooth Hermite interpolation curves
function smoothstep(min: number, max: number, value: number) {
  const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
  return x * x * (3 - 2 * x);
}

function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

const noopSubscribe = () => () => {};
const getWebglServerSnapshot = () => true;

interface ThemeSceneHandles {
  renderer: THREE.WebGLRenderer;
  fog: THREE.FogExp2;
  ambientLight: THREE.AmbientLight;
  sunLight: THREE.PointLight;
  cyanPointLight: THREE.PointLight;
  fillLight: THREE.PointLight;
  starGeo: THREE.BufferGeometry;
  starColorPaletteIndices: Uint8Array;
  starMat: THREE.PointsMaterial;
  simGeo: THREE.BufferGeometry;
  simColorIsViolet: Uint8Array;
  hullMat: THREE.MeshStandardMaterial;
  spineMat: THREE.MeshStandardMaterial;
  cockpitMat: THREE.MeshPhysicalMaterial;
  cockpitRimMat: THREE.MeshBasicMaterial;
  wingMat: THREE.MeshStandardMaterial;
  wingletMat: THREE.MeshStandardMaterial;
  tipLeftMat: THREE.MeshBasicMaterial;
  tipRightMat: THREE.MeshBasicMaterial;
  ringMat: THREE.MeshBasicMaterial;
  plumeMat: THREE.MeshBasicMaterial;
  innerTrailMat: THREE.MeshBasicMaterial;
  gimbal1Mat: THREE.MeshStandardMaterial;
  orbitalArcMat: THREE.MeshBasicMaterial;
  crystalMat: THREE.MeshPhysicalMaterial;
  crystalWireMat: THREE.LineBasicMaterial;
  stationCoreMat: THREE.MeshStandardMaterial;
  floodMat: THREE.MeshStandardMaterial;
  bulldogsMat: THREE.MeshStandardMaterial;
  interMat: THREE.MeshStandardMaterial;
  birdieMat: THREE.MeshStandardMaterial;
  beaconPulseRingMat: THREE.MeshBasicMaterial;
}

function applyThemeToScene(handles: ThemeSceneHandles, isDark: boolean) {
  const clearColor = isDark ? 0x09090d : 0xf8f7fa;
  const primaryColor = isDark ? 0xa855f7 : 0x7c3aed;
  const secondaryColor = isDark ? 0xd8b4fe : 0x9333ea;
  const cyanColor = isDark ? 0x38bdf8 : 0x0284c7;
  const darkObsidian = isDark ? 0x161224 : 0x484156;

  handles.renderer.setClearColor(clearColor, 1.0);
  handles.fog.color.setHex(clearColor);

  const inExpedition = getNavigationSnapshot().experienceMode === "expedition";
  handles.ambientLight.color.setHex(isDark ? 0x221338 : 0xede4f8);
  handles.ambientLight.intensity = inExpedition
    ? isDark
      ? 2.0
      : 2.6
    : isDark
      ? 1.0
      : 1.4;

  handles.sunLight.color.setHex(primaryColor);
  handles.sunLight.intensity = isDark ? 6.5 : 4.5;
  handles.cyanPointLight.color.setHex(cyanColor);
  handles.cyanPointLight.intensity = isDark ? 4.5 : 3.5;
  handles.fillLight.color.setHex(secondaryColor);
  handles.fillLight.intensity = isDark ? 3.5 : 2.5;

  // Update starfield vertex colors & material
  const cWhite = new THREE.Color(isDark ? 0xffffff : 0x473f55);
  const cViolet = new THREE.Color(primaryColor);
  const cCyan = new THREE.Color(cyanColor);
  const cSoftViolet = new THREE.Color(secondaryColor);

  const starColorsAttr = handles.starGeo.getAttribute("color") as THREE.BufferAttribute;
  const starColors = starColorsAttr.array as Float32Array;
  const starCount = handles.starColorPaletteIndices.length;
  for (let i = 0; i < starCount; i++) {
    const idx = handles.starColorPaletteIndices[i];
    const col = idx === 0 ? cWhite : idx === 1 ? cViolet : idx === 2 ? cCyan : cSoftViolet;
    starColors[i * 3] = col.r;
    starColors[i * 3 + 1] = col.g;
    starColors[i * 3 + 2] = col.b;
  }
  starColorsAttr.needsUpdate = true;

  handles.starMat.size = isDark ? 0.12 : 0.08;
  handles.starMat.opacity = inExpedition
    ? isDark
      ? 0.95
      : 0.7
    : isDark
      ? 0.55
      : 0.06;
  handles.starMat.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
  handles.starMat.needsUpdate = true;

  // Update simulation particle vertex colors
  const simColorsAttr = handles.simGeo.getAttribute("color") as THREE.BufferAttribute;
  const simColors = simColorsAttr.array as Float32Array;
  const simCount = handles.simColorIsViolet.length;
  for (let i = 0; i < simCount; i++) {
    const pCol = handles.simColorIsViolet[i] === 1 ? cViolet : cCyan;
    simColors[i * 3] = pCol.r;
    simColors[i * 3 + 1] = pCol.g;
    simColors[i * 3 + 2] = pCol.b;
  }
  simColorsAttr.needsUpdate = true;

  // Update spacecraft, core, station & planetary materials
  handles.hullMat.color.setHex(isDark ? 0x1a162b : 0xe4def0);
  handles.spineMat.color.setHex(darkObsidian);
  handles.cockpitMat.color.setHex(cyanColor);
  handles.cockpitMat.emissive.setHex(cyanColor);
  handles.cockpitRimMat.color.setHex(primaryColor);
  handles.wingMat.color.setHex(isDark ? 0x141022 : 0xd8d0e8);
  handles.wingletMat.color.setHex(darkObsidian);
  handles.tipLeftMat.color.setHex(primaryColor);
  handles.tipRightMat.color.setHex(cyanColor);
  handles.ringMat.color.setHex(cyanColor);
  handles.plumeMat.color.setHex(cyanColor);
  handles.innerTrailMat.color.setHex(primaryColor);
  handles.gimbal1Mat.color.setHex(darkObsidian);
  handles.orbitalArcMat.color.setHex(primaryColor);
  handles.crystalMat.color.setHex(isDark ? 0x241840 : 0xf1e8fc);
  handles.crystalMat.emissive.setHex(isDark ? 0x1f0e38 : 0x5b259d);
  handles.crystalMat.emissiveIntensity = isDark ? 0.9 : 0.5;
  handles.crystalWireMat.color.setHex(cyanColor);
  handles.stationCoreMat.color.setHex(isDark ? 0x1a243d : 0xdfe8fc);
  handles.floodMat.color.setHex(isDark ? 0x082f49 : 0xbae6fd);
  handles.bulldogsMat.color.setHex(isDark ? 0x064e3b : 0xa7f3d0);
  handles.interMat.color.setHex(isDark ? 0x4c1d95 : 0xe9d5ff);
  handles.birdieMat.color.setHex(isDark ? 0x78350f : 0xfde68a);
  handles.beaconPulseRingMat.color.setHex(primaryColor);
}

function attachNavigationFallback(reason: string): () => void {
  console.warn(
    `[CosmicWorld] 3D WebGL background unavailable (${reason}). Using 2D navigation fallback.`
  );
  let fallbackTimer: number | null = null;

  const checkAndCompleteFlight = () => {
    const nav = getNavigationSnapshot();
    if (nav.flightStatus === "traveling") {
      if (fallbackTimer !== null) {
        window.clearTimeout(fallbackTimer);
      }
      fallbackTimer = window.setTimeout(() => {
        fallbackTimer = null;
        updateFlightProgress(1.0);
      }, 350);
    }
  };

  checkAndCompleteFlight();
  const unsubscribe = subscribeNavigation(checkAndCompleteFlight);

  return () => {
    unsubscribe();
    if (fallbackTimer !== null) {
      window.clearTimeout(fallbackTimer);
    }
  };
}

export function CosmicWorld() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDarkRef = useRef(resolvedTheme === "dark");
  const sceneHandlesRef = useRef<ThemeSceneHandles | null>(null);

  const webglSupported = useSyncExternalStore(
    noopSubscribe,
    checkWebGLSupport,
    getWebglServerSnapshot
  );

  // Lightweight theme effect: updates clear color, fog, lights, and particle/mesh colors without recreating the WebGLRenderer
  useEffect(() => {
    const isDark = resolvedTheme === "dark";
    isDarkRef.current = isDark;
    if (sceneHandlesRef.current) {
      applyThemeToScene(sceneHandlesRef.current, isDark);
    }
  }, [resolvedTheme, webglSupported]);

  useEffect(() => {
    if (!webglSupported) {
      return attachNavigationFallback("WebGL unsupported by browser");
    }

    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let animationFrameId = 0;

    // Create a fresh <canvas> per mount so React Strict Mode remounts never reuse a canvas whose context was lost
    const canvas = document.createElement("canvas");
    canvas.className = "h-full w-full block outline-none pointer-events-none";
    canvas.style.touchAction = "none";
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    // Renderer Setup: let Three.js create its own context with the attributes it needs
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: false,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "WebGLRenderer creation threw";
      return attachNavigationFallback(msg);
    }

    container.appendChild(canvas);

    // If the browser drops the context, remove the dead opaque canvas (it would paint
    // solid white/black) and fall back to the 2D navigation path.
    let detachFallback: (() => void) | null = null;
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(animationFrameId);
      canvas.remove();
      if (!detachFallback) detachFallback = attachNavigationFallback("WebGL context lost");
    };
    canvas.addEventListener("webglcontextlost", handleContextLost);

    const isDark = isDarkRef.current;
    const clearColor = isDark ? 0x09090d : 0xf8f7fa;
    renderer.setClearColor(clearColor, 1.0);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const fog = new THREE.FogExp2(clearColor, 0.008);
    scene.fog = fog;

    // Dedicated Container for 3D Space Expedition Worlds
    // In Portfolio Mode, this container is hidden so editorial typography has 100% clarity.
    const expeditionWorld = new THREE.Group();
    scene.add(expeditionWorld);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      350
    );

    // Initial Camera Position (Origin Launch Bay)
    const initialConfig = DESTINATIONS.origin;
    camera.position.set(...initialConfig.camPos);
    camera.lookAt(...initialConfig.lookAt);

    // Dynamic Navigation Flight Targets
    const currentCamPos = new THREE.Vector3(...initialConfig.camPos);
    const targetCamPos = new THREE.Vector3(...initialConfig.camPos);
    const currentLookAt = new THREE.Vector3(...initialConfig.lookAt);
    const targetLookAt = new THREE.Vector3(...initialConfig.lookAt);

    const currentShipPos = new THREE.Vector3(...initialConfig.shipPos);
    const targetShipPos = new THREE.Vector3(...initialConfig.shipPos);
    const currentShipRot = new THREE.Vector3(...initialConfig.shipRot);
    const targetShipRot = new THREE.Vector3(...initialConfig.shipRot);

    let activeDestId: DestinationId = "origin";
    let isTraveling = false;
    let flightElapsedTime = 0;
    const flightDuration = prefersReducedMotion ? 0.3 : 1.7; // seconds

    const startCamPos = new THREE.Vector3(...initialConfig.camPos);
    const startLookAt = new THREE.Vector3(...initialConfig.lookAt);
    const startShipPos = new THREE.Vector3(...initialConfig.shipPos);
    const startShipRot = new THREE.Vector3(...initialConfig.shipRot);

    // Color definitions
    const primaryColor = isDark ? 0xa855f7 : 0x7c3aed; // Electric Violet
    const secondaryColor = isDark ? 0xd8b4fe : 0x9333ea; // Soft Ultraviolet
    const cyanColor = isDark ? 0x38bdf8 : 0x0284c7; // Technical Cyan
    const darkObsidian = isDark ? 0x161224 : 0x484156;

    // 1. Lighting Rig
    const ambientLight = new THREE.AmbientLight(
      isDark ? 0x221338 : 0xede4f8,
      isDark ? 2.0 : 2.6
    );
    scene.add(ambientLight);

    // Central Sun / Stellar Core Point Light
    const sunLight = new THREE.PointLight(primaryColor, isDark ? 6.5 : 4.5, 45);
    sunLight.position.set(0, 0, -2);
    expeditionWorld.add(sunLight);

    const cyanPointLight = new THREE.PointLight(cyanColor, isDark ? 4.5 : 3.5, 35);
    cyanPointLight.position.set(10, 3, -2);
    expeditionWorld.add(cyanPointLight);

    const fillLight = new THREE.PointLight(secondaryColor, isDark ? 3.5 : 2.5, 30);
    fillLight.position.set(-8, -2, -6);
    expeditionWorld.add(fillLight);

    // 2. Cosmic Starfield Infinity Layer (Persistent, Never resets)
    const starsGroup = new THREE.Group();
    scene.add(starsGroup);

    const starCount = 2200;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starColorPaletteIndices = new Uint8Array(starCount);

    const cWhite = new THREE.Color(isDark ? 0xffffff : 0x473f55);
    const cViolet = new THREE.Color(primaryColor);
    const cCyan = new THREE.Color(cyanColor);
    const cSoftViolet = new THREE.Color(secondaryColor);

    for (let i = 0; i < starCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 160 + Math.random() * 80;

      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      const p = Math.random();
      const paletteIdx = p < 0.6 ? 0 : p < 0.8 ? 1 : p < 0.92 ? 2 : 3;
      starColorPaletteIndices[i] = paletteIdx;
      const col =
        paletteIdx === 0
          ? cWhite
          : paletteIdx === 1
            ? cViolet
            : paletteIdx === 2
              ? cCyan
              : cSoftViolet;
      starColors[i * 3] = col.r;
      starColors[i * 3 + 1] = col.g;
      starColors[i * 3 + 2] = col.b;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: isDark ? 0.12 : 0.08,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 0.95 : 0.7,
      depthWrite: false,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      sizeAttenuation: true,
    });
    const starField = new THREE.Points(starGeo, starMat);
    starField.frustumCulled = false;
    starsGroup.add(starField);

    // =========================================================================
    // 3. THE ODYSSEY RECON CRAFT (Prominent, High-Detail Spacecraft Vessel)
    // Modeled with stealth delta-wing geometries, glowing hull seams, canopy, and engine bells
    // =========================================================================
    const shipGroup = new THREE.Group();
    shipGroup.position.set(...initialConfig.shipPos);
    shipGroup.rotation.set(...initialConfig.shipRot);
    expeditionWorld.add(shipGroup);

    // A. Main Center Fuselage (Lifting-body stealth cone)
    const hullGeo = new THREE.ConeGeometry(0.55, 2.4, 6);
    const hullMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x1a162b : 0xe4def0,
      metalness: 0.92,
      roughness: 0.22,
    });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.rotation.x = -Math.PI / 2;
    shipGroup.add(hull);

    // Upper Fuselage Spine Armor Plate
    const spineGeo = new THREE.BoxGeometry(0.35, 0.18, 1.6);
    const spineMat = new THREE.MeshStandardMaterial({
      color: darkObsidian,
      metalness: 0.95,
      roughness: 0.28,
    });
    const spine = new THREE.Mesh(spineGeo, spineMat);
    spine.position.set(0, 0.15, -0.15);
    shipGroup.add(spine);

    // B. Cockpit Canopy Dome (Glowing glass + instrument reflection)
    const cockpitGeo = new THREE.BoxGeometry(0.24, 0.16, 0.75);
    const cockpitMat = new THREE.MeshPhysicalMaterial({
      color: cyanColor,
      emissive: cyanColor,
      emissiveIntensity: 0.65,
      roughness: 0.08,
      metalness: 0.9,
      transmission: 0.7,
      transparent: true,
      opacity: 0.92,
    });
    const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat);
    cockpit.position.set(0, 0.24, 0.22);
    shipGroup.add(cockpit);

    // Cockpit Glow Rim Light
    const cockpitRimGeo = new THREE.TorusGeometry(0.18, 0.015, 8, 24);
    const cockpitRimMat = new THREE.MeshBasicMaterial({ color: primaryColor });
    const cockpitRim = new THREE.Mesh(cockpitRimGeo, cockpitRimMat);
    cockpitRim.rotation.x = Math.PI / 2;
    cockpitRim.position.set(0, 0.25, 0.35);
    shipGroup.add(cockpitRim);

    // C. Swept Delta Main Wings
    const wingGeo = new THREE.BoxGeometry(2.8, 0.04, 0.9);
    const wingMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x141022 : 0xd8d0e8,
      metalness: 0.94,
      roughness: 0.24,
    });
    const wings = new THREE.Mesh(wingGeo, wingMat);
    wings.position.set(0, -0.02, -0.35);
    shipGroup.add(wings);

    // Forward Swept Wing Extension Strips
    const fwdWingGeo = new THREE.BoxGeometry(1.9, 0.03, 0.45);
    const fwdWing = new THREE.Mesh(fwdWingGeo, wingMat);
    fwdWing.position.set(0, -0.01, 0.15);
    shipGroup.add(fwdWing);

    // D. Angled Wingtip Stabilizers (Winglets)
    const wingletGeo = new THREE.BoxGeometry(0.04, 0.55, 0.6);
    const wingletMat = new THREE.MeshStandardMaterial({
      color: darkObsidian,
      metalness: 0.9,
      roughness: 0.3,
    });

    const leftWinglet = new THREE.Mesh(wingletGeo, wingletMat);
    leftWinglet.position.set(-1.4, 0.22, -0.4);
    leftWinglet.rotation.z = -0.22;
    shipGroup.add(leftWinglet);

    const rightWinglet = new THREE.Mesh(wingletGeo, wingletMat);
    rightWinglet.position.set(1.4, 0.22, -0.4);
    rightWinglet.rotation.z = 0.22;
    shipGroup.add(rightWinglet);

    // Wingtip Beacons
    const beaconGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const tipLeftMat = new THREE.MeshBasicMaterial({ color: primaryColor });
    const tipLeft = new THREE.Mesh(beaconGeo, tipLeftMat);
    tipLeft.position.set(-1.42, 0.48, -0.4);
    shipGroup.add(tipLeft);

    const tipRightMat = new THREE.MeshBasicMaterial({ color: cyanColor });
    const tipRight = new THREE.Mesh(beaconGeo, tipRightMat);
    tipRight.position.set(1.42, 0.48, -0.4);
    shipGroup.add(tipRight);

    // E. Heavy Twin Propulsion Engine Nacelles
    const engineGeo = new THREE.CylinderGeometry(0.12, 0.18, 0.65, 16);
    const engineMat = new THREE.MeshStandardMaterial({
      color: 0x0e0c16,
      metalness: 0.96,
      roughness: 0.2,
    });

    const engineLeft = new THREE.Mesh(engineGeo, engineMat);
    engineLeft.rotation.x = Math.PI / 2;
    engineLeft.position.set(-0.35, -0.02, -1.05);
    shipGroup.add(engineLeft);

    const engineRight = new THREE.Mesh(engineGeo, engineMat);
    engineRight.rotation.x = Math.PI / 2;
    engineRight.position.set(0.35, -0.02, -1.05);
    shipGroup.add(engineRight);

    // Engine Core Glow Rings
    const ringGeo = new THREE.TorusGeometry(0.14, 0.02, 12, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: cyanColor });
    const ringL = new THREE.Mesh(ringGeo, ringMat);
    ringL.position.set(-0.35, -0.02, -1.35);
    shipGroup.add(ringL);

    const ringR = new THREE.Mesh(ringGeo, ringMat);
    ringR.position.set(0.35, -0.02, -1.35);
    shipGroup.add(ringR);

    // F. Dynamic Hyperspace Ion Thruster Plumes
    const plumeGeo = new THREE.ConeGeometry(0.16, 1.4, 16);
    const plumeMat = new THREE.MeshBasicMaterial({
      color: cyanColor,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const plumeLeft = new THREE.Mesh(plumeGeo, plumeMat);
    plumeLeft.rotation.x = -Math.PI / 2;
    plumeLeft.position.set(-0.35, -0.02, -2.05);
    shipGroup.add(plumeLeft);

    const plumeRight = new THREE.Mesh(plumeGeo, plumeMat);
    plumeRight.rotation.x = -Math.PI / 2;
    plumeRight.position.set(0.35, -0.02, -2.05);
    shipGroup.add(plumeRight);

    // Violet Core Warp Trails (Inner Core Beam)
    const innerTrailGeo = new THREE.ConeGeometry(0.08, 1.8, 12);
    const innerTrailMat = new THREE.MeshBasicMaterial({
      color: primaryColor,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const trailL = new THREE.Mesh(innerTrailGeo, innerTrailMat);
    trailL.rotation.x = -Math.PI / 2;
    trailL.position.set(-0.35, -0.02, -2.25);
    shipGroup.add(trailL);

    const trailR = new THREE.Mesh(innerTrailGeo, innerTrailMat);
    trailR.rotation.x = -Math.PI / 2;
    trailR.position.set(0.35, -0.02, -2.25);
    shipGroup.add(trailR);

    // =========================================================================
    // 4. CENTRAL STELLAR CORE / SINGULARITY (World Coordinates: 0, 0, -2)
    // =========================================================================
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 0, -2);
    expeditionWorld.add(coreGroup);

    // Gimbal Ring 1
    const gimbal1Geo = new THREE.TorusGeometry(3.2, 0.045, 24, 120);
    const gimbal1Mat = new THREE.MeshStandardMaterial({
      color: darkObsidian,
      metalness: 0.9,
      roughness: 0.2,
    });
    const gimbal1 = new THREE.Mesh(gimbal1Geo, gimbal1Mat);
    coreGroup.add(gimbal1);

    // Glowing Orbital Ring
    const orbitalArcGeo = new THREE.TorusGeometry(3.4, 0.02, 16, 120);
    const orbitalArcMat = new THREE.MeshBasicMaterial({
      color: primaryColor,
      transparent: true,
      opacity: 0.85,
    });
    const orbitalArc = new THREE.Mesh(orbitalArcGeo, orbitalArcMat);
    orbitalArc.rotation.x = Math.PI / 3;
    coreGroup.add(orbitalArc);

    // Central Crystalline Gemstone Core
    const crystalGeo = new THREE.IcosahedronGeometry(1.2, 0);
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x241840 : 0xf1e8fc,
      emissive: isDark ? 0x1f0e38 : 0x5b259d,
      emissiveIntensity: isDark ? 0.9 : 0.5,
      roughness: 0.12,
      metalness: 0.85,
      transparent: true,
      opacity: 0.92,
    });
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
    coreGroup.add(crystalMesh);

    const crystalWireGeo = new THREE.WireframeGeometry(crystalGeo);
    const crystalWireMat = new THREE.LineBasicMaterial({
      color: cyanColor,
      transparent: true,
      opacity: 0.75,
    });
    const crystalWire = new THREE.LineSegments(crystalWireGeo, crystalWireMat);
    crystalMesh.add(crystalWire);

    // =========================================================================
    // 5. DISCIPLINARY CORE STATION (World Coordinates: -7.2, 1.8, -1.8)
    // =========================================================================
    const stationGroup = new THREE.Group();
    stationGroup.position.set(-7.2, 1.8, -1.8);
    expeditionWorld.add(stationGroup);

    const stationCoreGeo = new THREE.OctahedronGeometry(1.1, 0);
    const stationCoreMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x1a243d : 0xdfe8fc,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.4,
      metalness: 0.85,
      roughness: 0.2,
    });
    const stationCore = new THREE.Mesh(stationCoreGeo, stationCoreMat);
    stationGroup.add(stationCore);

    const stationRingGeo = new THREE.TorusGeometry(1.8, 0.02, 16, 64);
    const stationRing = new THREE.Mesh(
      stationRingGeo,
      new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.75 })
    );
    stationRing.rotation.x = Math.PI / 4;
    stationGroup.add(stationRing);

    // =========================================================================
    // 6. PLANETARY DESTINATIONS (Permanent World Coordinates, No popping!)
    // =========================================================================

    // Planet 1: FloodGuard (Hydrological Radar World at 10.2, 1.4, -4.0)
    const planetFloodGroup = new THREE.Group();
    planetFloodGroup.position.set(10.2, 1.4, -4.0);
    expeditionWorld.add(planetFloodGroup);

    const floodGeo = new THREE.SphereGeometry(1.65, 32, 32);
    const floodMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x082f49 : 0xbae6fd,
      emissive: 0x0284c7,
      emissiveIntensity: 0.45,
      roughness: 0.28,
      metalness: 0.65,
    });
    const planetFlood = new THREE.Mesh(floodGeo, floodMat);
    planetFloodGroup.add(planetFlood);

    const floodRingGeo = new THREE.TorusGeometry(2.35, 0.022, 16, 80);
    const floodRadarRing = new THREE.Mesh(
      floodRingGeo,
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.85 })
    );
    floodRadarRing.rotation.x = Math.PI / 3.2;
    planetFloodGroup.add(floodRadarRing);

    // Planet 2: Bulldogs Exchange (Commerce Ledger Nexus at 5.2, 3.1, -6.4)
    const planetBulldogsGroup = new THREE.Group();
    planetBulldogsGroup.position.set(5.2, 3.1, -6.4);
    expeditionWorld.add(planetBulldogsGroup);

    const bulldogsGeo = new THREE.SphereGeometry(1.5, 32, 32);
    const bulldogsMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x064e3b : 0xa7f3d0,
      emissive: 0x059669,
      emissiveIntensity: 0.4,
      roughness: 0.32,
      metalness: 0.55,
    });
    const planetBulldogs = new THREE.Mesh(bulldogsGeo, bulldogsMat);
    planetBulldogsGroup.add(planetBulldogs);

    const bulldogsRingGeo = new THREE.TorusGeometry(2.15, 0.018, 16, 80);
    const bulldogsRing = new THREE.Mesh(
      bulldogsRingGeo,
      new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.8 })
    );
    bulldogsRing.rotation.y = Math.PI / 4;
    planetBulldogsGroup.add(bulldogsRing);

    // Planet 3: Intertwine (Reactive Mobile Resonance World at 7.8, -3.8, -12.0)
    const planetInterGroup = new THREE.Group();
    planetInterGroup.position.set(7.8, -3.8, -12.0);
    expeditionWorld.add(planetInterGroup);

    const interGeo = new THREE.SphereGeometry(1.55, 32, 32);
    const interMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x4c1d95 : 0xe9d5ff,
      emissive: 0x7c3aed,
      emissiveIntensity: 0.45,
      roughness: 0.25,
      metalness: 0.72,
    });
    const planetInter = new THREE.Mesh(interGeo, interMat);
    planetInterGroup.add(planetInter);

    const interRingGeo = new THREE.TorusGeometry(2.25, 0.02, 16, 80);
    const interRing = new THREE.Mesh(
      interRingGeo,
      new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.85 })
    );
    interRing.rotation.x = -Math.PI / 3.8;
    planetInterGroup.add(interRing);

    // Planet 4: How to Train Your Birdie (Arcade Collision Matrix at -6.8, 4.2, -14.0)
    const planetBirdieGroup = new THREE.Group();
    planetBirdieGroup.position.set(-6.8, 4.2, -14.0);
    expeditionWorld.add(planetBirdieGroup);

    const birdieGeo = new THREE.SphereGeometry(1.45, 32, 32);
    const birdieMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x78350f : 0xfde68a,
      emissive: 0xd97706,
      emissiveIntensity: 0.4,
      roughness: 0.38,
      metalness: 0.55,
    });
    const planetBirdie = new THREE.Mesh(birdieGeo, birdieMat);
    planetBirdieGroup.add(planetBirdie);

    const birdieRingGeo = new THREE.TorusGeometry(2.05, 0.018, 16, 80);
    const birdieRing = new THREE.Mesh(
      birdieRingGeo,
      new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.8 })
    );
    birdieRing.rotation.z = Math.PI / 3;
    planetBirdieGroup.add(birdieRing);

    // =========================================================================
    // 7. SIMULATION MATRIX PARTICLE FIELD (World Coordinates: 0, 5.4, -6.0)
    // =========================================================================
    const simParticleCount = 2000;
    const simGeo = new THREE.BufferGeometry();
    const simPositions = new Float32Array(simParticleCount * 3);
    const simVelocities = new Float32Array(simParticleCount * 3);
    const simColors = new Float32Array(simParticleCount * 3);
    const simColorIsViolet = new Uint8Array(simParticleCount);

    for (let i = 0; i < simParticleCount; i++) {
      const radius = 0.5 + Math.random() * 4.5;
      const angle = Math.random() * Math.PI * 2;
      simPositions[i * 3] = Math.cos(angle) * radius;
      simPositions[i * 3 + 1] = (Math.random() - 0.5) * 2.2;
      simPositions[i * 3 + 2] = Math.sin(angle) * radius;

      simVelocities[i * 3] = (Math.random() - 0.5) * 0.02;
      simVelocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      simVelocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;

      const isViolet = Math.random() > 0.4 ? 1 : 0;
      simColorIsViolet[i] = isViolet;
      const pCol = isViolet === 1 ? cViolet : cCyan;
      simColors[i * 3] = pCol.r;
      simColors[i * 3 + 1] = pCol.g;
      simColors[i * 3 + 2] = pCol.b;
    }

    simGeo.setAttribute("position", new THREE.BufferAttribute(simPositions, 3));
    simGeo.setAttribute("color", new THREE.BufferAttribute(simColors, 3));

    const simMat = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const simParticles = new THREE.Points(simGeo, simMat);
    simParticles.position.set(0, 5.4, -6.0);
    simParticles.frustumCulled = false;
    expeditionWorld.add(simParticles);

    // =========================================================================
    // 8. BEACON TRANSMISSION ARRAY (World Coordinates: 0, -5.8, -16.0)
    // =========================================================================
    const beaconGroup = new THREE.Group();
    beaconGroup.position.set(0, -5.8, -16.0);
    expeditionWorld.add(beaconGroup);

    const beaconSpireGeo = new THREE.CylinderGeometry(0.08, 0.35, 4.2, 8);
    const beaconSpire = new THREE.Mesh(
      beaconSpireGeo,
      new THREE.MeshStandardMaterial({ color: 0x221a36, metalness: 0.9, roughness: 0.2 })
    );
    beaconGroup.add(beaconSpire);

    const beaconPulseRingGeo = new THREE.TorusGeometry(1.6, 0.02, 16, 64);
    const beaconPulseRingMat = new THREE.MeshBasicMaterial({
      color: primaryColor,
      transparent: true,
      opacity: 0.8,
    });
    const beaconPulseRing = new THREE.Mesh(beaconPulseRingGeo, beaconPulseRingMat);
    beaconPulseRing.rotation.x = Math.PI / 2;
    beaconGroup.add(beaconPulseRing);

    sceneHandlesRef.current = {
      renderer,
      fog,
      ambientLight,
      sunLight,
      cyanPointLight,
      fillLight,
      starGeo,
      starColorPaletteIndices,
      starMat,
      simGeo,
      simColorIsViolet,
      hullMat,
      spineMat,
      cockpitMat,
      cockpitRimMat,
      wingMat,
      wingletMat,
      tipLeftMat,
      tipRightMat,
      ringMat,
      plumeMat,
      innerTrailMat,
      gimbal1Mat,
      orbitalArcMat,
      crystalMat,
      crystalWireMat,
      stationCoreMat,
      floodMat,
      bulldogsMat,
      interMat,
      birdieMat,
      beaconPulseRingMat,
    };
    applyThemeToScene(sceneHandlesRef.current, isDarkRef.current);

    // =========================================================================
    // POINTER & RESIZE LISTENERS
    // =========================================================================
    let rawMouseX = 0;
    let rawMouseY = 0;
    let smoothedMouseX = 0;
    let smoothedMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      rawMouseX = (e.clientX / window.innerWidth) * 2 - 1;
      rawMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!canvas) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    // =========================================================================
    // SUBSCRIBE TO NAVIGATION STORE (Direct Destination Flight Controller)
    // =========================================================================
    const unsubscribeNav = subscribeNavigation(() => {
      const nav = getNavigationSnapshot();
      if (nav.targetDestination !== activeDestId) {
        activeDestId = nav.targetDestination;
        const config = DESTINATIONS[activeDestId] || DESTINATIONS.origin;

        // Set start positions from current positions
        startCamPos.copy(currentCamPos);
        startLookAt.copy(currentLookAt);
        startShipPos.copy(currentShipPos);
        startShipRot.copy(currentShipRot);

        // Set target positions
        targetCamPos.set(...config.camPos);
        targetLookAt.set(...config.lookAt);
        targetShipPos.set(...config.shipPos);
        targetShipRot.set(...config.shipRot);

        isTraveling = true;
        flightElapsedTime = 0;
      }
    });

    // =========================================================================
    // UNIFIED ANIMATION & RENDER LOOP
    // =========================================================================
    let lastTime = performance.now();

    const animate = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Mouse Parallax Smoothing
      smoothedMouseX += (rawMouseX - smoothedMouseX) * 0.05;
      smoothedMouseY += (rawMouseY - smoothedMouseY) * 0.05;

      // Celestial Rotations
      coreGroup.rotation.y += 0.002;
      gimbal1.rotation.x += 0.001;
      orbitalArc.rotation.z += 0.003;
      crystalMesh.rotation.y -= 0.004;

      stationGroup.rotation.y += 0.004;
      stationRing.rotation.z += 0.008;

      planetFlood.rotation.y += 0.003;
      floodRadarRing.rotation.z += 0.015;

      planetBulldogs.rotation.y += 0.0025;
      bulldogsRing.rotation.x += 0.012;

      planetInter.rotation.y += 0.0035;
      interRing.rotation.y += 0.014;

      planetBirdie.rotation.y += 0.003;
      birdieRing.rotation.z += 0.016;

      beaconPulseRing.scale.addScalar(0.008);
      if (beaconPulseRing.scale.x > 2.5) {
        beaconPulseRing.scale.set(0.6, 0.6, 0.6);
      }

      // Starfield gentle precession
      starField.rotation.y += 0.0001;
      starField.rotation.x += 0.00005;

      const navSnapshot = getNavigationSnapshot();
      const inExpedition = navSnapshot.experienceMode === "expedition";
      const currentIsDark = isDarkRef.current;
      expeditionWorld.visible = inExpedition;
      starMat.opacity = inExpedition
        ? currentIsDark
          ? 0.95
          : 0.7
        : currentIsDark
          ? 0.55
          : 0.06;
      ambientLight.intensity = inExpedition
        ? currentIsDark
          ? 2.0
          : 2.6
        : currentIsDark
          ? 1.0
          : 1.4;

      if (!inExpedition) {
        // ---------------------------------------------------------------------
        // AMBIENT PORTFOLIO BACKGROUND MODE (Architectural, Calm, Non-Intrusive)
        // Expedition geometries are hidden so typography is 100% legible.
        // ---------------------------------------------------------------------
        const ambientFloat = Math.sin(now * 0.0006) * 0.08;
        camera.position.set(
          smoothedMouseX * 0.2,
          0.4 + ambientFloat + smoothedMouseY * 0.15,
          10.5
        );
        camera.lookAt(0, 0, 0);
      } else {
        // ---------------------------------------------------------------------
        // EXPEDITION MODE: FLIGHT INTERPOLATION & PROPULSION
        // ---------------------------------------------------------------------
        let warpFactor = 0; // 0 (idle) to 1 (full warp)

        if (isTraveling) {
          flightElapsedTime += delta;
          const rawProgress = Math.min(1.0, flightElapsedTime / flightDuration);
          const t = smoothstep(0, 1, rawProgress);

          // Hermite interpolate camera and lookAt
          currentCamPos.lerpVectors(startCamPos, targetCamPos, t);
          currentLookAt.lerpVectors(startLookAt, targetLookAt, t);

          // Spaceship movement with lead and bank
          currentShipPos.lerpVectors(startShipPos, targetShipPos, t);

          // Turn towards travel vector
          currentShipRot.x = lerp(startShipRot.x, targetShipRot.x, t);
          currentShipRot.y = lerp(startShipRot.y, targetShipRot.y, t);

          // Banking roll proportional to travel velocity
          const rollT = Math.sin(rawProgress * Math.PI);
          const targetRoll = (targetShipPos.x - startShipPos.x) * 0.08;
          currentShipRot.z = lerp(startShipRot.z, targetShipRot.z, t) - targetRoll * rollT;

          // Thruster Warp Flare Intensity Curve (bell curve peaking at t=0.5)
          warpFactor = Math.sin(rawProgress * Math.PI);

          updateFlightProgress(rawProgress);

          if (rawProgress >= 1.0) {
            isTraveling = false;
          }
        } else {
          // Idle Cruise Floating Motion
          const idleFloat = Math.sin(now * 0.0018) * 0.04;
          currentShipPos.y = targetShipPos.y + idleFloat;
          currentShipRot.set(
            targetShipRot.x + smoothedMouseY * 0.05,
            targetShipRot.y - smoothedMouseX * 0.05,
            targetShipRot.z
          );
        }

        // Apply coordinates to Three.js camera & ship
        camera.position.set(
          currentCamPos.x + smoothedMouseX * 0.25,
          currentCamPos.y + smoothedMouseY * 0.25,
          currentCamPos.z
        );
        camera.lookAt(
          currentLookAt.x + smoothedMouseX * 0.1,
          currentLookAt.y + smoothedMouseY * 0.1,
          currentLookAt.z
        );

        // Ship positioning
        shipGroup.position.copy(currentShipPos);
        shipGroup.rotation.set(currentShipRot.x, currentShipRot.y, currentShipRot.z);

        // Dynamic Propulsion Plume Scaling (Hyperspace Engine Flare)
        const baseScale = 1.0 + warpFactor * 2.8;
        const flicker = 1.0 + (Math.random() - 0.5) * 0.15;
        plumeLeft.scale.set(baseScale * flicker, baseScale * 2.6 * flicker, baseScale * flicker);
        plumeRight.scale.set(baseScale * flicker, baseScale * 2.6 * flicker, baseScale * flicker);
        trailL.scale.set(1.0 + warpFactor * 1.5, 1.0 + warpFactor * 3.2, 1.0 + warpFactor * 1.5);
        trailR.scale.set(1.0 + warpFactor * 1.5, 1.0 + warpFactor * 3.2, 1.0 + warpFactor * 1.5);
      }

      // Starfield infinity sphere strictly locked to camera
      starsGroup.position.copy(camera.position);

      // -----------------------------------------------------------------------
      // CHAPTER 03 INTERACTIVE SIMULATION PARTICLES (Only active in Expedition mode)
      // -----------------------------------------------------------------------
      if (inExpedition) {
        const positions = simGeo.attributes.position.array as Float32Array;
        const velocities = simVelocities;
        const mode = currentSimulationMode;
        const cursorTargetX = rawMouseX * 3.5;
        const cursorTargetY = rawMouseY * 2.5;

        for (let i = 0; i < simParticleCount; i++) {
          const idx = i * 3;
          const px = positions[idx];
          const py = positions[idx + 1];
          const pz = positions[idx + 2];

          if (mode === "gravity") {
            const dx = cursorTargetX - px;
            const dy = cursorTargetY - py;
            const dist = Math.max(0.2, Math.sqrt(dx * dx + dy * dy));
            const force = 0.0035 / dist;

            velocities[idx] += (dx / dist) * force - velocities[idx] * 0.04;
            velocities[idx + 1] += (dy / dist) * force - velocities[idx + 1] * 0.04;
            velocities[idx + 2] += (0 - pz) * 0.005;

            velocities[idx] += -dy * 0.0015;
            velocities[idx + 1] += dx * 0.0015;
          } else if (mode === "flow") {
            velocities[idx] = Math.sin(py * 1.5 + now * 0.0012) * 0.015;
            velocities[idx + 1] = Math.cos(px * 1.5 + now * 0.0012) * 0.012;
            velocities[idx + 2] = Math.sin((px + py) * 0.8 + now * 0.001) * 0.01;
          } else if (mode === "pulse") {
            const angle = Math.atan2(py, px);
            const pulseRadius = 1.8 + Math.sin(now * 0.0025 + i * 0.02) * 1.2;
            velocities[idx] = (Math.cos(angle) * pulseRadius - px) * 0.03;
            velocities[idx + 1] = (Math.sin(angle) * pulseRadius - py) * 0.03;
            velocities[idx + 2] = (Math.sin(now * 0.003) * 0.8 - pz) * 0.03;
          }

          positions[idx] += velocities[idx];
          positions[idx + 1] += velocities[idx + 1];
          positions[idx + 2] += velocities[idx + 2];
        }
        simGeo.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      sceneHandlesRef.current = null;
      canvas.removeEventListener("webglcontextlost", handleContextLost);
      detachFallback?.();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      unsubscribeNav();

      scene.traverse((obj) => {
        const renderable = obj as THREE.Mesh | THREE.LineSegments | THREE.Points;
        if (renderable.geometry) {
          renderable.geometry.dispose();
        }
        if (renderable.material) {
          const materials = Array.isArray(renderable.material)
            ? renderable.material
            : [renderable.material];
          for (const mat of materials) {
            for (const value of Object.values(mat)) {
              if (
                value &&
                typeof value === "object" &&
                "isTexture" in value &&
                (value as THREE.Texture).isTexture
              ) {
                (value as THREE.Texture).dispose();
              }
            }
            mat.dispose();
          }
        }
      });

      renderer.dispose();
      renderer.forceContextLoss();
      canvas.remove();
    };
  }, [webglSupported]);

  if (!webglSupported) {
    return (
      <div
        className="fixed inset-0 z-0 bg-background pointer-events-none"
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 h-full w-full bg-background outline-none pointer-events-none"
      aria-hidden="true"
    />
  );
}
