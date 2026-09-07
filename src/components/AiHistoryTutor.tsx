import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Lightbulb,
  RotateCcw,
  Volume2,
  Square,
  Mic,
  MicOff,
  BookOpen,
  Copy,
  Check,
  Award,
  Layers,
  Flame,
  Globe,
  Scroll,
  ShieldAlert,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  XCircle,
  Loader2
} from 'lucide-react';
import { playSound } from './SoundEffects';

export interface DiagramData {
  id: string;
  title: string;
  caption: string;
  svg: string;
  keyPoints?: string[];
}

export interface Message {
  role: 'user' | 'assistant';
  text: string;
  diagram?: DiagramData | null;
}

const PRESET_HISTORY_QUESTIONS = [
  'ما هي أسباب غزو محمد علي باشا للسودان عام 1821م؟',
  'اشرح أحداث معركة كورتي وبطولة الشاعرة مهيرة بت عبود ودور الشايقية في المقاومة؟',
  'كيف وقعت حادثة حريق شندي وما سبب غضب المك نمر من إسماعيل باشا عام 1822م؟',
  'صِف التخطيط الهندسي لمدينة بغداد المدورة التي بناها الخليفة أبو جعفر المنصور؟',
  'ما هي قصة حج ملك مالي منسا موسى عام 1324م وما أثر ثروته الذهبية على العالم؟',
  'ما هي مقومات الدولة الأربعة وما الفرق الجوهري بين حقوق المواطن وواجباته؟'
];

const CLOUD_MENTOR_ENDPOINT = 'https://local-ai-arsenal.pages.dev/api/mentor/chat';
const CLOUD_TTS_ENDPOINT = 'https://local-ai-arsenal.pages.dev/api/tts';

function cleanTtsText(str: string): string {
  let s = (str || '')
    .replace(/<[^>]*>/g, '')
    .replace(/[*#_`~]/g, '')
    .replace(/https?:\/\/\S+/g, '');
  try {
    s = s.replace(/\p{Extended_Pictographic}/gu, '');
  } catch {
    s = s.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '');
  }
  s = s.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '');
  return s.trim();
}

