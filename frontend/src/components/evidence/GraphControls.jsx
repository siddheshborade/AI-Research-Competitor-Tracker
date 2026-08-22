import React from "react";
import { ZoomIn, ZoomOut, RotateCcw, Filter, Search } from "lucide-react";

export function GraphControls({
  zoom,
  setZoom,
  onReset,
  selectedType,
  setSelectedType,
  searchTerm,
  setSearchTerm,
}) {
  const nodeTypes = [
    { label: "All Nodes", value: "ALL" },
    { label: "Competitors", value: "competitor" },
    { label: "Patents", value: "patent" },
    { label: "Research Papers", value: "research" },
    { label: "Technologies", value: "technology" },
    { label: "Intelligence", value: "insight" },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-obsidian-900/90 border-b border-obsidian-750">
      {/* Search in graph */}
      <div className="relative min-w-[240px]">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter graph nodes..."
          className="w-full bg-obsidian-950 border border-obsidian-750 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-intel-purple font-mono"
        />
      </div>

      {/* Filter by Node Type */}
      <div className="flex items-center gap-1.5 overflow-x-auto">
        <span className="text-[11px] font-mono text-slate-500 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Types:
        </span>
        {nodeTypes.map((t) => {
          const isSelected = selectedType === t.value;
          return (
            <button
              key={t.value}
              onClick={() => setSelectedType(t.value)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono whitespace-nowrap transition-all border ${
                isSelected
                  ? "bg-intel-purple/20 text-purple-200 border-intel-purple/60"
                  : "bg-obsidian-950 text-slate-400 border-obsidian-800 hover:text-slate-200"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Zoom and Reset Controls */}
      <div className="flex items-center gap-1.5 bg-obsidian-950 border border-obsidian-750 p-1 rounded-lg">
        <button
          onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
          className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-obsidian-800 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-[11px] font-mono text-slate-400 px-1">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(2.0, z + 0.15))}
          className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-obsidian-800 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-obsidian-750 mx-1" />
        <button
          onClick={onReset}
          className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-obsidian-800 rounded transition-colors"
          title="Reset View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default GraphControls;
