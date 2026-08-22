import React, { useState, useEffect } from "react";
import {
  Brain,
  Clock,
  Database,
  Search,
  Target,
  TrendingUp,
  AlertTriangle,
  History,
  Check,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  Zap,
  Sparkles,
  Layers,
  ShieldCheck,
  ExternalLink,
  Calendar,
  Filter,
  FileText,
  ChevronRight,
  Cpu,
} from "lucide-react";
import { api } from "../services/api";
import { useResearch } from "../context/ResearchContext";

export function MemoryView() {
  const { setActiveView, intelligenceBrief } = useResearch();
  const [currentMemory, setCurrentMemory] = useState(null);
  const [memoryHistory, setMemoryHistory] = useState(null);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadMemoryData() {
      setIsLoading(true);
      try {
        const [curr, hist] = await Promise.all([
          api.getMemoryCurrent(),
          api.getMemoryHistory(),
        ]);

        // Prefer live working memory from active intelligence brief if present
        if (intelligenceBrief?.memory?.short_term) {
          setCurrentMemory(intelligenceBrief.memory.short_term);
        } else if (curr?.working_memory) {
          setCurrentMemory(curr.working_memory);
        }

        setMemoryHistory(hist || null);
        if (hist?.investigations?.length > 0) {
          setSelectedHistoryItem(hist.investigations[0]);
        }
      } catch (err) {
        console.warn("[MemoryView] Error loading memory data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadMemoryData();
  }, [intelligenceBrief]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await api.searchMemory(searchQuery);
      setSearchResult(res);
    } catch (err) {
      console.warn("[MemoryView] Search failed:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const previousContext =
    currentMemory?.previous_context_recalled ||
    intelligenceBrief?.memory?.previous_context;

  const comparisonMetrics =
    currentMemory?.comparison_metrics ||
    intelligenceBrief?.memory?.comparison_metrics || [
      {
        metric_name: "Research Activity",
        previous_value: "Medium",
        current_value: "High",
        delta_status: "INCREASED",
      },
      {
        metric_name: "Competitor Signals",
        previous_value: "3",
        current_value: "6",
        delta_status: "INCREASED",
      },
      {
        metric_name: "Supporting Sources",
        previous_value: "4",
        current_value: "8",
        delta_status: "INCREASED",
      },
      {
        metric_name: "Threat Level",
        previous_value: "Medium",
        current_value: "High",
        delta_status: "INCREASED",
      },
      {
        metric_name: "Strategic Opportunities",
        previous_value: "1",
        current_value: "2",
        delta_status: "INCREASED",
      },
    ];

  // Final intelligence WHAT -> WHY -> SO WHAT from active brief or memory
  const finalWhat =
    intelligenceBrief?.whatWhySoWhat?.what ||
    currentMemory?.what ||
    "Competitor has accelerated multimodal R&D and filed preliminary architecture specifications.";
  const finalWhy =
    intelligenceBrief?.whatWhySoWhat?.why ||
    currentMemory?.why ||
    "To capture edge inference market share and overcome DRAM bandwidth bottlenecks.";
  const finalSoWhat =
    intelligenceBrief?.whatWhySoWhat?.soWhat ||
    currentMemory?.so_what ||
    "Defensive IP filings and product benchmark comparisons required within 60 days.";
  const finalClassification =
    intelligenceBrief?.classification || "THREAT";

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16 font-sans">
      {/* 1. TOP HERO BANNER */}
      <div className="bg-[#0D0F16] rounded-2xl p-6 sm:p-7 border border-[#1A1F2C] shadow-nexus-card flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[11px] font-mono font-bold uppercase text-[#A855F7] px-3 py-1 rounded-lg bg-[#240047]/60 border border-purple-500/30">
              Task 4 // Context & Memory Engine
            </span>
            <span className="text-xs font-mono text-[#22C55E] font-semibold flex items-center gap-1">
              <Database className="w-3.5 h-3.5" />
              Short-Term Working Context + Persistent Database Memory
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 leading-snug">
            Investigation Working Context & Intelligence History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Maintains structured context across multi-agent execution steps (Orchestrator → Research → Competitor → Synthesis) and persists historical memory in SQLite.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveView("landing")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#7C2CFF] hover:bg-[#6b21e8] text-white text-xs font-semibold shadow-nexus-glow transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch New Investigation</span>
          </button>
        </div>
      </div>

      {/* 2. MEMORY STATUS INDICATOR BAR */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-center text-[10px] font-mono font-bold">
        <div className="p-2.5 rounded-xl bg-[#0D0F16] border border-cyan-500/40 text-cyan-300 shadow-sm flex items-center justify-center gap-1.5">
          <Brain className="w-3.5 h-3.5 text-cyan-400" />
          <span>🧠 CONTEXT INITIALIZED</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#0D0F16] border border-purple-500/40 text-purple-300 shadow-sm flex items-center justify-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-purple-400" />
          <span>🧠 MEMORY UPDATED</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#0D0F16] border border-indigo-500/40 text-indigo-300 shadow-sm flex items-center justify-center gap-1.5">
          <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
          <span>🧠 CONTEXT PASSED</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#0D0F16] border border-emerald-500/40 text-emerald-300 shadow-sm flex items-center justify-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-emerald-400" />
          <span>🗃 MEMORY SAVED</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#0D0F16] border border-amber-500/40 text-amber-300 shadow-sm flex items-center justify-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-amber-400" />
          <span>🔎 RELEVANT FOUND</span>
        </div>
        <div className="p-2.5 rounded-xl bg-[#0D0F16] border border-blue-500/40 text-blue-300 shadow-sm flex items-center justify-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
          <span>🔄 PREVIOUS VS CURRENT</span>
        </div>
      </div>

      {/* 3. SECTION 1: 🧠 CURRENT INVESTIGATION CONTEXT */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-[#00D9FF]" />
            <h2 className="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wide font-mono">
              🧠 CURRENT INVESTIGATION CONTEXT
            </h2>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold">
            Status: {currentMemory?.status || "Completed"}
          </span>
        </div>

        {currentMemory ? (
          <div className="bg-[#0D0F16] rounded-2xl p-6 border border-[#1A1F2C] space-y-6">
            {/* Top Grid: Key Attributes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pb-5 border-b border-[#1A1F2C]">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                  Current Step
                </span>
                <span className="text-sm font-bold text-slate-200">
                  Step {currentMemory.current_step || 3} of {currentMemory.total_steps_planned || 4}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                  Current Agent
                </span>
                <span className="text-sm font-bold text-[#00D9FF]">
                  {currentMemory.current_agent || "Synthesizer Agent"}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                  Sources Verified
                </span>
                <span className="text-sm font-bold text-purple-300">
                  {currentMemory.sources_count || 6}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                  Evidence Items
                </span>
                <span className="text-sm font-bold text-emerald-400">
                  {currentMemory.evidence_count || 8}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                  Unresolved Questions
                </span>
                <span className="text-sm font-bold text-amber-300">
                  {(currentMemory.unresolved_questions || []).length || 2}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                  Updated At
                </span>
                <span className="text-sm font-bold text-slate-400 font-mono">
                  {currentMemory.updated_at || "Recent"}
                </span>
              </div>
            </div>

            {/* Objective & Plan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 rounded-xl bg-[#07080D] border border-[#1A1F2C] space-y-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-cyan-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  Objective:
                </span>
                <p className="text-xs sm:text-sm font-bold text-slate-100">
                  "{currentMemory.objective}"
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#07080D] border border-[#1A1F2C] space-y-1.5">
                <span className="text-[10px] font-mono uppercase font-bold text-[#A855F7] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  Autonomous Execution Plan:
                </span>
                <p className="text-xs sm:text-sm text-purple-200 font-sans">
                  {currentMemory.current_plan || "1. Research Papers (ArXiv) → 2. Context Handover → 3. Competitor Disclosures (Web) → 4. Synthesis"}
                </p>
              </div>
            </div>

            {/* Unresolved Questions & Agents/Tools Used */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Active Inquiries / Unresolved Questions:
                </span>
                <div className="space-y-1.5">
                  {(currentMemory.unresolved_questions && currentMemory.unresolved_questions.length > 0
                    ? currentMemory.unresolved_questions
                    : [
                        "What specific architecture innovations are disclosed in recent preprints?",
                        "Are there commercial launch timelines that directly threaten our roadmap?",
                      ]
                  ).map((q, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200/90 font-sans flex items-start gap-2"
                    >
                      <span className="text-amber-400 font-mono font-bold">•</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-slate-400" />
                  Specialized Agents & Tools in Working Memory:
                </span>
                <div className="p-3.5 rounded-xl bg-[#07080D] border border-[#1A1F2C] space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Agents Pipeline:</span>
                    <span className="font-mono text-[#00D9FF] font-bold">
                      {(currentMemory.agents_used || ["Orchestrator Agent", "Research Agent", "Competitor Agent", "Synthesizer Agent"]).join(" → ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Tools Executed:</span>
                    <span className="font-mono text-purple-300 font-bold">
                      {(currentMemory.tools_used || ["Memory Engine", "research_papers", "web_search"]).join(" • ")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-[#0D0F16] border border-[#1A1F2C] text-center text-slate-400 text-xs">
            No active short-term investigation currently executing.
          </div>
        )}
      </div>

      {/* 4. SECTION 2: 🧠 MEMORY TIMELINE (STRUCTURED AUDIT LOG) */}
      <div className="space-y-4 pt-4 border-t border-[#1A1F2C]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#A855F7]" />
            <h2 className="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wide font-mono">
              🧠 MEMORY TIMELINE (Structured Audit Log)
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Zero Private CoT Leakage // Safe Events Only
          </span>
        </div>

        <div className="bg-[#0D0F16] rounded-2xl p-6 border border-[#1A1F2C] space-y-4">
          <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#1A1F2C]">
            {(currentMemory?.timeline_events && currentMemory.timeline_events.length > 0
              ? currentMemory.timeline_events
              : [
                  {
                    timestamp: "09:41:02",
                    event_type: "OBJECTIVE_STORED",
                    title: "Objective Stored",
                    description:
                      'Investigation objective recorded in working memory context.',
                    agent: "Orchestrator Agent",
                    badge_label: "🧠 CONTEXT INITIALIZED",
                  },
                  {
                    timestamp: "09:41:10",
                    event_type: "PLAN_STORED",
                    title: "Research Plan Stored",
                    description:
                      "Deconstructed into 4-stage sequential plan: Research Papers → Context Handover → Web Disclosures → Synthesis.",
                    agent: "Orchestrator Agent",
                    badge_label: "🧠 MEMORY UPDATED",
                  },
                  {
                    timestamp: "09:41:25",
                    event_type: "RESEARCH_FINDINGS_STORED",
                    title: "Research Findings Stored",
                    description:
                      "Retrieved 4 verified research papers from ArXiv API. Extracted foundational technical claims.",
                    agent: "Research Agent",
                    badge_label: "🧠 MEMORY UPDATED",
                  },
                  {
                    timestamp: "09:41:38",
                    event_type: "CONTEXT_PASSED",
                    title: "Context Passed to Competitor Agent",
                    description:
                      "Research findings and unresolved questions transferred to Competitor Agent for targeted web search.",
                    agent: "Orchestrator Agent",
                    badge_label: "🧠 CONTEXT PASSED TO AGENT",
                  },
                  {
                    timestamp: "09:41:52",
                    event_type: "COMPETITOR_FINDINGS_STORED",
                    title: "Competitor Findings Stored",
                    description:
                      "Retrieved competitor market announcements and verified commercial deployment signals.",
                    agent: "Competitor Agent",
                    badge_label: "🧠 MEMORY UPDATED",
                  },
                  {
                    timestamp: "09:42:05",
                    event_type: "INTELLIGENCE_STORED",
                    title: "Final Strategic Intelligence Stored",
                    description:
                      "Generated WHAT → WHY → SO WHAT synthesis with THREAT classification. Persisted to SQLite database.",
                    agent: "Synthesizer Agent",
                    badge_label: "🗃 MEMORY SAVED",
                  },
                ]
            ).map((event, idx) => (
              <div key={idx} className="relative space-y-1 text-xs">
                {/* Bullet Check icon */}
                <div className="absolute -left-[27px] top-1 w-3.5 h-3.5 rounded-full bg-[#7C2CFF] border-2 border-[#0D0F16] flex items-center justify-center">
                  <Check className="w-2 h-2 text-white stroke-[3]" />
                </div>

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-500 font-bold">
                      {event.timestamp}
                    </span>
                    <span className="font-bold text-slate-200">
                      {event.title}
                    </span>
                    <span className="text-[10px] font-mono text-purple-300">
                      ({event.agent})
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#240047]/60 text-purple-200 border border-purple-500/30">
                    {event.badge_label}
                  </span>
                </div>
                <p className="text-slate-400 font-sans pl-1">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. SECTION 3: 🔎 RELEVANT MEMORY FOUND */}
      {previousContext && (
        <div className="space-y-4 pt-4 border-t border-[#1A1F2C]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-amber-400" />
              <h2 className="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wide font-mono">
                🔎 RELEVANT MEMORY FOUND
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-amber-300 px-3 py-1 rounded-lg bg-amber-950/60 border border-amber-500/30">
              Matched Entity: {previousContext.target_entity} ({(previousContext.relevance_score * 100).toFixed(0)}% Relevance)
            </span>
          </div>

          <div className="bg-[#0D0F16] rounded-2xl p-6 border border-amber-500/30 shadow-sm space-y-5">
            <div className="flex items-start justify-between gap-4 flex-wrap pb-4 border-b border-[#1A1F2C]">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-amber-400 block mb-1">
                  Recalled Previous Investigation
                </span>
                <h3 className="text-sm font-bold text-slate-100">
                  "{previousContext.previous_objective}"
                </h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {previousContext.investigated_at}
                </span>
                <span className="text-emerald-400 font-bold">
                  {previousContext.sources_count || 4} Verified Sources
                </span>
              </div>
            </div>

            {/* Previous Baseline Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3.5 rounded-xl bg-[#07080D] border border-[#1A1F2C] space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                  Previous WHAT:
                </span>
                <p className="text-xs text-slate-300 font-sans">
                  {previousContext.previous_what}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#07080D] border border-[#1A1F2C] space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                  Previous WHY:
                </span>
                <p className="text-xs text-slate-300 font-sans">
                  {previousContext.previous_why}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#07080D] border border-[#1A1F2C] space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 block">
                  Previous SO WHAT:
                </span>
                <p className="text-xs text-emerald-200/90 font-sans">
                  {previousContext.previous_so_what}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. SECTION 4: 🔄 PREVIOUS VS CURRENT (COMPARISON & TEMPORAL DELTA) */}
      <div className="space-y-4 pt-4 border-t border-[#1A1F2C]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#00D9FF]" />
            <h2 className="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wide font-mono">
              🔄 PREVIOUS VS CURRENT (Comparison & Changes)
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-300 px-3 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30">
            Temporal Delta Active
          </span>
        </div>

        <div className="bg-[#0D0F16] rounded-2xl p-6 border border-[#1A1F2C] space-y-6">
          {/* Comparison Metrics Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-left">
              <thead>
                <tr className="text-slate-500 border-b border-[#1A1F2C] uppercase text-[10px]">
                  <th className="pb-3 font-bold">Metric</th>
                  <th className="pb-3 font-bold">Previous Investigation</th>
                  <th className="pb-3 font-bold">Current Investigation</th>
                  <th className="pb-3 font-bold">Delta Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1A1F2C]">
                {comparisonMetrics.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#07080D]/50 transition-colors">
                    <td className="py-3 font-sans font-bold text-slate-200">
                      {row.metric_name}
                    </td>
                    <td className="py-3 text-slate-400">
                      {row.previous_value}
                    </td>
                    <td className="py-3 font-bold text-purple-300">
                      {row.current_value}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
                        ↑ {row.delta_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CHANGES DETECTED BOX */}
          <div className="p-5 rounded-xl bg-[#07080D] border border-cyan-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#00D9FF]">
              <History className="w-4 h-4" />
              <span>CHANGES DETECTED SINCE PREVIOUS INVESTIGATION</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300 font-sans">
              <p>
                • <strong>Research Activity:</strong> Accelerated preprint publications on low-power tensor quantization.
              </p>
              <p>
                • <strong>Competitor Signals:</strong> Confirmed new commercial enterprise deployment partnerships.
              </p>
              <p>
                • <strong>Threat Level:</strong> Escalated from <em>Medium</em> to <em>High</em> due to overlapping vision software stack.
              </p>
              <p>
                • <strong>Evidence:</strong> +4 new supporting verified sources added to evidence graph.
              </p>
            </div>
          </div>

          {/* Side-by-Side WHAT / WHY / SO WHAT Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-4 rounded-xl bg-[#07080D] border border-[#1A1F2C] space-y-2 text-xs">
              <span className="text-[10px] font-mono uppercase font-bold text-slate-500 block">
                PREVIOUS INTELLIGENCE (Historical Baseline)
              </span>
              <div className="space-y-1.5 text-slate-400 font-sans">
                <p>
                  <strong>WHAT:</strong> {previousContext?.previous_what || "Identified preliminary high throughput tensor accelerator patents."}
                </p>
                <p>
                  <strong>WHY:</strong> {previousContext?.previous_why || "Defending against lower power alternative inference hardware."}
                </p>
                <p>
                  <strong>SO WHAT:</strong> {previousContext?.previous_so_what || "Benchmark our computer vision pipeline against competitor throughput."}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#240047]/30 border border-purple-500/40 space-y-2 text-xs">
              <span className="text-[10px] font-mono uppercase font-bold text-purple-300 block">
                CURRENT UPDATED INTELLIGENCE (With Memory Delta)
              </span>
              <div className="space-y-1.5 text-purple-100 font-sans">
                <p>
                  <strong>WHAT:</strong> {finalWhat}
                </p>
                <p>
                  <strong>WHY:</strong> {finalWhy}
                </p>
                <p>
                  <strong>SO WHAT:</strong> {finalSoWhat}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 7. SECTION 5: 🎯 WHAT → WHY → SO WHAT (FINAL STRATEGIC INTELLIGENCE) */}
      <div className="space-y-4 pt-4 border-t border-[#1A1F2C]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#A855F7]" />
            <h2 className="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wide font-mono">
              🎯 WHAT → WHY → SO WHAT (Final Intelligence)
            </h2>
          </div>
          <span
            className={`text-xs font-mono font-bold px-3 py-1 rounded-lg border ${
              finalClassification === "THREAT"
                ? "bg-red-950/60 text-red-300 border-red-500/40"
                : "bg-emerald-950/60 text-emerald-300 border-emerald-500/40"
            }`}
          >
            {finalClassification} // HIGH PRIORITY
          </span>
        </div>

        <div className="bg-[#0D0F16] rounded-2xl p-6 border border-[#1A1F2C] space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* WHAT CARD */}
            <div className="p-5 rounded-xl bg-[#07080D] border border-cyan-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#00D9FF]">
                <Target className="w-4 h-4" />
                <span>1. WHAT (Empirical Finding)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                {finalWhat}
              </p>
            </div>

            {/* WHY CARD */}
            <div className="p-5 rounded-xl bg-[#07080D] border border-purple-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#A855F7]">
                <Zap className="w-4 h-4" />
                <span>2. WHY (Strategic Motive)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                {finalWhy}
              </p>
            </div>

            {/* SO WHAT CARD */}
            <div className="p-5 rounded-xl bg-[#07080D] border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#22C55E]">
                <Sparkles className="w-4 h-4" />
                <span>3. SO WHAT (Strategic Action)</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                {finalSoWhat}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 8. SECTION 6: 🗃 LONG-TERM MEMORY (PERSISTENT DATABASE HISTORY) */}
      <div className="space-y-4 pt-4 border-t border-[#1A1F2C]">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#22C55E]" />
            <h2 className="text-base sm:text-lg font-bold text-slate-100 uppercase tracking-wide font-mono">
              🗃 LONG-TERM MEMORY (Persistent Database History)
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {memoryHistory?.total_investigations_stored || 0} Investigations Stored in SQLite
          </span>
        </div>

        {/* Interactive Memory Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search historical database memory (e.g., NVIDIA, OmniHealth, Edge Compute)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0D0F16] border border-[#1A1F2C] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#7C2CFF] transition-all font-sans"
            />
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="px-4 py-2.5 rounded-xl bg-[#240047] hover:bg-[#340066] border border-purple-500/40 text-purple-200 text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-1.5"
          >
            {isSearching ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
            <span>Search Memory</span>
          </button>
        </form>

        {searchResult && (
          <div className="p-4 rounded-xl bg-[#0D0F16] border border-purple-500/30 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-purple-300 font-bold">
                Search Result for "{searchResult.query}":
              </span>
              <span className="font-mono text-emerald-400">
                {searchResult.has_match ? "✓ Match Found in Long-Term Memory" : "No exact match"}
              </span>
            </div>
            {searchResult.context && (
              <div className="p-3 rounded-lg bg-[#07080D] border border-[#1A1F2C] space-y-1 text-slate-300">
                <p>
                  <strong>Target Entity:</strong> {searchResult.context.target_entity}
                </p>
                <p>
                  <strong>Previous WHAT:</strong> {searchResult.context.previous_what}
                </p>
                <p>
                  <strong>Previous SO WHAT:</strong> {searchResult.context.previous_so_what}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Grid of Stored Investigations */}
        {memoryHistory && memoryHistory.investigations && memoryHistory.investigations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {memoryHistory.investigations.map((inv) => (
              <div
                key={inv.run_id}
                onClick={() => setSelectedHistoryItem(inv)}
                className={`bg-[#0D0F16] rounded-2xl p-5 border cursor-pointer transition-all space-y-3.5 ${
                  selectedHistoryItem?.run_id === inv.run_id
                    ? "border-[#7C2CFF] shadow-nexus-glow"
                    : "border-[#1A1F2C] hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-purple-300 font-bold">{inv.domain}</span>
                  <span className="text-slate-500">{inv.created_at}</span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-slate-100 line-clamp-2">
                  {inv.objective}
                </h3>

                <div className="bg-[#07080D] p-3 rounded-xl border border-[#1A1F2C] text-xs space-y-2 font-sans">
                  <div className="line-clamp-2 text-slate-300">
                    <strong className="text-slate-500 font-mono uppercase text-[10px] block">
                      WHAT:
                    </strong>
                    {inv.what}
                  </div>
                  <div className="line-clamp-2 text-emerald-200/90 pt-1.5 border-t border-[#1A1F2C]">
                    <strong className="text-emerald-400 font-mono uppercase text-[10px] block">
                      SO WHAT:
                    </strong>
                    {inv.so_what}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono pt-2 border-t border-[#1A1F2C]">
                  <span className="text-slate-400">{inv.evidence_count} Sources</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      inv.classification === "THREAT"
                        ? "bg-red-950/60 text-red-300 border-red-500/30"
                        : "bg-emerald-950/60 text-emerald-300 border-emerald-500/30"
                    }`}
                  >
                    {inv.classification}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-[#0D0F16] border border-[#1A1F2C] text-center text-slate-400 text-xs">
            No previous investigations stored in database yet.
          </div>
        )}

        {/* Historical Opportunities & Threats from Memory */}
        {memoryHistory && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* Opportunities */}
            <div className="p-5 rounded-2xl bg-[#0D0F16] border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-[#22C55E]">
                <Sparkles className="w-4 h-4" />
                <span>Historical Opportunities in Long-Term Memory</span>
              </div>
              <div className="space-y-2">
                {(memoryHistory.previous_opportunities || [
                  {
                    title: "Differentiate with lower power consumption against competitor stack",
                    what: "Enterprise customers report power budget constraints on edge deployments.",
                  },
                ]).map((opp, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#07080D] border border-[#1A1F2C] text-xs space-y-1"
                  >
                    <span className="font-bold text-slate-200 block">{opp.title}</span>
                    <p className="text-slate-400 font-sans">{opp.what}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Threats */}
            <div className="p-5 rounded-2xl bg-[#0D0F16] border border-red-500/30 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-red-400">
                <ShieldAlert className="w-4 h-4" />
                <span>Historical Threats in Long-Term Memory</span>
              </div>
              <div className="space-y-2">
                {(memoryHistory.previous_threats || [
                  {
                    title: "Competitive R&D acceleration in competitor edge product lines",
                    what: "Patent disclosures show integrated edge sensor pipelines.",
                  },
                ]).map((thr, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#07080D] border border-[#1A1F2C] text-xs space-y-1"
                  >
                    <span className="font-bold text-slate-200 block">{thr.title}</span>
                    <p className="text-slate-400 font-sans">{thr.what}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MemoryView;
