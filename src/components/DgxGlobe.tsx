import { useEffect, useRef } from 'react';

const DgxGlobe = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const x = cv.getContext('2d');
    if (!x) return;

    let W = 0, H = 0, CX = 0, CY = 0, R = 0, DPR = 1;
    let rafId = 0;
    let pulseInterval: number | undefined;

    const size = () => {
      const parent = cv.parentElement;
      const w = parent ? parent.clientWidth : window.innerWidth;
      const h = parent ? parent.clientHeight : window.innerHeight;
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.width = w * DPR;
      H = cv.height = h * DPR;
      cv.style.width = w + 'px';
      cv.style.height = h + 'px';
      CX = W * 0.5; CY = H * 0.5;
      R = Math.min(W, H) * 0.23;
    };

    const ro = new ResizeObserver(size);
    if (cv.parentElement) ro.observe(cv.parentElement);
    size();

    const GOLD = '245,197,24';
    const RINGY = '200,205,170';
    const WHITE = '225,228,230';

    type Node = {
      x: number; y: number; z: number;
      band: number; idx: number;
      gold: boolean; sz: number; pphase: number;
    };

    const nodes: Node[] = [];
    const BANDS = [
      { lat: 80, n: 4 }, { lat: 64, n: 9 }, { lat: 48, n: 14 },
      { lat: 32, n: 18 }, { lat: 16, n: 20 }, { lat: 0, n: 21 },
      { lat: -16, n: 20 }, { lat: -32, n: 18 }, { lat: -48, n: 14 },
      { lat: -64, n: 9 }, { lat: -80, n: 4 },
    ];
    BANDS.forEach((b, bi) => {
      const phi = b.lat * Math.PI / 180;
      const cy = Math.sin(phi), cr = Math.cos(phi);
      const offset = (bi % 2) * 0.5;
      for (let i = 0; i < b.n; i++) {
        const th = ((i + offset) / b.n) * Math.PI * 2;
        nodes.push({
          x: Math.cos(th) * cr, y: cy, z: Math.sin(th) * cr,
          band: bi, idx: i,
          gold: Math.random() < 0.13,
          sz: 0.036,
          pphase: Math.random() * Math.PI * 2,
        });
      }
    });

    const links: [number, number][] = [];
    const NI = (n: Node) => nodes.indexOf(n);
    for (let bi = 0; bi < BANDS.length; bi++) {
      const row = nodes.filter(n => n.band === bi);
      for (let i = 0; i < row.length; i++) {
        links.push([NI(row[i]), NI(row[(i + 1) % row.length])]);
      }
      if (bi < BANDS.length - 1) {
        const nxt = nodes.filter(n => n.band === bi + 1);
        row.forEach(a => {
          const sorted = nxt.map(c => ({ c, d: (a.x - c.x) ** 2 + (a.y - c.y) ** 2 + (a.z - c.z) ** 2 }))
            .sort((p, q) => p.d - q.d);
          if (sorted[0]) links.push([NI(a), NI(sorted[0].c)]);
          if (sorted[1]) links.push([NI(a), NI(sorted[1].c)]);
        });
      }
    }

    type Pulse = { a: number; b: number; t: number; sp: number };
    const pulses: Pulse[] = [];
    const spawnPulse = () => {
      if (pulses.length > 14) return;
      const L = links[(Math.random() * links.length) | 0];
      pulses.push({ a: L[0], b: L[1], t: 0, sp: 0.012 + Math.random() * 0.02 });
    };
    pulseInterval = window.setInterval(spawnPulse, 160);

    type SatObj = { off: number; sz: number; bright: boolean };
    type Ring = { rad: number; sp: number; sats: number; ph: number; satObj: SatObj[] };
    const RINGS: Ring[] = [
      { rad: 1.62, sp: 0.0040, sats: 4, ph: 0, satObj: [] },
      { rad: 2.05, sp: 0.0031, sats: 5, ph: 0, satObj: [] },
      { rad: 2.52, sp: 0.0024, sats: 5, ph: 0, satObj: [] },
    ];
    RINGS.forEach(rg => {
      rg.ph = Math.random() * 7;
      for (let i = 0; i < rg.sats; i++) {
        const base = (i / rg.sats) * Math.PI * 2;
        rg.satObj.push({
          off: base,
          sz: 0.95 + (i % 2) * 0.15,
          bright: i % 3 === 0,
        });
      }
    });

    let ang = 0;
    const TILT = -0.30;
    const rot = (p: { x: number; y: number; z: number }, a: number) => {
      const X = p.x * Math.cos(a) + p.z * Math.sin(a);
      const Z = -p.x * Math.sin(a) + p.z * Math.cos(a);
      const Y = p.y;
      const Y2 = Y * Math.cos(TILT) - Z * Math.sin(TILT);
      const Z2 = Y * Math.sin(TILT) + Z * Math.cos(TILT);
      return { x: X, y: Y2, z: Z2 };
    };

    const FLATTEN = 0.38;
    const planePt = (rr: number, a: number) => {
      const vx = Math.cos(a) * rr * R;
      const vy = Math.sin(a) * rr * R * FLATTEN;
      const z = Math.sin(a) * rr * R;
      return { x: CX + vx, y: CY + vy, z };
    };

    const CUBE_V: [number, number, number][] = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
    ];
    const CUBE_E: [number, number][] = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];
    const cube = (px: number, py: number, s: number, col: string, a: number, rx: number, ry: number) => {
      const cx = Math.cos(rx), sx2 = Math.sin(rx), cy2 = Math.cos(ry), sy2 = Math.sin(ry);
      const pts = CUBE_V.map(([X, Y, Z]) => {
        const x1 = X * cy2 + Z * sy2, z1 = -X * sy2 + Z * cy2, y1 = Y;
        const y2 = y1 * cx - z1 * sx2, z2 = y1 * sx2 + z1 * cx;
        const persp = 1 / (1 - z2 * 0.16);
        return [px + x1 * s * persp, py + y2 * s * persp, z2];
      });
      x.strokeStyle = `rgba(${col},${a})`;
      x.lineWidth = DPR;
      x.beginPath();
      for (const [i, j] of CUBE_E) {
        x.moveTo(pts[i][0], pts[i][1]);
        x.lineTo(pts[j][0], pts[j][1]);
      }
      x.stroke();
    };

    const STAR_TINTS = ['200,210,235', '235,225,205', '190,205,230', '225,220,230'];
    type Star = { x: number; y: number; r: number; tw: number; sp: number; tint: string; base: number };
    const stars: Star[] = [...Array(260)].map(() => {
      const big = Math.random() < 0.12;
      return {
        x: Math.random(), y: Math.random(),
        r: big ? 0.9 + Math.random() * 0.7 : 0.25 + Math.random() * 0.5,
        tw: Math.random() * 6,
        sp: 0.15 + Math.random() * 0.4,
        tint: STAR_TINTS[(Math.random() * STAR_TINTS.length) | 0],
        base: (big ? 0.30 : 0.14) + Math.random() * 0.10,
      };
    });

    type Shoot = { x: number; y: number; vx: number; vy: number; life: number; max: number };
    const shooting: Shoot[] = [];
    let shootCooldown = 60;
    const maybeShoot = () => {
      if (shooting.length >= 3) return;
      if (shootCooldown > 0) { shootCooldown--; return; }
      const edge = (Math.random() * 4) | 0;
      let sx = 0, sy = 0;
      if (edge === 0) { sx = Math.random(); sy = -0.05; }
      else if (edge === 1) { sx = 1.05; sy = Math.random() * 0.7; }
      else if (edge === 2) { sx = Math.random(); sy = -0.05; }
      else { sx = -0.05; sy = Math.random() * 0.6; }
      const ang2 = (edge === 3 ? 0.15 : (edge === 1 ? Math.PI - 0.15 : Math.PI / 2)) + (Math.random() - 0.5) * 1.1;
      const spd = 2.6 + Math.random() * 2.0;
      shooting.push({
        x: sx, y: sy,
        vx: Math.cos(ang2) * spd, vy: Math.abs(Math.sin(ang2)) * spd * 0.9 + 0.6,
        life: 0, max: 70 + Math.random() * 45,
      });
      shootCooldown = 40 + ((Math.random() * 110) | 0);
    };

    const occluded = (p: { x: number; y: number; z: number }, behind: boolean) => {
      if (!behind) return false;
      const dx = p.x - CX, dy = p.y - CY;
      return (dx * dx + dy * dy) < (R * 0.95) * (R * 0.95);
    };

    const drawRings = (front: boolean) => {
      RINGS.forEach(rg => {
        x.lineWidth = 1 * DPR;
        const al = front ? 0.30 : 0.12;
        x.strokeStyle = `rgba(${RINGY},${al})`;
        x.beginPath();
        let started = false;
        for (let i = 0; i <= 320; i++) {
          const p = planePt(rg.rad, (i / 320) * Math.PI * 2);
          const behind = p.z <= 0;
          if (behind === front) { started = false; continue; }
          if (occluded(p, behind)) { started = false; continue; }
          if (!started) { x.moveTo(p.x, p.y); started = true; } else x.lineTo(p.x, p.y);
        }
        x.stroke();

        const sats: { p: { x: number; y: number; z: number }; so: SatObj }[] = [];
        rg.satObj.forEach(so => {
          const p = planePt(rg.rad, so.off + rg.ph);
          const behind = p.z <= 0;
          if (behind === front) return;
          if (occluded(p, behind)) return;
          sats.push({ p, so });
        });
        sats.sort((u, v) => u.p.z - v.p.z).forEach(({ p, so }) => {
          const dN = (p.z / (rg.rad * R) + 1) / 2;
          const u = DPR * (1.7 + 1.7 * dN);
          const col = so.bright ? GOLD : WHITE;
          const aa = front ? (so.bright ? 0.95 : 0.55 + 0.35 * dN) : 0.22;
          x.save();
          x.translate(p.x, p.y);
          x.strokeStyle = `rgba(${col},${aa})`;
          x.fillStyle = `rgba(${col},${aa * 0.16})`;
          x.lineWidth = DPR;
          const bw = u * 0.9, bh = u * 1.25;
          x.beginPath(); x.rect(-bw, -bh, bw * 2, bh * 2); x.fill(); x.stroke();
          x.beginPath(); x.moveTo(-bw, 0); x.lineTo(bw, 0); x.stroke();
          const armL = u * 0.7, pw = u * 2.0, ph = u * 1.05;
          [-1, 1].forEach(d => {
            x.beginPath();
            x.moveTo(d * bw, 0); x.lineTo(d * (bw + armL), 0); x.stroke();
            const x0 = d > 0 ? bw + armL : -(bw + armL) - pw;
            x.beginPath(); x.rect(x0, -ph, pw, ph * 2); x.fill(); x.stroke();
            if (front) {
              const sh = x.createLinearGradient(x0, -ph, x0 + pw, ph);
              sh.addColorStop(0, `rgba(${col},0)`);
              sh.addColorStop(0.5, `rgba(${col},${aa * 0.22})`);
              sh.addColorStop(1, `rgba(${col},0)`);
              x.fillStyle = sh; x.fillRect(x0, -ph, pw, ph * 2);
              x.fillStyle = `rgba(${col},${aa * 0.16})`;
            }
            x.globalAlpha = 0.6;
            for (let c = 1; c < 3; c++) { const gx = x0 + pw * c / 3; x.beginPath(); x.moveTo(gx, -ph); x.lineTo(gx, ph); x.stroke(); }
            x.beginPath(); x.moveTo(x0, 0); x.lineTo(x0 + pw, 0); x.stroke();
            x.globalAlpha = 1;
          });
          x.beginPath(); x.moveTo(0, -bh); x.lineTo(0, -bh - u * 0.8); x.stroke();
          x.beginPath(); x.arc(0, -bh - u * 0.95, u * 0.34, 0, Math.PI * 2); x.stroke();
          if (front) {
            const gl = so.bright ? 0.85 : 0.4;
            x.shadowColor = `rgba(${GOLD},${gl})`; x.shadowBlur = (so.bright ? 12 : 6) * DPR;
            x.fillStyle = `rgba(${col},${so.bright ? 0.95 : 0.6})`;
            x.beginPath(); x.arc(0, 0, u * 0.3, 0, Math.PI * 2); x.fill();
            x.shadowBlur = 0;
          }
          x.restore();
        });
      });
    };

    const frame = () => {
      x.clearRect(0, 0, W, H);
      ang += 0.0026;
      RINGS.forEach(r => r.ph += r.sp);

      for (const s of stars) {
        s.y += s.sp * 0.0006;
        if (s.y > 1) { s.y = 0; s.x = Math.random(); }
        const tw = 0.55 + 0.45 * Math.sin(Date.now() / 1100 + s.tw);
        const a = s.base * tw;
        x.fillStyle = `rgba(${s.tint},${a})`;
        x.beginPath(); x.arc(s.x * W, s.y * H, s.r * DPR, 0, 7); x.fill();
      }

      maybeShoot();
      for (let i = shooting.length - 1; i >= 0; i--) {
        const sh = shooting[i]; sh.life++;
        sh.x += sh.vx / 900; sh.y += sh.vy / 900;
        if (sh.life > sh.max || sh.x < -0.15 || sh.x > 1.15 || sh.y > 1.15) { shooting.splice(i, 1); continue; }
        const lp = sh.life / sh.max;
        const fade = Math.sin(Math.min(1, lp * 3.2) * Math.PI * 0.5) * (1 - Math.max(0, (lp - 0.7) / 0.3));
        const hx = sh.x * W, hy = sh.y * H;
        const tlen = 16 * DPR;
        const tx = hx - sh.vx * tlen, ty = hy - sh.vy * tlen;
        const g = x.createLinearGradient(hx, hy, tx, ty);
        g.addColorStop(0, `rgba(255,244,210,${0.95 * fade})`);
        g.addColorStop(0.4, `rgba(255,230,180,${0.4 * fade})`);
        g.addColorStop(1, 'rgba(255,230,180,0)');
        x.strokeStyle = g; x.lineWidth = 1.8 * DPR; x.lineCap = 'round';
        x.beginPath(); x.moveTo(hx, hy); x.lineTo(tx, ty); x.stroke();
        x.fillStyle = `rgba(255,252,235,${fade})`;
        x.shadowColor = `rgba(255,238,190,${fade})`; x.shadowBlur = 12 * DPR;
        x.beginPath(); x.arc(hx, hy, 2.0 * DPR, 0, 7); x.fill(); x.shadowBlur = 0;
      }

      drawRings(false);

      const hg = x.createRadialGradient(CX, CY, R * 0.1, CX, CY, R * 1.5);
      hg.addColorStop(0, `rgba(${GOLD},0.14)`);
      hg.addColorStop(0.35, `rgba(${RINGY},0.07)`);
      hg.addColorStop(0.7, `rgba(${RINGY},0.025)`);
      hg.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = hg; x.beginPath(); x.arc(CX, CY, R * 1.5, 0, 7); x.fill();

      const tnow = Date.now() / 1000;
      const P = nodes.map(n => {
        const v = rot(n, ang);
        return { sx: CX + v.x * R, sy: CY - v.y * R, z: v.z, n };
      });

      for (const [i, j] of links) {
        const a = P[i], b = P[j];
        if (a.z < -0.3 || b.z < -0.3) continue;
        const dep = (a.z + b.z) / 2;
        const al = 0.05 + 0.17 * Math.max(0, (dep + 1) / 2);
        x.strokeStyle = `rgba(${WHITE},${al})`;
        x.lineWidth = DPR * 0.55;
        x.beginPath(); x.moveTo(a.sx, a.sy); x.lineTo(b.sx, b.sy); x.stroke();
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const pu = pulses[i]; pu.t += pu.sp;
        if (pu.t >= 1) { pulses.splice(i, 1); continue; }
        const a = P[pu.a], b = P[pu.b];
        if (a.z < -0.2 || b.z < -0.2) continue;
        const px = a.sx + (b.sx - a.sx) * pu.t, py = a.sy + (b.sy - a.sy) * pu.t;
        const dep = ((a.z + b.z) / 2 + 1) / 2;
        const fade = Math.sin(pu.t * Math.PI);
        const tx = a.sx + (b.sx - a.sx) * Math.max(0, pu.t - 0.16);
        const ty = a.sy + (b.sy - a.sy) * Math.max(0, pu.t - 0.16);
        const g = x.createLinearGradient(tx, ty, px, py);
        g.addColorStop(0, `rgba(${GOLD},0)`);
        g.addColorStop(1, `rgba(${GOLD},${0.6 * fade * dep})`);
        x.strokeStyle = g; x.lineWidth = 1.6 * DPR;
        x.beginPath(); x.moveTo(tx, ty); x.lineTo(px, py); x.stroke();
        x.fillStyle = `rgba(255,250,210,${0.95 * fade * dep})`;
        x.shadowColor = `rgba(${GOLD},${fade})`; x.shadowBlur = 8 * DPR;
        x.beginPath(); x.arc(px, py, 1.8 * DPR, 0, 7); x.fill(); x.shadowBlur = 0;
      }

      P.map((p, idx) => ({ p, idx })).sort((u, v) => u.p.z - v.p.z).forEach(({ p }) => {
        const n = p.n;
        const dep = (p.z + 1) / 2;
        const base = n.gold ? GOLD : WHITE;
        const a = n.gold ? (0.55 + 0.4 * dep) : (0.16 + 0.34 * dep);
        const pulse = n.gold ? (1 + 0.10 * Math.sin(tnow * 1.4 + n.pphase)) : 1;
        const s = (n.sz * R) * (0.62 + 0.4 * dep) * pulse;
        const rx = -0.34;
        const ry = ang;
        if (n.gold && p.z > 0.2) { x.shadowColor = `rgba(${GOLD},0.5)`; x.shadowBlur = 7 * DPR; }
        cube(p.sx, p.sy, s, base, a, rx, ry);
        x.shadowBlur = 0;
      });

      drawRings(true);

      rafId = requestAnimationFrame(frame);
    };
    frame();

    return () => {
      cancelAnimationFrame(rafId);
      if (pulseInterval !== undefined) clearInterval(pulseInterval);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background:
          'radial-gradient(900px 700px at 50% 50%, rgba(245,197,24,0.05), transparent 60%),' +
          'radial-gradient(1200px 900px at 70% 30%, rgba(60,40,90,0.10), transparent 65%),' +
          'radial-gradient(1000px 800px at 25% 75%, rgba(20,40,70,0.10), transparent 60%),' +
          'radial-gradient(circle at 60% 46%, #070608 0%, #010102 72%)',
      }}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default DgxGlobe;
