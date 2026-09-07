import React, { useState } from "react";
import { ArrowRight, ArrowLeft, RotateCw, Shuffle, CheckCircle, HelpCircle, Layers, Sparkles } from "lucide-react";
import { Unit, Flashcard } from "../types";

interface FlashcardsViewProps {
  units: Unit[];
  initialUnitId?: number;
  onBack: () => void;
  onPlaySound: (type: "click" | "success" | "fail" | "levelup") => void;
}

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  units,
  initialUnitId,
  onBack,
  onPlaySound,
}) => {
  const [selectedUnitId, setSelectedUnitId] = useState<number | "all">(initialUnitId || "all");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  // Collect flashcards based on selection
  const flashcards: (Flashcard & { unitTitle: string })[] = units
    .filter((u) => selectedUnitId === "all" || u.id === selectedUnitId)
    .flatMap((u) => (u.flashcards || []).map((f) => ({ ...f, unitTitle: u.title })));

  const currentCard = flashcards[currentIndex];

  const handleNext = () => {
    onPlaySound("click");
    setIsFlipped(false);
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // loop back
    }
  };

  const handlePrev = () => {
    onPlaySound("click");
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(flashcards.length - 1);
    }
  };

  const handleFlip = () => {
    onPlaySound("click");
    setIsFlipped(!isFlipped);
  };

  const handleShuffle = () => {
    onPlaySound("levelup");
    setIsFlipped(false);
    setCurrentIndex(Math.floor(Math.random() * flashcards.length));
  };

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-fadeIn pb-24">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            onPlaySound("click");
            onBack();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition active:scale-95"
        >
          <ArrowRight className="w-4 h-4 text-amber-400" />
          <span>الرجوع</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-400">
            بطاقة {currentIndex + 1} من {flashcards.length}
          </span>
          <button
            onClick={handleShuffle}
            title="خلط عشوائي"
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <Shuffle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Unit Filter Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => {
            onPlaySound("click");
            setSelectedUnitId("all");
            setCurrentIndex(0);
            setIsFlipped(false);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
            selectedUnitId === "all"
              ? "bg-amber-500 text-slate-950 font-black shadow"
              : "bg-slate-800/80 text-slate-300"
          }`}
        >
          جميع البطاقات
        </button>
        {units.map((u) => (
          <button
            key={u.id}
            onClick={() => {
              onPlaySound("click");
              setSelectedUnitId(u.id);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedUnitId === u.id
                ? "bg-amber-500 text-slate-950 font-black shadow"
                : "bg-slate-800/80 text-slate-300"
            }`}
          >
            الوحدة {u.id}
          </button>
        ))}
      </div>

      {/* Card Container */}
      {currentCard ? (
        <div className="space-y-6">
          <div
            onClick={handleFlip}
            className="cursor-pointer min-h-[300px] sm:min-h-[340px] rounded-3xl bg-gradient-to-br from-[#18152c] to-[#121020] border-2 border-indigo-900/60 hover:border-amber-500/60 p-6 sm:p-10 shadow-2xl flex flex-col justify-between transition-all duration-300 transform active:scale-98 relative overflow-hidden text-center"
          >
            {/* Top Indicator */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 border-b border-indigo-950/80 pb-3">
              <span className="text-amber-400">{currentCard.unitTitle}</span>
              <span className="flex items-center gap-1 text-slate-400">
                <RotateCw className="w-3.5 h-3.5" />
                {isFlipped ? "الإجابة / الشرح" : "السؤال / المفهوم"}
              </span>
            </div>

            {/* Card Content */}
            <div className="my-auto py-6 space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-black">
                {isFlipped ? "💡 الشرح الدقيق" : "❓ استذكر المعلومة"}
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-100 leading-snug">
                {isFlipped ? currentCard.back : currentCard.front}
              </h2>
            </div>

            {/* Hint */}
            <div className="text-xs text-slate-500 font-medium">
              انقر على البطاقة في أي مكان للقلب
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={handlePrev}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm transition active:scale-95"
            >
              <ArrowRight className="w-4 h-4" />
              <span>البطاقة السابقة</span>
            </button>

            <button
              onClick={handleFlip}
              className="px-5 py-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 text-amber-300 font-black text-sm transition active:scale-95"
            >
              قلب البطاقة
            </button>

            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm transition shadow-lg active:scale-95"
            >
              <span>البطاقة التالية</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400">
          لا توجد بطاقات استذكار في هذه الوحدة حالياً.
        </div>
      )}
    </div>
  );
};
