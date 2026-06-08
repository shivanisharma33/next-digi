"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const PartnershipHeroVisual3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let W = container.clientWidth || 800;
    let H = container.clientHeight || 600;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.04);

    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    camera.position.set(0, 0, 7.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const disposables: { dispose: () => void }[] = [];
    const registerDisposable = <T extends { dispose: () => void }>(obj: T): T => {
      if (obj && typeof obj.dispose === 'function') {
        disposables.push(obj);
      }
      return obj;
    };

    // --- LIGHTING ---
    const ambientLight = registerDisposable(new THREE.AmbientLight(0xffffff, 0.15));
    scene.add(ambientLight);

    const centerLight = registerDisposable(new THREE.PointLight(0xf5c518, 5.0, 15.0));
    centerLight.position.set(0, 0, 0);
    scene.add(centerLight);

    // Accent directional lights for highlights on edge geometries
    const keyLight = registerDisposable(new THREE.DirectionalLight(0xffffff, 1.2));
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const fillLight = registerDisposable(new THREE.DirectionalLight(0x8fb3ff, 0.8));
    fillLight.position.set(-5, -5, 2);
    scene.add(fillLight);

    // Main Group for all items
    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    // --- CENTRAL NEON GLOWING WIREFRAME SPHERES (The Core) ---
    const coreGroup = new THREE.Group();
    networkGroup.add(coreGroup);

    // Core 1: Inner dense neon yellow sphere
    const coreGeo1 = registerDisposable(new THREE.IcosahedronGeometry(0.5, 2));
    const coreMat1 = registerDisposable(new THREE.MeshBasicMaterial({
      color: 0xf5c518,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    }));
    const coreMesh1 = new THREE.Mesh(coreGeo1, coreMat1);
    coreGroup.add(coreMesh1);

    // Core 2: Inner-inner energy sphere (faint glow effect)
    const coreGeo2 = registerDisposable(new THREE.IcosahedronGeometry(0.46, 2));
    const coreMat2 = registerDisposable(new THREE.MeshBasicMaterial({
      color: 0xf5c518,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
    }));
    const coreMesh2 = new THREE.Mesh(coreGeo2, coreMat2);
    coreGroup.add(coreMesh2);

    // Core 3: Outer sparse white lattice
    const coreGeo3 = registerDisposable(new THREE.IcosahedronGeometry(0.53, 1));
    const coreMat3 = registerDisposable(new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    }));
    const coreMesh3 = new THREE.Mesh(coreGeo3, coreMat3);
    coreGroup.add(coreMesh3);

    // --- CONNECTION LINES & CUBE NODES ---
    interface NodeItem {
      dir: THREE.Vector3;
      perpDir: THREE.Vector3;
      baseDistance: number;
      speed: number;
      scale: number;
      color: number;
      cubeMesh: THREE.LineSegments;
      lineMesh: THREE.Line;
      pulseMesh: THREE.Mesh;
      pulseProgress: number;
      pulseSpeed: number;
      phase: number;
    }

    const nodes: NodeItem[] = [];
    const nodeCount = 48;

    // Shared box geometry for the floating nodes
    const boxGeo = registerDisposable(new THREE.BoxGeometry(1, 1, 1));
    // Shared geometry for pulses
    const pulseGeo = registerDisposable(new THREE.SphereGeometry(0.024, 6, 6));
    const pulseMat = registerDisposable(new THREE.MeshBasicMaterial({
      color: 0xf5c518,
      transparent: true,
      opacity: 0.95
    }));

    for (let i = 0; i < nodeCount; i++) {
      // 1. Generate uniform spherical coordinates
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      
      const dir = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi)
      ).normalize();

      // Perpendicular vector for floating lateral drift
      let perpDir = new THREE.Vector3(1, 0, 0).cross(dir);
      if (perpDir.lengthSq() < 0.01) {
        perpDir = new THREE.Vector3(0, 1, 0).cross(dir);
      }
      perpDir.normalize();

      // 2. Set spacing, density, and depth parameters
      const baseDistance = 1.6 + Math.random() * 3.4; // Radial depth
      const scale = 0.08 + Math.pow(Math.random(), 2.0) * 0.16; // Distribution with more smaller cubes

      // Yellow vs White node distribution (neon yellow & white wireframe cube nodes)
      // 40% neon yellow, 60% white
      const isYellow = Math.random() < 0.4;
      const color = isYellow ? 0xf5c518 : 0xffffff;
      const opacity = isYellow ? 0.85 : 0.55;

      // 3. Create high-premium crisp wireframe boxes using EdgesGeometry
      const edgesGeo = registerDisposable(new THREE.EdgesGeometry(boxGeo));
      const lineMat = registerDisposable(new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: opacity,
        linewidth: 1 // Note: WebGL ignores linewidth > 1 on most systems, but styling is preserved
      }));

      const cubeMesh = new THREE.LineSegments(edgesGeo, lineMat);
      cubeMesh.scale.set(scale, scale, scale);
      
      // Random initial rotation
      cubeMesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        0
      );

      // Set initial position
      const initialPos = dir.clone().multiplyScalar(baseDistance);
      cubeMesh.position.copy(initialPos);
      networkGroup.add(cubeMesh);

      // 4. Create the radial connection line from sphere core surface (at radius 0.5) to the node
      const startPos = dir.clone().multiplyScalar(0.5);
      const linePoints = [startPos, initialPos];
      const lineGeo = registerDisposable(new THREE.BufferGeometry().setFromPoints(linePoints));

      // Choose line styling: some lines are faint, some are highlighted yellow
      const isLineHighlighted = isYellow && Math.random() < 0.45;
      const lineMatInstance = registerDisposable(new THREE.LineBasicMaterial({
        color: isLineHighlighted ? 0xf5c518 : 0x444444,
        transparent: true,
        opacity: isLineHighlighted ? 0.35 : 0.12
      }));

      const lineMesh = new THREE.Line(lineGeo, lineMatInstance);
      networkGroup.add(lineMesh);

      // 5. Create active GPU data flow pulse traveling on the line
      const pulse = new THREE.Mesh(pulseGeo, pulseMat);
      pulse.position.copy(startPos);
      networkGroup.add(pulse);

      // Save complete node context
      nodes.push({
        dir,
        perpDir,
        baseDistance,
        speed: 0.4 + Math.random() * 0.8,
        scale,
        color,
        cubeMesh,
        lineMesh,
        pulseMesh: pulse,
        pulseProgress: Math.random(), // Stagger starts
        pulseSpeed: 0.003 + Math.random() * 0.006,
        phase: Math.random() * Math.PI * 2
      });
    }

    // --- ACCENT RED NODES (SYSTEM DIAGNOSTICS/AI ANOMALIES) ---
    // A premium touch representing data warning clusters in the cyberpunk network
    const redNodes: { mesh: THREE.LineSegments; phase: number; basePos: THREE.Vector3 }[] = [];
    const redNodeCount = 4;
    const redMat = registerDisposable(new THREE.LineBasicMaterial({
      color: 0xff3b30,
      transparent: true,
      opacity: 0.9
    }));
    const redIndicatorGeo = registerDisposable(new THREE.SphereGeometry(0.016, 4, 4));
    const redIndicatorMat = registerDisposable(new THREE.MeshBasicMaterial({ color: 0xff3b30 }));

    for (let i = 0; i < redNodeCount; i++) {
      const dir = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize();
      
      const distance = 2.0 + Math.random() * 2.0;
      const pos = dir.clone().multiplyScalar(distance);
      
      const redEdgesGeo = registerDisposable(new THREE.EdgesGeometry(boxGeo));
      const redMesh = new THREE.LineSegments(redEdgesGeo, redMat);
      redMesh.scale.set(0.07, 0.07, 0.07);
      redMesh.position.copy(pos);
      networkGroup.add(redMesh);

      // Tiny red dot indicator below the node
      const dot = new THREE.Mesh(redIndicatorGeo, redIndicatorMat);
      dot.position.copy(pos.clone().add(new THREE.Vector3(0, -0.15, 0)));
      networkGroup.add(dot);

      // Radial line for red node
      const redLinePoints = [dir.clone().multiplyScalar(0.5), pos];
      const redLineGeo = registerDisposable(new THREE.BufferGeometry().setFromPoints(redLinePoints));
      const redLineMat = registerDisposable(new THREE.LineBasicMaterial({
        color: 0xff3b30,
        transparent: true,
        opacity: 0.25
      }));
      const redLine = new THREE.Line(redLineGeo, redLineMat);
      networkGroup.add(redLine);

      redNodes.push({
        mesh: redMesh,
        phase: Math.random() * Math.PI,
        basePos: pos
      });
    }

    // --- TELEMETRY DATA FLOW PARTICLES (Ambient Network Dust) ---
    const dustCount = 140;
    const dustPositions = new Float32Array(dustCount * 3);
    const dustSpeeds: number[] = [];
    const dustPhases: number[] = [];
    const dustRanges: number[] = [];

    for (let i = 0; i < dustCount; i++) {
      const radius = 1.0 + Math.random() * 5.0;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      
      dustPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      dustPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      dustPositions[i * 3 + 2] = radius * Math.cos(phi);

      dustSpeeds.push(0.05 + Math.random() * 0.12);
      dustPhases.push(Math.random() * Math.PI * 2);
      dustRanges.push(0.1 + Math.random() * 0.3);
    }

    const dustGeo = registerDisposable(new THREE.BufferGeometry());
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    
    // Tiny star-like particles (mix of white and brand yellow)
    const dustMat = registerDisposable(new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    }));

    const dustPoints = new THREE.Points(dustGeo, dustMat);
    networkGroup.add(dustPoints);

    // --- INTERACTIVITY PARALLAX ---
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / W) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / H) * 2 + 1;
    };
    container.addEventListener('mousemove', handleMouseMove);

    const initialIsMobile = window.innerWidth < 768;

    // Responsive design handling
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

    // --- ANIMATION LOOP ---
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      if (!initialIsMobile) {
        frameId = requestAnimationFrame(animate);
      }
      const elapsedTime = clock.getElapsedTime();

      // 1. Mouse Parallax (Dual-action: rotating scene and shifting camera)
      target.x += (mouse.x - target.x) * 0.045;
      target.y += (mouse.y - target.y) * 0.045;

      // Group rotation (slow steady rotation + mouse influence)
      networkGroup.rotation.y = elapsedTime * 0.025 + target.x * 0.22;
      networkGroup.rotation.x = Math.sin(elapsedTime * 0.01) * 0.05 + target.y * 0.15;

      // Camera micro-movement for deep parallax layers sliding past each other
      camera.position.x = target.x * 1.6;
      camera.position.y = target.y * 1.4;
      camera.lookAt(0, 0, 0);

      // 2. Central Core Cores rotations
      coreMesh1.rotation.y = elapsedTime * 0.15;
      coreMesh1.rotation.x = elapsedTime * 0.08;

      coreMesh2.rotation.y = -elapsedTime * 0.25;
      coreMesh2.rotation.z = -elapsedTime * 0.12;

      coreMesh3.rotation.x = -elapsedTime * 0.06;
      coreMesh3.rotation.y = elapsedTime * 0.09;

      // 3. Node floating and radial line tracking
      nodes.forEach((node) => {
        // Update phase
        node.phase += 0.008 * node.speed;

        // Radial breathing: expand/contract slightly
        const distance = node.baseDistance + Math.sin(node.phase) * 0.18;
        
        // Perpendicular drift: slide sideways slightly for organic floating
        const drift = node.perpDir.clone().multiplyScalar(Math.cos(node.phase * 1.4) * 0.12);

        // Compute current 3D position
        const currentPos = node.dir.clone().multiplyScalar(distance).add(drift);

        // Update cube mesh position and self-rotation
        node.cubeMesh.position.copy(currentPos);
        node.cubeMesh.rotation.x += 0.005;
        node.cubeMesh.rotation.y += 0.008;
        node.cubeMesh.rotation.z += 0.003;

        // Dynamic Line Update (always attach to the breathing node)
        const startPos = node.dir.clone().multiplyScalar(0.5); // Starts perfectly on core sphere boundary
        const posAttribute = node.lineMesh.geometry.getAttribute('position') as THREE.BufferAttribute;
        
        posAttribute.setXYZ(0, startPos.x, startPos.y, startPos.z);
        posAttribute.setXYZ(1, currentPos.x, currentPos.y, currentPos.z);
        posAttribute.needsUpdate = true;

        // 4. Data pulse movement along the connection line
        node.pulseProgress += node.pulseSpeed;
        if (node.pulseProgress > 1.0) {
          node.pulseProgress = 0;
          // Randomize speed slightly for variety on next trip
          node.pulseSpeed = 0.004 + Math.random() * 0.006;
        }

        // Interpolate along the connection path from core boundary to floating node
        const pulsePos = new THREE.Vector3().lerpVectors(startPos, currentPos, node.pulseProgress);
        node.pulseMesh.position.copy(pulsePos);
      });

      // 5. Red Diagnostics nodes floating animation
      redNodes.forEach((node, i) => {
        node.phase += 0.012;
        const drift = Math.sin(node.phase) * 0.08;
        node.mesh.position.y = node.basePos.y + drift;
        node.mesh.rotation.x += 0.01;
        node.mesh.rotation.y -= 0.006;
      });

      // 6. Dust slow micro-breathing drift
      const positions = dustGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < dustCount; i++) {
        dustPhases[i] += 0.005;
        const offset = Math.sin(dustPhases[i]) * dustSpeeds[i] * dustRanges[i];
        
        // Add tiny oscillations in 3D
        positions[i * 3] += Math.sin(elapsedTime * 0.1 + i) * 0.0004;
        positions[i * 3 + 1] += Math.cos(elapsedTime * 0.1 + i) * 0.0004;
      }
      dustGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Clean up all hooks and GPU resources on unmount
    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      renderer.dispose();

      disposables.forEach((d) => {
        try {
          d.dispose();
        } catch (e) {
          // Silent catch for double disposes
        }
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

export default PartnershipHeroVisual3D;