// ── 🎨 4 High-Resolution History Curriculum SVG Diagrams ───────────────────
export const CURRICULUM_DIAGRAMS: Record<string, DiagramData> = {
  sudan_1821_campaign: {
    id: 'sudan_1821_campaign',
    title: 'خريطة ومسار حملات 1821م ومقاومة السودانيين (كورتي وشندي)',
    caption: 'مسار جيش إسماعيل باشا على وادي النيل، معركة كورتي وموقف الشايقية، ودخول سنار، ثم حريق شندي 1822م (كتاب التاريخ - الصف السادس)',
    keyPoints: [
      'حملة إسماعيل باشا (1821م): تحركت بمحاذاة النيل بحثاً عن الذهب والرجال والسيطرة على منابع النيل.',
      'معركة كورتي (نوفمبر 1820م): أظهر الشايقية بسالة أسطورية وحمستهم الشاعرة مهيرة بت عبود بقصيدتها الشهيرة: «غني شوفي عيالك يا مهيرة».',
      'سقوط سنار (يونيو 1821م): استسلام آخر ملوك الفونج (بادي السادس) وانتهاء سلطنة سنار الإسلامية.',
      'حريق شندي (أكتوبر 1822م): رد المك نمر البطولي على إهانة إسماعيل باشا وإحراق معسكره، وتلاه انتقام الدفتردار الدموي.'
    ],
    svg: `<svg viewBox="0 0 740 390" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:'Cairo',sans-serif;background:#18152c;border-radius:18px;">
      <defs>
        <linearGradient id="histGrad1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#b45309"/>
          <stop offset="100%" stop-color="#78350f"/>
        </linearGradient>
        <linearGradient id="histGrad2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#991b1b"/>
          <stop offset="100%" stop-color="#450a0a"/>
        </linearGradient>
      </defs>
      
      <!-- عنوان المخطط -->
      <rect x="20" y="15" width="700" height="42" rx="12" fill="#8C6239" />
      <text x="370" y="42" text-anchor="middle" fill="#FAF4ED" font-size="16" font-weight="900">
        ⚔️ محطات الغزو التركي 1821م وبطولات المقاومة الوطنية السودانية
      </text>

      <!-- 1. أسباب الغزو -->
      <g transform="translate(25, 75)">
        <rect width="160" height="250" rx="14" fill="#201a38" stroke="#8C6239" stroke-width="2" />
        <text x="80" y="30" text-anchor="middle" fill="#f59e0b" font-size="13" font-weight="bold">١. دوافع الغزو 1821م</text>
        <circle cx="80" cy="75" r="28" fill="#2d244c" />
        <text x="80" y="83" text-anchor="middle" font-size="24">💰</text>
        <text x="80" y="125" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="bold">مطامع محمد علي باشا</text>
        <text x="80" y="148" text-anchor="middle" fill="#94a3b8" font-size="10">• البحث عن مناجم الذهب</text>
        <text x="80" y="168" text-anchor="middle" fill="#94a3b8" font-size="10">• تجنيد الرجال للجيش</text>
        <text x="80" y="188" text-anchor="middle" fill="#94a3b8" font-size="10">• ملاحقة بقايا المماليك</text>
        <rect x="15" y="208" width="130" height="26" rx="6" fill="#8C6239" />
        <text x="80" y="225" text-anchor="middle" fill="#FAF4ED" font-size="10" font-weight="bold">حملة إسماعيل + الدفتردار</text>
      </g>

      <!-- 2. معركة كورتي -->
      <g transform="translate(200, 75)">
        <rect width="160" height="250" rx="14" fill="#201a38" stroke="#f59e0b" stroke-width="2" />
        <text x="80" y="30" text-anchor="middle" fill="#f59e0b" font-size="13" font-weight="bold">٢. صمود كورتي 1820م</text>
        <circle cx="80" cy="75" r="28" fill="#2d244c" />
        <text x="80" y="83" text-anchor="middle" font-size="24">🛡️</text>
        <text x="80" y="125" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="bold">شجاعة الشايقية</text>
        <text x="80" y="148" text-anchor="middle" fill="#94a3b8" font-size="10">• مواجهة المدافع بالسيوف</text>
        <text x="80" y="168" text-anchor="middle" fill="#94a3b8" font-size="10">• صمود مهيرة بت عبود</text>
        <text x="80" y="188" text-anchor="middle" fill="#94a3b8" font-size="10">• ملحمة شعرية تاريخية</text>
        <rect x="15" y="208" width="130" height="26" rx="6" fill="#b45309" />
        <text x="80" y="225" text-anchor="middle" fill="#FAF4ED" font-size="10" font-weight="bold">فداء الوطن والشرف</text>
      </g>

      <!-- 3. سقوط سنار -->
      <g transform="translate(375, 75)">
        <rect width="160" height="250" rx="14" fill="#201a38" stroke="#8C6239" stroke-width="2" />
        <text x="80" y="30" text-anchor="middle" fill="#f59e0b" font-size="13" font-weight="bold">٣. سقوط سنار 1821م</text>
        <circle cx="80" cy="75" r="28" fill="#2d244c" />
        <text x="80" y="83" text-anchor="middle" font-size="24">🏰</text>
        <text x="80" y="125" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="bold">نهاية سلطنة الفونج</text>
        <text x="80" y="148" text-anchor="middle" fill="#94a3b8" font-size="10">• استسلام بادي السادس</text>
        <text x="80" y="168" text-anchor="middle" fill="#94a3b8" font-size="10">• 317 عاماً من حكم سنار</text>
        <text x="80" y="188" text-anchor="middle" fill="#94a3b8" font-size="10">• فرض الضرائب الباهظة</text>
        <rect x="15" y="208" width="130" height="26" rx="6" fill="#8C6239" />
        <text x="80" y="225" text-anchor="middle" fill="#FAF4ED" font-size="10" font-weight="bold">يونيو 1821م</text>
      </g>

      <!-- 4. حريق شندي والمك نمر -->
      <g transform="translate(550, 75)">
        <rect width="165" height="250" rx="14" fill="#201a38" stroke="#ef4444" stroke-width="2" />
        <text x="82" y="30" text-anchor="middle" fill="#ef4444" font-size="13" font-weight="bold">٤. حريق شندي 1822م</text>
        <circle cx="82" cy="75" r="28" fill="#450a0a" />
        <text x="82" y="83" text-anchor="middle" font-size="24">🔥</text>
        <text x="82" y="125" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="bold">عزة وكرامة المك نمر</text>
        <text x="82" y="148" text-anchor="middle" fill="#94a3b8" font-size="10">• صفعة غليون إسماعيل</text>
        <text x="82" y="168" text-anchor="middle" fill="#94a3b8" font-size="10">• إحراق معسكر إسماعيل ليلاً</text>
        <text x="82" y="188" text-anchor="middle" fill="#94a3b8" font-size="10">• هجرة الجعليين للحبشة</text>
        <rect x="15" y="208" width="135" height="26" rx="6" fill="#991b1b" />
        <text x="82" y="225" text-anchor="middle" fill="#FAF4ED" font-size="10" font-weight="bold">أكتوبر 1822م</text>
      </g>
    </svg>`
  },

  baghdad_round_city: {
    id: 'baghdad_round_city',
    title: 'المخطط الهندسي لمدينة بغداد المدورة (دار السلام 145هـ)',
    caption: 'التحفة المعمارية للخليفة العباسي أبو جعفر المنصور على نهر دجلة بأبوابها الأربعة الشهيرة (كتاب التاريخ - الصف السادس)',
    keyPoints: [
      'التأسيس: بناها الخليفة أبو جعفر المنصور عام 145هـ (762م) وسماها "مدينة السلام".',
      'الشكل الدائري: اختار الشكل المستدير لتكون محصنة هندسياً، محاطة بسورين وخندق مائي عريض.',
      'الأبواب الأربعة: باب الكوفة (جنوب غرب)، باب البصرة (جنوب شرق)، باب خراسان (شمال شرق)، وباب الشام (شمال غرب).',
      'القلب المركزي: قصر الخليفة (قصر قبة الذهب) بارتفاع 40 متراً يعلوه تمثال الفارس، وبجواره المسجد الجامع الكبير.'
    ],
    svg: `<svg viewBox="0 0 740 390" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:'Cairo',sans-serif;background:#18152c;border-radius:18px;">
      <!-- العنوان -->
      <rect x="20" y="15" width="700" height="42" rx="12" fill="#8C6239" />
      <text x="370" y="42" text-anchor="middle" fill="#FAF4ED" font-size="16" font-weight="900">
        🏛️ المخطط الهندسي لمدينة بغداد المدورة (دار السلام 145هـ - أبو جعفر المنصور)
      </text>

      <!-- الدوائر المركزية للمدينة -->
      <g transform="translate(370, 225)">
        <!-- الخندق المائي الخارجي -->
        <circle r="145" fill="none" stroke="#38bdf8" stroke-width="12" opacity="0.6"/>
        <text y="-152" text-anchor="middle" fill="#38bdf8" font-size="10" font-weight="bold">الخندق المائي المحيط</text>

        <!-- السور الخارجي والداخلي -->
        <circle r="130" fill="#261e40" stroke="#f59e0b" stroke-width="5"/>
        <circle r="105" fill="#1b1530" stroke="#8C6239" stroke-width="3" stroke-dasharray="6,4"/>
        <text y="-112" text-anchor="middle" fill="#d97706" font-size="9">منازل وسكن العامة والأسواق</text>

        <!-- المركز: قصر الذهب والجامع -->
        <circle r="55" fill="#312652" stroke="#f59e0b" stroke-width="3"/>
        <circle cx="0" cy="-5" r="22" fill="#8C6239" />
        <text y="0" text-anchor="middle" font-size="16">🕌</text>
        <text y="22" text-anchor="middle" fill="#FAF4ED" font-size="9" font-weight="bold">قصر قبة الذهب والجامع</text>

        <!-- الأبواب الأربعة -->
        <!-- باب الشام (أعلى اليسار) -->
        <circle cx="-92" cy="-92" r="10" fill="#ef4444" />
        <text x="-140" y="-95" fill="#fca5a5" font-size="10" font-weight="bold">باب الشام ↖️</text>

        <!-- باب خراسان (أعلى اليمين) -->
        <circle cx="92" cy="-92" r="10" fill="#ef4444" />
        <text x="105" y="-95" fill="#fca5a5" font-size="10" font-weight="bold">↗️ باب خراسان</text>

        <!-- باب الكوفة (أسفل اليسار) -->
        <circle cx="-92" cy="92" r="10" fill="#ef4444" />
        <text x="-140" y="105" fill="#fca5a5" font-size="10" font-weight="bold">باب الكوفة ↙️</text>

        <!-- باب البصرة (أسفل اليمين) -->
        <circle cx="92" cy="92" r="10" fill="#ef4444" />
        <text x="105" y="105" fill="#fca5a5" font-size="10" font-weight="bold">↘️ باب البصرة</text>
      </g>

      <!-- بطاقة معلومات جانبية -->
      <g transform="translate(30, 80)">
        <rect width="160" height="150" rx="10" fill="#201a38" stroke="#8C6239" stroke-width="1.5" />
        <text x="80" y="24" text-anchor="middle" fill="#f59e0b" font-size="11" font-weight="bold">خصائص البناء المعماري</text>
        <text x="14" y="48" fill="#e2e8f0" font-size="9.5">• الموقع: غرب نهر دجلة</text>
        <text x="14" y="68" fill="#e2e8f0" font-size="9.5">• القطر: حوالي 2.6 كم</text>
        <text x="14" y="88" fill="#e2e8f0" font-size="9.5">• مهندسو البناء: النوبختي</text>
        <text x="14" y="108" fill="#e2e8f0" font-size="9.5">• زمن الإنجاز: 4 سنوات</text>
        <text x="14" y="128" fill="#f59e0b" font-size="9.5">• سميت «دار السلام»</text>
      </g>
    </svg>`
  },

  mansa_musa_hajj: {
    id: 'mansa_musa_hajj',
    title: 'إمبراطورية مالي وحج منسا موسى الذهبي (1324م)',
    caption: 'رحلة الحج التاريخية الأسطورية التي غيرت اقتصاد العالم وجعلت مالي منارة العلم عبر جامعة سنكوري بتمبكتو (كتاب التاريخ - الصف السادس)',
    keyPoints: [
      'ملك مالي العظيم (منسا موسى): تولى الحكم عام 1312م وحكم إمبراطورية شاسعة امتدت من المحيط الأطلسي حتى نهر النيجر.',
      'رحلة الحج الذهبية (1324م): تحرك بموكب ضم 60,000 شخص ومئات الجمال المحملة بآلاف الكيلوجرامات من سبائك الذهب الخالص.',
      'أثر الذهب في القاهرة ومكة: وزع الذهب بسخاء أدى لانخفاض سعر الذهب في أسواق الشرق الأوسط لسنوات!',
      'النهضة الثقافية وتمبكتو: بنى المساجد واستجلب المعماريين والعلماء، وأسس جامعة سنكوري الشهيرة كأكبر منارة علمية بإفريقيا.'
    ],
    svg: `<svg viewBox="0 0 740 390" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:'Cairo',sans-serif;background:#18152c;border-radius:18px;">
      <!-- العنوان -->
      <rect x="20" y="15" width="700" height="42" rx="12" fill="#8C6239" />
      <text x="370" y="42" text-anchor="middle" fill="#FAF4ED" font-size="16" font-weight="900">
        👑 إمبراطورية مالي الإسلامية وموكب حج منسا موسى الذهبي 1324م
      </text>

      <!-- 1. تمبكتو وعاصمة مالي -->
      <g transform="translate(30, 80)">
        <rect width="150" height="240" rx="12" fill="#201a38" stroke="#d97706" stroke-width="2" />
        <text x="75" y="28" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="bold">١. الانطلاق: مالي</text>
        <circle cx="75" cy="70" r="28" fill="#2d244c" />
        <text x="75" y="78" text-anchor="middle" font-size="24">🌍</text>
        <text x="75" y="120" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="bold">إمبراطورية الثروة</text>
        <text x="75" y="142" text-anchor="middle" fill="#94a3b8" font-size="10">مناجم ذهب بامبوك</text>
        <text x="75" y="162" text-anchor="middle" fill="#94a3b8" font-size="10">مركز تمبكتو التجاري</text>
        <text x="75" y="182" text-anchor="middle" fill="#94a3b8" font-size="10">جامع وجامعة سنكوري</text>
        <rect x="15" y="202" width="120" height="24" rx="6" fill="#8C6239" />
        <text x="75" y="218" text-anchor="middle" fill="#FAF4ED" font-size="9.5" font-weight="bold">أغنى رجل بالتاريخ</text>
      </g>

      <!-- 2. موكب الحج -->
      <g transform="translate(210, 80)">
        <rect width="150" height="240" rx="12" fill="#201a38" stroke="#f59e0b" stroke-width="2" />
        <text x="75" y="28" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="bold">٢. الموكب الأسطوري</text>
        <circle cx="75" cy="70" r="28" fill="#2d244c" />
        <text x="75" y="78" text-anchor="middle" font-size="24">🐪</text>
        <text x="75" y="120" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="bold">60,000 مرافق</text>
        <text x="75" y="142" text-anchor="middle" fill="#94a3b8" font-size="10">80 جمل يحمل الذهب</text>
        <text x="75" y="162" text-anchor="middle" fill="#94a3b8" font-size="10">عبر الصحراء الكبرى</text>
        <text x="75" y="182" text-anchor="middle" fill="#94a3b8" font-size="10">سنة 1324 ميلادية</text>
        <rect x="15" y="202" width="120" height="24" rx="6" fill="#d97706" />
        <text x="75" y="218" text-anchor="middle" fill="#FAF4ED" font-size="9.5" font-weight="bold">انبهار العالم بالموكب</text>
      </g>

      <!-- 3. القاهرة والذهب -->
      <g transform="translate(390, 80)">
        <rect width="150" height="240" rx="12" fill="#201a38" stroke="#d97706" stroke-width="2" />
        <text x="75" y="28" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="bold">٣. في القاهرة والحجاز</text>
        <circle cx="75" cy="70" r="28" fill="#2d244c" />
        <text x="75" y="78" text-anchor="middle" font-size="24">✨</text>
        <text x="75" y="120" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="bold">توزيع الذهب بسخاء</text>
        <text x="75" y="142" text-anchor="middle" fill="#94a3b8" font-size="10">لقاء سلطان المماليك</text>
        <text x="75" y="162" text-anchor="middle" fill="#94a3b8" font-size="10">انخفاض سعر الذهب</text>
        <text x="75" y="182" text-anchor="middle" fill="#94a3b8" font-size="10">أداء فريضة الحج بمكة</text>
        <rect x="15" y="202" width="120" height="24" rx="6" fill="#b45309" />
        <text x="75" y="218" text-anchor="middle" fill="#FAF4ED" font-size="9.5" font-weight="bold">كرم وجود تاريخي</text>
      </g>

      <!-- 4. العمارة والنهضة -->
      <g transform="translate(560, 80)">
        <rect width="150" height="240" rx="12" fill="#201a38" stroke="#10b981" stroke-width="2" />
        <text x="75" y="28" text-anchor="middle" fill="#34d399" font-size="12" font-weight="bold">٤. نهضة تمبكتو</text>
        <circle cx="75" cy="70" r="28" fill="#064e3b" />
        <text x="75" y="78" text-anchor="middle" font-size="24">📚</text>
        <text x="75" y="120" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="bold">عصر العلم والمعمار</text>
        <text x="75" y="142" text-anchor="middle" fill="#94a3b8" font-size="10">المعماري الساحلي الأندلسي</text>
        <text x="75" y="162" text-anchor="middle" fill="#94a3b8" font-size="10">جامع جنكريبر التاريخي</text>
        <text x="75" y="182" text-anchor="middle" fill="#94a3b8" font-size="10">استقطاب العلماء والفقهاء</text>
        <rect x="15" y="202" width="120" height="24" rx="6" fill="#047857" />
        <text x="75" y="218" text-anchor="middle" fill="#FAF4ED" font-size="9.5" font-weight="bold">منارة الحضارة بإفريقيا</text>
      </g>
    </svg>`
  },

  industrial_revolution: {
    id: 'industrial_revolution',
    title: 'الثورة الصناعية واختراع الآلة البخارية (جيمس واط 1769م)',
    caption: 'الانتقال التاريخي من الجهد العضلي والحيواني إلى طاقة البخار والمصانع والقطارات (كتاب التاريخ - الصف السادس)',
    keyPoints: [
      'البداية والمكان: انطلقت الثورة الصناعية في إنجلترا في منتصف القرن الثامن عشر الميلادي (1750م).',
      'اختراع الآلة البخارية: طوّر المهندس الاسكتلندي جيمس واط الآلة البخارية عام 1769م وجعلها قابلة لتشغيل كافة الماكينات.',
      'تطوير النقل والمواصلات: اختراع القاطرة البخارية للقطارات والسفن البخارية واختصار المسافات بين الشعوب.',
      'التحول الاجتماعي: نمو المدن، ظهور طبقة العمال وأصحاب المصانع، وزيادة الإنتاج العالمي أضعافاً مضاعفة.'
    ],
    svg: `<svg viewBox="0 0 740 390" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:'Cairo',sans-serif;background:#18152c;border-radius:18px;">
      <!-- العنوان -->
      <rect x="20" y="15" width="700" height="42" rx="12" fill="#8C6239" />
      <text x="370" y="42" text-anchor="middle" fill="#FAF4ED" font-size="16" font-weight="900">
        ⚙️ الثورة الصناعية وتطور الطاقة البخارية (جيمس واط 1769م)
      </text>

      <!-- 1. عصر العمل اليدوي -->
      <g transform="translate(30, 80)">
        <rect width="150" height="240" rx="12" fill="#201a38" stroke="#64748b" stroke-width="2" />
        <text x="75" y="28" text-anchor="middle" fill="#94a3b8" font-size="12" font-weight="bold">١. قبل الثورة الصناعية</text>
        <circle cx="75" cy="70" r="28" fill="#2d244c" />
        <text x="75" y="78" text-anchor="middle" font-size="24">🌾</text>
        <text x="75" y="120" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="bold">الاعتماد على العضلات</text>
        <text x="75" y="142" text-anchor="middle" fill="#94a3b8" font-size="10">قوة الإنسان والحيوان</text>
        <text x="75" y="162" text-anchor="middle" fill="#94a3b8" font-size="10">إنتاج منزلي بطيء ومحدود</text>
        <text x="75" y="182" text-anchor="middle" fill="#94a3b8" font-size="10">نقل بالعربات والخيول</text>
        <rect x="15" y="202" width="120" height="24" rx="6" fill="#475569" />
        <text x="75" y="218" text-anchor="middle" fill="#FAF4ED" font-size="9.5" font-weight="bold">المجتمعات الزراعية</text>
      </g>

      <!-- 2. الآلة البخارية -->
      <g transform="translate(210, 80)">
        <rect width="150" height="240" rx="12" fill="#201a38" stroke="#f59e0b" stroke-width="2" />
        <text x="75" y="28" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="bold">٢. اختراع جيمس واط</text>
        <circle cx="75" cy="70" r="28" fill="#2d244c" />
        <text x="75" y="78" text-anchor="middle" font-size="24">🚂</text>
        <text x="75" y="120" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="bold">طاقة البخار والفحم</text>
        <text x="75" y="142" text-anchor="middle" fill="#94a3b8" font-size="10">عام 1769م في بريطانيا</text>
        <text x="75" y="162" text-anchor="middle" fill="#94a3b8" font-size="10">تشغيل نول النسيج الآلي</text>
        <text x="75" y="182" text-anchor="middle" fill="#94a3b8" font-size="10">مضاعفة سرعة الإنتاج</text>
        <rect x="15" y="202" width="120" height="24" rx="6" fill="#d97706" />
        <text x="75" y="218" text-anchor="middle" fill="#FAF4ED" font-size="9.5" font-weight="bold">نقطة التحول الكبرى</text>
      </g>

      <!-- 3. ثورة النقل -->
      <g transform="translate(390, 80)">
        <rect width="150" height="240" rx="12" fill="#201a38" stroke="#38bdf8" stroke-width="2" />
        <text x="75" y="28" text-anchor="middle" fill="#38bdf8" font-size="12" font-weight="bold">٣. ثورة النقل والمواصلات</text>
        <circle cx="75" cy="70" r="28" fill="#082f49" />
        <text x="75" y="78" text-anchor="middle" font-size="24">🚢</text>
        <text x="75" y="120" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="bold">السكك الحديدية</text>
        <text x="75" y="142" text-anchor="middle" fill="#94a3b8" font-size="10">القطار البخاري لستيفنسون</text>
        <text x="75" y="162" text-anchor="middle" fill="#94a3b8" font-size="10">السفن البخارية عبر البحار</text>
        <text x="75" y="182" text-anchor="middle" fill="#94a3b8" font-size="10">ربط القارات والأسواق</text>
        <rect x="15" y="202" width="120" height="24" rx="6" fill="#0284c7" />
        <text x="75" y="218" text-anchor="middle" fill="#FAF4ED" font-size="9.5" font-weight="bold">تقارب العالم</text>
      </g>

      <!-- 4. نتائج الثورة -->
      <g transform="translate(560, 80)">
        <rect width="150" height="240" rx="12" fill="#201a38" stroke="#10b981" stroke-width="2" />
        <text x="75" y="28" text-anchor="middle" fill="#34d399" font-size="12" font-weight="bold">٤. نتائج الثورة الصناعية</text>
        <circle cx="75" cy="70" r="28" fill="#064e3b" />
        <text x="75" y="78" text-anchor="middle" font-size="24">🏭</text>
        <text x="75" y="120" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="bold">عصر المصانع والمدن</text>
        <text x="75" y="142" text-anchor="middle" fill="#94a3b8" font-size="10">وفرة السلع وانخفاض السعر</text>
        <text x="75" y="162" text-anchor="middle" fill="#94a3b8" font-size="10">ظهور الطبقة العمالية</text>
        <text x="75" y="182" text-anchor="middle" fill="#94a3b8" font-size="10">بداية التنافس الاستعماري</text>
        <rect x="15" y="202" width="120" height="24" rx="6" fill="#059669" />
        <text x="75" y="218" text-anchor="middle" fill="#FAF4ED" font-size="9.5" font-weight="bold">بناء العالم المعاصر</text>
      </g>
    </svg>`
  }
};

