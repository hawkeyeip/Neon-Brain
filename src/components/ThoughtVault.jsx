import React, { useState } from 'react';
import { 
  Brain, 
  Plus, 
  Search, 
  Pin, 
  Tag, 
  Folder, 
  Edit3, 
  Trash2, 
  Calendar,
  Sparkles,
  X,
  FileText
} from 'lucide-react';

export default function ThoughtVault({ notes, setNotes, onNewNote }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [editingNote, setEditingNote] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['All', 'Thoughts', 'Plans', 'Knowledge', 'Memory'];

  const filteredNotes = notes.filter((note) => {
    const matchesCategory = selectedCategory === 'All' || note.category === selectedCategory;
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.tags && note.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  // Sort pinned notes to top
  const sortedNotes = [...filteredNotes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

  const handleTogglePin = (id) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  };

  const handleDeleteNote = (id) => {
    if (confirm('Are you sure you want to delete this thought from your Second Brain?')) {
      setNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  const handleSaveNote = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const category = formData.get('category');
    const tagsRaw = formData.get('tags');
    const content = formData.get('content');
    const color = formData.get('color') || 'cyan';

    const tags = tagsRaw
      ? tagsRaw.split(',').map(t => t.trim().toLowerCase().replace(/^#/, '')).filter(Boolean)
      : [];

    if (editingNote) {
      setNotes(prev => prev.map(n => n.id === editingNote.id ? {
        ...n,
        title,
        category,
        tags,
        content,
        color,
        updatedAt: new Date().toISOString()
      } : n));
    } else {
      const newNote = {
        id: `note-${Date.now()}`,
        title,
        category,
        tags,
        content,
        color,
        pinned: false,
        updatedAt: new Date().toISOString()
      };
      setNotes(prev => [newNote, ...prev]);
    }

    setIsModalOpen(false);
    setEditingNote(null);
  };

  const openEditModal = (note = null) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5 rounded-2xl">
        <div>
          <div className="flex items-center space-x-2">
            <Brain className="w-6 h-6 text-cyan-400" />
            <h2 className="text-xl font-bold text-white tracking-wide">Second Brain & Memory Hub</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Central repository for thoughts, execution plans, long-term memory & core knowledge.
          </p>
        </div>

        <button
          onClick={() => openEditModal()}
          className="btn-neon-cyan flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Thought Note</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Filter Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/60 shadow-[0_0_12px_rgba(0,243,255,0.2)]'
                  : 'bg-slate-900/60 text-slate-400 border border-white/10 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search notes or #tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/40"
          />
        </div>
      </div>

      {/* Note Cards Grid */}
      {sortedNotes.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border-dashed border-white/10">
          <Brain className="w-12 h-12 text-slate-600 mx-auto mb-3 animate-pulse" />
          <h3 className="text-base font-semibold text-slate-300">No notes found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
            Try adjusting your search criteria or capture a new thought into your second brain.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedNotes.map((note) => {
            const glowClass = note.color === 'magenta' 
              ? 'border-pink-500/30 hover:border-pink-400/60' 
              : note.color === 'emerald' 
              ? 'border-emerald-500/30 hover:border-emerald-400/60' 
              : note.color === 'amber'
              ? 'border-amber-500/30 hover:border-amber-400/60'
              : 'border-cyan-500/30 hover:border-cyan-400/60';

            return (
              <div
                key={note.id}
                className={`glass-card p-5 rounded-2xl flex flex-col justify-between relative group ${glowClass}`}
              >
                {/* Top Bar: Category & Pin */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-slate-900/90 text-cyan-400 border border-cyan-500/30 font-mono">
                      <Folder className="w-3 h-3 mr-1" />
                      {note.category}
                    </span>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleTogglePin(note.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          note.pinned
                            ? 'text-amber-400 bg-amber-400/10'
                            : 'text-slate-500 hover:text-slate-300 opacity-0 group-hover:opacity-100'
                        }`}
                        title={note.pinned ? 'Unpin' : 'Pin to top'}
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => openEditModal(note)}
                        className="p-1.5 text-slate-500 hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Edit note"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Note Title */}
                  <h3 className="text-base font-semibold text-slate-100 mb-2 leading-snug">
                    {note.title}
                  </h3>

                  {/* Content Preview */}
                  <div className="text-xs text-slate-300/90 line-clamp-4 whitespace-pre-wrap font-sans leading-relaxed mb-4">
                    {note.content}
                  </div>
                </div>

                {/* Footer: Tags & Updated Timestamp */}
                <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {note.tags && note.tags.map((tag) => (
                      <span key={tag} className="text-slate-400 font-mono text-[10px]">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Timestamp */}
                  <span className="text-slate-500 flex items-center font-mono text-[10px]">
                    <Calendar className="w-3 h-3 mr-1 opacity-70" />
                    {new Date(note.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Create Note Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-xl p-6 rounded-2xl border border-cyan-500/40 glow-border-cyan shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-bold text-white">
                {editingNote ? 'Edit Second Brain Note' : 'Create New Note'}
              </h3>
            </div>

            <form onSubmit={handleSaveNote} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingNote?.title || ''}
                  required
                  placeholder="e.g., Weekly Strategic Goals & Ideas"
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    name="category"
                    defaultValue={editingNote?.category || 'Thoughts'}
                    className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Thoughts">Thoughts</option>
                    <option value="Plans">Plans</option>
                    <option value="Knowledge">Knowledge</option>
                    <option value="Memory">Memory</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Accent Glow</label>
                  <select
                    name="color"
                    defaultValue={editingNote?.color || 'cyan'}
                    className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="cyan">Neon Cyan</option>
                    <option value="magenta">Neon Pink</option>
                    <option value="emerald">Neon Emerald</option>
                    <option value="amber">Neon Amber</option>
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
                  defaultValue={editingNote?.tags ? editingNote.tags.join(', ') : ''}
                  placeholder="brain, strategy, focus"
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Note Content</label>
                <textarea
                  name="content"
                  rows={6}
                  defaultValue={editingNote?.content || ''}
                  required
                  placeholder="Write your thought, blueprint, plan or memory detail..."
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-sans leading-relaxed"
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
                  className="btn-neon-cyan px-5 py-2 rounded-xl text-xs font-semibold"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
