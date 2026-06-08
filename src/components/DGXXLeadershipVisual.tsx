"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * DGXXLeadershipVisual
 * An animated 3D "D" brand logo floating above a glowing tiered platform,
 * orbited by feature cubes, with a rising-particle core. Hover the logo to
 * trigger a full spin. Built in the repo's vanilla-Three.js-in-useEffect
 * pattern (parent sizing, ResizeObserver, full disposal on unmount).
 */

// Logo: solid D (with two notch holes) traced as a polygon outline.
const OUTER: [number, number][] = [[-1.194, 3.0], [-1.197, 1.476], [-3.0, 1.476], [-3.0, 0.6], [-1.194, 0.597], [-1.194, -0.627], [-3.0, -0.63], [-3.0, -1.506], [-1.197, -1.506], [-1.194, -2.997], [0.738, -2.997], [1.041, -2.952], [1.416, -2.826], [1.902, -2.523], [2.304, -2.118], [2.562, -1.734], [2.859, -1.02], [2.967, -0.507], [2.997, 0.213], [2.922, 0.768], [2.685, 1.488], [2.439, 1.935], [2.109, 2.337], [1.785, 2.613], [1.287, 2.877], [1.029, 2.955], [0.684, 3.0]];
const HOLES: [number, number][][] = [[[-1.197, -0.63], [0.609, -0.627], [0.615, -0.633], [0.615, -1.503], [0.609, -1.509], [-1.194, -1.509]], [[-1.197, 1.476], [0.609, 1.479], [0.615, 1.473], [0.615, 0.603], [0.609, 0.597], [-1.194, 0.597]]];

const YELLOW = 0xF9CA2C, YELLOW_HI = 0xE3B43A;

