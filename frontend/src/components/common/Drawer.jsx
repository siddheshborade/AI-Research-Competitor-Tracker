import React, { useEffect } from "react";
import { X } from "lucide-react";

export function Drawer({ isOpen, onClose, title, subtitle, children, width = "max-w-2xl" }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-obsidian-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out panel */}
      <div
        className={`relative w-full ${width} bg-obsidian-900 border-l border-obsidian-700 shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-out`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-obsidian-750 flex items-center justify-between bg-obsidian-850">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              {title}
            </h2>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-obsidian-700 transition-colors"
            title="Close Drawer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Drawer;
