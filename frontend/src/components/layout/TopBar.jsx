import React, { useState, useRef, useEffect } from "react";
import { useResearch } from "../../context/ResearchContext";
import { useAuth } from "../../context/AuthContext";
import {
  Plus,
  Bell,
  ChevronDown,
  User as UserIcon,
  Settings,
  LogOut,
} from "lucide-react";

import { TrackWiseLogo } from "../common/TrackWiseLogo";
import { ProfileModal } from "../common/ProfileModal";
import { SettingsModal } from "../common/SettingsModal";

export function TopBar() {
  const { setActiveView } = useResearch();
  const { user, logout } = useAuth();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="h-16 bg-[#0D0F16]/95 border-b border-[#1A1F2C] backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between gap-4 font-sans select-none">
        {/* Left: Clean TrackWise Branding / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView("dashboard")}
            className="flex items-center gap-2 shrink-0 text-left hover:opacity-90 transition-opacity"
            title="TrackWise Dashboard"
          >
            <TrackWiseLogo size="sm" showTagline={false} />
          </button>
        </div>

        {/* Right: [ + New Query ] [ 🔔 ] [ Profile ▾ ] */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0" ref={menuRef}>
          {/* New Query / New Research Button */}
          <button
            onClick={() => setActiveView("landing")}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#7C2CFF] hover:bg-[#6b21e8] text-white text-xs font-semibold shadow-nexus-glow transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Query</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsUserMenuOpen(false);
              }}
              className="p-2 rounded-xl bg-[#07080D] hover:bg-[#121520] border border-[#1A1F2C] text-slate-400 hover:text-slate-200 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00D9FF] rounded-full animate-pulse" />
            </button>

            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-[#0D0F16] border border-[#1A1F2C] rounded-2xl shadow-2xl p-3 space-y-2 z-50 animate-fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-[#1A1F2C]">
                  <span className="text-xs font-bold text-white">System Notifications</span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
                    2 New
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="p-2 rounded-lg bg-[#07080D] border border-[#1A1F2C] space-y-0.5">
                    <div className="font-semibold text-purple-300">LangGraph Checkpoint Saved</div>
                    <div className="text-[11px] text-slate-400">Step 4 synthesis verified into memory ledger.</div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#07080D] border border-[#1A1F2C] space-y-0.5">
                    <div className="font-semibold text-emerald-300">Competitor Telemetry Active</div>
                    <div className="text-[11px] text-slate-400">NVIDIA & OpenAI patent feeds synchronized.</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Dropdown */}
          {user && (
            <div className="relative">
              <button
                onClick={() => {
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setIsNotificationsOpen(false);
                }}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#07080D] hover:bg-[#121520] border border-[#1A1F2C] transition-all"
              >
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user?.name || "User"}
                    className="w-5 h-5 rounded-full border border-[#7C2CFF]/40 object-cover"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-[#7C2CFF]/20 border border-[#7C2CFF]/40 flex items-center justify-center text-xs font-mono font-bold text-[#A855F7]">
                    {user?.name ? user.name[0].toUpperCase() : "K"}
                  </div>
                )}
                <span className="text-xs font-sans text-slate-200 font-medium truncate max-w-[120px] hidden sm:inline">
                  {user.name || user.email.split("@")[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-500" />
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-[#0D0F16] border border-[#1A1F2C] rounded-2xl shadow-2xl p-1.5 space-y-1 z-50 animate-fade-in text-xs">
                  <div className="px-3 py-2 border-b border-[#1A1F2C]">
                    <div className="font-bold text-white truncate">{user.name || "Kishor Kharad"}</div>
                    <div className="text-[11px] font-mono text-slate-500 truncate">{user.email}</div>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsProfileModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#121520] transition-colors text-left"
                  >
                    <UserIcon className="w-3.5 h-3.5 text-[#00D9FF]" />
                    <span>View Profile</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsSettingsModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#121520] transition-colors text-left"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#A855F7]" />
                    <span>Settings</span>
                  </button>

                  <div className="h-px bg-[#1A1F2C] my-1" />

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

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

export default TopBar;