const DGXXLeadershipVisual: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const getSize = () => ({
      w: parent.clientWidth || 800,
      h: parent.clientHeight || 600,
    });

    let { w, h } = getSize();

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, w / h, 0.1, 200);

    // Frame the whole scene so it never gets clipped at the sides, regardless
    // of container aspect. We dolly the camera back far enough that both the
    // widest element (the ~9.6-unit platform) and the full vertical extent
    // (platform base up through the floating logo) stay inside the frustum.
    const HALF_V_FOV_TAN = Math.tan((34 / 2) * Math.PI / 180);
    const SCENE_HALF_WIDTH = 10.6;   // platform radius + margin
    const SCENE_HALF_HEIGHT = 7.4;   // base-to-logo extent + margin
    const LOOK_Y = 1.8;
    const fitDistance = (aspect: number) => {
      const forWidth = SCENE_HALF_WIDTH / (HALF_V_FOV_TAN * aspect);
      const forHeight = SCENE_HALF_HEIGHT / HALF_V_FOV_TAN;
      return Math.max(forWidth, forHeight);
    };
    let camDist = fitDistance(w / h);
    camera.position.set(0, 6.0, camDist);
    camera.lookAt(0, LOOK_Y, 0);

    // pointer raycaster for hover interactions (coords relative to canvas)
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2(-2, -2);
    let hovering = false, spinTarget = 0, spinCurrent = 0;
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    canvas.addEventListener('pointermove', onPointerMove);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const key = new THREE.DirectionalLight(0xffffff, 1.8); key.position.set(-5, 9, 9); scene.add(key);
    const fill = new THREE.DirectionalLight(0xffeec0, 0.55); fill.position.set(7, -1, 5); scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffffff, 1.0); rim.position.set(4, 7, -8); scene.add(rim);
    // soft edge light so the dark rough box reads its tiers/steps
    const boxEdge = new THREE.DirectionalLight(0xccd0d8, 0.5); boxEdge.position.set(-6, 4, 7); scene.add(boxEdge);

    // procedural textures (collected for disposal)
    const textures: THREE.Texture[] = [];
    const sprite = (() => {
      const c = document.createElement('canvas'); c.width = c.height = 64;
      const x = c.getContext('2d')!;
      const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
      g.addColorStop(0, 'rgba(255,243,192,1)'); g.addColorStop(0.35, 'rgba(249,202,44,0.9)'); g.addColorStop(1, 'rgba(249,202,44,0)');
      x.fillStyle = g; x.fillRect(0, 0, 64, 64);
      const tex = new THREE.CanvasTexture(c); textures.push(tex); return tex;
    })();

    // ================================================================
    // BACKGROUND: drifting instanced cubes (deep behind)
    // ================================================================
    const bgRays = new THREE.Group(); bgRays.position.z = -14; scene.add(bgRays);
    const CUBES = 40;
    const cubeInstGeo = new THREE.BoxGeometry(1, 1, 1);
    const cubeInstMat = new THREE.MeshStandardMaterial({ color: YELLOW, metalness: 0.5, roughness: 0.4, emissive: new THREE.Color(YELLOW), emissiveIntensity: 0.3, transparent: true, opacity: 0.85 });
    const cubeInst = new THREE.InstancedMesh(cubeInstGeo, cubeInstMat, CUBES);
    const cd: { x: number; y: number; z: number; s: number; rot: number; rotSp: number; phase: number }[] = [];
    const cdummy = new THREE.Object3D();
    for (let i = 0; i < CUBES; i++) {
      const s = 0.07 + Math.random() * 0.26;
      cd.push({ x: Math.random() * 44 - 22, y: Math.random() * 24 - 6, z: Math.random() * -12, s, rot: Math.random() * 6.28, rotSp: (Math.random() - 0.5) * 1.0, phase: Math.random() * 6.28 });
    }
    bgRays.add(cubeInst);

    // premium feature cubes (few, larger) that drift near the logo
    type FeatCube = THREE.Mesh<THREE.BoxGeometry, THREE.MeshStandardMaterial> & {
      userData: { ang: number; radius: number; speed: number; yBase: number; ySpeed: number; phase: number; sz: number };
    };
    const featCubes: FeatCube[] = [];
    const featMat = new THREE.MeshStandardMaterial({ color: 0x141414, metalness: 0.85, roughness: 0.25, emissive: new THREE.Color(YELLOW), emissiveIntensity: 0.25 });
    for (let i = 0; i < 6; i++) {
      const sz = 0.22 + Math.random() * 0.16;
      const cube = new THREE.Mesh(new THREE.BoxGeometry(sz, sz, sz), featMat.clone()) as FeatCube;
      const ang = (i / 6) * 6.283;
      cube.userData = { ang, radius: 5.5 + Math.random() * 1.5, speed: 0.15 + Math.random() * 0.12, yBase: 5.0 + Math.random() * 1.5, ySpeed: 0.4 + Math.random() * 0.5, phase: Math.random() * 6.28, sz };
      scene.add(cube); featCubes.push(cube);
    }

    // ================================================================
    // LOGO - bars seated into the D, faces forward
    // ================================================================
    const logoGroup = new THREE.Group(); logoGroup.position.set(0, 5.2, 0); logoGroup.scale.setScalar(0.64); scene.add(logoGroup);
    const logoMat = new THREE.MeshStandardMaterial({ color: YELLOW, metalness: 0.75, roughness: 0.12, emissive: new THREE.Color(0xFFD24A), emissiveIntensity: 0.03 });
    let minx = 999, maxx = -999, miny = 999, maxy = -999;
    for (const p of OUTER) { minx = Math.min(minx, p[0]); maxx = Math.max(maxx, p[0]); miny = Math.min(miny, p[1]); maxy = Math.max(maxy, p[1]); }
    const cxx = (minx + maxx) / 2, cyy = (miny + maxy) / 2;
    const lsh = new THREE.Shape();
    lsh.moveTo(OUTER[0][0] - cxx, OUTER[0][1] - cyy);
    for (let i = 1; i < OUTER.length; i++) lsh.lineTo(OUTER[i][0] - cxx, OUTER[i][1] - cyy);
    lsh.closePath();
    for (const hole of HOLES) {
      const hp = new THREE.Path();
      hp.moveTo(hole[0][0] - cxx, hole[0][1] - cyy);
      for (let i = 1; i < hole.length; i++) hp.lineTo(hole[i][0] - cxx, hole[i][1] - cyy);
      hp.closePath(); lsh.holes.push(hp);
    }
    const lgeo = new THREE.ExtrudeGeometry(lsh, { depth: 0.9, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.07, bevelSegments: 5, curveSegments: 72 });
    lgeo.center();
    const logoMesh = new THREE.Mesh(lgeo, logoMat); logoGroup.add(logoMesh);

    // ================================================================
    // PLATFORM - tiered round platform, dark metal with broken glowing segments
    // ================================================================
    const platform = new THREE.Group(); platform.position.set(0, -2.6, 0); scene.add(platform);
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x060607, metalness: 0.55, roughness: 0.62 });

    const tierDefs = [
      { r: 9.0, h: 1.4, y: 0.0 },   // bottom widest
      { r: 7.0, h: 1.3, y: 1.3 },   // middle
      { r: 5.2, h: 1.2, y: 2.5 },   // top (holds the glow)
    ];
    for (const tier of tierDefs) {
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(tier.r, tier.r + 0.25, tier.h, 160), darkMat);
      cyl.position.y = tier.y + tier.h / 2; platform.add(cyl);
      const cap = new THREE.Mesh(new THREE.CircleGeometry(tier.r - 0.02, 160), darkMat);
      cap.rotation.x = -Math.PI / 2; cap.position.y = tier.y + tier.h; platform.add(cap);
    }
    // seal the base so no glow leaks underneath
    const bottomCap = new THREE.Mesh(new THREE.CircleGeometry(tierDefs[0].r + 0.5, 160), darkMat);
    bottomCap.rotation.x = Math.PI / 2; bottomCap.position.y = -0.05; platform.add(bottomCap);
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(tierDefs[0].r + 0.25, tierDefs[0].r + 0.6, 0.6, 160), darkMat);
    skirt.position.y = -0.3; platform.add(skirt);

    // glowing broken yellow segments on each tier's top edge
    type SegGroup = THREE.Group & { userData: { speed: number; phase: number } };
    const segGroups: SegGroup[] = [];
    const makeSegments = (radius: number, y: number, count: number, color: number, op: number) => {
      const grp = new THREE.Group() as SegGroup; grp.rotation.x = -Math.PI / 2; grp.position.y = y;
      for (let i = 0; i < count; i++) {
        if (Math.random() < 0.35) continue;              // broken/dashed look
        const a0 = (i / count) * 6.283 + (Math.random() - 0.5) * 0.05;
        const sweep = (6.283 / count) * (0.4 + Math.random() * 0.5);
        const m = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, transparent: true, opacity: op * (0.5 + Math.random() * 0.5), blending: THREE.AdditiveBlending, depthWrite: false });
        m.userData = { base: m.opacity };
        grp.add(new THREE.Mesh(new THREE.RingGeometry(radius - 0.08, radius + 0.08, 32, 1, a0, sweep), m));
      }
      grp.userData = { speed: (Math.random() < 0.5 ? -1 : 1) * (0.18 + Math.random() * 0.25), phase: Math.random() * 6.28 };
      platform.add(grp); segGroups.push(grp);
    };
    makeSegments(tierDefs[0].r - 0.1, tierDefs[0].y + tierDefs[0].h + 0.01, 40, YELLOW_HI, 0.78);
    makeSegments(tierDefs[1].r - 0.1, tierDefs[1].y + tierDefs[1].h + 0.01, 32, YELLOW_HI, 0.78);
    makeSegments(tierDefs[2].r - 0.1, tierDefs[2].y + tierDefs[2].h + 0.01, 26, YELLOW_HI, 0.78);

    // bright glowing core disc on the top tier with concentric thin rings
    const coreY = tierDefs[2].y + tierDefs[2].h + 0.02;
    const coreMeshes: { mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>; base: number }[] = [];
    const coreTex = (() => {
      const c = document.createElement('canvas'); c.width = c.height = 256;
      const x = c.getContext('2d')!;
      const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
      g.addColorStop(0.00, 'rgba(255,248,228,0.95)');   // soft warm white core
      g.addColorStop(0.10, 'rgba(255,231,170,0.92)');
      g.addColorStop(0.30, 'rgba(243,193,66,0.82)');    // rich brand gold
      g.addColorStop(0.62, 'rgba(196,140,30,0.45)');    // warm amber
      g.addColorStop(1.00, 'rgba(130,90,10,0)');        // soft fade
      x.fillStyle = g; x.fillRect(0, 0, 256, 256);
      const tex = new THREE.CanvasTexture(c); textures.push(tex); return tex;
    })();
    const coreDisc = new THREE.Mesh(new THREE.CircleGeometry(3.2, 72),
      new THREE.MeshBasicMaterial({ map: coreTex, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false }));
    coreDisc.rotation.x = -Math.PI / 2; coreDisc.position.y = coreY + 0.02; platform.add(coreDisc);
    coreMeshes.push({ mesh: coreDisc, base: 0.95 });
    // concentric thin rings radiating from core
    const coreRings: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const rad = 3.3 + i * 0.35;   // kept inside the top tier
      const m = new THREE.MeshBasicMaterial({ color: YELLOW_HI, side: THREE.DoubleSide, transparent: true, opacity: 0.22 - i * 0.05, blending: THREE.AdditiveBlending, depthWrite: false });
      const r = new THREE.Mesh(new THREE.RingGeometry(rad, rad + 0.03, 128), m); r.rotation.x = -Math.PI / 2; r.position.y = coreY; platform.add(r); coreRings.push(r);
    }
    const upLight = new THREE.SpotLight(0xF0B43A, 1.5, 16, 0.5, 0.6, 1.5);
    upLight.position.set(0, coreY + 0.3, 0);
    upLight.target.position.set(0, coreY + 6, 0);
    platform.add(upLight); platform.add(upLight.target);

    // particles rising from the core
    const WISP = 320, wGeo = new THREE.BufferGeometry(), wPos = new Float32Array(WISP * 3);
    const wData: { x: number; z: number; speed: number }[] = [];
    for (let i = 0; i < WISP; i++) {
      const a = Math.random() * 6.28, rr = Math.random() * 2.6;
      wData.push({ x: Math.cos(a) * rr, z: Math.sin(a) * rr, speed: 0.7 + Math.random() * 1.5 });
      wPos[i * 3] = wData[i].x; wPos[i * 3 + 1] = coreY + Math.random() * 5.5; wPos[i * 3 + 2] = wData[i].z;
    }
    wGeo.setAttribute('position', new THREE.BufferAttribute(wPos, 3));
    platform.add(new THREE.Points(wGeo, new THREE.PointsMaterial({ size: 0.13, map: sprite, color: YELLOW_HI, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.8 })));

    // ================================================================
    // ANIMATE
    // ================================================================
    const clock = new THREE.Clock(); let t = 0, rafId = 0;
    const logoWorld = new THREE.Vector3();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05); t += dt;

      // hover detection on the logo
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObject(logoMesh, false).length > 0;
      if (hit && !hovering) { hovering = true; spinTarget += Math.PI * 2; }   // queue one full turn
      if (!hit) hovering = false;
      spinCurrent += (spinTarget - spinCurrent) * Math.min(1, dt * 3.0);
      logoGroup.rotation.y = spinCurrent + Math.sin(t * 0.5) * 0.12;
      logoGroup.position.y = 5.2 + Math.sin(t * 0.8) * 0.1;

      // feature cubes orbit and pass near the logo; logo glows on contact
      let glowBoost = 0;
      logoGroup.getWorldPosition(logoWorld);
      for (const cube of featCubes) {
        const u = cube.userData; u.ang += u.speed * dt;
        const x = Math.cos(u.ang) * u.radius;
        const z = Math.sin(u.ang) * u.radius * 0.5;
        const y = u.yBase + Math.sin(t * u.ySpeed + u.phase) * 1.6;
        cube.position.set(x, y, z);
        cube.rotation.x += dt * 0.6; cube.rotation.y += dt * 0.4;
        const d = cube.position.distanceTo(logoWorld);
        const near = Math.max(0, 1 - d / 3.2);          // within ~3.2 units => contact
        cube.material.emissiveIntensity = 0.25 + near * 1.8;
        glowBoost = Math.max(glowBoost, near);
      }
      logoMat.emissiveIntensity = 0.03 + glowBoost * 0.55;

      for (let i = 0; i < CUBES; i++) {
        const d = cd[i];
        cdummy.position.set(d.x + Math.sin(t * 0.2 + d.phase) * 1.2, d.y + Math.sin(t * 0.4 + d.phase) * 0.5, d.z);
        cdummy.rotation.set(d.rot + t * d.rotSp, d.rot + t * d.rotSp * 0.7, 0); cdummy.scale.set(d.s, d.s, d.s);
        cdummy.updateMatrix(); cubeInst.setMatrixAt(i, cdummy.matrix);
      }
      cubeInst.instanceMatrix.needsUpdate = true;

      // platform glow segments slowly rotate
      for (const g of segGroups) {
        g.rotation.z += g.userData.speed * dt;
        const fl = 0.6 + 0.4 * Math.sin(t * 1.5 + g.userData.phase);
        g.children.forEach((ch) => {
          const mat = (ch as THREE.Mesh).material as THREE.MeshBasicMaterial;
          if (mat) mat.opacity = mat.userData ? (mat.userData.base as number) * fl : mat.opacity;
        });
      }
      for (let i = 0; i < coreRings.length; i++) coreRings[i].rotation.z += (i % 2 ? 0.05 : -0.04) * dt;
      const pulse = 0.9 + 0.1 * Math.sin(t * 2.2);
      for (const c of coreMeshes) c.mesh.material.opacity = c.base * pulse;

      const wp = wGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < WISP; i++) { let y = wp[i * 3 + 1] + dt * wData[i].speed; if (y > coreY + 6) y -= 5.5; wp[i * 3 + 1] = y; }
      wGeo.attributes.position.needsUpdate = true;

      // subtle cinematic camera drift (orbit radius follows the fitted distance)
      const camA = Math.sin(t * 0.05) * 0.06;
      camera.position.x = Math.sin(camA) * camDist; camera.position.z = Math.cos(camA) * camDist;
      camera.position.y = 6.0 + Math.sin(t * 0.04) * 0.6; camera.lookAt(0, LOOK_Y, 0);
      canvas.style.cursor = hit ? 'pointer' : 'default';
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const s = getSize();
      w = s.w; h = s.h;
      camera.aspect = w / h;
      camDist = fitDistance(w / h);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(parent);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      canvas.removeEventListener('pointermove', onPointerMove);
      textures.forEach(tex => tex.dispose());
      scene.traverse(obj => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose?.();
        const mat = mesh.material;
        if (Array.isArray(mat)) mat.forEach(m => m.dispose());
        else if (mat) mat.dispose();
      });
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full block" />;
};

export default DGXXLeadershipVisual;
