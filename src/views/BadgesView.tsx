import React from "react";
import { Award, Lock, CheckCircle, Sparkles, ArrowRight } from "lucide-react";

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  condition: string;
}

interface BadgesViewProps {
  badges: BadgeItem[];
  score: number;
  onBack: () => void;
  onPlaySound: (type: "click" | "success" | "fail" | "levelup") => void;
}

export const BadgesView: React.FC<BadgesViewProps> = ({
  badges,
  score,
  onBack,
  onPlaySound,
}) => {
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-fadeIn pb-24">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            onPlaySound("click");
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition active:scale-95"
        >
          <ArrowRight className="w-4 h-4 text-amber-400" />
          <span>الرئيسية</span>
        </button>

        <span className="text-xs font-bold text-amber-400 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30">
          {unlockedCount} من أصل {badges.length} أوسمة مكتسبة
        </span>
      </div>

      {/* Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-600/30 via-[#121020] to-yellow-600/20 border border-amber-500/30 p-6 sm:p-8 shadow-xl text-center space-y-3">
        <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 border border-amber-500/40">
          <Award className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-100">
          لوحة الشرف والأوسمة التاريخية 🏅
        </h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          اجمع الأوسمة وحقق الإنجازات بإتمام الدروس وحل الاختبارات واستكشاف الخرائط التاريخية.
        </p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`rounded-2xl p-5 border transition-all flex flex-col justify-between space-y-3 ${
              badge.unlocked
                ? "bg-[#18152c] border-amber-500/50 shadow-lg shadow-amber-950/20"
                : "bg-slate-900/40 border-slate-800/80 opacity-65"
            }`}
          >
            <div className="flex items-start justify-between">
              <span className="text-3xl">{badge.iconName || "🏅"}</span>
              {badge.unlocked ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-600/40">
                  <CheckCircle className="w-3 h-3" />
                  تم الفتح
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                  <Lock className="w-3 h-3" />
                  مغلق
                </span>
              )}
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-100">{badge.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{badge.description}</p>
            </div>

            <div className="pt-2 border-t border-indigo-950/70 text-[11px] text-amber-300/80">
              الشرط: {badge.condition}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
