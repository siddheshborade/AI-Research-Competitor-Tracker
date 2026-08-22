import React, { useState } from "react";
import {
  LayoutDashboard,
  PlusCircle,
  Activity,
  Brain,
  Zap,
  Target,
  Users,
  ShieldCheck,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import { useResearch } from "../../context/ResearchContext";
import { useAuth } from "../../context/AuthContext";
import { TrackWiseLogo } from "../common/TrackWiseLogo";
import { ProfileModal } from "../common/ProfileModal";
import { SettingsModal } from "../common/SettingsModal";

export function Sidebar() {
  const { activeView, setActiveView } = useResearch();
  const { user, logout } = useAuth();

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  return (
    <>
      <aside className="w-64 bg-[#0D0F16] border-r border-[#1A1F2C] flex flex-col shrink-0 hidden md:flex min-h-[calc(100vh-4rem)] font-sans select-none overflow-y-auto">
        {/* Navigation Section */}
        <div className="p-3.5 space-y-4">
          {/* Brand Header */}
          <div className="px-2 pt-1 pb-2 border-b border-[#1A1F2C]/60">
            <TrackWiseLogo size="md" showTagline={true} />
          </div>

          {/* Primary Navigation */}
          <div className="space-y-1">
            {/* 1. Dashboard */}
            <button
              onClick={() => setActiveView("dashboard")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeView === "dashboard"
                  ? "bg-[#7C2CFF]/15 text-purple-100 border border-[#7C2CFF]/50 shadow-sm font-semibold"
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
                  ? "bg-[#7C2CFF]/15 text-purple-100 border border-[#7C2CFF]/50 shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-[#121520]"
              }`}
            >
              <div className="flex items-center gap-3">
                <PlusCircle
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
                  ? "bg-[#7C2CFF]/15 text-purple-100 border border-[#7C2CFF]/50 shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-[#121520]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Activity
                  className={`w-4 h-4 ${
                    activeView === "workspace" ? "text-[#A855F7]" : "text-slate-400"
                  }`}
                />
                <span>Agent Activity</span>
              </div>
            </button>

            {/* 4. Memory */}
            <button
              onClick={() => setActiveView("memory")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeView === "memory"
                  ? "bg-[#7C2CFF]/15 text-purple-100 border border-[#7C2CFF]/50 shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-[#121520]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Brain
                  className={`w-4 h-4 ${
                    activeView === "memory" ? "text-[#00D9FF]" : "text-slate-400"
                  }`}
                />
                <span>Memory</span>
              </div>
            </button>

            {/* 5. Agent Framework */}
            <button
              onClick={() => setActiveView("framework")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeView === "framework"
                  ? "bg-[#7C2CFF]/15 text-purple-100 border border-[#7C2CFF]/50 shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-[#121520]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Zap
                  className={`w-4 h-4 ${
                    activeView === "framework" ? "text-[#A855F7]" : "text-slate-400"
                  }`}
                />
                <span>Agent Framework</span>
              </div>
            </button>
          </div>

          {/* Section: Intelligence */}
          <div className="space-y-1 pt-3 border-t border-[#1A1F2C]">
            <div className="px-3.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
              Intelligence
            </div>

            {/* 6. Opportunities & Threats */}
            <button
              onClick={() => setActiveView("threats")}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                activeView === "threats" || activeView === "signals"
                  ? "bg-[#7C2CFF]/15 text-purple-100 border border-[#7C2CFF]/50 shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-[#121520]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Target
                  className={`w-4 h-4 ${
                    activeView === "threats" ? "text-[#22C55E]" : "text-slate-500"
                  }`}
                />
                <span>Opportunities & Threats</span>
              </div>
            </button>

            {/* 7. Competitor Intelligence */}
            <button
              onClick={() => setActiveView("competitors")}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                activeView === "competitors"
                  ? "bg-[#7C2CFF]/15 text-purple-100 border border-[#7C2CFF]/50 shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-[#121520]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Users
                  className={`w-4 h-4 ${
                    activeView === "competitors" ? "text-[#00D9FF]" : "text-slate-500"
                  }`}
                />
                <span>Competitor Intelligence</span>
              </div>
            </button>
          </div>

          {/* Section: Evaluation */}
          <div className="space-y-1 pt-3 border-t border-[#1A1F2C]">
            <div className="px-3.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
              Evaluation
            </div>

            {/* 8. Evaluation */}
            <button
              onClick={() => setActiveView("evaluation")}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all ${
                activeView === "evaluation"
                  ? "bg-[#7C2CFF]/15 text-purple-100 border border-[#7C2CFF]/50 shadow-sm font-semibold"
                  : "text-slate-400 hover:text-slate-100 hover:bg-[#121520]"
              }`}
            >
              <div className="flex items-center gap-3">
                <ShieldCheck
                  className={`w-4 h-4 ${
                    activeView === "evaluation" ? "text-[#22C55E]" : "text-slate-500"
                  }`}
                />
                <span>Evaluation</span>
              </div>
            </button>
          </div>

          {/* Section: System */}
          <div className="space-y-1 pt-3 border-t border-[#1A1F2C]">
            <div className="px-3.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
              System
            </div>

            {/* Settings */}
            <button
              onClick={() => setIsSettingsModalOpen(true)}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-[#121520] transition-colors"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>Settings</span>
            </button>

            {/* Profile */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-[#121520] transition-colors"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>Profile</span>
            </button>

            {/* Logout */}
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Modals */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </>
  );
}

export default Sidebar;
