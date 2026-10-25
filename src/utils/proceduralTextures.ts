/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as THREE from 'three';

/**
 * Creates a procedural polished dark royal mahogany wood grain texture.
 */
export function createWoodTexture(width = 512, height = 512): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep rich mahogany wood base
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#1c0a1a');
  grad.addColorStop(0.5, '#290f23');
  grad.addColorStop(1, '#170715');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Wood grain vertical fibers
  ctx.fillStyle = 'rgba(65, 25, 55, 0.25)';
  for (let i = 0; i < 800; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const w = 1 + Math.random() * 2.5;
    const h = 40 + Math.random() * 120;
    ctx.fillRect(x, y, w, h);
  }

  // Soft wood rings
  ctx.strokeStyle = 'rgba(235, 180, 110, 0.04)';
  ctx.lineWidth = 3;
  for (let r = 20; r < width * 1.5; r += 16 + Math.random() * 12) {
    ctx.beginPath();
    ctx.ellipse(width / 2, height / 2, r, r * 1.8, 0.05, 0, Math.PI * 2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Creates a subtle brushed gold bump texture.
 */
export function createBrushedGoldBumpTexture(size = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  // Brushed micro-streaks
  for (let i = 0; i < 1500; i++) {
    const y = Math.random() * size;
    const x = Math.random() * size;
    const len = 10 + Math.random() * 40;
    const val = Math.floor(110 + Math.random() * 35);
    ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;
    ctx.fillRect(x, y, len, 1);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/**
 * Creates a soft radial candle flame texture for realistic burning wicks.
 */
export function createFlameTexture(size = 128): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const cx = size / 2;
  const cy = size * 0.7;
  const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, size * 0.45);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.25, 'rgba(254, 240, 138, 0.95)');
  grad.addColorStop(0.55, 'rgba(249, 115, 22, 0.85)');
  grad.addColorStop(0.85, 'rgba(225, 29, 72, 0.35)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  return new THREE.CanvasTexture(canvas);
}

/**
 * Creates procedural sugar crystal sprinkle bump map for cake tiers.
 */
export function createFrostingTexture(size = 256): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#999999';
  ctx.fillRect(0, 0, size, size);

  // Fine sugar granule specks
  for (let i = 0; i < 2200; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 1.4;
    const v = Math.floor(150 + Math.random() * 90);
    ctx.fillStyle = `rgba(${v}, ${v}, ${v}, 0.5)`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}
