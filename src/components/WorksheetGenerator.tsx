/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  FileText, Printer, Check, CheckSquare, X, Lock, Unlock, 
  RefreshCw, Info, Award, HelpCircle, Sparkles, CheckCircle2, XCircle,
  Maximize2, Minimize2, ZoomIn, ZoomOut, Monitor, ShieldAlert,
  ArrowRight, CheckCheck, Eye, BookOpen, GraduationCap, School
} from "lucide-react";
import { Question, Unit, QuestionType, OfficialExam } from "../types";
import { generateDynamicQuestions } from "../utils/questionGenerator";
import { OFFICIAL_EXAMS } from "../data/officialExamsData";
import { OfficialExamPaperView } from "./OfficialExamPaperView";

interface WorksheetGeneratorProps {
  units: Unit[];
  questions: Question[];
  favoriteLessons: string[];
  onToggleFavoriteLesson: (lessonId: string) => void;
  onPlaySound: (type: "click" | "success" | "fail" | "levelup") => void;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  parentPin?: string;
  onRequestExit?: (action?: () => void, isDirty?: boolean) => void;
  onWorksheetSolvingChange?: (isSolving: boolean) => void;
}

// Fixed Passcode for Watermark Removal
const WATERMARK_PASSCODE = "20302060";

// Diagram Options
interface DiagramConfig {
  id: string;
  unitId: number;
  lessonId?: string;
  title: string;
  description: string;
  imageAlt: string;
  labels: { id: string; name: string; x: number; y: number }[];
}

const DIAGRAMS_LIST: DiagramConfig[] = [
  // الوحدة الأولى: الحكم التركي المصري للسودان (١٨٢٠ - ١٨٨٥م)
  {
    id: "admin_struct",
    unitId: 1,
    lessonId: "u1_l2",
    title: "هيكل الحكم الإداري في عهد المديريات (شكل 1-4)",
    description: "وزع المكونات الحكومية الصحيحة في صناديق هيكل الحكم التركي المصري للمديرية.",
    imageAlt: "هيكل المديرية",
    labels: [
      { id: "lbl1", name: "مدير المديرية", x: 48, y: 15 },
      { id: "lbl2", name: "الوكيل والمعاونون والكتيبة", x: 18, y: 46 },
      { id: "lbl3", name: "القاضي والمفتي", x: 74, y: 46 },
      { id: "lbl4", name: "مجلس الأعيان", x: 20, y: 80 },
      { id: "lbl5", name: "الضبطية - قسم الشرطة", x: 75, y: 80 }
    ]
  },
  {
    id: "campaign_map",
    unitId: 1,
    lessonId: "u1_l1",
    title: "خارطة بلاد السودان ومسار حملات الغزو (1820م - 1821م)",
    description: "حدد المحطات والمدن الإستراتيجية المهمة التي مرت بها قوّات محمد علي باشا.",
    imageAlt: "خريطة حملات الغزو",
    labels: [
      { id: "w1", name: "وادي حلفا", x: 42, y: 18 },
      { id: "w2", name: "دنقلا", x: 28, y: 36 },
      { id: "w3", name: "كورتي", x: 48, y: 46 },
      { id: "w4", name: "شندي", x: 55, y: 58 },
      { id: "w5", name: "الخرطوم", x: 53, y: 70 },
      { id: "w6", name: "سنار", x: 62, y: 84 }
    ]
  },
  // الوحدة الثانية: لمحات من تاريخ السودان الحديث والمعاصر (١٩٥٥ - ١٩٨٥م)
  {
    id: "sudan_independence_map",
    unitId: 2,
    lessonId: "u2_l1",
    title: "خارطة السودان المستقل والمراكز الحضرية الكبرى (1956م)",
    description: "حدد العاصمة الوطنية والمدن الإقليمية المحورية في فجر استقلال السودان عام 1956م.",
    imageAlt: "خارطة السودان المستقل",
    labels: [
      { id: "u2_1", name: "الخرطوم (العاصمة القومية ومقر البرلمان)", x: 50, y: 45 },
      { id: "u2_2", name: "بورتسودان (الميناء البحري الرئيس)", x: 78, y: 28 },
      { id: "u2_3", name: "الأبيض (حاضرة كردفان ومركز التجارة)", x: 38, y: 58 },
      { id: "u2_4", name: "الفاشر (حاضرة دارفور التاريخية)", x: 18, y: 52 },
      { id: "u2_5", name: "جوبا (حاضرة جنوب السودان)", x: 45, y: 82 },
      { id: "u2_6", name: "ود مدني (حاضرة الجزيرة ومشروع القطن)", x: 55, y: 52 }
    ]
  },
  {
    id: "sudan_development_projects",
    unitId: 2,
    lessonId: "u2_l3",
    title: "مخطط مشروعات التنمية الاقتصادية والزراعية الكبرى في السودان (1956 - 1985م)",
    description: "وزع المشروعات التنموية والصناعية والزراعية الكبرى في خارطة التنمية القومية.",
    imageAlt: "مخطط التنمية الاقتصادية في السودان",
    labels: [
      { id: "dev1", name: "مشروع امتداد المناقل (الجزيرة)", x: 52, y: 48 },
      { id: "dev2", name: "سد الروصيرص (توليد الكهرباء والري)", x: 62, y: 68 },
      { id: "dev3", name: "مشروع سكر كنانة وعسلاية", x: 48, y: 58 },
      { id: "dev4", name: "مشروع الرهد الزراعي", x: 65, y: 54 },
      { id: "dev5", name: "سكة حديد السودان (شبكة النقل القومي)", x: 35, y: 35 }
    ]
  },
  // الوحدة الثالثة: تاريخ أوروبا الحديث
  {
    id: "renaissance_routes",
    unitId: 3,
    lessonId: "u3_l3",
    title: "مسارات حركة الكشوف الجغرافية الكبرى ورأس الرجاء الصالح",
    description: "حدد نقاط الانطلاق وطرق الملاحة البحرية الكبرى في عصر الكشوف الجغرافية الأوربية.",
    imageAlt: "خريطة الكشوف الجغرافية",
    labels: [
      { id: "c1", name: "شبه الجزيرة الأيبيرية (البرتغال وإسبانيا)", x: 22, y: 24 },
      { id: "c2", name: "طريق رأس الرجاء الصالح (فاسكو دا جاما)", x: 48, y: 82 },
      { id: "c3", name: "جزر الهند الشرقية (طريق التوابل)", x: 78, y: 42 },
      { id: "c4", name: "العالم الجديد والأمريكيتين (كولمبس)", x: 14, y: 46 }
    ]
  },
  {
    id: "french_society_pyramid",
    unitId: 3,
    lessonId: "u3_l4",
    title: "هرم طبقات المجتمع الفرنسي قبل ثورة 1789م (النظام القديم)",
    description: "وزع طبقات ومراتب المجتمع الفرنسي الإقطاعي من قمة الهرم إلى قاعدته العريضة.",
    imageAlt: "هرم طبقات المجتمع الفرنسي",
    labels: [
      { id: "fr1", name: "الملك المطلق (لويس السادس عشر وحاشية البلاط)", x: 50, y: 15 },
      { id: "fr2", name: "الطبقة الأولى: رجال الدين والكنيسة (الإكليروس)", x: 50, y: 35 },
      { id: "fr3", name: "الطبقة الثانية: طبقة النبلاء والأشراف الإقطاعيين", x: 50, y: 58 },
      { id: "fr4", name: "الطبقة الثالثة: عامة الشعب والبرجوازية والعمال والفلاحون", x: 50, y: 82 }
    ]
  },
  // الوحدة الرابعة: الصراع الأوروبي حول التوسع الاستعماري
  {
    id: "ww1_alliances",
    unitId: 4,
    lessonId: "u4_l1",
    title: "مخطط التحالفات العسكرية في الحرب العالمية الأولى (الوفاق ضد الوسط)",
    description: "صنف القوى والدول العظمى المتحاربة بين معسكري دول الوسط ودول الوفاق الثلاثي.",
    imageAlt: "تحالفات الحرب العالمية الأولى",
    labels: [
      { id: "ww1_a", name: "دول الوسط: ألمانيا والنمسا-المجر والدولة العثمانية", x: 25, y: 45 },
      { id: "ww1_b", name: "دول الوفاق الثلاثي: بريطانيا وفرنسا وروسيا القيصرية", x: 75, y: 45 },
      { id: "ww1_c", name: "شرارة الحرب: اغتيال ولي عهد النمسا في سراييفو", x: 50, y: 15 },
      { id: "ww1_d", name: "النتيجة الكبرى: معاهدة فرساي 1919م وسقوط الإمبراطوريات", x: 50, y: 80 }
    ]
  },
  {
    id: "ww2_alliances",
    unitId: 4,
    lessonId: "u4_l2",
    title: "مخطط القوى المتحاربة في الحرب العالمية الثانية (المحور ضد الحلفاء)",
    description: "وزع المعسكرات الدولية الكبرى في الحرب العالمية الثانية ومسارات الصراع الحاسمة.",
    imageAlt: "قوى الحرب العالمية الثانية",
    labels: [
      { id: "ww2_a", name: "دول المحور: ألمانيا وإيطاليا واليابان", x: 25, y: 50 },
      { id: "ww2_b", name: "دول الحلفاء: بريطانيا والاتحاد السوفيتي والولايات المتحدة وفرنسا", x: 75, y: 50 },
      { id: "ww2_c", name: "مسرح العلمين وشمال إفريقيا (تحول حاسم)", x: 50, y: 25 },
      { id: "ww2_d", name: "مؤتمر سان فرانسيسكو وتأسيس هيئة الأمم المتحدة 1945م", x: 50, y: 78 }
    ]
  }
];

