import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AmbientCanvas from './components/AmbientCanvas';
import ThoughtVault from './components/ThoughtVault';
import TaskCenter from './components/TaskCenter';
import PromptVault from './components/PromptVault';
import WatchCompanionView from './components/WatchCompanionView';
import ResourceTracker from './components/ResourceTracker';
import QuickCaptureModal from './components/QuickCaptureModal';
import DataBackupModal from './components/DataBackupModal';
import NotificationSettingsModal from './components/NotificationSettingsModal';
import { getInitialData, saveLocalStore } from './services/db';

export default function App() {
  const [activeTab, setActiveTab] = useState('brain'); // brain, tasks, prompts, resources, watch
  const [deviceMode, setDeviceMode] = useState('desktop'); // desktop, tablet, mobile, watch
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  // Load persistent local data
  const initial = getInitialData();
  const [notes, setNotes] = useState(initial.notes);
  const [tasks, setTasks] = useState(initial.tasks);
  const [prompts, setPrompts] = useState(initial.prompts);
  const [resources, setResources] = useState(initial.resources || []);

  // Auto-sync state to localStorage whenever modified
  useEffect(() => {
    saveLocalStore('neon_brain_notes_v1', notes);
  }, [notes]);

  useEffect(() => {
    saveLocalStore('neon_brain_tasks_v1', tasks);
  }, [tasks]);

  useEffect(() => {
    saveLocalStore('neon_brain_prompts_v1', prompts);
  }, [prompts]);

  useEffect(() => {
    saveLocalStore('neon_brain_resources_v1', resources);
  }, [resources]);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsQuickCaptureOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const refreshData = () => {
    const fresh = getInitialData();
    setNotes(fresh.notes);
    setTasks(fresh.tasks);
    setPrompts(fresh.prompts);
  };

  // Device mode container styling
  const containerClass = 
    deviceMode === 'mobile'
      ? 'max-w-md mx-auto border-x border-cyan-500/20 my-4 p-4 rounded-3xl bg-slate-950/60 shadow-2xl'
      : deviceMode === 'tablet'
      ? 'max-w-3xl mx-auto border-x border-cyan-500/20 my-4 p-4 rounded-3xl bg-slate-950/60 shadow-2xl'
      : 'max-w-7xl mx-auto px-4 lg:px-8 pb-12';

  return (
    <div className="min-h-screen relative text-slate-100 selection:bg-cyan-500 selection:text-black">
      {/* Background Animated Neural Particles */}
      <AmbientCanvas />

      {/* Top Glass Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        deviceMode={deviceMode}
        setDeviceMode={setDeviceMode}
        onOpenQuickCapture={() => setIsQuickCaptureOpen(true)}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        onOpenNotificationModal={() => setIsNotificationModalOpen(true)}
      />

      {/* Main App Workspace */}
      <main className={`relative z-10 ${containerClass}`}>
        
        {activeTab === 'brain' && (
          <ThoughtVault
            notes={notes}
            setNotes={setNotes}
            tasks={tasks}
            prompts={prompts}
            onNewNote={() => setIsQuickCaptureOpen(true)}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskCenter
            tasks={tasks}
            setTasks={setTasks}
          />
        )}

        {activeTab === 'prompts' && (
          <PromptVault
            prompts={prompts}
            setPrompts={setPrompts}
          />
        )}

        {activeTab === 'resources' && (
          <ResourceTracker
            resources={resources}
            setResources={setResources}
            onSyncTaskDuty={(newTaskDuty) => setTasks(prev => [newTaskDuty, ...prev])}
          />
        )}

        {activeTab === 'watch' && (
          <WatchCompanionView
            tasks={tasks}
            setTasks={setTasks}
            notes={notes}
            setNotes={setNotes}
            prompts={prompts}
            onExitWatchMode={() => {
              setActiveTab('brain');
              setDeviceMode('desktop');
            }}
          />
        )}

      </main>

      {/* Quick Capture Modal (Cmd+K) */}
      <QuickCaptureModal
        isOpen={isQuickCaptureOpen}
        onClose={() => setIsQuickCaptureOpen(false)}
        onSaveNote={(newNote) => setNotes(prev => [newNote, ...prev])}
        onSaveTask={(newTask) => setTasks(prev => [newTask, ...prev])}
        onSavePrompt={(newPrompt) => setPrompts(prev => [newPrompt, ...prev])}
      />

      {/* Data Sovereignty & Backup Modal */}
      <DataBackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onImportSuccess={refreshData}
      />

      {/* Push Notification & Reminder Settings Modal */}
      <NotificationSettingsModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        notes={notes}
        prompts={prompts}
      />

    </div>
  );
}
