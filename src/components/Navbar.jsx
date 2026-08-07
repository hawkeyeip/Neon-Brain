import React from 'react';
import { 
  Brain, 
  CheckSquare, 
  Sparkles, 
  Watch, 
  Plus, 
  HardDrive, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Download,
  Bell,
  CreditCard
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  deviceMode, 
  setDeviceMode,
  onOpenQuickCapture,
  onOpenBackupModal,
  onOpenNotificationModal
}) {
  const navTabs = [
    { id: 'brain', label: 'Second Brain', icon: Brain, color: 'text-cyan-400' },
    { id: 'tasks', label: 'Task Center', icon: CheckSquare, color: 'text-emerald-400' },
    { id: 'prompts', label: 'AI Prompt Vault', icon: Sparkles, color: 'text-pink-400' },
    { id: 'resources', label: 'Resource Hub', icon: CreditCard, color: 'text-purple-400' },
    { id: 'watch', label: 'Watch Mode', icon: Watch, color: 'text-amber-400' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-4 lg:px-8 py-3 mb-6">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand Title */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/40 glow-border-cyan">
            <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-neon-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-pink-400 to-purple-400">
              NEON BRAIN
            </h1>
            <p className="text-xs text-slate-400 font-mono hidden sm:block">
              Central Knowledge & Prompt Matrix
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-900/60 p-1.5 rounded-2xl border border-white/10">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (tab.id === 'watch') {
                    if (activeTab === 'watch') {
                      setActiveTab('brain');
                      setDeviceMode('desktop');
                    } else {
                      setActiveTab('watch');
                      setDeviceMode('watch');
                    }
                  } else {
                    setActiveTab(tab.id);
                    if (deviceMode === 'watch') {
                      setDeviceMode('desktop');
                    }
                  }
                }}
                className={`flex items-center space-x-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-slate-800 text-white border border-cyan-500/50 shadow-[0_0_15px_rgba(0,243,255,0.25)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? tab.color : 'text-slate-400'}`} />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action Controls & Device View Switcher */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Quick Capture Button */}
          <button
            onClick={onOpenQuickCapture}
            className="btn-neon-cyan flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold"
            title="Quick Capture (Cmd + K)"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Capture</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-cyan-950/80 rounded border border-cyan-500/30 text-cyan-300">
              ⌘K
            </kbd>
          </button>

          {/* Notification Settings Button */}
          <button
            onClick={onOpenNotificationModal}
            className="p-2 rounded-xl bg-slate-800/70 border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 transition-colors relative"
            title="Push Notifications & Reminders"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          </button>

          {/* Backup / Export Button */}
          <button
            onClick={onOpenBackupModal}
            className="p-2 rounded-xl bg-slate-800/70 border border-white/10 hover:border-purple-500/40 text-slate-300 hover:text-purple-300 transition-colors"
            title="Data Sovereign Backup (JSON)"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Device Simulator Toggle (Desktop / Tablet / Phone / Watch) */}
          <div className="hidden lg:flex items-center bg-slate-900/80 p-1 rounded-xl border border-white/10 text-slate-400 text-xs">
            <button
              onClick={() => {
                setDeviceMode('desktop');
                if (activeTab === 'watch') setActiveTab('brain');
              }}
              className={`p-1.5 rounded-lg transition-colors ${deviceMode === 'desktop' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'hover:text-white'}`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setDeviceMode('tablet');
                if (activeTab === 'watch') setActiveTab('brain');
              }}
              className={`p-1.5 rounded-lg transition-colors ${deviceMode === 'tablet' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'hover:text-white'}`}
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setDeviceMode('mobile');
                if (activeTab === 'watch') setActiveTab('brain');
              }}
              className={`p-1.5 rounded-lg transition-colors ${deviceMode === 'mobile' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'hover:text-white'}`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (deviceMode === 'watch') {
                  setDeviceMode('desktop');
                  setActiveTab('brain');
                } else {
                  setDeviceMode('watch');
                  setActiveTab('watch');
                }
              }}
              className={`p-1.5 rounded-lg transition-colors ${deviceMode === 'watch' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'hover:text-white'}`}
              title="Toggle Watch Mode"
            >
              <Watch className="w-4 h-4" />
            </button>
          </div>

          {/* Offline Local Storage Indicator */}
          <div className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs">
            <HardDrive className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">OFFLINE LOCAL</span>
          </div>

        </div>

      </div>
    </header>
  );
}
