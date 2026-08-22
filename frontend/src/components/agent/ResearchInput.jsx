import React, { useState } from "react";
import { Play, Sparkles, Sliders, Target, Database, Clock } from "lucide-react";
import { useResearch } from "../../context/ResearchContext";
import { RESEARCH_PRESETS } from "../../services/mockData";

export function ResearchInput() {
  const { startAutonomousResearch, agentStatus } = useResearch();
  const [objective, setObjective] = useState(
    "Track recent developments in low-latency multimodal vision-language models for edge silicon and identify competitor patent filings and architectural threats."
  );
  const [selectedPresetId, setSelectedPresetId] = useState("preset-edge-ai");
  const [selectedSources, setSelectedSources] = useState([
    "ArXiv Preprints",
    "USPTO / WIPO Patents",
    "Tech News & Filings",
    "GitHub Releases",
  ]);
  const [timeHorizon, setTimeHorizon] = useState("30d");

  const isRunning =
    agentStatus === "PLANNING" ||
    agentStatus === "GATHERING" ||
    agentStatus === "REASONING" ||
    agentStatus === "SYNTHESIZING";

  const handleSelectPreset = (preset) => {
    setSelectedPresetId(preset.id);
    setObjective(preset.objective);
  };

  const handleToggleSource = (sourceName) => {
    setSelectedSources((prev) =>
      prev.includes(sourceName)
        ? prev.filter((s) => s !== sourceName)
        : [...prev, sourceName]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!objective.trim() || isRunning) return;
    startAutonomousResearch(objective, { sources: selectedSources, timeHorizon });
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-obsidian-700/80 shadow-2xl relative overflow-hidden">
      {/* Background ambient accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-intel-purple/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      <div className="relative z-10">
        {/* Preset Selector */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-intel-purple-light" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Autonomous Intelligence Mission Presets
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {RESEARCH_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  disabled={isRunning}
                  className={`text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                    isSelected
                      ? "bg-intel-purple/15 border-intel-purple text-purple-200 shadow-sm"
                      : "bg-obsidian-850/70 border-obsidian-750 text-slate-400 hover:border-obsidian-600 hover:text-slate-200"
                  }`}
                >
                  <span className="font-semibold text-slate-100 line-clamp-1 mb-1">
                    {preset.title}
                  </span>
                  <span className="text-[11px] text-slate-400 line-clamp-1">
                    {preset.domain}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Research Objective & Competitor Target
            </label>
            <div className="relative">
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                disabled={isRunning}
                rows={3}
                placeholder="Describe your research objective, target competitors, specific technologies, and intelligence queries..."
                className="w-full bg-obsidian-950/90 border border-obsidian-700 rounded-xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-intel-purple focus:ring-1 focus:ring-intel-purple transition-all resize-none font-sans"
              />
            </div>
          </div>

          {/* Dynamic Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-obsidian-800/80">
            {/* Sources Multi-select */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-intel-purple-light" />
                Sources:
              </span>
              {[
                "ArXiv Preprints",
                "USPTO / WIPO Patents",
                "Tech News & Filings",
                "GitHub Releases",
              ].map((src) => {
                const active = selectedSources.includes(src);
                return (
                  <button
                    key={src}
                    type="button"
                    onClick={() => handleToggleSource(src)}
                    disabled={isRunning}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all border ${
                      active
                        ? "bg-obsidian-800 text-intel-purple-light border-intel-purple/40"
                        : "bg-obsidian-900 text-slate-500 border-obsidian-800 hover:text-slate-300"
                    }`}
                  >
                    {active ? "✓ " : "+ "}
                    {src}
                  </button>
                );
              })}
            </div>

            {/* Time Horizon & Launch Button */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-1.5 bg-obsidian-950 border border-obsidian-750 px-2.5 py-1 rounded-lg">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(e.target.value)}
                  disabled={isRunning}
                  className="bg-transparent text-xs text-slate-300 focus:outline-none font-mono"
                >
                  <option value="7d" className="bg-obsidian-900">Last 7 Days</option>
                  <option value="30d" className="bg-obsidian-900">Last 30 Days</option>
                  <option value="90d" className="bg-obsidian-900">Last 90 Days</option>
                  <option value="365d" className="bg-obsidian-900">Last 1 Year</option>
                </select>
              </div>

              {/* Main CTA */}
              <button
                type="submit"
                disabled={isRunning || !objective.trim()}
                className={`inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg ${
                  isRunning
                    ? "bg-intel-purple/40 text-purple-200 cursor-not-allowed border border-intel-purple/30"
                    : "bg-gradient-to-r from-intel-purple to-purple-600 hover:from-purple-500 hover:to-intel-purple text-white shadow-intel-purple hover:shadow-purple-500/30 hover:scale-[1.01] active:scale-[0.99]"
                }`}
              >
                {isRunning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Agent Reasoning...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>Start Autonomous Research</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResearchInput;
