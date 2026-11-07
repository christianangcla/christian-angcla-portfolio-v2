"use client";

import React, { useEffect, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";
import { useTheme } from "@/components/theme/ThemeProvider";

function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function HeroSculpture() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const webglSupported = useSyncExternalStore(
    () => () => {},
    checkWebGLSupport,
    () => true
  );
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (!webglSupported) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Scene & Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.z = 5.2;

    const isDark = resolvedTheme === "dark";

    // Theme Color Tokens
    const primaryColor = isDark ? 0xa855f7 : 0x9333ea; // Electric Violet
    const secondaryColor = isDark ? 0xd8b4fe : 0xa855f7; // Soft Ultraviolet
    const cyanColor = isDark ? 0x38bdf8 : 0x0284c7; // Technical Cyan
    const crystalBase = isDark ? 0x1f1435 : 0xf1e8ff; // Deep Obsidian / Soft Lilac
    const crystalEmissive = isDark ? 0x160a28 : 0x4a1d82;

    // Master Sculpture Group
    const sculptureGroup = new THREE.Group();
    scene.add(sculptureGroup);

    // 1. Lighting System
    const ambientLight = new THREE.AmbientLight(
      isDark ? 0x221338 : 0xeee6fa,
      isDark ? 1.6 : 2.2
    );
    scene.add(ambientLight);

    const violetLight = new THREE.PointLight(primaryColor, isDark ? 5.5 : 4.0, 12);
    violetLight.position.set(3, 2.5, 3.5);
    scene.add(violetLight);

    const cyanLight = new THREE.PointLight(cyanColor, isDark ? 4.0 : 3.0, 10);
    cyanLight.position.set(-3.5, -2, 2.5);
    scene.add(cyanLight);

    const rimLight = new THREE.PointLight(secondaryColor, isDark ? 2.5 : 1.8, 8);
    rimLight.position.set(0, 4, -2);
    scene.add(rimLight);

    // 2. Central Faceted Crystalline Core
    const innerGeo = new THREE.IcosahedronGeometry(0.85, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: crystalBase,
      emissive: crystalEmissive,
      emissiveIntensity: isDark ? 0.6 : 0.35,
      roughness: 0.18,
      metalness: 0.75,
      transparent: true,
      opacity: isDark ? 0.92 : 0.85,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    sculptureGroup.add(innerMesh);

    // Inner Core Wireframe Accent
    const innerWireGeo = new THREE.WireframeGeometry(innerGeo);
    const innerWireMat = new THREE.LineBasicMaterial({
      color: cyanColor,
      transparent: true,
      opacity: isDark ? 0.85 : 0.75,
      linewidth: 1,
    });
    const innerWire = new THREE.LineSegments(innerWireGeo, innerWireMat);
    innerMesh.add(innerWire);

    // 3. Middle Geodesic Lattice (Icosahedron Wireframe)
    const midGeo = new THREE.IcosahedronGeometry(1.58, 1);
    const midWireGeo = new THREE.WireframeGeometry(midGeo);
    const midMat = new THREE.LineBasicMaterial({
      color: primaryColor,
      transparent: true,
      opacity: isDark ? 0.45 : 0.6,
      linewidth: 1,
    });
    const midLine = new THREE.LineSegments(midWireGeo, midMat);
    sculptureGroup.add(midLine);

    // 4. Luminous Lattice Vertex Nodes
    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", midGeo.getAttribute("position"));
    const nodeMat = new THREE.PointsMaterial({
      color: secondaryColor,
      size: 0.08,
      transparent: true,
      opacity: isDark ? 0.95 : 0.85,
    });
    const nodes = new THREE.Points(nodeGeo, nodeMat);
    sculptureGroup.add(nodes);

    // 5. Kinetic Gyroscopic Orbital Rings
    // Ring A (Equatorial Gyroscope)
    const ringAGeo = new THREE.TorusGeometry(2.15, 0.014, 16, 96);
    const ringAMat = new THREE.MeshStandardMaterial({
      color: primaryColor,
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: isDark ? 0.55 : 0.65,
    });
    const ringA = new THREE.Mesh(ringAGeo, ringAMat);
    ringA.rotation.x = Math.PI / 3;
    ringA.rotation.y = Math.PI / 8;
    sculptureGroup.add(ringA);

    // Ring B (Polar Gyroscope)
    const ringBGeo = new THREE.TorusGeometry(2.38, 0.012, 16, 96);
    const ringBMat = new THREE.MeshStandardMaterial({
      color: cyanColor,
      roughness: 0.25,
      metalness: 0.8,
      transparent: true,
      opacity: isDark ? 0.45 : 0.55,
    });
    const ringB = new THREE.Mesh(ringBGeo, ringBMat);
    ringB.rotation.x = -Math.PI / 3.5;
    ringB.rotation.z = Math.PI / 4;
    sculptureGroup.add(ringB);

    // Ring C (Fine Outer Astrolabe Band)
    const ringCGeo = new THREE.TorusGeometry(2.55, 0.007, 12, 80);
    const ringCMat = new THREE.MeshBasicMaterial({
      color: secondaryColor,
      transparent: true,
      opacity: isDark ? 0.28 : 0.35,
    });
    const ringC = new THREE.Mesh(ringCGeo, ringCMat);
    ringC.rotation.y = Math.PI / 2.5;
    sculptureGroup.add(ringC);

    // 6. Orbital Particle Cloud (Stardust / Swarm)
    const particleCount = 85;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.75 + Math.random() * 0.95;
      particlePositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = r * Math.cos(phi);
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: secondaryColor,
      size: 0.045,
      transparent: true,
      opacity: isDark ? 0.75 : 0.65,
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    sculptureGroup.add(particleCloud);

    // Responsive Canvas Resize
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Mouse Tracking with Inertial Physics
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseNormX = 0;
    let mouseNormY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseNormX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseNormY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = mouseNormX * 0.65;
      targetRotationX = -mouseNormY * 0.65;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      if (!prefersReducedMotion) {
        // Multi-axis rotation choreography
        sculptureGroup.rotation.y += 0.0025;
        sculptureGroup.rotation.x += 0.0012;

        // Counter-rotation of inner crystal
        innerMesh.rotation.y -= 0.005;
        innerMesh.rotation.z += 0.003;

        // Gyroscopic ring precession
        ringA.rotation.z += 0.003;
        ringB.rotation.y -= 0.0025;
        ringC.rotation.x += 0.0018;

        // Particle swarm gentle breathing orbit
        particleCloud.rotation.y += 0.0015;

        // Dynamic light precession based on time + cursor
        violetLight.position.x = Math.sin(elapsedTime * 0.8) * 3.2 + mouseNormX * 0.8;
        violetLight.position.y = Math.cos(elapsedTime * 0.6) * 2.8 + mouseNormY * 0.8;
      }

      // Smooth mouse parallax damping
      sculptureGroup.rotation.y +=
        (targetRotationY - (sculptureGroup.rotation.y % (Math.PI * 2))) * 0.035;
      sculptureGroup.rotation.x +=
        (targetRotationX - (sculptureGroup.rotation.x % (Math.PI * 2))) * 0.035;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup resources on unmount or theme switch
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);

      innerGeo.dispose();
      innerMat.dispose();
      innerWireGeo.dispose();
      innerWireMat.dispose();
      midGeo.dispose();
      midWireGeo.dispose();
      midMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      ringAGeo.dispose();
      ringAMat.dispose();
      ringBGeo.dispose();
      ringBMat.dispose();
      ringCGeo.dispose();
      ringCMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, [resolvedTheme, webglSupported]);

  return (
    <div
      ref={containerRef}
      className="relative flex aspect-square w-full max-w-[480px] sm:max-w-[540px] lg:max-w-[600px] xl:max-w-[660px] items-center justify-center select-none"
    >
      {/* Layered Ambient Glow Auras */}
      <div
        className="pointer-events-none absolute -inset-8 -z-10 rounded-full blur-3xl opacity-70 dark:opacity-85 transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.32) 0%, rgba(56,189,248,0.18) 42%, rgba(216,180,254,0.08) 60%, transparent 75%)",
        }}
      />
      <div
        className="pointer-events-none absolute -inset-16 -z-20 rounded-full blur-[100px] opacity-40 dark:opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.2) 0%, rgba(14,165,233,0.1) 50%, transparent 70%)",
        }}
      />

      {/* 3D WebGL Canvas */}
      {webglSupported ? (
        <canvas
          ref={canvasRef}
          className="h-full w-full cursor-grab active:cursor-grabbing touch-none"
          aria-label="Interactive 3D kinetic sculpture of Christian's Lab"
          role="img"
        />
      ) : (
        /* Accessible High-Fidelity SVG Fallback */
        <div className="flex h-full w-full items-center justify-center p-8">
          <svg
            className="h-full w-full text-primary"
            viewBox="0 0 300 300"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            aria-hidden="true"
          >
            {/* Concentric Gyro Rings */}
            <circle cx="150" cy="150" r="130" strokeOpacity="0.25" strokeDasharray="4 4" />
            <ellipse cx="150" cy="150" rx="120" ry="60" strokeOpacity="0.4" transform="rotate(-25 150 150)" />
            <ellipse cx="150" cy="150" rx="120" ry="60" strokeOpacity="0.35" transform="rotate(45 150 150)" />
            
            {/* Geodesic Lattice */}
            <polygon points="150,45 240,95 240,205 150,255 60,205 60,95" strokeOpacity="0.6" />
            <polygon points="150,85 210,120 210,180 150,215 90,180 90,120" strokeOpacity="0.8" />
            
            {/* Core Connections */}
            <line x1="150" y1="45" x2="150" y2="85" strokeOpacity="0.5" />
            <line x1="240" y1="95" x2="210" y2="120" strokeOpacity="0.5" />
            <line x1="240" y1="205" x2="210" y2="180" strokeOpacity="0.5" />
            <line x1="150" y1="255" x2="150" y2="215" strokeOpacity="0.5" />
            <line x1="60" y1="205" x2="90" y2="180" strokeOpacity="0.5" />
            <line x1="60" y1="95" x2="90" y2="120" strokeOpacity="0.5" />
            
            {/* Faceted Core */}
            <circle cx="150" cy="150" r="32" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.5" />
            <polygon points="150,125 172,162 128,162" fill="currentColor" fillOpacity="0.25" />
            
            {/* Node Dots */}
            <circle cx="150" cy="45" r="3" fill="currentColor" />
            <circle cx="240" cy="95" r="3" fill="currentColor" />
            <circle cx="240" cy="205" r="3" fill="currentColor" />
            <circle cx="150" cy="255" r="3" fill="currentColor" />
            <circle cx="60" cy="205" r="3" fill="currentColor" />
            <circle cx="60" cy="95" r="3" fill="currentColor" />
          </svg>
        </div>
      )}
    </div>
  );
}