// ── 🧠 محرك المعرفة التاريخية المعتمد أوفلاين لمنهج الصف السادس (بخت الرضا) ──
function getOfflineHistoryAnswer(q: string): { reply: string; diagramKey?: string } {
  const norm = q.toLowerCase();

  // 1. حملات 1821م، معركة كورتي، سنار، حريق شندي والمك نمر
  if (
    norm.includes('1821') ||
    norm.includes('غزو') ||
    norm.includes('محمد علي') ||
    norm.includes('إسماعيل') ||
    norm.includes('اسماعيل') ||
    norm.includes('كورتي') ||
    norm.includes('مهيرة') ||
    norm.includes('شندي') ||
    norm.includes('المك نمر') ||
    norm.includes('نمر') ||
    norm.includes('سنار') ||
    norm.includes('الدفتردار')
  ) {
    return {
      diagramKey: 'sudan_1821_campaign',
      reply: `يا بطل التاريخ السوداني المجيد 🏛️🇸🇩! هذا الدرس هو أحد أهم دروس كتاب التاريخ للصف السادس (الوحدة الأولى: الغزو التركي والمقاومة الوطنية):

1. **دوافع غزو محمد علي باشا للسودان (1821م):**
   - **الذهب والمعادن:** الاعتقاد الخاطئ بوجود جبال من الذهب في فازوغلي والنيل الأزرق لتمويل جيشه.
   - **الرجال والجنود:** تجنيد أبناء السودان الأشداء لتكوين جيش مصري حديث يخوض به حروبه التوسعية.
   - **تأمين منابع النيل ومطاردة المماليك:** القضاء على المماليك الفارين إلى دنقلا.

2. **معركة كورتي وبطولة الشايقية (نوفمبر 1820م):**
   - التقى جيش إسماعيل باشا المزود بالمدافع والبنادق الحديثة بفرسان الشايقية المسلحين بالسيوف والرماح.
   - حثتهم الشاعرة البطلة **مهيرة بت عبود** بأشعارها الحماسية وهي على ناقتها:
     *«غني شوفي عيالك يا مهيرة .. ديل ليوث الغاب البتضاري وتغير»*.
   - رغم تفوق السلاح الناري الغازي، سطر السودانيون أروع ملاحم الشجاعة والشرف.

3. **سقوط سنار (1821م):**
   - دخل إسماعيل باشا مدينة سنار في 12 يونيو 1821م واستسلم له آخر ملوك الفونج (الملك بادي السادس)، فانتهت رسمياً سلطنة سنار (الفونج) بعد 317 عاماً من تأسيسها عام 1504م.

4. **حادثة حريق شندي والرد الوطني للمك نمر (أكتوبر 1822م):**
   - وصل إسماعيل باشا إلى شندي وطلب من **المك نمر** و**المك مساعد** مطالب تعجيزية وضرائب خيالية من الخيل والماشية والأموال خلال ساعات، ولما اعتذر المك نمر صفعه إسماعيل بغليونه على وجهه!
   - خطط المك نمر بحكمة: تظاهر بالامتثال ودعا إسماعيل وقادته لوليمة كبرى وأحاط مقر إقامتهم بالقش والحطب وأشعل النيران ليلاً فهلك إسماعيل باشا وجيشه المباشر.
   - ثأر الدفتردار بعد ذلك بحملات انتقامية دموية قاسية على مدن وقرى النيل.

💡 **سؤال تحدٍ تفاعلي:** لماذا يعتبر تصرف المك نمر في شندي درساً خالداً في رفض الإهانة والدفاع عن الكرامة السودانية؟ ما رأيك يا بطل؟ 🇸🇩✨`
    };
  }

  // 2. الدولة العباسية وبغداد المدورة وأبو جعفر المنصور
  if (
    norm.includes('بغداد') ||
    norm.includes('المنصور') ||
    norm.includes('جعفر') ||
    norm.includes('عباس') ||
    norm.includes('العباسية') ||
    norm.includes('مدورة')
  ) {
    return {
      diagramKey: 'baghdad_round_city',
      reply: `مرحباً بمؤرخنا المبدع 🏛️📜! بناء مدينة بغداد المدورة يعد قمة الهندسة المعمارية في التاريخ الإسلامي:

1. **قيام الدولة العباسية (132هـ / 750م):**
   - سقطت الدولة الأموية في معركة الزاب وقامت الدولة العباسية على يد الخليفة أبي العباس السفاح.

2. **بناء بغداد (145هـ / 762م):**
   - بنى الخليفة الثاني **أبو جعفر المنصور** عاصمة جديدة على الضفة الغربية لنهر دجلة في العراق.
   - سماها رسمياً **«مدينة السلام»** أو **«دار السلام»**، واشتهرت تاريخياً باسم **«بغداد»**.

3. **عبقرية التخطيط المدور:**
   - صُممت على شكل دائرة هندسية منتظمة يحيط بها خندق مائي عميق ثم سوران عظيمان لحمايتها من الأعداء.
   - أقيمت لها أربعة أبواب رئيسية موجهة للأقاليم:
     1. **باب الكوفة** (جنوب غرب).
     2. **باب البصرة** (جنوب شرق).
     3. **باب خراسان** (شمال شرق).
     4. **باب الشام** (شمال غرب).
   - في قلب المدينة تماماً شُيّد **قصر الخليفة (قصر قبة الذهب)** بارتفاع 80 ذراعاً وفوقه تمثال فارس يدور مع الرياح، وبجواره **المسجد الجامع**.

💡 **سؤال ذكاء:** لماذا حرص أبو جعفر المنصور أن يكون قصر الحكم والمسجد في وسط الدائرة تماماً وليس على الأطراف؟ فكّر معمارياً وأمنياً! 📐🏰`
    };
  }

  // 3. إمبراطورية مالي وحج منسا موسى وتمبكتو
  if (
    norm.includes('منسا') ||
    norm.includes('موسى') ||
    norm.includes('مالي') ||
    norm.includes('تمبكتو') ||
    norm.includes('تومبوكتو') ||
    norm.includes('حج') ||
    norm.includes('ذهب')
  ) {
    return {
      diagramKey: 'mansa_musa_hajj',
      reply: `يا لك من باحث عبقري 👑✨! رحلة ملك مالي المسلم منسا موسى هي إحدى أشهر الرحلات في سجل التاريخ البشري قاطبة:

- **إمبراطورية مالي الإسلامية:**
  - قامت في غرب إفريقيا وازدهرت بفضل سيطرتها على مناجم الذهب وتجارة الملح والقوافل عبر الصحراء الكبرى.
- **منسا موسى (1312م - 1337م):**
  - "منسا" تعني بلغة الماندينكا: الملك أو السلطان. ويُصنف تاريخياً بأنه أغنى إنسان عرفته البشرية!
- **رحلة الحج الكبرى (1324م):**
  - خرج في موكب ملكي مهيب مكون من **60 ألف شخص** يرتدون الحرير، يتقدمهم 500 حارس يحمل كل منهم عصا من الذهب الخالص.
  - حملت الجمال عشرات الأطنان من سبائك الذهب، وأنفق موسى الذهب في مكة والمدينة والقاهرة بسخاء لا يُصدق.
  - أدى كرمه لفيضان أسواق مصر بالحجاز بالذهب فانخفضت قيمته لعقد كامل!
- **نهضة تمبكتو العلمية والمعمارية:**
  - عاد ومعه كبار المعماريين والفقهاء (مثل المعماري الأندلسي أبي إسحاق الساحلي).
  - بنى جامع **جنكريبر** الشهير ووسّع **جامعة سنكوري** في تمبكتو التي أصبحت مقصد الطلاب والعلماء من إفريقيا والعالم الإسلامي لحفظ القرآن والعلوم والطب.

💡 **سؤال استكشافي:** كيف أثبت حج منسا موسى للعالم أن إفريقيا كانت مهداً لحضارات عظمى ومراكز علم متقدمة وليس فقط أراضي مجهولة؟ 🌍📖`
    };
  }

  // 4. الثورة الصناعية وجيمس واط والآلة البخارية
  if (
    norm.includes('صناعية') ||
    norm.includes('الثورة') ||
    norm.includes('واط') ||
    norm.includes('جيمس') ||
    norm.includes('بخار') ||
    norm.includes('بخارية') ||
    norm.includes('مصانع')
  ) {
    return {
      diagramKey: 'industrial_revolution',
      reply: `أهلاً بصانع المستقبل 🚂⚙️! درس الثورة الصناعية من أمتع دروس التاريخ الحديث للصف السادس:

1. **ما هي الثورة الصناعية؟**
   - هي حركة التغيير الجذري التي حوّلت أسلوب الإنتاج من **العمل اليدوي والأدوات البسيطة** داخل المنازل والورش، إلى **العمل الآلي واستخدام الماكينات والمصانع الكبرى**.
2. **مكان وبداية الانطلاق:**
   - انطلقت في بريطانيا (إنجلترا) في منتصف القرن الثامن عشر الميلادي (حوالي عام 1750م) بفضل توفر الفحم والحديد والاستقرار السياسي.
3. **معجزة الآلة البخارية (جيمس واط 1769م):**
   - طوّر المخترع الاسكتلندي **جيمس واط** الآلة البخارية لتصبح قادرة على تدوير الآلات في مصانع الغزل والنسيج ومناجم الفحم بكفاءة هائلة.
4. **تطور النقل والمواصلات:**
   - اخترع جورج ستيفنسون **القطار البخاري (القاطرة البخارية)**، وظهرت السفن البخارية، مما سهّل نقل البضائع والركاب عبر القارات والمحيطات.
5. **نتائج الثورة الصناعية:**
   - زيادة إنتاج البضائع ورخص أسعارها.
   - هجرة السكان من الأرياف إلى المدن ونمو المراكز الصناعية الكبرى.
   - ظهور طبقة أصحاب الأعمال (الرأسماليين) وطبقة العمال.

💡 **سؤال تأملي:** لو لم تُخترع الآلة البخارية في ذلك العصر، كيف كانت ستكون حياتنا اليوم من حيث التنقل والصناعات والأجهزة؟ فكّر معي! 💡🏭`
    };
  }

  // 5. مقومات الدولة والمواطنة
  if (
    norm.includes('مواطنة') ||
    norm.includes('المواطنة') ||
    norm.includes('دولة') ||
    norm.includes('مقومات') ||
    norm.includes('حقوق') ||
    norm.includes('واجبات') ||
    norm.includes('شعب') ||
    norm.includes('سيادة')
  ) {
    return {
      reply: `مرحباً بالمواطن السوداني الصالح 🇸🇩🤝! درس مقومات الدولة والتربية الوطنية للصف السادس هو بوصلتك لفهم وطنك ومجتمعك:

1. **مقومات الدولة الأربعة:**
   لكي تقوم أي دولة في العالم لابد من توفر أربعة أركان أساسية:
   - **١. الشعب:** السكان والمواطنون الذين يعيشون معاً وتربطهم وشائج الانتماء.
   - **٢. الإقليم (الأرض):** الرقعة الجغرافية بحدودها البرية والمائية والجوية.
   - **٣. الحكومة (السلطة السياسية):** الهيئة الحاكمة التي تضع القوانين وتدير شؤون المجتمع.
   - **٤. السيادة:** استقلال الدولة التام وقدرتها على فرض القانون داخلياً دون تدخل خارجي.

2. **الفرق بين الحقوق والواجبات:**
   - **الحقوق (ما يمنحه لك الوطن):**
     - حق التعليم المجاني والرعاية الصحية.
     - حق الأمن والأمان والحرية والمساواة أمام القانون.
     - حق التعبير والمشاركة الإيجابية.
   - **الواجبات (ما تقدمه أنت لوطنك):**
     - الدفاع عن حياض الوطن وصون وحدته.
     - احترام القوانين ودفع الضرائب والرسوم القانونية.
     - الحفاظ على الممتلكات العامة والمرافق ونظافة البيئة.
     - الإخلاص والاجتهاد في الدراسة والعمل لبناء مستقبل السودان.

💡 **سؤال سقراطي:** لماذا لا تستقيم الدولة إذا أخذ المواطن كل حقوقه وتخلى عن أداء واجباته؟ كيف نصنع وطناً قوياً متماسكاً؟ 🇸🇩❤️`
    };
  }

  // Fallback general guidance
  return {
    reply: `أهلاً بك يا بطل التاريخ الحبيب 🏛️📜! يسعدني جداً أن أرافقك في استكشاف كتاب التاريخ والتربية الوطنية للصف السادس (منهج بخت الرضا المعتمد).

يمكنك سؤالي عن أي درس من الدروس الآتية:
- ⚔️ **تاريخ السودان والاحتلال التركي:** حملة 1821م، معركة كورتي، صمود مهيرة بت عبود، سقوط سنار، وحريق شندي والمك نمر.
- 🕌 **الحضارة العباسية والإسلامية:** تخطيط مدينة بغداد المدورة، أبو جعفر المنصور، وبيت الحكمة.
- 👑 **الممالك الإفريقية الإسلامية:** إمبراطورية مالي وحج منسا موسى الذهبي 1324م، ومملكة سنغاي وتجارة تمبكتو.
- ⚙️ **عصر النهضة والثورة الصناعية:** اختراع الطباعة، الآلة البخارية لجيمس واط 1769م، وثورة القطارات والمصانع.
- 🇸🇩 **التربية الوطنية والمواطنة:** أركان الدولة الأربعة، حقوقك وواجباتك كمواطن سوداني مخلص.

💡 **جرّب أن تسألني:** "اشرح لي حريق شندي بالرسم" أو "كيف تم تخطيط مدينة بغداد المدورة؟" وهيا بنا نبحر معاً! 🚀`
  };
}

