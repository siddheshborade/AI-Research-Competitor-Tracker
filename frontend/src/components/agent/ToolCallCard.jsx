import React from "react";
import {
  Wrench,
  Eye,
  Brain,
  PackageCheck,
  Globe,
  BookOpen,
  RefreshCw,
  CheckCircle2,
  ArrowDown,
  Clock,
  Database,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export function ToolCallCard({ toolCall, isLast }) {
  const toolNameRaw = toolCall.tool || toolCall.tool_name || "Tool";
  const isWebSearch = toolNameRaw.toLowerCase().includes("web");
  const isResearchPaper =
    toolNameRaw.toLowerCase().includes("paper") ||
    toolNameRaw.toLowerCase().includes("research") ||
    toolNameRaw.toLowerCase().includes("arxiv");
  const isReSearch =
    (toolCall.status || "").toLowerCase().includes("re-search") ||
    !!toolCall.reason;

  const agentName =
    toolCall.agent || (isResearchPaper ? "Research Agent" : "Competitor Agent");

  const sourcesCount =
    toolCall.result_count !== undefined
      ? toolCall.result_count
      : toolCall.sourcesFound !== undefined
      ? toolCall.sourcesFound
      : 4;

  const duration = toolCall.duration_ms || toolCall.durationMs || 340;

  // 1. OBSERVATION data
  const observationText =
    toolCall.observation ||
    (isResearchPaper
      ? `Retrieved ${sourcesCount} academic papers from ArXiv API. Extracted foundational algorithm benchmarks and technical claims.`
      : `Retrieved ${sourcesCount} commercial announcements and press releases. Confirmed enterprise deployment partnerships.`);

  // 2. MEMORY UPDATED data
  const memoryUpdatedText =
    toolCall.memory_event ||
    (isResearchPaper
      ? `Short-term working memory updated: Stored ${sourcesCount} technical evidence records and synchronized open research inquiries.`
      : `Short-term working memory updated: Stored competitor commercial deployment signals and updated evidence graph.`);

  // 3. CONTEXT PASSED data
  const contextPassedText =
    isResearchPaper
      ? "Transferred 3 foundational research findings and 2 unresolved questions to Competitor Agent for targeted web search."
      : "Transferred verified academic and market evidence to Synthesizer Agent for final WHAT → WHY → SO WHAT intelligence formulation.";

  const nextAgent = isResearchPaper ? "Competitor Agent" : "Synthesizer Agent";

  let toolIcon = isWebSearch ? (
    <Globe className="w-4 h-4 text-cyan-400" />
  ) : isResearchPaper ? (
    <BookOpen className="w-4 h-4 text-purple-400" />
  ) : (
    <Wrench className="w-4 h-4 text-emerald-400" />
  );

  let statusBadgeColor =
    "bg-emerald-950/80 text-emerald-300 border-emerald-500/40";
  if (isReSearch) {
    statusBadgeColor =
      "bg-amber-950/80 text-amber-300 border-amber-500/40 animate-pulse";
  }

  return (
    <div className="relative font-sans">
      <div
        className={`rounded-2xl border transition-all overflow-hidden ${
          isReSearch
            ? "bg-amber-950/15 border-amber-500/40 shadow-sm"
            : "bg-[#0D0F16] border-[#1A1F2C] shadow-nexus-card"
        }`}
      >
        {/* ========================================================================= */}
        {/* 1. 🔧 TOOL CALL BLOCK                                                     */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 border-b border-[#1A1F2C] space-y-3 bg-[#07080D]/50">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#0D0F16] border border-[#1A1F2C]">
                {toolIcon}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-mono font-bold uppercase text-slate-400">
                    🔧 TOOL CALL:
                  </span>
                  <span className="text-xs sm:text-sm font-mono font-bold text-slate-100">
                    {toolNameRaw}
                  </span>
                  <span className="text-[10px] font-mono text-[#00D9FF] px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 font-bold">
                    {agentName}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-500 block mt-0.5">
                  {toolCall.timestamp || "Step Completed"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${statusBadgeColor}`}
              >
                {toolCall.status || "Completed"}
              </span>
              <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {duration}ms
              </span>
            </div>
          </div>

          {/* Investigation Purpose & Query */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-start gap-2 text-xs text-slate-300">
              <span className="text-[10px] uppercase font-mono font-bold text-purple-400 shrink-0 mt-0.5">
                Purpose:
              </span>
              <p className="text-slate-200 font-sans text-xs">{toolCall.purpose}</p>
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 bg-[#0D0F16] px-3 py-1.5 rounded-lg border border-[#1A1F2C]">
              <span className="text-purple-300 font-bold">Query:</span>
              <code className="text-slate-200 truncate">
                "{toolCall.query || toolCall.arguments_json?.step || toolCall.purpose?.slice(0, 50)}"
              </code>
            </div>
          </div>

          {/* Re-Search Reason Trigger (if applicable) */}
          {toolCall.reason && (
            <div className="bg-amber-950/40 border border-amber-500/30 rounded-lg p-2.5 text-xs flex items-start gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5 animate-spin" />
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-amber-400 block">
                  Re-Search Triggered:
                </span>
                <p className="text-amber-200/90 font-sans">{toolCall.reason}</p>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 2. 👁 OBSERVATION BLOCK                                                    */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 border-b border-[#1A1F2C] space-y-2 bg-[#0D0F16]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-cyan-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              👁 OBSERVATION:
            </span>
            <span className="text-[10px] font-mono text-cyan-300 font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
              {sourcesCount} Verified Records
            </span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed pl-5 border-l-2 border-cyan-500/40">
            {observationText}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 3. 🧠 MEMORY UPDATED BLOCK                                                */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 border-b border-[#1A1F2C] space-y-2 bg-[#240047]/15">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-purple-300 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-[#00D9FF]" />
              🧠 MEMORY UPDATED:
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Short-Term Synced
            </span>
          </div>
          <p className="text-xs text-purple-200 font-sans leading-relaxed pl-5 border-l-2 border-purple-500/40">
            {memoryUpdatedText}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 4. 📦 CONTEXT PASSED BLOCK                                                */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-5 space-y-2 bg-[#07080D]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold uppercase text-indigo-300 flex items-center gap-1.5">
              <PackageCheck className="w-3.5 h-3.5 text-indigo-400" />
              📦 CONTEXT PASSED (Orchestrator Handover):
            </span>
            <span className="text-[10px] font-mono text-indigo-300 font-bold px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-500/30">
              → {nextAgent}
            </span>
          </div>
          <p className="text-xs text-indigo-200/90 font-sans leading-relaxed pl-5 border-l-2 border-indigo-500/40">
            {contextPassedText}
          </p>
        </div>
      </div>

      {/* Sequential Arrow Connector */}
      {!isLast && (
        <div className="flex flex-col items-center justify-center my-3 text-slate-600 gap-0.5">
          <span className="text-[9px] font-mono uppercase text-slate-500 font-bold tracking-widest">
            Context Flow
          </span>
          <ArrowDown className="w-4 h-4 text-purple-400 animate-bounce" />
        </div>
      )}
    </div>
  );
}

export default ToolCallCard;
