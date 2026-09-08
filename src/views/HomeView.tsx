import React from "react";
import { 
  BookOpen, 
  Sparkles, 
  Trophy, 
  HelpCircle, 
  Compass, 
  FileText, 
  Bot, 
  Clock, 
  Star, 
  ChevronLeft, 
  BookmarkCheck,
  CheckCircle2,
  TrendingUp,
  Award
} from "lucide-react";
import { Unit, Lesson } from "../types";

interface HomeViewProps {
  units: Unit[];
  score: number;
  unlockedBadgesCount: number;
  totalBadgesCount: number;
  favoriteLessons: string[];
  onSelectUnit: (unit: Unit) => void;
  onSelectLesson: (unit: Unit, lesson: Lesson) => void;
  onOpenQuickQuiz: () => void;
  onOpenMap: () => void;
  onOpenChat: () => void;
  onOpenWorksheets: () => void;
  onOpenTimeline: () => void;
  onPlaySound: (type: "click" | "success" | "fail" | "levelup") => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  units,
  score,
  unlockedBadgesCount,
  totalBadgesCount,
  favoriteLessons,
  onSelectUnit,
  onSelectLesson,
  onOpenQuickQuiz,
  onOpenMap,
  onOpenChat,
  onOpenWorksheets,
  onOpenTimeline,
  onPlaySound,
}) => {
  // Compute total lessons
  const totalLessonsCount = units.reduce((acc, u) => acc + u.lessons.length, 0);

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-8 animate-fadeIn pb-24">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-amber-700 to-indigo-950 p-6 sm:p-10 shadow-2xl text-white">
        <div className="absolute top-0 left-0 -mt-10 -ml-10 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/20 backdrop-blur-sm border border-white/20 text-amber-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>منهج التاريخ المعتمد - المرحلة الثانوية (بخت الرضا)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
              أهلاً بك في منصة تاريخ الصف الثاني ثانوي! 🇸🇩
            </h1>
            <p className="text-sm sm:text-base text-amber-100 leading-relaxed">
              رحلة تفاعلية تفصيلية لدراسة تاريخ السودان الحديث (الحكم التركي المصري، الاستقلال والثورات الوطنية) وتاريخ أوروبا الحديث والمعاصر (النهضة، الثورة الفرنسية، الثورة الصناعية، الوحدتان الإيطالية والألمانية، والحربان العالميتان).
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <button
                onClick={() => {
                  onPlaySound("levelup");
                  onOpenQuickQuiz();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 text-amber-400 font-bold text-sm transition shadow-lg active:scale-95"
              >
                <HelpCircle className="w-4 h-4" />
                <span>تحدي الاختبارات</span>
              </button>

              <button
                onClick={() => {
                  onPlaySound("click");
                  onOpenTimeline();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm backdrop-blur-sm transition active:scale-95"
              >
                <Clock className="w-4 h-4" />
                <span>الخط الزمني</span>
              </button>

              <button
                onClick={() => {
                  onPlaySound("click");
                  onOpenChat();
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition active:scale-95 shadow-md"
              >
                <Bot className="w-4 h-4" />
                <span>المعلم الذكي</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Badge Card */}
          <div className="w-full md:w-auto grid grid-cols-3 md:flex md:flex-col gap-2.5 bg-black/25 backdrop-blur-md p-4 rounded-2xl border border-white/15">
            <div className="text-center md:text-right">
              <span className="text-[11px] text-amber-200 block font-medium">مجموع النقاط</span>
              <span className="text-xl sm:text-2xl font-black text-amber-400">{score}</span>
            </div>
            <div className="text-center md:text-right border-r md:border-r-0 md:border-t border-white/10 pr-2.5 md:pr-0 md:pt-2">
              <span className="text-[11px] text-amber-200 block font-medium">الأوسمة المكتسبة</span>
              <span className="text-xl sm:text-2xl font-black text-yellow-300">{unlockedBadgesCount} / {totalBadgesCount}</span>
            </div>
            <div className="text-center md:text-right border-r md:border-r-0 md:border-t border-white/10 pr-2.5 md:pr-0 md:pt-2">
              <span className="text-[11px] text-amber-200 block font-medium">إجمالي الدروس</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-300">{totalLessonsCount} درس</span>
            </div>
          </div>
        </div>
      </section>

      {/* Bookmarked Lessons Section (if any) */}
      {favoriteLessons.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-200 font-bold text-base sm:text-lg">
            <BookmarkCheck className="w-5 h-5 text-amber-400" />
            <h2>الدروس المحفوظة للمراجعة ({favoriteLessons.length})</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {units.flatMap((u) => u.lessons.filter((l) => favoriteLessons.includes(l.id)).map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => {
                  onPlaySound("click");
                  onSelectLesson(u, lesson);
                }}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#121020]/90 hover:bg-[#18152c] border border-indigo-900/40 text-right transition group active:scale-95"
              >
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-amber-400">{u.title}</span>
                  <h4 className="text-sm font-bold text-slate-100 group-hover:text-amber-300 transition">
                    {lesson.title}
                  </h4>
                </div>
                <ChevronLeft className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-transform group-hover:-translate-x-1" />
              </button>
            )))}
          </div>
        </section>
      )}

      {/* Units Grid Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-100">
              الوحدات الدراسية المقررة
            </h2>
          </div>
          <span className="text-xs sm:text-sm font-semibold text-slate-400">
            5 وحدات تعليمية متكاملة
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {units.map((unit) => (
            <div
              key={unit.id}
              className="relative flex flex-col justify-between rounded-3xl bg-[#121020]/95 hover:bg-[#151226] border border-indigo-900/50 hover:border-amber-500/50 p-5 sm:p-6 shadow-xl transition-all duration-300 group"
            >
              <div className="space-y-3">
                {/* Unit Badge */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black">
                    الوحدة {unit.id}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {unit.lessons.length} دروس
                  </span>
                </div>

                {/* Title and Subtitle */}
                <h3 className="text-lg sm:text-xl font-black text-slate-100 group-hover:text-amber-300 transition">
                  {unit.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                  {unit.description}
                </p>

                {/* Lessons List Preview */}
                <div className="pt-2 space-y-1.5">
                  {unit.lessons.slice(0, 3).map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => {
                        onPlaySound("click");
                        onSelectLesson(unit, lesson);
                      }}
                      className="w-full flex items-center justify-between text-right p-2 rounded-xl bg-slate-900/60 hover:bg-indigo-950/60 text-xs font-semibold text-slate-300 hover:text-amber-300 transition"
                    >
                      <span className="truncate">{lesson.title}</span>
                      <ChevronLeft className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    </button>
                  ))}
                  {unit.lessons.length > 3 && (
                    <span className="text-[11px] text-slate-400 block pr-2">
                      + {unit.lessons.length - 3} دروس إضافية
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="mt-5 pt-4 border-t border-indigo-900/40 flex items-center justify-between">
                <button
                  onClick={() => {
                    onPlaySound("click");
                    onSelectUnit(unit);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-sm transition active:scale-95"
                >
                  <span>استكشف دروس الوحدة</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
