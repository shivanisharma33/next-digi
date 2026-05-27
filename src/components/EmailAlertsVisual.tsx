import React, { useEffect, useRef } from 'react';

/* ─── Types ─────────────────────────────────────── */
interface Vec3 { x: number; y: number; z: number; }

interface DataPacket {
  progress: number;   // 0→1 along the path
  speed: number;
  fromRack: number;
  toRack: number;
  alpha: number;
}

interface ServerRack {
  x: number; y: number; z: number;  // world space
  w: number; h: number; d: number;
  lights: boolean[];                 // which LEDs are on
  lightTimer: number;
  label: string;
}

interface OrbitalRing {
  rx: number; ry: number; rz: number;  // euler angles
  vrx: number; vry: number; vrz: number;
  radius: number;
  alpha: number;
}

/* ─── Perspective helper ─────────────────────────── */
const FOV = 500;
const project = (v: Vec3, cx: number, cy: number): { sx: number; sy: number; scale: number } => {
  const z = v.z + FOV;
  const scale = FOV / Math.max(z, 1);
  return { sx: cx + v.x * scale, sy: cy + v.y * scale, scale };
};

/* ─── Rotate a point around Y then X ────────────── */
const rotateYX = (v: Vec3, ry: number, rx: number): Vec3 => {
  // Rotate Y
  let x = v.x * Math.cos(ry) + v.z * Math.sin(ry);
  let z = -v.x * Math.sin(ry) + v.z * Math.cos(ry);
  let y = v.y;
  // Rotate X
  const y2 = y * Math.cos(rx) - z * Math.sin(rx);
  const z2 = y * Math.sin(rx) + z * Math.cos(rx);
  return { x, y: y2, z: z2 };
};

/* ─── Envelope path builder (2D screen-space) ───── */
const drawEnvelope = (
  ctx: CanvasRenderingContext2D,
  sx: number, sy: number,
  size: number,
  alpha: number,
  pulse: number
) => {
  const s = size;
  const glowA = alpha * (0.6 + 0.4 * Math.sin(pulse));
  ctx.save();
  ctx.translate(sx, sy);

  // Outer glow
  const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 2.2);
  grd.addColorStop(0, `rgba(245,197,24,${glowA * 0.3})`);
  grd.addColorStop(1, 'rgba(245,197,24,0)');
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(0, 0, s * 2.2, 0, Math.PI * 2);
  ctx.fill();

  // Envelope body
  ctx.strokeStyle = `rgba(245,197,24,${alpha})`;
  ctx.lineWidth = 1;
  ctx.fillStyle = `rgba(245,197,24,${alpha * 0.12})`;
  ctx.beginPath();
  ctx.rect(-s, -s * 0.65, s * 2, s * 1.3);
  ctx.fill();
  ctx.stroke();

  // Flap
  ctx.beginPath();
  ctx.moveTo(-s, -s * 0.65);
  ctx.lineTo(0, s * 0.1);
  ctx.lineTo(s, -s * 0.65);
  ctx.strokeStyle = `rgba(245,197,24,${alpha * 0.7})`;
  ctx.stroke();

  ctx.restore();
};

/* ─── Draw a 3D box (8 corners, 12 edges) ──────── */
const drawBox = (
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number,
  origin: Vec3,
  w: number, h: number, d: number,
  camRy: number, camRx: number,
  strokeColor: string,
  fillColor: string,
) => {
  const hw = w / 2, hd = d / 2;

  // Corners local (left-right, top-bottom, front-back)
  const corners: Vec3[] = [
    { x: -hw, y: 0,  z: -hd }, { x: hw, y: 0,  z: -hd },
    { x: hw,  y: 0,  z:  hd }, { x: -hw, y: 0,  z:  hd },
    { x: -hw, y: -h, z: -hd }, { x: hw, y: -h, z: -hd },
    { x: hw,  y: -h, z:  hd }, { x: -hw, y: -h, z:  hd },
  ];

  const projected = corners.map(c => {
    const world: Vec3 = { x: origin.x + c.x, y: origin.y + c.y, z: origin.z + c.z };
    const rotated = rotateYX(world, camRy, camRx);
    return project(rotated, cx, cy);
  });

  const edges = [
    [0,1],[1,2],[2,3],[3,0],
    [4,5],[5,6],[6,7],[7,4],
    [0,4],[1,5],[2,6],[3,7],
  ];

  // Draw faces (top, front, right) for depth feel
  const faces = [
    { verts: [4,5,6,7], shade: 0.9 },  // top face
    { verts: [0,1,5,4], shade: 0.55 }, // front
    { verts: [1,2,6,5], shade: 0.35 }, // right
  ];

  faces.forEach(f => {
    ctx.beginPath();
    f.verts.forEach((vi, i) => {
      const p = projected[vi];
      if (i === 0) ctx.moveTo(p.sx, p.sy);
      else ctx.lineTo(p.sx, p.sy);
    });
    ctx.closePath();
    ctx.fillStyle = fillColor.replace('ALPHA', String(f.shade * 0.18));
    ctx.fill();
  });

  // Edges
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = 0.8;
  edges.forEach(([a, b]) => {
    ctx.beginPath();
    ctx.moveTo(projected[a].sx, projected[a].sy);
    ctx.lineTo(projected[b].sx, projected[b].sy);
    ctx.stroke();
  });

  return projected;
};

