import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const LeadershipHeroVisual3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let W = container.clientWidth || 800;
    let H = container.clientHeight || 600;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.05);

    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(0, 2.8, 8.5);
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

    // Lights
    const ambientLight = registerDisposable(new THREE.AmbientLight(0xffffff, 0.1));
    scene.add(ambientLight);

    const pointLight = registerDisposable(new THREE.PointLight(0xf5c518, 2.5, 12));
    pointLight.position.set(0, 2.5, 2.5);
    scene.add(pointLight);

    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // --- 1. GOVERNANCE CRYSTAL (STRUCTURAL POLYHEDRON) ---
    const crystalGroup = new THREE.Group();
    mainGroup.add(crystalGroup);

    const geom = registerDisposable(new THREE.IcosahedronGeometry(1.6, 1));
    const lineMat = registerDisposable(new THREE.LineBasicMaterial({
      color: 0xf5c518,
      transparent: true,
      opacity: 0.18
    }));

    const wireframe = new THREE.LineSegments(
      registerDisposable(new THREE.WireframeGeometry(geom)),
      lineMat
    );
    crystalGroup.add(wireframe);

    // Unique vertices node points
    const nodeGeo = registerDisposable(new THREE.SphereGeometry(0.04, 8, 8));
    const nodeMat = registerDisposable(new THREE.MeshBasicMaterial({ color: 0xf5c518 }));
    const positionAttr = geom.attributes.position;
    const vertexSet = new Set<string>();
    const nodeMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < positionAttr.count; i++) {
      const vx = positionAttr.getX(i);
      const vy = positionAttr.getY(i);
      const vz = positionAttr.getZ(i);
      const key = `${vx.toFixed(3)},${vy.toFixed(3)},${vz.toFixed(3)}`;

      if (!vertexSet.has(key)) {
        vertexSet.add(key);
        const mesh = new THREE.Mesh(nodeGeo, nodeMat);
        mesh.position.set(vx, vy, vz);
        crystalGroup.add(mesh);
        nodeMeshes.push(mesh);
      }
    }

    // --- 2. FOUNDATION COORD RINGS (Pillar Alignment Metaphor) ---
    const ringsGroup = new THREE.Group();
    ringsGroup.rotation.x = Math.PI / 2;
    ringsGroup.position.y = -1.4;
    mainGroup.add(ringsGroup);

    const ringLineMat = registerDisposable(new THREE.LineBasicMaterial({
      color: 0xf5c518,
      transparent: true,
      opacity: 0.08
    }));

    const radii = [1.5, 2.6];
    radii.forEach((radius) => {
      const points: THREE.Vector3[] = [];
      const steps = 64;
      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, Math.sin(theta) * radius, 0));
      }
      const ringGeom = new THREE.BufferGeometry().setFromPoints(points);
      const ringLine = new THREE.Line(ringGeom, ringLineMat);
      ringsGroup.add(ringLine);
    });

    // --- 3. FLOATING AMBIENT SPARKLES ---
    const sparklesGroup = new THREE.Group();
    mainGroup.add(sparklesGroup);

    const sparkleGeo = registerDisposable(new THREE.SphereGeometry(0.02, 4, 4));
    const sparkleMat = registerDisposable(new THREE.MeshBasicMaterial({
      color: 0xf5c518,
      transparent: true,
      opacity: 0.65
    }));

    interface SparklePoint {
      mesh: THREE.Mesh;
      velocity: THREE.Vector3;
      range: number;
    }
    const sparkles: SparklePoint[] = [];

    for (let i = 0; i < 40; i++) {
      const mesh = new THREE.Mesh(sparkleGeo, sparkleMat);
      const range = 5.0;
      mesh.position.set(
        (Math.random() - 0.5) * range,
        (Math.random() - 0.5) * range - 0.5,
        (Math.random() - 0.5) * range
      );
      sparklesGroup.add(mesh);

      sparkles.push({
        mesh,
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.003,
          (Math.random() - 0.5) * 0.003 + 0.002, // Drift slightly up
          (Math.random() - 0.5) * 0.003
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

      // Smooth mouse parallax translation
      target.x += (mouse.x - target.x) * 0.04;
      target.y += (mouse.y - target.y) * 0.04;

      // Group drift and scroll rotate
      mainGroup.rotation.y = elapsedTime * 0.025 - target.x * 0.08;
      mainGroup.rotation.x = Math.sin(elapsedTime * 0.035) * 0.01 + target.y * 0.04;

      // Spin crystal independently
      crystalGroup.rotation.y = elapsedTime * 0.06;
      crystalGroup.rotation.z = Math.sin(elapsedTime * 0.04) * 0.08;

      // Pulse nodes at vertices
      nodeMeshes.forEach((mesh, index) => {
        const pulse = Math.sin(elapsedTime * 2.5 + index * 0.2) * 0.25 + 1.0;
        mesh.scale.setScalar(pulse);
      });

      // Ambient sparkles drift
      sparkles.forEach((s) => {
        s.mesh.position.add(s.velocity);

        const bound = s.range / 2;
        if (s.mesh.position.x > bound) s.mesh.position.x = -bound;
        if (s.mesh.position.x < -bound) s.mesh.position.x = bound;
        if (s.mesh.position.y > bound) s.mesh.position.y = -bound;
        if (s.mesh.position.y < -bound) s.mesh.position.y = bound;
        if (s.mesh.position.z > bound) s.mesh.position.z = -bound;
        if (s.mesh.position.z < -bound) s.mesh.position.z = bound;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      renderer.dispose();

      sparkles.forEach((s) => {
        scene.remove(s.mesh);
        s.mesh.geometry.dispose();
        if (Array.isArray(s.mesh.material)) {
          s.mesh.material.forEach((m) => m.dispose());
        } else {
          s.mesh.material.dispose();
        }
      });

      nodeMeshes.length = 0;
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

export default LeadershipHeroVisual3D;
