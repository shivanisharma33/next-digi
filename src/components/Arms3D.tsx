import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Arms3D: React.FC<{ theme?: 'light' | 'dark' }> = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let W = container.clientWidth || 600;
    let H = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, W / H, 0.1, 200);
    camera.position.set(13, 7, 14);
    camera.lookAt(0, 1.5, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.inset = '0';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.22);
    scene.add(ambient);
    const keyLight = new THREE.DirectionalLight(0xffffff, 0.7);
    keyLight.position.set(8, 18, 12);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xaaaacc, 0.18);
    fillLight.position.set(-10, 6, -8);
    scene.add(fillLight);
    const interiorLight = new THREE.PointLight(0xfacc15, 0.6, 9);
    interiorLight.position.set(1, 1.6, 0);
    scene.add(interiorLight);

    const COL = { yellow: 0xfacc15, yellowBright: 0xfde047, bodyDark: 0x1a1a1c, bodyDarker: 0x111113, bodyMid: 0x222226 };
    const matBodyDark = new THREE.MeshStandardMaterial({ color: COL.bodyDark, metalness: 0.55, roughness: 0.5 });
    const matBodyMid = new THREE.MeshStandardMaterial({ color: COL.bodyMid, metalness: 0.55, roughness: 0.5 });
    const matBodyDarker = new THREE.MeshStandardMaterial({ color: COL.bodyDarker, metalness: 0.5, roughness: 0.55 });
    const pipeMat = new THREE.MeshStandardMaterial({ color: COL.yellow, emissive: COL.yellow, emissiveIntensity: 0.65, metalness: 0.4, roughness: 0.35 });

    const makeEdgeMat = (opacity = 0.45) =>
      new THREE.LineBasicMaterial({ color: COL.yellow, transparent: true, opacity, linewidth: 1 });

    const addEdgeOutline = (group: THREE.Object3D, geo: THREE.BufferGeometry, pos: THREE.Vector3, opacity = 0.45) => {
      const line = new THREE.LineSegments(new THREE.EdgesGeometry(geo), makeEdgeMat(opacity));
      line.position.copy(pos);
      group.add(line);
    };

    const makeAccentMat = (intensity = 1.0) =>
      new THREE.MeshStandardMaterial({ color: COL.yellow, emissive: COL.yellow, emissiveIntensity: intensity, metalness: 0.3, roughness: 0.4 });

    // ===== Building =====
    const moduleGroup = new THREE.Group();
    scene.add(moduleGroup);

    const BW = 7.2, BH = 2.8, BD = 3.6, wt = 0.12;
    const PB_H = 0.18, PB_W = BW + 0.6, PB_D = BD + 0.6;

    const plinth = new THREE.Mesh(new THREE.BoxGeometry(PB_W, PB_H, PB_D), matBodyMid);
    plinth.position.y = PB_H / 2;
    moduleGroup.add(plinth);
    addEdgeOutline(moduleGroup, new THREE.BoxGeometry(PB_W, PB_H, PB_D), new THREE.Vector3(0, PB_H / 2, 0), 0.5);

    const innerFloor = new THREE.Mesh(
      new THREE.BoxGeometry(BW * 0.95, 0.05, BD * 0.92),
      new THREE.MeshStandardMaterial({ color: 0x16161a, metalness: 0.4, roughness: 0.7 })
    );
    innerFloor.position.y = PB_H + 0.025;
    moduleGroup.add(innerFloor);

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(BW, BH, wt), matBodyDark);
    backWall.position.set(0, PB_H + BH / 2, -BD / 2 + wt / 2);
    moduleGroup.add(backWall);
    addEdgeOutline(moduleGroup, new THREE.BoxGeometry(BW, BH, wt), new THREE.Vector3(0, PB_H + BH / 2, -BD / 2 + wt / 2));

    const sideWall = new THREE.Mesh(new THREE.BoxGeometry(wt, BH, BD), matBodyDark);
    sideWall.position.set(-BW / 2 + wt / 2, PB_H + BH / 2, 0);
    moduleGroup.add(sideWall);
    addEdgeOutline(moduleGroup, new THREE.BoxGeometry(wt, BH, BD), new THREE.Vector3(-BW / 2 + wt / 2, PB_H + BH / 2, 0));

    const roof = new THREE.Mesh(new THREE.BoxGeometry(BW, 0.10, BD), matBodyDarker);
    roof.position.set(0, PB_H + BH + 0.05, 0);
    moduleGroup.add(roof);
    addEdgeOutline(moduleGroup, new THREE.BoxGeometry(BW, 0.10, BD), new THREE.Vector3(0, PB_H + BH + 0.05, 0));

    // Openable front-left wall
    const frontW = BW * 0.5;
    const openableWall = new THREE.Group();
    openableWall.position.set(-BW / 2 + frontW / 2, PB_H + BH, BD / 2 - wt / 2);
    moduleGroup.add(openableWall);

    const wallPanel = new THREE.Mesh(new THREE.BoxGeometry(frontW, BH, wt), matBodyDark);
    wallPanel.position.set(0, -BH / 2, 0);
    openableWall.add(wallPanel);
    addEdgeOutline(openableWall, new THREE.BoxGeometry(frontW, BH, wt), new THREE.Vector3(0, -BH / 2, 0), 0.5);

    for (let i = 0; i < 5; i++) {
      const louver = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.10, 0.04),
        new THREE.MeshStandardMaterial({ color: 0x080808, metalness: 0.6, roughness: 0.5 })
      );
      louver.position.set(-frontW / 2 + 0.4, -BH + 0.55 + i * 0.26 + 0.55, wt / 2 + 0.025);
      openableWall.add(louver);
    }

    // DGXX Logo 3D
    const dgxxLogoGroup = (() => {
      const group = new THREE.Group();
      const s = 2.5;
      const dLE = -0.125 * s, aCX = 0.055 * s, aR = 0.35 * s, dTY = 0.35 * s, dBY = -0.35 * s;
      const dShape = new THREE.Shape();
      dShape.moveTo(dLE, dTY);
      dShape.lineTo(aCX, dTY);
      dShape.absarc(aCX, 0, aR, Math.PI / 2, -Math.PI / 2, true);
      dShape.lineTo(dLE, dBY);
      dShape.closePath();
      const notchYs = [0.16 * s, -0.16 * s];
      const nH = 0.10 * s, nIE = dLE + 0.18 * s;
      notchYs.forEach(ny => {
        const n = new THREE.Path();
        n.moveTo(dLE, ny + nH / 2); n.lineTo(nIE, ny + nH / 2);
        n.lineTo(nIE, ny - nH / 2); n.lineTo(dLE, ny - nH / 2); n.closePath();
        dShape.holes.push(n);
      });
      const ex: THREE.ExtrudeGeometryOptions = { depth: 0.10, bevelEnabled: true, bevelThickness: 0.014, bevelSize: 0.009, bevelSegments: 2, curveSegments: 24 };
      const yMat = new THREE.MeshStandardMaterial({ color: COL.yellow, emissive: COL.yellow, emissiveIntensity: 0.4, metalness: 0.3, roughness: 0.4 });
      const meshes: THREE.Mesh[] = [];
      const dMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(dShape, ex), yMat);
      group.add(dMesh); meshes.push(dMesh);
      const bH = 0.10 * s, bLE = -0.405 * s;
      notchYs.forEach(by => {
        const b = new THREE.Shape();
        b.moveTo(bLE, by + bH / 2); b.lineTo(dLE, by + bH / 2);
        b.lineTo(dLE, by - bH / 2); b.lineTo(bLE, by - bH / 2); b.closePath();
        const m = new THREE.Mesh(new THREE.ExtrudeGeometry(b, ex), yMat);
        group.add(m); meshes.push(m);
      });
      group.userData.material = yMat;
      group.userData.meshes = meshes;
      return group;
    })();
    dgxxLogoGroup.position.set(0.1, -BH / 2, wt / 2 + 0.04);
    openableWall.add(dgxxLogoGroup);

    // Roof rails
    const makeRail = (x1: number, z1: number, x2: number, z2: number) => {
      const len = Math.hypot(x2 - x1, z2 - z1);
      const rail = new THREE.Mesh(new THREE.BoxGeometry(len, 0.04, 0.025), makeAccentMat(0.5));
      rail.position.set((x1 + x2) / 2, PB_H + BH + 0.12, (z1 + z2) / 2);
      rail.rotation.y = Math.atan2(z2 - z1, x2 - x1);
      moduleGroup.add(rail);
    };
    makeRail(-BW / 2 + 0.15, BD / 2 - 0.15, BW / 2 - 0.15, BD / 2 - 0.15);
    makeRail(-BW / 2 + 0.15, -BD / 2 + 0.15, BW / 2 - 0.15, -BD / 2 + 0.15);
    makeRail(-BW / 2 + 0.15, -BD / 2 + 0.15, -BW / 2 + 0.15, BD / 2 - 0.15);
    makeRail(BW / 2 - 0.15, -BD / 2 + 0.15, BW / 2 - 0.15, BD / 2 - 0.15);

    const fans: THREE.Group[] = [];
    const coolingUnitPositions: { x: number; z: number; y: number }[] = [];
    const makeCoolingUnit = (x: number) => {
      const unit = new THREE.Group();
      const housing = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 1.2), matBodyMid);
      housing.position.y = 0.25; unit.add(housing);
      const housingEdge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.2, 0.5, 1.2)), makeEdgeMat(0.45));
      housingEdge.position.y = 0.25; unit.add(housingEdge);
      const fanRim = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.035, 8, 32), makeAccentMat(0.7));
      fanRim.rotation.x = Math.PI / 2; fanRim.position.y = 0.52; unit.add(fanRim);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.04, 16), matBodyDark);
      hub.position.y = 0.54; unit.add(hub);
      const blades = new THREE.Group();
      for (let b = 0; b < 5; b++) {
        const blade = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.025, 0.08), new THREE.MeshStandardMaterial({ color: 0x18181c, metalness: 0.6, roughness: 0.4 }));
        blade.rotation.y = (b / 5) * Math.PI * 2; blade.rotation.z = 0.18; blades.add(blade);
      }
      blades.position.y = 0.54;
      blades.userData.speed = 0.12 + Math.random() * 0.04;
      unit.add(blades); fans.push(blades);
      unit.position.set(x, PB_H + BH + 0.10, -0.3);
      moduleGroup.add(unit);
      coolingUnitPositions.push({ x, z: -0.3, y: PB_H + BH + 0.10 });
    };
    makeCoolingUnit(-0.8); makeCoolingUnit(0.8);

    const eBox1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.35, 0.4), matBodyDark);
    eBox1.position.set(-BW / 2 + 1.0, PB_H + BH + 0.28, 0.8);
    moduleGroup.add(eBox1);
    const eBox2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.28, 0.4), matBodyDark);
    eBox2.position.set(BW / 2 - 0.8, PB_H + BH + 0.24, 1.0);
    moduleGroup.add(eBox2);

    // ===== Racks =====
    interface LedData { mesh: THREE.Mesh; mat: THREE.MeshStandardMaterial; row: number; col: number; }
    const racks: THREE.Group[] = [];
    const RACK_W = 0.55, RACK_H = BH * 0.8, RACK_D = BD * 0.65;
    const LED_ROWS = 16, LED_COLS = 6;
    let nextRackIndex = 0;

    const buildRack = (rackX: number, rackZ: number, isHidden = false): THREE.Group => {
      const rack = new THREE.Group();
      const myIndex = nextRackIndex++;
      const body = new THREE.Mesh(new THREE.BoxGeometry(RACK_W, RACK_H, RACK_D), new THREE.MeshStandardMaterial({ color: 0x080809, metalness: 0.6, roughness: 0.35 }));
      body.position.y = RACK_H / 2;
      body.userData.rackIndex = myIndex;
      rack.add(body);
      const bodyEdge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(RACK_W, RACK_H, RACK_D)), makeEdgeMat(0.4));
      bodyEdge.position.y = RACK_H / 2; rack.add(bodyEdge);

      const ledGroup = new THREE.Group();
      const ledData: LedData[] = [];
      for (let r = 0; r < LED_ROWS; r++) {
        for (let c = 0; c < LED_COLS; c++) {
          const ledMat = new THREE.MeshStandardMaterial({ color: COL.yellow, emissive: COL.yellow, emissiveIntensity: 0, metalness: 0, roughness: 0.3 });
          const led = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.045, 0.022), ledMat);
          led.position.set(-RACK_W * 0.36 + c * (RACK_W * 0.144), RACK_H * 0.10 + r * (RACK_H * 0.052), RACK_D / 2 + 0.012);
          ledGroup.add(led); ledData.push({ mesh: led, mat: ledMat, row: r, col: c });
        }
      }
      for (let s = 0; s <= LED_ROWS; s++) {
        const slot = new THREE.Mesh(new THREE.BoxGeometry(RACK_W * 0.95, 0.008, 0.018), new THREE.MeshStandardMaterial({ color: 0x000000 }));
        slot.position.set(0, RACK_H * 0.075 + s * (RACK_H * 0.052), RACK_D / 2 + 0.013);
        ledGroup.add(slot);
      }
      rack.add(ledGroup);
      rack.position.set(rackX, PB_H + 0.05, rackZ);
      rack.userData = { ledData, rackIndex: myIndex, baseZ: rackZ, finalZ: rackZ, targetForward: 0, currentForward: 0, rackX, hoverProgress: 0, hoverWavePhase: 0, isHidden };

      if (isHidden) {
        rack.visible = false;
        rack.userData.revealStartTime = null;
        rack.userData.slideOutProgress = 0;
        rack.userData.hiddenStartZ = rackZ - 0.7;
        rack.position.z = rackZ - 0.7;
        rack.userData.baseZ = rackZ - 0.7;
        rack.scale.set(0.001, 0.001, 0.001);
      } else {
        rack.userData.revealStartTime = performance.now() + 200;
      }
      moduleGroup.add(rack); racks.push(rack);
      return rack;
    };

    for (let i = 0; i < 7; i++) buildRack(-BW / 2 + 2.2 + i * 0.62, -0.1, false);
    const hiddenRacks: THREE.Group[] = [];
    [-3.15, -2.60, -2.05].forEach(x => hiddenRacks.push(buildRack(x, -0.1, true)));

    // ===== Pipe network =====
    const PR = 0.085, PIPE_Y = PB_H + BH * 0.86, PIPE_Z = -0.5;
    interface PipeCurve { curve: THREE.LineCurve3; speed: number; pulses: number; delay?: number; }
    const pipeCurves: PipeCurve[] = [];

    const mkPipe = (a: THREE.Vector3, b: THREE.Vector3, r = PR) => {
      const dir = new THREE.Vector3().subVectors(b, a);
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(r, r, dir.length(), 14), pipeMat);
      cyl.position.copy(new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5));
      cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
      return cyl;
    };
    const mkSphere = (pos: THREE.Vector3, r = PR * 1.3) => {
      const s = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 12), pipeMat);
      s.position.copy(pos);
      return s;
    };

    const PXL = -BW / 2 + 1.7, PXR = BW / 2 - 1.2;
    for (let i = 0; i < 3; i++) {
      const y = PIPE_Y + i * 0.16, z = PIPE_Z + i * 0.10;
      const a = new THREE.Vector3(PXL, y, z), b = new THREE.Vector3(PXR, y, z);
      moduleGroup.add(mkPipe(a, b)); moduleGroup.add(mkSphere(a)); moduleGroup.add(mkSphere(b));
      pipeCurves.push({ curve: new THREE.LineCurve3(a, b), speed: 0.20 + i * 0.02, pulses: 4 });
    }
    coolingUnitPositions.forEach(cu => {
      const a = new THREE.Vector3(cu.x, cu.y - 0.05, PIPE_Z), b = new THREE.Vector3(cu.x, PIPE_Y - 0.05, PIPE_Z);
      moduleGroup.add(mkPipe(a, b, PR * 0.9)); moduleGroup.add(mkSphere(b, PR * 1.5)); moduleGroup.add(mkSphere(a, PR * 1.4));
      pipeCurves.push({ curve: new THREE.LineCurve3(a, b), speed: 0.32, pulses: 2 });
    });
    racks.filter(r => !r.userData.isHidden).forEach((rack, i) => {
      const dx = rack.userData.rackX;
      const a = new THREE.Vector3(dx, PIPE_Y - 0.05, PIPE_Z), b = new THREE.Vector3(dx, PB_H + RACK_H * 0.9, PIPE_Z);
      moduleGroup.add(mkPipe(a, b, PR * 0.75)); moduleGroup.add(mkSphere(a, PR * 1.3)); moduleGroup.add(mkSphere(b, PR * 1.1));
      const c = new THREE.Vector3(dx, PB_H + RACK_H * 0.9, rack.userData.finalZ - 0.2);
      moduleGroup.add(mkPipe(b, c, PR * 0.65)); moduleGroup.add(mkSphere(c, PR));
      pipeCurves.push({ curve: new THREE.LineCurve3(a, b), speed: 0.26, pulses: 2, delay: i * 0.1 });
    });

    interface PulseData { mesh: THREE.Mesh; mat: THREE.MeshBasicMaterial; curve: THREE.LineCurve3; phase: number; speed: number; }
    const allPulses: PulseData[] = [];
    pipeCurves.forEach(pc => {
      for (let p = 0; p < pc.pulses; p++) {
        const pulseMat = new THREE.MeshBasicMaterial({ color: COL.yellowBright, transparent: true, opacity: 0, blending: THREE.AdditiveBlending });
        const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), pulseMat);
        moduleGroup.add(pulse);
        allPulses.push({ mesh: pulse, mat: pulseMat, curve: pc.curve, phase: (p / pc.pulses + (pc.delay ?? 0)) % 1, speed: pc.speed });
      }
    });

    // ===== UPS cabinets =====
    const makeUPS = (x: number, z: number, w = 0.7, depth = 0.9) => {
      const cab = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(w, BH * 0.75, depth), new THREE.MeshStandardMaterial({ color: 0x101012, metalness: 0.5, roughness: 0.4 }));
      body.position.y = (BH * 0.75) / 2; cab.add(body);
      const le = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, BH * 0.75, depth)), makeEdgeMat(0.4));
      le.position.y = (BH * 0.75) / 2; cab.add(le);
      const screen = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.14, 0.02), makeAccentMat(2.2));
      screen.position.set(0, BH * 0.55, depth / 2 + 0.012); cab.add(screen);
      for (let k = 0; k < 3; k++) {
        const led = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.015), makeAccentMat(1.8));
        led.position.set(-0.08 + k * 0.08, BH * 0.4, depth / 2 + 0.012); cab.add(led);
      }
      cab.position.set(x, PB_H + 0.05, z); moduleGroup.add(cab);
    };
    makeUPS(BW / 2 - 1.4, 0.1); makeUPS(BW / 2 - 0.7, 0.1, 0.6, 0.9);

    // Door vestibule
    const extW = 1.2, extD = 1.8;
    [[BW / 2 + extW / 2, BH, -extD / 2 + wt / 2, extW, wt], [BW / 2 + extW - wt / 2, BH, 0, wt, extD], [BW / 2 + extW / 2, BH, extD / 2 - wt / 2, extW, wt]].forEach(([x, h, z, w, d]) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w as number, h as number, d as number), matBodyDark);
      m.position.set(x as number, PB_H + (h as number) / 2, z as number); moduleGroup.add(m);
      addEdgeOutline(moduleGroup, new THREE.BoxGeometry(w as number, h as number, d as number), new THREE.Vector3(x as number, PB_H + (h as number) / 2, z as number), 0.4);
    });
    const extRoof = new THREE.Mesh(new THREE.BoxGeometry(extW + wt, 0.10, extD), matBodyDarker);
    extRoof.position.set(BW / 2 + extW / 2, PB_H + BH + 0.05, 0); moduleGroup.add(extRoof);
    addEdgeOutline(moduleGroup, new THREE.BoxGeometry(extW + wt, 0.10, extD), new THREE.Vector3(BW / 2 + extW / 2, PB_H + BH + 0.05, 0), 0.4);

    const dX = BW / 2 + extW - wt / 2 + 0.025, dY = PB_H + BH * 0.45, dH = BH * 0.78, dWidth = 0.7;
    const mkFrame = (w: number, h: number, d: number, x: number, y: number, z: number) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), makeAccentMat(0.7));
      m.position.set(x, y, z); moduleGroup.add(m);
    };
    mkFrame(0.03, 0.04, dWidth + 0.08, dX + 0.005, dY + dH / 2 + 0.02, 0);
    mkFrame(0.03, 0.04, dWidth + 0.08, dX + 0.005, dY - dH / 2 - 0.02, 0);
    mkFrame(0.03, dH + 0.08, 0.04, dX + 0.005, dY, -dWidth / 2 - 0.02);
    mkFrame(0.03, dH + 0.08, 0.04, dX + 0.005, dY, dWidth / 2 + 0.02);
    const doorPanel = new THREE.Mesh(new THREE.BoxGeometry(0.04, dH, dWidth), new THREE.MeshStandardMaterial({ color: 0x0e0e10, metalness: 0.5, roughness: 0.4 }));
    doorPanel.position.set(dX, dY, 0); moduleGroup.add(doorPanel);
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 0.18), makeAccentMat(1.5));
    handle.position.set(dX + 0.04, dY - dH * 0.05, dWidth / 2 - 0.18); moduleGroup.add(handle);
    const keypad = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.12, 0.1), makeAccentMat(2.2));
    keypad.position.set(dX + 0.026, dY + dH * 0.1, dWidth / 2 + 0.15); moduleGroup.add(keypad);

    // Floor grid + dots
    const gridHelper = new THREE.GridHelper(24, 24, 0x1a1a14, 0x121210);
    gridHelper.position.y = 0.001;
    (gridHelper.material as THREE.Material).transparent = true;
    (gridHelper.material as THREE.Material).opacity = 0.35;
    scene.add(gridHelper);

    const dotGroup = new THREE.Group();
    for (let x = -12; x <= 12; x += 2) {
      for (let z = -12; z <= 12; z += 2) {
        if (Math.abs(x) < BW * 0.6 && Math.abs(z) < BD * 0.7) continue;
        const dist = Math.hypot(x, z);
        if (dist > 12) continue;
        const fade = 1 - Math.min(1, dist / 12);
        const dot = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), new THREE.MeshStandardMaterial({ color: COL.yellow, emissive: COL.yellow, emissiveIntensity: 0.6 * fade, transparent: true, opacity: 0.6 * fade }));
        dot.position.set(x, 0.03, z); dotGroup.add(dot);
      }
    }
    scene.add(dotGroup);

    const groundGlow = new THREE.Mesh(new THREE.PlaneGeometry(BW * 2.5, BD * 3), new THREE.MeshBasicMaterial({ color: COL.yellow, transparent: true, opacity: 0.03, blending: THREE.AdditiveBlending }));
    groundGlow.rotation.x = -Math.PI / 2; groundGlow.position.y = 0.005; scene.add(groundGlow);

    // ===== Entrance animation =====
    moduleGroup.scale.set(0.001, 0.001, 0.001);
    const ENTRANCE_START = performance.now() + 200;
    let wallOpenTarget = 0, wallOpenCurrent = 0, hiddenRacksRevealed = false;

    // ===== Controls =====
    let azimuth = Math.PI / 4, elevation = 0.1;
    let targetAzimuth = azimuth, targetElevation = elevation;
    let isDragging = false, dragMoved = false;
    let prevX = 0, prevY = 0, downX = 0, downY = 0;

    const canvas = renderer.domElement;
    const raycaster = new THREE.Raycaster();
    const mouseVec = new THREE.Vector2();

    const onMouseDown = (e: MouseEvent) => { isDragging = true; dragMoved = false; prevX = downX = e.clientX; prevY = downY = e.clientY; };
    const onWindowMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX, dy = e.clientY - prevY;
      if (Math.abs(e.clientX - downX) > 3 || Math.abs(e.clientY - downY) > 3) dragMoved = true;
      targetAzimuth -= dx * 0.006;
      targetElevation = Math.max(-0.1, Math.min(0.4, targetElevation - dy * 0.003));
      prevX = e.clientX; prevY = e.clientY;
    };
    const onWindowMouseUp = () => { isDragging = false; };
    const onTouchStart = (e: TouchEvent) => { if (e.touches.length !== 1) return; isDragging = true; dragMoved = false; prevX = downX = e.touches[0].clientX; prevY = downY = e.touches[0].clientY; };
    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevX, dy = e.touches[0].clientY - prevY;
      if (Math.abs(e.touches[0].clientX - downX) > 3) dragMoved = true;
      targetAzimuth -= dx * 0.006;
      targetElevation = Math.max(-0.1, Math.min(0.4, targetElevation - dy * 0.003));
      prevX = e.touches[0].clientX; prevY = e.touches[0].clientY;
    };
    const onTouchEnd = () => { isDragging = false; };
    const onMouseMoveRay = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    const onClick = (e: MouseEvent) => {
      if (dragMoved) return;
      const rect = canvas.getBoundingClientRect();
      mouseVec.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseVec.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouseVec, camera);
      if (raycaster.intersectObjects(dgxxLogoGroup.userData.meshes).length > 0) {
        wallOpenTarget = wallOpenTarget > 0.5 ? 0 : 1;
      }
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onWindowMouseMove);
    window.addEventListener('mouseup', onWindowMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    canvas.addEventListener('touchmove', onTouchMove, { passive: true });
    canvas.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('mousemove', onMouseMoveRay);
    canvas.addEventListener('click', onClick);

    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (!width || !height) continue;
        W = width; H = height;
        camera.aspect = W / H;
        camera.updateProjectionMatrix();
        renderer.setSize(W, H);
      }
    });
    resizeObserver.observe(container);

    // ===== Animation loop =====
    const clockStart = performance.now();
    let lastFrameTime = performance.now();
    let frameId: number;
    let hoveredRackIndex = -1;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const now = performance.now();
      const t = (now - clockStart) / 1000;
      const dt = (now - lastFrameTime) / 1000;
      lastFrameTime = now;

      azimuth += (targetAzimuth - azimuth) * 0.08;
      elevation += (targetElevation - elevation) * 0.08;
      moduleGroup.rotation.y = azimuth - Math.PI / 4;
      moduleGroup.rotation.x = elevation * 0.3;

      if (now > ENTRANCE_START) {
        const p = Math.min(1, (now - ENTRANCE_START) / 1200);
        const e = 1 - Math.pow(1 - p, 3);
        moduleGroup.scale.set(e, e, e);
      }

      fans.forEach(fan => { fan.rotation.y += fan.userData.speed; });

      wallOpenCurrent += (wallOpenTarget - wallOpenCurrent) * 0.06;
      openableWall.rotation.x = -wallOpenCurrent * Math.PI * 0.62;

      if (!hiddenRacksRevealed && wallOpenCurrent > 0.3) {
        hiddenRacksRevealed = true;
        hiddenRacks.forEach((r, i) => { r.visible = true; r.userData.revealStartTime = now + i * 180; });
      }
      if (hiddenRacksRevealed && wallOpenCurrent < 0.15) {
        hiddenRacksRevealed = false;
        hiddenRacks.forEach(r => { r.visible = false; r.userData.revealStartTime = null; r.userData.slideOutProgress = 0; r.scale.set(0.001, 0.001, 0.001); r.userData.baseZ = r.userData.hiddenStartZ; });
      }
      hiddenRacks.forEach(rack => {
        if (!rack.visible || !rack.userData.revealStartTime || now < rack.userData.revealStartTime) return;
        const p = Math.min(1, (now - rack.userData.revealStartTime) / 900);
        const e = 1 - Math.pow(1 - p, 3);
        rack.userData.baseZ = rack.userData.hiddenStartZ + (rack.userData.finalZ - rack.userData.hiddenStartZ) * e;
        rack.scale.set(0.001 + 0.999 * e, 0.001 + 0.999 * e, 0.001 + 0.999 * e);
      });

      // LED scan animation
      racks.forEach((rack, ri) => {
        rack.userData.hoverWavePhase += dt * 4.5;
        const refTime = rack.userData.revealStartTime;
        if (!refTime || now < refTime) {
          (rack.userData.ledData as LedData[]).forEach(({ mat }) => { mat.emissiveIntensity = 0; });
          return;
        }
        const elapsed = now - refTime;
        const l1 = (t * 2.0 + ri * 0.5) % (LED_ROWS + 3) - 1;
        const l2 = (t * 3.2 + ri * 1.3 + 4) % (LED_ROWS + 3) - 1;
        (rack.userData.ledData as LedData[]).forEach(({ mat, row, col }) => {
          if (elapsed < row * 50) { mat.emissiveIntensity = 0; return; }
          const fadeIn = Math.min(1, (elapsed - row * 50) / 250);
          const g1 = Math.exp(-Math.pow(row - l1, 2) * 0.45) * 2.8;
          const g2 = Math.exp(-Math.pow(row - l2, 2) * 0.7) * 1.5;
          const seed = row * 7.13 + col * 11.7 + ri * 2.71;
          const act = (0.5 + 0.5 * Math.sin(t * 7.5 + seed)) * (0.5 + 0.5 * Math.sin(t * 11.2 + seed * 1.4));
          const colChar = 0.4 + 0.6 * Math.abs(Math.sin(col * 1.7 + ri * 0.9));
          const idle = fadeIn * (0.18 + act * colChar * 0.7 + g1 + g2);
          const hp = rack.userData.hoverProgress;
          if (hp > 0.01) {
            const wp1 = rack.userData.hoverWavePhase % (LED_ROWS + 2);
            const wp2 = (rack.userData.hoverWavePhase + LED_ROWS * 0.5) % (LED_ROWS + 2);
            const w1 = Math.exp(-Math.pow(row - wp1, 2) * 0.3) * 4.5;
            const w2 = Math.exp(-Math.pow(row - wp2, 2) * 0.3) * 3.0;
            mat.emissiveIntensity = idle * (1 - hp * 0.6) + (Math.max(w1, w2) + 0.8) * hp;
          } else {
            mat.emissiveIntensity = idle;
          }
        });
      });

      // Pipe pulses
      allPulses.forEach(pulse => {
        pulse.phase = (pulse.phase + pulse.speed * dt) % 1;
        pulse.mesh.position.copy(pulse.curve.getPoint(pulse.phase));
        const fade = Math.min(pulse.phase / 0.08, (1 - pulse.phase) / 0.08, 1);
        pulse.mat.opacity = 0.95 * Math.max(0, fade);
        const s = 0.85 + 0.25 * Math.sin(t * 4 + pulse.phase * 6);
        pulse.mesh.scale.set(s, s, s);
      });

      // Hover detection
      raycaster.setFromCamera(mouseVec, camera);
      const logoHit = raycaster.intersectObjects(dgxxLogoGroup.userData.meshes).length > 0;
      dgxxLogoGroup.userData.material.emissiveIntensity = logoHit ? 0.85 : 0.4;

      const rackBodies = racks.filter(r => r.visible).map(r => r.children[0] as THREE.Mesh);
      const rackHit = raycaster.intersectObjects(rackBodies);
      hoveredRackIndex = (!logoHit && rackHit.length > 0) ? rackHit[0].object.userData.rackIndex : -1;

      canvas.style.cursor = logoHit || hoveredRackIndex >= 0 ? 'pointer' : isDragging ? 'grabbing' : 'grab';

      racks.forEach(rack => {
        const hovered = rack.userData.rackIndex === hoveredRackIndex && rack.visible;
        rack.userData.targetForward = hovered ? 0.55 : 0;
        rack.userData.currentForward += (rack.userData.targetForward - rack.userData.currentForward) * 0.12;
        rack.position.z = rack.userData.baseZ + rack.userData.currentForward;
        rack.userData.hoverProgress += ((hovered ? 1 : 0) - rack.userData.hoverProgress) * 0.12;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onWindowMouseMove);
      window.removeEventListener('mouseup', onWindowMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('mousemove', onMouseMoveRay);
      canvas.removeEventListener('click', onClick);
      resizeObserver.disconnect();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="w-full h-full relative select-none overflow-hidden">
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
};

export default Arms3D;
