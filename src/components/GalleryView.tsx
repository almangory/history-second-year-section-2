/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from "react";
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  X, 
  BookOpen, 
  MapPin, 
  Search, 
  Sparkles, 
  Info, 
  ChevronRight, 
  ChevronLeft,
  Printer,
  Compass,
  Layers,
  Award,
  ArrowRight
} from "lucide-react";
import { SVGIllustration } from "./SVGIllustrations";
import { Unit } from "../types";

export interface GalleryItem {
  id: string;
  title: string;
  unitId: number;
  unitTitle: string;
  lessonId?: string;
  lessonTitle?: string;
  category: "illustration" | "map" | "architecture" | "invention" | "monument";
  type: string;
  period: string;
  location: string;
  description: string;
  image?: string;
  historicalDetails: {
    title: string;
    description: string;
    curriculumFact: string;
  }[];
  hotspots?: {
    id: string;
    x: number; // percentage 0-100
    y: number; // percentage 0-100
    label: string;
    text: string;
  }[];
}

interface GalleryViewProps {
  units: Unit[];
  onSelectLesson: (unitId: number, lessonIdx: number) => void;
  onPlaySound?: (sound: "click" | "success" | "fail" | "levelup" | "pageflip") => void;
}

export const GALLERY_ITEMS: GalleryItem[] = [
  // --- الوحدة الأولى: تاريخ السودان الحديث ---
  {
    id: "gal_meroë_pyramids",
    title: "أهرامات مروي (البجراوية) والتراث الكوشي العريق",
    unitId: 1,
    unitTitle: "الوحدة الأولى: تاريخ السودان الحديث (١٨٢١ - ١٨٨٥م)",
    lessonId: "u1_l1",
    lessonTitle: "الدرس الأول: الغزو التركي المصري للسودان (١٨٢٠ - ١٨٢١م)",
    category: "monument",
    type: "SudanPyramids",
    image: "/assets/lessons/u1_l1.jpg",
    period: "عصور السودان القديمة ومملكة مروي",
    location: "شندي - البجراوية - ولاية نهر النيل",
    description: "الأهرامات النوبية الخالدة في مروي والبجراوية، شواهد حضارة كوش ومروي القديمة على ضفاف نهر النيل الخالد، والتي عكست عراقة الدولة السودانية قبل الغزو التركي.",
    historicalDetails: [
      {
        title: "العمارة الهندسية المميزة",
        description: "تتميز أهرامات مروي بزواياها الحادة وبواباتها الشرقية المنحوتة المخصصة للطقوس الجنائزية وتخليد ملوك وملكات كوش (الكنداكات).",
        curriculumFact: "تاريخ الدولة في السودان قديم يمتد لحضارات كرمة ونبتة ومروي وسلطنة الفونج والفور قبل عام ١٨٢١م."
      },
      {
        title: "نهر النيل شريان الحياة والنقل",
        description: "كان نهر النيل وسيلة المواصلات والتجارة الرئيسية التي ربطت أقاليم السودان، وسار بمحاذاته جيش إسماعيل باشا في حملة الغزو سنة ١٨٢٠م.",
        curriculumFact: "سلك الجيش الغازي مسار النيل عبر دنقلا والبركل وكورتي حتى شندي وسنار."
      }
    ],
    hotspots: [
      { id: "h1", x: 42, y: 48, label: "الهرم المروي الرئيسي", text: "بني بحجارة رملية مصقولة بزاوية ميلان تقارب ٧٠ درجة مع صالة جنائزية بالمدخل." },
      { id: "h2", x: 68, y: 85, label: "مركب النيل التقليدي", text: "سفن الملاحة النهرية التي استخدمت لنقل البضائع والمحاصيل والجنود عبر شلالات النيل." },
      { id: "h3", x: 50, y: 35, label: "شمس السودان المشرقة", text: "رمز الضياء والخلود والحضارة الإنسانية الضاربة في جذور التاريخ الإفريقي." }
    ]
  },
  {
    id: "gal_khartoum_palace",
    title: "سراي الحكمدارية وتأسيس مدينة الخرطوم عاصمة",
    unitId: 1,
    unitTitle: "الوحدة الأولى: تاريخ السودان الحديث (١٨٢١ - ١٨٨٥م)",
    lessonId: "u1_l2",
    lessonTitle: "الدرس الثاني: تأسيس مدينة الخرطوم عاصمة للسودان وتطورها",
    category: "architecture",
    type: "KhartoumCpt",
    image: "/assets/lessons/u1_l2.jpg",
    period: "١٨٢٤ - ١٨٣٨م (عهد عثمان بك جركس وخورشيد باشا)",
    location: "الخرطوم - مقرن النيلين الأبيض والأزرق",
    description: "مقر الحكمدارية ودواوين الحكومة المركزية في الخرطوم بعد اختيارها عاصمة للسودان عام ١٨٢٤م بدلاً من سنار لموقعها الاستراتيجي عند ملتقى النيلين.",
    historicalDetails: [
      {
        title: "أسباب اختيار الخرطوم عاصمة",
        description: "توسطها الجغرافي لأقاليم السودان، وموقعها الحربي الممتاز المحاط بالمياه الطبيعية، وسهولة الاتصال بالمديريات عبر الملاحة النهرية.",
        curriculumFact: "اختارها عثمان بك جركس سنة ١٨٢٤م وعمرها خورشيد باشا ببناء السراي والمسجد والترسانة النهرية."
      },
      {
        title: "التطور العمراني والإداري",
        description: "شجع خورشيد باشا الأهالي على البناء بالآجر والطوب الأحمر وزودهم بمواد البناء مجاناً وأنشأ ترسانة لصناعة المراكب والسفن النيلية.",
        curriculumFact: "تطورت الخرطوم من قرية صيادين صغيرة إلى مركز تجاري وعسكري وإداري ضخم."
      }
    ],
    hotspots: [
      { id: "k1", x: 50, y: 45, label: "قبة سراي الحكمدارية", text: "مقر الحكمدار العام لإدارة مديريات السودان واستقبال البعثات الدبلوماسية والتجارية." },
      { id: "k2", x: 30, y: 70, label: "أعمدة البناء المشيد بالآجر", text: "الطراز المعماري الذي أدخله خورشيد باشا لتحويل مباني العاصمة إلى مبانٍ ثابتة." },
      { id: "k3", x: 50, y: 92, label: "مقرن النيلين الأزرق والأبيض", text: "ملتقى النهرين العظيمين الذي وفر الحماية العسكرية وسهولة الإمداد المائي والملاحي." }
    ]
  },
  {
    id: "gal_sudan_map_1821",
    title: "خريطة مسار الغزو وحملات السودان (١٨٢٠ - ١٨٨٥م)",
    unitId: 1,
    unitTitle: "الوحدة الأولى: تاريخ السودان الحديث (١٨٢١ - ١٨٨٥م)",
    lessonId: "u1_l1",
    lessonTitle: "الدرس الأول: الغزو التركي المصري للسودان (١٨٢٠ - ١٨٢١م)",
    category: "map",
    type: "HistoricSudanMap",
    period: "١٨٢٠ - ١٨٧٤م",
    location: "جمهورية السودان (النيل، سنار، كردفان، دارفور، التاكا)",
    description: "خريطة جغرافية تاريخية توضح أهم المدن والمواقع: دنقلا، كورتي، بربر، المتمة، شندي، الخرطوم، سنار، بارا، الأبيض، والفاشر بدارفور.",
    historicalDetails: [
      {
        title: "محاور الحملة العسكرية",
        description: "انطلقت الحملة الأولى بقيادة إسماعيل باشا بمحاذاة النيل حتى سنار، بينما قاد محمد بك الدفتدار حملة كردفان عبر الصحراء حتى الأبيض.",
        curriculumFact: "وقعت معركة كورتي في نوفمبر ١٨٢٠م ضد الشايقية، وسقطت سنار في يونيو ١٨٢١م، وبارا في كردفان."
      },
      {
        title: "ضم دارفور عام ١٨٧٤م",
        description: "قاد الزبير ود رحمة جيشه لضم سلطنة دارفور بعد معركة منواشي واستشهاد السلطان إبراهيم قرض لتكتمل حدود السودان الإدارية.",
        curriculumFact: "حكمت سلطنة الفور إقليم دارفور منذ ١٦٤٠م وعاصمتها الفاشر حتى ضمت سنة ١٨٧٤م."
      }
    ],
    hotspots: [
      { id: "sm1", x: 52, y: 48, label: "الخرطوم - العاصمة", text: "تأسست ١٨٢٤م عند ملتقى النيلين الأبيض والأزرق." },
      { id: "sm2", x: 56, y: 64, label: "سنار - عاصمة الفونج", text: "سقطت سلطنة الفونج (السلطنة الزرقاء) بدخول جيش إسماعيل باشا في يونيو ١٨٢١م." },
      { id: "sm3", x: 54, y: 38, label: "شندي والمك نمر", text: "شهدت حرق إسماعيل باشا عام ١٨٢٢م رداً على غطرسته وطلباته التعجيزية." },
      { id: "sm4", x: 28, y: 55, label: "الفاشر - سلطنة الفور", text: "عاصمة سلطنة الفور المستقلة منذ ١٦٤٠م وضمت للحكمدارية عام ١٨٧٤م." }
    ]
  },

  {
    id: "gal_khartoum_school_1853",
    title: "أول مدرسة حديثة في الخرطوم ورفاعة رافع الطهطاوي (١٨٥٣م)",
    unitId: 1,
    unitTitle: "الوحدة الأولى: تاريخ السودان الحديث (١٨٢١ - ١٨٨٥م)",
    lessonId: "u1_l3",
    lessonTitle: "الدرس الثالث: التعليم والقضاء في العهد التركي المصري",
    category: "monument",
    type: "SchoolKhartoum",
    image: "/assets/lessons/u1_l3.jpg",
    period: "١٨٥٣م (عهد الخديوي عباس الأول)",
    location: "الخرطوم - حوض النيل",
    description: "تأسيس أول مدرسة ابتدائية نظامية حديثة في السودان برئاسة العالم التنويري الشيخ رفاعة رافع الطهطاوي، لتدريس الحساب واللغات والعلوم الحديثة لأبناء السودان.",
    historicalDetails: [
      {
        title: "دور رفاعة رافع الطهطاوي",
        description: "أشرف الطهطاوي على تنظيم المناهج وتوفير الكتب وترجمة المعارف، وفتح أبواب التعليم النظامي الحديث لأول مرة.",
        curriculumFact: "افتتحت أول مدرسة حديثة في الخرطوم عام ١٨٥٣م في عهد عباس الأول وتولى إدارتها رفاعة رافع الطهطاوي."
      }
    ]
  },
  {
    id: "gal_suakin_telegraph",
    title: "ميناء سواكن التاريخي وشبكة التلغراف في عهد إسماعيل",
    unitId: 1,
    unitTitle: "الوحدة الأولى: تاريخ السودان الحديث (١٨٢١ - ١٨٨٥م)",
    lessonId: "u1_l4",
    lessonTitle: "الدرس الرابع: السودان في عهد الخديوي إسماعيل (١٨٦٣ - ١٨٧٩م)",
    category: "architecture",
    type: "SuakinPort",
    image: "/assets/lessons/u1_l4.jpg",
    period: "١٨٦٣ - ١٨٧٩م (عهد الخديوي إسماعيل)",
    location: "سواكن - البحر الأحمر والخرطوم",
    description: "تطوير جزيرة وميناء سواكن التاريخي بالحجر المرجاني، ومد خطوط التلغراف السلكي لربط مدن السودان بالخرطوم ومصر والعالم الخارجي.",
    historicalDetails: [
      {
        title: "تطوير ميناء سواكن والاتصالات",
        description: "شهد عهد إسماعيل إنشاء الميناء التجاري ومد خطوط التلغراف لتسريع الاتصال الإداري والأمني بين المديريات.",
        curriculumFact: "توسعت خطوط التلغراف في عهد إسماعيل لتشمل الخرطوم وشندي وبربر ودنقلا وسواكن ومصوع."
      }
    ]
  },
  {
    id: "gal_gordon_palace_1877",
    title: "حكمدارية غردون باشا في الخرطوم وسياسات نهاية الحكم التركي",
    unitId: 1,
    unitTitle: "الوحدة الأولى: تاريخ السودان الحديث (١٨٢١ - ١٨٨٥م)",
    lessonId: "u1_l5",
    lessonTitle: "الدرس الخامس: نهاية الحكم التركي المصري في السودان",
    category: "monument",
    type: "GordonKhartoum",
    image: "/assets/lessons/u1_l5.jpg",
    period: "١٨٧٧ - ١٨٨٠م (حكمدارية غردون الأولى)",
    location: "الخرطوم - سراي الحكمدارية",
    description: "حكمدارية الجنرال البريطاني تشارلز غردون في قصر الخرطوم، والتوترات المتصاعدة الناتجة عن الضرائب الباهظة واحتكار التجارة التي مهدت لاندلاع الثورة المهدية.",
    historicalDetails: [
      {
        title: "أسباب نقمة الأهالي وسقوط النظام",
        description: "أدى الاستعانة بالموظفين الأجانب وفرض الضرائب القاسية وتراجع الأوضاع المعيشية إلى تهيئة الظروف لإعلان الثورة المهدية عام ١٨٨١م.",
        curriculumFact: "عين غردون باشا حكمداراً عاماً للسودان عام ١٨٧٧م واشتدت في عهده الأزمات المالية والإدارية."
      }
    ]
  },

  // --- الوحدة الثانية: لمحات من تاريخ السودان الحديث والمعاصر (١٩٥٥ - ١٩٨٥م) ---
  {
    id: "gal_sudan_independence_1956",
    title: "رفع علم استقلال السودان بالقصر الجمهوري (١ يناير ١٩٥٦م)",
    unitId: 2,
    unitTitle: "الوحدة الثانية: لمحات من تاريخ السودان الحديث والمعاصر (١٩٥٥ - ١٩٨٥م)",
    lessonId: "u2_l1",
    lessonTitle: "الدرس الأول: استقلال السودان (١٩٥٦م) والحركة الوطنية",
    category: "monument",
    type: "NationalSovereignty",
    image: "/assets/lessons/u2_l1.jpg",
    period: "١ يناير ١٩٥٦م",
    location: "الخرطوم - سراي القصر الجمهوري",
    description: "لحظة تاريخية خالدة شهدت إنزال العلمين البريطاني والمصري ورفع علم استقلال جمهورية السودان ذي الألوان الثلاثة (الأزرق والأصفر والأخضر) إيذاناً بالسيادة الوطنية الكاملة.",
    historicalDetails: [
      {
        title: "إعلان الاستقلال من داخل البرلمان",
        description: "في التاسع عشر من ديسمبر ١٩٥٥م وافق نواب البرلمان السوداني بالإجماع على إعلان استقلال السودان كدولة حرة مستقلة ذات سيادة.",
        curriculumFact: "أعلن الاستقلال من داخل البرلمان في ١٩ ديسمبر ١٩٥٥م ونال الاعتراف الدولي التام في ١ يناير ١٩٥٦م."
      },
      {
        title: "مراسم رفع العلم الوطني",
        description: "قام الرئيس إسماعيل الأزهري ومعه زعيم المعارضة محمد أحمد المحجوب برفع علم الاستقلال وسط فرحة الجماهير السودانية.",
        curriculumFact: "رمز اللون الأزرق لنهر النيل، والأصفر للصحراء والثروات، والأخضر للزراعة والنماء."
      }
    ],
    hotspots: [
      { id: "ind1", x: 50, y: 30, label: "سارية علم الاستقلال", text: "شهدت رفع علم السودان وإنزال علمي الحكم الثنائي في احتفال رسمي مهيب." },
      { id: "ind2", x: 45, y: 70, label: "قادة الحركة الوطنية", text: "اجتماع قادة الأحزاب الوطنية في مشهد توحد تاريخي لإنهاء الاستعمار." },
      { id: "ind3", x: 75, y: 65, label: "قصر الشعب والسيادة", text: "مقر الحكم الوطني الذي أصبح رمزاً لعزة الشعب السوداني واستقلاله." }
    ]
  },
  {
    id: "gal_sudan_parliament_1955",
    title: "مبنى البرلمان السوداني بأم درمان والحياة النيابية (١٩٥٥ - ١٩٨٥م)",
    unitId: 2,
    unitTitle: "الوحدة الثانية: لمحات من تاريخ السودان الحديث والمعاصر (١٩٥٥ - ١٩٨٥م)",
    lessonId: "u2_l2",
    lessonTitle: "الدرس الثاني: الحكومات المتعاقبة على السودان (١٩٥٥ - ١٩٨٥م)",
    category: "architecture",
    type: "Building",
    image: "/assets/lessons/u2_l2.jpg",
    period: "١٩٥٥ - ١٩٨٥م",
    location: "أم درمان - قبالة ملتقى النيلين",
    description: "صرح الديمقراطية السودانية العريق الذي شهد جلسات إعلان الاستقلال وتداول السلطة بين النظم الديمقراطية والانقلابات العسكرية وثورتي أكتوبر ١٩٦٤م وأبريل ١٩٨٥م.",
    historicalDetails: [
      {
        title: "الجلسة التاريخية لإعلان الاستقلال",
        description: "شهدت قاعة البرلمان الإجماع التاريخي لنواب الشعب على المطالبة باستقلال السودان التام عن دولتي الحكم الثنائي.",
        curriculumFact: "تقدم النائب عبد الرحمن محمد إبراهيم دبكة باقتراح إعلان الاستقلال وثناه النائب مشاور جمعة سهل."
      },
      {
        title: "مسار التداول السياسي والأنظمة",
        description: "عايش البرلمان الفترات الديمقراطية الثلاث وحكومات الفريق عبود (١٩٥٨م) واللواء جعفر نميري (١٩٦٩م) حتى انتفاضة رجب - أبريل ١٩٨٥م.",
        curriculumFact: "سقط نظام الفريق عبود في ثورة ٢١ أكتوبر ١٩٦٤م الشعبية، ونظام نميري في انتفاضة ٦ أبريل ١٩٨٥م."
      }
    ],
    hotspots: [
      { id: "par1", x: 50, y: 40, label: "قبة البرلمان والمنصة", text: "منصة إلقاء الخطابات التاريخية وتصويت نواب الشعب على القوانين والموازنات." },
      { id: "par2", x: 30, y: 60, label: "مقاعد النواب والكتل", text: "تمثيل الدوائر الجغرافية والخريجين من سائر أرجاء مديريات السودان." }
    ]
  },
  {
    id: "gal_gezira_development_projects",
    title: "مشروعات التنمية الاقتصادية الكبرى وسد الروصيرص (١٩٥٥ - ١٩٨٥م)",
    unitId: 2,
    unitTitle: "الوحدة الثانية: لمحات من تاريخ السودان الحديث والمعاصر (١٩٥٥ - ١٩٨٥م)",
    lessonId: "u2_l3",
    lessonTitle: "الدرس الثالث: ملامح التطور الاجتماعي الاقتصادي في السودان (١٩٥٥ - ١٩٨٥م)",
    category: "illustration",
    type: "SudanGeography",
    image: "/assets/lessons/u2_l3.jpg",
    period: "١٩٥٥ - ١٩٨٥م",
    location: "مشروع الجزيرة، خزان الروصيرص، وسكر كنانة",
    description: "النهضة التنموية الكبرى عبر امتداد المناقل لمشروع الجزيرة، وتشييد سد الروصيرص على النيل الأزرق عام ١٩٦٦م، وإنشاء كبرى مصانع السكر في كنانة وعسلاية وغرب سنار.",
    historicalDetails: [
      {
        title: "مشروع امتداد المناقل وسد الروصيرص",
        description: "ضاعف امتداد المناقل المساحة الزراعية المروية بمشروع الجزيرة، ومكن خزان الروصيرص من تأمين مياه الري وتوليد الطاقة الكهرومائية.",
        curriculumFact: "شيد خزان الروصيرص عام ١٩٦٦م بسعة تخزينية ضخمة لدعم الزراعة المروية وتوليد الكهرباء."
      },
      {
        title: "صناعة السكر والنسيج والنقل",
        description: "شهد السودان تشييد مجمع سكر كنانة الرائد ومصانع الجنيد وعسلاية، وتوسيع شبكة السكك الحديدية والنقل النهري والبري.",
        curriculumFact: "توسعت شبكة سكك حديد السودان لتربط مراكز الإنتاج في الجزيرة وغرب السودان بميناء بورتسودان."
      }
    ],
    hotspots: [
      { id: "dev1", x: 48, y: 45, label: "قنوات الري الانسيابي", text: "شبكة ترع المناقل والجزيرة العملاقة التي تروي ملايين الأفدنة." },
      { id: "dev2", x: 70, y: 70, label: "سد وخزان الروصيرص", text: "حجز مياه الفيضان وتوليد الكهرباء لتغذية الشبكة القومية والمصانع." },
      { id: "dev3", x: 25, y: 55, label: "محالج القطن ومصانع السكر", text: "الصناعات التحويلية الوطنية لتحقيق القيمة المضافة للاقتصاد السوداني." }
    ]
  },
  {
    id: "gal_addis_ababa_accord_1972",
    title: "اتفاقية أديس أبابا للسلام والحكم الذاتي الإقليمي (١٩٧٢م)",
    unitId: 2,
    unitTitle: "الوحدة الثانية: لمحات من تاريخ السودان الحديث والمعاصر (١٩٥٥ - ١٩٨٥م)",
    lessonId: "u2_l4",
    lessonTitle: "الدرس الرابع: تطورات مشكلة جنوب السودان (١٩٥٥ - ١٩٨٥م)",
    category: "monument",
    type: "Citizenship",
    image: "/assets/lessons/u2_l4.jpg",
    period: "مارس ١٩٧٢م",
    location: "أديس أبابا (إثيوبيا) والمديريات الجنوبية",
    description: "الاتفاق التاريخي الذي أوقف الحرب الأهلية الأولى بعد ١٧ عاماً من الصراع، ومنح مديريات جنوب السودان حكماً ذاتياً إقليمياً ومجلساً تشريعياً وتنفيذياً عالي المستوى.",
    historicalDetails: [
      {
        title: "بنود الاتفاقية وإدارة الجنوب",
        description: "نصت الاتفاقية على إنشاء المجلس التنفيذي العالي برئاسة إبل ألير، وإدماج ستة آلاف من قوات الأنيانيا في الجيش السوداني.",
        curriculumFact: "وقعت اتفاقية أديس أبابا في مارس ١٩٧٢م بين حكومة السودان وحركة تحرير جنوب السودان بقيادة جوزيف لاقو."
      },
      {
        title: "مكتسبات السلام وعودة اللاجئين",
        description: "أتاحت الاتفاقية إعادة توطين مئات الآلاف من النازحين واللاجئين وفتح المدارس والمستشفيات وبدء مشروعات الإعمار.",
        curriculumFact: "استمر السلام والاستقرار في جنوب السودان طوال أحد عشر عاماً حتى تجدد النزاع عام ١٩٨٣م."
      }
    ],
    hotspots: [
      { id: "peace1", x: 50, y: 35, label: "وثيقة السلام والتوقيع", text: "التوقيع الدبلوماسي بحضور وساطة مجلس الكنائس والحكومة الإثيوبية." },
      { id: "peace2", x: 50, y: 70, label: "حمامة السلام والمصالحة", text: "رمز إنهاء الاقتتال الداخلي وتوحيد الجهود نحو التنمية المشتركة." }
    ]
  },

  // --- الوحدة الثالثة: تاريخ أوروبا الحديث ---
  {
    id: "gal_feudal_medieval_europe",
    title: "قلاع العصور الوسطى والنظام الإقطاعي الأوروبي",
    unitId: 3,
    unitTitle: "الوحدة الثالثة: تاريخ أوروبا الحديث",
    lessonId: "u3_l1",
    lessonTitle: "الدرس الأول: العصور الوسطى في أوروبا والنظام الإقطاعي",
    category: "architecture",
    type: "Building",
    image: "/assets/lessons/u3_l1.jpg",
    period: "القرن الخامس إلى الخامس عشر الميلادي",
    location: "أوروبا الغربية والوسطى",
    description: "القلاع الحصينة للأمراء والفرسان الإقطاعيين، التي جسدت طبيعة العصور الوسطى الأوروبية القائمة على تفتت السلطة المركزية، وهيمنة الكنيسة، ونظام إقطاع الأرض وعمال السخرة (الأقنان).",
    historicalDetails: [
      {
        title: "أركان النظام الإقطاعي",
        description: "قام الإقطاع على ملكية الأرض، حيث قسم المجتمع إلى كبار الملاك النبلاء والفرسان المقاتلين ورجال الدين وعامة الفلاحين الأقنان المحرومين.",
        curriculumFact: "تميزت العصور الوسطى في أوروبا بالجمود الفكري والانقسام السياسي وهيمنة الكنيسة الكاثوليكية."
      },
      {
        title: "عمارة القلاع والدفاع العسكري",
        description: "بنيت القلاع فوق المرتفعات وأحيطت بالخنادق المائية والأسوار الشاهقة والأبراج للدفاع ضد الغزوات والحروب الإقطاعية المتكررة.",
        curriculumFact: "كانت القلعة مركز الإدارة والقضاء والتحصن العسكري لكل إقطاعية مستقلة."
      }
    ],
    hotspots: [
      { id: "cst1", x: 50, y: 30, label: "برج القلعة الحصين", text: "معقل السيد الإقطاعي ومركز القيادة والمراقبة العسكرية." },
      { id: "cst2", x: 30, y: 65, label: "الأسوار والخنادق المائية", text: "تحصينات دفاعية معقدة لمنع تسلق المهاجمين وحصار القلعة." }
    ]
  },
  {
    id: "gal_gutenberg_printing_press",
    title: "مطبعة يوهان جوتنبرج وانطلاق عصر النهضة الأوروبية (١٤٥٠م)",
    unitId: 3,
    unitTitle: "الوحدة الثالثة: تاريخ أوروبا الحديث",
    lessonId: "u3_l2",
    lessonTitle: "الدرس الثاني: النهضة الأوروبية (العوامل، المظاهر، الفنون والآداب)",
    category: "invention",
    type: "RenaissanceArts",
    image: "/assets/lessons/u3_l2.jpg",
    period: "حوالي ١٤٥٠م",
    location: "ماينتس - ألمانيا وانتشرت في سائر أوروبا",
    description: "أعظم اختراع تقني ساهم في بزوغ العصر الحديث؛ ابتكار الحروف المعدنية المتحركة والمكبس اليدوي، مما أدى إلى طباعة الكتب بآلاف النسخ وكسر احتكار المعرفة ونشر العلوم والآداب الإنسانية.",
    historicalDetails: [
      {
        title: "ثورة الطباعة ونشر الثقافة",
        description: "مكنت مطبعة جوتنبرج من نسخ آلاف الكتب بتكلفة زهيدة وسرعة فائقة مقارنة بالنسخ اليدوي البطيء على الرقوق النادرة.",
        curriculumFact: "كان اختراع الطباعة سنة ١٤٥٠م من أبرز عوامل قيام النهضة الأوروبية ونشر أفكار الإنسانيين."
      },
      {
        title: "إحياء التراث والعلوم التجريبية",
        description: "أسهمت الطباعة في تداول كتب التراث اليوناني والروماني والإسلامي المترجمة وإشعال شعلة التفكير العلمي الحر.",
        curriculumFact: "انتقلت المطابع سريعاً إلى إيطاليا وفرنسا وإنجلترا لتؤسس لعصر المعرفة الحديث."
      }
    ],
    hotspots: [
      { id: "gut1", x: 45, y: 40, label: "مكبس الطباعة اليدوي", text: "مستوحى من معاصر العنب لضغط الصفحات المعدنية بالحبر على الورق." },
      { id: "gut2", x: 65, y: 60, label: "أحرف الطباعة المتحركة", text: "سبائك رصاصية دقيقة تصطف لتشكل الكلمات والأسطر ويعاد استخدامها." }
    ]
  },
  {
    id: "gal_age_of_discovery_caravel",
    title: "سفن الكارافيل وحركة الكشوف الجغرافية الكبرى (القرنان ١٥ و١٦م)",
    unitId: 3,
    unitTitle: "الوحدة الثالثة: تاريخ أوروبا الحديث",
    lessonId: "u3_l3",
    lessonTitle: "الدرس الثالث: الكشوف الجغرافية الأوروبية الكبرى",
    category: "map",
    type: "GeographicDiscoveries",
    image: "/assets/lessons/u3_l3.jpg",
    period: "القرنان الخامس عشر والسادس عشر الميلادي",
    location: "المحيط الأطلسي والهندي والهادئ",
    description: "سفن الكارافيل البرتغالية والإسبانية ذات الأشرعة المثلثة التي واجهت أعاصير المحيطات المجهولة، وحققت اكتشاف طريق رأس الرجاء الصالح، والوصول إلى الهند والأمريكيتين والدوران حول الأرض.",
    historicalDetails: [
      {
        title: "دوافع الكشوف وتطور الملاحة",
        description: "دفعت الرغبة في كسر الاحتكار التجاري للشرق وتطور البوصلة والأسطرلاب الملاحين لركوب أعالي البحار.",
        curriculumFact: "اكتشف فاسكو دا جاما طريق رأس الرجاء الصالح إلى الهند سنة ١٤٩٨م، ووصل كولمبس لأمريكا ١٤٩٢م."
      },
      {
        title: "النتائج الجيوسياسية والاقتصادية",
        description: "انتقل مركز التجارة العالمية من البحر المتوسط إلى المحيط الأطلسي، وتدفقت المعادن الثمينة ونشأت الإمبراطوريات الاستعمارية الكبرى.",
        curriculumFact: "أثبتت رحلة ماجلان ودلكانو (١٥١٩ - ١٥٢٢م) كروية الأرض عملياً بالدوران الكامل حولها."
      }
    ],
    hotspots: [
      { id: "drv1", x: 50, y: 45, label: "أشرعة الكارافيل اللاتينية", text: "أشرعة مثلثية سمحت بالملاحة ضد اتجاه الرياح في المحيطات المفتوحة." },
      { id: "drv2", x: 30, y: 70, label: "البوصلة والأسطرلاب", text: "أدوات ملاحية دقيقة استعيرت وتطورت لتحديد خطوط العرض والاتجاهات." }
    ]
  },
  {
    id: "gal_french_revolution_bastille",
    title: "اقتحام سجن الباستيل وسقوط النظام الملكي الإقطاعي (١٤ يوليو ١٧٨٩م)",
    unitId: 3,
    unitTitle: "الوحدة الثالثة: تاريخ أوروبا الحديث",
    lessonId: "u3_l4",
    lessonTitle: "الدرس الرابع: الثورة الفرنسية سنة ١٧٨٩م",
    category: "monument",
    type: "NationalSovereignty",
    image: "/assets/lessons/u3_l4.jpg",
    period: "١٤ يوليو ١٧٨٩م",
    location: "باريس - فرنسا",
    description: "الحدث المزلزل الذي هز أركان الحكم المطلق في أوروبا؛ استيلاء ثوار باريس على قلعة وسجن الباستيل رمز الظلم والاستبداد، وبداية إعلان وثيقة حقوق الإنسان والمواطن والحرية والمساواة.",
    historicalDetails: [
      {
        title: "أسباب انفجار الثورة الفرنسية",
        description: "استبداد الملك لويس السادس عشر، والامتيازات الإقطاعية للنبلاء والإكليروس، والأزمة المالية الخانقة التي أثقلت كاهل الطبقة الثالثة.",
        curriculumFact: "أصدرت الجمعية الوطنية إعلان حقوق الإنسان والمواطن في أغسطس ١٧٨٩م تحت شعار (حرية، إخاء، مساواة)."
      },
      {
        title: "أثر الثورة على العالم الحديث",
        description: "ألغت النظام الإقطاعي وامتيازات النبلاء، وأسست لمبادئ الديمقراطية والسيادة الشعبية والحكم الدستوري في سائر أوروبا.",
        curriculumFact: "يعد يوم ١٤ يوليو (يوم سقوط الباستيل) العيد القومي لفرنسا ورمزاً عالمياً للتحرر من الاستبداد."
      }
    ],
    hotspots: [
      { id: "fr_b1", x: 50, y: 35, label: "أسوار وأبراج الباستيل", text: "رمز الطغيان الملكي الذي سقط في قبضة ثوار باريس وهُدمت أبراجه." },
      { id: "fr_b2", x: 55, y: 75, label: "جموع الشعب والطبقة الثالثة", text: "الحراك الشعبي الذي قاد الجمعية الوطنية لإعلان السيادة للشعب." }
    ]
  },
  {
    id: "gal_industrial_revolution_steam",
    title: "محرك جيمس وات البخاري وانطلاق الثورة الصناعية (القرن ١٨م)",
    unitId: 3,
    unitTitle: "الوحدة الثالثة: تاريخ أوروبا الحديث",
    lessonId: "u3_l5",
    lessonTitle: "الدرس الخامس: الثورة الصناعية في أوروبا",
    category: "invention",
    type: "SteamEngine",
    image: "/assets/lessons/u3_l5.jpg",
    period: "القرن الثامن عشر والتاسع عشر الميلادي",
    location: "بريطانيا وأوروبا الغربية",
    description: "الانقلاب التقني والصناعي الشامل؛ اختراع المحرك البخاري ذي المكثف المنفصل على يد جيمس وات، مما مكن من استبدال القوة العضلية والحيوانية بالقوة الآلية وتشغيل المصانع والسكك الحديدية.",
    historicalDetails: [
      {
        title: "عوامل انطلاق الثورة في بريطانيا",
        description: "وفرة مناجم الفحم الحجري والحديد، ورؤوس الأموال المتراكمة، والاستقرار السياسي، والأسواق الواسعة للغزل والنسيج.",
        curriculumFact: "طور جيمس وات المحرك البخاري عام ١٧٦٩م ليصبح القوة المحركة الكبرى للمصانع والقطارات والسفن."
      },
      {
        title: "النتائج الاقتصادية والاجتماعية",
        description: "ظهور المصانع الكبرى ونمو المدن الصناعية، وظهور طبقة أصحاب الأعمال (الرأسمالية) والطبقة العاملة (البروليتاريا).",
        curriculumFact: "أحدث قطار جورج ستيفنسون البخاري عام ١٨١٤م ثورة هائلة في سرعة نقل البضائع والركاب."
      }
    ],
    hotspots: [
      { id: "stm1", x: 45, y: 35, label: "أسطوانة البخار والمكبس", text: "تحويل ضغط البخار المتولد من غليان الماء إلى حركة ترددية ثم دورانية منتظمة." },
      { id: "stm2", x: 70, y: 65, label: "عجلة الموازنة والتروس", text: "نقل الحركة الدورانية الميكانيكية لإدارة نول النسيج ومضخات المناجم." }
    ]
  },
  {
    id: "gal_italian_unification_garibaldi",
    title: "حركة البعث الإيطالي (الريسورجيمنتو) وتوحيد إيطاليا (١٨١٥ - ١٨٧٠م)",
    unitId: 3,
    unitTitle: "الوحدة الثالثة: تاريخ أوروبا الحديث",
    lessonId: "u3_l6",
    lessonTitle: "الدرس السادس: الوحدة الإيطالية (١٨١٥ - ١٨٧٠م)",
    category: "monument",
    type: "NationalSovereignty",
    image: "/assets/lessons/u3_l6.jpg",
    period: "١٨٥٩ - ١٨٧٠م",
    location: "تورينو، نابولي، وروما - شبه الجزيرة الإيطالية",
    description: "ملحمة التوحيد القومي الإيطالي التي قادتها مملكة بيدمونت وسردينيا بزعامة الملك فيكتور عمانويل ورئيس وزرائه كافور والقائد الشعبي جوزيبي غاريبالدي بكتائب القمصان الحمر حتى استرداد روما عاصمة موحدة.",
    historicalDetails: [
      {
        title: "أقطاب حركة التوحيد الإيطالي",
        description: "تضافر الفكر القومي لمازيني، والدبلوماسية والتحالفات لكافور، والشجاعة العسكرية لغاريبالدي وحملة الألف مقاتل لصقلية ونابولي.",
        curriculumFact: "قاد كافور السياسة الدبلوماسية لبيدمونت، بينما قاد غاريبالدي حملة القمصان الحمر لتحرير جنوب إيطاليا."
      },
      {
        title: "اكتمال الوحدة وجعل روما عاصمة",
        description: "أعلنت مملكة إيطاليا الموحدة عام ١٨٦١م، واكتملت الوحدة بضم البندقية عام ١٨٦٦م ودخول روما عام ١٨٧٠م لتصبح العاصمة الأبدية.",
        curriculumFact: "أصبحت روما عاصمة لإيطاليا الموحدة عام ١٨٧٠م بعد انسحاب الحامية الفرنسية خلال الحرب السبعينية."
      }
    ],
    hotspots: [
      { id: "it1", x: 45, y: 40, label: "راية إيطاليا الموحدة", text: "العلم الإيطالي ثلاثي الألوان رمز الاستقلال والسيادة القومية." },
      { id: "it2", x: 60, y: 65, label: "القائد غاريبالدي والمتطوعون", text: "كتائب القمصان الحمر التي أسقطت حكم أسرة بوربون في صقلية ونابولي." }
    ]
  },
  {
    id: "gal_german_unification_versailles",
    title: "إعلان قيام الإمبراطورية الألمانية بقصر فرساي والمستشار بسمارك (١٨٧١م)",
    unitId: 3,
    unitTitle: "الوحدة الثالثة: تاريخ أوروبا الحديث",
    lessonId: "u3_l7",
    lessonTitle: "الدرس السابع: الوحدة الألمانية وسياسة الحديد والدم (١٨١٥ - ١٨٧١م)",
    category: "monument",
    type: "Building",
    image: "/assets/lessons/u3_l7.jpg",
    period: "١٨ يناير ١٨٧١م",
    location: "قاعة المرايا - قصر فرساي",
    description: "تتويج المشروع القومي الألماني بزعامة مملكة بروسيا ومستشارها الفولاذي أوتو فون بسمارك؛ تتويج فيلهلم الأول إمبراطوراً لألمانيا الموحدة بقاعة المرايا بفرساي وإعادة رسم الخارطة السياسية الأوروبية.",
    historicalDetails: [
      {
        title: "سياسة الحديد والدم والحروب الثلاث",
        description: "وظف بسمارك القوة العسكرية البروسية والصناعة المتطورة لخوض ٣ حروب مدروسة: حرب الدانمارك ١٨٦٤م، حرب النمسا (سادوا) ١٨٦٦م، وحرب فرنسا (سيدان) ١٨٧٠م.",
        curriculumFact: "قاد أوتو فون بسمارك الملقب بـ (المستشار الحديدي) سياسة الحديد والدم لتوحيد ألمانيا تحت زعامة بروسيا."
      },
      {
        title: "إعلان الرايخ الألماني في فرساي",
        description: "تم إعلان الإمبراطورية في قلب فرنسا بعد هزيمة نابليون الثالث، وأصبحت ألمانيا أقوى قوة عسكرية واقتصادية في القارة الأوروبية.",
        curriculumFact: "توج فيلهلم الأول قيصراً لألمانيا في ١٨ يناير ١٨٧١م بقاعة المرايا في قصر فرساي."
      }
    ],
    hotspots: [
      { id: "ger1", x: 50, y: 35, label: "قاعة المرايا بفرساي", text: "شهدت إعلان الإمبراطورية الألمانية ورفع الرايات العسكرية للولايات الألمانية." },
      { id: "ger2", x: 45, y: 65, label: "المستشار بسمارك والقيصر", text: "مهندس الوحدة الألمانية الذي فرض هيبة ألمانيا في قلب القارة الأوروبية." }
    ]
  },

  // --- الوحدة الرابعة: الصراع الأوروبي حول التوسع الاستعماري ---
  {
    id: "gal_ww1_trenches_versailles",
    title: "جبهات الحرب العالمية الأولى وتوقيع معاهدة فرساي (١٩١٤ - ١٩١٩م)",
    unitId: 4,
    unitTitle: "الوحدة الرابعة: الصراع الأوروبي حول التوسع الاستعماري",
    lessonId: "u4_l1",
    lessonTitle: "الدرس الأول: الحرب العالمية الأولى (١٩١٤ - ١٩١٨م)",
    category: "illustration",
    type: "NationalSovereignty",
    image: "/assets/lessons/u4_l1.jpg",
    period: "١٩١٤ - ١٩١٩م",
    location: "أوروبا، الجبهة الغربية، وفرساي",
    description: "الصراع العسكري العالمي العنيف بين دول الوسط بزعامة ألمانيا ودول الوفاق بزعامة بريطانيا وفرنسا، والذي انتهى بانهيار أربع إمبراطوريات كبرى وتوقيع معاهدة فرساي وتأسيس عصبة الأمم.",
    historicalDetails: [
      {
        title: "أسباب الحرب وشرارة سراييفو",
        description: "التنافس الاستعماري والتحالفات السرية وسباق التسلح، حتى اغتيال ولي عهد النمسا في سراييفو في ٢٨ يونيو ١٩١٤م فاشتعلت نيران الحرب.",
        curriculumFact: "انقسمت أوروبا إلى معسكرين: دول الوفاق (بريطانيا، فرنسا، روسيا) ودول الوسط (ألمانيا، النمسا، الدولة العثمانية)."
      },
      {
        title: "معاهدة فرساي ١٩١٩م وعصبة الأمم",
        description: "فرض الحلفاء شروطاً قاسية على ألمانيا تضمنت تجريد السلاح والتعويضات واقتطاع الأراضي، وتأسست عصبة الأمم لحفظ السلم.",
        curriculumFact: "وقعت معاهدة فرساي في ٢٨ يونيو ١٩١٩م، وخرجت روسيا من الحرب بعد الثورة البلشفية عام ١٩١٧م."
      }
    ],
    hotspots: [
      { id: "ww1_h1", x: 40, y: 40, label: "خطوط الخنادق والجبهة الغربية", text: "شهدت معارك الاستنزاف العنيفة مثل معركة فردان والسوم بالمدفعية والغازات السامة." },
      { id: "ww1_h2", x: 65, y: 65, label: "مائدة مؤتمر الصلح وفرساي", text: "إعادة رسم خريطة أوروبا والشرق الأوسط وتأسيس عصبة الأمم بجنيف." }
    ]
  },
  {
    id: "gal_ww2_un_charter_1945",
    title: "الحرب العالمية الثانية وتأسيس هيئة الأمم المتحدة (١٩٣٩ - ١٩٤٥م)",
    unitId: 4,
    unitTitle: "الوحدة الرابعة: الصراع الأوروبي حول التوسع الاستعماري",
    lessonId: "u4_l2",
    lessonTitle: "الدرس الثاني: الحرب العالمية الثانية (١٩٣٩ - ١٩٤٥م)",
    category: "monument",
    type: "NationalSovereignty",
    image: "/assets/lessons/u4_l2.jpg",
    period: "١٩٣٩ - ١٩٤٥م",
    location: "أوروبا، شمال إفريقيا، المحيط الهادئ، وسان فرانسيسكو",
    description: "أعنف وأضخم نزاع عسكري مسلح في التاريخ الإنساني بين دول المحور (ألمانيا، إيطاليا، اليابان) ودول الحلفاء، وانتهى باستسلام قوى المحور وتوقيع ميثاق الأمم المتحدة لحفظ الأمن والسلم الدوليين.",
    historicalDetails: [
      {
        title: "مسار الحرب ومعارك التحول الحاسمة",
        description: "غزو بولندا ١٩٣٩م، ومعركة ستالينجراد وإنزال نورماندي ومعركة العلمين بمصر التي هزمت قوات رومل في شمال إفريقيا.",
        curriculumFact: "شكلت معركة العلمين عام ١٩٤٢م نقطة التحول الكبرى في مسرح الحرب بشمال إفريقيا لصالح الحلفاء."
      },
      {
        title: "ميثاق سان فرانسيسكو وميلاد الأمم المتحدة",
        description: "اجتمعت ٥٠ دولة في سان فرانسيسكو في يونيو ١٩٤٥م لوضع ميثاق الأمم المتحدة لمنع نشوب الحروب وحل النزاعات سلمياً.",
        curriculumFact: "تأسست منظمة الأمم المتحدة رسمياً في ٢٤ أكتوبر ١٩٤٥م متضمنة مجلس الأمن والجمعية العامة ومحكمة العدل الدولية."
      }
    ],
    hotspots: [
      { id: "ww2_h1", x: 50, y: 35, label: "شعار الأمم المتحدة وغصن الزيتون", text: "رمز السلام العالمي والتضامن الدولي والتعاون لحماية حقوق الإنسان." },
      { id: "ww2_h2", x: 45, y: 70, label: "ممثلو الدول وميثاق سان فرانسيسكو", text: "توقيع ميثاق الأمم المتحدة وتأسيس مجلس الأمن لمنع تكرار المآسي الحربية." }
    ]
  }
];

