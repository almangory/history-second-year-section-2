import React, { useState, useEffect } from "react";
import { 
  ArrowRight, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Pause, 
  Play, 
  Square, 
  Bookmark, 
  BookmarkCheck, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles,
  Type,
  Maximize2,
  Minimize2,
  BookOpen
} from "lucide-react";
import { Unit, Lesson } from "../types";
import { SVGIllustration } from "../components/SVGIllustrations";
import { LessonCalmBackground } from "../components/LessonCalmBackground";
import { speechEngine } from "../utils/speechUtils";

interface LessonViewProps {
  unit: Unit;
  lesson: Lesson;
  onBack: () => void;
  onNextLesson?: () => void;
  onPrevLesson?: () => void;
  hasNextLesson?: boolean;
  hasPrevLesson?: boolean;
  onStartQuizForLesson: (lessonId: string) => void;
  onToggleFavorite: (lessonId: string) => void;
  isFavorite: boolean;
  onPlaySound: (type: "click" | "success" | "fail" | "levelup") => void;
}

export const LessonView: React.FC<LessonViewProps> = ({
  unit,
  lesson,
  onBack,
  onNextLesson,
  onPrevLesson,
  hasNextLesson = false,
  hasPrevLesson = false,
  onStartQuizForLesson,
  onToggleFavorite,
  isFavorite,
  onPlaySound,
}) => {
  // TTS State
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [speechRate, setSpeechRate] = useState<number>(0.95);

  // Font Size (eye-comfort) State
  const [fontSizeLevel, setFontSizeLevel] = useState<"normal" | "large" | "xlarge">("normal");

  // Subscribe to TTS changes
  useEffect(() => {
    const unsubscribe = speechEngine.subscribe((speaking, paused) => {
      setIsSpeaking(speaking);
      setIsPaused(paused);
    });

    return () => {
      speechEngine.stop();
      unsubscribe();
    };
  }, [lesson.id]);

  const handleStartSpeech = () => {
    onPlaySound("click");
    if (isSpeaking) {
      if (isPaused) {
        speechEngine.resume();
      } else {
        speechEngine.pause();
      }
    } else {
      // Gather lesson text
      const fullLessonText = `${lesson.title}. ${lesson.content.join(" ")}. النقاط الأساسية: ${lesson.keyPoints.join(". ")}`;
      speechEngine.speak(fullLessonText, speechRate, () => {
        onPlaySound("success");
      });
    }
  };

  const handleStopSpeech = () => {
    onPlaySound("click");
    speechEngine.stop();
  };

  const cycleFontSize = () => {
    onPlaySound("click");
    if (fontSizeLevel === "normal") setFontSizeLevel("large");
    else if (fontSizeLevel === "large") setFontSizeLevel("xlarge");
    else setFontSizeLevel("normal");
  };

  const getParagraphFontSize = () => {
    if (fontSizeLevel === "large") return "text-lg md:text-xl leading-relaxed";
    if (fontSizeLevel === "xlarge") return "text-xl md:text-2xl leading-loose font-medium";
    return "text-base md:text-lg leading-relaxed";
  };

  return (
    <div className="relative min-h-screen pb-24 animate-fadeIn">
      {/* Dynamic Ambient Background */}
      <LessonCalmBackground themeColor={unit.themeColor} />

      <div className="relative max-w-4xl mx-auto px-3 sm:px-6 pt-4">
        {/* Top Sticky Header */}
        <div className="sticky top-2 z-30 flex items-center justify-between gap-2 p-2.5 sm:p-3.5 mb-4 rounded-2xl bg-[#121020]/90 backdrop-blur-md border border-indigo-900/60 shadow-xl">
          <button
            onClick={() => {
              speechEngine.stop();
              onPlaySound("click");
              onBack();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition active:scale-95"
          >
            <ArrowRight className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">الوحدة</span>
          </button>

          {/* Eye-Comfort & Audio Tools */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Arabic Audio Reader Button */}
            <button
              onClick={handleStartSpeech}
              title={isSpeaking ? (isPaused ? "استئناف القراءة" : "إيقاف مؤقت") : "استمع لقراءة الدرس بالعربية"}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition shadow-sm ${
                isSpeaking 
                  ? "bg-amber-500 text-slate-950 animate-pulse" 
                  : "bg-indigo-600/80 hover:bg-indigo-600 text-white"
              }`}
            >
              {isSpeaking ? (
                isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              <span>{isSpeaking ? (isPaused ? "متابعة" : "إيقاف") : "اقرأ لي"}</span>
            </button>

            {isSpeaking && (
              <button
                onClick={handleStopSpeech}
                title="إنهاء القراءة الصوتية"
                className="p-1.5 rounded-xl bg-rose-900/40 border border-rose-700/50 text-rose-300 hover:bg-rose-900/60 transition"
              >
                <Square className="w-4 h-4 fill-current" />
              </button>
            )}

            {/* Font Size Adjuster for Children's Eyes */}
            <button
              onClick={cycleFontSize}
              title="تغيير حجم الخط لراحة العين"
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
            >
              <Type className="w-3.5 h-3.5 text-amber-400" />
              <span>{fontSizeLevel === "normal" ? "عادي" : fontSizeLevel === "large" ? "كبير" : "كبير جداً"}</span>
            </button>

            {/* Bookmark Lesson Button */}
            <button
              onClick={() => {
                onPlaySound("click");
                onToggleFavorite(lesson.id);
              }}
              title={isFavorite ? "إزالة من الدروس المفضلة" : "إضافة للمفضلة"}
              className={`p-2 rounded-xl transition ${
                isFavorite 
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/50" 
                  : "bg-slate-800 hover:bg-slate-700 text-slate-400"
              }`}
            >
              {isFavorite ? <BookmarkCheck className="w-4 h-4 fill-current" /> : <Bookmark className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Lesson Card */}
        <article className="rounded-3xl bg-[#121020]/95 border border-indigo-900/50 shadow-2xl p-4 sm:p-7 md:p-9 space-y-6">
          {/* Header & Tag */}
          <div className="space-y-2 border-b border-indigo-900/40 pb-5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30">
                {unit.title}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-100 tracking-tight leading-snug">
              {lesson.title}
            </h1>
          </div>

          {/* SVG Historical Illustration */}
          {lesson.illustration && (
            <div className="flex justify-center my-4 p-4 rounded-2xl bg-[#09080f]/70 border border-indigo-950/80 shadow-inner">
              <div className="w-full max-w-sm sm:max-w-md">
                <SVGIllustration name={lesson.illustration} />
              </div>
            </div>
          )}

          {/* Lesson Content Paragraphs */}
          <div className={`space-y-4 text-slate-200 ${getParagraphFontSize()}`}>
            {lesson.content.map((paragraph, index) => (
              <p 
                key={index}
                className="text-justify leading-relaxed tracking-normal p-2.5 rounded-xl transition hover:bg-slate-800/25"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Key Points Summary Card */}
          {lesson.keyPoints && lesson.keyPoints.length > 0 && (
            <div className="mt-8 p-4 sm:p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3 shadow-md">
              <div className="flex items-center gap-2 text-amber-300 font-black text-base sm:text-lg">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h2>أهم النقاط التي يجب تذكرها:</h2>
              </div>
              <ul className="space-y-2.5 pr-2">
                {lesson.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Call-to-Action: Test Knowledge for this Lesson */}
          <div className="mt-8 pt-6 border-t border-indigo-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={() => {
                speechEngine.stop();
                onPlaySound("levelup");
                onStartQuizForLesson(lesson.id);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold shadow-lg shadow-emerald-900/40 transition active:scale-95"
            >
              <HelpCircle className="w-5 h-5" />
              <span>اختبر فهمك لهذا الدرس الآن!</span>
            </button>

            {/* Prev / Next Lesson Navigation */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {hasPrevLesson && onPrevLesson && (
                <button
                  onClick={() => {
                    speechEngine.stop();
                    onPlaySound("click");
                    onPrevLesson();
                  }}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>
              )}
              {hasNextLesson && onNextLesson && (
                <button
                  onClick={() => {
                    speechEngine.stop();
                    onPlaySound("click");
                    onNextLesson();
                  }}
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold transition shadow-md"
                >
                  <span>التالي</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
