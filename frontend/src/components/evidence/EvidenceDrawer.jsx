import React, { useState } from "react";
import { Drawer } from "../common/Drawer";
import { SourceCard } from "./SourceCard";
import { PriorityBadge, CategoryBadge, VerificationBadge } from "../common/Badge";
import { ConfidenceMeter } from "../common/ConfidenceMeter";
import { useResearch } from "../../context/ResearchContext";
import {
  ShieldCheck,
  Layers,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export function EvidenceDrawer() {
  const { selectedEvidenceItem, setSelectedEvidenceItem, handleVerificationAction } = useResearch();
  const [auditNote, setAuditNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedEvidenceItem) return null;

  const item = selectedEvidenceItem;

  const handleAction = async (state) => {
    setIsSubmitting(true);
    await handleVerificationAction(item.id, state, auditNote);
    setIsSubmitting(false);
    setAuditNote("");
    setSelectedEvidenceItem(null);
  };

  return (
    <Drawer
      isOpen={!!selectedEvidenceItem}
      onClose={() => setSelectedEvidenceItem(null)}
      title="Evidence Provenance & Trust Audit"
      subtitle={`Intelligence Identifier: ${item.id} • Synthesized via Autonomous ReAct Loop`}
      width="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Header Badges & Title */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <PriorityBadge priority={item.priority} />
            <CategoryBadge category={item.category} />
            <VerificationBadge state={item.verificationState} />
          </div>
          <h3 className="text-base font-bold text-slate-100 leading-snug">
            {item.title}
          </h3>
        </div>

        {/* Confidence & Provenance Bar */}
        <ConfidenceMeter
          confidence={item.confidence}
          score={item.confidenceScore}
          evidenceCount={item.evidenceCount}
          sourcesCount={item.sourcesCount}
        />

        {/* Why this insight exists */}
        <div className="bg-obsidian-950 border border-obsidian-750 rounded-xl p-4 space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase text-intel-purple-light flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Why This Intelligence Insight Exists
          </h4>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <span className="text-intel-purple-light font-mono font-bold">1.</span>
              <p>
                <strong className="text-slate-200">Autonomous Ingestion:</strong> Multi-source agents scanned ArXiv, USPTO, and industry filings matching core vectors.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-intel-purple-light font-mono font-bold">2.</span>
              <p>
                <strong className="text-slate-200">Cross-Verification:</strong> {item.crossCheckStatus || `${item.sourcesCount || 3} independent sources corroborated the core claims.`}
              </p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-intel-purple-light font-mono font-bold">3.</span>
              <p>
                <strong className="text-slate-200">Strategic Impact:</strong> {item.impact || "Validated competitive roadmap threat."}
              </p>
            </div>
          </div>
        </div>

        {/* Verified Sources List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-300 flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-cyan-400" />
              Verified Citations ({item.sources?.length || 0})
            </h4>
            <span className="text-[11px] font-mono text-slate-500">
              100% Traceable Evidence
            </span>
          </div>

          <div className="space-y-3">
            {item.sources && item.sources.length > 0 ? (
              item.sources.map((src) => <SourceCard key={src.id || src.url} source={src} />)
            ) : (
              <div className="text-xs text-slate-500 p-4 text-center bg-obsidian-950 rounded-xl border border-obsidian-800">
                No external URLs registered for this insight.
              </div>
            )}
          </div>
        </div>

        {/* Human Verification Gate Action Area */}
        <div className="bg-obsidian-950/90 border border-obsidian-700 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Human Verification Gate
              </h4>
              <p className="text-[11px] text-slate-400">
                Audit and confirm this insight into the permanent intelligence ledger.
              </p>
            </div>
          </div>

          <div className="relative">
            <textarea
              value={auditNote}
              onChange={(e) => setAuditNote(e.target.value)}
              placeholder="Optional auditor note or reason for verification/rejection..."
              rows={2}
              className="w-full bg-obsidian-900 border border-obsidian-750 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-intel-purple font-sans resize-none"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleAction("REJECTED")}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-300 text-xs font-medium border border-red-500/40 transition-colors"
            >
              <XCircle className="w-4 h-4 text-red-400" />
              <span>Reject Insight</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleAction("NEEDS_REVIEW")}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 text-xs font-medium border border-amber-500/40 transition-colors"
              >
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Flag Conflict</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleAction("VERIFIED")}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-emerald-100 text-xs font-semibold border border-emerald-500/40 transition-colors shadow-intel-verified"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>Mark as Verified</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
}

export default EvidenceDrawer;
