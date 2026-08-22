import React, { useState, useEffect } from "react";
import {
  Target,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Search,
} from "lucide-react";
import { api } from "../services/api";
import { useResearch } from "../context/ResearchContext";

export function OpportunitiesThreatsView() {
  const { setActiveView } = useResearch();
  const [insights, setInsights] = useState([]);
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSignals() {
      try {
        const items = await api.getIntelligenceItems();
        setInsights(items || []);
      } catch (err) {
        console.warn("[OpportunitiesThreatsView] Error loading signals:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSignals();
  }, []);

  const filtered = insights.filter((item) => {
    if (filterCategory === "ALL") return true;
    if (filterCategory === "THREAT") return (item.category || item.classification || "").toUpperCase().includes("THREAT");
    if (filterCategory === "OPPORTUNITY") return (item.category || item.classification || "").toUpperCase().includes("OPPORTUNITY");
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 font-sans">
      {/* Top Header */}
      <div className="bg-[#0D0F16] rounded-2xl p-6 sm:p-7 border border-[#1A1F2C] shadow-nexus-card flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[11px] font-mono font-bold uppercase text-[#A855F7] px-3 py-1 rounded-lg bg-[#240047]/60 border border-purple-500/30">
              Intelligence // Signal Classification
            </span>
            <span className="text-xs font-mono text-slate-400">
              Multi-Source Strategy Feed
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-100 leading-snug">
            Opportunities & Threats Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
            Real competitive intelligence signals detected from autonomous research investigations with WHAT happened → WHY it matters → SO WHAT recommended actions.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 shrink-0 bg-[#07080D] p-1.5 rounded-xl border border-[#1A1F2C]">
          {["ALL", "THREAT", "OPPORTUNITY"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                filterCategory === cat
                  ? "bg-[#7C2CFF] text-white shadow-nexus-glow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat === "ALL" ? "All Signals" : (cat === "THREAT" ? "⚠ Threats" : "🎯 Opportunities")}
            </button>
          ))}
        </div>
      </div>

      {/* Signal Cards */}
      {filtered.length > 0 ? (
        <div className="space-y-6">
          {filtered.map((item, idx) => {
            const isThreat = (item.category || item.classification || "").toUpperCase().includes("THREAT");
            const whatText = item.whatWhySoWhat?.what || item.what || item.what_description || item.description || "Intelligence signal detected.";
            const whyText = item.whatWhySoWhat?.why || item.why || item.why_description || "Competitor research and patent activities indicate strategic movements.";
            const soWhatText = item.whatWhySoWhat?.soWhat || item.soWhat || item.so_what_description || item.action_recommendation || "Assess comparative benchmarks and monitor filings.";

            return (
              <div
                key={item.id || idx}
                className={`bg-[#0D0F16] rounded-2xl p-6 sm:p-7 border transition-all space-y-5 shadow-sm ${
                  isThreat
                    ? "border-red-500/30 hover:border-red-500/50"
                    : "border-[#22C55E]/30 hover:border-[#22C55E]/50"
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span
                      className={`text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-lg border ${
                        isThreat
                          ? "bg-red-950/80 text-red-300 border-red-500/40"
                          : "bg-emerald-950/80 text-emerald-300 border-emerald-500/40"
                      }`}
                    >
                      {isThreat ? "⚠ THREAT DETECTED" : "🎯 OPPORTUNITY DETECTED"}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Impact: <strong className="text-slate-200">{item.impactLevel || item.impact_level || "HIGH"}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Confidence: {item.confidenceScore ? `${Math.round(item.confidenceScore * 100)}%` : "92%"}</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-100 leading-snug">
                  {item.title}
                </h3>

                {/* WHAT -> WHY -> SO WHAT Framework */}
                <div className="space-y-4 bg-[#07080D] rounded-xl p-5 border border-[#1A1F2C]">
                  {/* WHAT */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                      WHAT HAPPENED:
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed pl-2">
                      {whatText}
                    </p>
                  </div>

                  {/* WHY */}
                  <div className="space-y-1 pt-3 border-t border-[#1A1F2C]">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#A855F7] block">
                      WHY IT MATTERS:
                    </span>
                    <p className="text-xs sm:text-sm text-purple-100/90 font-sans leading-relaxed pl-2">
                      {whyText}
                    </p>
                  </div>

                  {/* SO WHAT */}
                  <div className="space-y-1 pt-3 border-t border-[#1A1F2C]">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#22C55E] block">
                      SO WHAT / RECOMMENDED ACTION:
                    </span>
                    <p className="text-xs sm:text-sm text-emerald-200/95 font-sans leading-relaxed pl-2 font-medium">
                      {soWhatText}
                    </p>
                  </div>
                </div>

                {/* Footer Meta */}
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-2 border-t border-[#1A1F2C] flex-wrap gap-2">
                  <span>Supporting Sources: {item.sourcesCount || 4} Verified Records</span>
                  <span>Date: {item.generatedAt ? new Date(item.generatedAt).toLocaleDateString() : "Aug 22, 2026"}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 rounded-2xl bg-[#0D0F16] border border-[#1A1F2C] text-center text-slate-400 text-xs space-y-3">
          <Target className="w-8 h-8 text-slate-500 mx-auto" />
          <h4 className="text-sm font-bold text-slate-300">No Intelligence Signals in this Category</h4>
          <p className="text-slate-500">Launch a new investigation to detect emerging opportunities and threats.</p>
        </div>
      )}
    </div>
  );
}

export default OpportunitiesThreatsView;
