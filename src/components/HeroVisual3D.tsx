import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HeroVisual3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let W = container.clientWidth;
    let H = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x06070a, 18, 35);

    // Camera
    const camera = new THREE.PerspectiveCamera(34, W / H, 0.1, 100);
    camera.position.set(0, 2.4, 13);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0x1a1d24, 0.6);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfff5d9, 1.4);
    keyLight.position.set(5, 6, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xf5c518, 1.1);
    rimLight.position.set(-5, 3, -4);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0x4dc8ff, 0.4, 12);
    fillLight.position.set(-3, -2, 3);
    scene.add(fillLight);

    const accentLight = new THREE.PointLight(0xf5c518, 0.8, 8);
    accentLight.position.set(0, -1.6, 1);
    scene.add(accentLight);

    // Group container
    const module = new THREE.Group();
    scene.add(module);

    // Chassis
    const chassisGeo = new THREE.BoxGeometry(5.4, 0.9, 3.2);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x14161b,
      metalness: 0.85,
      roughness: 0.35
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    module.add(chassis);

    const edgeGeo = new THREE.BoxGeometry(5.42, 0.04, 3.22);
    const edgeMat = new THREE.MeshStandardMaterial({
      color: 0xf5c518,
      emissive: 0xf5c518,
      emissiveIntensity: 0.8,
      metalness: 0.5,
      roughness: 0.3
    });
    const topEdge = new THREE.Mesh(edgeGeo, edgeMat);
    topEdge.position.y = 0.45;
    module.add(topEdge);

    const frontGeo = new THREE.BoxGeometry(5.2, 0.78, 0.06);
    const frontMat = new THREE.MeshStandardMaterial({
      color: 0x0d0f13,
      metalness: 0.7,
      roughness: 0.5
    });
    const front = new THREE.Mesh(frontGeo, frontMat);
    front.position.set(0, 0, 1.62);
    module.add(front);

    // GPU Chips
    const chipGroup = new THREE.Group();
    const chipMat = new THREE.MeshStandardMaterial({ color: 0x1f2229, metalness: 0.8, roughness: 0.4 });
    const chipTopMat = new THREE.MeshStandardMaterial({ color: 0x2a2e36, metalness: 0.6, roughness: 0.6 });

    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 4; col++) {
        const chipBase = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.18, 0.85), chipMat);
        const x = (col - 1.5) * 1.15;
        const z = (row - 0.5) * 1.15;
        chipBase.position.set(x, 0.55, z);
        chipGroup.add(chipBase);

        const chipTop = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.04, 0.55), chipTopMat);
        chipTop.position.set(x, 0.66, z);
        chipGroup.add(chipTop);

        const chipRim = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.02, 0.86), new THREE.MeshStandardMaterial({
          color: 0xf5c518, emissive: 0xf5c518, emissiveIntensity: 0.5
        }));
        chipRim.position.set(x, 0.65, z);
        chipGroup.add(chipRim);

        const ledMat = new THREE.MeshStandardMaterial({ color: 0x00e878, emissive: 0x00e878, emissiveIntensity: 1.5 });
        const led = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), ledMat);
        led.position.set(x + 0.32, 0.69, z + 0.32);
        led.userData.basePhase = row * 4 + col;
        chipGroup.add(led);
      }
    }
    module.add(chipGroup);

    // Heatsinks
    const finMat = new THREE.MeshStandardMaterial({ color: 0x3a3e46, metalness: 0.95, roughness: 0.25 });
    for (let i = 0; i < 5; i++) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(5.0, 0.28, 0.04), finMat);
      fin.position.set(0, 0.6, -1.4 + i * 0.7);
      module.add(fin);
    }

    // LED Strips
    const ledStripGeo = new THREE.BoxGeometry(4.6, 0.08, 0.02);
    const ledStripMat = new THREE.MeshStandardMaterial({ color: 0xf5c518, emissive: 0xf5c518, emissiveIntensity: 1.6 });
    const ledStrip = new THREE.Mesh(ledStripGeo, ledStripMat);
    ledStrip.position.set(0, 0.18, 1.66);
    module.add(ledStrip);

    // Front Ports
    const portMat = new THREE.MeshStandardMaterial({ color: 0x05060a, metalness: 0.9, roughness: 0.4 });
    for (let i = 0; i < 12; i++) {
      const port = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.04), portMat);
      port.position.set(-2.0 + i * 0.36, -0.12, 1.66);
      module.add(port);
    }

    // Status LEDs
    const statusLeds: THREE.Mesh[] = [];
    for (let i = 0; i < 6; i++) {
      const statusLed = new THREE.Mesh(
        new THREE.SphereGeometry(0.035, 8, 8),
        new THREE.MeshStandardMaterial({
          color: i % 2 ? 0x00e878 : 0xf5c518,
          emissive: i % 2 ? 0x00e878 : 0xf5c518,
          emissiveIntensity: 1.4
        })
      );
      statusLed.position.set(-1.2 + i * 0.45, 0.05, 1.665);
      statusLed.userData.basePhase = i * 0.8;
      module.add(statusLed);
      statusLeds.push(statusLed);
    }

    // Base plate
    const baseGeo = new THREE.BoxGeometry(6.0, 0.08, 3.6);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x0a0c10, metalness: 0.9, roughness: 0.7 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.55;
    module.add(base);

    // Accent ring
    const baseRingGeo = new THREE.TorusGeometry(3.2, 0.015, 8, 64);
    const baseRingMat = new THREE.MeshStandardMaterial({ color: 0xf5c518, emissive: 0xf5c518, emissiveIntensity: 1.2 });
    const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
    baseRing.position.y = -0.51;
    baseRing.rotation.x = Math.PI / 2;
    module.add(baseRing);

    // Energy beams
    const beamGroup = new THREE.Group();
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xf5c518, transparent: true, opacity: 0.4 });
    for (let col = 0; col < 4; col++) {
      const x = (col - 1.5) * 1.15;
      const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.005, 1.4, 8), beamMat.clone());
      beam.position.set(x, 1.4, 0);
      beam.userData.phase = col;
      beamGroup.add(beam);
    }
    module.add(beamGroup);

    // Data rings
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf5c518, transparent: true, opacity: 0.15 });
    const dataRing = new THREE.Mesh(new THREE.TorusGeometry(4.0, 0.008, 6, 80), ringMat);
    dataRing.rotation.x = Math.PI / 2.2;
    dataRing.position.y = 0.2;
    module.add(dataRing);

    const dataRing2 = new THREE.Mesh(
      new THREE.TorusGeometry(3.4, 0.005, 6, 80),
      new THREE.MeshBasicMaterial({ color: 0x4dc8ff, transparent: true, opacity: 0.18 })
    );
    dataRing2.rotation.x = Math.PI / 1.8;
    dataRing2.rotation.z = 0.4;
    dataRing2.position.y = 0.1;
    module.add(dataRing2);

    // Orbit dots
    const orbitDots: THREE.Mesh[] = [];
    for (let i = 0; i < 14; i++) {
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 8, 8),
        new THREE.MeshBasicMaterial({ color: i % 3 === 0 ? 0x00e878 : 0xf5c518, transparent: true, opacity: 0.85 })
      );
      dot.userData.angle = (i / 14) * Math.PI * 2;
      dot.userData.radius = 3.8 + Math.random() * 1.2;
      dot.userData.height = (Math.random() - 0.5) * 1.6;
      dot.userData.speed = 0.25 + Math.random() * 0.15;
      module.add(dot);
      orbitDots.push(dot);
    }

    module.rotation.y = -0.4;
    module.rotation.x = 0.1;

    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };
    const handleMouseLeave = () => { mouseX = 0; mouseY = 0; };
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    const onResize = () => {
      W = container.clientWidth;
      H = container.clientHeight;
      camera.aspect = W / H;
      // Adjust camera distance for mobile so graphic isn't cut off
      if (W < 768) {
        camera.position.set(0, 1.2, 11);
      } else if (W < 1024) {
        camera.position.set(0, 2.4, 15);
      } else {
        camera.position.set(0, 2.4, 13);
      }
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    
    // Call it once on load
    onResize();
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let auto = 0;

    const animate = () => {
      const frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      auto += 0.0035;

      const targetRotY = -0.4 + Math.sin(auto) * 0.6 + mouseX * 0.4;
      const targetRotX = 0.1 + mouseY * -0.2;
      module.rotation.y += (targetRotY - module.rotation.y) * 0.04;
      module.rotation.x += (targetRotX - module.rotation.x) * 0.04;

      chipGroup.children.forEach((child: any) => {
        if (child.userData.basePhase !== undefined && child.material.emissiveIntensity !== undefined) {
          const pulse = 0.7 + 0.6 * Math.abs(Math.sin(t * 2.5 + child.userData.basePhase * 0.6));
          child.material.emissiveIntensity = pulse * 1.5;
        }
      });

      statusLeds.forEach((led) => {
        const p = 0.6 + 0.5 * Math.abs(Math.sin(t * 3 + led.userData.basePhase));
        (led.material as THREE.MeshStandardMaterial).emissiveIntensity = p * 1.4;
      });

      beamGroup.children.forEach((beam: any) => {
        const p = 0.2 + 0.4 * Math.abs(Math.sin(t * 2.2 + beam.userData.phase * 0.8));
        beam.material.opacity = p;
        beam.scale.y = 0.7 + 0.5 * Math.abs(Math.sin(t * 1.5 + beam.userData.phase));
      });

      (ledStrip.material as THREE.MeshStandardMaterial).emissiveIntensity = 1.3 + 0.4 * Math.sin(t * 1.8);
      dataRing.rotation.z += 0.003;
      dataRing2.rotation.z -= 0.0025;

      orbitDots.forEach((dot) => {
        dot.userData.angle += dot.userData.speed * 0.01;
        dot.position.x = Math.cos(dot.userData.angle) * dot.userData.radius;
        dot.position.z = Math.sin(dot.userData.angle) * dot.userData.radius;
        dot.position.y = dot.userData.height + Math.sin(t * 0.8 + dot.userData.angle) * 0.2;
        dot.material.opacity = 0.5 + 0.4 * Math.abs(Math.sin(t + dot.userData.angle));
      });

      accentLight.intensity = 0.6 + 0.4 * Math.abs(Math.sin(t * 1.4));
      renderer.render(scene, camera);
      return frameId;
    };

    const frameId = animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} id="hero3d" />;
};

export default HeroVisual3D;
