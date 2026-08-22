import React from "react";
import {
  Search,
  LayoutDashboard,
  Zap,
  Network,
  AlertOctagon,
  Radio,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { useResearch } from "../../context/ResearchContext";

export function MobileNav() {
  const { activeView, setActiveView } = useResearch();

  const navItems = [
    { id: "landing", label: "Start", icon: Search },
    { id: "workspace", label: "Workspace", icon: LayoutDashboard },
    { id: "dashboard", label: "Feed", icon: Zap },
    { id: "graph", label: "Graph", icon: Network },
    { id: "contradictions", label: "Conflicts", icon: AlertOctagon },
    { id: "competitors", label: "Competitors", icon: Building2 },
    { id: "verification", label: "Trust", icon: ShieldCheck },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-obsidian-900/95 backdrop-blur-lg border-t border-obsidian-750 px-2 py-1.5 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={`flex flex-col items-center gap-1 p-1.5 rounded-lg text-[10px] font-mono transition-colors ${
              isActive
                ? "text-intel-purple-light font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default MobileNav;
