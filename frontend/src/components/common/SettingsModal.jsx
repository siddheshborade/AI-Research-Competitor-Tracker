import React, { useState } from "react";
import { X, Settings, Shield, Bell, Cpu, Save, CheckCircle2, Sliders } from "lucide-react";
import { useResearch } from "../../context/ResearchContext";

export function SettingsModal({ isOpen, onClose }) {
  const { isDemoMode, toggleMode, showToast } = useResearch();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoVerifyEvidence, setAutoVerifyEvidence] = useState(true);
  const [maxParallelWorkers, setMaxParallelWorkers] = useState(4);
  const [defaultConfidenceThreshold, setDefaultConfidenceThreshold] = useState(75);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setIsSaved(true);
    if (showToast) {
      showToast("Platform preferences updated successfully.", "verified");
    }
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-[#0D0F16] border border-[#1A1F2C] w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden space-y-5 p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1A1F2C] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#240047] border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Platform Settings</h2>
              <p className="text-xs text-slate-400">Configure Autonomous Investigation Preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#121520] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Sections */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Section 1: Execution Mode */}
          <div className="bg-[#07080D] p-4 rounded-xl border border-[#1A1F2C] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span>Multi-Agent Runtime Engine</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-white">API Execution Mode</div>
                <div className="text-[11px] text-slate-400">
                  {isDemoMode ? "Offline Demo Preset Mode" : "Live FastAPI Backend (Port 5000)"}
                </div>
              </div>
              <button
                onClick={() => toggleMode()}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all border ${
                  isDemoMode
                    ? "bg-[#240047] text-purple-200 border-purple-500/40"
                    : "bg-emerald-950/70 text-emerald-300 border-emerald-500/40"
                }`}
              >
                {isDemoMode ? "DEMO MODE" : "LIVE BACKEND"}
              </button>
            </div>
          </div>

          {/* Section 2: Agent Dispatch Limits */}
          <div className="bg-[#07080D] p-4 rounded-xl border border-[#1A1F2C] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <Sliders className="w-3.5 h-3.5 text-[#A855F7]" />
              <span>Resource Budget & Parallelism</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Max Concurrent Agent Workers</span>
                <span className="font-mono font-bold text-purple-300">{maxParallelWorkers} Workers</span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={maxParallelWorkers}
                onChange={(e) => setMaxParallelWorkers(Number(e.target.value))}
                className="w-full accent-[#7C2CFF] cursor-pointer"
              />
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Confidence Threshold for Synthesis</span>
                <span className="font-mono font-bold text-[#00D9FF]">{defaultConfidenceThreshold}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="95"
                step="5"
                value={defaultConfidenceThreshold}
                onChange={(e) => setDefaultConfidenceThreshold(Number(e.target.value))}
                className="w-full accent-[#00D9FF] cursor-pointer"
              />
            </div>
          </div>

          {/* Section 3: Verification & Alerts */}
          <div className="bg-[#07080D] p-4 rounded-xl border border-[#1A1F2C] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Trust & Governance Gate</span>
            </div>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-slate-300">Flag low-confidence claims for Human Review</span>
              <input
                type="checkbox"
                checked={autoVerifyEvidence}
                onChange={(e) => setAutoVerifyEvidence(e.target.checked)}
                className="w-4 h-4 rounded accent-[#7C2CFF]"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs text-slate-300">Real-time Contradiction Alerts</span>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="w-4 h-4 rounded accent-[#7C2CFF]"
              />
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex justify-end gap-3 border-t border-[#1A1F2C]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#121520] hover:bg-[#1A1F2C] border border-[#1A1F2C] text-xs font-semibold text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#7C2CFF] hover:bg-[#6b21e8] text-white text-xs font-semibold shadow-nexus-glow transition-all"
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{isSaved ? "Saved!" : "Save Preferences"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
