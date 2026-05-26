import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * PressReleaseHeroVisual3D — Cybernetic Spectrum & Antenna Terrain Wave
 * Custom premium 3D visualization representing a flowing digital spectrum wave.
 * Spawns 45 high-fidelity antenna towers with detailed H-brackets, glowing white wave connector lines,
 * mouse-hover gravity ripple, and real-time horizontal gradient color mapping.
 */
const PressReleaseHeroVisual3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let W = container.clientWidth || 800;
    let H = container.clientHeight || 600;

    // ─── Scene & Camera Setup ───
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.055);

    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    // Position camera to look down slightly at the wave for optimal perspective
    camera.position.set(0, 0.5, 6.8);
    camera.lookAt(0, 0, 0);

    // ─── WebGL Renderer ───
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050505, 0);
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

    // ─── Lighting System ───
    scene.add(reg(new THREE.AmbientLight(0xffffff, 0.08)));
    
    // Dynamic point light following mouse interactive coordinates
    const followLight = reg(new THREE.PointLight(0xffc629, 3.5, 10));
    followLight.position.set(0, 0, 1);
    scene.add(followLight);

    // Flat ambient back light
    const dirLight = reg(new THREE.DirectionalLight(0xffffff, 0.4));
    dirLight.position.set(0, 4, 4);
    scene.add(dirLight);

    // Main Group
    const waveGroup = new THREE.Group();
    scene.add(waveGroup);

    // ─── Procedural Antenna Tower Unit Geometry ───
    // We create a unit antenna tower of height 1.0. We will scale this Y-axis dynamically.
    const createUnitAntennaGeometry = (): THREE.BufferGeometry => {
      const vertices: number[] = [];
      
      // 1. Central spine (Y = 0.0 to 1.0)
      vertices.push(0, 0, 0,  0, 1.0, 0);

      // 2. Horizontal brackets (10 stacks)
      const bracketCount = 10;
      for (let j = 0; j < bracketCount; j++) {
        const y = (j / (bracketCount - 1)); // Y coordinate from 0.0 to 1.0
        
        // Taper the bracket widths so the antenna is wider at base and narrower at top
        const crossW = 0.12 * (1.0 - y * 0.4);
        
        // Main horizontal bar
        vertices.push(-crossW, y, 0,  crossW, y, 0);

        // Tiny vertical end-tips (creating the "H" bracket look from your reference image)
        const tipH = 0.022;
        vertices.push(-crossW, y - tipH, 0,  -crossW, y + tipH, 0);
        vertices.push(crossW, y - tipH, 0,  crossW, y + tipH, 0);
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      return reg(geo);
    };

    const unitAntennaGeo = createUnitAntennaGeometry();

    // ─── Interactive Spectrum Gradient Color Algorithm ───
    // Recreates the exact colors from your reference image:
    // Left & far-right section fade out to grey/black, center-right pops in gold/amber.
    const getSpectrumColor = (ratio: number): THREE.Color => {
      const color = new THREE.Color();
      const peak = 0.65; // Peak intensity is center-right
      const dist = Math.abs(ratio - peak);

      if (dist < 0.2) {
        // High density glowing gold
        const f = 1.0 - (dist / 0.2);
        color.lerpColors(new THREE.Color(0x3a2c05), new THREE.Color(0xffc629), 0.35 + f * 0.65);
      } else if (dist < 0.4) {
        // Soft fading dark gold to dim charcoal
        const f = 1.0 - ((dist - 0.2) / 0.2);
        color.lerpColors(new THREE.Color(0x1a1a1a), new THREE.Color(0x7c5f0f), f * 0.7);
      } else {
        // Silent edge frequencies
        const f = Math.max(0, 1.0 - ((dist - 0.4) / 0.1));
        color.lerpColors(new THREE.Color(0x0a0a0a), new THREE.Color(0x1a1a1a), f);
      }
      return color;
    };

    // ─── Building 45 Antenna Towers ───
    interface AntennaNode {
      mesh: THREE.LineSegments;
      x: number;
      baseHeight: number;
      mat: THREE.LineBasicMaterial;
      ratio: number;
      initialColor: THREE.Color;
    }

    const towers: AntennaNode[] = [];
    const towerCount = 45;
    const minX = -4.5;
    const maxX = 4.5;

    for (let i = 0; i < towerCount; i++) {
      const ratio = i / (towerCount - 1);
      const x = minX + ratio * (maxX - minX);

      // Create a unique material per tower to support local horizontal gradients
      const col = getSpectrumColor(ratio);
      const mat = reg(new THREE.LineBasicMaterial({
        color: col,
        transparent: true,
        opacity: ratio < 0.1 || ratio > 0.9 ? 0.25 : 0.8,
        linewidth: 1.5
      }));

      const mesh = new THREE.LineSegments(unitAntennaGeo, mat);
      // Place spine base at coordinate Y=-1.2
      mesh.position.set(x, -1.2, 0);
      
      waveGroup.add(mesh);

      towers.push({
        mesh,
        x,
        baseHeight: 0.8 + Math.random() * 0.3, // randomized minor heights
        mat,
        ratio,
        initialColor: col
      });
    }

    // ─── Glowing Wave Connector Cable ───
    // An elegant silver-white wave connecting all towers at 40% height
    const connectorPointsCount = towerCount;
    const connectorPoints: THREE.Vector3[] = [];
    for (let i = 0; i < connectorPointsCount; i++) {
      connectorPoints.push(new THREE.Vector3(towers[i].x, 0, 0));
    }
    const connectorGeo = reg(new THREE.BufferGeometry().setFromPoints(connectorPoints));
    const connectorMat = reg(new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    }));
    const connectorLine = new THREE.Line(connectorGeo, connectorMat);
    waveGroup.add(connectorLine);

    // ─── Digital Perspective Floor Grid ───
    // Adds a faint, high-tech bottom floor grid
    const floorGridGeo = reg(new THREE.BufferGeometry());
    const gridLinesCount = 14;
    const gridVertices: number[] = [];
    for (let i = 0; i <= gridLinesCount; i++) {
      const zRatio = i / gridLinesCount;
      const z = -2.0 + zRatio * 5.0;
      // Horizontal lines
      gridVertices.push(minX, -1.2, z,  maxX, -1.2, z);
    }
    for (let i = 0; i <= 10; i++) {
      const xRatio = i / 10;
      const x = minX + xRatio * (maxX - minX);
      // Depth lines
      gridVertices.push(x, -1.2, -2.0,  x, -1.2, 3.0);
    }
    floorGridGeo.setAttribute('position', new THREE.Float32BufferAttribute(gridVertices, 3));
    const floorGridMat = reg(new THREE.LineBasicMaterial({
      color: 0x1d222d,
      transparent: true,
      opacity: 0.15
    }));
    const floorGrid = new THREE.LineSegments(floorGridGeo, floorGridMat);
    waveGroup.add(floorGrid);

    // ─── Rising Particle Streams ───
    // Tiny sparks shooting upwards along the spines
    interface ParticlePulse {
      mesh: THREE.Mesh;
      towerIdx: number;
      yProgress: number;
      speed: number;
    }
    const pulseGeo = reg(new THREE.SphereGeometry(0.018, 4, 4));
    const pulseMat = reg(new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    }));

    const activePulses: ParticlePulse[] = [];
    const pulseCount = 18;
    for (let i = 0; i < pulseCount; i++) {
      const towerIdx = Math.floor(Math.random() * towerCount);
      const mesh = new THREE.Mesh(pulseGeo, pulseMat);
      waveGroup.add(mesh);
      activePulses.push({
        mesh,
        towerIdx,
        yProgress: Math.random(),
        speed: 0.008 + Math.random() * 0.012
      });
    }

    // ─── Mouse Interactivity ───
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let mouseActive = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / W) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / H) * 2 + 1;
      mouseActive = true;
    };

    const handleMouseLeave = () => {
      mouse.x = 0;
      mouse.y = 0;
      mouseActive = false;
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // ─── Responsive Resize Observer ───
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width === 0 || height === 0) continue;
        W = width;
        H = height;
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H);
      }
    });
    resizeObserver.observe(container);

    // ─── Main Animation Loop ───
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth mouse parallax interpolation
      target.x += (mouse.x - target.x) * 0.045;
      target.y += (mouse.y - target.y) * 0.045;

      // Subtle scene floating rotation
      waveGroup.rotation.y = target.x * 0.12;
      waveGroup.rotation.x = Math.sin(t * 0.1) * 0.02 + target.y * 0.06;

      // Update follow light position near mouse
      followLight.position.x = target.x * 4.5;
      followLight.position.y = -0.5 + target.y * 1.5;

      // Connector line vertices array pointer
      const connectorPos = connectorGeo.attributes.position.array as Float32Array;

      // Update and Scale Towers
      for (let i = 0; i < towerCount; i++) {
        const tower = towers[i];

        // 1. Core Wave Math: Traveling double-sine wave
        // Higher amplitude on center-right (near peak colors)
        const scaleAmp = 0.95 + Math.sin(tower.ratio * Math.PI) * 0.8;
        let waveHeight = tower.baseHeight + 
          (Math.sin(tower.x * 1.1 - t * 2.2) * 0.45 + Math.cos(tower.x * 0.5 + t * 1.4) * 0.22) * scaleAmp;

        // Ensure wave height never clips below zero
        waveHeight = Math.max(0.15, waveHeight);

        // 2. Mouse Hover Attraction Field:
        // Towers rise and glow when cursor is near their X position
        let hoverGlow = 0;
        if (mouseActive) {
          const mouseWorldX = target.x * 5.0;
          const distToCursor = Math.abs(tower.x - mouseWorldX);
          if (distToCursor < 1.6) {
            const force = (1.6 - distToCursor) / 1.6;
            // Elevate the tower smoothly
            waveHeight += force * 0.9;
            hoverGlow = force;
          }
        }

        // Apply dynamic scale
        tower.mesh.scale.set(1.0, waveHeight, 1.0);

        // Update local tower color based on interactive hover flare
        if (hoverGlow > 0.05) {
          const flareColor = new THREE.Color().lerpColors(tower.initialColor, new THREE.Color(0xffffff), hoverGlow * 0.45);
          tower.mat.color.copy(flareColor);
          // Highlight connection opacity
          tower.mat.opacity = 0.95;
        } else {
          tower.mat.color.copy(tower.initialColor);
          tower.mat.opacity = tower.ratio < 0.1 || tower.ratio > 0.9 ? 0.25 : 0.8;
        }

        // 3. Keep Wave Connector Line synced with towers at 55% of their scaled heights
        const yOffset = -1.2 + waveHeight * 0.55;
        connectorPos[i * 3 + 1] = yOffset;
      }
      connectorGeo.attributes.position.needsUpdate = true;

      // Animate flowing particle streams
      for (const pulse of activePulses) {
        pulse.yProgress += pulse.speed;
        if (pulse.yProgress > 1.0) {
          pulse.yProgress = 0;
          pulse.towerIdx = Math.floor(Math.random() * towerCount);
          pulse.speed = 0.008 + Math.random() * 0.012;
        }

        const tower = towers[pulse.towerIdx];
        const scaledY = -1.2 + (tower.mesh.scale.y * pulse.yProgress);
        
        pulse.mesh.position.set(tower.x, scaledY, 0);

        // Pulse flares out (scales up) near the peak height and fades out
        const pScale = Math.sin(pulse.yProgress * Math.PI) * 1.5;
        pulse.mesh.scale.set(pScale, pScale, pScale);
      }

      renderer.render(scene, camera);
    };

    animate();

    // ─── Garbage Collection ───
    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      resizeObserver.disconnect();
      renderer.dispose();

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

export default PressReleaseHeroVisual3D;
