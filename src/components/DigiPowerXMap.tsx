"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { m } from "framer-motion";
import "./DigiPowerXMap.css";

type SiteKind = "gas" | "urban" | "campus" | "mega";

interface Site {
  name: string;
  lat: number;
  lon: number;
  kind: SiteKind;
}

const SITES: Site[] = [
  { name: "NORTH TONAWANDA, NY", lat: 43.04, lon: -78.86, kind: "gas" },
  { name: "BUFFALO, NY", lat: 42.89, lon: -78.88, kind: "urban" },
  { name: "COLUMBIANA, AL", lat: 33.18, lon: -86.61, kind: "campus" },
  { name: "HILDEBRAN, NC", lat: 35.72, lon: -81.42, kind: "mega" },
];

const LABEL_OFFSETS: Record<string, { dx: number; dy: number }> = {
  "NORTH TONAWANDA, NY": { dx: 0, dy: -30 },
  "BUFFALO, NY":         { dx: 0, dy:  34 },
  "COLUMBIANA, AL":      { dx: 0, dy:  30 },
  "HILDEBRAN, NC":       { dx: 0, dy:  30 },
};

const ARCS: [number, number][] = [];
for (let i = 0; i < SITES.length; i++) {
  for (let j = i + 1; j < SITES.length; j++) ARCS.push([i, j]);
}

const BOUNDS = { latMin: 24.2, latMax: 49.6, lonMin: -125.0, lonMax: -66.7 };
const MAP_W = 58;
const MAP_H = 32;
const YELLOW = 0xffc400;
const GEOJSON_URL =
  "https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json";

const project = (lat: number, lon: number) => {
  const x = ((lon - BOUNDS.lonMin) / (BOUNDS.lonMax - BOUNDS.lonMin) - 0.5) * MAP_W;
  const y = ((lat - BOUNDS.latMin) / (BOUNDS.latMax - BOUNDS.latMin) - 0.5) * MAP_H;
  return new THREE.Vector3(x, 0, -y);
};

const ease = (t: number) =>
  0.5 - 0.5 * Math.cos(Math.PI * Math.min(Math.max(t, 0), 1));

const DigiPowerXMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);
  const [loaderGone, setLoaderGone] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setFailed(true);
      setLoaderGone(true);
      return;
    }
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const labelLayer = labelsRef.current;
    if (!canvas || !container || !labelLayer) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    } catch (err) {
      console.error("WebGL init failed", err);
      setFailed(true);
      setLoaderGone(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    const world = new THREE.Group();
    scene.add(world);

    const FOV = 40;
    const HOME = {
      pos: new THREE.Vector3(0, 60, 28),
      look: new THREE.Vector3(0, 0, 0),
    };
    let VW = 1;
    let VH = 1;
    let camera = new THREE.PerspectiveCamera(FOV, 1, 0.5, 800);

    const fitHome = () => {
      const asp = VW / VH;
      const vfov = THREE.MathUtils.degToRad(FOV);
      const hfov = 2 * Math.atan(Math.tan(vfov / 2) * asp);
      const pad = 1.22;
      const halfW = (MAP_W / 2) * pad;
      const halfD = (MAP_H / 2) * pad;
      const distW = halfW / Math.tan(hfov / 2);
      const distD = halfD / Math.tan(vfov / 2);
      const D = Math.max(distW, distD);
      HOME.pos.set(0, D * 0.94, D * 0.4);
      HOME.look.set(0, 0, 0.5);
    };

    const makeCamera = (w: number, h: number) => {
      VW = w;
      VH = h;
      camera = new THREE.PerspectiveCamera(FOV, w / h, 0.5, 800);
      fitHome();
    };

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const key = new THREE.DirectionalLight(0xffd966, 0.8);
    key.position.set(8, 24, 12);
    scene.add(key);
    const rim = new THREE.DirectionalLight(YELLOW, 0.4);
    rim.position.set(-14, 9, -10);
    scene.add(rim);

    interface Pin {
      grp: THREE.Group;
      pulse: THREE.Mesh;
      pos: THREE.Vector3;
      el: HTMLDivElement;
      off: { dx: number; dy: number };
      phase: number;
    }

    interface ArcAnim {
      curve: THREE.QuadraticBezierCurve3;
      dot: THREE.Mesh;
      halo: THREE.Mesh;
      t: number;
      spd: number;
    }

    const pins: Pin[] = [];
    const arcs: ArcAnim[] = [];
    let mapReady = false;

    const inBox = (ring: number[][]) => {
      let n = 0;
      for (const p of ring) {
        const lo = p[0];
        const la = p[1];
        if (
          lo >= BOUNDS.lonMin - 4 &&
          lo <= BOUNDS.lonMax + 4 &&
          la >= BOUNDS.latMin - 4 &&
          la <= BOUNDS.latMax + 4
        )
          n++;
      }
      return n > ring.length * 0.5;
    };

    const ringPts = (ring: number[][]) => ring.map((p) => project(p[1], p[0]));

    const buildGraticule = () => {
      const mat = new THREE.LineBasicMaterial({
        color: YELLOW,
        transparent: true,
        opacity: 0.04,
      });
      const g = new THREE.Group();
      for (let lon = -120; lon <= -70; lon += 10) {
        const p: THREE.Vector3[] = [];
        for (let lat = BOUNDS.latMin + 1; lat <= BOUNDS.latMax - 1; lat += 1.2)
          p.push(project(lat, lon));
        g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(p), mat));
      }
      for (let lat = 25; lat <= 49; lat += 5) {
        const p: THREE.Vector3[] = [];
        for (let lon = BOUNDS.lonMin + 2; lon <= BOUNDS.lonMax - 2; lon += 1.2)
          p.push(project(lat, lon));
        g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(p), mat));
      }
      g.position.y = -0.08;
      world.add(g);
    };

    const buildIcon = (kind: SiteKind) => {
      const grp = new THREE.Group();
      const shell = new THREE.MeshStandardMaterial({
        color: 0x141414,
        metalness: 0.65,
        roughness: 0.38,
        emissive: 0x1a1200,
        emissiveIntensity: 0.25,
      });
      const edge = new THREE.LineBasicMaterial({
        color: YELLOW,
        transparent: true,
        opacity: 1.0,
      });

      const blk = (w: number, h: number, d: number, x = 0, z = 0) => {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), shell);
        m.position.set(x, h / 2, z);
        grp.add(m);
        const e = new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.BoxGeometry(w, h, d)),
          edge,
        );
        e.position.set(x, h / 2, z);
        grp.add(e);
        return { w, h, d, x, z };
      };

      const strip = (b: { w: number; h: number; d: number; x: number; z: number }) => {
        [1, -1].forEach((s) => {
          const pl = new THREE.Mesh(
            new THREE.PlaneGeometry(b.w * 0.72, b.h * 0.55),
            new THREE.MeshBasicMaterial({
              color: YELLOW,
              transparent: true,
              opacity: 0.5,
              side: THREE.DoubleSide,
            }),
          );
          pl.position.set(b.x, b.h * 0.52, b.z + s * (b.d / 2 + 0.01));
          grp.add(pl);
        });
      };

      const roof = (b: { w: number; h: number; d: number; x: number; z: number }, n: number) => {
        for (let i = 0; i < n; i++) {
          const rx = b.x - b.w * 0.3 + i * ((b.w * 0.6) / (n - 1 || 1));
          const c = new THREE.Mesh(
            new THREE.BoxGeometry(b.w * 0.18, b.h * 0.16, b.d * 0.5),
            shell,
          );
          c.position.set(rx, b.h + b.h * 0.08, b.z);
          grp.add(c);
        }
      };

      if (kind === "urban") {
        const a = blk(1.8, 3.4, 1.8);
        strip(a);
        roof(a, 2);
      } else if (kind === "campus") {
        const a = blk(3.2, 1.5, 2.4, -1.0);
        const b = blk(2.1, 1.3, 2.1, 1.7, 0.2);
        strip(a);
        strip(b);
        roof(a, 3);
      } else if (kind === "mega") {
        const a = blk(3.9, 2.1, 2.7, -0.7);
        const b = blk(2.4, 1.6, 2.2, 2.6, 0.3);
        blk(1.7, 1.2, 1.7, 2.4, -2.2);
        strip(a);
        strip(b);
        roof(a, 4);
        roof(b, 2);
        const t = new THREE.Mesh(
          new THREE.CylinderGeometry(0.42, 0.42, 1.9, 16),
          shell,
        );
        t.position.set(-3.2, 0.95, 0.9);
        grp.add(t);
      } else {
        const a = blk(3.4, 1.7, 2.4);
        strip(a);
        roof(a, 3);
        const t = new THREE.Mesh(
          new THREE.CylinderGeometry(0.45, 0.45, 2.1, 16),
          shell,
        );
        t.position.set(2.6, 1.05, -0.5);
        grp.add(t);
        const t2 = new THREE.Mesh(
          new THREE.CylinderGeometry(0.34, 0.34, 1.6, 16),
          shell,
        );
        t2.position.set(2.7, 0.8, 0.9);
        grp.add(t2);
      }

      const base = new THREE.Mesh(
        new THREE.RingGeometry(0.1, 2.6, 40),
        new THREE.MeshBasicMaterial({
          color: YELLOW,
          transparent: true,
          opacity: 0.1,
          side: THREE.DoubleSide,
        }),
      );
      base.rotation.x = -Math.PI / 2;
      base.position.y = 0.01;
      grp.add(base);
      return grp;
    };

    const buildPins = () => {
      SITES.forEach((s, idx) => {
        const pos = project(s.lat, s.lon);
        const grp = new THREE.Group();
        grp.position.copy(pos);

        const ring = new THREE.Mesh(
          new THREE.RingGeometry(0.5, 0.62, 56),
          new THREE.MeshBasicMaterial({
            color: YELLOW,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide,
          }),
        );
        ring.rotation.x = -Math.PI / 2;
        ring.position.y = 0.02;
        grp.add(ring);

        const pulse = new THREE.Mesh(
          new THREE.RingGeometry(0.62, 0.74, 56),
          new THREE.MeshBasicMaterial({
            color: YELLOW,
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide,
          }),
        );
        pulse.rotation.x = -Math.PI / 2;
        pulse.position.y = 0.03;
        grp.add(pulse);

        const beam = new THREE.Mesh(
          new THREE.CylinderGeometry(0.022, 0.022, 3.4, 8),
          new THREE.MeshBasicMaterial({
            color: YELLOW,
            transparent: true,
            opacity: 0.16,
          }),
        );
        beam.position.y = 1.7;
        grp.add(beam);

        const icon = buildIcon(s.kind);
        icon.position.set(2.2, 0.02, 0);
        grp.add(icon);
        world.add(grp);

        const el = document.createElement("div");
        el.style.cssText =
          "position:absolute;transform:translate(-50%,-50%);" +
          "font:600 10px/1 Sora,system-ui,sans-serif;letter-spacing:.14em;color:#fff;" +
          "background:transparent;border:none;padding:0;white-space:nowrap;" +
          "opacity:0;transition:opacity .5s ease;text-transform:uppercase";
        labelLayer.appendChild(el);

        pins.push({
          grp,
          pulse,
          pos: pos.clone(),
          el,
          off: LABEL_OFFSETS[s.name] || { dx: 0, dy: 30 },
          phase: idx * 1.25,
        });
      });
    };

    const buildArcs = () => {
      ARCS.forEach(([a, b]) => {
        const pa = project(SITES[a].lat, SITES[a].lon).setY(0.18);
        const pb = project(SITES[b].lat, SITES[b].lon).setY(0.18);
        const dist = pa.distanceTo(pb);
        const mid = pa.clone().add(pb).multiplyScalar(0.5);
        mid.y = dist * 0.32 + 0.8;
        const curve = new THREE.QuadraticBezierCurve3(pa, mid, pb);
        const pts = curve.getPoints(72);
        world.add(
          new THREE.Line(
            new THREE.BufferGeometry().setFromPoints(pts),
            new THREE.LineBasicMaterial({
              color: YELLOW,
              transparent: true,
              opacity: 0.16,
            }),
          ),
        );
        for (let k = 0; k < 2; k++) {
          const dot = new THREE.Mesh(
            new THREE.SphereGeometry(0.12, 16, 16),
            new THREE.MeshBasicMaterial({ color: YELLOW }),
          );
          const halo = new THREE.Mesh(
            new THREE.SphereGeometry(0.24, 16, 16),
            new THREE.MeshBasicMaterial({
              color: YELLOW,
              transparent: true,
              opacity: 0.22,
            }),
          );
          world.add(dot);
          world.add(halo);
          arcs.push({
            curve,
            dot,
            halo,
            t: k * 0.5 + Math.random() * 0.2,
            spd: 0.0032 + Math.random() * 0.0012,
          });
        }
      });
    };

    interface Stop {
      pos: THREE.Vector3;
      look: THREE.Vector3;
      hold: number;
      seg?: number;
    }

    interface Tour {
      stops: Stop[];
      i: number;
      phase: "hold" | "move";
      timer: number;
      t: number;
      done: boolean;
    }

    let tour: Tour | null = null;
    const camPos = HOME.pos.clone();
    const camLook = HOME.look.clone();
    const _look = HOME.look.clone();

    const siteShot = (s: Site): Stop => {
      const p = project(s.lat, s.lon);
      return {
        pos: new THREE.Vector3(p.x, 22, p.z + 19),
        look: new THREE.Vector3(p.x, 0, p.z),
        hold: 0.9,
      };
    };

    const startIntro = () => {
      const wide: Stop = {
        pos: new THREE.Vector3(HOME.pos.x, HOME.pos.y * 1.18, HOME.pos.z * 1.18),
        look: HOME.look.clone(),
        hold: 0.6,
      };
      const stops: Stop[] = [wide];
      SITES.forEach((s) => {
        const sh = siteShot(s);
        stops.push({ pos: sh.pos, look: sh.look, hold: sh.hold });
      });
      stops.push({ pos: HOME.pos.clone(), look: HOME.look.clone(), hold: 99 });

      const SPEED = 10;
      const MINSEG = 1.2;
      const MAXSEG = 3.2;
      for (let k = 0; k < stops.length - 1; k++) {
        const d = stops[k].pos.distanceTo(stops[k + 1].pos);
        stops[k + 1].seg = Math.min(MAXSEG, Math.max(MINSEG, d / SPEED));
      }

      tour = { stops, i: 0, phase: "hold", timer: stops[0].hold, t: 0, done: false };
      camPos.copy(stops[0].pos);
      camLook.copy(stops[0].look);
      camera.position.copy(stops[0].pos);
      camera.lookAt(stops[0].look);
    };

    const updateTour = (dt: number) => {
      if (!tour || tour.done) return;
      const S = tour.stops;
      if (tour.phase === "hold") {
        tour.timer -= dt;
        if (tour.timer <= 0) {
          if (tour.i >= S.length - 1) {
            tour.done = true;
            return;
          }
          tour.phase = "move";
          tour.t = 0;
        }
        return;
      }
      const A = S[tour.i];
      const Bp = S[tour.i + 1];
      tour.t += dt / (Bp.seg || 1);
      const e = ease(tour.t);
      camPos.lerpVectors(A.pos, Bp.pos, e);
      camLook.lerpVectors(A.look, Bp.look, e);
      if (tour.t >= 1) {
        tour.i++;
        camPos.copy(Bp.pos);
        camLook.copy(Bp.look);
        if (tour.i >= S.length - 1) {
          tour.done = true;
          return;
        }
        tour.phase = "hold";
        tour.timer = Bp.hold;
      }
    };

    const buildMap = (geo: { features: Array<{ geometry: { type: string; coordinates: number[][][] | number[][][][] }; properties?: { name?: string } }> }) => {
      const borderMat = new THREE.LineBasicMaterial({
        color: YELLOW,
        transparent: true,
        opacity: 0.3,
      });
      const glowMat = new THREE.LineBasicMaterial({
        color: YELLOW,
        transparent: true,
        opacity: 0.09,
      });
      const fillMat = new THREE.MeshBasicMaterial({
        color: YELLOW,
        transparent: true,
        opacity: 0.03,
        side: THREE.DoubleSide,
      });

      const sg = new THREE.Group();
      const gg = new THREE.Group();
      const fg = new THREE.Group();

      geo.features.forEach((f) => {
        const polys =
          f.geometry.type === "Polygon"
            ? [f.geometry.coordinates as number[][][]]
            : (f.geometry.coordinates as number[][][][]);
        polys.forEach((poly) => {
          poly.forEach((ring, ri) => {
            if (!inBox(ring)) return;
            const pts = ringPts(ring);
            if (pts.length < 2) return;
            const g = new THREE.BufferGeometry().setFromPoints(pts);
            sg.add(new THREE.Line(g, borderMat));
            const gl = new THREE.Line(g, glowMat);
            gl.position.y = -0.015;
            gl.scale.set(1.003, 1, 1.003);
            gg.add(gl);
            if (ri === 0) {
              const sh = new THREE.Shape();
              pts.forEach((p, i) => (i ? sh.lineTo(p.x, -p.z) : sh.moveTo(p.x, -p.z)));
              const s = new THREE.ShapeGeometry(sh);
              s.rotateX(Math.PI / 2);
              const m = new THREE.Mesh(s, fillMat);
              m.position.y = -0.06;
              fg.add(m);
            }
          });
        });
      });

      world.add(fg);
      gg.position.y = -0.03;
      world.add(gg);
      sg.position.y = -0.04;
      world.add(sg);

      buildGraticule();
      buildArcs();
      buildPins();
      mapReady = true;
      setLoaderGone(true);
    };

    const resize = () => {
      const r = container.getBoundingClientRect();
      renderer.setSize(r.width, r.height, false);
      makeCamera(r.width, r.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let px = 0;
    let py = 0;
    let tx = 0;
    let ty = 0;
    const onPointerMove = (e: PointerEvent) => {
      const r = container.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    container.addEventListener("pointermove", onPointerMove);

    const _v = new THREE.Vector3();
    const placeLabels = () => {
      pins.forEach((p) => {
        _v.copy(p.pos);
        _v.y += 4.4;
        _v.applyMatrix4(world.matrixWorld);
        _v.project(camera);
        const onScreen =
          _v.z < 1 && _v.x >= -1.1 && _v.x <= 1.1 && _v.y >= -1.1 && _v.y <= 1.1;
        let sx = (_v.x * 0.5 + 0.5) * VW + p.off.dx;
        let sy = (-_v.y * 0.5 + 0.5) * VH + p.off.dy;
        const mx = 80;
        const my = 22;
        sx = Math.max(mx, Math.min(VW - mx, sx));
        sy = Math.max(my, Math.min(VH - my, sy));
        p.el.style.left = sx + "px";
        p.el.style.top = sy + "px";
        p.el.style.opacity = mapReady && onScreen ? "1" : "0";
      });

      const vis = [...pins]
        .filter((p) => p.el.style.opacity === "1")
        .sort((a, b) => parseFloat(a.el.style.top) - parseFloat(b.el.style.top));
      for (let i = 1; i < vis.length; i++) {
        const A = vis[i - 1];
        const C = vis[i];
        const ay = parseFloat(A.el.style.top);
        const cy = parseFloat(C.el.style.top);
        const ax = parseFloat(A.el.style.left);
        const cx = parseFloat(C.el.style.left);
        if (Math.abs(cy - ay) < 28 && Math.abs(cx - ax) < 170) {
          C.el.style.top = Math.min(VH - 22, ay + 30) + "px";
        }
      }
    };

    const clock = new THREE.Clock();
    let rafId = 0;
    let disposed = false;

    const tick = () => {
      if (disposed) return;
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;
      const tourActive = tour && !tour.done;

      if (tourActive) {
        px = 0;
        py = 0;
      } else {
        px += (tx - px) * 0.035;
        py += (ty - py) * 0.035;
      }
      world.rotation.y = px * 0.04;
      world.rotation.x = py * 0.02;

      if (tourActive) {
        updateTour(dt);
        camera.position.copy(camPos);
        camera.lookAt(camLook);
      } else {
        camera.position.lerp(HOME.pos, 0.05);
        _look.lerp(HOME.look, 0.05);
        camera.lookAt(_look);
      }

      pins.forEach((p) => {
        const k = (t * 0.55 + p.phase) % 1;
        p.pulse.scale.setScalar(1 + k * 2.0);
        (p.pulse.material as THREE.MeshBasicMaterial).opacity = 0.6 * (1 - k);
      });
      arcs.forEach((a) => {
        a.t = (a.t + a.spd) % 1;
        const pos = a.curve.getPoint(a.t);
        a.dot.position.copy(pos);
        a.halo.position.copy(pos);
        a.halo.scale.setScalar(1 + Math.sin(t * 4) * 0.2);
      });

      if (mapReady) placeLabels();
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };

    camera.position.copy(HOME.pos);
    tick();

    fetch(GEOJSON_URL)
      .then((r) => r.json())
      .then((gj) => {
        const SKIP = new Set(["Alaska", "Hawaii", "Puerto Rico"]);
        const geo = {
          features: gj.features.filter(
            (f: { properties?: { name?: string } }) =>
              !SKIP.has((f.properties && f.properties.name) || ""),
          ),
        };
        buildMap(geo);
      })
      .catch((err) => {
        console.error("geo load failed", err);
        setFailed(true);
        setLoaderGone(true);
      });

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      container.removeEventListener("pointermove", onPointerMove);
      pins.forEach((p) => p.el.remove());
      renderer.dispose();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else if (mat) mat.dispose();
      });
    };
  }, []);

  return (
    <div className="dpxmap">
      <div ref={containerRef} className="dpxmap-inner">
        <canvas ref={canvasRef} className="dpxmap-canvas" />
        <div ref={labelsRef} className="dpxmap-labels" />
      </div>

      <div className="dpxmap-frame">
        <span className="dpxmap-tl" />
        <span className="dpxmap-tr" />
        <span className="dpxmap-bl" />
        <span className="dpxmap-br" />
      </div>

      <div className="dpxmap-legend">
        <span className="dpxmap-cap">Network Status</span>
        <span>Operational Â· In Development</span>
        <span>North American Footprint</span>
      </div>

      <div className="dpxmap-meta">
        <div className="dpxmap-row">
          <span className="dpxmap-live" />
          Power + Compute Network Â· <b>Live</b>
        </div>
        <div className="dpxmap-row">4 Sites Â· North America</div>
      </div>

      {!loaderGone && (
        <div className="dpxmap-loader">
          <div className="dpxmap-bar" />
        </div>
      )}

      {failed && (
        <div className="absolute inset-0 bg-black z-[4]">
          <div className="relative w-full h-full flex items-center justify-center p-0">
            {/* High-Fidelity World Map Background */}
            <div className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none">
              <img
                src="/about-map.avif"
                alt="Map Background"
                className="w-full h-full object-cover grayscale brightness-[0.25]"
              />
            </div>

            <svg viewBox="0 0 1000 500" className="relative w-full h-full z-10 select-none">
              {/* Abstract World Path */}
              <path
                fill="#111"
                d="M150,120 L220,100 L300,120 L350,200 L320,280 L250,350 L180,300 L150,200 Z M450,100 L550,80 L650,120 L700,200 L650,300 L550,350 L450,300 Z"
                className="opacity-40"
              />

              {/* Highlighted USA Silhouette */}
              <g transform="translate(60, 130) scale(1.2)">
                <path
                  d="M0,20 L10,15 L25,20 L40,10 L60,15 L80,10 L100,20 L115,40 L125,70 L110,100 L90,110 L70,105 L50,110 L30,105 L15,115 L0,100 L-10,60 Z"
                  fill="none"
                  stroke="#f5c518"
                  strokeWidth="1.5"
                  strokeOpacity="0.8"
                />
                <path d="M20,20 L20,110 M40,15 L40,110 M60,15 L60,105 M80,10 L80,105 M100,20 L100,110" stroke="#f5c518" strokeWidth="0.5" strokeOpacity="0.1" fill="none" />
              </g>

              {/* Connection Arcs */}
              <g fill="none" stroke="#f5c518" strokeWidth="1.5" strokeLinecap="round">
                <m.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.8 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  d="M210,175 Q380,50 500,320"
                />
                <m.path
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  d="M210,175 Q500,150 780,350"
                  strokeDasharray="6 4"
                />
              </g>

              {/* Animated Particles */}
              <circle r="3" fill="#f5c518" filter="blur(2px)">
                <animateMotion dur="3s" repeatCount="indefinite" path="M210,175 Q380,50 500,320" />
              </circle>
              <circle r="2" fill="#f5c518">
                <animateMotion dur="4s" repeatCount="indefinite" path="M210,175 Q500,150 780,350" />
              </circle>

              {/* Focal Nodes */}
              {[
                { x: 210, y: 175 }, { x: 210, y: 210 }, { x: 500, y: 320 }, { x: 780, y: 350 }
              ].map((node, i) => (
                <g key={i}>
                  <circle cx={node.x} cy={node.y} r="4" fill="#f5c518">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={node.x} cy={node.y} r="12" fill="#f5c518" opacity="0.15" />
                </g>
              ))}
            </svg>

            {/* HTML Labels */}
            <div className="absolute inset-0 pointer-events-none z-20">
              <div className="absolute top-[22%] left-[16%] flex flex-col items-center">
                <div className="bg-black/90 border border-[#f5c518]/60 px-2.5 py-1 rounded shadow-xl backdrop-blur-sm">
                  <span className="text-[8px] font-black text-white uppercase tracking-widest">Buffalo, NY</span>
                </div>
                <div className="w-px h-10 bg-gradient-to-b from-[#f5c518]/60 to-transparent" />
              </div>
              <div className="absolute top-[42%] left-[23%] flex items-center">
                <div className="w-10 h-px bg-gradient-to-r from-transparent to-[#f5c518]/60" />
                <div className="bg-black/90 border border-[#f5c518]/60 px-2.5 py-1 rounded shadow-xl ml-1 whitespace-nowrap backdrop-blur-sm">
                  <span className="text-[8px] font-black text-white uppercase tracking-widest">North Tonawanda, NY</span>
                </div>
              </div>
              <div className="absolute top-[70%] left-[45%] flex flex-col items-center">
                <div className="w-px h-8 bg-gradient-to-t from-[#f5c518]/60 to-transparent" />
                <div className="bg-black/90 border border-[#f5c518]/60 px-2.5 py-1 rounded shadow-xl backdrop-blur-sm">
                  <span className="text-[8px] font-black text-white uppercase tracking-widest">Columbiana, AL</span>
                </div>
              </div>
              <div className="absolute top-[76%] left-[68%] flex flex-col items-center">
                <div className="w-px h-10 bg-gradient-to-t from-[#f5c518]/60 to-transparent" />
                <div className="bg-black/90 border border-[#f5c518]/60 px-3 py-1.5 rounded shadow-xl text-center backdrop-blur-sm">
                  <span className="text-[8px] font-black text-white uppercase tracking-widest block leading-tight">North Carolina<br/>Development Site</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigiPowerXMap;
