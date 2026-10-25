import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  Sparkles, 
  Music, 
  VolumeX, 
  Flame, 
  Gift, 
  Heart, 
  Star, 
  Award, 
  PartyPopper, 
  Camera,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Crown,
  Zap,
  Wind
} from 'lucide-react';

// ==========================================
// SOUND ENGINE (Vanilla Web Audio API)
// ==========================================
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.melodyTimeout = null;
    this.noteIndex = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Happy Birthday Notes: [Frequency (Hz), Duration (beats)]
  melody = [
    [261.63, 0.75], [261.63, 0.25], [293.66, 1], [261.63, 1], [349.23, 1], [329.63, 2],
    [261.63, 0.75], [261.63, 0.25], [293.66, 1], [261.63, 1], [392.00, 1], [349.23, 2],
    [261.63, 0.75], [261.63, 0.25], [523.25, 1], [440.00, 1], [349.23, 1], [329.63, 1], [293.66, 2],
    [466.16, 0.75], [466.16, 0.25], [440.00, 1], [349.23, 1], [392.00, 1], [349.23, 2]
  ];

  playNote(freq, duration) {
    if (!this.ctx || !this.isPlaying) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    // Warm synth bell sound
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration * 0.42);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration * 0.45);
  }

  startMusic(onBeatCallback) {
    this.init();
    this.isPlaying = true;
    this.noteIndex = 0;
    this.scheduleNextNote(onBeatCallback);
  }

  scheduleNextNote(onBeatCallback) {
    if (!this.isPlaying) return;
    const [freq, duration] = this.melody[this.noteIndex];
    this.playNote(freq, duration);
    if (onBeatCallback) onBeatCallback(freq);

    this.noteIndex = (this.noteIndex + 1) % this.melody.length;
    this.melodyTimeout = setTimeout(() => {
      this.scheduleNextNote(onBeatCallback);
    }, duration * 440);
  }

  stopMusic() {
    this.isPlaying = false;
    if (this.melodyTimeout) clearTimeout(this.melodyTimeout);
  }

  playFireworkSound() {
    this.init();
    if (!this.ctx) return;

    // 1. Launch Whistle
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.25);
    oscGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);

    // 2. Explosion Burst
    setTimeout(() => {
      if (!this.ctx) return;
      const bufferSize = this.ctx.sampleRate * 0.6;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.55);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    }, 200);
  }

  playBlowOutSound() {
    this.init();
    if (!this.ctx) return;
    // Wind puff sound + magical chime
    const bufferSize = this.ctx.sampleRate * 0.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.15));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();

    // Magic arpeggio
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        g.gain.setValueAtTime(0.12, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.6);
      }, idx * 90);
    });
  }

  playDoorOpenSound() {
    this.init();
    if (!this.ctx) return;

    // 1. Deep royal door unlatch / rumble
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(95, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(42, this.ctx.currentTime + 1.1);
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.15);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 1.2);

    // 2. Magical Grand Fanfare Chime as doors swing open
    const fanfare = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    fanfare.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const cOsc = this.ctx.createOscillator();
        const cGain = this.ctx.createGain();
        cOsc.type = 'triangle';
        cOsc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        cGain.gain.setValueAtTime(0.14, this.ctx.currentTime);
        cGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.1);
        cOsc.connect(cGain);
        cGain.connect(this.ctx.destination);
        cOsc.start();
        cOsc.stop(this.ctx.currentTime + 1.1);
      }, idx * 110);
    });
  }
}

const soundEngine = new SoundEngine();

