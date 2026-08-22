import React from "react";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";

export function FilterToolbar({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedPriority,
  setSelectedPriority,
  selectedVerification,
  setSelectedVerification,
}) {
  const categories = [
    "ALL",
    "THREAT",
    "OPPORTUNITY",
    "TREND",
    "RESEARCH GAP",
    "CONTRADICTION",
    "COMPETITOR MOVE",
  ];

  const priorities = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

  const hasFilters =
    searchTerm ||
    selectedCategory !== "ALL" ||
    selectedPriority !== "ALL" ||
    selectedVerification !== "ALL";

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("ALL");
    setSelectedPriority("ALL");
    setSelectedVerification("ALL");
  };

  return (
    <div className="glass-panel rounded-2xl p-4 border border-obsidian-700/80 space-y-3">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search intelligence by technology, competitor, patent claim, or impact..."
            className="w-full bg-obsidian-950/90 border border-obsidian-750 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-intel-purple font-sans"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Priority & Verification selectors */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Priority dropdown */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-obsidian-950 border border-obsidian-750 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-intel-purple font-mono"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical Only</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>

          {/* Verification dropdown */}
          <select
            value={selectedVerification}
            onChange={(e) => setSelectedVerification(e.target.value)}
            className="bg-obsidian-950 border border-obsidian-750 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-intel-purple font-mono"
          >
            <option value="ALL">All Verification States</option>
            <option value="NEEDS_REVIEW">⚠ Needs Human Review</option>
            <option value="VERIFIED">✓ Verified Evidence</option>
          </select>

          {hasFilters && (
            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-obsidian-800 hover:bg-obsidian-700 text-xs text-slate-300 transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none">
        <span className="text-[11px] font-mono text-slate-500 mr-1 shrink-0 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Category:
        </span>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono whitespace-nowrap transition-all border ${
                isSelected
                  ? "bg-intel-purple/20 text-purple-200 border-intel-purple/60 shadow-sm"
                  : "bg-obsidian-950 text-slate-400 border-obsidian-800 hover:border-obsidian-700 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FilterToolbar;
