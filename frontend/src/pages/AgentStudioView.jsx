import React from "react";
import { ResearchInput } from "../components/agent/ResearchInput";
import { AgentActivityTimeline } from "../components/agent/AgentActivityTimeline";
import { StepDetailModal } from "../components/agent/StepDetailModal";
import { useResearch } from "../context/ResearchContext";
import { Sparkles, Terminal, ArrowRight, LayoutDashboard } from "lucide-react";

export function AgentStudioView() {
  const { agentStatus, setActiveView } = useResearch();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
            <Terminal className="w-6 h-6 text-intel-purple-light" />
            Agent Research Studio & ReAct Execution
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Formulate autonomous research queries, configure multi-source target databases, and inspect live agent reasoning, tool invocations, and plan adjustments.
          </p>
        </div>

        {agentStatus === "COMPLETED" && (
          <button
            onClick={() => setActiveView("dashboard")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-intel-purple hover:bg-intel-purple-dark text-white text-xs font-semibold shadow-intel-purple transition-all self-start sm:self-auto"
          >
            <span>View Synthesized Intelligence Feed</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Screen 1: Research Launch */}
      <ResearchInput />

      {/* Screen 2: Live ReAct Execution Timeline */}
      <AgentActivityTimeline />

      {/* Step Detail Modal */}
      <StepDetailModal />
    </div>
  );
}

export default AgentStudioView;