export const GalleryView: React.FC<GalleryViewProps> = ({
  units,
  onSelectLesson,
  onPlaySound = (_sound: "click" | "success" | "fail" | "levelup" | "pageflip") => {}
}) => {
  // Filtering states
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<number | "all">("all");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Lightbox Zoom Modal States
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1); // 1 = 100%, 1.5 = 150%, 2 = 200%, 2.5 = 250%, 3 = 300%
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const zoomContainerRef = useRef<HTMLDivElement>(null);

  // Filtered gallery items
  const filteredItems = useMemo(() => {
    return GALLERY_ITEMS.filter((item) => {
      // Unit filter
      if (selectedUnitFilter !== "all" && item.unitId !== selectedUnitFilter) {
        return false;
      }
      // Category filter
      if (selectedCategoryFilter !== "all" && item.category !== selectedCategoryFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchLoc = item.location.toLowerCase().includes(q);
        const matchPeriod = item.period.toLowerCase().includes(q);
        const matchUnit = item.unitTitle.toLowerCase().includes(q);
        return matchTitle || matchDesc || matchLoc || matchPeriod || matchUnit;
      }
      return true;
    });
  }, [selectedUnitFilter, selectedCategoryFilter, searchQuery]);

  // Open Lightbox
  const handleOpenItem = (item: GalleryItem) => {
    onPlaySound("click");
    setActiveItem(item);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setActiveHotspot(null);
  };

  // Close Lightbox
  const handleCloseItem = () => {
    onPlaySound("click");
    setActiveItem(null);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setActiveHotspot(null);
  };

  // Zoom handlers
  const handleZoomIn = () => {
    onPlaySound("click");
    setZoomLevel((prev) => Math.min(prev + 0.35, 3));
  };

  const handleZoomOut = () => {
    onPlaySound("click");
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.35, 1);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    onPlaySound("click");
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Drag / Pan handlers for zoomed image
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning && zoomLevel > 1) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Navigate to corresponding lesson
  const handleGoToLesson = (unitId: number, lessonId?: string) => {
    onPlaySound("levelup");
    handleCloseItem();
    // Find index of lesson in unit
    const unitObj = units.find((u) => u.id === unitId);
    let lessonIdx = 0;
    if (unitObj && lessonId) {
      const foundIdx = unitObj.lessons.findIndex((l) => l.id === lessonId);
      if (foundIdx !== -1) {
        lessonIdx = foundIdx;
      }
    }
    onSelectLesson(unitId, lessonIdx);
  };

  // Print single artwork
  const handlePrintArtwork = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out] text-slate-800 font-sans pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-100 via-amber-50 to-orange-100 rounded-3xl p-6 md:p-8 border border-amber-300 shadow-md relative overflow-hidden text-right">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-amber-300 text-amber-900 text-xs font-bold font-serif shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>الأطلس التاريخي والمرئي المعتمد</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold font-serif text-slate-900 flex items-center gap-3">
              <span>معرض الصور والخرائط والمخططات التاريخية</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-700 font-sans leading-relaxed">
              استكشف كافة اللوحات الفنية والمخططات الهندسية والخرائط المعتمدة لمنهج التاريخ للصف الثاني ثانوي. انقر على أي لوحة لتكبيرها بدقة فائقة وفحص التفاصيل الأثرية والتاريخية الدقيقة.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/90 p-3 rounded-2xl border border-amber-200 shadow-sm shrink-0">
            <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-700">
              <Compass className="w-6 h-6 animate-spin-once" />
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-600 block font-serif">المعروضات المرئية</span>
              <span className="text-lg font-bold text-amber-900 font-serif">{GALLERY_ITEMS.length} لوحات ومخططات</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 md:p-5 rounded-2xl border border-amber-200 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Live Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن رسم، خريطة، مدينة، أو حدث..."
              className="w-full bg-amber-50/40 border border-amber-200 rounded-xl pr-10 pl-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 transition text-right font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
            <button
              onClick={() => {
                onPlaySound("click");
                setSelectedCategoryFilter("all");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedCategoryFilter === "all"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-900"
              }`}
            >
              جميع المعروضات ({GALLERY_ITEMS.length})
            </button>
            <button
              onClick={() => {
                onPlaySound("click");
                setSelectedCategoryFilter("map");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                selectedCategoryFilter === "map"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-900"
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>خرائط ومخططات</span>
            </button>
            <button
              onClick={() => {
                onPlaySound("click");
                setSelectedCategoryFilter("architecture");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                selectedCategoryFilter === "architecture"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              <span>عمارة وصروح</span>
            </button>
            <button
              onClick={() => {
                onPlaySound("click");
                setSelectedCategoryFilter("invention");
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                selectedCategoryFilter === "invention"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-amber-50 hover:text-amber-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>مخترعات وآثار</span>
            </button>
          </div>
        </div>

        {/* Unit Filter Horizontal Pills */}
        <div className="border-t border-amber-100 pt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          <span className="text-[11px] text-slate-600 font-bold ml-2 shrink-0 font-serif">الوحدات:</span>
          <button
            onClick={() => {
              onPlaySound("click");
              setSelectedUnitFilter("all");
            }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              selectedUnitFilter === "all"
                ? "bg-amber-100 text-amber-900 border border-amber-400 font-bold shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
            }`}
          >
            كافة الوحدات
          </button>
          {units.map((unit) => (
            <button
              key={unit.id}
              onClick={() => {
                onPlaySound("click");
                setSelectedUnitFilter(unit.id);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedUnitFilter === unit.id
                  ? "bg-amber-100 text-amber-900 border border-amber-400 font-bold shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
              }`}
            >
              {unit.id === 1 && "🇸🇩 الوحدة الأولى (الحكم التركي)"}
              {unit.id === 2 && "📜 الوحدة الثانية (السودان المعاصر)"}
              {unit.id === 3 && "🏛️ الوحدة الثالثة (أوروبا الحديث)"}
              {unit.id === 4 && "⚔️ الوحدة الرابعة (التوسع الاستعماري)"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Gallery Cards */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-amber-200 space-y-3 shadow-sm">
          <Info className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold font-serif text-slate-700">لم يتم العثور على معروضات مطابقة</h3>
          <p className="text-xs text-slate-500 font-sans">جرّب كتابة اسم مدينة أخرى أو تصفير شريط البحث والمرشحات.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedUnitFilter("all");
              setSelectedCategoryFilter("all");
            }}
            className="bg-amber-600 hover:bg-amber-500 text-white text-xs px-4 py-2 rounded-xl transition font-bold cursor-pointer"
          >
            إعادة تعيين المرشحات
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => handleOpenItem(item)}
              className="group bg-white hover:bg-amber-50/40 rounded-2xl border border-amber-200/90 hover:border-amber-400 p-4 transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              {/* Illustration Thumbnail Container */}
              <div className="relative rounded-xl overflow-hidden bg-amber-50/50 border border-amber-200 group-hover:scale-[1.01] transition-transform duration-300 h-48 flex items-center justify-center">
                {item.image ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      loading="lazy" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                  </div>
                ) : (
                  <div className="p-2 w-full h-full flex items-center justify-center bg-amber-50/90">
                    <SVGIllustration type={item.type} className="w-full h-44 pointer-events-none" />
                  </div>
                )}

                {/* Floating Category Badge */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-200 text-[10px] text-amber-900 font-bold font-serif shadow-xs">
                  {item.category === "map" && <MapPin className="w-3 h-3 text-teal-600" />}
                  {item.category === "monument" && <Award className="w-3 h-3 text-amber-600" />}
                  {item.category === "architecture" && <Layers className="w-3 h-3 text-indigo-600" />}
                  {item.category === "invention" && <Sparkles className="w-3 h-3 text-rose-600" />}
                  <span>{item.period}</span>
                </div>

                {/* Zoom Hint Icon */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md p-2 rounded-xl border border-amber-200 text-amber-800 group-hover:bg-amber-600 group-hover:text-white transition shadow-sm">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </div>

              {/* Card Meta & Texts */}
              <div className="space-y-2 text-right flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-serif">
                    <span className="text-amber-700 font-bold flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{item.location}</span>
                    </span>
                    <span className="text-slate-500">الوحدة {item.unitId}</span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-slate-800 group-hover:text-amber-800 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 font-sans leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Card Action footer */}
                <div className="border-t border-amber-100 pt-3 flex items-center justify-between text-xs text-slate-500">
                  <span className="text-[11px] text-slate-500 font-serif">
                    {item.historicalDetails.length} نقاط تاريخية دقيقة
                  </span>
                  <span className="text-amber-700 font-bold flex items-center gap-1 group-hover:translate-x-[-4px] transition-transform">
                    <span>انقر للتكبير والتفاصيل</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================= */}
      {/* LIGHTBOX MODAL WITH FULLSCREEN ZOOM & HISTORICAL HOTSPOTS */}
      {/* ========================================================= */}
      {activeItem && (
        <div 
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-[fadeIn_0.2s_ease-out]"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseItem();
          }}
        >
          <div className="bg-white border-2 border-amber-300 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl relative text-right">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-amber-200 bg-[#fffdfa] flex items-center justify-between gap-4 shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleCloseItem}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 transition border border-slate-200 cursor-pointer"
                  title="إغلاق المعاينة"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={handlePrintArtwork}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 transition border border-slate-200 text-xs font-bold cursor-pointer"
                  title="طباعة اللوحة التعليمية"
                >
                  <Printer className="w-4 h-4" />
                  <span>طباعة</span>
                </button>
              </div>

              <div className="text-right flex-1 min-w-0">
                <span className="text-[11px] text-amber-700 font-bold font-serif block truncate">
                  {activeItem.unitTitle}
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 truncate">
                  {activeItem.title}
                </h3>
              </div>
            </div>

            {/* Modal Main Body: Zoom Canvas & Details Panel */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Left Column (Canvas & Interactive Zoom View) */}
              <div className="lg:col-span-7 bg-[#faf8f5] p-4 sm:p-6 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-l border-amber-200 relative select-none min-h-[340px]">
                {/* Floating Zoom Control Bar */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-amber-200 shadow-md">
                  <button
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 3}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 disabled:opacity-40 transition cursor-pointer"
                    title="تكبير (+)"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono font-bold text-amber-800 px-2 min-w-[45px] text-center">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 1}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 disabled:opacity-40 transition cursor-pointer"
                    title="تصغير (-)"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <div className="w-[1px] h-4 bg-slate-200 mx-0.5" />
                  <button
                    onClick={handleResetZoom}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-800 transition cursor-pointer"
                    title="إعادة ضبط الحجم (100%)"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  {activeItem.hotspots && (
                    <button
                      onClick={() => setShowHotspots(!showHotspots)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold transition cursor-pointer ${
                        showHotspots
                          ? "bg-amber-600 text-white"
                          : "bg-slate-100 text-slate-600 hover:text-slate-800"
                      }`}
                    >
                      {showHotspots ? "إخفاء المعالم" : "إظهار المعالم"}
                    </button>
                  )}
                </div>

                {/* The Interactive Zoomable Canvas Container */}
                <div
                  ref={zoomContainerRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className={`w-full max-w-lg aspect-[16/10] bg-amber-50 rounded-2xl border-2 border-amber-200 overflow-hidden relative shadow-inner flex items-center justify-center ${
                    zoomLevel > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"
                  }`}
                >
                  <div
                    style={{
                      transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
                      transition: isPanning ? "none" : "transform 0.2s ease-out",
                      transformOrigin: "center center"
                    }}
                    className="w-full h-full relative flex items-center justify-center p-2"
                  >
                    {activeItem.image ? (
                      <img 
                        src={activeItem.image} 
                        alt={activeItem.title} 
                        className="w-full h-full object-contain rounded-xl select-none" 
                        draggable={false} 
                      />
                    ) : (
                      <SVGIllustration type={activeItem.type} className="w-full h-full" />
                    )}

                    {/* Historical Hotspot Pins */}
                    {showHotspots && activeItem.hotspots && activeItem.hotspots.map((spot, idx) => (
                      <div
                        key={spot.id}
                        style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlaySound("click");
                          setActiveHotspot(activeHotspot === spot.id ? null : spot.id);
                        }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-30 cursor-pointer group"
                      >
                        {/* Pin Dot with pulsing aura */}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg transition-transform ${
                          activeHotspot === spot.id
                            ? "bg-amber-600 text-white scale-125 ring-4 ring-amber-400/40 animate-pulse"
                            : "bg-amber-100 text-amber-900 border border-amber-500 hover:scale-110"
                        }`}>
                          {idx + 1}
                        </div>

                        {/* Hover/Active Tooltip */}
                        {(activeHotspot === spot.id) && (
                          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white text-slate-900 p-2.5 rounded-xl border border-amber-400 shadow-xl w-48 text-right z-40 pointer-events-auto animate-[fadeIn_0.15s_ease-out]">
                            <span className="font-serif font-bold text-amber-800 text-xs block mb-1">
                              {spot.label}
                            </span>
                            <p className="text-[11px] text-slate-700 font-sans leading-relaxed">
                              {spot.text}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Canvas Advice */}
                <span className="text-[11px] text-slate-600 font-sans mt-3">
                  {zoomLevel > 1 
                    ? "💡 يمكنك سحب اللوحة بالماوس أو اللمس للتحرك وتفحص التفاصيل الدقيقة." 
                    : "💡 انقر على أزرار التكبير (+) أو أرقام المعالم لاستكشاف الشرح التاريخي."}
                </span>
              </div>

              {/* Right Column (Historical Deep-Dive & Curriculum Lesson Connection) */}
              <div className="lg:col-span-5 p-5 sm:p-6 space-y-5 bg-white text-right overflow-y-auto">
                {/* Location & Period metadata */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 space-y-1">
                    <span className="text-[10px] text-slate-600 font-serif block">الحقبة التاريخية:</span>
                    <span className="text-xs font-bold text-slate-800 block">{activeItem.period}</span>
                  </div>
                  <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200 space-y-1">
                    <span className="text-[10px] text-slate-600 font-serif block">الموقع الجغرافي:</span>
                    <span className="text-xs font-bold text-amber-800 block truncate">{activeItem.location}</span>
                  </div>
                </div>

                {/* Detailed Overview */}
                <div className="space-y-1.5">
                  <h4 className="font-serif font-bold text-sm text-slate-900">نبذة تاريخية شاملة:</h4>
                  <p className="text-xs text-slate-700 leading-relaxed font-sans bg-amber-50/50 p-3.5 rounded-xl border border-amber-200">
                    {activeItem.description}
                  </p>
                </div>

                {/* Educational Curriculum Breakdown Points */}
                <div className="space-y-3">
                  <h4 className="font-serif font-bold text-sm text-amber-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>شواهد وحقائق من صميم المنهج:</span>
                  </h4>

                  <div className="space-y-2.5">
                    {activeItem.historicalDetails.map((detail, idx) => (
                      <div
                        key={idx}
                        className="bg-amber-50/40 p-3 rounded-xl border border-amber-200 space-y-1.5"
                      >
                        <h5 className="font-serif font-bold text-xs text-slate-800 flex items-center gap-1.5">
                          <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-800 text-[10px] flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span>{detail.title}</span>
                        </h5>
                        <p className="text-xs text-slate-700 font-sans leading-relaxed">
                          {detail.description}
                        </p>
                        <div className="bg-amber-100/60 p-2 rounded-lg border border-amber-300 text-[11px] text-amber-900 font-sans">
                          <span className="font-bold text-amber-800 ml-1 font-serif">المعلومة المقررة:</span>
                          {detail.curriculumFact}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call-to-action: Go to Lesson Button */}
                <div className="border-t border-amber-100 pt-4">
                  <button
                    onClick={() => handleGoToLesson(activeItem.unitId, activeItem.lessonId)}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white p-3 rounded-xl font-bold font-serif text-sm transition shadow flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>الذهاب إلى الدرس في الكتاب المدرسي 📖</span>
                  </button>
                  {activeItem.lessonTitle && (
                    <span className="text-[11px] text-slate-600 block text-center mt-2 font-serif">
                      {activeItem.lessonTitle}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