// ==========================================
// MAIN REACT COMPONENT
// ==========================================
export default function App() {
  const [doorState, setDoorState] = useState('closed'); // 'closed' | 'opening' | 'opened'
  const [candlesLit, setCandlesLit] = useState(true);
  const [isPlayingMusic, setIsPlayingMusic] = useState(true);
  const [equalizerBars, setEqualizerBars] = useState([25, 45, 30, 60, 40, 75, 35, 50]);

  const mountRef = useRef(null);
  const confettiCanvasRef = useRef(null);
  const sceneRef = useRef(null);
  const flamesRef = useRef([]);
  const flameLightsRef = useRef([]);
  const fireworks3DRef = useRef([]);
  const smokeParticles3DRef = useRef([]);
  const confettiParticlesRef = useRef([]);

  // ==========================================
  // 2D CONFETTI CANNON (Vanilla JS Canvas)
  // ==========================================
  const triggerConfettiBurst = (originX = window.innerWidth / 2, originY = window.innerHeight / 2, count = 85) => {
    const colors = ['#fbbf24', '#f43f5e', '#38bdf8', '#a855f7', '#34d399', '#ffffff', '#fb923c'];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 4 + Math.random() * 14;
      confettiParticlesRef.current.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 5,
        size: 6 + Math.random() * 7,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 14,
        gravity: 0.22,
        drag: 0.98,
        alpha: 1,
        shape: Math.random() > 0.35 ? 'rect' : 'circle'
      });
    }
  };

  useEffect(() => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    let animId;
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
        p.alpha -= 0.006;

        if (p.alpha <= 0 || p.y > canvas.height + 40) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
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
    // Initial welcome burst
    setTimeout(() => {
      triggerConfettiBurst(window.innerWidth * 0.25, window.innerHeight * 0.4, 60);
      triggerConfettiBurst(window.innerWidth * 0.75, window.innerHeight * 0.4, 60);
    }, 500);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // ==========================================
  // 3D SCENE SETUP (Three.js)
  // ==========================================
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2.2, 11.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff4d6, 1.2);
    dirLight.position.set(6, 12, 8);
    scene.add(dirLight);

    const pinkPointLight = new THREE.PointLight(0xf43f5e, 1.8, 25);
    pinkPointLight.position.set(-7, 4, 4);
    scene.add(pinkPointLight);

    const bluePointLight = new THREE.PointLight(0x38bdf8, 1.8, 25);
    bluePointLight.position.set(7, -3, 4);
    scene.add(bluePointLight);

    // 3. Create 3D Royal Birthday Cake Group
    const cakeGroup = new THREE.Group();
    cakeGroup.position.set(0, -1.3, 0);
    scene.add(cakeGroup);

    // Golden Cake Stand Plate
    const plateGeo = new THREE.CylinderGeometry(3.2, 2.9, 0.25, 48);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      metalness: 0.75,
      roughness: 0.2
    });
    const plate = new THREE.Mesh(plateGeo, goldMat);
    plate.position.y = -0.15;
    cakeGroup.add(plate);

    // Bottom Tier (Rich Chocolate / Royal Velvet)
    const tier1Geo = new THREE.CylinderGeometry(2.5, 2.5, 1.35, 48);
    const tier1Mat = new THREE.MeshStandardMaterial({
      color: 0x31102f,
      roughness: 0.45,
      metalness: 0.1
    });
    const tier1 = new THREE.Mesh(tier1Geo, tier1Mat);
    tier1.position.y = 0.65;
    cakeGroup.add(tier1);

    // Bottom Tier Gold Trim Ring
    const trim1Geo = new THREE.TorusGeometry(2.52, 0.08, 16, 64);
    const trim1 = new THREE.Mesh(trim1Geo, goldMat);
    trim1.rotation.x = Math.PI / 2;
    trim1.position.y = 1.3;
    cakeGroup.add(trim1);

    // Middle Tier (Royal Berry Pink)
    const tier2Geo = new THREE.CylinderGeometry(1.85, 1.85, 1.15, 48);
    const tier2Mat = new THREE.MeshStandardMaterial({
      color: 0xbe185d,
      roughness: 0.35
    });
    const tier2 = new THREE.Mesh(tier2Geo, tier2Mat);
    tier2.position.y = 1.9;
    cakeGroup.add(tier2);

    // Middle Tier Cream Icing Drips (Torus)
    const icingGeo = new THREE.TorusGeometry(1.86, 0.11, 16, 48);
    const creamMat = new THREE.MeshStandardMaterial({
      color: 0xfff1f2,
      roughness: 0.25
    });
    const icing = new THREE.Mesh(icingGeo, creamMat);
    icing.rotation.x = Math.PI / 2;
    icing.position.y = 2.46;
    cakeGroup.add(icing);

    // Top Tier (Creamy Vanilla & Gold)
    const tier3Geo = new THREE.CylinderGeometry(1.25, 1.25, 0.95, 48);
    const tier3Mat = new THREE.MeshStandardMaterial({
      color: 0xfef3c7,
      roughness: 0.3
    });
    const tier3 = new THREE.Mesh(tier3Geo, tier3Mat);
    tier3.position.y = 2.95;
    cakeGroup.add(tier3);

    // Decorative Sprinkles / Gems around the cake
    const gemGeo = new THREE.SphereGeometry(0.09, 12, 12);
    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const gem = new THREE.Mesh(gemGeo, goldMat);
      gem.position.set(Math.cos(angle) * 2.52, 0.65, Math.sin(angle) * 2.52);
      cakeGroup.add(gem);
    }

    // 5 Candles on Top Tier
    const candlePositions = [
      [0, 0],
      [0.65, 0],
      [-0.65, 0],
      [0, 0.65],
      [0, -0.65]
    ];

    flamesRef.current = [];
    flameLightsRef.current = [];

    candlePositions.forEach(([cx, cz]) => {
      const candleGroup = new THREE.Group();
      candleGroup.position.set(cx, 3.42, cz);

      // Candle Body
      const cGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.75, 16);
      const cMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.2
      });
      const candleMesh = new THREE.Mesh(cGeo, cMat);
      candleMesh.position.y = 0.375;
      candleGroup.add(candleMesh);

      // Gold Stripe on Candle
      const stripeGeo = new THREE.CylinderGeometry(0.085, 0.085, 0.15, 16);
      const stripeMesh = new THREE.Mesh(stripeGeo, goldMat);
      stripeMesh.position.y = 0.4;
      candleGroup.add(stripeMesh);

      // Candle Flame (Teardrop cone)
      const flameGeo = new THREE.ConeGeometry(0.11, 0.32, 16);
      const flameMat = new THREE.MeshBasicMaterial({
        color: 0xfbbf24
      });
      const flameMesh = new THREE.Mesh(flameGeo, flameMat);
      flameMesh.position.y = 0.92;
      candleGroup.add(flameMesh);
      flamesRef.current.push(flameMesh);

      // Inner Flame Core
      const coreGeo = new THREE.ConeGeometry(0.05, 0.18, 12);
      const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.y = -0.04;
      flameMesh.add(coreMesh);

      // Warm Candle Glow Light
      const fLight = new THREE.PointLight(0xff9900, 0.85, 5);
      fLight.position.y = 0.95;
      candleGroup.add(fLight);
      flameLightsRef.current.push(fLight);

      cakeGroup.add(candleGroup);
    });

    // 4. Create Floating 3D Balloons
    const balloons = [];
    const balloonColors = [0xf43f5e, 0xfbbf24, 0x38bdf8, 0xa855f7, 0x10b981, 0xf97316];
    const balloonGeo = new THREE.SphereGeometry(0.58, 28, 28);
    balloonGeo.scale(1, 1.18, 1);

    for (let i = 0; i < 18; i++) {
      const bGroup = new THREE.Group();
      const color = balloonColors[i % balloonColors.length];
      const bMat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.15,
        metalness: 0.25
      });
      const bMesh = new THREE.Mesh(balloonGeo, bMat);
      bGroup.add(bMesh);

      // Balloon Knot
      const knotGeo = new THREE.ConeGeometry(0.09, 0.12, 12);
      const knot = new THREE.Mesh(knotGeo, bMat);
      knot.position.y = -0.68;
      bGroup.add(knot);

      // Balloon String
      const stringGeo = new THREE.CylinderGeometry(0.01, 0.01, 1.6, 6);
      const stringMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0, transparent: true, opacity: 0.5 });
      const stringMesh = new THREE.Mesh(stringGeo, stringMat);
      stringMesh.position.y = -1.45;
      bGroup.add(stringMesh);

      // Position around the background & edges
      const side = i % 2 === 0 ? -1 : 1;
      bGroup.position.set(
        side * (3.6 + Math.random() * 5.5),
        -6 + Math.random() * 12,
        -2 - Math.random() * 6
      );

      scene.add(bGroup);
      balloons.push({
        group: bGroup,
        speedY: 0.012 + Math.random() * 0.018,
        swayOffset: Math.random() * Math.PI * 2,
        swaySpeed: 0.8 + Math.random() * 1.2
      });
    }

    // 5. Starry Magical Particle Field
    const starCount = 450;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 40;
      starPositions[i + 1] = (Math.random() - 0.5) * 28;
      starPositions[i + 2] = -4 - Math.random() * 18;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 0.12,
      transparent: true,
      opacity: 0.8
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);

    // 6. Mouse / Touch Interactive Camera Parallax
    let targetX = 0;
    let targetY = 0;
    let isDragging = false;
    let prevX = 0;
    let cakeManualRotY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      prevX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    };

    const onPointerMove = (e) => {
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || window.innerWidth / 2;
      const clientY = e.clientY || (e.touches && e.touches[0]?.clientY) || window.innerHeight / 2;

      targetX = (clientX / window.innerWidth - 0.5) * 2.2;
      targetY = -(clientY / window.innerHeight - 0.5) * 1.5;

      if (isDragging) {
        const deltaX = clientX - prevX;
        cakeManualRotY += deltaX * 0.01;
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
    let reqId;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Rotate & gently float the 3D cake
      cakeGroup.rotation.y = elapsed * 0.38 + cakeManualRotY;
      cakeGroup.position.y = -1.35 + Math.sin(elapsed * 1.6) * 0.12;

      // Flicker Candle Flames
      flamesRef.current.forEach((flame, idx) => {
        if (flame.visible) {
          const scaleFlicker = 0.9 + Math.sin(elapsed * 18 + idx * 2) * 0.16;
          flame.scale.set(scaleFlicker, 0.85 + Math.cos(elapsed * 22 + idx) * 0.2, scaleFlicker);
          flame.rotation.z = Math.sin(elapsed * 12 + idx) * 0.12;
        }
      });

      // Float Balloons Upward
      balloons.forEach((b) => {
        b.group.position.y += b.speedY;
        b.group.position.x += Math.sin(elapsed * b.swaySpeed + b.swayOffset) * 0.008;
        b.group.rotation.z = Math.sin(elapsed * b.swaySpeed + b.swayOffset) * 0.08;
        if (b.group.position.y > 9.5) {
          b.group.position.y = -8.5;
        }
      });

      // Update 3D Fireworks
      const fwList = fireworks3DRef.current;
      for (let i = fwList.length - 1; i >= 0; i--) {
        const fw = fwList[i];
        const positions = fw.points.geometry.attributes.position.array;
        for (let j = 0; j < fw.velocities.length; j++) {
          positions[j * 3] += fw.velocities[j].x;
          positions[j * 3 + 1] += fw.velocities[j].y;
          positions[j * 3 + 2] += fw.velocities[j].z;
          fw.velocities[j].y -= 0.003; // gravity
        }
        fw.points.geometry.attributes.position.needsUpdate = true;
        fw.material.opacity -= 0.016;

        if (fw.material.opacity <= 0) {
          scene.remove(fw.points);
          fw.points.geometry.dispose();
          fw.material.dispose();
          fwList.splice(i, 1);
        }
      }

      // Update 3D Smoke Puffs (when candles are blown out)
      const smokeList = smokeParticles3DRef.current;
      for (let i = smokeList.length - 1; i >= 0; i--) {
        const s = smokeList[i];
        s.mesh.position.x += s.vx + Math.sin(elapsed * 5 + i) * 0.004;
        s.mesh.position.y += s.vy;
        s.mesh.position.z += s.vz;
        s.mesh.scale.multiplyScalar(1.022);
        s.material.opacity -= 0.012;

        if (s.material.opacity <= 0) {
          cakeGroup.remove(s.mesh);
          s.mesh.geometry.dispose();
          s.material.dispose();
          smokeList.splice(i, 1);
        }
      }

      // Gently drift stars
      starField.rotation.y = elapsed * 0.025;

      // Smooth Camera Parallax
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (2.2 + targetY - camera.position.y) * 0.05;
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
      light.intensity = candlesLit ? 0.85 : 0;
    });
  }, [candlesLit]);

  // ==========================================
  // SPAWN 3D FIREWORK IN THREE.JS SCENE
  // ==========================================
  const launch3DFirework = (customX, customY) => {
    const scene = sceneRef.current;
    if (!scene) return;

    const count = 90;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const velocities = [];

    const x = customX !== undefined ? customX : (Math.random() - 0.5) * 10;
    const y = customY !== undefined ? customY : 1.5 + Math.random() * 4.5;
    const z = -1.5 - Math.random() * 3;

    for (let i = 0; i < count; i++) {
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const speed = 0.06 + Math.random() * 0.14;

      velocities.push({
        x: Math.sin(phi) * Math.cos(theta) * speed,
        y: Math.sin(phi) * Math.sin(theta) * speed,
        z: Math.cos(phi) * speed
      });
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const palette = [0xfbbf24, 0xf43f5e, 0x38bdf8, 0xa855f7, 0x34d399, 0xffffff];
    const color = palette[Math.floor(Math.random() * palette.length)];

    const material = new THREE.PointsMaterial({
      color,
      size: 0.22,
      transparent: true,
      opacity: 1
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);
    fireworks3DRef.current.push({ points, velocities, material });
  };

  // Spawn 3D Smoke puffs from each candle wick when blown out
  const spawnCandleSmoke = () => {
    flamesRef.current.forEach((flame) => {
      const candleGroup = flame.parent;
      if (!candleGroup || !candleGroup.parent) return;
      const cakeGroup = candleGroup.parent;

      for (let i = 0; i < 7; i++) {
        const geo = new THREE.SphereGeometry(0.06 + Math.random() * 0.05, 8, 8);
        const mat = new THREE.MeshBasicMaterial({
          color: 0xcbd5e1,
          transparent: true,
          opacity: 0.65
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(
          candleGroup.position.x + (Math.random() - 0.5) * 0.08,
          candleGroup.position.y + 0.85 + Math.random() * 0.1,
          candleGroup.position.z + (Math.random() - 0.5) * 0.08
        );
        cakeGroup.add(mesh);

        smokeParticles3DRef.current.push({
          mesh,
          material: mat,
          vx: (Math.random() - 0.5) * 0.015,
          vy: 0.02 + Math.random() * 0.025,
          vz: (Math.random() - 0.5) * 0.015
        });
      }
    });
  };

  // ==========================================
  // INTERACTIVE HANDLERS
  // ==========================================
  const handleLaunchGrandFireworks = (e) => {
    const clientX = e?.clientX || window.innerWidth / 2;
    const clientY = e?.clientY || window.innerHeight / 2;

    triggerConfettiBurst(clientX, clientY, 95);
    launch3DFirework();
    setTimeout(() => launch3DFirework(), 200);
    soundEngine.playFireworkSound();
  };

  const handleToggleCandles = () => {
    if (candlesLit) {
      setCandlesLit(false);
      spawnCandleSmoke();
      soundEngine.playBlowOutSound();
      // Massive celebratory fireworks + confetti
      triggerConfettiBurst(window.innerWidth * 0.3, window.innerHeight * 0.5, 100);
      triggerConfettiBurst(window.innerWidth * 0.7, window.innerHeight * 0.5, 100);
      launch3DFirework(-3, 3);
      launch3DFirework(3, 3.5);
      launch3DFirework(0, 4.5);
    } else {
      setCandlesLit(true);
    }
  };

  const handleOpenDoor = () => {
    if (doorState !== 'closed') return;
    setDoorState('opening');
    soundEngine.playDoorOpenSound();

    // Start background music if not already running
    if (!soundEngine.isPlaying) {
      setIsPlayingMusic(true);
      soundEngine.startMusic(() => {
        setEqualizerBars(
          Array.from({ length: 8 }, () => 20 + Math.floor(Math.random() * 80))
        );
      });
    } else if (soundEngine.ctx && soundEngine.ctx.state === 'suspended') {
      soundEngine.ctx.resume();
    }

    // Trigger grand celebration burst as the doors swing wide open
    setTimeout(() => {
      triggerConfettiBurst(window.innerWidth * 0.25, window.innerHeight * 0.45, 95);
      triggerConfettiBurst(window.innerWidth * 0.75, window.innerHeight * 0.45, 95);
      launch3DFirework(-3.2, 3.2);
      launch3DFirework(3.2, 3.5);
      launch3DFirework(0, 4.2);
      soundEngine.playFireworkSound();
    }, 650);

    setTimeout(() => {
      setDoorState('opened');
    }, 2000);
  };

  // Keep background music always on and auto-resume on first browser interaction if needed
  useEffect(() => {
    const startBgMusic = () => {
      if (!soundEngine.isPlaying) {
        setIsPlayingMusic(true);
        soundEngine.startMusic(() => {
          setEqualizerBars(
            Array.from({ length: 8 }, () => 20 + Math.floor(Math.random() * 80))
          );
        });
      } else if (soundEngine.ctx && soundEngine.ctx.state === 'suspended') {
        soundEngine.ctx.resume();
      }
    };

    startBgMusic();

    window.addEventListener('pointerdown', startBgMusic);
    window.addEventListener('keydown', startBgMusic);

    return () => {
      window.removeEventListener('pointerdown', startBgMusic);
      window.removeEventListener('keydown', startBgMusic);
      soundEngine.stopMusic();
    };
  }, []);

  // Automatic ambient fireworks loop for pure animation mode
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
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#070514] overflow-hidden select-none">
      {/* Snake-like Wave Keyframe Animations */}
      <style>{`
        @keyframes snakeWaveTop {
          0%, 100% {
            d: path("M 30 95 Q 165 30, 300 85 T 570 75 T 840 85 T 970 70");
          }
          50% {
            d: path("M 30 70 Q 165 130, 300 75 T 570 95 T 840 65 T 970 95");
          }
        }
        @keyframes snakeWaveBottom {
          0%, 100% {
            d: path("M 50 175 Q 200 225, 350 170 T 650 185 T 950 170");
          }
          50% {
            d: path("M 50 190 Q 200 130, 350 185 T 650 160 T 950 190");
          }
        }
        @keyframes letterSnake {
          0%, 100% {
            transform: translateY(0px) rotate(-2deg) scale(1);
          }
          50% {
            transform: translateY(-12px) rotate(3deg) scale(1.04);
          }
        }
        .snake-letter {
          display: inline-block;
          animation: letterSnake 2.4s ease-in-out infinite;
        }
        .door-perspective {
          perspective: 1800px;
        }
        .door-panel-left {
          transform-origin: left center;
          transform-style: preserve-3d;
          transition: transform 1.85s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease 1.35s;
        }
        .door-panel-right {
          transform-origin: right center;
          transform-style: preserve-3d;
          transition: transform 1.85s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.6s ease 1.35s;
        }
        .door-open-left {
          transform: rotateY(-115deg);
          opacity: 0;
        }
        .door-open-right {
          transform: rotateY(115deg);
          opacity: 0;
        }
      `}</style>

      {/* ==========================================
          3D GRAND ROYAL DOUBLE DOOR ENTRANCE OVERLAY
          ========================================== */}
      {doorState !== 'opened' && (
        <div
          onClick={handleOpenDoor}
          onTouchStart={handleOpenDoor}
          className="fixed inset-0 z-50 flex overflow-hidden cursor-pointer door-perspective select-none"
        >
          {/* Golden Light Burst Seam Behind the Doors */}
          <div
            className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
              doorState === 'opening' ? 'opacity-100' : 'opacity-40'
            }`}
            style={{
              background:
                'radial-gradient(circle at center, rgba(251,191,36,0.75) 0%, rgba(244,63,94,0.35) 35%, transparent 70%)'
            }}
          />

          {/* LEFT ROYAL DOOR PANEL */}
          <div
            className={`relative w-1/2 h-full bg-gradient-to-br from-[#240b36] via-[#140524] to-[#090314] border-r-4 border-amber-400/90 shadow-[20px_0_60px_rgba(0,0,0,0.95)] flex flex-col justify-between p-4 sm:p-10 door-panel-left ${
              doorState === 'opening' ? 'door-open-left' : ''
            }`}
          >
            {/* Outer Gold Filigree Frame */}
            <div className="w-full h-full border-2 border-amber-500/40 rounded-l-2xl p-3 sm:p-6 flex flex-col justify-between relative overflow-hidden bg-[radial-gradient(circle_at_right,rgba(251,191,36,0.12),transparent_65%)]">
              {/* Top Molded Panel */}
              <div className="w-full h-1/3 border-2 border-amber-400/50 rounded-xl bg-gradient-to-b from-amber-500/10 to-purple-950/40 shadow-inner flex items-center justify-center relative">
                <div className="w-4/5 h-3/4 border border-amber-300/30 rounded-lg flex items-center justify-center">
                  <Crown className="w-10 h-10 sm:w-14 sm:h-14 text-amber-400/60 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]" />
                </div>
              </div>

              {/* Bottom Molded Panel */}
              <div className="w-full h-1/3 border-2 border-amber-400/50 rounded-xl bg-gradient-to-t from-amber-500/10 to-purple-950/40 shadow-inner flex items-center justify-center">
                <div className="w-4/5 h-3/4 border border-amber-300/30 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-amber-400/40" />
                </div>
              </div>

              {/* Left Door Golden Handle */}
              <div className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 flex items-center">
                <div className="w-4 sm:w-6 h-24 sm:h-32 rounded-full bg-gradient-to-b from-yellow-200 via-amber-500 to-yellow-700 border-2 border-yellow-100 shadow-[0_0_25px_rgba(251,191,36,0.9)] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-white animate-ping" />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT ROYAL DOOR PANEL */}
          <div
            className={`relative w-1/2 h-full bg-gradient-to-bl from-[#240b36] via-[#140524] to-[#090314] border-l-4 border-amber-400/90 shadow-[-20px_0_60px_rgba(0,0,0,0.95)] flex flex-col justify-between p-4 sm:p-10 door-panel-right ${
              doorState === 'opening' ? 'door-open-right' : ''
            }`}
          >
            {/* Outer Gold Filigree Frame */}
            <div className="w-full h-full border-2 border-amber-500/40 rounded-r-2xl p-3 sm:p-6 flex flex-col justify-between relative overflow-hidden bg-[radial-gradient(circle_at_left,rgba(251,191,36,0.12),transparent_65%)]">
              {/* Top Molded Panel */}
              <div className="w-full h-1/3 border-2 border-amber-400/50 rounded-xl bg-gradient-to-b from-amber-500/10 to-purple-950/40 shadow-inner flex items-center justify-center relative">
                <div className="w-4/5 h-3/4 border border-amber-300/30 rounded-lg flex items-center justify-center">
                  <Crown className="w-10 h-10 sm:w-14 sm:h-14 text-amber-400/60 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]" />
                </div>
              </div>

              {/* Bottom Molded Panel */}
              <div className="w-full h-1/3 border-2 border-amber-400/50 rounded-xl bg-gradient-to-t from-amber-500/10 to-purple-950/40 shadow-inner flex items-center justify-center">
                <div className="w-4/5 h-3/4 border border-amber-300/30 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-amber-400/40" />
                </div>
              </div>

              {/* Right Door Golden Handle */}
              <div className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 flex items-center">
                <div className="w-4 sm:w-6 h-24 sm:h-32 rounded-full bg-gradient-to-b from-yellow-200 via-amber-500 to-yellow-700 border-2 border-yellow-100 shadow-[0_0_25px_rgba(251,191,36,0.9)] flex items-center justify-center">
                  <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 rounded-full bg-white animate-ping" />
                </div>
              </div>
            </div>
          </div>

          {/* Center Interactive Royal Seal / Touch Prompt */}
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center pointer-events-none transition-all duration-700 ${
              doorState === 'opening' ? 'scale-150 opacity-0' : 'scale-100 opacity-100'
            }`}
          >
            {/* Glowing Pulsing Ring */}
            <div className="relative flex items-center justify-center">
              <div className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-amber-400/30 blur-xl animate-pulse" />
              <div className="absolute w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-amber-300/80 animate-ping" />
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-amber-300 via-amber-500 to-rose-600 p-1 shadow-[0_0_50px_rgba(251,191,36,0.95)] flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#1a0826] flex flex-col items-center justify-center border-2 border-amber-300">
                  <Gift className="w-9 h-9 sm:w-11 sm:h-11 text-amber-300 animate-bounce" />
                </div>
              </div>
            </div>

            <div className="mt-5 px-6 py-2.5 rounded-full bg-black/80 border border-amber-400/70 backdrop-blur-md shadow-[0_0_25px_rgba(251,191,36,0.5)]">
              <span className="text-amber-300 font-black tracking-[0.22em] text-xs sm:text-sm uppercase animate-pulse">
                Touch to Open Door
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Ambient Radial Glow Backdrops */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-rose-600/25 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Snake-Like Wavy Header Banner */}
      <header className="fixed top-2 left-0 right-0 z-30 pointer-events-none flex flex-col items-center justify-center px-2">
        <div className="relative w-full max-w-4xl flex flex-col items-center">
          {/* Decorative Wavy SVG Ribbons Behind Text */}
          <svg
            viewBox="0 0 1000 230"
            className="w-full h-36 sm:h-48 md:h-56 overflow-visible drop-shadow-[0_10px_25px_rgba(244,63,94,0.45)]"
          >
            <defs>
              <linearGradient id="snakeRibbonTop" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="25%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#eab308" />
                <stop offset="75%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>

              <linearGradient id="snakeRibbonBottom" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="30%" stopColor="#8b5cf6" />
                <stop offset="65%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>

              <linearGradient id="goldTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#fde047" />
                <stop offset="100%" stopColor="#f97316" />
              </linearGradient>

              {/* Wavy SVG Paths for curving the banner and text */}
              <path
                id="wavePathTop"
                d="M 40 85 C 220 25, 360 135, 520 75 C 680 15, 820 130, 960 75"
              >
                <animate
                  attributeName="d"
                  dur="4s"
                  repeatCount="indefinite"
                  values="
                    M 40 85 C 220 25, 360 135, 520 75 C 680 15, 820 130, 960 75;
                    M 40 70 C 220 135, 360 25, 520 90 C 680 140, 820 25, 960 90;
                    M 40 85 C 220 25, 360 135, 520 75 C 680 15, 820 130, 960 75
                  "
                />
              </path>

              <path
                id="wavePathBottom"
                d="M 60 175 C 240 230, 390 120, 540 180 C 690 235, 810 125, 940 175"
              >
                <animate
                  attributeName="d"
                  dur="4s"
                  repeatCount="indefinite"
                  values="
                    M 60 175 C 240 230, 390 120, 540 180 C 690 235, 810 125, 940 175;
                    M 60 160 C 240 115, 390 225, 540 160 C 690 110, 810 225, 940 165;
                    M 60 175 C 240 230, 390 120, 540 180 C 690 235, 810 125, 940 175
                  "
                />
              </path>
            </defs>

            {/* Top Snake Ribbon Body */}
            <use
              href="#wavePathTop"
              fill="none"
              stroke="url(#snakeRibbonTop)"
              strokeWidth="52"
              strokeLinecap="round"
              opacity="0.92"
            />
            <use
              href="#wavePathTop"
              fill="none"
              stroke="#fef08a"
              strokeWidth="56"
              strokeLinecap="round"
              strokeDasharray="10 18"
              opacity="0.45"
            />

            {/* Top Curved Text: HAPPY BIRTHDAY */}
            <text
              fill="#ffffff"
              fontSize="34"
              fontWeight="900"
              letterSpacing="7"
              dy="11"
              className="drop-shadow-[0_3px_6px_rgba(0,0,0,0.85)]"
            >
              <textPath href="#wavePathTop" startOffset="50%" textAnchor="middle">
                ✨ HAPPY BIRTHDAY ✨
              </textPath>
            </text>

            {/* Bottom Snake Ribbon Body */}
            <use
              href="#wavePathBottom"
              fill="none"
              stroke="url(#snakeRibbonBottom)"
              strokeWidth="60"
              strokeLinecap="round"
              opacity="0.95"
            />
            <use
              href="#wavePathBottom"
              fill="none"
              stroke="#ffffff"
              strokeWidth="64"
              strokeLinecap="round"
              strokeDasharray="6 22"
              opacity="0.4"
            />

            {/* Bottom Curved Text: SALMAN KHAN */}
            <text
              fill="url(#goldTextGrad)"
              stroke="#451a03"
              strokeWidth="1.5"
              fontSize="44"
              fontWeight="900"
              letterSpacing="9"
              dy="14"
              className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)]"
            >
              <textPath href="#wavePathBottom" startOffset="50%" textAnchor="middle">
                👑 SALMAN KHAN 👑
              </textPath>
            </text>
          </svg>
        </div>
      </header>

      {/* 3D Three.js Interactive Stage */}
      <div
        ref={mountRef}
        onClick={(e) => {
          if (e.target.tagName === 'CANVAS') {
            handleLaunchGrandFireworks(e);
          }
        }}
        className="fixed inset-0 z-10 cursor-pointer"
      />

      {/* 2D Vanilla JS Confetti Overlay Canvas */}
      <canvas
        ref={confettiCanvasRef}
        className="fixed inset-0 pointer-events-none z-20"
      />

      {/* Bottom Control Dock with Blow Button & Always-On Music Equalizer */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 bg-slate-900/60 backdrop-blur-xl border border-white/15 rounded-full p-2.5 shadow-2xl">
        {/* Blow the Candle Button */}
        <button
          onClick={handleToggleCandles}
          aria-label="Blow the Candle"
          className={`h-14 px-8 rounded-full flex items-center gap-3 font-extrabold tracking-wider uppercase text-base transition-all transform active:scale-90 shadow-xl ${
            candlesLit
              ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-orange-500/50 hover:scale-105 ring-2 ring-amber-300/60 animate-pulse'
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/40 hover:scale-105 ring-2 ring-emerald-300/50'
          }`}
        >
          {candlesLit ? (
            <>
              <Wind className="w-6 h-6 animate-bounce" />
              <span>Blow the Candle</span>
            </>
          ) : (
            <>
              <Flame className="w-6 h-6 fill-white animate-pulse" />
              <span>Relight Candles</span>
            </>
          )}
        </button>

        {/* Launch Fireworks & Confetti Icon Button */}
        <button
          onClick={handleLaunchGrandFireworks}
          aria-label="Launch Fireworks"
          className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-tr from-purple-600 via-pink-600 to-rose-500 text-white shadow-lg shadow-pink-500/30 hover:scale-105 transition-all transform active:scale-90"
        >
          <PartyPopper className="w-6 h-6" />
        </button>

        {/* Multi-Salute Burst Icon Button */}
        <button
          onClick={() => {
            [0.2, 0.5, 0.8].forEach((ratio, idx) => {
              setTimeout(() => {
                triggerConfettiBurst(
                  window.innerWidth * ratio,
                  window.innerHeight * 0.35,
                  75
                );
                launch3DFirework((ratio - 0.5) * 10, 3 + idx * 0.6);
                soundEngine.playFireworkSound();
              }, idx * 200);
            });
          }}
          aria-label="Grand Salute"
          className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/15 text-amber-300 hover:scale-105 transition-all transform active:scale-90"
        >
          <Sparkles className="w-6 h-6" />
        </button>

        {/* Always-On Music Indicator & Equalizer */}
        <div
          aria-label="Background Music Playing"
          className="h-12 px-4 rounded-full flex items-center gap-2 bg-amber-500/20 border border-amber-400/50 text-amber-300 shadow-lg shadow-amber-500/20"
        >
          <Music className="w-5 h-5 text-amber-400 animate-bounce" />
          <div className="flex items-end gap-0.5 h-4">
            {equalizerBars.slice(0, 5).map((height, i) => (
              <span
                key={i}
                style={{
                  height: isPlayingMusic ? `${height}%` : '40%',
                  transition: 'height 0.18s ease'
                }}
                className="w-1 rounded-full bg-gradient-to-t from-rose-500 to-amber-300"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}