/* ─────────────────────────────────────────────────
   Main Component
──────────────────────────────────────────────────── */
export default function EmailAlertsVisual() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    let W = 0, H = 0;
    let tick = 0;

    // Camera slow auto-rotation base values
    let baseCamRy = 0.32;
    let baseCamRx = 0.18;
    let camRy = baseCamRy;
    let camRx = baseCamRx;

    // Parallax mouse offsets
    let targetOffsetRy = 0;
    let targetOffsetRx = 0;
    let offsetRy = 0;
    let offsetRx = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;
      targetOffsetRy = nx * 0.22; // subtle horizontal rotation
      targetOffsetRx = ny * 0.14; // subtle vertical rotation
    };

    window.addEventListener('mousemove', handleMouseMove);

    /* ── Scene objects ── */
    const RACKS: ServerRack[] = [];
    const PACKETS: DataPacket[] = [];
    const ORBS: OrbitalRing[] = [];

    const initScene = (w: number, h: number) => {
      RACKS.length = 0;
      PACKETS.length = 0;
      ORBS.length = 0;

      // 8 server racks arranged in two rows (world units)
      const positions = [
        { x: -260, z: -100, label: 'NODE-A1' },
        { x: -130, z: -100, label: 'NODE-A2' },
        { x:    0, z: -100, label: 'NODE-A3' },
        { x:  130, z: -100, label: 'NODE-A4' },
        { x: -195, z:  80,  label: 'NODE-B1' },
        { x:  -65, z:  80,  label: 'NODE-B2' },
        { x:   65, z:  80,  label: 'NODE-B3' },
        { x:  195, z:  80,  label: 'NODE-B4' },
      ];

      positions.forEach(p => {
        RACKS.push({
          x: p.x, y: 60, z: p.z,
          w: 44, h: 110, d: 30,
          lights: Array.from({ length: 6 }, () => Math.random() > 0.3),
          lightTimer: Math.random() * 60,
          label: p.label,
        });
      });

      // 3 orbital rings around origin
      const ringSizes = [160, 220, 290];
      ringSizes.forEach((r, i) => {
        ORBS.push({
          rx: (i * Math.PI) / 3,
          ry: (i * Math.PI * 2) / 3,
          rz: 0,
          vrx: 0.0018 * (i % 2 === 0 ? 1 : -1),
          vry: 0.0025 * (i % 2 === 0 ? -1 : 1),
          vrz: 0.001,
          radius: r,
          alpha: 0.22 - i * 0.04,
        });
      });

      // Seed initial packets
      for (let i = 0; i < 6; i++) spawnPacket();
    };

    const spawnPacket = () => {
      const fromRack = Math.floor(Math.random() * RACKS.length);
      let toRack = Math.floor(Math.random() * RACKS.length);
      while (toRack === fromRack) toRack = Math.floor(Math.random() * RACKS.length);
      PACKETS.push({
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.003,
        fromRack,
        toRack,
        alpha: 0.7 + Math.random() * 0.3,
      });
    };

    /* ── Resize ── */
    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      W = rect.width; H = rect.height;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.scale(dpr, dpr);
      initScene(W, H);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    /* ── Draw perspective floor grid ── */
    const drawFloorGrid = (cx: number, cy: number) => {
      const gridHW = 380;
      const gridHD = 240;
      const step = 60;
      ctx.lineWidth = 0.5;

      for (let gx = -gridHW; gx <= gridHW; gx += step) {
        const a = rotateYX({ x: gx, y: 60, z: -gridHD }, camRy, camRx);
        const b = rotateYX({ x: gx, y: 60, z:  gridHD }, camRy, camRx);
        const pa = project(a, cx, cy);
        const pb = project(b, cx, cy);
        const fade = 0.06 + 0.06 * (1 - Math.abs(gx) / gridHW);
        ctx.strokeStyle = `rgba(245,197,24,${fade})`;
        ctx.beginPath();
        ctx.moveTo(pa.sx, pa.sy);
        ctx.lineTo(pb.sx, pb.sy);
        ctx.stroke();
      }
      for (let gz = -gridHD; gz <= gridHD; gz += step) {
        const a = rotateYX({ x: -gridHW, y: 60, z: gz }, camRy, camRx);
        const b = rotateYX({ x:  gridHW, y: 60, z: gz }, camRy, camRx);
        const pa = project(a, cx, cy);
        const pb = project(b, cx, cy);
        const fade = 0.06 + 0.06 * (1 - Math.abs(gz) / gridHD);
        ctx.strokeStyle = `rgba(245,197,24,${fade})`;
        ctx.beginPath();
        ctx.moveTo(pa.sx, pa.sy);
        ctx.lineTo(pb.sx, pb.sy);
        ctx.stroke();
      }
    };

    /* ── Draw orbital rings ── */
    const drawOrbitalRing = (orb: OrbitalRing, cx: number, cy: number) => {
      const segments = 64;
      const points: { sx: number; sy: number }[] = [];

      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        const local: Vec3 = {
          x: Math.cos(angle) * orb.radius,
          y: Math.sin(angle) * orb.radius,
          z: 0,
        };
        // Apply ring's own rotation
        let v = rotateYX(local, orb.ry, orb.rx);
        v = rotateYX(v, camRy, camRx);
        const p = project(v, cx, cy);
        points.push(p);
      }

      ctx.strokeStyle = `rgba(245,197,24,${orb.alpha})`;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      points.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.sx, p.sy);
        else ctx.lineTo(p.sx, p.sy);
      });
      ctx.stroke();
    };

    /* ── Main loop ── */
    const animate = () => {
      tick++;
      baseCamRy += 0.0006;  // very slow camera drift

      // Smooth interpolation for parallax camera
      offsetRy += (targetOffsetRy - offsetRy) * 0.05;
      offsetRx += (targetOffsetRx - offsetRx) * 0.05;
      camRy = baseCamRy + offsetRy;
      camRx = baseCamRx + offsetRx;

      ctx.clearRect(0, 0, W, H);

      const cx = W / 2;
      const cy = H * 0.52;

      // ── Radial background glow ──
      const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.55);
      bg.addColorStop(0, 'rgba(245,197,24,0.05)');
      bg.addColorStop(0.5, 'rgba(10,10,14,0.0)');
      bg.addColorStop(1, 'rgba(5,6,8,0)');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // ── Floor grid ──
      drawFloorGrid(cx, cy);

      // ── Orbital rings ──
      ORBS.forEach(orb => {
        orb.rx += orb.vrx;
        orb.ry += orb.vry;
        orb.rz += orb.vrz;
        drawOrbitalRing(orb, cx, cy);
      });

      // ── Compute rack screen positions ──
      const rackScreenPos: { sx: number; sy: number; scale: number }[] = RACKS.map(rack => {
        const rotated = rotateYX({ x: rack.x, y: rack.y - rack.h / 2, z: rack.z }, camRy, camRx);
        return project(rotated, cx, cy);
      });

      // ── Connection lines between racks ──
      ctx.lineWidth = 0.4;
      RACKS.forEach((rA, i) => {
        RACKS.forEach((rB, j) => {
          if (j <= i) return;
          const dist = Math.sqrt((rA.x - rB.x) ** 2 + (rA.z - rB.z) ** 2);
          if (dist > 250) return;
          const pA = rackScreenPos[i];
          const pB = rackScreenPos[j];
          ctx.strokeStyle = `rgba(245,197,24,0.06)`;
          ctx.beginPath();
          ctx.moveTo(pA.sx, pA.sy);
          ctx.lineTo(pB.sx, pB.sy);
          ctx.stroke();
        });
      });

      // ── Server racks ──
      RACKS.forEach((rack, ri) => {
        rack.lightTimer++;
        if (rack.lightTimer > 40 + Math.random() * 40) {
          rack.lightTimer = 0;
          const li = Math.floor(Math.random() * rack.lights.length);
          rack.lights[li] = !rack.lights[li];
        }

        const rPos: Vec3 = { x: rack.x, y: rack.y, z: rack.z };
        const alpha = 0.55 + 0.3 * Math.sin(tick * 0.012 + ri);

        drawBox(
          ctx, cx, cy,
          rPos,
          rack.w, rack.h, rack.d,
          camRy, camRx,
          `rgba(245,197,24,${alpha * 0.65})`,
          'rgba(245,197,24,ALPHA)'
        );

        // LED lights on rack face
        const faceTopWorld = rotateYX(
          { x: rack.x, y: rack.y - rack.h + 10, z: rack.z - rack.d / 2 - 1 },
          camRy, camRx
        );
        const facePt = project(faceTopWorld, cx, cy);
        const sc = facePt.scale;
        rack.lights.forEach((on, li) => {
          const lx = facePt.sx + (li % 3 - 1) * 7 * sc;
          const ly = facePt.sy + Math.floor(li / 3) * 9 * sc;
          ctx.beginPath();
          ctx.arc(lx, ly, 1.6 * sc, 0, Math.PI * 2);
          ctx.fillStyle = on
            ? `rgba(245,197,24,${0.8 + 0.2 * Math.sin(tick * 0.1 + li)})`
            : 'rgba(245,197,24,0.08)';
          ctx.fill();
        });

        // Rack label
        const labelPt = rackScreenPos[ri];
        ctx.fillStyle = `rgba(245,197,24,0.28)`;
        ctx.font = `${Math.max(7, 8 * labelPt.scale)}px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(rack.label, labelPt.sx, labelPt.sy - 6 * labelPt.scale);
      });

      // ── Data packets (flying envelopes) ──
      PACKETS.forEach((pkt, pi) => {
        pkt.progress += pkt.speed;

        if (pkt.progress >= 1) {
          // Respawn
          pkt.fromRack = pkt.toRack;
          pkt.toRack = Math.floor(Math.random() * RACKS.length);
          while (pkt.toRack === pkt.fromRack) pkt.toRack = Math.floor(Math.random() * RACKS.length);
          pkt.progress = 0;
        }

        const rFrom = RACKS[pkt.fromRack];
        const rTo   = RACKS[pkt.toRack];
        const t = pkt.progress;
        const easeT = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

        // Arc trajectory: rise in the middle
        const arcY = -90 * Math.sin(t * Math.PI);

        const world: Vec3 = {
          x: rFrom.x + (rTo.x - rFrom.x) * easeT,
          y: (rFrom.y - rFrom.h * 0.7) + arcY,
          z: rFrom.z + (rTo.z - rFrom.z) * easeT,
        };

        const rotated = rotateYX(world, camRy, camRx);
        const pt = project(rotated, cx, cy);

        // Trail
        const trailLen = 8;
        for (let tl = 1; tl <= trailLen; tl++) {
          const tProgress = Math.max(0, t - tl * pkt.speed * 4);
          const tEase = tProgress < 0.5 ? 2 * tProgress * tProgress : 1 - Math.pow(-2 * tProgress + 2, 2) / 2;
          const tWorld: Vec3 = {
            x: rFrom.x + (rTo.x - rFrom.x) * tEase,
            y: (rFrom.y - rFrom.h * 0.7) + (-90 * Math.sin(tProgress * Math.PI)),
            z: rFrom.z + (rTo.z - rFrom.z) * tEase,
          };
          const tRot = rotateYX(tWorld, camRy, camRx);
          const tPt = project(tRot, cx, cy);
          const trailAlpha = (1 - tl / trailLen) * 0.18 * pkt.alpha;
          ctx.beginPath();
          ctx.arc(tPt.sx, tPt.sy, 1.5 * pt.scale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245,197,24,${trailAlpha})`;
          ctx.fill();
        }

        // Envelope icon
        const envSize = Math.max(5, 9 * pt.scale);
        drawEnvelope(ctx, pt.sx, pt.sy, envSize, pkt.alpha * 0.85, tick * 0.08 + pi);
      });

      // ── Spawn new packets occasionally ──
      if (tick % 90 === 0 && PACKETS.length < 10) spawnPacket();

      // ── Center broadcast tower / pillar ──
      const towerH = 130;
      const towerPos: Vec3 = { x: 0, y: 60, z: -10 };
      drawBox(ctx, cx, cy, towerPos, 20, towerH, 20, camRy, camRx,
        `rgba(245,197,24,0.8)`, 'rgba(245,197,24,ALPHA)');

      // Beacon pulse from top of tower
      const beaconWorld = rotateYX(
        { x: towerPos.x, y: towerPos.y - towerH - 8, z: towerPos.z },
        camRy, camRx
      );
      const beacon = project(beaconWorld, cx, cy);

      for (let pr = 0; pr < 3; pr++) {
        const phase = ((tick * 1.2 + pr * 50) % 150) / 150;
        const pR = phase * 60 * beacon.scale;
        const pA = (1 - phase) * 0.28;
        ctx.beginPath();
        ctx.arc(beacon.sx, beacon.sy, pR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(245,197,24,${pA})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Bright beacon dot
      ctx.beginPath();
      ctx.arc(beacon.sx, beacon.sy, 3 * beacon.scale, 0, Math.PI * 2);
      const bdot = ctx.createRadialGradient(beacon.sx, beacon.sy, 0, beacon.sx, beacon.sy, 8 * beacon.scale);
      bdot.addColorStop(0, 'rgba(255,220,40,0.95)');
      bdot.addColorStop(1, 'rgba(245,197,24,0)');
      ctx.fillStyle = bdot;
      ctx.fill();

      raf = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,rgba(5,6,8,0.0)_20%,rgba(5,6,8,0.65)_80%)] pointer-events-none" />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#050608] to-transparent pointer-events-none" />
    </div>
  );
}
