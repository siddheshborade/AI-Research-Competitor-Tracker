import React from "react";
import { Drawer } from "../common/Drawer";
import { useResearch } from "../../context/ResearchContext";
import { Building2, Award, FileText, Cpu, Sparkles, AlertOctagon, Link2, ShieldCheck } from "lucide-react";

export function NodeDetailDrawer() {
  const { selectedGraphNode, setSelectedGraphNode, evidenceGraph } = useResearch();

  if (!selectedGraphNode) return null;

  const node = selectedGraphNode;

  // Find all connected edges
  const connectedEdges = (evidenceGraph.edges || []).filter(
    (e) => e.source === node.id || e.target === node.id
  );

  const getNodeIcon = (type) => {
    switch (type) {
      case "competitor":
        return <Building2 className="w-5 h-5 text-blue-400" />;
      case "patent":
        return <Award className="w-5 h-5 text-amber-400" />;
      case "research":
        return <FileText className="w-5 h-5 text-cyan-400" />;
      case "technology":
        return <Cpu className="w-5 h-5 text-purple-400" />;
      case "contradiction":
        return <AlertOctagon className="w-5 h-5 text-red-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <Drawer
      isOpen={!!selectedGraphNode}
      onClose={() => setSelectedGraphNode(null)}
      title="Graph Entity Telemetry"
      subtitle={`Node Identifier: ${node.id} • Type: ${node.group || node.type}`}
      width="max-w-xl"
    >
      <div className="space-y-6">
        {/* Node Header */}
        <div className="flex items-start gap-3 p-4 bg-obsidian-950 rounded-xl border border-obsidian-750">
          <div className="p-2.5 rounded-lg bg-obsidian-850 border border-obsidian-700">
            {getNodeIcon(node.type)}
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase font-bold text-slate-400">
              {node.group || node.type}
            </span>
            <h3 className="text-base font-bold text-slate-100">{node.label}</h3>
            {node.confidence && (
              <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Confidence: {Math.round(node.confidence * 100)}%
              </span>
            )}
          </div>
        </div>

        {/* Node Details */}
        <div className="space-y-2">
          <h4 className="text-xs font-mono font-bold uppercase text-slate-400">
            Entity Context & Description
          </h4>
          <p className="text-sm text-slate-200 leading-relaxed bg-obsidian-950 p-4 rounded-xl border border-obsidian-800">
            {node.details || "Discovered during autonomous ReAct literature and patent ingestion."}
          </p>
        </div>

        {/* Connected Relational Graph Edges */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono font-bold uppercase text-slate-400 flex items-center gap-1.5">
            <Link2 className="w-4 h-4 text-intel-purple-light" />
            Connected Relational Graph Edges ({connectedEdges.length})
          </h4>

          <div className="space-y-2">
            {connectedEdges.map((edge, idx) => {
              const isSource = edge.source === node.id;
              const otherNodeId = isSource ? edge.target : edge.source;
              const otherNode = (evidenceGraph.nodes || []).find((n) => n.id === otherNodeId);

              return (
                <div
                  key={idx}
                  className="bg-obsidian-950 border border-obsidian-800 rounded-lg p-3 flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-intel-purple-light uppercase text-[10px] font-bold px-1.5 py-0.5 rounded bg-obsidian-850 border border-intel-purple/30">
                      {edge.label}
                    </span>
                    <span className="text-slate-300 font-sans text-xs">
                      {isSource ? "→ " : "← "} {otherNode ? otherNode.label : otherNodeId}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {otherNode ? otherNode.group : "Node"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Drawer>
  );
}

export default NodeDetailDrawer;
