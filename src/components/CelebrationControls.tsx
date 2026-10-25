/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Wind, Flame, PartyPopper, Sparkles, Music } from 'lucide-react';

interface CelebrationControlsProps {
  candlesLit: boolean;
  isPlayingMusic: boolean;
  equalizerBars: number[];
  onToggleCandles: () => void;
  onLaunchFireworks: (e?: React.MouseEvent) => void;
  onGrandSalute: () => void;
}

export const CelebrationControls: React.FC<CelebrationControlsProps> = ({
  candlesLit,
  isPlayingMusic,
  equalizerBars,
  onToggleCandles,
  onLaunchFireworks,
  onGrandSalute
}) => {
  return (
    <nav
      aria-label="Celebration Controls"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 sm:gap-4 bg-slate-900/80 backdrop-blur-xl border border-white/15 rounded-full p-2 sm:p-2.5 shadow-2xl max-w-[95vw]"
    >
      {/* Blow the Candle Button */}
      <button
        onClick={onToggleCandles}
        aria-label={candlesLit ? 'Blow the Candle' : 'Relight Candles'}
        className={`h-12 sm:h-14 px-5 sm:px-8 rounded-full flex items-center gap-2 sm:gap-3 font-extrabold tracking-wider uppercase text-xs sm:text-base transition-all transform active:scale-90 shadow-xl cursor-pointer ${
          candlesLit
            ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-orange-500/50 hover:scale-105 ring-2 ring-amber-300/60 animate-pulse'
            : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/40 hover:scale-105 ring-2 ring-emerald-300/50'
        }`}
      >
        {candlesLit ? (
          <>
            <Wind className="w-5 h-5 sm:w-6 sm:h-6 animate-bounce" />
            <span>Blow the Candle</span>
          </>
        ) : (
          <>
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 fill-white animate-pulse" />
            <span>Relight Candles</span>
          </>
        )}
      </button>

      {/* Launch Fireworks & Confetti Icon Button */}
      <button
        onClick={onLaunchFireworks}
        aria-label="Launch Fireworks and Confetti"
        title="Launch Fireworks"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-gradient-to-tr from-purple-600 via-pink-600 to-rose-500 text-white shadow-lg shadow-pink-500/30 hover:scale-105 transition-all transform active:scale-90 cursor-pointer"
      >
        <PartyPopper className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Multi-Salute Burst Icon Button */}
      <button
        onClick={onGrandSalute}
        aria-label="Grand Birthday Fireworks Salute"
        title="Grand Salute"
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 border border-white/15 text-amber-300 hover:scale-105 transition-all transform active:scale-90 cursor-pointer"
      >
        <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      {/* Always-On Music Indicator & Equalizer */}
      <div
        aria-label="Background Birthday Music Playing"
        className="h-10 sm:h-12 px-3 sm:px-4 rounded-full flex items-center gap-1.5 sm:gap-2 bg-amber-500/20 border border-amber-400/50 text-amber-300 shadow-lg shadow-amber-500/20"
      >
        <Music className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-bounce" />
        <div className="flex items-end gap-0.5 h-3.5 sm:h-4" aria-hidden="true">
          {equalizerBars.slice(0, 5).map((height, i) => (
            <span
              key={i}
              style={{
                height: isPlayingMusic ? `${height}%` : '40%',
                transition: 'height 0.18s ease'
              }}
              className="w-0.5 sm:w-1 rounded-full bg-gradient-to-t from-rose-500 to-amber-300"
            />
          ))}
        </div>
      </div>
    </nav>
  );
};
