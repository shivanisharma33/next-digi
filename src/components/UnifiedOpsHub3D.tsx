import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const YELLOW = 0xffd60a;
const YELLOW_BRIGHT = 0xffe45c;

const FACE_POSITIONS: Array<{ pos: [number, number, number]; rot: [number, number, number] }> = [
  { pos: [0, 0, 1.0001], rot: [0, 0, 0] },
  { pos: [0, 0, -1.0001], rot: [0, Math.PI, 0] },
  { pos: [-1.0001, 0, 0], rot: [0, -Math.PI / 2, 0] },
  { pos: [1.0001, 0, 0], rot: [0, Math.PI / 2, 0] },
  { pos: [0, 1.0001, 0], rot: [-Math.PI / 2, 0, 0] },
  { pos: [0, -1.0001, 0], rot: [Math.PI / 2, 0, 0] },
];

const VALUES: Array<{ name: string; pos: [number, number, number] }> = [
  { name: 'Sustainability', pos: [0, 5.5, 0] },
  { name: 'Speed', pos: [4.76, 2.75, 0] },
  { name: 'Scale', pos: [4.76, -2.75, 0] },
  { name: 'Innovation', pos: [0, -5.5, 0] },
  { name: 'Security', pos: [-4.76, -2.75, 0] },
  { name: 'Reliability', pos: [-4.76, 2.75, 0] },
];

const VALUE_TO_FACE = [4, 3, 3, 5, 2, 2];

const makeDGXXLogo = (): THREE.CanvasTexture => {
  const c = document.createElement('canvas');
  c.width = 256;
  c.height = 256;
  const ctx = c.getContext('2d')!;

  ctx.fillStyle = '#0e0e10';
  ctx.fillRect(0, 0, 256, 256);

  ctx.fillStyle = '#FFD60A';
  const cx = 128;
  const cy = 128;

  ctx.beginPath();
  ctx.moveTo(cx - 30, cy - 85);
  ctx.lineTo(cx, cy - 85);
  ctx.arc(cx, cy, 85, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(cx - 30, cy + 85);
  ctx.closePath();
  ctx.fill();

  const rr = (x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r);
    ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h);
    ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r);
    ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
    ctx.fill();
  };
  rr(cx - 80, cy - 45, 45, 22, 4);
  rr(cx - 80, cy + 23, 45, 22, 4);

  ctx.fillStyle = '#0e0e10';
  ctx.fillRect(cx - 30, cy - 45, 60, 22);
  ctx.fillRect(cx - 30, cy + 23, 60, 22);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
};

const makeServerCube = (size: number) => {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(size, size, size),
    new THREE.MeshStandardMaterial({ color: 0x0e0e10, roughness: 0.5, metalness: 0.3 })
  );
  group.add(body);
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(body.geometry),
    new THREE.LineBasicMaterial({ color: YELLOW, transparent: true, opacity: 0.9 })
  );
  group.add(edges);
  group.userData = { edges, body };
  return group;
};

const makeWireCube = (size: number) => {
  const group = new THREE.Group();
  const fill = new THREE.Mesh(
    new THREE.BoxGeometry(size * 0.99, size * 0.99, size * 0.99),
    new THREE.MeshBasicMaterial({ color: 0x141416, transparent: true, opacity: 0.3, side: THREE.DoubleSide })
  );
  group.add(fill);
  const edges = new THREE.LineSegments(
    new THREE.EdgesGeometry(new THREE.BoxGeometry(size, size, size)),
    new THREE.LineBasicMaterial({ color: YELLOW, transparent: true, opacity: 0.55 })
  );
  group.add(edges);
  group.userData = { edges, fill };
  return group;
};

