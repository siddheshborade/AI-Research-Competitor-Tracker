import React from "react";
import { AlertOctagon, CheckCircle2, XCircle, ArrowRightLeft, ExternalLink, ShieldAlert, Sparkles } from "lucide-react";
import { useResearch } from "../../context/ResearchContext";
import { EmptyState } from "../common/EmptyState";

export function ContradictionHub() {
  const { contradictions, handleVerificationAction } = useResearch();

  if (!contradictions || contradictions.length === 0) {
    return (
      <EmptyState
        title="No Conflicting Evidence Found"
        description="The autonomous agent has cross-checked retrieved patents, preprints, and announcements without detecting conflicting claims."
        icon={CheckCircle2}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6 border border-orange-500/30 bg-orange-950/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-950 border border-orange-500/40 text-orange-400">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Contradiction & Claim Conflict Resolution Hub
            </h3>
            <p className="text-xs text-orange-200/80 mt-0.5">
              The autonomous agent flagged conflicting claims between marketing announcements, patents, and independent empirical replications. Human auditor review required.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {contradictions.map((contra) => {
          return (
            <div
              key={contra.id}
              className="glass-panel rounded-2xl p-6 border border-obsidian-750 hover:border-obsidian-600 transition-all space-y-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-orange-950 text-orange-300 border border-orange-500/40 animate-pulse">
                    ⚠ CONFLICT DETECTED
                  </span>
                  <h4 className="text-sm font-bold text-slate-100">
                    {contra.title}
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Detected: {new Date(contra.detectedAt).toLocaleDateString()}
                </span>
              </div>

              {/* Conflict Explanation */}
              <div className="bg-obsidian-950 p-4 rounded-xl border border-obsidian-800 text-xs text-slate-300">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block mb-1">
                  Core Claim Discrepancy:
                </span>
                <p className="text-slate-200 leading-relaxed font-sans">{contra.conflictDescription}</p>
              </div>

              {/* Side-by-side Source Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Source A */}
                <div className="bg-obsidian-950 rounded-xl p-4 border border-obsidian-750 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase text-amber-400">
                      Source A • {contra.sourceA.type}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Score: {Math.round(contra.sourceA.confidenceScore * 100)}%
                    </span>
                  </div>
                  <h5 className="text-xs font-semibold text-slate-200">{contra.sourceA.name}</h5>
                  <div className="bg-obsidian-900 p-3 rounded-lg border border-obsidian-800 text-xs font-mono text-amber-200/90 leading-relaxed">
                    "{contra.sourceA.claim}"
                  </div>
                  {contra.sourceA.url && (
                    <a
                      href={contra.sourceA.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-intel-purple-light hover:underline"
                    >
                      <span>Inspect Source A Document</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {/* Source B */}
                <div className="bg-obsidian-950 rounded-xl p-4 border border-obsidian-750 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase text-cyan-400">
                      Source B • {contra.sourceB.type}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      Score: {Math.round(contra.sourceB.confidenceScore * 100)}%
                    </span>
                  </div>
                  <h5 className="text-xs font-semibold text-slate-200">{contra.sourceB.name}</h5>
                  <div className="bg-obsidian-900 p-3 rounded-lg border border-obsidian-800 text-xs font-mono text-cyan-200/90 leading-relaxed">
                    "{contra.sourceB.claim}"
                  </div>
                  {contra.sourceB.url && (
                    <a
                      href={contra.sourceB.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] text-intel-purple-light hover:underline"
                    >
                      <span>Inspect Source B Document</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {/* Agent Reconciliation Recommendation */}
              <div className="bg-purple-950/30 border border-intel-purple/30 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-intel-purple-light text-xs font-bold font-mono uppercase">
                  <Sparkles className="w-4 h-4" />
                  Agent Reconciliation Analysis & Strategic Advice
                </div>
                <p className="text-xs text-purple-100/90 font-sans leading-relaxed">
                  {contra.reconciliationRecommendation}
                </p>
              </div>

              {/* Auditor Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-obsidian-800 flex-wrap gap-2">
                <div className="text-[11px] font-mono text-slate-500">
                  Status: {contra.verificationState || "NEEDS_HUMAN_AUDIT"}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleVerificationAction(contra.id, "VERIFIED", "Auditor reconciled contradiction")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-xs font-medium border border-emerald-500/40 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Confirm Reconciliation
                  </button>
                  <button
                    onClick={() => handleVerificationAction(contra.id, "REJECTED", "Rejected by human auditor")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-medium border border-red-500/40 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject Disputed Claim
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ContradictionHub;
