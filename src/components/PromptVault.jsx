import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Copy, 
  Check, 
  Star, 
  History, 
  Tag, 
  Cpu, 
  Edit3, 
  Trash2, 
  X,
  Code,
  Layers
} from 'lucide-react';

export default function PromptVault({ prompts, setPrompts }) {
  const [selectedTag, setSelectedTag] = useState('All');
  const [copiedId, setCopiedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [expandedHistoryId, setExpandedHistoryId] = useState(null);
  const [testVariables, setTestVariables] = useState({});

  // Extract unique tags across all prompts
  const allTags = ['All', ...new Set(prompts.flatMap(p => p.tags || []))];

  const filteredPrompts = prompts.filter(p => {
    if (selectedTag === 'All') return true;
    return p.tags && p.tags.includes(selectedTag);
  });

  const handleCopyPrompt = (promptObj) => {
    let finalPrompt = promptObj.currentPrompt;
    
    // Replace variable placeholders if provided in test state
    if (promptObj.variables && promptObj.variables.length > 0) {
      promptObj.variables.forEach(varName => {
        const val = testVariables[`${promptObj.id}-${varName}`];
        if (val) {
          finalPrompt = finalPrompt.replaceAll(`{{${varName}}}`, val);
        }
      });
    }

    navigator.clipboard.writeText(finalPrompt);
    setCopiedId(promptObj.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeletePrompt = (id) => {
    if (confirm('Delete this AI prompt template from your vault?')) {
      setPrompts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSavePrompt = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const targetModel = formData.get('targetModel');
    const category = formData.get('category');
    const currentPrompt = formData.get('currentPrompt');
    const versionNote = formData.get('versionNote');
    const tagsRaw = formData.get('tags');
    const rating = parseInt(formData.get('rating') || '5', 10);

    // Extract {{variable}} patterns automatically
    const matches = currentPrompt.match(/\{\{([^}]+)\}\}/g) || [];
    const variables = [...new Set(matches.map(m => m.replace(/[\{\}]/g, '').trim()))];

    const tags = tagsRaw
      ? tagsRaw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
      : [];

    if (editingPrompt) {
      const newHistory = [...(editingPrompt.versionHistory || [])];
      if (versionNote && versionNote.trim()) {
        newHistory.unshift({
          version: `v${(newHistory.length + 1).toFixed(1)}`,
          date: new Date().toISOString().split('T')[0],
          notes: versionNote.trim()
        });
      }

      setPrompts(prev => prev.map(p => p.id === editingPrompt.id ? {
        ...p,
        title,
        targetModel,
        category,
        currentPrompt,
        variables,
        tags,
        rating,
        versionHistory: newHistory,
        updatedAt: new Date().toISOString()
      } : p));
    } else {
      const newPromptItem = {
        id: `prompt-${Date.now()}`,
        title,
        targetModel,
        category,
        currentPrompt,
        variables,
        tags,
        rating,
        versionHistory: [
          {
            version: 'v1.0',
            date: new Date().toISOString().split('T')[0],
            notes: versionNote.trim() || 'Initial version added to matrix.'
          }
        ],
        updatedAt: new Date().toISOString()
      };
      setPrompts(prev => [newPromptItem, ...prev]);
    }

    setIsModalOpen(false);
    setEditingPrompt(null);
  };

  const openEditModal = (prompt = null) => {
    setEditingPrompt(prompt);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-pink-400" />
            <h2 className="text-xl font-bold text-white tracking-wide">AI Prompt Engineering Vault</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Track historical prompt improvements, system preferences, version tweaks, and model tags.
          </p>
        </div>

        <button
          onClick={() => openEditModal()}
          className="btn-neon-magenta flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Prompt Record</span>
        </button>
      </div>

      {/* Tag Filters */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold whitespace-nowrap transition-all ${
              selectedTag === tag
                ? 'bg-pink-500/20 text-pink-300 border border-pink-400/60 shadow-[0_0_12px_rgba(255,0,127,0.25)]'
                : 'bg-slate-900/60 text-slate-400 border border-white/10 hover:text-slate-200'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Prompt Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPrompts.map((p) => {
          const isCopied = copiedId === p.id;
          const isHistoryOpen = expandedHistoryId === p.id;

          return (
            <div
              key={p.id}
              className="glass-card p-5 rounded-2xl border border-pink-500/20 hover:border-pink-400/50 flex flex-col justify-between relative group"
            >
              <div>
                {/* Header: Title & Model Badge */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-100">{p.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono bg-purple-950/80 text-purple-300 border border-purple-500/30">
                        <Cpu className="w-3 h-3 mr-1" />
                        {p.targetModel}
                      </span>

                      {/* Star Rating */}
                      <div className="flex items-center text-amber-400 text-xs">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${i < p.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-900/60"
                      title="Edit prompt & version history"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePrompt(p.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900/60"
                      title="Delete prompt"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Prompt Content Box */}
                <div className="relative bg-slate-950/80 border border-white/10 rounded-xl p-3.5 my-3 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto">
                  <pre className="whitespace-pre-wrap font-mono text-[11px]">{p.currentPrompt}</pre>
                </div>

                {/* Variable Placeholder Inputs if any */}
                {p.variables && p.variables.length > 0 && (
                  <div className="bg-slate-900/70 p-3 rounded-xl border border-white/5 space-y-2 mb-3">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">
                      Variable Slots:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {p.variables.map(v => (
                        <div key={v} className="flex items-center space-x-1">
                          <span className="text-[10px] font-mono text-slate-400">{'{{' + v + '}}'}:</span>
                          <input
                            type="text"
                            placeholder="value..."
                            value={testVariables[`${p.id}-${v}`] || ''}
                            onChange={(e) => setTestVariables({ ...testVariables, [`${p.id}-${v}`]: e.target.value })}
                            className="bg-slate-950 border border-white/10 rounded px-2 py-0.5 text-[10px] text-slate-200 focus:outline-none focus:border-cyan-500 flex-1 font-mono"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions & Version History Toggle */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  onClick={() => setExpandedHistoryId(isHistoryOpen ? null : p.id)}
                  className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-pink-300 transition-colors font-mono"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>History ({p.versionHistory ? p.versionHistory.length : 1})</span>
                </button>

                <button
                  onClick={() => handleCopyPrompt(p)}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isCopied
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(0,255,157,0.4)]'
                      : 'btn-neon-magenta'
                  }`}
                >
                  {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Copied Prompt!' : 'Copy Prompt'}</span>
                </button>
              </div>

              {/* Expanded Version History Drawer */}
              {isHistoryOpen && (
                <div className="mt-3 p-3 bg-slate-950/90 rounded-xl border border-white/10 space-y-2 text-xs">
                  <div className="text-[10px] font-mono text-pink-400 font-bold uppercase tracking-wider">
                    Iteration & Improvement Log:
                  </div>
                  {p.versionHistory && p.versionHistory.map((h, idx) => (
                    <div key={idx} className="border-b border-white/5 pb-2 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                        <span className="text-pink-300 font-bold">{h.version}</span>
                        <span>{h.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 mt-0.5">{h.notes}</p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* Edit / Create Prompt Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-xl p-6 rounded-2xl border border-pink-500/40 glow-border-magenta shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-5 h-5 text-pink-400" />
              <h3 className="text-lg font-bold text-white">
                {editingPrompt ? 'Update Prompt & Add Iteration' : 'Record New AI Prompt Template'}
              </h3>
            </div>

            <form onSubmit={handleSavePrompt} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingPrompt?.title || ''}
                  required
                  placeholder="e.g., Code Refactor & Architecture Reviewer"
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Target Model</label>
                  <input
                    type="text"
                    name="targetModel"
                    defaultValue={editingPrompt?.targetModel || 'Gemini 3.6 / Claude 3.5'}
                    required
                    placeholder="Gemini 3.6 Flash / GPT-4o"
                    className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-pink-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Rating (1-5 Stars)</label>
                  <select
                    name="rating"
                    defaultValue={editingPrompt?.rating || 5}
                    className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-pink-500"
                  >
                    <option value={5}>5 Stars - Elite Output</option>
                    <option value={4}>4 Stars - Solid</option>
                    <option value={3}>3 Stars - Needs Refinement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tags <span className="text-slate-500 font-normal">(comma separated)</span>
                </label>
                <input
                  type="text"
                  name="tags"
                  defaultValue={editingPrompt?.tags ? editingPrompt.tags.join(', ') : ''}
                  placeholder="coding, architecture, system-prompt"
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-pink-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Prompt Text <span className="text-pink-400 font-normal">(Use {"{{variable_name}}"} for placeholders)</span>
                </label>
                <textarea
                  name="currentPrompt"
                  rows={6}
                  defaultValue={editingPrompt?.currentPrompt || ''}
                  required
                  placeholder="You are an expert... {{language}}"
                  className="w-full bg-slate-950 border border-white/10 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-pink-500 font-mono leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Version Improvement Notes <span className="text-slate-500 font-normal">(What changed or improved?)</span>
                </label>
                <input
                  type="text"
                  name="versionNote"
                  placeholder="e.g., Added zero symptom patching directive"
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white bg-slate-800/60"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-neon-magenta px-5 py-2 rounded-xl text-xs font-semibold"
                >
                  Save Prompt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
