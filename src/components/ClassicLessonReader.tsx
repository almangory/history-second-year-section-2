/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Lesson, Unit } from "../types";
import {
  Heart,
  Volume1,
  Play,
  Pause,
  CheckCircle,
  Sparkles,
  Gamepad2,
  ChevronLeft,
  ChevronRight,
  Book,
  Settings,
  Trash2,
} from "lucide-react";

export interface ClassicLessonReaderProps {
  lesson: Lesson;
  unit: Unit;
  currentLessonIdx: number;
  totalLessons: number;
  readerFontSize: "sm" | "md" | "lg" | "xl";
  setReaderFontSize: React.Dispatch<React.SetStateAction<"sm" | "md" | "lg" | "xl">>;
  onPrevLesson: () => void;
  onNextLesson: () => void;
  onOpenQuiz: () => void;
  onSwitchToBook: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  renderLessonMedia: (lessonId: string, defaultIllustration: string, lessonImage?: string, lessonTitle?: string) => React.ReactNode;
  handleStartEditingMedia: (lessonId: string) => void;
  handleResetCustomMedia: (lessonId: string) => void;
  hasCustomMedia: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  currentSpeechParagraphIndex: number | null;
  onStartSpeakingAll: (paragraphs: string[]) => void;
  onSpeakParagraph: (idx: number, paragraphs: string[]) => void;
  onResumeSpeaking: () => void;
  onPauseSpeaking: () => void;
  onStopSpeaking: () => void;
}

const fontSizeMap: Record<"sm" | "md" | "lg" | "xl", { text: string; heading: string; keyPoint: string }> = {
  sm: {
    text: "text-sm sm:text-base leading-relaxed",
    heading: "text-xl sm:text-2xl",
    keyPoint: "text-xs sm:text-sm"
  },
  md: {
    text: "text-base sm:text-lg leading-loose",
    heading: "text-2xl sm:text-3xl md:text-4xl",
    keyPoint: "text-sm sm:text-base"
  },
  lg: {
    text: "text-lg sm:text-xl leading-loose",
    heading: "text-3xl sm:text-4xl md:text-5xl",
    keyPoint: "text-base sm:text-lg"
  },
  xl: {
    text: "text-xl sm:text-2xl leading-loose",
    heading: "text-4xl sm:text-5xl md:text-6xl",
    keyPoint: "text-lg sm:text-xl"
  }
};

