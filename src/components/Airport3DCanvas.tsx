import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Airport3DCanvasProps {
  timeOfDay?: 'night' | 'dusk' | 'day';
}

export const Airport3DCanvas: React.FC<Airport3DCanvasProps> = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050c1e, 0.0035);

    const camera = new THREE.PerspectiveCamera(
      55,
      container.clientWidth / container.clientHeight,
      0.1,
      1500
    );
    // Elevated viewing angle (Airport Control Tower / Observation Deck perspective)
    camera.position.set(0, 45, 130);
    camera.lookAt(0, 10, -220);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 1. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x0f244a, 0.9);
    scene.add(ambientLight);

    const moonLight = new THREE.DirectionalLight(0x60a5fa, 1.2);
    moonLight.position.set(80, 180, -60);
    scene.add(moonLight);

    // Sunset horizon glow
    const sunsetLight = new THREE.DirectionalLight(0x38bdf8, 0.6);
    sunsetLight.position.set(-150, 20, -400);
    scene.add(sunsetLight);

    // 2. Runway Ground Mesh (Dark asphalt with subtle reflection)
    const groundGeo = new THREE.PlaneGeometry(1600, 1600);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x050b14,
      roughness: 0.85,
      metalness: 0.15
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    scene.add(ground);

    // 3. Main Runway Tarmac Strip
    const runwayWidth = 46;
    const runwayLength = 900;
    const runwayGeo = new THREE.PlaneGeometry(runwayWidth, runwayLength);
    const runwayMat = new THREE.MeshStandardMaterial({
      color: 0x09111f,
      roughness: 0.7,
      metalness: 0.3
    });
    const runway = new THREE.Mesh(runwayGeo, runwayMat);
    runway.rotation.x = -Math.PI / 2;
    runway.position.set(0, 0.1, -250);
    scene.add(runway);

    // Parallel Taxiway
    const taxiwayGeo = new THREE.PlaneGeometry(28, runwayLength * 0.8);
    const taxiwayMat = new THREE.MeshStandardMaterial({
      color: 0x070e1a,
      roughness: 0.8,
      metalness: 0.2
    });
    const taxiway = new THREE.Mesh(taxiwayGeo, taxiwayMat);
    taxiway.rotation.x = -Math.PI / 2;
    taxiway.position.set(70, 0.08, -250);
    scene.add(taxiway);

    // 4. Runway Lighting System (Points & Instanced Lights)
    // A. Centerline Strobes (Approach Lighting System / Sequence Flashers)
    const centerlineCount = 45;
    const centerlineGeo = new THREE.BufferGeometry();
    const centerlinePos = new Float32Array(centerlineCount * 3);
    for (let i = 0; i < centerlineCount; i++) {
      centerlinePos[i * 3 + 0] = 0;
      centerlinePos[i * 3 + 1] = 0.5;
      centerlinePos[i * 3 + 2] = 200 - i * 20;
    }
    centerlineGeo.setAttribute('position', new THREE.BufferAttribute(centerlinePos, 3));
    const centerlineMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 3.5,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const centerlinePoints = new THREE.Points(centerlineGeo, centerlineMat);
    scene.add(centerlinePoints);

    // B. Runway Edge Lights (White / Cyan High Intensity)
    const edgeCount = 90;
    const edgeGeo = new THREE.BufferGeometry();
    const edgePos = new Float32Array(edgeCount * 3);
    for (let i = 0; i < edgeCount / 2; i++) {
      const z = 200 - i * 20;
      // Left edge
      edgePos[i * 6 + 0] = -runwayWidth / 2;
      edgePos[i * 6 + 1] = 0.8;
      edgePos[i * 6 + 2] = z;
      // Right edge
      edgePos[i * 6 + 3] = runwayWidth / 2;
      edgePos[i * 6 + 4] = 0.8;
      edgePos[i * 6 + 5] = z;
    }
    edgeGeo.setAttribute('position', new THREE.BufferAttribute(edgePos, 3));
    const edgeMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 4.2,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const edgePoints = new THREE.Points(edgeGeo, edgeMat);
    scene.add(edgePoints);

    // C. Threshold Green & End Red Lights
    const thresholdGeo = new THREE.BufferGeometry();
    const thresholdPos = new Float32Array(16 * 3);
    for (let i = 0; i < 16; i++) {
      thresholdPos[i * 3 + 0] = -22 + i * 3;
      thresholdPos[i * 3 + 1] = 0.9;
      thresholdPos[i * 3 + 2] = 200; // Threshold green
    }
    thresholdGeo.setAttribute('position', new THREE.BufferAttribute(thresholdPos, 3));
    const thresholdMat = new THREE.PointsMaterial({
      color: 0x10b981,
      size: 5.0,
      blending: THREE.AdditiveBlending
    });
    scene.add(new THREE.Points(thresholdGeo, thresholdMat));

    // Taxiway Blue Edge Lights
    const taxiEdgeGeo = new THREE.BufferGeometry();
    const taxiEdgePos = new Float32Array(40 * 3);
    for (let i = 0; i < 20; i++) {
      const z = 100 - i * 25;
      taxiEdgePos[i * 6 + 0] = 70 - 14;
      taxiEdgePos[i * 6 + 1] = 0.6;
      taxiEdgePos[i * 6 + 2] = z;
      taxiEdgePos[i * 6 + 3] = 70 + 14;
      taxiEdgePos[i * 6 + 4] = 0.6;
      taxiEdgePos[i * 6 + 5] = z;
    }
    taxiEdgeGeo.setAttribute('position', new THREE.BufferAttribute(taxiEdgePos, 3));
    const taxiEdgeMat = new THREE.PointsMaterial({
      color: 0x3b82f6,
      size: 3.8,
      blending: THREE.AdditiveBlending
    });
    scene.add(new THREE.Points(taxiEdgeGeo, taxiEdgeMat));

    // 5. Starfield & Volumetric Floating Particles
    const starCount = 350;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3 + 0] = (Math.random() - 0.5) * 1200;
      starPos[i * 3 + 1] = 60 + Math.random() * 400;
      starPos[i * 3 + 2] = -300 - Math.random() * 800;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xe2e8f0,
      size: 2.2,
      transparent: true,
      opacity: 0.75
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 6. Air Traffic Control (ATC) Tower Model
    const towerGroup = new THREE.Group();
    towerGroup.position.set(-110, 0, -80);

    // Base
    const baseGeo = new THREE.CylinderGeometry(8, 12, 60, 16);
    const towerMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.4,
      roughness: 0.6
    });
    const towerBase = new THREE.Mesh(baseGeo, towerMat);
    towerBase.position.y = 30;
    towerGroup.add(towerBase);

    // Cab (Glass Control Room)
    const cabGeo = new THREE.CylinderGeometry(14, 10, 14, 16);
    const cabMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      metalness: 0.8,
      roughness: 0.2,
      transparent: true,
      opacity: 0.85
    });
    const cab = new THREE.Mesh(cabGeo, cabMat);
    cab.position.y = 65;
    towerGroup.add(cab);

    // Rotating Beacon light on top of ATC tower
    const beaconLight = new THREE.PointLight(0x38bdf8, 3, 200);
    beaconLight.position.set(0, 75, 0);
    towerGroup.add(beaconLight);

    // Rotating Radar Dish
    const radarGeo = new THREE.CylinderGeometry(5, 5, 1.2, 12);
    const radarMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8 });
    const radarDish = new THREE.Mesh(radarGeo, radarMat);
    radarDish.position.set(0, 76, 0);
    radarDish.rotation.z = Math.PI / 4;
    towerGroup.add(radarDish);

    scene.add(towerGroup);

    // 7. Commercial Jet Aircraft (Detailed stylized geometric low-poly airliners)
    const createAircraft = (colorHex: number, scale: number = 1.0) => {
      const planeGroup = new THREE.Group();

      // Fuselage
      const fuseGeo = new THREE.ConeGeometry(3.5 * scale, 38 * scale, 12);
      const planeMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        metalness: 0.6,
        roughness: 0.3
      });
      const fuselage = new THREE.Mesh(fuseGeo, planeMat);
      fuselage.rotation.x = Math.PI / 2;
      planeGroup.add(fuselage);

      // Wings
      const wingShape = new THREE.Shape();
      wingShape.moveTo(0, 6 * scale);
      wingShape.lineTo(-24 * scale, -10 * scale);
      wingShape.lineTo(-22 * scale, -15 * scale);
      wingShape.lineTo(0, -5 * scale);
      wingShape.lineTo(22 * scale, -15 * scale);
      wingShape.lineTo(24 * scale, -10 * scale);
      wingShape.closePath();

      const wingExtrude = new THREE.ExtrudeGeometry(wingShape, { depth: 0.6 * scale, bevelEnabled: false });
      const wings = new THREE.Mesh(wingExtrude, planeMat);
      wings.rotation.x = Math.PI / 2;
      wings.position.set(0, 0.4 * scale, 0);
      planeGroup.add(wings);

      // Tail Fin (Vertical Stabilizer)
      const tailGeo = new THREE.BoxGeometry(0.6 * scale, 7 * scale, 6 * scale);
      const tail = new THREE.Mesh(tailGeo, planeMat);
      tail.position.set(0, 3.8 * scale, -14 * scale);
      planeGroup.add(tail);

      // Navigation lights (Red port, Green starboard, White strobe)
      const navRed = new THREE.PointLight(0xef4444, 2, 30);
      navRed.position.set(-23 * scale, 0.5 * scale, -12 * scale);
      planeGroup.add(navRed);

      const navGreen = new THREE.PointLight(0x10b981, 2, 30);
      navGreen.position.set(23 * scale, 0.5 * scale, -12 * scale);
      planeGroup.add(navGreen);

      const strobeTail = new THREE.PointLight(0xffffff, 3, 50);
      strobeTail.position.set(0, 7.5 * scale, -15 * scale);
      planeGroup.add(strobeTail);

      return { planeGroup, strobeTail, navRed, navGreen };
    };

    // Airplane 1: Departure Flight (Taking off and climbing)
    const airplaneTakeoff = createAircraft(0xffffff, 0.85);
    scene.add(airplaneTakeoff.planeGroup);

    // Airplane 2: Inbound Flight (Landing approach glide slope)
    const airplaneLanding = createAircraft(0x0284c7, 0.75);
    scene.add(airplaneLanding.planeGroup);

    // Airplane 3: Taxiing Flight
    const airplaneTaxi = createAircraft(0xd97706, 0.7);
    airplaneTaxi.planeGroup.position.set(70, 2.5, -150);
    airplaneTaxi.planeGroup.rotation.y = Math.PI;
    scene.add(airplaneTaxi.planeGroup);

    // 8. Animation State
    let takeoffT = 0;
    let landingT = 0;
    let taxiZ = -280;
    let beaconAngle = 0;
    let strobeTimer = 0;
    let reqId: number;

    const animate = () => {
      reqId = requestAnimationFrame(animate);

      beaconAngle += 0.035;
      beaconLight.position.x = Math.sin(beaconAngle) * 5;
      beaconLight.position.z = Math.cos(beaconAngle) * 5;
      radarDish.rotation.y += 0.04;

      // Strobe flash
      strobeTimer += 0.05;
      const isStrobeOn = Math.sin(strobeTimer * 12) > 0.85;
      airplaneTakeoff.strobeTail.intensity = isStrobeOn ? 5 : 0.2;
      airplaneLanding.strobeTail.intensity = isStrobeOn ? 5 : 0.2;
      centerlineMat.opacity = 0.75 + Math.sin(strobeTimer * 4) * 0.25;

      // 1. Takeoff Aircraft Physics Loop
      takeoffT += 0.0035;
      if (takeoffT > 1) takeoffT = 0;

      if (takeoffT < 0.4) {
        // Runway roll acceleration
        const progress = takeoffT / 0.4;
        const z = 180 - progress * 400;
        airplaneTakeoff.planeGroup.position.set(0, 3, z);
        airplaneTakeoff.planeGroup.rotation.set(0, Math.PI, 0);
      } else {
        // Rotation & Initial Climb Out
        const climbProg = (takeoffT - 0.4) / 0.6;
        const z = -220 - climbProg * 650;
        const y = 3 + Math.pow(climbProg, 1.4) * 220;
        airplaneTakeoff.planeGroup.position.set(
          Math.sin(climbProg * 1.5) * 60,
          y,
          z
        );
        airplaneTakeoff.planeGroup.rotation.set(-0.25, Math.PI - 0.1, -0.08);
      }

      // 2. Landing Aircraft Physics Loop
      landingT += 0.0028;
      if (landingT > 1) landingT = 0;

      if (landingT < 0.6) {
        // On 3-degree ILS glideslope approach
        const prog = landingT / 0.6;
        const z = 600 - prog * 500;
        const y = 180 - prog * 176;
        airplaneLanding.planeGroup.position.set(0, y, z);
        airplaneLanding.planeGroup.rotation.set(0.12, Math.PI, 0);
      } else {
        // Touchdown rollout & reverse thrust deceleration
        const rollProg = (landingT - 0.6) / 0.4;
        const z = 100 - rollProg * 320;
        airplaneLanding.planeGroup.position.set(0, 3.5, z);
        airplaneLanding.planeGroup.rotation.set(0, Math.PI, 0);
      }

      // 3. Taxiing Aircraft
      taxiZ += 0.35;
      if (taxiZ > 120) taxiZ = -350;
      airplaneTaxi.planeGroup.position.z = taxiZ;

      // Subtle camera breathing motion
      camera.position.x = Math.sin(beaconAngle * 0.15) * 8;
      camera.position.y = 44 + Math.cos(beaconAngle * 0.2) * 2;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      style={{ opacity: 0.92 }}
    />
  );
};
