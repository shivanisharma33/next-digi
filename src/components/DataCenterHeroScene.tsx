import React, { useEffect, useRef } from 'react';

const DataCenterHeroScene: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLCanvasElement>(null);
  const dcRef = useRef<HTMLCanvasElement>(null);
  const grainRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const bgCv = bgRef.current;
    const cv = dcRef.current;
    const grainCv = grainRef.current;
    if (!stage || !bgCv || !cv || !grainCv) return;

    const bgCtx = bgCv.getContext('2d')!;
    const ctx = cv.getContext('2d')!;
    const grainCtx = grainCv.getContext('2d')!;
    const DPR = window.devicePixelRatio || 1;

    let CW = stage.clientWidth;
    let CH = stage.clientHeight;

    function resize() {
      if (!stage || !bgCv || !cv || !grainCv) return;
      CW = stage.clientWidth;
      CH = stage.clientHeight;
      [bgCv, cv].forEach((c) => {
        c.width = CW * DPR;
        c.height = CH * DPR;
        c.style.width = CW + 'px';
        c.style.height = CH + 'px';
      });
      bgCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      grainCv.width = Math.max(1, Math.floor(CW));
      grainCv.height = Math.max(1, Math.floor(CH));
    }
    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(stage);

    let T = 0;
    let phase = 0;
    let state: 'opening' | 'hold' | 'closing' | 'closed' = 'opening';
    let hold = 0;
    let cameraDolly = 0;
    let cameraZoom = 1;
    let lastWaveT = 0;
    let waves: { startT: number; maxR: number; duration: number }[] = [];
    let dustBursts: { parts: DustPart[]; startT: number }[] = [];

    interface DustPart {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      life: number;
      maxLife: number;
      size: number;
    }

    const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const ANG = Math.PI / 6;
    const COS_A = Math.cos(ANG);
    const SIN_A = Math.sin(ANG);
    let SCALE = 1;

    function iso(x: number, y: number, z: number) {
      return {
        x: (x - y) * COS_A * SCALE * cameraZoom + CW / 2 + cameraDolly,
        y: ((x + y) * SIN_A - z) * SCALE * cameraZoom + CH / 2 + 70 * SCALE,
      };
    }

    type Pt = { x: number; y: number };

    function gradFace(pts: Pt[], c1: string, c2: string) {
      let minY = Infinity,
        maxY = -Infinity;
      pts.forEach((p) => {
        minY = Math.min(minY, p.y);
        maxY = Math.max(maxY, p.y);
      });
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.closePath();
      const g = ctx.createLinearGradient(0, minY, 0, maxY);
      g.addColorStop(0, c1);
      g.addColorStop(1, c2);
      ctx.fillStyle = g;
      ctx.fill();
    }

    function gradFaceTop(pts: Pt[], c1: string, c2: string) {
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.closePath();
      const g = ctx.createLinearGradient(pts[0].x, pts[0].y, pts[2].x, pts[2].y);
      g.addColorStop(0, c1);
      g.addColorStop(1, c2);
      ctx.fillStyle = g;
      ctx.fill();
    }

    function drawCastShadow(x: number, y: number, w: number, d: number, h: number, alpha: number) {
      const shadowOff = h * 0.4;
      const sx = x + shadowOff * 0.6;
      const sy = y + shadowOff * 0.6;
      const tl = iso(sx, sy, 0);
      const tr = iso(sx + w, sy, 0);
      const br = iso(sx + w, sy + d, 0);
      const bl = iso(sx, sy + d, 0);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(tl.x, tl.y);
      ctx.lineTo(tr.x, tr.y);
      ctx.lineTo(br.x, br.y);
      ctx.lineTo(bl.x, bl.y);
      ctx.closePath();
      ctx.fillStyle = `rgba(0,0,0,${alpha * 0.45})`;
      ctx.filter = 'blur(5px)';
      ctx.fill();
      ctx.filter = 'none';
      ctx.restore();
    }

    function drawContactShadow(x: number, y: number, w: number, d: number, alpha: number) {
      const inset = 2;
      const tl = iso(x - inset, y - inset, 0);
      const tr = iso(x + w + inset, y - inset, 0);
      const br = iso(x + w + inset, y + d + inset, 0);
      const bl = iso(x - inset, y + d + inset, 0);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(tl.x, tl.y);
      ctx.lineTo(tr.x, tr.y);
      ctx.lineTo(br.x, br.y);
      ctx.lineTo(bl.x, bl.y);
      ctx.closePath();
      ctx.fillStyle = `rgba(0,0,0,${alpha * 0.6})`;
      ctx.filter = 'blur(2px)';
      ctx.fill();
      ctx.filter = 'none';
      ctx.restore();
    }

    function drawFloorReflection(
      x: number,
      y: number,
      _z: number,
      w: number,
      d: number,
      h: number,
      opts: { alpha: number; style?: string }
    ) {
      const a = opts.alpha * 0.22;
      const style = opts.style;
      const col = style === 'accent' ? `rgba(255,200,30,${a})` : `rgba(255,212,59,${a * 0.6})`;
      const refH = h * 0.5;
      const btl = iso(x, y, 0);
      const btr = iso(x + w, y, 0);
      const bbr = iso(x + w, y + d, 0);
      const bbl = iso(x, y + d, 0);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(btl.x, btl.y);
      ctx.lineTo(btr.x, btr.y);
      ctx.lineTo(bbr.x, bbr.y);
      ctx.lineTo(bbl.x, bbl.y);
      ctx.closePath();
      ctx.clip();
      const g = ctx.createLinearGradient(0, btl.y, 0, btl.y + refH * SCALE);
      g.addColorStop(0, col);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(btl.x - 200, btl.y, 800, refH * SCALE * 1.5);
      ctx.restore();
    }

    function drawAmbientOcclusion(x: number, y: number, _z: number, w: number, d: number, alpha: number) {
      const aoSize = 18;
      const tl = iso(x - aoSize / SCALE, y - aoSize / SCALE, 0);
      const br = iso(x + w + aoSize / SCALE, y + d + aoSize / SCALE, 0);
      const itl = iso(x, y, 0);
      const ibr = iso(x + w, y + d, 0);
      const cx = (itl.x + ibr.x) / 2;
      const cy = (itl.y + ibr.y) / 2;
      const r = Math.hypot(br.x - cx, br.y - cy);
      ctx.save();
      const grad = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r);
      grad.addColorStop(0, `rgba(0,0,0,${alpha * 0.6})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(tl.x - 40, tl.y - 40, br.x - tl.x + 80, br.y - tl.y + 80);
      ctx.restore();
    }

    interface TowerData {
      gx: number;
      gy: number;
      h: number;
      style?: string;
      type: 'solid' | 'wire' | 'dotted';
      delay: number;
      seed: number;
      fog: number;
      col: number;
      row: number;
      landed: boolean;
      sweepStartT: number | null;
      topHover: number;
      materializeLevel: number;
    }

    function drawRackPanel(
      x: number,
      y: number,
      d: number,
      zStart: number,
      zEnd: number,
      w: number,
      alpha: number,
      lineCol: string,
      revealHeight: number,
      t: TowerData,
      style: string | undefined
    ) {
      const slotH = (zEnd - zStart) / 8;
      const inset = w * 0.12;
      for (let i = 0; i < 7; i++) {
        const sz = zStart + slotH * (i + 0.5);
        if (sz > zStart + revealHeight) break;
        const slotReveal = Math.min(1, (zStart + revealHeight - sz) / slotH);
        const slotAlpha = alpha * 0.9 * slotReveal;
        ctx.strokeStyle = `rgba(${lineCol},${slotAlpha})`;
        ctx.lineWidth = 1.1 * SCALE;
        const s1 = iso(x + inset, y + d, sz);
        const s2 = iso(x + w - inset, y + d, sz);
        const s3 = iso(x + w - inset, y + d, sz + slotH * 0.5);
        const s4 = iso(x + inset, y + d, sz + slotH * 0.5);
        ctx.beginPath();
        ctx.moveTo(s1.x, s1.y);
        ctx.lineTo(s2.x, s2.y);
        ctx.lineTo(s3.x, s3.y);
        ctx.lineTo(s4.x, s4.y);
        ctx.closePath();
        ctx.stroke();
        const ledP = iso(x + w - inset * 1.5, y + d, sz + slotH * 0.25);
        const basePulse = 0.55 + 0.45 * Math.sin(T * 2 + i * 0.4 + (t.seed || 0));
        const flashKey = Math.floor(T * 0.7) + (t.seed || 0) * 3;
        const isFlashing = flashKey % 37 === 0 && (i + flashKey) % 5 === 0;
        const flashBoost = isFlashing ? 1.8 : 1;
        const ledCol = style === 'accent' ? '40,30,0' : '255,212,59';
        ctx.beginPath();
        ctx.arc(ledP.x, ledP.y, 1.4 * SCALE * (isFlashing ? 1.5 : 1), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ledCol},${slotAlpha * 0.8 * basePulse * flashBoost})`;
        ctx.fill();
        if (isFlashing) {
          ctx.beginPath();
          ctx.arc(ledP.x, ledP.y, 5 * SCALE, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,212,59,${slotAlpha * 0.4})`;
          ctx.fill();
        }
      }
    }

    function drawScannerSweep(
      x: number,
      y: number,
      z: number,
      w: number,
      d: number,
      h: number,
      sweepZ: number,
      alpha: number
    ) {
      const inset = w * 0.12;
      const sweepHeight = 8;
      const z1 = z + sweepZ;
      const z2 = z1 + sweepHeight;
      if (z1 > z + h || z2 < z) return;
      const cz1 = Math.max(z, z1);
      const cz2 = Math.min(z + h, z2);
      const s1 = iso(x + inset, y + d, cz1);
      const s2 = iso(x + w - inset, y + d, cz1);
      const s3 = iso(x + w - inset, y + d, cz2);
      const s4 = iso(x + inset, y + d, cz2);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(s1.x, s1.y);
      ctx.lineTo(s2.x, s2.y);
      ctx.lineTo(s3.x, s3.y);
      ctx.lineTo(s4.x, s4.y);
      ctx.closePath();
      const g = ctx.createLinearGradient(s1.x, s1.y, s4.x, s4.y);
      g.addColorStop(0, `rgba(255,212,59,0)`);
      g.addColorStop(0.5, `rgba(255,232,115,${alpha * 0.85})`);
      g.addColorStop(1, `rgba(255,212,59,0)`);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
    }

    interface SolidOpts {
      alpha: number;
      style?: string;
      fog?: number;
      fillLight?: number;
      revealH?: number;
      sweepZ?: number | null;
      t: TowerData;
    }

    function drawSolidTower(
      x: number,
      y: number,
      z: number,
      w: number,
      d: number,
      h: number,
      opts: SolidOpts
    ) {
      const tl = iso(x, y, z + h),
        tr = iso(x + w, y, z + h),
        br = iso(x + w, y + d, z + h),
        bl = iso(x, y + d, z + h);
      const btl = iso(x, y, z),
        btr = iso(x + w, y, z),
        bbr = iso(x + w, y + d, z),
        bbl = iso(x, y + d, z);
      const a = opts.alpha;
      const style = opts.style;
      const fog = opts.fog || 0;
      const fillLight = opts.fillLight || 0;
      let topC1: string,
        topC2: string,
        leftC1: string,
        leftC2: string,
        rightC1: string,
        rightC2: string,
        lineCol: string,
        rimCol: string,
        fillCol: string,
        borderCol: string;
      if (style === 'accent') {
        topC1 = `rgba(255,220,60,${a})`;
        topC2 = `rgba(200,160,15,${a})`;
        leftC1 = `rgba(255,200,30,${a})`;
        leftC2 = `rgba(170,130,5,${a})`;
        rightC1 = `rgba(15,15,15,${a})`;
        rightC2 = `rgba(0,0,0,${a})`;
        lineCol = '40,30,0';
        rimCol = `rgba(255,235,120,${a * 0.85})`;
        fillCol = `rgba(100,130,200,${a * 0.12})`;
        borderCol = `rgba(255,212,59,${a})`;
      } else {
        topC1 = `rgba(28,28,32,${a})`;
        topC2 = `rgba(10,10,12,${a})`;
        leftC1 = `rgba(22,22,26,${a})`;
        leftC2 = `rgba(8,8,10,${a})`;
        rightC1 = `rgba(6,6,8,${a})`;
        rightC2 = `rgba(0,0,0,${a})`;
        lineCol = '255,212,59';
        rimCol = `rgba(255,212,59,${a * 0.9})`;
        fillCol = `rgba(100,130,200,${a * 0.18})`;
        borderCol = `rgba(255,212,59,${a * 0.85})`;
      }
      gradFace([bl, br, bbr, bbl], leftC1, leftC2);
      gradFace([tr, br, bbr, btr], rightC1, rightC2);
      gradFaceTop([tl, tr, br, bl], topC1, topC2);
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(tr.x, tr.y);
      ctx.lineTo(br.x, br.y);
      ctx.lineTo(bbr.x, bbr.y);
      ctx.lineTo(btr.x, btr.y);
      ctx.closePath();
      ctx.fillStyle = fillCol;
      ctx.fill();
      ctx.restore();
      if (fillLight > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(bl.x, bl.y);
        ctx.lineTo(br.x, br.y);
        ctx.lineTo(bbr.x, bbr.y);
        ctx.lineTo(bbl.x, bbl.y);
        ctx.closePath();
        ctx.fillStyle = `rgba(255,212,59,${fillLight * 0.22})`;
        ctx.fill();
        ctx.restore();
      }
      ctx.strokeStyle = rimCol;
      ctx.lineWidth = 1.5 * SCALE;
      ctx.beginPath();
      ctx.moveTo(tl.x, tl.y);
      ctx.lineTo(tr.x, tr.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(tl.x, tl.y);
      ctx.lineTo(bl.x, bl.y);
      ctx.stroke();
      const revealH = opts.revealH ?? h;
      drawRackPanel(x, y, d, z, z + h, w, a, lineCol, revealH, opts.t, style);
      ctx.strokeStyle = borderCol;
      ctx.lineWidth = 1.6 * SCALE;
      ctx.beginPath();
      ctx.moveTo(tl.x, tl.y);
      ctx.lineTo(tr.x, tr.y);
      ctx.lineTo(br.x, br.y);
      ctx.lineTo(bl.x, bl.y);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bl.x, bl.y);
      ctx.lineTo(bbl.x, bbl.y);
      ctx.moveTo(br.x, br.y);
      ctx.lineTo(bbr.x, bbr.y);
      ctx.moveTo(tr.x, tr.y);
      ctx.lineTo(btr.x, btr.y);
      ctx.stroke();
      if (opts.sweepZ !== null && opts.sweepZ !== undefined) {
        drawScannerSweep(x, y, z, w, d, h, opts.sweepZ, a);
      }
      if (style === 'accent' && phase > 0.6) {
        const cx = (tl.x + br.x) / 2;
        const cy = (tl.y + br.y) / 2;
        ctx.save();
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 35);
        grad.addColorStop(0, `rgba(255,232,115,${0.2 * phase})`);
        grad.addColorStop(1, 'rgba(255,232,115,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(cx - 45, cy - 45, 90, 90);
        ctx.restore();
      }
      if (fog > 0) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(tl.x, tl.y);
        ctx.lineTo(tr.x, tr.y);
        ctx.lineTo(br.x, br.y);
        ctx.lineTo(bl.x, bl.y);
        ctx.closePath();
        ctx.fillStyle = `rgba(8,10,20,${fog * 0.25})`;
        ctx.fill();
        ctx.restore();
      }
    }

    function drawWireframeTower(x: number, y: number, z: number, w: number, d: number, h: number, alpha: number) {
      const tl = iso(x, y, z + h),
        tr = iso(x + w, y, z + h),
        br = iso(x + w, y + d, z + h),
        bl = iso(x, y + d, z + h);
      const btl = iso(x, y, z),
        btr = iso(x + w, y, z),
        bbr = iso(x + w, y + d, z),
        bbl = iso(x, y + d, z);
      ctx.save();
      ctx.strokeStyle = `rgba(255,212,59,${alpha * 0.75})`;
      ctx.lineWidth = 1 * SCALE;
      ctx.beginPath();
      ctx.moveTo(tl.x, tl.y);
      ctx.lineTo(tr.x, tr.y);
      ctx.lineTo(br.x, br.y);
      ctx.lineTo(bl.x, bl.y);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bl.x, bl.y);
      ctx.lineTo(bbl.x, bbl.y);
      ctx.moveTo(br.x, br.y);
      ctx.lineTo(bbr.x, bbr.y);
      ctx.moveTo(tr.x, tr.y);
      ctx.lineTo(btr.x, btr.y);
      ctx.moveTo(tl.x, tl.y);
      ctx.lineTo(btl.x, btl.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bbl.x, bbl.y);
      ctx.lineTo(bbr.x, bbr.y);
      ctx.lineTo(btr.x, btr.y);
      ctx.stroke();
      ctx.strokeStyle = `rgba(255,212,59,${alpha * 0.5})`;
      ctx.lineWidth = 0.8 * SCALE;
      const inset = w * 0.12;
      const slotH = h / 8;
      for (let i = 0; i < 7; i++) {
        const sz = z + slotH * (i + 0.5);
        const s1 = iso(x + inset, y + d, sz);
        const s2 = iso(x + w - inset, y + d, sz);
        ctx.beginPath();
        ctx.moveTo(s1.x, s1.y);
        ctx.lineTo(s2.x, s2.y);
        ctx.stroke();
      }
      ctx.restore();
    }

    function drawDottedTower(
      x: number,
      y: number,
      z: number,
      w: number,
      d: number,
      h: number,
      alpha: number,
      materializeLevel: number
    ) {
      const tl = iso(x, y, z + h),
        tr = iso(x + w, y, z + h),
        br = iso(x + w, y + d, z + h),
        bl = iso(x, y + d, z + h);
      const btl = iso(x, y, z),
        btr = iso(x + w, y, z),
        bbr = iso(x + w, y + d, z),
        bbl = iso(x, y + d, z);
      const m = materializeLevel || 0;
      ctx.save();
      if (m > 0) {
        ctx.setLineDash([]);
        const solidAlpha = alpha * (0.55 + m * 0.4);
        const glowAlpha = m * 0.35;
        ctx.shadowBlur = 8 * m * SCALE;
        ctx.shadowColor = `rgba(255,232,115,${glowAlpha})`;
        ctx.strokeStyle = `rgba(255,232,115,${solidAlpha})`;
        ctx.lineWidth = (1 + m * 0.5) * SCALE;
      } else {
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = `rgba(255,212,59,${alpha * 0.55})`;
        ctx.lineWidth = 1 * SCALE;
      }
      ctx.beginPath();
      ctx.moveTo(tl.x, tl.y);
      ctx.lineTo(tr.x, tr.y);
      ctx.lineTo(br.x, br.y);
      ctx.lineTo(bl.x, bl.y);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bl.x, bl.y);
      ctx.lineTo(bbl.x, bbl.y);
      ctx.moveTo(br.x, br.y);
      ctx.lineTo(bbr.x, bbr.y);
      ctx.moveTo(tr.x, tr.y);
      ctx.lineTo(btr.x, btr.y);
      ctx.moveTo(tl.x, tl.y);
      ctx.lineTo(btl.x, btl.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bbl.x, bbl.y);
      ctx.lineTo(bbr.x, bbr.y);
      ctx.lineTo(btr.x, btr.y);
      ctx.stroke();
      ctx.shadowBlur = 0;
      if (m > 0) {
        ctx.setLineDash([]);
        ctx.strokeStyle = `rgba(255,232,115,${alpha * (0.4 + m * 0.5)})`;
        ctx.lineWidth = 0.9 * SCALE;
      } else {
        ctx.setLineDash([2, 3]);
        ctx.strokeStyle = `rgba(255,212,59,${alpha * 0.32})`;
        ctx.lineWidth = 0.7 * SCALE;
      }
      const inset = w * 0.12;
      const slotH = h / 8;
      for (let i = 0; i < 7; i++) {
        const sz = z + slotH * (i + 0.5);
        const s1 = iso(x + inset, y + d, sz);
        const s2 = iso(x + w - inset, y + d, sz);
        ctx.beginPath();
        ctx.moveTo(s1.x, s1.y);
        ctx.lineTo(s2.x, s2.y);
        ctx.stroke();
      }
      ctx.restore();
    }

    const TW = 58;
    const TD = 58;
    const GAP = 22;
    const STEP = TW + GAP;

    const LAYOUT: Array<{ col: number; row: number; h: number; style?: string; type: 'solid' | 'wire' | 'dotted' }> = [
      { col: -3, row: 0, h: 100, style: 'accent', type: 'solid' },
      { col: -2, row: -1, h: 120, type: 'wire' },
      { col: -1, row: -2, h: 155, style: 'dark', type: 'solid' },
      { col: -1, row: 0, h: 105, type: 'wire' },
      { col: 0, row: 1, h: 120, style: 'dark', type: 'solid' },
      { col: 0, row: -1, h: 105, style: 'dark', type: 'solid' },
      { col: 1, row: -1, h: 125, style: 'accent', type: 'solid' },
      { col: 1, row: 0, h: 105, style: 'dark', type: 'solid' },
      { col: 1, row: 1, h: 140, style: 'dark', type: 'solid' },
      { col: 2, row: -1, h: 120, type: 'wire' },
      { col: 2, row: 0, h: 105, type: 'wire' },
      { col: 3, row: 0, h: 105, style: 'accent', type: 'solid' },
      { col: -2, row: 1, h: 115, style: 'dark', type: 'solid' },
      { col: 2, row: 1, h: 115, style: 'accent', type: 'solid' },
      { col: -4, row: -1, h: 100, type: 'dotted' },
      { col: -3, row: 1, h: 115, type: 'dotted' },
      { col: 0, row: -2, h: 95, type: 'dotted' },
      { col: 3, row: 1, h: 115, type: 'dotted' },
      { col: 4, row: 0, h: 100, type: 'dotted' },
      { col: -4, row: 1, h: 90, type: 'dotted' },
      { col: 4, row: -1, h: 108, type: 'dotted' },
    ];

    const TOWERS: TowerData[] = LAYOUT.map((t, i) => {
      const gx = t.col * STEP;
      const gy = t.row * STEP;
      const distFromCenter = Math.sqrt(t.col * t.col + t.row * t.row);
      let delayBase: number;
      if (t.type === 'dotted') delayBase = 0;
      else if (t.type === 'wire') delayBase = 0.18;
      else delayBase = 0.36;
      const delay = delayBase + distFromCenter * 0.025 + i * 0.003;
      const fog = Math.max(0, Math.min(0.5, (t.row + t.col * 0.3 + 2) * 0.05));
      return {
        gx,
        gy,
        h: t.h,
        style: t.style,
        type: t.type,
        delay,
        seed: i,
        fog,
        col: t.col,
        row: t.row,
        landed: false,
        sweepStartT: null,
        topHover: Math.random() * Math.PI * 2,
        materializeLevel: 0,
      };
    });

    const SOLID_TOWERS = TOWERS.filter((t) => t.type === 'solid');
    const ACCENT_TOWERS = SOLID_TOWERS.filter((t) => t.style === 'accent');
    const DOTTED_TOWERS = TOWERS.filter((t) => t.type === 'dotted');

    interface ConnData {
      a: TowerData;
      b: TowerData;
      seed: number;
      dist: number;
    }
    const CONNECTIONS: ConnData[] = [];
    for (let i = 0; i < SOLID_TOWERS.length; i++) {
      for (let j = i + 1; j < SOLID_TOWERS.length; j++) {
        const a = SOLID_TOWERS[i];
        const b = SOLID_TOWERS[j];
        const dist = Math.hypot(a.gx - b.gx, a.gy - b.gy);
        if (dist < 140 && (a.style === 'accent' || b.style === 'accent')) {
          CONNECTIONS.push({ a, b, seed: i * 7 + j, dist });
        }
      }
    }

    interface Particle {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      coreSize: number;
      haloSize: number;
      alpha: number;
      seed: number;
      drift: number;
    }
    const PARTICLES: Particle[] = [];
    for (let i = 0; i < 22; i++) {
      PARTICLES.push({
        x: (Math.random() - 0.5) * 900,
        y: (Math.random() - 0.5) * 600,
        z: Math.random() * 200,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.1,
        vz: 0.15 + Math.random() * 0.3,
        coreSize: 0.55 + Math.random() * 0.5,
        haloSize: 2.5 + Math.random() * 1.5,
        alpha: 0.5 + Math.random() * 0.3,
        seed: Math.random() * 100,
        drift: 0,
      });
    }

    interface Building {
      x: number;
      w: number;
      h: number;
      parallaxSpeed: number;
      hasLights: boolean;
      seed: number;
    }
    const CITY_BUILDINGS: Building[] = [];
    for (let i = 0; i < 32; i++) {
      CITY_BUILDINGS.push({
        x: i * 45 + Math.random() * 20 - 300,
        w: 30 + Math.random() * 40,
        h: 40 + Math.random() * 120,
        parallaxSpeed: 0.04 + Math.random() * 0.03,
        hasLights: Math.random() < 0.5,
        seed: Math.random() * 100,
      });
    }

    let grainImageData: ImageData | null = null;
    function updateGrain() {
      if (grainCv.width === 0) return;
      if (!grainImageData || grainImageData.width !== grainCv.width || grainImageData.height !== grainCv.height) {
        grainImageData = grainCtx.createImageData(grainCv.width, grainCv.height);
      }
      const d = grainImageData.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255;
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = 255;
      }
      grainCtx.putImageData(grainImageData, 0, 0);
    }

    function drawCitySilhouette() {
      bgCtx.clearRect(0, 0, CW, CH);
      const horizonY = CH * 0.55;
      bgCtx.save();
      const offset = (T * 8) % CW;
      CITY_BUILDINGS.forEach((b) => {
        let drawX = b.x - offset * b.parallaxSpeed;
        while (drawX > CW) drawX -= CW + 100;
        while (drawX < -100) drawX += CW + 100;
        bgCtx.fillStyle = 'rgba(8,12,22,0.85)';
        bgCtx.fillRect(drawX, horizonY - b.h, b.w, b.h);
        if (b.hasLights) {
          const lightsCount = Math.floor(b.h / 12);
          for (let i = 0; i < lightsCount; i++) {
            for (let j = 0; j < Math.floor(b.w / 10); j++) {
              if (((i + j + b.seed) | 0) % 3 === 0) {
                const lpulse = 0.3 + 0.3 * Math.sin(T * 0.5 + i + j + b.seed);
                bgCtx.fillStyle = `rgba(255,212,59,${lpulse * 0.22})`;
                bgCtx.fillRect(drawX + 4 + j * 9, horizonY - b.h + 8 + i * 12, 2, 3);
              }
            }
          }
        }
      });
      bgCtx.restore();
      bgCtx.save();
      const fadeG = bgCtx.createLinearGradient(0, horizonY - 50, 0, horizonY + 30);
      fadeG.addColorStop(0, 'rgba(0,0,0,0)');
      fadeG.addColorStop(1, 'rgba(0,0,0,0.8)');
      bgCtx.fillStyle = fadeG;
      bgCtx.fillRect(0, horizonY - 50, CW, 80);
      bgCtx.restore();
    }

    function drawFloorTiles() {
      ctx.save();
      ctx.setLineDash([3, 3]);
      const tilePulse = 0.18 + 0.05 * Math.sin(T * 0.5);
      ctx.strokeStyle = `rgba(255,212,59,${tilePulse})`;
      ctx.lineWidth = 0.6 * SCALE;
      for (let row = -2; row <= 2; row++) {
        for (let col = -5; col <= 5; col++) {
          const gx = col * STEP;
          const gy = row * STEP;
          const x = gx - TW / 2;
          const y = gy - TD / 2;
          const tl = iso(x, y, 0);
          const tr = iso(x + TW, y, 0);
          const br = iso(x + TW, y + TD, 0);
          const bl = iso(x, y + TD, 0);
          ctx.beginPath();
          ctx.moveTo(tl.x, tl.y);
          ctx.lineTo(tr.x, tr.y);
          ctx.lineTo(br.x, br.y);
          ctx.lineTo(bl.x, bl.y);
          ctx.closePath();
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    function drawFloorSpotlight() {
      const c = iso(0, 0, 0);
      const grad = ctx.createRadialGradient(c.x, c.y, 30 * SCALE, c.x, c.y, 500 * SCALE);
      grad.addColorStop(0, 'rgba(255,212,59,0.09)');
      grad.addColorStop(0.5, 'rgba(255,212,59,0.025)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CW, CH);
    }

    function drawPowerConduits() {
      if (phase < 0.5) return;
      const a = Math.min(1, (phase - 0.5) / 0.5);
      ctx.save();
      CONNECTIONS.forEach((c) => {
        if (c.a.style !== 'accent' && c.b.style !== 'accent') return;
        const p1 = iso(c.a.gx, c.a.gy, 0.3);
        const p2 = iso(c.b.gx, c.b.gy, 0.3);
        ctx.strokeStyle = `rgba(255,212,59,${a * 0.15})`;
        ctx.lineWidth = 1 * SCALE;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        const pulseT = (T * 0.3 + c.seed * 0.1) % 1;
        const pulseX = p1.x + (p2.x - p1.x) * pulseT;
        const pulseY = p1.y + (p2.y - p1.y) * pulseT;
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 1.4 * SCALE, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,232,115,${a * 0.6})`;
        ctx.fill();
      });
      ctx.restore();
    }

    function vignette() {
      // disabled to keep background transparent
    }

    function colorGrade() {
      ctx.save();
      ctx.globalCompositeOperation = 'multiply';
      const g1 = ctx.createLinearGradient(0, 0, 0, CH);
      g1.addColorStop(0, 'rgba(255,245,210,1)');
      g1.addColorStop(1, 'rgba(180,200,235,1)');
      ctx.fillStyle = g1;
      ctx.globalAlpha = 0.09;
      ctx.fillRect(0, 0, CW, CH);
      ctx.restore();
    }

    function ambientCenterGlow() {
      if (phase < 0.3) return;
      const ga = (phase - 0.3) / 0.7;
      const hc = iso(0, 0, 80);
      const grad = ctx.createRadialGradient(hc.x, hc.y, 50 * SCALE, hc.x, hc.y, 330 * SCALE);
      grad.addColorStop(0, `rgba(255,212,59,${ga * 0.1})`);
      grad.addColorStop(0.5, `rgba(255,212,59,${ga * 0.03})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, CW, CH);
    }

    function updateAndDrawParticles() {
      DOTTED_TOWERS.forEach((t) => {
        t.materializeLevel = Math.max(0, t.materializeLevel - 0.025);
      });
      PARTICLES.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.drift += 0.016;
        p.x += Math.sin(p.drift + p.seed) * 0.08;
        p.y += Math.cos(p.drift * 0.7 + p.seed) * 0.05;
        if (p.z > 240) {
          p.z = 0;
          p.x = (Math.random() - 0.5) * 900;
          p.y = (Math.random() - 0.5) * 600;
        }
        DOTTED_TOWERS.forEach((t) => {
          const dx = p.x - t.gx;
          const dy = p.y - t.gy;
          const horizontalDist = Math.hypot(dx, dy);
          if (horizontalDist < TW * 0.9 && p.z < t.h * 1.05 && p.z > -5) {
            const proximity = 1 - horizontalDist / (TW * 0.9);
            t.materializeLevel = Math.min(1, t.materializeLevel + proximity * 0.08);
          }
        });
        const pos = iso(p.x, p.y, p.z);
        if (pos.x < -20 || pos.x > CW + 20 || pos.y < -20 || pos.y > CH + 20) return;
        const flicker = 0.7 + 0.3 * Math.sin(T * 1.8 + p.seed);
        const a = p.alpha * flicker * phase;
        ctx.save();
        const haloGrad = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, p.haloSize * SCALE);
        haloGrad.addColorStop(0, `rgba(255,232,115,${a * 0.35})`);
        haloGrad.addColorStop(0.5, `rgba(255,212,59,${a * 0.12})`);
        haloGrad.addColorStop(1, 'rgba(255,212,59,0)');
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, p.haloSize * SCALE, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, p.coreSize * SCALE, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,245,180,${a})`;
        ctx.fill();
        ctx.restore();
      });
    }

    function drawLensFlare() {
      if (phase < 0.7) return;
      const flareA = (phase - 0.7) / 0.3;
      ACCENT_TOWERS.forEach((t) => {
        const c = iso(t.gx, t.gy, t.h);
        const grad = ctx.createRadialGradient(c.x, c.y, 2, c.x, c.y, 40);
        grad.addColorStop(0, `rgba(255,245,180,${flareA * 0.6})`);
        grad.addColorStop(0.3, `rgba(255,212,59,${flareA * 0.25})`);
        grad.addColorStop(1, 'rgba(255,212,59,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(c.x - 50, c.y - 50, 100, 100);
      });
    }

    function spawnWave() {
      waves.push({ startT: T, maxR: 480, duration: 3.5 });
    }

    function drawWaves() {
      waves = waves.filter((w) => {
        const age = T - w.startT;
        if (age > w.duration) return false;
        const p = age / w.duration;
        const r = easeOutCubic(p) * w.maxR;
        const alpha = (1 - p) * 0.4;
        const c = iso(0, 0, 0);
        ctx.save();
        ctx.strokeStyle = `rgba(255,212,59,${alpha * 0.5})`;
        ctx.lineWidth = 1.3 * SCALE;
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, r * SCALE, r * SCALE * 0.5, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        return true;
      });
    }

    function spawnDustBurst(t: TowerData) {
      const parts: DustPart[] = [];
      for (let i = 0; i < 10; i++) {
        const ang = Math.random() * Math.PI * 2;
        const speed = 8 + Math.random() * 15;
        parts.push({
          x: t.gx,
          y: t.gy,
          z: 0,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
          vz: 5 + Math.random() * 8,
          life: 0,
          maxLife: 0.8 + Math.random() * 0.4,
          size: 0.5 + Math.random() * 1.2,
        });
      }
      dustBursts.push({ parts, startT: T });
    }

    function drawDustBursts() {
      dustBursts = dustBursts.filter((b) => {
        let alive = false;
        b.parts.forEach((p) => {
          p.life += 0.016;
          if (p.life > p.maxLife) return;
          alive = true;
          p.x += p.vx * 0.016;
          p.y += p.vy * 0.016;
          p.z += p.vz * 0.016;
          p.vz -= 0.2;
          const lifeFrac = p.life / p.maxLife;
          const alpha = (1 - lifeFrac) * 0.6;
          const pos = iso(p.x, p.y, p.z);
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, p.size * SCALE, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,212,59,${alpha})`;
          ctx.fill();
        });
        return alive;
      });
    }

    let grainTimer = 0;
    let rafId = 0;

    function draw() {
      SCALE = Math.min(CW / 1100, CH / 620, 1.9);
      if (SCALE < 0.5) SCALE = 0.5;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, CW, CH);
      T += 0.016;
      cameraDolly = Math.sin(T * 0.15) * 8;
      cameraZoom = 1 + Math.sin(T * 0.4) * 0.012;
      grainTimer += 0.016;
      if (grainTimer > 0.1) {
        updateGrain();
        grainTimer = 0;
      }
      if (state === 'opening') {
        phase = Math.min(1, phase + 0.012);
        if (phase >= 1) {
          state = 'hold';
          hold = 0;
        }
      } else if (state === 'hold') {
        hold += 0.016;
        if (hold > 5) state = 'closing';
      } else if (state === 'closing') {
        phase = Math.max(0, phase - 0.011);
        if (phase <= 0) {
          state = 'closed';
          hold = 0;
        }
      } else {
        hold += 0.016;
        if (hold > 1.5) {
          state = 'opening';
          TOWERS.forEach((t) => {
            t.landed = false;
            t.sweepStartT = null;
            t.materializeLevel = 0;
          });
        }
      }
      if (T - lastWaveT > 7) {
        spawnWave();
        lastWaveT = T;
      }
      drawCitySilhouette();
      drawFloorSpotlight();
      drawFloorTiles();
      drawWaves();
      drawPowerConduits();
      ambientCenterGlow();
      const ALL = [...TOWERS].sort((a, b) => {
        const pa = iso(a.gx, a.gy, 0);
        const pb = iso(b.gx, b.gy, 0);
        return pa.y + pa.x * 0.2 - (pb.y + pb.x * 0.2);
      });
      ALL.forEach((t) => {
        const dp = Math.max(0, Math.min(1, (phase - t.delay) / (1 - t.delay)));
        const ep = ease(dp);
        if (ep < 0.01) return;
        const float = Math.sin(T * 0.4 + t.seed * 0.3) * 1.2 * ep;
        const rh = t.h * ep + float;
        const x = t.gx - TW / 2;
        const y = t.gy - TD / 2;
        if (t.type === 'solid') {
          drawCastShadow(x, y, TW, TD, rh, ep);
          drawContactShadow(x, y, TW, TD, ep);
          drawAmbientOcclusion(x, y, 0, TW, TD, ep);
          drawFloorReflection(x, y, 0, TW, TD, rh, { style: t.style, alpha: ep });
        }
      });
      ALL.forEach((t) => {
        const dp = Math.max(0, Math.min(1, (phase - t.delay) / (1 - t.delay)));
        const ep = ease(dp);
        if (ep < 0.01) return;
        const float = Math.sin(T * 0.4 + t.seed * 0.3) * 1.2 * ep;
        const topHover = Math.sin(T * 0.6 + t.topHover) * 0.8 * ep;
        const rh = t.h * ep + float + topHover;
        const x = t.gx - TW / 2;
        const y = t.gy - TD / 2;
        if (ep >= 0.99 && !t.landed) {
          t.landed = true;
          if (t.type === 'solid') {
            spawnDustBurst(t);
            t.sweepStartT = T;
          }
        }
        if (state === 'closing') t.landed = false;
        let fillLight = 0;
        if (t.type === 'solid' && t.style !== 'accent') {
          ACCENT_TOWERS.forEach((other) => {
            const d = Math.hypot(other.gx - t.gx, other.gy - t.gy);
            if (d < 100) fillLight = Math.max(fillLight, (1 - d / 100) * phase);
          });
        }
        const slotReveal = Math.min(rh, Math.max(0, ((ep - 0.3) / 0.7) * rh));
        let sweepZ: number | null = null;
        if (t.sweepStartT !== null && t.type === 'solid') {
          const sweepAge = T - t.sweepStartT;
          if (sweepAge > 0 && sweepAge < 1.2) {
            sweepZ = (sweepAge / 1.2) * t.h;
          }
        }
        if (t.type === 'wire') {
          drawWireframeTower(x, y, 0, TW, TD, rh, ep);
        } else if (t.type === 'dotted') {
          drawDottedTower(x, y, 0, TW, TD, rh, ep, t.materializeLevel);
        } else {
          drawSolidTower(x, y, 0, TW, TD, rh, {
            style: t.style,
            alpha: Math.min(1, ep * 1.2),
            fog: t.fog,
            fillLight,
            revealH: slotReveal,
            sweepZ,
            t,
          });
        }
      });
      drawDustBursts();
      drawLensFlare();
      updateAndDrawParticles();
      colorGrade();
      vignette();
      rafId = requestAnimationFrame(draw);
    }

    draw();
    updateGrain();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="stage relative w-full h-full min-h-[520px] lg:min-h-[620px] rounded-[32px] overflow-hidden bg-black shadow-3xl"
    >
      <canvas ref={bgRef} id="bg" className="absolute inset-0 w-full h-full" />
      <canvas ref={dcRef} id="dc" className="absolute inset-0 w-full h-full" />
      <canvas
        ref={grainRef}
        id="grain"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          position: 'absolute',
          inset: 0,
          mixBlendMode: 'overlay',
          opacity: 0.06,
          pointerEvents: 'none',
          zIndex: 18,
        }}
      />
    </div>
  );
};

export default DataCenterHeroScene;
