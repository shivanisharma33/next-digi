"use client";

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Cpu, Zap, Thermometer, Shield, RefreshCw, Activity, Layers } from 'lucide-react';

const EnergyFlow3DProfessional: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeMode, setActiveMode] = useState<'all' | 'power' | 'cooling'>('all');
  
  // High-performance ref to pass state smoothly to the Three.js animation loop without rebuilding the canvas
  const modeRef = useRef<'all' | 'power' | 'cooling'>('all');
  
  useEffect(() => {
    modeRef.current = activeMode;
  }, [activeMode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let W = container.clientWidth || 600;
    let H = container.clientHeight || 500;

    // ==========================================
    // THREE.JS SYSTEM CORE SETUP
    // ==========================================
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050608, 0.045);

    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(7.5, 6.0, 9.5);
    camera.lookAt(0, -0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050608, 0);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // ==========================================
    // LIGHTING SYSTEM
    // ==========================================
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const yellowLight = new THREE.PointLight(0xf5c518, 2.5, 15);
    yellowLight.position.set(0, 1.8, 0);
    scene.add(yellowLight);

    const cyanLight = new THREE.PointLight(0x00d2ff, 1.8, 12);
    cyanLight.position.set(0, -0.2, -3.5);
    scene.add(cyanLight);

    // Directional rim lighting to give shiny reflections on metallic objects
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
    rimLight.position.set(5, 8, 5);
    scene.add(rimLight);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // ==========================================
    // 1. REFLECTIVE FLOOR GRID & CIRCUITS
    // ==========================================
    // Dark Chrome Floor Plate
    const floorGeo = new THREE.BoxGeometry(11, 0.15, 11);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x090a0f,
      metalness: 0.95,
      roughness: 0.15,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -1.0;
    mainGroup.add(floor);

    // Decorative cyber grid helper (yellow / dark teal grid)
    const gridHelper = new THREE.GridHelper(11, 22, 0xf5c518, 0x111622);
    gridHelper.position.y = -0.92;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.18;
    mainGroup.add(gridHelper);

    // Floor Circuit lines (Etched neon paths connecting core to server racks)
    const circuitLinesGroup = new THREE.Group();
    mainGroup.add(circuitLinesGroup);

    const lineMatYellow = new THREE.LineBasicMaterial({ color: 0xf5c518, transparent: true, opacity: 0.4 });
    const lineMatCyan = new THREE.LineBasicMaterial({ color: 0x00d2ff, transparent: true, opacity: 0.4 });

    const createCircuitLine = (points: THREE.Vector3[], isYellow: boolean) => {
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geo, isYellow ? lineMatYellow : lineMatCyan);
      circuitLinesGroup.add(line);
    };

    // Branching floor circuits
    createCircuitLine([new THREE.Vector3(0, -0.91, 0), new THREE.Vector3(-2.2, -0.91, 1.8)], true);
    createCircuitLine([new THREE.Vector3(0, -0.91, 0), new THREE.Vector3(2.2, -0.91, 1.8)], true);
    createCircuitLine([new THREE.Vector3(-2.2, -0.91, 1.8), new THREE.Vector3(-3.2, -0.91, -1.8)], true);
    createCircuitLine([new THREE.Vector3(-2.2, -0.91, 1.8), new THREE.Vector3(-1.8, -0.91, -3.2)], true);
    createCircuitLine([new THREE.Vector3(2.2, -0.91, 1.8), new THREE.Vector3(1.8, -0.91, -3.2)], true);
    createCircuitLine([new THREE.Vector3(2.2, -0.91, 1.8), new THREE.Vector3(3.2, -0.91, -1.8)], true);
    
    createCircuitLine([new THREE.Vector3(0, -0.91, -3.5), new THREE.Vector3(-1.8, -0.91, -3.2)], false);
    createCircuitLine([new THREE.Vector3(0, -0.91, -3.5), new THREE.Vector3(1.8, -0.91, -3.2)], false);

    // ==========================================
    // 2. CENTRAL FUSION REACTOR CORE (POWER CORE)
    // ==========================================
    const genGroup = new THREE.Group();
    mainGroup.add(genGroup);

    // Core Heavy Metallic Shield Struts
    const strutGeo = new THREE.BoxGeometry(0.08, 2.2, 0.08);
    const strutMat = new THREE.MeshStandardMaterial({ color: 0x22242b, metalness: 0.9, roughness: 0.2 });
    for (let i = 0; i < 4; i++) {
      const strut = new THREE.Mesh(strutGeo, strutMat);
      const angle = (i * Math.PI) / 2;
      strut.position.set(Math.cos(angle) * 1.3, 0.1, Math.sin(angle) * 1.3);
      genGroup.add(strut);
    }

    // Glowing Inner Energy Tube (Helium-3 Plasma Core)
    const plasmaCoreGeo = new THREE.CylinderGeometry(0.35, 0.35, 1.8, 16);
    const plasmaCoreMat = new THREE.MeshBasicMaterial({
      color: 0xf5c518,
      transparent: true,
      opacity: 0.75,
      wireframe: false,
    });
    const plasmaCore = new THREE.Mesh(plasmaCoreGeo, plasmaCoreMat);
    plasmaCore.position.y = 0.1;
    genGroup.add(plasmaCore);

    // Plasma outer wireframe pulsing cage
    const plasmaCageGeo = new THREE.CylinderGeometry(0.42, 0.42, 1.82, 12, 6);
    const plasmaCageMat = new THREE.MeshBasicMaterial({
      color: 0xffe066,
      transparent: true,
      opacity: 0.25,
      wireframe: true,
    });
    const plasmaCage = new THREE.Mesh(plasmaCageGeo, plasmaCageMat);
    plasmaCage.position.y = 0.1;
    genGroup.add(plasmaCage);

    // Concentric Gyroscopic Electromagnetic Rings
    const rings: THREE.Mesh[] = [];
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xf5c518,
      emissive: 0xf5c518,
      emissiveIntensity: 0.9,
      metalness: 0.95,
      roughness: 0.1,
    });

    const ringDimensions = [0.85, 1.05, 1.25];
    ringDimensions.forEach((rad, idx) => {
      const ringGeo = new THREE.TorusGeometry(rad, 0.038, 8, 48);
      const ring = new THREE.Mesh(ringGeo, ringMat);
      // Stagger rotation starting axes
      if (idx === 0) ring.rotation.x = Math.PI / 2;
      else if (idx === 1) ring.rotation.y = Math.PI / 4;
      else ring.rotation.z = Math.PI / 3;

      ring.position.y = 0.1;
      genGroup.add(ring);
      rings.push(ring);
    });

    // Floating particles around the reactor core (Plasma Cloud)
    const cloudCount = 20;
    const cloudPoints: THREE.Mesh[] = [];
    const cloudGeo = new THREE.SphereGeometry(0.03, 6, 6);
    const cloudMat = new THREE.MeshBasicMaterial({ color: 0xf5c518, transparent: true, opacity: 0.8 });
    for (let i = 0; i < cloudCount; i++) {
      const p = new THREE.Mesh(cloudGeo, cloudMat);
      const theta = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 0.7;
      p.position.set(
        Math.cos(theta) * radius,
        -0.4 + Math.random() * 1.0,
        Math.sin(theta) * radius
      );
      genGroup.add(p);
      cloudPoints.push(p);
    }

    // ==========================================
    // 3. POWER SUBSTATIONS / DISTRIBUTION NODES
    // ==========================================
    const substationGroup = new THREE.Group();
    mainGroup.add(substationGroup);

    interface SubStation {
      mesh: THREE.Group;
      sparkMesh: THREE.Mesh;
      pointLight: THREE.PointLight;
      x: number;
      z: number;
    }
    const substations: SubStation[] = [];
    const subPositions = [
      { x: -2.2, z: 1.8 },
      { x: 2.2, z: 1.8 }
    ];

    subPositions.forEach((pos) => {
      const subNode = new THREE.Group();
      subNode.position.set(pos.x, -0.9, pos.z);
      substationGroup.add(subNode);

      // Base cylinder
      const baseGeo = new THREE.CylinderGeometry(0.4, 0.45, 0.15, 12);
      const baseMesh = new THREE.Mesh(baseGeo, strutMat);
      subNode.add(baseMesh);

      // Ribbed copper transformer winding core
      const copperGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.55, 12);
      const copperMat = new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.9, roughness: 0.25 });
      const copperCore = new THREE.Mesh(copperGeo, copperMat);
      copperCore.position.y = 0.35;
      subNode.add(copperCore);

      // Translucent high-voltage glass insulators stacked vertically
      const insulatorGeo = new THREE.TorusGeometry(0.24, 0.035, 6, 16);
      const insulatorMat = new THREE.MeshStandardMaterial({
        color: 0x00d2ff,
        transparent: true,
        opacity: 0.5,
        metalness: 0.9,
        roughness: 0.1
      });
      for (let j = 0; j < 3; j++) {
        const ins = new THREE.Mesh(insulatorGeo, insulatorMat);
        ins.rotation.x = Math.PI / 2;
        ins.position.y = 0.2 + j * 0.15;
        subNode.add(ins);
      }

      // Terminal ball emitter on top
      const terminalGeo = new THREE.SphereGeometry(0.12, 12, 12);
      const terminalMat = new THREE.MeshStandardMaterial({ color: 0xe5b810, metalness: 0.95, roughness: 0.1 });
      const terminal = new THREE.Mesh(terminalGeo, terminalMat);
      terminal.position.y = 0.72;
      subNode.add(terminal);

      // Live electrical spark glow mesh
      const sparkGeo = new THREE.SphereGeometry(0.16, 8, 8);
      const sparkMat = new THREE.MeshBasicMaterial({ color: 0xffea00, transparent: true, opacity: 0.6 });
      const spark = new THREE.Mesh(sparkGeo, sparkMat);
      spark.position.y = 0.72;
      subNode.add(spark);

      // Individual spark light emitter
      const sparkLight = new THREE.PointLight(0xf5c518, 1.2, 3);
      sparkLight.position.set(pos.x, -0.18, pos.z);
      scene.add(sparkLight);

      substations.push({
        mesh: subNode,
        sparkMesh: spark,
        pointLight: sparkLight,
        x: pos.x,
        z: pos.z
      });
    });

    // ==========================================
    // 4. COOLING ARCHITECTURE UNIT (CRYO-CHILLER)
    // ==========================================
    const chillerNode = new THREE.Group();
    chillerNode.position.set(0, -0.9, -3.5);
    mainGroup.add(chillerNode);

    // Chiller Solid Dark Base
    const chillerBaseGeo = new THREE.BoxGeometry(1.6, 0.25, 1.0);
    const chillerBase = new THREE.Mesh(chillerBaseGeo, strutMat);
    chillerNode.add(chillerBase);

    // Glass Cryogenic coolant cylinder reservoir
    const coolantChamberGeo = new THREE.CylinderGeometry(0.24, 0.24, 1.0, 16);
    const coolantChamberMat = new THREE.MeshStandardMaterial({
      color: 0x00d2ff,
      transparent: true,
      opacity: 0.2,
      metalness: 0.9,
      roughness: 0.05
    });
    const coolantChamber = new THREE.Mesh(coolantChamberGeo, coolantChamberMat);
    coolantChamber.position.set(0, 0.6, 0);
    chillerNode.add(coolantChamber);

    // Cyan Neon Fluid inside reservoir
    const fluidGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.9, 12);
    const fluidMat = new THREE.MeshBasicMaterial({
      color: 0x00d2ff,
      transparent: true,
      opacity: 0.7
    });
    const coolantFluid = new THREE.Mesh(fluidGeo, fluidMat);
    coolantFluid.position.set(0, 0.6, 0);
    chillerNode.add(coolantFluid);

    // Dual Chilling Fans structures (Revolving blades inside housing)
    const fans: THREE.Group[] = [];
    const fanHousingGeo = new THREE.TorusGeometry(0.25, 0.03, 6, 24);
    const fanHousingMat = new THREE.MeshStandardMaterial({ color: 0x1a1c22, metalness: 0.9, roughness: 0.3 });

    for (let f = 0; f < 2; f++) {
      const fanGroup = new THREE.Group();
      const xOffset = f === 0 ? -0.55 : 0.55;
      fanGroup.position.set(xOffset, 0.25, 0);
      chillerNode.add(fanGroup);

      // Housing Ring
      const ringMesh = new THREE.Mesh(fanHousingGeo, fanHousingMat);
      ringMesh.rotation.x = Math.PI / 2;
      fanGroup.add(ringMesh);

      // Spinning Blade Hub
      const bladeHub = new THREE.Group();
      fanGroup.add(bladeHub);

      const bladeGeo = new THREE.BoxGeometry(0.04, 0.015, 0.2);
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0x0b0d10, metalness: 0.9, roughness: 0.4 });
      for (let b = 0; b < 4; b++) {
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.rotation.y = (b * Math.PI) / 2;
        blade.rotation.z = 0.2; // tilted pitch
        bladeHub.add(blade);
      }

      fans.push(bladeHub);
    }

    // ==========================================
    // 5. AI DATA CENTER INFRASTRUCTURE (RACKS)
    // ==========================================
    const rackGroup = new THREE.Group();
    mainGroup.add(rackGroup);

    interface ComputeRack {
      mesh: THREE.Group;
      leds: THREE.Mesh[];
      heatSinks: THREE.Mesh[];
      x: number;
      z: number;
    }
    const racks: ComputeRack[] = [];

    const rackPositions = [
      { x: -3.2, z: -1.8 },
      { x: -1.8, z: -3.2 },
      { x: 1.8, z: -3.2 },
      { x: 3.2, z: -1.8 },
    ];

    rackPositions.forEach((pos, idx) => {
      const rackNode = new THREE.Group();
      rackNode.position.set(pos.x, -0.05, pos.z);
      // Face inward toward reactor
      const angle = Math.atan2(-pos.z, -pos.x);
      rackNode.rotation.y = angle + Math.PI / 2;
      rackGroup.add(rackNode);

      // Dark transparent glass computer chassis cabinet
      const frameGeo = new THREE.BoxGeometry(0.8, 1.8, 0.8);
      const frameMat = new THREE.MeshStandardMaterial({
        color: 0x08090b,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.45
      });
      const cabinet = new THREE.Mesh(frameGeo, frameMat);
      rackNode.add(cabinet);

      // Cyber golden framing trim
      const borderGeo = new THREE.BoxGeometry(0.82, 0.04, 0.82);
      const borderMat = new THREE.MeshStandardMaterial({
        color: 0xf5c518,
        emissive: 0xf5c518,
        emissiveIntensity: 0.35,
        metalness: 0.9
      });
      const topBorder = new THREE.Mesh(borderGeo, borderMat);
      topBorder.position.y = 0.91;
      rackNode.add(topBorder);

      const bottomBorder = new THREE.Mesh(borderGeo, borderMat);
      bottomBorder.position.y = -0.91;
      rackNode.add(bottomBorder);

      // Inside: Stacking horizontal server blades (Compute Node Boards)
      const bladeGeo = new THREE.BoxGeometry(0.72, 0.08, 0.72);
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0x181a20, metalness: 0.85, roughness: 0.25 });
      const heatSinkGeo = new THREE.BoxGeometry(0.12, 0.04, 0.12);
      const heatSinkMat = new THREE.MeshStandardMaterial({ color: 0xf5c518, emissive: 0xf5c518, emissiveIntensity: 0.4 });
      
      const leds: THREE.Mesh[] = [];
      const heatSinks: THREE.Mesh[] = [];

      const ledGeo = new THREE.BoxGeometry(0.035, 0.02, 0.035);
      const ledActiveMat = new THREE.MeshBasicMaterial({ color: 0x39ff14 });
      const ledProcessingMat = new THREE.MeshBasicMaterial({ color: 0x00ffff });
      const ledPowerMat = new THREE.MeshBasicMaterial({ color: 0xffe600 });

      for (let s = 0; s < 8; s++) {
        const yPos = -0.7 + s * 0.2;
        const blade = new THREE.Mesh(bladeGeo, bladeMat);
        blade.position.y = yPos;
        rackNode.add(blade);

        // Blinking indicator lights on server front plate
        for (let l = 0; l < 3; l++) {
          const randMat = l === 0 ? ledActiveMat : l === 1 ? ledProcessingMat : ledPowerMat;
          const led = new THREE.Mesh(ledGeo, randMat);
          // Position relative to rack face
          led.position.set(-0.25 + l * 0.1, yPos + 0.02, 0.37);
          rackNode.add(led);
          leds.push(led);
        }

        // Miniature Server Heat Sinks at the back
        const hs = new THREE.Mesh(heatSinkGeo, heatSinkMat);
        hs.position.set(0.22, yPos + 0.04, -0.2);
        rackNode.add(hs);
        heatSinks.push(hs);
      }

      racks.push({
        mesh: rackNode,
        leds,
        heatSinks,
        x: pos.x,
        z: pos.z
      });
    });

    // ==========================================
    // 6. CURVED 3D GLOW PIPELINES (SPLINE PATHS)
    // ==========================================
    const pipelineGroup = new THREE.Group();
    mainGroup.add(pipelineGroup);

    interface SplineFlow {
      curve: THREE.CatmullRomCurve3;
      tube: THREE.Mesh;
      isEnergy: boolean;
      particles: {
        mesh: THREE.Mesh;
        progress: number;
        speed: number;
      }[];
    }
    const splineFlows: SplineFlow[] = [];

    // Define Curved Spline Pathways in 3D Space
    // A. Power Line Left: Core -> Substation 1 -> Rack 1 & 2
    const powerCurveLeftPoints = [
      new THREE.Vector3(0, 0.2, 0),
      new THREE.Vector3(-1.0, 0.6, 0.9),
      new THREE.Vector3(-2.2, -0.18, 1.8), // Substation 1 top
      new THREE.Vector3(-2.6, 0.5, 0.3),
      new THREE.Vector3(-3.2, 0.8, -1.8)  // Rack 1 top
    ];
    const powerCurveLeft = new THREE.CatmullRomCurve3(powerCurveLeftPoints);

    // B. Power Line Right: Core -> Substation 2 -> Rack 3 & 4
    const powerCurveRightPoints = [
      new THREE.Vector3(0, 0.2, 0),
      new THREE.Vector3(1.0, 0.6, 0.9),
      new THREE.Vector3(2.2, -0.18, 1.8), // Substation 2 top
      new THREE.Vector3(2.6, 0.5, 0.3),
      new THREE.Vector3(3.2, 0.8, -1.8)   // Rack 4 top
    ];
    const powerCurveRight = new THREE.CatmullRomCurve3(powerCurveRightPoints);

    // C. Cooling Line Left: Chiller -> Rack 2
    const coolingCurveLeftPoints = [
      new THREE.Vector3(0, -0.3, -3.5), // Chiller top
      new THREE.Vector3(-1.0, 0.2, -3.4),
      new THREE.Vector3(-1.8, 0.8, -3.2) // Rack 2 top
    ];
    const coolingCurveLeft = new THREE.CatmullRomCurve3(coolingCurveLeftPoints);

    // D. Cooling Line Right: Chiller -> Rack 3
    const coolingCurveRightPoints = [
      new THREE.Vector3(0, -0.3, -3.5), // Chiller top
      new THREE.Vector3(1.0, 0.2, -3.4),
      new THREE.Vector3(1.8, 0.8, -3.2)  // Rack 3 top
    ];
    const coolingCurveRight = new THREE.CatmullRomCurve3(coolingCurveRightPoints);

    const curvesList = [
      { curve: powerCurveLeft, isEnergy: true },
      { curve: powerCurveRight, isEnergy: true },
      { curve: coolingCurveLeft, isEnergy: false },
      { curve: coolingCurveRight, isEnergy: false }
    ];

    // Build physical neon glass conduit tubes around curves
    const pipeMatEnergy = new THREE.MeshStandardMaterial({
      color: 0xf5c518,
      transparent: true,
      opacity: 0.18,
      emissive: 0xf5c518,
      emissiveIntensity: 0.2,
      metalness: 0.9,
      roughness: 0.1
    });

    const pipeMatCooling = new THREE.MeshStandardMaterial({
      color: 0x00d2ff,
      transparent: true,
      opacity: 0.18,
      emissive: 0x00d2ff,
      emissiveIntensity: 0.25,
      metalness: 0.9,
      roughness: 0.1
    });

    const particleGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const particleMatEnergy = new THREE.MeshBasicMaterial({ color: 0xf5c518 });
    const particleMatCooling = new THREE.MeshBasicMaterial({ color: 0x00d2ff });

    curvesList.forEach((cItem) => {
      const tubeGeo = new THREE.TubeGeometry(cItem.curve, 40, 0.055, 8, false);
      const tubeMesh = new THREE.Mesh(tubeGeo, cItem.isEnergy ? pipeMatEnergy : pipeMatCooling);
      pipelineGroup.add(tubeMesh);

      // Create Flowing Sphere Particles along the spline curves
      const flowParticles: { mesh: THREE.Mesh; progress: number; speed: number; }[] = [];
      const count = cItem.isEnergy ? 4 : 3;

      for (let p = 0; p < count; p++) {
        const particle = new THREE.Mesh(
          particleGeo,
          cItem.isEnergy ? particleMatEnergy : particleMatCooling
        );
        scene.add(particle);

        flowParticles.push({
          mesh: particle,
          progress: p / count, // stagger starting position
          speed: 0.003 + Math.random() * 0.004
        });
      }

      splineFlows.push({
        curve: cItem.curve,
        tube: tubeMesh,
        isEnergy: cItem.isEnergy,
        particles: flowParticles
      });
    });

    // ==========================================
    // 7. FLOATING GLOBAL TELEMETRY / POINT CLOUD
    // ==========================================
    const telemetryGroup = new THREE.Group();
    mainGroup.add(telemetryGroup);

    const pointsCount = 70;
    const pointsGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pointsCount * 3);
    const colors = new Float32Array(pointsCount * 3);

    for (let i = 0; i < pointsCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 2.2 + Math.random() * 2.2;
      
      positions[i * 3] = Math.cos(theta) * radius;
      positions[i * 3 + 1] = -0.4 + Math.random() * 2.2;
      positions[i * 3 + 2] = Math.sin(theta) * radius;

      const isYellow = Math.random() > 0.45;
      colors[i * 3] = isYellow ? 0.96 : 0.0;
      colors[i * 3 + 1] = isYellow ? 0.77 : 0.82;
      colors[i * 3 + 2] = isYellow ? 0.09 : 1.0;
    }

    pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointsMat = new THREE.PointsMaterial({
      size: 0.07,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });

    const dataPoints = new THREE.Points(pointsGeo, pointsMat);
    telemetryGroup.add(dataPoints);

    // ==========================================
    // INTERACTIVE MOUSE MOVEMENT PANS
    // ==========================================
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / W) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / H) * 2 + 1;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      W = container.clientWidth;
      H = container.clientHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener('resize', handleResize);

    // ==========================================
    // ANIMATION LOOP (REAL-TIME ENGINE)
    // ==========================================
    let clock = new THREE.Clock();

    // Setup linear interpolation multipliers for mode transitions
    let currentPowerMultiplier = 1.0;
    let currentCoolingMultiplier = 1.0;

    const animate = () => {
      const frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Lerp transition targets based on Interactive Mode state
      const targetPower = modeRef.current === 'power' ? 2.5 : modeRef.current === 'cooling' ? 0.15 : 1.0;
      const targetCooling = modeRef.current === 'cooling' ? 2.5 : modeRef.current === 'power' ? 0.15 : 1.0;

      currentPowerMultiplier += (targetPower - currentPowerMultiplier) * 0.06;
      currentCoolingMultiplier += (targetCooling - currentCoolingMultiplier) * 0.06;

      // Mouse-move camera tracking
      target.x += (mouse.x - target.x) * 0.05;
      target.y += (mouse.y - target.y) * 0.05;

      mainGroup.rotation.y = elapsedTime * 0.035 + target.x * 0.25;
      mainGroup.rotation.x = Math.sin(elapsedTime * 0.15) * 0.03 + target.y * 0.12;

      // 1. Central Reactor Core Animation
      // Concentric rings rotate on separate axes
      rings.forEach((ring, idx) => {
        const speedMultiplier = (idx + 1) * 0.18 * currentPowerMultiplier;
        if (idx === 0) ring.rotation.z = elapsedTime * speedMultiplier;
        else if (idx === 1) ring.rotation.x = elapsedTime * speedMultiplier;
        else ring.rotation.y = elapsedTime * speedMultiplier;
        
        // Floating ring height oscillation
        ring.position.y = 0.1 + Math.sin(elapsedTime * 1.5 + idx) * 0.04;
      });

      // Plasma Core pulse intensity
      const pulseScale = 0.95 + Math.sin(elapsedTime * 3.5 * currentPowerMultiplier) * 0.05;
      plasmaCore.scale.set(pulseScale, 1.0, pulseScale);
      plasmaCoreMat.opacity = 0.65 + Math.sin(elapsedTime * 4.0 * currentPowerMultiplier) * 0.12;

      // Core Plasma particle cloud
      cloudPoints.forEach((p, idx) => {
        p.position.y += Math.sin(elapsedTime * 2.0 + idx) * 0.0018 * currentPowerMultiplier;
        p.rotation.y += 0.01 * currentPowerMultiplier;
      });

      // 2. Chiller Refrigerant and Fan Blade Revolutions
      const fanSpeed = 0.035 + 0.18 * currentCoolingMultiplier;
      fans.forEach((fan) => {
        fan.rotation.y += fanSpeed;
      });

      // pulsing cool fluid chamber size
      const fluidScale = 0.96 + Math.sin(elapsedTime * 2.5 * currentCoolingMultiplier) * 0.04;
      coolantFluid.scale.set(fluidScale, 1.0, fluidScale);
      fluidMat.opacity = 0.5 + Math.sin(elapsedTime * 3.0 * currentCoolingMultiplier) * 0.2;

      // 3. Substation Insulator Sparks and PointLight Flashing
      substations.forEach((sub, idx) => {
        // High voltage flashing
        const flashVal = Math.random();
        if (flashVal > 0.94) {
          const intensity = (1.5 + Math.random() * 2.5) * currentPowerMultiplier;
          sub.pointLight.intensity = intensity;
          sub.sparkMesh.scale.setScalar(1.2 + Math.random() * 0.6);
          sub.sparkMesh.visible = true;
        } else {
          sub.pointLight.intensity += (0.4 * currentPowerMultiplier - sub.pointLight.intensity) * 0.1;
          sub.sparkMesh.scale.setScalar(1.0);
          if (flashVal < 0.6) sub.sparkMesh.visible = false;
        }
      });

      // 4. Server Matrix Blinking LEDs and Heatsink Loads
      racks.forEach((rack) => {
        rack.leds.forEach((led) => {
          // Rapid random blinking to simulate compute loads
          if (Math.random() > 0.97) {
            led.visible = !led.visible;
          }
        });

        // Heat sinks throb based on power multiplier
        rack.heatSinks.forEach((hs, idx) => {
          const thermalThrob = 1.0 + Math.sin(elapsedTime * 4.5 + idx) * 0.15 * currentPowerMultiplier;
          hs.scale.setScalar(thermalThrob);
        });
      });

      // 5. Spline Particles Moving Streams
      splineFlows.forEach((flow) => {
        // Conduit brightness transition
        const targetOpacity = flow.isEnergy 
          ? (modeRef.current === 'power' ? 0.65 : modeRef.current === 'cooling' ? 0.06 : 0.2)
          : (modeRef.current === 'cooling' ? 0.75 : modeRef.current === 'power' ? 0.06 : 0.2);
        (flow.tube.material as THREE.Material).opacity += (targetOpacity - (flow.tube.material as THREE.Material).opacity) * 0.08;

        const speedMult = flow.isEnergy ? currentPowerMultiplier : currentCoolingMultiplier;

        flow.particles.forEach((p) => {
          p.progress += p.speed * speedMult;
          if (p.progress > 1.0) {
            p.progress = 0.0;
          }

          // Fetch coordinate point along 3D bezier path
          const pos = flow.curve.getPointAt(p.progress);
          
          // Add small bouncing wave animation
          const waveHeight = Math.sin(p.progress * Math.PI) * 0.08;
          p.mesh.position.set(pos.x, pos.y + waveHeight, pos.z);

          // Breathe scale size as it flows
          const scale = (0.55 + Math.sin(p.progress * Math.PI) * 0.8) * (flow.isEnergy ? Math.min(2.0, currentPowerMultiplier) : Math.min(2.0, currentCoolingMultiplier));
          p.mesh.scale.setScalar(scale);
        });
      });

      // 6. Floating Global telemetry particles
      const pointsArr = pointsGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < pointsCount; i++) {
        // Slow float
        pointsArr[i * 3 + 1] += Math.sin(elapsedTime * 0.6 + i) * 0.0012;
        
        // Slow orbit rotation
        const x = pointsArr[i * 3];
        const z = pointsArr[i * 3 + 2];
        const rotTheta = 0.0006 * (i % 2 === 0 ? 1 : -1) * currentPowerMultiplier;
        pointsArr[i * 3] = x * Math.cos(rotTheta) - z * Math.sin(rotTheta);
        pointsArr[i * 3 + 2] = x * Math.sin(rotTheta) + z * Math.cos(rotTheta);
      }
      pointsGeo.attributes.position.needsUpdate = true;

      // Dynamically adapt main point lights based on transitions
      yellowLight.intensity = 1.0 + 3.5 * currentPowerMultiplier;
      cyanLight.intensity = 0.6 + 3.0 * currentCoolingMultiplier;

      renderer.render(scene, camera);
      return frameId;
    };

    const frameId = animate();

    // Clean up
    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      
      // Clean up spline particles from global scene
      splineFlows.forEach((flow) => {
        flow.particles.forEach((p) => {
          scene.remove(p.mesh);
          p.mesh.geometry.dispose();
          if (Array.isArray(p.mesh.material)) {
            p.mesh.material.forEach((m) => m.dispose());
          } else {
            p.mesh.material.dispose();
          }
        });
      });

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Mock Diagnostic Values that fluctuate in real time
  const [metrics, setMetrics] = useState({
    coreTemp: 34.6,
    loadLevel: 82.4,
    flowRate: 124.0,
    outputPower: 60.0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        const mult = activeMode === 'power' ? 1.4 : activeMode === 'cooling' ? 0.7 : 1.0;
        const coolMult = activeMode === 'cooling' ? 1.5 : activeMode === 'power' ? 0.5 : 1.0;
        
        return {
          coreTemp: parseFloat((34.0 + Math.random() * 1.5 + (activeMode === 'power' ? 5.2 : activeMode === 'cooling' ? -4.5 : 0)).toFixed(1)),
          loadLevel: parseFloat((82.0 + Math.random() * 2.0 + (activeMode === 'power' ? 12.0 : -8.0)).toFixed(1)),
          flowRate: parseFloat((124.0 + Math.random() * 4.0 * coolMult).toFixed(1)),
          outputPower: parseFloat((60.0 + Math.random() * 2.0 * mult).toFixed(1))
        };
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [activeMode]);

  return (
    <div className="w-full h-full relative group">
      {/* 3D WebGL Canvas container */}
      <div ref={containerRef} className="w-full h-full min-h-[420px] md:min-h-[520px] relative overflow-hidden" />

      {/* Cyberpunk Telemetry HUD Corners */}
      <div className="absolute top-3 left-3 border-t-2 border-l-2 border-[#f5c518]/30 w-10 h-10 pointer-events-none transition-all group-hover:border-[#f5c518]/50" />
      <div className="absolute top-3 right-3 border-t-2 border-r-2 border-[#f5c518]/30 w-10 h-10 pointer-events-none transition-all group-hover:border-[#f5c518]/50" />
      <div className="absolute bottom-3 left-3 border-b-2 border-l-2 border-[#f5c518]/30 w-10 h-10 pointer-events-none transition-all group-hover:border-[#f5c518]/50" />
      <div className="absolute bottom-3 right-3 border-b-2 border-r-2 border-[#f5c518]/30 w-10 h-10 pointer-events-none transition-all group-hover:border-[#f5c518]/50" />

      {/* Top Banner Text Telemetries */}
      <div className="absolute top-5 left-5 right-5 flex justify-between items-center text-[8px] md:text-[9px] font-mono tracking-widest text-white/45 pointer-events-none uppercase">
        <div className="flex items-center gap-2">
          <Activity size={10} className="text-[#f5c518] animate-pulse" />
          <span>GRID_CORE: ONLINE // TEMP: {metrics.coreTemp}Â°C</span>
        </div>
        <div className="hidden sm:block">
          FLOW_VELOCITY: {metrics.flowRate} L/S // MATRIX: ACTIVE
        </div>
        <div>
          SYS_VOLTAGE: 12.4KV // OUT: {metrics.outputPower}MW
        </div>
      </div>

      {/* Interactive Cyber HUD Tabs Selector (Left Column Overlay) */}
      <div className="absolute left-6 top-16 bottom-16 w-36 md:w-44 flex flex-col justify-center gap-3.5 z-20 pointer-events-auto">
        <div className="text-[7.5px] font-mono uppercase tracking-[0.25em] text-white/30 mb-1 ml-1 flex items-center gap-1.5 pointer-events-none">
          <Layers size={9} className="text-[#f5c518]" />
          <span>Interactive Grid</span>
        </div>

        {/* Tab 1: All Systems */}
        <button
          onClick={() => setActiveMode('all')}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border font-mono text-[9px] md:text-[10px] tracking-wider uppercase text-left transition-all backdrop-blur-md cursor-pointer ${
            activeMode === 'all'
              ? 'border-[#f5c518] bg-[#f5c518]/10 text-white shadow-[0_0_20px_rgba(245,197,24,0.15)] font-bold'
              : 'border-white/5 bg-[#08090c]/40 text-white/60 hover:border-white/20 hover:text-white'
          }`}
        >
          <RefreshCw size={11} className={activeMode === 'all' ? 'text-[#f5c518] animate-spin' : 'text-white/40'} style={{ animationDuration: '6s' }} />
          <div className="flex-1">
            <span className="block font-bold">ALL SYSTEMS</span>
            <span className="text-[6.5px] text-white/40 block leading-tight mt-0.5">Dual Mode Matrix</span>
          </div>
        </button>

        {/* Tab 2: Power Grid */}
        <button
          onClick={() => setActiveMode('power')}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border font-mono text-[9px] md:text-[10px] tracking-wider uppercase text-left transition-all backdrop-blur-md cursor-pointer ${
            activeMode === 'power'
              ? 'border-[#f5c518] bg-[#f5c518]/15 text-[#f5c518] shadow-[0_0_25px_rgba(245,197,24,0.25)] font-bold'
              : 'border-white/5 bg-[#08090c]/40 text-white/60 hover:border-white/20 hover:text-white'
          }`}
        >
          <Zap size={11} className={activeMode === 'power' ? 'text-[#f5c518] animate-bounce' : 'text-white/40'} />
          <div className="flex-1">
            <span className="block font-bold">POWER GRID</span>
            <span className="text-[6.5px] text-white/40 block leading-tight mt-0.5">Fusion Discharge</span>
          </div>
        </button>

        {/* Tab 3: Cooling Loop */}
        <button
          onClick={() => setActiveMode('cooling')}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border font-mono text-[9px] md:text-[10px] tracking-wider uppercase text-left transition-all backdrop-blur-md cursor-pointer ${
            activeMode === 'cooling'
              ? 'border-[#00d2ff] bg-[#00d2ff]/15 text-[#00d2ff] shadow-[0_0_25px_rgba(0,210,255,0.25)] font-bold'
              : 'border-white/5 bg-[#08090c]/40 text-white/60 hover:border-white/20 hover:text-white'
          }`}
        >
          <Thermometer size={11} className={activeMode === 'cooling' ? 'text-[#00d2ff] animate-pulse' : 'text-white/40'} />
          <div className="flex-1">
            <span className="block font-bold">COOLING LOOP</span>
            <span className="text-[6.5px] text-white/40 block leading-tight mt-0.5">Cryo Re-circulation</span>
          </div>
        </button>
      </div>

      {/* Right Column: Live Scientific Diagnostic Telemetry Readings */}
      <div className="absolute right-6 top-16 bottom-16 w-36 md:w-44 flex flex-col justify-center gap-3.5 z-20 pointer-events-none text-right font-mono">
        <div className="text-[7.5px] uppercase tracking-[0.25em] text-white/30 mb-1 mr-1 flex items-center justify-end gap-1.5">
          <span>Diagnostic HUD</span>
          <Cpu size={9} className="text-[#f5c518]" />
        </div>

        {/* Diagnostic Card 1: Core Temp */}
        <div className="p-3 bg-[#08090c]/50 border border-white/5 rounded-lg backdrop-blur-sm">
          <div className="text-[7px] text-white/40 uppercase tracking-widest leading-none mb-1">Reactor Temp</div>
          <div className="text-sm md:text-base font-bold text-white leading-none">
            {metrics.coreTemp}Â°C
          </div>
          {/* Simulated tiny bar */}
          <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${activeMode === 'power' ? 'bg-[#f5c518]' : 'bg-[#00d2ff]'}`}
              style={{ width: `${Math.min(100, (metrics.coreTemp / 50) * 100)}%` }}
            />
          </div>
        </div>

        {/* Diagnostic Card 2: System Load */}
        <div className="p-3 bg-[#08090c]/50 border border-white/5 rounded-lg backdrop-blur-sm">
          <div className="text-[7px] text-white/40 uppercase tracking-widest leading-none mb-1">Compute Load</div>
          <div className="text-sm md:text-base font-bold text-white leading-none">
            {metrics.loadLevel}%
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-green-400 transition-all duration-500"
              style={{ width: `${metrics.loadLevel}%` }}
            />
          </div>
        </div>

        {/* Diagnostic Card 3: Outlet capacity */}
        <div className="p-3 bg-[#08090c]/50 border border-white/5 rounded-lg backdrop-blur-sm">
          <div className="text-[7px] text-white/40 uppercase tracking-widest leading-none mb-1">Megawatts Active</div>
          <div className="text-sm md:text-base font-bold text-[#f5c518] leading-none animate-pulse">
            {metrics.outputPower} MW
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-[#f5c518] transition-all duration-500"
              style={{ width: `${(metrics.outputPower / 80) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Center Interactive Hover Tooltips Pointer Overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
        <div className="absolute top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-auto cursor-help group/core text-center">
          <div className="w-6 h-6 rounded-full border border-[#f5c518] bg-[#f5c518]/10 flex items-center justify-center animate-ping pointer-events-none" />
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#0c0d11]/90 border border-[#f5c518]/40 px-2 py-1 rounded text-[7px] font-mono text-white/95 uppercase whitespace-nowrap tracking-wider shadow-lg">
            <span className="font-bold text-[#f5c518] block">FUSION CORE</span>
            Helium-3 Matrix // Active
          </div>
        </div>
      </div>

      {/* Footer Branding Telemetry */}
      <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center text-[7.5px] font-mono tracking-widest text-white/25 pointer-events-none uppercase">
        <div>FLOW_MATRIX: ONLINE // v10.05</div>
        <div>[COORD_X: 45.9221 // COORD_Z: -12.3912]</div>
      </div>
    </div>
  );
};

export default EnergyFlow3DProfessional;
