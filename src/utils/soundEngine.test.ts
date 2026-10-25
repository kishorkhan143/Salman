import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BIRTHDAY_MELODY,
  calculateBeatDelay,
  generateRandomEqualizer,
  formatBirthdayWish
} from './soundEngine';

test('BIRTHDAY_MELODY has correct musical structure', () => {
  assert.ok(BIRTHDAY_MELODY.length > 20, 'Melody should contain full Happy Birthday song');
  BIRTHDAY_MELODY.forEach(([freq, duration]) => {
    assert.ok(freq >= 200 && freq <= 1000, `Frequency ${freq} should be in audible musical range`);
    assert.ok(duration > 0 && duration <= 4, `Duration ${duration} should be valid beats`);
  });
});

test('calculateBeatDelay computes correct millisecond delays', () => {
  assert.equal(calculateBeatDelay(1, 440), 440);
  assert.equal(calculateBeatDelay(0.5, 440), 220);
  assert.equal(calculateBeatDelay(2, 440), 880);
  assert.ok(calculateBeatDelay(0.01, 440) >= 50, 'Minimum delay safeguard enforced');
});

test('generateRandomEqualizer generates bounded bar heights', () => {
  const bars = generateRandomEqualizer(8, 20, 100);
  assert.equal(bars.length, 8);
  bars.forEach(val => {
    assert.ok(val >= 20 && val <= 100, `Bar value ${val} should be between 20 and 100`);
  });
});

test('formatBirthdayWish creates correct spoken string', () => {
  assert.equal(formatBirthdayWish('Salman Khan'), 'Happy Birthday Salman Khan!');
  assert.equal(formatBirthdayWish('  Salman Khan  '), 'Happy Birthday Salman Khan!');
});
