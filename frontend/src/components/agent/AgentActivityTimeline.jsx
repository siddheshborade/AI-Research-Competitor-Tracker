import React from "react";
import { Brain, Cpu, Database, RefreshCw, Layers, Sparkles, Terminal, ChevronRight } from "lucide-react";
import { useResearch } from "../../context/ResearchContext";

export function AgentActivityTimeline() {
  const { agentSteps, agentStatus, setSelectedAgentStep } = useResearch();

  const getPhaseIcon = (phase) => {
    switch (phase) {
      case "PLANNING":
        return <Brain className="w-4 h-4 text-purple-400" />;
      case "TOOL_SELECTION":
      case "MULTI_SOURCE":
        return <Database className="w-4 h-4 text-cyan-400" />;
      case "OBSERVE_AND_REPLAN":
        return <RefreshCw className="w-4 h-4 text-amber-400 animate-spin" />;
      case "CROSS_CHECK":
        return <Layers className="w-4 h-4 text-emerald-400" />;
      case "SYNTHESIS":
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
      default:
        return <Cpu className="w-4 h-4 text-slate-400" />;
    }
  };

  const getBadgeStyle = (phase) => {
    switch (phase) {
      case "PLANNING":
        return "bg-purple-950/70 border-purple-500/40 text-purple-300";
      case "TOOL_SELECTION":
      case "MULTI_SOURCE":
        return "bg-cyan-950/70 border-cyan-500/40 text-cyan-300";
      case "OBSERVE_AND_REPLAN":
        return "bg-amber-950/70 border-amber-500/40 text-amber-300";
      case "CROSS_CHECK":
        return "bg-emerald-950/70 border-emerald-500/40 text-emerald-300";
      case "SYNTHESIS":
        return "bg-indigo-950/70 border-indigo-500/40 text-indigo-300";
      default:
        return "bg-obsidian-800 border-obsidian-700 text-slate-300";
    }
  };

  if (!agentSteps || agentSteps.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-8 text-center text-slate-400 space-y-3">
        <Terminal className="w-8 h-8 text-intel-purple-light mx-auto opacity-60" />
        <h4 className="text-sm font-semibold text-slate-200">ReAct Autonomous Loop Standby</h4>
        <p className="text-xs max-w-sm mx-auto text-slate-400">
          When research is launched, live reasoning thoughts, dynamic tool selection, evidence cross-checking, and plan revisions stream here.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-6 border border-obsidian-700/80 space-y-6">
      <div className="flex items-center justify-between border-b border-obsidian-750 pb-4">
        <div className="flex items-center gap-2.5">
          <Terminal className="w-5 h-5 text-intel-purple-light" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            Autonomous ReAct Loop Execution Stream
          </h3>
        </div>
        <div className="text-xs font-mono text-slate-400">
          {agentSteps.length} Steps Executed
        </div>
      </div>

      <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-obsidian-700">
        {agentSteps.map((step, idx) => {
          return (
            <div
              key={idx}
              className="relative group transition-all"
            >
              {/* Timeline indicator node */}
              <div className="absolute -left-[27px] top-1.5 w-6 h-6 rounded-full bg-obsidian-900 border border-obsidian-600 flex items-center justify-center shadow-md group-hover:border-intel-purple transition-colors">
                {getPhaseIcon(step.phase)}
              </div>

              {/* Step Card */}
              <div
                onClick={() => setSelectedAgentStep(step)}
                className="bg-obsidian-900/90 border border-obsidian-750 hover:border-obsidian-600 rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      #{step.stepNumber}
                    </span>
                    <span
                      className={`text-[11px] font-mono font-medium px-2 py-0.5 rounded border ${getBadgeStyle(
                        step.phase
                      )}`}
                    >
                      {step.badge || step.phase}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-100 group-hover:text-intel-purple-light transition-colors">
                      {step.title}
                    </h4>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {step.timestamp}
                  </span>
                </div>

                {/* Reason / Thought */}
                <div className="bg-obsidian-950/80 rounded-lg p-3 border border-obsidian-800/80 text-xs font-mono space-y-1">
                  <div className="text-[10px] uppercase font-bold text-purple-400 flex items-center gap-1.5">
                    <span>▶ Agent Reasoning / Thought:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed font-sans">{step.thought}</p>
                </div>

                {/* Action & Observation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-obsidian-850/60 rounded-lg p-2.5 border border-obsidian-750">
                    <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1 font-mono">
                      Action Invoked:
                    </span>
                    <code className="text-[11px] font-mono text-cyan-200">
                      {step.action}(...)
                    </code>
                  </div>

                  <div className="bg-obsidian-850/60 rounded-lg p-2.5 border border-obsidian-750">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1 font-mono">
                      Observation Output:
                    </span>
                    <p className="text-slate-300 text-xs line-clamp-2">
                      {step.observation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end text-[11px] text-slate-400 group-hover:text-intel-purple-light font-medium pt-1">
                  <span>Inspect full parameters & telemetry</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AgentActivityTimeline;
