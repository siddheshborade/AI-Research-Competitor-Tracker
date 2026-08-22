import React from "react";
import {
  PriorityBadge,
  CategoryBadge,
  VerificationBadge,
} from "../common/Badge";
import { ConfidenceMeter } from "../common/ConfidenceMeter";
import {
  Layers,
  FileSearch,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Building2,
  Clock,
  Sparkles,
} from "lucide-react";
import { useResearch } from "../../context/ResearchContext";

export function IntelligenceCard({ item }) {
  const { setSelectedEvidenceItem, handleVerificationAction } = useResearch();

  const isThreat = item.category === "THREAT" || item.priority === "CRITICAL";
  const isNeedsReview = item.verificationState === "NEEDS_REVIEW";
  const isVerified = item.verificationState === "VERIFIED";

  let cardStyle = "glass-card";
  if (isThreat) cardStyle = "glass-card-threat";
  else if (isNeedsReview) cardStyle = "glass-card-warning";
  else if (isVerified) cardStyle = "glass-card-verified";

  return (
    <div
      className={`${cardStyle} rounded-2xl p-6 transition-all duration-300 relative overflow-hidden flex flex-col justify-between space-y-5`}
    >
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <PriorityBadge priority={item.priority} />
            <CategoryBadge category={item.category} />
            {item.competitor && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-obsidian-800 text-slate-300 border border-obsidian-700">
                <Building2 className="w-3 h-3 text-intel-purple-light" />
                {item.competitor}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <VerificationBadge state={item.verificationState} />
            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(item.timestamp).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-100 leading-snug tracking-tight hover:text-intel-purple-light transition-colors">
          {item.title}
        </h3>
      </div>

      {/* MANDATORY WHAT -> WHY -> SO WHAT TRIAD */}
      <div className="space-y-3 bg-obsidian-950/75 rounded-xl p-4 border border-obsidian-800/80">
        {/* WHAT */}
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            WHAT HAPPENED
          </div>
          <p className="text-xs text-slate-200 leading-relaxed pl-3 font-sans">
            {item.what}
          </p>
        </div>

        {/* WHY IT MATTERS */}
        <div className="space-y-1 pt-2 border-t border-obsidian-850">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-intel-purple-light">
            <span className="w-1.5 h-1.5 rounded-full bg-intel-purple-light" />
            WHY IT MATTERS
          </div>
          <p className="text-xs text-purple-100/90 leading-relaxed pl-3 font-sans">
            {item.why}
          </p>
        </div>

        {/* SO WHAT / WHAT SHOULD WE DO */}
        <div className="space-y-1 pt-2 border-t border-obsidian-850">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            SO WHAT / RECOMMENDED ACTION
          </div>
          <p className="text-xs text-emerald-200/90 leading-relaxed pl-3 font-sans font-medium">
            {item.soWhat}
          </p>
        </div>
      </div>

      {/* Trust Layer: Confidence & Evidence Transparency */}
      <ConfidenceMeter
        confidence={item.confidence}
        score={item.confidenceScore}
        evidenceCount={item.evidenceCount}
        sourcesCount={item.sourcesCount}
      />

      {/* Human Verification Gate Notice (if applicable) */}
      {isNeedsReview && (
        <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Human Verification Required</span>
          </div>
          {item.verificationReason && (
            <p className="text-[11px] text-amber-200/80 leading-normal pl-6">
              {item.verificationReason}
            </p>
          )}
          <div className="flex items-center gap-2 pt-1 pl-6">
            <button
              onClick={() => handleVerificationAction(item.id, "VERIFIED", "Confirmed via manual cross-check")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-xs font-medium border border-emerald-500/40 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Mark Verified
            </button>
            <button
              onClick={() => handleVerificationAction(item.id, "REJECTED", "Rejected by human auditor")}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 text-xs font-medium border border-red-500/40 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              Reject Insight
            </button>
          </div>
        </div>
      )}

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-obsidian-800/60">
        <button
          onClick={() => setSelectedEvidenceItem(item)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-intel-purple-light hover:text-purple-300 transition-colors"
        >
          <FileSearch className="w-4 h-4" />
          <span>Review Evidence ({item.sourcesCount || item.sources?.length || 0} Sources)</span>
        </button>

        <div className="text-[11px] font-mono text-slate-500">
          ID: {item.id}
        </div>
      </div>
    </div>
  );
}

export default IntelligenceCard;
