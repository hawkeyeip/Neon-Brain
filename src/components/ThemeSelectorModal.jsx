import React from 'react';
import { X, Palette, Check, Sparkles } from 'lucide-react';
import { THEMES } from '../services/themeService';

export default function ThemeSelectorModal({ isOpen, onClose, currentTheme, onSelectTheme }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel border border-cyan-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
        
        {/* Glowing Background Accent Blur */}
        <div 
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500"
          style={{ backgroundColor: currentTheme.primary }}
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 relative z-10">
          <div className="flex items-center space-x-3">
            <div 
              className="p-2.5 rounded-2xl border flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: `${currentTheme.primary}15`,
                borderColor: `${currentTheme.primary}40`,
                color: currentTheme.primary,
              }}
            >
              <Palette className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                DARK NEON THEME ENGINE
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Select your high-contrast cyberpunk visual matrix
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/60 border border-white/10 hover:border-slate-400 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 relative z-10 max-h-[60vh] overflow-y-auto pr-1">
          {THEMES.map((t) => {
            const isActive = currentTheme.id === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTheme(t.id)}
                className={`relative flex flex-col justify-between p-4 rounded-2xl border text-left transition-all duration-200 group ${
                  isActive
                    ? 'bg-slate-900/90 border-white/40 shadow-xl'
                    : 'bg-slate-900/40 border-white/10 hover:border-white/20 hover:bg-slate-900/60'
                }`}
                style={{
                  boxShadow: isActive ? `0 0 25px ${t.shadowGlow}` : undefined,
                  borderColor: isActive ? t.primary : undefined,
                }}
              >
                {/* Active Check Badge */}
                {isActive && (
                  <div 
                    className="absolute top-3 right-3 p-1 rounded-full text-black font-bold"
                    style={{ backgroundColor: t.primary }}
                  >
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}

                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{t.icon}</span>
                    <h3 className="font-bold text-white text-base tracking-wide">
                      {t.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mb-4 font-mono">
                    {t.tagline}
                  </p>
                </div>

                {/* Color Palette Swatch Bar */}
                <div className="flex items-center space-x-2 pt-2 border-t border-white/5">
                  <span className="text-[10px] text-slate-500 font-mono uppercase">Palette:</span>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: t.primary }} title={`Primary: ${t.primary}`} />
                    <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: t.secondary }} title={`Secondary: ${t.secondary}`} />
                    <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: t.accent }} title={`Accent: ${t.accent}`} />
                    <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: t.bgDark }} title={`Background: ${t.bgDark}`} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Live Theme Preview Bar */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-4 h-4" style={{ color: currentTheme.primary }} />
            <span className="text-xs text-slate-300 font-mono">
              Active: <strong style={{ color: currentTheme.primary }}>{currentTheme.name}</strong>
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-black transition-transform hover:scale-105 active:scale-95 shadow-lg"
            style={{ backgroundColor: currentTheme.primary }}
          >
            Apply Matrix Theme
          </button>
        </div>

      </div>
    </div>
  );
}
