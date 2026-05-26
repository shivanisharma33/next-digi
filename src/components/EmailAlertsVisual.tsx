import React, { useEffect, useRef } from 'react';

interface Vertex3D {
  x: number;
  y: number;
  z: number;
}

interface Edge3D {
  v1: number;
  v2: number;
}

interface Geometry3D {
  vertices: Vertex3D[];
  edges: Edge3D[];
  faces?: number[][]; // Indices of vertices representing polygonal faces
}

interface Mesh3D {
  x: number;  // 3D center coordinate
  y: number;
  z: number;
  size: number;
  type: 'cube' | 'octahedron' | 'tetrahedron' | 'ring';
  rx: number; // Rotations in radians
  ry: number;
  rz: number;
  vrx: number; // Rotational velocities
  vry: number;
  vrz: number;
  vx: number;  // Drift velocity
  vy: number;
  vz: number;
  excited: boolean; // Excited by scanning radar laser
  telemetry: string[];
}

// Mathematical 3D Geometries with structured polygonal faces for solid shading
const getCubeGeometry = (): Geometry3D => {
  const vertices: Vertex3D[] = [
    { x: -1, y: -1, z: -1 }, { x: 1, y: -1, z: -1 },
    { x: 1, y: 1, z: -1 }, { x: -1, y: 1, z: -1 },
    { x: -1, y: -1, z: 1 }, { x: 1, y: -1, z: 1 },
    { x: 1, y: 1, z: 1 }, { x: -1, y: 1, z: 1 }
  ];
  const edges: Edge3D[] = [
    { v1: 0, v2: 1 }, { v1: 1, v2: 2 }, { v1: 2, v2: 3 }, { v1: 3, v2: 0 }, // Front face
    { v1: 4, v2: 5 }, { v1: 5, v2: 6 }, { v1: 6, v2: 7 }, { v1: 7, v2: 4 }, // Back face
    { v1: 0, v2: 4 }, { v1: 1, v2: 5 }, { v1: 2, v2: 6 }, { v1: 3, v2: 7 }  // Side connections
  ];
  const faces = [
    [0, 1, 2, 3], // Front face
    [5, 4, 7, 6], // Back face
    [4, 5, 1, 0], // Top face
    [3, 2, 6, 7], // Bottom face
    [4, 0, 3, 7], // Left face
    [1, 5, 6, 2]  // Right face
  ];
  return { vertices, edges, faces };
};

const getOctahedronGeometry = (): Geometry3D => {
  const vertices: Vertex3D[] = [
    { x: 0, y: -1, z: 0 }, // Top
    { x: 1, y: 0, z: 0 },  // Right
    { x: 0, y: 1, z: 0 },  // Bottom
    { x: -1, y: 0, z: 0 }, // Left
    { x: 0, y: 0, z: -1 }, // Front
    { x: 0, y: 0, z: 1 }   // Back
  ];
  const edges: Edge3D[] = [
    { v1: 0, v2: 1 }, { v1: 0, v2: 3 }, { v1: 0, v2: 4 }, { v1: 0, v2: 5 }, // Top pyramid edges
    { v1: 2, v2: 1 }, { v1: 2, v2: 3 }, { v1: 2, v2: 4 }, { v1: 2, v2: 5 }, // Bottom pyramid edges
    { v1: 1, v2: 4 }, { v1: 4, v2: 3 }, { v1: 3, v2: 5 }, { v1: 5, v2: 1 }  // Center belt edges
  ];
  const faces = [
    [0, 1, 4], [0, 4, 3], [0, 3, 5], [0, 5, 1], // Upper faces
    [2, 4, 1], [2, 3, 4], [2, 5, 3], [2, 1, 5]  // Lower faces
  ];
  return { vertices, edges, faces };
};

const getTetrahedronGeometry = (): Geometry3D => {
  const vertices: Vertex3D[] = [
    { x: 1, y: 1, z: 1 },
    { x: -1, y: -1, z: 1 },
    { x: -1, y: 1, z: -1 },
    { x: 1, y: -1, z: -1 }
  ];
  const edges: Edge3D[] = [
    { v1: 0, v2: 1 }, { v1: 0, v2: 2 }, { v1: 0, v2: 3 },
    { v1: 1, v2: 2 }, { v1: 1, v2: 3 },
    { v1: 2, v2: 3 }
  ];
  const faces = [
    [0, 1, 2], [0, 2, 3], [0, 3, 1], [1, 3, 2]
  ];
  return { vertices, edges, faces };
};

