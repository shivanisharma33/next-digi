"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface USDataCenter3DProps {
  className?: string;
}

const USDataCenter3D: React.FC<USDataCenter3DProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const isMobile = window.innerWidth < 768;
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.cursor = 'grab';
    container.appendChild(canvas);

    /* ========== RENDERER ========== */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();

    /* ========== ISOMETRIC CAMERA ========== */
    let aspect = container.clientWidth / container.clientHeight;
    const frustum = 11;
    const camera = new THREE.OrthographicCamera(
      -frustum * aspect, frustum * aspect, frustum, -frustum, -100, 100
    );
    camera.position.set(9, 11, 22);
    camera.lookAt(0.5, 4, 0);

    /* ========== LIGHTING ========== */
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const keyLight = new THREE.DirectionalLight(0xfff8e8, 1.0);
    keyLight.position.set(14, 22, 10);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.left = -30;
    keyLight.shadow.camera.right = 30;
    keyLight.shadow.camera.top = 30;
    keyLight.shadow.camera.bottom = -30;
    keyLight.shadow.bias = -0.0003;
    keyLight.shadow.radius = 4;
    scene.add(keyLight);

    const yellowAccent = new THREE.PointLight(0xFFD60A, 2.5, 40);
    yellowAccent.position.set(0, 10, 0);
    scene.add(yellowAccent);

    const rimLight = new THREE.DirectionalLight(0xFFD60A, 0.5);
    rimLight.position.set(-12, 8, -12);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0x4a5a70, 0.3);
    fillLight.position.set(-8, 4, 8);
    scene.add(fillLight);

    const powerCoreLight1 = new THREE.PointLight(0xFFD60A, 3.0, 16);
    powerCoreLight1.position.set(0, -2, -1);
    scene.add(powerCoreLight1);

    const powerCoreLight2 = new THREE.PointLight(0xFFD60A, 2.0, 12);
    powerCoreLight2.position.set(-12, -1.5, 2.8);
    scene.add(powerCoreLight2);

    const powerCoreLight3 = new THREE.PointLight(0xFFD60A, 1.8, 10);
    powerCoreLight3.position.set(13, -1.5, -1);
    scene.add(powerCoreLight3);

    /* ========== MATERIALS ========== */
    const YELLOW = 0xFFD60A;
    const YELLOW_BRIGHT = 0xFFE45C;

    const matBlackTop = new THREE.MeshStandardMaterial({ color: 0x1c1c1e, roughness: 0.45, metalness: 0.7 });
    const matDarkGray = new THREE.MeshStandardMaterial({ color: 0x222226, roughness: 0.5, metalness: 0.65 });
    const matRackBody = new THREE.MeshStandardMaterial({ color: 0x18181a, roughness: 0.5, metalness: 0.6 });
    const matRackPanel = new THREE.MeshStandardMaterial({ color: 0x050507, roughness: 0.75, metalness: 0.4 });
    const matYellow = new THREE.MeshStandardMaterial({ color: YELLOW, emissive: YELLOW, emissiveIntensity: 0.9, roughness: 0.3, metalness: 0.7 });
    const matYellowDim = new THREE.MeshStandardMaterial({ color: YELLOW, emissive: YELLOW, emissiveIntensity: 0.3, roughness: 0.4, metalness: 0.6 });
    const matPipe = new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.4, metalness: 0.7 });
    const matCard = new THREE.MeshStandardMaterial({ color: 0x262628, roughness: 0.35, metalness: 0.65, transparent: true, opacity: 0.94 });
    const matBlack = new THREE.MeshStandardMaterial({ color: 0x141416, roughness: 0.55, metalness: 0.6 });

    function addEdges(mesh: THREE.Mesh, color = YELLOW, opacity = 0.5) {
      const edges = new THREE.EdgesGeometry(mesh.geometry);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color, transparent: true, opacity }));
      mesh.add(line);
      return line;
    }

    const root = new THREE.Group();
    scene.add(root);

    /* ========== POWER CORE ========== */
    interface PowerCoreUserData {
      disc: THREE.Mesh;
      halo: THREE.Mesh;
      ring: THREE.Mesh;
      ring2: THREE.Mesh;
      scale: number;
      intensity: number;
      phase: number;
    }

    function makePowerCore(scale = 1, intensity = 1) {
      const group = new THREE.Group();

      const discGeo = new THREE.CircleGeometry(1.0 * scale, 32);
      const discMat = new THREE.MeshBasicMaterial({
        color: YELLOW, transparent: true, opacity: 0.85 * intensity,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const disc = new THREE.Mesh(discGeo, discMat);
      disc.rotation.x = -Math.PI / 2;
      group.add(disc);

      const haloGeo = new THREE.CircleGeometry(1.8 * scale, 32);
      const haloMat = new THREE.MeshBasicMaterial({
        color: YELLOW, transparent: true, opacity: 0.3 * intensity,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.rotation.x = -Math.PI / 2;
      halo.position.y = -0.01;
      group.add(halo);

      const ringGeo = new THREE.RingGeometry(0.85 * scale, 0.92 * scale, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: YELLOW_BRIGHT, transparent: true, opacity: 0.95,
        blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.005;
      group.add(ring);

      const ring2Geo = new THREE.RingGeometry(0.55 * scale, 0.6 * scale, 32);
      const ring2 = new THREE.Mesh(ring2Geo, ringMat.clone());
      ring2.rotation.x = -Math.PI / 2;
      ring2.position.y = 0.008;
      group.add(ring2);

      (group.userData as PowerCoreUserData) = {
        disc, halo, ring, ring2, scale, intensity, phase: 0,
      };
      return group;
    }

    /* ========== SERVER RACK ========== */
    interface RackUserData {
      leds: THREE.Mesh[];
      displayLight: THREE.Mesh;
    }

    function makeServerRack() {
      const group = new THREE.Group();

      const body = new THREE.Mesh(new THREE.BoxGeometry(1.7, 6.0, 2.0), matRackBody);
      body.position.y = 3.4;
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);
      addEdges(body, YELLOW, 0.55);

      const cap = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.25, 2.1), matBlackTop);
      cap.position.y = 6.53;
      cap.castShadow = true;
      group.add(cap);
      addEdges(cap, YELLOW, 0.5);

      const goldStrip = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.06, 2.12), matYellowDim);
      goldStrip.position.y = 6.68;
      group.add(goldStrip);

      const leds: THREE.Mesh[] = [];
      for (let i = 0; i < 11; i++) {
        const slot = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.42, 0.1), matRackPanel);
        slot.position.set(0, 0.88 + i * 0.5, 1.01);
        group.add(slot);

        const led = new THREE.Mesh(
          new THREE.SphereGeometry(0.055, 12, 12),
          new THREE.MeshStandardMaterial({ color: YELLOW, emissive: YELLOW, emissiveIntensity: 0.8 })
        );
        led.position.set(0.6, 0.88 + i * 0.5, 1.08);
        led.userData.phase = Math.random() * Math.PI * 2;
        led.userData.speed = 0.8 + Math.random() * 2;
        leds.push(led);
        group.add(led);

        const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.03, 0.05), matYellowDim);
        stripe.position.set(-0.3, 0.88 + i * 0.5, 1.08);
        group.add(stripe);

        const accentDot = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), matYellowDim);
        accentDot.position.set(-0.62, 0.88 + i * 0.5, 1.08);
        group.add(accentDot);
      }

      const pdu = new THREE.Mesh(new THREE.BoxGeometry(0.1, 5.5, 0.08), matRackPanel);
      pdu.position.set(-0.92, 3.58, 0.7);
      group.add(pdu);
      for (let i = 0; i < 9; i++) {
        const out = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), matYellowDim);
        out.position.set(-0.92, 1.08 + i * 0.6, 0.76);
        group.add(out);
      }

      const display = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.18, 0.06), matRackPanel);
      display.position.set(0, 6.28, 1.02);
      group.add(display);
      const displayLight = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.06, 0.04), matYellow);
      displayLight.position.set(0, 6.28, 1.05);
      group.add(displayLight);

      (group.userData as RackUserData) = { leds, displayLight };
      return group;
    }

    /* ========== TWO ROWS OF RACKS ========== */
    const rackRowA = new THREE.Group();
    const rackRowB = new THREE.Group();
    const rackSpacing = 3.4;
    const allRacks: THREE.Group[] = [];
    const allPowerCores: THREE.Group[] = [];

    for (let i = 0; i < 3; i++) {
      const xPos = -3.4 + i * rackSpacing;

      const r1 = makeServerRack();
      r1.position.set(xPos, 0, -3.5);
      rackRowA.add(r1);
      allRacks.push(r1);

      const pc1 = makePowerCore(1.1, 1);
      pc1.position.set(xPos, 0.02, -3.5);
      (pc1.userData as PowerCoreUserData).phase = i * 0.6;
      root.add(pc1);
      allPowerCores.push(pc1);

      const r2 = makeServerRack();
      r2.position.set(xPos, 0, 2.0);
      rackRowB.add(r2);
      allRacks.push(r2);

      const pc2 = makePowerCore(1.1, 1);
      pc2.position.set(xPos, 0.02, 2.0);
      (pc2.userData as PowerCoreUserData).phase = i * 0.6 + 0.3;
      root.add(pc2);
      allPowerCores.push(pc2);
    }
    root.add(rackRowA);
    root.add(rackRowB);

    /* ========== CRAC ========== */
    const cracGroup = new THREE.Group();
    cracGroup.position.set(13, 0, -1);
    root.add(cracGroup);

    const cracPC = makePowerCore(1.4, 0.85);
    cracPC.position.set(0, 0.02, 0);
    (cracPC.userData as PowerCoreUserData).phase = 1.2;
    cracGroup.add(cracPC);
    allPowerCores.push(cracPC);

    const cracBase = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.3, 3.0), matDarkGray);
    cracBase.position.y = 0.15;
    cracBase.castShadow = true;
    cracBase.receiveShadow = true;
    cracGroup.add(cracBase);
    addEdges(cracBase, YELLOW, 0.45);

    const cracBody = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.2, 4.0, 32), matBlack);
    cracBody.position.y = 2.3;
    cracBody.castShadow = true;
    cracBody.receiveShadow = true;
    cracGroup.add(cracBody);
    addEdges(cracBody, YELLOW, 0.5);

    for (let i = 0; i < 6; i++) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(1.12, 0.045, 8, 32), matYellowDim);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.7 + i * 0.55;
      cracGroup.add(ring);
    }

    const cracTop = new THREE.Mesh(new THREE.CylinderGeometry(1.15, 1.1, 0.45, 32), matBlackTop);
    cracTop.position.y = 4.55;
    cracTop.castShadow = true;
    cracGroup.add(cracTop);

    const fanHub = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.14, 16), matRackPanel);
    fanHub.position.y = 4.85;
    cracGroup.add(fanHub);

    const fanGroup = new THREE.Group();
    fanGroup.position.y = 4.85;
    cracGroup.add(fanGroup);

    for (let i = 0; i < 4; i++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.045, 0.2), matDarkGray);
      blade.rotation.y = (i * Math.PI) / 2;
      blade.position.x = Math.cos((i * Math.PI) / 2) * 0.5;
      blade.position.z = Math.sin((i * Math.PI) / 2) * 0.5;
      fanGroup.add(blade);
    }

    const fanRing = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.055, 8, 32), matYellow);
    fanRing.rotation.x = Math.PI / 2;
    fanRing.position.y = 4.85;
    cracGroup.add(fanRing);

    const cracDisplay = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.55, 0.04), matRackPanel);
    cracDisplay.position.set(0, 1.7, 1.12);
    cracGroup.add(cracDisplay);

    const displayLines: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const dl = new THREE.Mesh(new THREE.BoxGeometry(0.55 - i * 0.12, 0.04, 0.05), matYellow);
      dl.position.set(-0.05 + i * 0.03, 1.83 - i * 0.15, 1.15);
      dl.userData.phase = i * 0.4;
      displayLines.push(dl);
      cracGroup.add(dl);
    }

    /* ========== STORAGE ARRAY ========== */
    const storageGroup = new THREE.Group();
    storageGroup.position.set(-12, 0, 2.8);
    root.add(storageGroup);

    const storagePC = makePowerCore(1.6, 0.9);
    storagePC.position.set(0, 0.02, 0);
    (storagePC.userData as PowerCoreUserData).phase = 2.0;
    storageGroup.add(storagePC);
    allPowerCores.push(storagePC);

    const perfBase = new THREE.Mesh(new THREE.BoxGeometry(4.5, 0.4, 4.5), matDarkGray);
    perfBase.position.y = 0.2;
    perfBase.castShadow = true;
    perfBase.receiveShadow = true;
    storageGroup.add(perfBase);
    addEdges(perfBase, YELLOW, 0.4);

    for (let x = -1.8; x <= 1.8; x += 0.4) {
      for (let z = -1.8; z <= 1.8; z += 0.4) {
        const dot = new THREE.Mesh(
          new THREE.CircleGeometry(0.06, 8),
          new THREE.MeshBasicMaterial({ color: YELLOW, transparent: true, opacity: 0.55 })
        );
        dot.rotation.x = -Math.PI / 2;
        dot.position.set(x, 0.41, z);
        storageGroup.add(dot);
      }
    }

    const waveGroup = new THREE.Group();
    waveGroup.position.y = 0.75;
    const waveLines: THREE.Line[] = [];
    for (let i = 0; i < 6; i++) {
      const pts: THREE.Vector3[] = [];
      for (let j = 0; j <= 20; j++) {
        pts.push(new THREE.Vector3(-1.5 + (j / 20) * 3, 0, -1.2 + i * 0.5));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: YELLOW, transparent: true, opacity: 0.75 }));
      line.userData.phase = i * 0.4;
      line.userData.basePts = pts.map((p) => p.clone());
      waveLines.push(line);
      waveGroup.add(line);
    }
    storageGroup.add(waveGroup);

    const topPlat = new THREE.Mesh(new THREE.BoxGeometry(4, 0.45, 4), matBlackTop);
    topPlat.position.y = 1.25;
    topPlat.castShadow = true;
    topPlat.receiveShadow = true;
    storageGroup.add(topPlat);
    addEdges(topPlat, YELLOW, 0.45);

    const cards: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const card = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.4, 0.12), matCard);
      card.position.set(-0.45 + i * 0.3, 3.0, -0.45 + i * 0.3);
      card.castShadow = true;
      card.userData.basePos = card.position.clone();
      card.userData.phase = i * (Math.PI / 2);
      cards.push(card);
      storageGroup.add(card);
      addEdges(card, YELLOW, 0.65);
    }

    const selLines = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(3.4, 3.4, 1.6)),
      new THREE.LineDashedMaterial({ color: YELLOW, dashSize: 0.18, gapSize: 0.14, transparent: true, opacity: 0.75 })
    );
    selLines.computeLineDistances();
    selLines.position.set(0, 3.0, 0);
    storageGroup.add(selLines);

    const dotMat = new THREE.MeshStandardMaterial({ color: YELLOW, emissive: YELLOW, emissiveIntensity: 1 });
    [
      [-1.7, 1.7, 0.8], [1.7, 1.7, 0.8], [-1.7, -1.7, 0.8], [1.7, -1.7, 0.8],
      [-1.7, 1.7, -0.8], [1.7, 1.7, -0.8], [-1.7, -1.7, -0.8], [1.7, -1.7, -0.8],
    ].forEach((p) => {
      const d = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 12), dotMat);
      d.position.set(p[0], 3.0 + p[1], p[2]);
      storageGroup.add(d);
    });

    /* ========== DASHBOARD ========== */
    const dashGroup = new THREE.Group();
    dashGroup.position.set(1, 0, 8.5);
    root.add(dashGroup);

    const dashPC = makePowerCore(1.3, 0.7);
    dashPC.position.set(0, 0.02, 0);
    (dashPC.userData as PowerCoreUserData).phase = 3.0;
    dashGroup.add(dashPC);
    allPowerCores.push(dashPC);

    const dashBase = new THREE.Mesh(new THREE.BoxGeometry(4, 0.3, 2.5), matDarkGray);
    dashBase.position.y = 0.15;
    dashBase.castShadow = true;
    dashBase.receiveShadow = true;
    dashGroup.add(dashBase);
    addEdges(dashBase, YELLOW, 0.4);

    const dashPole = new THREE.Mesh(new THREE.BoxGeometry(0.15, 1.5, 0.15), matRackPanel);
    dashPole.position.y = 1.0;
    dashGroup.add(dashPole);

    const dashPanel = new THREE.Group();
    dashPanel.position.y = 2.0;
    dashPanel.rotation.x = -Math.PI / 8;
    dashGroup.add(dashPanel);

    const dashScreen = new THREE.Mesh(
      new THREE.BoxGeometry(3.5, 2.0, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x18181a, roughness: 0.3, metalness: 0.5, emissive: YELLOW, emissiveIntensity: 0.08 })
    );
    dashScreen.castShadow = true;
    dashPanel.add(dashScreen);
    addEdges(dashScreen, YELLOW, 0.6);

    const graphPts: THREE.Vector3[] = [];
    const graphSegs = 30;
    for (let i = 0; i <= graphSegs; i++) {
      graphPts.push(new THREE.Vector3(-1.5 + (i / graphSegs) * 3, 0, 0.07));
    }
    const graphGeo = new THREE.BufferGeometry().setFromPoints(graphPts);
    const graphLine = new THREE.Line(graphGeo, new THREE.LineBasicMaterial({ color: YELLOW }));
    dashPanel.add(graphLine);
    graphLine.userData.basePts = graphPts.map((p) => p.clone());

    const dashBars: THREE.Mesh[] = [];
    for (let i = 0; i < 6; i++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.5, 0.05), matYellow);
      bar.position.set(-1.3 + i * 0.4, -0.5, 0.08);
      bar.userData.phase = i * 0.5;
      dashBars.push(bar);
      dashPanel.add(bar);
    }

    const dashLabel = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.25, 0.13), matYellowDim);
    dashLabel.position.y = 0.85;
    dashPanel.add(dashLabel);

    /* ========== CABLE TRAY ========== */
    const trayGroup = new THREE.Group();
    trayGroup.position.y = 7.4;
    root.add(trayGroup);

    const trayBeam = new THREE.Mesh(new THREE.BoxGeometry(10, 0.18, 0.5), matDarkGray);
    trayBeam.position.set(0, 0, -0.75);
    trayBeam.castShadow = true;
    trayGroup.add(trayBeam);
    addEdges(trayBeam, YELLOW, 0.5);

    for (let i = 0; i < 3; i++) {
      const xPos = -3.4 + i * rackSpacing;
      const drop = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.7, 8), matPipe);
      drop.position.set(xPos, -0.4, -3.5);
      drop.castShadow = true;
      trayGroup.add(drop);

      const drop2 = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.7, 8), matPipe);
      drop2.position.set(xPos, -0.4, 2.0);
      drop2.castShadow = true;
      trayGroup.add(drop2);

      const hanger = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.4, 8), matRackPanel);
      hanger.position.set(xPos, 0.25, -0.75);
      trayGroup.add(hanger);
    }

    /* ========== PIPELINES ========== */
    const PIPE_Y = 0.5;
    const PIPE_RADIUS = 0.08;

    const pipelineRoutes = [
      { waypoints: [
        new THREE.Vector3(-12, PIPE_Y, 0.5),
        new THREE.Vector3(-6, PIPE_Y, 0.5),
        new THREE.Vector3(-6, PIPE_Y, -2),
        new THREE.Vector3(-3.4, PIPE_Y, -2),
      ]},
      { waypoints: [
        new THREE.Vector3(3.4, PIPE_Y, 0),
        new THREE.Vector3(8.5, PIPE_Y, 0),
        new THREE.Vector3(8.5, PIPE_Y, -1),
        new THREE.Vector3(11.5, PIPE_Y, -1),
      ]},
      { waypoints: [
        new THREE.Vector3(1, PIPE_Y, 7),
        new THREE.Vector3(1, PIPE_Y, 3.5),
        new THREE.Vector3(0.3, PIPE_Y, 3.5),
      ]},
      { waypoints: [
        new THREE.Vector3(-9, PIPE_Y, 2.8),
        new THREE.Vector3(-9, PIPE_Y, 8.5),
        new THREE.Vector3(-1, PIPE_Y, 8.5),
      ]},
      { waypoints: [
        new THREE.Vector3(13, PIPE_Y, 1),
        new THREE.Vector3(13, PIPE_Y, 8.5),
        new THREE.Vector3(3, PIPE_Y, 8.5),
      ]},
    ];

    interface Pipeline {
      group: THREE.Group;
      curvePoints: THREE.Vector3[];
      pulses: THREE.Mesh[];
    }

    const pipelines: Pipeline[] = pipelineRoutes.map((route) => {
      const group = new THREE.Group();
      root.add(group);

      const totalCurve: THREE.Vector3[] = [];
      for (let i = 0; i < route.waypoints.length - 1; i++) {
        const a = route.waypoints[i];
        const b = route.waypoints[i + 1];
        if (a.distanceTo(b) < 0.01) continue;

        const dir = new THREE.Vector3().subVectors(b, a);
        const length = dir.length();

        const pipe = new THREE.Mesh(
          new THREE.CylinderGeometry(PIPE_RADIUS, PIPE_RADIUS, length, 16),
          matPipe
        );
        pipe.castShadow = true;
        pipe.position.copy(a).add(dir.clone().multiplyScalar(0.5));
        pipe.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
        group.add(pipe);

        const glowPipe = new THREE.Mesh(
          new THREE.CylinderGeometry(PIPE_RADIUS * 1.6, PIPE_RADIUS * 1.6, length, 16),
          new THREE.MeshBasicMaterial({ color: YELLOW, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false })
        );
        glowPipe.position.copy(pipe.position);
        glowPipe.quaternion.copy(pipe.quaternion);
        group.add(glowPipe);

        const segSamples = Math.max(2, Math.floor(length * 6));
        for (let s = 0; s < segSamples; s++) {
          totalCurve.push(new THREE.Vector3().lerpVectors(a, b, s / segSamples));
        }
      }
      totalCurve.push(route.waypoints[route.waypoints.length - 1]);

      route.waypoints.forEach((wp, idx) => {
        if (idx === 0 || idx === route.waypoints.length - 1) {
          const conn = new THREE.Mesh(
            new THREE.SphereGeometry(0.14, 16, 16),
            new THREE.MeshStandardMaterial({ color: YELLOW, emissive: YELLOW, emissiveIntensity: 0.9, roughness: 0.3, metalness: 0.8 })
          );
          conn.position.copy(wp);
          conn.castShadow = true;
          group.add(conn);

          const halo = new THREE.Mesh(
            new THREE.SphereGeometry(0.24, 16, 16),
            new THREE.MeshBasicMaterial({ color: YELLOW, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending, depthWrite: false })
          );
          halo.position.copy(wp);
          group.add(halo);
        } else {
          const elbow = new THREE.Mesh(
            new THREE.SphereGeometry(PIPE_RADIUS * 1.4, 12, 12),
            matDarkGray
          );
          elbow.position.copy(wp);
          elbow.castShadow = true;
          group.add(elbow);

          const ring = new THREE.Mesh(
            new THREE.TorusGeometry(PIPE_RADIUS * 1.5, 0.02, 8, 16),
            matYellowDim
          );
          ring.position.copy(wp);
          ring.rotation.x = Math.PI / 2;
          group.add(ring);
        }
      });

      const pulses: THREE.Mesh[] = [];
      for (let i = 0; i < 4; i++) {
        const pulse = new THREE.Mesh(
          new THREE.SphereGeometry(0.08, 16, 16),
          new THREE.MeshBasicMaterial({ color: 0xfffce8, transparent: true, opacity: 1, blending: THREE.AdditiveBlending, depthWrite: false })
        );
        const haloP = new THREE.Mesh(
          new THREE.SphereGeometry(0.16, 16, 16),
          new THREE.MeshBasicMaterial({ color: YELLOW_BRIGHT, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false })
        );
        pulse.add(haloP);
        pulse.userData.t = i / 4;
        pulse.userData.speed = 0.0035 + Math.random() * 0.0015;
        pulses.push(pulse);
        group.add(pulse);
      }

      return { group, curvePoints: totalCurve, pulses };
    });

    function getPointOnCurve(points: THREE.Vector3[], t: number) {
      const idx = t * (points.length - 1);
      const i0 = Math.floor(idx);
      const i1 = Math.min(i0 + 1, points.length - 1);
      return new THREE.Vector3().lerpVectors(points[i0], points[i1], idx - i0);
    }

    /* ========== MOUSE / DRAG ========== */
    let mouseX = 0, mouseY = 0;
    let currentRotY = 0, currentRotX = 0;
    let isDragging = false;
    let dragStartX = 0, dragStartY = 0;
    let dragOffsetY = 0, dragOffsetX = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        dragOffsetY = (e.clientX - dragStartX) * 0.008;
        dragOffsetX = (e.clientY - dragStartY) * 0.004;
        if (isMobile) {
          animate();
        }
      } else {
        const rect = container.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) / rect.width - 0.5;
        mouseY = (e.clientY - rect.top) / rect.height - 0.5;
      }
    };
    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      canvas.style.cursor = 'grabbing';
    };
    const handleMouseUp = () => {
      if (isDragging) {
        currentRotY += dragOffsetY;
        currentRotX += dragOffsetX;
        dragOffsetY = 0;
        dragOffsetX = 0;
        isDragging = false;
        canvas.style.cursor = 'grab';
      }
    };
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    /* ========== RESIZE ========== */
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      aspect = w / h;
      camera.left = -frustum * aspect;
      camera.right = frustum * aspect;
      camera.top = frustum;
      camera.bottom = -frustum;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (isMobile) {
        animate();
      }
    };
    window.addEventListener('resize', handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);
    }

    /* ========== ANIMATION ========== */
    const clock = new THREE.Clock();
    let elapsed = 0;
    let frameId = 0;

    function animate() {
      const dt = clock.getDelta();
      elapsed += dt;
      if (!isMobile) {
        frameId = requestAnimationFrame(animate);
      }

      const targetRotY = mouseX * 0.3 + dragOffsetY + currentRotY;
      const targetRotX = -mouseY * 0.1 + dragOffsetX + currentRotX;
      root.rotation.y += (targetRotY - root.rotation.y) * 0.05;
      root.rotation.x += (targetRotX - root.rotation.x) * 0.05;

      allRacks.forEach((rack) => {
        const ud = rack.userData as RackUserData;
        if (ud.leds) {
          ud.leds.forEach((led) => {
            const mat = led.material as THREE.MeshStandardMaterial;
            mat.emissiveIntensity = 0.3 + Math.abs(Math.sin(elapsed * led.userData.speed + led.userData.phase)) * 1.0;
          });
        }
        if (ud.displayLight) {
          (ud.displayLight.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.6 + Math.sin(elapsed * 2) * 0.4;
        }
      });

      allPowerCores.forEach((pc) => {
        const ud = pc.userData as PowerCoreUserData;
        (ud.disc.material as THREE.MeshBasicMaterial).opacity = (0.65 + Math.sin(elapsed * 1.8 + ud.phase) * 0.25) * ud.intensity;
        (ud.halo.material as THREE.MeshBasicMaterial).opacity = (0.25 + Math.sin(elapsed * 1.8 + ud.phase) * 0.15) * ud.intensity;
        ud.halo.scale.setScalar(1 + Math.sin(elapsed * 1.5 + ud.phase) * 0.15);
        ud.ring.rotation.z = elapsed * 0.5 + ud.phase;
        ud.ring2.rotation.z = -elapsed * 0.7 + ud.phase;
      });

      fanGroup.rotation.y += dt * 4;
      displayLines.forEach((dl) => {
        (dl.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.5 + Math.abs(Math.sin(elapsed * 2 + dl.userData.phase)) * 0.7;
      });

      cards.forEach((card, i) => {
        const base = card.userData.basePos as THREE.Vector3;
        card.position.y = base.y + Math.sin(elapsed * 1.2 + card.userData.phase) * 0.22;
        card.rotation.y = Math.sin(elapsed * 0.4 + i) * 0.12;
      });

      waveLines.forEach((line) => {
        const positions = (line.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
        const basePts = line.userData.basePts as THREE.Vector3[];
        basePts.forEach((_, j) => {
          const t = j / (basePts.length - 1);
          positions[j * 3 + 1] = Math.sin(elapsed * 2 + line.userData.phase + t * Math.PI * 2) * 0.2;
        });
        (line.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      });

      (selLines.material as THREE.LineDashedMaterial).opacity = 0.55 + Math.sin(elapsed * 2) * 0.25;

      const graphPositions = (graphLine.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
      const graphBase = graphLine.userData.basePts as THREE.Vector3[];
      graphBase.forEach((_, j) => {
        const t = j / (graphBase.length - 1);
        graphPositions[j * 3 + 1] = Math.sin(elapsed * 3 + t * Math.PI * 4) * 0.3 +
                                    Math.sin(elapsed * 1.5 + t * Math.PI * 2) * 0.15;
      });
      (graphLine.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;

      dashBars.forEach((bar) => {
        const scl = 0.5 + (0.5 + Math.sin(elapsed * 2 + bar.userData.phase) * 0.5) * 1.2;
        bar.scale.y = scl;
      });

      powerCoreLight1.intensity = 2.5 + Math.sin(elapsed * 1.5) * 1.0;
      powerCoreLight2.intensity = 1.8 + Math.sin(elapsed * 1.5 + 1) * 0.8;
      powerCoreLight3.intensity = 1.6 + Math.sin(elapsed * 1.5 + 2) * 0.7;

      pipelines.forEach((pipeline) => {
        pipeline.pulses.forEach((pulse) => {
          pulse.userData.t += pulse.userData.speed;
          if (pulse.userData.t > 1) pulse.userData.t = 0;
          const pos = getPointOnCurve(pipeline.curvePoints, pulse.userData.t);
          pulse.position.copy(pos);
          const t = pulse.userData.t;
          const fade = t < 0.05 ? t / 0.05 : t > 0.95 ? (1 - t) / 0.05 : 1;
          (pulse.material as THREE.MeshBasicMaterial).opacity = fade;
          ((pulse.children[0] as THREE.Mesh).material as THREE.MeshBasicMaterial).opacity = 0.6 * fade;
        });
      });

      yellowAccent.position.x = Math.cos(elapsed * 0.4) * 10;
      yellowAccent.position.z = Math.sin(elapsed * 0.4) * 10;
      yellowAccent.position.y = 8 + Math.sin(elapsed) * 2;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();

      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).geometry) {
          (obj as THREE.Mesh).geometry.dispose();
        }
        const mat = (obj as THREE.Mesh).material;
        if (mat) {
          if (Array.isArray(mat)) {
            mat.forEach((m) => m.dispose());
          } else {
            mat.dispose();
          }
        }
      });

      renderer.dispose();

      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }
    };
  }, []);

  return (
    <div className={className || "w-full h-full relative group min-h-[360px] bg-black rounded-xl overflow-hidden border border-[#FFD60A]/10 shadow-[0_0_50px_rgba(255,214,10,0.05)]"}>
      <div ref={containerRef} className="w-full h-full absolute inset-0 z-10" />

      <div className="absolute top-3 left-3 right-3 flex justify-between items-center text-[7px] font-mono tracking-widest text-[#FFD60A]/60 pointer-events-none uppercase z-20 select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-1 h-1 bg-[#FFD60A] rounded-full animate-ping" />
          <span>DGXX Â· 147 NODES</span>
        </div>
        <div>TIER IV CERTIFIED</div>
      </div>

      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-[7px] font-mono tracking-widest text-[#FFD60A]/60 pointer-events-none uppercase z-20 select-none">
        <div>PUE: 1.12</div>
        <div>847MW Â· DRAG TO ROTATE</div>
      </div>
    </div>
  );
};

export default USDataCenter3D;
