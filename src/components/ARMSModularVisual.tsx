import { useEffect, useRef } from 'react';

const ARMSModularVisual = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1, raf = 0, dead = false;

    const resize = () => {
      const r = container.getBoundingClientRect();
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    addEventListener('resize', resize);

    // --- 3D Math ---
    const rotY = (x: number, z: number, a: number) => ({
      x: x * Math.cos(a) - z * Math.sin(a),
      z: x * Math.sin(a) + z * Math.cos(a),
    });

    const project = (x: number, y: number, z: number, angle: number) => {
      const r = rotY(x, z, angle);
      return {
        sx: w / 2 + (r.x - r.z) * 0.866,
        sy: h / 2 + 20 + (r.x + r.z) * 0.5 - y,
        depth: r.z,
      };
    };

    // Energy particles along cables
    const cableParticles: { t: number; sp: number; cable: number }[] = [];
    for (let i = 0; i < 20; i++) {
      cableParticles.push({ t: Math.random(), sp: 0.003 + Math.random() * 0.004, cable: i % 4 });
    }

    // --- Drawing helpers ---
    const poly = (pts: { sx: number; sy: number }[], fill: string, stroke: string, sw = 1) => {
      ctx.beginPath();
      ctx.moveTo(pts[0].sx, pts[0].sy);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].sx, pts[i].sy);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.lineWidth = sw;
      ctx.stroke();
    };

    // --- Draw a full modular data center building ---
    const drawModule = (
      cx: number, cz: number,
      bw: number, bd: number, bh: number,
      angle: number, t: number, idx: number,
      label: string, kw: string
    ) => {
      const X = bw, Z = bd, Y = bh;

      // 8 corners of the box
      const corners = [
        project(cx - X, 0,   cz - Z, angle), // 0 front-left-bottom
        project(cx + X, 0,   cz - Z, angle), // 1 front-right-bottom
        project(cx + X, 0,   cz + Z, angle), // 2 back-right-bottom
        project(cx - X, 0,   cz + Z, angle), // 3 back-left-bottom
        project(cx - X, Y,   cz - Z, angle), // 4 front-left-top
        project(cx + X, Y,   cz - Z, angle), // 5 front-right-top
        project(cx + X, Y,   cz + Z, angle), // 6 back-right-top
        project(cx - X, Y,   cz + Z, angle), // 7 back-left-top
      ];

      const pulse = 0.85 + 0.15 * Math.sin(t * 1.5 + idx * 1.1);

      // --- Left face (darker) ---
      poly(
        [corners[0], corners[3], corners[7], corners[4]],
        'rgba(14,16,14,0.98)',
        `rgba(255,255,255,0.08)`, 0.7
      );
      // Vertical stripes on left face
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 0.5;
      for (let s = -0.5; s <= 0.5; s += 0.25) {
        const b = project(cx - X, 0, cz + Z * s, angle);
        const top = project(cx - X, Y, cz + Z * s, angle);
        ctx.beginPath(); ctx.moveTo(b.sx, b.sy); ctx.lineTo(top.sx, top.sy); ctx.stroke();
      }

      // --- Right face (medium shade) ---
      poly(
        [corners[1], corners[2], corners[6], corners[5]],
        'rgba(20,22,20,0.98)',
        `rgba(255,255,255,0.1)`, 0.7
      );
      // Vertical stripes on right face
      ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 0.5;
      for (let s = -0.5; s <= 0.5; s += 0.25) {
        const b = project(cx + X, 0, cz + Z * s, angle);
        const top = project(cx + X, Y, cz + Z * s, angle);
        ctx.beginPath(); ctx.moveTo(b.sx, b.sy); ctx.lineTo(top.sx, top.sy); ctx.stroke();
      }

      // --- Front face ---
      poly(
        [corners[0], corners[1], corners[5], corners[4]],
        'rgba(18,21,18,0.98)',
        `rgba(255,255,255,0.12)`, 0.8
      );
      // Door on front face
      const dw = X * 0.25, dh = Y * 0.55;
      const dl = project(cx - dw, 0, cz - Z, angle);
      const dr = project(cx + dw, 0, cz - Z, angle);
      const dlt = project(cx - dw, dh, cz - Z, angle);
      const drt = project(cx + dw, dh, cz - Z, angle);
      poly([dl, dr, drt, dlt], 'rgba(30,34,30,1)', 'rgba(245,197,24,0.3)', 0.7);
      // Door handle
      const dhandle = project(cx + dw * 0.6, dh * 0.5, cz - Z, angle);
      ctx.beginPath(); ctx.arc(dhandle.sx, dhandle.sy, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245,197,24,${pulse * 0.7})`; ctx.fill();
      // Logo stripe on front
      const sl = project(cx - X, Y * 0.1, cz - Z, angle);
      const sr = project(cx + X, Y * 0.1, cz - Z, angle);
      const slt = project(cx - X, Y * 0.25, cz - Z, angle);
      const srt = project(cx + X, Y * 0.25, cz - Z, angle);
      poly([sl, sr, srt, slt], `rgba(245,197,24,${0.18})`, `rgba(245,197,24,${0.0})`, 0);

      // --- Back face ---
      poly(
        [corners[3], corners[2], corners[6], corners[7]],
        'rgba(12,14,12,0.98)',
        `rgba(255,255,255,0.05)`, 0.5
      );

      // --- Roof (top face, brightest) ---
      poly(
        [corners[4], corners[5], corners[6], corners[7]],
        'rgba(28,32,28,0.98)',
        `rgba(245,197,24,${0.3 * pulse})`, 1
      );

      // HVAC units on roof (2 units)
      [-0.35, 0.35].forEach((ox, hi) => {
        const hx = cx + X * ox * 0.8;
        const hw = X * 0.22, hd = Z * 0.5, hht = 12;
        const hCorners = [
          project(hx - hw, Y, cz - hd, angle),
          project(hx + hw, Y, cz - hd, angle),
          project(hx + hw, Y, cz + hd, angle),
          project(hx - hw, Y, cz + hd, angle),
          project(hx - hw, Y + hht, cz - hd, angle),
          project(hx + hw, Y + hht, cz - hd, angle),
          project(hx + hw, Y + hht, cz + hd, angle),
          project(hx - hw, Y + hht, cz + hd, angle),
        ];
        poly([hCorners[0], hCorners[1], hCorners[5], hCorners[4]], 'rgba(30,35,30,0.98)', 'rgba(255,255,255,0.12)', 0.6);
        poly([hCorners[0], hCorners[3], hCorners[7], hCorners[4]], 'rgba(22,26,22,0.98)', 'rgba(255,255,255,0.07)', 0.5);
        poly([hCorners[4], hCorners[5], hCorners[6], hCorners[7]], 'rgba(40,45,40,0.98)', `rgba(245,197,24,${0.2 * pulse})`, 0.7);
        // Spinning fan
        const fanC = project(hx, Y + hht, cz, angle);
        const fanR = hw * 0.6;
        const fanAngle = t * (2 + hi) * (hi === 0 ? 1 : -1.3);
        ctx.strokeStyle = `rgba(245,197,24,${0.45 * pulse})`; ctx.lineWidth = 0.8;
        for (let b = 0; b < 4; b++) {
          const a = fanAngle + (b * Math.PI * 0.5);
          ctx.beginPath();
          ctx.moveTo(fanC.sx, fanC.sy);
          ctx.lineTo(fanC.sx + Math.cos(a) * fanR * 0.9, fanC.sy + Math.sin(a) * fanR * 0.45);
          ctx.stroke();
        }
        ctx.beginPath(); ctx.arc(fanC.sx, fanC.sy, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,197,24,${pulse})`; ctx.fill();
      });

      // Cable tray along roof spine
      const trayL = project(cx - X, Y + 4, cz, angle);
      const trayR = project(cx + X, Y + 4, cz, angle);
      ctx.strokeStyle = `rgba(245,197,24,0.25)`; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(trayL.sx, trayL.sy); ctx.lineTo(trayR.sx, trayR.sy); ctx.stroke();

      // Status light on front top
      const statusP = project(cx + X * 0.85, Y * 0.9, cz - Z, angle);
      ctx.beginPath(); ctx.arc(statusP.sx, statusP.sy, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,232,120,${pulse})`;
      ctx.shadowColor = '#00e878'; ctx.shadowBlur = 8; ctx.fill(); ctx.shadowBlur = 0;

      // Label above module
      const labelP = project(cx, Y + 30, cz, angle);
      ctx.textAlign = 'center';
      ctx.fillStyle = `rgba(245,197,24,0.85)`;
      ctx.font = `bold 9px monospace`;
      ctx.fillText(label, labelP.sx, labelP.sy - 6);
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '8px monospace';
      ctx.fillText(kw, labelP.sx, labelP.sy + 7);
    };

    // --- Draw ground platform ---
    const drawGround = (angle: number) => {
      const sz = 220;
      const pts = [
        project(-sz, -2, -sz, angle),
        project( sz, -2, -sz, angle),
        project( sz, -2,  sz, angle),
        project(-sz, -2,  sz, angle),
      ];
      poly(pts, 'rgba(255,255,255,0.015)', 'rgba(255,255,255,0.07)', 0.8);
      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 0.4;
      for (let i = -5; i <= 5; i++) {
        const v = i * (sz / 5);
        const a1 = project(-sz, -2, v, angle), a2 = project(sz, -2, v, angle);
        const b1 = project(v, -2, -sz, angle), b2 = project(v, -2, sz, angle);
        ctx.beginPath(); ctx.moveTo(a1.sx, a1.sy); ctx.lineTo(a2.sx, a2.sy); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(b1.sx, b1.sy); ctx.lineTo(b2.sx, b2.sy); ctx.stroke();
      }
    };

    // --- Draw substation ---
    const drawSubstation = (angle: number, t: number) => {
      const sx = 180, sz = 0, sw = 22, sd = 22, sh = 55;
      const c = [
        project(sx - sw, 0, sz - sd, angle), project(sx + sw, 0, sz - sd, angle),
        project(sx + sw, 0, sz + sd, angle), project(sx - sw, 0, sz + sd, angle),
        project(sx - sw, sh, sz - sd, angle), project(sx + sw, sh, sz - sd, angle),
        project(sx + sw, sh, sz + sd, angle), project(sx - sw, sh, sz + sd, angle),
      ];
      poly([c[0], c[3], c[7], c[4]], 'rgba(12,14,12,0.95)', 'rgba(255,255,255,0.1)', 0.7);
      poly([c[1], c[2], c[6], c[5]], 'rgba(16,18,16,0.95)', 'rgba(255,255,255,0.08)', 0.6);
      poly([c[0], c[1], c[5], c[4]], 'rgba(20,22,20,0.95)', 'rgba(245,197,24,0.35)', 0.8);
      poly([c[4], c[5], c[6], c[7]], 'rgba(30,32,30,0.95)', 'rgba(245,197,24,0.2)', 0.7);
      // Insulator stacks on top
      [-0.5, 0, 0.5].forEach(off => {
        const ip = project(sx, sh, sz + off * sd, angle);
        const it = project(sx, sh + 25, sz + off * sd, angle);
        ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(ip.sx, ip.sy); ctx.lineTo(it.sx, it.sy); ctx.stroke();
        ctx.beginPath(); ctx.arc(it.sx, it.sy, 3, 0, Math.PI * 2);
        const pp = 0.7 + 0.3 * Math.sin(t * 2 + off * 3);
        ctx.fillStyle = `rgba(245,197,24,${pp})`;
        ctx.shadowColor = '#f5c518'; ctx.shadowBlur = 6; ctx.fill(); ctx.shadowBlur = 0;
      });
      // Label
      const lp = project(sx, sh + 40, sz, angle);
      ctx.textAlign = 'center'; ctx.font = 'bold 8px monospace';
      ctx.fillStyle = 'rgba(245,197,24,0.7)'; ctx.fillText('SUBSTATION', lp.sx, lp.sy);
    };

    // --- Draw power cables ---
    const drawCables = (angle: number, t: number) => {
      const modulePositions = [
        { cx: -120, cz: -40, topY: 70 },
        { cx:    0, cz:  60, topY: 70 },
        { cx:  120, cz: -40, topY: 70 },
      ];
      const subY = 80;

      // Cable segments: module top-center → substation top
      const segments: [number, number, number, number, number, number][] = [
        [modulePositions[0].cx, modulePositions[0].topY, modulePositions[0].cz, 180, subY, 0],
        [modulePositions[1].cx, modulePositions[1].topY, modulePositions[1].cz, 180, subY, 0],
        [modulePositions[2].cx, modulePositions[2].topY, modulePositions[2].cz, 180, subY, 0],
        // Inter-module cable
        [modulePositions[0].cx, modulePositions[0].topY, modulePositions[0].cz,
          modulePositions[2].cx, modulePositions[2].topY, modulePositions[2].cz],
      ];

      segments.forEach((seg, si) => {
        const p1 = project(seg[0], seg[1], seg[2], angle);
        const p2 = project(seg[3], seg[4], seg[5], angle);
        const mx = (p1.sx + p2.sx) / 2;
        const my = (p1.sy + p2.sy) / 2 + 8;

        ctx.strokeStyle = 'rgba(245,197,24,0.15)'; ctx.lineWidth = 0.8;
        ctx.setLineDash([3, 4]);
        ctx.beginPath(); ctx.moveTo(p1.sx, p1.sy);
        ctx.quadraticCurveTo(mx, my, p2.sx, p2.sy);
        ctx.stroke(); ctx.setLineDash([]);

        // Particles along cables
        cableParticles.filter(p => p.cable === si).forEach(p => {
          p.t = (p.t + p.sp) % 1;
          const tt = p.t;
          const px = (1 - tt) * (1 - tt) * p1.sx + 2 * (1 - tt) * tt * mx + tt * tt * p2.sx;
          const py = (1 - tt) * (1 - tt) * p1.sy + 2 * (1 - tt) * tt * my + tt * tt * p2.sy;
          ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245,197,24,0.9)`;
          ctx.shadowColor = '#f5c518'; ctx.shadowBlur = 7; ctx.fill(); ctx.shadowBlur = 0;
        });
      });
    };

    // --- Draw total capacity label ---
    const drawHUD = () => {
      const items = ['1.8MW CAMPUS', '3 × 600kW MODULES', '400G FABRIC'];
      items.forEach((txt, i) => {
        const x = 16, y = h - 16 - i * 18;
        ctx.fillStyle = i === 0 ? 'rgba(245,197,24,0.85)' : 'rgba(255,255,255,0.3)';
        ctx.font = i === 0 ? 'bold 10px monospace' : '9px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(txt, x, y);
      });
    };

    // --- Main loop ---
    const draw = () => {
      if (dead) return;
      const t = performance.now() * 0.001;
      // Slow auto-rotate
      const angle = t * 0.06;

      ctx.clearRect(0, 0, w, h);

      drawGround(angle);

      // 3 modules — laid in a triangle campus footprint
      const mods = [
        { cx: -120, cz: -40, label: 'MODULE A', kw: '600kW' },
        { cx:    0, cz:  60, label: 'MODULE B', kw: '600kW' },
        { cx:  120, cz: -40, label: 'MODULE C', kw: '600kW' },
      ];
      // Sort by depth for painter's algorithm
      const sorted = mods.map((m, i) => ({ ...m, i, depth: project(m.cx, 0, m.cz, angle).depth }))
        .sort((a, b) => b.depth - a.depth);

      sorted.forEach(m => drawModule(m.cx, m.cz, 68, 35, 70, angle, t, m.i, m.label, m.kw));

      drawSubstation(angle, t);
      drawCables(angle, t);

      // Radial vignette
      const vg = ctx.createRadialGradient(w / 2, h / 2, h * 0.18, w / 2, h / 2, h * 0.7);
      vg.addColorStop(0, 'rgba(6,7,10,0)');
      vg.addColorStop(0.65, 'rgba(6,7,10,0.35)');
      vg.addColorStop(1, 'rgba(6,7,10,0.95)');
      ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);

      drawHUD();

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => { dead = true; cancelAnimationFrame(raf); removeEventListener('resize', resize); };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default ARMSModularVisual;
