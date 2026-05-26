import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const LiquidCooling3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let W = container.clientWidth;
    let H = container.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 5, 15);

    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(4, 4, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const pointLight = new THREE.PointLight(0xf5c518, 1.2, 10);
    pointLight.position.set(2, 3, 2);
    scene.add(pointLight);

    const blueLight = new THREE.PointLight(0x00d2ff, 1.0, 10);
    blueLight.position.set(-2, -2, 2);
    scene.add(blueLight);

    // Main Group
    const group = new THREE.Group();
    scene.add(group);

    // Chassis / Base Plate
    const baseGeo = new THREE.BoxGeometry(6, 0.2, 4);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.2 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.5;
    group.add(base);

    // GPU Chips (8 units)
    const chips: THREE.Mesh[] = [];
    const chipGeo = new THREE.BoxGeometry(0.8, 0.3, 0.8);
    const chipMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.8, roughness: 0.4 });

    for (let i = 0; i < 2; i++) {
      for (let j = 0; j < 4; j++) {
        const chip = new THREE.Mesh(chipGeo, chipMat);
        const x = (j - 1.5) * 1.4;
        const z = (i - 0.5) * 1.5;
        chip.position.set(x, -0.2, z);
        group.add(chip);
        chips.push(chip);

        // Cold plate (top of chip)
        const plateGeo = new THREE.BoxGeometry(0.82, 0.05, 0.82);
        const plateMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 1, roughness: 0.1 });
        const plate = new THREE.Mesh(plateGeo, plateMat);
        plate.position.set(x, -0.05, z);
        group.add(plate);

        // Glowing trim for plate
        const trimGeo = new THREE.BoxGeometry(0.84, 0.02, 0.84);
        const trimMat = new THREE.MeshStandardMaterial({ color: 0xf5c518, emissive: 0xf5c518, emissiveIntensity: 0.5 });
        const trim = new THREE.Mesh(trimGeo, trimMat);
        trim.position.set(x, -0.05, z);
        group.add(trim);
      }
    }

    // Cooling Pipes
    const pipeGroup = new THREE.Group();
    group.add(pipeGroup);

    // Main supply/return manifolds
    const manifoldGeo = new THREE.CylinderGeometry(0.08, 0.08, 5.5, 12);
    const manifoldMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.9, roughness: 0.3, transparent: true, opacity: 0.8 });

    const supply = new THREE.Mesh(manifoldGeo, manifoldMat);
    supply.rotation.z = Math.PI / 2;
    supply.position.set(0, 0.5, -1.8);
    pipeGroup.add(supply);

    const returnPipe = new THREE.Mesh(manifoldGeo, manifoldMat);
    returnPipe.rotation.z = Math.PI / 2;
    returnPipe.position.set(0, 0.5, 1.8);
    pipeGroup.add(returnPipe);

    // Individual chip connectors
    const connectors: THREE.Mesh[] = [];
    chips.forEach((chip) => {
      const { x, z } = chip.position;

      // Tube from supply to chip
      const tubeGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 8);
      const tubeMat = new THREE.MeshStandardMaterial({ color: 0x666666, transparent: true, opacity: 0.5 });

      const t1 = new THREE.Mesh(tubeGeo, tubeMat);
      t1.rotation.x = Math.PI / 2.5;
      t1.position.set(x, 0.25, z - 0.4);
      pipeGroup.add(t1);

      const t2 = new THREE.Mesh(tubeGeo, tubeMat);
      t2.rotation.x = -Math.PI / 2.5;
      t2.position.set(x, 0.25, z + 0.4);
      pipeGroup.add(t2);
    });

    // Animated Flow Particles
    const particles: THREE.Mesh[] = [];
    const partGeo = new THREE.SphereGeometry(0.03, 8, 8);

    for (let i = 0; i < 40; i++) {
      const col = Math.random() > 0.5 ? 0x00d2ff : 0xf5c518;
      const partMat = new THREE.MeshBasicMaterial({ color: col });
      const p = new THREE.Mesh(partGeo, partMat);

      // Assign to a path
      p.userData.pathIndex = Math.floor(Math.random() * 8);
      p.userData.progress = Math.random();
      p.userData.speed = 0.002 + Math.random() * 0.003;
      p.userData.isCold = col === 0x00d2ff;

      scene.add(p);
      particles.push(p);
    }

    const onResize = () => {
      W = container.clientWidth;
      H = container.clientHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener('resize', onResize);

    const animate = () => {
      const frameId = requestAnimationFrame(animate);

      group.rotation.y += 0.005;
      group.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;

      particles.forEach((p) => {
        p.userData.progress += p.userData.speed;
        if (p.userData.progress > 1) p.userData.progress = 0;

        const chip = chips[p.userData.pathIndex];
        const { x, z } = chip.position;
        const progress = p.userData.progress;

        if (p.userData.isCold) {
          // Flow from supply to chip
          p.position.set(
            x,
            0.5 - progress * 0.6,
            -1.8 + progress * 1.8
          );
        } else {
          // Flow from chip to return
          p.position.set(
            x,
            -0.1 + progress * 0.6,
            z + progress * (1.8 - z)
          );
        }

        p.scale.setScalar(0.5 + Math.sin(progress * Math.PI) * 1.5);
      });

      renderer.render(scene, camera);
      return frameId;
    };

    const frameId = animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default LiquidCooling3D;
