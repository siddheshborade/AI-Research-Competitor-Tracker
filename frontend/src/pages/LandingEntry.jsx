import React, { useState } from "react";
import {
  Sparkles,
  Play,
  Terminal,
  ArrowRight,
  ShieldCheck,
  Database,
  Layers,
  Radio,
  Compass,
  Building2,
  Zap,
  RefreshCw,
  Sliders,
  AlertTriangle,
  FileText,
  Globe,
  Brain,
} from "lucide-react";
import { useResearch } from "../context/ResearchContext";
import { EXAMPLE_PROMPTS } from "../services/mockData";
import { TrackWiseLogo } from "../components/common/TrackWiseLogo";

export function LandingEntry() {
  const { startAutonomousResearch, isRunning } = useResearch();
  const [objective, setObjective] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Scope controls
  const [scope, setScope] = useState({
    research: true,
    patents: true,
    news: true,
    competitors: true,
    memory: true,
  });

  // Resource budget & Chaos Mode
  const [maxIterations, setMaxIterations] = useState(6);
  const [maxToolCalls, setMaxToolCalls] = useState(12);
  const [chaosMode, setChaosMode] = useState(false);

  const handleSelectPrompt = (text) => {
    setObjective(text);
  };

  const handleStart = (e) => {
    e.preventDefault();
    if (!objective.trim() || isRunning) return;
    startAutonomousResearch(objective, {
      scope,
      max_iterations: maxIterations,
      max_tool_calls: maxToolCalls,
      chaos_mode: chaosMode,
    });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-4 pb-16 font-sans">
      {/* Title / Context Header */}
      <div className="text-center space-y-3">
        <div className="flex justify-center pb-1">
          <TrackWiseLogo size="lg" showTagline={false} />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#240047]/60 border border-purple-500/30 text-[#A855F7] text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-[#00D9FF]" />
          <span>AUTONOMOUS MULTI-AGENT INVESTIGATION</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-100 tracking-tight">
          New Research
        </h1>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Tell TrackWise what you want to investigate. The autonomous planner dynamically decomposes your goal across specialized agent workers.
        </p>
      </div>

      {/* Investigation Input Box */}
      <div className="bg-[#0D0F16] rounded-2xl p-6 sm:p-8 border border-[#1A1F2C] shadow-nexus-card relative overflow-hidden space-y-5">
        <form onSubmit={handleStart} className="space-y-5 relative z-10">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center justify-between">
              <span>What would you like TrackWise to investigate?</span>
              <span className="text-slate-500 font-normal">Autonomous Multi-Agent Planning</span>
            </label>

            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              disabled={isRunning}
              rows={3}
              placeholder="e.g. Monitor NVIDIA's recent AI research and identify threats to our computer vision product..."
              className="w-full bg-[#07080D] border border-[#1A1F2C] rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#7C2CFF] focus:ring-1 focus:ring-[#7C2CFF] transition-all resize-none font-sans"
            />
          </div>

          {/* Optional Scope Controls */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
              Investigation Scope:
            </span>
            <div className="flex flex-wrap gap-2.5">
              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#07080D] border border-[#1A1F2C] text-xs font-medium text-slate-300 cursor-pointer hover:border-[#7C2CFF]/40 transition-colors">
                <input
                  type="checkbox"
                  checked={scope.research}
                  onChange={(e) => setScope({ ...scope, research: e.target.checked })}
                  className="w-3.5 h-3.5 accent-[#7C2CFF] rounded"
                />
                <FileText className="w-3.5 h-3.5 text-[#00D9FF]" />
                <span>Research Papers</span>
              </label>

              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#07080D] border border-[#1A1F2C] text-xs font-medium text-slate-300 cursor-pointer hover:border-[#7C2CFF]/40 transition-colors">
                <input
                  type="checkbox"
                  checked={scope.patents}
                  onChange={(e) => setScope({ ...scope, patents: e.target.checked })}
                  className="w-3.5 h-3.5 accent-[#7C2CFF] rounded"
                />
                <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                <span>Patents</span>
              </label>

              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#07080D] border border-[#1A1F2C] text-xs font-medium text-slate-300 cursor-pointer hover:border-[#7C2CFF]/40 transition-colors">
                <input
                  type="checkbox"
                  checked={scope.news}
                  onChange={(e) => setScope({ ...scope, news: e.target.checked })}
                  className="w-3.5 h-3.5 accent-[#7C2CFF] rounded"
                />
                <Globe className="w-3.5 h-3.5 text-emerald-400" />
                <span>News & Web</span>
              </label>

              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#07080D] border border-[#1A1F2C] text-xs font-medium text-slate-300 cursor-pointer hover:border-[#7C2CFF]/40 transition-colors">
                <input
                  type="checkbox"
                  checked={scope.competitors}
                  onChange={(e) => setScope({ ...scope, competitors: e.target.checked })}
                  className="w-3.5 h-3.5 accent-[#7C2CFF] rounded"
                />
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Competitors</span>
              </label>

              <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#07080D] border border-[#1A1F2C] text-xs font-medium text-slate-300 cursor-pointer hover:border-[#7C2CFF]/40 transition-colors">
                <input
                  type="checkbox"
                  checked={scope.memory}
                  onChange={(e) => setScope({ ...scope, memory: e.target.checked })}
                  className="w-3.5 h-3.5 accent-[#7C2CFF] rounded"
                />
                <Brain className="w-3.5 h-3.5 text-[#00D9FF]" />
                <span>Historical Memory</span>
              </label>
            </div>
          </div>

          {/* Toggle Advanced Controls */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs font-mono text-[#A855F7] hover:underline flex items-center gap-1.5"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{showAdvanced ? "Hide Advanced Settings" : "Configure Advanced Settings (Budget & Chaos Mode)"}</span>
            </button>

            {showAdvanced && (
              <div className="mt-3 p-4 rounded-xl bg-[#07080D] border border-[#1A1F2C] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400">Max Iterations</span>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    value={maxIterations}
                    onChange={(e) => setMaxIterations(Number(e.target.value))}
                    className="w-full bg-[#121520] border border-[#1A1F2C] rounded-lg px-3 py-1.5 text-slate-100 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400">Max Tool Calls</span>
                  <input
                    type="number"
                    min="4"
                    max="24"
                    value={maxToolCalls}
                    onChange={(e) => setMaxToolCalls(Number(e.target.value))}
                    className="w-full bg-[#121520] border border-[#1A1F2C] rounded-lg px-3 py-1.5 text-slate-100 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400">Chaos Mode (Fault Injection)</span>
                  <button
                    type="button"
                    onClick={() => setChaosMode(!chaosMode)}
                    className={`w-full py-1.5 rounded-lg font-mono font-bold transition-all border ${
                      chaosMode
                        ? "bg-red-950/80 text-red-300 border-red-500/50"
                        : "bg-[#121520] text-slate-400 border-[#1A1F2C]"
                    }`}
                  >
                    {chaosMode ? "CHAOS MODE: ON" : "CHAOS MODE: OFF"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-3 border-t border-[#1A1F2C]">
            <div className="text-xs font-mono text-slate-500">
              * The dynamic planner automatically orchestrates tools and agents based on the objective.
            </div>

            <button
              type="submit"
              disabled={isRunning || !objective.trim()}
              className={`inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-lg ${
                isRunning
                  ? "bg-[#240047]/60 text-purple-200 cursor-not-allowed border border-purple-500/30"
                  : "bg-gradient-to-r from-[#7C2CFF] to-purple-600 hover:from-purple-500 hover:to-[#7C2CFF] text-white shadow-nexus-glow hover:scale-[1.01] active:scale-[0.99]"
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Agent Investigating...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Autonomous Investigation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Preset Investigation Scenarios */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#A855F7]" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Quickstart Investigation Scenarios
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">1-Click Investigation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {EXAMPLE_PROMPTS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectPrompt(item.prompt)}
              className="text-left p-5 rounded-2xl bg-[#0D0F16] border border-[#1A1F2C] hover:border-[#7C2CFF]/50 hover:bg-[#121520] transition-all space-y-2 group shadow-sm"
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#A855F7] font-bold group-hover:text-purple-300">
                  {item.title}
                </span>
                <span className="text-slate-500 group-hover:text-slate-300">
                  {item.domain}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-sans line-clamp-2 leading-relaxed">
                "{item.prompt}"
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LandingEntry;