// ── 🎯 3 Interactive Challenge Quizzes for Grade 6 History ──────────────────
interface HistoryQuizItem {
  id: number;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
  source: string;
}

const HISTORY_QUIZ_QUESTIONS: HistoryQuizItem[] = [
  {
    id: 1,
    question: 'في أي معركة حثت الشاعرة السودانية مهيرة بت عبود فرسان الشايقية لمقاومة جيش إسماعيل باشا؟',
    options: [
      'معركة كورتي (نوفمبر 1820م)',
      'معركة شندي (أكتوبر 1822م)',
      'معركة كرري (سبتمبر 1898م)',
      'معركة سنار (يونيو 1821م)'
    ],
    correctIdx: 0,
    explanation: 'أشعلت مهيرة بت عبود الحماس في نفوس فرسان الشايقية في معركة كورتي عام 1820م بمحاذاة النيل دفاعاً عن الأرض والعرض.',
    source: 'كتاب تاريخ السودان - الصف السادس (الوحدة الأولى)'
  },
  {
    id: 2,
    question: 'ما هو الشكل الهندسي الفريد الذي اختاره الخليفة أبو جعفر المنصور لبناء مدينة بغداد عام 145هـ؟',
    options: [
      'المخطط الدائري (المدينة المدورة)',
      'المخطط المربع المحاط بالأبراج',
      'المخطط الطولي على شاطئ الفرات',
      'المخطط المثلثي'
    ],
    correctIdx: 0,
    explanation: 'صمم المنصور مدينة بغداد على شكل دائرة هندسية محكمة لسهولة الدفاع عنها، وجعل قصر قبة الذهب والمسجد في مركزها تماماً.',
    source: 'كتاب التاريخ - الصف السادس (الوحدة الثانية: الحضارة العباسية)'
  },
  {
    id: 3,
    question: 'من هو المخترع الاسكتلندي الذي طوّر الآلة البخارية عام 1769م وأطلق شرارة الثورة الصناعية؟',
    options: [
      'جيمس واط',
      'توماس إديسون',
      'جورج ستيفنسون',
      'ألكسندر غراهام بيل'
    ],
    correctIdx: 0,
    explanation: 'طوّر جيمس واط الآلة البخارية عام 1769م، مما مكّن المصانع والقطارات والسفن من العمل بالطاقة البخارية بديلاً عن الجهد العضلي.',
    source: 'كتاب التاريخ - الصف السادس (الوحدة الرابعة: الثورة الصناعية)'
  }
];

