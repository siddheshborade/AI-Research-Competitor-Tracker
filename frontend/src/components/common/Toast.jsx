import React from "react";
import { CheckCircle2, AlertTriangle, AlertOctagon, Info, X } from "lucide-react";

export function Toast({ toast, onClose }) {
  if (!toast) return null;

  const { message, type = "info" } = toast;

  let borderColor = "border-intel-purple/50";
  let bgColor = "bg-obsidian-900/95";
  let icon = <Info className="w-5 h-5 text-intel-purple-light shrink-0" />;

  if (type === "verified" || type === "success") {
    borderColor = "border-emerald-500/50";
    icon = <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />;
  } else if (type === "threat" || type === "error") {
    borderColor = "border-red-500/50";
    icon = <AlertOctagon className="w-5 h-5 text-red-400 shrink-0" />;
  } else if (type === "warning") {
    borderColor = "border-amber-500/50";
    icon = <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in max-w-md">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-xl border ${borderColor} ${bgColor} text-slate-100`}
      >
        {icon}
        <div className="flex-1 text-sm font-medium pr-2">{message}</div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Toast;
