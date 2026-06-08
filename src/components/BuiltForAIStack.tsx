"use client";

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface BuiltForAIStackProps {
  className?: string;
  labels?: [string, string, string, string];
}

const DEFAULT_LABELS: [string, string, string, string] = [
  'Co-engineering',
  'Managed services',
  'AI infrastructure',
  'Purpose-built datacenters',
];

const BuiltForAIStack = ({ className, labels = DEFAULT_LABELS }: BuiltForAIStackProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvas: HTMLCanvasElement = canvasEl;

    const YELLOW = new THREE.Color('#FFC400');
    const YELLOW_HOT = new THREE.Color('#FFD84D');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    const scene = new THREE.Scene();

    const FRUST = 8.0;
    const camera = new THREE.OrthographicCamera(-FRUST, FRUST, FRUST, -FRUST, 0.1, 100);
    camera.position.set(9, 6.0, 9);
    camera.lookAt(0, -0.1, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.45));
    const key = new THREE.DirectionalLight(0xffffff, 0.6);
    key.position.set(6, 12, 8);
    scene.add(key);
    const rim = new THREE.DirectionalLight(YELLOW, 0.85);
    rim.position.set(-8, 4, -6);
    scene.add(rim);
    const accent = new THREE.PointLight(YELLOW, 1.2, 22, 1.6);
    accent.position.set(4, 2, 4);
    scene.add(accent);

    const SLAB_W = 7.4;
    const SLAB_D = 7.4;
    const SLAB_H = 0.46;
    const GAP = 2.05;
    const COUNT = 4;
    const GRID_N = 7;

    const stack = new THREE.Group();
    scene.add(stack);

    type FlickMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial> & {
      userData: { flicker: number };
    };
    type Slab = {
      group: THREE.Group;
      edgeMat: THREE.LineBasicMaterial;
      pMat: THREE.PointsMaterial;
      curve: THREE.CatmullRomCurve3;
      head: THREE.Mesh;
      trailGeo: THREE.BufferGeometry;
      phase: number;
      flick: FlickMesh[];
    };
    const slabs: Slab[] = [];
    const disposables: Array<{ dispose: () => void }> = [];
    const track = <T extends { dispose: () => void }>(d: T): T => {
      disposables.push(d);
      return d;
    };

    function makeLabelTexture(text: string) {
      const c = document.createElement('canvas');
      c.width = 1500;
      c.height = 130;
      const ctx = c.getContext('2d')!;
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.font = '500 60px "Sora", "Helvetica Neue", Arial, sans-serif';
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'left';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetY = 1;
      ctx.fillStyle = '#F2F2F2';
      ctx.fillText(text, 8, 70);
      const tex = new THREE.CanvasTexture(c);
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      tex.colorSpace = THREE.SRGBColorSpace;
      return { tex, ratio: c.width / c.height };
    }

    function topLoop(w: number, h: number, d: number) {
      const x = w / 2;
      const y = h / 2;
      const z = d / 2;
      return [
        new THREE.Vector3(-x, y, z),
        new THREE.Vector3(x, y, z),
        new THREE.Vector3(x, y, -z),
        new THREE.Vector3(-x, y, -z),
      ];
    }

    const darkMetal = (c = 0x0c0c0c) =>
      track(new THREE.MeshStandardMaterial({ color: c, metalness: 0.55, roughness: 0.5 }));
    const wire = (op = 0.6) =>
      track(new THREE.LineBasicMaterial({ color: YELLOW_HOT, transparent: true, opacity: op }));
    function glowSlot(w: number, h: number, op = 0.55) {
      const geo = track(new THREE.PlaneGeometry(w, h));
      const mat = track(
        new THREE.MeshBasicMaterial({
          color: YELLOW_HOT,
          transparent: true,
          opacity: op,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: false,
        }),
      );
      return new THREE.Mesh(geo, mat) as FlickMesh;
    }
    function cabinet(w: number, h: number, d: number, units: number, flick: FlickMesh[]) {
      const g = new THREE.Group();
      const bodyGeo = track(new THREE.BoxGeometry(w, h, d));
      const body = new THREE.Mesh(bodyGeo, darkMetal(0x0b0b0b));
      g.add(body);
      const edges = track(new THREE.EdgesGeometry(bodyGeo));
      g.add(new THREE.LineSegments(edges, wire(0.34)));
      const doorGeo = track(new THREE.PlaneGeometry(w * 0.86, h * 0.9));
      const door = new THREE.Mesh(doorGeo, darkMetal(0x141414));
      door.position.z = d / 2 + 0.001;
      g.add(door);
      for (let v = 0; v < units; v++) {
        const s = glowSlot(w * 0.66, 0.045, 0.55 + 0.2 * Math.random());
        s.position.set(0, -h * 0.4 + v * ((h * 0.8) / (units - 1)), d / 2 + 0.003);
        s.userData.flicker = 0.8 + Math.random() * 2.6;
        g.add(s);
        flick.push(s);
      }
      const led = glowSlot(0.07, 0.07, 1.0);
      led.position.set(w * 0.32, h * 0.4, d / 2 + 0.004);
      led.userData.flicker = 2.0 + Math.random() * 3.0;
      g.add(led);
      flick.push(led);
      return g;
    }

    function infraCoEng(flick: FlickMesh[]) {
      const g = new THREE.Group();
      for (const [x, z] of [
        [-1.7, -0.5],
        [0.3, 0.9],
        [1.8, -0.3],
      ] as const) {
        const deskGeo = track(new THREE.BoxGeometry(1.2, 0.14, 0.7));
        const desk = new THREE.Mesh(deskGeo, darkMetal(0x101010));
        desk.position.set(x, 0.07, z);
        g.add(desk);
        const deskEdges = track(new THREE.EdgesGeometry(deskGeo));
        const deskLine = new THREE.LineSegments(deskEdges, wire(0.3));
        deskLine.position.set(x, 0.07, z);
        g.add(deskLine);
        const screen = glowSlot(0.62, 0.4, 0.32);
        screen.position.set(x, 0.36, z - 0.34);
        screen.userData.flicker = 0.7 + Math.random() * 1.4;
        g.add(screen);
        flick.push(screen);
        const standGeo = track(new THREE.CylinderGeometry(0.02, 0.02, 0.22, 8));
        const stand = new THREE.Mesh(standGeo, darkMetal(0x222222));
        stand.position.set(x, 0.25, z - 0.34);
        g.add(stand);
      }
      return g;
    }
    function infraManaged(flick: FlickMesh[]) {
      const g = new THREE.Group();
      const cols = 4;
      const rows = 3;
      const sx = 4.2;
      const sz = 2.8;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = -sx / 2 + sx * (c / (cols - 1));
          const z = -sz / 2 + sz * (r / (rows - 1));
          const cab = cabinet(0.52, 0.5, 0.5, 4, flick);
          cab.position.set(x, 0.25, z);
          g.add(cab);
        }
      }
      return g;
    }
    function infraGPU(flick: FlickMesh[]) {
      const g = new THREE.Group();
      const cols = 6;
      const rows = 3;
      const sx = 5.2;
      const sz = 3.2;
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = -sx / 2 + sx * (c / (cols - 1));
          const z = -sz / 2 + sz * (r / (rows - 1));
          const cab = cabinet(0.46, 0.95, 0.6, 8, flick);
          cab.position.set(x, 0.475, z);
          g.add(cab);
        }
      }
      return g;
    }
    function infraDatacenter(flick: FlickMesh[]) {
      const g = new THREE.Group();
      const aisles = 4;
      const perAisle = 8;
      const sx = 5.8;
      const sz = 4.2;
      for (let a = 0; a < aisles; a++) {
        const z = -sz / 2 + sz * (a / (aisles - 1));
        for (let p = 0; p < perAisle; p++) {
          const x = -sx / 2 + sx * (p / (perAisle - 1));
          const cab = cabinet(0.4, 1.08, 0.55, 9, flick);
          cab.position.set(x, 0.54, z);
          g.add(cab);
        }
        const towerGeo = track(new THREE.BoxGeometry(0.7, 0.85, 0.5));
        const tower = new THREE.Mesh(towerGeo, darkMetal(0x121212));
        tower.position.set(sx / 2 + 0.75, 0.42, z);
        g.add(tower);
        const towerEdges = track(new THREE.EdgesGeometry(towerGeo));
        const towerLine = new THREE.LineSegments(towerEdges, wire(0.26));
        towerLine.position.set(sx / 2 + 0.75, 0.42, z);
        g.add(towerLine);
        const fan = glowSlot(0.4, 0.4, 0.18);
        fan.rotation.x = -Math.PI / 2;
        fan.position.set(sx / 2 + 0.75, 0.86, z);
        fan.userData.flicker = 1.5 + Math.random() * 2.0;
        g.add(fan);
        flick.push(fan);
      }
      return g;
    }
    const INFRA = [infraCoEng, infraManaged, infraGPU, infraDatacenter];

    function buildScene() {
      for (let i = 0; i < COUNT; i++) {
        const g = new THREE.Group();
        const y = (i - (COUNT - 1) / 2) * GAP;
        g.position.y = y;

        const slabGeo = track(new THREE.BoxGeometry(SLAB_W, SLAB_H, SLAB_D));
        const slabMat = track(
          new THREE.MeshStandardMaterial({
            color: 0x070707,
            metalness: 0.25,
            roughness: 0.82,
            transparent: true,
            opacity: 0.95,
          }),
        );
        g.add(new THREE.Mesh(slabGeo, slabMat));

        const edgeMat = track(
          new THREE.LineBasicMaterial({
            color: YELLOW_HOT,
            transparent: true,
            opacity: 0.75,
            toneMapped: false,
          }),
        );
        const edgeGeo = track(new THREE.EdgesGeometry(track(new THREE.BoxGeometry(SLAB_W, SLAB_H, SLAB_D))));
        g.add(new THREE.LineSegments(edgeGeo, edgeMat));

        const curve = new THREE.CatmullRomCurve3(topLoop(SLAB_W, SLAB_H, SLAB_D), true, 'catmullrom', 0.0);
        const headGeo = track(new THREE.SphereGeometry(0.13, 20, 20));
        const headMat = track(new THREE.MeshBasicMaterial({ color: YELLOW_HOT, toneMapped: false }));
        const head = new THREE.Mesh(headGeo, headMat);
        g.add(head);
        const haloGeo = track(new THREE.SphereGeometry(0.28, 20, 20));
        const haloMat = track(
          new THREE.MeshBasicMaterial({
            color: YELLOW,
            transparent: true,
            opacity: 0.35,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            toneMapped: false,
          }),
        );
        const halo = new THREE.Mesh(haloGeo, haloMat);
        head.add(halo);
        const trailGeo = track(new THREE.BufferGeometry());
        trailGeo.setAttribute(
          'position',
          new THREE.Float32BufferAttribute(new Array(50 * 3).fill(0), 3),
        );
        const trailMat = track(
          new THREE.LineBasicMaterial({
            color: YELLOW_HOT,
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending,
            toneMapped: false,
          }),
        );
        g.add(new THREE.Line(trailGeo, trailMat));

        const topY = SLAB_H / 2;
        const pts: number[] = [];
        const half = (SLAB_W / 2) * 0.82;
        for (let a = 0; a < GRID_N; a++) {
          for (let b = 0; b < GRID_N; b++) {
            pts.push(
              -half + 2 * half * (a / (GRID_N - 1)),
              topY + 0.012,
              -half + 2 * half * (b / (GRID_N - 1)),
            );
          }
        }
        const pGeo = track(new THREE.BufferGeometry());
        pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
        const pMat = track(
          new THREE.PointsMaterial({
            color: YELLOW_HOT,
            size: 0.08,
            transparent: true,
            opacity: 0.55,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            toneMapped: false,
          }),
        );
        g.add(new THREE.Points(pGeo, pMat));

        const flick: FlickMesh[] = [];
        const infra = INFRA[i](flick);
        infra.position.y = topY + 0.001;
        g.add(infra);

        stack.add(g);
        slabs.push({ group: g, edgeMat, pMat, curve, head, trailGeo, phase: i * 0.18, flick });
      }
    }

    function buildLabels() {
      for (let i = 0; i < COUNT; i++) {
        const { tex, ratio } = makeLabelTexture(labels[i]);
        disposables.push(tex);
        const labelW = 4.7;
        const labelH = labelW / ratio;
        const labelGeo = track(new THREE.PlaneGeometry(labelW, labelH));
        const labelMat = track(
          new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }),
        );
        const label = new THREE.Mesh(labelGeo, labelMat);

        label.geometry.translate(labelW / 2, 0, 0);
        label.rotation.y = Math.PI / 4;

        const FRONT_INSET = 0.86;
        const BAND_Y = -SLAB_H * 0.04;
        label.position.set((-SLAB_W / 2) * FRONT_INSET, BAND_Y, (SLAB_D / 2) * FRONT_INSET);

        slabs[i].group.add(label);
      }
    }

    function resize() {
      const parent = canvas.parentElement;
      if (!parent) return;
      const r = parent.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      const aspect = r.width / r.height;
      camera.left = -FRUST * aspect;
      camera.right = FRUST * aspect;
      camera.top = FRUST;
      camera.bottom = -FRUST;
      camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);

    const LOOP = 6.0;
    const TRAIL_SPAN = 0.2;
    const clock = new THREE.Clock();
    let rafId = 0;
    function render() {
      const t = clock.getElapsedTime();
      for (const s of slabs) {
        const u = (t / LOOP + s.phase) % 1;
        s.head.position.copy(s.curve.getPointAt(u));
        const posAttr = s.trailGeo.attributes.position as THREE.BufferAttribute;
        const pos = posAttr.array as Float32Array;
        const n = pos.length / 3;
        for (let k = 0; k < n; k++) {
          let uu = u - (k / (n - 1)) * TRAIL_SPAN;
          if (uu < 0) uu += 1;
          const p = s.curve.getPointAt(uu);
          pos[k * 3] = p.x;
          pos[k * 3 + 1] = p.y;
          pos[k * 3 + 2] = p.z;
        }
        posAttr.needsUpdate = true;
        const breathe = 0.5 + 0.5 * Math.sin(t * 1.4 + s.phase * 6.28);
        s.edgeMat.opacity = 0.6 + 0.3 * breathe;
        s.pMat.opacity = 0.4 + 0.25 * breathe;
        for (const f of s.flick) {
          f.material.opacity = 0.35 + 0.5 * (0.5 + 0.5 * Math.sin(t * f.userData.flicker * 2.0));
        }
      }
      stack.rotation.y = Math.sin(t * 0.08) * 0.05;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(render);
    }

    buildScene();
    resize();
    render();

    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts && fonts.load) {
      Promise.all([fonts.load('500 60px "Sora"'), fonts.load('600 60px "Sora"')])
        .then(() => fonts.ready)
        .then(buildLabels)
        .catch(() => buildLabels());
    } else {
      setTimeout(buildLabels, 600);
    }

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      for (const d of disposables) d.dispose();
      renderer.dispose();
    };
  }, [labels]);

  return (
    <div className={className} style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
};

export default BuiltForAIStack;
