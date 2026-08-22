import React, { useState } from "react";
import { AgentActivity } from "../components/agent/AgentActivity";
import { ToolActivity } from "../components/agent/ToolActivity";
import { ResearchResult } from "../components/intelligence/ResearchResult";
import { EvidencePanel } from "../components/evidence/EvidencePanel";
import { TrustPanel } from "../components/verification/TrustPanel";
import { AgentDetailsPanel } from "../components/agent/AgentDetailsPanel";
import { useResearch } from "../context/ResearchContext";
import { Terminal, ArrowLeft, Play, ShieldAlert, Sparkles, RefreshCw, Flame } from "lucide-react";

export function ResearchWorkspace() {
  const {
    activeObjective,
    agentStatus,
    agentSteps,
    intelligenceBrief,
    toolActivities,
    agentActivities,
    agentDetails,
    agentMemory,
    setActiveView,
    startAutonomousResearch,
  } = useResearch();

  const isRunning =
    agentStatus === "PLANNING" ||
    agentStatus === "GATHERING" ||
    agentStatus === "REASONING" ||
    agentStatus === "SYNTHESIZING";

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      {/* Top Header Card */}
      <div className="bg-[#0D0F16] rounded-2xl p-6 sm:p-7 border border-[#1A1F2C] shadow-nexus-card flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[11px] font-mono font-bold uppercase text-[#A855F7] px-3 py-1 rounded-lg bg-[#240047]/60 border border-purple-500/30">
              TrackWise Autonomous Investigation
            </span>
            <span className="text-xs font-mono text-slate-400">
              State: <strong className="text-slate-200">{agentStatus}</strong>
            </span>
            {agentDetails?.is_chaos_mode && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-400" /> CHAOS MODE ACTIVE
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 leading-snug">
            {activeObjective}
          </h1>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto flex-wrap">
          <button
            onClick={() => setActiveView("landing")}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#121520] hover:bg-[#181C2B] text-slate-300 text-xs font-medium border border-[#1A1F2C] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>New Query</span>
          </button>

          {/* Chaos Mode Trigger */}
          <button
            onClick={() => startAutonomousResearch(activeObjective, { chaos_mode: true })}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-950/80 to-purple-950/80 hover:from-rose-900 hover:to-purple-900 text-rose-200 text-xs font-semibold border border-rose-500/40 shadow-sm transition-all disabled:opacity-50"
            title="Test failure recovery, fallback tools, conflicting evidence, and replanning"
          >
            <Flame className="w-3.5 h-3.5 text-rose-400" />
            <span>Chaos Mode Test</span>
          </button>

          {/* Normal Autonomous Investigation */}
          <button
            onClick={() => startAutonomousResearch(activeObjective, { chaos_mode: false })}
            disabled={isRunning}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7C2CFF] hover:bg-[#6b21e8] text-white text-xs font-semibold shadow-nexus-glow transition-all disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Investigating...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Run Autonomous Agent</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Primary 2-Column Intelligence & Verification Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT / MAIN COLUMN (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Agent Activity Progress */}
          <AgentActivity activities={agentActivities} />

          {/* Actual Tool Activity (Web Search, Research Papers, Patent, Telemetry) */}
          <ToolActivity toolActivities={toolActivities} />

          {/* Final Strategic Intelligence Brief */}
          <ResearchResult brief={intelligenceBrief} />
        </div>

        {/* RIGHT / SIDE COLUMN (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Trust & Human Verification Gate */}
          <TrustPanel brief={intelligenceBrief} />

          {/* Collected Evidence Items */}
          <EvidencePanel evidenceItems={intelligenceBrief?.evidenceItems || []} />
        </div>
      </div>

      {/* Task 5 Collapsible Agent Framework & Technical Details Panel */}
      <AgentDetailsPanel
        details={agentDetails}
        trust={intelligenceBrief?.trust || {}}
        memory={agentMemory}
      />
    </div>
  );
}

export default ResearchWorkspace;
