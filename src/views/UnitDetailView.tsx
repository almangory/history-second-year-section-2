import React, { useState } from "react";
import { 
  ArrowRight, 
  BookOpen, 
  HelpCircle, 
  Layers, 
  Clock, 
  Sparkles, 
  ChevronLeft, 
  CheckCircle2,
  Play
} from "lucide-react";
import { Unit, Lesson } from "../types";
import { SVGIllustration } from "../components/SVGIllustrations";

interface UnitDetailViewProps {
  unit: Unit;
  onBack: () => void;
  onSelectLesson: (lesson: Lesson) => void;
  onStartQuizForUnit: (unitId: number) => void;
  onOpenFlashcardsForUnit: (unit: Unit) => void;
  onPlaySound: (type: "click" | "success" | "fail" | "levelup") => void;
}

export const UnitDetailView: React.FC<UnitDetailViewProps> = ({
  unit,
  onBack,
  onSelectLesson,
  onStartQuizForUnit,
  onOpenFlashcardsForUnit,
  onPlaySound,
}) => {
  const [activeTab, setActiveTab] = useState<"lessons" | "timeline">("lessons");

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-fadeIn pb-24">
      {/* Top Bar Back Button */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            onPlaySound("click");
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition active:scale-95"
        >
          <ArrowRight className="w-4 h-4 text-amber-400" />
          <span>العودة للرئيسية</span>
        </button>

        <span className="text-xs font-bold text-amber-400 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30">
          الوحدة {unit.id}
        </span>
      </div>

      {/* Unit Header Card */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-950/90 via-[#121020] to-purple-950/80 border border-indigo-900/60 p-6 sm:p-8 shadow-2xl space-y-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-100">
          {unit.title}
        </h1>
        <p className="text-sm sm:text-base text-amber-300/90 font-medium">
          {unit.subtitle}
        </p>
        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          {unit.description}
        </p>

        {/* Quick Actions inside unit */}
        <div className="flex flex-wrap gap-2.5 pt-3">
          <button
            onClick={() => {
              onPlaySound("levelup");
              onStartQuizForUnit(unit.id);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
          >
            <HelpCircle className="w-4 h-4" />
            <span>اختبار شامل للوحدة {unit.id}</span>
          </button>

          {unit.flashcards && unit.flashcards.length > 0 && (
            <button
              onClick={() => {
                onPlaySound("click");
                onOpenFlashcardsForUnit(unit);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs sm:text-sm transition active:scale-95"
            >
              <Layers className="w-4 h-4" />
              <span>بطاقات الاستذكار ({unit.flashcards.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Switcher: Lessons vs Timeline */}
      <div className="flex border-b border-indigo-900/50 pb-2 gap-3">
        <button
          onClick={() => {
            onPlaySound("click");
            setActiveTab("lessons");
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition ${
            activeTab === "lessons"
              ? "bg-amber-500 text-slate-950 shadow-md"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>دروس الوحدة ({unit.lessons.length})</span>
        </button>

        {unit.timeline && unit.timeline.length > 0 && (
          <button
            onClick={() => {
              onPlaySound("click");
              setActiveTab("timeline");
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition ${
              activeTab === "timeline"
                ? "bg-amber-500 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>تسلسل أحداث الوحدة ({unit.timeline.length})</span>
          </button>
        )}
      </div>

      {/* Tab 1: Lessons List */}
      {activeTab === "lessons" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {unit.lessons.map((lesson, idx) => (
            <div
              key={lesson.id}
              onClick={() => {
                onPlaySound("click");
                onSelectLesson(lesson);
              }}
              className="group cursor-pointer rounded-2xl bg-[#121020]/95 hover:bg-[#18152c] border border-indigo-900/40 hover:border-amber-500/50 p-5 shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>الدرس {idx + 1}</span>
                  <span className="text-amber-400 group-hover:translate-x-[-4px] transition-transform">
                    قراءة الدرس ←
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-amber-300 transition">
                  {lesson.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                  {lesson.content[0] || ""}
                </p>
              </div>

              {lesson.keyPoints && lesson.keyPoints.length > 0 && (
                <div className="pt-2 border-t border-indigo-950/70 text-[11px] text-amber-200/80 font-medium">
                  {lesson.keyPoints.length} نقاط ذهبية مستخلصة
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Timeline of this Unit */}
      {activeTab === "timeline" && unit.timeline && (
        <div className="space-y-4 border-r-2 border-indigo-900/60 pr-5 mr-3">
          {unit.timeline.map((event, idx) => (
            <div key={idx} className="relative rounded-2xl bg-[#121020]/90 border border-indigo-900/50 p-4 sm:p-5 shadow-md space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-bold text-xs sm:text-sm">
                {event.year}
              </span>
              <h4 className="text-base font-bold text-slate-100">{event.title}</h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{event.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
