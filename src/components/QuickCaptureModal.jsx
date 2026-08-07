import React, { useState, useEffect } from 'react';
import { X, Brain, CheckSquare, Sparkles, Plus } from 'lucide-react';

export default function QuickCaptureModal({ isOpen, onClose, onSaveNote, onSaveTask, onSavePrompt }) {
  const [captureType, setCaptureType] = useState('thought'); // thought, task, prompt
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open trigger handled upstream if needed
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedTags = tags ? tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean) : [];

    if (captureType === 'thought') {
      onSaveNote({
        id: `note-${Date.now()}`,
        title: title.trim(),
        category: 'Thoughts',
        tags: parsedTags.length > 0 ? parsedTags : ['quick-capture'],
        content: content.trim() || title.trim(),
        color: 'cyan',
        pinned: false,
        updatedAt: new Date().toISOString()
      });
    } else if (captureType === 'task') {
      onSaveTask({
        id: `task-${Date.now()}`,
        title: title.trim(),
        priority: 'high',
        category: 'Quick Duty',
        dueDate: new Date().toISOString().split('T')[0],
        completed: false,
        recurring: 'None',
        subtasks: [],
        createdAt: new Date().toISOString()
      });
    } else if (captureType === 'prompt') {
      onSavePrompt({
        id: `prompt-${Date.now()}`,
        title: title.trim(),
        targetModel: 'Gemini / Claude',
        category: 'Quick Prompt',
        currentPrompt: content.trim() || title.trim(),
        variables: [],
        tags: parsedTags.length > 0 ? parsedTags : ['quick-prompt'],
        rating: 5,
        versionHistory: [{ version: 'v1.0', date: new Date().toISOString().split('T')[0], notes: 'Quick captured' }],
        updatedAt: new Date().toISOString()
      });
    }

    setTitle('');
    setContent('');
    setTags('');
    onClose();
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

        <div className="flex items-center space-x-2 mb-4">
          <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/40">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Global Quick Capture</h3>
            <p className="text-xs text-slate-400 font-mono">Instant zero-friction brain dump</p>
          </div>
        </div>

        {/* Capture Type Selector */}
        <div className="grid grid-cols-3 gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-white/10 mb-4">
          <button
            type="button"
            onClick={() => setCaptureType('thought')}
            className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold ${
              captureType === 'thought' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Thought Note</span>
          </button>

          <button
            type="button"
            onClick={() => setCaptureType('task')}
            className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold ${
              captureType === 'task' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Duty Task</span>
          </button>

          <button
            type="button"
            onClick={() => setCaptureType('prompt')}
            className={`flex items-center justify-center space-x-1.5 py-2 rounded-lg text-xs font-semibold ${
              captureType === 'prompt' ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40' : 'text-slate-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Prompt</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder={captureType === 'task' ? 'What needs to be done?' : 'Title or quick headline...'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {captureType !== 'task' && (
            <div>
              <textarea
                rows={4}
                placeholder="Expand on details or prompt instructions..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>
          )}

          <div>
            <input
              type="text"
              placeholder="Tags (e.g. brain, prompt, priority)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-slate-950 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800/60"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-neon-cyan px-5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Capture to Second Brain</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
