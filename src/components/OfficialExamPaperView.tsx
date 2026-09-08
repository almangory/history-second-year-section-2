/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * عارض الامتحانات الرسمية وأوراق العمل المعتمدة A4
 * منصة المناهج التعليمية الإلكترونية - تاريخ الصف الثاني ثانوي
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Printer, Check, X, Award, Sparkles, CheckCircle2, XCircle, 
  Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, Info, 
  Clock, FileText, CheckSquare, Eye, ShieldCheck, HelpCircle
} from "lucide-react";
import { OfficialExam, ExamQuestion } from "../types";

interface OfficialExamPaperViewProps {
  exam: OfficialExam;
  onPlaySound: (type: "click" | "success" | "fail" | "levelup") => void;
  onAddScore: (points: number) => void;
  worksheetMode: "print" | "interactive";
  onModeChange: (mode: "print" | "interactive") => void;
  removeWatermark: boolean;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
  externalZoomScale?: number;
  onRegisterActions?: (actions: { evaluate: () => void; reset: () => void; isEvaluated: boolean }) => void;
}

export const OfficialExamPaperView: React.FC<OfficialExamPaperViewProps> = ({
  exam,
  onPlaySound,
  onAddScore,
  worksheetMode,
  onModeChange,
  removeWatermark,
  onToggleFullscreen,
  isFullscreen = false,
  externalZoomScale,
  onRegisterActions
}) => {
  // Student answers mapping: composite key `questionId` or `${questionId}-subKey` -> answer value
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [scoreResult, setScoreResult] = useState<{
    earned: number;
    total: number;
    percentage: number;
  } | null>(null);

  // Scaling state for A4 preview
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [isAutoFit, setIsAutoFit] = useState<boolean>(true);
  const [screenWidth, setScreenWidth] = useState<number>(() => 
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  const containerRef = useRef<HTMLDivElement>(null);

  // Compute effective zoom scale prioritizing external scale if provided
  const effectiveZoomScale = externalZoomScale !== undefined ? externalZoomScale : zoomScale;

  // Register actions with parent component
  useEffect(() => {
    if (onRegisterActions) {
      onRegisterActions({
        evaluate: handleEvaluate,
        reset: handleReset,
        isEvaluated: isEvaluated
      });
    }
  }, [answers, isEvaluated, onRegisterActions]);

  // Reset evaluation when exam shifts
  useEffect(() => {
    setIsEvaluated(false);
    setScoreResult(null);
    setAnswers({});
  }, [exam.id]);

  // Screen resize listener for responsive fit
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setScreenWidth(w);
      if (isAutoFit) {
        if (w < 480) setZoomScale(0.70);
        else if (w < 640) setZoomScale(0.80);
        else if (w < 768) setZoomScale(0.90);
        else if (w < 1024) setZoomScale(1.0);
        else if (w >= 1440) setZoomScale(1.1);
        else setZoomScale(1.0);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isAutoFit]);

  // Text normalization helper for flexible string matching (Arabic accents, alif, taa marbuta)
  const normalize = (str: string) => {
    if (!str) return "";
    return str
      .trim()
      .toLowerCase()
      .replace(/[أإآ]/g, "ا")
      .replace(/ة/g, "ه")
      .replace(/ى/g, "ي")
      .replace(/[\u064B-\u065F]/g, "") // remove tashkeel
      .replace(/\s+/g, " ");
  };

  // Evaluation algorithm
  const handleEvaluate = () => {
    onPlaySound("levelup");
    let earnedPoints = 0;
    let totalGradedItems = 0;

    exam.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        if (q.type === "tf") {
          totalGradedItems++;
          const userAns = answers[q.id] || "";
          if (normalize(userAns) === normalize(q.correctAnswer)) {
            earnedPoints++;
          }
        } else if (q.type === "mcq") {
          totalGradedItems++;
          const userAns = answers[q.id] || "";
          if (normalize(userAns) === normalize(q.correctAnswer)) {
            earnedPoints++;
          }
        } else if (q.type === "blank") {
          totalGradedItems++;
          const userAns = answers[q.id] || "";
          if (userAns && normalize(userAns).includes(normalize(q.correctAnswer))) {
            earnedPoints++;
          }
        } else if (q.type === "match" && q.matchPairs) {
          q.matchPairs.forEach((pair, pIdx) => {
            totalGradedItems++;
            const pairKey = `${q.id}-pair-${pIdx}`;
            const userPair = answers[pairKey] || "";
            if (normalize(userPair) === normalize(pair.right)) {
              earnedPoints++;
            }
          });
        } else if (q.type === "timeline" && q.timelineEvents) {
          q.timelineEvents.forEach((ev, eIdx) => {
            totalGradedItems++;
            const evKey = `${q.id}-event-${eIdx}`;
            const userYear = answers[evKey] || "";
            if (normalize(userYear) === normalize(ev.year)) {
              earnedPoints++;
            }
          });
        } else if (q.type === "odd_one_out" && q.oddItems) {
          totalGradedItems++;
          const userOdd = answers[q.id] || "";
          if (normalize(userOdd) === normalize(q.oddItems.odd)) {
            earnedPoints++;
          }
        } else if (q.type === "map" && q.mapData) {
          q.mapData.points.forEach((pt, ptIdx) => {
            totalGradedItems++;
            const mapKey = `${q.id}-point-${ptIdx}`;
            const userChoice = answers[mapKey] || "";
            if (userChoice && normalize(userChoice).includes(normalize(pt.answer.split(" ")[0]))) {
              earnedPoints++;
            }
          });
        } else if (q.type === "short_answer" || q.type === "essay") {
          totalGradedItems++;
          const userText = answers[q.id] || "";
          if (userText && userText.trim().length >= 8) {
            earnedPoints++;
          }
        } else if (q.type === "table_comparison") {
          totalGradedItems++;
          // For table comparison, awarding marks for review
          earnedPoints++;
        }
      });
    });

    const percent = totalGradedItems > 0 ? Math.round((earnedPoints / totalGradedItems) * 100) : 100;
    const finalEarnedMarks = Math.round((percent / 100) * exam.totalMarks);

    setScoreResult({
      earned: finalEarnedMarks,
      total: exam.totalMarks,
      percentage: percent
    });
    setIsEvaluated(true);

    if (percent >= 50) {
      onAddScore(Math.round(percent / 2));
    }
  };

  const handleReset = () => {
    onPlaySound("click");
    setIsEvaluated(false);
    setAnswers({});
    setScoreResult(null);
  };

  const handlePrint = () => {
    onPlaySound("click");
    window.print();
  };

  return (
    <div ref={containerRef} className="space-y-6 text-right font-sans" dir="rtl">
      {/* 1. TOP EXAM CONTROL TOOLBAR (Hidden in Print and Fullscreen) */}
      {!isFullscreen && (
        <div className="no-print bg-white rounded-2xl border border-amber-200/90 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 select-none">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold border border-amber-300 shrink-0">
              <Award className="w-6 h-6 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full">
                  الامتحان المعتمد
                </span>
                <span className="text-slate-500 text-xs font-sans">
                  الدرجة الكلية: {exam.totalMarks} درجة • الزمن: {exam.duration}
                </span>
              </div>
              <h3 className="font-serif font-black text-slate-900 text-base sm:text-lg mt-0.5">
                {exam.title}
              </h3>
              <p className="text-xs text-amber-800 font-bold">
                {exam.subtitle}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onModeChange("print")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                worksheetMode === "print"
                  ? "bg-amber-600 text-white shadow-xs font-black"
                  : "bg-slate-100 text-slate-700 hover:bg-amber-50"
              }`}
            >
              📄 نموذج A4 الرسمي
            </button>

            <button
              onClick={() => onModeChange("interactive")}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                worksheetMode === "interactive"
                  ? "bg-amber-600 text-white shadow-xs font-black"
                  : "bg-slate-100 text-slate-700 hover:bg-amber-50"
              }`}
            >
              🧩 نمط البطاقات التفاعلية
            </button>

            <button
              onClick={handleEvaluate}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <CheckSquare className="w-4 h-4" />
              <span>{isEvaluated ? "إعادة التصحيح" : "تصحيح الامتحان ✅"}</span>
            </button>

            {isEvaluated && (
              <button
                onClick={handleReset}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs px-3 py-2 rounded-xl transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={handlePrint}
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">طباعة الامتحان</span>
              <span className="sm:hidden">طباعة</span>
            </button>

            {onToggleFullscreen && (
              <button
                onClick={onToggleFullscreen}
                className="bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300 text-xs p-2 rounded-xl transition cursor-pointer"
                title="ملء الشاشة"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 2. EVALUATION BANNER (When Graded) */}
      {isEvaluated && scoreResult && (
        <div className="no-print bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-400 rounded-2xl p-5 shadow-md space-y-3 animate-[fadeIn_0.3s_ease-out] text-slate-900">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl border ${
                scoreResult.percentage >= 80 
                  ? "bg-emerald-100 border-emerald-400 text-emerald-800" 
                  : scoreResult.percentage >= 50 
                  ? "bg-amber-100 border-amber-400 text-amber-800" 
                  : "bg-red-100 border-red-400 text-red-800"
              }`}>
                <Award className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif font-black text-amber-950 text-lg">
                    درجة الامتحان المستحقة:
                  </span>
                  <span className={`text-lg font-black px-3 py-0.5 rounded-lg ${
                    scoreResult.percentage >= 80 ? "bg-emerald-200 text-emerald-950" : "bg-amber-200 text-amber-950"
                  }`}>
                    {scoreResult.earned} من {scoreResult.total} ({scoreResult.percentage}%)
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-0.5">
                  {scoreResult.percentage >= 80 
                    ? "🌟 أداء باهر وممتاز! إجاباتك مطابقة للنموذج المعتمد لوزارة التربية والتعليم."
                    : scoreResult.percentage >= 50 
                    ? "👍 نتيجة طيبة جداً! راجع الأسئلة المحددة باللون الأحمر لتثبيت الإجابة المعتمدة."
                    : "📚 نتيجة تحتاج لمراجعة فقرات المقرر. راجع الحلول النموذجية الموضحة بالأسفل وحاول ثانية."}
                </p>
              </div>
            </div>

            {scoreResult.percentage >= 50 && (
              <div className="text-emerald-700 text-xs font-bold flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl border border-emerald-200">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>تم إضافة +{Math.round(scoreResult.percentage / 2)} نقطة خبرة!</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. A4 OFFICIAL PRINT PAPER VIEW */}
      {worksheetMode === "print" ? (
        <div 
          className="space-y-8 flex flex-col items-center transition-transform duration-200 origin-top w-full"
          style={{
            transform: effectiveZoomScale !== 1 ? `scale(${effectiveZoomScale})` : undefined,
            width: effectiveZoomScale !== 1 ? `${(100 / effectiveZoomScale).toFixed(1)}%` : "100%",
            maxWidth: "100%"
          }}
        >
          <div
            id="official-exam-print-sheet"
            className="relative bg-white text-slate-900 p-6 sm:p-10 md:p-12 border-2 border-slate-300 shadow-2xl rounded-sm w-full max-w-[210mm] min-h-[297mm] overflow-hidden flex flex-col justify-between font-serif selection:bg-slate-200"
          >
            {/* WATERMARK BACKGROUND */}
            {!removeWatermark && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-[0.04] select-none z-0">
                <div className="text-center font-black text-slate-900 rotate-[-35deg] text-3xl sm:text-5xl tracking-widest whitespace-nowrap uppercase leading-loose select-none">
                  منصة المناهج التعليمية الإلكترونية <br />
                  تاريخ السودان وأوروبا الحديث - الصف الثاني ثانوي <br />
                  وزارة التربية والتعليم - بخت الرضا <br />
                  منصة المناهج التعليمية الإلكترونية
                </div>
              </div>
            )}

            <div className="relative z-10 space-y-6 flex-1">
              {/* =========================================================================
                  OFFICIAL HEADER WITH PLATFORM LOGO & STUDENT RIBBON
                  ========================================================================= */}
              <div className="border-b-4 border-slate-900 pb-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
                  {/* Right: Platform Logo & Authority */}
                  <div className="flex items-center gap-3">
                    <img 
                      src="/logo.png" 
                      alt="شعار منصة نقلة للمناهج التعليمية الإلكترونية" 
                      className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-sm shrink-0" 
                    />
                    <div className="space-y-0.5">
                      <div className="text-[11px] font-sans font-bold text-slate-800 leading-tight">
                        جمهورية السودان - وزارة التربية والتعليم
                      </div>
                      <div className="text-[10px] font-sans text-slate-600">
                        المركز القومي للمناهج والبحث التربوي (بخت الرضا)
                      </div>
                      <div className="text-[11px] font-sans font-black text-amber-800">
                        منصة نقلة للمناهج التعليمية الإلكترونية
                      </div>
                    </div>
                  </div>

                  {/* Center: Exam Title */}
                  <div className="text-center flex-1">
                    <div className="text-[11px] font-bold text-slate-600 font-sans">
                      بسم الله الرحمن الرحيم
                    </div>
                    <h1 className="text-base sm:text-xl font-black text-slate-950 tracking-tight mt-0.5">
                      {exam.title}
                    </h1>
                    <div className="inline-flex items-center gap-2 text-[11px] font-sans font-bold text-slate-800 bg-slate-100 px-3 py-0.5 rounded-full border border-slate-300 mt-1">
                      <span>{exam.grade}</span>
                      <span>•</span>
                      <span>{exam.subject}</span>
                    </div>
                  </div>

                  {/* Left: Official Student & Exam Credentials Box */}
                  <div className="border-2 border-slate-900 p-2.5 rounded-lg text-[10px] sm:text-[11px] font-sans text-slate-900 space-y-1 bg-slate-50 min-w-[200px] text-right">
                    <div className="flex justify-between border-b border-slate-300 pb-0.5">
                      <strong>الزمن:</strong> <span>{exam.duration}</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-300 pb-0.5">
                      <strong>الدرجة الكلية:</strong> <span>{exam.totalMarks} درجة</span>
                    </div>
                    <div>اسم التلميذ: .................................</div>
                    <div>المدرسة: .......................................</div>
                    <div>رقم الجلوس: ...................................</div>
                  </div>
                </div>
              </div>

              {/* =========================================================================
                  EXAM SECTIONS RENDERER
                  ========================================================================= */}
              <div className="space-y-7 pt-2">
                {exam.sections.map((sec, secIdx) => (
                  <div key={sec.id} className="space-y-3">
                    {/* Section Header */}
                    <div className="flex items-center justify-between border-b-2 border-slate-800 pb-1.5">
                      <h2 className="font-bold text-sm sm:text-base text-slate-950 flex items-center gap-2">
                        <span className="w-6 h-6 bg-slate-900 text-white rounded-md flex items-center justify-center text-xs font-sans font-bold shrink-0">
                          {secIdx + 1}
                        </span>
                        <span>{sec.title}</span>
                      </h2>
                      {sec.marks && (
                        <span className="text-xs font-sans font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                          ({sec.marks} درجات)
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-700 font-sans leading-relaxed">
                      {sec.instruction}
                    </p>

                    {/* Section Questions */}
                    <div className="space-y-4 pt-1">
                      {sec.questions.map((q, qIdx) => {
                        const userChoice = answers[q.id] || "";
                        const isCorrect = userChoice && normalize(userChoice) === normalize(q.correctAnswer);

                        return (
                          <div 
                            key={q.id}
                            className={`p-3.5 rounded-xl border transition-all ${
                              isEvaluated
                                ? isCorrect
                                  ? "bg-emerald-50/70 border-emerald-300"
                                  : "bg-red-50/70 border-red-300"
                                : "bg-white border-slate-200 hover:border-slate-400"
                            }`}
                          >
                            {/* Question Title */}
                            <div className="font-bold text-xs sm:text-sm text-slate-950 flex items-start gap-2 leading-relaxed">
                              <span className="bg-slate-800 text-white font-sans text-xs px-2 py-0.5 rounded shrink-0">
                                س{qIdx + 1}
                              </span>
                              <span className="flex-1">{q.text}</span>
                            </div>

                            {/* 1. TRUE / FALSE */}
                            {q.type === "tf" && (
                              <div className="mt-2.5 mr-4 sm:mr-7 flex items-center gap-3 text-xs font-sans font-bold">
                                {["صواب", "خطأ"].map((opt) => {
                                  const isSelected = userChoice === opt;
                                  const isAccredited = normalize(opt) === normalize(q.correctAnswer);

                                  return (
                                    <button
                                      type="button"
                                      key={opt}
                                      disabled={isEvaluated}
                                      onClick={() => {
                                        onPlaySound("click");
                                        setAnswers({ ...answers, [q.id]: opt });
                                      }}
                                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition cursor-pointer ${
                                        isSelected
                                          ? "bg-amber-100 border-amber-600 text-slate-950 font-black shadow-xs"
                                          : "bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100"
                                      } ${isEvaluated && isAccredited ? "!border-emerald-600 !bg-emerald-100 font-black" : ""}`}
                                    >
                                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                        isSelected ? "border-amber-600 bg-amber-600 text-white" : "border-slate-400 bg-white"
                                      }`}>
                                        {isSelected && <Check className="w-3 h-3 text-white stroke-[3]" />}
                                      </span>
                                      <span>{opt}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {/* 2. MCQ */}
                            {q.type === "mcq" && q.options && (
                              <div className="mt-2.5 mr-4 sm:mr-7 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                                {q.options.map((opt, optIdx) => {
                                  const isSelected = userChoice === opt;
                                  const isThisCorrect = normalize(opt) === normalize(q.correctAnswer);

                                  return (
                                    <button
                                      type="button"
                                      key={optIdx}
                                      disabled={isEvaluated}
                                      onClick={() => {
                                        onPlaySound("click");
                                        setAnswers({ ...answers, [q.id]: opt });
                                      }}
                                      className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-lg border text-right transition cursor-pointer ${
                                        isSelected
                                          ? "bg-amber-100 border-amber-600 font-bold text-slate-950"
                                          : "bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100"
                                      } ${isEvaluated && isThisCorrect ? "!border-emerald-600 !bg-emerald-100 font-bold" : ""}`}
                                    >
                                      <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                                        isSelected ? "border-amber-600 bg-amber-600 text-white" : "border-slate-400 bg-white"
                                      }`}>
                                        {isSelected && <span className="w-2 h-2 bg-white rounded-full"></span>}
                                      </span>
                                      <span className="text-xs">{opt}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {/* 3. FILL IN THE BLANK */}
                            {q.type === "blank" && (
                              <div className="mt-2.5 mr-4 sm:mr-7 font-sans">
                                <input
                                  type="text"
                                  disabled={isEvaluated}
                                  placeholder="اكتب الإجابة في الفراغ هنا..."
                                  value={userChoice}
                                  onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                  className="w-full bg-slate-50 border-b-2 border-slate-400 focus:border-amber-600 px-3 py-1.5 text-xs text-slate-950 outline-none rounded-t"
                                />
                              </div>
                            )}

                            {/* 4. MATCH PAIRS */}
                            {q.type === "match" && q.matchPairs && (
                              <div className="mt-2.5 mr-4 sm:mr-7 space-y-2 font-sans">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  {q.matchPairs.map((pair, pIdx) => {
                                    const pairKey = `${q.id}-pair-${pIdx}`;
                                    const selectedVal = answers[pairKey] || "";
                                    const isPairCorrect = normalize(selectedVal) === normalize(pair.right);

                                    return (
                                      <div key={pIdx} className="flex items-center gap-2 border border-slate-200 bg-slate-50 p-2 rounded-lg">
                                        <span className="font-bold text-slate-900 shrink-0 min-w-[100px]">{pair.left}</span>
                                        <span className="text-slate-400">←</span>
                                        <select
                                          value={selectedVal}
                                          disabled={isEvaluated}
                                          onChange={(e) => {
                                            onPlaySound("click");
                                            setAnswers({ ...answers, [pairKey]: e.target.value });
                                          }}
                                          className={`w-full bg-white border text-xs rounded px-2 py-1 outline-none ${
                                            isEvaluated
                                              ? isPairCorrect ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold" : "border-red-500 bg-red-50 text-red-800 font-bold"
                                              : "border-slate-300"
                                          }`}
                                        >
                                          <option value="">-- اختر الإجابة المناسبة --</option>
                                          {q.matchPairs?.map((mOpt, oIdx) => (
                                            <option key={oIdx} value={mOpt.right}>
                                              {mOpt.right}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* 5. TIMELINE EVENTS */}
                            {q.type === "timeline" && q.timelineEvents && (
                              <div className="mt-2.5 mr-4 sm:mr-7 space-y-2 font-sans">
                                <div className="space-y-2 text-xs">
                                  {q.timelineEvents.map((ev, eIdx) => {
                                    const evKey = `${q.id}-event-${eIdx}`;
                                    const selectedYear = answers[evKey] || "";
                                    const isYearCorrect = normalize(selectedYear) === normalize(ev.year);

                                    return (
                                      <div key={eIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-slate-200 bg-slate-50 p-2.5 rounded-lg">
                                        <span className="font-bold text-slate-900">{ev.event}</span>
                                        <div className="flex items-center gap-2 shrink-0">
                                          <span className="text-slate-500">السنة المقررة:</span>
                                          <select
                                            value={selectedYear}
                                            disabled={isEvaluated}
                                            onChange={(e) => {
                                              onPlaySound("click");
                                              setAnswers({ ...answers, [evKey]: e.target.value });
                                            }}
                                            className={`bg-white border text-xs rounded px-3 py-1 outline-none font-bold ${
                                              isEvaluated
                                                ? isYearCorrect ? "border-emerald-500 bg-emerald-50 text-emerald-800" : "border-red-500 bg-red-50 text-red-800"
                                                : "border-slate-300"
                                            }`}
                                          >
                                            <option value="">-- حدد العام --</option>
                                            {q.timelineEvents?.map((tOpt, tIdx) => (
                                              <option key={tIdx} value={tOpt.year}>
                                                {tOpt.year}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* 6. ODD ONE OUT */}
                            {q.type === "odd_one_out" && q.oddItems && (
                              <div className="mt-2.5 mr-4 sm:mr-7 space-y-2 font-sans">
                                <div className="flex flex-wrap items-center gap-2">
                                  {q.oddItems.words.map((w, wIdx) => {
                                    const isChosen = userChoice === w;
                                    const isTheOdd = w === q.oddItems?.odd;

                                    return (
                                      <button
                                        type="button"
                                        key={wIdx}
                                        disabled={isEvaluated}
                                        onClick={() => {
                                          onPlaySound("click");
                                          setAnswers({ ...answers, [q.id]: w });
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                                          isChosen
                                            ? "bg-amber-100 border-amber-600 text-amber-950 ring-2 ring-amber-400"
                                            : "bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100"
                                        } ${isEvaluated && isTheOdd ? "!bg-emerald-100 !border-emerald-600 !text-emerald-950" : ""}`}
                                      >
                                        {w}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* 7. TABLE COMPARISON */}
                            {q.type === "table_comparison" && q.tableComparison && (
                              <div className="mt-2.5 mr-4 sm:mr-7 overflow-x-auto font-sans">
                                <table className="w-full border-collapse border border-slate-300 text-xs">
                                  <thead>
                                    <tr className="bg-slate-100 text-slate-900">
                                      <th className="border border-slate-300 p-2 text-right">وجه المقارنة</th>
                                      <th className="border border-slate-300 p-2 text-right text-amber-900 font-bold">{q.tableComparison.colA.title}</th>
                                      <th className="border border-slate-300 p-2 text-right text-sky-900 font-bold">{q.tableComparison.colB.title}</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {q.tableComparison.criteria.map((cr, cIdx) => (
                                      <tr key={cIdx} className="hover:bg-slate-50">
                                        <td className="border border-slate-300 p-2 font-bold text-slate-800 bg-slate-50/50">{cr}</td>
                                        <td className="border border-slate-300 p-2 text-slate-900">{q.tableComparison?.colA.values[cIdx]}</td>
                                        <td className="border border-slate-300 p-2 text-slate-900">{q.tableComparison?.colB.values[cIdx]}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}

                            {/* 8. MAP QUESTION */}
                            {q.type === "map" && q.mapData && (
                              <div className="mt-2.5 mr-4 sm:mr-7 space-y-2 font-sans">
                                <p className="text-xs text-slate-700 bg-slate-100 p-2 rounded">
                                  {q.mapData.prompt}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                  {q.mapData.points.map((pt, pIdx) => {
                                    const ptKey = `${q.id}-point-${pIdx}`;
                                    const userVal = answers[ptKey] || "";

                                    return (
                                      <div key={pIdx} className="flex items-center gap-2 border border-slate-200 bg-slate-50 p-2 rounded">
                                        <span className="font-bold text-slate-900">{pt.label}:</span>
                                        <input
                                          type="text"
                                          disabled={isEvaluated}
                                          placeholder="اكتب المعلم..."
                                          value={userVal}
                                          onChange={(e) => setAnswers({ ...answers, [ptKey]: e.target.value })}
                                          className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs outline-none"
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* 9. ESSAY & SHORT ANSWER */}
                            {(q.type === "essay" || q.type === "short_answer") && (
                              <div className="mt-2.5 mr-4 sm:mr-7 font-sans">
                                <textarea
                                  disabled={isEvaluated}
                                  placeholder="اكتب إجابتك التاريخية المنهجية هنا..."
                                  value={userChoice}
                                  onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                                  className="w-full h-20 sm:h-24 bg-slate-50 border border-slate-300 focus:border-amber-600 p-2.5 text-xs text-slate-950 outline-none rounded-lg leading-relaxed"
                                />
                              </div>
                            )}

                            {/* ACCREDITED MODEL ANSWER CORRECTION BOX */}
                            {isEvaluated && (
                              <div className="mt-3 mr-4 sm:mr-7 p-3 rounded-xl border text-xs font-sans space-y-1.5 animate-[fadeIn_0.3s_ease-out] bg-emerald-50/90 border-emerald-300 text-emerald-950">
                                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  <span>الإجابة النموذجية المعتمدة للامتحان:</span>
                                </div>
                                <div className="bg-white/90 p-2.5 rounded-lg border border-slate-300 space-y-1 text-slate-900">
                                  <div className="font-bold font-serif whitespace-pre-wrap">
                                    {q.type === "odd_one_out" && q.oddItems 
                                      ? `الكلمة الشاذة: (${q.oddItems.odd}) - التعليل: ${q.oddItems.reason}`
                                      : q.type === "map" && q.mapData
                                      ? q.mapData.points.map(p => `${p.label} هو: ${p.answer}`).join(" | ")
                                      : q.correctAnswer}
                                  </div>
                                  {q.explanation && (
                                    <p className="text-[11px] text-slate-600 pt-0.5 border-t border-slate-200">
                                      💡 سند المعلومة بالمنهج: {q.explanation}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* A4 FOOTER */}
            <div className="relative z-10 border-t border-slate-300 pt-3 mt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-500 font-sans gap-2">
              <div>
                منصة المناهج التعليمية الإلكترونية • المركز القومي للمناهج والبحث التربوي (بخت الرضا)
              </div>
              <div className="font-bold">
                كراسة الامتحانات الرسمية المعتمدة • الصف الثاني ثانوي
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* =========================================================================
            B. INTERACTIVE SOLVING MODE (Comfortable Cards View)
            ========================================================================= */
        <div className="bg-white rounded-2xl border border-amber-200 p-5 md:p-6 space-y-6 shadow-sm text-slate-900">
          <div className="border-b border-amber-100 pb-3 flex items-center justify-between">
            <div>
              <span className="text-amber-800 font-serif font-extrabold text-lg md:text-xl">
                📝 نمط البطاقات التفاعلي المريح
              </span>
              <p className="text-slate-600 text-xs mt-1 font-sans">
                أجب على الأسئلة واضغط على "تصحيح الامتحان" لعرض الدرجة المستحقة ونموذج الإجابة المعتمد.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {exam.sections.map((sec, sIdx) => (
              <div key={sec.id} className="bg-amber-50/40 rounded-xl p-4 sm:p-5 border border-amber-200 space-y-4">
                <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                  <h4 className="text-slate-800 font-bold text-sm flex items-center gap-2">
                    <span className="w-5 h-5 bg-amber-200 text-amber-900 rounded flex items-center justify-center text-xs font-bold">
                      {sIdx + 1}
                    </span>
                    {sec.title}
                  </h4>
                  {sec.marks && <span className="text-xs text-slate-600">{sec.marks} درجات</span>}
                </div>

                <div className="space-y-3">
                  {sec.questions.map((q, qIdx) => {
                    const userChoice = answers[q.id] || "";
                    const isCorrect = userChoice && normalize(userChoice) === normalize(q.correctAnswer);

                    return (
                      <div key={q.id} className="bg-white p-4 rounded-xl border border-amber-200/80 space-y-3 font-sans shadow-xs">
                        <div className="flex items-start gap-2">
                          <span className="bg-amber-100 text-amber-800 font-bold text-xs px-2 py-0.5 rounded shrink-0">
                            س{qIdx + 1}
                          </span>
                          <span className="text-slate-900 font-semibold text-xs leading-relaxed">
                            {q.text}
                          </span>
                        </div>

                        {/* Options by type */}
                        {q.type === "tf" && (
                          <div className="flex items-center gap-3 pt-1">
                            {["صواب", "خطأ"].map((opt) => (
                              <button
                                key={opt}
                                disabled={isEvaluated}
                                onClick={() => {
                                  onPlaySound("click");
                                  setAnswers({ ...answers, [q.id]: opt });
                                }}
                                className={`px-4 py-2 rounded-lg border text-xs font-bold transition cursor-pointer ${
                                  userChoice === opt
                                    ? "bg-amber-100 border-amber-500 text-amber-900 font-black shadow-xs"
                                    : "bg-white border-slate-200 hover:border-amber-400 text-slate-800"
                                }`}
                              >
                                <span>{opt}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {q.type === "mcq" && q.options && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-serif">
                            {q.options.map((opt) => (
                              <button
                                key={opt}
                                disabled={isEvaluated}
                                onClick={() => {
                                  onPlaySound("click");
                                  setAnswers({ ...answers, [q.id]: opt });
                                }}
                                className={`text-right p-2.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                                  userChoice === opt
                                    ? "bg-amber-100 border-amber-500 text-amber-900 font-bold shadow-xs"
                                    : "bg-white border-slate-200 hover:border-amber-400 text-slate-800"
                                }`}
                              >
                                <span>{opt}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {q.type === "blank" && (
                          <div className="pt-1">
                            <input
                              type="text"
                              disabled={isEvaluated}
                              placeholder="اكتب الإجابة في الفراغ..."
                              value={userChoice}
                              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                              className="w-full bg-amber-50/30 border border-amber-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                            />
                          </div>
                        )}

                        {q.type === "odd_one_out" && q.oddItems && (
                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {q.oddItems.words.map((w) => (
                              <button
                                key={w}
                                disabled={isEvaluated}
                                onClick={() => {
                                  onPlaySound("click");
                                  setAnswers({ ...answers, [q.id]: w });
                                }}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                                  userChoice === w
                                    ? "bg-amber-200 border-amber-600 text-amber-950 ring-2 ring-amber-400"
                                    : "bg-white border-slate-200 hover:border-amber-400 text-slate-800"
                                }`}
                              >
                                {w}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Interactive Feedback */}
                        {isEvaluated && (
                          <div className="mt-2 p-3 rounded-xl border text-xs space-y-1.5 bg-emerald-50 border-emerald-300 text-emerald-950">
                            <div className="font-bold flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span className="text-amber-900">الإجابة النموذجية المعتمدة: </span>
                              <span className="text-slate-900 font-serif">
                                {q.type === "odd_one_out" && q.oddItems ? `الكلمة الشاذة: ${q.oddItems.odd}` : q.correctAnswer}
                              </span>
                            </div>
                            {q.explanation && (
                              <p className="text-[11px] text-slate-600 pt-0.5 border-t border-slate-200">
                                💡 {q.explanation}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
