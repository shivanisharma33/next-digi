"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const DataCenter3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const [isExploded, setIsExploded] = useState(false);
  const isExplodedRef = useRef(false);
  const [showConsole, setShowConsole] = useState(false);

  // Holographic HUD Live Log Feed State
  const [logs, setLogs] = useState<string[]>([
    '[16:05:48] USDC GRID: 55MW NOMINAL POWER SUPPLY DETECTED',
    '[16:05:49] COOLANT VALVE A-01: 98.4% CAPACITY (FLOW RATE: 8.2 L/S)',
    '[16:05:51] SYSTEM DIAGNOSTICS: TEMPERATURE STABILIZED AT 18.4Â°C',
    '[16:05:54] COMPUTE: AI GPU CLUSTERS LOAD AT 94.2% UTILIZATION',
  ]);

  useEffect(() => {
    isExplodedRef.current = isExploded;
  }, [isExploded]);

  // Periodic Log Feed Simulation
  useEffect(() => {
    const logPool = [
      'USDC CORE: SHIELD STATUS NOMINAL // PUE COMPLIANT',
      'COOLING SYS: CHILLER FLOW TEMPERATURE AT 16.8Â°C SUPPLY',
      'MODULE POWER: LOAD SHIFT ACTIVE ON BACKUP SOLAR PYLON',
      'SECURITY SYS: ACCESS CONTROL LOG LEVEL 0 (SECURE)',
      'NOC MONITORS: PACKET DELIVERY SPEED AT 400G INTERCONNECT',
      'AI ENGINE: REDISTRIBUTING COMPUTE LOADS ACROSS MODULES',
      'ENERGY GRID: BATTERY RESERVES AT 100% CAPACITY // CHARGING',
      'COOLANT SYS: RE-BALANCING DIRECT TO CHIP MANIFOLD B-02',
    ];

    const interval = setInterval(() => {
      const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false });
      const randomMsg = logPool[Math.floor(Math.random() * logPool.length)];
      setLogs((prev) => [...prev.slice(-4), `[${timeStr}] ${randomMsg}`]);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let W = container.clientWidth || 600;
    let H = container.clientHeight || 500;

    // --- 1. CORE THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x040507, 0.035);

    // Camera setup (Isometric perspective)
    const camera = new THREE.PerspectiveCamera(35, W / H, 0.1, 100);
    camera.position.set(13.5, 9.5, 14.5);
    camera.lookAt(0, 0.2, 0);

    // Renderer setup with premium high-performance PBR capabilities
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x040507, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Ultra soft beautiful shadows
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // Cinema grade color dynamics
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    const disposables: { dispose: () => void }[] = [];
    const register = <T extends { dispose: () => void }>(obj: T): T => {
      disposables.push(obj);
      return obj;
    };

    // --- 2. HIGH-FIDELITY PROCEDURAL METAL & INDUSTRIAL TEXTURES ---
    
    // A. Polished epoxy floor base with concrete aggregate underlayer & specular reflectivity
    const createPolishedFloorTexture = () => {
      const size = 512;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;

      // Deep dark epoxy base
      ctx.fillStyle = '#06080b';
      ctx.fillRect(0, 0, size, size);

      // Fine granite aggregate dust
      for (let i = 0; i < 40000; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const col = Math.floor(10 + Math.random() * 20);
        ctx.fillStyle = `rgba(${col}, ${col + 2}, ${col + 6}, 0.22)`;
        ctx.fillRect(x, y, 1, 1);
      }

      // Concrete expansion seams with subtle amber glow accents
      ctx.strokeStyle = 'rgba(245, 197, 24, 0.08)';
      ctx.lineWidth = 1;
      const grid = 64;
      for (let g = 0; g <= size; g += grid) {
        ctx.beginPath(); ctx.moveTo(g, 0); ctx.lineTo(g, size); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, g); ctx.lineTo(size, g); ctx.stroke();
      }

      const texture = register(new THREE.CanvasTexture(canvas));
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 2);
      return texture;
    };

    // B. Brushed gold/amber metal panel texture for realistic premium details
    const createBrushedGoldTexture = () => {
      const size = 256;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;

      // Rich gold/amber gradient
      const grad = ctx.createLinearGradient(0, 0, size, size);
      grad.addColorStop(0, '#cca010');
      grad.addColorStop(0.5, '#f5c518');
      grad.addColorStop(1, '#b08705');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);

      // Brushed grain streaks
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
      for (let i = 0; i < 1500; i++) {
        const rx = Math.random() * size;
        const ry = Math.random() * size;
        const rw = 5 + Math.random() * 30;
        ctx.fillRect(rx, ry, rw, 0.6);
      }

      const texture = register(new THREE.CanvasTexture(canvas));
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      return texture;
    };

    // C. Server cabinet ventilation grid (hexagonal intake ports simulation)
    const createVentGridTexture = () => {
      const size = 128;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d')!;

      ctx.fillStyle = '#0a0b0e';
      ctx.fillRect(0, 0, size, size);

      // Symmetrical hex cells
      ctx.fillStyle = '#010203';
      const hexRadius = 3;
      const xSpacing = 10;
      const ySpacing = 6;

      for (let y = 0; y < size + hexRadius; y += ySpacing) {
        const offset = (y / ySpacing) % 2 === 0 ? xSpacing / 2 : 0;
        for (let x = -hexRadius + offset; x < size + hexRadius; x += xSpacing) {
          ctx.beginPath();
          ctx.arc(x, y, hexRadius - 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const texture = register(new THREE.CanvasTexture(canvas));
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 8);
      return texture;
    };

    const floorColorTex = createPolishedFloorTexture();
    const brushedGoldTex = createBrushedGoldTexture();
    const ventGridTex = createVentGridTexture();

    // --- 3. PREMIUM PREMIUM PBR MATERIAL BINDINGS ---
    const matBaseFloor = register(new THREE.MeshPhysicalMaterial({
      map: floorColorTex,
      metalness: 0.9,
      roughness: 0.12,
      clearcoat: 1.0, // Luxury high-gloss mirror epoxy look
      clearcoatRoughness: 0.05,
    }));

    const matModuleShell = register(new THREE.MeshPhysicalMaterial({
      color: 0x111317,
      roughness: 0.25,
      metalness: 0.8,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2
    }));

    const matGoldTrim = register(new THREE.MeshPhysicalMaterial({
      map: brushedGoldTex,
      metalness: 0.95,
      roughness: 0.18,
      emissive: 0xf5c518,
      emissiveIntensity: 0.18,
    }));

    const matGoldLED = register(new THREE.MeshBasicMaterial({ color: 0xf5c518 }));
    const matGreenLED = register(new THREE.MeshBasicMaterial({ color: 0x39ff14 }));
    const matBlueLED = register(new THREE.MeshBasicMaterial({ color: 0x00d2ff }));
    const matRedLED = register(new THREE.MeshBasicMaterial({ color: 0xff3b30 }));

    const matCabinetGlass = register(new THREE.MeshPhysicalMaterial({
      color: 0x00d2ff,
      transparent: true,
      opacity: 0.28,
      metalness: 0.9,
      roughness: 0.08,
      transmission: 0.8, // Physical light refractions
      ior: 1.5,
    }));

    const matServerRackCore = register(new THREE.MeshStandardMaterial({ color: 0x060709, metalness: 0.85, roughness: 0.35 }));
    const matVentGrid = register(new THREE.MeshStandardMaterial({ map: ventGridTex, metalness: 0.8, roughness: 0.3 }));

    const matTechGray = register(new THREE.MeshStandardMaterial({ color: 0x1e2129, metalness: 0.75, roughness: 0.22 }));
    const matWalkway = register(new THREE.MeshStandardMaterial({ color: 0x0c0e12, metalness: 0.9, roughness: 0.2 }));

    const pipeMatRed = register(new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.45, roughness: 0.15, metalness: 0.85 }));
    const pipeMatBlue = register(new THREE.MeshStandardMaterial({ color: 0x00a8ff, emissive: 0x00a8ff, emissiveIntensity: 0.45, roughness: 0.15, metalness: 0.85 }));

    // --- 4. HIGHLY REALISTIC STUDIO LIGHTING SYSTEM ---
    const ambientLight = register(new THREE.AmbientLight(0xffffff, 0.25));
    scene.add(ambientLight);

    const keyLight = register(new THREE.DirectionalLight(0xfff5dd, 1.4));
    keyLight.position.set(16, 26, 20);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048; // Ultra-crisp shadows
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0006;
    keyLight.shadow.radius = 5.0; // Soft shadow damping
    scene.add(keyLight);

    // Warm amber lighting underneath computing cores (ambient occlusion)
    const fillLight = register(new THREE.DirectionalLight(0xf5c518, 0.45));
    fillLight.position.set(-15, 12, -15);
    scene.add(fillLight);

    // Dynamic contrast cyber-rim lighting
    const rimLight = register(new THREE.DirectionalLight(0x00a8ff, 0.3));
    rimLight.position.set(-10, 8, 10);
    scene.add(rimLight);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // --- 5. DETAILED FLOOR & PLATFORM ASSEMBLY ---
    const floorGeo = register(new THREE.BoxGeometry(11.8, 0.15, 8.8));
    const floor = new THREE.Mesh(floorGeo, matBaseFloor);
    floor.position.y = -0.075;
    floor.receiveShadow = true;
    mainGroup.add(floor);

    // Symmetrical Glowing Golden Floor Grid Overlay
    const gridHelper = register(new THREE.GridHelper(11.8, 24, 0xf5c518, 0x1f222b));
    gridHelper.position.y = 0.002;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.15;
    mainGroup.add(gridHelper);

    // Gold Beveled Platform Border
    const borderGeo = register(new THREE.BoxGeometry(11.95, 0.08, 8.95));
    const border = new THREE.Mesh(borderGeo, matGoldTrim);
    border.position.y = 0.02;
    floor.add(border);

    // Outer Cybernetic Glowing floor rings (under major structures)
    const ringGeo = register(new THREE.RingGeometry(1.6, 1.7, 32));
    const ringMat = register(new THREE.MeshBasicMaterial({ color: 0xf5c518, side: THREE.DoubleSide, transparent: true, opacity: 0.15 }));
    const ringLeft = new THREE.Mesh(ringGeo, ringMat);
    ringLeft.rotation.x = -Math.PI / 2;
    ringLeft.position.set(-3.5, 0.003, 0);
    mainGroup.add(ringLeft);

    const ringRight = new THREE.Mesh(ringGeo, ringMat);
    ringRight.rotation.x = -Math.PI / 2;
    ringRight.position.set(3.5, 0.003, 0);
    mainGroup.add(ringRight);

    // --- 6. MODULAR DATA CENTER COMPUTING UNITS (H-GRID) ---
    const modulesGroup = new THREE.Group();
    mainGroup.add(modulesGroup);

    interface ServerBlade {
      mesh: THREE.Mesh;
      leds: THREE.Mesh[];
      speed: number;
    }

    interface ModularBlock {
      group: THREE.Group;
      roof: THREE.Group;
      internalRacks: THREE.Group;
      blades: ServerBlade[];
      coords: { x: number; z: number };
    }

    const moduleBlocks: ModularBlock[] = [];
    const moduleCoords = [
      { x: -3.8, z: -1.8, label: 'MODULE A1' },
      { x: -3.8, z: 0.6, label: 'MODULE A2' },
      { x: 3.8, z: -1.8, label: 'MODULE B1' },
      { x: 3.8, z: 0.6, label: 'MODULE B2' },
      { x: 0.0, z: -1.8, label: 'MODULE C1' },
      { x: 0.0, z: 1.8, label: 'MODULE C2' }
    ];

    const fanBladesList: THREE.Mesh[] = [];
    const internalLEDs: THREE.Mesh[] = [];
    const moduleWidth = 1.6, moduleHeight = 1.0, moduleDepth = 2.0;

    moduleCoords.forEach((coord) => {
      const modGroup = new THREE.Group();
      modGroup.position.set(coord.x, 0.01, coord.z);
      modulesGroup.add(modGroup);

      // Building Core Lower Shell
      const shellGeo = register(new THREE.BoxGeometry(moduleWidth, moduleHeight, moduleDepth));
      const shell = new THREE.Mesh(shellGeo, matModuleShell);
      shell.position.y = moduleHeight / 2;
      shell.castShadow = true;
      shell.receiveShadow = true;
      modGroup.add(shell);

      // Brushed Gold structural division trim lines
      const trimFront = new THREE.Mesh(register(new THREE.BoxGeometry(moduleWidth + 0.01, 0.03, 0.03)), matGoldTrim);
      trimFront.position.set(0, moduleHeight - 0.05, moduleDepth / 2 + 0.005);
      modGroup.add(trimFront);

      const trimBack = new THREE.Mesh(register(new THREE.BoxGeometry(moduleWidth + 0.01, 0.03, 0.03)), matGoldTrim);
      trimBack.position.set(0, moduleHeight - 0.05, -moduleDepth / 2 - 0.005);
      modGroup.add(trimBack);

      // Symmetrical structural ventilation vents (carbon texture)
      const ventGeo = register(new THREE.BoxGeometry(0.02, moduleHeight - 0.2, moduleDepth - 0.4));
      const leftVent = new THREE.Mesh(ventGeo, matVentGrid);
      leftVent.position.set(-moduleWidth / 2 - 0.005, moduleHeight / 2, 0);
      modGroup.add(leftVent);

      const rightVent = new THREE.Mesh(ventGeo, matVentGrid);
      rightVent.position.set(moduleWidth / 2 + 0.005, moduleHeight / 2, 0);
      modGroup.add(rightVent);

      // Inside Modular server racks
      const internalRacks = new THREE.Group();
      modGroup.add(internalRacks);

      const blades: ServerBlade[] = [];

      // Stacked Symmetrical Server Cabinets (2 cabinets per module)
      for (let r = 0; r < 2; r++) {
        const rackX = -0.32 + r * 0.64;
        const cabinetFrame = new THREE.Mesh(register(new THREE.BoxGeometry(0.32, 0.85, 1.6)), matServerRackCore);
        cabinetFrame.position.set(rackX, 0.435, 0);
        internalRacks.add(cabinetFrame);

        // Individual Stacked Server Blades (10 blades per cabinet)
        const bladeHeight = 0.065;
        const startY = 0.09;
        
        for (let bIdx = 0; bIdx < 10; bIdx++) {
          const bladeY = startY + bIdx * 0.076;
          const bladeGroup = new THREE.Group();
          bladeGroup.position.set(rackX, bladeY, 0);

          // Blade chassis
          const bladeBody = new THREE.Mesh(register(new THREE.BoxGeometry(0.28, bladeHeight, 1.45)), matTechGray);
          bladeBody.position.y = 0;
          bladeBody.castShadow = true;
          bladeGroup.add(bladeBody);

          // Faceplate detail (vent grid)
          const faceplate = new THREE.Mesh(register(new THREE.BoxGeometry(0.282, bladeHeight - 0.01, 0.03)), matVentGrid);
          faceplate.position.set(0, 0, 0.73);
          bladeGroup.add(faceplate);

          // Golden handle rails
          const handleL = new THREE.Mesh(register(new THREE.CylinderGeometry(0.003, 0.003, 0.03, 8)), matGoldTrim);
          handleL.rotation.z = Math.PI / 2;
          handleL.position.set(-0.11, 0, 0.74);
          bladeGroup.add(handleL);

          const handleR = new THREE.Mesh(register(new THREE.CylinderGeometry(0.003, 0.003, 0.03, 8)), matGoldTrim);
          handleR.rotation.z = Math.PI / 2;
          handleR.position.set(0.11, 0, 0.74);
          bladeGroup.add(handleR);

          // Dynamic Blinking Diagnostic micro LEDs
          const bladeLeds: THREE.Mesh[] = [];
          for (let lIdx = 0; lIdx < 3; lIdx++) {
            const isGreen = Math.random() > 0.4;
            const led = new THREE.Mesh(
              register(new THREE.SphereGeometry(0.009, 8, 8)),
              isGreen ? matGreenLED : (Math.random() > 0.5 ? matBlueLED : matGoldLED)
            );
            led.position.set(-0.06 + lIdx * 0.04, 0, 0.746);
            led.userData.baseScale = 1;
            bladeGroup.add(led);
            bladeLeds.push(led);
            internalLEDs.push(led);
          }

          internalRacks.add(bladeGroup);
          blades.push({ mesh: bladeBody, leds: bladeLeds, speed: 0.5 + Math.random() * 2.5 });
        }

        // Glass server door panel
        const door = new THREE.Mesh(register(new THREE.BoxGeometry(0.31, 0.82, 0.02)), matCabinetGlass);
        door.position.set(rackX, 0.435, 0.81);
        internalRacks.add(door);

        // Golden handle catch
        const doorHandle = new THREE.Mesh(register(new THREE.BoxGeometry(0.015, 0.08, 0.015)), matGoldTrim);
        doorHandle.position.set(rackX - 0.12, 0.435, 0.825);
        internalRacks.add(doorHandle);
      }

      // Rooftop Deck panel (Holographic details revealed in exploded view)
      const roof = new THREE.Group();
      roof.position.y = moduleHeight + 0.04;
      modGroup.add(roof);

      const roofPanelGeo = register(new THREE.BoxGeometry(moduleWidth + 0.06, 0.08, moduleDepth + 0.06));
      const roofPanel = new THREE.Mesh(roofPanelGeo, matModuleShell);
      roofPanel.castShadow = true;
      roof.add(roofPanel);

      const roofGrid = new THREE.GridHelper(moduleWidth + 0.02, 10, 0xf5c518, 0x1f222b);
      roofGrid.position.y = 0.041;
      (roofGrid.material as THREE.Material).transparent = true;
      (roofGrid.material as THREE.Material).opacity = 0.25;
      roof.add(roofGrid);

      // Symmetrical Aerodynamic Exhaust Cooling Fans (2x5 Grid)
      const fansGroup = new THREE.Group();
      fansGroup.position.y = 0.045;
      roof.add(fansGroup);

      const shroudGeo = register(new THREE.TorusGeometry(0.08, 0.012, 8, 24));
      const bladeGeo = register(new THREE.BoxGeometry(0.075, 0.005, 0.016));
      const grillRingGeo1 = register(new THREE.TorusGeometry(0.06, 0.002, 4, 16));
      const grillRingGeo2 = register(new THREE.TorusGeometry(0.03, 0.002, 4, 16));

      for (let rowIdx = 0; rowIdx < 5; rowIdx++) {
        for (let colIdx = 0; colIdx < 2; colIdx++) {
          const fanX = -0.4 + rowIdx * 0.2;
          const fanZ = -0.55 + colIdx * 1.1;

          // Fan shroud
          const shroud = new THREE.Mesh(shroudGeo, matTechGray);
          shroud.rotation.x = Math.PI / 2;
          shroud.position.set(fanX, 0.01, fanZ);
          shroud.castShadow = true;
          fansGroup.add(shroud);

          // Dynamic rotating fan blades hub
          const fanHub = new THREE.Group();
          fanHub.position.set(fanX, 0.01, fanZ);

          const centerCap = new THREE.Mesh(register(new THREE.CylinderGeometry(0.018, 0.018, 0.012, 12)), matGoldTrim);
          fanHub.add(centerCap);

          // 5 Curved Aerodynamic Blades
          for (let b = 0; b < 5; b++) {
            const blade = new THREE.Mesh(bladeGeo, matTechGray);
            blade.rotation.y = (b / 5) * Math.PI * 2;
            blade.rotation.x = 0.35; // Pitch angle
            fanHub.add(blade);
            fanBladesList.push(blade);
          }

          fansGroup.add(fanHub);

          // Concentric circular safety wire grill
          const grill1 = new THREE.Mesh(grillRingGeo1, matGoldTrim);
          grill1.rotation.x = Math.PI / 2;
          grill1.position.set(fanX, 0.024, fanZ);
          fansGroup.add(grill1);

          const grill2 = new THREE.Mesh(grillRingGeo2, matGoldTrim);
          grill2.rotation.x = Math.PI / 2;
          grill2.position.set(fanX, 0.024, fanZ);
          fansGroup.add(grill2);
        }
      }

      moduleBlocks.push({
        group: modGroup,
        roof,
        internalRacks,
        blades,
        coords: { x: coord.x, z: coord.z }
      });
    });

    // --- 7. CONNECTING CORRIDORS & INDUSTRIAL WALKWAYS ---
    const walkways = new THREE.Group();
    mainGroup.add(walkways);

    const buildWalkway = (w: number, h: number, d: number, x: number, y: number, z: number) => {
      // Main structural base
      const segment = new THREE.Mesh(register(new THREE.BoxGeometry(w, h, d)), matWalkway);
      segment.position.set(x, y, z);
      segment.castShadow = true;
      segment.receiveShadow = true;
      walkways.add(segment);

      // Gold railing guards along walkways
      const guardRailLeft = new THREE.Mesh(register(new THREE.BoxGeometry(w, 0.08, 0.02)), matGoldTrim);
      guardRailLeft.position.set(x, y + h / 2 + 0.04, z - d / 2 + 0.01);
      walkways.add(guardRailLeft);

      const guardRailRight = new THREE.Mesh(register(new THREE.BoxGeometry(w, 0.08, 0.02)), matGoldTrim);
      guardRailRight.position.set(x, y + h / 2 + 0.04, z + d / 2 - 0.01);
      walkways.add(guardRailRight);
    };

    // Double-H structural corridor network
    buildWalkway(0.4, 0.22, 3.2, -2.0, 0.11, -0.6); // Left spine
    buildWalkway(0.4, 0.22, 3.2, 2.0, 0.11, -0.6);  // Right spine
    buildWalkway(0.4, 0.22, 2.0, 0.0, 0.11, 0.0);   // Center spine

    // Horizontal connectives
    buildWalkway(2.0, 0.22, 0.4, -1.0, 0.11, -0.3); // Left connection
    buildWalkway(2.0, 0.22, 0.4, 1.0, 0.11, -0.3);  // Right connection

    // Extended module branch connections
    buildWalkway(1.4, 0.22, 0.4, -2.9, 0.11, -1.8);
    buildWalkway(1.4, 0.22, 0.4, -2.9, 0.11, 0.6);
    buildWalkway(1.4, 0.22, 0.4, 2.9, 0.11, -1.8);
    buildWalkway(1.4, 0.22, 0.4, 2.9, 0.11, 0.6);
    buildWalkway(0.4, 0.22, 0.8, 0.0, 0.11, -1.2);
    buildWalkway(0.4, 0.22, 0.8, 0.0, 0.11, 1.2);

    // Entry pathways
    buildWalkway(1.5, 0.22, 0.4, -2.75, 0.11, 2.0);
    buildWalkway(1.5, 0.22, 0.4, 2.75, 0.11, 2.0);

    // --- 8. REALISTIC POWER HUBS & SECURITY STATIONS ---
    
    // Power Generation Hub (Bottom Left corner)
    const powerHub = new THREE.Group();
    powerHub.position.set(-3.5, 0, 2.0);
    mainGroup.add(powerHub);

    const phBody = new THREE.Mesh(register(new THREE.BoxGeometry(1.2, 0.7, 0.9)), matModuleShell);
    phBody.position.y = 0.35;
    phBody.castShadow = true;
    phBody.receiveShadow = true;
    powerHub.add(phBody);

    const phRoof = new THREE.Mesh(register(new THREE.BoxGeometry(1.26, 0.04, 0.96)), matGoldTrim);
    phRoof.position.y = 0.72;
    phRoof.castShadow = true;
    powerHub.add(phRoof);

    // Generator attachment with detailed cooling ribs/fins
    const phGen = new THREE.Mesh(register(new THREE.BoxGeometry(0.35, 0.48, 0.6)), matTechGray);
    phGen.position.set(-0.785, 0.24, 0);
    phGen.castShadow = true;
    powerHub.add(phGen);

    const phGenGrid = new THREE.Mesh(register(new THREE.BoxGeometry(0.352, 0.4, 0.48)), matVentGrid);
    phGenGrid.position.set(-0.787, 0.24, 0);
    powerHub.add(phGenGrid);

    // Symmetrical Power Hub Center
    const powerHubCenter = new THREE.Group();
    powerHubCenter.position.set(0.0, 0, -0.3);
    mainGroup.add(powerHubCenter);

    const phCBody = new THREE.Mesh(register(new THREE.BoxGeometry(0.9, 0.7, 0.8)), matModuleShell);
    phCBody.position.y = 0.35;
    phCBody.castShadow = true;
    powerHubCenter.add(phCBody);

    const phCRoof = new THREE.Mesh(register(new THREE.BoxGeometry(0.96, 0.04, 0.86)), matGoldTrim);
    phCRoof.position.y = 0.72;
    powerHubCenter.add(phCRoof);

    // Access Control Gateway (Bottom Right corner)
    const accessGateway = new THREE.Group();
    accessGateway.position.set(3.5, 0, 2.0);
    mainGroup.add(accessGateway);

    const agBody = new THREE.Mesh(register(new THREE.BoxGeometry(0.8, 0.6, 0.8)), matModuleShell);
    agBody.position.y = 0.3;
    agBody.castShadow = true;
    agBody.receiveShadow = true;
    accessGateway.add(agBody);

    const agRoof = new THREE.Mesh(register(new THREE.BoxGeometry(0.86, 0.04, 0.86)), matGoldTrim);
    agRoof.position.y = 0.62;
    accessGateway.add(agRoof);

    // --- 9. FLOWING LIQUID COOLING DUAL PIPELINES ---
    const pipingGroup = new THREE.Group();
    mainGroup.add(pipingGroup);

    interface Pipeline {
      curve: THREE.CatmullRomCurve3;
      pulses: { mesh: THREE.Mesh; progress: number; speed: number }[];
    }
    const pipelines: Pipeline[] = [];

    const buildPipelineLoop = (points: THREE.Vector3[], isHot: boolean) => {
      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = register(new THREE.TubeGeometry(curve, 64, 0.052, 12, false));
      const pipeMesh = new THREE.Mesh(tubeGeo, isHot ? pipeMatRed : pipeMatBlue);
      pipeMesh.castShadow = true;
      pipingGroup.add(pipeMesh);

      // Gold mounting brackets along pipelines
      const bracketCount = 8;
      const bracketGeo = register(new THREE.BoxGeometry(0.09, 0.09, 0.09));
      for (let b = 0; b < bracketCount; b++) {
        const t = (b / (bracketCount - 1)) * 0.86 + 0.07;
        const pos = curve.getPointAt(t);
        const tangent = curve.getTangentAt(t);

        const bracket = new THREE.Mesh(bracketGeo, matGoldTrim);
        bracket.position.copy(pos);
        bracket.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
        pipingGroup.add(bracket);
      }

      // Coolant flow indicators
      const flowPulseGeo = register(new THREE.CylinderGeometry(0.018, 0.018, 0.46, 8));
      const flowPulseMat = register(new THREE.MeshBasicMaterial({ color: isHot ? 0xff8e88 : 0x00d2ff }));
      const pulses: { mesh: THREE.Mesh; progress: number; speed: number }[] = [];

      for (let p = 0; p < 3; p++) {
        const pulseMesh = new THREE.Mesh(flowPulseGeo, flowPulseMat);
        scene.add(pulseMesh);
        pulses.push({
          mesh: pulseMesh,
          progress: p / 3,
          speed: 0.0025 + Math.random() * 0.0018
        });
      }

      pipelines.push({ curve, pulses });
    };

    // Cold water supply loop (Left flank)
    buildPipelineLoop([
      new THREE.Vector3(-4.5, 0.13, -2.4),
      new THREE.Vector3(-4.5, 0.13, 1.2),
      new THREE.Vector3(-2.6, 0.13, 1.2),
      new THREE.Vector3(-2.6, 0.13, 1.8)
    ], false);

    // Hot water return loop (Right flank)
    buildPipelineLoop([
      new THREE.Vector3(4.5, 0.13, -2.4),
      new THREE.Vector3(4.5, 0.13, 1.2),
      new THREE.Vector3(2.6, 0.13, 1.2),
      new THREE.Vector3(2.6, 0.13, 1.8)
    ], true);

    // --- 10. FUTURISTIC SCANNERS & ATMOSPHERIC SPARKS ---
    
    // Neon Yellow Sweeping Diagnostic Laser Grid
    const scannerGeo = register(new THREE.PlaneGeometry(11.8, 8.8));
    const scannerMat = register(new THREE.MeshBasicMaterial({
      color: 0xf5c518,
      transparent: true,
      opacity: 0.06,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    }));
    const scanner = new THREE.Mesh(scannerGeo, scannerMat);
    scanner.rotation.x = -Math.PI / 2;
    scanner.position.y = 0.06;
    mainGroup.add(scanner);

    const scannerBorderGeo = register(new THREE.EdgesGeometry(scannerGeo));
    const scannerBorderMat = register(new THREE.LineBasicMaterial({ color: 0xf5c518, transparent: true, opacity: 0.35 }));
    const scannerBorder = new THREE.LineSegments(scannerBorderGeo, scannerBorderMat);
    scanner.add(scannerBorder);

    // Atmospheric AI Datadust floating sparks
    const sparksGroup = new THREE.Group();
    mainGroup.add(sparksGroup);

    const sparksCount = 50;
    const sparkGeo = register(new THREE.SphereGeometry(0.024, 6, 6));
    const sparkMatGold = register(new THREE.MeshBasicMaterial({ color: 0xf5c518, transparent: true, opacity: 0.65 }));
    const sparkMatCyan = register(new THREE.MeshBasicMaterial({ color: 0x00d2ff, transparent: true, opacity: 0.65 }));

    interface Spark {
      mesh: THREE.Mesh;
      speedY: number;
      baseX: number;
      baseZ: number;
      rangeY: number;
      seed: number;
    }
    const sparksList: Spark[] = [];

    for (let i = 0; i < sparksCount; i++) {
      const isGold = Math.random() > 0.4;
      const spark = new THREE.Mesh(sparkGeo, isGold ? sparkMatGold : sparkMatCyan);

      const rx = -5.4 + Math.random() * 10.8;
      const rz = -4.2 + Math.random() * 8.4;
      const ry = 0.1 + Math.random() * 2.5;

      spark.position.set(rx, ry, rz);
      sparksGroup.add(spark);

      sparksList.push({
        mesh: spark,
        speedY: 0.003 + Math.random() * 0.005,
        baseX: rx,
        baseZ: rz,
        rangeY: 2.5,
        seed: Math.random() * 100
      });
    }

    // --- 11. BACKGRID GREEN ENERGY WIND TURBINES & PYLON ---
    const turbinesGroup = new THREE.Group();
    mainGroup.add(turbinesGroup);

    interface WindTurbine {
      group: THREE.Group;
      blades: THREE.Group;
      spinSpeed: number;
    }
    const windTurbines: WindTurbine[] = [];

    const buildTurbineNode = (x: number, y: number, z: number, scale = 1.0) => {
      const turbine = new THREE.Group();
      turbine.position.set(x, y, z);

      const mastGeo = register(new THREE.CylinderGeometry(0.035 * scale, 0.065 * scale, 2.6 * scale, 12));
      const mast = new THREE.Mesh(mastGeo, matModuleShell);
      mast.position.y = 1.3 * scale;
      mast.castShadow = true;
      turbine.add(mast);

      const cabinGeo = register(new THREE.BoxGeometry(0.16 * scale, 0.13 * scale, 0.26 * scale));
      const cabin = new THREE.Mesh(cabinGeo, matModuleShell);
      cabin.position.y = 2.6 * scale;
      turbine.add(cabin);

      const bladesGroup = new THREE.Group();
      bladesGroup.position.set(0, 2.6 * scale, 0.14 * scale);

      const hubGeo = register(new THREE.CylinderGeometry(0.035 * scale, 0.035 * scale, 0.06 * scale, 8));
      const hub = new THREE.Mesh(hubGeo, matGoldTrim);
      hub.rotation.x = Math.PI / 2;
      bladesGroup.add(hub);

      // 3 realistic blades
      const bladeGeo = register(new THREE.BoxGeometry(0.026 * scale, 0.85 * scale, 0.008 * scale));
      for (let b = 0; b < 3; b++) {
        const blade = new THREE.Mesh(bladeGeo, matModuleShell);
        blade.position.y = 0.4 * scale;

        const pivot = new THREE.Group();
        pivot.rotation.z = (b / 3) * Math.PI * 2;
        pivot.add(blade);

        bladesGroup.add(pivot);
      }

      turbine.add(bladesGroup);
      turbinesGroup.add(turbine);

      windTurbines.push({
        group: turbine,
        blades: bladesGroup,
        spinSpeed: 0.015 + Math.random() * 0.014
      });
    };

    buildTurbineNode(-4.8, -1.0, 4.2, 1.2);
    buildTurbineNode(-1.4, -1.0, 4.8, 1.2);
    buildTurbineNode(3.8, -1.0, 4.2, 1.2);

    // Electrical grid backup pylon
    const buildGridPylon = (x: number, y: number, z: number) => {
      const pGroup = new THREE.Group();
      pGroup.position.set(x, y, z);

      const pylonMat = register(new THREE.LineBasicMaterial({ color: 0xf5c518, transparent: true, opacity: 0.2 }));
      const points: THREE.Vector3[] = [];

      const towers = [
        [new THREE.Vector3(-0.45, 0, -0.45), new THREE.Vector3(-0.1, 3.4, -0.1)],
        [new THREE.Vector3(0.45, 0, -0.45), new THREE.Vector3(0.1, 3.4, -0.1)],
        [new THREE.Vector3(-0.45, 0, 0.45), new THREE.Vector3(-0.1, 3.4, 0.1)],
        [new THREE.Vector3(0.45, 0, 0.45), new THREE.Vector3(0.1, 3.4, 0.1)]
      ];
      towers.forEach(pair => points.push(pair[0], pair[1]));

      const horizons = [0.85, 1.7, 2.55, 3.4];
      horizons.forEach(h => {
        const w = 0.45 * (1.0 - h / 4.2);
        points.push(
          new THREE.Vector3(-w, h, -w), new THREE.Vector3(w, h, -w),
          new THREE.Vector3(w, h, -w), new THREE.Vector3(w, h, w),
          new THREE.Vector3(w, h, w), new THREE.Vector3(-w, h, w),
          new THREE.Vector3(-w, h, w), new THREE.Vector3(-w, h, -w)
        );
      });

      const pylonGeo = register(new THREE.BufferGeometry().setFromPoints(points));
      const pylonLine = new THREE.LineSegments(pylonGeo, pylonMat);
      pGroup.add(pylonLine);
      mainGroup.add(pGroup);
    };
    buildGridPylon(5.2, -1.0, 3.2);

    // --- 12. ROTATION & MOUSE DRAG CONTROLS WITH INERTIAL DAMPING ---
    let azimuth = Math.PI / 4, elevation = 0.22;
    let targetAzimuth = azimuth, targetElevation = elevation;
    let isDragging = false, dragMoved = false;
    let prevX = 0, prevY = 0, downX = 0, downY = 0;

    const canvas = renderer.domElement;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      dragMoved = false;
      prevX = downX = e.clientX;
      prevY = downY = e.clientY;
    };

    const onWindowMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;

      if (Math.abs(e.clientX - downX) > 3 || Math.abs(e.clientY - downY) > 3) {
        dragMoved = true;
      }

      targetAzimuth -= dx * 0.0042;
      targetElevation = Math.max(0.06, Math.min(0.72, targetElevation - dy * 0.0032));
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onWindowMouseUp = () => {
      isDragging = false;
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      isDragging = true;
      dragMoved = false;
      prevX = downX = e.touches[0].clientX;
      prevY = downY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevX;
      const dy = e.touches[0].clientY - prevY;

      if (Math.abs(e.touches[0].clientX - downX) > 3) {
        dragMoved = true;
      }

      targetAzimuth -= dx * 0.0042;
      targetElevation = Math.max(0.06, Math.min(0.72, targetElevation - dy * 0.0032));
      prevX = e.touches[0].clientX;
      prevY = e.touches[0].clientY;
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onWindowMouseMove);
    window.addEventListener('mouseup', onWindowMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd);

    // --- 13. RESIZE OBSERVER SYSTEM ---
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (!width || !height) continue;
        W = width;
        H = height;
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H);
      }
    });
    resizeObserver.observe(container);

    // --- 14. TELEMETRY COORDS HUD ANCHORS TRANSLATOR ---
    const updateHUDLabels = () => {
      if (!hudRef.current) return;

      const updateLabel = (id: string, worldPos: THREE.Vector3) => {
        const el = hudRef.current?.querySelector(`#hud-${id}`) as HTMLDivElement;
        if (!el) return;

        const tempV = worldPos.clone();
        tempV.applyMatrix4(mainGroup.matrixWorld);
        tempV.project(camera);

        const isBehind = tempV.z > 1.0;
        if (isBehind) {
          el.style.opacity = '0';
          el.style.pointerEvents = 'none';
          return;
        }

        const px = (tempV.x * 0.5 + 0.5) * W;
        const py = (-(tempV.y * 0.5) + 0.5) * H;

        el.style.transform = `translate3d(${px - el.offsetWidth / 2}px, ${py - el.offsetHeight}px, 0)`;
        el.style.opacity = '1';
      };

      updateLabel('modA', new THREE.Vector3(-3.8, 1.25, -0.6));
      updateLabel('modB', new THREE.Vector3(3.8, 1.25, -0.6));
      updateLabel('hubL', new THREE.Vector3(-3.5, 0.95, 2.0));
      updateLabel('hubC', new THREE.Vector3(0.0, 0.95, -0.3));
      updateLabel('accC', new THREE.Vector3(3.5, 0.85, 2.0));
    };

    // --- 15. DYNAMIC INTERACTIVE ANIMATION LOOP ---
    const clock = new THREE.Clock();
    let explodeProgress = 0;

    const animate = () => {
      const frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera damping
      azimuth += (targetAzimuth - azimuth) * 0.08;
      elevation += (targetElevation - elevation) * 0.08;
      mainGroup.rotation.y = azimuth - Math.PI / 4;
      mainGroup.rotation.x = elevation * 0.45;

      // Cinematic open/close split transition
      const targetProgress = isExplodedRef.current ? 1.0 : 0.0;
      explodeProgress += (targetProgress - explodeProgress) * 0.085;

      moduleBlocks.forEach((mod) => {
        // Slide up AND split open roofs outward
        mod.roof.position.y = (moduleHeight + 0.04) + explodeProgress * 1.5;
        mod.roof.position.x = explodeProgress * 0.45 * (mod.coords.x > 0 ? 1 : mod.coords.x < 0 ? -1 : 0);
        
        // Translucent fade of sliding shells
        mod.roof.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material.transparent = true;
            child.material.opacity = 1.0 - explodeProgress * 0.86;
          }
        });
      });

      // Spin fan blades
      fanBladesList.forEach((blade) => {
        blade.rotation.y += 0.22;
      });

      // Spin wind turbines
      windTurbines.forEach((wt) => {
        wt.blades.rotation.z += wt.spinSpeed;
      });

      // Blinking diagnostic server LEDs
      internalLEDs.forEach((led) => {
        if (Math.random() > 0.978) {
          led.visible = !led.visible;
        }
      });

      // Sweeping yellow diagnostic laser scanner
      scanner.position.y = 0.06 + (0.5 + 0.5 * Math.sin(elapsedTime * 1.6)) * 1.45;
      scannerBorderMat.opacity = 0.2 + (0.5 + 0.5 * Math.sin(elapsedTime * 1.6)) * 0.55;
      scannerMat.opacity = (0.04 + (0.5 + 0.5 * Math.sin(elapsedTime * 1.6)) * 0.05) * (1.0 - explodeProgress * 0.7);

      // Atmospheric sparks float and fade
      sparksList.forEach((spark) => {
        spark.mesh.position.y += spark.speedY;
        spark.mesh.position.x = spark.baseX + Math.sin(elapsedTime * 0.9 + spark.seed) * 0.12;

        if (spark.mesh.position.y > spark.rangeY) {
          spark.mesh.position.y = 0.1;
        }

        const progress = spark.mesh.position.y / spark.rangeY;
        (spark.mesh.material as THREE.MeshBasicMaterial).opacity = (0.75 * (1.0 - progress)) * (1.0 - explodeProgress * 0.75);
      });

      // Fluid flows along loop pipelines
      pipelines.forEach((flow) => {
        flow.pulses.forEach((p) => {
          p.progress += p.speed;
          if (p.progress > 1.0) p.progress = 0;

          const pPos = flow.curve.getPointAt(p.progress);
          const tangent = flow.curve.getTangentAt(p.progress);

          p.mesh.position.copy(pPos);
          p.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
          p.mesh.scale.set(1.0, 1.0 + Math.sin(p.progress * Math.PI) * 0.4, 1.0);

          // Fade close to terminals
          const fade = p.progress < 0.06 ? p.progress / 0.06 : p.progress > 0.94 ? (1 - p.progress) / 0.06 : 1;
          (p.mesh.material as THREE.MeshBasicMaterial).opacity = fade;
        });
      });

      // HUD annotations mapping
      updateHUDLabels();

      renderer.render(scene, camera);
      return frameId;
    };

    const frameId = animate();

    // --- 16. THOROUGH COMPILER COMPLIANT CLEANUP ---
    return () => {
      cancelAnimationFrame(frameId);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onWindowMouseMove);
      window.removeEventListener('mouseup', onWindowMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      resizeObserver.disconnect();
      renderer.dispose();

      // Dispose procedural textures
      floorColorTex.dispose();
      brushedGoldTex.dispose();
      ventGridTex.dispose();

      // Remove fluid meshes
      pipelines.forEach((flow) => {
        flow.pulses.forEach((p) => {
          scene.remove(p.mesh);
          p.mesh.geometry.dispose();
          if (Array.isArray(p.mesh.material)) {
            p.mesh.material.forEach((m) => m.dispose());
          } else {
            p.mesh.material.dispose();
          }
        });
      });

      // Remove spark meshes
      sparksList.forEach((spark) => {
        scene.remove(spark.mesh);
        spark.mesh.geometry.dispose();
        if (Array.isArray(spark.mesh.material)) {
          spark.mesh.material.forEach((m) => m.dispose());
        } else {
          spark.mesh.material.dispose();
        }
      });

      // Remove turbine meshes
      windTurbines.forEach((wt) => {
        scene.remove(wt.group);
        wt.group.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      });

      disposables.forEach((d) => d.dispose());
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative group min-h-[520px] lg:min-h-[620px] bg-[#050608]/75 rounded-[32px] overflow-hidden border border-white/5 shadow-3xl flex flex-col justify-between">
      
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full absolute inset-0 z-10 cursor-grab active:cursor-grabbing" />

      {/* Cybernetic Holographic HUD Blueprint Annotations */}
      <div ref={hudRef} className="absolute inset-0 pointer-events-none z-20 select-none">
        
        {/* MODULE A (Left Row) */}
        <div id="hud-modA" className="absolute flex flex-col items-center opacity-0 pointer-events-none transition-all duration-300">
          <div className="px-2.5 py-1 bg-[#050608]/95 border border-[#f5c518]/70 text-[#f5c518] font-mono text-[7px] font-black tracking-[0.25em] rounded shadow-2xl backdrop-blur-md flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5c518] animate-pulse" />
            MODULE ROW A
          </div>
          <div className="w-[1px] h-7 bg-gradient-to-t from-[#f5c518]/80 to-transparent mt-0.5" />
        </div>

        {/* MODULE B (Right Row) */}
        <div id="hud-modB" className="absolute flex flex-col items-center opacity-0 pointer-events-none transition-all duration-300">
          <div className="px-2.5 py-1 bg-[#050608]/95 border border-[#f5c518]/70 text-[#f5c518] font-mono text-[7px] font-black tracking-[0.25em] rounded shadow-2xl backdrop-blur-md flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f5c518] animate-pulse" />
            MODULE ROW B
          </div>
          <div className="w-[1px] h-7 bg-gradient-to-t from-[#f5c518]/80 to-transparent mt-0.5" />
        </div>

        {/* POWER HUB A (Left) */}
        <div id="hud-hubL" className="absolute flex flex-col items-center opacity-0 pointer-events-none transition-all duration-300">
          <div className="px-2.5 py-1 bg-[#050608]/95 border border-[#f5c518]/60 text-white/90 font-mono text-[7px] font-bold tracking-[0.2em] rounded shadow-2xl backdrop-blur-md flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
            AMBER POWER HUB
          </div>
          <div className="w-[1px] h-7 bg-gradient-to-t from-[#f5c518]/60 to-transparent mt-0.5" />
        </div>

        {/* POWER HUB B (Center) */}
        <div id="hud-hubC" className="absolute flex flex-col items-center opacity-0 pointer-events-none transition-all duration-300">
          <div className="px-2.5 py-1 bg-[#050608]/95 border border-[#f5c518]/60 text-white/90 font-mono text-[7px] font-bold tracking-[0.2em] rounded shadow-2xl backdrop-blur-md flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
            TRANSFORMER LOBBY
          </div>
          <div className="w-[1px] h-7 bg-gradient-to-t from-[#f5c518]/60 to-transparent mt-0.5" />
        </div>

        {/* ACCESS CONTROL (Right) */}
        <div id="hud-accC" className="absolute flex flex-col items-center opacity-0 pointer-events-none transition-all duration-300">
          <div className="px-2.5 py-1 bg-[#050608]/95 border border-blue-500/70 text-blue-400 font-mono text-[7px] font-black tracking-[0.25em] rounded shadow-2xl backdrop-blur-md flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            NOC GATEWAY
          </div>
          <div className="w-[1px] h-7 bg-gradient-to-t from-blue-500/80 to-transparent mt-0.5" />
        </div>
      </div>

      {/* Symmetrical Monospace HUD Header */}
      <div className="absolute top-5 left-5 right-5 flex justify-between items-start text-[8px] font-mono tracking-[0.25em] text-white/35 pointer-events-none uppercase z-20 select-none">
        <div className="flex flex-col gap-1 text-left">
          <div>LOC: ALABAMA_CAMPUS // GRID_NOMINAL</div>
          <div className="text-white/20">LAT: 32.776Â° N // LON: -86.828Â° W</div>
        </div>
        <div className="flex flex-col gap-1 text-right">
          <div className="text-[#f5c518] font-bold animate-pulse">â— USDC COMPLIANT: &lt;1.15 PUE</div>
          <div className="text-white/20">CAPACITY: 22MW â†’ 120MW EXP</div>
        </div>
      </div>

      {/* Floating Toggle Button for Diagnostic Console */}
      <button
        onClick={() => setShowConsole(!showConsole)}
        className="absolute top-16 left-5 z-30 px-3 py-1.5 bg-[#f5c518] hover:bg-white text-black font-mono text-[8px] font-black tracking-widest uppercase rounded-md transition-all duration-300 shadow-[0_4px_15px_rgba(245,197,24,0.35)] pointer-events-auto cursor-pointer flex items-center gap-1.5"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
        <span>{showConsole ? 'CLOSE LOGS' : 'SYSTEM LOGS'}</span>
      </button>

      {/* Real-time Streaming Holographic Diagnostic Terminal Console (WOW FACTOR) */}
      <div 
        className={`absolute top-[98px] left-5 max-w-[280px] bg-black/85 border border-[#f5c518]/20 p-3 rounded-xl backdrop-blur-lg pointer-events-auto z-20 select-none font-mono text-[8px] tracking-wider text-white/70 flex flex-col gap-1.5 transition-all duration-300 shadow-2xl ${
          showConsole 
            ? 'opacity-100 translate-y-0 scale-100' 
            : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'
        }`}
      >
        <div className="text-[7.5px] font-bold tracking-widest text-[#f5c518] border-b border-white/10 pb-1 uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
          USDC_MAIN_TELEMETRY_LOGS:
        </div>
        <div className="flex flex-col gap-1">
          {logs.map((log, idx) => (
            <div key={idx} className={`leading-normal ${idx === logs.length - 1 ? 'text-[#f5c518] font-semibold' : 'opacity-70'}`}>
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Exploded View Toggle Switch Controls */}
      <div className="absolute bottom-6 left-5 right-5 flex justify-center gap-4 z-30 select-none">
        <button
          onClick={() => setIsExploded(false)}
          className={`px-5 py-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] rounded-sm border transition-all duration-300 cursor-pointer ${!isExploded
              ? 'bg-[#f5c518] text-black border-[#f5c518] shadow-[0_6px_20px_rgba(245,197,24,0.42)]'
              : 'bg-black/60 text-white/70 border-white/10 hover:bg-white/10'
            }`}
        >
          See Rooftop
        </button>
        <button
          onClick={() => setIsExploded(true)}
          className={`px-5 py-2.5 font-mono text-[9px] font-bold uppercase tracking-[0.2em] rounded-sm border transition-all duration-300 cursor-pointer ${isExploded
              ? 'bg-[#f5c518] text-black border-[#f5c518] shadow-[0_6px_20px_rgba(245,197,24,0.42)]'
              : 'bg-black/60 text-white/70 border-white/10 hover:bg-white/10'
            }`}
        >
          See Inside
        </button>
      </div>

      {/* Symmetrical Monospace HUD Footer */}
      <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center text-[7.5px] font-mono tracking-[0.2em] text-white/20 pointer-events-none uppercase z-20 select-none">
        <div>SYS: LIQUID_COOLED_GPU_RACKS</div>
        <div>STABLE_LOAD: ACTIVE_GRID // POWER: WIND_BACKUP</div>
      </div>
    </div>
  );
};

export default DataCenter3D;
