import React, { useState, useEffect } from 'react';
import { 
  Watch, 
  CheckCircle2, 
  Circle, 
  Brain, 
  Sparkles, 
  Mic, 
  Plus, 
  Copy, 
  Check, 
  Clock,
  BatteryCharging
} from 'lucide-react';

export default function WatchCompanionView({ tasks, setTasks, notes, setNotes, prompts }) {
  const [activeWatchTab, setActiveWatchTab] = useState('tasks'); // tasks, record, prompt
  const [timeStr, setTimeStr] = useState('');
  const [micActive, setMicActive] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [copiedPromptId, setCopiedPromptId] = useState(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const todayTasks = tasks.filter(t => !t.completed).slice(0, 4);

  const handleToggleWatchTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const handleMicSimulate = () => {
    setMicActive(true);
    setVoiceText('Recording thought...');
    setTimeout(() => {
      setVoiceText('Deep work focus block scheduled for 2 PM');
    }, 1200);
  };

  const handleSaveVoiceThought = () => {
    if (!voiceText || voiceText === 'Recording thought...') return;
    const newNote = {
      id: `note-${Date.now()}`,
      title: 'Watch Mic Capture',
      category: 'Thoughts',
      tags: ['watch', 'voice-note'],
      content: voiceText,
      color: 'amber',
      pinned: true,
      updatedAt: new Date().toISOString()
    };
    setNotes(prev => [newNote, ...prev]);
    setVoiceText('');
    setMicActive(false);
    setActiveWatchTab('tasks');
  };

  const handleCopyWatchPrompt = (p) => {
    navigator.clipboard.writeText(p.currentPrompt);
    setCopiedPromptId(p.id);
    setTimeout(() => setCopiedPromptId(null), 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center py-6">
      
      {/* Outer Watch Bezel & Strap simulation */}
      <div className="relative flex flex-col items-center">
        
        {/* Top Strap */}
        <div className="w-32 h-12 bg-slate-900 border-x-2 border-t-2 border-slate-700/60 rounded-t-2xl mb-[-4px]" />

        {/* Watch Chassis */}
        <div className="watch-bezel flex flex-col justify-between z-10 shadow-[0_0_50px_rgba(0,243,255,0.3)]">
          <div className="watch-screen flex flex-col justify-between relative overflow-hidden">
            
            {/* Top Watch Status Bar */}
            <div className="flex items-center justify-between text-[11px] font-mono text-cyan-400 font-bold tracking-wider pb-1 border-b border-white/10">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1 text-cyan-300" />
                {timeStr}
              </span>
              <div className="flex items-center space-x-1 text-slate-400">
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[9px]">98%</span>
              </div>
            </div>

            {/* Watch Content Body */}
            <div className="flex-1 my-2 overflow-y-auto pr-1 scrollbar-none">
              
              {/* TAB 1: Tasks Quick Checklist */}
              {activeWatchTab === 'tasks' && (
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-bold">
                    Pending Duties ({todayTasks.length})
                  </div>
                  {todayTasks.length === 0 ? (
                    <div className="text-center py-6 text-slate-400 text-xs font-mono">
                      All Duties Done! ✨
                    </div>
                  ) : (
                    todayTasks.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => handleToggleWatchTask(t.id)}
                        className="w-full text-left p-2 rounded-xl bg-slate-900/80 border border-white/10 hover:border-emerald-400/50 flex items-center space-x-2 text-xs"
                      >
                        <Circle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate text-slate-200 text-[11px]">{t.title}</span>
                      </button>
                    ))
                  )}
                </div>
              )}

              {/* TAB 2: Rapid Voice/Touch Note Record */}
              {activeWatchTab === 'record' && (
                <div className="flex flex-col items-center justify-center space-y-3 py-2">
                  <button
                    onClick={handleMicSimulate}
                    className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all ${
                      micActive
                        ? 'bg-rose-500/20 border-rose-400 text-rose-400 animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.6)]'
                        : 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                    }`}
                  >
                    <Mic className="w-6 h-6" />
                  </button>

                  <p className="text-[10px] font-mono text-center text-slate-300 px-2 line-clamp-3">
                    {voiceText || 'Tap mic to dictate thought'}
                  </p>

                  {voiceText && voiceText !== 'Recording thought...' && (
                    <button
                      onClick={handleSaveVoiceThought}
                      className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400 text-amber-300 text-[10px] font-bold"
                    >
                      Save to Brain
                    </button>
                  )}
                </div>
              )}

              {/* TAB 3: Prompt Lookup */}
              {activeWatchTab === 'prompt' && (
                <div className="space-y-2">
                  <div className="text-[10px] font-mono text-pink-400 uppercase tracking-wider font-bold">
                    Quick AI Prompts
                  </div>
                  {prompts.slice(0, 3).map((p) => {
                    const isCopied = copiedPromptId === p.id;
                    return (
                      <div
                        key={p.id}
                        className="p-2 rounded-xl bg-slate-900/80 border border-white/10 flex items-center justify-between text-xs"
                      >
                        <span className="truncate text-slate-200 text-[10px] font-mono pr-1">{p.title}</span>
                        <button
                          onClick={() => handleCopyWatchPrompt(p)}
                          className="p-1 rounded-lg bg-pink-500/20 text-pink-300 shrink-0"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>

            {/* Bottom Watch Navigation Dock */}
            <div className="flex items-center justify-around pt-1 border-t border-white/10">
              <button
                onClick={() => setActiveWatchTab('tasks')}
                className={`p-1.5 rounded-lg ${activeWatchTab === 'tasks' ? 'text-emerald-400 bg-emerald-400/10' : 'text-slate-500'}`}
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveWatchTab('record')}
                className={`p-1.5 rounded-lg ${activeWatchTab === 'record' ? 'text-amber-400 bg-amber-400/10' : 'text-slate-500'}`}
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveWatchTab('prompt')}
                className={`p-1.5 rounded-lg ${activeWatchTab === 'prompt' ? 'text-pink-400 bg-pink-400/10' : 'text-slate-500'}`}
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Bottom Strap */}
        <div className="w-32 h-12 bg-slate-900 border-x-2 border-b-2 border-slate-700/60 rounded-b-2xl mt-[-4px]" />

      </div>

      <div className="mt-6 text-center max-w-sm">
        <h4 className="text-sm font-bold text-slate-200">Smartwatch Companion Mode</h4>
        <p className="text-xs text-slate-400 mt-1">
          Simulates watch display touch interaction, instant voice dictation capture, and 1-tap duty checkoff.
        </p>
      </div>

    </div>
  );
}
