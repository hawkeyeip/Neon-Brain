import React, { useState } from 'react';
import { X, Download, Upload, HardDrive, ShieldCheck, Check, AlertCircle } from 'lucide-react';
import { exportFullBackup, importFullBackup } from '../services/db';

export default function DataBackupModal({ isOpen, onClose, onImportSuccess }) {
  const [importStatus, setImportStatus] = useState(null);

  if (!isOpen) return null;

  const handleExport = () => {
    exportFullBackup();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (content) {
        const success = importFullBackup(content);
        if (success) {
          setImportStatus('Data successfully imported and synced to local storage!');
          setTimeout(() => {
            if (onImportSuccess) onImportSuccess();
            onClose();
          }, 1500);
        } else {
          setImportStatus('Error: Invalid JSON backup file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-purple-500/40 glow-border-cyan shadow-2xl relative animate-in fade-in zoom-in-95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-5">
          <div className="p-2.5 bg-purple-500/20 text-purple-300 rounded-xl border border-purple-500/40">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Local Data Sovereignty & Backup</h3>
            <p className="text-xs text-slate-400 font-mono">Portable offline sync & JSON snapshots</p>
          </div>
        </div>

        <div className="space-y-4">
          
          {/* Explanation Banner */}
          <div className="bg-slate-900/90 border border-white/10 p-4 rounded-xl text-xs text-slate-300 leading-relaxed space-y-2">
            <div className="flex items-center space-x-2 text-cyan-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Private & On-Device</span>
            </div>
            <p>
              Your thoughts, tasks, and AI prompt matrix are stored exclusively on your device. Use full JSON exports to transfer your Second Brain across your computer, phone, tablet, and watch.
            </p>
          </div>

          {/* Export Action */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-100">Export Full Backup</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Download all notes, tasks & AI prompts as .json</p>
            </div>
            <button
              onClick={handleExport}
              className="btn-neon-cyan flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold"
            >
              <Download className="w-4 h-4" />
              <span>Export JSON</span>
            </button>
          </div>

          {/* Import Action */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-100">Import & Sync Backup</h4>
              <p className="text-[11px] text-slate-400 mt-0.5">Restore or merge data from an existing backup</p>
            </div>
            <label className="btn-neon-magenta flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer">
              <Upload className="w-4 h-4" />
              <span>Import File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {importStatus && (
            <div className={`p-3 rounded-xl text-xs font-mono flex items-center space-x-2 ${
              importStatus.startsWith('Error') 
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            }`}>
              {importStatus.startsWith('Error') ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
              <span>{importStatus}</span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
