import React from "react";
import { ToolCallCard } from "./ToolCallCard";
import { Wrench, Cpu, RefreshCw } from "lucide-react";

export function ToolActivity({ toolActivities = [] }) {
  if (!toolActivities || toolActivities.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-5 border border-obsidian-750 text-center text-slate-400 space-y-2">
        <Wrench className="w-6 h-6 text-slate-500 mx-auto" />
        <h4 className="text-xs font-mono uppercase font-bold text-slate-300">
          Tool Activity Pipeline Standby
        </h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          When research begins, external Web Search and Research/Paper API invocations and re-search triggers appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel rounded-2xl p-5 border border-obsidian-750 space-y-4">
      <div className="flex items-center justify-between border-b border-obsidian-750 pb-3">
        <div className="flex items-center gap-2">
          <Wrench className="w-4 h-4 text-intel-purple-light" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Actual External Tool Invocations
          </h3>
        </div>
        <span className="text-[11px] font-mono text-slate-400">
          {toolActivities.length} Tool Executions
        </span>
      </div>

      <div className="space-y-2">
        {toolActivities.map((toolCall, idx) => (
          <ToolCallCard
            key={toolCall.id || idx}
            toolCall={toolCall}
            isLast={idx === toolActivities.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

export default ToolActivity;
