import React, { useState, useRef } from 'react';
import { 
  Plus, 
  LayoutDashboard, 
  ListFilter, 
  Calendar as CalendarIcon, 
  Download, 
  Upload, 
  ShieldAlert,
  Sparkles,
  HelpCircle,
  Briefcase,
  FileSpreadsheet,
  RefreshCw,
  Info
} from 'lucide-react';
import DashboardStats from './rt/DashboardStats';
import ResourceList from './rt/ResourceList';
import CalendarView from './rt/CalendarView';
import ResourceForm from './rt/ResourceForm';
import UserGuide from './rt/UserGuide';
import OnboardingWizard from './rt/OnboardingWizard';
import CareerVault from './rt/CareerVault';
import ImportWizard from './rt/ImportWizard';

export default function ResourceTracker({ resources, setResources, onSyncTaskDuty }) {
  const [activeSubTab, setActiveSubTab] = useState('dashboard'); // dashboard, list, calendar, career, guide, import
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);

  // Onboarding Wizard State
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Shared filter state
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [businessFilter, setBusinessFilter] = useState('all');

  // Bulk import handler
  const handleImportResources = (newResources) => {
    setResources(prev => [...newResources, ...prev]);
    setActiveSubTab('list');
  };

  const handleAddOrEdit = (newResource) => {
    if (editingResource) {
      setResources(prev => prev.map(r => r.id === newResource.id ? newResource : r));
    } else {
      setResources(prev => [newResource, ...prev]);
    }
    setIsFormOpen(false);
    setEditingResource(null);
  };

  const handleEditClick = (resource) => {
    setEditingResource(resource);
    setIsFormOpen(true);
  };

  const handleDelete = (id, isPermanent = false) => {
    if (isPermanent) {
      if (confirm('Are you sure you want to permanently delete this resource?')) {
        setResources(prev => prev.filter(r => r.id !== id));
      }
    } else {
      if (confirm('Move resource to expired/used section?')) {
        setResources(prev => prev.map(r => {
          if (r.id === id) {
            return { ...r, used: true };
          }
          return r;
        }));
      }
    }
  };

  const handleRestore = (id) => {
    setResources(prev => prev.map(r => {
      if (r.id === id) {
        return { ...r, used: false };
      }
      return r;
    }));
  };

  // Sync a resource renewal to Neon Brain Task Command Center
  const handleSyncToNeonBrainTasks = (resource) => {
    if (onSyncTaskDuty) {
      const costStr = resource.cost || resource.value ? `$${resource.cost || resource.value}` : '';
      onSyncTaskDuty({
        id: `task-res-${Date.now()}`,
        title: `Renew / Review ${resource.name} (${costStr})`,
        priority: 'high',
        category: 'Subscriptions',
        dueDate: resource.expiryDate || new Date().toISOString().split('T')[0],
        completed: false,
        recurring: resource.billingCycle === 'monthly' ? 'Monthly' : 'None',
        subtasks: [
          { id: `sub-1-${Date.now()}`, title: `Verify auto-renew status (${resource.autoRenew ? 'Auto-Renew ON' : 'Auto-Renew OFF'})`, completed: false },
          { id: `sub-2-${Date.now()}`, title: 'Check business tax write-off classification', completed: false }
        ],
        createdAt: new Date().toISOString(),
      });
      alert(`Duty reminder synced to Task Center for ${resource.name}!`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Sub-Header Toolbar Navigation */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-purple-500/30">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">Resource & Subscription Master Hub</h2>
            <p className="text-xs text-slate-400 font-mono">100% Standalone Functionality Integrated</p>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-white/10 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveSubTab('dashboard')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'dashboard' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(157,0,255,0.25)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveSubTab('list')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'list' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(157,0,255,0.25)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Resource List ({resources.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('calendar')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'calendar' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(157,0,255,0.25)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>

          <button
            onClick={() => setActiveSubTab('career')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'career' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(157,0,255,0.25)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-pink-400" />
            <span>Career Vault</span>
          </button>

          <button
            onClick={() => setActiveSubTab('import')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'import' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(157,0,255,0.25)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>CSV Importer</span>
          </button>

          <button
            onClick={() => setActiveSubTab('guide')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSubTab === 'guide' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-[0_0_12px_rgba(157,0,255,0.25)]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Guide</span>
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={() => {
            setEditingResource(null);
            setIsFormOpen(true);
          }}
          className="btn-neon-magenta flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold"
        >
          <Plus className="w-4 h-4" />
          <span>Add Resource</span>
        </button>
      </div>

      {/* Main Sub-Tab Workspace */}
      <main className="transition-all duration-200">
        {activeSubTab === 'dashboard' && (
          <DashboardStats 
            resources={resources} 
            onNavigateToList={(status, business) => {
              if (status) setStatusFilter(status);
              if (business) setBusinessFilter(business);
              setActiveSubTab('list');
            }}
          />
        )}

        {activeSubTab === 'list' && (
          <ResourceList 
            resources={resources}
            onEdit={handleEditClick}
            onDelete={handleDelete}
            onRestore={handleRestore}
            onAddNew={() => {
              setEditingResource(null);
              setIsFormOpen(true);
            }}
            searchText={searchText}
            setSearchText={setSearchText}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            businessFilter={businessFilter}
            setBusinessFilter={setBusinessFilter}
            onSyncToTasks={handleSyncToNeonBrainTasks}
          />
        )}

        {activeSubTab === 'calendar' && (
          <CalendarView 
            resources={resources}
            onSelectResource={handleEditClick}
          />
        )}

        {activeSubTab === 'career' && (
          <CareerVault />
        )}

        {activeSubTab === 'import' && (
          <ImportWizard onImportComplete={handleImportResources} />
        )}

        {activeSubTab === 'guide' && (
          <UserGuide onOpenOnboarding={() => setIsOnboardingOpen(true)} />
        )}
      </main>

      {/* Resource Editor Modal */}
      <ResourceForm 
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingResource(null);
        }}
        onSave={handleAddOrEdit}
        initialData={editingResource}
      />

      {/* Onboarding Wizard */}
      <OnboardingWizard 
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

    </div>
  );
}
