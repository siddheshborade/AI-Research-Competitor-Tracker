import React from "react";
import { EmergingSignals } from "../components/modules/EmergingSignals";
import { EvidenceDrawer } from "../components/evidence/EvidenceDrawer";
import { Radio } from "lucide-react";

export function EmergingSignalsView() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2.5">
          <Radio className="w-6 h-6 text-intel-purple-light" />
          Weak-Signal & Emerging Trend Radar
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Surfaces low-frequency signals across isolated research laboratories and stealth patent filings before mass commercialization.
        </p>
      </div>

      <EmergingSignals />
      <EvidenceDrawer />
    </div>
  );
}

export default EmergingSignalsView;
