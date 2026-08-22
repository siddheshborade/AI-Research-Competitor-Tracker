import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export function ErrorBanner({ message = "Failed to connect to data source.", onRetry }) {
  return (
    <div className="rounded-xl border border-red-500/40 bg-red-950/40 p-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-red-200">Source Retrieval Interrupted</h4>
          <p className="text-xs text-red-300/80">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 text-xs font-medium text-red-200 border border-red-500/40 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Source</span>
        </button>
      )}
    </div>
  );
}

export default ErrorBanner;
