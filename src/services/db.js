// IndexedDB and LocalStorage persistent data manager for Neon Brain

const STORAGE_KEYS = {
  NOTES: 'neon_brain_notes_v1',
  TASKS: 'neon_brain_tasks_v1',
  PROMPTS: 'neon_brain_prompts_v1',
  SETTINGS: 'neon_brain_settings_v1',
};

// Initial default high-quality glassmorphic seed data if empty
const DEFAULT_NOTES = [
  {
    id: 'note-1',
    title: 'Architecting the Personal Knowledge Engine',
    category: 'Plans',
    tags: ['second-brain', 'architecture', 'productivity'],
    content: `## Vision\nBuild a seamless, zero-latency second brain that connects desktop, phone, tablet, and watch.\n\n### Key Pillars\n- **100% Local-First**: No data leaves the local device storage.\n- **Glassmorphic Neon Aesthetics**: Dark futuristic theme with high readability.\n- **AI Prompt Matrix**: Track historical prompt improvements and system preferences.`,
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    pinned: true,
    color: 'cyan',
  },
  {
    id: 'note-2',
    title: 'Daily Deep Work Rituals & Cognitive Focus',
    category: 'Thoughts',
    tags: ['focus', 'routine', 'mindset'],
    content: `1. **Morning Sweep**: Check tasks, prioritize top 3 neon-highlighted duties.\n2. **90-min Deep Block**: Zero distraction execution phase.\n3. **Prompt Iteration Review**: Refine AI templates based on yesterday's outputs.`,
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    pinned: false,
    color: 'magenta',
  },
  {
    id: 'note-3',
    title: 'System Prompt Engineering Best Practices',
    category: 'Knowledge',
    tags: ['ai', 'prompt-design', 'cheatsheet'],
    content: `Always structure system instructions with:\n- Clear Role & Identity\n- Input Context & Boundaries\n- Step-by-Step Chain of Thought\n- Expected Output Schema / Format`,
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    pinned: true,
    color: 'emerald',
  }
];

const DEFAULT_TASKS = [
  {
    id: 'task-1',
    title: 'Review weekly strategic plans in Second Brain',
    priority: 'high',
    dueDate: new Date().toISOString().split('T')[0],
    completed: false,
    category: 'Plans',
    subtasks: [
      { id: 'sub-1', title: 'Filter notes by #plans tag', completed: true },
      { id: 'sub-2', title: 'Update priority roadmap', completed: false }
    ],
    recurring: 'Weekly',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: 'Test AI prompt preferences on complex coding tasks',
    priority: 'high',
    dueDate: new Date().toISOString().split('T')[0],
    completed: false,
    category: 'AI Prompts',
    subtasks: [],
    recurring: 'Daily',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Export JSON local backup to encrypted drive',
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    completed: false,
    category: 'System',
    subtasks: [],
    recurring: 'Monthly',
    createdAt: new Date().toISOString(),
  }
];

const DEFAULT_PROMPTS = [
  {
    id: 'prompt-1',
    title: 'Autonomous System Architect & Code Refactor',
    targetModel: 'Claude 3.5 / Gemini 1.5 Pro',
    category: 'Coding & Architecture',
    tags: ['refactoring', 'clean-code', 'system-design'],
    rating: 5,
    variables: ['language', 'codebase_context'],
    versionHistory: [
      {
        version: 'v1.0',
        date: '2026-07-15',
        notes: 'Initial role setup with standard clean code rules.'
      },
      {
        version: 'v2.1',
        date: '2026-08-05',
        notes: 'Added explicit directives for zero symptom patching and log inspection before diagnosis.'
      }
    ],
    currentPrompt: `You are an elite principal software architect specializing in {{language}}.\n\n### Directives:\n1. Always trace data flows before making structural edits.\n2. Never mask symptoms or throw dummy fallbacks.\n3. Verify all changes through test commands.\n\nContext:\n{{codebase_context}}`,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prompt-2',
    title: 'Structured Task & Strategy Generator',
    targetModel: 'Gemini 3.6 Flash / GPT-4o',
    category: 'Productivity',
    tags: ['planning', 'decomposition', 'execution'],
    rating: 4,
    variables: ['goal_description'],
    versionHistory: [
      {
        version: 'v1.0',
        date: '2026-08-01',
        notes: 'Generates top-level milestone lists.'
      }
    ],
    currentPrompt: `Break down the following goal into 3 high-impact phases with actionable subtasks:\n\nGoal: {{goal_description}}\n\nProvide output in clear GitHub markdown with priority flags.`,
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  }
];

// Helper to safely load data from localStorage or seed defaults
export const loadLocalStore = (key, defaultVal) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading key ${key}:`, err);
    return defaultVal;
  }
};

export const saveLocalStore = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error(`Error saving key ${key}:`, err);
  }
};

export const getInitialData = () => {
  const notes = loadLocalStore(STORAGE_KEYS.NOTES, DEFAULT_NOTES);
  const tasks = loadLocalStore(STORAGE_KEYS.TASKS, DEFAULT_TASKS);
  const prompts = loadLocalStore(STORAGE_KEYS.PROMPTS, DEFAULT_PROMPTS);
  const settings = loadLocalStore(STORAGE_KEYS.SETTINGS, {
    activeDeviceMode: 'desktop', // desktop, tablet, mobile, watch
    themeGlow: 'cyan',
    soundEffects: false,
    autoBackupEnabled: true,
  });

  return { notes, tasks, prompts, settings };
};

export const exportFullBackup = () => {
  const data = {
    appName: 'Neon Brain',
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    notes: loadLocalStore(STORAGE_KEYS.NOTES, DEFAULT_NOTES),
    tasks: loadLocalStore(STORAGE_KEYS.TASKS, DEFAULT_TASKS),
    prompts: loadLocalStore(STORAGE_KEYS.PROMPTS, DEFAULT_PROMPTS),
    settings: loadLocalStore(STORAGE_KEYS.SETTINGS, {}),
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `neon_brain_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const importFullBackup = (jsonData) => {
  try {
    const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    if (parsed.notes) saveLocalStore(STORAGE_KEYS.NOTES, parsed.notes);
    if (parsed.tasks) saveLocalStore(STORAGE_KEYS.TASKS, parsed.tasks);
    if (parsed.prompts) saveLocalStore(STORAGE_KEYS.PROMPTS, parsed.prompts);
    if (parsed.settings) saveLocalStore(STORAGE_KEYS.SETTINGS, parsed.settings);
    return true;
  } catch (err) {
    console.error('Failed to import data backup:', err);
    return false;
  }
};
