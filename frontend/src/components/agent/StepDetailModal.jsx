import React from "react";
import { Modal } from "../common/Modal";
import { useResearch } from "../../context/ResearchContext";
import { Terminal, Brain, Cpu, Database, RefreshCw, Layers } from "lucide-react";

export function StepDetailModal() {
  const { selectedAgentStep, setSelectedAgentStep } = useResearch();

  if (!selectedAgentStep) return null;

  return (
    <Modal
      isOpen={!!selectedAgentStep}
      onClose={() => setSelectedAgentStep(null)}
      title={`Step #${selectedAgentStep.stepNumber}: ${selectedAgentStep.title}`}
      subtitle={`Phase: ${selectedAgentStep.phase} • Timestamp: ${selectedAgentStep.timestamp}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6 text-sm">
        {/* Thought Block */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase text-purple-400 mb-2 flex items-center gap-2">
            <Brain className="w-4 h-4" />
            1. Reason (Agent Cognitive Evaluation)
          </h4>
          <div className="bg-obsidian-950 border border-purple-500/30 rounded-xl p-4 text-slate-200 leading-relaxed font-sans">
            {selectedAgentStep.thought}
          </div>
        </div>

        {/* Action Invocation Block */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase text-cyan-400 mb-2 flex items-center gap-2">
            <Database className="w-4 h-4" />
            2. Act (Tool Invocation & Execution Payload)
          </h4>
          <div className="bg-obsidian-950 border border-obsidian-750 rounded-xl p-4 font-mono text-xs overflow-x-auto text-cyan-300">
            <div className="mb-2 text-slate-400">// Invoked function:</div>
            <div className="text-sm font-bold text-cyan-200 mb-3">{selectedAgentStep.action}()</div>
            <div className="text-slate-400 mb-1">// Parameters:</div>
            <pre className="text-slate-300">
              {JSON.stringify(selectedAgentStep.actionPayload || {}, null, 2)}
            </pre>
          </div>
        </div>

        {/* Observation Block */}
        <div>
          <h4 className="text-xs font-mono font-bold uppercase text-emerald-400 mb-2 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            3. Observe (Raw System Feedback)
          </h4>
          <div className="bg-obsidian-950 border border-emerald-500/30 rounded-xl p-4 text-slate-200 font-sans">
            {selectedAgentStep.observation}
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end pt-4 border-t border-obsidian-750">
          <button
            onClick={() => setSelectedAgentStep(null)}
            className="px-4 py-2 bg-obsidian-800 hover:bg-obsidian-700 text-slate-200 text-xs font-medium rounded-lg border border-obsidian-700 transition-colors"
          >
            Dismiss Inspector
          </button>
        </div>
      </div>
    </Modal>
  );
}

export default StepDetailModal;
