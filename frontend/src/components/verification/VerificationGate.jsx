import React, { useState } from "react";
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle, FileSearch, MessageSquare } from "lucide-react";
import { PriorityBadge, CategoryBadge, VerificationBadge } from "../common/Badge";
import { ConfidenceMeter } from "../common/ConfidenceMeter";
import { useResearch } from "../../context/ResearchContext";

export function VerificationGate({ item }) {
  const { handleVerificationAction, setSelectedEvidenceItem } = useResearch();
  const [auditNote, setAuditNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = async (state) => {
    setIsSubmitting(true);
    await handleVerificationAction(item.id, state, auditNote);
    setIsSubmitting(false);
    setAuditNote("");
  };

  return (
    <div className="glass-card-warning rounded-2xl p-6 transition-all space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <PriorityBadge priority={item.priority} />
          <CategoryBadge category={item.category} />
          <VerificationBadge state={item.verificationState} />
        </div>
        <span className="text-xs font-mono text-slate-400">
          Entity: {item.competitor || "Market Opportunity"}
        </span>
      </div>

      <h4 className="text-base font-bold text-slate-100">{item.title}</h4>

      {/* Review reason callout */}
      <div className="bg-amber-950/50 border border-amber-500/40 rounded-xl p-3.5 space-y-1 text-xs">
        <div className="flex items-center gap-2 text-amber-300 font-bold font-mono uppercase">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          Reason for Human Review Gate:
        </div>
        <p className="text-amber-100/90 pl-6 font-sans leading-relaxed">
          {item.verificationReason || "Conflicting empirical benchmarks or high strategic sensitivity detected."}
        </p>
      </div>

      {/* Triad Breakdown */}
      <div className="bg-obsidian-950 p-4 rounded-xl border border-obsidian-800 text-xs space-y-2">
        <p className="text-slate-300">
          <strong className="text-slate-100 font-mono">WHAT:</strong> {item.what}
        </p>
        <p className="text-purple-200">
          <strong className="text-intel-purple-light font-mono">WHY:</strong> {item.why}
        </p>
        <p className="text-emerald-200">
          <strong className="text-emerald-400 font-mono">ACTION:</strong> {item.soWhat}
        </p>
      </div>

      {/* Confidence */}
      <ConfidenceMeter
        confidence={item.confidence}
        score={item.confidenceScore}
        evidenceCount={item.evidenceCount}
        sourcesCount={item.sourcesCount}
      />

      {/* Audit Action Input */}
      <div className="space-y-3 pt-2 border-t border-obsidian-800">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedEvidenceItem(item)}
            className="inline-flex items-center gap-1.5 text-xs text-intel-purple-light hover:underline font-medium"
          >
            <FileSearch className="w-4 h-4" />
            <span>Review {item.sourcesCount || 3} Corroborating Sources</span>
          </button>
          <span className="text-[11px] font-mono text-slate-500">ID: {item.id}</span>
        </div>

        <input
          type="text"
          value={auditNote}
          onChange={(e) => setAuditNote(e.target.value)}
          placeholder="Optional justification note before signing off..."
          className="w-full bg-obsidian-950 border border-obsidian-750 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-intel-purple font-sans"
        />

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            disabled={isSubmitting}
            onClick={() => handleAction("REJECTED")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-medium border border-red-500/40 transition-colors"
          >
            <XCircle className="w-4 h-4 text-red-400" />
            <span>Reject Insight</span>
          </button>

          <button
            disabled={isSubmitting}
            onClick={() => handleAction("VERIFIED")}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-100 text-xs font-semibold border border-emerald-500/40 transition-colors shadow-intel-verified"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Confirm & Mark as Verified</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerificationGate;
