/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const WavyBanner: React.FC = () => {
  return (
    <header className="fixed top-2 left-0 right-0 z-30 pointer-events-none flex flex-col items-center justify-center px-2">
      <div className="relative w-full max-w-4xl flex flex-col items-center">
        {/* Decorative Wavy SVG Ribbons Behind Text */}
        <svg
          viewBox="0 0 1000 230"
          className="w-full h-36 sm:h-48 md:h-56 overflow-visible drop-shadow-[0_10px_25px_rgba(244,63,94,0.45)]"
          aria-label="Happy Birthday Salman Khan"
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
  );
};
