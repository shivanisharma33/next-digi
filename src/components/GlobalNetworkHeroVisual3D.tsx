import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const GlobalNetworkHeroVisual3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let W = container.clientWidth || 800;
    let H = container.clientHeight || 600;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06070a, 0.05);

    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    camera.position.set(0, 1.8, 5.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x06070a, 0);

    renderer.domElement.style.display = 'block';
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
    const ambientLight = registerDisposable(new THREE.AmbientLight(0xffffff, 0.12));
    scene.add(ambientLight);

    const pointLight = registerDisposable(new THREE.PointLight(0xf5c518, 3.5, 15));
    pointLight.position.set(3, 4, 3);
    scene.add(pointLight);

    // Main rotating group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Initial rotation to face the US footprint to the front view
    globeGroup.rotation.y = Math.PI * 0.44;

    const globeRadius = 1.95;

    // --- 1. PROCEDURAL CONTINENT ESTIMATION ---
    const isLand = (x: number, y: number, z: number) => {
      const len = Math.sqrt(x * x + y * y + z * z);
      const nx = x / len;
      const ny = y / len;
      const nz = z / len;

      const lat = Math.asin(ny); // -PI/2 to PI/2
      const lon = Math.atan2(nz, nx); // -PI to PI

      // Americas
      const inAmericasLon = (lon > -2.2 && lon < -0.6);
      const inAmericasLat = (lat > -0.9 && lat < 1.1);
      const americas = inAmericasLon && inAmericasLat && (Math.sin(lon * 2) + Math.cos(lat * 3) > -0.7);

      // Eurasia & Africa
      const inEurasiaLon = (lon > 0.1 && lon < 2.8);
      const inEurasiaLat = (lat > -0.6 && lat < 1.3);
      const eurasia = inEurasiaLon && inEurasiaLat && (Math.sin(lon) * Math.cos(lat * 2) > -0.8);

      // Australia
      const australia = (lon > 1.8 && lon < 2.8 && lat > -0.8 && lat < -0.15);

      const baseMap = americas || eurasia || australia;

      // Add noise detail
      const noise = Math.sin(nx * 15) * Math.sin(ny * 15) * Math.sin(nz * 15) * 0.12;
      return (baseMap && (noise > -0.07)) || (noise > 0.08);
    };

    // Dark core sphere
    const coreGeo = registerDisposable(new THREE.SphereGeometry(globeRadius - 0.02, 32, 32));
    const coreMat = registerDisposable(new THREE.MeshBasicMaterial({
      color: 0x08090c,
      transparent: true,
      opacity: 0.9
    }));
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // Generate dual-tone particle arrays
    const dotCount = 3000;
    const landPositions: number[] = [];
    const waterPositions: number[] = [];

    for (let i = 0; i < dotCount; i++) {
      const y = 1 - (i / (dotCount - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const phi = Math.acos(y);
      const lon = i * Math.PI * (3 - Math.sqrt(5)); // Golden angle

      const x = globeRadius * Math.cos(lon) * Math.sin(phi);
      const z = globeRadius * Math.sin(lon) * Math.sin(phi);

      if (isLand(x, y * globeRadius, z)) {
        landPositions.push(x, y * globeRadius, z);
      } else {
        waterPositions.push(x, y * globeRadius, z);
      }
    }

    // Land Points Mesh (Glowing Gold)
    const landGeo = registerDisposable(new THREE.BufferGeometry());
    landGeo.setAttribute('position', new THREE.Float32BufferAttribute(landPositions, 3));
    const landMat = registerDisposable(new THREE.PointsMaterial({
      color: 0xf5c518,
      size: 0.024,
      transparent: true,
      opacity: 0.55
    }));
    const landPoints = new THREE.Points(landGeo, landMat);
    globeGroup.add(landPoints);

    // Water Points Mesh (Faint Cyber Blue)
    const waterGeo = registerDisposable(new THREE.BufferGeometry());
    waterGeo.setAttribute('position', new THREE.Float32BufferAttribute(waterPositions, 3));
    const waterMat = registerDisposable(new THREE.PointsMaterial({
      color: 0x1f2b42,
      size: 0.016,
      transparent: true,
      opacity: 0.22
    }));
    const waterPoints = new THREE.Points(waterGeo, waterMat);
    globeGroup.add(waterPoints);

    // Atmospheric outer grid ring
    const atmosphereGeo = registerDisposable(new THREE.SphereGeometry(globeRadius + 0.05, 24, 24));
    const atmosphereMat = registerDisposable(new THREE.MeshBasicMaterial({
      color: 0xf5c518,
      wireframe: true,
      transparent: true,
      opacity: 0.025
    }));
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    globeGroup.add(atmosphereMesh);

    // --- Helper to convert Lat/Lon to Cartesian 3D ---
    const latLonToVector3 = (lat: number, lon: number, r: number) => {
      const phi = (lat * Math.PI) / 180;
      const theta = ((lon + 180) * Math.PI) / 180;

      const x = -(r * Math.cos(phi) * Math.sin(theta));
      const y = r * Math.sin(phi);
      const z = r * Math.cos(phi) * Math.cos(theta);

      return new THREE.Vector3(x, y, z);
    };

    // --- 2. US NETWORK FOOTPRINT DATA ---
    const networkNodes = [
      { name: "North Tonawanda, NY", lat: 43.03, lon: -78.86, label: "NT-NY (Gas Gen)", status: "ACTIVE", latency: "0.8ms" },
      { name: "Buffalo, NY", lat: 42.89, lon: -78.88, label: "BUF-NY (Interconnect)", status: "ACTIVE", latency: "1.2ms" },
      { name: "Columbiana, AL", lat: 33.18, lon: -86.61, label: "COL-AL (Campus)", status: "ACTIVE", latency: "6.4ms" },
      { name: "Hildebran, NC", lat: 35.72, lon: -81.42, label: "HIL-NC (Pipeline)", status: "PIPELINE", latency: "4.8ms" }
    ];

    const nodePositions: THREE.Vector3[] = [];

    networkNodes.forEach((node) => {
      const pos = latLonToVector3(node.lat, node.lon, globeRadius);
      nodePositions.push(pos);
    });

    // --- 3. DIVERSE-PATH BACKBONE CONNECTIONS (Bezier Arcs) ---
    interface ArcRoute {
      start: THREE.Vector3;
      end: THREE.Vector3;
      curve: THREE.QuadraticBezierCurve3;
      line: THREE.Line;
    }

    const arcRoutes: ArcRoute[] = [];
    const curveLineMat = registerDisposable(new THREE.LineBasicMaterial({
      color: 0xf5c518,
      transparent: true,
      opacity: 0.4
    }));

    const buildArc = (start: THREE.Vector3, end: THREE.Vector3) => {
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const dist = start.distanceTo(end);

      mid.normalize().multiplyScalar(globeRadius + dist * 0.28);

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const points = curve.getPoints(24);
      const curveGeo = registerDisposable(new THREE.BufferGeometry().setFromPoints(points));
      const line = new THREE.Line(curveGeo, curveLineMat);

      globeGroup.add(line);
      arcRoutes.push({ start, end, curve, line });
    };

    if (nodePositions.length >= 4) {
      buildArc(nodePositions[0], nodePositions[1]);
      buildArc(nodePositions[1], nodePositions[3]);
      buildArc(nodePositions[3], nodePositions[2]);
      buildArc(nodePositions[2], nodePositions[0]);
    }

    // --- 4. DATA PACKET FLOW PARTICLES ---
    // Removed per user request.

    // --- INTERACTIVITY PARALLAX ---
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

      // Rotate globe group
      globeGroup.rotation.y = elapsedTime * 0.035 - target.x * 0.12;
      globeGroup.rotation.x = Math.sin(elapsedTime * 0.01) * 0.01 + target.y * 0.06;

      // Packets animation loop (removed per user request)

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      renderer.dispose();

      // Packets cleanup (removed per user request)

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

export default GlobalNetworkHeroVisual3D;
