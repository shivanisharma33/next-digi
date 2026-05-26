import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const InvestorHeroVisual3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let W = container.clientWidth || 800;
    let H = container.clientHeight || 500;

    // --- 1. CORE SETUP ---
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const disposables: { dispose: () => void }[] = [];
    const registerDisposable = <T extends { dispose: () => void }>(obj: T): T => {
      disposables.push(obj);
      return obj;
    };

    // --- 2. LUXURY TECHNICAL LIGHTING ---
    const ambientLight = registerDisposable(new THREE.AmbientLight(0xffffff, 0.35));
    scene.add(ambientLight);

    const keyLight = registerDisposable(new THREE.DirectionalLight(0xffffff, 1.2));
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const fillLight = registerDisposable(new THREE.DirectionalLight(0xffc629, 0.65));
    fillLight.position.set(-5, -3, 3);
    scene.add(fillLight);

    // Color definitions
    const neonYellowColor = 0xffc629;
    const whiteColor = 0xffffff;

    // --- 3. DUAL SYMMETRICAL HELIX BUILDER ---
    const numPoints = 60;
    const rungsCount = Math.floor(numPoints / 3) + 1;
    const shapesCount = 14;

    // Shared geometries for nodes (Clean wireframe outline edge models)
    const boxBaseGeo = registerDisposable(new THREE.BoxGeometry(0.24, 0.24, 0.24));
    const sphereBaseGeo = registerDisposable(new THREE.IcosahedronGeometry(0.14, 1));
    const coneBaseGeo = registerDisposable(new THREE.ConeGeometry(0.14, 0.28, 4));

    const boxEdges = registerDisposable(new THREE.EdgesGeometry(boxBaseGeo));
    const sphereEdges = registerDisposable(new THREE.EdgesGeometry(sphereBaseGeo));
    const coneEdges = registerDisposable(new THREE.EdgesGeometry(coneBaseGeo));

    const railMatWhite = registerDisposable(new THREE.LineBasicMaterial({
      color: whiteColor,
      transparent: true,
      opacity: 0.45,
      linewidth: 1
    }));

    const railMatYellow = registerDisposable(new THREE.LineBasicMaterial({
      color: neonYellowColor,
      transparent: true,
      opacity: 0.3,
      linewidth: 1
    }));

    const rungMat = registerDisposable(new THREE.LineBasicMaterial({
      color: whiteColor,
      transparent: true,
      opacity: 0.22
    }));

    const wireMatWhite = registerDisposable(new THREE.LineBasicMaterial({
      color: whiteColor,
      transparent: true,
      opacity: 0.8,
      linewidth: 1
    }));

    const wireMatYellow = registerDisposable(new THREE.LineBasicMaterial({
      color: neonYellowColor,
      transparent: true,
      opacity: 0.95,
      linewidth: 1.5
    }));

    const solidMatYellow = registerDisposable(new THREE.MeshBasicMaterial({
      color: neonYellowColor,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    }));

    interface HelixInstance {
      railPoints1: THREE.Vector3[];
      railPoints2: THREE.Vector3[];
      railGeo1: THREE.BufferGeometry;
      railGeo2: THREE.BufferGeometry;
      rungsGeo: THREE.BufferGeometry;
      attachedNodes: {
        group: THREE.Group;
        angleSpeed: THREE.Vector3;
        tIndex: number;
      }[];
      update: (timeOffset: number) => void;
    }

    const createHelixInstance = (baseX: number, isLeft: boolean): HelixInstance => {
      const group = new THREE.Group();
      scene.add(group);

      const railPoints1: THREE.Vector3[] = [];
      const railPoints2: THREE.Vector3[] = [];

      const r = 0.38; // offset radius
      const twistFactor = isLeft ? 1.4 : -1.4;
      const swirlFactor = isLeft ? 0.45 : -0.45;
      
      const updateCoordinates = (timeOffset = 0) => {
        railPoints1.length = 0;
        railPoints2.length = 0;

        for (let i = 0; i <= numPoints; i++) {
          const t = i / numPoints;
          const y = 3.6 - t * 7.2; // vertical sweep
          
          const angle = y * twistFactor + timeOffset * swirlFactor;
          
          const curvedX = baseX + Math.sin(y * 0.48) * 0.35 * (isLeft ? 1 : -1);
          const curvedZ = Math.cos(y * 0.3) * 0.2;

          railPoints1.push(
            new THREE.Vector3(
              curvedX - r * Math.cos(angle),
              y,
              curvedZ - r * Math.sin(angle)
            )
          );

          railPoints2.push(
            new THREE.Vector3(
              curvedX + r * Math.cos(angle),
              y,
              curvedZ + r * Math.sin(angle)
            )
          );
        }
      };

      updateCoordinates(0);

      const railGeo1 = registerDisposable(new THREE.BufferGeometry());
      const railGeo2 = registerDisposable(new THREE.BufferGeometry());
      railGeo1.setFromPoints(railPoints1);
      railGeo2.setFromPoints(railPoints2);

      const railLine1 = new THREE.Line(railGeo1, railMatWhite);
      const railLine2 = new THREE.Line(railGeo2, railMatYellow);
      group.add(railLine1);
      group.add(railLine2);

      const rungsGeo = registerDisposable(new THREE.BufferGeometry());
      const rungsPositions = new Float32Array(rungsCount * 2 * 3);
      rungsGeo.setAttribute('position', new THREE.BufferAttribute(rungsPositions, 3));

      const rungsSegments = new THREE.LineSegments(rungsGeo, rungMat);
      group.add(rungsSegments);

      const updateRungsPositions = () => {
        const positions = rungsGeo.attributes.position.array as Float32Array;
        let idx = 0;
        for (let i = 0; i <= numPoints; i += 3) {
          if (i < railPoints1.length && i < railPoints2.length) {
            const p1 = railPoints1[i];
            const p2 = railPoints2[i];

            positions[idx++] = p1.x;
            positions[idx++] = p1.y;
            positions[idx++] = p1.z;

            positions[idx++] = p2.x;
            positions[idx++] = p2.y;
            positions[idx++] = p2.z;
          }
        }
        rungsGeo.attributes.position.needsUpdate = true;
      };

      updateRungsPositions();

      const attachedNodesList: {
        group: THREE.Group;
        angleSpeed: THREE.Vector3;
        tIndex: number;
      }[] = [];

      for (let s = 0; s < shapesCount; s++) {
        const nodeGroup = new THREE.Group();
        const t = 0.08 + (s / (shapesCount - 1)) * 0.84;
        const pointIndex = Math.floor(t * numPoints);
        const shapeType = s % 4;

        if (shapeType === 0) {
          const cube = new THREE.LineSegments(boxEdges, wireMatWhite);
          nodeGroup.add(cube);
        } else if (shapeType === 1) {
          const sphere = new THREE.LineSegments(sphereEdges, wireMatWhite);
          nodeGroup.add(sphere);
        } else if (shapeType === 2) {
          const cone = new THREE.LineSegments(coneEdges, wireMatYellow);
          nodeGroup.add(cone);
          
          const coreMat = registerDisposable(new THREE.MeshBasicMaterial({ color: neonYellowColor }));
          const pointGeo = registerDisposable(new THREE.SphereGeometry(0.024, 6, 6));
          const point = new THREE.Mesh(pointGeo, coreMat);
          point.position.set(0, 0.14, 0);
          nodeGroup.add(point);
        } else {
          const solidCone = new THREE.Mesh(coneBaseGeo, solidMatYellow);
          const wireOutline = new THREE.LineSegments(coneEdges, wireMatWhite);
          nodeGroup.add(solidCone);
          nodeGroup.add(wireOutline);
        }

        const p1 = railPoints1[pointIndex];
        const p2 = railPoints2[pointIndex];
        nodeGroup.position.set((p1.x + p2.x) / 2, p1.y, (p1.z + p2.z) / 2);

        group.add(nodeGroup);
        attachedNodesList.push({
          group: nodeGroup,
          angleSpeed: new THREE.Vector3(
            0.3 + Math.random() * 0.7,
            0.3 + Math.random() * 0.7,
            0.3 + Math.random() * 0.7
          ),
          tIndex: pointIndex,
        });
      }

      return {
        railPoints1,
        railPoints2,
        railGeo1,
        railGeo2,
        rungsGeo,
        attachedNodes: attachedNodesList,
        update: (timeOffset: number) => {
          updateCoordinates(timeOffset);
          railGeo1.setFromPoints(railPoints1);
          railGeo2.setFromPoints(railPoints2);
          railGeo1.attributes.position.needsUpdate = true;
          railGeo2.attributes.position.needsUpdate = true;

          updateRungsPositions();

          attachedNodesList.forEach(node => {
            node.group.rotation.x = timeOffset * node.angleSpeed.x * 0.8;
            node.group.rotation.y = timeOffset * node.angleSpeed.y * 0.8;
            node.group.rotation.z = timeOffset * node.angleSpeed.z * 0.8;

            const nP1 = railPoints1[node.tIndex];
            const nP2 = railPoints2[node.tIndex];
            node.group.position.set((nP1.x + nP2.x) / 2, nP1.y, (nP1.z + nP2.z) / 2);
          });
        }
      };
    };

    const leftHelix = createHelixInstance(-3.2, true);
    const rightHelix = createHelixInstance(3.2, false);

    // --- 5. BOTTOM/BACKGROUND COMPONENT: HORIZONTAL PERSPECTIVE LINES & TICKERS ---
    const gridLinesGroup = new THREE.Group();
    scene.add(gridLinesGroup);

    const trackLineCount = 5;
    const trackSpacingY = -1.9; // positioned at lower third
    const trackLengthX = 14;

    const trackMat = registerDisposable(new THREE.LineBasicMaterial({
      color: whiteColor,
      transparent: true,
      opacity: 0.06
    }));

    // Draw horizontal grid lines running across screen
    const trackZPositions = [-2.5, -1.2, 0.1, 1.4, 2.7];
    trackZPositions.forEach(tz => {
      const pts = [
        new THREE.Vector3(-trackLengthX / 2, trackSpacingY, tz),
        new THREE.Vector3(trackLengthX / 2, trackSpacingY, tz)
      ];
      const trackGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const trackLine = new THREE.Line(trackGeo, trackMat);
      gridLinesGroup.add(trackLine);
    });

    // Flowing neon yellow data packets along grid tracks
    const packetCount = 8;
    const packetMeshGroup = new THREE.Group();
    gridLinesGroup.add(packetMeshGroup);

    const packetCylGeo = registerDisposable(new THREE.CylinderGeometry(0.012, 0.012, 0.32, 4));
    // Rotate geometry to lay flat along X-axis
    packetCylGeo.rotateZ(Math.PI / 2);

    const packetMat = registerDisposable(new THREE.MeshBasicMaterial({
      color: neonYellowColor,
      transparent: true,
      opacity: 0.85
    }));

    const dataPackets: {
      mesh: THREE.Mesh;
      speed: number;
      trackZ: number;
    }[] = [];

    for (let p = 0; p < packetCount; p++) {
      const packetMesh = new THREE.Mesh(packetCylGeo, packetMat);
      const trackZ = trackZPositions[p % trackZPositions.length];
      
      // Random initial layout position
      packetMesh.position.set(
        (Math.random() - 0.5) * trackLengthX,
        trackSpacingY,
        trackZ
      );

      packetMeshGroup.add(packetMesh);
      dataPackets.push({
        mesh: packetMesh,
        speed: 0.02 + Math.random() * 0.035,
        trackZ
      });
    }

    // --- 6. INTERACTIVE MOUSE PARALLAX TILT ---
    const mouse = { x: 0, y: 0 };
    const targetCamera = { x: 0, y: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize coordinates (-1 to 1)
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!container) return;
      W = container.clientWidth;
      H = container.clientHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };
    window.addEventListener('resize', handleResize);

    // --- 7. ANIMATION LOOP ---
    const clock = new THREE.Clock();

    const animateLoop = () => {
      const frameId = requestAnimationFrame(animateLoop);
      const elapsed = clock.getElapsedTime();

      // Smooth camera parallax dampening
      targetCamera.x += (mouse.x * 0.8 - targetCamera.x) * 0.045;
      targetCamera.y += (mouse.y * 0.6 - targetCamera.y) * 0.045;

      camera.position.x = targetCamera.x;
      camera.position.y = targetCamera.y;
      camera.lookAt(0, 0, 0);

      // A. Update left and right symmetrical helices
      leftHelix.update(elapsed);
      rightHelix.update(elapsed);

      // E. Animate horizontal data packets
      dataPackets.forEach(packet => {
        // Move left-to-right along tracks
        packet.mesh.position.x += packet.speed;

        // Wrap around track limits
        if (packet.mesh.position.x > trackLengthX / 2) {
          packet.mesh.position.x = -trackLengthX / 2;
          packet.speed = 0.02 + Math.random() * 0.035;
        }
      });

      renderer.render(scene, camera);
      return frameId;
    };

    const frameId = animateLoop();

    // --- 8. STRICT GARBAGE COLLECTION ---
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();

      // Dynamic rungs disposed automatically via disposables list of rungsGeo and rungMat

      disposables.forEach((d) => {
        if (d && typeof d.dispose === 'function') {
          try {
            d.dispose();
          } catch (err) {
            console.warn('Error during exact visualizer resource disposal:', err);
          }
        }
      });

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden flex items-center justify-center pointer-events-none select-none">
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 w-full h-full z-10" />
    </div>
  );
};

export default InvestorHeroVisual3D;
