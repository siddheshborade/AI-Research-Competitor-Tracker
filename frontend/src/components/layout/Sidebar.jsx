import React from "react";
import {
  LayoutDashboard,
  Search,
  Bot,
  Brain,
  Zap,
  Target,
  Users,
  LogOut,
  Sparkles,
  Database,
  ShieldCheck,
} from "lucide-react";
import { useResearch } from "../../context/ResearchContext";
import { useAuth } from "../../context/AuthContext";

export function Sidebar() {
  const {
    activeView,
    setActiveView,
    intelligenceItems,
    competitors,
  } = useResearch();

  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-[#0D0F16] border-r border-[#1A1F2C] flex flex-col justify-between shrink-0 hidden md:flex min-h-[calc(100vh-4rem)] font-sans select-none">
      {/* Navigation List */}
      <div className="p-4 space-y-5">
        {/* Core Capabilities */}
        <div className="space-y-1">
          <div className="px-3.5 pt-1 text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            TrackWise
          </div>
          <div className="px-3.5 pb-2 text-[10px] font-mono text-[#A855F7] leading-tight">
            AI-powered research & competitor tracking.
          </div>

          {/* 1. Dashboard */}
          <button
            onClick={() => setActiveView("dashboard")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeView === "dashboard"
                ? "bg-[#7C2CFF]/15 text-purple-100 border border-[#7C2CFF]/50 shadow-sm"
                : "text-slate-400 hover:text-slate-100 hover:bg-[#121520]"
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard
                className={`w-4 h-4 ${
                  activeView === "dashboard" ? "text-[#A855F7]" : "text-slate-400"
                }`}
              />
              <span>Dashboard</span>
            </div>
          </button>

          {/* 2. New Research */}
          <button
            onClick={() => setActiveView("landing")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeView === "landing"
                ? "bg-[#7C2CFF]/15 text-purple-100 border border-[#7C2CFF]/50 shadow-sm"
                : "text-slate-400 hover:text-slate-100 hover:bg-[#121520]"
            }`}
          >
            <div className="flex items-center gap-3">
              <Search
                className={`w-4 h-4 ${
                  activeView === "landing" ? "text-[#00D9FF]" : "text-slate-400"
                }`}
              />
              <span>New Research</span>
            </div>
          </button>

          {/* 3. Agent Activity */}
          <button
            onClick={() => setActiveView("workspace")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeView === "workspace"
                ? "bg-[#7C2CFF]/15 text-purple-100 border border-[#7C2CFF]/50 shadow-sm"
                : "text-slate-400 hover:text-slate-100 hover:bg-[#121520]"
            }`}
          >
            <div className="flex items-center gap-3">
              <Bot
                className={`w-4 h-4 ${
                  activeView === "workspace" ? "text-[#A855F7]" : "text-slate-400"
                }`}
              />
              <span>Agent Activity</span>
            </div>
          </button>

          {/* 3a. Sub-item: Memory */}
          <div className="pl-6 pt-0.5 space-y-1">
            <button
              onClick={() => setActiveView("memory")}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                activeView === "memory"
                  ? "bg-[#7C2CFF]/15 text-purple-100 border border-[#7C2CFF]/50 shadow-sm"
                  : "text-slate-400 hover:text-slate-100 hover:bg-[#121520]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Brain
                  className={`w-3.5 h-3.5 ${
                    activeView === "memory" ? "text-[#00D9FF]" : "text-slate-500"
                  }`}
                />
                <span>Memory</span>
              </div>
            </button>

            {/* 3b. Sub-item: Agent Framework */}
            <button
              onClick={() => setActiveView("framework")}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                activeView === "framework"
                  ? "bg-[#7C2CFF]/15 text-purple-100 border border-[#7C2CFF]/50 shadow-sm"
                  : "text-slate-400 hover:text-slate-100 hover:bg-[#121520]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Zap
                  className={`w-3.5 h-3.5 ${
                    activeView === "framework" ? "text-[#A855F7]" : "text-slate-500"
                  }`}
                />
                <span>Agent Framework</span>
              </div>
            </button>
          </div>
        </div>

        {/* Section: Intelligence */}
        <div className="space-y-1 pt-2 border-t border-[#1A1F2C]">
          <div className="px-3.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Brain className="w-3 h-3 text-[#A855F7]" />
            <span>Intelligence</span>
          </div>

          {/* 4. Opportunities & Threats */}
          <button
            onClick={() => setActiveView("threats")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeView === "threats" || activeView === "signals"
                ? "bg-[#7C2CFF]/15 text-purple-100 border border-[#7C2CFF]/50 shadow-sm"
                : "text-slate-400 hover:text-slate-100 hover:bg-[#121520]"
            }`}
          >
            <div className="flex items-center gap-3">
              <Target
                className={`w-4 h-4 ${
                  activeView === "threats" || activeView === "signals"
                    ? "text-[#F59E0B]"
                    : "text-slate-400"
                }`}
              />
              <span>Opportunities & Threats</span>
            </div>
            {intelligenceItems.length > 0 && (
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40">
                {intelligenceItems.length}
              </span>
            )}
          </button>

          {/* 5. Competitor Intelligence */}
          <button
            onClick={() => setActiveView("competitors")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
              activeView === "competitors"
                ? "bg-[#7C2CFF]/15 text-purple-100 border border-[#7C2CFF]/50 shadow-sm"
                : "text-slate-400 hover:text-slate-100 hover:bg-[#121520]"
            }`}
          >
            <div className="flex items-center gap-3">
              <Users
                className={`w-4 h-4 ${
                  activeView === "competitors" ? "text-[#00D9FF]" : "text-slate-400"
                }`}
              />
              <span>Competitor Intelligence</span>
            </div>
            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-[#181C2B] text-slate-300 border border-slate-700">
              {competitors.length || 3}
            </span>
          </button>
        </div>
      </div>

      {/* User Profile Card & Logout Footer */}
      <div className="p-4 border-t border-[#1A1F2C] space-y-3">
        <div className="bg-[#07080D] p-3 rounded-xl border border-[#1A1F2C] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-[#240047] border border-purple-500/40 flex items-center justify-center text-xs font-mono font-bold text-purple-200 shrink-0">
              {user?.name ? user.name[0].toUpperCase() : "A"}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-slate-200 truncate">
                {user?.name || "Analyst User"}
              </div>
              <div className="text-[10px] font-mono text-slate-500 truncate">
                {user?.email || "analyst@trackwise.ai"}
              </div>
            </div>
          </div>

          <button
            onClick={logout}
            title="Logout of TrackWise"
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-all shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        <div className="text-[10px] font-mono text-slate-500 text-center">
          TrackWise // AI Research Tracker
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