const getRingGeometry = (segments = 16): Geometry3D => {
  const vertices: Vertex3D[] = [];
  const edges: Edge3D[] = [];
  
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    vertices.push({
      x: Math.cos(angle),
      y: Math.sin(angle),
      z: 0
    });
    edges.push({
      v1: i,
      v2: (i + 1) % segments
    });
  }
  return { vertices, edges };
};

export default function EmailAlertsVisual() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  // Track mouse coordinates and target states
  const mouseRef = useRef<{
    x: number;
    y: number;
    active: boolean;
    targetX: number;
    targetY: number;
    lockNodeIndex: number;
  }>({
    x: 0,
    y: 0,
    active: false,
    targetX: 0,
    targetY: 0,
    lockNodeIndex: -1
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let meshes: Mesh3D[] = [];
    let radarRadius = 0;
    let gridOffset = 0; // Animating floor coordinate offset
    
    // Wireframe geometry builders
    const cubeGeom = getCubeGeometry();
    const octaGeom = getOctahedronGeometry();
    const tetraGeom = getTetrahedronGeometry();
    const ringGeom = getRingGeometry();

    const telemetryPool = [
      ['RELAY_200', 'SMTP_SSL', 'SHA_512', 'PORT_465'],
      ['STB_UPLINK', 'TX_STABLE', '0x7F4B', 'SYS_ACT'],
      ['SEC_FEED', 'DB_SYNC', '0x10A9', 'PUE_1.05'],
      ['NODE_GRID', 'INFRA_U', '0xCC09', 'GATEWAY'],
      ['DPX_PR', 'DISC_SYS', '0xBF51', 'LAT_12ms']
    ];

    // Seed 16 initial meshes floating in 3D coordinate space
    const initMeshes = (w: number, h: number) => {
      const count = 16;
      meshes = [];
      
      for (let i = 0; i < count; i++) {
        const types: Array<'cube' | 'octahedron' | 'tetrahedron' | 'ring'> = [
          'cube', 'octahedron', 'tetrahedron', 'ring'
        ];
        const type = types[i % types.length];
        
        meshes.push({
          x: (Math.random() - 0.5) * w * 1.1,
          y: (Math.random() - 0.5) * h * 0.7 - h * 0.08,
          z: Math.random() * 550 + 120, // range [120, 670]
          size: 32 + Math.random() * 26,
          type,
          rx: Math.random() * Math.PI,
          ry: Math.random() * Math.PI,
          rz: Math.random() * Math.PI,
          vrx: (Math.random() - 0.5) * 0.007,
          vry: (Math.random() - 0.5) * 0.010,
          vrz: (Math.random() - 0.5) * 0.007,
          vx: (Math.random() - 0.5) * 0.12,
          vy: -0.2 - Math.random() * 0.3, // slow rising drift
          vz: (Math.random() - 0.5) * 0.08,
          excited: false,
          telemetry: telemetryPool[i % telemetryPool.length]
        });
      }
    };

    // Math 3D Pitch-Yaw-Roll Rotational Translation
    const rotate3D = (vertex: Vertex3D, rx: number, ry: number, rz: number): Vertex3D => {
      // Rotation on Y axis
      let x = vertex.x * Math.cos(ry) - vertex.z * Math.sin(ry);
      let z = vertex.x * Math.sin(ry) + vertex.z * Math.cos(ry);
      let y = vertex.y;
      
      // Rotation on X axis
      const tempY = y * Math.cos(rx) - z * Math.sin(rx);
      z = y * Math.sin(rx) + z * Math.cos(rx);
      y = tempY;
      
      // Rotation on Z axis
      const tempX = x * Math.cos(rz) - y * Math.sin(rz);
      y = x * Math.sin(rz) + y * Math.cos(rz);
      x = tempX;
      
      return { x, y, z };
    };

    const handleResize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      initMeshes(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const container = containerRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    // Mathematical projection rendering loop
    const animate = () => {
      // Pure cyberpunk deep black overlay backdrop
      ctx.fillStyle = '#050608';
      ctx.fillRect(0, 0, width, height);

      // Core camera constants
      const centerX = width / 2;
      const centerY = height / 2;
      const fov = 420;

      gridOffset = (gridOffset + 1.0) % 40;
      radarRadius = (radarRadius + 1.5) % 240;

      // Smooth coordinate interpolation
      const mouse = mouseRef.current;
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.12;
        mouse.y += (mouse.targetY - mouse.y) * 0.12;
      }

      // ── 1. DRAW HIGH-DEFINITION PERSPECTIVE GRID FLOOR ──
      const floorY = height * 0.65;
      ctx.lineWidth = 0.6;
      
      const gridLines = 26;
      const gridDepth = 15;
      
      // Vertical converging lines radiating to the horizon
      for (let i = 0; i <= gridLines; i++) {
        const factor = (i / gridLines) - 0.5; // range [-0.5, 0.5]
        const startX = centerX + factor * width * 0.2;
        const endX = centerX + factor * width * 4.5;
        
        ctx.strokeStyle = `rgba(245, 197, 24, ${0.05 + (1 - Math.abs(factor) * 2) * 0.16})`;
        ctx.beginPath();
        ctx.moveTo(startX, floorY);
        ctx.lineTo(endX, height);
        ctx.stroke();
      }

      // Horizontal lines shifting forward dynamically
      for (let j = 0; j < gridDepth; j++) {
        const progress = (j * 40 + gridOffset) / (gridDepth * 40);
        const y = floorY + Math.pow(progress, 2.2) * (height - floorY);
        const opacity = Math.pow(progress, 1.5) * 0.32; // Increased definition

        ctx.strokeStyle = `rgba(245, 197, 24, ${opacity})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // ── 2. DYNAMIC 3D SOLID-SHADED WIREFRAME ENGINE ──
      let nearestIndex = -1;
      let minDistance = 99999;
      const projected2DCoords: Array<{ x: number; y: number; z: number; size2D: number; vertices: Array<{ x: number; y: number }> }> = [];

      meshes.forEach((mesh, index) => {
        // Drift updates
        mesh.rx += mesh.vrx;
        mesh.ry += mesh.vry;
        mesh.rz += mesh.vrz;
        mesh.x += mesh.vx;
        mesh.y += mesh.vy;
        mesh.z += mesh.vz;

        // Reset mesh boundary coordinate
        if (mesh.y < -height * 0.6) {
          mesh.y = height * 0.5;
          mesh.x = (Math.random() - 0.5) * width * 1.1;
          mesh.z = Math.random() * 500 + 150;
        }

        // Perspective projections
        const depthScale = fov / (fov + mesh.z);
        const scrX = centerX + mesh.x * depthScale;
        const scrY = centerY + mesh.y * depthScale;
        const size2D = mesh.size * depthScale;

        // Active sweep checks
        if (mouse.active) {
          const dx = mouse.x - scrX;
          const dy = mouse.y - scrY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < minDistance && dist < 160) {
            minDistance = dist;
            nearestIndex = index;
          }
          mesh.excited = Math.abs(dist - radarRadius) < 22;
        } else {
          mesh.excited = false;
        }

        let geom: Geometry3D = cubeGeom;
        if (mesh.type === 'octahedron') geom = octaGeom;
        if (mesh.type === 'tetrahedron') geom = tetraGeom;
        if (mesh.type === 'ring') geom = ringGeom;

        // Translate and project all local vertices
        const projectedVertices = geom.vertices.map((v) => {
          const scaledV = { x: v.x * mesh.size, y: v.y * mesh.size, z: v.z * mesh.size };
          const rotV = rotate3D(scaledV, mesh.rx, mesh.ry, mesh.rz);
          const worldX = mesh.x + rotV.x;
          const worldY = mesh.y + rotV.y;
          const worldZ = mesh.z + rotV.z;
          const scale = fov / (fov + worldZ);
          return {
            x: centerX + worldX * scale,
            y: centerY + worldY * scale,
            z: worldZ
          };
        });

        projected2DCoords.push({
          x: scrX,
          y: scrY,
          z: mesh.z,
          size2D,
          vertices: projectedVertices.map(v => ({ x: v.x, y: v.y }))
        });

        // 3D Depth Shading Configuration (Significantly more defined contrast)
        const alpha = Math.max(0.24, (1 - mesh.z / 820) * 0.88);
        ctx.lineWidth = Math.max(0.8, depthScale * 2.4); // Thicker vector paths

        // Draw translucent polygonal faces (Solid fills)
        if (geom.faces) {
          geom.faces.forEach((face) => {
            ctx.beginPath();
            face.forEach((vIdx, fIdx) => {
              const v = projectedVertices[vIdx];
              if (fIdx === 0) ctx.moveTo(v.x, v.y);
              else ctx.lineTo(v.x, v.y);
            });
            ctx.closePath();
            
            // Fills faces with soft, glowing cybernetic translucent gold shading
            ctx.fillStyle = mesh.excited
              ? `rgba(255, 215, 40, ${alpha * 0.35})`
              : `rgba(245, 197, 24, ${alpha * 0.15})`;
            ctx.fill();
          });
        } else if (mesh.type === 'ring') {
          // Soft circular shade inside ring geometries
          ctx.fillStyle = `rgba(245, 197, 24, ${alpha * 0.06})`;
          ctx.beginPath();
          ctx.arc(scrX, scrY, size2D, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw wireframe outlines
        ctx.strokeStyle = mesh.excited 
          ? `rgba(255, 218, 50, ${alpha * 1.8})` 
          : `rgba(245, 197, 24, ${alpha * 0.95})`;

        geom.edges.forEach((edge) => {
          const v1 = projectedVertices[edge.v1];
          const v2 = projectedVertices[edge.v2];
          
          ctx.beginPath();
          ctx.moveTo(v1.x, v1.y);
          ctx.lineTo(v2.x, v2.y);
          ctx.stroke();
        });

        // Draw vertex dots with high visibility contrast
        projectedVertices.forEach((v) => {
          ctx.fillStyle = mesh.excited ? '#ffffff' : 'rgba(255, 220, 40, 0.7)';
          ctx.beginPath();
          ctx.arc(v.x, v.y, mesh.excited ? 2.0 : 1.3, 0, Math.PI * 2);
          ctx.fill();
        });

        // Flashing telemetry lock tick (Telemetry text logs removed for minimal styling)
        if (mesh.z < 520) {
          if (Math.random() > 0.95) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillRect(scrX + size2D + 4, scrY - 15, 2.5, 2.5);
          }
        }
      });

      mouse.lockNodeIndex = nearestIndex;

      // ── 3. DYNAMIC RETICLE HUD RETRIEVAL, LOCK SYNC & SCAN RETICLE ──
      if (mouse.active) {
        // Outer pulsing sweep rings
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'rgba(245, 197, 24, 0.12)';
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, radarRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(245, 197, 24, 0.04)';
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, (radarRadius + 120) % 240, 0, Math.PI * 2);
        ctx.stroke();

        // Locked target node details
        if (mouse.lockNodeIndex !== -1) {
          const lockedNode = projected2DCoords[mouse.lockNodeIndex];
          const meshObj = meshes[mouse.lockNodeIndex];

          // Compute 2D screenspace bounding boxes to render bounding lock brackets
          let minX = 99999, maxX = -99999, minY = 99999, maxY = -99999;
          lockedNode.vertices.forEach((v) => {
            if (v.x < minX) minX = v.x;
            if (v.x > maxX) maxX = v.x;
            if (v.y < minY) minY = v.y;
            if (v.y > maxY) maxY = v.y;
          });

          // Add extra framing padding
          const pad = 8;
          minX -= pad; maxX += pad; minY -= pad; maxY += pad;
          const boxW = maxX - minX;
          const boxH = maxY - minY;

          // Draw corner bracket ticks []
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.0;

          // Top-Left corner
          ctx.beginPath();
          ctx.moveTo(minX + 8, minY);
          ctx.lineTo(minX, minY);
          ctx.lineTo(minX, minY + 8);
          ctx.stroke();

          // Top-Right corner
          ctx.beginPath();
          ctx.moveTo(maxX - 8, minY);
          ctx.lineTo(maxX, minY);
          ctx.lineTo(maxX, minY + 8);
          ctx.stroke();

          // Bottom-Left corner
          ctx.beginPath();
          ctx.moveTo(minX + 8, maxY);
          ctx.lineTo(minX, maxY);
          ctx.lineTo(minX, maxY - 8);
          ctx.stroke();

          // Bottom-Right corner
          ctx.beginPath();
          ctx.moveTo(maxX - 8, maxY);
          ctx.lineTo(maxX, maxY);
          ctx.lineTo(maxX, maxY - 8);
          ctx.stroke();

          // Dotted laser pointer from reticle to bracket center
          ctx.lineWidth = 0.6;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.setLineDash([2, 5]);
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(lockedNode.x, lockedNode.y);
          ctx.stroke();
          ctx.setLineDash([]);

        }

        // Circular reticle scope HUD overlays
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'rgba(245, 197, 24, 0.55)';
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 14, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(245, 197, 24, 0.18)';
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 35, 0, Math.PI * 2);
        ctx.stroke();

        // Inner reticle scope crosshair indicators
        ctx.fillStyle = 'rgba(255, 215, 40, 0.9)';
        ctx.fillRect(mouse.x - 0.5, mouse.y - 0.5, 1, 1);
        ctx.fillRect(mouse.x - 8, mouse.y - 0.5, 3, 1);
        ctx.fillRect(mouse.x + 5, mouse.y - 0.5, 3, 1);
        ctx.fillRect(mouse.x - 0.5, mouse.y - 8, 1, 3);
        ctx.fillRect(mouse.x - 0.5, mouse.y + 5, 1, 3);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
      {/* Dynamic dark radial overlay gradient to keep the forms legible */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(5,6,8,0.08)_35%,rgba(5,6,8,0.60)_92%)] pointer-events-none" />
      {/* Smooth bottom backdrop blend gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050608] to-transparent pointer-events-none" />
    </div>
  );
}
