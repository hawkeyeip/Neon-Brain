// Browser Push Notification & Audio Chime Service for Neon Brain

// Play subtle futuristic cyber chime using Web Audio API
export const playNeonChime = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } catch (err) {
    console.log('Audio chime error:', err);
  }
};

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  const result = await Notification.requestPermission();
  return result;
};

export const sendNativeNotification = (title, body, tag = 'neon-brain') => {
  playNeonChime();

  if ('Notification' in window && Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.svg',
        tag,
        badge: '/favicon.svg',
      });
    } catch (err) {
      console.log('Native notification error:', err);
    }
  }
};

// Memory Refresh Engine: Selects a random note or prompt to surface
export const triggerMemoryRefresh = (notes = [], prompts = []) => {
  const allItems = [
    ...notes.map(n => ({ type: 'Thought Note', title: n.title, content: n.content })),
    ...prompts.map(p => ({ type: 'AI Prompt', title: p.title, content: p.currentPrompt }))
  ];

  if (allItems.length === 0) return;

  const randomItem = allItems[Math.floor(Math.random() * allItems.length)];
  const title = `🧠 Memory Refresh: ${randomItem.title}`;
  const body = `${randomItem.type} — ${randomItem.content.slice(0, 100)}...`;

  sendNativeNotification(title, body, 'memory-refresh');
  return { title, body, item: randomItem };
};
