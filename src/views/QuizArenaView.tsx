import React, { useState } from "react";
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Award, 
  Sparkles, 
  Check, 
  Filter,
  Trophy,
  BrainCircuit
} from "lucide-react";
import { Question, QuestionType, Unit } from "../types";

interface QuizArenaViewProps {
  questions: Question[];
  units: Unit[];
  initialUnitId?: number;
  initialLessonId?: string;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  onUnlockBadge: (badgeId: string) => void;
  onPlaySound: (type: "click" | "success" | "fail" | "levelup") => void;
  onBack: () => void;
}

export const QuizArenaView: React.FC<QuizArenaViewProps> = ({
  questions,
  units,
  initialUnitId,
  initialLessonId,
  score,
  setScore,
  onUnlockBadge,
  onPlaySound,
  onBack,
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState<number | "all">(
    initialUnitId || "all"
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Match Question State
  const [selectedMatchLeft, setSelectedMatchLeft] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<Record<string, string>>({});

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    if (initialLessonId) return q.lessonId === initialLessonId;
    if (selectedUnitId !== "all") return q.unitId === selectedUnitId;
    return true;
  });

  const currentQ = filteredQuestions[currentIndex];

  const handleSelectOption = (opt: string) => {
    if (isAnswerSubmitted) return;
    onPlaySound("click");
    setSelectedAnswer(opt);
  };

  const handleSubmitAnswer = () => {
    if (!currentQ || isAnswerSubmitted) return;

    if (currentQ.type === QuestionType.MATCH) {
      // Check match pairs
      const totalPairs = currentQ.matchPairs?.length || 0;
      let correctPairsCount = 0;
      currentQ.matchPairs?.forEach((pair) => {
        if (matchedPairs[pair.left] === pair.right) {
          correctPairsCount++;
        }
      });
      const correct = correctPairsCount === totalPairs && totalPairs > 0;
      setIsCorrect(correct);
      setIsAnswerSubmitted(true);
      if (correct) {
        onPlaySound("success");
        setScore((prev) => prev + 15);
        setQuizScore((prev) => prev + 15);
      } else {
        onPlaySound("fail");
      }
      return;
    }

    if (!selectedAnswer) return;

    const correct =
      selectedAnswer.trim().toLowerCase() ===
      currentQ.correctAnswer.trim().toLowerCase();

    setIsCorrect(correct);
    setIsAnswerSubmitted(true);

    if (correct) {
      onPlaySound("success");
      setScore((prev) => prev + 10);
      setQuizScore((prev) => prev + 10);
      if (quizScore + 10 >= 50) {
        onUnlockBadge("quiz_expert");
      }
    } else {
      onPlaySound("fail");
    }
  };

  const handleNextQuestion = () => {
    onPlaySound("click");
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer("");
      setIsAnswerSubmitted(false);
      setIsCorrect(false);
      setMatchedPairs({});
      setSelectedMatchLeft(null);
    } else {
      setIsFinished(true);
      onPlaySound("levelup");
    }
  };

  const handleRestart = () => {
    onPlaySound("click");
    setCurrentIndex(0);
    setSelectedAnswer("");
    setIsAnswerSubmitted(false);
    setIsCorrect(false);
    setQuizScore(0);
    setIsFinished(false);
    setMatchedPairs({});
    setSelectedMatchLeft(null);
  };

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
          <span>الخروج</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs sm:text-sm">
            النقاط المكتسبة: {quizScore}
          </span>
        </div>
      </div>

      {/* Unit Selector Chips (if not locked to a specific lesson) */}
      {!initialLessonId && !isFinished && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => {
              onPlaySound("click");
              setSelectedUnitId("all");
              handleRestart();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedUnitId === "all"
                ? "bg-amber-500 text-slate-950 font-black shadow"
                : "bg-slate-800/80 text-slate-300"
            }`}
          >
            جميع الأسئلة ({questions.length})
          </button>
          {units.map((u) => (
            <button
              key={u.id}
              onClick={() => {
                onPlaySound("click");
                setSelectedUnitId(u.id);
                handleRestart();
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedUnitId === u.id
                  ? "bg-amber-500 text-slate-950 font-black shadow"
                  : "bg-slate-800/80 text-slate-300"
              }`}
            >
              الوحدة {u.id}
            </button>
          ))}
        </div>
      )}

      {/* Quiz Area Card */}
      {!isFinished && currentQ ? (
        <div className="rounded-3xl bg-[#121020]/95 border border-indigo-900/50 p-5 sm:p-8 shadow-2xl space-y-6">
          {/* Question Meta & Progress */}
          <div className="flex items-center justify-between border-b border-indigo-950/80 pb-4">
            <span className="text-xs font-bold text-amber-400">
              السؤال {currentIndex + 1} من {filteredQuestions.length}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {currentQ.type === QuestionType.MCQ && "اختيار من متعدد"}
              {currentQ.type === QuestionType.TRUE_FALSE && "صواب أو خطأ"}
              {currentQ.type === QuestionType.FILL_BLANK && "أكمل الفراغ"}
              {currentQ.type === QuestionType.MATCH && "مطابقة وتوصيل"}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
              style={{
                width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%`,
              }}
            />
          </div>

          {/* Question Text */}
          <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-100 leading-snug">
            {currentQ.text}
          </h2>

          {/* Question Options */}
          {/* 1. Multiple Choice Options */}
          {currentQ.type === QuestionType.MCQ && currentQ.options && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedAnswer === option;
                const isCorrectOption =
                  isAnswerSubmitted && option === currentQ.correctAnswer;
                const isWrongOption =
                  isAnswerSubmitted && isSelected && !isCorrect;

                return (
                  <button
                    key={idx}
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectOption(option)}
                    className={`p-4 rounded-2xl text-right font-bold text-sm sm:text-base border transition-all ${
                      isCorrectOption
                        ? "bg-emerald-600/30 border-emerald-500 text-emerald-200"
                        : isWrongOption
                        ? "bg-rose-600/30 border-rose-500 text-rose-200"
                        : isSelected
                        ? "bg-amber-500/20 border-amber-400 text-amber-300"
                        : "bg-slate-900/60 hover:bg-indigo-950/60 border-indigo-900/40 text-slate-200"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          )}

          {/* 2. True or False Options */}
          {currentQ.type === QuestionType.TRUE_FALSE && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              {["صواب", "خطأ"].map((opt) => {
                const isSelected = selectedAnswer === opt;
                const isCorrectOption =
                  isAnswerSubmitted && opt === currentQ.correctAnswer;
                const isWrongOption =
                  isAnswerSubmitted && isSelected && !isCorrect;

                return (
                  <button
                    key={opt}
                    disabled={isAnswerSubmitted}
                    onClick={() => handleSelectOption(opt)}
                    className={`py-5 rounded-2xl text-center font-black text-lg sm:text-xl border transition-all ${
                      isCorrectOption
                        ? "bg-emerald-600/30 border-emerald-500 text-emerald-200"
                        : isWrongOption
                        ? "bg-rose-600/30 border-rose-500 text-rose-200"
                        : isSelected
                        ? "bg-amber-500/20 border-amber-400 text-amber-300"
                        : "bg-slate-900/60 hover:bg-indigo-950/60 border-indigo-900/40 text-slate-200"
                    }`}
                  >
                    {opt === "صواب" ? "✅ صواب" : "❌ خطأ"}
                  </button>
                );
              })}
            </div>
          )}

          {/* 3. Fill In The Blank */}
          {currentQ.type === QuestionType.FILL_BLANK && (
            <div className="pt-2 space-y-3">
              <input
                type="text"
                disabled={isAnswerSubmitted}
                value={selectedAnswer}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                placeholder="اكتب الإجابة هنا..."
                className="w-full p-4 rounded-2xl bg-slate-900/80 border border-indigo-900/50 text-slate-100 placeholder-slate-500 font-bold text-base focus:outline-none focus:border-amber-400"
              />
            </div>
          )}

          {/* 4. Match Pairs */}
          {currentQ.type === QuestionType.MATCH && currentQ.matchPairs && (
            <div className="space-y-4 pt-2">
              <p className="text-xs text-amber-300">
                انقر على العنصر في القائمة الأولى ثم انقر على ما يناسبه في القائمة المقابلة:
              </p>
              <div className="grid grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-2">
                  {currentQ.matchPairs.map((pair, idx) => {
                    const isMatched = !!matchedPairs[pair.left];
                    const isSelected = selectedMatchLeft === pair.left;
                    return (
                      <button
                        key={idx}
                        disabled={isAnswerSubmitted}
                        onClick={() => setSelectedMatchLeft(pair.left)}
                        className={`w-full p-3 rounded-xl text-right text-xs sm:text-sm font-bold border transition ${
                          isSelected
                            ? "bg-amber-500/30 border-amber-400 text-amber-200"
                            : isMatched
                            ? "bg-emerald-950/60 border-emerald-600/50 text-emerald-300"
                            : "bg-slate-900 border-indigo-900/40 text-slate-300 hover:bg-slate-800"
                        }`}
                      >
                        {pair.left} {isMatched && `← ${matchedPairs[pair.left]}`}
                      </button>
                    );
                  })}
                </div>

                {/* Right Column */}
                <div className="space-y-2">
                  {currentQ.matchPairs.map((pair, idx) => (
                    <button
                      key={idx}
                      disabled={isAnswerSubmitted}
                      onClick={() => {
                        if (selectedMatchLeft) {
                          setMatchedPairs((prev) => ({
                            ...prev,
                            [selectedMatchLeft]: pair.right,
                          }));
                          setSelectedMatchLeft(null);
                        }
                      }}
                      className="w-full p-3 rounded-xl text-right text-xs sm:text-sm font-bold bg-slate-900 hover:bg-slate-800 border border-indigo-900/40 text-slate-300 transition"
                    >
                      {pair.right}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Explanation Banner (After Submission) */}
          {isAnswerSubmitted && (
            <div
              className={`p-4 sm:p-5 rounded-2xl border space-y-2 ${
                isCorrect
                  ? "bg-emerald-950/40 border-emerald-500/50 text-emerald-200"
                  : "bg-rose-950/40 border-rose-500/50 text-rose-200"
              }`}
            >
              <div className="flex items-center gap-2 font-black text-sm sm:text-base">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>إجابة صحيحة وممتازة! 🎉 (+10 نقاط)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-rose-400" />
                    <span>إجابة غير صحيحة. الإجابة الصحيحة هي: {currentQ.correctAnswer}</span>
                  </>
                )}
              </div>
              {currentQ.explanation && (
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pr-7">
                  💡 {currentQ.explanation}
                </p>
              )}
            </div>
          )}

          {/* Bottom Card Action Buttons */}
          <div className="pt-4 border-t border-indigo-950/80 flex items-center justify-between gap-3">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={
                  currentQ.type !== QuestionType.MATCH && !selectedAnswer
                }
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-amber-500/20 transition active:scale-95"
              >
                تأكيد الإجابة
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-sm sm:text-base shadow-lg shadow-emerald-900/40 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <span>السؤال التالي</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : isFinished ? (
        /* Results Completion Card */
        <div className="rounded-3xl bg-[#121020]/95 border border-indigo-900/50 p-8 sm:p-12 text-center space-y-6 shadow-2xl">
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-100">
              أحسنت يا بطل التاريخ! 🌟
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              لقد أتممت هذا الاختبار بنجاح وجمعت رصيداً جديداً من النقاط.
            </p>
          </div>

          <div className="inline-block px-6 py-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-black text-2xl">
            +{quizScore} نقطة جديدة
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={handleRestart}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة الاختبار</span>
            </button>

            <button
              onClick={() => {
                onPlaySound("click");
                onBack();
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition shadow-lg"
            >
              <span>العودة للرئيسية</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400">
          لا توجد أسئلة متطابقة مع هذا الاختيار حالياً.
        </div>
      )}
    </div>
  );
};
