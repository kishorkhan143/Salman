/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { soundEngine, generateRandomEqualizer, speakBirthdayGreeting } from './utils/soundEngine';
import { createBrushedGoldBumpTexture, createFrostingTexture } from './utils/proceduralTextures';
import { RoyalDoors } from './components/RoyalDoors';
import { WavyBanner } from './components/WavyBanner';
import { CelebrationControls } from './components/CelebrationControls';

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  flip: number;
  flipSpeed: number;
  gravity: number;
  drag: number;
  alpha: number;
  shape: 'rect' | 'circle' | 'streamer';
}

interface Firework3D {
  points: THREE.Points;
  velocities: { x: number; y: number; z: number }[];
  material: THREE.PointsMaterial;
}

interface SmokeParticle3D {
  mesh: THREE.Mesh;
  material: THREE.MeshBasicMaterial;
  vx: number;
  vy: number;
  vz: number;
  rotationSpeed: number;
}

export default function App() {
  const isAutostart = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('autostart') === '1';
  const [doorState, setDoorState] = useState<'closed' | 'opening' | 'opened'>(isAutostart ? 'opened' : 'closed');
  const [candlesLit, setCandlesLit] = useState(true);
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);
  const [equalizerBars, setEqualizerBars] = useState([25, 45, 30, 60, 40, 75, 35, 50]);

  const mountRef = useRef<HTMLDivElement>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const flamesRef = useRef<THREE.Mesh[]>([]);
  const flameLightsRef = useRef<THREE.PointLight[]>([]);
  const fireworks3DRef = useRef<Firework3D[]>([]);
  const smokeParticles3DRef = useRef<SmokeParticle3D[]>([]);
  const confettiParticlesRef = useRef<ConfettiParticle[]>([]);

  // ==========================================
  // REALISTIC 3D-TUMBLING CONFETTI CANNON
  // ==========================================
  const triggerConfettiBurst = (originX = window.innerWidth / 2, originY = window.innerHeight / 2, count = 90) => {
    const colors = [
      '#fbbf24', '#f59e0b', '#f43f5e', '#e11d48',
      '#38bdf8', '#0284c7', '#a855f7', '#10b981', '#ffffff'
    ];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 5 + Math.random() * 15;
      confettiParticlesRef.current.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 6,
        size: 7 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        flip: Math.random() * Math.PI,
        flipSpeed: 0.08 + Math.random() * 0.16,
        gravity: 0.24,
        drag: 0.985,
        alpha: 1,
        shape: Math.random() > 0.4 ? 'rect' : Math.random() > 0.5 ? 'streamer' : 'circle'
      });
    }
  };

  useEffect(() => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    let animId: number;
    const renderConfetti = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = confettiParticlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.flip += p.flipSpeed;
        p.alpha -= 0.0055;

        if (p.alpha <= 0 || p.y > canvas.height + 50) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);

        // 3D perspective flip effect: scale Y by cosine of flip angle
        const scaleY = Math.cos(p.flip);
        ctx.scale(1, scaleY);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.55);
        } else if (p.shape === 'streamer') {
          ctx.fillRect(-p.size / 2, -p.size * 0.75, p.size * 0.4, p.size * 1.5);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      animId = requestAnimationFrame(renderConfetti);
    };

    renderConfetti();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // ==========================================
  // REALISTIC THREE.JS 3D SCENE SETUP
  // ==========================================
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL safely
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 1. Scene, Camera, High-Performance PBR Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      48,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2.0, 11.0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Environment map for realistic reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 2. Realistic Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xfff7ed, 0.85);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xfff1d6, 1.4);
    mainKeyLight.position.set(5, 12, 7);
    mainKeyLight.castShadow = !isSoftwareGl;
    if (mainKeyLight.shadow) {
      mainKeyLight.shadow.mapSize.width = 1024;
      mainKeyLight.shadow.mapSize.height = 1024;
    }
    scene.add(mainKeyLight);

    const rimPinkLight = new THREE.PointLight(0xf43f5e, 2.2, 30);
    rimPinkLight.position.set(-8, 5, 3);
    scene.add(rimPinkLight);

    const rimBlueLight = new THREE.PointLight(0x38bdf8, 2.2, 30);
    rimBlueLight.position.set(8, -2, 4);
    scene.add(rimBlueLight);

    // 3. Realistic Multi-Part Composite Cake Group
    const cakeGroup = new THREE.Group();
    cakeGroup.position.set(0, -1.35, 0);
    scene.add(cakeGroup);

    // Textures
    const goldBump = createBrushedGoldBumpTexture();
    const frostingBump = createFrostingTexture();

    // Premium Polished Gold Stand Material
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.18,
      bumpMap: goldBump,
      bumpScale: 0.03
    });

    // Pedestal Base (Bottom plate + fluted column)
    const basePlateGeo = new THREE.CylinderGeometry(2.2, 2.5, 0.18, 48);
    const basePlate = new THREE.Mesh(basePlateGeo, goldMaterial);
    basePlate.position.y = -0.55;
    basePlate.receiveShadow = true;
    cakeGroup.add(basePlate);

    const stemGeo = new THREE.CylinderGeometry(0.85, 1.25, 0.45, 32);
    const stem = new THREE.Mesh(stemGeo, goldMaterial);
    stem.position.y = -0.3;
    cakeGroup.add(stem);

    // Top Stand Serving Plate with beveled rim
    const plateGeo = new THREE.CylinderGeometry(3.35, 3.1, 0.22, 64);
    const plate = new THREE.Mesh(plateGeo, goldMaterial);
    plate.position.y = -0.05;
    plate.receiveShadow = true;
    cakeGroup.add(plate);

    // Bottom Tier: Dark Imperial Chocolate Velvet
    const tier1Geo = new THREE.CylinderGeometry(2.6, 2.6, 1.35, 64);
    const tier1Mat = new THREE.MeshStandardMaterial({
      color: 0x24091f,
      roughness: 0.45,
      metalness: 0.1,
      bumpMap: frostingBump,
      bumpScale: 0.02
    });
    const tier1 = new THREE.Mesh(tier1Geo, tier1Mat);
    tier1.position.y = 0.65;
    tier1.castShadow = true;
    tier1.receiveShadow = true;
    cakeGroup.add(tier1);

    // Bottom Tier Gold Trim
    const trim1Geo = new THREE.TorusGeometry(2.61, 0.09, 16, 64);
    const trim1 = new THREE.Mesh(trim1Geo, goldMaterial);
    trim1.rotation.x = Math.PI / 2;
    trim1.position.y = 1.32;
    cakeGroup.add(trim1);

    // Bottom Tier Cream Pearl Beads along base
    const pearlGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const creamPearlMat = new THREE.MeshStandardMaterial({
      color: 0xfffbeb,
      roughness: 0.25
    });
    for (let i = 0; i < 28; i++) {
      const angle = (i / 28) * Math.PI * 2;
      const pearl = new THREE.Mesh(pearlGeo, creamPearlMat);
      pearl.position.set(Math.cos(angle) * 2.62, 0.08, Math.sin(angle) * 2.62);
      cakeGroup.add(pearl);
    }

    // Middle Tier: Royal Rose Berry Frosting
    const tier2Geo = new THREE.CylinderGeometry(1.95, 1.95, 1.15, 64);
    const tier2Mat = new THREE.MeshStandardMaterial({
      color: 0xa21caf,
      roughness: 0.35,
      metalness: 0.05,
      bumpMap: frostingBump,
      bumpScale: 0.02
    });
    const tier2 = new THREE.Mesh(tier2Geo, tier2Mat);
    tier2.position.y = 1.9;
    tier2.castShadow = true;
    tier2.receiveShadow = true;
    cakeGroup.add(tier2);

    // Middle Tier Sculpted Vanilla Cream Drip Ring
    const icingGeo = new THREE.TorusGeometry(1.96, 0.12, 16, 64);
    const icing = new THREE.Mesh(icingGeo, creamPearlMat);
    icing.rotation.x = Math.PI / 2;
    icing.position.y = 2.47;
    cakeGroup.add(icing);

    // Top Tier: Elegant Vanilla Cream with Gold Trim
    const tier3Geo = new THREE.CylinderGeometry(1.32, 1.32, 0.95, 64);
    const tier3Mat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      roughness: 0.3,
      metalness: 0.08,
      bumpMap: frostingBump,
      bumpScale: 0.02
    });
    const tier3 = new THREE.Mesh(tier3Geo, tier3Mat);
    tier3.position.y = 2.95;
    tier3.castShadow = true;
    tier3.receiveShadow = true;
    cakeGroup.add(tier3);

    // Top Tier Gold Pearl Rim
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const topPearl = new THREE.Mesh(pearlGeo, goldMaterial);
      topPearl.position.set(Math.cos(angle) * 1.33, 3.42, Math.sin(angle) * 1.33);
      cakeGroup.add(topPearl);
    }

    // 5 Realistic Candles on Top Tier
    const candlePositions = [
      [0, 0],
      [0.62, 0],
      [-0.62, 0],
      [0, 0.62],
      [0, -0.62]
    ];

    flamesRef.current = [];
    flameLightsRef.current = [];

    candlePositions.forEach(([cx, cz]) => {
      const candleGroup = new THREE.Group();
      candleGroup.position.set(cx, 3.42, cz);

      // Spiral Wax Candle Body
      const cGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.8, 20);
      const cMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.3,
        metalness: 0.1
      });
      const candleMesh = new THREE.Mesh(cGeo, cMat);
      candleMesh.position.y = 0.4;
      candleGroup.add(candleMesh);

      // Gold Filigree Stripe
      const stripeGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.16, 20);
      const stripeMesh = new THREE.Mesh(stripeGeo, goldMaterial);
      stripeMesh.position.y = 0.42;
      candleGroup.add(stripeMesh);

      // Candle Black Wick
      const wickGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.15, 8);
      const wickMat = new THREE.MeshBasicMaterial({ color: 0x1f2937 });
      const wickMesh = new THREE.Mesh(wickGeo, wickMat);
      wickMesh.position.y = 0.86;
      candleGroup.add(wickMesh);

      // Realistic Teardrop Flame Mesh (Outer Glow)
      const flameGeo = new THREE.ConeGeometry(0.12, 0.36, 24);
      const flameMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        transparent: true,
        opacity: 0.95
      });
      const flameMesh = new THREE.Mesh(flameGeo, flameMat);
      flameMesh.position.y = 1.02;
      candleGroup.add(flameMesh);
      flamesRef.current.push(flameMesh);

      // Inner White-Hot Flame Core
      const coreGeo = new THREE.ConeGeometry(0.05, 0.2, 16);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.y = -0.06;
      flameMesh.add(coreMesh);

      // Warm Point Light casting soft aura
      const fLight = new THREE.PointLight(0xff9900, 1.1, 6);
      fLight.position.y = 1.05;
      candleGroup.add(fLight);
      flameLightsRef.current.push(fLight);

      cakeGroup.add(candleGroup);
    });

    // 4. Realistic Floating 3D Balloons with Physics Sway
    const balloons: {
      group: THREE.Group;
      speedY: number;
      swayOffset: number;
      swaySpeed: number;
    }[] = [];
    const balloonColors = [0xf43f5e, 0xf59e0b, 0x38bdf8, 0xa855f7, 0x10b981, 0xf97316];
    const balloonGeo = new THREE.SphereGeometry(0.62, 32, 32);
    balloonGeo.scale(1, 1.2, 1);

    for (let i = 0; i < 20; i++) {
      const bGroup = new THREE.Group();
      const color = balloonColors[i % balloonColors.length];
      const bMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.12,
        metalness: 0.35
      });
      const bMesh = new THREE.Mesh(balloonGeo, bMat);
      bMesh.castShadow = true;
      bGroup.add(bMesh);

      // Realistic Tie Knot
      const knotGeo = new THREE.ConeGeometry(0.1, 0.14, 16);
      const knot = new THREE.Mesh(knotGeo, bMat);
      knot.position.y = -0.74;
      bGroup.add(knot);

      // Realistic Curving String Ribbon
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.74, 0),
        new THREE.Vector3(0.08, -1.2, 0.04),
        new THREE.Vector3(-0.06, -1.8, -0.04),
        new THREE.Vector3(0.04, -2.4, 0.02)
      ]);
      const stringGeo = new THREE.TubeGeometry(curve, 16, 0.012, 6, false);
      const stringMat = new THREE.MeshBasicMaterial({ color: 0xf1f5f9, transparent: true, opacity: 0.65 });
      const stringMesh = new THREE.Mesh(stringGeo, stringMat);
      bGroup.add(stringMesh);

      const side = i % 2 === 0 ? -1 : 1;
      bGroup.position.set(
        side * (3.8 + Math.random() * 5.8),
        -7 + Math.random() * 14,
        -1.8 - Math.random() * 6
      );

      scene.add(bGroup);
      balloons.push({
        group: bGroup,
        speedY: 0.014 + Math.random() * 0.016,
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: 0.9 + Math.random() * 1.1
      });
    }

    // 5. Starry Magical Space Dust Field
    const starCount = 550;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 44;
      starPositions[i + 1] = (Math.random() - 0.5) * 30;
      starPositions[i + 2] = -4 - Math.random() * 20;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 0.14,
      transparent: true,
      opacity: 0.85
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 6. Realistic Camera Parallax & Smooth Momentum Drag
    let targetX = 0;
    let targetY = 0;
    let isDragging = false;
    let prevX = 0;
    let cakeManualRotY = 0;
    let cakeRotVelocity = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      prevX = 'clientX' in e ? e.clientX : e.touches[0].clientX;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'clientX' in e ? e.clientX : e.touches[0]?.clientX || window.innerWidth / 2;
      const clientY = 'clientY' in e ? e.clientY : e.touches[0]?.clientY || window.innerHeight / 2;

      targetX = (clientX / window.innerWidth - 0.5) * 2.0;
      targetY = -(clientY / window.innerHeight - 0.5) * 1.3;

      if (isDragging) {
        const deltaX = clientX - prevX;
        cakeRotVelocity = deltaX * 0.008;
        cakeManualRotY += cakeRotVelocity;
        prevX = clientX;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    window.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // 7. Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    const clock = new THREE.Clock();
    let reqId: number;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Inertial decay for cake drag rotation
      if (!isDragging) {
        cakeRotVelocity *= 0.95;
        cakeManualRotY += cakeRotVelocity;
      }

      // Smooth realistic floating bob and slow auto-rotation
      cakeGroup.rotation.y = elapsed * 0.32 + cakeManualRotY;
      cakeGroup.position.y = -1.35 + Math.sin(elapsed * 1.5) * 0.1;

      // Realistic Candle Flame Flicker & Displacements
      flamesRef.current.forEach((flame, idx) => {
        if (flame.visible) {
          const flameFlicker = 0.92 + Math.sin(elapsed * 20 + idx * 2.5) * 0.14;
          flame.scale.set(flameFlicker, 0.88 + Math.cos(elapsed * 24 + idx) * 0.18, flameFlicker);
          flame.rotation.z = Math.sin(elapsed * 14 + idx) * 0.1;
        }
      });

      // Realistic Balloon Physics Sway
      balloons.forEach((b) => {
        b.group.position.y += b.speedY;
        b.group.position.x += Math.sin(elapsed * b.swaySpeed + b.swayOffset) * 0.009;
        b.group.rotation.z = Math.sin(elapsed * b.swaySpeed + b.swayOffset) * 0.09;
        if (b.group.position.y > 10) {
          b.group.position.y = -8.5;
        }
      });

      // Update 3D Fireworks with physics
      const fwList = fireworks3DRef.current;
      for (let i = fwList.length - 1; i >= 0; i--) {
        const fw = fwList[i];
        const posAttr = fw.points.geometry.attributes.position as THREE.BufferAttribute;
        const positions = posAttr.array as Float32Array;
        for (let j = 0; j < fw.velocities.length; j++) {
          positions[j * 3] += fw.velocities[j].x;
          positions[j * 3 + 1] += fw.velocities[j].y;
          positions[j * 3 + 2] += fw.velocities[j].z;
          fw.velocities[j].x *= 0.985;
          fw.velocities[j].y -= 0.0028;
          fw.velocities[j].z *= 0.985;
        }
        posAttr.needsUpdate = true;
        fw.material.opacity -= 0.015;

        if (fw.material.opacity <= 0) {
          scene.remove(fw.points);
          fw.points.geometry.dispose();
          fw.material.dispose();
          fwList.splice(i, 1);
        }
      }

      // Update 3D Smoke Puffs
      const smokeList = smokeParticles3DRef.current;
      for (let i = smokeList.length - 1; i >= 0; i--) {
        const s = smokeList[i];
        s.mesh.position.x += s.vx + Math.sin(elapsed * 4 + i) * 0.003;
        s.mesh.position.y += s.vy;
        s.mesh.position.z += s.vz;
        s.mesh.rotation.z += s.rotationSpeed;
        s.mesh.scale.multiplyScalar(1.025);
        s.material.opacity -= 0.011;

        if (s.material.opacity <= 0) {
          cakeGroup.remove(s.mesh);
          s.mesh.geometry.dispose();
          s.material.dispose();
          smokeList.splice(i, 1);
        }
      }

      // Drift starry background
      starField.rotation.y = elapsed * 0.02;

      // Smooth Camera Parallax Lerp
      camera.position.x += (targetX - camera.position.x) * 0.045;
      camera.position.y += (2.0 + targetY - camera.position.y) * 0.045;
      camera.lookAt(0, 0.4, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      renderer.dispose();
    };
  }, []);

  // Sync Candle Lit State with 3D Flame Meshes
  useEffect(() => {
    flamesRef.current.forEach((flame) => {
      flame.visible = candlesLit;
    });
    flameLightsRef.current.forEach((light) => {
      light.intensity = candlesLit ? 1.1 : 0;
    });
  }, [candlesLit]);

  // ==========================================
  // SPAWN REALISTIC 3D FIREWORK BURSTS
  // ==========================================
  const launch3DFirework = (customX?: number, customY?: number) => {
    const scene = sceneRef.current;
    if (!scene) return;

    const count = 110;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities: { x: number; y: number; z: number }[] = [];

    const x = customX !== undefined ? customX : (Math.random() - 0.5) * 11;
    const y = customY !== undefined ? customY : 1.6 + Math.random() * 4.6;
    const z = -1.5 - Math.random() * 3.5;

    for (let i = 0; i < count; i++) {
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 0.07 + Math.random() * 0.16;

      velocities.push({
        x: Math.sin(phi) * Math.cos(theta) * speed,
        y: Math.sin(phi) * Math.sin(theta) * speed,
        z: Math.cos(phi) * speed
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const palette = [0xf59e0b, 0xf43f5e, 0x38bdf8, 0xa855f7, 0x34d399, 0xffffff];
    const color = palette[Math.floor(Math.random() * palette.length)];

    const material = new THREE.PointsMaterial({
      color,
      size: 0.24,
      transparent: true,
      opacity: 1
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    fireworks3DRef.current.push({ points, velocities, material });
  };

  // Spawn 3D Smoke puffs when candles are blown out
  const spawnCandleSmoke = () => {
    flamesRef.current.forEach((flame) => {
      const candleGroup = flame.parent;
      if (!candleGroup || !candleGroup.parent) return;
      const cakeGroup = candleGroup.parent;

      for (let i = 0; i < 9; i++) {
        const geo = new THREE.SphereGeometry(0.065 + Math.random() * 0.05, 10, 10);
        const mat = new THREE.MeshBasicMaterial({
          color: 0x94a3b8,
          transparent: true,
          opacity: 0.75
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
          candleGroup.position.x + (Math.random() - 0.5) * 0.09,
          candleGroup.position.y + 0.88 + Math.random() * 0.1,
          candleGroup.position.z + (Math.random() - 0.5) * 0.09
        );
        cakeGroup.add(mesh);

        smokeParticles3DRef.current.push({
          mesh,
          material: mat,
          vx: (Math.random() - 0.5) * 0.016,
          vy: 0.022 + Math.random() * 0.028,
          vz: (Math.random() - 0.5) * 0.016,
          rotationSpeed: (Math.random() - 0.5) * 0.05
        });
      }
    });
  };

  // ==========================================
  // SLOW, MAJESTIC REALISTIC DOOR OPENING WITH IMMEDIATE MUSIC
  // ==========================================
  const handleOpenDoor = () => {
    if (doorState !== 'closed') return;
    setDoorState('opening');

    // Start music immediately the moment door begins to open
    setIsPlayingMusic(true);
    soundEngine.startMusic(() => {
      setEqualizerBars(generateRandomEqualizer());
    });

    // 1. Immediate metallic latch release click
    soundEngine.playLatchSound();

    // 2. Heavy slow wooden acoustic creak + swelling fanfare chimes
    soundEngine.playSlowDoorOpenSound();

    // 3. Golden light rays beam through crack
    setTimeout(() => {
      triggerConfettiBurst(window.innerWidth * 0.5, window.innerHeight * 0.5, 45);
    }, 1400);

    // 4. Doors swing wide open slowly with celebratory fireworks
    setTimeout(() => {
      triggerConfettiBurst(window.innerWidth * 0.25, window.innerHeight * 0.45, 100);
      triggerConfettiBurst(window.innerWidth * 0.75, window.innerHeight * 0.45, 100);
      launch3DFirework(-3.2, 3.2);
      launch3DFirework(3.2, 3.5);
      launch3DFirework(0, 4.2);
      soundEngine.playFireworkSound();
    }, 2800);

    // 5. Final transition to opened celebration stage after 3.8s slow swing
    setTimeout(() => {
      setDoorState('opened');
    }, 3800);
  };

  const handleToggleCandles = () => {
    if (candlesLit) {
      setCandlesLit(false);
      spawnCandleSmoke();
      soundEngine.playBlowOutSound();

      // Voice only: Speaks "Happy Birthday Salman Khan!"
      speakBirthdayGreeting('Salman Khan');

      triggerConfettiBurst(window.innerWidth * 0.3, window.innerHeight * 0.5, 110);
      triggerConfettiBurst(window.innerWidth * 0.7, window.innerHeight * 0.5, 110);
      launch3DFirework(-3, 3);
      launch3DFirework(3, 3.5);
      launch3DFirework(0, 4.5);
    } else {
      setCandlesLit(true);
    }
  };

  const handleLaunchGrandFireworks = (e?: React.MouseEvent) => {
    const clientX = e?.clientX || window.innerWidth / 2;
    const clientY = e?.clientY || window.innerHeight / 2;

    triggerConfettiBurst(clientX, clientY, 95);
    launch3DFirework();
    setTimeout(() => launch3DFirework(), 200);
    soundEngine.playFireworkSound();
  };

  const handleGrandSalute = () => {
    [0.2, 0.5, 0.8].forEach((ratio, idx) => {
      setTimeout(() => {
        triggerConfettiBurst(window.innerWidth * ratio, window.innerHeight * 0.35, 80);
        launch3DFirework((ratio - 0.5) * 10, 3 + idx * 0.6);
        soundEngine.playFireworkSound();
      }, idx * 220);
    });
  };

  // Background music handler
  useEffect(() => {
    const startBgMusic = () => {
      if (!soundEngine.isPlaying && doorState === 'opened') {
        setIsPlayingMusic(true);
        soundEngine.startMusic(() => {
          setEqualizerBars(generateRandomEqualizer());
        });
      } else if (soundEngine.ctx && soundEngine.ctx.state === 'suspended') {
        soundEngine.ctx.resume();
      }
    };

    window.addEventListener('pointerdown', startBgMusic, { once: true });
    window.addEventListener('keydown', startBgMusic, { once: true });

    return () => {
      window.removeEventListener('pointerdown', startBgMusic);
      window.removeEventListener('keydown', startBgMusic);
      soundEngine.stopMusic();
    };
  }, [doorState]);

  // Ambient periodic fireworks loop
  useEffect(() => {
    const interval = setInterval(() => {
      launch3DFirework();
      if (Math.random() > 0.45) {
        triggerConfettiBurst(
          window.innerWidth * (0.15 + Math.random() * 0.7),
          window.innerHeight * (0.2 + Math.random() * 0.4),
          45
        );
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <main
      data-testid="birthday-celebration-app"
      className="relative w-full h-screen bg-[#070514] overflow-hidden select-none"
    >
      {/* Dynamic Keyframe & Realistic Slow Door 3D Perspective Animation */}
      <style>{`
        .door-perspective {
          perspective: 2200px;
        }
        .door-panel-left {
          transform-origin: left center;
          transform-style: preserve-3d;
          transition: transform 3.8s cubic-bezier(0.25, 0.08, 0.25, 1), opacity 0.8s ease 3.2s;
        }
        .door-panel-right {
          transform-origin: right center;
          transform-style: preserve-3d;
          transition: transform 3.8s cubic-bezier(0.25, 0.08, 0.25, 1), opacity 0.8s ease 3.2s;
        }
        .door-open-left {
          transform: rotateY(-118deg);
          opacity: 0;
        }
        .door-open-right {
          transform: rotateY(118deg);
          opacity: 0;
        }
      `}</style>

      {/* 3D Grand Imperial Palace Gates */}
      <RoyalDoors doorState={doorState} onOpenDoor={handleOpenDoor} />

      {/* Ambient Radial Glow Backdrops */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-rose-600/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Snake-Like Wavy Header Banner */}
      <WavyBanner />

      {/* 3D Three.js Interactive Stage */}
      <div
        ref={mountRef}
        data-testid="threejs-canvas-stage"
        onClick={(e) => {
          if ((e.target as HTMLElement).tagName === 'CANVAS') {
            handleLaunchGrandFireworks(e);
          }
        }}
        className="fixed inset-0 z-10 cursor-pointer"
        aria-label="Interactive 3D Birthday Cake Stage - Click to launch fireworks or drag to rotate"
      />

      {/* 2D Confetti Overlay Canvas */}
      <canvas
        ref={confettiCanvasRef}
        data-testid="confetti-canvas"
        className="fixed inset-0 pointer-events-none z-20"
        aria-hidden="true"
      />

      {/* Bottom Celebration Dock */}
      <CelebrationControls
        candlesLit={candlesLit}
        isPlayingMusic={isPlayingMusic}
        equalizerBars={equalizerBars}
        onToggleCandles={handleToggleCandles}
        onLaunchFireworks={handleLaunchGrandFireworks}
        onGrandSalute={handleGrandSalute}
      />
    </main>
  );
}
