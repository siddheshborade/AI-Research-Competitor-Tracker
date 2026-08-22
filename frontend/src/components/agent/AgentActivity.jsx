import React from "react";
import { CheckCircle2, AlertTriangle, Cpu, Sparkles, Terminal, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";

export function AgentActivity({ activities = [] }) {
  if (!activities || activities.length === 0) {
    return null;
  }

  return (
    <div className="glass-panel rounded-2xl p-5 border border-obsidian-750 space-y-4">
      <div className="flex items-center justify-between border-b border-obsidian-750 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-intel-purple-light" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Activity Timeline (Task 5 Execution Stream)
          </h3>
        </div>
        <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 border border-purple-800/40 px-2.5 py-0.5 rounded-full">
          {activities.length} Structured Events
        </span>
      </div>

      <div className="space-y-2.5">
        {activities.map((act, idx) => {
          const isWarning = act.status === "warning";
          const isCurrent = idx === activities.length - 1;

          return (
            <div
              key={act.id || idx}
              className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                isWarning
                  ? "bg-amber-950/25 border-amber-500/40 text-amber-200"
                  : isCurrent
                  ? "bg-purple-950/20 border-intel-purple/50 text-slate-100 shadow-sm"
                  : "bg-obsidian-950/70 border-obsidian-800 text-slate-300"
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isWarning ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold font-sans text-slate-100">
                      {act.text}
                    </span>
                    {act.agent && (
                      <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-[#161B26] border border-[#222B3D] text-slate-300 flex items-center gap-1">
                        <Cpu className="w-2.5 h-2.5 text-purple-400" />
                        {act.agent}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {act.badge && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 text-purple-300">
                        {act.badge}
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-slate-500">
                      {act.timestamp}
                    </span>
                  </div>
                </div>

                {act.detail && (
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    {act.detail}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AgentActivity;
