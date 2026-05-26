import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const YELLOW = 0xFFD60A;
const YELLOW_BRIGHT = 0xFFE45C;

const VALUES = [
  { name: 'Sustainability', desc: 'Renewable-matched 24/7 — verified, not offset.', pos: [0, 5.5, 0] as [number, number, number] },
  { name: 'Speed', desc: '2.4ms latency — built for AI workloads.', pos: [4.76, 2.75, 0] as [number, number, number] },
  { name: 'Scale', desc: '301MW+ capacity across operating sites.', pos: [4.76, -2.75, 0] as [number, number, number] },
  { name: 'Innovation', desc: 'Liquid cooling, custom power, in-house silicon.', pos: [0, -5.5, 0] as [number, number, number] },
  { name: 'Security', desc: 'Defense-grade physical and digital protection.', pos: [-4.76, -2.75, 0] as [number, number, number] },
  { name: 'Reliability', desc: '99.999% uptime, every facility, every day.', pos: [-4.76, 2.75, 0] as [number, number, number] },
];

// Face positions on the hub cube (index matches facePositions array)
const FACE_POSITIONS: { pos: [number, number, number]; rot: [number, number, number] }[] = [
  { pos: [0, 0, 1.001], rot: [0, 0, 0] },              // 0: front
  { pos: [0, 0, -1.001], rot: [0, Math.PI, 0] },          // 1: back
  { pos: [-1.001, 0, 0], rot: [0, -Math.PI / 2, 0] },     // 2: left
  { pos: [1.001, 0, 0], rot: [0, Math.PI / 2, 0] },      // 3: right
  { pos: [0, 1.001, 0], rot: [-Math.PI / 2, 0, 0] },     // 4: top
  { pos: [0, -1.001, 0], rot: [Math.PI / 2, 0, 0] },      // 5: bottom
];

// Maps value index → hub face index for the connection dot
const DOT_IDX_MAP = [4, 3, 3, 5, 2, 2];
// Maps value index → hub face index for the rotating highlight
const VALUE_TO_FACE = [4, 3, 3, 5, 2, 2];

interface ValueCubeData {
  wireCube: THREE.Group;
  solidCube: THREE.Group;
  line: THREE.Line;
  lineGeo: THREE.BufferGeometry;
  endDot: THREE.Mesh;
  pinDot: THREE.Mesh;
  pulse: THREE.Mesh;
  pulseHalo: THREE.Mesh;
  hubDotPos: THREE.Vector3;
  cubePos: THREE.Vector3;
  activationT: number;
  activated: boolean;
  pulsePhase: number;
}

