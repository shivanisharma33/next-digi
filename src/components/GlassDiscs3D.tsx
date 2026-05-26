import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const GlassDiscs3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let W = container.clientWidth;
    let H = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000);
    camera.position.set(8, 6, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directLight.position.set(5, 10, 7.5);
    scene.add(directLight);

    const yellowLight = new THREE.PointLight(0xf5c518, 2, 10);
    yellowLight.position.set(-2, 3, 2);
    scene.add(yellowLight);

    // Stepped Base (Blue/Dark)
    const baseGroup = new THREE.Group();
    const stepCount = 5;
    const stepHeight = 0.5;
    const stepColor = 0x0a0c0f; // Very dark base
    
    for (let i = 0; i < stepCount; i++) {
      const radius = 4 - i * 0.6;
      const geo = new THREE.CylinderGeometry(radius, radius + 0.2, stepHeight, 64);
      const mat = new THREE.MeshStandardMaterial({ 
        color: stepColor,
        roughness: 0.2,
        metalness: 0.8
      });
      const step = new THREE.Mesh(geo, mat);
      step.position.y = i * stepHeight - (stepCount * stepHeight) / 2;
      baseGroup.add(step);
    }
    scene.add(baseGroup);

    // Glassy Discs
    const discs: THREE.Mesh[] = [];
    const discCount = 4;
    const glassMat = new THREE.MeshPhysicalMaterial({
      thickness: 0.5,
      roughness: 0,
      transmission: 1,
      ior: 1.5,
      dispersion: 5,
      color: 0xffffff,
      emissive: 0xf5c518,
      emissiveIntensity: 0.1,
      transparent: true,
      opacity: 0.8
    });

    for (let i = 0; i < discCount; i++) {
      const geo = new THREE.CylinderGeometry(1.2, 1.2, 0.15, 64);
      const disc = new THREE.Mesh(geo, glassMat);
      
      const angle = (i / discCount) * Math.PI * 2;
      disc.position.set(Math.cos(angle) * 3, 1 + Math.sin(i) * 1, Math.sin(angle) * 3);
      disc.rotation.x = Math.PI / 2;
      disc.rotation.z = Math.random() * Math.PI;
      
      discs.push(disc);
      scene.add(disc);
    }

    // Animation
    const animate = () => {
      const time = Date.now() * 0.001;
      
      baseGroup.rotation.y = time * 0.1;
      
      discs.forEach((disc, i) => {
        disc.position.y = 1.5 + Math.sin(time + i) * 0.5;
        disc.rotation.y += 0.01;
        disc.rotation.z += 0.005;
      });

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const handleResize = () => {
      W = container.clientWidth;
      H = container.clientHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default GlassDiscs3D;
