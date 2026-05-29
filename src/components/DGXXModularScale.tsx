import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

type Scale = 'pod' | 'cluster' | 'hall';

const SCALE_CONFIGS: Record<Scale, number[]> = {
  pod: [0],
  cluster: [0, 1, 2, 3, 4],
  hall: [0, 1, 2, 3, 4, 5, 6, 7, 8],
};

const GRID_POSITIONS = [
  { x: 0, z: 0, role: 'center', idx: 0 },
  { x: 1, z: 0, role: 'cardinal', idx: 1 },
  { x: -1, z: 0, role: 'cardinal', idx: 2 },
  { x: 0, z: 1, role: 'cardinal', idx: 3 },
  { x: 0, z: -1, role: 'cardinal', idx: 4 },
  { x: 1, z: 1, role: 'corner', idx: 5 },
  { x: -1, z: 1, role: 'corner', idx: 6 },
  { x: 1, z: -1, role: 'corner', idx: 7 },
  { x: -1, z: -1, role: 'corner', idx: 8 },
] as const;

const COL = {
  yellow: 0xfacc15,
  yellowBright: 0xfde047,
  blackFace: 0x0c0c10,
};

const DGXXModularScale: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const setScaleRef = useRef<(s: Scale) => void>(() => { });

  const [scale, setScale] = useState<Scale>('pod');
  const [powerValue, setPowerValue] = useState(5);
  const [activeModules, setActiveModules] = useState(1);
  const [delta, setDelta] = useState('▲ MODULAR');
  const [bars, setBars] = useState<number[]>(() =>
    Array.from({ length: 6 }, () => 30 + Math.random() * 70)
  );

  // Analytics derived from scale changes
  useEffect(() => {
    let power: number, modules: number, deltaTxt: string, barCount: number;
    if (scale === 'pod') {
      power = 5; modules = 1; deltaTxt = '▲ MODULAR'; barCount = 6;
    } else if (scale === 'cluster') {
      power = 20; modules = 5; deltaTxt = '▲ 4× SCALE'; barCount = 10;
    } else {
      power = 40; modules = 9; deltaTxt = '▲ 10× SCALE'; barCount = 14;
    }

    setActiveModules(modules);
    setDelta(deltaTxt);
    setBars(Array.from({ length: barCount }, () => 30 + Math.random() * 70));

    // Animate power counter
    const start = powerValue;
    const target = power;
    const dur = 800;
    const t0 = performance.now();
    let raf: number;
    const tick = () => {
      const t = Math.min(1, (performance.now() - t0) / dur);
      const v = Math.round(start + (target - start) * (1 - Math.pow(1 - t, 3)));
      setPowerValue(v);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scale]);

  // Three.js scene setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const getSize = () => ({
      w: parent.clientWidth || 800,
      h: parent.clientHeight || 600,
    });

    const scene = new THREE.Scene();
    let { w, h } = getSize();
    let aspect = w / h;
    const getFrustumSize = (a: number) => {
      if (a < 1.0) {
        // Mobile & Portrait views: lock horizontal span to 6.6 units so the model fills the width beautifully
        return 6.6 / a;
      }
      return 15.0; // Desktop wide view
    };
    let frustumSize = getFrustumSize(aspect);
    const camera = new THREE.OrthographicCamera(
      (-frustumSize * aspect) / 2, (frustumSize * aspect) / 2,
      frustumSize / 2, -frustumSize / 2,
      0.1, 200
    );
    camera.position.set(15, 15, 15);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.5);
    keyLight.position.set(10, 20, 10);
    scene.add(keyLight);

    // ===== DGXX Logo 3D =====
    function createDGXXLogo3D(size = 1.0): THREE.Group {
      const group = new THREE.Group();
      const s = size;

      const dLeftEdge = -0.125 * s;
      const arcCenterX = 0.055 * s;
      const arcRadius = 0.35 * s;
      const dTopY = 0.35 * s;
      const dBotY = -0.35 * s;

      const dShape = new THREE.Shape();
      dShape.moveTo(dLeftEdge, dTopY);
      dShape.lineTo(arcCenterX, dTopY);
      dShape.absarc(arcCenterX, 0, arcRadius, Math.PI / 2, -Math.PI / 2, true);
      dShape.lineTo(dLeftEdge, dBotY);
      dShape.lineTo(dLeftEdge, dTopY);
      dShape.closePath();

      const notchYs = [0.16 * s, -0.16 * s];
      const notchH = 0.10 * s;
      const notchInsetEnd = dLeftEdge + 0.18 * s;
      notchYs.forEach(ny => {
        const n = new THREE.Path();
        n.moveTo(dLeftEdge, ny + notchH / 2);
        n.lineTo(notchInsetEnd, ny + notchH / 2);
        n.lineTo(notchInsetEnd, ny - notchH / 2);
        n.lineTo(dLeftEdge, ny - notchH / 2);
        n.closePath();
        dShape.holes.push(n);
      });

      const barShapes: THREE.Shape[] = [];
      const barH = 0.10 * s;
      const barLeftEdge = -0.405 * s;
      const barRightEdge = dLeftEdge;
      notchYs.forEach(by => {
        const b = new THREE.Shape();
        b.moveTo(barLeftEdge, by + barH / 2);
        b.lineTo(barRightEdge, by + barH / 2);
        b.lineTo(barRightEdge, by - barH / 2);
        b.lineTo(barLeftEdge, by - barH / 2);
        b.closePath();
        barShapes.push(b);
      });

      const extrudeSettings: THREE.ExtrudeGeometryOptions = {
        depth: 0.08, bevelEnabled: true,
        bevelThickness: 0.012, bevelSize: 0.008,
        bevelSegments: 2, curveSegments: 24,
      };

      const yellowMat = new THREE.MeshStandardMaterial({
        color: COL.yellow,
        emissive: COL.yellow,
        emissiveIntensity: 0.25,
        metalness: 0.25,
        roughness: 0.45,
      });

      group.add(new THREE.Mesh(new THREE.ExtrudeGeometry(dShape, extrudeSettings), yellowMat));
      barShapes.forEach(bs => {
        group.add(new THREE.Mesh(new THREE.ExtrudeGeometry(bs, extrudeSettings), yellowMat));
      });
      group.rotation.x = -Math.PI / 2;
      return group;
    }

    type CubeUserData = {
      isCenter: boolean;
      face: THREE.Mesh;
      faceMat: THREE.MeshStandardMaterial;
      solidEdges: THREE.LineSegments;
      solidMat: THREE.LineBasicMaterial;
      dashedEdges: THREE.LineSegments;
      dashedMat: THREE.LineDashedMaterial;
      capMat: THREE.MeshStandardMaterial | null;
      capSolidMat: THREE.LineBasicMaterial | null;
      capDashedMat: THREE.LineDashedMaterial | null;
      cubeHeight: number;
      isActive: boolean;
      targetActive: boolean;
      activationProgress: number;
      hoverOffset: number;
      activatePulse: number;
      spawnTime: number;
      spawnDuration: number;
    };

    function createCube(size = 2.4, opts: { isCenter?: boolean; stacked?: boolean } = {}): THREE.Group {
      const { isCenter = false, stacked = false } = opts;
      const group = new THREE.Group();
      const cubeHeight = stacked ? size * 1.4 : size;
      const cubeYCenter = cubeHeight / 2;

      const faceGeo = new THREE.BoxGeometry(size, cubeHeight, size);
      const faceMat = new THREE.MeshStandardMaterial({
        color: COL.blackFace, metalness: 0.05, roughness: 0.85,
      });
      const face = new THREE.Mesh(faceGeo, faceMat);
      face.position.y = cubeYCenter;
      group.add(face);

      const edgesGeo = new THREE.EdgesGeometry(faceGeo);
      const solidMat = new THREE.LineBasicMaterial({
        color: COL.yellow, transparent: true, opacity: 0, linewidth: 2,
      });
      const solidEdges = new THREE.LineSegments(edgesGeo, solidMat);
      solidEdges.position.y = cubeYCenter;
      group.add(solidEdges);

      const dashedMat = new THREE.LineDashedMaterial({
        color: COL.yellow, transparent: true, opacity: 1,
        dashSize: 0.18, gapSize: 0.12, linewidth: 1,
      });
      const dashedEdges = new THREE.LineSegments(edgesGeo, dashedMat);
      dashedEdges.position.y = cubeYCenter;
      dashedEdges.computeLineDistances();
      group.add(dashedEdges);

      let capMat: THREE.MeshStandardMaterial | null = null;
      let capSolidMat: THREE.LineBasicMaterial | null = null;
      let capDashedMat: THREE.LineDashedMaterial | null = null;

      if (isCenter) {
        const capSize = size * 0.92;
        const capHeight = size * 0.42;
        const capGeo = new THREE.BoxGeometry(capSize, capHeight, capSize);
        capMat = new THREE.MeshStandardMaterial({
          color: COL.blackFace, metalness: 0.05, roughness: 0.85,
        });
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.y = cubeHeight + capHeight / 2;
        group.add(cap);

        const capEdgesGeo = new THREE.EdgesGeometry(capGeo);
        capSolidMat = new THREE.LineBasicMaterial({
          color: COL.yellow, transparent: true, opacity: 0, linewidth: 2,
        });
        const capSolidEdges = new THREE.LineSegments(capEdgesGeo, capSolidMat);
        capSolidEdges.position.y = cubeHeight + capHeight / 2;
        group.add(capSolidEdges);

        capDashedMat = new THREE.LineDashedMaterial({
          color: COL.yellow, transparent: true, opacity: 1,
          dashSize: 0.15, gapSize: 0.10, linewidth: 1,
        });
        const capDashedEdges = new THREE.LineSegments(capEdgesGeo, capDashedMat);
        capDashedEdges.position.y = cubeHeight + capHeight / 2;
        capDashedEdges.computeLineDistances();
        group.add(capDashedEdges);

        const logoGroup = createDGXXLogo3D(capSize * 0.78);
        logoGroup.position.set(0, cubeHeight + capHeight + 0.005, 0);
        group.add(logoGroup);
      }

      const userData: CubeUserData = {
        isCenter, face, faceMat,
        solidEdges, solidMat, dashedEdges, dashedMat,
        capMat, capSolidMat, capDashedMat,
        cubeHeight,
        isActive: false,
        targetActive: false,
        activationProgress: isCenter ? 1 : 0,
        hoverOffset: 0,
        activatePulse: 0,
        spawnTime: 0,
        spawnDuration: 700,
      };
      group.userData = userData;
      return group;
    }

    const SPACING = 3.6;
    const cubeGroup = new THREE.Group();
    scene.add(cubeGroup);
    const cubes: THREE.Group[] = [];

    GRID_POSITIONS.forEach(slot => {
      const isCenter = slot.role === 'center';
      const cube = createCube(2.4, { isCenter, stacked: isCenter });
      cube.position.set(slot.x * SPACING, 0, slot.z * SPACING);
      (cube.userData as CubeUserData).spawnTime = performance.now() + slot.idx * 70;
      cube.scale.set(0.001, 0.001, 0.001);
      cubeGroup.add(cube);
      cubes.push(cube);
    });

    function setCubeActive(cube: THREE.Group, active: boolean, instant = false) {
      const ud = cube.userData as CubeUserData;
      ud.targetActive = active;
      ud.isActive = active;
      if (instant) ud.activationProgress = active ? 1 : 0;
      if (active) ud.activatePulse = 1.0;
    }

    let currentScale: Scale = 'pod';
    let currentActiveSet = new Set<number>(SCALE_CONFIGS.pod);
    setCubeActive(cubes[0], true, true);

    const stagedTimeouts: number[] = [];
    function transitionToScale(newScale: Scale) {
      if (newScale === currentScale) return;
      const newSet = new Set<number>(SCALE_CONFIGS[newScale]);
      const oldSet = currentActiveSet;
      const newlyActive = [...newSet].filter(i => !oldSet.has(i));
      const newlyDeactive = [...oldSet].filter(i => !newSet.has(i));

      newlyDeactive.forEach(idx => setCubeActive(cubes[idx], false));
      if (newSet.has(0) && !oldSet.has(0)) setCubeActive(cubes[0], true);

      newlyActive.filter(i => i !== 0).forEach((idx, i) => {
        const t = window.setTimeout(() => setCubeActive(cubes[idx], true), i * 100);
        stagedTimeouts.push(t);
      });

      currentActiveSet = newSet;
      currentScale = newScale;
    }

    // Expose scene-side transition to React via ref
    setScaleRef.current = (s: Scale) => transitionToScale(s);

    // Parallax
    const targetTilt = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      const mx = e.clientX / window.innerWidth - 0.5;
      const my = e.clientY / window.innerHeight - 0.5;
      targetTilt.x = my * 0.10;
      targetTilt.y = mx * 0.10;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Hover raycast
    const raycaster = new THREE.Raycaster();
    const mouseVec = new THREE.Vector2();
    let hoveredCube: THREE.Group | null = null;
    const onCanvasMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    canvas.addEventListener('mousemove', onCanvasMouseMove);

    const clock = new THREE.Clock();
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      camera.position.x = 15 + targetTilt.y * 2.2;
      camera.position.y = 15 - targetTilt.x * 1.8;
      camera.position.z = 15 + targetTilt.y * 2.2;
      camera.lookAt(0, 0.5, 0);

      cubes.forEach((cube, i) => {
        const ud = cube.userData as CubeUserData;
        const now = performance.now();
        const sElapsed = now - ud.spawnTime;

        if (sElapsed > 0 && cube.scale.x < 1) {
          const p = Math.min(1, sElapsed / ud.spawnDuration);
          const eased = 1 - Math.pow(1 - p, 4);
          cube.scale.set(eased, eased, eased);
        } else if (cube.scale.x >= 1) {
          const wave = Math.sin(t * 1.0 + i * 0.6) * 0.05;
          cube.position.y += (wave - cube.position.y) * 0.06;

          const targetProg = ud.targetActive ? 1 : 0;
          ud.activationProgress += (targetProg - ud.activationProgress) * 0.10;
          const prog = ud.activationProgress;

          if (ud.activatePulse > 0) {
            ud.activatePulse -= 0.02;
            if (ud.activatePulse < 0) ud.activatePulse = 0;
            const punch = 1 + ud.activatePulse * 0.06;
            [ud.face, ud.solidEdges, ud.dashedEdges].forEach(c => {
              if (c) c.scale.set(punch, punch, punch);
            });
          }

          ud.solidMat.opacity = prog * 0.95;
          ud.dashedMat.opacity = (1 - prog) * 0.75;

          if (ud.isCenter && ud.capSolidMat && ud.capDashedMat) {
            ud.capSolidMat.opacity = prog * 0.95;
            ud.capDashedMat.opacity = (1 - prog) * 0.75;
          }

          const isHovered = hoveredCube === cube;
          const targetHover = isHovered ? 0.35 : 0;
          ud.hoverOffset += (targetHover - ud.hoverOffset) * 0.15;
          cube.position.y += ud.hoverOffset * 0.05;
        }
      });

      raycaster.setFromCamera(mouseVec, camera);
      const meshes: { mesh: THREE.Mesh; root: THREE.Group }[] = [];
      cubes.forEach(c => {
        const ud = c.userData as CubeUserData;
        if (ud.face) meshes.push({ mesh: ud.face, root: c });
      });
      const intersects = raycaster.intersectObjects(meshes.map(m => m.mesh));
      let newHover: THREE.Group | null = null;
      if (intersects.length > 0) {
        const hit = meshes.find(m => m.mesh === intersects[0].object);
        if (hit) newHover = hit.root;
      }
      hoveredCube = newHover;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const s = getSize();
      w = s.w; h = s.h;
      aspect = w / h;
      frustumSize = getFrustumSize(aspect);
      camera.left = (-frustumSize * aspect) / 2;
      camera.right = (frustumSize * aspect) / 2;
      camera.top = frustumSize / 2;
      camera.bottom = -frustumSize / 2;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(parent);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      ro.disconnect();
      canvas.removeEventListener('mousemove', onCanvasMouseMove);
      stagedTimeouts.forEach(id => clearTimeout(id));
      renderer.dispose();
      scene.traverse(obj => {
        if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose?.();
        const mat = (obj as THREE.Mesh).material;
        if (Array.isArray(mat)) mat.forEach(m => m.dispose());
        else if (mat) mat.dispose();
      });
    };
  }, []);

  // Drive Three.js scene from React state changes
  useEffect(() => {
    setScaleRef.current(scale);
  }, [scale]);

  return (
    <div className="dgxx-stage">
      <style>{styles}</style>

      <svg width="0" height="0" style={{ position: 'absolute' }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <symbol id="dgxx-icon" viewBox="0 0 100 100">
            <path
              d="M 36 15 L 54 15 A 35 35 0 0 1 54 85 L 36 85 L 36 70 L 54 70 L 54 58 L 36 58 L 36 42 L 54 42 L 54 30 L 36 30 Z"
              fill="#FACC15"
            />
            <rect x="10" y="30" width="26" height="12" fill="#FACC15" />
            <rect x="10" y="58" width="26" height="12" fill="#FACC15" />
          </symbol>
        </defs>
      </svg>

      <div className="analytics">
        <div className="panel">
          <div className="panel-label">
            <span>Pod Power Output</span>
            <span className="verified-tag">✓ VERIFIED</span>
          </div>
          <div className="panel-value">
            {powerValue}
            <span className="unit">MW</span>
          </div>
          <div className="panel-sub">
            <span>
              Active modules: <span>{activeModules}</span> / 9
            </span>
            <span className="delta">{delta}</span>
          </div>
          <div className="mini-bars">
            {bars.map((h, i) => (
              <div key={i} className="bar" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-label">
            <span>Deployment Time</span>
            <span className="verified-tag">✓ VERIFIED</span>
          </div>
          <div className="panel-value">
            2-4<span className="unit">months</span>
          </div>
          <div className="panel-sub">
            <span>vs traditional 12-18 mo</span>
            <span className="delta">▼ 75% FASTER</span>
          </div>
        </div>

        <div className="panel">
          <div className="panel-label">
            <span>Efficiency (PUE)</span>
            <span className="verified-tag">✓ VERIFIED</span>
          </div>
          <div className="panel-value">
            1.1<span className="unit">– 1.4</span>
          </div>
          <div className="panel-sub">
            <span>Liquid-cooled · Tier III</span>
            <span className="delta">▲ BEST-IN-CLASS</span>
          </div>
        </div>
      </div>

      <div className="canvas-wrap">
        <canvas ref={canvasRef} id="three-canvas" />
      </div>

      <div className="scale-toggle">
        {(['pod', 'cluster', 'hall'] as const).map(s => (
          <button
            key={s}
            className={`scale-btn ${scale === s ? 'active' : ''}`}
            onClick={() => setScale(s)}
          >
            {s === 'pod' ? '5 MW POD' : s === 'cluster' ? '20 MW CLUSTER' : '40 MW HALL'}
          </button>
        ))}
      </div>


    </div>
  );
};

const styles = `
.dgxx-stage {
  --bg-0: #050507;
  --bg-1: #0A0A0E;
  --bg-2: #101014;
  --ink: #FFFFFF;
  --ink-soft: #B8B8C2;
  --ink-mute: #6E6E7A;
  --yellow: #FACC15;
  --yellow-bright: #FDE047;
  --card: rgba(15,15,20,0.65);
  --card-line: rgba(250, 204, 21, 0.14);
  --verified: #22D3A2;

  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  font-family: 'Space Grotesk', sans-serif;
  color: var(--ink);
  background: transparent;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}

/* Hide HUD elements that duplicate the parent Infrastructure hero context */
.dgxx-stage .topbar,
.dgxx-stage .headline,
.dgxx-stage .kpi-strip,
.dgxx-stage .hint { display: none; }

.dgxx-stage * { box-sizing: border-box; }

.dgxx-stage .canvas-wrap {
  position: relative;
  flex: 1;
  min-height: 0;
  width: 100%;
}
.dgxx-stage #three-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.dgxx-stage .topbar {
  position: absolute; top: 0; left: 0; right: 0;
  padding: 20px 28px;
  display: flex; justify-content: space-between; align-items: center;
  z-index: 10; pointer-events: none;
}

.dgxx-stage .brand { display: flex; align-items: center; gap: 12px; }
.dgxx-stage .dgxx-logo-mark { width: 38px; height: 38px; }
.dgxx-stage .dgxx-text {
  font-weight: 800; font-size: 20px; letter-spacing: 0.05em;
  color: var(--ink); line-height: 1;
}

.dgxx-stage .ticker-pill {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 12px;
  background: var(--card);
  border: 1px solid var(--card-line);
  border-radius: 100px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.14em;
  color: var(--ink-soft);
  backdrop-filter: blur(16px);
}
.dgxx-stage .ticker-pill .dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--verified);
  box-shadow: 0 0 8px var(--verified);
  animation: dgxx-pulse 1.6s ease-in-out infinite;
}
.dgxx-stage .ticker-pill .ticker-tag { color: var(--yellow); font-weight: 700; }

@keyframes dgxx-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.45; transform: scale(1.35); }
}

.dgxx-stage .headline {
  position: absolute; top: 88px; left: 28px;
  z-index: 10; max-width: 420px; pointer-events: none;
}
.dgxx-stage .eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.26em;
  color: var(--yellow); text-transform: uppercase;
  margin-bottom: 12px;
  opacity: 0; animation: dgxx-fadeUp 0.8s 0.2s ease-out forwards;
  display: flex; align-items: center; gap: 8px;
}
.dgxx-stage .eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--yellow); }
.dgxx-stage .title {
  font-size: 46px; line-height: 0.96; font-weight: 700;
  letter-spacing: -0.03em; margin-bottom: 14px; color: var(--ink);
  opacity: 0; animation: dgxx-fadeUp 1s 0.4s ease-out forwards;
}
.dgxx-stage .title .yellow { color: var(--yellow); font-style: italic; font-weight: 800; }
.dgxx-stage .subtitle {
  font-size: 14px; color: var(--ink-soft); line-height: 1.6;
  max-width: 380px; opacity: 0;
  animation: dgxx-fadeUp 1s 0.6s ease-out forwards;
}
.dgxx-stage .subtitle b { color: var(--yellow); font-weight: 600; }
.dgxx-stage .subtitle .white { color: var(--ink); font-weight: 500; }

@keyframes dgxx-fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.dgxx-stage .analytics {
  position: relative; z-index: 10;
  width: 100%; flex-shrink: 0;
  display: flex; flex-direction: row; gap: 12px;
}
@media (max-width: 768px) {
  .dgxx-stage .analytics {
    display: none;
  }
}
.dgxx-stage .panel {
  flex: 1; min-width: 0;
  background: var(--card);
  border: 1px solid var(--card-line);
  border-radius: 12px; padding: 14px 16px;
  backdrop-filter: blur(20px);
  opacity: 0; animation: dgxx-slideIn 0.8s ease-out forwards;
  position: relative; overflow: hidden;
}
.dgxx-stage .panel:nth-child(1) { animation-delay: 0.2s; }
.dgxx-stage .panel:nth-child(2) { animation-delay: 0.35s; }
.dgxx-stage .panel:nth-child(3) { animation-delay: 0.5s; }
.dgxx-stage .panel::before {
  content: ''; position: absolute; top: 0; left: 0;
  width: 2px; height: 24px; background: var(--yellow);
}

@keyframes dgxx-slideIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.dgxx-stage .panel-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.18em;
  color: var(--ink-mute); text-transform: uppercase;
  margin-bottom: 8px;
  display: flex; justify-content: space-between; align-items: center;
}
.dgxx-stage .verified-tag {
  color: var(--verified); font-size: 8px;
  display: flex; align-items: center; gap: 4px;
  letter-spacing: 0.14em; font-weight: 600;
}
.dgxx-stage .panel-value {
  font-size: 30px; font-weight: 700;
  letter-spacing: -0.02em; line-height: 1; color: var(--ink);
}
.dgxx-stage .panel-value .unit {
  font-size: 14px; color: var(--ink-mute);
  font-weight: 500; margin-left: 4px;
}
.dgxx-stage .panel-sub {
  margin-top: 8px; font-size: 11px; color: var(--ink-soft);
  display: flex; justify-content: space-between; align-items: center;
}
.dgxx-stage .delta {
  color: var(--yellow); font-family: 'JetBrains Mono', monospace;
  font-size: 10px; font-weight: 700; letter-spacing: 0.05em;
}
.dgxx-stage .mini-bars {
  display: flex; align-items: flex-end; gap: 3px;
  height: 24px; margin-top: 10px;
}
.dgxx-stage .mini-bars .bar {
  flex: 1; background: var(--yellow); border-radius: 1px;
  transition: height 0.5s ease;
}

.dgxx-stage .kpi-strip {
  position: absolute; bottom: 28px; left: 50%;
  transform: translateX(-50%);
  display: flex; gap: 0;
  background: var(--card);
  border: 1px solid var(--card-line);
  border-radius: 14px; padding: 4px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  z-index: 10; opacity: 0;
  animation: dgxx-fadeUp 1s 1.2s ease-out forwards;
}
.dgxx-stage .kpi-item {
  padding: 12px 22px;
  display: flex; flex-direction: column;
  align-items: center; gap: 3px; position: relative;
}
.dgxx-stage .kpi-item + .kpi-item::before {
  content: ''; position: absolute; left: 0;
  top: 20%; bottom: 20%; width: 1px;
  background: var(--card-line);
}
.dgxx-stage .kpi-icon { width: 16px; height: 16px; margin-bottom: 2px; }
.dgxx-stage .kpi-value { font-size: 16px; font-weight: 700; letter-spacing: -0.01em; color: var(--ink); }
.dgxx-stage .kpi-value.yellow { color: var(--yellow); }
.dgxx-stage .kpi-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 8px; letter-spacing: 0.16em;
  color: var(--ink-mute); text-transform: uppercase;
}

.dgxx-stage .scale-toggle {
  position: relative; z-index: 10;
  align-self: center; flex-shrink: 0;
  display: flex; gap: 4px;
  background: var(--card);
  border: 1px solid var(--card-line);
  border-radius: 100px; padding: 4px;
  backdrop-filter: blur(20px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
  opacity: 0; animation: dgxx-fadeUp 1s 0.7s ease-out forwards;
}
.dgxx-stage .scale-btn {
  background: transparent; border: none;
  color: var(--ink-soft);
  padding: 9px 18px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px; letter-spacing: 0.14em; font-weight: 700;
  cursor: pointer; border-radius: 100px;
  transition: all 0.3s ease;
}
.dgxx-stage .scale-btn:hover { color: var(--ink); }
.dgxx-stage .scale-btn.active { background: var(--yellow); color: var(--bg-0); }

.dgxx-stage .hint {
  position: absolute; bottom: 28px; right: 28px;
  z-index: 10;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px; letter-spacing: 0.14em;
  color: var(--ink-mute); text-transform: uppercase;
  opacity: 0; animation: dgxx-fadeUp 1s 1.6s ease-out forwards;
  display: flex; align-items: center; gap: 6px;
}
.dgxx-stage .hint .yellow-dot {
  width: 4px; height: 4px; border-radius: 50%;
  background: var(--yellow);
}

@media (max-width: 900px) {
  .dgxx-stage .panel { padding: 12px 14px; }
  .dgxx-stage .panel-value { font-size: 22px; }
}
@media (max-width: 600px) {
  .dgxx-stage { padding: 12px; gap: 10px; }
  .dgxx-stage .analytics { flex-direction: column; }
  .dgxx-stage .panel-value { font-size: 20px; }
  .dgxx-stage .scale-btn { padding: 8px 12px; font-size: 9px; }
}
`;

export default DGXXModularScale;
