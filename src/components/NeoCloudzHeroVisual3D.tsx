"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NeoCloudzHeroVisual3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let W = container.clientWidth || 800;
    let H = container.clientHeight || 600;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.04);

    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(0, 3.2, 9.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050505, 0);

    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const disposables: { dispose: () => void }[] = [];
    const registerDisposable = (obj: any) => {
      if (obj && typeof obj.dispose === 'function') {
        disposables.push(obj);
      }
      return obj;
    };

    // Lights
    const ambientLight = registerDisposable(new THREE.AmbientLight(0xffffff, 0.1));
    scene.add(ambientLight);

    const coreLight = registerDisposable(new THREE.PointLight(0x00e878, 3.0, 12));
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // --- 1. CENTRAL LIGHT SOURCE (No central physical sphere) ---
    const coreGroup = new THREE.Group();
    mainGroup.add(coreGroup);

    // --- 2. MULTI-AXIS ROTATING NVLINK RINGS ---
    const ringsGroup = new THREE.Group();
    mainGroup.add(ringsGroup);

    interface RingConfig {
      radius: number;
      rotX: number;
      rotY: number;
      rotZ: number;
      speed: number;
      color: number;
    }

    const ringConfigs: RingConfig[] = [
      { radius: 1.8, rotX: Math.PI / 2, rotY: 0, rotZ: 0, speed: 0.35, color: 0x00e878 },
      { radius: 2.6, rotX: Math.PI / 4, rotY: Math.PI / 4, rotZ: 0, speed: -0.25, color: 0x00e878 },
      { radius: 3.4, rotX: -Math.PI / 3, rotY: -Math.PI / 6, rotZ: 0, speed: 0.18, color: 0x00e878 }
    ];

    interface RingNode {
      mesh: THREE.Mesh;
      angle: number;
      radius: number;
      speed: number;
      ringParent: THREE.Group;
    }

    const ringNodes: RingNode[] = [];
    const ringSystems: THREE.Group[] = [];

    const nodeGeo = registerDisposable(new THREE.OctahedronGeometry(0.07, 0));
    const nodeMat = registerDisposable(new THREE.MeshBasicMaterial({ color: 0x00e878 }));

    const ringLineMat = registerDisposable(new THREE.LineBasicMaterial({
      color: 0x00e878,
      transparent: true,
      opacity: 0.12
    }));

    ringConfigs.forEach((config) => {
      const ringSys = new THREE.Group();
      ringSys.rotation.set(config.rotX, config.rotY, config.rotZ);
      ringsGroup.add(ringSys);
      ringSystems.push(ringSys);

      // Create ring wire circle
      const points: THREE.Vector3[] = [];
      const steps = 64;
      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * config.radius, 0, Math.sin(theta) * config.radius));
      }
      const ringCircleGeo = new THREE.BufferGeometry().setFromPoints(points);
      const ringLine = new THREE.Line(ringCircleGeo, ringLineMat);
      ringSys.add(ringLine);

      // Add nodes along ring
      const numNodes = 4 + Math.floor(config.radius * 2);
      for (let n = 0; n < numNodes; n++) {
        const mesh = new THREE.Mesh(nodeGeo, nodeMat);
        ringSys.add(mesh);

        const initialAngle = (n / numNodes) * Math.PI * 2;

        ringNodes.push({
          mesh,
          angle: initialAngle,
          radius: config.radius,
          speed: config.speed,
          ringParent: ringSys
        });
      }
    });

    // --- 3. SYNAPSE LASERS (Pulsing connections between center and rings) ---
    const synapseMat = registerDisposable(new THREE.LineBasicMaterial({
      color: 0x00e878,
      transparent: true,
      opacity: 0.0
    }));

    const synapseLines: THREE.Line[] = [];
    const numSynapses = 6;
    for (let s = 0; s < numSynapses; s++) {
      const p = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)];
      const g = new THREE.BufferGeometry().setFromPoints(p);
      const line = new THREE.Line(g, synapseMat.clone());
      mainGroup.add(line);
      synapseLines.push(line);
    }

    // --- 4. DATA FLOW PARTICLES (Moving along the rings) ---
    interface RingParticle {
      mesh: THREE.Mesh;
      angle: number;
      radius: number;
      speed: number;
      ringParent: THREE.Group;
    }

    const ringParticles: RingParticle[] = [];
    const particleGeo = registerDisposable(new THREE.SphereGeometry(0.03, 4, 4));
    const particleMat = registerDisposable(new THREE.MeshBasicMaterial({ color: 0x00e878 }));

    ringConfigs.forEach((config, ringIdx) => {
      const ringSys = ringSystems[ringIdx];
      const numP = 8 + ringIdx * 4;
      for (let p = 0; p < numP; p++) {
        const mesh = new THREE.Mesh(particleGeo, particleMat);
        ringSys.add(mesh);

        ringParticles.push({
          mesh,
          angle: (p / numP) * Math.PI * 2 + Math.random() * 0.2,
          radius: config.radius,
          speed: config.speed * 1.4 + (Math.random() - 0.5) * 0.1,
          ringParent: ringSys
        });
      }
    });

    // --- 5. DRIFTING FLUID CLOUD (Atmospheric cooling / heat dispersion representation) ---
    const ambientGroup = new THREE.Group();
    scene.add(ambientGroup);

    const ambientGeo = registerDisposable(new THREE.SphereGeometry(0.015, 3, 3));
    const ambientMat = registerDisposable(new THREE.MeshBasicMaterial({
      color: 0x00e878,
      transparent: true,
      opacity: 0.35
    }));

    interface AmbientPoint {
      mesh: THREE.Mesh;
      velocity: THREE.Vector3;
      range: number;
    }
    const ambientPoints: AmbientPoint[] = [];

    for (let i = 0; i < 90; i++) {
      const mesh = new THREE.Mesh(ambientGeo, ambientMat);
      const range = 6.0;
      mesh.position.set(
        (Math.random() - 0.5) * range,
        (Math.random() - 0.5) * range,
        (Math.random() - 0.5) * range
      );
      ambientGroup.add(mesh);

      ambientPoints.push({
        mesh,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005,
          (Math.random() - 0.5) * 0.005
        ),
        range
      });
    }

    // --- INTERACTIVITY & SCALES ---
    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / W) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / H) * 2 + 1;
    };
    container.addEventListener('mousemove', handleMouseMove);

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
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

    // --- ANIMATION LOOP ---
    let frameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Parallax target smoothing
      target.x += (mouse.x - target.x) * 0.04;
      target.y += (mouse.y - target.y) * 0.04;

      // Group cinematic slow drift
      mainGroup.rotation.y = elapsedTime * 0.02 - target.x * 0.08;
      mainGroup.rotation.x = Math.sin(elapsedTime * 0.04) * 0.015 + target.y * 0.04;

      // Animate Ring Nodes positioning
      ringNodes.forEach((node) => {
        node.angle += node.speed * 0.018;
        const lx = Math.cos(node.angle) * node.radius;
        const lz = Math.sin(node.angle) * node.radius;
        node.mesh.position.set(lx, 0, lz);

        node.mesh.rotation.y += 0.02;
        node.mesh.rotation.x += 0.01;
      });

      // Animate Ring Data Particles
      ringParticles.forEach((p) => {
        p.angle += p.speed * 0.025;
        const lx = Math.cos(p.angle) * p.radius;
        const lz = Math.sin(p.angle) * p.radius;
        p.mesh.position.set(lx, 0, lz);
      });

      // Synapse linkages (Random firing links between random orbital nodes)
      synapseLines.forEach((line) => {
        const mat = line.material as THREE.LineBasicMaterial;

        if (Math.random() > 0.98 && mat.opacity === 0.0) {
          const nodeA = ringNodes[Math.floor(Math.random() * ringNodes.length)];
          const nodeB = ringNodes[Math.floor(Math.random() * ringNodes.length)];
          if (nodeA && nodeB && nodeA !== nodeB) {
            const posA = nodeA.mesh.position.clone().applyMatrix4(nodeA.ringParent.matrix);
            const posB = nodeB.mesh.position.clone().applyMatrix4(nodeB.ringParent.matrix);

            const posAttr = line.geometry.attributes.position;
            posAttr.setXYZ(0, posA.x, posA.y, posA.z);
            posAttr.setXYZ(1, posB.x, posB.y, posB.z);
            posAttr.needsUpdate = true;

            mat.opacity = 0.55;
          }
        }

        if (mat.opacity > 0.0) {
          mat.opacity -= 0.018;
          if (mat.opacity < 0.0) mat.opacity = 0.0;
        }
      });

      // Ambient dust drift
      ambientPoints.forEach((p) => {
        p.mesh.position.add(p.velocity);

        const bound = p.range / 2;
        if (Math.abs(p.mesh.position.x) > bound) p.mesh.position.x = -Math.sign(p.mesh.position.x) * bound;
        if (Math.abs(p.mesh.position.y) > bound) p.mesh.position.y = -Math.sign(p.mesh.position.y) * bound;
        if (Math.abs(p.mesh.position.z) > bound) p.mesh.position.z = -Math.sign(p.mesh.position.z) * bound;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      renderer.dispose();

      ambientPoints.forEach((p) => {
        scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
      });

      ringNodes.forEach((node) => {
        scene.remove(node.mesh);
      });

      ringParticles.forEach((p) => {
        scene.remove(p.mesh);
      });

      synapseLines.forEach((line) => {
        scene.remove(line);
        line.geometry.dispose();
        (line.material as THREE.Material).dispose();
      });

      disposables.forEach(d => d.dispose());

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full absolute inset-0 z-0 overflow-hidden pointer-events-none" />
  );
};

export default NeoCloudzHeroVisual3D;
