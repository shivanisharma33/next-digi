import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const CubeGridNetwork3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.cursor = 'grab';
    container.appendChild(canvas);

    let W = container.clientWidth || 600;
    let H = container.clientHeight || 450;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H, false);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene = new THREE.Scene();

    const frustum = 9;
    const camera = new THREE.OrthographicCamera(
      -frustum * (W / H), frustum * (W / H), frustum, -frustum, -100, 200
    );
    camera.position.set(10, 8, 14);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.55);
    keyLight.position.set(10, 12, 8);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xffd60a, 0.2);
    fillLight.position.set(-8, 4, 6);
    scene.add(fillLight);

    // ===== Build cluster =====
    const cubeDefs: Array<[number, number, number, boolean]> = [];
    const add = (x: number, y: number, z: number, isSolid = false) => {
      cubeDefs.push([x, y, z, isSolid]);
    };

    const heightMap: Record<string, number> = {
      '0,0': 6, '1,0': 6, '2,0': 5, '3,0': 4, '4,0': 3, '5,0': 2, '6,0': 1,
      '0,1': 5, '1,1': 5, '2,1': 4, '3,1': 3, '4,1': 2, '5,1': 1,
      '0,2': 4, '1,2': 4, '2,2': 3, '3,2': 2, '4,2': 1,
      '0,3': 3, '1,3': 3, '2,3': 2, '3,3': 1,
    };

    const solidCubes = new Set<string>([
      '0,5,0', '1,4,0',
      '2,3,0', '1,3,1',
      '3,2,0', '2,2,1', '1,2,2',
      '3,1,1', '2,1,2',
      '4,0,1', '5,0,2',
    ]);

    Object.entries(heightMap).forEach(([key, maxY]) => {
      const [xs, zs] = key.split(',');
      const x = parseInt(xs);
      const z = parseInt(zs);
      for (let y = 0; y < maxY; y++) {
        add(x, y, z, solidCubes.has(`${x},${y},${z}`));
      }
    });

    add(6, 0, 1); add(6, 0, 2); add(7, 0, 2); add(5, 0, 3); add(6, 0, 3);

    add(5, -1, 2); add(6, -1, 2);
    add(5, -2, 2); add(6, -2, 2);
    add(5, -3, 2);
    add(5, -1, 3); add(6, -1, 3);

    const satStartIdx = cubeDefs.length;
    add(9, 3, 0, true); add(10, 3, 0, true); add(11, 3, 0, true);
    add(9, 4, 0, true); add(10, 4, 0, true); add(11, 4, 0, true); add(12, 4, 0);
    add(10, 5, 0); add(11, 5, 0);
    add(9, 4, 1); add(10, 4, 1, true); add(11, 4, 1);
    add(10, 3, 1);
    add(11, 2, 0, true); add(11, 1, 0); add(12, 1, 0);

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    cubeDefs.forEach(([x, y]) => {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    });
    const cx = (minX + maxX) / 2;
    const cy = (minY + maxY) / 2;

    const CUBE = 0.82;
    const GRID = 1.0;
    const YELLOW = 0xffd60a;
    const YELLOW_BRIGHT = 0xffe45c;

    const cubeGeo = new THREE.BoxGeometry(CUBE, CUBE, CUBE);
    const edgeGeo = new THREE.EdgesGeometry(cubeGeo);
    const cornerGeo = new THREE.SphereGeometry(0.065, 12, 12);

    const disposables: Array<{ dispose: () => void }> = [cubeGeo, edgeGeo, cornerGeo];

    const makeFaceMat = (isSolid: boolean, isSat: boolean) =>
      new THREE.MeshStandardMaterial({
        color: isSolid ? (isSat ? 0x282318 : 0x1d1a14) : 0x131316,
        roughness: isSolid ? 0.55 : 0.7,
        metalness: isSolid ? 0.5 : 0.3,
        transparent: true,
        opacity: isSolid ? 0.94 : 0.5,
        side: THREE.DoubleSide,
      });

    const root = new THREE.Group();
    scene.add(root);

    type CubeUserData = {
      id: number;
      gridPos: [number, number, number];
      isSolid: boolean;
      isSat: boolean;
      face: THREE.Mesh;
      edges: THREE.LineSegments;
      corners: THREE.Mesh[];
      baseEdgeOpacity: number;
      intensity: number;
      depthNeighbors?: Array<{ idx: number; distance: number }>;
    };

    const cubeObjects: Array<THREE.Group & { userData: CubeUserData }> = [];

    const half = CUBE / 2;
    const cornerOffsets: Array<[number, number, number]> = [
      [-half, -half, -half], [half, -half, -half], [half, half, -half], [-half, half, -half],
      [-half, -half, half], [half, -half, half], [half, half, half], [-half, half, half],
    ];

    cubeDefs.forEach((def, idx) => {
      const [x, y, z, isSolid] = def;
      const isSat = idx >= satStartIdx;

      const group = new THREE.Group();

      const faceMat = makeFaceMat(isSolid, isSat);
      disposables.push(faceMat);
      const face = new THREE.Mesh(cubeGeo, faceMat);
      group.add(face);

      const baseEdgeOp = isSolid ? 0.78 : 0.55;
      const dashMat = new THREE.LineDashedMaterial({
        color: YELLOW,
        dashSize: 0.07,
        gapSize: 0.045,
        transparent: true,
        opacity: baseEdgeOp,
        linewidth: 1,
      });
      disposables.push(dashMat);
      const edges = new THREE.LineSegments(edgeGeo, dashMat);
      edges.computeLineDistances();
      group.add(edges);

      const corners: THREE.Mesh[] = [];
      cornerOffsets.forEach((offset, ci) => {
        const cornerMat = new THREE.MeshBasicMaterial({
          color: YELLOW_BRIGHT,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        disposables.push(cornerMat);
        const corner = new THREE.Mesh(cornerGeo, cornerMat);
        corner.position.set(offset[0], offset[1], offset[2]);
        corner.userData = { cornerIdx: ci, basePhase: Math.random() * Math.PI * 2 };
        corners.push(corner);
        group.add(corner);
      });

      group.position.set((x - cx) * GRID, (y - cy) * GRID, z * GRID);

      group.userData = {
        id: idx,
        gridPos: [x, y, z],
        isSolid,
        isSat,
        face,
        edges,
        corners,
        baseEdgeOpacity: baseEdgeOp,
        intensity: 0,
      };

      root.add(group);
      cubeObjects.push(group as THREE.Group & { userData: CubeUserData });
    });

    // ===== Adjacency =====
    const getAdjacentIndices = (cubeIdx: number) => {
      const [x, y, z] = cubeObjects[cubeIdx].userData.gridPos;
      const adjacent: number[] = [];
      cubeObjects.forEach((other, oi) => {
        if (oi === cubeIdx) return;
        const [ox, oy, oz] = other.userData.gridPos;
        const dx = Math.abs(ox - x);
        const dy = Math.abs(oy - y);
        const dz = Math.abs(oz - z);
        const sum = dx + dy + dz;
        if (sum === 1 || (sum === 2 && Math.max(dx, dy, dz) === 1)) {
          adjacent.push(oi);
        }
      });
      return adjacent;
    };

    const adjacency = cubeObjects.map((_, idx) => getAdjacentIndices(idx));

    const lowIndices = cubeObjects
      .map((c, i) => ({ i, y: c.userData.gridPos[1] }))
      .filter((c) => c.y <= 1)
      .map((c) => c.i);

    type Packet = {
      path: number[];
      progress: number;
      speed: number;
      intensity: number;
      alive: boolean;
      fadeOut: number;
      packetType: number;
    };

    const createPacket = (): Packet => {
      let startIdx: number;
      if (Math.random() < 0.6) {
        const validStarts = lowIndices.filter((i) => adjacency[i].length > 0);
        startIdx = validStarts[Math.floor(Math.random() * validStarts.length)];
      } else {
        const allValid = cubeObjects.map((_, i) => i).filter((i) => adjacency[i].length > 0);
        startIdx = allValid[Math.floor(Math.random() * allValid.length)];
      }

      const path = [startIdx];
      const visited = new Set([startIdx]);
      const pathLength = 5 + Math.floor(Math.random() * 4);
      const packetType = Math.random();

      let current = startIdx;
      for (let i = 1; i < pathLength; i++) {
        const [, currentY, czg] = cubeObjects[current].userData.gridPos;
        const adj = adjacency[current].filter((a) => !visited.has(a));
        if (adj.length === 0) break;

        const weights = adj.map((a) => {
          const [, ay, az] = cubeObjects[a].userData.gridPos;
          const dy = ay - currentY;
          const dz = az - czg;
          let w = 1;
          if (packetType < 0.45) {
            if (dy > 0) w = 5;
            else if (dy === 0) w = 2.5;
            else w = 0.5;
          } else if (packetType < 0.8) {
            if (Math.abs(dz) > 0) w = 5;
            else if (dy > 0) w = 2.5;
            else if (dy === 0) w = 1.5;
            else w = 0.6;
          } else {
            if (dy > 0) w = 2.5;
            else if (dy === 0) w = 2;
            else w = 1;
            if (Math.abs(dz) > 0) w += 1;
          }
          return w;
        });
        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let r = Math.random() * totalWeight;
        let pick = adj[0];
        for (let j = 0; j < adj.length; j++) {
          r -= weights[j];
          if (r <= 0) { pick = adj[j]; break; }
        }

        path.push(pick);
        visited.add(pick);
        current = pick;
      }

      return {
        path,
        progress: 0,
        speed: 1.6 + Math.random() * 0.7,
        intensity: 0.9 + Math.random() * 0.1,
        alive: true,
        fadeOut: 0,
        packetType,
      };
    };

    let packets: Packet[] = [];
    const MAX_PACKETS = 8;
    const refillPackets = () => {
      while (packets.length < MAX_PACKETS) packets.push(createPacket());
    };
    refillPackets();

    // ===== Interaction =====
    let mouseX = 0, mouseY = 0;
    let currentRotY = 0, currentRotX = 0;
    let isDragging = false;
    let dragStartX = 0, dragStartY = 0;
    let dragOffsetY = 0, dragOffsetX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        dragOffsetY = (e.clientX - dragStartX) * 0.008;
        dragOffsetX = (e.clientY - dragStartY) * 0.004;
      } else {
        const rect = container.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5);
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5);
      }
    };
    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    };
    const handleMouseUp = () => {
      if (isDragging) {
        currentRotY += dragOffsetY;
        currentRotX += dragOffsetX;
        dragOffsetY = 0;
        dragOffsetX = 0;
        isDragging = false;
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Precompute depth neighbors once
    cubeObjects.forEach((cube, idx) => {
      const [x, y, z] = cube.userData.gridPos;
      const depthNeighbors: Array<{ idx: number; distance: number }> = [];
      cubeObjects.forEach((other, oi) => {
        if (oi === idx) return;
        const [ox, oy, oz] = other.userData.gridPos;
        if (ox === x && oy === y && Math.abs(oz - z) === 1) {
          depthNeighbors.push({ idx: oi, distance: 1 });
        } else if (ox === x && oy === y && Math.abs(oz - z) === 2) {
          depthNeighbors.push({ idx: oi, distance: 2 });
        }
      });
      cube.userData.depthNeighbors = depthNeighbors;
    });

    const clock = new THREE.Clock();
    let elapsed = 0;
    let frameId = 0;

    const animate = () => {
      const dt = clock.getDelta();
      elapsed += dt;
      frameId = requestAnimationFrame(animate);

      const targetRotY = mouseX * 0.25 + dragOffsetY + currentRotY;
      const targetRotX = -mouseY * 0.08 + dragOffsetX + currentRotX;
      root.rotation.y += (targetRotY - root.rotation.y) * 0.04;
      root.rotation.x += (targetRotX - root.rotation.x) * 0.04;

      cubeObjects.forEach((c) => { c.userData.intensity = 0; });

      packets.forEach((packet) => {
        if (!packet.alive) {
          packet.fadeOut += dt;
          return;
        }
        packet.progress += packet.speed * dt;

        const headFloat = packet.progress;
        const headIdx = Math.floor(headFloat);

        if (headIdx >= packet.path.length) {
          packet.alive = false;
          return;
        }

        const headFrac = headFloat - headIdx;
        const headCube = cubeObjects[packet.path[headIdx]];
        if (headCube) {
          const intensity = packet.intensity * (1 - headFrac * 0.3);
          headCube.userData.intensity = Math.max(headCube.userData.intensity, intensity);

          headCube.userData.depthNeighbors?.forEach(({ idx: nIdx, distance }) => {
            const neighborCube = cubeObjects[nIdx];
            const activateAt = distance === 1 ? 0.2 : 0.5;
            if (headFrac > activateAt) {
              const rippleProgress = Math.min(1, (headFrac - activateAt) / 0.4);
              const rippleIntensity = intensity * 0.6 * rippleProgress / distance;
              neighborCube.userData.intensity = Math.max(neighborCube.userData.intensity, rippleIntensity);
            }
          });
        }

        for (let i = 1; i <= 3; i++) {
          const trailIdx = headIdx - i;
          if (trailIdx < 0) break;
          const trailCube = cubeObjects[packet.path[trailIdx]];
          if (trailCube) {
            const trailIntensity = packet.intensity * Math.pow(0.5, i) * (1 - headFrac * 0.2);
            trailCube.userData.intensity = Math.max(trailCube.userData.intensity, trailIntensity);
          }
        }
      });

      packets = packets.filter((p) => p.alive || p.fadeOut < 0.3);
      refillPackets();

      cubeObjects.forEach((cube) => {
        const ud = cube.userData;
        const intensity = ud.intensity;

        ud.corners.forEach((corner) => {
          const basePhase = (corner.userData as { basePhase: number }).basePhase;
          const sparkle = 0.85 + Math.sin(elapsed * 6 + basePhase) * 0.15;
          (corner.material as THREE.MeshBasicMaterial).opacity = intensity * sparkle;
          corner.scale.setScalar(0.7 + intensity * 0.6);
        });

        (ud.edges.material as THREE.LineDashedMaterial).opacity = ud.baseEdgeOpacity + intensity * 0.3;
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      W = container.clientWidth || W;
      H = container.clientHeight || H;
      const a = W / H;
      camera.left = -frustum * a;
      camera.right = frustum * a;
      camera.top = frustum;
      camera.bottom = -frustum;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H, false);
    };
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      if (canvas.parentNode === container) container.removeChild(canvas);
    };
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default CubeGridNetwork3D;
