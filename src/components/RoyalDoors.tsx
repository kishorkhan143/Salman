/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface RoyalDoorsProps {
  doorState: 'closed' | 'opening' | 'opened';
  onOpenDoor: () => void;
}

export const RoyalDoors: React.FC<RoyalDoorsProps> = ({ doorState, onOpenDoor }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (doorState === 'opened') return null;

  return (
    <div
      onClick={onOpenDoor}
      onTouchStart={onOpenDoor}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label="Grand Palace Gates"
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden cursor-pointer door-perspective select-none bg-[#080210]"
    >
      {/* Volumetric Imperial Golden Light Shaft Behind Doors (Intensifies slowly as doors crack open) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-[3600ms] ease-out ${
          doorState === 'opening' ? 'opacity-100 scale-125' : 'opacity-20 scale-95'
        }`}
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(254, 240, 138, 0.95) 0%, rgba(245, 158, 11, 0.75) 22%, rgba(225, 29, 72, 0.35) 48%, rgba(12, 3, 22, 0.98) 78%)'
        }}
      />

      {/* Volumetric Sunbeam Glow from Center Seam */}
      <div
        className={`absolute inset-y-0 w-36 left-1/2 -translate-x-1/2 pointer-events-none transition-all duration-[3200ms] ${
          doorState === 'opening'
            ? 'opacity-100 scale-x-[18] blur-md'
            : 'opacity-35 scale-x-100 blur-sm'
        }`}
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255, 243, 180, 0.85) 50%, transparent 100%)'
        }}
      />

      {/* Outer Grand Palace Architectural Frame (No Text, Pure Architectural Luxury) */}
      <div className="absolute inset-2 sm:inset-5 md:inset-7 border-8 sm:border-[12px] border-amber-600/40 rounded-3xl pointer-events-none z-30 shadow-[inset_0_0_90px_rgba(0,0,0,0.95),0_0_70px_rgba(245,158,11,0.2)] flex flex-col justify-between p-2">
        {/* Top Ornate Gilded Header Trim */}
        <div className="w-full flex items-center justify-between px-6 pt-1">
          <div className="w-16 h-1.5 bg-gradient-to-r from-transparent via-amber-400 to-amber-600 rounded-full opacity-60" />
          <div className="flex items-center gap-2 text-amber-300/70">
            <Sparkles className="w-4 h-4 animate-pulse" />
            <div className="w-2.5 h-2.5 rotate-45 border border-amber-400 bg-amber-500/40" />
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div className="w-16 h-1.5 bg-gradient-to-l from-transparent via-amber-400 to-amber-600 rounded-full opacity-60" />
        </div>

        {/* Bottom Gilded Threshold Sill */}
        <div className="w-full h-3 bg-gradient-to-r from-amber-800/40 via-amber-400/80 to-amber-800/40 rounded-full" />
      </div>

      {/* DOUBLE PALACE DOORS CONTAINER */}
      <div className="relative w-full h-full flex">
        {/* LEFT DOOR PANEL (Plain, Elegant Architectural Design - NO TEXT) */}
        <div
          className={`relative w-1/2 h-full bg-[#140616] border-r-[3px] border-amber-300/90 shadow-[30px_0_80px_rgba(0,0,0,0.95)] flex flex-col justify-between p-3 sm:p-6 md:p-10 door-panel-left ${
            doorState === 'opening' ? 'door-open-left' : ''
          }`}
          style={{
            backgroundImage: `
              radial-gradient(circle at 100% 50%, rgba(245, 158, 11, 0.12), transparent 70%),
              repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.012) 0px, rgba(255, 255, 255, 0.012) 2px, transparent 2px, transparent 16px),
              linear-gradient(135deg, #1f081c 0%, #120412 50%, #0a020a 100%)
            `
          }}
        >
          {/* Main Coffered Door Outer Inset Frame */}
          <div className="w-full h-full border-4 border-amber-600/35 rounded-l-2xl p-3 sm:p-6 flex flex-col justify-between relative shadow-[inset_0_0_60px_rgba(0,0,0,0.9)]">
            {/* Precision Gilded Rivet Column along Hinge Stave */}
            <div className="absolute left-3 inset-y-6 flex flex-col justify-between pointer-events-none">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-yellow-100 via-amber-500 to-amber-900 shadow-[0_2px_4px_rgba(0,0,0,0.9)] border border-amber-300/70"
                />
              ))}
            </div>

            {/* Top Coffered Inset Panel: Sunburst Geometry */}
            <div className="w-full h-[28%] ml-2 border-2 border-amber-500/40 rounded-xl bg-gradient-to-b from-[#240a22] to-[#0e020d] shadow-[inset_0_6px_20px_rgba(0,0,0,0.95),0_0_15px_rgba(245,158,11,0.12)] flex items-center justify-center p-3 relative overflow-hidden">
              <div className="w-full h-full border border-amber-400/25 rounded-lg flex items-center justify-center relative">
                {/* Radial Geometric Sunburst Filigree */}
                <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-28 sm:h-28 text-amber-400/50">
                  <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.8" />
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                    <line
                      key={deg}
                      x1="50"
                      y1="50"
                      x2={50 + 38 * Math.cos((deg * Math.PI) / 180)}
                      y2={50 + 38 * Math.sin((deg * Math.PI) / 180)}
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      opacity="0.6"
                    />
                  ))}
                </svg>
              </div>
            </div>

            {/* Middle Coffered Inset Panel: Intricate Geometric Diamond Inlay */}
            <div className="w-full h-[36%] ml-2 border-2 border-amber-500/40 rounded-xl bg-gradient-to-b from-[#1d071b] to-[#0b010b] shadow-[inset_0_6px_20px_rgba(0,0,0,0.95)] flex items-center justify-center p-3 relative overflow-hidden">
              <div className="w-full h-full border border-amber-400/25 rounded-lg flex items-center justify-center relative">
                {/* Concentric Diamond Art-Deco Patterns */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 rotate-45 border-2 border-amber-400/40 flex items-center justify-center bg-amber-500/5 shadow-[0_0_25px_rgba(245,158,11,0.15)]">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 border border-amber-300/40 flex items-center justify-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 border border-amber-400/60 bg-gradient-to-br from-amber-400/40 to-transparent flex items-center justify-center">
                      <div className="w-3 h-3 bg-amber-300 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Coffered Inset Panel: Geometric Rosette */}
            <div className="w-full h-[28%] ml-2 border-2 border-amber-500/40 rounded-xl bg-gradient-to-t from-[#240a22] to-[#0e020d] shadow-[inset_0_6px_20px_rgba(0,0,0,0.95)] flex items-center justify-center p-3">
              <div className="w-full h-full border border-amber-400/25 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 text-amber-400/40">
                  <rect x="25" y="25" width="50" height="50" rx="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="35" y="35" width="30" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="1" />
                  <circle cx="50" cy="50" r="5" fill="currentColor" />
                </svg>
              </div>
            </div>

            {/* Left Solid Forged Brass Bar Handle */}
            <div className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 flex items-center z-10 pointer-events-none">
              <div className="w-5 sm:w-7 h-36 sm:h-48 rounded-full bg-gradient-to-b from-yellow-100 via-amber-400 to-amber-700 border-2 border-yellow-200 shadow-[0_6px_30px_rgba(0,0,0,0.9),0_0_25px_rgba(251,191,36,0.7)] flex flex-col items-center justify-between py-3">
                <div className="w-3 h-3 rounded-full bg-yellow-100 shadow-inner" />
                <div className="w-1.5 h-16 sm:h-24 bg-amber-900/60 rounded-full" />
                <div className="w-3 h-3 rounded-full bg-amber-800 shadow-inner" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT DOOR PANEL (Plain, Elegant Architectural Design - NO TEXT) */}
        <div
          className={`relative w-1/2 h-full bg-[#140616] border-l-[3px] border-amber-300/90 shadow-[-30px_0_80px_rgba(0,0,0,0.95)] flex flex-col justify-between p-3 sm:p-6 md:p-10 door-panel-right ${
            doorState === 'opening' ? 'door-open-right' : ''
          }`}
          style={{
            backgroundImage: `
              radial-gradient(circle at 0% 50%, rgba(245, 158, 11, 0.12), transparent 70%),
              repeating-linear-gradient(0deg, rgba(255, 255, 255, 0.012) 0px, rgba(255, 255, 255, 0.012) 2px, transparent 2px, transparent 16px),
              linear-gradient(225deg, #1f081c 0%, #120412 50%, #0a020a 100%)
            `
          }}
        >
          {/* Main Coffered Door Outer Inset Frame */}
          <div className="w-full h-full border-4 border-amber-600/35 rounded-r-2xl p-3 sm:p-6 flex flex-col justify-between relative shadow-[inset_0_0_60px_rgba(0,0,0,0.9)]">
            {/* Precision Gilded Rivet Column along Hinge Stave */}
            <div className="absolute right-3 inset-y-6 flex flex-col justify-between pointer-events-none">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full bg-gradient-to-br from-yellow-100 via-amber-500 to-amber-900 shadow-[0_2px_4px_rgba(0,0,0,0.9)] border border-amber-300/70"
                />
              ))}
            </div>

            {/* Top Coffered Inset Panel: Sunburst Geometry */}
            <div className="w-full h-[28%] mr-2 border-2 border-amber-500/40 rounded-xl bg-gradient-to-b from-[#240a22] to-[#0e020d] shadow-[inset_0_6px_20px_rgba(0,0,0,0.95),0_0_15px_rgba(245,158,11,0.12)] flex items-center justify-center p-3 relative overflow-hidden">
              <div className="w-full h-full border border-amber-400/25 rounded-lg flex items-center justify-center relative">
                <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-28 sm:h-28 text-amber-400/50">
                  <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
                  <circle cx="50" cy="50" r="8" fill="currentColor" opacity="0.8" />
                  {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                    <line
                      key={deg}
                      x1="50"
                      y1="50"
                      x2={50 + 38 * Math.cos((deg * Math.PI) / 180)}
                      y2={50 + 38 * Math.sin((deg * Math.PI) / 180)}
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      opacity="0.6"
                    />
                  ))}
                </svg>
              </div>
            </div>

            {/* Middle Coffered Inset Panel: Intricate Geometric Diamond Inlay */}
            <div className="w-full h-[36%] mr-2 border-2 border-amber-500/40 rounded-xl bg-gradient-to-b from-[#1d071b] to-[#0b010b] shadow-[inset_0_6px_20px_rgba(0,0,0,0.95)] flex items-center justify-center p-3 relative overflow-hidden">
              <div className="w-full h-full border border-amber-400/25 rounded-lg flex items-center justify-center relative">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rotate-45 border-2 border-amber-400/40 flex items-center justify-center bg-amber-500/5 shadow-[0_0_25px_rgba(245,158,11,0.15)]">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 border border-amber-300/40 flex items-center justify-center">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 border border-amber-400/60 bg-gradient-to-br from-amber-400/40 to-transparent flex items-center justify-center">
                      <div className="w-3 h-3 bg-amber-300 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.9)]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Coffered Inset Panel: Geometric Rosette */}
            <div className="w-full h-[28%] mr-2 border-2 border-amber-500/40 rounded-xl bg-gradient-to-t from-[#240a22] to-[#0e020d] shadow-[inset_0_6px_20px_rgba(0,0,0,0.95)] flex items-center justify-center p-3">
              <div className="w-full h-full border border-amber-400/25 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 text-amber-400/40">
                  <rect x="25" y="25" width="50" height="50" rx="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="35" y="35" width="30" height="30" rx="4" fill="none" stroke="currentColor" strokeWidth="1" />
                  <circle cx="50" cy="50" r="5" fill="currentColor" />
                </svg>
              </div>
            </div>

            {/* Right Solid Forged Brass Bar Handle */}
            <div className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 flex items-center z-10 pointer-events-none">
              <div className="w-5 sm:w-7 h-36 sm:h-48 rounded-full bg-gradient-to-b from-yellow-100 via-amber-400 to-amber-700 border-2 border-yellow-200 shadow-[0_6px_30px_rgba(0,0,0,0.9),0_0_25px_rgba(251,191,36,0.7)] flex flex-col items-center justify-between py-3">
                <div className="w-3 h-3 rounded-full bg-yellow-100 shadow-inner" />
                <div className="w-1.5 h-16 sm:h-24 bg-amber-900/60 rounded-full" />
                <div className="w-3 h-3 rounded-full bg-amber-800 shadow-inner" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CENTER GLOWING ORNATE ROSETTE SEAL (NO TEXT) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpenDoor();
        }}
        aria-label="Open doors and play music"
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 flex flex-col items-center cursor-pointer transition-all duration-[1200ms] focus:outline-none ${
          doorState === 'opening'
            ? 'scale-150 opacity-0 pointer-events-none'
            : isHovered
            ? 'scale-110'
            : 'scale-100'
        }`}
      >
        {/* Pulsing Concentric Golden Aura */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-40 h-40 sm:w-48 sm:h-48 rounded-full bg-amber-400/25 blur-2xl animate-pulse" />
          <div className="absolute w-32 h-32 sm:w-40 sm:h-40 rounded-full border-2 border-amber-300/60 animate-ping" />
          
          {/* Ornate Gilded Medallion */}
          <div className="w-28 h-28 sm:w-34 sm:h-34 rounded-full bg-gradient-to-br from-yellow-200 via-amber-400 to-amber-900 p-1.5 shadow-[0_0_60px_rgba(245,158,11,0.95)] flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#16041a] border-2 border-amber-300/80 flex items-center justify-center shadow-inner relative overflow-hidden group">
              {/* Radial Sunburst rays inside seal */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.25),transparent_70%)] pointer-events-none" />
              
              {/* Rotating Faceted Gold Rosette Icon */}
              <div className="relative flex items-center justify-center transition-transform duration-700 group-hover:rotate-90">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rotate-45 border-2 border-amber-300/80 bg-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.6)] flex items-center justify-center">
                  <div className="w-6 h-6 border border-amber-200 bg-amber-300 rounded-full animate-pulse shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};