const UnifiedOpsHub3D = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const canvas = document.createElement('canvas');
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    container.appendChild(canvas);

    let W = container.clientWidth || 600;
    let H = container.clientHeight || 260;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H, false);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    const scene = new THREE.Scene();

    const frustum = 8;
    const camera = new THREE.OrthographicCamera(
      -frustum * (W / H), frustum * (W / H), frustum, -frustum, -100, 200
    );
    camera.position.set(3, 3, 14);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.7);
    keyLight.position.set(8, 12, 8);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(YELLOW, 0.35);
    fillLight.position.set(-8, 4, 6);
    scene.add(fillLight);

    const root = new THREE.Group();
    scene.add(root);

    const HUB_SIZE = 2.0;
    const hubGroup = new THREE.Group();
    root.add(hubGroup);

    const hubEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(HUB_SIZE, HUB_SIZE, HUB_SIZE)),
      new THREE.LineBasicMaterial({ color: YELLOW, transparent: true, opacity: 0.85 })
    );
    hubGroup.add(hubEdges);

    const hubFill = new THREE.Mesh(
      new THREE.BoxGeometry(HUB_SIZE * 0.998, HUB_SIZE * 0.998, HUB_SIZE * 0.998),
      new THREE.MeshStandardMaterial({
        color: 0x1a1a14,
        roughness: 0.5,
        metalness: 0.4,
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
      })
    );
    hubGroup.add(hubFill);

    const hubFaces = FACE_POSITIONS.map((fp) => ({
      pos: new THREE.Vector3(fp.pos[0] * HUB_SIZE / 2, fp.pos[1] * HUB_SIZE / 2, fp.pos[2] * HUB_SIZE / 2),
      rot: fp.rot,
    }));

    const hubHighlight = new THREE.Mesh(
      new THREE.PlaneGeometry(HUB_SIZE * 0.95, HUB_SIZE * 0.95),
      new THREE.MeshBasicMaterial({ color: YELLOW, transparent: true, opacity: 0.18, side: THREE.DoubleSide })
    );
    hubHighlight.position.copy(hubFaces[2].pos);
    hubHighlight.rotation.set(...hubFaces[2].rot);
    hubGroup.add(hubHighlight);

    const hubDots: THREE.Mesh[] = [];
    const dotGeo = new THREE.SphereGeometry(0.08, 16, 16);
    hubFaces.forEach((fp, i) => {
      const dot = new THREE.Mesh(
        dotGeo,
        new THREE.MeshStandardMaterial({
          color: YELLOW,
          emissive: YELLOW,
          emissiveIntensity: 0.7,
          roughness: 0.3,
          metalness: 0.7,
        })
      );
      dot.position.copy(fp.pos);
      const halo = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 16, 16),
        new THREE.MeshBasicMaterial({
          color: YELLOW_BRIGHT,
          transparent: true,
          opacity: 0.4,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      dot.add(halo);
      if (i === 0 || i === 1) dot.visible = false;
      dot.userData = { halo, basePhase: i * (Math.PI / 3) };
      hubDots.push(dot);
      hubGroup.add(dot);
    });

    const dgxxTex = makeDGXXLogo();
    const miniCube = (() => {
      const size = 0.75;
      const grp = new THREE.Group();
      const faceMats: THREE.MeshBasicMaterial[] = [];
      for (let i = 0; i < 6; i++) {
        faceMats.push(new THREE.MeshBasicMaterial({ map: dgxxTex, transparent: false, side: THREE.FrontSide }));
      }
      const logoCube = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), faceMats);
      grp.add(logoCube);
      const wire = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(size, size, size)),
        new THREE.LineBasicMaterial({ color: YELLOW, transparent: false, opacity: 1.0 })
      );
      grp.add(wire);
      hubGroup.add(grp);
      return grp;
    })();

    type ValueCube = {
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
      activated: boolean;
      pulsePhase: number;
    };

    const valueCubes: ValueCube[] = [];

    VALUES.forEach((v, i) => {
      const wireCube = makeWireCube(1.3);
      const solidCube = makeServerCube(1.3);
      wireCube.position.set(...v.pos);
      solidCube.position.set(...v.pos);
      solidCube.traverse((obj) => {
        const mesh = obj as THREE.Mesh | THREE.LineSegments;
        const mat = (mesh as { material?: THREE.Material | THREE.Material[] }).material;
        if (mat && !Array.isArray(mat)) {
          const cloned = (mat as THREE.Material & { clone: () => THREE.Material }).clone();
          (cloned as THREE.Material).transparent = true;
          (cloned as THREE.Material & { opacity: number }).opacity = 0;
          (mesh as THREE.Mesh).material = cloned;
        }
      });
      root.add(wireCube);
      root.add(solidCube);

      const lineGeo = new THREE.BufferGeometry();
      const dotIdx = VALUE_TO_FACE[i];
      const hubDotPos = hubFaces[dotIdx].pos.clone();
      const cubePos = new THREE.Vector3(...v.pos);
      lineGeo.setFromPoints([hubDotPos.clone(), hubDotPos.clone()]);
      const lineMat = new THREE.LineBasicMaterial({ color: YELLOW, transparent: true, opacity: 0.5 });
      const line = new THREE.Line(lineGeo, lineMat);
      root.add(line);

      const endDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.06, 12, 12),
        new THREE.MeshStandardMaterial({ color: YELLOW, emissive: YELLOW, emissiveIntensity: 0.5 })
      );
      endDot.position.copy(cubePos);
      endDot.visible = false;
      root.add(endDot);

      const pinDot = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0x0a0a0a })
      );
      pinDot.visible = false;
      root.add(pinDot);

      const pulse = new THREE.Mesh(
        new THREE.SphereGeometry(0.07, 12, 12),
        new THREE.MeshBasicMaterial({
          color: 0xfffce8,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      const pulseHalo = new THREE.Mesh(
        new THREE.SphereGeometry(0.14, 12, 12),
        new THREE.MeshBasicMaterial({
          color: YELLOW_BRIGHT,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      pulse.add(pulseHalo);
      root.add(pulse);

      valueCubes.push({
        wireCube,
        solidCube,
        line,
        lineGeo,
        endDot,
        pinDot,
        pulse,
        pulseHalo,
        hubDotPos,
        cubePos,
        activated: false,
        pulsePhase: i * 0.4,
      });
    });

    // Scale the entire layout to fit the card area.
    root.scale.setScalar(0.82);

    const clock = new THREE.Clock();
    let elapsed = 0;
    let rafId = 0;
    let mouseX = 0;
    let mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = (e.clientX - rect.left) / rect.width - 0.5;
      mouseY = (e.clientY - rect.top) / rect.height - 0.5;
    };
    const onMouseLeave = () => {
      mouseX = 0;
      mouseY = 0;
    };
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', onMouseLeave);

    const animate = () => {
      const dt = clock.getDelta();
      elapsed += dt;
      rafId = requestAnimationFrame(animate);

      const targetRotY = mouseX * 0.25;
      const targetRotX = -mouseY * 0.1;
      root.rotation.y += (targetRotY - root.rotation.y) * 0.05;
      root.rotation.x += (targetRotX - root.rotation.x) * 0.05;

      const hubFadeT = Math.min(1, elapsed / 0.8);
      (hubEdges.material as THREE.LineBasicMaterial).opacity = 0.85 * hubFadeT;
      (hubFill.material as THREE.MeshStandardMaterial).opacity = 0.35 * hubFadeT;

      hubDots.forEach((dot, i) => {
        const dotFade = Math.min(1, Math.max(0, (elapsed - 0.3 - i * 0.1) / 0.4));
        const pulse = 0.8 + Math.sin(elapsed * 2.5 + (dot.userData.basePhase as number)) * 0.2;
        (dot.material as THREE.MeshStandardMaterial).emissiveIntensity = (0.7 + pulse * 0.5) * dotFade;
        dot.scale.setScalar(dotFade * (0.9 + pulse * 0.15));
        const halo = dot.userData.halo as THREE.Mesh;
        (halo.material as THREE.MeshBasicMaterial).opacity = 0.4 * dotFade * pulse;
      });

      const highlightT = (elapsed * 0.5) % 6;
      const highlightIdx = Math.floor(highlightT);
      const highlightFp = hubFaces[VALUE_TO_FACE[highlightIdx]];
      hubHighlight.position.copy(highlightFp.pos);
      hubHighlight.rotation.set(...highlightFp.rot);
      (hubHighlight.material as THREE.MeshBasicMaterial).opacity =
        0.18 * hubFadeT * (0.7 + Math.sin(elapsed * 2) * 0.3);

      hubGroup.rotation.y = Math.sin(elapsed * 0.15) * 0.04;

      miniCube.rotation.y = elapsed * 0.7;
      miniCube.rotation.x = elapsed * 0.4;
      miniCube.position.y = Math.sin(elapsed * 1.0) * 0.06;
      miniCube.scale.setScalar(hubFadeT);

      valueCubes.forEach((vc, i) => {
        const activateAt = 0.8 + i * 0.35;
        const activationT = Math.min(1, Math.max(0, (elapsed - activateAt) / 0.6));
        if (activationT >= 1) vc.activated = true;

        const drawT = Math.min(1, Math.max(0, (elapsed - activateAt + 0.1) / 0.4));
        const endPoint = vc.hubDotPos.clone().lerp(vc.cubePos, drawT);
        const positions = vc.lineGeo.attributes.position.array as Float32Array;
        positions[0] = vc.hubDotPos.x;
        positions[1] = vc.hubDotPos.y;
        positions[2] = vc.hubDotPos.z;
        positions[3] = endPoint.x;
        positions[4] = endPoint.y;
        positions[5] = endPoint.z;
        vc.lineGeo.attributes.position.needsUpdate = true;
        (vc.line.material as THREE.LineBasicMaterial).opacity = 0.45 * drawT;

        vc.endDot.visible = drawT >= 1;

        if ((i === 1 || i === 2 || i === 4 || i === 5) && drawT >= 1) {
          vc.pinDot.visible = true;
          const pinPos = vc.hubDotPos.clone().lerp(vc.cubePos, 0.78);
          const floatY = Math.sin(elapsed * 0.6 + i * Math.PI / 3) * 0.08;
          pinPos.y += floatY * 0.78;
          vc.pinDot.position.copy(pinPos);
        }

        const wireOpacity = 1 - activationT * 0.55;
        const wireEdges = vc.wireCube.userData.edges as THREE.LineSegments;
        const wireFill = vc.wireCube.userData.fill as THREE.Mesh;
        if (wireEdges) (wireEdges.material as THREE.LineBasicMaterial).opacity = 0.55 * wireOpacity;
        if (wireFill) (wireFill.material as THREE.MeshBasicMaterial).opacity = 0.3 * wireOpacity;

        const solidOpacity = activationT;
        vc.solidCube.traverse((obj) => {
          const mesh = obj as THREE.Mesh | THREE.LineSegments;
          const mat = (mesh as { material?: THREE.Material | THREE.Material[] }).material as
            | (THREE.Material & { opacity: number })
            | undefined;
          if (!mat) return;
          if (obj === (vc.solidCube.userData.edges as THREE.Object3D)) return;
          mat.opacity = solidOpacity;
        });
        const solidEdges = vc.solidCube.userData.edges as THREE.LineSegments | undefined;
        if (solidEdges && !vc.activated) {
          (solidEdges.material as THREE.LineBasicMaterial).opacity = 0.9 * activationT;
        }

        const floatY = Math.sin(elapsed * 0.6 + i * Math.PI / 3) * 0.08;
        const cubeBasePos = new THREE.Vector3(...VALUES[i].pos);
        cubeBasePos.y += floatY;
        vc.wireCube.position.copy(cubeBasePos);
        vc.solidCube.position.copy(cubeBasePos);
        vc.endDot.position.copy(cubeBasePos);

        if (vc.activated) {
          const pulseT = ((elapsed * 0.6) + vc.pulsePhase) % 1;
          const pulsePos = vc.hubDotPos.clone().lerp(vc.cubePos, pulseT);
          pulsePos.y += floatY * pulseT;
          vc.pulse.position.copy(pulsePos);
          const fade = pulseT < 0.1 ? pulseT / 0.1 : pulseT > 0.9 ? (1 - pulseT) / 0.1 : 1;
          (vc.pulse.material as THREE.MeshBasicMaterial).opacity = fade;
          (vc.pulseHalo.material as THREE.MeshBasicMaterial).opacity = 0.5 * fade;

          let impact = 0;
          if (pulseT > 0.82) {
            const t = (pulseT - 0.82) / 0.18;
            impact = Math.sin(t * Math.PI);
          }
          if (solidEdges) {
            (solidEdges.material as THREE.LineBasicMaterial).opacity = 0.9 + impact * 0.1;
          }
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
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
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('mouseleave', onMouseLeave);
      renderer.dispose();
      dgxxTex.dispose();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh | THREE.LineSegments;
        const geo = (mesh as { geometry?: THREE.BufferGeometry }).geometry;
        if (geo) geo.dispose();
        const mat = (mesh as { material?: THREE.Material | THREE.Material[] }).material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else if (mat) (mat as THREE.Material).dispose();
      });
      if (canvas.parentElement === container) container.removeChild(canvas);
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default UnifiedOpsHub3D;
