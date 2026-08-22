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
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { useResearch } from "../context/ResearchContext";
import { api } from "../services/api";
import { TrackWiseLogo } from "../components/common/TrackWiseLogo";

export function IntelligenceDashboard() {
  const {
    activeObjective,
    agentStatus,
    activeRunId,
    setActiveView,
    competitors,
    intelligenceItems,
    agentSteps,
    evidenceItems,
  } = useResearch();

  const [dashboardData, setDashboardData] = useState(null);
  const [memoryHistory, setMemoryHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchDashboard() {
      try {
        const [dash, mem] = await Promise.allSettled([
          api.getDashboard(),
          api.getMemoryHistory(),
        ]);
        if (isMounted) {
          if (dash.status === "fulfilled" && dash.value) {
            setDashboardData(dash.value);
          }
          if (mem.status === "fulfilled" && mem.value) {
            setMemoryHistory(mem.value);
          }
        }
      } catch (err) {
        console.warn("[Dashboard] Error fetching live dashboard:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  const metrics = dashboardData?.metrics || {
    total_insights: intelligenceItems?.length || 9,
    total_competitors_tracked: competitors?.length || 3,
    active_threats: 2,
    emerging_signals: 4,
    unverified_claims: 1,
  };

  const breakdown = dashboardData?.insights_breakdown || {
    opportunities: 3,
    threats: 2,
    weak_signals: 4,
  };

  // Determine active investigation phase
  const getActivePhase = () => {
    if (agentStatus === "idle") return "Completed";
    if (agentStatus === "verifying") return "Hypothesis Verification";
    if (agentStatus === "synthesizing") return "Strategic Synthesis";
    if (agentStatus === "searching") return "Evidence Collection";
    return "Dynamic Planning & Dispatch";
  };

  const getProgressPercent = () => {
    if (agentStatus === "idle") return 100;
    if (agentStatus === "synthesizing") return 90;
    if (agentStatus === "verifying") return 70;
    if (agentStatus === "searching") return 45;
    return 20;
  };

  return (
    <div className="space-y-7 max-w-7xl mx-auto pb-16 font-sans">
      {/* 1. Welcome / Context Header */}
      <div className="bg-[#0D0F16] rounded-2xl p-6 sm:p-7 border border-[#1A1F2C] shadow-nexus-card flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2.5 relative z-10 max-w-2xl">
          <div className="flex items-center gap-2.5 flex-wrap">
            <TrackWiseLogo size="sm" showTagline={false} />
            <span className="text-xs font-mono text-[#22C55E] flex items-center gap-1 bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              Autonomous Surveillance Active
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 leading-tight">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            AI-powered research and competitor intelligence at a glance. Continuously monitoring research papers, patent disclosures, and competitor telemetry.
          </p>
        </div>

        <div className="shrink-0 relative z-10 flex flex-wrap gap-2.5">
          <button
            onClick={() => setActiveView("landing")}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#7C2CFF] hover:bg-[#6b21e8] text-white text-xs font-semibold shadow-nexus-glow transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span>New Research</span>
          </button>

          <button
            onClick={() => setActiveView("framework")}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/70 text-purple-200 border border-purple-500/40 text-xs font-semibold transition-all"
          >
            <Zap className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span>Agent Framework</span>
          </button>
        </div>
      </div>

      {/* 2. Active Investigation Card */}
      <div className="bg-[#0D0F16] rounded-2xl p-6 border border-[#1A1F2C] shadow-nexus-card space-y-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1A1F2C] pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00D9FF] animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Active Investigation
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#121520] border border-[#1A1F2C] text-slate-400">
              {activeRunId || "INV-2026-001"}
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-slate-400">Status:</span>
            <span
              className={`font-bold px-2.5 py-0.5 rounded border ${
                agentStatus === "idle"
                  ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/30"
                  : "bg-purple-950/80 text-purple-300 border-purple-500/30 animate-pulse"
              }`}
            >
              {agentStatus === "idle" ? "COMPLETED" : agentStatus.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-8 space-y-2">
            <h2 className="text-base font-bold text-slate-100 leading-snug">
              {activeObjective}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-mono">
              <div>
                <span className="text-slate-500">Current Phase: </span>
                <span className="text-purple-300 font-semibold">{getActivePhase()}</span>
              </div>
              <div>
                <span className="text-slate-500">Confidence: </span>
                <span className="text-[#22C55E] font-bold">88%</span>
              </div>
              <div>
                <span className="text-slate-500">Uncertainty: </span>
                <span className="text-amber-400 font-bold">12%</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-2 bg-[#07080D] p-4 rounded-xl border border-[#1A1F2C]">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Investigation Progress</span>
              <span className="font-bold text-[#00D9FF]">{getProgressPercent()}%</span>
            </div>
            <div className="w-full h-2 bg-[#121520] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#7C2CFF] to-[#00D9FF] transition-all duration-500 rounded-full"
                style={{ width: `${getProgressPercent()}%` }}
              />
            </div>
            <div className="flex justify-end pt-1">
              <button
                onClick={() => setActiveView("workspace")}
                className="text-xs font-mono text-[#00D9FF] hover:underline flex items-center gap-1"
              >
                <span>Open in Workspace</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Intelligence Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Research Signals */}
        <div className="bg-[#0D0F16] rounded-2xl p-5 border border-[#1A1F2C] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-medium">Research Signals</span>
            <Database className="w-4 h-4 text-[#00D9FF]" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">
            {metrics.total_insights || 9}
          </div>
          <span className="text-[11px] font-mono text-cyan-400 flex items-center gap-1">
            <span>● Verified Grounding</span>
          </span>
        </div>

        {/* Opportunities */}
        <div className="bg-[#0D0F16] rounded-2xl p-5 border border-[#1A1F2C] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-medium">Opportunities</span>
            <Target className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">
            {breakdown.opportunities || 3}
          </div>
          <span className="text-[11px] font-mono text-emerald-400/80">
            Strategic Advantage Areas
          </span>
        </div>

        {/* Threats */}
        <div className="bg-[#0D0F16] rounded-2xl p-5 border border-[#1A1F2C] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-medium">Active Threats</span>
            <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-400">
            {breakdown.threats || 2}
          </div>
          <span className="text-[11px] font-mono text-red-400/80">
            Defensive Actions Needed
          </span>
        </div>

        {/* Persistent Memory Episodes */}
        <div className="bg-[#0D0F16] rounded-2xl p-5 border border-[#1A1F2C] space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-medium">Memory Episodes</span>
            <Brain className="w-4 h-4 text-[#A855F7]" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300">
            {memoryHistory?.total_investigations_stored || 4}
          </div>
          <span className="text-[11px] font-mono text-purple-300/80">
            Task 4 Persistent Store
          </span>
        </div>
      </div>

      {/* 4. Latest Intelligence & Agent Activity Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Latest Intelligence Feed */}
        <div className="lg:col-span-7 bg-[#0D0F16] rounded-2xl p-6 border border-[#1A1F2C] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1A1F2C]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#A855F7]" />
              <h2 className="text-sm font-bold text-slate-100">
                Latest Strategic Intelligence
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
            {intelligenceItems.slice(0, 3).map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-xl bg-[#07080D] border border-[#1A1F2C] space-y-2 hover:border-[#7C2CFF]/40 transition-all"
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span
                    className={`font-bold px-2 py-0.5 rounded border ${
                      item.type === "threat"
                        ? "bg-red-950/80 text-red-300 border-red-500/30"
                        : "bg-emerald-950/80 text-emerald-300 border-emerald-500/30"
                    }`}
                  >
                    {item.type?.toUpperCase() || "INTELLIGENCE"}
                  </span>
                  <span className="text-slate-400">{item.competitor || "OmniHealth Labs"}</span>
                </div>
                <h3 className="text-xs font-bold text-slate-200">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.summary || item.description || item.what}
                </p>
                <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-slate-500">
                  <span>Confidence: <strong className="text-emerald-400">{Math.round((item.confidence || 0.88) * 100)}%</strong></span>
                  <span>{item.timestamp || "Live Surveillance"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Agent Activity Preview */}
        <div className="lg:col-span-5 bg-[#0D0F16] rounded-2xl p-6 border border-[#1A1F2C] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1A1F2C]">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00D9FF]" />
              <h2 className="text-sm font-bold text-slate-100">
                Agent Activity Timeline
              </h2>
            </div>
            <button
              onClick={() => setActiveView("workspace")}
              className="text-xs font-mono text-[#00D9FF] hover:underline"
            >
              Full Log
            </button>
          </div>

          <div className="space-y-2.5">
            {agentSteps.slice(0, 4).map((step, idx) => (
              <div
                key={step.id || idx}
                className="p-3 rounded-xl bg-[#07080D] border border-[#1A1F2C] flex items-start gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-[10px] font-mono font-bold text-purple-300 shrink-0 mt-0.5">
                  {step.step_number || idx + 1}
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200 truncate">
                      {step.agent_name || "Specialized Agent"}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">
                      {step.action_type || "EXECUTE"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {step.thought || step.tool_purpose || "Dispatched tool query for empirical evidence."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Recent Investigations */}
      <div className="bg-[#0D0F16] rounded-2xl p-6 border border-[#1A1F2C] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1A1F2C]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#22C55E]" />
            <h2 className="text-sm font-bold text-slate-100">
              Recent Autonomous Investigations
            </h2>
          </div>
          <button
            onClick={() => setActiveView("memory")}
            className="text-xs font-mono text-[#22C55E] hover:underline"
          >
            Memory Ledger
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(memoryHistory?.investigations || []).slice(0, 2).map((inv, idx) => (
            <div
              key={inv.run_id || idx}
              onClick={() => setActiveView("memory")}
              className="p-4 rounded-xl bg-[#07080D] border border-[#1A1F2C] hover:border-[#7C2CFF]/50 transition-all cursor-pointer space-y-2"
            >
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-purple-300 font-bold">{inv.run_id}</span>
                <span className="text-slate-500">{inv.created_at}</span>
              </div>
              <h3 className="text-xs font-bold text-slate-200 line-clamp-2">
                {inv.objective}
              </h3>
              <div className="text-[11px] text-slate-400 line-clamp-2">
                <strong className="text-slate-300 font-semibold">Conclusion: </strong>
                {inv.conclusion || inv.so_what}
              </div>
              <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
                <span className="text-emerald-400 font-bold">Confidence: {Math.round((inv.confidence_score || 0.88) * 100)}%</span>
                <span className="text-slate-500 flex items-center gap-1 hover:text-[#00D9FF]">
                  <span>Explore Delta</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default IntelligenceDashboard;
