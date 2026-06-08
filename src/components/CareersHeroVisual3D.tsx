"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * CareersHeroVisual3D â€” Breathtaking Quantum Reactor Core & Talent Network Hub
 * An extremely premium, high-fidelity 3D wireframe constellation built with Three.js.
 * Features a multi-layered central reactor, sci-fi orbital rings, rising talent energy sparks,
 * dynamic data pulse streamers, and smooth mouse-reactive gravity fields.
 */
const CareersHeroVisual3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let W = container.clientWidth || 800;
    let H = container.clientHeight || 600;

    // â”€â”€â”€ Scene & Camera Setup â”€â”€â”€
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050608, 0.04);

    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(0, 0.4, 7.5);
    camera.lookAt(0, 0, 0);

    // â”€â”€â”€ WebGL Renderer â”€â”€â”€
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050608, 0);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    // Garbage collection array
    const disposables: { dispose: () => void }[] = [];
    const reg = <T extends { dispose: () => void }>(obj: T): T => {
      disposables.push(obj);
      return obj;
    };

    // â”€â”€â”€ Lighting System â”€â”€â”€
    // Soft ambient glow
    scene.add(reg(new THREE.AmbientLight(0xffffff, 0.08)));

    // Core high-intensity amber light source
    const ptLight = reg(new THREE.PointLight(0xffa200, 6, 15));
    ptLight.position.set(0, 0, 0);
    scene.add(ptLight);

    // Subtly changing secondary violet/pink filling light for premium color depth
    const fillerLight = reg(new THREE.PointLight(0xff007f, 2.5, 10));
    fillerLight.position.set(-3, 2, -2);
    scene.add(fillerLight);

    const dirLight = reg(new THREE.DirectionalLight(0xfff5cc, 0.7));
    dirLight.position.set(5, 5, 5);
    scene.add(dirLight);

    // Main group holding the interactive system
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // â”€â”€â”€ Core Geometries â”€â”€â”€
    const boxGeo = reg(new THREE.BoxGeometry(1, 1, 1));
    const edgesGeo = reg(new THREE.EdgesGeometry(boxGeo));

    const octaGeo = reg(new THREE.OctahedronGeometry(0.7, 0));
    const octaEdges = reg(new THREE.EdgesGeometry(octaGeo));

    const icosaGeo = reg(new THREE.IcosahedronGeometry(0.5, 1));
    const icosaEdges = reg(new THREE.EdgesGeometry(icosaGeo));

    const icosaOuterGeo = reg(new THREE.IcosahedronGeometry(1.2, 1));
    const icosaOuterEdges = reg(new THREE.EdgesGeometry(icosaOuterGeo));

    // â”€â”€â”€ Brand Color Materials â”€â”€â”€
    const coreAmberWire = reg(new THREE.LineBasicMaterial({ color: 0xffb000, transparent: true, opacity: 0.95, linewidth: 2 }));
    const secondaryGoldWire = reg(new THREE.LineBasicMaterial({ color: 0xffd000, transparent: true, opacity: 0.6 }));
    const neonPinkWire = reg(new THREE.LineBasicMaterial({ color: 0xff0066, transparent: true, opacity: 0.45 }));
    const whiteWire = reg(new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 }));
    const dimWire = reg(new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 }));
    const connectionLineMat = reg(new THREE.LineBasicMaterial({ color: 0xffb000, transparent: true, opacity: 0.3 }));

    const solidFillMat = reg(new THREE.MeshBasicMaterial({
      color: 0xffa200,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      wireframe: false
    }));

    // â”€â”€â”€ Multi-Layered Central Quantum Reactor â”€â”€â”€
    const hubGroup = new THREE.Group();
    mainGroup.add(hubGroup);

    // Layer 1: Solid Inner Icosahedron (Faceted glow)
    const hubInnerSolid = new THREE.Mesh(icosaGeo, solidFillMat);
    hubGroup.add(hubInnerSolid);

    // Layer 2: Faceted Wireframe Shell
    const hubInnerWire = new THREE.LineSegments(icosaEdges, secondaryGoldWire);
    hubGroup.add(hubInnerWire);

    // Layer 3: Rotated Octahedron Shield
    const hubMiddleWire = new THREE.LineSegments(octaEdges, neonPinkWire);
    hubMiddleWire.scale.set(1.15, 1.15, 1.15);
    hubGroup.add(hubMiddleWire);

    // Layer 4: Breathing Outer Cube Cage
    const hubOuterCage = new THREE.LineSegments(edgesGeo, coreAmberWire);
    hubOuterCage.scale.set(1.4, 1.4, 1.4);
    hubGroup.add(hubOuterCage);

    // Layer 5: High-speed Outer Icosahedron
    const hubShieldWire = new THREE.LineSegments(icosaOuterEdges, reg(
      new THREE.LineBasicMaterial({ color: 0xffd000, transparent: true, opacity: 0.2 })
    ));
    hubShieldWire.scale.set(1.15, 1.15, 1.15);
    hubGroup.add(hubShieldWire);

    // â”€â”€â”€ Sci-Fi Holographic Orbit Rings â”€â”€â”€
    const ringGroup = new THREE.Group();
    hubGroup.add(ringGroup);

    const makeOrbitRing = (radius: number, color: number, opacity: number, rotX: number, rotY: number) => {
      const ringGeo = reg(new THREE.RingGeometry(radius, radius + 0.015, 64));
      const ringMat = reg(new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: opacity,
        side: THREE.DoubleSide
      }));
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.set(rotX, rotY, 0);
      ringGroup.add(ringMesh);
      return ringMesh;
    };

    const ring1 = makeOrbitRing(1.8, 0xffa200, 0.22, Math.PI / 3, Math.PI / 6);
    const ring2 = makeOrbitRing(2.1, 0xff0066, 0.16, -Math.PI / 4, Math.PI / 4);
    const ring3 = makeOrbitRing(2.4, 0xffffff, 0.12, Math.PI / 2, 0);

    // Ring indicators (tiny orbiting nodes along the rings)
    const indicatorGeo = reg(new THREE.SphereGeometry(0.035, 6, 6));
    const indicatorMat = reg(new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 }));

    const ind1 = new THREE.Mesh(indicatorGeo, indicatorMat);
    const ind2 = new THREE.Mesh(indicatorGeo, reg(new THREE.MeshBasicMaterial({ color: 0xffa200 })));
    scene.add(ind1);
    scene.add(ind2);

    // â”€â”€â”€ Satellite Talent Nodes â”€â”€â”€
    interface SatNode {
      group: THREE.Group;
      dir: THREE.Vector3;
      baseDistance: number;
      phase: number;
      speed: number;
      orbitSpeed: number;
      size: number;
      isGold: boolean;
      rotOffset: THREE.Vector3;
    }

    const satellites: SatNode[] = [];
    const satCount = 15;

    for (let i = 0; i < satCount; i++) {
      const nodeGroup = new THREE.Group();

      // Uniform spherical coordinate mapping
      const u = Math.random();
      const v = Math.random();
      const theta = u * Math.PI * 2;
      const phi = Math.acos(2 * v - 1);

      const dir = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta) * 0.65, // slightly compress Y spread for layout stability
        Math.cos(phi),
      ).normalize();

      const baseDistance = 2.4 + Math.random() * 2.2;
      const size = 0.2 + Math.random() * 0.22;
      const isGold = Math.random() < 0.4;
      const isPink = !isGold && Math.random() < 0.3;

      // Select distinct color themes
      let activeWireMat = whiteWire;
      if (isGold) activeWireMat = coreAmberWire;
      else if (isPink) activeWireMat = neonPinkWire;
      else if (Math.random() < 0.5) activeWireMat = dimWire;

      // Cube node
      const wire = new THREE.LineSegments(edgesGeo, activeWireMat);
      wire.scale.set(size, size, size);
      nodeGroup.add(wire);

      // Inner double diamond visual inside the satellite cube
      const innerDiamond = new THREE.LineSegments(octaEdges, isGold ? secondaryGoldWire : activeWireMat);
      innerDiamond.scale.set(size * 0.7, size * 0.7, size * 0.7);
      nodeGroup.add(innerDiamond);

      // Core point glow
      const dotGeo = reg(new THREE.SphereGeometry(size * 0.16, 6, 6));
      const dotMat = reg(new THREE.MeshBasicMaterial({
        color: isGold ? 0xffb000 : (isPink ? 0xff0066 : 0xffffff),
        transparent: true,
        opacity: 0.9
      }));
      nodeGroup.add(new THREE.Mesh(dotGeo, dotMat));

      const pos = dir.clone().multiplyScalar(baseDistance);
      nodeGroup.position.copy(pos);
      mainGroup.add(nodeGroup);

      satellites.push({
        group: nodeGroup,
        dir,
        baseDistance,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 0.6,
        orbitSpeed: (0.05 + Math.random() * 0.1) * (Math.random() < 0.5 ? 1 : -1),
        size,
        isGold,
        rotOffset: new THREE.Vector3(Math.random() * 2, Math.random() * 2, Math.random() * 2),
      });
    }

    // â”€â”€â”€ Dynamic Grid Lines Group â”€â”€â”€
    const linesGroup = new THREE.Group();
    mainGroup.add(linesGroup);

    // â”€â”€â”€ Advanced Data Pulse Trails â”€â”€â”€
    const pulseSphGeo = reg(new THREE.SphereGeometry(0.04, 6, 6));
    const pulseGoldMat = reg(new THREE.MeshBasicMaterial({ color: 0xffd000, transparent: true, opacity: 0.95 }));
    const pulsePinkMat = reg(new THREE.MeshBasicMaterial({ color: 0xff0066, transparent: true, opacity: 0.95 }));

    interface Pulse {
      mesh: THREE.Mesh;
      satIndex: number;
      progress: number;
      speed: number;
      isPink: boolean;
      delay: number;
    }

    const pulses: Pulse[] = [];
    const pulseDensity = 24; // 24 concurrent active data streams
    for (let i = 0; i < pulseDensity; i++) {
      const satIndex = Math.floor(Math.random() * satCount);
      const isPink = Math.random() < 0.3;
      const mesh = new THREE.Mesh(pulseSphGeo, isPink ? pulsePinkMat : pulseGoldMat);

      mainGroup.add(mesh);
      pulses.push({
        mesh,
        satIndex,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.007,
        isPink,
        delay: Math.random() * 2,
      });
    }

    // â”€â”€â”€ Rising Energy Sparks System (Ember Ascent) â”€â”€â”€
    const sparkCount = 80;
    const sparkPositions = new Float32Array(sparkCount * 3);
    const sparkSpeeds: number[] = [];
    const sparkDrifts: number[] = [];
    const sparkPhases: number[] = [];

    for (let i = 0; i < sparkCount; i++) {
      sparkPositions[i * 3] = (Math.random() - 0.5) * 8;      // X
      sparkPositions[i * 3 + 1] = (Math.random() - 0.5) * 8;  // Y
      sparkPositions[i * 3 + 2] = (Math.random() - 0.5) * 4;  // Z

      sparkSpeeds.push(0.005 + Math.random() * 0.015);
      sparkDrifts.push(0.002 + Math.random() * 0.005);
      sparkPhases.push(Math.random() * Math.PI * 2);
    }

    const sparkGeo = reg(new THREE.BufferGeometry());
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));

    // Custom gradient circular spark canvas
    const sparkCanvas = document.createElement('canvas');
    sparkCanvas.width = 16;
    sparkCanvas.height = 16;
    const ctx = sparkCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, 'rgba(255, 208, 0, 1)');
      grad.addColorStop(0.3, 'rgba(255, 162, 0, 0.8)');
      grad.addColorStop(1, 'rgba(255, 162, 0, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
    }
    const sparkTex = new THREE.CanvasTexture(sparkCanvas);
    disposables.push(sparkTex);

    const sparkMat = reg(new THREE.PointsMaterial({
      size: 0.12,
      map: sparkTex,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }));

    const sparkPoints = new THREE.Points(sparkGeo, sparkMat);
    mainGroup.add(sparkPoints);

    // â”€â”€â”€ Ambient Space Dust â”€â”€â”€
    const dustCount = 50;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const r = 2.0 + Math.random() * 5.0;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(Math.random() * 2 - 1);
      dustPositions[i * 3] = r * Math.sin(ph) * Math.cos(th);
      dustPositions[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      dustPositions[i * 3 + 2] = r * Math.cos(ph);
    }
    const dustGeo = reg(new THREE.BufferGeometry());
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = reg(new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.015,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
    }));
    mainGroup.add(new THREE.Points(dustGeo, dustMat));

    // â”€â”€â”€ Connection Lines Rebuilder â”€â”€â”€
    const rebuildLines = () => {
      while (linesGroup.children.length) {
        const c = linesGroup.children[0] as THREE.Line;
        linesGroup.remove(c);
        c.geometry.dispose();
      }

      // Hub â†” Satellites
      for (const sat of satellites) {
        const pts = [new THREE.Vector3(0, 0, 0), sat.group.position.clone()];
        const geo = new THREE.BufferGeometry().setFromPoints(pts);

        // Lines glow brighter depending on proximity to center or mouse speed
        linesGroup.add(new THREE.Line(geo, connectionLineMat));
      }
    };

    // â”€â”€â”€ Mouse Position Tracking â”€â”€â”€
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let mouseActive = false;
    let mouseSpeed = 0;
    let lastMouseX = 0;
    let lastMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const currentX = ((e.clientX - rect.left) / W) * 2 - 1;
      const currentY = -((e.clientY - rect.top) / H) * 2 + 1;

      // Calculate cursor speed for particle speedup flares
      mouseSpeed = Math.min(0.2, mouseSpeed + Math.sqrt(Math.pow(currentX - lastMouseX, 2) + Math.pow(currentY - lastMouseY, 2)) * 0.05);

      mouse.x = currentX;
      mouse.y = currentY;
      lastMouseX = currentX;
      lastMouseY = currentY;
      mouseActive = true;
    };

    const handleMouseLeave = () => {
      mouseActive = false;
      mouse.x = 0;
      mouse.y = 0;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    const initialIsMobile = window.innerWidth < 768;

    // ——— Responsive Viewport Resizing ———
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width === 0 || height === 0) continue;
        W = width;
        H = height;
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H);
        if (window.innerWidth < 768) {
          animate();
        }
      }
    });
    resizeObserver.observe(container);

    // ——— Main Master Animation Loop ———
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!initialIsMobile) {
        frameId = requestAnimationFrame(animate);
      }
      const t = clock.getElapsedTime();

      // Decay mouse speed influence
      mouseSpeed *= 0.95;

      // Smooth camera parallax matching premium user experience
      target.x += (mouse.x - target.x) * 0.05;
      target.y += (mouse.y - target.y) * 0.05;

      // Primary structure rotation + mouse interaction shifts
      mainGroup.rotation.y = t * 0.04 + target.x * 0.25;
      mainGroup.rotation.x = Math.sin(t * 0.02) * 0.05 + target.y * 0.15;

      // Fine camera movements for perspective depth
      camera.position.x = target.x * 0.8;
      camera.position.y = 0.4 + target.y * 0.6;
      camera.lookAt(0, 0, 0);

      // Hub Reactor breathing and rotation
      const breath = 1.0 + Math.sin(t * 2.2) * 0.08;
      const hoverCoreGlow = 1.0 + mouseSpeed * 1.5; // flash core when cursor sweeps fast

      hubInnerSolid.scale.set(breath, breath, breath);
      hubInnerWire.scale.set(breath * 1.02, breath * 1.02, breath * 1.02);

      // Core layer spins in opposite directions
      hubInnerWire.rotation.y = t * 0.22;
      hubInnerWire.rotation.z = t * 0.1;

      hubMiddleWire.scale.set(breath * 1.2, breath * 1.2, breath * 1.2);
      hubMiddleWire.rotation.x = -t * 0.35;
      hubMiddleWire.rotation.y = t * 0.15;

      hubOuterCage.scale.set(breath * 1.45, breath * 1.45, breath * 1.45);
      hubOuterCage.rotation.y = -t * 0.15;
      hubOuterCage.rotation.z = -t * 0.25;

      hubShieldWire.rotation.x = t * 0.5;
      hubShieldWire.rotation.z = t * 0.3;

      // Pulse color light intensities
      ptLight.intensity = (6.0 + Math.sin(t * 3.0) * 2.2) * hoverCoreGlow;
      fillerLight.intensity = (2.5 + Math.cos(t * 1.5) * 1.0);

      // Orbit Ring rotational paths
      ring1.rotation.z = t * 0.12;
      ring2.rotation.z = -t * 0.18;
      ring3.rotation.z = t * 0.08;

      // Animate indicator dots along orbit rings
      const angle1 = t * 0.5;
      ind1.position.set(
        Math.cos(angle1) * 1.8,
        Math.sin(angle1) * 1.8 * 0.5,
        Math.sin(angle1) * 1.8 * 0.86
      ).applyEuler(ring1.rotation);

      const angle2 = -t * 0.7;
      ind2.position.set(
        Math.cos(angle2) * 2.1 * 0.7,
        Math.sin(angle2) * 2.1,
        Math.sin(angle2) * 2.1 * 0.5
      ).applyEuler(ring2.rotation);

      // Dynamic satellite movement
      for (const sat of satellites) {
        sat.phase += 0.007 * sat.speed * (1.0 + mouseSpeed * 2.0);

        // Calculate orbit path around vertical axis
        const orbitAngle = t * sat.orbitSpeed;
        const orbitDir = sat.dir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), orbitAngle);

        // Breathing distance
        const currentDistance = sat.baseDistance + Math.sin(sat.phase) * 0.25;
        const pos = orbitDir.multiplyScalar(currentDistance);

        // Gravity pull to mouse cursor coordinates
        if (mouseActive) {
          const mouseWorldPos = new THREE.Vector3(mouse.x * 2.5, mouse.y * 1.8, 1);
          const pullDist = pos.distanceTo(mouseWorldPos);
          if (pullDist < 2.5) {
            const pullForce = (2.5 - pullDist) * 0.06;
            pos.lerp(mouseWorldPos, pullForce);
          }
        }

        sat.group.position.copy(pos);

        // Rotate individual cubes on multiple axes
        sat.group.rotation.x += 0.01 * sat.speed + sat.rotOffset.x * 0.002;
        sat.group.rotation.y += 0.014 * sat.speed + sat.rotOffset.y * 0.002;
      }

      // Reconstruct connection network lines
      rebuildLines();

      // Animate flowing data packets
      for (const pulse of pulses) {
        // Boost data transfer speed when mouse moves rapidly
        pulse.progress += pulse.speed * (1.0 + mouseSpeed * 3.0);

        if (pulse.progress > 1) {
          pulse.progress = 0;
          pulse.satIndex = Math.floor(Math.random() * satCount);
          pulse.speed = 0.003 + Math.random() * 0.007;
        }

        const satPos = satellites[pulse.satIndex].group.position;
        const start = new THREE.Vector3(0, 0, 0);

        // Lerp coordinates
        pulse.mesh.position.lerpVectors(start, satPos, pulse.progress);

        // Scale pulse according to progression
        const scaleVal = Math.sin(pulse.progress * Math.PI) * 1.3;
        pulse.mesh.scale.set(scaleVal, scaleVal, scaleVal);
      }

      // Animate rising talent energy sparks (ascension effect)
      const sparkArr = sparkGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < sparkCount; i++) {
        // Move spark upward
        sparkArr[i * 3 + 1] += sparkSpeeds[i] * (1.0 + mouseSpeed * 1.5);

        // Sinusoidal drift on horizontal plane (X & Z axes)
        sparkArr[i * 3] += Math.sin(t * 0.5 + sparkPhases[i]) * sparkDrifts[i];
        sparkArr[i * 3 + 2] += Math.cos(t * 0.4 + sparkPhases[i]) * sparkDrifts[i] * 0.5;

        // Reset spark when it reaches top boundaries
        if (sparkArr[i * 3 + 1] > 3.8) {
          sparkArr[i * 3] = (Math.random() - 0.5) * 8;
          sparkArr[i * 3 + 1] = -3.8;
          sparkArr[i * 3 + 2] = (Math.random() - 0.5) * 4;
        }
      }
      sparkGeo.attributes.position.needsUpdate = true;

      // Render the scene
      renderer.render(scene, camera);
    };

    animate();

    // â”€â”€â”€ Complete System Garbage Collection â”€â”€â”€
    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();
      renderer.dispose();

      while (linesGroup.children.length) {
        const c = linesGroup.children[0] as THREE.Line;
        linesGroup.remove(c);
        c.geometry.dispose();
      }

      disposables.forEach((d) => {
        try { d.dispose(); } catch (_) { /* ignore */ }
      });

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full absolute inset-0 z-0 overflow-hidden pointer-events-none" />
  );
};

export default CareersHeroVisual3D;
