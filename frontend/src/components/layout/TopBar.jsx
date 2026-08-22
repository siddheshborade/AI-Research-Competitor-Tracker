import React from "react";
import { AgentStatusBadge } from "../agent/AgentStatusBadge";
import { useResearch } from "../../context/ResearchContext";
import { useAuth } from "../../context/AuthContext";
import { Sparkles, Terminal, Play, Radio, ArrowLeft, Layers, ShieldCheck, Compass, LogOut, User as UserIcon } from "lucide-react";

export function TopBar() {
  const { activeObjective, agentStatus, setActiveView, isDemoMode, toggleMode } = useResearch();
  const { user, logout } = useAuth();

  return (
    <header className="h-16 bg-[#0D0F16]/95 border-b border-[#1A1F2C] backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Branding & Active Investigation */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={() => setActiveView("landing")}
          className="flex items-center gap-3 shrink-0 text-left hover:opacity-95 transition-opacity"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7C2CFF] to-[#240047] flex items-center justify-center text-white shadow-nexus-glow border border-purple-400/30 font-mono font-bold text-sm">
            TW
          </div>
          <div className="hidden sm:block">
            <span className="text-xs font-mono font-bold tracking-wider text-slate-100 uppercase block">
              TrackWise
            </span>
            <span className="text-[10px] font-mono text-[#A855F7] block">
              AI-powered research & competitor tracking.
            </span>
          </div>
        </button>

        <div className="w-px h-6 bg-[#1A1F2C] hidden md:block" />

        {/* Active Objective Pill */}
        <button
          onClick={() => setActiveView("workspace")}
          className="hidden lg:flex items-center gap-2.5 max-w-lg bg-[#07080D] hover:bg-[#121520] border border-[#1A1F2C] px-3.5 py-1.5 rounded-xl text-left transition-all group"
          title="Click to open investigation workspace"
        >
          <span className="w-2 h-2 rounded-full bg-[#7C2CFF] shrink-0 group-hover:scale-125 transition-transform" />
          <span className="text-xs font-sans text-slate-300 truncate max-w-sm">
            {activeObjective}
          </span>
          <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0 group-hover:text-[#A855F7]">
            [Workspace]
          </span>
        </button>
      </div>

      {/* Right: Mode Switcher, Agent Status, User Profile & Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Live / Demo Mode Toggle */}
        <button
          onClick={() => toggleMode()}
          className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold uppercase transition-all border flex items-center gap-1.5 ${
            isDemoMode
              ? "bg-[#240047]/60 text-purple-200 border-purple-500/40 hover:border-purple-400"
              : "bg-emerald-950/70 text-emerald-300 border-emerald-500/40 hover:border-emerald-400"
          }`}
          title="Toggle between Live API and Fallback Demo Mode"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isDemoMode ? "bg-[#A855F7]" : "bg-emerald-400 animate-ping"
            }`}
          />
          <span className="hidden sm:inline">
            {isDemoMode ? "DEMO MODE (OFFLINE)" : "LIVE API MODE"}
          </span>
          <span className="sm:hidden">{isDemoMode ? "DEMO" : "LIVE"}</span>
        </button>

        <AgentStatusBadge status={agentStatus} />

        {/* User Profile & Logout */}
        {user && (
          <div className="hidden md:flex items-center gap-2 pl-2 border-l border-[#1A1F2C]">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#07080D] border border-[#1A1F2C]">
              <div className="w-5 h-5 rounded-full bg-[#7C2CFF]/20 border border-[#7C2CFF]/40 flex items-center justify-center text-[#A855F7]">
                <UserIcon className="w-3 h-3" />
              </div>
              <span className="text-xs font-sans text-slate-200 font-medium truncate max-w-[120px]">
                {user.name || user.email.split("@")[0]}
              </span>
            </div>

            <button
              onClick={() => logout()}
              className="p-1.5 rounded-xl text-slate-400 hover:text-red-300 hover:bg-red-950/30 border border-transparent hover:border-red-500/30 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        <button
          onClick={() => setActiveView("landing")}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#7C2CFF] hover:bg-[#6b21e8] text-white text-xs font-semibold shadow-nexus-glow transition-all"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>New Query</span>
        </button>
      </div>
    </header>
  );
}

export default TopBar;
