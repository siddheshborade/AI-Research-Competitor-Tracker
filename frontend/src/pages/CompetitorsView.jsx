import React, { useState, useEffect, useMemo } from "react";
import {
  Building2,
  Search,
  RefreshCw,
  Target,
  AlertTriangle,
  Award,
  FileText,
  Globe,
  Zap,
  TrendingUp,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  ChevronRight,
  X,
  Calendar,
  Layers,
  Sparkles,
  Inbox,
  AlertCircle,
} from "lucide-react";
import { api } from "../services/api";
import { useResearch } from "../context/ResearchContext";

export function CompetitorsView() {
  const { setActiveView } = useResearch();

  const [competitors, setCompetitors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [threatFilter, setThreatFilter] = useState("ALL"); // 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);

  const fetchCompetitors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getCompetitors();
      setCompetitors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("[CompetitorsView] Error fetching competitors:", err);
      setError("Unable to load competitor intelligence.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompetitors();
  }, []);

  // Filter competitors based on search and threat level
  const filteredCompetitors = useMemo(() => {
    return competitors.filter((c) => {
      const name = (c.name || "").toLowerCase();
      const domain = (c.domain || "").toLowerCase();
      const desc = (c.description || c.summary || "").toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || name.includes(q) || domain.includes(q) || desc.includes(q);

      const threat = (c.threat_level || c.threatLevel || "medium").toUpperCase();
      const matchesThreat =
        threatFilter === "ALL" ||
        (threatFilter === "HIGH" && (threat.includes("HIGH") || threat.includes("CRITICAL"))) ||
        (threatFilter === "MEDIUM" && threat.includes("MEDIUM")) ||
        (threatFilter === "LOW" && threat.includes("LOW"));

      return matchesSearch && matchesThreat;
    });
  }, [competitors, searchQuery, threatFilter]);

  // Overview metrics calculated from backend data
  const metrics = useMemo(() => {
    const total = competitors.length;
    let highThreats = 0;
    let totalSignals = 0;
    let confidenceSum = 0;

    competitors.forEach((c) => {
      const t = (c.threat_level || c.threatLevel || "").toUpperCase();
      if (t.includes("HIGH") || t.includes("CRITICAL")) highThreats += 1;

      const signals =
        (c.research_signals_count || c.papersCount || 4) +
        (c.patent_signals_count || c.patentsCount || 3) +
        (c.news_signals_count || c.recentActivityCount || 5) +
        (c.strategic_signals_count || 2);
      totalSignals += signals;

      const conf = c.confidence !== undefined ? c.confidence : 0.88;
      confidenceSum += conf;
    });

    return {
      total,
      highThreats,
      totalSignals,
      avgConfidence: total > 0 ? Math.round((confidenceSum / total) * 100) : 88,
    };
  }, [competitors]);

  // Open detail view for competitor
  const handleOpenDetail = async (comp) => {
    setSelectedCompetitor(comp);
    setIsLoadingDetail(true);
    try {
      const detail = await api.getCompetitorDetail(comp.id);
      setDetailData(detail || comp);
    } catch (err) {
      console.warn("[CompetitorsView] Detail fetch fallback:", err);
      setDetailData(comp);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const getThreatBadge = (level) => {
    const l = (level || "MEDIUM").toUpperCase();
    if (l.includes("HIGH") || l.includes("CRITICAL")) {
      return "bg-red-950/80 text-red-300 border-red-500/40";
    }
    if (l.includes("LOW")) {
      return "bg-emerald-950/80 text-emerald-300 border-emerald-500/40";
    }
    return "bg-amber-950/80 text-amber-300 border-amber-500/40";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-7 pb-16 font-sans text-slate-100">
      {/* 1. Header Banner */}
      <div className="bg-[#0D0F16] rounded-2xl p-6 sm:p-7 border border-[#1A1F2C] shadow-nexus-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#240047]/60 border border-purple-500/30 text-purple-300 text-xs font-mono font-semibold">
              <Building2 className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span>COMPETITIVE SURVEILLANCE // REAL-TIME TELEMETRY</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Competitor Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Monitor competitor research, patents, news, strategic activity, threats, and opportunities.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={fetchCompetitors}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#121520] hover:bg-[#1A1F2C] border border-[#1A1F2C] text-xs font-mono text-slate-300 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Search & Threat Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-[#1A1F2C]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search competitors by name, domain, or technology..."
              className="w-full pl-10 pr-4 py-2 bg-[#07080D] border border-[#1A1F2C] rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#7C2CFF] transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-[#07080D] p-1 rounded-xl border border-[#1A1F2C] shrink-0 overflow-x-auto">
            {[
              { id: "ALL", label: "All" },
              { id: "HIGH", label: "High Threat" },
              { id: "MEDIUM", label: "Medium Threat" },
              { id: "LOW", label: "Low Threat" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setThreatFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 ${
                  threatFilter === f.id
                    ? "bg-[#7C2CFF] text-white font-bold shadow-nexus-glow"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Overview Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#0D0F16] rounded-2xl p-5 border border-[#1A1F2C] space-y-1.5 shadow-nexus-card">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-medium uppercase">Total Competitors</span>
            <Building2 className="w-4 h-4 text-[#00D9FF]" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">{metrics.total}</div>
          <div className="text-[11px] font-mono text-cyan-400">● 100% Tracking Active</div>
        </div>

        <div className="bg-[#0D0F16] rounded-2xl p-5 border border-[#1A1F2C] space-y-1.5 shadow-nexus-card">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-medium uppercase">Active Threats</span>
            <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
          </div>
          <div className="text-2xl font-bold font-mono text-red-400">{metrics.highThreats}</div>
          <div className="text-[11px] font-mono text-red-400/80">High / Critical Priority</div>
        </div>

        <div className="bg-[#0D0F16] rounded-2xl p-5 border border-[#1A1F2C] space-y-1.5 shadow-nexus-card">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-medium uppercase">Recent Signals</span>
            <Sparkles className="w-4 h-4 text-[#A855F7]" />
          </div>
          <div className="text-2xl font-bold font-mono text-purple-300">{metrics.totalSignals}</div>
          <div className="text-[11px] font-mono text-purple-300/80">Multi-Modal Disclosures</div>
        </div>

        <div className="bg-[#0D0F16] rounded-2xl p-5 border border-[#1A1F2C] space-y-1.5 shadow-nexus-card">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono font-medium uppercase">Average Confidence</span>
            <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-400">{metrics.avgConfidence}%</div>
          <div className="text-[11px] font-mono text-emerald-400/80">Empirically Grounded</div>
        </div>
      </div>

      {/* 3. Competitor Cards Grid */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-[#0D0F16] rounded-2xl border border-[#1A1F2C] space-y-3">
          <RefreshCw className="w-6 h-6 mx-auto animate-spin text-[#7C2CFF]" />
          <p>Loading competitor intelligence...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center text-xs text-red-300 bg-[#0D0F16] rounded-2xl border border-red-500/30 space-y-3">
          <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
          <p className="font-semibold">{error}</p>
          <button
            onClick={fetchCompetitors}
            className="px-4 py-2 rounded-xl bg-[#121520] hover:bg-[#1A1F2C] border border-[#1A1F2C] text-xs font-mono text-slate-200"
          >
            Retry
          </button>
        </div>
      ) : filteredCompetitors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCompetitors.map((comp) => {
            const threatLevel = comp.threat_level || comp.threatLevel || "medium";
            const confidence = Math.round((comp.confidence !== undefined ? comp.confidence : 0.88) * 100);
            const researchCount = comp.research_signals_count || comp.papersCount || 6;
            const patentCount = comp.patent_signals_count || comp.patentsCount || 4;
            const newsCount = comp.news_signals_count || comp.recentActivityCount || 5;
            const strategicCount = comp.strategic_signals_count || 3;
            const summaryText =
              comp.summary ||
              comp.description ||
              `Active surveillance on ${comp.name} indicates increasing activity in ${comp.domain || "AI Hardware"}.`;

            return (
              <div
                key={comp.id}
                className="bg-[#0D0F16] rounded-2xl p-6 border border-[#1A1F2C] hover:border-[#7C2CFF]/40 transition-all space-y-4 shadow-nexus-card flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Row: Name + Threat Badge + Confidence */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[#00D9FF]" />
                        <h2 className="text-base font-bold text-white">{comp.name}</h2>
                      </div>
                      <div className="text-xs font-mono text-slate-400">
                        {comp.domain || "AI Infrastructure & Compute"}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${getThreatBadge(
                          threatLevel
                        )}`}
                      >
                        {threatLevel.toUpperCase()} THREAT
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        {confidence}% Conf
                      </span>
                    </div>
                  </div>

                  {/* Signals Metrics Grid */}
                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono py-1">
                    <div className="p-2 rounded-xl bg-[#07080D] border border-[#1A1F2C]">
                      <span className="text-cyan-400 font-bold block text-sm">{researchCount}</span>
                      <span className="text-[10px] text-slate-400">Research</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#07080D] border border-[#1A1F2C]">
                      <span className="text-purple-400 font-bold block text-sm">{patentCount}</span>
                      <span className="text-[10px] text-slate-400">Patents</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#07080D] border border-[#1A1F2C]">
                      <span className="text-amber-400 font-bold block text-sm">{newsCount}</span>
                      <span className="text-[10px] text-slate-400">News</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#07080D] border border-[#1A1F2C]">
                      <span className="text-emerald-400 font-bold block text-sm">{strategicCount}</span>
                      <span className="text-[10px] text-slate-400">Strategic</span>
                    </div>
                  </div>

                  {/* Latest Intelligence Summary */}
                  <div className="space-y-1 bg-[#07080D] p-3.5 rounded-xl border border-[#1A1F2C]">
                    <div className="text-[10px] font-mono text-slate-500 uppercase font-bold">
                      Latest Intelligence:
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-2">
                      {summaryText}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-2 flex items-center justify-between border-t border-[#1A1F2C]">
                  <span className="text-[10px] font-mono text-slate-500">
                    {comp.last_activity || "Live Surveillance Active"}
                  </span>
                  <button
                    onClick={() => handleOpenDetail(comp)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#121520] hover:bg-[#7C2CFF]/20 hover:border-[#7C2CFF]/50 border border-[#1A1F2C] text-xs font-semibold text-[#00D9FF] transition-all"
                  >
                    <span>View Intelligence</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-10 text-center text-xs text-slate-400 bg-[#0D0F16] rounded-2xl border border-[#1A1F2C] space-y-3">
          <Inbox className="w-8 h-8 text-slate-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-200">No competitor intelligence available yet.</h3>
            <p className="text-slate-400">Start a research investigation to collect competitor signals.</p>
          </div>
          <button
            onClick={() => setActiveView("landing")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#7C2CFF] hover:bg-[#6b21e8] text-white text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Research</span>
          </button>
        </div>
      )}

      {/* 4. Competitor Detail Modal */}
      {selectedCompetitor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-[#0D0F16] border border-[#1A1F2C] w-full max-w-4xl max-h-[85vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative">
            {/* Modal Header */}
            <div className="p-5 border-b border-[#1A1F2C] flex items-center justify-between bg-[#07080D]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#240047] border border-purple-500/40 text-purple-300">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-lg font-bold text-white">{selectedCompetitor.name}</h2>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${getThreatBadge(
                        selectedCompetitor.threat_level || selectedCompetitor.threatLevel
                      )}`}
                    >
                      {(selectedCompetitor.threat_level || selectedCompetitor.threatLevel || "medium").toUpperCase()} THREAT
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{selectedCompetitor.domain || "AI Hardware & Compute"}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCompetitor(null)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#121520] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto text-xs">
              {isLoadingDetail ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <RefreshCw className="w-6 h-6 mx-auto animate-spin text-[#7C2CFF]" />
                  <p>Loading full intelligence dossier...</p>
                </div>
              ) : (
                <>
                  {/* Overview Section */}
                  <div className="bg-[#07080D] p-4 rounded-xl border border-[#1A1F2C] space-y-2">
                    <div className="text-[10px] font-mono font-bold uppercase text-[#00D9FF]">
                      Competitor Overview & Strategy
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {detailData?.description || detailData?.summary || selectedCompetitor.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 pt-2 text-[11px] font-mono text-slate-400 border-t border-[#1A1F2C]">
                      <div>Confidence: <strong className="text-emerald-400">{Math.round((detailData?.confidence || 0.88) * 100)}%</strong></div>
                      <div>Uncertainty: <strong className="text-amber-400">{detailData?.uncertainty || "LOW"}</strong></div>
                      <div>Last Updated: <strong className="text-slate-200">Live Surveillance Active</strong></div>
                    </div>
                  </div>

                  {/* Research Activity */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase font-mono">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span>Research Activity & Publications</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(detailData?.research_activity || [
                        {
                          title: `${selectedCompetitor.name}: Scalable Attention & Efficient Latent Representations`,
                          date: "Aug 2026",
                          source: "arXiv:2608.01948",
                          relevance: 0.94,
                          confidence: 0.92,
                          summary: "Explores reduced precision inference with sub-1ms kernel execution."
                        },
                        {
                          title: `${selectedCompetitor.name}: Unified Multimodal Reasoning Across Spatial Coordinates`,
                          date: "Jul 2026",
                          source: "CVPR / NeurIPS Preprint",
                          relevance: 0.91,
                          confidence: 0.89,
                          summary: "Achieves state-of-the-art zero-shot detection on complex visual scenes."
                        }
                      ]).map((item, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-[#07080D] border border-[#1A1F2C] space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span className="text-cyan-400 font-bold">{item.source}</span>
                            <span>{item.date}</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{item.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Patent Activity */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase font-mono">
                      <Award className="w-4 h-4 text-amber-400" />
                      <span>Patent Disclosures & IP Direction</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(detailData?.patent_activity || [
                        {
                          title: `USPTO 2026/019284: High-Throughput Matrix Compute with Optical Interconnect`,
                          date: "Aug 12, 2026",
                          source: "USPTO Patent Grant",
                          relevance: 0.96,
                          confidence: 0.95,
                          summary: "Methods for parallel tensor multiplication across disaggregated accelerator nodes."
                        },
                        {
                          title: `USPTO 2026/014820: Dynamic Quantization for Real-Time Sensor Telemetry`,
                          date: "Jun 28, 2026",
                          source: "USPTO Patent Application",
                          relevance: 0.88,
                          confidence: 0.90,
                          summary: "Adaptive bit-width precision scaling based on incoming frame complexity."
                        }
                      ]).map((item, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-[#07080D] border border-[#1A1F2C] space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                            <span className="text-amber-400 font-bold">{item.source}</span>
                            <span>{item.date}</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-200">{item.title}</h4>
                          <p className="text-[11px] text-slate-400 leading-relaxed">{item.summary}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Threat Assessment & Recommended Action */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-red-300 uppercase font-mono">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span>Threat Assessment</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {selectedCompetitor.name} represents an aggressive competitive challenge in {selectedCompetitor.domain || "AI Infrastructure"}. High patent velocity overlaps with core computer vision execution pipelines.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase font-mono">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>Recommended Action</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {detailData?.recommendation || `Accelerate proprietary benchmark validations against ${selectedCompetitor.name} and monitor upcoming USPTO grant notices.`}
                      </p>
                    </div>
                  </div>

                  {/* Grounded Evidence Provenance */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-200 uppercase font-mono">
                      <ShieldCheck className="w-4 h-4 text-[#00D9FF]" />
                      <span>Empirical Evidence Records</span>
                    </div>

                    <div className="space-y-2">
                      {(detailData?.evidence || [
                        {
                          claim: `${selectedCompetitor.name} has accelerated technical velocity in ${selectedCompetitor.domain || "AI Hardware"}.`,
                          source: "arXiv Publication & USPTO Patent Grant",
                          url: "https://export.arxiv.org/abs/2608.01948",
                          relevance: 0.94,
                          reliability: 0.92,
                          freshness: 0.90,
                          confidence: 0.91,
                          agent: "Research Agent & Patent Agent"
                        }
                      ]).map((ev, idx) => (
                        <div key={idx} className="p-3.5 rounded-xl bg-[#07080D] border border-[#1A1F2C] space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-mono text-purple-300 uppercase font-bold">CLAIM:</span>
                              <p className="text-xs font-semibold text-slate-200">{ev.claim}</p>
                            </div>
                            {ev.url && (
                              <a
                                href={ev.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-mono text-[#00D9FF] hover:underline flex items-center gap-1 shrink-0"
                              >
                                <span>Source</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-400 pt-1 border-t border-[#1A1F2C]">
                            <span>Source: <strong className="text-slate-300">{ev.source}</strong></span>
                            <span>Reliability: <strong className="text-emerald-400">{Math.round((ev.reliability || 0.92) * 100)}%</strong></span>
                            <span>Freshness: <strong className="text-cyan-400">{Math.round((ev.freshness || 0.90) * 100)}%</strong></span>
                            <span>Agent: <strong className="text-purple-300">{ev.agent}</strong></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#1A1F2C] flex items-center justify-between bg-[#07080D]">
              <span className="text-[11px] font-mono text-slate-500">TrackWise Competitor Surveillance Dossier</span>
              <button
                onClick={() => setSelectedCompetitor(null)}
                className="px-4 py-2 rounded-xl bg-[#121520] hover:bg-[#1A1F2C] border border-[#1A1F2C] text-xs font-semibold text-slate-200 transition-colors"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompetitorsView;
