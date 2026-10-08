"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const translations = {
  fa: {
    centerSeats: "صندلی‌های وسط",
    balcony: "بالکن",
    leftSide: "سمت چپ",
    rightSide: "سمت راست",
    overview: "نمای کلی",
    sectionPov: "نمای بخش:",
    pitchTilt: "شیب زاویه دید:",
    elevation: "ارتفاع",
    distance: "فاصله",
    orbitAngle: "زاویه چرخش:",
    row: "ردیف",
    seat: "صندلی",
    clickHint:
      "برای ورود به دیدگاه تماشاگر رو به سن، روی هر صندلی کنسرت کلیک یا لمس کنید",
    spectatorView: "دیدگاه تماشاگر",
    langToggle: "English",
    controls: "کنترل‌ها",
    seatNames: {
      center: "بخش مرکزی",
      left: "بخش چپ",
      right: "بخش راست",
      balcony: "بخش بالکن",
    },
    clickToEnter: "برای ورود به دیدگاه ضربه بزنید",
  },
  en: {
    centerSeats: "Center Seats",
    balcony: "Balcony",
    leftSide: "Left Side",
    rightSide: "Right Side",
    overview: "Overview",
    sectionPov: "Section POV:",
    pitchTilt: "Pitch Tilt:",
    elevation: "Elevation",
    distance: "Distance",
    orbitAngle: "Orbit Angle:",
    row: "Row",
    seat: "Seat",
    clickHint:
      "Tap or click any concert chair to enter spectator POV facing the stage",
    spectatorView: "Spectator View",
    langToggle: "فارسی",
    controls: "Controls",
    seatNames: {
      center: "Center Section",
      left: "Left Side Section",
      right: "Right Side Section",
      balcony: "Balcony Section",
    },
    clickToEnter: "Tap to enter POV",
  },
};

