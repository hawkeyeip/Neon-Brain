import React, { useState, useEffect } from 'react';
import { X, Bell, Volume2, ShieldCheck, Sparkles, Clock, Check, AlertCircle } from 'lucide-react';
import { requestNotificationPermission, sendNativeNotification, triggerMemoryRefresh, playNeonChime } from '../services/notificationService';

export default function NotificationSettingsModal({ isOpen, onClose, notes, prompts }) {
  const [permState, setPermState] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  );
  const [memoryInterval, setMemoryInterval] = useState('3h'); // off, 1h, 3h, 6h, daily
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    if ('Notification' in window) {
      setPermState(Notification.permission);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEnablePermission = async () => {
    const res = await requestNotificationPermission();
    setPermState(res);
    if (res === 'granted') {
      sendNativeNotification('Neon Brain Notifications Active ⚡', 'Push reminders and memory refreshes enabled!');
      setToastMsg('Permission granted! Native OS push notifications enabled.');
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const handleTestNotification = () => {
    if (soundEnabled) playNeonChime();
    sendNativeNotification(
      '⚡ Neon Brain Duty Alert',
      'Test notification triggered successfully. Reminders are fully active!'
    );
    setToastMsg('Test push notification sent!');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleTestMemoryRefresh = () => {
    const res = triggerMemoryRefresh(notes, prompts);
    if (res) {
      setToastMsg(`Surfaced Memory: "${res.item.title}"`);
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-cyan-500/40 glow-border-cyan shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/40">
            <Bell className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Push Notifications & Reminders</h3>
            <p className="text-xs text-slate-400 font-mono">Configurable duty alerts & memory refreshes</p>
          </div>
        </div>

        <div className="space-y-4">
          
          {/* Permission Status Box */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-100">Browser OS Notifications</h4>
              <p className="text-[11px] font-mono mt-0.5">
                Status: {permState === 'granted' ? (
                  <span className="text-emerald-400 font-bold">ACTIVE & GRANTED</span>
                ) : permState === 'denied' ? (
                  <span className="text-rose-400 font-bold">BLOCKED IN BROWSER</span>
                ) : (
                  <span className="text-amber-400 font-bold">PERMISSION REQUIRED</span>
                )}
              </p>
            </div>

            {permState !== 'granted' ? (
              <button
                onClick={handleEnablePermission}
                className="btn-neon-cyan px-3.5 py-2 rounded-xl text-xs font-bold"
              >
                Enable Push
              </button>
            ) : (
              <button
                onClick={handleTestNotification}
                className="btn-neon-cyan px-3 py-1.5 rounded-xl text-xs font-semibold"
              >
                Test Push
              </button>
            )}
          </div>

          {/* Sound & Audio Chimes */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Volume2 className="w-4 h-4 text-cyan-400" />
              <div>
                <h4 className="text-xs font-bold text-slate-100">Cyber Audio Chime</h4>
                <p className="text-[11px] text-slate-400">Play futuristic sound chime on alerts</p>
              </div>
            </div>

            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playNeonChime();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                soundEnabled
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/60'
                  : 'bg-slate-800 text-slate-400 border border-white/10'
              }`}
            >
              {soundEnabled ? 'Enabled' : 'Muted'}
            </button>
          </div>

          {/* Spaced Memory Refresh Interval */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-pink-400" />
                <h4 className="text-xs font-bold text-slate-100">Memory Refresh Engine</h4>
              </div>
              <button
                onClick={handleTestMemoryRefresh}
                className="text-[11px] font-mono text-pink-300 hover:underline"
              >
                Test Memory Flash
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Surfaces random notes or AI prompt preferences to keep key ideas fresh in your mind.
            </p>

            <div className="grid grid-cols-4 gap-2 pt-1">
              {[
                { id: 'off', label: 'Off' },
                { id: '1h', label: 'Every 1 hr' },
                { id: '3h', label: 'Every 3 hrs' },
                { id: 'daily', label: 'Daily' }
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setMemoryInterval(opt.id)}
                  className={`py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                    memoryInterval === opt.id
                      ? 'bg-pink-500/20 text-pink-300 border border-pink-500/50'
                      : 'bg-slate-950 text-slate-400 border border-white/5'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {toastMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center space-x-2 animate-in fade-in">
              <Check className="w-4 h-4 shrink-0" />
              <span>{toastMsg}</span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
