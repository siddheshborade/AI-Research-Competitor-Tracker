import React from "react";

export function PriorityBadge({ priority, className = "" }) {
  const normalized = (priority || "").toUpperCase();

  switch (normalized) {
    case "CRITICAL":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-red-950/80 text-red-400 border border-red-500/40 shadow-sm ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          Critical Priority
        </span>
      );
    case "HIGH":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-amber-950/80 text-amber-300 border border-amber-500/40 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          High Priority
        </span>
      );
    case "MEDIUM":
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-purple-950/80 text-purple-300 border border-purple-500/30 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          Medium Priority
        </span>
      );
    case "LOW":
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase bg-slate-800/80 text-slate-300 border border-slate-700 ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Low Priority
        </span>
      );
  }
}

export function CategoryBadge({ category, className = "" }) {
  const normalized = (category || "").toUpperCase();

  switch (normalized) {
    case "THREAT":
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium uppercase bg-red-950/70 text-red-300 border border-red-500/30 ${className}`}
        >
          THREAT
        </span>
      );
    case "OPPORTUNITY":
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium uppercase bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 ${className}`}
        >
          OPPORTUNITY
        </span>
      );
    case "TREND":
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium uppercase bg-purple-950/70 text-purple-300 border border-purple-500/30 ${className}`}
        >
          EMERGING SIGNAL
        </span>
      );
    case "RESEARCH GAP":
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium uppercase bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 ${className}`}
        >
          RESEARCH GAP
        </span>
      );
    case "CONTRADICTION":
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium uppercase bg-orange-950/70 text-orange-300 border border-orange-500/40 ${className}`}
        >
          CONTRADICTION
        </span>
      );
    case "COMPETITOR MOVE":
    default:
      return (
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono font-medium uppercase bg-slate-800/90 text-slate-300 border border-slate-600/40 ${className}`}
        >
          COMPETITOR MOVE
        </span>
      );
  }
}

export function VerificationBadge({ state, className = "" }) {
  const normalized = (state || "").toUpperCase();

  switch (normalized) {
    case "VERIFIED":
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 ${className}`}
        >
          <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
          Verified Evidence
        </span>
      );
    case "REJECTED":
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-950/90 text-red-300 border border-red-500/40 ${className}`}
        >
          <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Rejected by Auditor
        </span>
      );
    case "NEEDS_REVIEW":
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-950/90 text-amber-300 border border-amber-500/40 animate-pulse ${className}`}
        >
          <svg className="w-3 h-3 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Needs Human Review
        </span>
      );
  }
}
