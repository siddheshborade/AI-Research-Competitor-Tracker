import React from "react";
import { Sparkles, ArrowRight } from "lucide-react";

export function EmptyState({
  title = "No Data Discovered",
  description = "Start an autonomous research run to discover the latest signals.",
  actionLabel,
  onAction,
  icon: Icon = Sparkles,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-obsidian-700 bg-obsidian-900/40">
      <div className="w-14 h-14 rounded-2xl bg-obsidian-800 border border-obsidian-700 flex items-center justify-center mb-4 text-intel-purple-light shadow-inner">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-md mb-6">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-intel-purple hover:bg-intel-purple-dark text-white text-sm font-medium transition-all shadow-intel-purple"
        >
          <span>{actionLabel}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default EmptyState;
