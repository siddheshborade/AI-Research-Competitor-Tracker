import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ResearchProvider, useResearch } from "./context/ResearchContext";
import { TopBar } from "./components/layout/TopBar";
import { Sidebar } from "./components/layout/Sidebar";
import { MobileNav } from "./components/layout/MobileNav";
import { Toast } from "./components/common/Toast";

// Pages
import { LoginPage } from "./pages/LoginPage";
import { LandingEntry } from "./pages/LandingEntry";
import { ResearchWorkspace } from "./pages/ResearchWorkspace";
import { MemoryView } from "./pages/MemoryView";
import { AgentFrameworkView } from "./pages/AgentFrameworkView";
import { OpportunitiesThreatsView } from "./pages/OpportunitiesThreatsView";
import { IntelligenceDashboard } from "./pages/IntelligenceDashboard";
import { CompetitorsView } from "./pages/CompetitorsView";
import { EvidenceGraphView } from "./pages/EvidenceGraphView";
import { ContradictionView } from "./pages/ContradictionView";
import { EmergingSignalsView } from "./pages/EmergingSignalsView";
import { ResearchGapsView } from "./pages/ResearchGapsView";
import { VerificationView } from "./pages/VerificationView";

function MainContent() {
  const { activeView, toastMessage } = useResearch();

  const renderView = () => {
    switch (activeView) {
      case "landing":
        return <LandingEntry />;
      case "workspace":
        return <ResearchWorkspace />;
      case "memory":
        return <MemoryView />;
      case "framework":
        return <AgentFrameworkView />;
      case "threats":
        return <OpportunitiesThreatsView />;
      case "signals":
        return <OpportunitiesThreatsView />;
      case "competitors":
        return <CompetitorsView />;
      case "graph":
        return <EvidenceGraphView />;
      case "contradictions":
        return <ContradictionView />;
      case "gaps":
        return <ResearchGapsView />;
      case "verification":
        return <VerificationView />;
      case "dashboard":
      default:
        return <IntelligenceDashboard />;
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 relative">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#7C2CFF]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-[#00D9FF]/5 rounded-full blur-[100px]" />
      </div>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8 relative z-10 overflow-y-auto">
        {renderView()}
      </main>

      {/* Global Toast */}
      {toastMessage && (
        <Toast toast={toastMessage} onClose={() => {}} />
      )}
    </div>
  );
}

import { TrackWiseLogo } from "./components/common/TrackWiseLogo";

function AuthenticatedApp() {
  const { isAuthenticated, isLoading } = useAuth();
  const { setActiveView } = useResearch();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07080D] flex flex-col items-center justify-center space-y-4">
        <TrackWiseLogo size="lg" showTagline={true} />
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pt-3">
          <div className="w-3.5 h-3.5 border-2 border-[#7C2CFF] border-t-transparent rounded-full animate-spin" />
          <span>Verifying Intelligence Credentials...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onSuccess={() => setActiveView("landing")} />;
  }

  return (
    <div className="min-h-screen bg-[#07080D] text-slate-100 flex flex-col font-sans">
      <TopBar />
      <div className="flex-1 flex min-h-0">
        <Sidebar />
        <MainContent />
      </div>
      <MobileNav />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <ResearchProvider>
        <AuthenticatedApp />
      </ResearchProvider>
    </AuthProvider>
  );
}

export default App;
