import React, { useState } from 'react';
import { 
  CreditCard, 
  Plus, 
  Search, 
  DollarSign, 
  Calendar, 
  Plane, 
  Cpu, 
  Key, 
  ShieldCheck, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  X,
  Sparkles,
  TrendingUp,
  RefreshCw
} from 'lucide-react';

export default function ResourceTracker({ resources, setResources, onSyncTaskDuty }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  const categories = ['All', 'Subscriptions', 'Travel Credits', 'Hardware Assets', 'Licenses'];

  const filteredResources = resources.filter(r => {
    const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesSearch = 
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.notes && r.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.tags && r.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesCat && matchesSearch;
  });

  // Analytics Calculations
  const monthlyTotal = resources
    .filter(r => r.category === 'Subscriptions' && r.billingCycle === 'Monthly')
    .reduce((acc, r) => acc + (parseFloat(r.cost) || 0), 0);

  const annualRunRate = monthlyTotal * 12 + resources
    .filter(r => r.category === 'Subscriptions' && r.billingCycle === 'Annual')
    .reduce((acc, r) => acc + (parseFloat(r.cost) || 0), 0);

  const travelCreditsTotal = resources
    .filter(r => r.category === 'Travel Credits')
    .reduce((acc, r) => acc + (parseFloat(r.cost) || 0), 0);

  const taxDeductibleTotal = resources
    .filter(r => r.businessDeductible)
    .reduce((acc, r) => acc + (parseFloat(r.cost) || 0), 0);

  const handleDeleteResource = (id) => {
    if (confirm('Are you sure you want to remove this resource asset?')) {
      setResources(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleSaveResource = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const category = formData.get('category');
    const cost = parseFloat(formData.get('cost') || '0');
    const billingCycle = formData.get('billingCycle');
    const renewalDate = formData.get('renewalDate');
    const autoRenew = formData.get('autoRenew') === 'on';
    const businessDeductible = formData.get('businessDeductible') === 'on';
    const tagsRaw = formData.get('tags');
    const notes = formData.get('notes');

    const tags = tagsRaw
      ? tagsRaw.split(',').map(t => t.trim().toLowerCase()).filter(Boolean)
      : [];

    if (editingResource) {
      setResources(prev => prev.map(r => r.id === editingResource.id ? {
        ...r,
        title,
        category,
        cost,
        billingCycle,
        renewalDate,
        autoRenew,
        businessDeductible,
        tags,
        notes
      } : r));
    } else {
      const newRes = {
        id: `res-${Date.now()}`,
        title,
        category,
        cost,
        billingCycle,
        renewalDate,
        autoRenew,
        businessDeductible,
        tags,
        notes
      };
      setResources(prev => [newRes, ...prev]);
    }

    setIsModalOpen(false);
    setEditingResource(null);
  };

  const openEditModal = (res = null) => {
    setEditingResource(res);
    setIsModalOpen(true);
  };

  const handleCreateTaskDuty = (res) => {
    if (onSyncTaskDuty) {
      onSyncTaskDuty({
        id: `task-res-${Date.now()}`,
        title: `Renew / Review ${res.title} ($${res.cost})`,
        priority: 'high',
        category: 'Subscriptions',
        dueDate: res.renewalDate || new Date().toISOString().split('T')[0],
        completed: false,
        recurring: res.billingCycle === 'Monthly' ? 'Monthly' : 'None',
        subtasks: [{ id: `sub-${Date.now()}`, title: 'Check renewal cost and auto-renew status', completed: false }],
        createdAt: new Date().toISOString(),
      });
      alert(`Created duty reminder in Task Center for ${res.title}!`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Analytics Metrics Banner */}
      <div className="glass-panel p-5 rounded-2xl space-y-4 border border-violet-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <CreditCard className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl font-bold text-white tracking-wide">Resource & Subscription Hub</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Unified tracking for SaaS subscriptions, travel vouchers, hardware assets, and business tax write-offs.
            </p>
          </div>

          <button
            onClick={() => openEditModal()}
            className="btn-neon-magenta flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Resource / Asset</span>
          </button>
        </div>

        {/* Analytics Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
              <span>Monthly SaaS</span>
              <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="text-lg font-bold text-cyan-300 font-mono">
              ${monthlyTotal.toFixed(2)}<span className="text-xs text-slate-500">/mo</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
              <span>Annual Run Rate</span>
              <TrendingUp className="w-3.5 h-3.5 text-pink-400" />
            </div>
            <div className="text-lg font-bold text-pink-300 font-mono">
              ${annualRunRate.toFixed(2)}<span className="text-xs text-slate-500">/yr</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
              <span>Travel Credits</span>
              <Plane className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-bold text-amber-300 font-mono">
              ${travelCreditsTotal.toFixed(2)}
            </div>
          </div>

          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between text-slate-400 text-xs font-mono mb-1">
              <span>Tax Write-offs</span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-emerald-300 font-mono">
              ${taxDeductibleTotal.toFixed(2)}
            </div>
          </div>

        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-400/60 shadow-[0_0_12px_rgba(157,0,255,0.25)]'
                  : 'bg-slate-900/60 text-slate-400 border border-white/10 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search resources, serials, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-purple-500/60"
          />
        </div>
      </div>

      {/* Resource Cards Grid */}
      {filteredResources.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border-dashed border-white/10">
          <CreditCard className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-300">No resource assets found</h3>
          <p className="text-xs text-slate-500 mt-1">Add a new subscription or credit above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResources.map((res) => {
            const isSub = res.category === 'Subscriptions';
            const isTravel = res.category === 'Travel Credits';

            return (
              <div
                key={res.id}
                className="glass-card p-5 rounded-2xl border border-purple-500/25 hover:border-purple-400/60 flex flex-col justify-between relative group"
              >
                <div>
                  {/* Top Row: Category Pill & Actions */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-purple-950/90 text-purple-300 border border-purple-500/30">
                      {isTravel ? <Plane className="w-3 h-3 mr-1 text-amber-400" /> : <CreditCard className="w-3 h-3 mr-1 text-cyan-400" />}
                      {res.category}
                    </span>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => openEditModal(res)}
                        className="p-1.5 text-slate-400 hover:text-cyan-400 rounded-lg hover:bg-slate-900/60"
                        title="Edit resource details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteResource(res.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900/60"
                        title="Delete resource asset"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Price */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-base font-bold text-slate-100">{res.title}</h3>
                    <div className="text-right">
                      <span className="text-base font-mono font-bold text-cyan-300">
                        ${parseFloat(res.cost).toFixed(2)}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 block">
                        /{res.billingCycle}
                      </span>
                    </div>
                  </div>

                  {/* Description / Notes */}
                  {res.notes && (
                    <p className="text-xs text-slate-300/80 line-clamp-2 mb-3">
                      {res.notes}
                    </p>
                  )}
                </div>

                {/* Bottom Row: Metadata Badges & Sync Duty Button */}
                <div className="pt-3 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1 text-slate-500" />
                      Renewal: {res.renewalDate || 'N/A'}
                    </span>

                    {res.businessDeductible && (
                      <span className="text-emerald-400 text-[10px] font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        Tax Write-Off
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCreateTaskDuty(res)}
                    className="w-full flex items-center justify-center space-x-1.5 py-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 hover:border-purple-400 text-purple-300 hover:text-white text-xs font-mono transition-all shadow-[0_0_10px_rgba(157,0,255,0.15)]"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Sync Duty to Task Center</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Edit / Create Resource Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel w-full max-w-xl p-6 rounded-2xl border border-purple-500/40 glow-border-cyan shadow-2xl relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 mb-4">
              <CreditCard className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-bold text-white">
                {editingResource ? 'Edit Resource Asset' : 'Add New Resource Asset'}
              </h3>
            </div>

            <form onSubmit={handleSaveResource} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Title / Name</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingResource?.title || ''}
                  required
                  placeholder="e.g., ChatGPT Plus, Delta eCredit, MacBook Pro"
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    name="category"
                    defaultValue={editingResource?.category || 'Subscriptions'}
                    className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Subscriptions">Subscriptions</option>
                    <option value="Travel Credits">Travel Credits</option>
                    <option value="Hardware Assets">Hardware Assets</option>
                    <option value="Licenses">Licenses</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cost ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="cost"
                    defaultValue={editingResource?.cost || 0}
                    required
                    className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Billing Cycle</label>
                  <select
                    name="billingCycle"
                    defaultValue={editingResource?.billingCycle || 'Monthly'}
                    className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Annual">Annual</option>
                    <option value="Voucher">Voucher</option>
                    <option value="Asset">One-Time Asset</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Renewal / Expiration Date</label>
                <input
                  type="date"
                  name="renewalDate"
                  defaultValue={editingResource?.renewalDate || new Date().toISOString().split('T')[0]}
                  required
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    name="autoRenew"
                    defaultChecked={editingResource?.autoRenew ?? true}
                    className="rounded accent-purple-400"
                  />
                  <span>Auto-renew enabled</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    name="businessDeductible"
                    defaultChecked={editingResource?.businessDeductible ?? false}
                    className="rounded accent-emerald-400"
                  />
                  <span className="text-emerald-300 font-semibold">Business Tax Write-Off</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Serials / Promo Details</label>
                <textarea
                  name="notes"
                  rows={3}
                  defaultValue={editingResource?.notes || ''}
                  placeholder="Additional details..."
                  className="w-full bg-slate-900/90 border border-white/10 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-purple-500 font-sans"
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
                  Save Resource Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
