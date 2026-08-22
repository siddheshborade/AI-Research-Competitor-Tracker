import React, { useState, useRef, useEffect, useMemo } from "react";
import { GraphControls } from "./GraphControls";
import { NodeDetailDrawer } from "./NodeDetailDrawer";
import { useResearch } from "../../context/ResearchContext";
import {
  Building2,
  Award,
  FileText,
  Cpu,
  Sparkles,
  AlertOctagon,
  HelpCircle,
} from "lucide-react";

export function EvidenceGraph() {
  const { evidenceGraph, setSelectedGraphNode } = useResearch();

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const [selectedType, setSelectedType] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredNodeId, setHoveredNodeId] = useState(null);

  const containerRef = useRef(null);

  const nodes = evidenceGraph.nodes || [];
  const edges = evidenceGraph.edges || [];

  // Filter nodes based on type and search query
  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      const matchesType =
        selectedType === "ALL" ||
        node.type === selectedType ||
        (selectedType === "insight" && (node.type === "insight" || node.type === "opportunity" || node.type === "contradiction"));

      const matchesSearch =
        !searchTerm ||
        node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (node.group && node.group.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesType && matchesSearch;
    });
  }, [nodes, selectedType, searchTerm]);

  const filteredNodeIds = useMemo(() => {
    return new Set(filteredNodes.map((n) => n.id));
  }, [filteredNodes]);

  const filteredEdges = useMemo(() => {
    return edges.filter(
      (edge) =>
        filteredNodeIds.has(edge.source) && filteredNodeIds.has(edge.target)
    );
  }, [edges, filteredNodeIds]);

  // Pan handlers
  const handleMouseDown = (e) => {
    if (e.target.closest("button") || e.target.closest(".node-element")) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedType("ALL");
    setSearchTerm("");
  };

  const getNodeColor = (type, isHovered) => {
    switch (type) {
      case "competitor":
        return {
          bg: "#1e3a8a",
          border: isHovered ? "#60a5fa" : "#3b82f6",
          text: "#93c5fd",
          glow: "rgba(59, 130, 246, 0.4)",
        };
      case "patent":
        return {
          bg: "#451a03",
          border: isHovered ? "#fcd34d" : "#f59e0b",
          text: "#fde68a",
          glow: "rgba(245, 158, 11, 0.4)",
        };
      case "research":
        return {
          bg: "#083344",
          border: isHovered ? "#67e8f9" : "#06b6d4",
          text: "#a5f3fc",
          glow: "rgba(6, 182, 212, 0.4)",
        };
      case "technology":
        return {
          bg: "#3b0764",
          border: isHovered ? "#c084fc" : "#8b5cf6",
          text: "#e9d5ff",
          glow: "rgba(139, 92, 246, 0.4)",
        };
      case "contradiction":
        return {
          bg: "#450a0a",
          border: isHovered ? "#fca5a5" : "#ef4444",
          text: "#fecaca",
          glow: "rgba(239, 68, 68, 0.4)",
        };
      case "opportunity":
      case "insight":
      default:
        return {
          bg: "#022c22",
          border: isHovered ? "#6ee7b7" : "#10b981",
          text: "#a7f3d0",
          glow: "rgba(16, 185, 129, 0.4)",
        };
    }
  };

  return (
    <div className="glass-panel rounded-2xl border border-obsidian-700/80 shadow-2xl overflow-hidden flex flex-col h-[750px] relative">
      {/* Controls Bar */}
      <GraphControls
        zoom={zoom}
        setZoom={setZoom}
        onReset={handleReset}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Legend & Instructions Bar */}
      <div className="px-4 py-2 bg-obsidian-950/90 border-b border-obsidian-800 flex items-center justify-between text-[11px] font-mono text-slate-400 flex-wrap gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Competitor
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Patent
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Research
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Technology
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Intelligence
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Contradiction
          </span>
        </div>
        <div className="text-slate-500 flex items-center gap-1">
          <HelpCircle className="w-3 h-3" />
          <span>Click any node to inspect connected evidence</span>
        </div>
      </div>

      {/* Interactive Graph Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`flex-1 relative overflow-hidden bg-obsidian-950/95 cursor-${
          isDragging ? "grabbing" : "grab"
        } select-none intel-dot-bg`}
      >
        <svg
          className="w-full h-full"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.15s ease-out",
          }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="22"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" opacity="0.7" />
            </marker>
            <marker
              id="arrowhead-active"
              markerWidth="10"
              markerHeight="7"
              refX="22"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#a855f7" />
            </marker>
          </defs>

          {/* Edges */}
          <g className="edges-layer">
            {filteredEdges.map((edge, idx) => {
              const srcNode = nodes.find((n) => n.id === edge.source);
              const tgtNode = nodes.find((n) => n.id === edge.target);

              if (!srcNode || !tgtNode) return null;

              const isConnectedToHover =
                hoveredNodeId === edge.source || hoveredNodeId === edge.target;

              const midX = (srcNode.x + tgtNode.x) / 2;
              const midY = (srcNode.y + tgtNode.y) / 2;

              return (
                <g key={idx}>
                  <line
                    x1={srcNode.x}
                    y1={srcNode.y}
                    x2={tgtNode.x}
                    y2={tgtNode.y}
                    stroke={isConnectedToHover ? "#a855f7" : "#334155"}
                    strokeWidth={isConnectedToHover ? 2.5 : 1.5}
                    strokeDasharray={edge.type === "claim" ? "4 4" : undefined}
                    markerEnd={
                      isConnectedToHover
                        ? "url(#arrowhead-active)"
                        : "url(#arrowhead)"
                    }
                    className="transition-all duration-200"
                  />
                  {/* Edge Label */}
                  <text
                    x={midX}
                    y={midY - 5}
                    fill={isConnectedToHover ? "#c084fc" : "#64748b"}
                    fontSize="9"
                    fontFamily="JetBrains Mono, monospace"
                    textAnchor="middle"
                    className="pointer-events-none transition-colors"
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes-layer">
            {filteredNodes.map((node) => {
              const isHovered = hoveredNodeId === node.id;
              const colors = getNodeColor(node.type, isHovered);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedGraphNode(node);
                  }}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  className="node-element cursor-pointer group"
                >
                  {/* Outer Glow Halo on hover */}
                  {isHovered && (
                    <circle
                      r="32"
                      fill={colors.glow}
                      className="animate-pulse"
                    />
                  )}

                  {/* Node Circle */}
                  <circle
                    r="20"
                    fill={colors.bg}
                    stroke={colors.border}
                    strokeWidth={isHovered ? "3" : "2"}
                    className="transition-all duration-200 shadow-xl"
                  />

                  {/* Icon Indicator or Type initial */}
                  <text
                    x="0"
                    y="4"
                    fill={colors.text}
                    fontSize="10"
                    fontFamily="JetBrains Mono, monospace"
                    fontWeight="bold"
                    textAnchor="middle"
                    className="pointer-events-none"
                  >
                    {node.group?.slice(0, 3).toUpperCase() || "INT"}
                  </text>

                  {/* Node Label pill */}
                  <g transform="translate(0, 30)">
                    <rect
                      x="-70"
                      y="-10"
                      width="140"
                      height="20"
                      rx="4"
                      fill="#0b0d14"
                      stroke={isHovered ? colors.border : "#1e2436"}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="4"
                      fill="#f1f5f9"
                      fontSize="10"
                      fontFamily="Inter, sans-serif"
                      fontWeight="600"
                      textAnchor="middle"
                      className="pointer-events-none"
                    >
                      {node.label.length > 20
                        ? node.label.slice(0, 18) + "..."
                        : node.label}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Node Detail Drawer */}
      <NodeDetailDrawer />
    </div>
  );
}

export default EvidenceGraph;
