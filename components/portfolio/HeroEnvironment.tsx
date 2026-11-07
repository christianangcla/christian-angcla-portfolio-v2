"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function HeroEnvironment() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
    } catch {
      mount.classList.add("v5-webgl-fallback");
      return;
    }

    const initialWidth = mount.clientWidth || window.innerWidth;
    const initialHeight = mount.clientHeight || window.innerHeight;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.2 : 1.65));
    renderer.setSize(initialWidth, initialHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, initialWidth / initialHeight, 0.1, 160);
    camera.position.set(0, 1.1, 17);

    // ==========================================
    // 1. LIGHTING
    // ==========================================
    const hemiLight = new THREE.HemisphereLight(0x9dcfff, 0x050c18, 1.5);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xd9edff, 2.6);
    keyLight.position.set(-6, 8, 8);
    scene.add(keyLight);

    const rimLight = new THREE.PointLight(0x2ca0ff, 46, 36);
    rimLight.position.set(5.5, 2.2, -2.5);
    scene.add(rimLight);

    // Dynamic cursor light to cast interactive reflections
    const cursorLight = new THREE.PointLight(0x60b8ff, 12, 14);
    cursorLight.position.set(0, 1, 8);
    scene.add(cursorLight);

    const environment = new THREE.Group();
    scene.add(environment);

    // ==========================================
    // 2. PROCEDURAL TEXTURES (Nebula & Particles)
    // ==========================================
    function createGlowTexture(colorHex: string, size = 128) {
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        gradient.addColorStop(0, colorHex);
        gradient.addColorStop(0.35, colorHex);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
      }
      return new THREE.CanvasTexture(canvas);
    }

    const blueGlowTex = createGlowTexture("rgba(68, 164, 255, 0.75)");
    const softCloudTex = createGlowTexture("rgba(22, 68, 120, 0.35)", 256);

    // Background cosmic nebula plane
    const nebulaGeo = new THREE.PlaneGeometry(38, 24);
    const nebulaMat = new THREE.MeshBasicMaterial({
      map: softCloudTex,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nebula = new THREE.Mesh(nebulaGeo, nebulaMat);
    nebula.position.set(4, 0.5, -22);
    environment.add(nebula);

    // ==========================================
    // 3. MULTI-LAYER STARFIELDS
    // ==========================================
    // Layer A: Distant micro-stars (deep backdrop)
    const countA = window.innerWidth < 700 ? 600 : 1400;
    const posA = new Float32Array(countA * 3);
    for (let i = 0; i < countA; i++) {
      posA[i * 3] = (Math.random() - 0.5) * 70;
      posA[i * 3 + 1] = (Math.random() - 0.5) * 44;
      posA[i * 3 + 2] = -Math.random() * 65 - 15;
    }
    const geoA = new THREE.BufferGeometry();
    geoA.setAttribute("position", new THREE.BufferAttribute(posA, 3));
    const matA = new THREE.PointsMaterial({
      color: 0xaed7ff,
      size: 0.038,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true,
    });
    const starsA = new THREE.Points(geoA, matA);
    scene.add(starsA);

    // Layer B: Midground twinkling stars
    const countB = window.innerWidth < 700 ? 180 : 420;
    const posB = new Float32Array(countB * 3);
    for (let i = 0; i < countB; i++) {
      posB[i * 3] = (Math.random() - 0.5) * 55;
      posB[i * 3 + 1] = (Math.random() - 0.5) * 32;
      posB[i * 3 + 2] = -Math.random() * 40 - 2;
    }
    const geoB = new THREE.BufferGeometry();
    geoB.setAttribute("position", new THREE.BufferAttribute(posB, 3));
    const matB = new THREE.PointsMaterial({
      color: 0xdff0ff,
      size: 0.062,
      transparent: true,
      opacity: 0.85,
      map: blueGlowTex,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const starsB = new THREE.Points(geoB, matB);
    scene.add(starsB);

    // Layer C: Foreground floating luminous dust motes
    const countC = window.innerWidth < 700 ? 30 : 70;
    const posC = new Float32Array(countC * 3);
    const speedC = new Float32Array(countC);
    for (let i = 0; i < countC; i++) {
      posC[i * 3] = (Math.random() - 0.5) * 26;
      posC[i * 3 + 1] = (Math.random() - 0.5) * 16;
      posC[i * 3 + 2] = (Math.random() - 0.5) * 16 + 4;
      speedC[i] = 0.003 + Math.random() * 0.006;
    }
    const geoC = new THREE.BufferGeometry();
    geoC.setAttribute("position", new THREE.BufferAttribute(posC, 3));
    const matC = new THREE.PointsMaterial({
      color: 0x85cbff,
      size: 0.11,
      transparent: true,
      opacity: 0.72,
      map: blueGlowTex,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustParticles = new THREE.Points(geoC, matC);
    scene.add(dustParticles);

    // ==========================================
    // 4. PERIODIC SHOOTING STAR / METEOR
    // ==========================================
    const meteorGeo = new THREE.CylinderGeometry(0.015, 0.002, 3.2, 8);
    meteorGeo.rotateZ(Math.PI / 3.2);
    const meteorMat = new THREE.MeshBasicMaterial({
      color: 0xd6eeff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const meteor = new THREE.Mesh(meteorGeo, meteorMat);
    meteor.position.set(-20, 20, -10);
    scene.add(meteor);

    let meteorActive = false;
    let meteorProgress = 0;
    let meteorStartX = 0;
    let meteorStartY = 0;
    let meteorStartZ = 0;
    let nextMeteorTime = 2.8;

    // ==========================================
    // 5. THE MECHANICAL GATEWAY
    // ==========================================
    const gateway = new THREE.Group();
    gateway.position.set(4.4, 0.25, -6.2);
    gateway.rotation.y = -0.16;
    environment.add(gateway);

    const titanium = new THREE.MeshStandardMaterial({
      color: 0x546b82,
      metalness: 0.92,
      roughness: 0.26,
      emissive: 0x09223a,
      emissiveIntensity: 0.7,
    });

    const energyRingMat = new THREE.MeshBasicMaterial({
      color: 0x6ac5ff,
      transparent: true,
      opacity: 0.78,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    const innerChevronMat = new THREE.MeshStandardMaterial({
      color: 0x8fbddb,
      metalness: 0.85,
      roughness: 0.32,
      emissive: 0x133857,
      emissiveIntensity: 0.6,
    });

    // Concentric rings
    // 1. Heavy Outer Ring
    const outerTorus = new THREE.Mesh(new THREE.TorusGeometry(3.9, 0.14, 16, 144), titanium);
    gateway.add(outerTorus);

    // 2. Counter-Rotating Tech Notch Ring
    const techRing = new THREE.Group();
    gateway.add(techRing);
    const midTorus = new THREE.Mesh(new THREE.TorusGeometry(3.52, 0.05, 12, 120), innerChevronMat);
    techRing.add(midTorus);

    // Add 48 tick marks on the counter-rotating tech ring
    const tickGeo = new THREE.BoxGeometry(0.06, 0.16, 0.1);
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2;
      const tick = new THREE.Mesh(tickGeo, energyRingMat);
      tick.position.set(Math.cos(a) * 3.52, Math.sin(a) * 3.52, 0);
      tick.rotation.z = a;
      techRing.add(tick);
    }

    // 3. Inner Ion Energy Ring
    const innerPlasmaRing = new THREE.Mesh(new THREE.TorusGeometry(2.98, 0.055, 14, 96), energyRingMat);
    innerPlasmaRing.position.z = -0.18;
    gateway.add(innerPlasmaRing);

    // 4. Aperture Core Disc & Flow Halo
    const aperture = new THREE.Mesh(
      new THREE.CircleGeometry(2.88, 96),
      new THREE.MeshBasicMaterial({
        color: 0x082b4c,
        transparent: true,
        opacity: 0.38,
        side: THREE.DoubleSide,
      })
    );
    aperture.position.z = -0.32;
    gateway.add(aperture);

    // Halo glow plane behind aperture
    const haloGeo = new THREE.PlaneGeometry(9.2, 9.2);
    const haloMat = new THREE.MeshBasicMaterial({
      map: blueGlowTex,
      transparent: true,
      opacity: 0.42,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.set(0, 0, -0.45);
    gateway.add(halo);

    // 36 Outer Perimeter Structural Ribs (dynamic traveling light pulses)
    const ribMaterial = new THREE.MeshStandardMaterial({
      color: 0x72899f,
      metalness: 0.94,
      roughness: 0.28,
      emissive: 0x0d365b,
      emissiveIntensity: 0.55,
    });
    const ribs: THREE.Mesh[] = [];
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      const rib = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.52, 0.3), ribMaterial.clone());
      rib.position.set(Math.cos(a) * 3.9, Math.sin(a) * 3.9, 0.02);
      rib.rotation.z = a;
      gateway.add(rib);
      ribs.push(rib);
    }

    // 8 Mechanical Structural Pylons
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const pylon = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.8, 0.36), titanium);
      pylon.position.set(Math.cos(a) * 3.6, Math.sin(a) * 3.6, 0.14);
      pylon.rotation.z = a;
      gateway.add(pylon);
    }

    // ==========================================
    // 6. THE ODYSSEY-01 CRAFT
    // ==========================================
    const ship = new THREE.Group();
    ship.position.set(-1.55, -0.45, 1.5);
    ship.rotation.set(0.06, -0.18, -0.025);
    environment.add(ship);

    const hullMat = new THREE.MeshStandardMaterial({
      color: 0x687c91,
      metalness: 0.9,
      roughness: 0.28,
      emissive: 0x0a1928,
      emissiveIntensity: 0.2,
    });
    const shadowMat = new THREE.MeshStandardMaterial({
      color: 0x162738,
      metalness: 0.85,
      roughness: 0.35,
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x184872,
      metalness: 0.6,
      roughness: 0.12,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      emissive: 0x0c3b64,
      emissiveIntensity: 0.65,
    });
    const engineMat = new THREE.MeshBasicMaterial({ color: 0xaae3ff });

    // Fuselage
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 2.8, 8, 18), hullMat);
    body.rotation.x = Math.PI / 2;
    body.scale.set(0.95, 1, 0.72);
    ship.add(body);

    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.43, 1.05, 8), hullMat);
    nose.rotation.x = -Math.PI / 2;
    nose.position.z = -1.92;
    ship.add(nose);

    const cockpit = new THREE.Mesh(new THREE.SphereGeometry(0.48, 28, 18), glassMat);
    cockpit.position.set(0, 0.39, -0.85);
    cockpit.scale.set(0.82, 0.55, 1.15);
    ship.add(cockpit);

    // Wings, Nacelles, & Nozzles
    const wingtipBeacons: THREE.Mesh[] = [];
    for (const side of [-1, 1]) {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.13, 1.32), hullMat);
      wing.position.set(side * 1.08, -0.08, 0.1);
      wing.rotation.y = side * -0.2;
      wing.rotation.z = side * -0.07;
      ship.add(wing);

      const wingEdge = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.045, 0.08), engineMat);
      wingEdge.position.set(side * 1.15, 0.015, 0.35);
      ship.add(wingEdge);

      // Wingtip strobe beacons
      const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), energyRingMat);
      beacon.position.set(side * 2.15, -0.06, 0.38);
      ship.add(beacon);
      wingtipBeacons.push(beacon);

      const nacelle = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.27, 1.15, 14), shadowMat);
      nacelle.rotation.x = Math.PI / 2;
      nacelle.position.set(side * 1.55, -0.12, 0.8);
      ship.add(nacelle);

      const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.19, 0.12, 18), engineMat);
      nozzle.rotation.x = Math.PI / 2;
      nozzle.position.set(side * 1.55, -0.12, 1.43);
      ship.add(nozzle);
    }

    const centerNozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.14, 18), engineMat);
    centerNozzle.rotation.x = Math.PI / 2;
    centerNozzle.position.set(0, -0.12, 1.48);
    ship.add(centerNozzle);

    // Engine Lights
    const engineLight = new THREE.PointLight(0x38a6ff, 20, 10);
    engineLight.position.set(0, -0.1, 2.1);
    ship.add(engineLight);

    // Animated exhaust cones (pulsing plasma plumes)
    const exhaustCones: THREE.Mesh[] = [];
    for (const x of [-1.55, 0, 1.55]) {
      const radius = x === 0 ? 0.2 : 0.16;
      const height = x === 0 ? 1.45 : 1.25;
      const coneMat = new THREE.MeshBasicMaterial({
        color: 0x3bb2ff,
        transparent: true,
        opacity: 0.24,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const exhaust = new THREE.Mesh(
        new THREE.ConeGeometry(radius, height, 16, 1, true),
        coneMat
      );
      exhaust.rotation.x = -Math.PI / 2;
      exhaust.position.set(x, -0.12, 2.18);
      ship.add(exhaust);
      exhaustCones.push(exhaust);
    }

    // Atmospheric arc behind the gateway
    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(8.5, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.52),
      new THREE.MeshBasicMaterial({ color: 0x153c5e, transparent: true, opacity: 0.2, side: THREE.BackSide })
    );
    planet.position.set(5, -5.8, -16);
    environment.add(planet);

    // ==========================================
    // 7. INTERACTION & SCROLL LISTENERS
    // ==========================================
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.targetX = ((event.clientX - rect.left) / (rect.width || window.innerWidth) - 0.5) * 2;
      pointer.targetY = ((event.clientY - rect.top) / (rect.height || window.innerHeight) - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    let scrollProgress = 0;
    const onScroll = () => {
      const maxScroll = window.innerHeight * 1.5;
      scrollProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Cinematic stage drives the ship/camera dolly while the hero scene wipes in or out
    const onStageProgress = (event: Event) => {
      const detail = (event as CustomEvent<number>).detail;
      if (typeof detail === "number") scrollProgress = Math.min(Math.max(detail, 0), 1);
    };
    window.addEventListener("v5:stage-progress", onStageProgress);

    // ==========================================
    // 8. RENDER LOOP WITH COMPLETE KINEMATICS
    // ==========================================
    let raf = 0;
    let lastTime = performance.now() * 0.001;
    let elapsedTime = 0;
    // Warp factor (0..1): how fast the stage is changing scenes right now
    let warp = 0;
    let prevProgress = scrollProgress;

    const render = () => {
      raf = requestAnimationFrame(render);
      const now = performance.now() * 0.001;
      const delta = Math.min(now - lastTime, 0.1);
      lastTime = now;
      elapsedTime += delta;
      const time = elapsedTime;

      // Smooth pointer interpolation
      pointer.x += (pointer.targetX - pointer.x) * 0.05;
      pointer.y += (pointer.targetY - pointer.y) * 0.05;

      // Update interactive 3D cursor light
      cursorLight.position.x = pointer.x * 6;
      cursorLight.position.y = -pointer.y * 4 + 1.2;

      if (!reducedMotion) {
        // --- Warp stretch: ship, gateway, stars and dust elongate while a scene change runs ---
        const velocity = Math.abs(scrollProgress - prevProgress) / Math.max(delta, 0.001);
        prevProgress = scrollProgress;
        warp += (Math.min(1, velocity * 0.9) - warp) * 0.18;
        const fov = 38 + warp * 24;
        if (Math.abs(camera.fov - fov) > 0.01) {
          camera.fov = fov;
          camera.updateProjectionMatrix();
        }
        ship.scale.set(1 - warp * 0.14, 1 - warp * 0.14, 1 + warp * 0.8);
        gateway.scale.set(1, 1, 1 + warp * 0.6);
        starsA.scale.z = starsB.scale.z = 1 + warp * 1.6;
        starsB.rotation.z = warp * 0.06;

        // --- A. Spacecraft Hovering & Banking ---
        // Organic dual-sine hover breathing
        const hoverY = -0.45 + Math.sin(time * 0.85) * 0.075 + Math.cos(time * 0.42) * 0.025;
        const hoverX = -1.55 + Math.sin(time * 0.45) * 0.04;

        // Scroll advancement: as visitor scrolls, ship maneuvers forward toward gateway
        const scrollZ = 1.5 - scrollProgress * 4.2;
        const scrollForwardX = hoverX + scrollProgress * 1.6;
        const scrollForwardY = hoverY + scrollProgress * 0.35;

        ship.position.set(scrollForwardX, scrollForwardY, scrollZ);

        // Responsive banking (roll Z, yaw Y, pitch X)
        const targetRotZ = -0.025 + Math.sin(time * 0.32) * 0.015 - pointer.x * 0.045 - scrollProgress * 0.04;
        const targetRotX = 0.06 + pointer.y * 0.025 + Math.sin(time * 0.75) * 0.018 - scrollProgress * 0.03;
        const targetRotY = -0.18 + pointer.x * 0.035 + scrollProgress * 0.06;

        ship.rotation.z += (targetRotZ - ship.rotation.z) * 0.08;
        ship.rotation.x += (targetRotX - ship.rotation.x) * 0.08;
        ship.rotation.y += (targetRotY - ship.rotation.y) * 0.08;

        // Dynamic engine light pulse & exhaust cone elongation
        const enginePulse = 20 + Math.sin(time * 8.0) * 3.5 + Math.cos(time * 19.0) * 1.8;
        engineLight.intensity = enginePulse * (1 + scrollProgress * 0.5);

        const exhaustScale = 1 + Math.sin(time * 12.0) * 0.12 + scrollProgress * 0.4;
        exhaustCones.forEach((cone, idx) => {
          cone.scale.set(1, exhaustScale, 1);
          const mat = cone.material as THREE.MeshBasicMaterial;
          mat.opacity = 0.22 + Math.sin(time * 10 + idx) * 0.06 + scrollProgress * 0.12;
        });

        // Wingtip beacon strobe
        const beaconIntensity = Math.sin(time * 3.5) > 0.85 ? 1 : 0.25;
        wingtipBeacons.forEach((beacon) => {
          (beacon.material as THREE.MeshBasicMaterial).opacity = beaconIntensity;
        });

        // --- B. Mechanical Gateway Rotation & Pulsing ---
        outerTorus.rotation.z = time * 0.035 + scrollProgress * 0.3;
        techRing.rotation.z = -time * 0.062 - scrollProgress * 0.5;
        innerPlasmaRing.rotation.z = time * 0.09;

        // Aperture core pulse
        const apertureScale = 1 + Math.sin(time * 1.6) * 0.035;
        aperture.scale.set(apertureScale, apertureScale, 1);
        halo.scale.set(apertureScale, apertureScale, 1);
        haloMat.opacity = 0.38 + Math.sin(time * 2.2) * 0.08 + scrollProgress * 0.15;

        // Sequential light pulse traveling along perimeter ribs
        const activeRibIndex = Math.floor((time * 18) % 36);
        ribs.forEach((rib, idx) => {
          const diff = Math.abs(idx - activeRibIndex);
          const isNear = diff === 0 || diff === 35 || diff === 1;
          const mat = rib.material as THREE.MeshStandardMaterial;
          mat.emissiveIntensity = isNear ? 1.8 : 0.48;
        });

        // Gateway slight scroll approach
        gateway.position.z = -6.2 + scrollProgress * 1.5;

        // --- C. Starfield Shimmer & Cosmic Dust Drift ---
        starsA.rotation.y = time * 0.0012 + scrollProgress * 0.05;
        starsB.rotation.y = -time * 0.0018 - scrollProgress * 0.08;

        // Twinkle effect on Layer B
        matB.opacity = 0.75 + Math.sin(time * 2.4) * 0.18;

        // Drift foreground dust motes
        const cPositions = geoC.attributes.position.array as Float32Array;
        for (let i = 0; i < countC; i++) {
          cPositions[i * 3 + 1] -= speedC[i] * (1 + warp * 45);
          cPositions[i * 3] += Math.sin(time * 0.5 + i) * 0.002;
          if (cPositions[i * 3 + 1] < -8) {
            cPositions[i * 3 + 1] = 8;
            cPositions[i * 3] = (Math.random() - 0.5) * 26;
          }
        }
        geoC.attributes.position.needsUpdate = true;

        // Nebula breathing
        nebulaMat.opacity = 0.25 + Math.sin(time * 0.6) * 0.06;

        // --- D. Shooting Star / Meteor Cycle ---
        if (!meteorActive && time > nextMeteorTime) {
          meteorActive = true;
          meteorProgress = 0;
          meteorStartX = (Math.random() - 0.5) * 20 - 5;
          meteorStartY = 12 + Math.random() * 4;
          meteorStartZ = -Math.random() * 25 - 5;
          meteor.position.set(meteorStartX, meteorStartY, meteorStartZ);
          nextMeteorTime = time + 4.5 + Math.random() * 4.0;
        }

        if (meteorActive) {
          meteorProgress += delta * 1.85;
          meteor.position.x = meteorStartX + meteorProgress * 22;
          meteor.position.y = meteorStartY - meteorProgress * 15;
          meteor.position.z = meteorStartZ + meteorProgress * 6;

          // Fade in and out
          if (meteorProgress < 0.25) {
            meteorMat.opacity = meteorProgress / 0.25;
          } else if (meteorProgress > 0.75) {
            meteorMat.opacity = Math.max(0, (1 - meteorProgress) / 0.25);
          } else {
            meteorMat.opacity = 1;
          }

          if (meteorProgress >= 1.0) {
            meteorActive = false;
            meteorMat.opacity = 0;
          }
        }

        // --- E. Smooth Camera Parallax & Scroll Dolly ---
        const targetCamX = pointer.x * 0.42;
        const targetCamY = 1.1 - pointer.y * 0.22 - scrollProgress * 0.4;
        const targetCamZ = 17 - scrollProgress * 5.5;

        camera.position.x += (targetCamX - camera.position.x) * 0.04;
        camera.position.y += (targetCamY - camera.position.y) * 0.04;
        camera.position.z += (targetCamZ - camera.position.z) * 0.06;
      }

      renderer.render(scene, camera);
    };
    render();

    // ==========================================
    // 9. RESIZE & DISPOSAL
    // ==========================================
    const resize = () => {
      const width = mount.clientWidth || window.innerWidth;
      const height = mount.clientHeight || window.innerHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.2 : 1.65));
      renderer.setSize(width, height);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("v5:stage-progress", onStageProgress);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else material.dispose();
        }
      });
      blueGlowTex.dispose();
      softCloudTex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="v5-hero-canvas" aria-hidden="true" />;
}
