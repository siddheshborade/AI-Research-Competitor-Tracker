import React from "react";
import { Award, FileText, Sparkles, Building2, Calendar, AlertOctagon } from "lucide-react";

export function CompetitorTimeline({ competitor }) {
  if (!competitor || !competitor.timeline) return null;

  const getEventIcon = (type) => {
    switch (type.toLowerCase()) {
      case "patent filing":
        return <Award className="w-4 h-4 text-amber-400" />;
      case "research paper":
        return <FileText className="w-4 h-4 text-cyan-400" />;
      case "press announcement":
        return <AlertOctagon className="w-4 h-4 text-red-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-intel-purple-light" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-obsidian-750 pb-2">
        <h4 className="text-xs font-mono font-bold uppercase text-slate-300">
          Chronological Intelligence Timeline
        </h4>
        <span className="text-[11px] font-mono text-slate-500">
          {competitor.timeline.length} Key Developments
        </span>
      </div>

      <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-obsidian-750">
        {competitor.timeline.map((ev) => (
          <div key={ev.id} className="relative group">
            {/* Dot icon */}
            <div className="absolute -left-[27px] top-1.5 w-6 h-6 rounded-full bg-obsidian-900 border border-obsidian-700 flex items-center justify-center shadow-sm">
              {getEventIcon(ev.type)}
            </div>

            {/* Event Box */}
            <div className="bg-obsidian-950/80 border border-obsidian-750 rounded-xl p-3.5 space-y-1.5 hover:border-obsidian-600 transition-all">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-[11px] font-mono uppercase font-bold text-slate-400">
                  {ev.type}
                </span>
                <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {ev.date}
                </span>
              </div>

              <h5 className="text-xs font-semibold text-slate-100">{ev.title}</h5>

              {ev.impact && (
                <p className="text-[11px] text-slate-400 font-sans leading-normal">
                  <strong className="text-slate-300">Strategic Implication:</strong>{" "}
                  {ev.impact}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompetitorTimeline;
