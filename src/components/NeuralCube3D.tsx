import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const NeuralCube3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let W = container.clientWidth || 500;
    let H = container.clientHeight || 500;

    // --- 1. CORE SETUP ---
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    const updateCameraZ = () => {
      const aspect = camera.aspect;
      if (aspect < 1.4) {
        camera.position.set(0, 0, 6.5 * (1.4 / aspect));
      } else {
        camera.position.set(0, 0, 6.5);
      }
    };
    updateCameraZ();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      console.warn("WebGL is not supported or failed to initialize. Skipping 3D Neural Cube:", e);
      return;
    }

    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const disposables: { dispose: () => void }[] = [];
    const registerDisposable = <T extends { dispose: () => void }>(obj: T): T => {
      disposables.push(obj);
      return obj;
    };

    // --- 2. LUXURY TECHNICAL LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
    scene.add(ambientLight);

    const goldPointLight = new THREE.PointLight(0xf5c518, 4.0, 10);
    goldPointLight.position.set(0, 0.5, 1.5);
    scene.add(goldPointLight);

    const bluePointLight = new THREE.PointLight(0x00d8ff, 2.0, 8);
    bluePointLight.position.set(-2, -1, 1);
    scene.add(bluePointLight);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    // --- 3. THE CHRONO-LEDGER TIMELINE AXIS ---
    // (Timeline axis cylinder removed per user request to keep the center completely clean)


    // --- 4. FLOATING GLASS FILING PAGES ---
    const pagesCount = 5;
    const pageGroups: THREE.Group[] = [];
    const pageBorders: THREE.LineSegments[] = [];
    const pageMaterials: THREE.MeshStandardMaterial[] = [];
    const pageNodeMins: { group: THREE.Group; basePos: THREE.Vector3; offsetPhase: number; speed: number; range: number }[] = [];

    // Shared geometries
    const pagePlaneGeo = registerDisposable(new THREE.PlaneGeometry(0.75, 1.05));
    const pageEdgesGeo = registerDisposable(new THREE.EdgesGeometry(pagePlaneGeo));
    const dataLineGeo = registerDisposable(new THREE.PlaneGeometry(0.48, 0.016));
    const dataLineShortGeo = registerDisposable(new THREE.PlaneGeometry(0.32, 0.016));
    const badgeNodeGeo = registerDisposable(new THREE.SphereGeometry(0.035, 12, 12));

    // Colors: SEC amber gold, white, subtle cyber blue
    const colors = [0xf5c518, 0xffffff, 0x00d8ff, 0xf5c518, 0xffffff];
    const labels = ["10-K", "10-Q", "8-K", "10-K", "8-K"];

    for (let i = 0; i < pagesCount; i++) {
      const pageGroup = new THREE.Group();

      // Horizontal linear positioning along the timeline (-2.6 to 2.6)
      const posX = -2.6 + (i / (pagesCount - 1)) * 5.2;
      // Stagger base heights (alternate up and down)
      const posY = (i % 2 === 0 ? 0.6 : -0.6) + (Math.random() - 0.5) * 0.15;
      const posZ = (Math.random() - 0.5) * 0.4;
      const basePos = new THREE.Vector3(posX, posY, posZ);
      pageGroup.position.copy(basePos);

      // Glass plate base (Dark premium glassmorphic feel)
      const pageMat = registerDisposable(new THREE.MeshStandardMaterial({
        color: 0x07080a,
        roughness: 0.1,
        metalness: 0.95,
        transparent: true,
        opacity: 0.82,
        side: THREE.DoubleSide
      }));
      pageMaterials.push(pageMat);

      const glassPlate = new THREE.Mesh(pagePlaneGeo, pageMat);
      pageGroup.add(glassPlate);

      // Cyber gold border outline
      const borderMat = registerDisposable(new THREE.LineBasicMaterial({
        color: colors[i],
        transparent: true,
        opacity: 0.38
      }));
      const border = new THREE.LineSegments(pageEdgesGeo, borderMat);
      pageBorders.push(border);
      pageGroup.add(border);

      // Glowing corner anchor sphere (like a cryptographic signature node)
      const badgeMat = registerDisposable(new THREE.MeshStandardMaterial({
        color: colors[i],
        emissive: colors[i],
        emissiveIntensity: 1.2,
        roughness: 0.1,
        metalness: 0.9
      }));
      const badgeNode = new THREE.Mesh(badgeNodeGeo, badgeMat);
      badgeNode.position.set(-0.25, 0.4, 0.01);
      pageGroup.add(badgeNode);

      // Simulate structured document data lines (lines of code/financial entries)
      const stripeMat = registerDisposable(new THREE.MeshBasicMaterial({
        color: colors[i],
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide
      }));

      const stripeMatSubtle = registerDisposable(new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.28,
        side: THREE.DoubleSide
      }));

      // Render 4 lines of simulated database contents on the plate
      const linePositionsY = [0.18, 0.02, -0.14, -0.3];
      linePositionsY.forEach((ly, lineIndex) => {
        const isShort = lineIndex === 1 || lineIndex === 3;
        const lineMesh = new THREE.Mesh(
          isShort ? dataLineShortGeo : dataLineGeo,
          lineIndex === 2 ? stripeMatSubtle : stripeMat
        );
        lineMesh.position.set(0.04, ly, 0.015);
        pageGroup.add(lineMesh);
      });

      mainGroup.add(pageGroup);

      pageNodeMins.push({
        group: pageGroup,
        basePos,
        offsetPhase: Math.random() * Math.PI * 2,
        speed: 0.7 + Math.random() * 0.6,
        range: 0.12 + Math.random() * 0.1
      });
    }

    // --- 5. CRYPTOGRAPHIC LEDGER CHAIN LINKS ---
    // Connect each page back to the horizontal timeline axis and link them sequentially
    const linksGroup = new THREE.Group();
    mainGroup.add(linksGroup);

    const linkMatGold = registerDisposable(new THREE.LineBasicMaterial({
      color: 0xf5c518,
      transparent: true,
      opacity: 0.2
    }));

    const linkMatBlue = registerDisposable(new THREE.LineBasicMaterial({
      color: 0x00d8ff,
      transparent: true,
      opacity: 0.15
    }));

    const updateLedgerLinks = () => {
      // Clean previous link lines
      while (linksGroup.children.length > 0) {
        const ln = linksGroup.children[0] as THREE.Line;
        linksGroup.remove(ln);
        ln.geometry.dispose();
      }

      // 1. Vertical anchors to timeline axis removed per request to ensure maximum minimalist cleanliness


      // 2. Draw sequential block links (Page 0 -> Page 1 -> Page 2 -> Page 3 -> Page 4)
      for (let i = 0; i < pagesCount - 1; i++) {
        const p1 = pageNodeMins[i].group.position;
        const p2 = pageNodeMins[i + 1].group.position;

        const pts = [p1, p2];
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const line = new THREE.Line(geo, linkMatGold);
        linksGroup.add(line);
      }
    };

    // --- 6. CASCADING TICKER DATA STREAM (SNOWFALL) ---
    const cascadeCount = 75;
    const cascadeGeometry = new THREE.BufferGeometry();
    const cascadePositions = new Float32Array(cascadeCount * 3);
    const cascadeSpeeds: number[] = [];
    const cascadeOpacities: number[] = [];

    for (let c = 0; c < cascadeCount; c++) {
      // Spread evenly in volume
      cascadePositions[c * 3] = (Math.random() - 0.5) * 7.5; // X
      cascadePositions[c * 3 + 1] = (Math.random() - 0.5) * 5.0; // Y
      cascadePositions[c * 3 + 2] = (Math.random() - 0.5) * 2.5; // Z

      cascadeSpeeds.push(0.008 + Math.random() * 0.015);
      cascadeOpacities.push(0.15 + Math.random() * 0.65);
    }

    cascadeGeometry.setAttribute('position', new THREE.BufferAttribute(cascadePositions, 3));

    const cascadeMat = registerDisposable(new THREE.PointsMaterial({
      color: 0xf5c518,
      size: 0.048,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending
    }));

    const cascadePoints = new THREE.Points(cascadeGeometry, cascadeMat);
    mainGroup.add(cascadePoints);

    // --- 7. MOUSE CURSOR MAGNETISM ---
    const mouse = { x: 0, y: 0 };
    const targetMouse = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / W) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / H) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      W = container.clientWidth;
      H = container.clientHeight;
      camera.aspect = W / H;
      updateCameraZ();
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener('resize', handleResize);

    // --- 8. ANIMATION LOOP ---
    const clock = new THREE.Clock();

    const animateLoop = () => {
      const frameId = requestAnimationFrame(animateLoop);
      const elapsed = clock.getElapsedTime();

      // Mouse Parallax smooth dampening
      targetMouse.x += (mouse.x - targetMouse.x) * 0.04;
      targetMouse.y += (mouse.y - targetMouse.y) * 0.04;

      // Subtle atmospheric rotation of the overall ledger model
      mainGroup.rotation.y = elapsed * 0.02 + targetMouse.x * 0.06;
      mainGroup.rotation.x = Math.sin(elapsed * 0.1) * 0.04 + targetMouse.y * 0.06;

      // Animate pages (elegant hovering, wave oscillation and cursor magnetism)
      pageNodeMins.forEach((node, idx) => {
        const group = node.group;

        // Hover oscillations
        const hoverOffsetY = Math.sin(elapsed * node.speed + node.offsetPhase) * node.range;
        const hoverOffsetZ = Math.cos(elapsed * node.speed * 0.8 + node.offsetPhase) * (node.range * 0.6);

        group.position.set(
          node.basePos.x,
          node.basePos.y + hoverOffsetY,
          node.basePos.z + hoverOffsetZ
        );

        // Magnetic rotation: Pages subtly face the cursor
        // Calculate angle to cursor in screen space
        const targetRotY = (targetMouse.x - (node.basePos.x / 3)) * 0.38 + Math.sin(elapsed * 0.5 + idx) * 0.06;
        const targetRotX = (targetMouse.y - (node.basePos.y / 2)) * 0.28;

        group.rotation.y += (targetRotY - group.rotation.y) * 0.05;
        group.rotation.x += (targetRotX - group.rotation.x) * 0.05;

        // Visual feedback based on mouse proximity
        const distToCursor = Math.abs(targetMouse.x * 3.0 - node.basePos.x);
        if (distToCursor < 1.0) {
          // Increase emissive/opacity when cursor is nearby
          pageMaterials[idx].opacity = 0.95;
          pageBorders[idx].material.opacity = 0.85;
        } else {
          pageMaterials[idx].opacity = 0.80;
          pageBorders[idx].material.opacity = 0.38;
        }
      });

      // Update cryptographic ledger links in real-time
      updateLedgerLinks();

      // Update falling cascade data particles
      const positions = cascadeGeometry.attributes.position.array as Float32Array;
      for (let c = 0; c < cascadeCount; c++) {
        // Drop Y
        positions[c * 3 + 1] -= cascadeSpeeds[c];

        // Wrap around at bottom boundary
        if (positions[c * 3 + 1] < -2.5) {
          positions[c * 3 + 1] = 2.5;
          positions[c * 3] = (Math.random() - 0.5) * 7.5;
          positions[c * 3 + 2] = (Math.random() - 0.5) * 2.5;
        }
      }
      cascadeGeometry.attributes.position.needsUpdate = true;

      // Pulsing gold light glow to make the scene feel breathing and dynamic
      goldPointLight.intensity = 4.0 + Math.sin(elapsed * 2.2) * 1.2;

      renderer.render(scene, camera);
      return frameId;
    };

    const frameId = animateLoop();

    // --- 9. GARBAGE COLLECTION & DISPOSAL ---
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();

      // Explicitly dispose remaining lines inside ledger link group
      while (linksGroup.children.length > 0) {
        const ln = linksGroup.children[0] as THREE.Line;
        linksGroup.remove(ln);
        ln.geometry.dispose();
      }

      disposables.forEach((d) => {
        if (d && typeof d.dispose === 'function') {
          try {
            d.dispose();
          } catch (e) {
            console.warn('Error during Chrono-Ledger resource disposal:', e);
          }
        }
      });

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center pointer-events-none select-none">
      {/* Premium golden/amber radial tech glow */}
      <div className="absolute w-[450px] h-[450px] md:w-[680px] md:h-[680px] rounded-full bg-gradient-to-br from-[#f5c518]/15 via-[#f5c518]/2 to-transparent blur-[110px] md:blur-[150px] opacity-80 z-0" />
      
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full z-10" />
    </div>
  );
};

export default NeuralCube3D;
