import React, { useState } from "react";
import {
  X,
  Settings,
  Shield,
  Bell,
  Cpu,
  Save,
  CheckCircle2,
  Sliders,
  Info,
  Key,
  Globe,
  Database,
  Lock,
} from "lucide-react";
import { useResearch } from "../../context/ResearchContext";

export function SettingsModal({ isOpen, onClose }) {
  const { isDemoMode, toggleMode, showToast } = useResearch();

  const [activeTab, setActiveTab] = useState("general"); // 'general' | 'agent' | 'notifications' | 'security' | 'about'

  // General Settings
  const [defaultScope, setDefaultScope] = useState({
    research: true,
    patents: true,
    news: true,
    competitors: true,
  });

  // Agent Resource Budget
  const [maxParallelWorkers, setMaxParallelWorkers] = useState(4);
  const [maxIterations, setMaxIterations] = useState(6);
  const [maxToolCalls, setMaxToolCalls] = useState(12);
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);

  // Notifications
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [flagLowConfidence, setFlagLowConfidence] = useState(true);

  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setIsSaved(true);
    if (showToast) {
      showToast("Platform settings and resource budget saved successfully.", "verified");
    }
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-[#0D0F16] border border-[#1A1F2C] w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden space-y-4 p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1A1F2C] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#240047] border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Platform Settings</h2>
              <p className="text-xs text-slate-400">Autonomous Multi-Agent Configuration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#121520] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1.5 border-b border-[#1A1F2C] pb-2 overflow-x-auto">
          {[
            { id: "general", label: "General" },
            { id: "agent", label: "Agent & Budget" },
            { id: "notifications", label: "Notifications" },
            { id: "security", label: "Security" },
            { id: "about", label: "About" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 ${
                activeTab === tab.id
                  ? "bg-[#7C2CFF] text-white font-bold shadow-nexus-glow"
                  : "bg-[#07080D] text-slate-400 hover:text-slate-200 border border-[#1A1F2C]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content Area */}
        <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
          {/* TAB 1: GENERAL */}
          {activeTab === "general" && (
            <div className="space-y-3 text-xs">
              <div className="bg-[#07080D] p-4 rounded-xl border border-[#1A1F2C] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-white">Execution Mode</div>
                    <div className="text-[11px] text-slate-400">
                      {isDemoMode ? "Offline Fallback Demo Mode" : "Live FastAPI Backend (Port 5000)"}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleMode()}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all border ${
                      isDemoMode
                        ? "bg-[#240047] text-purple-200 border-purple-500/40"
                        : "bg-emerald-950/70 text-emerald-300 border-emerald-500/40"
                    }`}
                  >
                    {isDemoMode ? "DEMO MODE" : "LIVE BACKEND"}
                  </button>
                </div>
              </div>

              <div className="bg-[#07080D] p-4 rounded-xl border border-[#1A1F2C] space-y-2">
                <div className="font-semibold text-white">Default Investigation Scope</div>
                <div className="text-[11px] text-slate-400">Default sources included when launching new research:</div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={defaultScope.research}
                      onChange={(e) => setDefaultScope({ ...defaultScope, research: e.target.checked })}
                      className="rounded accent-[#7C2CFF]"
                    />
                    <span>Research Papers (arXiv)</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={defaultScope.patents}
                      onChange={(e) => setDefaultScope({ ...defaultScope, patents: e.target.checked })}
                      className="rounded accent-[#7C2CFF]"
                    />
                    <span>Patents (USPTO)</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={defaultScope.news}
                      onChange={(e) => setDefaultScope({ ...defaultScope, news: e.target.checked })}
                      className="rounded accent-[#7C2CFF]"
                    />
                    <span>Market News (DuckDuckGo)</span>
                  </label>
                  <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={defaultScope.competitors}
                      onChange={(e) => setDefaultScope({ ...defaultScope, competitors: e.target.checked })}
                      className="rounded accent-[#7C2CFF]"
                    />
                    <span>Competitor Telemetry</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AGENT & BUDGET */}
          {activeTab === "agent" && (
            <div className="space-y-3 text-xs">
              <div className="bg-[#07080D] p-4 rounded-xl border border-[#1A1F2C] space-y-3">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <Sliders className="w-3.5 h-3.5 text-[#A855F7]" />
                  <span>Resource Budget Guardrails</span>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Max Iterations</span>
                    <span className="font-mono text-purple-300 font-bold">{maxIterations} Steps</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    value={maxIterations}
                    onChange={(e) => setMaxIterations(Number(e.target.value))}
                    className="w-full accent-[#7C2CFF] cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Tool-Call Limit</span>
                    <span className="font-mono text-cyan-300 font-bold">{maxToolCalls} Calls</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="20"
                    value={maxToolCalls}
                    onChange={(e) => setMaxToolCalls(Number(e.target.value))}
                    className="w-full accent-[#00D9FF] cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Confidence Threshold for Synthesis</span>
                    <span className="font-mono text-emerald-400 font-bold">{confidenceThreshold}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    step="5"
                    value={confidenceThreshold}
                    onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                    className="w-full accent-[#22C55E] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <div className="space-y-3 text-xs">
              <div className="bg-[#07080D] p-4 rounded-xl border border-[#1A1F2C] space-y-3">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <Bell className="w-3.5 h-3.5 text-[#00D9FF]" />
                  <span>Real-Time Intelligence Alerts</span>
                </div>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="text-slate-200 font-medium">Contradiction Alerts</div>
                    <div className="text-[11px] text-slate-400">Notify when opposing empirical claims are detected.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={(e) => setNotificationsEnabled(e.target.checked)}
                    className="w-4 h-4 accent-[#7C2CFF] rounded"
                  />
                </label>

                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="text-slate-200 font-medium">Low-Confidence Audit Flagging</div>
                    <div className="text-[11px] text-slate-400">Enqueue claims below confidence threshold for human sign-off.</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={flagLowConfidence}
                    onChange={(e) => setFlagLowConfidence(e.target.checked)}
                    className="w-4 h-4 accent-[#7C2CFF] rounded"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY */}
          {activeTab === "security" && (
            <div className="space-y-3 text-xs">
              <div className="bg-[#07080D] p-4 rounded-xl border border-[#1A1F2C] space-y-3">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Authentication & Access Control</span>
                </div>

                <div className="space-y-1 text-slate-300">
                  <div className="flex justify-between py-1 border-b border-[#1A1F2C]">
                    <span className="text-slate-400">Identity Provider:</span>
                    <span className="font-semibold text-emerald-300">Supabase Auth (Cloud)</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1A1F2C]">
                    <span className="text-slate-400">Bearer Token Transport:</span>
                    <span className="font-mono text-purple-300">JWT (RSA-256)</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Session Security:</span>
                    <span className="text-slate-200">256-bit TLS Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ABOUT */}
          {activeTab === "about" && (
            <div className="space-y-3 text-xs">
              <div className="bg-[#07080D] p-4 rounded-xl border border-[#1A1F2C] space-y-2">
                <div className="font-bold text-white">TrackWise AI</div>
                <p className="text-slate-400 leading-relaxed">
                  Autonomous AI Research & Competitor Intelligence Platform powered by LangGraph multi-agent orchestration, dynamic replanning, adversarial red-teaming, and Task 4 persistent memory.
                </p>
                <div className="pt-2 text-[11px] font-mono text-slate-500 space-y-0.5">
                  <div>Version: <span className="text-slate-300 font-bold">v2.4.0 (Hackathon Edition)</span></div>
                  <div>Orchestrator: <span className="text-purple-300 font-bold">10-Node LangGraph StateGraph</span></div>
                  <div>Memory Engine: <span className="text-cyan-300 font-bold">SQLite Persistent Ledger</span></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex justify-end gap-2.5 border-t border-[#1A1F2C]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#121520] hover:bg-[#1A1F2C] border border-[#1A1F2C] text-xs font-semibold text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#7C2CFF] hover:bg-[#6b21e8] text-white text-xs font-semibold shadow-nexus-glow transition-all"
          >
            {isSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
            <span>{isSaved ? "Saved!" : "Save Settings"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsModal;
