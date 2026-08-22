import React from "react";
import { Cpu, Search, Brain, CheckCircle, Sparkles } from "lucide-react";

export function AgentStatusBadge({ status, className = "" }) {
  switch (status) {
    case "PLANNING":
      return (
        <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-purple-950/80 text-purple-300 border border-purple-500/40 shadow-sm ${className}`}
        >
          <Brain className="w-3.5 h-3.5 text-purple-400 animate-spin" />
          <span>Agent Planning & Deconstructing...</span>
        </span>
      );
    case "GATHERING":
      return (
        <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 ${className}`}
        >
          <Search className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Multi-Source Ingestion & Retrieval...</span>
        </span>
      );
    case "REASONING":
      return (
        <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-amber-950/80 text-amber-300 border border-amber-500/40 ${className}`}
        >
          <Cpu className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span>ReAct Loop: Cross-Checking & Contradiction Resolution...</span>
        </span>
      );
    case "SYNTHESIZING":
      return (
        <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-indigo-950/80 text-indigo-300 border border-indigo-500/40 ${className}`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
          <span>Synthesizing WHAT → WHY → SO WHAT...</span>
        </span>
      );
    case "COMPLETED":
      return (
        <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 ${className}`}
        >
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          <span>Agent Idle // Intelligence Stream Active</span>
        </span>
      );
    case "READY":
    default:
      return (
        <span
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-medium bg-obsidian-850 text-slate-300 border border-obsidian-700 ${className}`}
        >
          <span className="w-2 h-2 rounded-full bg-intel-purple animate-pulse" />
          <span>Agent Ready // Autonomous Monitoring Standby</span>
        </span>
      );
  }
}

export default AgentStatusBadge;