export const ClassicLessonReader: React.FC<ClassicLessonReaderProps> = ({
  lesson,
  unit,
  currentLessonIdx,
  totalLessons,
  readerFontSize,
  setReaderFontSize,
  onPrevLesson,
  onNextLesson,
  onOpenQuiz,
  onSwitchToBook,
  isFavorite,
  onToggleFavorite,
  isFullscreen = false,
  renderLessonMedia,
  handleStartEditingMedia,
  handleResetCustomMedia,
  hasCustomMedia,
  isSpeaking,
  isPaused,
  currentSpeechParagraphIndex,
  onStartSpeakingAll,
  onSpeakParagraph,
  onResumeSpeaking,
  onPauseSpeaking,
  onStopSpeaking,
}) => {
  const currentStyles = fontSizeMap[readerFontSize];

  return (
    <article
      className={`w-full max-w-4xl mx-auto transition-all duration-300 font-sans text-right ${
        isFullscreen
          ? "space-y-6 sm:space-y-8"
          : "bg-white/95 dark:bg-[#151224] rounded-2xl sm:rounded-3xl border-2 border-amber-200/80 dark:border-indigo-950/80 shadow-md p-4 sm:p-7 md:p-10 space-y-6 sm:space-y-8"
      }`}
    >
      {/* 1. Header Banner & Meta */}
      <header className="space-y-4 border-b border-amber-200/80 dark:border-indigo-950/80 pb-5 sm:pb-6">
        <div className="flex items-center justify-between flex-wrap gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 text-xs px-3 py-1 rounded-full font-bold border border-amber-300/70 dark:border-amber-800/60 shadow-2xs">
              الوحدة ${unit.id} • ${unit.title}
            </span>
            <span className="text-xs text-amber-800/80 dark:text-amber-400 font-bold bg-amber-50 dark:bg-[#1a172e] px-2.5 py-0.5 rounded-lg border border-amber-200/60 dark:border-indigo-950">
              الدرس ${currentLessonIdx + 1} من ${totalLessons}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleFavorite}
              className={`px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-bold cursor-pointer shadow-2xs ${
                isFavorite
                  ? "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/40 dark:border-red-900/60"
                  : "bg-white dark:bg-[#1e1a38] text-slate-700 dark:text-slate-300 border-amber-200 dark:border-indigo-950 hover:border-amber-400"
              }`}
              title="إضافة للمفضلة"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              <span>{isFavorite ? "في المفضلة ❤️" : "حفظ في المفضلة"}</span>
            </button>
          </div>
        </div>

        <h1 className={`font-bold font-serif text-slate-900 dark:text-amber-200 leading-tight ${currentStyles.heading}`}>
          {lesson.title}
        </h1>
      </header>

      {/* 2. Historical Visual Media */}
      <section className="space-y-2.5">
        <div className="w-full rounded-2xl overflow-hidden shadow-md border-2 border-amber-200/90 dark:border-indigo-950">
          {renderLessonMedia(lesson.id, lesson.illustration, lesson.image, lesson.title)}
        </div>
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 px-1 pt-0.5">
          <button
            onClick={() => handleStartEditingMedia(lesson.id)}
            className="text-[11px] text-amber-900 dark:text-amber-300 font-bold hover:text-amber-700 transition flex items-center gap-1.5 bg-amber-50 dark:bg-[#1a172e] px-2.5 py-1.5 rounded-lg border border-amber-200 dark:border-indigo-950 cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
            <span>{hasCustomMedia ? "تعديل رابط الصورة المخصصة 🎨" : "تخصيص وسائط تفاعلية لهذا الدرس 🔗"}</span>
          </button>
          {hasCustomMedia && (
            <button
              onClick={() => handleResetCustomMedia(lesson.id)}
              className="text-[11px] text-red-600 hover:text-red-700 font-bold flex items-center gap-1 cursor-pointer"
              title="استعادة الصورة الأصلية"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>استعادة الأصلية</span>
            </button>
          )}
        </div>
      </section>

      {/* 3. Al-Hakawati Audio Storyteller Bar */}
      <section className="bg-[#FAF6EE] dark:bg-[#1c1833] border border-amber-200 dark:border-indigo-950 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 border-2 border-amber-300 flex items-center justify-center text-lg shrink-0 shadow-sm ${isSpeaking && !isPaused ? "animate-bounce" : ""}`}>
            👳‍♂️
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
              <span>الحكواتي السوداني • القارئ الصوتي</span>
              <span className="text-[10px] bg-amber-200/80 dark:bg-amber-900/60 px-2 py-0.5 rounded-full text-amber-900 dark:text-amber-300 font-sans font-normal">شرح صوتي</span>
            </h4>
            <p className="text-xs text-amber-900/70 dark:text-amber-300/70">
              استمع لقراءة متقنة للدرس باللغة العربية الفصحى مع نطق توضيحي
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {!isSpeaking ? (
            <button
              onClick={() => onStartSpeakingAll(lesson.content)}
              className="bg-amber-800 hover:bg-amber-900 active:bg-amber-950 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-sm w-full sm:w-auto justify-center"
            >
              <Volume1 className="w-4 h-4" />
              <span>اقرأ لي الدرس كاملاً 🎙️</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {isPaused ? (
                <button
                  onClick={onResumeSpeaking}
                  className="bg-green-700 hover:bg-green-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>استئناف</span>
                </button>
              ) : (
                <button
                  onClick={onPauseSpeaking}
                  className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer shadow-2xs"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>إيقاف مؤقت</span>
                </button>
              )}
              <button
                onClick={onStopSpeaking}
                className="bg-red-700 hover:bg-red-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer shadow-2xs"
              >
                <span>إنهاء</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 4. Formatted Reading Paragraphs */}
      <section className="space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between text-xs text-amber-900/80 dark:text-amber-400 font-bold border-b border-amber-200/50 pb-1.5">
          <span>نص المنهج الدراسي المعتمد:</span>
          <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">انقر على أي فقرة للاستماع إليها 👆</span>
        </div>

        {lesson.content.map((paragraph, pIdx) => {
          const isReadingThis = currentSpeechParagraphIndex === pIdx;
          return (
            <div
              key={pIdx}
              onClick={() => onSpeakParagraph(pIdx, lesson.content)}
              className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer group ${
                isReadingThis
                  ? "bg-amber-100/90 dark:bg-amber-950/50 border-amber-600 dark:border-amber-500 shadow-md ring-2 ring-amber-500/25"
                  : "bg-[#fdfcf9] dark:bg-[#19162c] hover:bg-amber-50/60 dark:hover:bg-[#201c38] border-amber-200/70 dark:border-indigo-950/80 shadow-2xs"
              }`}
              title="انقر للاستماع لهذا المقطع بصوت الحكواتي"
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-[#241f3e] text-amber-900 dark:text-amber-300 flex items-center justify-center text-xs font-bold shrink-0 mt-1 select-none border border-amber-200 dark:border-indigo-900">
                  {pIdx + 1}
                </div>
                <p className={`flex-1 font-serif text-slate-800 dark:text-slate-100 text-right ${currentStyles.text}`}>
                  {paragraph}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* 5. Golden Summary Capsule */}
      <section className="bg-gradient-to-br from-amber-50 via-[#FAF6EE] to-amber-100/50 dark:from-[#1e1935] dark:via-[#19152b] dark:to-[#131024] border-2 border-amber-300 dark:border-amber-700/60 rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-amber-300/60 dark:border-amber-800/60 pb-3 justify-end">
          <h3 className="text-base sm:text-lg font-bold font-serif text-amber-950 dark:text-amber-200">
            أهم ملامح وخلاصات الدرس للحفظ السريع 🏆
          </h3>
          <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>

        <div className="space-y-3 pt-1">
          {lesson.keyPoints.map((point, kIdx) => (
            <div
              key={kIdx}
              className="flex items-start gap-3 bg-white/90 dark:bg-[#120f20] p-3 sm:p-3.5 rounded-xl border border-amber-200/70 dark:border-indigo-950/60 shadow-2xs"
            >
              <CheckCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <p className={`font-serif text-slate-800 dark:text-slate-200 font-bold ${currentStyles.keyPoint}`}>
                {point}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Navigation & Actions Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pt-5 border-t border-amber-200 dark:border-indigo-950 select-none">
        <button
          disabled={currentLessonIdx === 0}
          onClick={onPrevLesson}
          className="w-full sm:w-auto bg-white hover:bg-amber-100 dark:bg-[#1e1a38] dark:hover:bg-[#28224d] disabled:opacity-30 disabled:pointer-events-none text-amber-950 dark:text-amber-200 px-5 py-2.5 rounded-xl border border-amber-300/80 dark:border-indigo-900 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
        >
          <ChevronRight className="w-4 h-4 transform rotate-180" />
          <span>الدرس السابق</span>
        </button>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-center flex-wrap">
          <button
            onClick={onOpenQuiz}
            className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white px-5 py-2.5 rounded-xl font-serif font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Gamepad2 className="w-4 h-4" />
            <span>اختبر معلوماتك في هذا الدرس 🎯</span>
          </button>

          <button
            onClick={onSwitchToBook}
            className="w-full sm:w-auto bg-amber-100 hover:bg-amber-200 dark:bg-[#1f1a36] text-amber-900 dark:text-amber-200 px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer border border-amber-300/60 dark:border-indigo-900/60"
            title="تصفح الدرس عبر كتاب ثلاثي الأبعاد مع تقليب الصفحات"
          >
            <Book className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>عرض الكتاب 3D 📖</span>
          </button>
        </div>

        <button
          disabled={currentLessonIdx >= totalLessons - 1}
          onClick={onNextLesson}
          className="w-full sm:w-auto bg-amber-800 hover:bg-amber-900 active:bg-amber-950 disabled:opacity-30 disabled:pointer-events-none text-white px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <span>الدرس التالي</span>
          <ChevronLeft className="w-4 h-4 transform rotate-180" />
        </button>
      </footer>
    </article>
  );
};
