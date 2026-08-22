import React, { useState } from "react";
import { Sparkles, Play, Terminal, ArrowRight, ShieldCheck, Database, Layers, Radio, Compass, Building2, Zap, RefreshCw } from "lucide-react";
import { useResearch } from "../context/ResearchContext";
import { EXAMPLE_PROMPTS, RESEARCH_PRESETS } from "../services/mockData";

export function LandingEntry() {
  const { startAutonomousResearch, agentStatus } = useResearch();
  const [objective, setObjective] = useState(
    "Monitor NVIDIA's recent AI research and identify threats to our computer vision product."
  );

  const isRunning =
    agentStatus === "PLANNING" ||
    agentStatus === "GATHERING" ||
    agentStatus === "REASONING" ||
    agentStatus === "SYNTHESIZING";

  const handleSelectPrompt = (promptText) => {
    setObjective(promptText);
  };

  const handleStart = (e) => {
    e.preventDefault();
    if (!objective.trim() || isRunning) return;
    startAutonomousResearch(objective);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 py-6 pb-16">
      {/* Hero Section */}
      <div className="text-center space-y-4 relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#240047]/60 border border-purple-500/30 text-[#A855F7] text-xs font-mono font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>TRACKWISE // AUTONOMOUS AGENT</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight">
          Detect Early Market Signals. <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-[#A855F7] to-[#00D9FF]">
            Investigate Autonomous Evidence.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
          TrackWise helps you discover research, patents, competitor activity and market signals through autonomous AI-powered investigation.
        </p>
      </div>

      {/* Investigation Input Box */}
      <div className="bg-[#0D0F16] rounded-2xl p-6 sm:p-8 border border-[#1A1F2C] shadow-nexus-card relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#7C2CFF]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <form onSubmit={handleStart} className="space-y-5 relative z-10">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center justify-between">
              <span>Research Objective / Competitor Target</span>
              <span className="text-slate-500 font-normal">Autonomous Multi-Step Investigation</span>
            </label>

            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              disabled={isRunning}
              rows={3}
              placeholder="Enter your strategic objective (e.g. Monitor competitor X's edge vision patents, evaluate 1-bit LLM benchmarks, detect supply chain risks)..."
              className="w-full bg-[#07080D] border border-[#1A1F2C] rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#7C2CFF] focus:ring-1 focus:ring-[#7C2CFF] transition-all resize-none font-sans"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-3 border-t border-[#1A1F2C]">
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400 flex-wrap">
              <span className="flex items-center gap-1.5 bg-[#121520] px-2.5 py-1 rounded-lg border border-[#1A1F2C]">
                <Database className="w-3.5 h-3.5 text-[#00D9FF]" /> Web Search API
              </span>
              <span>+</span>
              <span className="flex items-center gap-1.5 bg-[#121520] px-2.5 py-1 rounded-lg border border-[#1A1F2C]">
                <Layers className="w-3.5 h-3.5 text-[#A855F7]" /> Research/Paper API
              </span>
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

      {/* Example Prompts */}
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
