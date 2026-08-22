import React from "react";
import { PriorityBadge } from "../common/Badge";
import {
  Sparkles,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Tag,
  Compass,
  ExternalLink,
  Brain,
  History,
} from "lucide-react";

export function WhatWhySoWhat({ brief }) {
  if (!brief) return null;

  const isThreat = (brief.classification || "").toUpperCase().includes("THREAT");
  
  // Resilient field extractors for live or demo structures
  const whatText = brief.whatWhySoWhat?.what || brief.what || brief.executiveSummary || "Multi-source intelligence gathered across academic publications and web disclosures.";
  const whyText = brief.whatWhySoWhat?.why || brief.why || "Accelerated R&D investments and competitive positioning observed across primary filings.";
  const soWhatText = brief.whatWhySoWhat?.soWhat || brief.soWhat || "Evaluate strategic IP filings and monitor competitor commercial launch velocity within 60 days.";
  const recommendedAction = brief.recommendedAction || brief.whatWhySoWhat?.recommendedAction || brief.soWhat;

  const previousContext = brief.memory?.previous_context || brief.previous_context;
  const changesDetected = brief.changes_detected || brief.memory?.temporal_delta || brief.temporal_delta;

  return (
    <div className="bg-[#0D0F16] rounded-2xl p-6 sm:p-7 border border-[#1A1F2C] shadow-nexus-card space-y-6">
      {/* Strategic Header */}
      <div className="space-y-2.5 pb-4 border-b border-[#1A1F2C]">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5 flex-wrap">
            <PriorityBadge priority={brief.priority || "HIGH"} />
            <span
              className={`text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-lg border ${
                isThreat
                  ? "bg-red-950/80 text-red-300 border-red-500/40"
                  : "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
              }`}
            >
              {brief.classification || "STRATEGIC SIGNAL DETECTED"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#22C55E] font-semibold bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-lg">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{brief.evidenceStrength || brief.confidenceRating || "STRONGLY SUPPORTED"}</span>
          </div>
        </div>

        <h2 className="text-xl font-bold text-slate-100 leading-snug font-sans">
          {brief.title}
        </h2>
      </div>

      {/* Task 4: Recalled Previous Long-Term Memory (if applicable) */}
      {previousContext && (
        <div className="bg-[#240047]/30 border border-purple-500/30 rounded-xl p-4 sm:p-5 space-y-2.5">
          <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-mono font-bold text-[#A855F7]">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-[#00D9FF]" />
              <span>🧠 PREVIOUS CONTEXT FOUND</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Entity: {previousContext.target_entity} ({previousContext.investigated_at})
            </span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            <strong>Prior Baseline:</strong> {previousContext.previous_what}
          </p>
          {previousContext.previous_threats && previousContext.previous_threats.length > 0 && (
            <div className="text-[11px] font-mono text-amber-300/90 pt-1">
              ↳ Prior Threat: {previousContext.previous_threats[0]}
            </div>
          )}
        </div>
      )}

      {/* Mandatory WHAT -> WHY -> SO WHAT Architecture */}
      <div className="space-y-5 bg-[#07080D] rounded-xl p-5 sm:p-6 border border-[#1A1F2C]">
        {/* WHAT */}
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span>WHAT HAPPENED?</span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed pl-5 font-sans">
            {whatText}
          </p>
        </div>

        {/* WHY */}
        <div className="space-y-2 pt-4 border-t border-[#1A1F2C]">
          <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-wider text-[#A855F7]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#7C2CFF]" />
            <span>WHY DOES IT MATTER?</span>
          </div>
          <p className="text-sm text-purple-100/90 leading-relaxed pl-5 font-sans">
            {whyText}
          </p>
        </div>

        {/* SO WHAT */}
        <div className="space-y-2 pt-4 border-t border-[#1A1F2C]">
          <div className="flex items-center gap-2.5 text-xs font-mono font-bold uppercase tracking-wider text-[#22C55E]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
            <span>SO WHAT / RECOMMENDED STRATEGIC ACTION</span>
          </div>
          <p className="text-sm text-emerald-200/95 leading-relaxed pl-5 font-sans font-medium">
            {soWhatText}
          </p>
        </div>
      </div>

      {/* Task 4: Changes Detected / Temporal Delta */}
      {changesDetected && (
        <div className="bg-[#07080D] border border-cyan-500/30 rounded-xl p-4 sm:p-5 space-y-1.5 text-xs">
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase text-[#00D9FF]">
            <History className="w-3.5 h-3.5" />
            <span>CHANGES DETECTED SINCE PREVIOUS INVESTIGATION</span>
          </div>
          <p className="text-xs text-cyan-100 font-sans leading-relaxed">
            {changesDetected}
          </p>
        </div>
      )}

      {/* Concrete Strategic Action Playbook */}
      {recommendedAction && recommendedAction !== soWhatText && (
        <div className="bg-[#22C55E]/10 border border-[#22C55E]/30 rounded-xl p-4 sm:p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#22C55E]">
            <CheckCircle2 className="w-4 h-4" />
            <span>Recommended Next Action</span>
          </div>
          <p className="text-xs text-emerald-100/90 font-sans leading-relaxed">
            {recommendedAction}
          </p>
        </div>
      )}
    </div>
  );
}

export default WhatWhySoWhat;