// Helper to partition generated elements into printable mock "A4 Pages"
interface CompiledWorksheet {
  pageNumber: number;
  title: string;
  scopeText: string;
  questions: {
    type: string;
    text: string;
    options?: string[];
    correctAnswer: string;
    explanation?: string;
    matchPairs?: { left: string; right: string }[];
    diagramData?: DiagramConfig;
  }[];
}

export const WorksheetGenerator: React.FC<WorksheetGeneratorProps> = ({
  units,
  questions,
  favoriteLessons,
  onToggleFavoriteLesson,
  onPlaySound,
  score,
  setScore,
  parentPin = "1234",
  onRequestExit,
  onWorksheetSolvingChange
}) => {
  // Master Category Tabs: "exams" (Board & School Exams) | "unit_worksheets" (Comprehensive 4 Units) | "generator" (Smart Dynamic Generator)
  const [activeSourceTab, setActiveSourceTab] = useState<"exams" | "unit_worksheets" | "generator">("exams");
  const [selectedExamId, setSelectedExamId] = useState<string>("exam_primary_cert_red_sea");
  const [selectedUnitWorksheetId, setSelectedUnitWorksheetId] = useState<string>("worksheet_unit_1");

  // Filtered lists of official materials
  const boardExamsList = OFFICIAL_EXAMS.filter(e => e.category === "board_exam" || e.category === "school_exam");
  const unitWorksheetsList = OFFICIAL_EXAMS.filter(e => e.category === "unit_worksheet");
  const activeExam = boardExamsList.find(e => e.id === selectedExamId) || boardExamsList[0];
  const activeUnitWorksheet = unitWorksheetsList.find(e => e.id === selectedUnitWorksheetId) || unitWorksheetsList[0];

  // Filters Settings State
  const [scopeType, setScopeType] = useState<"all" | "unit" | "lesson" | "favorites">("all");
  const [selectedUnitId, setSelectedUnitId] = useState<number>(1);
  const [selectedLessonId, setSelectedLessonId] = useState<string>(() => units[0]?.lessons[0]?.id || "u1_l1");
  const [pageCount, setPageCount] = useState<number>(1);

  // Question type selections
  const [typesSelected, setTypesSelected] = useState({
    mcq: true,
    tf: true,
    blank: true,
    match: true,
    essay: true,
    diagram: true
  });

  // Watermark States
  const [removeWatermark, setRemoveWatermark] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [showPasswordBox, setShowPasswordBox] = useState<boolean>(false);

  // Mode state: Either A4 Page view or Interactive Dark UI
  const [worksheetMode, setWorksheetMode] = useState<"print" | "interactive">("print");

  // Output Generated Sheets
  const [generatedPages, setGeneratedPages] = useState<CompiledWorksheet[]>([]);

  // Interactive Answers State (Map of composite key like "page-questionIndex" -> selected answer value)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isEvaluated, setIsEvaluated] = useState<boolean>(false);
  const [evaluationScore, setEvaluationScore] = useState<{ correct: number; total: number; percentage: number } | null>(null);

  // Fullscreen & Screen-Adaptive Scaling States
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [isAutoFit, setIsAutoFit] = useState<boolean>(true);
  const [screenWidth, setScreenWidth] = useState<number>(() => typeof window !== "undefined" ? window.innerWidth : 1024);

  const containerRef = useRef<HTMLDivElement>(null);
  const examActionsRef = useRef<{ evaluate: () => void; reset: () => void; isEvaluated: boolean } | null>(null);
  const [examIsEvaluated, setExamIsEvaluated] = useState<boolean>(false);

  // Inform parent when worksheet has active solving in progress
  useEffect(() => {
    const hasUnfinishedAnswers = Object.keys(userAnswers).length > 0 && !isEvaluated;
    if (onWorksheetSolvingChange) {
      onWorksheetSolvingChange(hasUnfinishedAnswers || isFullscreen);
    }
  }, [userAnswers, isEvaluated, isFullscreen, onWorksheetSolvingChange]);

  // Window resize listener for responsive scaling and fit calculation
  useEffect(() => {
    const updateDimensions = () => {
      const w = window.innerWidth;
      setScreenWidth(w);
      if (isAutoFit) {
        if (w < 480) {
          setZoomScale(0.72);
        } else if (w < 640) {
          setZoomScale(0.82);
        } else if (w < 768) {
          setZoomScale(0.9);
        } else if (w < 1024) {
          setZoomScale(1);
        } else if (w >= 1440) {
          setZoomScale(1.1);
        } else {
          setZoomScale(1);
        }
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    window.addEventListener("orientationchange", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("orientationchange", updateDimensions);
    };
  }, [isAutoFit]);

  // Listen for native browser fullscreen changes (e.g. user presses Esc key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNativeFs = Boolean(document.fullscreenElement);
      if (!isNativeFs && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [isFullscreen]);

  // Keep lesson option synced when selectedUnitId shifts
  useEffect(() => {
    const parent = units.find(u => u.id === selectedUnitId);
    if (parent && parent.lessons.length > 0) {
      if (!parent.lessons.some(l => l.id === selectedLessonId)) {
        setSelectedLessonId(parent.lessons[0].id);
      }
    }
  }, [selectedUnitId, units, selectedLessonId]);

  // Build the worksheet data according to filters with STRICT SCOPE ISOLATION
  const handleGenerateWorksheets = (overrideOptions?: {
    scopeType?: "all" | "unit" | "lesson" | "favorites";
    unitId?: number;
    lessonId?: string;
  }) => {
    onPlaySound("levelup");
    setIsEvaluated(false);
    setEvaluationScore(null);
    setUserAnswers({});

    const effectiveScope = overrideOptions?.scopeType ?? scopeType;
    const effectiveUnitId = overrideOptions?.unitId ?? selectedUnitId;
    const effectiveLessonId = overrideOptions?.lessonId ?? (selectedLessonId || units.find(u => u.id === effectiveUnitId)?.lessons[0]?.id || units[0]?.lessons[0]?.id || "u1_l1");

    // If favorites is selected and empty, clear pages and show empty state
    if (effectiveScope === "favorites" && favoriteLessons.length === 0) {
      setGeneratedPages([]);
      return;
    }

    const itemsPerPage = 4;
    const maxNeededQuestions = pageCount * itemsPerPage;

    const selectedQuestions = generateDynamicQuestions(maxNeededQuestions, {
      type: effectiveScope === "favorites" ? "favorites" : effectiveScope === "unit" ? "unit" : effectiveScope === "lesson" ? "lesson" : "comprehensive",
      unitId: effectiveScope === "unit" ? effectiveUnitId : undefined,
      lessonId: effectiveScope === "lesson" ? effectiveLessonId : undefined,
      favoriteLessons: favoriteLessons,
      typesSelected: {
        mcq: typesSelected.mcq,
        tf: typesSelected.tf,
        blank: typesSelected.blank,
        match: typesSelected.match,
        essay: typesSelected.essay
      }
    });

    const scopeLabel = 
      effectiveScope === "favorites" ? `الدروس المفضلة ⭐ (${favoriteLessons.length} دروس مختارة)` : 
      effectiveScope === "unit" ? `الوحدة ${effectiveUnitId} - ${units.find(u => u.id === effectiveUnitId)?.title}` : 
      effectiveScope === "lesson" ? `درس محدد: ${units.flatMap(u => u.lessons).find(l => l.id === effectiveLessonId)?.title || ""}` : 
      "كامل المقرر الدراسي للصف الثاني ثانوي";

    // Filter diagrams strictly matching the selected scope with ZERO leakage
    let availableDiagrams: typeof DIAGRAMS_LIST = [];
    if (effectiveScope === "unit") {
      availableDiagrams = DIAGRAMS_LIST.filter(d => d.unitId === effectiveUnitId);
    } else if (effectiveScope === "lesson") {
      availableDiagrams = DIAGRAMS_LIST.filter(d => d.lessonId === effectiveLessonId);
    } else if (effectiveScope === "favorites") {
      availableDiagrams = DIAGRAMS_LIST.filter(d => d.lessonId && favoriteLessons.includes(d.lessonId));
    } else {
      availableDiagrams = DIAGRAMS_LIST;
    }

    const compiled: CompiledWorksheet[] = [];
    const usedDiagramIds = new Set<string>();

    for (let pNum = 1; pNum <= pageCount; pNum++) {
      const startIdx = (pNum - 1) * itemsPerPage;
      const endIdx = startIdx + itemsPerPage;
      const slice = selectedQuestions.slice(startIdx, endIdx);

      // If for a very small lesson we have exhausted questions, don't repeat previous ones
      const pageQuestions: CompiledWorksheet['questions'] = slice.map(q => ({
        type: q.type,
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        matchPairs: q.matchPairs
      }));

      // If diagrams are toggled and diagrams exist for this unit/lesson, insert unique diagram questions only
      if (typesSelected.diagram && availableDiagrams.length > 0) {
        const unusedDiagram = availableDiagrams.find(d => !usedDiagramIds.has(d.id));
        if (unusedDiagram) {
          usedDiagramIds.add(unusedDiagram.id);
          pageQuestions.push({
            type: "diagram",
            text: `أعد تسمية وتوجيه البيانات على الشكل التوضيحي التالي الخاص بـ: (${unusedDiagram.title})`,
            correctAnswer: unusedDiagram.labels.map(l => `${l.id}: ${l.name}`).join(" - "),
            diagramData: unusedDiagram
          });
        }
      }

      // Only add page if it has questions
      if (pageQuestions.length > 0) {
        compiled.push({
          pageNumber: pNum,
          title: `ورقة العمل والتقييم - صفحة ${pNum}`,
          scopeText: scopeLabel,
          questions: pageQuestions
        });
      }
    }

    setGeneratedPages(compiled);
  };

  // Generate automatically on mount
  useEffect(() => {
    if (generatedPages.length === 0) {
      handleGenerateWorksheets();
    }
  }, []);

  // Watermark removal authorization check
  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === WATERMARK_PASSCODE) {
      setRemoveWatermark(true);
      setPasswordError(false);
      setShowPasswordBox(false);
      onPlaySound("success");
    } else {
      setPasswordError(true);
      onPlaySound("fail");
    }
  };

  const handlePrint = () => {
    onPlaySound("click");
    window.print();
  };

  // Evaluate interactive answers
  const handleEvaluateWorksheet = () => {
    onPlaySound("levelup");
    let correctCount = 0;
    let totalQuestionsGraded = 0;

    generatedPages.forEach((page) => {
      page.questions.forEach((q, idx) => {
        const k = `${page.pageNumber}-${idx}`;
        const answer = userAnswers[k];

        if (q.type === "diagram") {
          q.diagramData?.labels.forEach((lbl) => {
            const compositeKey = `${k}-diagram-${lbl.id}`;
            const userChoice = userAnswers[compositeKey];
            if (userChoice && userChoice.trim() === lbl.name.trim()) {
              correctCount++;
            }
            totalQuestionsGraded++;
          });
        } else if (q.type === QuestionType.ESSAY) {
          totalQuestionsGraded++;
          // For essay, if answered with reasonable length, count as answered
          if (answer && answer.trim().length >= 10) {
            correctCount++;
          }
        } else {
          totalQuestionsGraded++;
          const safeCorrect = typeof q.correctAnswer === "string" ? q.correctAnswer : String(q.correctAnswer || "");
          if (answer && safeCorrect && answer.trim().toLowerCase() === safeCorrect.trim().toLowerCase()) {
            correctCount++;
          }
        }
      });
    });

    const percent = totalQuestionsGraded > 0 ? Math.round((correctCount / totalQuestionsGraded) * 100) : 0;
    setEvaluationScore({
      correct: correctCount,
      total: totalQuestionsGraded,
      percentage: percent
    });
    setIsEvaluated(true);

    if (percent >= 50) {
      const earned = Math.round(percent / 2);
      setScore(prev => prev + earned);
    }
  };

  const handleResetAnswers = () => {
    onPlaySound("click");
    setIsEvaluated(false);
    setUserAnswers({});
    setEvaluationScore(null);
  };

  const isCurrentPaperEvaluated = activeSourceTab === "generator" ? isEvaluated : examIsEvaluated;

  const handleUniversalEvaluate = () => {
    if (activeSourceTab === "generator") {
      handleEvaluateWorksheet();
    } else {
      if (examActionsRef.current) {
        examActionsRef.current.evaluate();
        setExamIsEvaluated(true);
      }
    }
  };

  const handleUniversalReset = () => {
    if (activeSourceTab === "generator") {
      handleResetAnswers();
    } else {
      if (examActionsRef.current) {
        examActionsRef.current.reset();
        setExamIsEvaluated(false);
      }
    }
  };

  const activePaperBadgeText = 
    activeSourceTab === "exams" 
      ? activeExam.title 
      : activeSourceTab === "unit_worksheets" 
      ? activeUnitWorksheet.title 
      : scopeType === "favorites" 
      ? `الدروس المفضلة ⭐ (${favoriteLessons.length})`
      : scopeType === "unit" 
      ? `الوحدة ${selectedUnitId}`
      : scopeType === "lesson" 
      ? `درس: ${units.flatMap(u => u.lessons).find(l => l.id === selectedLessonId)?.title || ""}`
      : "المقرر الشامل";

  // Handle Fullscreen Toggle
  const handleToggleFullscreen = () => {
    onPlaySound("click");
    
    // Attempt native browser fullscreen if available
    if (!isFullscreen) {
      try {
        if (containerRef.current && containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen().catch(() => {
            // If native fullscreen restricted in iframe, state overlay fallback works perfectly
          });
        }
      } catch (e) {
        // Fallback to overlay
      }
      setIsFullscreen(true);
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  // Zoom Helpers
  const handleZoomIn = () => {
    onPlaySound("click");
    setIsAutoFit(false);
    setZoomScale(prev => Math.min(1.5, Number((prev + 0.1).toFixed(2))));
  };

  const handleZoomOut = () => {
    onPlaySound("click");
    setIsAutoFit(false);
    setZoomScale(prev => Math.max(0.55, Number((prev - 0.1).toFixed(2))));
  };

  const handleResetZoomFit = () => {
    onPlaySound("click");
    setIsAutoFit(true);
    if (screenWidth < 480) setZoomScale(0.72);
    else if (screenWidth < 640) setZoomScale(0.82);
    else if (screenWidth < 768) setZoomScale(0.9);
    else if (screenWidth < 1024) setZoomScale(1);
    else if (screenWidth >= 1440) setZoomScale(1.1);
    else setZoomScale(1);
  };

  // Total answers count helper
  const totalAnswersGiven = Object.keys(userAnswers).length;

  return (
    <div 
      ref={containerRef}
      className={`space-y-6 text-right font-sans transition-all duration-300 ${
        isFullscreen 
          ? "fixed inset-0 z-50 overflow-y-auto bg-[#faf8f5] p-3 sm:p-6 md:p-8 text-slate-900" 
          : "relative"
      }`} 
      dir="rtl"
    >
      {/* FULLSCREEN PERSISTENT FLOATING TOOLBAR */}
      {isFullscreen && (
        <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-amber-300 p-3 sm:p-4 rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-3 select-none mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 border border-amber-300 shadow-xs">
              <Monitor className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-amber-900 text-sm sm:text-base">
                  ورقة الاختبار - وضع ملء الشاشة ⛶
                </span>
                <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-bold truncate max-w-[200px] sm:max-w-[300px]">
                  {activePaperBadgeText}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 hidden sm:block">
                تم عزل ورقة الاختبار بالكامل لتوفير التركيز أثناء الحل والطباعة ({Math.round(zoomScale * 100)}%)
              </p>
            </div>
          </div>

          {/* Center: Mode switcher & Zoom Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Mode Switcher */}
            <div className="flex items-center bg-amber-50/80 border border-amber-200 p-1 rounded-xl">
              <button
                onClick={() => {
                  onPlaySound("click");
                  setWorksheetMode("print");
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  worksheetMode === "print" ? "bg-amber-600 text-white shadow-xs" : "text-slate-700 hover:text-slate-950"
                }`}
              >
                📄 نموذج A4
              </button>
              <button
                onClick={() => {
                  onPlaySound("click");
                  setWorksheetMode("interactive");
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  worksheetMode === "interactive" ? "bg-amber-600 text-white shadow-xs" : "text-slate-700 hover:text-slate-950"
                }`}
              >
                🧩 تفاعلي
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-2 py-1 rounded-xl">
              <button
                onClick={handleZoomOut}
                title="تصغير العرض"
                className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-700 hover:text-amber-800 transition cursor-pointer text-xs flex items-center gap-1"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              
              <span className="text-[11px] font-bold text-amber-900 px-1.5 min-w-[42px] text-center font-sans">
                {Math.round(zoomScale * 100)}%
              </span>

              <button
                onClick={handleZoomIn}
                title="تكبير العرض"
                className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-700 hover:text-amber-800 transition cursor-pointer text-xs flex items-center gap-1"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                onClick={handleResetZoomFit}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold transition border cursor-pointer ${
                  isAutoFit 
                    ? "bg-amber-600 text-white border-amber-600 shadow-xs" 
                    : "bg-white text-slate-700 border-amber-200 hover:bg-amber-100"
                }`}
              >
                ملاءمة الشاشة ✨
              </button>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleUniversalEvaluate}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <CheckSquare className="w-4 h-4" />
              <span className="hidden sm:inline">{isCurrentPaperEvaluated ? "إعادة التصحيح" : "تصحيح الورقة"}</span>
              <span className="sm:hidden">تصحيح</span>
            </button>

            {isCurrentPaperEvaluated && (
              <button
                onClick={handleUniversalReset}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold text-xs px-3 py-2 rounded-xl transition cursor-pointer"
              >
                مسح 🔄
              </button>
            )}

            <button
              onClick={handlePrint}
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-3 py-2 rounded-xl transition flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">طباعة</span>
            </button>

            <button
              onClick={handleToggleFullscreen}
              className="bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Minimize2 className="w-4 h-4" />
              <span>مغادرة ملء الشاشة ✕</span>
            </button>
          </div>
        </div>
      )}

      {/* SECTION HEADER (Hidden in print) */}
      {!isFullscreen && (
        <div className="no-print bg-white rounded-2xl border border-amber-200/90 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 select-none shadow-sm text-slate-900">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 text-xs px-2.5 py-0.5 rounded-full font-bold border border-amber-300 font-sans">
                أوراق العمل والتقييم الذاتي A4
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold font-serif text-amber-800 mt-1.5 flex items-center gap-2">
              <FileText className="w-6 h-6 md:w-7 md:h-7 text-amber-600 shrink-0" />
              <span>حل وتصحيح أوراق العمل A4 تفاعلياً بالموقع</span>
            </h2>
            <p className="text-slate-600 text-xs md:text-sm mt-1 font-sans">
              يمكنك حل الأسئلة مباشرة على الصفحة وتصحيحها فوراً للحصول على النتيجة والدرجة مع إظهار الإجابات النموذجية الصحيحة تحت كل سؤال!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Fullscreen Trigger Button */}
            <button
              onClick={handleToggleFullscreen}
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white px-3.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1.5 shadow-sm hover:scale-102 active:scale-98"
            >
              <Maximize2 className="w-4 h-4 text-amber-200" />
              <span>فتح ملء الشاشة ⛶</span>
            </button>

            <button
              onClick={() => {
                onPlaySound("click");
                setWorksheetMode("print");
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1.5 ${
                worksheetMode === "print"
                  ? "bg-amber-600 text-white font-black shadow-sm"
                  : "bg-amber-50/70 text-slate-700 border border-amber-200 hover:bg-amber-100"
              }`}
            >
              📄 نموذج A4
            </button>
            <button
              onClick={() => {
                onPlaySound("click");
                setWorksheetMode("interactive");
              }}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition flex items-center gap-1.5 ${
                worksheetMode === "interactive"
                  ? "bg-amber-600 text-white font-black shadow-sm"
                  : "bg-amber-50/70 text-slate-700 border border-amber-200 hover:bg-amber-100"
              }`}
            >
              🧩 نمط البطاقات التفاعلية
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          MASTER CATEGORY TABS (Exams | Unit Worksheets | Smart Generator)
          ========================================================================= */}
      {!isFullscreen && (
        <div className="no-print bg-white rounded-2xl border-2 border-amber-200/90 p-2 sm:p-2.5 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Tab 1: Official Board & School Exams */}
            <button
              onClick={() => {
                onPlaySound("click");
                setActiveSourceTab("exams");
              }}
              className={`p-3 rounded-xl text-right transition cursor-pointer flex items-center justify-between gap-3 border ${
                activeSourceTab === "exams"
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-700 shadow-md scale-[1.01]"
                  : "bg-amber-50/60 hover:bg-amber-100/70 text-slate-800 border-amber-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl sm:text-2xl">🏛️</span>
                <div>
                  <div className="font-serif font-black text-sm sm:text-base leading-tight">
                    امتحانات الشهادة والامتحانات الرسمية
                  </div>
                  <div className={`text-[11px] ${activeSourceTab === "exams" ? "text-amber-100" : "text-slate-500"}`}>
                    امتحانات الشهادة والامتحانات النموذجية المعتمدة
                  </div>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                activeSourceTab === "exams" ? "bg-amber-900/40 text-amber-100" : "bg-amber-200/70 text-amber-900"
              }`}>
                4 امتحانات
              </span>
            </button>

            {/* Tab 2: Comprehensive 5 Units Worksheets */}
            <button
              onClick={() => {
                onPlaySound("click");
                setActiveSourceTab("unit_worksheets");
              }}
              className={`p-3 rounded-xl text-right transition cursor-pointer flex items-center justify-between gap-3 border ${
                activeSourceTab === "unit_worksheets"
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-700 shadow-md scale-[1.01]"
                  : "bg-amber-50/60 hover:bg-amber-100/70 text-slate-800 border-amber-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl sm:text-2xl">📘</span>
                <div>
                  <div className="font-serif font-black text-sm sm:text-base leading-tight">
                    كراسة أوراق عمل الوحدات (1 - 5)
                  </div>
                  <div className={`text-[11px] ${activeSourceTab === "unit_worksheets" ? "text-amber-100" : "text-slate-500"}`}>
                    أوراق عمل شاملة للوحدات بنماذج الإجابة
                  </div>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                activeSourceTab === "unit_worksheets" ? "bg-amber-900/40 text-amber-100" : "bg-amber-200/70 text-amber-900"
              }`}>
                5 وحدات
              </span>
            </button>

            {/* Tab 3: Custom Smart Generator */}
            <button
              onClick={() => {
                onPlaySound("click");
                setActiveSourceTab("generator");
              }}
              className={`p-3 rounded-xl text-right transition cursor-pointer flex items-center justify-between gap-3 border ${
                activeSourceTab === "generator"
                  ? "bg-gradient-to-r from-amber-600 to-amber-700 text-white border-amber-700 shadow-md scale-[1.01]"
                  : "bg-amber-50/60 hover:bg-amber-100/70 text-slate-800 border-amber-200"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl sm:text-2xl">⚡</span>
                <div>
                  <div className="font-serif font-black text-sm sm:text-base leading-tight">
                    المولد الذكي لأوراق العمل
                  </div>
                  <div className={`text-[11px] ${activeSourceTab === "generator" ? "text-amber-100" : "text-slate-500"}`}>
                    توليد أسئلة مخصصة حسب الدروس والوحدات
                  </div>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                activeSourceTab === "generator" ? "bg-amber-900/40 text-amber-100" : "bg-amber-200/70 text-amber-900"
              }`}>
                تخصيص حر
              </span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          UNIVERSAL WATERMARK CONTROLS BAR (Visible when in print mode)
          ========================================================================= */}
      {worksheetMode === "print" && !isFullscreen && (
        <div className="no-print bg-amber-50/80 rounded-2xl p-3 sm:p-4 border border-amber-200 flex flex-col md:flex-row items-center justify-between gap-4 select-none text-slate-800 shadow-xs">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${removeWatermark ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-amber-100 text-amber-800 border border-amber-300"}`}>
              {removeWatermark ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">التحكم في العلامة المائية للطباعة</h4>
              <p className="text-xs text-slate-600">
                {removeWatermark 
                  ? "✅ تم إلغاء العلامة المائية بنجاح، الأوراق والامتحانات جاهزة للطباعة الصافية." 
                  : "🔒 تحتوي الأوراق على علامة مائية للمنصة. يمكنك إلغاؤها بكلمة المرور (20302060)."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {!removeWatermark && !showPasswordBox && (
              <button
                onClick={() => {
                  onPlaySound("click");
                  setShowPasswordBox(true);
                }}
                className="bg-white hover:bg-amber-50 text-amber-900 px-4 py-2 border border-amber-300 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 shadow-xs"
              >
                🔐 إدخال رمز إزالة العلامة المائية
              </button>
            )}

            {showPasswordBox && (
              <form onSubmit={handleVerifyPasscode} className="flex items-center gap-2">
                <input
                  type="password"
                  placeholder="رمز المرور (20302060)..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="bg-white border border-amber-300 rounded-xl px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
                >
                  تأكيد
                </button>
              </form>
            )}

            {removeWatermark && (
              <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 font-bold rounded-lg shrink-0">
                العلامة المائية ملغاة 🔓
              </span>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 1: OFFICIAL EXAMS VIEW
          ========================================================================= */}
      {activeSourceTab === "exams" && (
        <div className="space-y-6">
          {/* EXAM SELECTOR BAR */}
          {!isFullscreen && (
            <div className="no-print bg-white rounded-2xl border border-amber-200 p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <h3 className="font-serif font-bold text-amber-900 text-sm sm:text-base flex items-center gap-2">
                  <span>🏛️ اختر الامتحان الرسمي للحل والطباعة:</span>
                </h3>
                <span className="text-xs text-slate-500 font-sans hidden sm:inline">
                  مطابقة 100% لمقرر الصف الثاني ثانوي المعتمد
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {boardExamsList.map((exam) => (
                  <button
                    key={exam.id}
                    onClick={() => {
                      onPlaySound("click");
                      setSelectedExamId(exam.id);
                    }}
                    className={`p-3 rounded-xl text-right transition cursor-pointer border text-xs flex flex-col justify-between min-h-[105px] ${
                      selectedExamId === exam.id
                        ? "bg-amber-50/90 border-amber-500 shadow-sm ring-2 ring-amber-400/50"
                        : "bg-white hover:bg-amber-50/50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="font-bold text-amber-800 text-[11px] truncate">
                          {exam.subtitle || exam.state}
                        </span>
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
                          {exam.totalMarks} درجة
                        </span>
                      </div>
                      <div className="font-serif font-bold text-slate-950 text-xs sm:text-sm leading-snug">
                        {exam.title}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-amber-100/70 mt-2">
                      <span>⏱️ {exam.duration}</span>
                      <span className="font-bold text-amber-700">حل وتصحيح ✍️</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* RENDER ACTIVE EXAM */}
          <OfficialExamPaperView
            exam={activeExam}
            onPlaySound={onPlaySound}
            onAddScore={(pts) => setScore(prev => prev + pts)}
            worksheetMode={worksheetMode}
            onModeChange={setWorksheetMode}
            removeWatermark={removeWatermark}
            onToggleFullscreen={handleToggleFullscreen}
            isFullscreen={isFullscreen}
            externalZoomScale={zoomScale}
            onRegisterActions={(actions) => {
              examActionsRef.current = actions;
              setExamIsEvaluated(actions.isEvaluated);
            }}
          />
        </div>
      )}

      {/* =========================================================================
          SECTION 2: COMPREHENSIVE 5 UNIT WORKSHEETS VIEW
          ========================================================================= */}
      {activeSourceTab === "unit_worksheets" && (
        <div className="space-y-6">
          {/* UNIT WORKSHEETS SELECTOR BAR */}
          {!isFullscreen && (
            <div className="no-print bg-white rounded-2xl border border-amber-200 p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                <h3 className="font-serif font-bold text-amber-900 text-sm sm:text-base flex items-center gap-2">
                  <span>📘 كراسة أوراق العمل الشاملة للوحدات الدراسية الخمس:</span>
                </h3>
                <span className="text-xs text-slate-500 font-sans hidden sm:inline">
                  نماذج إجابات معتمدة وأدلة منهجية
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                {unitWorksheetsList.map((ws, idx) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      onPlaySound("click");
                      setSelectedUnitWorksheetId(ws.id);
                    }}
                    className={`p-3 rounded-xl text-right transition cursor-pointer border text-xs flex flex-col justify-between min-h-[105px] ${
                      selectedUnitWorksheetId === ws.id
                        ? "bg-amber-50/90 border-amber-500 shadow-sm ring-2 ring-amber-400/50"
                        : "bg-white hover:bg-amber-50/50 border-slate-200 text-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="font-bold text-amber-800 text-[11px]">
                          الوحدة {idx + 1}
                        </span>
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
                          {ws.totalMarks} درجة
                        </span>
                      </div>
                      <div className="font-serif font-bold text-slate-950 text-xs leading-snug">
                        {ws.title.replace("كراسة أوراق العمل الشاملة - ", "")}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-amber-100/70 mt-2">
                      <span>{ws.sections.length} أقسام</span>
                      <span className="font-bold text-amber-700">حل وطباعة 🖨️</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* RENDER ACTIVE UNIT WORKSHEET */}
          <OfficialExamPaperView
            exam={activeUnitWorksheet}
            onPlaySound={onPlaySound}
            onAddScore={(pts) => setScore(prev => prev + pts)}
            worksheetMode={worksheetMode}
            onModeChange={setWorksheetMode}
            removeWatermark={removeWatermark}
            onToggleFullscreen={handleToggleFullscreen}
            isFullscreen={isFullscreen}
            externalZoomScale={zoomScale}
            onRegisterActions={(actions) => {
              examActionsRef.current = actions;
              setExamIsEvaluated(actions.isEvaluated);
            }}
          />
        </div>
      )}

      {/* =========================================================================
          SECTION 3: SMART DYNAMIC GENERATOR VIEW
          ========================================================================= */}
      {activeSourceTab === "generator" && (
        <div className="space-y-6">
          {/* FILTER & GENERATION PANEL (Hidden during print or fullscreen) */}
          {!isFullscreen && (
            <div className="no-print bg-white rounded-2xl border border-amber-200/90 p-5 space-y-4 shadow-sm text-slate-900">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-100 pb-2">
                <h3 className="text-amber-800 font-serif font-bold text-base md:text-lg flex items-center gap-1.5">
            <span>⚙️ إعدادات ورقة العمل ونطاق الأسئلة</span>
          </h3>

          {/* Quick Zoom & Screen Fit Bar */}
          <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
            <span className="text-[11px] text-slate-600 font-bold hidden sm:inline">أبعاد الشاشة:</span>
            <button
              onClick={handleZoomOut}
              title="تصغير"
              className="p-1 rounded hover:bg-amber-100 text-slate-700 hover:text-amber-800 transition cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-amber-900 font-bold px-1">{Math.round(zoomScale * 100)}%</span>
            <button
              onClick={handleZoomIn}
              title="تكبير"
              className="p-1 rounded hover:bg-amber-100 text-slate-700 hover:text-amber-800 transition cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoomFit}
              className={`text-[9px] px-2 py-0.5 rounded font-bold transition border cursor-pointer ${
                isAutoFit ? "bg-amber-600 text-white border-amber-600 shadow-xs" : "bg-white text-slate-700 border-amber-200 hover:bg-amber-100"
              }`}
            >
              تلقائي
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {/* Scope Filters */}
          <div className="space-y-1.5">
            <label className="text-slate-700 text-xs font-semibold">نطاق المنهج المستهدف:</label>
            <select
              value={scopeType}
              onChange={(e) => {
                const newScope = e.target.value as any;
                onPlaySound("click");
                setScopeType(newScope);
                handleGenerateWorksheets({ scopeType: newScope });
              }}
              className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer font-bold"
            >
              <option value="all">كامل المنهج الدراسي 📘</option>
              <option value="favorites">الدروس المفضلة ⭐ ({favoriteLessons.length})</option>
              <option value="unit">وحدة كاملة 📓</option>
              <option value="lesson">درس مخصص 📄</option>
            </select>
          </div>

          {/* Unit Selection */}
          {scopeType === "unit" && (
            <div className="space-y-1.5">
              <label className="text-slate-700 text-xs font-semibold">اختر الوحدة:</label>
              <select
                value={selectedUnitId}
                onChange={(e) => {
                  const newUnit = parseInt(e.target.value, 10);
                  onPlaySound("click");
                  setSelectedUnitId(newUnit);
                  handleGenerateWorksheets({ unitId: newUnit });
                }}
                className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer font-bold"
              >
                {units.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    وحدة {unit.id}: {unit.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Lesson Selection */}
          {scopeType === "lesson" && (
            <>
              <div className="space-y-1.5">
                <label className="text-slate-700 text-xs font-semibold">الوحدة:</label>
                <select
                  value={selectedUnitId}
                  onChange={(e) => {
                    const newUnit = parseInt(e.target.value, 10);
                    const newLesson = units.find(u => u.id === newUnit)?.lessons[0]?.id || "";
                    onPlaySound("click");
                    setSelectedUnitId(newUnit);
                    if (newLesson) {
                      setSelectedLessonId(newLesson);
                      handleGenerateWorksheets({ unitId: newUnit, lessonId: newLesson });
                    } else {
                      handleGenerateWorksheets({ unitId: newUnit });
                    }
                  }}
                  className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 cursor-pointer font-bold"
                >
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      وحدة {unit.id}: {unit.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-700 text-xs font-semibold">الدرس:</label>
                <select
                  value={selectedLessonId}
                  onChange={(e) => {
                    const newLesson = e.target.value;
                    onPlaySound("click");
                    setSelectedLessonId(newLesson);
                    handleGenerateWorksheets({ lessonId: newLesson });
                  }}
                  className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-amber-500 font-sans cursor-pointer font-bold"
                >
                  {units
                    .find((u) => u.id === selectedUnitId)
                    ?.lessons.map((les) => (
                      <option key={les.id} value={les.id}>
                        {les.title}
                      </option>
                    ))}
                </select>
              </div>
            </>
          )}

          {/* Page count */}
          <div className="space-y-1.5">
            <label className="text-slate-700 text-xs font-semibold">عدد أوراق العمل (A4):</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="1"
                max="10"
                value={pageCount}
                onChange={(e) => setPageCount(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <span className="bg-amber-50 border border-amber-200 px-3 py-1.5 text-xs text-amber-900 rounded-lg font-bold min-w-[50px] text-center">
                {pageCount} صفحة
              </span>
            </div>
          </div>

          {/* Informational banner when favoriteLessons is empty and favorites scope is picked */}
          {scopeType === "favorites" && favoriteLessons.length === 0 && (
            <div className="col-span-full bg-amber-50 border border-amber-300 rounded-xl p-3.5 flex items-center gap-3 text-xs text-amber-900 shadow-xs">
              <span className="text-2xl shrink-0">⭐</span>
              <div>
                <strong className="block text-amber-950 text-xs sm:text-sm">لم تقم بتحديد أي دروس في المفضلة بعد:</strong>
                <p className="text-slate-600 mt-0.5 text-[11px] sm:text-xs">
                  يمكنك النقر على رمز النجمة ⭐ بجوار أي درس في شاشة الدروس لتفضيله، وسيتم توليد أوراق عمل مخصصة لدروسك المفضلة حصراً.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Question Type Selection Checkboxes */}
        <div className="space-y-1.5">
          <label className="text-slate-700 text-xs font-semibold">أنواع الأسئلة المضمنة:</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
            <label className="flex items-center gap-2 bg-amber-50/50 p-2 rounded-xl border border-amber-200 cursor-pointer hover:border-amber-400">
              <input
                type="checkbox"
                checked={typesSelected.mcq}
                onChange={(e) => setTypesSelected({ ...typesSelected, mcq: e.target.checked })}
                className="rounded accent-amber-600 cursor-pointer"
              />
              <span className="text-slate-800">اختيار متعدد 🔘</span>
            </label>

            <label className="flex items-center gap-2 bg-amber-50/50 p-2 rounded-xl border border-amber-200 cursor-pointer hover:border-amber-400">
              <input
                type="checkbox"
                checked={typesSelected.tf}
                onChange={(e) => setTypesSelected({ ...typesSelected, tf: e.target.checked })}
                className="rounded accent-amber-600 cursor-pointer"
              />
              <span className="text-slate-800">صح وخطأ ✔️</span>
            </label>

            <label className="flex items-center gap-2 bg-amber-50/50 p-2 rounded-xl border border-amber-200 cursor-pointer hover:border-amber-400">
              <input
                type="checkbox"
                checked={typesSelected.blank}
                onChange={(e) => setTypesSelected({ ...typesSelected, blank: e.target.checked })}
                className="rounded accent-amber-600 cursor-pointer"
              />
              <span className="text-slate-800">إكمال فراغات ✏️</span>
            </label>

            <label className="flex items-center gap-2 bg-amber-50/50 p-2 rounded-xl border border-amber-200 cursor-pointer hover:border-amber-400">
              <input
                type="checkbox"
                checked={typesSelected.match}
                onChange={(e) => setTypesSelected({ ...typesSelected, match: e.target.checked })}
                className="rounded accent-amber-600 cursor-pointer"
              />
              <span className="text-slate-800">توصيل ومطابقة 🧩</span>
            </label>

            <label className="flex items-center gap-2 bg-amber-50/50 p-2 rounded-xl border border-amber-200 cursor-pointer hover:border-amber-400">
              <input
                type="checkbox"
                checked={typesSelected.essay}
                onChange={(e) => setTypesSelected({ ...typesSelected, essay: e.target.checked })}
                className="rounded accent-amber-600 cursor-pointer"
              />
              <span className="text-slate-800">مقالي وتحليل 📜</span>
            </label>

            <label className="flex items-center gap-2 bg-amber-50/50 p-2 rounded-xl border border-amber-200 cursor-pointer hover:border-amber-400">
              <input
                type="checkbox"
                checked={typesSelected.diagram}
                onChange={(e) => setTypesSelected({ ...typesSelected, diagram: e.target.checked })}
                className="rounded accent-teal-600 cursor-pointer"
              />
              <span className="text-teal-800 font-semibold">خرائط ورسوم 🗺️</span>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            onClick={handleGenerateWorksheets}
            className="bg-amber-600 hover:bg-amber-500 text-white font-serif font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl transition duration-150 transform hover:scale-102 active:scale-98 flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-4 h-4 shrink-0" />
            <span>توليد ورقة عمل جديدة 🚀</span>
          </button>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleEvaluateWorksheet}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <CheckSquare className="w-4 h-4" />
              <span>{isEvaluated ? "إعادة التصحيح وحساب الدرجة" : "تصحيح ورقة العمل وإظهار الإجابات ✅"}</span>
            </button>

            {isEvaluated && (
              <button
                onClick={handleResetAnswers}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs px-3.5 py-2.5 rounded-xl transition cursor-pointer"
              >
                مسح الإجابات 🔄
              </button>
            )}

            <button
              onClick={handlePrint}
              disabled={generatedPages.length === 0}
              className="bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة A4 🖨️</span>
            </button>
          </div>
        </div>
      </div>
          )}

      {/* EVALUATION RESULTS CARD (Shown when graded) */}
      {isEvaluated && evaluationScore && (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300 rounded-2xl p-5 md:p-6 shadow-md space-y-4 animate-[fadeIn_0.3s_ease-out] text-slate-900">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`p-3.5 md:p-4 rounded-2xl border ${
                evaluationScore.percentage >= 80 
                  ? "bg-emerald-100 border-emerald-400 text-emerald-800" 
                  : evaluationScore.percentage >= 50 
                  ? "bg-amber-100 border-amber-400 text-amber-800" 
                  : "bg-red-100 border-red-400 text-red-800"
              }`}>
                <Award className="w-8 h-8 md:w-10 md:h-10 animate-bounce" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl md:text-2xl font-black text-amber-900 font-serif">نتيجة التقييم الفوري:</span>
                  <span className={`text-xl md:text-2xl font-black px-3 py-0.5 rounded-lg ${
                    evaluationScore.percentage >= 80 
                      ? "bg-emerald-200 text-emerald-900" 
                      : evaluationScore.percentage >= 50 
                      ? "bg-amber-200 text-amber-900" 
                      : "bg-red-200 text-red-900"
                  }`}>
                    {evaluationScore.percentage}%
                  </span>
                </div>
                <p className="text-slate-700 text-xs md:text-sm">
                  أجبت بصحة على <strong className="text-emerald-700 text-base">{evaluationScore.correct}</strong> من إجمالي <strong className="text-slate-900 text-base">{evaluationScore.total}</strong> سؤال ونقطة تقييم.
                </p>
              </div>
            </div>

            <div className="text-center md:text-left space-y-2">
              <div className="text-xs text-slate-700 font-bold bg-white px-4 py-2 rounded-xl border border-amber-200 shadow-xs">
                {evaluationScore.percentage >= 80 ? "🌟 ممتاز جداً! فهمت الدرس بجدارة فائقة" : evaluationScore.percentage >= 50 ? "👍 جيد جداً! راجع الأسئلة الموضحة باللون الأحمر" : "📚 تحتاج لمراجعة فقرات الدرس والمحاولة ثانية"}
              </div>
              {evaluationScore.percentage >= 50 && (
                <div className="text-emerald-700 text-xs font-bold flex items-center justify-center md:justify-end gap-1">
                  <Sparkles className="w-4 h-4" />
                  <span>تم إضافة +{Math.round(evaluationScore.percentage / 2)} نقطة خبرة لرصيدك!</span>
                </div>
              )}
            </div>
          </div>

          <div className="w-full bg-amber-100 rounded-full h-3 overflow-hidden border border-amber-200">
            <div 
              className={`h-full transition-all duration-500 ${
                evaluationScore.percentage >= 80 ? "bg-emerald-600" : evaluationScore.percentage >= 50 ? "bg-amber-600" : "bg-red-600"
              }`}
              style={{ width: `${evaluationScore.percentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-amber-900 text-center font-bold">
            👇 تم إظهار التصحيح والإجابة النموذجية المعتمدة لكل سؤال بالأسفل مباشرة سواء كانت إجابتك صحيحة أو خاطئة.
          </p>
        </div>
      )}

      {/* WORKSHEET DISPLAY ZONE (Dynamically Scaled according to Zoom & Screen Width) */}
      {generatedPages.length > 0 && (
        <div 
          className="space-y-8 flex flex-col items-center transition-transform duration-200 origin-top"
          style={{
            transform: zoomScale !== 1 ? `scale(${zoomScale})` : undefined,
            width: zoomScale !== 1 ? `${(100 / zoomScale).toFixed(1)}%` : "100%",
            maxWidth: "100%"
          }}
        >
          {worksheetMode === "print" ? (
            /* =========================================================================
               A. INTERACTIVE A4 PRINTABLE WORKSHEET VIEW (Solvable on real A4 layout)
               ========================================================================= */
            <div className="space-y-8 flex flex-col items-center w-full">
              {!isFullscreen && (
                <div className="no-print text-center pb-1">
                  <span className="text-amber-400 text-xs font-bold bg-amber-950/30 border border-amber-900/40 px-4 py-1.5 rounded-full inline-flex items-center gap-1.5">
                    💡 يمكنك حل الأسئلة مباشرة على ورقة A4 هذه ثم النقر على زر "تصحيح ورقة العمل" بالأعلى لمعرفة نتيجتك!
                  </span>
                </div>
              )}

              {generatedPages.map((page) => (
                <div
                  key={page.pageNumber}
                  id={`printable-page-${page.pageNumber}`}
                  className="relative bg-white text-slate-900 p-5 sm:p-8 md:p-10 border border-slate-300 shadow-2xl rounded-sm w-full max-w-[210mm] min-h-[297mm] overflow-hidden flex flex-col justify-between font-serif selection:bg-slate-200"
                >
                  {/* WATERMARK OVERLAY */}
                  {!removeWatermark && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center opacity-[0.05] select-none z-0">
                      <div className="text-center font-black text-slate-800 rotate-[-35deg] text-3xl sm:text-5xl tracking-widest whitespace-nowrap uppercase leading-none select-none">
                        تاريخ الصف الثاني ثانوي <br />
                        تاريخ الصف الثاني ثانوي <br />
                        تاريخ الصف الثاني ثانوي <br />
                        تاريخ الصف الثاني ثانوي <br />
                        تاريخ الصف الثاني ثانوي
                      </div>
                    </div>
                  )}

                  <div className="relative z-10 space-y-5 flex-1">
                    {/* Header Section */}
                    <div className="border-b-4 border-slate-900 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src="/logo.png" 
                          alt="شعار منصة المناهج التعليمية الإلكترونية" 
                          className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-xs shrink-0" 
                        />
                        <div>
                          <h1 className="text-lg sm:text-xl font-black text-slate-950 tracking-tight flex items-center gap-1.5">
                            <span>ورقة عمل تاريخ السودان وأوروبا الحديث 🏛️</span>
                            <span className="text-[10px] sm:text-[11px] border border-slate-900 text-slate-900 font-sans font-bold px-2 py-0.5 rounded">الصف الثاني ثانوي</span>
                          </h1>
                          <p className="text-[10px] sm:text-[11px] text-slate-600 font-sans mt-0.5 font-medium leading-none">
                            منصة المناهج التعليمية الإلكترونية - بخت الرضا
                          </p>
                        </div>
                      </div>

                      <div className="text-right text-[10px] sm:text-[11px] text-slate-700 font-sans space-y-0.5 border-r-2 sm:border-r-0 sm:border-l-2 border-slate-300 pr-2 sm:pr-0 sm:pl-3">
                        <div>التاريخ: .....................</div>
                        <div>اسم الطالب: .......................................</div>
                        <div>المدرسة: .......................................</div>
                      </div>
                    </div>

                    {/* Metadata Ribbon */}
                    <div className="bg-slate-100 p-2.5 rounded border border-slate-300 flex justify-between items-center text-[10px] sm:text-[11px] text-slate-800 font-sans">
                      <div>
                        <strong>النطاق:</strong> {page.scopeText}
                      </div>
                      <div>
                        <strong>الصفحة:</strong> {page.pageNumber} / {generatedPages.length}
                      </div>
                    </div>

                    {/* Questions List */}
                    <div className="space-y-5 sm:space-y-6 pt-2">
                      {page.questions.map((q, idx) => {
                        const ansKey = `${page.pageNumber}-${idx}`;
                        const userChoice = userAnswers[ansKey] || "";
                        const safeCorrect = typeof q.correctAnswer === "string" ? q.correctAnswer : String(q.correctAnswer || "");
                        const isAnswerCorrect = userChoice && safeCorrect ? userChoice.trim().toLowerCase() === safeCorrect.trim().toLowerCase() : false;

                        return (
                          <div 
                            key={idx} 
                            className={`p-3 sm:p-3.5 rounded-xl border transition-all ${
                              isEvaluated 
                                ? isAnswerCorrect 
                                  ? "bg-emerald-50/70 border-emerald-300" 
                                  : "bg-red-50/70 border-red-300"
                                : "bg-white border-slate-200 hover:border-slate-400"
                            }`}
                          >
                            {/* Question Title */}
                            <div className="font-bold text-xs sm:text-sm text-slate-950 flex items-start gap-2 leading-relaxed">
                              <span className="bg-slate-900 text-white font-sans text-xs px-2 py-0.5 rounded shrink-0">
                                س{idx + 1}
                              </span>
                              <span className="flex-1">{q.text}</span>
                            </div>

                            {/* Options according to type */}
                            <div className="mt-2.5 sm:mt-3 mr-4 sm:mr-7">
                              {/* MCQ */}
                              {q.type === QuestionType.MCQ && q.options && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-sans">
                                  {q.options.map((opt, oIdx) => {
                                    const isSelected = userChoice === opt;
                                    const isThisCorrect = safeCorrect && opt ? opt.trim().toLowerCase() === safeCorrect.trim().toLowerCase() : false;

                                    return (
                                      <button
                                        type="button"
                                        key={oIdx}
                                        disabled={isEvaluated}
                                        onClick={() => {
                                          onPlaySound("click");
                                          setUserAnswers({ ...userAnswers, [ansKey]: opt });
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

                              {/* TRUE / FALSE */}
                              {q.type === QuestionType.TRUE_FALSE && (
                                <div className="flex items-center gap-3 sm:gap-4 text-xs font-sans font-bold">
                                  {["صواب", "خطأ"].map((opt) => {
                                    const isSelected = userChoice === opt;
                                    const isThisCorrect = safeCorrect && opt ? opt.trim().toLowerCase() === safeCorrect.trim().toLowerCase() : false;

                                    return (
                                      <button
                                        type="button"
                                        key={opt}
                                        disabled={isEvaluated}
                                        onClick={() => {
                                          onPlaySound("click");
                                          setUserAnswers({ ...userAnswers, [ansKey]: opt });
                                        }}
                                        className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-lg border transition cursor-pointer ${
                                          isSelected
                                            ? "bg-amber-100 border-amber-600 text-slate-950 font-black shadow-sm"
                                            : "bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100"
                                        } ${isEvaluated && isThisCorrect ? "!border-emerald-600 !bg-emerald-100 font-black" : ""}`}
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

                              {/* FILL IN THE BLANK */}
                              {q.type === QuestionType.FILL_BLANK && (
                                <div className="space-y-1 font-sans">
                                  <input
                                    type="text"
                                    disabled={isEvaluated}
                                    placeholder="اكتب الإجابة في الفراغ هنا..."
                                    value={userChoice}
                                    onChange={(e) => setUserAnswers({ ...userAnswers, [ansKey]: e.target.value })}
                                    className="w-full bg-slate-50 border-b-2 border-slate-400 focus:border-amber-600 px-3 py-1.5 text-xs text-slate-950 outline-none rounded-t"
                                  />
                                </div>
                              )}

                              {/* ESSAY */}
                              {q.type === QuestionType.ESSAY && (
                                <div className="space-y-1 font-sans">
                                  <textarea
                                    disabled={isEvaluated}
                                    placeholder="اكتب إجابتك وصياغتك التاريخية هنا..."
                                    value={userChoice}
                                    onChange={(e) => setUserAnswers({ ...userAnswers, [ansKey]: e.target.value })}
                                    className="w-full h-20 sm:h-24 bg-slate-50 border border-slate-300 focus:border-amber-600 p-2.5 text-xs text-slate-950 outline-none rounded-lg leading-relaxed"
                                  />
                                </div>
                              )}

                              {/* DIAGRAM */}
                              {q.type === "diagram" && q.diagramData && (
                                <div className="space-y-3 font-sans">
                                  <p className="text-[11px] text-slate-700 bg-slate-100 p-2 rounded">
                                    {q.diagramData.description}
                                  </p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    {q.diagramData.labels.map((lbl, lIdx) => {
                                      const selectKey = `${ansKey}-diagram-${lbl.id}`;
                                      const userSelected = userAnswers[selectKey] || "";
                                      const isLblCorrect = userSelected === lbl.name;

                                      return (
                                        <div key={lbl.id} className="flex items-center gap-2 border border-slate-200 bg-slate-50 p-2 rounded">
                                          <span className="w-5 h-5 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">
                                            {lIdx + 1}
                                          </span>
                                          <select
                                            value={userSelected}
                                            disabled={isEvaluated}
                                            onChange={(e) => {
                                              onPlaySound("click");
                                              setUserAnswers({ ...userAnswers, [selectKey]: e.target.value });
                                            }}
                                            className={`w-full bg-white border text-xs rounded px-2 py-1 outline-none ${
                                              isEvaluated 
                                                ? isLblCorrect ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold" : "border-red-500 bg-red-50 text-red-800 font-bold"
                                                : "border-slate-300"
                                            }`}
                                          >
                                            <option value="">-- حدد المسمى الصحيح --</option>
                                            {q.diagramData?.labels.map((lOpt) => (
                                              <option key={lOpt.id} value={lOpt.name}>
                                                {lOpt.name}
                                              </option>
                                            ))}
                                          </select>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* MATCH PAIRS */}
                              {(q.type === QuestionType.MATCH || q.type === "match") && q.matchPairs && (
                                <div className="space-y-2 font-sans">
                                  <p className="text-[11px] text-slate-700 bg-slate-100 p-2 rounded">
                                    صل كل فقرة في القائمة (أ) بما يناسبها من القائمة (ب):
                                  </p>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    {q.matchPairs.map((pair, pIdx) => {
                                      const matchKey = `${ansKey}-match-${pIdx}`;
                                      const selectedVal = userAnswers[matchKey] || "";
                                      const isPairCorrect = selectedVal === pair.right;

                                      return (
                                        <div key={pIdx} className="flex items-center gap-2 border border-slate-200 bg-slate-50 p-2 rounded">
                                          <span className="font-bold text-slate-900 shrink-0">{pair.left}</span>
                                          <span className="text-slate-400">←</span>
                                          <select
                                            value={selectedVal}
                                            disabled={isEvaluated}
                                            onChange={(e) => {
                                              onPlaySound("click");
                                              setUserAnswers({ ...userAnswers, [matchKey]: e.target.value });
                                            }}
                                            className={`w-full bg-white border text-xs rounded px-2 py-1 outline-none ${
                                              isEvaluated
                                                ? isPairCorrect ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold" : "border-red-500 bg-red-50 text-red-800 font-bold"
                                                : "border-slate-300"
                                            }`}
                                          >
                                            <option value="">-- اختر الإجابة --</option>
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
                            </div>

                            {/* MANDATORY ACCREDITED ANSWER CORRECTION BOX (Under EVERY Question) */}
                            {isEvaluated && (
                              <div className={`mt-3 mr-4 sm:mr-7 p-3 rounded-xl border text-xs font-sans space-y-1.5 animate-[fadeIn_0.3s_ease-out] ${
                                q.type === "diagram"
                                  ? "bg-slate-100 border-slate-300"
                                  : isAnswerCorrect
                                  ? "bg-emerald-100/90 border-emerald-400 text-emerald-950"
                                  : "bg-red-100/90 border-red-300 text-red-950"
                              }`}>
                                <div className="flex items-center gap-2 font-bold text-xs">
                                  {q.type === "diagram" ? (
                                    <span className="text-slate-800 flex items-center gap-1">
                                      <Info className="w-4 h-4 text-sky-600" />
                                      <span>مراجعة وتصحيح مكونات الشكل التوضيحي:</span>
                                    </span>
                                  ) : isAnswerCorrect ? (
                                    <span className="text-emerald-800 flex items-center gap-1">
                                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                      <span>✔ إجابتك صحيحة ومطابقة للمنهج!</span>
                                    </span>
                                  ) : (
                                    <span className="text-red-800 flex items-center gap-1">
                                      <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                                      <span>✘ إجابة غير صحيحة {userChoice ? `(إجابتك: ${userChoice})` : "(لم يتم كتابة إجابة)"}</span>
                                    </span>
                                  )}
                                </div>

                                {q.type !== "diagram" && (
                                  <div className="bg-white/80 p-2.5 rounded-lg border border-slate-300/80 space-y-1">
                                    <div className="font-bold text-slate-900 flex items-start gap-1">
                                      <span className="text-emerald-700">✅ الإجابة النموذجية المعتمدة:</span>
                                      <span className="text-slate-950 font-serif whitespace-pre-wrap">{q.correctAnswer}</span>
                                    </div>
                                    {q.explanation && (
                                      <p className="text-[11px] text-slate-600 pt-0.5 border-t border-slate-200">
                                        💡 {q.explanation}
                                      </p>
                                    )}
                                  </div>
                                )}

                                {q.type === "diagram" && q.diagramData && (
                                  <div className="bg-white/80 p-2.5 rounded-lg border border-slate-300 space-y-1">
                                    <span className="font-bold text-slate-900 block mb-1">البيانات الصحيحة للرسم:</span>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                                      {q.diagramData.labels.map((lbl, lIdx) => {
                                        const selectKey = `${ansKey}-diagram-${lbl.id}`;
                                        const val = userAnswers[selectKey] || "";
                                        const isCorr = val === lbl.name;
                                        return (
                                          <div key={lbl.id} className="flex items-center gap-1">
                                            <span>{isCorr ? "🟢" : "🔴"}</span>
                                            <strong>{lIdx + 1}. {lbl.name}</strong>
                                            {!isCorr && <span className="text-red-600 font-sans"> (اخترت: {val || "فارغ"})</span>}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Worksheet Footer */}
                  <div className="relative z-10 border-t border-slate-300 pt-3 mt-6 flex justify-between items-center text-[10px] text-slate-500 font-sans">
                    <div>منصة تاريخ السودان وأوروبا الحديث للصف الثاني ثانوي • تم الحل والتصحيح التفاعلي عبر الموقع</div>
                    <div className="font-bold">كراسة أوراق العمل - المنهج المعتمد</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* =========================================================================
               B. INTERACTIVE SOLVING MODE (Cards Layout)
               ========================================================================= */
            <div className="bg-white rounded-2xl border border-amber-200/90 p-5 md:p-6 space-y-6 shadow-sm w-full text-slate-900">
              <div className="border-b border-amber-100 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-amber-800 font-serif font-extrabold text-lg md:text-xl">
                    📝 نمط حل البطاقات التفاعلي المريح
                  </span>
                  <p className="text-slate-600 text-xs mt-1">
                    أجب على الأسئلة واضغط على "تصحيح ورقة العمل" لعرض الدرجة والإجابات النموذجية.
                  </p>
                </div>
              </div>

              {generatedPages.map((page) => (
                <div key={page.pageNumber} className="bg-amber-50/40 rounded-xl p-4 sm:p-5 border border-amber-200/80 space-y-4">
                  <div className="flex items-center justify-between border-b border-amber-200/60 pb-2">
                    <h4 className="text-slate-800 font-bold text-sm flex items-center gap-2">
                      <span className="w-5 h-5 bg-amber-200 text-amber-900 rounded flex items-center justify-center text-xs font-bold">
                        {page.pageNumber}
                      </span>
                      {page.title}
                    </h4>
                    <span className="text-xs text-slate-600">{page.scopeText}</span>
                  </div>

                  <div className="space-y-4">
                    {page.questions.map((q, idx) => {
                      const ansKey = `${page.pageNumber}-${idx}`;
                      const userChoice = userAnswers[ansKey] || "";
                      const safeCorrect = typeof q.correctAnswer === "string" ? q.correctAnswer : String(q.correctAnswer || "");
                      const isAnswerCorrect = userChoice && safeCorrect ? userChoice.trim().toLowerCase() === safeCorrect.trim().toLowerCase() : false;

                      return (
                        <div key={idx} className="bg-white p-4 rounded-xl border border-amber-200/80 space-y-3 font-sans shadow-xs">
                          <div className="flex items-start gap-2">
                            <span className="bg-amber-100 text-amber-800 font-bold text-xs px-2 py-0.5 rounded shrink-0">
                              س{idx + 1}
                            </span>
                            <span className="text-slate-900 font-semibold text-xs leading-relaxed">
                              {q.text}
                            </span>
                          </div>

                          {/* MCQ */}
                          {q.type === QuestionType.MCQ && q.options && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-serif">
                              {q.options.map((opt) => {
                                const isSelected = userChoice === opt;
                                return (
                                  <button
                                    key={opt}
                                    disabled={isEvaluated}
                                    onClick={() => {
                                      onPlaySound("click");
                                      setUserAnswers({ ...userAnswers, [ansKey]: opt });
                                    }}
                                    className={`text-right p-2.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                                      isSelected
                                        ? "bg-amber-100 border-amber-500 text-amber-900 font-bold shadow-xs"
                                        : "bg-white border-slate-200 hover:border-amber-400 text-slate-800 hover:bg-amber-50/50"
                                    }`}
                                  >
                                    <span>{opt}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* TRUE / FALSE */}
                          {q.type === QuestionType.TRUE_FALSE && (
                            <div className="flex items-center gap-3 pt-1">
                              {["صواب", "خطأ"].map((opt) => {
                                const isSelected = userChoice === opt;
                                return (
                                  <button
                                    key={opt}
                                    disabled={isEvaluated}
                                    onClick={() => {
                                      onPlaySound("click");
                                      setUserAnswers({ ...userAnswers, [ansKey]: opt });
                                    }}
                                    className={`px-4 sm:px-5 py-2 rounded-lg border text-xs font-bold transition cursor-pointer ${
                                      isSelected
                                        ? "bg-amber-100 border-amber-500 text-amber-900 font-black shadow-xs"
                                        : "bg-white border-slate-200 hover:border-amber-400 text-slate-800 hover:bg-amber-50/50"
                                    }`}
                                  >
                                    <span>{opt}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {/* FILL IN THE BLANK */}
                          {q.type === QuestionType.FILL_BLANK && (
                            <div className="pt-1">
                              <input
                                type="text"
                                disabled={isEvaluated}
                                placeholder="اكتب الإجابة في الفراغ..."
                                value={userChoice}
                                onChange={(e) => setUserAnswers({ ...userAnswers, [ansKey]: e.target.value })}
                                className="w-full bg-amber-50/30 border border-amber-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-amber-500"
                              />
                            </div>
                          )}

                          {/* ESSAY */}
                          {q.type === QuestionType.ESSAY && (
                            <div className="pt-1 space-y-2">
                              <textarea
                                disabled={isEvaluated}
                                placeholder="اكتب مقالك التاريخي هنا..."
                                value={userChoice}
                                onChange={(e) => setUserAnswers({ ...userAnswers, [ansKey]: e.target.value })}
                                className="w-full h-20 sm:h-24 bg-amber-50/30 border border-amber-200 rounded-lg p-3 text-xs text-slate-800 focus:outline-none focus:border-amber-500 leading-relaxed"
                              />
                            </div>
                          )}

                          {/* DIAGRAM IN INTERACTIVE MODE */}
                          {q.type === "diagram" && q.diagramData && (
                            <div className="space-y-3 pt-1">
                              <p className="text-[11px] text-slate-700 bg-amber-50/70 p-2.5 rounded-lg border border-amber-200">
                                {q.diagramData.description}
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                {q.diagramData.labels.map((lbl, lIdx) => {
                                  const selectKey = `${ansKey}-diagram-${lbl.id}`;
                                  const userSelected = userAnswers[selectKey] || "";
                                  const isLblCorrect = userSelected === lbl.name;

                                  return (
                                    <div key={lbl.id} className="flex items-center gap-2 border border-amber-200 bg-amber-50/40 p-2 rounded-lg">
                                      <span className="w-5 h-5 bg-amber-800 text-white rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">
                                        {lIdx + 1}
                                      </span>
                                      <select
                                        value={userSelected}
                                        disabled={isEvaluated}
                                        onChange={(e) => {
                                          onPlaySound("click");
                                          setUserAnswers({ ...userAnswers, [selectKey]: e.target.value });
                                        }}
                                        className={`w-full bg-white border text-xs rounded px-2 py-1 outline-none ${
                                          isEvaluated 
                                            ? isLblCorrect ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold" : "border-red-500 bg-red-50 text-red-800 font-bold"
                                            : "border-slate-300"
                                        }`}
                                      >
                                        <option value="">-- حدد المسمى الصحيح --</option>
                                        {q.diagramData?.labels.map((lOpt) => (
                                          <option key={lOpt.id} value={lOpt.name}>
                                            {lOpt.name}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* MATCH PAIRS IN INTERACTIVE MODE */}
                          {(q.type === QuestionType.MATCH || q.type === "match") && q.matchPairs && (
                            <div className="space-y-2 pt-1">
                              <p className="text-[11px] text-slate-600">
                                طابق كل عنصر من القائمة الأولى بما يناسبه من القائمة المقابلة:
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                {q.matchPairs.map((pair, pIdx) => {
                                  const matchKey = `${ansKey}-match-${pIdx}`;
                                  const selectedChoice = userAnswers[matchKey] || "";
                                  const isMatchCorrect = selectedChoice === pair.right;

                                  return (
                                    <div key={pIdx} className="flex items-center gap-2 p-2 rounded-lg border border-amber-200 bg-amber-50/50">
                                      <span className="font-bold text-slate-900 shrink-0">{pair.left}</span>
                                      <span className="text-slate-400">←</span>
                                      <select
                                        value={selectedChoice}
                                        disabled={isEvaluated}
                                        onChange={(e) => {
                                          onPlaySound("click");
                                          setUserAnswers({ ...userAnswers, [matchKey]: e.target.value });
                                        }}
                                        className={`w-full bg-white border text-xs rounded px-2 py-1 outline-none ${
                                          isEvaluated
                                            ? isMatchCorrect ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold" : "border-red-500 bg-red-50 text-red-800"
                                            : "border-slate-300"
                                        }`}
                                      >
                                        <option value="">-- اختر المطابق --</option>
                                        {q.matchPairs?.map((p, optIdx) => (
                                          <option key={optIdx} value={p.right}>
                                            {p.right}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* CORRECTION FEEDBACK */}
                          {isEvaluated && (
                            <div className={`mt-2 p-3 rounded-xl border text-xs space-y-1.5 animate-[fadeIn_0.3s_ease-out] ${
                              isAnswerCorrect 
                                ? "bg-emerald-50 border-emerald-300 text-emerald-900" 
                                : "bg-red-50 border-red-300 text-red-900"
                            }`}>
                              <div className="flex items-center gap-1.5 font-bold">
                                {isAnswerCorrect ? (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    <span>إجابتك صحيحة وممتازة!</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4 text-red-600" />
                                    <span>إجابة غير صحيحة {userChoice ? `(إجابتك: ${userChoice})` : "(لم تجب)"}</span>
                                  </>
                                )}
                              </div>
                              <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1 text-slate-800">
                                <div className="font-bold">
                                  <span className="text-amber-800">الإجابة النموذجية المعتمدة: </span>
                                  <span className="text-slate-900 font-serif whitespace-pre-wrap">{q.correctAnswer}</span>
                                </div>
                                {q.explanation && (
                                  <p className="text-[11px] text-slate-600 pt-0.5 border-t border-slate-200">
                                    💡 {q.explanation}
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
          )}
        </div>
      )}

      {/* EMPTY STATE WHEN NO PAGES GENERATED */}
      {generatedPages.length === 0 && (
        <div className="bg-white rounded-2xl border-2 border-dashed border-amber-300 p-8 sm:p-12 text-center space-y-3 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto text-3xl">
            {scopeType === "favorites" ? "⭐" : "📄"}
          </div>
          <h4 className="font-bold text-amber-950 text-base sm:text-lg font-serif">
            {scopeType === "favorites" 
              ? "لم تقم بتحديد أي درس في المفضلة بعد" 
              : "لا توجد أسئلة كافية مطابقة للخيارات المحددة"}
          </h4>
          <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            {scopeType === "favorites"
              ? "لتوليد ورقة عمل خاصة بدروسك المفضلة، انتقل إلى شاشة الدروس واضغط على رمز النجمة ⭐ بجانب أي درس تريده، وستظهر أوراق عمل مخصصة له هنا مباشرة دون أي أسئلة خارجية."
              : "يرجى تفعيل المزيد من أنواع الأسئلة (اختيار متعدد، صح وخطأ، إكمال فراغات، مقالي) أو اختيار وحدة أو درس آخر لتوليد ورقة العمل."}
          </p>
        </div>
      )}
        </div>
      )}
    </div>
  );
};
