import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Ward, Incident, VisualLayer, CameraMode, TimeOfDay } from '../types/city';

interface ThreeCityViewerProps {
  wards: Ward[];
  incidents: Incident[];
  activeLayer: VisualLayer;
  cameraMode: CameraMode;
  timeOfDay: TimeOfDay;
  selectedWard: Ward | null;
  onSelectWard: (ward: Ward) => void;
  onSelectIncident: (incident: Incident) => void;
}

export const ThreeCityViewer: React.FC<ThreeCityViewerProps> = ({
  wards,
  incidents,
  activeLayer,
  cameraMode,
  timeOfDay,
  selectedWard,
  onSelectWard,
  onSelectIncident,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(140, 160, 180));
  const targetCamLook = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const isDragging = useRef<boolean>(false);
  const previousMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const orbitRadius = useRef<number>(240);
  const orbitAngle = useRef<number>(0.7);
  const orbitElevation = useRef<number>(0.9);

  // Metro train & traffic animation state
  const metroPosition = useRef<number>(0);
  const trafficEntities = useRef<{ mesh: THREE.Group; pathIndex: number; speed: number; laneOffset: number }[]>([]);
  const pipePulses = useRef<THREE.Mesh[]>([]);
  const aqiParticles = useRef<THREE.Points | null>(null);
  const powerLinesGroup = useRef<THREE.Group | null>(null);
  const waterPipesGroup = useRef<THREE.Group | null>(null);
  const incidentMarkersGroup = useRef<THREE.Group | null>(null);
  const metroTrainGroup = useRef<THREE.Group | null>(null);
  const directionalLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xF6F3E9); // Oat Milk default
    scene.fog = new THREE.FogExp2(0xF6F3E9, 0.0018);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(42, width / height, 1, 1200);
    camera.position.set(150, 160, 190);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    container.replaceChildren(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFBF2, 1.4);
    ambientLightRef.current = ambientLight;
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xFFF5E0, 2.0);
    dirLight.position.set(120, 220, 100);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 600;
    dirLight.shadow.camera.left = -160;
    dirLight.shadow.camera.right = 160;
    dirLight.shadow.camera.top = 160;
    dirLight.shadow.camera.bottom = -160;
    dirLight.shadow.bias = -0.0005;
    directionalLightRef.current = dirLight;
    scene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0xFDFBF7, 0xDEE2D9, 0.8);
    scene.add(hemiLight);

    // 5. Build Procedural City Elements
    // Terrain
    const groundGeo = new THREE.PlaneGeometry(380, 380, 32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xEAE5D8,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Lake Basin (Bellandur Water Body)
    const lakeShape = new THREE.Shape();
    lakeShape.moveTo(35, 30);
    lakeShape.quadraticCurveTo(80, 20, 95, 45);
    lakeShape.quadraticCurveTo(110, 80, 75, 90);
    lakeShape.quadraticCurveTo(40, 85, 35, 55);
    lakeShape.closePath();
    const lakeGeo = new THREE.ShapeGeometry(lakeShape);
    const lakeMat = new THREE.MeshStandardMaterial({
      color: 0x1E6D8A, // Deep Teal Water
      roughness: 0.2,
      metalness: 0.6,
      transparent: true,
      opacity: 0.88
    });
    const lake = new THREE.Mesh(lakeGeo, lakeMat);
    lake.rotation.x = -Math.PI / 2;
    lake.position.y = 0.4;
    scene.add(lake);

    // Road Network & Flyovers
    const roadGroup = new THREE.Group();
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x363A3C, roughness: 0.8 });
    const flyoverMat = new THREE.MeshStandardMaterial({ color: 0x6E7377, roughness: 0.7 });

    // Outer Ring Road (Rectangle Ring)
    const ringRoadOuter = new THREE.RingGeometry(118, 126, 64);
    const ringMesh = new THREE.Mesh(ringRoadOuter, roadMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.2;
    ringMesh.receiveShadow = true;
    roadGroup.add(ringMesh);

    // Arterial Cross Roads
    const roadNS = new THREE.Mesh(new THREE.PlaneGeometry(16, 260), roadMat);
    roadNS.rotation.x = -Math.PI / 2;
    roadNS.position.y = 0.22;
    roadNS.receiveShadow = true;
    roadGroup.add(roadNS);

    const roadEW = new THREE.Mesh(new THREE.PlaneGeometry(260, 16), roadMat);
    roadEW.rotation.x = -Math.PI / 2;
    roadEW.position.y = 0.22;
    roadEW.receiveShadow = true;
    roadGroup.add(roadEW);

    // Elevated Flyover connecting Tech Park to Center
    const flyoverCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(45, 0.4, -35),
      new THREE.Vector3(25, 12, -20),
      new THREE.Vector3(5, 14, -5),
      new THREE.Vector3(-15, 8, 10),
      new THREE.Vector3(-35, 0.4, 25)
    ]);
    const flyoverGeo = new THREE.TubeGeometry(flyoverCurve, 32, 4.5, 8, false);
    const flyoverMesh = new THREE.Mesh(flyoverGeo, flyoverMat);
    flyoverMesh.castShadow = true;
    flyoverMesh.receiveShadow = true;
    roadGroup.add(flyoverMesh);

    // Flyover support pillars
    [0.2, 0.4, 0.6, 0.8].forEach(t => {
      const pt = flyoverCurve.getPoint(t);
      const pillar = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.4, pt.y, 8), flyoverMat);
      pillar.position.set(pt.x, pt.y / 2, pt.z);
      pillar.castShadow = true;
      roadGroup.add(pillar);
    });

    scene.add(roadGroup);

    // Elevated Metro Viaduct & Track
    const metroTrackCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-110, 16, -60),
      new THREE.Vector3(-60, 16, -40),
      new THREE.Vector3(0, 16, -10),
      new THREE.Vector3(60, 16, 20),
      new THREE.Vector3(110, 16, 60)
    ]);
    const metroTrackGeo = new THREE.TubeGeometry(metroTrackCurve, 64, 1.8, 6, false);
    const metroTrackMat = new THREE.MeshStandardMaterial({ color: 0x505459, roughness: 0.6 });
    const metroTrackMesh = new THREE.Mesh(metroTrackGeo, metroTrackMat);
    metroTrackMesh.castShadow = true;
    scene.add(metroTrackMesh);

    // Metro Pillars
    for (let i = 0; i <= 10; i++) {
      const pt = metroTrackCurve.getPoint(i / 10);
      const mPillar = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.6, pt.y, 8), metroTrackMat);
      mPillar.position.set(pt.x, pt.y / 2, pt.z);
      mPillar.castShadow = true;
      scene.add(mPillar);
    }

    // Articulated Namma Metro Train Group
    const trainGroup = new THREE.Group();
    const trainCarMat = new THREE.MeshStandardMaterial({ color: 0xF7F8FA, roughness: 0.3, metalness: 0.5 });
    const trainStripeMat = new THREE.MeshStandardMaterial({ color: 0x228B22 }); // Namma Green
    const trainWindowMat = new THREE.MeshStandardMaterial({ color: 0x1C2D37, roughness: 0.1 });

    for (let c = 0; c < 3; c++) {
      const car = new THREE.Group();
      const carBody = new THREE.Mesh(new THREE.BoxGeometry(10, 3.2, 3), trainCarMat);
      carBody.position.y = 1.6;
      carBody.castShadow = true;
      car.add(carBody);

      const stripe = new THREE.Mesh(new THREE.BoxGeometry(10.1, 0.6, 3.05), trainStripeMat);
      stripe.position.y = 1.3;
      car.add(stripe);

      const windows = new THREE.Mesh(new THREE.BoxGeometry(8, 0.9, 3.1), trainWindowMat);
      windows.position.y = 2.2;
      car.add(windows);

      car.position.x = c * -11.5;
      trainGroup.add(car);
    }
    scene.add(trainGroup);
    metroTrainGroup.current = trainGroup;

    // Procedural Buildings across Wards
    const buildingGroup = new THREE.Group();
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x7CA4B8, roughness: 0.2, metalness: 0.8 });
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0xD8CFBD, roughness: 0.8 });
    const brickMat = new THREE.MeshStandardMaterial({ color: 0xBC5434, roughness: 0.9 }); // Terracotta
    const industrialMat = new THREE.MeshStandardMaterial({ color: 0x8A8E91, roughness: 0.7 });
    const whiteFacadeMat = new THREE.MeshStandardMaterial({ color: 0xFAF7F0, roughness: 0.5 });

    // Helper: Add Commercial High-Rise
    const addCommercialTower = (x: number, z: number, height: number, width: number) => {
      const tower = new THREE.Group();
      // Podium
      const podium = new THREE.Mesh(new THREE.BoxGeometry(width * 1.4, 6, width * 1.4), stoneMat);
      podium.position.set(0, 3, 0);
      podium.castShadow = true;
      podium.receiveShadow = true;
      tower.add(podium);

      // Glass Tower
      const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, width), glassMat);
      body.position.set(0, 6 + height / 2, 0);
      body.castShadow = true;
      body.receiveShadow = true;
      tower.add(body);

      // Roof Spire or HVAC
      const roof = new THREE.Mesh(new THREE.BoxGeometry(width * 0.6, 4, width * 0.6), stoneMat);
      roof.position.set(0, 6 + height + 2, 0);
      tower.add(roof);

      tower.position.set(x, 0, z);
      buildingGroup.add(tower);
    };

    // Helper: Add Heritage Bazaar Block
    const addBazaarBlock = (x: number, z: number, height: number, width: number) => {
      const block = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, width), brickMat);
      body.position.set(0, height / 2, 0);
      body.castShadow = true;
      body.receiveShadow = true;
      block.add(body);

      // Terracotta pitched roof
      const roofGeo = new THREE.ConeGeometry(width * 0.75, 4, 4);
      const roofMesh = new THREE.Mesh(roofGeo, brickMat);
      roofMesh.position.set(0, height + 2, 0);
      roofMesh.rotation.y = Math.PI / 4;
      roofMesh.castShadow = true;
      block.add(roofMesh);

      block.position.set(x, 0, z);
      buildingGroup.add(block);
    };

    // Helper: Add Residential Tower
    const addResidentialTower = (x: number, z: number, height: number, width: number) => {
      const res = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(width, height, width * 0.8), whiteFacadeMat);
      body.position.set(0, height / 2, 0);
      body.castShadow = true;
      body.receiveShadow = true;
      res.add(body);

      // Water Tank on roof
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 3, 12), industrialMat);
      tank.position.set(0, height + 1.5, 0);
      res.add(tank);

      res.position.set(x, 0, z);
      buildingGroup.add(res);
    };

    // Helper: Add Industrial Hangar / Substation
    const addIndustrialUnit = (x: number, z: number, width: number, depth: number) => {
      const ind = new THREE.Group();
      const shed = new THREE.Mesh(new THREE.BoxGeometry(width, 10, depth), industrialMat);
      shed.position.set(0, 5, 0);
      shed.castShadow = true;
      shed.receiveShadow = true;
      ind.add(shed);

      // Silo
      const silo = new THREE.Mesh(new THREE.CylinderGeometry(4, 4, 18, 16), glassMat);
      silo.position.set(width * 0.6, 9, 0);
      silo.castShadow = true;
      ind.add(silo);

      ind.position.set(x, 0, z);
      buildingGroup.add(ind);
    };

    // Populate Cyber Gateway (Ward 1)
    [
      [38, -25, 48, 14],
      [52, -42, 64, 16],
      [42, -50, 36, 12],
      [60, -25, 52, 14],
      [30, -40, 40, 10],
      [48, -15, 34, 12],
    ].forEach(([x, z, h, w]) => addCommercialTower(x, z, h, w));

    // Populate Pettah Heritage Bazaar (Ward 2)
    for (let bx = -50; bx <= -25; bx += 8) {
      for (let bz = -32; bz <= -10; bz += 8) {
        addBazaarBlock(bx, bz, Math.random() * 8 + 8, 6.5);
      }
    }
    // Heritage Clock Tower at Bazaar Center
    const clockTower = new THREE.Mesh(new THREE.BoxGeometry(6, 38, 6), brickMat);
    clockTower.position.set(-38, 19, -20);
    clockTower.castShadow = true;
    buildingGroup.add(clockTower);

    // Populate Bellandur Lake Residential Enclave (Ward 3)
    [
      [55, 35, 42, 12],
      [70, 32, 48, 14],
      [82, 45, 36, 10],
      [65, 60, 50, 12],
      [48, 55, 38, 11],
      [78, 70, 44, 13],
    ].forEach(([x, z, h, w]) => addResidentialTower(x, z, h, w));

    // Populate Peenya Industrial Hub (Ward 4)
    [
      [-65, 40, 24, 30],
      [-48, 65, 20, 28],
      [-70, 68, 22, 25],
      [-42, 45, 18, 22],
    ].forEach(([x, z, w, d]) => addIndustrialUnit(x, z, w, d));

    // Populate Civic & Healthcare Belt (Ward 5)
    // Vidhana Central Rotunda
    const rotundaBase = new THREE.Mesh(new THREE.CylinderGeometry(18, 20, 12, 24), stoneMat);
    rotundaBase.position.set(0, 6, 0);
    rotundaBase.castShadow = true;
    rotundaBase.receiveShadow = true;
    buildingGroup.add(rotundaBase);
    const rotundaDome = new THREE.Mesh(new THREE.SphereGeometry(14, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2), stoneMat);
    rotundaDome.position.set(0, 12, 0);
    rotundaDome.castShadow = true;
    buildingGroup.add(rotundaDome);

    // Trauma Hospital with Helipad
    const hospital = new THREE.Group();
    const hospMain = new THREE.Mesh(new THREE.BoxGeometry(22, 24, 16), whiteFacadeMat);
    hospMain.position.set(-18, 12, 18);
    hospMain.castShadow = true;
    hospital.add(hospMain);

    // Helipad circle on roof
    const helipad = new THREE.Mesh(new THREE.CircleGeometry(4, 16), new THREE.MeshBasicMaterial({ color: 0xD9A441 }));
    helipad.rotation.x = -Math.PI / 2;
    helipad.position.set(-18, 24.1, 18);
    hospital.add(helipad);
    buildingGroup.add(hospital);

    // Populate Greenfield Solar Farm (Ward 6)
    const solarGroup = new THREE.Group();
    const solarMat = new THREE.MeshStandardMaterial({ color: 0x1A446C, roughness: 0.1, metalness: 0.9 });
    for (let sx = -15; sx <= 25; sx += 8) {
      for (let sz = -95; sz <= -70; sz += 6) {
        const panel = new THREE.Mesh(new THREE.BoxGeometry(6, 0.4, 4), solarMat);
        panel.position.set(sx, 1.2, sz);
        panel.rotation.x = -0.3; // 17 degree solar tilt
        panel.castShadow = true;
        solarGroup.add(panel);
      }
    }
    buildingGroup.add(solarGroup);
    scene.add(buildingGroup);

    // Dynamic Traffic Simulation Entities
    const trafficGroup = new THREE.Group();
    const busMat = new THREE.MeshStandardMaterial({ color: 0x228B22 }); // Green DTC/BMTC
    const autoMat = new THREE.MeshStandardMaterial({ color: 0xEAB308 }); // Yellow Auto
    const carMat = new THREE.MeshStandardMaterial({ color: 0x3B82F6 });
    const ambulanceMat = new THREE.MeshStandardMaterial({ color: 0xDC2626 }); // Emergency Red

    // Create 45 multi-modal vehicles
    const vehicles: { mesh: THREE.Group; pathIndex: number; speed: number; laneOffset: number }[] = [];
    for (let v = 0; v < 45; v++) {
      const vGroup = new THREE.Group();
      const typeRand = Math.random();

      if (typeRand < 0.2) {
        // BMTC Electric Bus
        const bus = new THREE.Mesh(new THREE.BoxGeometry(7, 2.6, 2.4), busMat);
        bus.position.y = 1.3;
        bus.castShadow = true;
        vGroup.add(bus);
      } else if (typeRand < 0.55) {
        // Auto-rickshaw (distinct compact 3-wheeler)
        const autoCabin = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 1.6), autoMat);
        autoCabin.position.y = 0.9;
        autoCabin.castShadow = true;
        vGroup.add(autoCabin);
        const autoRoof = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.4, 1.7), new THREE.MeshStandardMaterial({ color: 0x1E293B }));
        autoRoof.position.y = 1.9;
        vGroup.add(autoRoof);
      } else if (typeRand < 0.9) {
        // Private Sedan / Cab
        const car = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.5, 1.9), carMat);
        car.position.y = 0.75;
        car.castShadow = true;
        vGroup.add(car);
      } else {
        // Emergency Ambulance with flashing beacon
        const amb = new THREE.Mesh(new THREE.BoxGeometry(5.2, 2.2, 2.1), ambulanceMat);
        amb.position.y = 1.1;
        amb.castShadow = true;
        vGroup.add(amb);
        const beacon = new THREE.PointLight(0xFF0000, 2, 15);
        beacon.position.y = 2.4;
        vGroup.add(beacon);
      }

      vGroup.position.set(0, 0.4, 0);
      trafficGroup.add(vGroup);
      vehicles.push({
        mesh: vGroup,
        pathIndex: Math.random() * Math.PI * 2,
        speed: 0.003 + Math.random() * 0.004,
        laneOffset: (Math.random() - 0.5) * 4
      });
    }
    scene.add(trafficGroup);
    trafficEntities.current = vehicles;

    // Infrastructure Overlay: High-Voltage Power Lines
    const powerGroup = new THREE.Group();
    const pylonMat = new THREE.MeshBasicMaterial({ color: 0xD9A441, wireframe: true });
    const cableMat = new THREE.LineBasicMaterial({ color: 0xD9A441, linewidth: 2 });

    const pylonLocations = [
      [-55, 55], [-25, 30], [0, 0], [45, -35], [60, 50], [10, -80]
    ];
    for (let p = 0; p < pylonLocations.length; p++) {
      const pylon = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 3, 24, 4), pylonMat);
      pylon.position.set(pylonLocations[p][0], 12, pylonLocations[p][1]);
      powerGroup.add(pylon);

      if (p < pylonLocations.length - 1) {
        const nextP = pylonLocations[p + 1];
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(pylonLocations[p][0], 22, pylonLocations[p][1]),
          new THREE.Vector3((pylonLocations[p][0] + nextP[0]) / 2, 16, (pylonLocations[p][1] + nextP[1]) / 2),
          new THREE.Vector3(nextP[0], 22, nextP[1])
        ]);
        const line = new THREE.Line(lineGeo, cableMat);
        powerGroup.add(line);
      }
    }
    scene.add(powerGroup);
    powerLinesGroup.current = powerGroup;

    // Infrastructure Overlay: Water Distribution Pipelines
    const waterGroup = new THREE.Group();
    const pipeMat = new THREE.MeshStandardMaterial({
      color: 0x00A8E8,
      roughness: 0.2,
      metalness: 0.5,
      transparent: true,
      opacity: 0.75
    });

    const pipeWaypoints = [
      [65, 45], [45, 10], [0, 0], [-35, -20], [-55, 35]
    ];
    for (let pw = 0; pw < pipeWaypoints.length - 1; pw++) {
      const p1 = pipeWaypoints[pw];
      const p2 = pipeWaypoints[pw + 1];
      const pipeCurve = new THREE.LineCurve3(
        new THREE.Vector3(p1[0], 0.8, p1[1]),
        new THREE.Vector3(p2[0], 0.8, p2[1])
      );
      const pipeMesh = new THREE.Mesh(new THREE.TubeGeometry(pipeCurve, 20, 1.2, 8, false), pipeMat);
      waterGroup.add(pipeMesh);
    }
    scene.add(waterGroup);
    waterPipesGroup.current = waterGroup;

    // Atmospheric AQI Particle Dome
    const aqiParticleCount = 600;
    const aqiGeo = new THREE.BufferGeometry();
    const aqiPositions = new Float32Array(aqiParticleCount * 3);
    for (let ap = 0; ap < aqiParticleCount * 3; ap += 3) {
      aqiPositions[ap] = (Math.random() - 0.5) * 260;
      aqiPositions[ap + 1] = Math.random() * 35 + 2;
      aqiPositions[ap + 2] = (Math.random() - 0.5) * 260;
    }
    aqiGeo.setAttribute('position', new THREE.BufferAttribute(aqiPositions, 3));
    const aqiMat = new THREE.PointsMaterial({
      color: 0xD97706, // Smog Amber
      size: 3.5,
      transparent: true,
      opacity: 0.45
    });
    const aqiPoints = new THREE.Points(aqiGeo, aqiMat);
    scene.add(aqiPoints);
    aqiParticles.current = aqiPoints;

    // Emergency Incident Beacon Markers
    const incGroup = new THREE.Group();
    scene.add(incGroup);
    incidentMarkersGroup.current = incGroup;

    // 6. Raycaster for Ward/Incident click interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(buildingGroup.children, true);

      if (intersects.length > 0) {
        const hitPt = intersects[0].point;
        // Find closest ward
        let closestWard = wards[0];
        let minDist = Infinity;
        wards.forEach(w => {
          const dist = Math.hypot(w.coordinates[0] - hitPt.x, w.coordinates[1] - hitPt.z);
          if (dist < minDist) {
            minDist = dist;
            closestWard = w;
          }
        });
        if (minDist < 60) {
          onSelectWard(closestWard);
        }
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    // Mouse drag orbit controls
    const onMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;
      orbitAngle.current -= deltaX * 0.005;
      orbitElevation.current = Math.max(0.2, Math.min(1.4, orbitElevation.current + deltaY * 0.005));
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      orbitRadius.current = Math.max(60, Math.min(380, orbitRadius.current + e.deltaY * 0.2));
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel);

    // 7. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Animate Metro Train along track curve
      metroPosition.current = (metroPosition.current + delta * 0.04) % 1.0;
      if (metroTrainGroup.current) {
        const pt = metroTrackCurve.getPoint(metroPosition.current);
        const tangent = metroTrackCurve.getTangent(metroPosition.current);
        metroTrainGroup.current.position.copy(pt);
        metroTrainGroup.current.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), tangent);
      }

      // Animate Vehicles along Ring Road
      trafficEntities.current.forEach(v => {
        v.pathIndex += v.speed;
        const r = 122 + v.laneOffset;
        v.mesh.position.x = Math.cos(v.pathIndex) * r;
        v.mesh.position.z = Math.sin(v.pathIndex) * r;
        v.mesh.rotation.y = -v.pathIndex + Math.PI / 2;
      });

      // Animate AQI smog particles drift
      if (aqiParticles.current) {
        const posAttr = aqiParticles.current.geometry.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
          let x = posAttr.getX(i) + delta * 3.5;
          if (x > 130) x = -130;
          posAttr.setX(i, x);
        }
        posAttr.needsUpdate = true;
      }

      // Camera Orbit updates
      if (cameraRef.current) {
        if (cameraMode === 'TACTICAL_GOD_VIEW') {
          targetCamPos.current.set(
            Math.cos(orbitAngle.current) * orbitRadius.current,
            Math.sin(orbitElevation.current) * orbitRadius.current,
            Math.sin(orbitAngle.current) * orbitRadius.current
          );
          targetCamLook.current.set(0, 0, 0);
        } else if (cameraMode === 'FLYOVER_DRONE') {
          const sweepAngle = time * 0.15;
          targetCamPos.current.set(Math.cos(sweepAngle) * 160, 65 + Math.sin(time * 0.3) * 15, Math.sin(sweepAngle) * 160);
          targetCamLook.current.set(0, 8, 0);
        } else if (cameraMode === 'WARD_TELEMETRY' && selectedWard) {
          targetCamPos.current.set(selectedWard.coordinates[0] + 45, 55, selectedWard.coordinates[1] + 55);
          targetCamLook.current.set(selectedWard.coordinates[0], 10, selectedWard.coordinates[1]);
        } else if (cameraMode === 'GROUND_PATROL') {
          // Patrol along arterial flyover
          const patrolPt = flyoverCurve.getPoint((time * 0.05) % 1.0);
          targetCamPos.current.set(patrolPt.x, patrolPt.y + 4, patrolPt.z);
          const nextPt = flyoverCurve.getPoint(((time * 0.05) + 0.05) % 1.0);
          targetCamLook.current.set(nextPt.x, nextPt.y + 2, nextPt.z);
        }

        // Smooth camera lerp
        cameraRef.current.position.lerp(targetCamPos.current, 0.05);
        cameraRef.current.lookAt(targetCamLook.current);
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
      renderer.dispose();
    };
  }, []);

  // Update Visual Layer visibility
  useEffect(() => {
    if (powerLinesGroup.current) {
      powerLinesGroup.current.visible = activeLayer === 'ALL' || activeLayer === 'POWER';
    }
    if (waterPipesGroup.current) {
      waterPipesGroup.current.visible = activeLayer === 'ALL' || activeLayer === 'WATER';
    }
    if (aqiParticles.current) {
      aqiParticles.current.visible = activeLayer === 'ALL' || activeLayer === 'AQI';
    }
  }, [activeLayer]);

  // Update Time-of-Day Lighting
  useEffect(() => {
    if (!sceneRef.current || !directionalLightRef.current || !ambientLightRef.current) return;
    const scene = sceneRef.current;
    const dir = directionalLightRef.current;
    const amb = ambientLightRef.current;

    if (timeOfDay === 'DAWN') {
      scene.background = new THREE.Color(0xFBEAE0);
      scene.fog?.color.set(0xFBEAE0);
      dir.color.set(0xFFC39E);
      dir.intensity = 1.6;
      amb.color.set(0xFFE8D6);
      amb.intensity = 1.1;
    } else if (timeOfDay === 'NOON') {
      scene.background = new THREE.Color(0xF6F3E9); // Warm Oat Milk
      scene.fog?.color.set(0xF6F3E9);
      dir.color.set(0xFFFBF2);
      dir.intensity = 2.2;
      amb.color.set(0xFFFFFF);
      amb.intensity = 1.4;
    } else if (timeOfDay === 'DUSK') {
      scene.background = new THREE.Color(0xEDD5BE);
      scene.fog?.color.set(0xEDD5BE);
      dir.color.set(0xE07A2B); // Saffron Golden Hour
      dir.intensity = 2.4;
      amb.color.set(0xE8B88A);
      amb.intensity = 1.0;
    } else if (timeOfDay === 'NIGHT') {
      scene.background = new THREE.Color(0x0E1924);
      scene.fog?.color.set(0x0E1924);
      dir.color.set(0x406085);
      dir.intensity = 0.5;
      amb.color.set(0x1B2C3F);
      amb.intensity = 0.6;
    }
  }, [timeOfDay]);

  // Update Incident Beacon Markers in 3D
  useEffect(() => {
    if (!incidentMarkersGroup.current) return;
    const group = incidentMarkersGroup.current;
    group.clear();

    incidents.forEach(inc => {
      if (inc.status === 'RESOLVED') return;
      const marker = new THREE.Group();

      // Pulsing ring
      const ringGeo = new THREE.RingGeometry(2.5, 3.2, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: inc.severity === 'CRITICAL' ? 0xC53030 : 0xDD6B20,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 1.5;
      marker.add(ring);

      // Vertical beacon ray
      const beaconGeo = new THREE.CylinderGeometry(0.3, 0.3, 24, 8);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: inc.severity === 'CRITICAL' ? 0xC53030 : 0xDD6B20,
        transparent: true,
        opacity: 0.6
      });
      const beacon = new THREE.Mesh(beaconGeo, beaconMat);
      beacon.position.y = 12;
      marker.add(beacon);

      marker.position.set(inc.coordinates[0], 0, inc.coordinates[1]);
      group.add(marker);
    });
  }, [incidents]);

  return (
    <div className="relative w-full h-full select-none">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 3D Ward Overlay Badges */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {wards.map(ward => (
          <div
            key={ward.id}
            onClick={() => onSelectWard(ward)}
            className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-105"
            style={{
              // Approximate perspective projection for UI labels
              left: `${50 + (ward.coordinates[0] / 220) * 38}%`,
              top: `${50 + (ward.coordinates[1] / 220) * 38}%`
            }}
          >
            <div className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-card border flex items-center space-x-1.5 transition-colors ${
              selectedWard?.id === ward.id
                ? 'bg-city-primary text-white border-city-primary'
                : 'bg-city-surface/90 text-city-ink border-city-border hover:border-city-primary'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                ward.trafficDensityPct > 80 ? 'bg-city-danger animate-pulse' : 'bg-city-success'
              }`} />
              <span className="font-mono">{ward.id}</span>
              <span className="hidden md:inline font-sans text-[11px]">{ward.name.split(' ')[0]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
