"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const LiquidCooling3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let W = container.clientWidth || 400;
    let H = container.clientHeight || 450;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xf5f5f7, 0.08); // Blends with light background

    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(0, 0.6, 6.8); // Centered, slightly elevated straight view matching the image

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0xffffff, 0); // Transparent to blend with parent background
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Target focus
    const cameraTarget = new THREE.Vector3(0, 0, 0);
    camera.lookAt(cameraTarget);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);

    // Direct lighting matching studio environment
    const mainSpot = new THREE.DirectionalLight(0xffffff, 1.5);
    mainSpot.position.set(2, 6, 4);
    scene.add(mainSpot);

    const fillSpot = new THREE.DirectionalLight(0x00d2ff, 0.85); // Cyan wash from the sides
    fillSpot.position.set(-5, 1, 2);
    scene.add(fillSpot);

    const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
    rimLight.position.set(0, 2, -4);
    scene.add(rimLight);

    // Ambient Cyan Backlight (Background Glow)
    const bgGlow = new THREE.PointLight(0x00d2ff, 2.2, 10);
    bgGlow.position.set(0, 0.2, -1.8);
    scene.add(bgGlow);

    // Main group
    const group = new THREE.Group();
    scene.add(group);

    // Lists for animating
    const ledsToBlink: THREE.MeshBasicMaterial[] = [];
    const fanRotors: THREE.Group[] = [];

    // Configuration of the 3 Racks (Matching the perspective layout of the image)
    const racksConfig = [
      { id: 'left', x: -1.55, y: -0.05, z: -0.2, width: 1.15, height: 3.0, depth: 1.0, isCenter: false },
      { id: 'center', x: 0, y: 0.25, z: 0, width: 1.3, height: 3.6, depth: 1.1, isCenter: true },
      { id: 'right', x: 1.55, y: -0.05, z: -0.2, width: 1.15, height: 3.0, depth: 1.0, isCenter: false }
    ];

    // Shared server rack creation function
    const createServerRack = (cfg: typeof racksConfig[0], isReflection: boolean) => {
      const rack = new THREE.Group();

      const opacity = isReflection ? 0.22 : 1.0;
      const transparent = isReflection;

      // Materials
      const matCharcoal = new THREE.MeshStandardMaterial({
        color: 0x18181b,
        roughness: 0.35,
        metalness: 0.65,
        transparent,
        opacity: 0.9 * opacity
      });

      const matSilver = new THREE.MeshStandardMaterial({
        color: 0xd0d0d6,
        metalness: 0.95,
        roughness: 0.12,
        transparent,
        opacity: 1.0 * opacity
      });

      const matGlass = new THREE.MeshStandardMaterial({
        color: 0xbbeef8,
        transparent: true,
        opacity: 0.16 * opacity,
        roughness: 0.05,
        metalness: 0.3
      });

      const matChrome = new THREE.MeshStandardMaterial({
        color: 0xf5f5f7,
        metalness: 1.0,
        roughness: 0.05,
        transparent,
        opacity: 1.0 * opacity
      });

      const matDarkMetal = new THREE.MeshStandardMaterial({
        color: 0x09090b,
        metalness: 0.8,
        roughness: 0.5,
        transparent,
        opacity: 1.0 * opacity
      });

      // â”€â”€ Outer Cabinet â”€â”€
      // Top and Bottom Caps (Charcoal)
      const capGeo = new THREE.BoxGeometry(cfg.width, 0.15, cfg.depth);

      const bottomCap = new THREE.Mesh(capGeo, matCharcoal);
      bottomCap.position.y = -cfg.height / 2 - 0.075;
      rack.add(bottomCap);

      const topCap = new THREE.Mesh(capGeo, matCharcoal);
      topCap.position.y = cfg.height / 2 + 0.075;
      rack.add(topCap);

      // Side Pillars (Sleek Silver Aluminum Frame)
      const sideGeo = new THREE.BoxGeometry(0.08, cfg.height, cfg.depth);

      const leftSide = new THREE.Mesh(sideGeo, matSilver);
      leftSide.position.set(-cfg.width / 2 + 0.04, 0, 0);
      rack.add(leftSide);

      const rightSide = new THREE.Mesh(sideGeo, matSilver);
      rightSide.position.set(cfg.width / 2 - 0.04, 0, 0);
      rack.add(rightSide);

      // Back Panel (Dark)
      const backGeo = new THREE.BoxGeometry(cfg.width - 0.08, cfg.height, 0.02);
      const backPanel = new THREE.Mesh(backGeo, matDarkMetal);
      backPanel.position.z = -cfg.depth / 2 + 0.01;
      rack.add(backPanel);

      // â”€â”€ Glass Front Door â”€â”€
      const doorGeo = new THREE.BoxGeometry(cfg.width - 0.08, cfg.height, 0.02);
      const door = new THREE.Mesh(doorGeo, matGlass);
      door.position.set(0, 0, cfg.depth / 2 + 0.01);
      rack.add(door);

      // Silver door handle strip (reminiscent of the vertical handle in the image)
      const handleGeo = new THREE.BoxGeometry(0.025, cfg.height * 0.72, 0.015);
      const handle = new THREE.Mesh(handleGeo, matChrome);
      handle.position.set(cfg.width / 2 - 0.09, 0, cfg.depth / 2 + 0.02);
      rack.add(handle);

      // â”€â”€ Server Units/Blades â”€â”€
      const bladeCount = cfg.isCenter ? 14 : 11;
      const bladeHeight = (cfg.height - 0.2) / bladeCount;

      for (let b = 0; b < bladeCount; b++) {
        const bladeGroup = new THREE.Group();
        const yPos = (cfg.height / 2 - 0.15) - b * (cfg.height - 0.2) / (bladeCount - 0.5);
        bladeGroup.position.y = yPos;
        rack.add(bladeGroup);

        // Blade base card
        const cardGeo = new THREE.BoxGeometry(cfg.width - 0.16, bladeHeight - 0.03, cfg.depth - 0.08);
        const card = new THREE.Mesh(cardGeo, matDarkMetal);
        bladeGroup.add(card);

        // Front bezel layout panel (Charcoal black faceplate segment)
        const faceplateGeo = new THREE.BoxGeometry(cfg.width - 0.16, bladeHeight - 0.03, 0.015);
        const faceplate = new THREE.Mesh(faceplateGeo, matCharcoal);
        faceplate.position.z = cfg.depth / 2 - 0.02;
        bladeGroup.add(faceplate);

        // Varying details per drawer slot to mimic image
        const layoutType = b % 4;

        if (layoutType === 0) {
          // Type A: Storage/Hard Drive Bays (Silver hot-swap bays stacked horizontally)
          const driveCount = cfg.isCenter ? 10 : 8;
          const totalW = cfg.width - 0.28;
          const dW = totalW / driveCount;
          const driveGeo = new THREE.BoxGeometry(dW - 0.018, bladeHeight - 0.06, 0.01);

          for (let d = 0; d < driveCount; d++) {
            const drive = new THREE.Mesh(driveGeo, matSilver);
            const dx = -totalW / 2 + dW / 2 + d * dW;
            drive.position.set(dx, 0, cfg.depth / 2 - 0.01);
            bladeGroup.add(drive);

            // Blinking green LED indicator on disk trays
            if (Math.random() > 0.4 && !isReflection) {
              const ledGeo = new THREE.SphereGeometry(0.008, 4, 4);
              const ledMat = new THREE.MeshBasicMaterial({ color: 0x00ff66 });
              const led = new THREE.Mesh(ledGeo, ledMat);
              led.position.set(dx, -bladeHeight / 2 + 0.05, cfg.depth / 2);
              bladeGroup.add(led);
              ledsToBlink.push(ledMat);
            }
          }
        } else if (layoutType === 1) {
          // Type B: Dashboard Screen + LED grid details
          const screenW = cfg.width * 0.32;
          const screenGeo = new THREE.BoxGeometry(screenW, bladeHeight - 0.06, 0.01);
          // High intensity cyan screen matching the screens in image
          const screenMat = new THREE.MeshStandardMaterial({
            color: 0x00d2ff,
            emissive: 0x00d2ff,
            emissiveIntensity: 0.8 * opacity,
            roughness: 0.1,
            transparent: isReflection,
            opacity: 1.0 * opacity
          });
          const screen = new THREE.Mesh(screenGeo, screenMat);
          screen.position.set(cfg.width * 0.1, 0, cfg.depth / 2 - 0.01);
          bladeGroup.add(screen);

          // LED arrays on the left
          const ledGeo = new THREE.BoxGeometry(0.014, 0.014, 0.01);
          for (let c = 0; c < 5; c++) {
            const ledMat = new THREE.MeshBasicMaterial({
              color: Math.random() > 0.5 ? 0x00ff66 : (Math.random() > 0.3 ? 0xf5c518 : 0x00d2ff),
              transparent: isReflection,
              opacity: 1.0 * opacity
            });
            const led = new THREE.Mesh(ledGeo, ledMat);
            const lx = -cfg.width / 2 + 0.16 + c * 0.038;
            led.position.set(lx, 0, cfg.depth / 2 - 0.01);
            bladeGroup.add(led);
            if (!isReflection) ledsToBlink.push(ledMat);
          }
        } else if (layoutType === 2) {
          // Type C: Detailed grid of indicator LEDs (highly structured multi-color grids)
          const ledGeo = new THREE.BoxGeometry(0.012, 0.012, 0.01);
          const cols = cfg.isCenter ? 12 : 9;
          const rows = 2;
          const stepX = (cfg.width - 0.32) / cols;

          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const baseCol = Math.random() > 0.7 ? 0x00d2ff : (Math.random() > 0.45 ? 0x00ff66 : 0xf5c518);
              const ledMat = new THREE.MeshBasicMaterial({
                color: baseCol,
                transparent: isReflection,
                opacity: 0.9 * opacity
              });
              const led = new THREE.Mesh(ledGeo, ledMat);
              const lx = -(cfg.width - 0.32) / 2 + stepX / 2 + c * stepX;
              const ly = -0.04 + r * 0.08;
              led.position.set(lx, ly, cfg.depth / 2 - 0.01);
              bladeGroup.add(led);
              if (!isReflection) ledsToBlink.push(ledMat);
            }
          }
        } else {
          // Type D: Auxiliary circular ports and monitoring display
          const portGeo = new THREE.CylinderGeometry(0.014, 0.014, 0.02, 6);
          portGeo.rotateX(Math.PI / 2);
          for (let p = 0; p < 4; p++) {
            const port = new THREE.Mesh(portGeo, matSilver);
            port.position.set(-cfg.width / 2 + 0.18 + p * 0.065, -0.01, cfg.depth / 2 - 0.01);
            bladeGroup.add(port);
          }

          const screenGeo = new THREE.BoxGeometry(cfg.width * 0.28, bladeHeight - 0.07, 0.01);
          const screenMat = new THREE.MeshStandardMaterial({
            color: 0x39ff14, // Bright matrix green screen
            emissive: 0x39ff14,
            emissiveIntensity: 0.7 * opacity,
            roughness: 0.2,
            transparent: isReflection,
            opacity: 1.0 * opacity
          });
          const screen = new THREE.Mesh(screenGeo, screenMat);
          screen.position.set(cfg.width * 0.12, 0, cfg.depth / 2 - 0.01);
          bladeGroup.add(screen);
        }
      }

      // â”€â”€ Integrated Inner Liquid Coolant Pipes (Liquid Cooled Accent) â”€â”€
      const matPipes = new THREE.MeshStandardMaterial({
        color: 0x33333b,
        metalness: 0.8,
        roughness: 0.2,
        transparent,
        opacity: 0.85 * opacity
      });
      // Left vertical pipe
      const pipeSupplyGeo = new THREE.CylinderGeometry(0.03, 0.03, cfg.height - 0.3, 8);
      const pipeL = new THREE.Mesh(pipeSupplyGeo, matPipes);
      pipeL.position.set(-cfg.width / 2 + 0.12, 0, cfg.depth / 2 - 0.08);
      rack.add(pipeL);

      // Right vertical pipe
      const pipeR = new THREE.Mesh(pipeSupplyGeo, matPipes);
      pipeR.position.set(cfg.width / 2 - 0.12, 0, cfg.depth / 2 - 0.08);
      rack.add(pipeR);

      return rack;
    };

    // Render Real Racks
    racksConfig.forEach((cfg) => {
      const r = createServerRack(cfg, false);
      r.position.set(cfg.x, cfg.y, cfg.z);
      group.add(r);
    });



    // â”€â”€ Liquid Coolant Flow Particles â”€â”€
    const flowCount = 45;
    const flowParticles: { mesh: THREE.Mesh; progress: number; speed: number; rackIndex: number; isCold: boolean }[] = [];

    const pGeo = new THREE.SphereGeometry(0.022, 6, 6);
    const pMatCold = new THREE.MeshBasicMaterial({ color: 0x00d2ff }); // Blue coolant
    const pMatHot = new THREE.MeshBasicMaterial({ color: 0xff6600 });  // Orange coolant

    for (let p = 0; p < flowCount; p++) {
      const isCold = Math.random() > 0.5;
      const rackIndex = Math.floor(Math.random() * racksConfig.length);
      const mesh = new THREE.Mesh(pGeo, isCold ? pMatCold : pMatHot);
      scene.add(mesh);

      flowParticles.push({
        mesh,
        progress: Math.random(),
        speed: 0.002 + Math.random() * 0.004,
        rackIndex,
        isCold,
      });
    }

    // Drag-to-Rotate and Hover Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let hoverRotX = 0;
    let hoverRotY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / W - 0.5;
      const ny = (e.clientY - rect.top) / H - 0.5;

      if (!isDragging) {
        // Soft camera tilt target
        hoverRotY = nx * 0.45;
        hoverRotX = ny * 0.25;
        return;
      }

      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      // Rotate both real and mirror group in unison
      group.rotation.y += deltaX * 0.006;
      group.rotation.x += deltaY * 0.006;
      group.rotation.x = Math.max(-0.25, Math.min(0.45, group.rotation.x));



      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    // Mobile touch support
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.y;

      group.rotation.y += deltaX * 0.006;
      group.rotation.x += deltaY * 0.006;
      group.rotation.x = Math.max(-0.25, Math.min(0.45, group.rotation.x));



      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onMouseUp);

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      W = container.clientWidth;
      H = container.clientHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener('resize', onResize);

    // â”€â”€ Animation Loop â”€â”€
    const animate = () => {
      const frameId = requestAnimationFrame(animate);

      // Blinking LEDs
      ledsToBlink.forEach((led) => {
        if (Math.random() < 0.004) {
          // Flickering status
          led.opacity = Math.random() > 0.55 ? 0.2 : 1.0;
        }
      });

      // Animate coolant flows inside all 3 racks
      flowParticles.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) {
          p.progress = 0;
          p.rackIndex = Math.floor(Math.random() * racksConfig.length);
        }

        const progress = p.progress;
        const rackCfg = racksConfig[p.rackIndex];

        const startY = -rackCfg.height / 2 + 0.15;
        const endY = rackCfg.height / 2 - 0.15;

        // Position on vertical pipes
        const currentY = startY + (endY - startY) * progress;
        const pipeXOffset = p.isCold ? -rackCfg.width / 2 + 0.12 : rackCfg.width / 2 - 0.12;

        p.mesh.position.set(
          rackCfg.x + pipeXOffset,
          currentY + rackCfg.y,
          rackCfg.z + rackCfg.depth / 2 - 0.08
        );

        p.mesh.scale.setScalar(0.7 + Math.sin(progress * Math.PI) * 0.45);
      });

      // Smooth camera drift easing based on hover position (stops automatic rotation loop)
      if (!isDragging) {
        group.rotation.y += (hoverRotY - group.rotation.y) * 0.05;
        group.rotation.x += (hoverRotX - group.rotation.x) * 0.05;
      }

      renderer.render(scene, camera);
      return frameId;
    };

    const frameId = animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onMouseUp);

      renderer.dispose();

      flowParticles.forEach((p) => scene.remove(p.mesh));

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full min-h-[350px] lg:min-h-[420px]" />;
};

export default LiquidCooling3D;
