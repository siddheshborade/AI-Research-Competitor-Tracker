import React, { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  ExternalLink,
  Sparkles,
  ArrowRight,
  RefreshCw,
  FileText,
  Calendar,
  CheckCircle2,
  Share2,
  Database,
  Bot,
  Zap,
} from "lucide-react";
import { useResearch } from "../context/ResearchContext";
import api from "../services/api";

export function ResearchIntelligenceView() {
  const { startAutonomousResearch, setActiveView, showToast } = useResearch();
  const [query, setQuery] = useState("latest research on AI agents");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Auto-search on mount with default query if no results yet
  useEffect(() => {
    handleSearch("latest research on AI agents");
  }, []);

  const handleSearch = async (searchQuery) => {
    const q = searchQuery !== undefined ? searchQuery : query;
    if (!q || !q.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      const data = await api.searchResearchPapers(q.trim(), 6);
      if (data && data.papers) {
        setResults(data);
        showToast(
          `Retrieved ${data.count || data.papers.length} papers from arXiv.org`,
          "verified"
        );
      } else {
        setError("No papers matched the given research query.");
      }
    } catch (err) {
      console.error("Research search error:", err);
      setError(err.message || "Failed to fetch research papers.");
      showToast("Failed to fetch research papers", "threat");
    } finally {
      setIsSearching(false);
    }
  };

  const handleDeepInvestigation = (paperTitle) => {
    const fullQuery = `Investigate recent scientific publication claims, benchmarks, and architectures for: "${paperTitle}"`;
    startAutonomousResearch(fullQuery, { scope: { research: true, patents: true, news: true, competitors: true, memory: true } });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-4 pb-16 font-sans">
      {/* Header */}
      <div className="bg-[#0D0F16] rounded-2xl p-6 sm:p-8 border border-[#1A1F2C] shadow-nexus-card space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#240047]/60 border border-purple-500/30 text-[#A855F7] text-xs font-mono font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span>RESEARCH INTELLIGENCE • LIVE ARXIV CONNECTOR</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight flex items-center gap-3">
              <span>Scientific Research & Literature</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Query real external scientific preprints, peer-reviewed literature, and algorithmic benchmarks. Results are normalized into structured intelligence records.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView("landing")}
              className="px-4 py-2 rounded-xl bg-[#121520] hover:bg-[#181C2B] text-slate-300 text-xs font-medium border border-[#1A1F2C] transition-colors flex items-center gap-2"
            >
              <Bot className="w-3.5 h-3.5 text-[#00D9FF]" />
              <span>Autonomous Agent</span>
            </button>
          </div>
        </div>

        {/* Search Bar Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="pt-2"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search publications, e.g. latest research on AI agents..."
                className="w-full bg-[#07080D] border border-[#1A1F2C] rounded-xl pl-11 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-[#7C2CFF] focus:ring-1 focus:ring-[#7C2CFF] transition-all font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#7C2CFF] hover:bg-[#6D28D9] text-white text-xs font-bold shadow-nexus-glow transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSearching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Querying arXiv...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search Literature</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Query Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
          <span className="text-[11px] font-mono text-slate-500">Quick Searches:</span>
          {[
            "latest research on AI agents",
            "diffusion models in medical imaging",
            "transformer attention KV cache optimization",
            "on-device LLM quantization benchmarks",
          ].map((pillText) => (
            <button
              key={pillText}
              type="button"
              onClick={() => {
                setQuery(pillText);
                handleSearch(pillText);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#07080D] hover:bg-[#121520] text-slate-300 hover:text-purple-300 border border-[#1A1F2C] text-[11px] font-mono transition-colors cursor-pointer"
            >
              "{pillText}"
            </button>
          ))}
        </div>
      </div>

      {/* Results Header & Metadata */}
      {results && (
        <div className="flex items-center justify-between px-1 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-[#00D9FF]" />
            <span>
              Source: <strong className="text-slate-200">{results.provenance?.source || "arXiv.org API"}</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span>
              Found: <strong className="text-emerald-400">{results.count || results.papers?.length}</strong> papers
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            Normalized Schema: <span className="text-purple-300 font-bold">NormalizedEvidence</span>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isSearching && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="p-6 rounded-2xl bg-[#0D0F16] border border-[#1A1F2C] space-y-4 animate-pulse"
            >
              <div className="h-4 bg-[#1A1F2C] rounded w-3/4" />
              <div className="h-3 bg-[#1A1F2C] rounded w-1/2" />
              <div className="space-y-2">
                <div className="h-3 bg-[#1A1F2C] rounded w-full" />
                <div className="h-3 bg-[#1A1F2C] rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && !isSearching && (
        <div className="p-6 rounded-2xl bg-red-950/30 border border-red-500/30 text-center space-y-2">
          <div className="text-xs font-bold text-red-300">Research Search Failed</div>
          <p className="text-[11px] text-red-400">{error}</p>
        </div>
      )}

      {/* Papers Grid */}
      {results && results.papers && results.papers.length > 0 && !isSearching && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {results.papers.map((paper, idx) => (
            <div
              key={paper.source_id || idx}
              className="p-6 rounded-2xl bg-[#0D0F16] border border-[#1A1F2C] hover:border-[#7C2CFF]/50 transition-all flex flex-col justify-between space-y-4 shadow-sm group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/30 font-bold flex items-center gap-1">
                    <FileText className="w-3 h-3 text-[#00D9FF]" />
                    <span>RESEARCH PAPER</span>
                  </span>

                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar className="w-3 h-3" />
                    <span>{paper.published_at ? paper.published_at.split("T")[0] : "Recent"}</span>
                  </div>
                </div>

                <h2 className="text-sm font-bold text-slate-100 group-hover:text-purple-200 transition-colors leading-snug">
                  {paper.title}
                </h2>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed font-sans">
                  {paper.snippet || paper.content_summary || "Abstract available in full publication."}
                </p>
              </div>

              <div className="pt-3 border-t border-[#1A1F2C] space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>
                    Publisher: <strong className="text-slate-300">{paper.publisher || "arXiv.org"}</strong>
                  </span>
                  <span>
                    Relevance: <strong className="text-emerald-400">{Math.round((paper.relevance || 0.95) * 100)}%</strong>
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  {paper.url && (
                    <a
                      href={paper.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-[#00D9FF] hover:underline"
                    >
                      <span>Open arXiv Paper</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  <button
                    onClick={() => handleDeepInvestigation(paper.title)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7C2CFF]/20 hover:bg-[#7C2CFF]/30 text-purple-200 border border-[#7C2CFF]/40 text-xs font-semibold transition-all cursor-pointer"
                    title="Launch autonomous multi-agent analysis on this publication"
                  >
                    <Zap className="w-3 h-3 text-[#A855F7]" />
                    <span>Agent Deep Dive</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResearchIntelligenceView;