export default function ConcertPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [lang, setLang] = useState<"fa" | "en">("fa");
  const t = translations[lang];

  const [pitch, setPitch] = useState<number>(30);
  const [yaw, setYaw] = useState<number>(0);
  const [height, setHeight] = useState<number>(15);
  const [radius, setRadius] = useState<number>(45);
  const [showMobileControls, setShowMobileControls] = useState<boolean>(false);

  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    title: string;
    desc: string;
    x: number;
    y: number;
  }>({
    visible: false,
    title: "",
    desc: "",
    x: 0,
    y: 0,
  });

  const [selectedBadge, setSelectedBadge] = useState<{
    visible: boolean;
    title: string;
    subtitle: string;
  }>({
    visible: false,
    title: "",
    subtitle: "",
  });

  const refs = useRef<{
    scene?: THREE.Scene;
    camera?: THREE.PerspectiveCamera;
    renderer?: THREE.WebGLRenderer;
    raycaster?: THREE.Raycaster;
    mouse?: THREE.Vector2;
    frameMaterial?: THREE.MeshStandardMaterial;
    metalBaseMaterial?: THREE.MeshStandardMaterial;
    seatGroupMap: Map<string, THREE.Group>;
    raycastObjects: THREE.Object3D[];
    movingSpotlights: Array<{
      light: THREE.SpotLight;
      cone: THREE.Mesh;
      baseX: number;
      phase: number;
    }>;
    animatedLEDCanvas?: HTMLCanvasElement;
    animatedLEDTexture?: THREE.CanvasTexture;
    selectedSeatGroup: THREE.Group | null;
    hoveredSeatGroup: THREE.Group | null;
    currentTarget: THREE.Vector3;
    orbit: { radius: number; pitch: number; yaw: number; height: number };
    isMouseDown: boolean;
    previousMousePosition: { x: number; y: number };
    isTransitioning: boolean;
    transitionProgress: number;
    startCamPos: THREE.Vector3;
    targetCamPos: THREE.Vector3;
    startTarget: THREE.Vector3;
    endTarget: THREE.Vector3;
    animFrameId?: number;
  }>({
    seatGroupMap: new Map(),
    raycastObjects: [],
    movingSpotlights: [],
    selectedSeatGroup: null,
    hoveredSeatGroup: null,
    currentTarget: new THREE.Vector3(0, 2, -6),
    orbit: { radius: 45, pitch: 30, yaw: 0, height: 15 },
    isMouseDown: false,
    previousMousePosition: { x: 0, y: 0 },
    isTransitioning: false,
    transitionProgress: 0,
    startCamPos: new THREE.Vector3(),
    targetCamPos: new THREE.Vector3(),
    startTarget: new THREE.Vector3(),
    endTarget: new THREE.Vector3(),
  });

  const STAGE_TARGET = new THREE.Vector3(0, 3.5, -20);
  const INITIAL_ORBIT_TARGET = new THREE.Vector3(0, 2, -6);

  const SPECTATOR_POVS: Record<
    string,
    { camPos: THREE.Vector3; target: THREE.Vector3 }
  > = {
    center: {
      camPos: new THREE.Vector3(0, 5.5, 14.0),
      target: STAGE_TARGET,
    },
    balcony: {
      camPos: new THREE.Vector3(0, 16.0, 32.0),
      target: STAGE_TARGET,
    },
    left: {
      camPos: new THREE.Vector3(-28.0, 7.5, 3.0),
      target: STAGE_TARGET,
    },
    right: {
      camPos: new THREE.Vector3(28.0, 7.5, 3.0),
      target: STAGE_TARGET,
    },
    overview: {
      camPos: new THREE.Vector3(0, 24.5, 32.97),
      target: INITIAL_ORBIT_TARGET,
    },
  };

  const COLOR_NEUTRAL = 0x2563eb;
  const COLOR_HOVER = 0x60a5fa;
  const COLOR_SELECTED = 0xf59e0b;
  const COLOR_FRAME = 0x1e293b;
  const COLOR_BASE_METAL = 0x0f172a;

  const updateCameraFromOrbit = () => {
    const { camera, currentTarget, orbit } = refs.current;
    if (!camera) return;

    const pitchRad = THREE.MathUtils.degToRad(90 - orbit.pitch);
    const yawRad = THREE.MathUtils.degToRad(orbit.yaw);

    const x = orbit.radius * Math.sin(pitchRad) * Math.sin(yawRad);
    const y = orbit.radius * Math.cos(pitchRad) + (orbit.height - 15);
    const z = orbit.radius * Math.sin(pitchRad) * Math.cos(yawRad);

    camera.position.set(
      currentTarget.x + x,
      currentTarget.y + y,
      currentTarget.z + z,
    );

    camera.lookAt(currentTarget);
  };

  const syncSlidersUI = () => {
    const { orbit } = refs.current;
    setPitch(orbit.pitch);
    setYaw(orbit.yaw);
    setRadius(orbit.radius);
    setHeight(orbit.height);
  };

  const syncOrbitFromCamera = () => {
    const { camera, currentTarget, orbit } = refs.current;
    if (!camera) return;

    const offset = new THREE.Vector3().subVectors(
      camera.position,
      currentTarget,
    );
    const baseHeight = 15;

    orbit.radius = offset.length();

    const pitchRad = Math.asin(
      Math.max(-1, Math.min(1, offset.y / (orbit.radius || 1))),
    );
    orbit.pitch = THREE.MathUtils.radToDeg(pitchRad);
    orbit.pitch = Math.max(2, Math.min(85, orbit.pitch));

    const yawRad = Math.atan2(offset.x, offset.z);
    orbit.yaw = THREE.MathUtils.radToDeg(yawRad);

    orbit.height = baseHeight;

    syncSlidersUI();
  };

  const triggerCameraTransition = (
    destCamPos: THREE.Vector3,
    destTargetPos: THREE.Vector3,
  ) => {
    const r = refs.current;
    if (!r.camera) return;

    r.startCamPos.copy(r.camera.position);
    r.targetCamPos.copy(destCamPos);
    r.startTarget.copy(r.currentTarget);
    r.endTarget.copy(destTargetPos);

    r.transitionProgress = 0;
    r.isTransitioning = true;
  };

  const clearSelectedSeatHighlighting = () => {
    const r = refs.current;
    if (r.selectedSeatGroup) {
      r.selectedSeatGroup.userData.cushionMaterial.color.setHex(COLOR_NEUTRAL);
      r.selectedSeatGroup = null;
    }
  };

  const jumpToPOV = (section: string) => {
    const pov = SPECTATOR_POVS[section];
    if (!pov) return;

    clearSelectedSeatHighlighting();
    setSelectedBadge((prev) => ({ ...prev, visible: false }));

    triggerCameraTransition(pov.camPos, pov.target);
  };

  const clearSelectedSeat = () => {
    clearSelectedSeatHighlighting();
    setSelectedBadge((prev) => ({ ...prev, visible: false }));
    jumpToPOV("overview");
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const r = refs.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfbf8f3);
    scene.fog = new THREE.FogExp2(0xfbf8f3, 0.003);
    r.scene = scene;

    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 1000);
    r.camera = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    r.renderer = renderer;

    r.raycaster = new THREE.Raycaster();
    r.mouse = new THREE.Vector2();

    r.frameMaterial = new THREE.MeshStandardMaterial({
      color: COLOR_FRAME,
      roughness: 0.4,
      metalness: 0.7,
    });

    r.metalBaseMaterial = new THREE.MeshStandardMaterial({
      color: COLOR_BASE_METAL,
      roughness: 0.3,
      metalness: 0.8,
    });

    const ambientLight = new THREE.AmbientLight(0xffedd5, 0.85);
    scene.add(ambientLight);

    const fillLight = new THREE.DirectionalLight(0xfff7ed, 0.6);
    fillLight.position.set(0, 40, 50);
    scene.add(fillLight);

    const mainLight = new THREE.DirectionalLight(0xfffbeb, 0.95);
    mainLight.position.set(25, 45, 20);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 5;
    mainLight.shadow.camera.far = 120;
    mainLight.shadow.camera.left = -40;
    mainLight.shadow.camera.right = 40;
    mainLight.shadow.camera.top = 40;
    mainLight.shadow.camera.bottom = -40;
    mainLight.shadow.bias = -0.0005;
    scene.add(mainLight);

    const floorGeo = new THREE.PlaneGeometry(140, 140);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xf3ede2,
      roughness: 0.85,
      metalness: 0.1,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const grid = new THREE.GridHelper(140, 45, 0xd7ccc8, 0xe6dfd5);
    grid.position.y = 0.01;
    scene.add(grid);

    const stageGroup = new THREE.Group();

    const stageDeckGeo = new THREE.BoxGeometry(36, 2.6, 15);
    const stageDeckMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      roughness: 0.35,
      metalness: 0.5,
    });
    const stageDeck = new THREE.Mesh(stageDeckGeo, stageDeckMat);
    stageDeck.position.set(0, 1.3, -20);
    stageDeck.castShadow = true;
    stageDeck.receiveShadow = true;
    stageGroup.add(stageDeck);

    const trimGeo = new THREE.BoxGeometry(36.4, 0.25, 15.4);
    const trimMat = new THREE.MeshStandardMaterial({
      color: 0xea580c,
      roughness: 0.2,
      metalness: 0.9,
    });
    const trimMesh = new THREE.Mesh(trimGeo, trimMat);
    trimMesh.position.set(0, 2.5, -20);
    stageGroup.add(trimMesh);

    [-10, 0, 10].forEach((stepX) => {
      for (let s = 0; s < 3; s++) {
        const stepGeo = new THREE.BoxGeometry(4, 0.4, 0.8);
        const stepMat = new THREE.MeshStandardMaterial({
          color: 0x475569,
          roughness: 0.5,
        });
        const stepMesh = new THREE.Mesh(stepGeo, stepMat);
        stepMesh.position.set(stepX, 0.3 + s * 0.4, -12.1 + s * 0.7);
        stepMesh.castShadow = true;
        stepMesh.receiveShadow = true;
        stageGroup.add(stepMesh);
      }
    });

    r.animatedLEDCanvas = document.createElement("canvas");
    r.animatedLEDCanvas.width = 512;
    r.animatedLEDCanvas.height = 256;
    r.animatedLEDTexture = new THREE.CanvasTexture(r.animatedLEDCanvas);

    const screenGeo = new THREE.PlaneGeometry(32, 14);
    const screenMat = new THREE.MeshBasicMaterial({
      map: r.animatedLEDTexture,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 10, -27.2);
    stageGroup.add(screenMesh);

    [-21, 21].forEach((sideX, idx) => {
      const sideScreenGeo = new THREE.PlaneGeometry(7, 10);
      const sideScreenMat = new THREE.MeshBasicMaterial({
        map: r.animatedLEDTexture,
      });
      const sideScreenMesh = new THREE.Mesh(sideScreenGeo, sideScreenMat);
      sideScreenMesh.position.set(sideX, 8.5, -21);
      sideScreenMesh.rotation.y = idx === 0 ? 0.35 : -0.35;
      stageGroup.add(sideScreenMesh);

      const sideFrameGeo = new THREE.BoxGeometry(7.4, 10.4, 0.4);
      const sideFrameMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        metalness: 0.8,
      });
      const sideFrame = new THREE.Mesh(sideFrameGeo, sideFrameMat);
      sideFrame.position.set(sideX, 8.5, -21.2);
      sideFrame.rotation.y = idx === 0 ? 0.35 : -0.35;
      stageGroup.add(sideFrame);
    });

    const trussMat = new THREE.MeshStandardMaterial({
      color: 0x64748b,
      metalness: 0.9,
      roughness: 0.2,
    });

    [
      [-17.5, -13],
      [17.5, -13],
      [-17.5, -26],
      [17.5, -26],
    ].forEach((pos) => {
      const colGeo = new THREE.CylinderGeometry(0.35, 0.35, 20, 10);
      const col = new THREE.Mesh(colGeo, trussMat);
      col.position.set(pos[0], 10, pos[1]);
      col.castShadow = true;
      stageGroup.add(col);
    });

    [-13, -26].forEach((zPos) => {
      const beamGeo = new THREE.BoxGeometry(36, 0.7, 0.7);
      const beam = new THREE.Mesh(beamGeo, trussMat);
      beam.position.set(0, 19.5, zPos);
      beam.castShadow = true;
      stageGroup.add(beam);
    });

    [-17.5, 17.5].forEach((xPos) => {
      const sideBeamGeo = new THREE.BoxGeometry(0.7, 0.7, 14);
      const sideBeam = new THREE.Mesh(sideBeamGeo, trussMat);
      sideBeam.position.set(xPos, 19.5, -19.5);
      sideBeam.castShadow = true;
      stageGroup.add(sideBeam);
    });

    [-19.5, 19.5].forEach((arrayX) => {
      const arrayGroup = new THREE.Group();
      arrayGroup.position.set(arrayX, 13.5, -14);
      arrayGroup.rotation.y = arrayX < 0 ? 0.25 : -0.25;

      for (let i = 0; i < 5; i++) {
        const speakerGeo = new THREE.BoxGeometry(1.8, 0.8, 1.4);
        const speakerMat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          roughness: 0.4,
          metalness: 0.6,
        });
        const speaker = new THREE.Mesh(speakerGeo, speakerMat);
        speaker.position.set(0, -i * 0.9, (4 - i) * 0.08);
        speaker.rotation.x = 0.08;
        speaker.castShadow = true;
        arrayGroup.add(speaker);
      }
      stageGroup.add(arrayGroup);
    });

    [-12, -8, 8, 12].forEach((subX) => {
      const subGeo = new THREE.BoxGeometry(2.2, 1.8, 1.8);
      const subMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.6,
      });
      const sub = new THREE.Mesh(subGeo, subMat);
      sub.position.set(subX, 3.5, -13.2);
      sub.castShadow = true;
      stageGroup.add(sub);
    });

    [-6, 0, 6].forEach((monX) => {
      const monGeo = new THREE.BoxGeometry(1.4, 0.6, 1.0);
      const monMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.5,
      });
      const mon = new THREE.Mesh(monGeo, monMat);
      mon.position.set(monX, 2.9, -14.2);
      mon.rotation.x = -0.3;
      mon.castShadow = true;
      stageGroup.add(mon);
    });

    const micStandGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8);
    const micMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.9,
    });
    const micStand = new THREE.Mesh(micStandGeo, micMat);
    micStand.position.set(0, 3.7, -15.5);
    micStand.castShadow = true;
    stageGroup.add(micStand);

    const micHeadGeo = new THREE.SphereGeometry(0.12, 12, 12);
    const micHead = new THREE.Mesh(micHeadGeo, micMat);
    micHead.position.set(0, 4.8, -15.5);
    stageGroup.add(micHead);

    const drumRiserGeo = new THREE.BoxGeometry(6, 0.6, 5);
    const drumRiserMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.4,
    });
    const drumRiser = new THREE.Mesh(drumRiserGeo, drumRiserMat);
    drumRiser.position.set(0, 2.9, -22);
    drumRiser.castShadow = true;
    stageGroup.add(drumRiser);

    const bassDrumGeo = new THREE.CylinderGeometry(1.1, 1.1, 1.2, 16);
    const drumMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.3,
      metalness: 0.7,
    });
    const bassDrum = new THREE.Mesh(bassDrumGeo, drumMat);
    bassDrum.rotation.x = Math.PI / 2;
    bassDrum.position.set(0, 4.3, -22);
    bassDrum.castShadow = true;
    stageGroup.add(bassDrum);

    [-1.8, 1.8].forEach((cymbalX) => {
      const cymbalStandGeo = new THREE.CylinderGeometry(0.03, 0.03, 2.5, 8);
      const cymbalStand = new THREE.Mesh(cymbalStandGeo, micMat);
      cymbalStand.position.set(cymbalX, 4.8, -22);
      stageGroup.add(cymbalStand);

      const cymbalGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.02, 16);
      const cymbalMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.95,
        roughness: 0.1,
      });
      const cymbal = new THREE.Mesh(cymbalGeo, cymbalMat);
      cymbal.position.set(cymbalX, 6.0, -22);
      stageGroup.add(cymbal);
    });

    const spotlightColors = [0x38bdf8, 0xa855f7, 0xf59e0b, 0x06b6d4, 0xec4899];
    const spotPositions = [-12, -6, 0, 6, 12];

    spotPositions.forEach((posX, idx) => {
      const spotColor = spotlightColors[idx % spotlightColors.length];

      const spotFixtureGeo = new THREE.CylinderGeometry(0.35, 0.55, 1.2, 12);
      const spotFixtureMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.8,
      });
      const spotFixture = new THREE.Mesh(spotFixtureGeo, spotFixtureMat);
      spotFixture.position.set(posX, 19.0, -13.5);
      spotFixture.rotation.x = Math.PI / 4;
      stageGroup.add(spotFixture);

      const spotLight = new THREE.SpotLight(spotColor, 4.5);
      spotLight.position.set(posX, 19.0, -13.5);
      spotLight.target.position.set(posX * 0.4, 2.6, -18);
      spotLight.angle = 0.45;
      spotLight.penumbra = 0.6;
      spotLight.decay = 1.2;
      spotLight.distance = 50;
      spotLight.castShadow = true;
      spotLight.shadow.mapSize.width = 1024;
      spotLight.shadow.mapSize.height = 1024;
      stageGroup.add(spotLight);
      stageGroup.add(spotLight.target);

      const coneGeo = new THREE.CylinderGeometry(0.2, 3.8, 18, 16, 1, true);
      const coneMat = new THREE.MeshBasicMaterial({
        color: spotColor,
        transparent: true,
        opacity: 0.18,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.set(posX, 10.5, -15.8);
      cone.rotation.x = -Math.PI / 8;
      stageGroup.add(cone);

      r.movingSpotlights.push({
        light: spotLight,
        cone: cone,
        baseX: posX,
        phase: idx * 1.2,
      });
    });

    scene.add(stageGroup);

    const seatBaseGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.35, 12);
    const pedPlateGeo = new THREE.CylinderGeometry(0.25, 0.28, 0.06, 12);
    const cushionGeo = new THREE.BoxGeometry(1.05, 0.18, 0.95);
    const backrestGeo = new THREE.BoxGeometry(0.98, 0.95, 0.14);
    const headrestGeo = new THREE.BoxGeometry(0.82, 0.28, 0.16);
    const armSupportGeo = new THREE.BoxGeometry(0.06, 0.45, 0.6);
    const armPadGeo = new THREE.BoxGeometry(0.12, 0.06, 0.8);
    const hitBoxGeo = new THREE.BoxGeometry(1.2, 1.4, 1.2);
    const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });

    function createConcertChair(
      x: number,
      y: number,
      z: number,
      section: string,
      row: number,
      col: number,
    ) {
      const id = `${section}-R${row}-C${col}`;
      const chairGroup = new THREE.Group();
      chairGroup.position.set(x, y, z);

      chairGroup.lookAt(STAGE_TARGET.x, y, STAGE_TARGET.z);

      const cushionMat = new THREE.MeshStandardMaterial({
        color: COLOR_NEUTRAL,
        roughness: 0.5,
        metalness: 0.1,
      });

      const pedPlate = new THREE.Mesh(pedPlateGeo, r.metalBaseMaterial);
      pedPlate.position.set(0, 0.03, 0);
      pedPlate.receiveShadow = true;
      chairGroup.add(pedPlate);

      const seatBase = new THREE.Mesh(seatBaseGeo, r.metalBaseMaterial);
      seatBase.position.set(0, 0.22, 0);
      seatBase.castShadow = true;
      chairGroup.add(seatBase);

      const cushion = new THREE.Mesh(cushionGeo, cushionMat);
      cushion.position.set(0, 0.42, 0.05);
      cushion.rotation.x = THREE.MathUtils.degToRad(3);
      cushion.castShadow = true;
      cushion.receiveShadow = true;
      chairGroup.add(cushion);

      const backrest = new THREE.Mesh(backrestGeo, cushionMat);
      backrest.position.set(0, 0.92, -0.38);
      backrest.rotation.x = THREE.MathUtils.degToRad(-12);
      backrest.castShadow = true;
      backrest.receiveShadow = true;
      chairGroup.add(backrest);

      const headrest = new THREE.Mesh(headrestGeo, cushionMat);
      headrest.position.set(0, 1.42, -0.48);
      headrest.rotation.x = THREE.MathUtils.degToRad(-12);
      headrest.castShadow = true;
      headrest.receiveShadow = true;
      chairGroup.add(headrest);

      [-0.52, 0.52].forEach((sideX) => {
        const armSupport = new THREE.Mesh(armSupportGeo, r.frameMaterial);
        armSupport.position.set(sideX, 0.55, -0.05);
        armSupport.castShadow = true;
        chairGroup.add(armSupport);

        const armPad = new THREE.Mesh(armPadGeo, r.frameMaterial);
        armPad.position.set(sideX, 0.78, -0.02);
        armPad.castShadow = true;
        chairGroup.add(armPad);
      });

      const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
      hitBox.position.set(0, 0.7, 0);
      chairGroup.add(hitBox);

      chairGroup.userData = {
        id: id,
        section: section,
        row: row,
        col: col,
        isSeat: true,
        cushionMaterial: cushionMat,
      };

      hitBox.userData = chairGroup.userData;

      scene.add(chairGroup);
      r.seatGroupMap.set(id, chairGroup);
      r.raycastObjects.push(hitBox);
    }

    for (let rIdx = 1; rIdx <= 5; rIdx++) {
      for (let c = 1; c <= 10; c++) {
        const x = (c - 5.5) * 1.8;
        const z = -7 + rIdx * 2.0;
        const y = rIdx * 0.15;
        createConcertChair(x, y, z, "center", rIdx, c);
      }
    }

    for (let rIdx = 1; rIdx <= 4; rIdx++) {
      for (let c = 1; c <= 5; c++) {
        const angle = 0.4 + c * 0.08;
        const radiusVal = 13 + rIdx * 2.0;
        const x = -Math.cos(angle) * radiusVal - 1;
        const z = Math.sin(angle) * radiusVal - 15;
        const y = rIdx * 0.2;
        createConcertChair(x, y, z, "left", rIdx, c);
      }
    }

    for (let rIdx = 1; rIdx <= 4; rIdx++) {
      for (let c = 1; c <= 5; c++) {
        const angle = 0.4 + (6 - c) * 0.08;
        const radiusVal = 13 + rIdx * 2.0;
        const x = Math.cos(angle) * radiusVal + 1;
        const z = Math.sin(angle) * radiusVal - 15;
        const y = rIdx * 0.2;
        createConcertChair(x, y, z, "right", rIdx, c);
      }
    }

    const balconyFloorGeo = new THREE.BoxGeometry(26, 0.8, 12);
    const balconyFloorMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.6,
    });
    const balconyFloor = new THREE.Mesh(balconyFloorGeo, balconyFloorMat);
    balconyFloor.position.set(0, 6.5, 14);
    balconyFloor.receiveShadow = true;
    scene.add(balconyFloor);

    const railGeo = new THREE.BoxGeometry(26, 1.8, 0.2);
    const railMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.4,
      roughness: 0.1,
      transmission: 0.9,
    });
    const rail = new THREE.Mesh(railGeo, railMat);
    rail.position.set(0, 7.8, 7.9);
    scene.add(rail);

    for (let rIdx = 1; rIdx <= 4; rIdx++) {
      for (let c = 1; c <= 10; c++) {
        const x = (c - 5.5) * 2.0;
        const z = 9 + rIdx * 2.0;
        const y = 6.9 + rIdx * 0.35;
        createConcertChair(x, y, z, "balcony", rIdx, c);
      }
    }

    updateCameraFromOrbit();

    const updateStageVisuals = (time: number) => {
      if (r.animatedLEDCanvas && r.animatedLEDTexture) {
        const ctx = r.animatedLEDCanvas.getContext("2d");
        if (ctx) {
          const w = r.animatedLEDCanvas.width;
          const h = r.animatedLEDCanvas.height;

          const grad = ctx.createLinearGradient(0, 0, w, h);
          const t = time * 0.0015;
          const c1 = `hsl(${(t * 40) % 360}, 90%, 50%)`;
          const c2 = `hsl(${(t * 40 + 120) % 360}, 90%, 45%)`;
          const c3 = `hsl(${(t * 40 + 240) % 360}, 90%, 35%)`;

          grad.addColorStop(0, c1);
          grad.addColorStop(0.5, c2);
          grad.addColorStop(1, c3);

          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
          const bars = 32;
          const barWidth = w / bars;
          for (let i = 0; i < bars; i++) {
            const barHeight =
              (Math.sin(time * 0.004 + i * 0.3) * 0.4 + 0.5) * h * 0.7;
            ctx.fillRect(
              i * barWidth + 2,
              h - barHeight,
              barWidth - 4,
              barHeight,
            );
          }

          r.animatedLEDTexture.needsUpdate = true;
        }
      }

      r.movingSpotlights.forEach((spot) => {
        const offset = Math.sin(time * 0.002 + spot.phase) * 6;
        spot.light.target.position.x = spot.baseX + offset;
        spot.cone.rotation.z = -offset * 0.04;
      });
    };

    const animate = (time = 0) => {
      r.animFrameId = requestAnimationFrame(animate);

      updateStageVisuals(time);

      if (r.isTransitioning && r.camera) {
        r.transitionProgress += 0.04;
        if (r.transitionProgress >= 1.0) {
          r.transitionProgress = 1.0;
          r.isTransitioning = false;
        }

        const t =
          r.transitionProgress *
          r.transitionProgress *
          (3 - 2 * r.transitionProgress);

        r.camera.position.lerpVectors(r.startCamPos, r.targetCamPos, t);
        r.currentTarget.lerpVectors(r.startTarget, r.endTarget, t);
        r.camera.lookAt(r.currentTarget);

        syncOrbitFromCamera();
      }

      if (r.renderer && r.scene && r.camera) {
        r.renderer.render(r.scene, r.camera);
      }
    };

    animate();

    const handleResize = () => {
      if (!container || !r.camera || !r.renderer) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      r.camera.aspect = width / height;
      r.camera.updateProjectionMatrix();
      r.renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (r.animFrameId) cancelAnimationFrame(r.animFrameId);
      if (r.renderer) {
        r.renderer.dispose();
        if (container.contains(r.renderer.domElement)) {
          container.removeChild(r.renderer.domElement);
        }
      }
    };
  }, []);

  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    refs.current.isTransitioning = false;
    const val = parseFloat(e.target.value);
    refs.current.orbit.pitch = val;
    setPitch(val);
    updateCameraFromOrbit();
  };

  const handleYawChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    refs.current.isTransitioning = false;
    const val = parseFloat(e.target.value);
    refs.current.orbit.yaw = val;
    setYaw(val);
    updateCameraFromOrbit();
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    refs.current.isTransitioning = false;
    const val = parseFloat(e.target.value);
    refs.current.orbit.height = val;
    setHeight(val);
    updateCameraFromOrbit();
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    refs.current.isTransitioning = false;
    const val = parseFloat(e.target.value);
    refs.current.orbit.radius = val;
    setRadius(val);
    updateCameraFromOrbit();
  };

  const handlePointerDown = (clientX: number, clientY: number) => {
    const r = refs.current;
    r.isMouseDown = true;
    r.isTransitioning = false;
    r.previousMousePosition = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    refs.current.isMouseDown = false;
  };

  const handlePointerMove = (
    clientX: number,
    clientY: number,
    targetElement: HTMLElement,
  ) => {
    const r = refs.current;
    if (!r.camera || !r.raycaster || !r.mouse) return;

    if (r.isMouseDown) {
      const deltaX = clientX - r.previousMousePosition.x;
      const deltaY = clientY - r.previousMousePosition.y;

      r.orbit.yaw += deltaX * 0.4;
      r.orbit.pitch += deltaY * 0.3;

      r.orbit.pitch = Math.max(2, Math.min(85, r.orbit.pitch));
      if (r.orbit.yaw > 180) r.orbit.yaw -= 360;
      if (r.orbit.yaw < -180) r.orbit.yaw += 360;

      syncSlidersUI();
      updateCameraFromOrbit();

      r.previousMousePosition = { x: clientX, y: clientY };
    } else {
      const rect = targetElement.getBoundingClientRect();
      r.mouse.x = ((clientX - rect.left) / targetElement.clientWidth) * 2 - 1;
      r.mouse.y = -((clientY - rect.top) / targetElement.clientHeight) * 2 + 1;

      r.raycaster.setFromCamera(r.mouse, r.camera);
      const intersects = r.raycaster.intersectObjects(r.raycastObjects);

      let foundSeatGroup: THREE.Group | null = null;

      if (intersects.length > 0) {
        const hitObj = intersects[0].object;
        if (hitObj.userData && hitObj.userData.isSeat) {
          foundSeatGroup = r.seatGroupMap.get(hitObj.userData.id) || null;
        }
      }

      if (r.hoveredSeatGroup && r.hoveredSeatGroup !== foundSeatGroup) {
        if (r.hoveredSeatGroup !== r.selectedSeatGroup) {
          r.hoveredSeatGroup.userData.cushionMaterial.color.setHex(
            COLOR_NEUTRAL,
          );
        }
        r.hoveredSeatGroup = null;
        setTooltip((prev) => ({ ...prev, visible: false }));
      }

      if (foundSeatGroup) {
        r.hoveredSeatGroup = foundSeatGroup;

        if (foundSeatGroup !== r.selectedSeatGroup) {
          r.hoveredSeatGroup.userData.cushionMaterial.color.setHex(COLOR_HOVER);
        }

        const u = foundSeatGroup.userData;
        const sectionName =
          t.seatNames[u.section as keyof typeof t.seatNames] || u.section;

        setTooltip({
          visible: true,
          title: sectionName,
          desc: `${t.row} ${u.row} • ${t.seat} ${u.col} (${t.clickToEnter})`,
          x: clientX - rect.left,
          y: clientY - rect.top,
        });
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handlePointerDown(e.clientX, e.clientY);
  };
  const handleMouseUp = () => {
    handlePointerUp();
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      handlePointerMove(e.clientX, e.clientY, containerRef.current);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
    }
  };
  const handleTouchEnd = () => {
    handlePointerUp();
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && containerRef.current) {
      handlePointerMove(
        e.touches[0].clientX,
        e.touches[0].clientY,
        containerRef.current,
      );
    }
  };

  const handleCanvasClick = () => {
    const r = refs.current;
    if (r.hoveredSeatGroup) {
      clearSelectedSeatHighlighting();

      r.selectedSeatGroup = r.hoveredSeatGroup;
      r.selectedSeatGroup.userData.cushionMaterial.color.setHex(COLOR_SELECTED);

      const u = r.selectedSeatGroup.userData;
      const seatPos = r.selectedSeatGroup.position.clone();
      const sectionName =
        t.seatNames[u.section as keyof typeof t.seatNames] || u.section;

      const seatTarget = new THREE.Vector3(
        seatPos.x * 0.25,
        STAGE_TARGET.y,
        STAGE_TARGET.z,
      );

      const dirToStage = new THREE.Vector3()
        .subVectors(seatTarget, seatPos)
        .normalize();

      const isMobile = window.innerWidth < 768;
      const distMultiplier = isMobile ? 4.0 : 2.2;
      const heightOffset = isMobile ? 2.8 : 2.2;

      const seatCamPos = seatPos
        .clone()
        .sub(dirToStage.clone().multiplyScalar(distMultiplier))
        .add(new THREE.Vector3(0, heightOffset, 0));

      setSelectedBadge({
        visible: true,
        title: sectionName,
        subtitle: `${t.row} ${u.row} • ${t.seat} ${u.col} (${t.spectatorView})`,
      });

      triggerCameraTransition(seatCamPos, seatTarget);
    }
  };

  const toggleLanguage = () => {
    setLang((prev) => (prev === "fa" ? "en" : "fa"));
  };

  return (
    <div
      dir={lang === "fa" ? "rtl" : "ltr"}
      className="h-screen w-screen bg-stone-50 flex flex-col justify-center items-center p-0 m-0 overflow-hidden font-sans select-none text-stone-800 box-border"
    >
      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          width: 100vw;
          height: 100vh;
        }
        input[type="range"] {
          -webkit-appearance: none;
          background: transparent;
        }
        input[type="range"]:focus {
          outline: none;
        }
        input[type="range"]::-webkit-slider-runnable-track {
          width: 100%;
          height: 6px;
          cursor: pointer;
          background: #e7e5e4;
          border-radius: 9999px;
          transition: background 0.2s;
        }
        input[type="range"]::-webkit-slider-runnable-track:hover {
          background: #d6d3d1;
        }
        input[type="range"]::-webkit-slider-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: #ea580c;
          cursor: pointer;
          -webkit-appearance: none;
          margin-top: -6px;
          box-shadow: 0 2px 5px rgba(234, 88, 12, 0.35);
          transition:
            transform 0.15s ease,
            background-color 0.15s ease;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.25);
          background: #c2410c;
        }
        .vertical-slider {
          transform: rotate(-90deg);
          transform-origin: center center;
        }
        ::selection {
          background: #fed7aa;
          color: #9a3412;
        }
      `}</style>

      <div className="relative w-full h-full bg-stone-50 flex flex-col overflow-hidden select-none box-border">
        <div className="absolute top-2.5 end-3 z-40 flex items-center gap-2">
          <button
            onClick={() => setShowMobileControls((prev) => !prev)}
            className="md:hidden px-3 py-1.5 text-xs font-bold rounded-full bg-stone-800 hover:bg-stone-900 text-white shadow-md transition-all active:scale-95 flex items-center gap-1.5"
          >
            <i className="fa-solid fa-sliders"></i> {t.controls}
          </button>

          <button
            onClick={toggleLanguage}
            className="px-3.5 py-1.5 text-xs font-bold rounded-full bg-orange-600 hover:bg-orange-700 text-white shadow-md transition-all active:scale-95 flex items-center gap-1.5"
          >
            <i className="fa-solid fa-globe"></i> {t.langToggle}
          </button>
        </div>

        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 max-w-[92vw] overflow-x-auto no-scrollbar bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-stone-200 flex items-center space-x-1 space-x-reverse transition-all whitespace-nowrap">
          <span className="text-xs font-semibold text-stone-600 mx-1.5 hidden sm:flex items-center gap-1">
            <i className="fa-solid fa-eye text-orange-600"></i> {t.sectionPov}
          </span>
          <button
            onClick={() => jumpToPOV("center")}
            className="px-3 py-1 text-xs font-semibold rounded-full bg-stone-100 hover:bg-orange-600 hover:text-white text-stone-700 transition-all shadow-2xs active:scale-95"
          >
            {t.centerSeats}
          </button>
          <button
            onClick={() => jumpToPOV("balcony")}
            className="px-3 py-1 text-xs font-semibold rounded-full bg-stone-100 hover:bg-orange-600 hover:text-white text-stone-700 transition-all shadow-2xs active:scale-95"
          >
            {t.balcony}
          </button>
          <button
            onClick={() => jumpToPOV("left")}
            className="px-3 py-1 text-xs font-semibold rounded-full bg-stone-100 hover:bg-orange-600 hover:text-white text-stone-700 transition-all shadow-2xs active:scale-95"
          >
            {t.leftSide}
          </button>
          <button
            onClick={() => jumpToPOV("right")}
            className="px-3 py-1 text-xs font-semibold rounded-full bg-stone-100 hover:bg-orange-600 hover:text-white text-stone-700 transition-all shadow-2xs active:scale-95"
          >
            {t.rightSide}
          </button>
          <button
            onClick={() => jumpToPOV("overview")}
            className="px-2.5 py-1 text-xs font-medium rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition mx-1 border-s border-stone-200 ps-2.5"
          >
            <i className="fa-solid fa-rotate-left mr-1"></i> {t.overview}
          </button>
        </div>

        <div className="hidden md:flex w-full bg-white/80 backdrop-blur border-b border-stone-200 px-8 py-2 items-center justify-center space-x-3 space-x-reverse z-20 shadow-xs shrink-0 box-border">
          <i className="fa-solid fa-arrows-up-down text-orange-600 text-xs"></i>
          <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider w-32 text-start">
            {t.pitchTilt}
          </span>
          <input
            id="slider-pitch"
            type="range"
            min="2"
            max="85"
            value={pitch}
            onChange={handlePitchChange}
            className="w-1/3 max-w-sm"
          />
          <span
            id="val-pitch"
            className="text-xs font-mono font-bold text-orange-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 w-12 text-center"
          >
            {Math.round(pitch)}°
          </span>
        </div>

        <div className="flex-1 flex relative overflow-hidden w-full">
          <div className="hidden md:flex w-12 bg-white/80 backdrop-blur border-e border-stone-200 flex-col items-center justify-center py-6 z-20 shrink-0 shadow-xs relative">
            <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider -rotate-90 whitespace-nowrap mb-8">
              {t.elevation}
            </span>
            <div className="h-48 w-8 flex items-center justify-center">
              <input
                id="slider-height"
                type="range"
                min="-10"
                max="40"
                value={height}
                onChange={handleHeightChange}
                className="vertical-slider w-44"
              />
            </div>
            <i className="fa-solid fa-up-down text-orange-600 text-xs pt-6"></i>
          </div>

          <div
            id="canvas-container"
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onClick={handleCanvasClick}
            className="flex-1 h-full relative cursor-grab active:cursor-grabbing bg-stone-50 overflow-hidden touch-none"
          >
            <div
              id="seat-tooltip"
              style={{
                left: `${tooltip.x}px`,
                top: `${tooltip.y}px`,
              }}
              className={`absolute ${
                tooltip.visible ? "" : "hidden"
              } z-40 bg-stone-900/95 text-white text-xs px-3.5 py-2 rounded-lg shadow-2xl border border-stone-700 pointer-events-none transform -translate-x-1/2 -translate-y-14 transition-opacity`}
            >
              <div id="tooltip-title" className="font-bold text-orange-400">
                {tooltip.title}
              </div>
              <div
                id="tooltip-desc"
                className="text-[11px] text-stone-300 mt-0.5"
              >
                {tooltip.desc}
              </div>
            </div>

            <div
              id="selected-seat-badge"
              className={`absolute top-16 md:top-5 start-4 z-30 bg-white/95 backdrop-blur px-3.5 py-2 rounded-xl border border-stone-200 shadow-md ${
                selectedBadge.visible ? "flex" : "hidden"
              } items-center gap-2.5 max-w-[85vw]`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 animate-pulse shrink-0"></div>
              <div className="overflow-hidden">
                <div
                  id="badge-title"
                  className="text-xs font-bold text-stone-900 truncate"
                >
                  {selectedBadge.title}
                </div>
                <div
                  id="badge-subtitle"
                  className="text-[10px] sm:text-[11px] text-stone-600 font-medium truncate"
                >
                  {selectedBadge.subtitle}
                </div>
              </div>
              <button
                onClick={clearSelectedSeat}
                className="ms-1 text-stone-400 hover:text-stone-700 text-xs p-1 shrink-0"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="absolute bottom-3 start-3 z-20 text-[10px] sm:text-[11px] text-stone-700 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg border border-stone-200 shadow-xs pointer-events-none flex items-center gap-2 font-medium max-w-[90vw]">
              <i className="fa-solid fa-chair text-orange-500 shrink-0"></i>
              <span className="truncate">{t.clickHint}</span>
            </div>
          </div>

          <div className="hidden md:flex w-12 bg-white/80 backdrop-blur border-s border-stone-200 flex-col items-center justify-center py-6 z-20 shrink-0 shadow-xs relative">
            <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider rotate-90 whitespace-nowrap mb-8">
              {t.distance}
            </span>
            <div className="h-48 w-8 flex items-center justify-center">
              <input
                id="slider-zoom"
                type="range"
                min="1"
                max="110"
                value={radius}
                onChange={handleZoomChange}
                className="vertical-slider w-44"
              />
            </div>
            <i className="fa-solid fa-magnifying-glass text-orange-600 text-xs pt-6"></i>
          </div>
        </div>

        <div className="hidden md:flex w-full bg-white/80 backdrop-blur border-t border-stone-200 px-8 py-2 items-center justify-center space-x-3 space-x-reverse z-20 shadow-xs shrink-0 box-border">
          <i className="fa-solid fa-arrows-left-right text-orange-600 text-xs"></i>
          <span className="text-xs font-semibold text-stone-700 uppercase tracking-wider w-32 text-start">
            {t.orbitAngle}
          </span>
          <input
            id="slider-yaw"
            type="range"
            min="-180"
            max="180"
            value={yaw}
            onChange={handleYawChange}
            className="w-1/3 max-w-sm"
          />
          <span
            id="val-yaw"
            className="text-xs font-mono font-bold text-orange-700 bg-stone-100 px-2 py-0.5 rounded border border-stone-200 w-12 text-center"
          >
            {Math.round(yaw)}°
          </span>
        </div>

        {showMobileControls && (
          <div className="absolute inset-x-0 bottom-0 z-50 bg-white/95 backdrop-blur-md border-t border-stone-200 p-4 shadow-2xl rounded-t-2xl flex flex-col space-y-4 md:hidden animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                <i className="fa-solid fa-sliders text-orange-600"></i>{" "}
                {t.controls}
              </span>
              <button
                onClick={() => setShowMobileControls(false)}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <div className="flex flex-col space-y-1">
              <div className="flex justify-between text-xs text-stone-600">
                <span>{t.pitchTilt}</span>
                <span className="font-mono font-bold text-orange-600">
                  {Math.round(pitch)}°
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="85"
                value={pitch}
                onChange={handlePitchChange}
                className="w-full"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <div className="flex justify-between text-xs text-stone-600">
                <span>{t.orbitAngle}</span>
                <span className="font-mono font-bold text-orange-600">
                  {Math.round(yaw)}°
                </span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={yaw}
                onChange={handleYawChange}
                className="w-full"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <div className="flex justify-between text-xs text-stone-600">
                <span>{t.distance}</span>
                <span className="font-mono font-bold text-orange-600">
                  {Math.round(radius)}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="110"
                value={radius}
                onChange={handleZoomChange}
                className="w-full"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <div className="flex justify-between text-xs text-stone-600">
                <span>{t.elevation}</span>
                <span className="font-mono font-bold text-orange-600">
                  {Math.round(height)}
                </span>
              </div>
              <input
                type="range"
                min="-10"
                max="40"
                value={height}
                onChange={handleHeightChange}
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
