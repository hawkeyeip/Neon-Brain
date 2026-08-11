// Cyberpunk Theme Definitions & Dynamic Engine

export const THEMES = [
  {
    id: 'cyber-cyan',
    name: 'Cyber Cyan',
    tagline: 'Classic Cyberpunk Matrix',
    icon: '🩵',
    primary: '#00f3ff',
    secondary: '#ff007f',
    accent: '#9d00ff',
    bgDark: '#070913',
    glassBg: 'rgba(15, 23, 42, 0.65)',
    glassBorder: 'rgba(0, 243, 255, 0.2)',
    particleColors: ['rgba(0, 243, 255, ', 'rgba(255, 0, 127, '],
    shadowGlow: 'rgba(0, 243, 255, 0.3)',
    gradient: 'from-cyan-400 via-pink-500 to-purple-500',
  },
  {
    id: 'matrix-green',
    name: 'Matrix Green',
    tagline: 'Digital Terminal Rain',
    icon: '🟢',
    primary: '#00ff9d',
    secondary: '#00ff41',
    accent: '#00b8ff',
    bgDark: '#030d07',
    glassBg: 'rgba(6, 28, 16, 0.65)',
    glassBorder: 'rgba(0, 255, 157, 0.2)',
    particleColors: ['rgba(0, 255, 157, ', 'rgba(0, 255, 65, '],
    shadowGlow: 'rgba(0, 255, 157, 0.3)',
    gradient: 'from-emerald-400 via-green-400 to-cyan-400',
  },
  {
    id: 'synth-purple',
    name: 'Synth Purple',
    tagline: 'Retrowave & Vaporwave Glow',
    icon: '🟣',
    primary: '#bd00ff',
    secondary: '#ff00aa',
    accent: '#00f3ff',
    bgDark: '#0a0418',
    glassBg: 'rgba(24, 10, 48, 0.65)',
    glassBorder: 'rgba(189, 0, 255, 0.2)',
    particleColors: ['rgba(189, 0, 255, ', 'rgba(255, 0, 170, '],
    shadowGlow: 'rgba(189, 0, 255, 0.3)',
    gradient: 'from-purple-400 via-pink-500 to-indigo-400',
  },
  {
    id: 'solar-amber',
    name: 'Solar Amber',
    tagline: 'Solar Flare & Gold Fusion',
    icon: '🟡',
    primary: '#ffb700',
    secondary: '#ff5500',
    accent: '#00ff9d',
    bgDark: '#120902',
    glassBg: 'rgba(38, 20, 5, 0.65)',
    glassBorder: 'rgba(255, 183, 0, 0.2)',
    particleColors: ['rgba(255, 183, 0, ', 'rgba(255, 85, 0, '],
    shadowGlow: 'rgba(255, 183, 0, 0.3)',
    gradient: 'from-amber-400 via-orange-500 to-yellow-400',
  },
  {
    id: 'ice-blue',
    name: 'Ice Blue',
    tagline: 'Sub-Zero Glacial Pulse',
    icon: '❄️',
    primary: '#38bdf8',
    secondary: '#818cf8',
    accent: '#00ff9d',
    bgDark: '#040b17',
    glassBg: 'rgba(12, 26, 52, 0.65)',
    glassBorder: 'rgba(56, 189, 248, 0.2)',
    particleColors: ['rgba(56, 189, 248, ', 'rgba(129, 140, 248, '],
    shadowGlow: 'rgba(56, 189, 248, 0.3)',
    gradient: 'from-sky-400 via-indigo-400 to-cyan-400',
  },
];

const THEME_STORAGE_KEY = 'neon_brain_theme_v1';
const listeners = new Set();

export function getSavedTheme() {
  const savedId = localStorage.getItem(THEME_STORAGE_KEY);
  const found = THEMES.find(t => t.id === savedId);
  return found || THEMES[0];
}

export function applyTheme(themeId) {
  const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
  const root = document.documentElement;

  root.style.setProperty('--neon-cyan', theme.primary);
  root.style.setProperty('--neon-magenta', theme.secondary);
  root.style.setProperty('--neon-purple', theme.accent);
  root.style.setProperty('--bg-dark', theme.bgDark);
  root.style.setProperty('--glass-bg', theme.glassBg);
  root.style.setProperty('--glass-border', theme.glassBorder);
  root.style.setProperty('--theme-glow', theme.shadowGlow);

  root.setAttribute('data-theme', theme.id);
  localStorage.setItem(THEME_STORAGE_KEY, theme.id);

  listeners.forEach(fn => fn(theme));
  return theme;
}

export function subscribeThemeChange(callback) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}
