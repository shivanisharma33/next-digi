import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MissionVisionHeroVisual3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let W = container.clientWidth || 800;
    let H = container.clientHeight || 600;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.08);

    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    // Camera positioned to view the dome on the bottom right beautifully
    camera.position.set(0, 1.0, 7.2);
    camera.lookAt(0, -0.2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

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

    // Helper: Create a glowing particle canvas texture
    const createGlowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d')!;

      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.12, 'rgba(255, 235, 100, 0.95)');
      gradient.addColorStop(0.28, 'rgba(245, 197, 24, 0.7)');
      gradient.addColorStop(0.55, 'rgba(245, 197, 24, 0.15)');
      gradient.addColorStop(1, 'rgba(245, 197, 24, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);

      const tex = new THREE.CanvasTexture(canvas);
      return registerDisposable(tex);
    };

    // Helper: Create a large lens flare / glare canvas texture
    const createGlareTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d')!;

      const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.1, 'rgba(255, 230, 100, 0.85)');
      gradient.addColorStop(0.3, 'rgba(245, 197, 24, 0.35)');
      gradient.addColorStop(0.6, 'rgba(245, 197, 24, 0.08)');
      gradient.addColorStop(1, 'rgba(245, 197, 24, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 256, 256);

      const tex = new THREE.CanvasTexture(canvas);
      return registerDisposable(tex);
    };

    const glowTexture = createGlowTexture();
    const glareTexture = createGlareTexture();

    // Lights
    const ambientLight = registerDisposable(new THREE.AmbientLight(0xffffff, 0.05));
    scene.add(ambientLight);

    // Warm orange/yellow light source at the hot-spot to illuminate the mesh
    const pointLight = registerDisposable(new THREE.PointLight(0xf5c518, 5.0, 18, 1.2));
    // Placed at the top-right highlight area of the smaller sphere
    pointLight.position.set(0.7, 0.8, 1.5);
    scene.add(pointLight);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // The rotating Sphere Dome Group
    const sphereGroup = new THREE.Group();
    // Positioned down and slightly left in the expanded absolute container to avoid cutting
    sphereGroup.position.set(0.8, -1.8, 0.3);
    sphereGroup.rotation.x = 0.22;
    sphereGroup.rotation.z = -0.35;
    mainGroup.add(sphereGroup);

    // --- 1. SPHERE GRID SETUP ---
    const radius = 3.0;
    const lats = 28;
    const lons = 28;
    const gridPoints: THREE.Vector3[] = [];
    const baseGridPoints: THREE.Vector3[] = []; // Store originals for wave offset calculations

    // Generate vertices in spherical coordinates
    for (let i = 0; i <= lats; i++) {
      const theta = (i / lats) * Math.PI;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let j = 0; j <= lons; j++) {
        const phi = (j / lons) * Math.PI * 2;
        const sinPhi = Math.sin(phi);
        const cosPhi = Math.cos(phi);

        const x = radius * sinTheta * cosPhi;
        const y = radius * cosTheta;
        const z = radius * sinTheta * sinPhi;

        gridPoints.push(new THREE.Vector3(x, y, z));
        baseGridPoints.push(new THREE.Vector3(x, y, z));
      }
    }

    // Generate grid line segment indices
    const lineIndices: number[] = [];
    for (let i = 0; i < lats; i++) {
      for (let j = 0; j < lons; j++) {
        const idx = i * (lons + 1) + j;
        const idxEast = idx + 1;
        const idxSouth = (i + 1) * (lons + 1) + j;

        // Horizontal latitude line
        lineIndices.push(idx, idxEast);
        // Vertical longitude line
        lineIndices.push(idx, idxSouth);
      }
    }

    // Create the geometry for the sphere grid lines
    const gridGeometry = registerDisposable(new THREE.BufferGeometry());
    const gridVertices = new Float32Array(gridPoints.length * 3);
    gridPoints.forEach((pt, k) => {
      gridVertices[k * 3] = pt.x;
      gridVertices[k * 3 + 1] = pt.y;
      gridVertices[k * 3 + 2] = pt.z;
    });
    gridGeometry.setAttribute('position', new THREE.BufferAttribute(gridVertices, 3));
    gridGeometry.setIndex(lineIndices);

    // Beautiful thin golden wireframe lines
    const gridMaterial = registerDisposable(new THREE.LineBasicMaterial({
      color: 0xf5c518,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }));

    const sphereGridMesh = new THREE.LineSegments(gridGeometry, gridMaterial);
    sphereGroup.add(sphereGridMesh);

    // --- 2. VERTICAL GLOWING RODS ---
    interface RodData {
      gridIdx: number;       // Index of the grid point it starts from
      height: number;        // Height of this rod
      swayOffset: number;    // Animation phase offset
    }

    const rods: RodData[] = [];
    // Select vertices on the upper hemisphere to shoot rods upwards
    baseGridPoints.forEach((pt, idx) => {
      // Must be on the visible top side of the dome
      if (pt.y > -0.5) {
        // Random distribution chance
        if (Math.random() < 0.14) {
          rods.push({
            gridIdx: idx,
            height: 0.35 + Math.random() * 1.35, // Varied heights
            swayOffset: Math.random() * Math.PI * 2
          });
        }
      }
    });

    // Create single BufferGeometry for all rods to maximize performance
    const rodsGeometry = registerDisposable(new THREE.BufferGeometry());
    const rodsPositions = new Float32Array(rods.length * 2 * 3); // 2 vertices per rod, 3 coordinates each
    rods.forEach((rod, k) => {
      const startPt = baseGridPoints[rod.gridIdx];
      // Bottom vertex (on the sphere surface)
      rodsPositions[k * 2 * 3] = startPt.x;
      rodsPositions[k * 2 * 3 + 1] = startPt.y;
      rodsPositions[k * 2 * 3 + 2] = startPt.z;
      // Top vertex (shooting straight up parallel to local Y-axis)
      rodsPositions[k * 2 * 3 + 3] = startPt.x;
      rodsPositions[k * 2 * 3 + 4] = startPt.y + rod.height;
      rodsPositions[k * 2 * 3 + 5] = startPt.z;
    });
    rodsGeometry.setAttribute('position', new THREE.BufferAttribute(rodsPositions, 3));

    // Rod line material: transparent golden yellow fading out
    const rodsMaterial = registerDisposable(new THREE.LineBasicMaterial({
      color: 0xf5c518,
      transparent: true,
      opacity: 0.32,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }));

    const rodsMesh = new THREE.LineSegments(rodsGeometry, rodsMaterial);
    sphereGroup.add(rodsMesh);

    // --- 3. GLOWING ROD END NODES (PARTICLES) ---
    const nodesGeometry = registerDisposable(new THREE.BufferGeometry());
    const nodesPositions = new Float32Array(rods.length * 3);
    rods.forEach((rod, k) => {
      const startPt = baseGridPoints[rod.gridIdx];
      nodesPositions[k * 3] = startPt.x;
      nodesPositions[k * 3 + 1] = startPt.y + rod.height;
      nodesPositions[k * 3 + 2] = startPt.z;
    });
    nodesGeometry.setAttribute('position', new THREE.BufferAttribute(nodesPositions, 3));

    const nodesMaterial = registerDisposable(new THREE.PointsMaterial({
      color: 0xf5c518,
      map: glowTexture,
      size: 0.28,
      sizeAttenuation: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }));

    const nodesPointsMesh = new THREE.Points(nodesGeometry, nodesMaterial);
    sphereGroup.add(nodesPointsMesh);

    // --- 4. SMALL SPHERE INTERSECTION DOTS ---
    // Place small glowing points at key intersections of the grid
    const intersectionPoints: number[] = [];
    baseGridPoints.forEach((pt, idx) => {
      if (pt.y > -1.2 && idx % 3 === 0) {
        intersectionPoints.push(idx);
      }
    });

    const intersectionsGeometry = registerDisposable(new THREE.BufferGeometry());
    const intersectionsPositions = new Float32Array(intersectionPoints.length * 3);
    intersectionPoints.forEach((gridIdx, i) => {
      const pt = baseGridPoints[gridIdx];
      intersectionsPositions[i * 3] = pt.x;
      intersectionsPositions[i * 3 + 1] = pt.y;
      intersectionsPositions[i * 3 + 2] = pt.z;
    });
    intersectionsGeometry.setAttribute('position', new THREE.BufferAttribute(intersectionsPositions, 3));

    const intersectionsMaterial = registerDisposable(new THREE.PointsMaterial({
      color: 0xf5c518,
      map: glowTexture,
      size: 0.11,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }));

    const intersectionsPointsMesh = new THREE.Points(intersectionsGeometry, intersectionsMaterial);
    sphereGroup.add(intersectionsPointsMesh);

    // --- 5. FIXED SUNBURST GLARE / FLARE ---
    // Placing a large stationary glare sprite at the top right of the dome to mimic the screenshot
    const glareMaterial = registerDisposable(new THREE.SpriteMaterial({
      map: glareTexture,
      color: 0xf5c518,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.95,
      depthWrite: false
    }));

    const glareSprite = new THREE.Sprite(glareMaterial);
    // Positioned in front of the sphere's upper-right edge in world coordinates
    glareSprite.position.set(0.9, 0.7, 1.4);
    glareSprite.scale.set(4.0, 4.0, 1.0);
    mainGroup.add(glareSprite);

    // Second smaller inner white core for intense brightness
    const innerGlareMaterial = registerDisposable(new THREE.SpriteMaterial({
      map: glareTexture,
      color: 0xffffff,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.85,
      depthWrite: false
    }));
    const innerGlareSprite = new THREE.Sprite(innerGlareMaterial);
    innerGlareSprite.position.copy(glareSprite.position);
    innerGlareSprite.scale.set(1.5, 1.5, 1.0);
    mainGroup.add(innerGlareSprite);

    // --- 6. ASCENDING AMBIENT SYSTEM DUST (ENVIRONMENT PARTICLES) ---
    const envDustCount = 50;
    const envDustGeometry = registerDisposable(new THREE.BufferGeometry());
    const envDustPositions = new Float32Array(envDustCount * 3);

    interface DustParticle {
      x: number;
      y: number;
      z: number;
      speedY: number;
      phase: number;
    }

    const dustParticles: DustParticle[] = [];
    for (let i = 0; i < envDustCount; i++) {
      const px = (Math.random() - 0.5) * 6.5;
      const py = -2.5 + Math.random() * 5.0;
      const pz = (Math.random() - 0.5) * 5.0;

      envDustPositions[i * 3] = px;
      envDustPositions[i * 3 + 1] = py;
      envDustPositions[i * 3 + 2] = pz;

      dustParticles.push({
        x: px,
        y: py,
        z: pz,
        speedY: 0.005 + Math.random() * 0.009,
        phase: Math.random() * Math.PI * 2
      });
    }

    envDustGeometry.setAttribute('position', new THREE.BufferAttribute(envDustPositions, 3));

    const envDustMaterial = registerDisposable(new THREE.PointsMaterial({
      color: 0xf5c518,
      map: glowTexture,
      size: 0.08,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    }));

    const envDustMesh = new THREE.Points(envDustGeometry, envDustMaterial);
    mainGroup.add(envDustMesh);

    // --- INTERACTIVITY & PARALLAX ---
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

      // Smooth mouse parallax translation
      target.x += (mouse.x - target.x) * 0.035;
      target.y += (mouse.y - target.y) * 0.035;

      // Subtle scene perspective drift based on mouse coordinates
      mainGroup.rotation.y = target.x * 0.08;
      mainGroup.rotation.x = target.y * 0.06;

      // Beautiful smooth continuous rotation of the sphere dome network
      sphereGroup.rotation.y = elapsedTime * 0.065;

      // --- ANIMATE ASCENDING AMBIENT DUST ---
      const dustPosAttr = envDustGeometry.attributes.position as THREE.BufferAttribute;
      dustParticles.forEach((dust, i) => {
        dust.y += dust.speedY;

        // Reset if drifted too far upwards
        if (dust.y > 3.0) {
          dust.y = -2.5;
          dust.x = (Math.random() - 0.5) * 6.5;
        }

        // Add subtle horizontal drift wave
        const drift = Math.sin(elapsedTime * 1.2 + dust.phase) * 0.003;
        dust.x += drift;

        dustPosAttr.setXYZ(i, dust.x, dust.y, dust.z);
      });
      dustPosAttr.needsUpdate = true;

      // Pulse the glare brightness slightly for a high-end shimmering light look
      const glarePulse = 0.85 + Math.sin(elapsedTime * 3.5) * 0.12;
      glareMaterial.opacity = 0.85 * glarePulse;
      innerGlareMaterial.opacity = 0.75 * glarePulse;

      renderer.render(scene, camera);
    };

    animate();

    // Clean up all resources thoroughly to avoid memory leaks
    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      renderer.dispose();

      disposables.forEach(d => {
        try {
          d.dispose();
        } catch (e) {
          // Ignore simple dispose failures
        }
      });

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full absolute inset-0 z-0 overflow-hidden pointer-events-none select-none" />
  );
};

export default MissionVisionHeroVisual3D;
