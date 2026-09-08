/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * مشغل الشرح المرئي والفيديو للوحدات الدراسية
 * منصة نقلة للمناهج التعليمية الإلكترونية - تاريخ وتربية وطنية الصف السادس
 */

import React, { useRef, useState, useEffect } from "react";
import { 
  Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, 
  Maximize2, BookOpen, Star, FileText, Gamepad2, Award, 
  Sparkles, Video, Info, CheckCircle2, ArrowRight
} from "lucide-react";
import { Unit } from "../types";

interface UnitVideoPlayerProps {
  unit: Unit;
  onStartQuiz: () => void;
  onGoToLessons: () => void;
  onGoToTimeline: () => void;
  onGoToFlashcards: () => void;
  onSelectLesson?: (lessonIdx: number) => void;
  onPlaySound: (type: "click" | "success" | "levelup") => void;
}

export const UnitVideoPlayer: React.FC<UnitVideoPlayerProps> = ({
  unit,
  onStartQuiz,
  onGoToLessons,
  onGoToTimeline,
  onGoToFlashcards,
  onSelectLesson,
  onPlaySound,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Sync state with HTML video element
  useEffect(() => {
    setIsPlaying(false);
    setCurrentTime(0);
    setHasError(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.playbackRate = playbackRate;
    }
  }, [unit.id]);

  const handleTogglePlay = () => {
    onPlaySound("click");
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSkip = (seconds: number) => {
    onPlaySound("click");
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(
      Math.max(videoRef.current.currentTime + seconds, 0),
      duration || 99999
    );
  };

  const handleChangeSpeed = (speed: number) => {
    onPlaySound("click");
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleToggleMute = () => {
    onPlaySound("click");
    if (!videoRef.current) return;
    const nextMuted = !isMuted;
    videoRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleFullscreen = () => {
    onPlaySound("click");
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen().catch(() => {});
    }
  };

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 text-right font-sans animate-[fadeIn_0.3s_ease-out]" dir="rtl">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="bg-amber-900/50 text-amber-200 border border-amber-400/40 text-xs px-2.5 py-0.5 rounded-full font-bold">
              الوحدة {unit.id} • شرح مرئي شامل
            </span>
            <span className="bg-white/20 text-white text-[11px] px-2 py-0.5 rounded-full font-sans font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>مقرر التاريخ المعتمد</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight flex items-center gap-2">
            <Video className="w-6 h-6 text-amber-200 shrink-0" />
            <span>{unit.videoTitle || `شرح فيديو ${unit.title}`}</span>
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/90 font-serif leading-relaxed max-w-2xl">
            {unit.description}
          </p>
        </div>

        {/* Quick Quiz Shortcut */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => {
              onPlaySound("levelup");
              onStartQuiz();
            }}
            className="bg-white hover:bg-amber-50 text-amber-900 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition shadow-sm flex items-center gap-2 cursor-pointer transform hover:scale-102 active:scale-98"
          >
            <Gamepad2 className="w-4 h-4 text-amber-700" />
            <span>اختبر معلوماتك بعد المشاهدة 🎯</span>
          </button>
        </div>
      </div>

      {/* 2. Video Player Zone & Lesson Chapters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Screen (Takes 2 Columns on Desktop) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="relative bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-900/30 group">
            {/* HTML5 Video Element */}
            <video
              ref={videoRef}
              src={unit.videoUrl}
              controls
              playsInline
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={() => {
                if (videoRef.current) {
                  setCurrentTime(videoRef.current.currentTime);
                }
              }}
              onLoadedMetadata={() => {
                if (videoRef.current) {
                  setDuration(videoRef.current.duration);
                }
              }}
              onError={() => setHasError(true)}
              className="w-full aspect-video object-contain bg-black"
            />

            {/* Error Message Fallback */}
            {hasError && (
              <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                <Info className="w-10 h-10 text-amber-400" />
                <h4 className="font-bold text-base">جارٍ تجهيز ملف الفيديو</h4>
                <p className="text-xs text-slate-400 max-w-md">
                  مسار الفيديو: {unit.videoUrl}. يرجى التأكد من تشغيل الخادم والاتصال بالشبكة المحلية.
                </p>
              </div>
            )}
          </div>

          {/* Video Control Auxiliary Bar */}
          <div className="bg-white dark:bg-[#141224] rounded-2xl border border-amber-200/90 dark:border-amber-900/40 p-3 sm:p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-slate-800 dark:text-slate-200">
            {/* Quick Skip Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleSkip(-10)}
                className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition text-xs font-bold flex items-center gap-1 cursor-pointer"
                title="رجوع 10 ثوانٍ"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="text-[10px]">10 ث</span>
              </button>

              <button
                onClick={() => handleSkip(10)}
                className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition text-xs font-bold flex items-center gap-1 cursor-pointer"
                title="تقديم 10 ثوانٍ"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span className="text-[10px]">10 ث</span>
              </button>

              {/* Time display */}
              <div className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400 px-2">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Playback Speed Controls */}
            <div className="flex items-center gap-1 bg-amber-50/70 dark:bg-amber-950/30 p-1 rounded-xl border border-amber-200/80">
              <span className="text-[10px] text-slate-600 font-bold px-1 hidden sm:inline">سرعة التشغيل:</span>
              {[0.75, 1, 1.25, 1.5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => handleChangeSpeed(speed)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                    playbackRate === speed
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-slate-700 hover:text-amber-900 hover:bg-amber-100"
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>

            {/* Fullscreen & Mute */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleMute}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer text-xs"
                title={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={handleFullscreen}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer text-xs flex items-center gap-1"
                title="شاشة كاملة"
              >
                <Maximize2 className="w-4 h-4" />
                <span className="text-[10px] font-bold hidden sm:inline">ملء الشاشة</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar: Lessons Index for this Unit */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-[#141224] rounded-2xl border border-amber-200/90 dark:border-amber-900/40 p-4 sm:p-5 shadow-sm space-y-3">
            <div className="border-b border-amber-100 pb-2.5 flex items-center justify-between">
              <h3 className="font-serif font-black text-amber-900 dark:text-amber-300 text-sm sm:text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span>فصول ودروس الوحدة المشروحة:</span>
              </h3>
              <span className="text-[11px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                {unit.lessons.length} دروس
              </span>
            </div>

            <div className="space-y-2">
              {unit.lessons.map((lesson, idx) => (
                <button
                  key={lesson.id}
                  onClick={() => {
                    onPlaySound("click");
                    if (onSelectLesson) {
                      onSelectLesson(idx);
                    }
                    onGoToLessons();
                  }}
                  className="w-full text-right p-3 rounded-xl border border-amber-200/70 hover:border-amber-400 bg-amber-50/40 hover:bg-amber-100/70 text-slate-800 transition cursor-pointer flex items-center justify-between gap-2 group shadow-2xs"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="w-6 h-6 rounded-lg bg-amber-200/80 text-amber-900 flex items-center justify-center font-bold text-xs shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-serif font-bold text-slate-900 group-hover:text-amber-900 truncate">
                      {lesson.title}
                    </span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-600 transform rotate-180 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </button>
              ))}
            </div>

            {/* Quick Navigation to other Unit sections */}
            <div className="pt-3 border-t border-amber-100/80 space-y-2">
              <span className="text-[11px] text-slate-500 font-bold block">أقسام ومصادر إضافية للوحدة:</span>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  onClick={() => {
                    onPlaySound("click");
                    onGoToTimeline();
                  }}
                  className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Star className="w-3.5 h-3.5 text-amber-600" />
                  <span>الخط الزمني</span>
                </button>

                <button
                  onClick={() => {
                    onPlaySound("click");
                    onGoToFlashcards();
                  }}
                  className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  <span>بطاقات المراجعة</span>
                </button>
              </div>
            </div>
          </div>

          {/* Pedagogical Tip Card */}
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100/60 rounded-2xl border border-amber-300 p-4 space-y-2 text-slate-800 shadow-xs">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>نصيحة المذاكرة الذكية:</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed font-sans">
              احرص على تدوين أسماء الشخصيات والتواريخ وأهم الأحداث أثناء متابعة الشرح المرئي، ثم توجّه مباشرة إلى <strong>اختبار الوحدة</strong> لترسيخ المفاهيم وتحقيق الدرجة الكاملة! 🌟
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