interface AiHistoryTutorProps {
  currentUser?: any;
  onSignInWithGoogle?: () => Promise<void>;
  initialLessonTitle?: string;
}

export const AiHistoryTutor: React.FC<AiHistoryTutorProps> = ({
  currentUser,
  onSignInWithGoogle,
  initialLessonTitle
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: `أهلاً وسهلاً بك يا بطل التاريخ الحبيب 🏛️📜! أنا "الأستاذ طارق" — رفيقك ومعلمك الذكي لمقرر التاريخ والتربية الوطنية للصف السادس الابتدائي (منهج المركز القومي للمناهج والبحث التربوي - بخت الرضا).

سواءً أردت معرفة تفاصيل الغزو التركي وبطولات الشايقية والمك نمر، أو استكشاف أسرار مدينة بغداد المدورة، أو حج ملك مالي منسا موسى وثروته الذهبية، أو اختراع الآلة البخارية — اسألني وسأشرح لك بالخطوات والرسوم التوضيحية المعتمدة! ⚔️💡`,
      diagram: CURRICULUM_DIAGRAMS['sudan_1821_campaign']
    }
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDiagram, setSelectedDiagram] = useState<DiagramData | null>(CURRICULUM_DIAGRAMS['sudan_1821_campaign']);
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'diagrams' | 'quiz'>('chat');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Audio & Voice State
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceSpeaker, setVoiceSpeaker] = useState<'osman' | 'israa'>('osman');
  const [activeSpeechIdx, setActiveSpeechIdx] = useState<number | null>(null);

  // Gamification State
  const [xp, setXp] = useState(90);
  const [streak, setStreak] = useState(1);

  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswerIdx, setSelectedAnswerIdx] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle Speech Recognition (STT)
  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('متصفحك الحالي لا يدعم التعرف الصوتي المباشر. يرجى استخدام متصفح Google Chrome أو Microsoft Edge الحديث.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'ar-SD';

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onerror = () => setIsListening(false);
      rec.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          setInputVal(transcript);
        }
      };

      recognitionRef.current = rec;
      rec.start();
    } catch (e) {
      console.warn('STT Error:', e);
      setIsListening(false);
    }
  };

  // Handle Audio Speech (TTS)
  const speakText = async (text: string, msgIndex: number) => {
    if (isSpeaking && activeSpeechIdx === msgIndex) {
      audioRef.current?.pause();
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
      setActiveSpeechIdx(null);
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }
    window.speechSynthesis?.cancel();

    const clean = cleanTtsText(text);
    if (!clean) return;

    setIsSpeaking(true);
    setActiveSpeechIdx(msgIndex);

    // 1. Try Cloudflare Edge High-Quality Sudanese Voice Engine
    try {
      const res = await fetch(CLOUD_TTS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: clean.slice(0, 500),
          speaker: voiceSpeaker
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audio_url || data.url) {
          const audio = new Audio(data.audio_url || data.url);
          audioRef.current = audio;
          audio.onended = () => {
            setIsSpeaking(false);
            setActiveSpeechIdx(null);
          };
          audio.onerror = () => fallbackBrowserSpeech(clean);
          await audio.play();
          return;
        }
      }
    } catch {
      // Fallback
    }

    // 2. Browser Web Speech Fallback
    fallbackBrowserSpeech(clean);
  };

  const fallbackBrowserSpeech = (text: string) => {
    if (!window.speechSynthesis) {
      setIsSpeaking(false);
      setActiveSpeechIdx(null);
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ar-SA';
    utter.rate = 0.95;
    utter.onend = () => {
      setIsSpeaking(false);
      setActiveSpeechIdx(null);
    };
    utter.onerror = () => {
      setIsSpeaking(false);
      setActiveSpeechIdx(null);
    };
    window.speechSynthesis.speak(utter);
  };

  const handleCopyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Main Query Dispatcher
  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputVal).trim();
    if (!textToSend || isLoading) return;

    playSound('click');
    const userMessage: Message = { role: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInputVal('');
    setIsLoading(true);

    let answerText = '';
    let diagramToAttach: DiagramData | null = null;

    // 1. Check if query requests a diagram
    if (textToSend.includes('رسم') || textToSend.includes('صورة') || textToSend.includes('مخطط') || textToSend.includes('خريطة')) {
      if (textToSend.includes('بغداد') || textToSend.includes('المنصور') || textToSend.includes('مدورة')) {
        diagramToAttach = CURRICULUM_DIAGRAMS['baghdad_round_city'];
      } else if (textToSend.includes('منسا') || textToSend.includes('موسى') || textToSend.includes('مالي') || textToSend.includes('تمبكتو')) {
        diagramToAttach = CURRICULUM_DIAGRAMS['mansa_musa_hajj'];
      } else if (textToSend.includes('صناعية') || textToSend.includes('واط') || textToSend.includes('بخار') || textToSend.includes('قطار')) {
        diagramToAttach = CURRICULUM_DIAGRAMS['industrial_revolution'];
      } else {
        diagramToAttach = CURRICULUM_DIAGRAMS['sudan_1821_campaign'];
      }
    }

    // 2. Call Cloud Edge Mentor API (24/7 Zero-downtime)
    try {
      const historyPayload = messages.slice(-4).map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await fetch(CLOUD_MENTOR_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          stage: 'history',
          subject: 'تاريخ',
          history: historyPayload
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply) {
          answerText = data.reply;
        }
      }
    } catch (err) {
      console.warn('Cloud API fallback to local history engine:', err);
    }

    // 3. Seamless Offline Knowledge Fallback
    if (!answerText) {
      const offline = getOfflineHistoryAnswer(textToSend);
      answerText = offline.reply;
      if (!diagramToAttach && offline.diagramKey && CURRICULUM_DIAGRAMS[offline.diagramKey]) {
        diagramToAttach = CURRICULUM_DIAGRAMS[offline.diagramKey];
      }
    }

    if (diagramToAttach) {
      setSelectedDiagram(diagramToAttach);
    }

    // Gamification Reward (+15 XP)
    setXp((prev) => prev + 15);
    setStreak((prev) => prev + 1);
    playSound('success');

    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        text: answerText,
        diagram: diagramToAttach
      }
    ]);
    setIsLoading(false);
  };

  // Quiz Handling
  const handleSelectQuizAnswer = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswerIdx(idx);
    playSound('click');
  };

  const handleSubmitQuizAnswer = () => {
    if (selectedAnswerIdx === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);

    const currentQ = HISTORY_QUIZ_QUESTIONS[currentQuizIndex];
    if (selectedAnswerIdx === currentQ.correctIdx) {
      playSound('levelup');
      setQuizScore((prev) => prev + 1);
      setXp((prev) => prev + 25);
    } else {
      playSound('fail');
    }
  };

  const handleNextQuizQuestion = () => {
    playSound('click');
    if (currentQuizIndex < HISTORY_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedAnswerIdx(null);
      setIsAnswerSubmitted(false);
    } else {
      // Completed all
      setCurrentQuizIndex(0);
      setSelectedAnswerIdx(null);
      setIsAnswerSubmitted(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
      {/* Top Banner & Identity Header */}
      <div className="bg-gradient-to-r from-[#8C6239] via-[#6d4824] to-[#45280c] rounded-3xl p-5 sm:p-6 text-white shadow-xl border border-amber-600/30 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-right">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-black/25 backdrop-blur-md p-1 border border-amber-400/40 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
            <img
              src="/assets/sudan-bot-avatar.png"
              alt="الأستاذ طارق - معلم التاريخ"
              className="w-full h-full object-cover rounded-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/icon.svg';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-[#FAF4ED] font-serif">
                الأستاذ طارق (المعلم الذكي للتاريخ) 🏛️📜
              </h2>
              <span className="bg-amber-500/90 text-slate-950 text-xs font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                الصف السادس الابتدائي
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#FAF4ED]/85 mt-1 font-sans">
              المرشد السقراطي التفاعلي لمنهج وزارة التربية والتعليم السودانية (بخت الرضا) • مدعوم بالخرائط والمخططات
            </p>
          </div>
        </div>

        {/* Badges & Gamification Bar */}
        <div className="flex items-center gap-3 bg-black/30 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/15">
          <div className="text-center px-2 border-l border-white/15">
            <div className="text-[10px] text-[#FAF4ED]/70 font-semibold">نقاط المؤرخ</div>
            <div className="text-base sm:text-lg font-black text-amber-400 flex items-center justify-center gap-1">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{xp} XP</span>
            </div>
          </div>

          <div className="text-center px-2">
            <div className="text-[10px] text-[#FAF4ED]/70 font-semibold">التفاعل اليومي</div>
            <div className="text-base sm:text-lg font-black text-amber-300 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>{streak} 🔥</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-indigo-950/80 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => {
            playSound('click');
            setActiveSubTab('chat');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'chat'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-[#18152c] text-slate-300 hover:bg-[#221d3f] border border-indigo-950/60'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>المحادثة المباشرة مع الأستاذ</span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveSubTab('diagrams');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'diagrams'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-[#18152c] text-slate-300 hover:bg-[#221d3f] border border-indigo-950/60'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>بنك المخططات والخرائط التاريخية (4)</span>
        </button>

        <button
          onClick={() => {
            playSound('click');
            setActiveSubTab('quiz');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeSubTab === 'quiz'
              ? 'bg-amber-500 text-slate-950 shadow-md'
              : 'bg-[#18152c] text-slate-300 hover:bg-[#221d3f] border border-indigo-950/60'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>مسابقات وأسئلة التحدي التاريخية 🎯</span>
        </button>
      </div>

      {/* ── Sub-Tab 1: Chat View ── */}
      {activeSubTab === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Chat Box (8 Cols) */}
          <div className="lg:col-span-8 bg-[#121020] rounded-3xl border border-indigo-950/80 shadow-xl flex flex-col h-[650px] overflow-hidden">
            {/* Chat Top Controls */}
            <div className="p-3.5 bg-[#18152c] border-b border-indigo-950/80 flex items-center justify-between text-xs font-semibold">
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-bold">المعلم متصل وجاهز للإجابة 24/7</span>
              </div>

              {/* Speaker Select */}
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-[11px] hidden sm:inline">صوت الإلقاء:</span>
                <button
                  onClick={() => setVoiceSpeaker((prev) => (prev === 'osman' ? 'israa' : 'osman'))}
                  className="bg-[#201a38] hover:bg-[#2d244c] text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  title="التبديل بين صوت الأستاذ عثمان والمعلمة إسراء"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{voiceSpeaker === 'osman' ? 'صوت: أ. عثمان 👨‍🏫' : 'صوت: أ. إسراء 👩‍🏫'}</span>
                </button>
              </div>
            </div>

            {/* Chat Message Scrollable Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 items-start ${
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar Icon */}
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border ${
                      msg.role === 'user'
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                        : 'bg-indigo-900/40 border-indigo-700/50 text-indigo-300'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <Bot className="w-5 h-5" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[85%] rounded-2xl p-4 sm:p-5 shadow-sm text-right ${
                      msg.role === 'user'
                        ? 'bg-amber-500 text-slate-950 font-medium'
                        : 'bg-[#18152c] text-slate-100 border border-indigo-950/90'
                    }`}
                  >
                    {/* Message Text with simple linebreaks */}
                    <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed font-sans">
                      {msg.text}
                    </div>

                    {/* Attached Diagram if Present */}
                    {msg.diagram && (
                      <div className="mt-4 pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                            <Layers className="w-4 h-4" />
                            <span>مخطط تعليمي معتمد: {msg.diagram.title}</span>
                          </span>
                          <button
                            onClick={() => {
                              setSelectedDiagram(msg.diagram || null);
                              setActiveSubTab('diagrams');
                            }}
                            className="text-[11px] bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-2 py-0.5 rounded-md transition cursor-pointer font-bold"
                          >
                            عرض بالحجم الكامل 🔍
                          </button>
                        </div>
                        <div
                          className="rounded-xl overflow-hidden shadow-inner border border-white/10"
                          dangerouslySetInnerHTML={{ __html: msg.diagram.svg }}
                        />
                      </div>
                    )}

                    {/* Action Bar for Assistant Messages (TTS + Copy) */}
                    {msg.role === 'assistant' && (
                      <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-xs text-slate-400">
                        <span className="text-[10px] text-amber-400/80">منهج بخت الرضا المعتمد 🇸🇩</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => speakText(msg.text, idx)}
                            className="p-1.5 hover:text-amber-400 transition cursor-pointer flex items-center gap-1"
                            title="قراءة النص صوتياً"
                          >
                            {isSpeaking && activeSpeechIdx === idx ? (
                              <Square className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                            ) : (
                              <Volume2 className="w-3.5 h-3.5" />
                            )}
                            <span className="text-[11px]">
                              {isSpeaking && activeSpeechIdx === idx ? 'إيقاف' : 'استمع'}
                            </span>
                          </button>

                          <button
                            onClick={() => handleCopyText(msg.text, idx)}
                            className="p-1.5 hover:text-amber-400 transition cursor-pointer flex items-center gap-1"
                            title="نسخ الإجابة"
                          >
                            {copiedIndex === idx ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span className="text-[11px]">
                              {copiedIndex === idx ? 'تم النسخ' : 'نسخ'}
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Loader */}
              {isLoading && (
                <div className="flex gap-3 items-center text-xs text-slate-400 animate-pulse">
                  <div className="w-8 h-8 rounded-2xl bg-indigo-950 flex items-center justify-center text-amber-400 border border-amber-500/30">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-[#18152c] p-3 rounded-2xl border border-indigo-950/80 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
                    <span>الأستاذ طارق يراجع وثائق وأحداث التاريخ بتمهل...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar with STT & Send */}
            <div className="p-3 sm:p-4 bg-[#18152c] border-t border-indigo-950/80">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                {/* STT Mic Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-3 rounded-xl transition cursor-pointer shrink-0 border ${
                    isListening
                      ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-bounce'
                      : 'bg-[#201a38] text-slate-300 border-indigo-950 hover:text-amber-400'
                  }`}
                  title={isListening ? 'إيقاف التسجيل الصوتي' : 'تحدث صوتياً باللهجة السودانية أو الفصحى'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* Text Input */}
                <input
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="اسأل الأستاذ طارق: 'لماذا غزا إسماعيل باشا السودان؟' أو 'اشرح بغداد بالرسم'..."
                  className="flex-1 bg-[#121020] border border-indigo-950/80 focus:border-amber-500/80 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none text-right font-sans"
                  disabled={isLoading}
                />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!inputVal.trim() || isLoading}
                  className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold p-3 rounded-xl transition shadow-md cursor-pointer shrink-0"
                  title="إرسال السؤال"
                >
                  <Send className="w-4 h-4 transform rotate-180" />
                </button>
              </form>
            </div>
          </div>

          {/* Side Panel: Quick Curriculum Questions (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#121020] rounded-3xl p-5 border border-indigo-950/80 shadow-md">
              <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <span>أسئلة محورية من منهج الصف السادس</span>
              </h3>
              <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                اضغط على أي سؤال من الأسئلة التالية لبدء النقاش السقراطي والشرح المباشر:
              </p>
              <div className="space-y-2">
                {PRESET_HISTORY_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q)}
                    className="w-full text-right p-3 rounded-xl bg-[#18152c] hover:bg-[#201a38] text-slate-200 text-xs font-medium border border-indigo-950 hover:border-amber-500/40 transition-all cursor-pointer flex items-start gap-2"
                  >
                    <span className="w-5 h-5 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="flex-1">{q}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Socratic Tip */}
            <div className="bg-[#18152c] rounded-3xl p-4 border border-amber-500/20 text-xs text-slate-300">
              <div className="flex items-center gap-2 font-bold text-amber-400 mb-1.5">
                <BookOpen className="w-4 h-4" />
                <span>نصيحة الأستاذ طارق للمذاكرة:</span>
              </div>
              <p className="leading-relaxed text-slate-400">
                «التاريخ ليس مجرد أرقام وتواريخ جامدة يا بني، بل هو قصة أبطال ومواقف وعبر. عندما تفهم السبب وراء كل حدث، سيبقى راسخاً في ذاكرتك إلى الأبد!»
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Sub-Tab 2: Visual Diagrams Explorer View ── */}
      {activeSubTab === 'diagrams' && (
        <div className="space-y-6">
          {/* Diagrams Selector Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.values(CURRICULUM_DIAGRAMS).map((diag) => (
              <button
                key={diag.id}
                onClick={() => {
                  playSound('click');
                  setSelectedDiagram(diag);
                }}
                className={`p-4 rounded-2xl text-right transition-all cursor-pointer border ${
                  selectedDiagram?.id === diag.id
                    ? 'bg-[#1e1938] border-amber-500 shadow-lg text-amber-300'
                    : 'bg-[#121020] border-indigo-950 text-slate-300 hover:bg-[#18152c]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-400">مخطط تفاعلي</span>
                  <Layers className="w-4 h-4 text-amber-400" />
                </div>
                <h4 className="text-xs font-bold line-clamp-2 leading-relaxed">{diag.title}</h4>
              </button>
            ))}
          </div>

          {/* Active Diagram Viewer */}
          {selectedDiagram && (
            <div className="bg-[#121020] rounded-3xl p-6 border border-indigo-950/80 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-indigo-950 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-100 font-serif">{selectedDiagram.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{selectedDiagram.caption}</p>
                </div>
                <button
                  onClick={() => {
                    setActiveSubTab('chat');
                    handleSendMessage(`اشرح لي بالتفصيل مخطط: ${selectedDiagram.title}`);
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm cursor-pointer flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                >
                  <Bot className="w-4 h-4" />
                  <span>ناقش هذا المخطط مع الأستاذ</span>
                </button>
              </div>

              {/* Render SVG */}
              <div
                className="bg-[#18152c] rounded-2xl p-4 border border-indigo-950/80 shadow-inner overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: selectedDiagram.svg }}
              />

              {/* Key Teaching Points */}
              {selectedDiagram.keyPoints && selectedDiagram.keyPoints.length > 0 && (
                <div className="bg-[#18152c] rounded-2xl p-5 border border-indigo-950/80 space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>النقاط الجوهرية وفق مقرر وزارة التربية والتعليم:</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300 leading-relaxed list-disc list-inside">
                    {selectedDiagram.keyPoints.map((pt, i) => (
                      <li key={i} className="text-right">
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Sub-Tab 3: Interactive Challenge Quizzes ── */}
      {activeSubTab === 'quiz' && (
        <div className="max-w-3xl mx-auto bg-[#121020] rounded-3xl p-6 sm:p-8 border border-indigo-950/80 shadow-xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-indigo-950 pb-4">
            <div>
              <span className="text-xs font-bold text-amber-400">تحدي المؤرخ الصغير 🎯</span>
              <h3 className="text-lg font-bold text-slate-100 mt-1 font-serif">
                السؤال {currentQuizIndex + 1} من {HISTORY_QUIZ_QUESTIONS.length}
              </h3>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300">
              النتيجة الحالية: {quizScore} / {HISTORY_QUIZ_QUESTIONS.length}
            </div>
          </div>

          {/* Question Text */}
          <div className="bg-[#18152c] rounded-2xl p-5 border border-indigo-950/80">
            <p className="text-sm sm:text-base font-bold text-slate-100 text-right leading-relaxed font-serif">
              {HISTORY_QUIZ_QUESTIONS[currentQuizIndex].question}
            </p>
            <span className="inline-block mt-3 text-[11px] text-slate-400 bg-[#201a38] px-2.5 py-1 rounded-md">
              📖 المصدر: {HISTORY_QUIZ_QUESTIONS[currentQuizIndex].source}
            </span>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {HISTORY_QUIZ_QUESTIONS[currentQuizIndex].options.map((opt, idx) => {
              let btnStyle = 'bg-[#18152c] border-indigo-950 text-slate-200 hover:bg-[#201a38]';
              if (isAnswerSubmitted) {
                if (idx === HISTORY_QUIZ_QUESTIONS[currentQuizIndex].correctIdx) {
                  btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold';
                } else if (selectedAnswerIdx === idx) {
                  btnStyle = 'bg-red-950/60 border-red-500 text-red-300 font-bold';
                }
              } else if (selectedAnswerIdx === idx) {
                btnStyle = 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectQuizAnswer(idx)}
                  disabled={isAnswerSubmitted}
                  className={`w-full text-right p-4 rounded-xl text-xs sm:text-sm transition-all border flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <span className="flex-1">{opt}</span>
                  {isAnswerSubmitted && idx === HISTORY_QUIZ_QUESTIONS[currentQuizIndex].correctIdx && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mr-2" />
                  )}
                  {isAnswerSubmitted && selectedAnswerIdx === idx && idx !== HISTORY_QUIZ_QUESTIONS[currentQuizIndex].correctIdx && (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0 mr-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Banner when answered */}
          {isAnswerSubmitted && (
            <div
              className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                selectedAnswerIdx === HISTORY_QUIZ_QUESTIONS[currentQuizIndex].correctIdx
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                  : 'bg-red-950/40 border-red-500/40 text-red-200'
              }`}
            >
              <div className="font-bold mb-1 flex items-center gap-1.5">
                {selectedAnswerIdx === HISTORY_QUIZ_QUESTIONS[currentQuizIndex].correctIdx ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>إجابة صحيحة ومتميزة يا بطل! (+25 XP) 🎉</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-400" />
                    <span>إجابة غير دقيقة — تعلّم من التعليل التالي:</span>
                  </>
                )}
              </div>
              <p className="mt-1">{HISTORY_QUIZ_QUESTIONS[currentQuizIndex].explanation}</p>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitQuizAnswer}
                disabled={selectedAnswerIdx === null}
                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition cursor-pointer text-xs sm:text-sm"
              >
                تأكيد الإجابة
              </button>
            ) : (
              <button
                onClick={handleNextQuizQuestion}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-2.5 rounded-xl transition cursor-pointer text-xs sm:text-sm flex items-center gap-2"
              >
                <span>{currentQuizIndex < HISTORY_QUIZ_QUESTIONS.length - 1 ? 'السؤال التالي ⬅️' : 'إعادة التحدي 🔄'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
