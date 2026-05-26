import { useEffect, useRef } from 'react';

const EnergyHeroVisual = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1, raf = 0;
    
    // Resize handler
    const resize = () => {
      const r = container.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    // --- Isometric Projection Helpers ---
    // Angle parameters for a dramatic 3D isometric view
    const angleX = Math.PI / 6; // 30 degrees
    const angleZ = Math.PI / 4; // 45 degrees
    
    const iso = (x: number, y: number, z: number) => {
      // Rotation around Y axis
      const rx = x * Math.cos(angleZ) - z * Math.sin(angleZ);
      const rz = x * Math.sin(angleZ) + z * Math.cos(angleZ);
      // Rotation around X axis
      const sx = rx;
      const sy = y * Math.cos(angleX) - rz * Math.sin(angleX);
      return {
        x: w / 2 + sx,
        y: h / 2 + 50 - sy
      };
    };

    const isoLine = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) => {
      const p1 = iso(x1, y1, z1);
      const p2 = iso(x2, y2, z2);
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
    };

    // --- Scene Objects ---
    
    // Grid settings
    const gridSize = 80;
    
    // AI Compute Pods (Data Center Clusters)
    const pods: {x: number, z: number, h: number, seed: number, type: 'compute' | 'power'}[] = [];
    
    // Seed some pods
    for(let r = -3; r <= 3; r++) {
      for(let c = -3; c <= 3; c++) {
        if(Math.random() > 0.4) {
          const isPower = Math.random() > 0.8;
          pods.push({
            x: c * gridSize,
            z: r * gridSize,
            h: isPower ? 40 + Math.random() * 30 : 60 + Math.random() * 80,
            seed: Math.random() * 100,
            type: isPower ? 'power' : 'compute'
          });
        }
      }
    }

    // Sort pods by depth (z - x) to render back-to-front
    pods.sort((a, b) => (b.x + b.z) - (a.x + a.z));

    // Energy flow packets
    const packets: {path: number[][], progress: number, speed: number, type: 'energy' | 'data'}[] = [];
    
    for(let i=0; i<30; i++) {
      const startX = (Math.floor(Math.random() * 7) - 3) * gridSize;
      const startZ = (Math.floor(Math.random() * 7) - 3) * gridSize;
      const path = [];
      path.push([startX, startZ]);
      
      let cx = startX;
      let cz = startZ;
      for(let step=0; step<4; step++) {
        if(Math.random() > 0.5) cx += (Math.random() > 0.5 ? 1 : -1) * gridSize;
        else cz += (Math.random() > 0.5 ? 1 : -1) * gridSize;
        path.push([cx, cz]);
      }
      
      packets.push({
        path,
        progress: Math.random(),
        speed: 0.002 + Math.random() * 0.004,
        type: Math.random() > 0.3 ? 'energy' : 'data'
      });
    }

    // --- Drawing Functions ---
    
    const drawPod = (x: number, z: number, height: number, seed: number, type: 'compute' | 'power', time: number) => {
      const w = 24;
      const d = 24;
      
      // Base points
      const p1 = iso(x - w, 0, z - d);
      const p2 = iso(x + w, 0, z - d);
      const p3 = iso(x + w, 0, z + d);
      const p4 = iso(x - w, 0, z + d);
      
      // Top points
      const t1 = iso(x - w, height, z - d);
      const t2 = iso(x + w, height, z - d);
      const t3 = iso(x + w, height, z + d);
      const t4 = iso(x - w, height, z + d);

      // Colors
      const isPower = type === 'power';
      const sideColor1 = isPower ? 'rgba(200, 150, 10, 0.2)' : 'rgba(255, 255, 255, 0.03)';
      const sideColor2 = isPower ? 'rgba(150, 100, 0, 0.4)' : 'rgba(255, 255, 255, 0.06)';
      const topColor = isPower ? 'rgba(245, 197, 24, 0.15)' : 'rgba(255, 255, 255, 0.1)';
      const strokeColor = isPower ? 'rgba(245, 197, 24, 0.4)' : 'rgba(255, 255, 255, 0.15)';

      // Left face
      ctx.beginPath();
      ctx.moveTo(p4.x, p4.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.lineTo(t3.x, t3.y);
      ctx.lineTo(t4.x, t4.y);
      ctx.closePath();
      ctx.fillStyle = sideColor1;
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Right face
      ctx.beginPath();
      ctx.moveTo(p3.x, p3.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(t2.x, t2.y);
      ctx.lineTo(t3.x, t3.y);
      ctx.closePath();
      ctx.fillStyle = sideColor2;
      ctx.fill();
      ctx.stroke();

      // Top face
      ctx.beginPath();
      ctx.moveTo(t1.x, t1.y);
      ctx.lineTo(t2.x, t2.y);
      ctx.lineTo(t3.x, t3.y);
      ctx.lineTo(t4.x, t4.y);
      ctx.closePath();
      ctx.fillStyle = topColor;
      ctx.fill();
      ctx.stroke();

      // Inner details / server racks
      if(type === 'compute') {
        const layers = Math.floor(height / 15);
        for(let l=1; l<layers; l++) {
          const lh = l * 15;
          const leftMid = iso(x - w, lh, z + d);
          const rightMid = iso(x + w, lh, z - d);
          const frontMid = iso(x + w, lh, z + d);
          
          ctx.beginPath();
          ctx.moveTo(leftMid.x, leftMid.y);
          ctx.lineTo(frontMid.x, frontMid.y);
          ctx.lineTo(rightMid.x, rightMid.y);
          ctx.strokeStyle = 'rgba(255,255,255,0.05)';
          ctx.stroke();
          
          // Blinking rack lights
          const lightActive = Math.sin(time * 5 + seed + l) > 0.5;
          if(lightActive) {
            ctx.beginPath();
            ctx.arc(frontMid.x - 5, frontMid.y - 2, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 232, 120, 0.8)';
            ctx.shadowColor = 'rgba(0, 232, 120, 0.8)';
            ctx.shadowBlur = 5;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      } else {
        // Power generation core
        const coreH = height * (0.4 + Math.sin(time * 2 + seed) * 0.1);
        const c1 = iso(x, 0, z);
        const c2 = iso(x, coreH, z);
        ctx.beginPath();
        ctx.moveTo(c1.x, c1.y);
        ctx.lineTo(c2.x, c2.y);
        ctx.strokeStyle = '#f5c518';
        ctx.lineWidth = 4;
        ctx.shadowColor = '#f5c518';
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.lineWidth = 1;
      }
    };

    // --- Main Render Loop ---
    const render = (time: number) => {
      const t = time * 0.001;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Center the whole scene slightly
      ctx.save();
      
      // 1. Draw Base Grid
      ctx.lineWidth = 1;
      const ext = 4 * gridSize;
      
      for(let i = -4; i <= 4; i++) {
        const v = i * gridSize;
        
        // Glow effect for grid
        const dist = Math.abs(i) / 4;
        const alpha = Math.max(0, 0.15 - dist * 0.1);
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
        
        ctx.beginPath();
        isoLine(v, 0, -ext, v, 0, ext);
        ctx.stroke();
        
        ctx.beginPath();
        isoLine(-ext, 0, v, ext, 0, v);
        ctx.stroke();
      }

      // 2. Draw Connection Nodes
      for(let r = -4; r <= 4; r++) {
        for(let c = -4; c <= 4; c++) {
          const pt = iso(c * gridSize, 0, r * gridSize);
          const dist = Math.sqrt(r*r + c*c) / 5;
          const alpha = Math.max(0, 0.2 - dist * 0.15);
          
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.fill();
        }
      }

      // 3. Draw Energy / Data Packets (Trails)
      packets.forEach(p => {
        p.progress += p.speed;
        if(p.progress > 1) p.progress = 0;
        
        const totalSegments = p.path.length - 1;
        const currentSegment = Math.floor(p.progress * totalSegments);
        const segmentProgress = (p.progress * totalSegments) - currentSegment;
        
        if (currentSegment < totalSegments) {
          const p1 = p.path[currentSegment];
          const p2 = p.path[currentSegment + 1];
          
          const cx = p1[0] + (p2[0] - p1[0]) * segmentProgress;
          const cz = p1[1] + (p2[1] - p1[1]) * segmentProgress;
          
          const pt = iso(cx, 0, cz);
          
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, p.type === 'energy' ? 3 : 2, 0, Math.PI * 2);
          
          if(p.type === 'energy') {
            ctx.fillStyle = '#f5c518';
            ctx.shadowColor = '#f5c518';
            ctx.shadowBlur = 10;
          } else {
            ctx.fillStyle = '#00e878';
            ctx.shadowColor = '#00e878';
            ctx.shadowBlur = 10;
          }
          
          ctx.fill();
          ctx.shadowBlur = 0;
          
          // Draw trail
          ctx.beginPath();
          const trailLen = 0.15; // 15% of path length
          let trailProgress = p.progress - trailLen;
          if(trailProgress < 0) trailProgress = 0;
          
          const tSegment = Math.floor(trailProgress * totalSegments);
          const tSegProg = (trailProgress * totalSegments) - tSegment;
          
          if(tSegment < totalSegments) {
            const tp1 = p.path[tSegment];
            const tp2 = p.path[tSegment + 1];
            const tx = tp1[0] + (tp2[0] - tp1[0]) * tSegProg;
            const tz = tp1[1] + (tp2[1] - tp1[1]) * tSegProg;
            const tPt = iso(tx, 0, tz);
            
            ctx.moveTo(pt.x, pt.y);
            ctx.lineTo(tPt.x, tPt.y);
            ctx.strokeStyle = p.type === 'energy' ? 'rgba(245, 197, 24, 0.5)' : 'rgba(0, 232, 120, 0.5)';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      });

      // 4. Draw Pods
      pods.forEach(pod => {
        // Simple hover/bounce effect
        const bounce = Math.sin(t * 2 + pod.seed) * 2;
        drawPod(pod.x, pod.z, pod.h + bounce, pod.seed, pod.type, t);
      });

      // 5. Draw overlay gradients to fade out edges
      const grad = ctx.createRadialGradient(w/2, h/2, h*0.2, w/2, h/2, h*0.6);
      grad.addColorStop(0, 'rgba(6, 7, 10, 0)');
      grad.addColorStop(1, 'rgba(6, 7, 10, 1)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.restore();
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
        style={{ filter: 'drop-shadow(0 0 30px rgba(0,0,0,0.5))' }}
      />
    </div>
  );
};

export default EnergyHeroVisual;
