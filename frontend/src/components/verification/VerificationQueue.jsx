import React, { useState } from "react";
import { VerificationGate } from "./VerificationGate";
import { EmptyState } from "../common/EmptyState";
import { useResearch } from "../../context/ResearchContext";
import { ShieldCheck, CheckCircle2, History, Award } from "lucide-react";

export function VerificationQueue() {
  const { intelligenceItems, setActiveView } = useResearch();
  const [activeTab, setActiveTab] = useState("pending"); // 'pending' | 'verified'

  const pendingItems = intelligenceItems.filter(
    (i) => i.verificationState === "NEEDS_REVIEW"
  );
  const verifiedItems = intelligenceItems.filter(
    (i) => i.verificationState === "VERIFIED"
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-6 border border-obsidian-750 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-obsidian-850 border border-obsidian-700 text-amber-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">
              Trust Layer & Human Verification Gate
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              AI models provide evidence provenance, but human intelligence leads retain the final verification gate. Review disputed benchmarks, patent overlaps, and high-impact strategic actions before lock-in.
            </p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 bg-obsidian-950 p-1 rounded-xl border border-obsidian-750 shrink-0">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === "pending"
                ? "bg-amber-950 text-amber-300 border border-amber-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Pending Audit ({pendingItems.length})
          </button>
          <button
            onClick={() => setActiveTab("verified")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === "verified"
                ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Verified Ledger ({verifiedItems.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "pending" ? (
        pendingItems.length === 0 ? (
          <EmptyState
            title="All Intelligence Signals Verified"
            description="There are no pending items requiring human gate sign-off. All high-priority insights are confirmed."
            icon={CheckCircle2}
            actionLabel="Return to Intelligence Feed"
            onAction={() => setActiveView("dashboard")}
          />
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {pendingItems.map((item) => (
              <VerificationGate key={item.id} item={item} />
            ))}
          </div>
        )
      ) : (
        <div className="space-y-4">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Audited & Verified Intelligence Ledger</span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {verifiedItems.map((item) => (
              <div
                key={item.id}
                className="glass-card-verified rounded-2xl p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Verified by {item.verifiedBy || "Human Lead Auditor"}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {item.verifiedAt ? new Date(item.verifiedAt).toLocaleTimeString() : "Confirmed"}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-100">{item.title}</h4>
                <p className="text-xs text-slate-300 line-clamp-2">{item.what}</p>
                {item.auditNote && (
                  <div className="text-[11px] font-mono text-emerald-300/80 bg-obsidian-950 p-2.5 rounded-lg border border-emerald-900/40">
                    Note: "{item.auditNote}"
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default VerificationQueue;
