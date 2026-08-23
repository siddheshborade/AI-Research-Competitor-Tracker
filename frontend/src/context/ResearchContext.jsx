import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";
import { runSimulatedAgent } from "../services/agentSimulator";

const ResearchContext = createContext(null);

const getInitialView = () => {
  if (typeof window === "undefined") return "dashboard";
  const path = window.location.pathname.replace(/^\//, "").toLowerCase();
  const hash = window.location.hash.replace(/^#\/?/, "").toLowerCase();
  const target = hash || path;

  if (target.includes("research") || target === "landing") return "landing";
  if (target.includes("activity") || target.includes("workspace")) return "workspace";
  if (target.includes("memory")) return "memory";
  if (target.includes("agent-framework") || target.includes("framework")) return "framework";
  if (target.includes("observability") || target.includes("traces") || target.includes("diagnostics")) return "observability";
  if (target.includes("evaluation") || target === "eval") return "evaluation";
  if (target.includes("opportunities") || target.includes("threats") || target.includes("signals")) return "threats";
  if (target.includes("competitors")) return "competitors";
  if (target.includes("graph")) return "graph";
  if (target.includes("contradictions")) return "contradictions";
  if (target.includes("gaps")) return "gaps";
  if (target.includes("verification")) return "verification";
  return "dashboard";
};

export function ResearchProvider({ children }) {
  const [activeObjective, setActiveObjective] = useState(
    "Monitor NVIDIA's recent AI research and identify threats to our computer vision product."
  );
  const [activeView, setActiveView] = useState(getInitialView);

  const handleSetActiveView = (newView) => {
    setActiveView(newView);
    if (typeof window !== "undefined" && !window.location.hash.includes("recovery")) {
      try {
        window.history.replaceState(null, "", `#${newView}`);
      } catch (_) {}
    }
  };
  const [agentStatus, setAgentStatus] = useState("READY"); // 'READY' | 'PLANNING' | 'GATHERING' | 'REASONING' | 'SYNTHESIZING' | 'COMPLETED'
  const [agentSteps, setAgentSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const [isDemoMode, setIsDemoMode] = useState(api.isDemoMode());
  const [intelligenceBrief, setIntelligenceBrief] = useState(api.getInitialBrief());
  const [toolActivities, setToolActivities] = useState(api.getInitialToolActivities());
  const [agentActivities, setAgentActivities] = useState(api.getInitialAgentActivities());
  const [agentDetails, setAgentDetails] = useState(null);
  const [agentMemory, setAgentMemory] = useState(null);

  const [intelligenceItems, setIntelligenceItems] = useState([]);
  const [contradictions, setContradictions] = useState([]);
  const [emergingSignals, setEmergingSignals] = useState([]);
  const [researchGaps, setResearchGaps] = useState([]);
  const [evidenceGraph, setEvidenceGraph] = useState({ nodes: [], edges: [] });
  const [competitors, setCompetitors] = useState([]);

  const [selectedEvidenceItem, setSelectedEvidenceItem] = useState(null);
  const [selectedGraphNode, setSelectedGraphNode] = useState(null);
  const [selectedAgentStep, setSelectedAgentStep] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load domain intelligence data
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [items, contra, sigs, gaps, graph, comps] = await Promise.all([
          api.getIntelligenceItems(),
          api.getContradictions(),
          api.getEmergingSignals(),
          api.getResearchGaps(),
          api.getEvidenceGraph(),
          api.getCompetitors(),
        ]);

        setIntelligenceItems(items || []);
        setContradictions(contra || []);
        setEmergingSignals(sigs || []);
        setResearchGaps(gaps || []);
        setEvidenceGraph(graph || { nodes: [], edges: [] });
        setCompetitors(comps || []);
      } catch (err) {
        console.error("Failed to load intelligence data:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  const showToast = (message, type = "info") => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const toggleMode = (forceMockValue) => {
    const nextVal = forceMockValue !== undefined ? forceMockValue : !isDemoMode;
    api.setMode(nextVal);
    setIsDemoMode(nextVal);
    showToast(
      nextVal
        ? "Switched to Demo / Fallback Mode (Deterministic Scenarios)"
        : "Switched to Live API Mode (Targeting VITE_API_BASE_URL)",
      nextVal ? "purple" : "verified"
    );
  };

  // Trigger Autonomous Research Run
  const startAutonomousResearch = async (objectiveText, options = {}) => {
    setActiveObjective(objectiveText);
    setAgentStatus("PLANNING");
    setAgentSteps([]);
    setCurrentStepIndex(0);
    setActiveView("workspace");

    showToast(
      options.chaos_mode
        ? "⚡ Chaos Mode Initiated: Simulating fault injection, tool fallback, and red-team challenge..."
        : "Investigation initiated. Selecting Web Search & Research/Paper APIs...",
      options.chaos_mode ? "warning" : "purple"
    );

    try {
      if (!isDemoMode) {
        // Attempt live backend API call
        const response = await api.runAgent(objectiveText, options);
        if (response.brief) setIntelligenceBrief(response.brief);
        if (response.toolActivities) setToolActivities(response.toolActivities);
        if (response.agentActivities) {
          setAgentActivities(response.agentActivities);
          setAgentSteps(response.agentActivities);
        }
        if (response.graph) setEvidenceGraph(response.graph);
        if (response.details) setAgentDetails(response.details);
        if (response.memory) setAgentMemory(response.memory);
        setAgentStatus("COMPLETED");
        showToast("Live Investigation completed successfully.", "verified");
        return;
      }
    } catch (err) {
      showToast("Live API unreachable. Switched to fallback demo mode.", "warning");
      setIsDemoMode(true);
      api.setMode(true);
    }

    // Interactive Demo Simulation
    await runSimulatedAgent(objectiveText, (step, currentIdx) => {
      setAgentSteps((prev) => [...prev, step]);
      setCurrentStepIndex(currentIdx);

      if (step.phase === "PLANNING") setAgentStatus("PLANNING");
      else if (step.phase === "TOOL_SELECTION" || step.phase === "MULTI_SOURCE") setAgentStatus("GATHERING");
      else if (step.phase === "OBSERVE_AND_REPLAN" || step.phase === "CROSS_CHECK") setAgentStatus("REASONING");
      else if (step.phase === "SYNTHESIS") setAgentStatus("SYNTHESIZING");
    });

    setAgentStatus("COMPLETED");
    setIntelligenceBrief(api.getInitialBrief());
    setToolActivities(api.getInitialToolActivities());
    setAgentActivities(api.getInitialAgentActivities());
    showToast("Investigation complete: WHAT → WHY → SO WHAT intelligence synthesized.", "verified");
  };

  // Human Verification Gate Action
  const handleVerificationAction = async (itemId, newState, auditNote = "") => {
    const result = api.updateVerification(itemId, newState, auditNote);

    setIntelligenceItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            verificationState: newState,
            verifiedBy: newState === "VERIFIED" ? "Lead Intelligence Auditor" : undefined,
            verifiedAt: newState === "VERIFIED" ? new Date().toISOString() : undefined,
            auditNote,
          };
        }
        return item;
      })
    );

    if (newState === "VERIFIED") {
      showToast("Evidence verified and signed into trust ledger.", "verified");
    } else if (newState === "REJECTED") {
      showToast("Evidence rejected by auditor.", "threat");
    } else {
      showToast("Flagged for escalated review.", "warning");
    }

    return result;
  };

  const verificationQueueCount = intelligenceItems.filter(
    (i) => i.verificationState === "NEEDS_REVIEW"
  ).length + contradictions.filter(
    (c) => c.verificationState === "NEEDS_REVIEW"
  ).length;

  const value = {
    activeObjective,
    setActiveObjective,
    activeView,
    setActiveView: handleSetActiveView,
    agentStatus,
    setAgentStatus,
    agentSteps,
    currentStepIndex,
    isDemoMode,
    toggleMode,
    intelligenceBrief,
    toolActivities,
    agentActivities,
    agentDetails,
    agentMemory,
    intelligenceItems,
    contradictions,
    emergingSignals,
    researchGaps,
    evidenceGraph,
    competitors,
    selectedEvidenceItem,
    setSelectedEvidenceItem,
    selectedGraphNode,
    setSelectedGraphNode,
    selectedAgentStep,
    setSelectedAgentStep,
    toastMessage,
    showToast,
    isLoading,
    startAutonomousResearch,
    handleVerificationAction,
    verificationQueueCount,
  };

  return (
    <ResearchContext.Provider value={value}>
      {children}
    </ResearchContext.Provider>
  );
}

export function useResearch() {
  const context = useContext(ResearchContext);
  if (!context) {
    throw new Error("useResearch must be used within a ResearchProvider");
  }
  return context;
}
