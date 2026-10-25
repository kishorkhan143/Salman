/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const BIRTHDAY_MELODY: [number, number][] = [
  [261.63, 0.75], [261.63, 0.25], [293.66, 1], [261.63, 1], [349.23, 1], [329.63, 2],
  [261.63, 0.75], [261.63, 0.25], [293.66, 1], [261.63, 1], [392.00, 1], [349.23, 2],
  [261.63, 0.75], [261.63, 0.25], [523.25, 1], [440.00, 1], [349.23, 1], [329.63, 1], [293.66, 2],
  [466.16, 0.75], [466.16, 0.25], [440.00, 1], [349.23, 1], [392.00, 1], [349.23, 2]
];

export function calculateBeatDelay(duration: number, tempoMs = 440): number {
  return Math.max(50, Math.round(duration * tempoMs));
}

export function generateRandomEqualizer(barsCount = 8, min = 20, max = 100): number[] {
  return Array.from({ length: barsCount }, () =>
    Math.floor(min + Math.random() * (max - min))
  );
}

export function formatBirthdayWish(name = 'Salman Khan'): string {
  return `Happy Birthday ${name.trim()}!`;
}

export function speakBirthdayGreeting(name = 'Salman Khan'): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }
  try {
    window.speechSynthesis.cancel();
    const text = formatBirthdayWish(name);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') ||
          v.name.includes('Google') ||
          v.name.includes('Samantha') ||
          v.name.includes('Daniel') ||
          v.name.includes('Alex'))
    );
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    return false;
  }
}

export class SoundEngine {
  ctx: AudioContext | null = null;
  isPlaying: boolean = false;
  melodyTimeout: ReturnType<typeof setTimeout> | null = null;
  noteIndex: number = 0;
  melody: [number, number][] = BIRTHDAY_MELODY;

  init() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playNote(freq: number, duration: number) {
    if (!this.ctx || !this.isPlaying) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

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

  startMusic(onBeatCallback?: (freq: number) => void) {
    this.init();
    this.isPlaying = true;
    this.noteIndex = 0;
    this.scheduleNextNote(onBeatCallback);
  }

  scheduleNextNote(onBeatCallback?: (freq: number) => void) {
    if (!this.isPlaying) return;
    const [freq, duration] = this.melody[this.noteIndex];
    this.playNote(freq, duration);
    if (onBeatCallback) onBeatCallback(freq);

    this.noteIndex = (this.noteIndex + 1) % this.melody.length;
    this.melodyTimeout = setTimeout(() => {
      this.scheduleNextNote(onBeatCallback);
    }, calculateBeatDelay(duration));
  }

  stopMusic() {
    this.isPlaying = false;
    if (this.melodyTimeout) {
      clearTimeout(this.melodyTimeout);
      this.melodyTimeout = null;
    }
  }

  playFireworkSound() {
    this.init();
    if (!this.ctx) return;

    // Launch Whistle
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(950, this.ctx.currentTime + 0.28);
    oscGain.gain.setValueAtTime(0.09, this.ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.28);
    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.28);

    // Realistic Double-Thud Acoustic Burst
    setTimeout(() => {
      if (!this.ctx) return;
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.7);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.18));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.Q.setValueAtTime(3, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.65);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    }, 220);
  }

  playBlowOutSound() {
    this.init();
    if (!this.ctx) return;
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.6);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.15));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.45, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.55);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start();

    // Magic chime arpeggio
    [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        g.gain.setValueAtTime(0.12, this.ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.7);
        osc.connect(g);
        g.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.7);
      }, idx * 85);
    });
  }

  playLatchSound() {
    this.init();
    if (!this.ctx) return;

    // Metallic click
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.09);
  }

  playSlowDoorOpenSound() {
    this.init();
    if (!this.ctx) return;

    // 1. Heavy resonant iron & oak door creak (multi-harmonic low drone)
    const creakOsc = this.ctx.createOscillator();
    const creakGain = this.ctx.createGain();
    creakOsc.type = 'sawtooth';
    creakOsc.frequency.setValueAtTime(75, this.ctx.currentTime);
    creakOsc.frequency.linearRampToValueAtTime(110, this.ctx.currentTime + 1.2);
    creakOsc.frequency.linearRampToValueAtTime(52, this.ctx.currentTime + 2.8);

    creakGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    creakGain.gain.linearRampToValueAtTime(0.16, this.ctx.currentTime + 0.4);
    creakGain.gain.linearRampToValueAtTime(0.12, this.ctx.currentTime + 2.2);
    creakGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 3.2);

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(260, this.ctx.currentTime);

    creakOsc.connect(lowpass);
    lowpass.connect(creakGain);
    creakGain.connect(this.ctx.destination);
    creakOsc.start();
    creakOsc.stop(this.ctx.currentTime + 3.25);

    // 2. Swelling golden imperial fanfare chimes as light floods the room
    const fanfareNotes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    fanfareNotes.forEach((freq, idx) => {
      setTimeout(() => {
        if (!this.ctx) return;
        const cOsc = this.ctx.createOscillator();
        const cGain = this.ctx.createGain();
        cOsc.type = 'triangle';
        cOsc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        cGain.gain.setValueAtTime(0.01, this.ctx.currentTime);
        cGain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.1);
        cGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);
        cOsc.connect(cGain);
        cGain.connect(this.ctx.destination);
        cOsc.start();
        cOsc.stop(this.ctx.currentTime + 1.5);
      }, 700 + idx * 160);
    });
  }
}

export const soundEngine = new SoundEngine();
