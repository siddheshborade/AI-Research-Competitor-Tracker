import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Search,
  Users,
  Target,
  AlertTriangle,
  Brain,
  Zap,
  Database,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Building2,
  TrendingUp,
} from "lucide-react";
import { useResearch } from "../context/ResearchContext";
import { api } from "../services/api";

export function IntelligenceDashboard() {
  const { setActiveView, competitors } = useResearch();

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchDashboard() {
      try {
        const data = await api.getDashboard();
        if (isMounted) {
          setDashboardData(data);
        }
      } catch (err) {
        console.warn("[Dashboard] Failed to fetch live summary:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  const stats = dashboardData?.statistics || {
    total_insights: 12,
    total_competitors_tracked: competitors.length || 3,
    active_threats: 2,
    emerging_signals: 4,
    unverified_claims: 1,
  };

  const breakdown = dashboardData?.insights_breakdown || {
    opportunities: 3,
    threats: 2,
    weak_signals: 4,
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      {/* Top Banner / Hero Header */}
      <div className="bg-[#0D0F16] rounded-2xl p-6 sm:p-8 border border-[#1A1F2C] shadow-nexus-card flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-mono font-bold uppercase text-[#A855F7] px-3 py-1 rounded-lg bg-[#240047]/60 border border-purple-500/30">
              TrackWise Intelligence Center
            </span>
            <span className="text-xs font-mono text-[#22C55E] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Autonomous Surveillance Active
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-100 leading-tight">
            TrackWise Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            TrackWise helps you discover research, patents, competitor activity and market signals through autonomous AI-powered investigation.
          </p>
        </div>

        <div className="shrink-0 relative z-10 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setActiveView("framework")}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-purple-950/60 hover:bg-purple-900/70 text-purple-200 border border-purple-500/40 text-xs sm:text-sm font-semibold shadow-nexus-glow transition-all"
          >
            <Zap className="w-4 h-4 text-[#00D9FF]" />
            <span>Agent Framework</span>
          </button>
          <button
            onClick={() => setActiveView("landing")}
            className="inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-[#7C2CFF] hover:bg-[#6b21e8] text-white text-xs sm:text-sm font-semibold transition-all"
          >
            <Search className="w-4 h-4" />
            <span>START RESEARCH</span>
          </button>
          <button
            onClick={() => setActiveView("memory")}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#07080D] hover:bg-[#121520] text-slate-300 border border-[#1A1F2C] text-xs sm:text-sm font-semibold transition-all"
          >
            <Brain className="w-4 h-4 text-[#00D9FF]" />
            <span>View Memory</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
        {/* Monitored Competitors */}
        <div className="bg-[#0D0F16] rounded-2xl p-5 border border-[#1A1F2C] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-medium">Monitored Competitors</span>
            <Users className="w-4 h-4 text-[#00D9FF]" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {stats.total_competitors_tracked || competitors.length || 3}
          </div>
          <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
            <span>● 100% Tracking Active</span>
          </span>
        </div>

        {/* Opportunities Detected */}
        <div className="bg-[#0D0F16] rounded-2xl p-5 border border-[#1A1F2C] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-medium">Opportunities</span>
            <Target className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {breakdown.opportunities || 3}
          </div>
          <span className="text-[11px] font-mono text-emerald-400/80">
            High-Impact Strategic Windows
          </span>
        </div>

        {/* Threats Detected */}
        <div className="bg-[#0D0F16] rounded-2xl p-5 border border-[#1A1F2C] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-medium">Threats</span>
            <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-400">
            {breakdown.threats || 2}
          </div>
          <span className="text-[11px] font-mono text-red-400/80">
            Active Defenses Required
          </span>
        </div>

        {/* Long-Term Memory Records */}
        <div className="bg-[#0D0F16] rounded-2xl p-5 border border-[#1A1F2C] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-medium">Memory Records</span>
            <Database className="w-4 h-4 text-[#A855F7]" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300">
            {memoryHistory?.total_investigations_stored || 3}
          </div>
          <span className="text-[11px] font-mono text-purple-300/80">
            Persistent Across Sessions
          </span>
        </div>
      </div>

      {/* Grid: Monitored Competitors Quick Matrix & Recent Intelligence Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Monitored Competitors */}
        <div className="lg:col-span-5 bg-[#0D0F16] rounded-2xl p-6 border border-[#1A1F2C] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1A1F2C]">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#00D9FF]" />
              <h2 className="text-sm font-bold text-slate-100">
                Monitored Competitor Profiles
              </h2>
            </div>
            <button
              onClick={() => setActiveView("competitors")}
              className="text-xs font-mono text-[#00D9FF] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {competitors.slice(0, 4).map((comp, idx) => (
              <div
                key={comp.id || idx}
                className="p-3.5 rounded-xl bg-[#07080D] border border-[#1A1F2C] flex items-center justify-between gap-3 hover:border-[#7C2CFF]/30 transition-all"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-200">{comp.name}</div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Domain: {comp.domain || "AI Hardware"}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    comp.threatLevel === "high" || comp.threat_level === "high"
                      ? "bg-red-950/80 text-red-300 border-red-500/40"
                      : "bg-amber-950/80 text-amber-300 border-amber-500/40"
                  }`}
                >
                  {comp.threatLevel?.toUpperCase() || comp.threat_level?.toUpperCase() || "MEDIUM"} THREAT
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recent WHAT -> WHY -> SO WHAT Intelligence */}
        <div className="lg:col-span-7 bg-[#0D0F16] rounded-2xl p-6 border border-[#1A1F2C] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1A1F2C]">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[#A855F7]" />
              <h2 className="text-sm font-bold text-slate-100">
                Recent Intelligence Signals
              </h2>
            </div>
            <button
              onClick={() => setActiveView("threats")}
              className="text-xs font-mono text-[#A855F7] hover:underline"
            >
              View Matrix
            </button>
          </div>

          <div className="space-y-3">
            {(memoryHistory?.investigations || []).slice(0, 2).map((inv, idx) => (
              <div
                key={inv.run_id || idx}
                className="p-4 rounded-xl bg-[#07080D] border border-[#1A1F2C] space-y-2.5"
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-bold text-purple-300">{inv.domain}</span>
                  <span className="text-slate-500">{inv.created_at}</span>
                </div>
                <h3 className="text-xs font-bold text-slate-200 leading-snug">
                  {inv.objective}
                </h3>
                <div className="text-xs text-slate-300 space-y-1">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase font-bold block">
                      WHAT:
                    </span>
                    <p className="line-clamp-2">{inv.what}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#22C55E] uppercase font-bold block">
                      SO WHAT:
                    </span>
                    <p className="line-clamp-2 text-emerald-200/90">{inv.so_what}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IntelligenceDashboard;
