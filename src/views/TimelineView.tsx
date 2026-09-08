import React, { useState } from "react";
import { Clock, Filter, Calendar, Sparkles, BookOpen, Compass, Shield, Award } from "lucide-react";
import { UNITS } from "../data";
import { TimelineEvent } from "../types";
import { SVGIllustration } from "../components/SVGIllustrations";

interface TimelineViewProps {
  onSelectUnit?: (unitId: number) => void;
  onPlaySound: (type: "click" | "success" | "fail" | "levelup") => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ onSelectUnit, onPlaySound }) => {
  const [selectedUnitId, setSelectedUnitId] = useState<number | "all">("all");

  // Flatten and organize timeline events with their unit info
  const allEvents = UNITS.flatMap((unit) =>
    (unit.timeline || []).map((event) => ({
      ...event,
      unitId: unit.id,
      unitTitle: unit.title,
      themeColor: unit.themeColor,
    }))
  );

  const filteredEvents =
    selectedUnitId === "all"
      ? allEvents
      : allEvents.filter((ev) => ev.unitId === selectedUnitId);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-8 animate-fadeIn pb-24">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950/80 via-[#121020] to-purple-950/70 border border-indigo-900/60 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black">
            <Clock className="w-3.5 h-3.5" />
            <span>السجل التاريخي الشامل لمقرر الصف الثاني ثانوي</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-100 tracking-tight">
            الخط الزمني للأحداث التاريخية ⏳
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            استعرض الترتيب الزمني الدقيق لأهم أحداث تاريخ السودان وأوروبا الحديث والمعاصر (١٨٢٠ - ١٩٨٥م).
          </p>
        </div>
      </div>

      {/* Unit Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => {
            onPlaySound("click");
            setSelectedUnitId("all");
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition active:scale-95 ${
            selectedUnitId === "all"
              ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
              : "bg-slate-800/80 hover:bg-slate-700 text-slate-300"
          }`}
        >
          جميع الوحدات ({allEvents.length})
        </button>

        {UNITS.map((unit) => (
          <button
            key={unit.id}
            onClick={() => {
              onPlaySound("click");
              setSelectedUnitId(unit.id);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition active:scale-95 ${
              selectedUnitId === "unit.id" || selectedUnitId === unit.id
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30"
                : "bg-slate-800/80 hover:bg-slate-700 text-slate-300"
            }`}
          >
            الوحدة {unit.id}
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      <div className="relative border-r-2 border-indigo-900/60 pr-6 sm:pr-8 mr-3 sm:mr-6 space-y-8">
        {filteredEvents.map((event, idx) => (
          <div key={idx} className="relative group">
            {/* Timeline Dot Indicator */}
            <div className="absolute -right-[31px] sm:-right-[39px] top-4 w-4 h-4 rounded-full bg-amber-500 border-4 border-[#121020] shadow-md group-hover:scale-125 transition-transform" />

            {/* Event Card */}
            <div className="rounded-2xl bg-[#121020]/90 border border-indigo-900/50 p-4 sm:p-6 shadow-xl hover:border-amber-500/40 transition duration-300 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-950/80 pb-3">
                <span className="px-3 py-1 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-sm sm:text-base">
                  {event.year}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {event.unitTitle}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-slate-100">
                  {event.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {event.illustration && (
                <div className="pt-2 flex justify-start">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-950/60 border border-indigo-900/40 text-xs text-indigo-300 font-mono">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    رمز: {event.illustration}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
