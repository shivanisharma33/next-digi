import { useEffect, useRef } from 'react';

interface Props {
  activeMode?: 'all' | 'ai' | 'cloud' | 'iot' | 'analytics';
}

const ServicesHeroVisual3D = ({ activeMode: _activeMode = 'all' }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d')!;

    let w = 0, h = 0, dpr = 1, raf = 0, dead = false;

    const SCALE = 34;
    const C30 = Math.cos(Math.PI / 6); // ~0.866
    const S30 = Math.sin(Math.PI / 6); // 0.5

    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = container.clientWidth;
      h = container.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // ISO projection: +X → lower-right, +Y → lower-left, +Z → up
    const iso = (ix: number, iy: number, iz = 0) => ({
      x: w * 0.38 + (ix - iy) * C30 * SCALE,
      y: h * 0.68 + (ix + iy) * S30 * SCALE - iz * SCALE,
    });

    // Draw solid isometric cube
    const solidCube = (ix: number, iy: number, iz: number, s: number, alpha = 1) => {
      const p = (dx: number, dy: number, dz: number) => iso(ix + dx * s, iy + dy * s, iz + dz * s);

      // Top face
      const t = [p(0,0,1), p(1,0,1), p(1,1,1), p(0,1,1)];
      ctx.beginPath();
      ctx.moveTo(t[0].x, t[0].y);
      t.slice(1).forEach(v => ctx.lineTo(v.x, v.y));
      ctx.closePath();
      ctx.fillStyle = `rgba(188,216,42,${alpha})`;
      ctx.fill();

      // Right face (x = ix+s, lower-right on screen)
      const r = [p(1,0,0), p(1,1,0), p(1,1,1), p(1,0,1)];
      ctx.beginPath();
      ctx.moveTo(r[0].x, r[0].y);
      r.slice(1).forEach(v => ctx.lineTo(v.x, v.y));
      ctx.closePath();
      ctx.fillStyle = `rgba(100,128,15,${alpha})`;
      ctx.fill();

      // Left face (y = iy+s, lower-left on screen)
      const l = [p(0,1,0), p(1,1,0), p(1,1,1), p(0,1,1)];
      ctx.beginPath();
      ctx.moveTo(l[0].x, l[0].y);
      l.slice(1).forEach(v => ctx.lineTo(v.x, v.y));
      ctx.closePath();
      ctx.fillStyle = `rgba(138,164,22,${alpha})`;
      ctx.fill();
    };

    // Draw wireframe isometric cube
    const wireCube = (ix: number, iy: number, iz: number, s: number, opacity = 0.55) => {
      const corners = [
        iso(ix,   iy,   iz),   iso(ix+s, iy,   iz),
        iso(ix+s, iy+s, iz),   iso(ix,   iy+s, iz),
        iso(ix,   iy,   iz+s), iso(ix+s, iy,   iz+s),
        iso(ix+s, iy+s, iz+s), iso(ix,   iy+s, iz+s),
      ];
      const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
      ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
      ctx.lineWidth = 0.7;
      edges.forEach(([a, b]) => {
        ctx.beginPath();
        ctx.moveTo(corners[a].x, corners[a].y);
        ctx.lineTo(corners[b].x, corners[b].y);
        ctx.stroke();
      });
    };

    // Isometric grid
    const drawGrid = () => {
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = 'rgba(188,216,42,0.038)';
      for (let i = -18; i <= 18; i++) {
        const a = iso(i, -18), b = iso(i, 18);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        const c = iso(-18, i), d = iso(18, i);
        ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(d.x, d.y); ctx.stroke();
      }
    };

    // Track rails (constant X lines, extend along Y from +12 to -12)
    // Decreasing Y moves upper-right on screen → tracks go lower-left to upper-right ✓
    const TRACK_XS = [-2, 0, 2];
    const drawTracks = () => {
      TRACK_XS.forEach(tx => {
        const a = iso(tx, 13), b = iso(tx, -13);
        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grad.addColorStop(0,   'rgba(188,216,42,0)');
        grad.addColorStop(0.18,'rgba(188,216,42,0.75)');
        grad.addColorStop(0.82,'rgba(188,216,42,0.75)');
        grad.addColorStop(1,   'rgba(188,216,42,0)');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.1;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();

        // Glow pass
        ctx.lineWidth = 3;
        const glow = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        glow.addColorStop(0,   'rgba(188,216,42,0)');
        glow.addColorStop(0.18,'rgba(188,216,42,0.08)');
        glow.addColorStop(0.82,'rgba(188,216,42,0.08)');
        glow.addColorStop(1,   'rgba(188,216,42,0)');
        ctx.strokeStyle = glow;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      });
    };

    // Solid flow cubes (move in -Y → upper-right on screen)
    type FlowCube = { tx: number; y: number; speed: number; s: number };
    const flowCubes: FlowCube[] = [];
    TRACK_XS.forEach(tx => {
      for (let i = 0; i < 6; i++) {
        flowCubes.push({
          tx,
          y: (Math.random() * 24) - 12,
          speed: 0.006 + Math.random() * 0.01,
          s: 0.32 + Math.random() * 0.22,
        });
      }
    });

    // Static wireframe cubes in upper-right (large X, negative Y in ISO)
    const wireCubes = [
      { x: 3,  y: -6,  z: 0, s: 0.85 },
      { x: 5,  y: -8,  z: 0, s: 1.0  },
      { x: 7,  y: -6,  z: 0, s: 0.9  },
      { x: 9,  y: -8,  z: 0, s: 1.1  },
      { x: 11, y: -5,  z: 0, s: 0.75 },
      { x: 8,  y: -10, z: 0, s: 0.85 },
      { x: 10, y: -11, z: 0, s: 1.0  },
      { x: 12, y: -9,  z: 0, s: 0.9  },
      { x: 6,  y: -4,  z: 0, s: 0.6  },
      { x: 4,  y: -10, z: 0, s: 0.8  },
      { x: 13, y: -7,  z: 0, s: 1.05 },
    ];

    // Central boundary rectangle
    const drawBoundary = () => {
      const corners = [iso(-1, -2), iso(3, -2), iso(3, 6), iso(-1, 6)];
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      corners.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
      ctx.closePath();
      ctx.stroke();

      // Accent corners
      ctx.strokeStyle = 'rgba(188,216,42,0.25)';
      ctx.lineWidth = 1.2;
      [corners[0], corners[1], corners[2], corners[3]].forEach(corner => {
        ctx.beginPath(); ctx.arc(corner.x, corner.y, 2, 0, Math.PI * 2); ctx.stroke();
      });
    };

    const draw = () => {
      if (dead) return;
      const t = performance.now() * 0.001;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, w, h);

      drawGrid();
      drawBoundary();
      drawTracks();

      // Wireframe cubes with gentle float
      wireCubes.forEach((c, i) => {
        const fz = Math.sin(t * 0.35 + i * 0.85) * 0.12;
        const op = 0.4 + Math.sin(t * 0.2 + i * 0.6) * 0.1;
        wireCube(c.x, c.y, c.z + fz, c.s, op);
      });

      // Solid cubes flow along tracks
      flowCubes.forEach(cube => {
        cube.y -= cube.speed;
        if (cube.y < -13) cube.y = 13;
        const edgeDist = Math.min(cube.y + 13, 13 - cube.y);
        const alpha = Math.min(1, edgeDist / 2.5);
        if (alpha > 0.01) solidCube(cube.tx, cube.y, 0, cube.s, alpha);
      });

      // Radial vignette
      const vg = ctx.createRadialGradient(w * 0.5, h * 0.5, h * 0.1, w * 0.5, h * 0.5, h * 0.95);
      vg.addColorStop(0, 'rgba(5,5,5,0)');
      vg.addColorStop(0.7, 'rgba(5,5,5,0.3)');
      vg.addColorStop(1, 'rgba(5,5,5,0.88)');
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full absolute inset-0">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

export default ServicesHeroVisual3D;