const AboutHeroDataCenter3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIdx, setHoveredIdx] = useState(-1);
  const hoveredIdxRef = useRef(-1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let W = container.clientWidth || 600;
    let H = container.clientHeight || 500;

    const toDispose: { dispose: () => void }[] = [];
    const reg = <T extends object>(obj: T): T => {
      if (obj && typeof (obj as { dispose?: () => void }).dispose === 'function') {
        toDispose.push(obj as { dispose: () => void });
      }
      return obj;
    };

    // ── Renderer ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // ── Scene & orthographic camera ───────────────────────────────────────
    const scene = new THREE.Scene();
    const frustum = 8;
    const camera = new THREE.OrthographicCamera(
      -frustum * (W / H), frustum * (W / H), frustum, -frustum, -100, 200
    );
    camera.position.set(3, 3, 14);
    camera.lookAt(0, 0, 0);

    // ── Lighting ──────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.7);
    keyLight.position.set(8, 12, 8);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(YELLOW, 0.35);
    fillLight.position.set(-8, 4, 6);
    scene.add(fillLight);

    const root = new THREE.Group();
    scene.add(root);

    // ── Hub ───────────────────────────────────────────────────────────────
    const hubGroup = new THREE.Group();
    const HUB = 2.0;
    root.add(hubGroup);

    const hubEdgesMat = reg(new THREE.LineBasicMaterial({ color: YELLOW, transparent: true, opacity: 0.85 }));
    const hubEdges = new THREE.LineSegments(
      reg(new THREE.EdgesGeometry(reg(new THREE.BoxGeometry(HUB, HUB, HUB)))),
      hubEdgesMat
    );
    hubGroup.add(hubEdges);

    const hubFillMat = reg(new THREE.MeshStandardMaterial({
      color: 0x1a1a14, roughness: 0.5, metalness: 0.4,
      transparent: true, opacity: 0.35, side: THREE.DoubleSide,
    }));
    hubGroup.add(new THREE.Mesh(reg(new THREE.BoxGeometry(HUB * 0.998, HUB * 0.998, HUB * 0.998)), hubFillMat));

    // Rotating highlighted face
    const hubHighlightMat = reg(new THREE.MeshBasicMaterial({
      color: YELLOW, transparent: true, opacity: 0.18, side: THREE.DoubleSide,
    }));
    const hubHighlight = new THREE.Mesh(reg(new THREE.PlaneGeometry(HUB * 0.95, HUB * 0.95)), hubHighlightMat);
    hubHighlight.position.set(...FACE_POSITIONS[2].pos);
    hubHighlight.rotation.set(...FACE_POSITIONS[2].rot);
    hubGroup.add(hubHighlight);

    // Connector dots on each face
    const hubDots: THREE.Mesh[] = [];
    const dotGeo = reg(new THREE.SphereGeometry(0.08, 16, 16));
    const dotMat = reg(new THREE.MeshStandardMaterial({
      color: YELLOW, emissive: YELLOW, emissiveIntensity: 0.7, roughness: 0.3, metalness: 0.7,
    }));
    FACE_POSITIONS.forEach((fp, i) => {
      const dot = new THREE.Mesh(dotGeo, dotMat);
      dot.position.set(...fp.pos);
      const halo = new THREE.Mesh(
        reg(new THREE.SphereGeometry(0.18, 16, 16)),
        reg(new THREE.MeshBasicMaterial({
          color: YELLOW_BRIGHT, transparent: true, opacity: 0.4,
          blending: THREE.AdditiveBlending, depthWrite: false,
        }))
      );
      dot.add(halo);
      dot.userData = { faceIdx: i, halo, basePhase: i * (Math.PI / 3) };
      hubDots.push(dot);
      hubGroup.add(dot);
    });

    // Inner glowing sphere (heartbeat)
    const innerCoreMat = reg(new THREE.MeshStandardMaterial({
      color: YELLOW, emissive: YELLOW, emissiveIntensity: 1.2, roughness: 0.2, metalness: 0.8,
    }));
    const innerCore = new THREE.Mesh(reg(new THREE.SphereGeometry(0.35, 24, 24)), innerCoreMat);
    hubGroup.add(innerCore);

    const coreHaloMat = reg(new THREE.MeshBasicMaterial({
      color: YELLOW, transparent: true, opacity: 0.25,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    const coreHalo = new THREE.Mesh(reg(new THREE.SphereGeometry(0.65, 24, 24)), coreHaloMat);
    hubGroup.add(coreHalo);

    // Gyroscope rings
    const ringGeo = reg(new THREE.TorusGeometry(0.55, 0.015, 8, 48));
    const ringMat = reg(new THREE.MeshStandardMaterial({
      color: YELLOW, emissive: YELLOW, emissiveIntensity: 0.6, roughness: 0.3, metalness: 0.7,
    }));
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    const ring3 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 2;
    ring2.rotation.y = Math.PI / 2;
    hubGroup.add(ring1, ring2, ring3);

    // DGXX canvas label
    const labelCanvas = document.createElement('canvas');
    labelCanvas.width = 512; labelCanvas.height = 256;
    const lCtx = labelCanvas.getContext('2d')!;
    lCtx.fillStyle = '#FFD60A';
    lCtx.font = 'bold 160px monospace';
    lCtx.textAlign = 'center';
    lCtx.textBaseline = 'middle';
    lCtx.fillText('DGXX', 256, 128);
    const dgxxTex = reg(new THREE.CanvasTexture(labelCanvas));
    dgxxTex.colorSpace = THREE.SRGBColorSpace;
    const dgxxLabelMat = reg(new THREE.MeshBasicMaterial({ map: dgxxTex, transparent: true, opacity: 0.85, side: THREE.DoubleSide }));
    const dgxxLabel = new THREE.Mesh(reg(new THREE.PlaneGeometry(1.4, 0.7)), dgxxLabelMat);
    hubGroup.add(dgxxLabel);

    // Inner axis lines
    const innerLineMat = reg(new THREE.LineBasicMaterial({ color: YELLOW, transparent: true, opacity: 0.35 }));
    const innerLines: THREE.Line[] = [
      [new THREE.Vector3(0, HUB / 2, 0), new THREE.Vector3(0, -HUB / 2, 0)],
      [new THREE.Vector3(-HUB / 2, 0, 0), new THREE.Vector3(HUB / 2, 0, 0)],
      [new THREE.Vector3(0, 0, HUB / 2), new THREE.Vector3(0, 0, -HUB / 2)],
    ].map(([a, b]) => {
      const line = new THREE.Line(reg(new THREE.BufferGeometry().setFromPoints([a, b])), innerLineMat);
      hubGroup.add(line);
      return line;
    });

    // ── Value cubes ───────────────────────────────────────────────────────
    const makeWireCube = (size: number): THREE.Group => {
      const g = new THREE.Group();

      const fillMat = reg(new THREE.MeshBasicMaterial({
        color: 0x141416, transparent: true, opacity: 0.3, side: THREE.DoubleSide,
      }));
      const fill = new THREE.Mesh(reg(new THREE.BoxGeometry(size * 0.99, size * 0.99, size * 0.99)), fillMat);
      g.add(fill);

      const dashMat = reg(new THREE.LineDashedMaterial({
        color: YELLOW, dashSize: 0.08, gapSize: 0.05, transparent: true, opacity: 0.55,
      }));
      const edges = new THREE.LineSegments(
        reg(new THREE.EdgesGeometry(reg(new THREE.BoxGeometry(size, size, size)))),
        dashMat
      );
      edges.computeLineDistances();
      g.add(edges);

      // Front slot indicators
      const slotMat = reg(new THREE.MeshBasicMaterial({ color: YELLOW, transparent: true, opacity: 0.4 }));
      for (const yOff of [size * 0.05, -size * 0.05]) {
        const slot = new THREE.Mesh(reg(new THREE.PlaneGeometry(size * 0.6, size * 0.04)), slotMat);
        slot.position.set(0, yOff, size / 2 + 0.005);
        g.add(slot);
      }

      g.userData.edges = edges;
      g.userData.fill = fill;
      return g;
    };

    const makeServerCube = (size: number): THREE.Group => {
      const g = new THREE.Group();

      const bodyMat = reg(new THREE.MeshStandardMaterial({ color: 0xf5f3ec, roughness: 0.4, metalness: 0.2 }));
      const body = new THREE.Mesh(reg(new THREE.BoxGeometry(size, size, size)), bodyMat);
      body.castShadow = true;
      g.add(body);

      g.add(new THREE.LineSegments(
        reg(new THREE.EdgesGeometry(body.geometry)),
        reg(new THREE.LineBasicMaterial({ color: 0x222222, transparent: true, opacity: 0.5 }))
      ));

      // Front face rack slots
      const frontFace = new THREE.Group();
      frontFace.position.z = size / 2 + 0.001;
      for (let i = 0; i < 2; i++) {
        const slot = new THREE.Mesh(
          reg(new THREE.PlaneGeometry(size * 0.65, size * 0.12)),
          reg(new THREE.MeshBasicMaterial({ color: 0x1a1a1a }))
        );
        slot.position.y = -size * 0.05 + i * size * 0.18;
        frontFace.add(slot);
        const led = new THREE.Mesh(
          reg(new THREE.CircleGeometry(0.025, 12)),
          reg(new THREE.MeshBasicMaterial({ color: YELLOW }))
        );
        led.position.set(size * 0.27, slot.position.y, 0.002);
        frontFace.add(led);
      }
      g.add(frontFace);

      // Right face dark panel
      const rightFace = new THREE.Mesh(
        reg(new THREE.PlaneGeometry(size * 0.998, size * 0.998)),
        reg(new THREE.MeshBasicMaterial({ color: 0x0a0a0a }))
      );
      rightFace.rotation.y = Math.PI / 2;
      rightFace.position.x = size / 2 + 0.001;
      g.add(rightFace);

      // Start fully transparent; animated in
      g.traverse(obj => {
        const mesh = obj as THREE.Mesh;
        if (mesh.material && !Array.isArray(mesh.material)) {
          mesh.material.transparent = true;
          mesh.material.opacity = 0;
        }
      });

      return g;
    };

    const valueCubes: ValueCubeData[] = VALUES.map((v, i) => {
      const wireCube = makeWireCube(1.3);
      const solidCube = makeServerCube(1.3);
      wireCube.position.set(...v.pos);
      solidCube.position.set(...v.pos);
      wireCube.userData.cubeIdx = i;
      solidCube.userData.cubeIdx = i;
      root.add(wireCube, solidCube);

      // Connection line (initially a point at the hub dot)
      const lineGeo = reg(new THREE.BufferGeometry());
      const hubDotPos = new THREE.Vector3(...FACE_POSITIONS[DOT_IDX_MAP[i]].pos);
      const cubePos = new THREE.Vector3(...v.pos);
      lineGeo.setFromPoints([hubDotPos.clone(), hubDotPos.clone()]);
      const lineMat = reg(new THREE.LineBasicMaterial({ color: YELLOW, transparent: true, opacity: 0.5 }));
      const line = new THREE.Line(lineGeo, lineMat);
      root.add(line);

      // End dot at cube
      const endDot = new THREE.Mesh(
        reg(new THREE.SphereGeometry(0.06, 12, 12)),
        reg(new THREE.MeshStandardMaterial({ color: YELLOW, emissive: YELLOW, emissiveIntensity: 0.5 }))
      );
      endDot.position.copy(cubePos);
      endDot.visible = false;
      root.add(endDot);

      // Black connector pin (diagonal cubes only, shown after draw)
      const pinDot = new THREE.Mesh(
        reg(new THREE.SphereGeometry(0.07, 12, 12)),
        reg(new THREE.MeshBasicMaterial({ color: 0x0a0a0a }))
      );
      pinDot.visible = false;
      root.add(pinDot);

      // Data pulse sphere traveling along the line
      const pulseMat = reg(new THREE.MeshBasicMaterial({
        color: 0xfffce8, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      const pulse = new THREE.Mesh(reg(new THREE.SphereGeometry(0.07, 12, 12)), pulseMat);
      const pulseHaloMat = reg(new THREE.MeshBasicMaterial({
        color: YELLOW_BRIGHT, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false,
      }));
      const pulseHalo = new THREE.Mesh(reg(new THREE.SphereGeometry(0.14, 12, 12)), pulseHaloMat);
      pulse.add(pulseHalo);
      root.add(pulse);

      return {
        wireCube, solidCube, line, lineGeo, endDot, pinDot, pulse, pulseHalo,
        hubDotPos, cubePos,
        activationT: 0, activated: false,
        pulsePhase: i * 0.4,
      };
    });

    // ── Mouse interaction ──────────────────────────────────────────────────
    const mouse = new THREE.Vector2();
    const raycaster = new THREE.Raycaster();
    let mouseX = 0, mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / W) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / H) * 2 + 1;
      mouseX = (e.clientX - rect.left) / W - 0.5;
      mouseY = (e.clientY - rect.top) / H - 0.5;

      raycaster.setFromCamera(mouse, camera);
      const targets: THREE.Object3D[] = valueCubes.flatMap(vc => [vc.wireCube, vc.solidCube]);
      const hits = raycaster.intersectObjects(targets, true);

      let found = -1;
      if (hits.length > 0) {
        let obj: THREE.Object3D | null = hits[0].object;
        while (obj && obj.userData.cubeIdx === undefined) obj = obj.parent;
        if (obj) found = obj.userData.cubeIdx as number;
      }

      if (found !== hoveredIdxRef.current) {
        hoveredIdxRef.current = found;
        setHoveredIdx(found);
      }
    };

    const handleMouseLeave = () => {
      hoveredIdxRef.current = -1;
      setHoveredIdx(-1);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // ── Animation loop ─────────────────────────────────────────────────────
    let elapsed = 0;
    let lastTime = performance.now();
    let frameId = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const now = performance.now();
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      elapsed += dt;
      const hovIdx = hoveredIdxRef.current;

      // Gentle scene rotation from mouse
      root.rotation.y += (mouseX * 0.2 - root.rotation.y) * 0.04;
      root.rotation.x += (-mouseY * 0.08 - root.rotation.x) * 0.04;

      // Hub fade-in (0 → 0.8s)
      const hubFadeT = Math.min(1, elapsed / 0.8);
      hubEdgesMat.opacity = 0.85 * hubFadeT;
      hubFillMat.opacity = 0.35 * hubFadeT;

      // Hub connector dot pulse
      hubDots.forEach((dot, i) => {
        const fade = Math.min(1, Math.max(0, (elapsed - 0.3 - i * 0.1) / 0.4));
        const p = 0.8 + Math.sin(elapsed * 2.5 + dot.userData.basePhase) * 0.2;
        (dot.material as THREE.MeshStandardMaterial).emissiveIntensity = (0.7 + p * 0.5) * fade;
        dot.scale.setScalar(fade * (0.9 + p * 0.15));
        ((dot.userData.halo as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.4 * fade * p;
      });

      // Highlighted face cycles through value positions
      const faceIdx = VALUE_TO_FACE[Math.floor((elapsed * 0.5) % 6)];
      const fp = FACE_POSITIONS[faceIdx];
      hubHighlight.position.set(...fp.pos);
      hubHighlight.rotation.set(...fp.rot);
      hubHighlightMat.opacity = 0.18 * hubFadeT * (0.7 + Math.sin(elapsed * 2) * 0.3);

      hubGroup.rotation.y = Math.sin(elapsed * 0.15) * 0.04;

      // Heartbeat (double-pulse, 1.4s cycle)
      const t = elapsed % 1.4;
      const heartbeat =
        Math.exp(-Math.pow(t * 8, 2)) +
        Math.exp(-Math.pow((t - 0.25) * 8, 2)) * 0.6;

      innerCore.scale.setScalar((0.9 + heartbeat * 0.25) * hubFadeT);
      innerCoreMat.emissiveIntensity = 1.2 + heartbeat * 0.8;
      coreHalo.scale.setScalar((1 + heartbeat * 0.35) * hubFadeT);
      coreHaloMat.opacity = (0.2 + heartbeat * 0.25) * hubFadeT;

      // Gyroscope rings
      ring1.rotation.z = elapsed * 0.6;
      ring2.rotation.x = elapsed * 0.4;
      ring3.rotation.x = elapsed * 0.5;
      ring3.rotation.y = elapsed * 0.3;
      ringMat.emissiveIntensity = 0.5 + heartbeat * 0.4;

      // DGXX label
      dgxxLabel.rotation.y = elapsed * 0.3;
      dgxxLabelMat.opacity = 0.85 * hubFadeT * (0.7 + heartbeat * 0.3);

      // Inner axis lines
      innerLineMat.opacity = (0.25 + heartbeat * 0.3) * hubFadeT;
      // (suppress unused-variable warning for innerLines)
      void innerLines;

      // Value cubes — staggered activation starting at 0.8s
      valueCubes.forEach((vc, i) => {
        const activateAt = 0.8 + i * 0.35;
        const activationT = Math.min(1, Math.max(0, (elapsed - activateAt) / 0.6));
        const isHovered = hovIdx === i;
        const hoverBoost = isHovered ? 1 : 0;

        vc.activationT = activationT;
        if (activationT >= 1) vc.activated = true;

        // Line draws from hub dot → cube
        const drawT = Math.min(1, Math.max(0, (elapsed - activateAt + 0.1) / 0.4));
        const endPt = vc.hubDotPos.clone().lerp(vc.cubePos, drawT);
        const posArr = vc.lineGeo.attributes.position.array as Float32Array;
        posArr[0] = vc.hubDotPos.x; posArr[1] = vc.hubDotPos.y; posArr[2] = vc.hubDotPos.z;
        posArr[3] = endPt.x; posArr[4] = endPt.y; posArr[5] = endPt.z;
        vc.lineGeo.attributes.position.needsUpdate = true;
        (vc.line.material as THREE.LineBasicMaterial).opacity = (0.45 + hoverBoost * 0.4) * drawT;

        vc.endDot.visible = drawT >= 1;

        // Connector pin (diagonal cubes: 1, 2, 4, 5)
        if ((i === 1 || i === 2 || i === 4 || i === 5) && drawT >= 1) {
          vc.pinDot.visible = true;
          const floatOff = Math.sin(elapsed * 0.6 + i * Math.PI / 3) * 0.08;
          const pinPos = vc.hubDotPos.clone().lerp(vc.cubePos, 0.78);
          pinPos.y += floatOff * 0.78;
          vc.pinDot.position.copy(pinPos);
        }

        // Wireframe fades as cube activates
        const wireOpacity = 1 - activationT * 0.55;
        if (vc.wireCube.userData.edges) {
          ((vc.wireCube.userData.edges as THREE.LineSegments).material as THREE.LineDashedMaterial).opacity =
            0.55 * wireOpacity + hoverBoost * 0.3;
          ((vc.wireCube.userData.fill as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity =
            0.3 * wireOpacity;
        }

        // Solid cube fades in
        vc.solidCube.traverse(obj => {
          const mesh = obj as THREE.Mesh;
          if (mesh.material && !Array.isArray(mesh.material)) {
            mesh.material.opacity = activationT;
          }
        });

        // Floating y-oscillation
        const floatY = Math.sin(elapsed * 0.6 + i * Math.PI / 3) * 0.08;
        const basePos = new THREE.Vector3(...VALUES[i].pos);
        basePos.y += floatY;
        vc.wireCube.position.copy(basePos);
        vc.solidCube.position.copy(basePos);
        vc.endDot.position.copy(basePos);

        // Scale boost on hover
        const targetScale = isHovered ? 1.08 : 1;
        const s = vc.wireCube.scale.x + (targetScale - vc.wireCube.scale.x) * 0.15;
        vc.wireCube.scale.setScalar(s);
        vc.solidCube.scale.setScalar(s);

        // Data pulse traveling hub → cube
        if (vc.activated) {
          const pulseT = ((elapsed * (isHovered ? 1.2 : 0.6)) + vc.pulsePhase) % 1;
          const pulsePos = vc.hubDotPos.clone().lerp(vc.cubePos, pulseT);
          pulsePos.y += floatY * pulseT;
          vc.pulse.position.copy(pulsePos);
          const fade = pulseT < 0.1 ? pulseT / 0.1 : pulseT > 0.9 ? (1 - pulseT) / 0.1 : 1;
          (vc.pulse.material as THREE.MeshBasicMaterial).opacity = fade;
          (vc.pulseHalo.material as THREE.MeshBasicMaterial).opacity = 0.5 * fade;
          const ps = isHovered ? 1.3 : 1;
          vc.pulse.scale.setScalar(ps);
          vc.pulseHalo.scale.setScalar(ps);
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      W = container.clientWidth;
      H = container.clientHeight;
      const a = W / H;
      camera.left = -frustum * a;
      camera.right = frustum * a;
      camera.top = frustum;
      camera.bottom = -frustum;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      toDispose.forEach(d => { try { d.dispose(); } catch (_) { } });
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="w-full relative min-h-[460px] lg:min-h-[580px] flex flex-col justify-between p-6 bg-gradient-to-br from-[#06070a]/60 to-[#0e111a]/40 rounded-[2.5rem] backdrop-blur-xl overflow-hidden select-none shadow-[0_0_50px_rgba(0,0,0,0.8)]">

      {/* Three.js canvas */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full z-10" />

    </div>
  );
};

export default AboutHeroDataCenter3D;
