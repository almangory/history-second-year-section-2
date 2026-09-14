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
  'ما هي أسباب ودوافع غزو محمد علي باشا للسودان عام ١٨٢٠م؟',
  'اشرح أحداث معركة كورتي وموقعة بارا واستبسال السودانيين أمام السلاح الناري؟',
  'كيف وقعت حادثة حريق شندي ومقتل إسماعيل باشا على يد المك نمر عام ١٨٢٢م؟',
  'وضح خطوات إعلان استقلال السودان من داخل البرلمان عام ١٩٥٥م ورفع العلم عام ١٩٥٦م؟',
  'ما هي أسباب الثورة الفرنسية عام ١٧٨٩م ودور فلاسفة التنوير وسقوط الباستيل؟',
  'كيف حقق المستشار بسمارك الوحدة الألمانية بسياسة الدم والحديد عام ١٨٧١م؟',
  'ما هي أزمة سراجيفو عام ١٩١٤م وما أسباب اندلاع الحرب العالمية الأولى؟'
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
    caption: 'مسار جيش إسماعيل باشا على وادي النيل، معركة كورتي وموقف الشايقية، ودخول سنار، ثم حريق شندي 1822م (كتاب التاريخ - الصف الثاني ثانوي)',
    keyPoints: [
      'حملة إسماعيل باشا (1821م): تحركت بمحاذاة النيل بحثاً عن الذهب والرجال وتأمين منابع النيل ومطاردة المماليك.',
      'معركة كورتي (نوفمبر 1820م): أظهر فرسان الشايقية بسالة فائقة، ولكن تفوق السلاح الناري والمدافع حسم المعركة لصالح الغزاة.',
      'سقوط سنار (يونيو 1821م): استسلام بادي السادس بعد مقتل وزيره محمد ود عدلان، وانتهاء عهد سلطنة الفونج.',
      'حريق شندي (أكتوبر 1822م): رد المك نمر البطولي على إهانة إسماعيل باشا بإحراق معسكره ليلاً، وتلاه انتقام الدفتردار الدموي.'
    ],
    svg: `<svg viewBox="0 0 740 390" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:'Cairo',sans-serif;background:#18152c;border-radius:18px;">
      <defs>
        <linearGradient id="histGrad1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#b45309"/>
          <stop offset="100%" stop-color="#78350f"/>
        </linearGradient>
      </defs>
      
      <!-- عنوان المخطط -->
      <rect x="20" y="15" width="700" height="42" rx="12" fill="#8C6239" />
      <text x="370" y="42" text-anchor="middle" fill="#FAF4ED" font-size="16" font-weight="900">
        ⚔️ محطات الغزو التركي 1820-1821م وبطولات المقاومة الوطنية السودانية
      </text>

      <!-- 1. أسباب الغزو -->
      <g transform="translate(25, 75)">
        <rect width="160" height="250" rx="14" fill="#201a38" stroke="#8C6239" stroke-width="2" />
        <text x="80" y="30" text-anchor="middle" fill="#f59e0b" font-size="13" font-weight="bold">١. دوافع الغزو 1820م</text>
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
        <text x="80" y="168" text-anchor="middle" fill="#94a3b8" font-size="10">• رفض تسليم السلاح</text>
        <text x="80" y="188" text-anchor="middle" fill="#94a3b8" font-size="10">• ملحمة بطولية خالدة</text>
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
        <text x="80" y="168" text-anchor="middle" fill="#94a3b8" font-size="10">• مقتل محمد ود عدلان</text>
        <text x="80" y="188" text-anchor="middle" fill="#94a3b8" font-size="10">• فرض الضرائب الباهظة</text>
        <rect x="15" y="208" width="130" height="26" rx="6" fill="#8C6239" />
        <text x="80" y="225" text-anchor="middle" fill="#FAF4ED" font-size="10" font-weight="bold">14 يونيو 1821م</text>
      </g>

      <!-- 4. حريق شندي والمك نمر -->
      <g transform="translate(550, 75)">
        <rect width="165" height="250" rx="14" fill="#201a38" stroke="#ef4444" stroke-width="2" />
        <text x="82" y="30" text-anchor="middle" fill="#ef4444" font-size="13" font-weight="bold">٤. حريق شندي 1822م</text>
        <circle cx="82" cy="75" r="28" fill="#450a0a" />
        <text x="82" y="83" text-anchor="middle" font-size="24">🔥</text>
        <text x="82" y="125" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="bold">عزة وكرامة المك نمر</text>
        <text x="82" y="148" text-anchor="middle" fill="#94a3b8" font-size="10">• صفعة غليون إسماعيل</text>
        <text x="82" y="168" text-anchor="middle" fill="#94a3b8" font-size="10">• إحراق مقر إسماعيل ليلاً</text>
        <text x="82" y="188" text-anchor="middle" fill="#94a3b8" font-size="10">• هجرة المك نمر للحبشة</text>
        <rect x="15" y="208" width="135" height="26" rx="6" fill="#991b1b" />
        <text x="82" y="225" text-anchor="middle" fill="#FAF4ED" font-size="10" font-weight="bold">أكتوبر 1822م</text>
      </g>
    </svg>`
  },

  sudan_independence_1956: {
    id: 'sudan_independence_1956',
    title: 'مسار استقلال السودان ومراحل الحكم الوطني (1956 - 1985م)',
    caption: 'من مؤتمر الخريجين 1938م وإعلان الاستقلال من البرلمان 1955م إلى ثورة أكتوبر 1964م وانتفاضة أبريل 1985م (كتاب التاريخ - الصف الثاني ثانوي)',
    keyPoints: [
      'مؤتمر الخريجين العام (1938م): تقديم مذكرة 1942م المطالبة بحق تقرير المصير للسودانيين.',
      'اتفاقية الحكم الذاتي (1953م): إلغاء الحكم الثنائي وإجراء أول انتخابات برلمانية وتشكيل حكومة الأزهري.',
      'إعلان الاستقلال (19 ديسمبر 1955م): إجازة إعلان الاستقلال بالإجماع من البرلمان واقتراح عبدالرحمن دبكة.',
      'رفع العلم (1 يناير 1956م): رفع علم السودان المستقل بسراي الحاكم العام على يد الأزهري ومحجوب.'
    ],
    svg: `<svg viewBox="0 0 740 390" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:'Cairo',sans-serif;background:#18152c;border-radius:18px;">
      <!-- العنوان -->
      <rect x="20" y="15" width="700" height="42" rx="12" fill="#047857" />
      <text x="370" y="42" text-anchor="middle" fill="#FAF4ED" font-size="16" font-weight="900">
        🇸🇩 مسيرة الاستقلال الوطني وبناء الدولة السودانية المعاصرة (1956 - 1985م)
      </text>

      <!-- 1. النخبة ومؤتمر الخريجين -->
      <g transform="translate(25, 75)">
        <rect width="160" height="250" rx="14" fill="#201a38" stroke="#10b981" stroke-width="2" />
        <text x="80" y="30" text-anchor="middle" fill="#34d399" font-size="13" font-weight="bold">١. اليقظة الوطنية</text>
        <circle cx="80" cy="75" r="28" fill="#064e3b" />
        <text x="80" y="83" text-anchor="middle" font-size="24">📜</text>
        <text x="80" y="125" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="bold">مؤتمر الخريجين 1938</text>
        <text x="80" y="148" text-anchor="middle" fill="#94a3b8" font-size="10">• نادي الخريجين 1918م</text>
        <text x="80" y="168" text-anchor="middle" fill="#94a3b8" font-size="10">• مذكرة المطالب 1942م</text>
        <text x="80" y="188" text-anchor="middle" fill="#94a3b8" font-size="10">• نشأة الأحزاب الوطنية</text>
        <rect x="15" y="208" width="130" height="26" rx="6" fill="#047857" />
        <text x="80" y="225" text-anchor="middle" fill="#FAF4ED" font-size="10" font-weight="bold">حق تقرير المصير</text>
      </g>

      <!-- 2. اتفاقية 1953 والسودنة -->
      <g transform="translate(200, 75)">
        <rect width="160" height="250" rx="14" fill="#201a38" stroke="#3b82f6" stroke-width="2" />
        <text x="80" y="30" text-anchor="middle" fill="#60a5fa" font-size="13" font-weight="bold">٢. الحكم الذاتي 1953</text>
        <circle cx="80" cy="75" r="28" fill="#1e3a8a" />
        <text x="80" y="83" text-anchor="middle" font-size="24">⚖️</text>
        <text x="80" y="125" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="bold">تصفية الاستعمار</text>
        <text x="80" y="148" text-anchor="middle" fill="#94a3b8" font-size="10">• اتفاقية 12 يناير 1953</text>
        <text x="80" y="168" text-anchor="middle" fill="#94a3b8" font-size="10">• أول انتخابات برلمانية</text>
        <text x="80" y="188" text-anchor="middle" fill="#94a3b8" font-size="10">• لجنة السودنة 1955م</text>
        <rect x="15" y="208" width="130" height="26" rx="6" fill="#1d4ed8" />
        <text x="80" y="225" text-anchor="middle" fill="#FAF4ED" font-size="10" font-weight="bold">أول حكومة للأزهري</text>
      </g>

      <!-- 3. إعلان الاستقلال ورفع العلم -->
      <g transform="translate(375, 75)">
        <rect width="160" height="250" rx="14" fill="#201a38" stroke="#f59e0b" stroke-width="2" />
        <text x="80" y="30" text-anchor="middle" fill="#fbbf24" font-size="13" font-weight="bold">٣. يوم الاستقلال 1956</text>
        <circle cx="80" cy="75" r="28" fill="#78350f" />
        <text x="80" y="83" text-anchor="middle" font-size="24">🇸🇩</text>
        <text x="80" y="125" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="bold">السيادة الوطنية</text>
        <text x="80" y="148" text-anchor="middle" fill="#94a3b8" font-size="10">• برلمان 19 ديسمبر 1955</text>
        <text x="80" y="168" text-anchor="middle" fill="#94a3b8" font-size="10">• رفع العلم 1 يناير 1956</text>
        <text x="80" y="188" text-anchor="middle" fill="#94a3b8" font-size="10">• مجلس السيادة الخماسي</text>
        <rect x="15" y="208" width="130" height="26" rx="6" fill="#d97706" />
        <text x="80" y="225" text-anchor="middle" fill="#FAF4ED" font-size="10" font-weight="bold">الحرية الكاملة</text>
      </g>

      <!-- 4. ثورة أكتوبر وانتفاضة أبريل -->
      <g transform="translate(550, 75)">
        <rect width="165" height="250" rx="14" fill="#201a38" stroke="#a855f7" stroke-width="2" />
        <text x="82" y="30" text-anchor="middle" fill="#c084fc" font-size="13" font-weight="bold">٤. الثورات الشعبية</text>
        <circle cx="82" cy="75" r="28" fill="#581c87" />
        <text x="82" y="83" text-anchor="middle" font-size="24">✌️</text>
        <text x="82" y="125" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="bold">إرادة الشعب العظيم</text>
        <text x="82" y="148" text-anchor="middle" fill="#94a3b8" font-size="10">• ثورة 21 أكتوبر 1964</text>
        <text x="82" y="168" text-anchor="middle" fill="#94a3b8" font-size="10">• استشهاد القرشي بالجامعة</text>
        <text x="82" y="188" text-anchor="middle" fill="#94a3b8" font-size="10">• انتفاضة رجب/أبريل 1985</text>
        <rect x="15" y="208" width="135" height="26" rx="6" fill="#7e22ce" />
        <text x="82" y="225" text-anchor="middle" fill="#FAF4ED" font-size="10" font-weight="bold">سوار الذهب وحكومة الجزولي</text>
      </g>
    </svg>`
  },

  french_revolution_1789: {
    id: 'french_revolution_1789',
    title: 'مخطط مراحل الثورة الفرنسية 1789م وحقوق الإنسان والمواطن',
    caption: 'أسباب الثورة وسقوط سجن الباستيل وإلغاء الإقطاع وإعلان الجمهورية (كتاب التاريخ - الصف الثاني ثانوي)',
    keyPoints: [
      'الأسباب والطبقات: استبداد الملكية المطلقة للويس السادس عشر، والنظام الطبقي (الأشراف ورجال الدين والعامة).',
      'فلاسفة التنوير: مونتسكيو (فصل السلطات)، فولتير (الحرية والنقد)، وروسو (العقد الاجتماعي).',
      'سقوط الباستيل (14 يوليو 1789م): تحطيم رمز الاستبداد الملكي وإعلان حقوق الإنسان والمواطن.',
      'الجمهورية وعهد الإرهاب: إعدام لويس السادس عشر بالمقصلة 1793م وحكم اليعاقبة وروبسبير ثم حكومة الإدارة 1795م.'
    ],
    svg: `<svg viewBox="0 0 740 390" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;font-family:'Cairo',sans-serif;background:#18152c;border-radius:18px;">
      <!-- العنوان -->
      <rect x="20" y="15" width="700" height="42" rx="12" fill="#1d4ed8" />
      <text x="370" y="42" text-anchor="middle" fill="#FAF4ED" font-size="16" font-weight="900">
        🇫🇷 الثورة الفرنسية 1789م والتحول الديمقراطي والجمهوري في أوروبا
      </text>

      <!-- 1. أسباب الثورة وفلاسفة التنوير -->
      <g transform="translate(30, 80)">
        <rect width="150" height="240" rx="12" fill="#201a38" stroke="#3b82f6" stroke-width="2" />
        <text x="75" y="28" text-anchor="middle" fill="#60a5fa" font-size="12" font-weight="bold">١. جذور الثورة</text>
        <circle cx="75" cy="70" r="28" fill="#1e3a8a" />
        <text x="75" y="78" text-anchor="middle" font-size="24">📖</text>
        <text x="75" y="120" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="bold">فكر التنوير والطبقات</text>
        <text x="75" y="142" text-anchor="middle" fill="#94a3b8" font-size="10">مونتسكيو وفصل السلطات</text>
        <text x="75" y="162" text-anchor="middle" fill="#94a3b8" font-size="10">روسو والعقد الاجتماعي</text>
        <text x="75" y="182" text-anchor="middle" fill="#94a3b8" font-size="10">ظلم الطبقة العامة والضرائب</text>
        <rect x="15" y="202" width="120" height="24" rx="6" fill="#1d4ed8" />
        <text x="75" y="218" text-anchor="middle" fill="#FAF4ED" font-size="9.5" font-weight="bold">الأزمة المالية 1789</text>
      </g>

      <!-- 2. سقوط الباستيل -->
      <g transform="translate(210, 80)">
        <rect width="150" height="240" rx="12" fill="#201a38" stroke="#f59e0b" stroke-width="2" />
        <text x="75" y="28" text-anchor="middle" fill="#f59e0b" font-size="12" font-weight="bold">٢. اندلاع الثورة</text>
        <circle cx="75" cy="70" r="28" fill="#78350f" />
        <text x="75" y="78" text-anchor="middle" font-size="24">🏰</text>
        <text x="75" y="120" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="bold">سقوط الباستيل</text>
        <text x="75" y="142" text-anchor="middle" fill="#94a3b8" font-size="10">14 يوليو 1789م</text>
        <text x="75" y="162" text-anchor="middle" fill="#94a3b8" font-size="10">هدم رمز الاستبداد</text>
        <text x="75" y="182" text-anchor="middle" fill="#94a3b8" font-size="10">تشكيل الحرس الوطني</text>
        <rect x="15" y="202" width="120" height="24" rx="6" fill="#d97706" />
        <text x="75" y="218" text-anchor="middle" fill="#FAF4ED" font-size="9.5" font-weight="bold">عيد الحرية القومي</text>
      </g>

      <!-- 3. إعلان حقوق الإنسان -->
      <g transform="translate(390, 80)">
        <rect width="150" height="240" rx="12" fill="#201a38" stroke="#10b981" stroke-width="2" />
        <text x="75" y="28" text-anchor="middle" fill="#34d399" font-size="12" font-weight="bold">٣. قرارات تاريخية</text>
        <circle cx="75" cy="70" r="28" fill="#064e3b" />
        <text x="75" y="78" text-anchor="middle" font-size="24">📜</text>
        <text x="75" y="120" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="bold">إلغاء الإقطاع</text>
        <text x="75" y="142" text-anchor="middle" fill="#94a3b8" font-size="10">إلغاء ضريبة العشور</text>
        <text x="75" y="162" text-anchor="middle" fill="#94a3b8" font-size="10">إعلان حقوق الإنسان</text>
        <text x="75" y="182" text-anchor="middle" fill="#94a3b8" font-size="10">المساواة أمام القانون</text>
        <rect x="15" y="202" width="120" height="24" rx="6" fill="#047857" />
        <text x="75" y="218" text-anchor="middle" fill="#FAF4ED" font-size="9.5" font-weight="bold">الحرية والإخاء والمساواة</text>
      </g>

      <!-- 4. الجمهورية والإرهاب -->
      <g transform="translate(560, 80)">
        <rect width="150" height="240" rx="12" fill="#201a38" stroke="#ef4444" stroke-width="2" />
        <text x="75" y="28" text-anchor="middle" fill="#f87171" font-size="12" font-weight="bold">٤. الجمهورية والإرهاب</text>
        <circle cx="75" cy="70" r="28" fill="#450a0a" />
        <text x="75" y="78" text-anchor="middle" font-size="24">⚡</text>
        <text x="75" y="120" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="bold">المؤتمر الوطني</text>
        <text x="75" y="142" text-anchor="middle" fill="#94a3b8" font-size="10">إعدام لويس 16 (1793)</text>
        <text x="75" y="162" text-anchor="middle" fill="#94a3b8" font-size="10">روبسبير وحزب اليعاقبة</text>
        <text x="75" y="182" text-anchor="middle" fill="#94a3b8" font-size="10">حكومة الإدارة 1795م</text>
        <rect x="15" y="202" width="120" height="24" rx="6" fill="#b91c1c" />
        <text x="75" y="218" text-anchor="middle" fill="#FAF4ED" font-size="9.5" font-weight="bold">ظهور نابليون بونابرت</text>
      </g>
    </svg>`
  },

  industrial_revolution: {
    id: 'industrial_revolution',
    title: 'الثورة الصناعية واختراع الآلة البخارية (جيمس واط 1769م)',
    caption: 'الانتقال التاريخي من الجهد العضلي والحيواني إلى طاقة البخار والمصانع والقطارات والزولفرين (كتاب التاريخ - الصف الثاني ثانوي)',
    keyPoints: [
      'البداية والمكان: انطلقت الثورة الصناعية في إنجلترا في منتصف القرن الثامن عشر الميلادي (1750م).',
      'اختراع الآلة البخارية: طوّر المهندس الاسكتلندي جيمس واط الآلة البخارية عام 1769م وجعلها محركاً للمصانع والقطارات.',
      'تطوير النقل والمواصلات: اختراع جورج ستيفنسون للقاطرة البخارية عام 1825م وربط الأسواق والموانئ.',
      'انتشار الثورة في أوروبا: الزولفرين في ألمانيا 1833م، وبلجيكا وفرنسا وأمريكا وبداية التنافس الاستعماري.'
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
        <text x="75" y="162" text-anchor="middle" fill="#94a3b8" font-size="10">اتحاد الزولفرين في ألمانيا</text>
        <text x="75" y="182" text-anchor="middle" fill="#94a3b8" font-size="10">بداية التنافس الاستعماري</text>
        <rect x="15" y="202" width="120" height="24" rx="6" fill="#059669" />
        <text x="75" y="218" text-anchor="middle" fill="#FAF4ED" font-size="9.5" font-weight="bold">بناء العالم المعاصر</text>
      </g>
    </svg>`
  }
};

// ── 🧠 محرك المعرفة التاريخية المعتمد أوفلاين لمنهج التاريخ - الصف الثاني ثانوي (بخت الرضا) ──
function getOfflineHistoryAnswer(q: string): { reply: string; diagramKey?: string } {
  const norm = q.toLowerCase();

  // 1. الحكم التركي المصري، الغزو، كورتي، سنار، حريق شندي، الإدارة والتعليم
  if (
    norm.includes('1820') ||
    norm.includes('1821') ||
    norm.includes('1822') ||
    norm.includes('غزو') ||
    norm.includes('محمد علي') ||
    norm.includes('إسماعيل') ||
    norm.includes('اسماعيل') ||
    norm.includes('كورتي') ||
    norm.includes('شندي') ||
    norm.includes('المك نمر') ||
    norm.includes('نمر') ||
    norm.includes('سنار') ||
    norm.includes('الدفتردار') ||
    norm.includes('بارا') ||
    norm.includes('المقدوم مسلم') ||
    norm.includes('حكمدار') ||
    norm.includes('خورشيد') ||
    norm.includes('طهطاوي') ||
    norm.includes('الزبير')
  ) {
    return {
      diagramKey: 'sudan_1821_campaign',
      reply: `مرحباً بك يا باحث التاريخ في المرحلة الثانوية 🏛️🇸🇩! هذا الموضوع يقع في صلب **الوحدة الأولى: الحكم التركي - المصري للسودان (١٨٢٠ - ١٨٨٥م)**:

١. **دوافع غزو محمد علي باشا للسودان (١٨٢٠م):**
   - **بناء جيش حديث قوي:** تجنيد أبناء السودان المشهود لهم بالشجاعة والانضباط لبناء إمبراطورية على أنقاض الدولة العثمانية.
   - **الذهب والموارد الطبيعية:** تمويل مشاريعه العسكرية والزراعية من مناجم الذهب التي اشتهرت منذ الفراعنة.
   - **توسيع التجارة:** احتكار المحاصيل وتأمين طرق القوافل وخاصة طريق البحر الأحمر.
   - **القضاء على المماليك:** الفارين إلى شمال السودان بدنقلا بعد مذبحة القلعة لدرء خطرهم عن حدود مصر الجنوبية.
   - **تأمين مياه النيل:** والسيطرة على حوض النيل لدرء تهديدات الحبشة بتحويل مجراه.

٢. **سير الحملتين والبطولات الوطنية:**
   - **حملة سنار:** بقيادة إسماعيل باشا (٤٠٠٠ مقاتل)، وصدام **معركة كورتي (٤ نوفمبر ١٨٢٠م)** حيث واجه فرسان الشايقية بالسلاح الأبيض مدافع الغزاة ببسالة نادرة، ثم دخول سنار في ١٤ يونيو ١٨٢١م وسقوط سلطنة الفونج بعد اغتيال محمد ود عدلان.
   - **حملة كردفان:** بقيادة محمد بك الدفتردار، وموقعة **بارا (١٦ أبريل ١٨٢١م)** واستشهاد حاكم كردفان البطل المقدوم مسلم وسقوط الأبيض.

٣. **مقتل إسماعيل باشا في شندي (أكتوبر ١٨٢٢م / ١٢٣٩هـ):**
   - طلب إسماعيل من المك نمر والمك مساعد مطالب باهظة وأهان المك نمر بصفعه بالغليون، فأعد المك نمر وليمة وأحاطها بالحطب وأحرق إسماعيل وحرسه ليلاً، وتلتها حملات الدفتردار الانتقامية الدامية.

٤. **تأسيس الخرطوم والإدارة والتوسع:**
   - نقل العاصمة للخرطوم (١٨٢٤-١٨٢٥م) على يد عثمان بك جركس وتطويرها المعماري بعهد خورشيد باشا، واستحداث منصب الحكمدار (١٨٣٤م).
   - ضم سواكن ومصوع، وضم بحر الغزال ودارفور بعهد إسماعيل والزبير باشا رحمة إثر موقعة منواشي (١٨٧٤م).

💡 **سؤال تحليلي:** كيف مهدت سياسة القسوة والضرائب الباهظة والاستعانة بالأوروبيين في عهد غردون لاندلاع الثورة المهدية عام ١٨٨١م؟ فكّر معمارياً وسياسياً! 🇸🇩✨`
    };
  }

  // 2. استقلال السودان، الحركة الوطنية، الحكومات المتعاقبة، ومشكلة الجنوب (الوحدة الثانية)
  if (
    norm.includes('استقلال') ||
    norm.includes('استقلال السودان') ||
    norm.includes('1956') ||
    norm.includes('١٩٥٦') ||
    norm.includes('1955') ||
    norm.includes('١٩٥٥') ||
    norm.includes('الأزهري') ||
    norm.includes('ازهري') ||
    norm.includes('عبود') ||
    norm.includes('أكتوبر') ||
    norm.includes('القرشي') ||
    norm.includes('نميري') ||
    norm.includes('مايو') ||
    norm.includes('سوار الذهب') ||
    norm.includes('توريت') ||
    norm.includes('أديس أبابا') ||
    norm.includes('جون قرنق') ||
    norm.includes('الجنوب') ||
    norm.includes('مؤتمر الخريجين') ||
    norm.includes('اللواء الأبيض')
  ) {
    return {
      diagramKey: 'sudan_independence_1956',
      reply: `أهلاً بك يا باحث التاريخ الوطني المعاصر 🇸🇩🤝! هذا المحور يمثل **الوحدة الثانية: لمحات من تاريخ السودان الحديث والمعاصر (١٩٥٥ - ١٩٨٥م)**:

١. **مسار الاستقلال الوطني (١ يناير ١٩٥٦م):**
   - تطور الحركة الوطنية: نادي الخريجين بأم درمان (١٩١٨م)، حركة اللواء الأبيض (١٩٢٤م)، ومؤتمر الخريجين العام (١٩٣٨م) ومذكرة ١٩٤٢م المطالبة بحق تقرير المصير.
   - اتفاقية الحكم الذاتي (١٢ يناير ١٩٥٣م) وإجراء أول انتخابات وتشكيل حكومة إسماعيل الأزهري ولجنة السودنة (مارس ١٩٥٥م).
   - **الجلسة التاريخية (١٩ ديسمبر ١٩٥٥م):** إعلان استقلال السودان بالإجماع باقتراح النائب عبدالرحمن دبكة.
   - **يوم الاستقلال (١ يناير ١٩٥٦م):** رفع الأزهري ومحمد أحمد محجوب علم السودان المستقل وإنزال علمي الحكم الثنائي.

٢. **الحكومات المتعاقبة (١٩٥٥ - ١٩٨٥م):**
   - **الديمقراطية الأولى (١٩٥٤ - ١٩٥٨م):** وزارات الأزهري ثم عبدالله خليل وائتلاف الأمة والشعب.
   - **الحكم العسكري الأول - إبراهيم عبود (١٩٥٨ - ١٩٦٤م):** الخطة العشرية، الروصيرص والمناقل، ثم ثورة ٢١ أكتوبر ١٩٦٤م واستشهاد القرشي وتشكيل حكومة سر الختم الخليفة.
   - **الديمقراطية الثانية (١٩٦٤ - ١٩٦٩م):** وزارات محجوب والصادق المهدي ورئاسة الأزهري لمجلس السيادة.
   - **عهد مايو - جعفر نميري (١٩٦٩ - ١٩٨٥م):** تأميم الشركات، أحداث الجزيرة أبا، انقلاب ١٩ يوليو ١٩٧١، حركة يوليو ١٩٧٦م، اتفاقية أديس أبابا ١٩٧٢م، ثم انتفاضة ٦ أبريل ١٩٨٥م وانحياز الجيش بقيادة سوار الذهب وحكومة الجزولي دفع الله.

٣. **تطورات قضية جنوب السودان:**
   - قانون المناطق المقفولة (١٩٢٢م)، تمرد توريت (أغسطس ١٩٥٥م)، حركة الأنيانيا (١٩٦٣م)، اتفاقية أديس أبابا للحكم الذاتي (١٩٧٢م)، وتأسيس الحركة الشعبية لتحرير السودان (١٩٨٣م) بقيادة د. جون قرنق.

💡 **سؤال للمناقشة:** كيف أسهم تلاحم النقابات والطلاب والأحزاب في نجاح ثورة أكتوبر ١٩٦٤م وانتفاضة أبريل ١٩٨٥م في استعادة الحكم المدني؟ 🇸🇩✌️`
    };
  }

  // 3. الثورة الفرنسية، فلاسفة التنوير، والنهضة الأوروبية (الوحدة الثالثة)
  if (
    norm.includes('فرنسا') ||
    norm.includes('فرنسية') ||
    norm.includes('1789') ||
    norm.includes('١٧٨٩') ||
    norm.includes('باستيل') ||
    norm.includes('روسو') ||
    norm.includes('مونتسكيو') ||
    norm.includes('فولتير') ||
    norm.includes('لويس') ||
    norm.includes('روبسبير') ||
    norm.includes('حقوق الإنسان') ||
    norm.includes('نهضة') ||
    norm.includes('قسطنطينية') ||
    norm.includes('إقطاع') ||
    norm.includes('إقطاعي')
  ) {
    return {
      diagramKey: 'french_revolution_1789',
      reply: `مرحباً بمؤرخ الفكر والتحولات الأوروبية 🇫🇷📜! هذا الموضوع يندرج تحت **الوحدة الثالثة: تاريخ أوروبا الحديث**:

١. **أسباب الثورة الفرنسية (١٧٨٩م):**
   - **الاستبداد السياسي:** الحكم الملكي المطلق القائم على 'الحق الإلهي المقدس' وضعف لويس السادس عشر وتردده أمام زوجته ماري أنطوانيت وبلاطه المسرف.
   - **النظام الطبقي الفاسد:** طبقة الأشراف ورجال الدين (٤٣٠ ألف نسمة يتمتعون بالامتيازات والإعفاء الضريبي)، مقابل الطبقة العامة (٢٥ مليون نسمة يدفعون ٤ أخماس دخلهم ضرائب ومحرومون من الوظائف).
   - **الأزمة المالية الحادة:** حروب فرنسا وديونها وفشل وزراء المال واستدعاء مجلس طبقات الأمة المعطل منذ ١٦١٤م.

٢. **فلاسفة التنوير وعوامل الفكر:**
   - **مونتسكيو:** كتاب 'روح القوانين' ومبدأ فصل السلطات الثلاث.
   - **فولتير:** السخرية والتهكم على استبداد الكنيسة والملكية والمطالبة بالحرية الفكرية.
   - **جان جاك روسو:** كتاب 'العقد الاجتماعي' (إنجيل الثورة الفرنسية) وأن السيادة للشعب وحق الأمة في عزل حكامها.

٣. **مسار الثورة والتحول الجمهوري:**
   - اجتماع فرساي وموقف ميرابو: 'إننا هنا بأمر الأمة ولن نبرح إلا على أسنة الحراب'.
   - **اقتحام سجن الباستيل (١٤ يوليو ١٧٨٩م):** تحطيم رمز الاستبداد وإعلان وثيقة حقوق الإنسان وإلغاء النظام الإقطاعي وعشور الكنيسة.
   - إعدام لويس السادس عشر بالمقصلة في ٢١ يناير ١٧٩٣م، وتصاعد عهد الإرهاب بقيادة روبسبير واليعاقبة ثم سقوطه وقيام حكومة الإدارة ١٧٩٥م وظهور نابليون بونابرت.

💡 **سؤال استنتاجي:** ما وجه الشبه بين مبادئ العقد الاجتماعي لروسو ومطالب الثورات السودانية في تقرير المصير وسيادة الشعب؟ 🌍⚖️`
    };
  }

  // 4. الثورة الصناعية، البخار، والوحدة الإيطالية والألمانية
  if (
    norm.includes('صناعية') ||
    norm.includes('بخار') ||
    norm.includes('واط') ||
    norm.includes('ستيفنسون') ||
    norm.includes('إيطاليا') ||
    norm.includes('ايطاليا') ||
    norm.includes('مازيني') ||
    norm.includes('غاريبالدي') ||
    norm.includes('كافور') ||
    norm.includes('ألمانيا') ||
    norm.includes('المانيا') ||
    norm.includes('بسمارك') ||
    norm.includes('حديد ودم') ||
    norm.includes('زولفرين') ||
    norm.includes('سادوا') ||
    norm.includes('سيدان')
  ) {
    return {
      diagramKey: 'industrial_revolution',
      reply: `أهلاً بك يا رائد الثورات الصناعية والوحدة القومية 🚂⚙️! يتناول هذا المبحث تحولات أوروبا في القرن التاسع عشر:

١. **الثورة الصناعية وعصر البخار:**
   - انطلقت في إنجلترا لتراكم رؤوس الأموال، اتساع الأسواق، وفرة الفحم والحديد والاستقرار.
   - **جيمس واط (١٧٦٩م):** تطوير المحرك البخاري وتدشين عصر الآلات ومصانع النسيج.
   - **جورج ستيفنسون (١٨٢٥م):** اختراع أول قاطرة بخارية وتأسيس شبكات السكك الحديدية العالمية.
   - انتشارها في أوروبا وأمريكا ودور اتحاد 'الزولفرين' الجمركي في ألمانيا (١٨٣٣م) في إزالة الحواجز الجمركية.

٢. **الوحدة الإيطالية (١٨١٥ - ١٨٧٠م):**
   - حركة القومية: جمعية الكاربوناري، وجمعية إيطاليا الفتاة بقيادة **جوزيف مازيني** (العقل المفكر)، و**غاريبالدي** وجماعة القمصان الحمراء (الذراع المنفذة).
   - دبلوماسية ملك بيدمنت فكتور عمانوئيل ووزيره السياسي القدير **كافور**، وتوحيد الشمال والوسط والجنوب، ودخول روما في سبتمبر ١٨٧٠م وجعلها عاصمة لإيطاليا واستقلال الفاتيكان.

٣. **الوحدة الألمانية وسياسة 'الدم والحديد' (١٨١٥ - ١٨٧١م):**
   - تزعمت بروسيا الوحدة بقيادة المستشار **أوتو فون بسمارك** الذي أعلن أن قضايا الساعة تحسم بالدم والحديد لا بالبرلمانات.
   - حروب بسمارك الثلاث: حرب الدنمارك (١٨٦٤م)، حرب النمسا ومعركة **سادوا (١٨٦٦م)**، وحرب فرنسا ومعركة **سيدان (١٨٧٠م)** وأسر نابليون الثالث، وتتويج وليم الأول إمبراطوراً لألمانيا الموحدة بقصر فرساي في يناير ١٨٧١م.

💡 **سؤال تفكير نقدي:** قارن بين أسلوب كافور في الدبلوماسية والتحالفات وأسلوب بسمارك في سياسة الحديد والدم لتحقيق الوحدة القومية! ⚔️🇩🇪🇮🇹`
    };
  }

  // 5. الحرب العالمية الأولى والحرب العالمية الثانية (الوحدة الرابعة)
  if (
    norm.includes('حرب عالمية') ||
    norm.includes('1914') ||
    norm.includes('١٩١٤') ||
    norm.includes('1939') ||
    norm.includes('١٩٣٩') ||
    norm.includes('سراجيفو') ||
    norm.includes('فرساي') ||
    norm.includes('عصبة الأمم') ||
    norm.includes('هتلر') ||
    norm.includes('موسوليني') ||
    norm.includes('نازية') ||
    norm.includes('فاشية') ||
    norm.includes('العلمين') ||
    norm.includes('بيرل هاربر') ||
    norm.includes('هيروشيما') ||
    norm.includes('ذرية') ||
    norm.includes('الأمم المتحدة')
  ) {
    return {
      reply: `مرحباً بك في دراسة كبرى الصراعات الدولية 🌍💣! هذا المحور يغطي **الوحدة الرابعة: الصراع الأوروبي حول التوسع الاستعماري**:

١. **الحرب العالمية الأولى (١٩١٤ - ١٩١٨م):**
   - **الأسباب العامة:** التنافس الاستعماري على الأسواق، الأحلاف العسكرية (الوفاق الثلاثي: بريطانيا وفرنسا وروسيا، ضد التحالف الثلاثي: ألمانيا والنمسا وإيطاليا)، سباق التسلح، وأزمات مراكش ١٩٠٥م والبوسنة ١٩٠٨م وأغادير ١٩١١م.
   - **السبب المباشر:** اغتيال ولي عهد النمسا الأرشيدوق فرانز فيرديناند وزوجته في **سراجيفو (٢٨ يونيو ١٩١٤م)** على يد طالب صربي.
   - **أسباب انتصار الحلفاء:** فشل خطة ألمانيا، الحصار البحري، ودخول أمريكا الحرب (١٩١٧م) بعد إغراق الغواصات، وانسحاب روسيا بالثورة البلشفية.
   - **النتائج:** معاهدة فرساي القاسية ١٩١٩م، سقوط الإمبراطوريات الأربع (الألمانية، النمساوية، الروسية، والعثمانية)، وقيام عصبة الأمم.

٢. **الحرب العالمية الثانية (١٩٣٩ - ١٩٤٥م):**
   - **الأسباب:** قسوة معاهدة فرساي، قيام الفاشية في إيطاليا (موسوليني) والنازية في ألمانيا (هتلر) وتحدي عصبة الأمم، ومحور روما - برلين - طوكيو.
   - **اشتعال الحرب:** اجتياح ألمانيا لبولندا في **١ سبتمبر ١٩٣٩م** وإعلان بريطانيا وفرنسا الحرب.
   - **المنعطفات الكبرى:** غزو روسيا ١٩٤١م، هجوم بيرل هاربر ودخول أمريكا، معركة العلمين بمصر (خريف ١٩٤٢م) وهزيمة روميل، وإنزال نورماندي ١٩٤٤م، وانتحار هتلر واستسلام ألمانيا (مايو ١٩٤٥م).
   - **السلاح الذري ونهاية الحرب:** إلقاء القنبلة الذرية على هيروشيما (٦ أغسطس ١٩٤٥م) وناكازاكي (٩ أغسطس) واستسلام اليابان.
   - **النتائج:** تأسيس هيئة الأمم المتحدة ١٩٤٥م، تقسيم ألمانيا لمعسكرين، وظهور الحرب الباردة وتصفية الاستعمار القديم.

💡 **سؤال ختامي:** كيف تحولت معاهدة فرساي لعام ١٩١٩م من معاهدة صلح إلى بذور أشعلت الحرب العالمية الثانية عام ١٩٣٩م؟ 🕊️🌐`
    };
  }

  // Fallback general guidance
  return {
    reply: `أهلاً بك يا باحث التاريخ الحبيب في الصف الثاني ثانوي 🏛️📜! أنا "الأستاذ طارق" — رفيقك ومعلمك الذكي لمقرر التاريخ للمرحلة الثانوية (منهج المركز القومي للمناهج والبحث التربوي - بخت الرضا).

يمكنك سؤالي عن أي وحدة أو درس من وحدات المنهج الأربع:
- 🇸🇩 **الوحدة الأولى: الحكم التركي - المصري للسودان (١٨٢٠ - ١٨٨٥م):** حملتا سنار وكردفان، كورتي، بارا، حريق شندي والمك نمر، تأسيس الخرطوم، عهد عباس وسعيد وإسماعيل، الزبير باشا ودارفور، وثورات المقاومة.
- ✌️ **الوحدة الثانية: لمحات من تاريخ السودان المعاصر (١٩٥٥ - ١٩٨٥م):** مؤتمر الخريجين، إعلان الاستقلال من البرلمان ١٩٥٥م ورفع العلم ١٩٥٦م، حكومات عبود وثورة أكتوبر، عهد مايو نميري، انتفاضة أبريل ١٩٨٥م، والتطور الاقتصادي ومشكلة الجنوب.
- 🏰 **الوحدة الثالثة: تاريخ أوروبا الحديث:** العصور الوسطى والإقطاع، عصر النهضة، الكشوف الجغرافية الكبرى، الثورة الفرنسية ١٧٨٩م، الثورة الصناعية، والوحدة الإيطالية والألمانية.
- 🌐 **الوحدة الرابعة: الصراع والتوسع الاستعماري:** أزمات وحرب العالمية الأولى (١٩١٤ - ١٩١٨م)، صعود الفاشية والنازية، وأحداث ونتائج الحرب العالمية الثانية (١٩٣٩ - ١٩٤٥م).

💡 **جرّب أن تسألني:** "اشرح لي أسباب غزو محمد علي للسودان بالرسم" أو "كيف تم إعلان استقلال السودان من داخل البرلمان عام ١٩٥٥م؟" وهيا نبدأ رحلة التفوق! 🚀✨`
  };
}

// ── 🎯 3 Interactive Challenge Quizzes for Grade 2 Secondary History ───────
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
    question: 'في أي جلسة تاريخية أعلن نواب البرلمان السوداني استقلال السودان التام من داخل دار البرلمان؟',
    options: [
      'جلسة الإثنين ١٩ ديسمبر ١٩٥٥م',
      'جلسة الخميس ١ يناير ١٩٥٦م',
      'جلسة السبت ١٢ يناير ١٩٥٣م',
      'جلسة الأربعاء ٢١ أكتوبر ١٩٦٤م'
    ],
    correctIdx: 0,
    explanation: 'تلا النائب عبدالرحمن دبكة مقترح إعلان الاستقلال في جلسة ١٩ ديسمبر ١٩٥٥م التاريخية وأجيز بالإجماع، ثم رُفع العلم في ١ يناير ١٩٥٦م.',
    source: 'كتاب التاريخ - الصف الثاني ثانوي (الوحدة الثانية: استقلال السودان)'
  },
  {
    id: 2,
    question: 'ما هو المبدأ الدستوري الجوهري الذي دعا إليه المفكر الفرنسي مونتسكيو في كتابه "روح القوانين"؟',
    options: [
      'الفصل بين السلطات الثلاث (التشريعية والتنفيذية والقضائية)',
      'نظرية الحق الإلهي المقدس للملوك',
      'سياسة الدم والحديد للوحدة القومية',
      'احتكار الدولة للتجارة الخارجية'
    ],
    correctIdx: 0,
    explanation: 'أكد مونتسكيو أن صيانة حرية المواطنين ومنع الاستبداد لا يتحقق إلا بالفصل التام بين السلطات الثلاث: التشريعية والتنفيذية والقضائية.',
    source: 'كتاب التاريخ - الصف الثاني ثانوي (الوحدة الثالثة: الثورة الفرنسية)'
  },
  {
    id: 3,
    question: 'ما هي الموقعة الحاسمة التي انتصرت فيها بروسيا على النمسا عام ١٨٦٦م ومهدت لتأسيس اتحاد ألمانيا الشمالية؟',
    options: [
      'معركة سادوا (١٨٦٦م)',
      'معركة سيدان (١٨٧٠م)',
      'معركة كورتي (١٨٢٠م)',
      'معركة العلمين (١٩٤٢م)'
    ],
    correctIdx: 0,
    explanation: 'حققت بروسيا بقيادة بسمارك نصراً حاسماً على النمسا في معركة سادوا عام ١٨٦٦م وفرضت معاهدة براغ واستبعدت النمسا من شؤون ألمانيا.',
    source: 'كتاب التاريخ - الصف الثاني ثانوي (الوحدة الثالثة: الوحدة الألمانية)'
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
      text: `أهلاً وسهلاً بك عزيزي طالب التاريخ 🏛️📜! أنا "الأستاذ طارق" — رفيقك ومعلمك الذكي لمقرر تاريخ الصف الثاني ثانوي بالمرحلة الثانوية (منهج المركز القومي للمناهج والبحث التربوي - بخت الرضا).

سواءً أردت التعمق في الحكم التركي المصري ومقاومة كورتي وشندي، أو مسيرة الاستقلال الوطني وبرلمان ١٩ ديسمبر ١٩٥٥م وثورة أكتوبر ١٩٦٤م، أو فكر الثورة الفرنسية والوحدة الألمانية لبسمارك، أو خفايا الحربين العالميتين — اسألني وسأشرح لك بالتحليل والمخططات والخرائط التاريخية المعتمدة! ⚔️💡`,
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

  // ==========================================
  // 📞 DIRECT LIVE AUDIO CALL ENGINE (الاتصال المباشر)
  // ==========================================
  const [isLiveCallActive, setIsLiveCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callSubtitle, setCallSubtitle] = useState('جاري الاتصال بنقلة بوت...');
  const [isBotCallSpeaking, setIsBotCallSpeaking] = useState(false);
  const [isUserTalkingInCall, setIsUserTalkingInCall] = useState(false);
  const [isCallMuted, setIsCallMuted] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking' | 'thinking'>('idle');
  const [vuBars, setVuBars] = useState<number[]>(new Array(9).fill(3));

  const callTimerRef = useRef<any>(null);
  const callRecognitionRef = useRef<any>(null);
  const callAudioContextRef = useRef<AudioContext | null>(null);
  const callAnalyserRef = useRef<AnalyserNode | null>(null);
  const callMicStreamRef = useRef<MediaStream | null>(null);
  const callBargeInIntervalRef = useRef<any>(null);
  const callKeepAliveTimerRef = useRef<any>(null);
  const callSilenceTimerRef = useRef<any>(null);
  const callAccumulatedTranscript = useRef<string>('');
  const callBotSpeakingRef = useRef<boolean>(false);
  const callActiveRef = useRef<boolean>(false);
  const callProcessingRef = useRef<boolean>(false);
  const callMutedRef = useRef<boolean>(false);
  const callAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => { callBotSpeakingRef.current = isBotCallSpeaking; }, [isBotCallSpeaking]);
  useEffect(() => { callActiveRef.current = isLiveCallActive; }, [isLiveCallActive]);
  useEffect(() => { callMutedRef.current = isCallMuted; }, [isCallMuted]);

  // Call Duration Timer
  useEffect(() => {
    if (isLiveCallActive) {
      setCallDuration(0);
      callTimerRef.current = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    } else {
      if (callTimerRef.current) { clearInterval(callTimerRef.current); callTimerRef.current = null; }
    }
    return () => { if (callTimerRef.current) clearInterval(callTimerRef.current); };
  }, [isLiveCallActive]);

  const formatCallTimer = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const unlockCallAudioContext = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      gain.gain.value = 0.0001;
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(0); osc.stop(0.05);
      if (ctx.state === 'suspended') ctx.resume();
      setTimeout(() => { try { ctx.close(); } catch(e) {} }, 200);
    } catch(e) {}
  };

  const cleanCallTtsText = (text: string) => {
    return text.replace(/[*#_~`\[\]()<>]/g, ' ').replace(/https?:\/\/\S+/g, '').replace(/\s+/g, ' ').trim();
  };

  const triggerCallBargeIn = () => {
    if (callBotSpeakingRef.current) {
      if (callAudioPlayerRef.current) {
        try { callAudioPlayerRef.current.pause(); callAudioPlayerRef.current.currentTime = 0; } catch(e) {}
        callAudioPlayerRef.current = null;
      }
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      callBotSpeakingRef.current = false;
      setIsBotCallSpeaking(false);
      setIsUserTalkingInCall(true);
      setCallStatus('listening');
      setCallSubtitle('سمعتك يا مؤرخنا! أنا أستمع إليك الآن... 👂✨');
    }
  };

  const startCallMicMonitor = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }
      });
      callMicStreamRef.current = stream;
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      callAudioContextRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256; analyser.smoothingTimeConstant = 0.5;
      source.connect(analyser);
      callAnalyserRef.current = analyser;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      callBargeInIntervalRef.current = setInterval(() => {
        if (!callActiveRef.current || !callAnalyserRef.current || callMutedRef.current) return;
        callAnalyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const avg = sum / dataArray.length;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        const threshold = callBotSpeakingRef.current ? 45 : 18;
        if (normalized > threshold) {
          setIsUserTalkingInCall(true);
          if (callBotSpeakingRef.current) triggerCallBargeIn();
        } else {
          setIsUserTalkingInCall(false);
        }
        if (normalized > 5) {
          const bars = [];
          for (let i = 0; i < 9; i++) {
            const bIdx = Math.floor((i / 9) * dataArray.length);
            bars.push(Math.max(3, Math.round((dataArray[bIdx] / 255) * 28)));
          }
          setVuBars(bars);
        } else {
          setVuBars(new Array(9).fill(3));
        }
      }, 50);
    } catch (err) {
      console.warn('Call mic monitor error:', err);
    }
  };

  const stopCallMicMonitor = () => {
    if (callBargeInIntervalRef.current) { clearInterval(callBargeInIntervalRef.current); callBargeInIntervalRef.current = null; }
    if (callMicStreamRef.current) { callMicStreamRef.current.getTracks().forEach(t => t.stop()); callMicStreamRef.current = null; }
    if (callAudioContextRef.current) { try { callAudioContextRef.current.close(); } catch(e) {} callAudioContextRef.current = null; }
    callAnalyserRef.current = null;
    setVuBars(new Array(9).fill(3));
  };

  const speakCallAudio = (text: string, onEndCallback?: () => void) => {
    if (!callActiveRef.current) { if (onEndCallback) onEndCallback(); return; }
    const clean = cleanCallTtsText(text);
    if (!clean) { if (onEndCallback) onEndCallback(); return; }
    if (callRecognitionRef.current) { try { callRecognitionRef.current.abort(); } catch(e) {} }
    callBotSpeakingRef.current = true;
    setIsBotCallSpeaking(true);
    setCallStatus('speaking');

    const afterSpeechEnds = () => {
      callBotSpeakingRef.current = false;
      setIsBotCallSpeaking(false);
      if (callActiveRef.current && !callMutedRef.current) {
        setCallStatus('listening');
        setTimeout(() => {
          if (callActiveRef.current && !callBotSpeakingRef.current && !callProcessingRef.current) {
            startCallListeningLoop();
          }
        }, 350);
      }
      if (onEndCallback) onEndCallback();
    };

    const ttsUrl = `${CLOUD_TTS_ENDPOINT}?text=${encodeURIComponent(clean.slice(0, 500))}&speaker=${voiceSpeaker}`;
    fetch(ttsUrl)
      .then(res => { if (!res.ok) throw new Error('TTS ' + res.status); return res.blob(); })
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        const audio = new Audio(blobUrl);
        callAudioPlayerRef.current = audio;
        audio.onended = () => { URL.revokeObjectURL(blobUrl); callAudioPlayerRef.current = null; afterSpeechEnds(); };
        audio.onerror = () => { URL.revokeObjectURL(blobUrl); callAudioPlayerRef.current = null; fallbackCallBrowserSpeech(clean, afterSpeechEnds); };
        audio.play().catch(() => { URL.revokeObjectURL(blobUrl); callAudioPlayerRef.current = null; fallbackCallBrowserSpeech(clean, afterSpeechEnds); });
      })
      .catch(() => fallbackCallBrowserSpeech(clean, afterSpeechEnds));
  };

  const fallbackCallBrowserSpeech = (text: string, onEndCallback?: () => void) => {
    if (!('speechSynthesis' in window)) {
      callBotSpeakingRef.current = false; setIsBotCallSpeaking(false);
      if (onEndCallback) onEndCallback(); return;
    }
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ar-SA'; utter.rate = 0.95;
    utter.pitch = voiceSpeaker === 'israa' ? 1.15 : 0.92;
    const voices = window.speechSynthesis.getVoices();
    const arVoices = voices.filter(v => v.lang.startsWith('ar'));
    if (arVoices.length > 0) utter.voice = arVoices[0];
    utter.onend = () => { callBotSpeakingRef.current = false; setIsBotCallSpeaking(false); if (onEndCallback) onEndCallback(); };
    utter.onerror = () => { callBotSpeakingRef.current = false; setIsBotCallSpeaking(false); if (onEndCallback) onEndCallback(); };
    window.speechSynthesis.speak(utter);
  };

  const startCallListeningLoop = () => {
    if (callMutedRef.current || !callActiveRef.current || callBotSpeakingRef.current || callProcessingRef.current) return;
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRec) return;
    try {
      if (callRecognitionRef.current) { try { callRecognitionRef.current.abort(); } catch(e) {} }
      const rec = new SpeechRec();
      rec.continuous = false; rec.interimResults = true; rec.lang = 'ar-SD';
      let hasReceivedFinal = false;
      rec.onsoundstart = () => triggerCallBargeIn();
      rec.onspeechstart = () => { triggerCallBargeIn(); setIsUserTalkingInCall(true); setCallStatus('listening'); };
      rec.onresult = (e: any) => {
        triggerCallBargeIn();
        let interim = ''; let final = '';
        for (let i = e.resultIndex; i < e.results.length; ++i) {
          if (e.results[i].isFinal) final += e.results[i][0].transcript;
          else interim += e.results[i][0].transcript;
        }
        const display = final || interim;
        if (display) setCallSubtitle(`🗣️ أنت: "${display}"`);
        if (final.trim()) {
          callAccumulatedTranscript.current = (callAccumulatedTranscript.current + ' ' + final.trim()).trim();
          hasReceivedFinal = true;
          if (callSilenceTimerRef.current) clearTimeout(callSilenceTimerRef.current);
          callSilenceTimerRef.current = setTimeout(() => {
            const toSend = callAccumulatedTranscript.current;
            callAccumulatedTranscript.current = '';
            if (toSend.trim()) sendCallMessage(toSend.trim());
          }, 700);
        }
      };
      rec.onerror = (e: any) => {
        if (callActiveRef.current && !callBotSpeakingRef.current && !callProcessingRef.current) {
          if (e.error === 'no-speech') { setCallSubtitle('نقلة بوت في انتظار سؤالك في التاريخ... تحدث في أي وقت! 🎙️'); setCallStatus('listening'); }
          if (callKeepAliveTimerRef.current) clearTimeout(callKeepAliveTimerRef.current);
          callKeepAliveTimerRef.current = setTimeout(() => {
            if (callActiveRef.current && !callBotSpeakingRef.current && !callProcessingRef.current) startCallListeningLoop();
          }, 500);
        }
      };
      rec.onend = () => {
        setIsUserTalkingInCall(false);
        if (callActiveRef.current && !callBotSpeakingRef.current && !callProcessingRef.current && !hasReceivedFinal) {
          if (callKeepAliveTimerRef.current) clearTimeout(callKeepAliveTimerRef.current);
          callKeepAliveTimerRef.current = setTimeout(() => {
            if (callActiveRef.current && !callBotSpeakingRef.current && !callProcessingRef.current) startCallListeningLoop();
          }, 400);
        }
      };
      callRecognitionRef.current = rec;
      rec.start();
      setCallStatus('listening');
      setCallSubtitle('نقلة بوت يستمع لك الآن... اسأل عن أي حدث تاريخي! 🎙️');
    } catch (e) {
      console.warn('Call recognition error:', e);
      if (callActiveRef.current && !callBotSpeakingRef.current) setTimeout(startCallListeningLoop, 800);
    }
  };

  const sendCallMessage = async (userText: string) => {
    if (!userText.trim() || callProcessingRef.current) return;
    callProcessingRef.current = true;
    setCallStatus('thinking');
    setCallSubtitle('نقلة بوت يبحث في صفحات التاريخ... 📜💭');
    if (callRecognitionRef.current) { try { callRecognitionRef.current.abort(); } catch(e) {} }

    const userMsg: Message = { role: 'user', text: userText };
    setMessages(prev => [...prev, userMsg]);

    let replyText = '';
    try {
      const res = await fetch(CLOUD_MENTOR_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          stage: 'history_sec2',
          is_voice_call: true,
          history: messages.slice(-4).map(m => ({ role: m.role, content: m.text }))
        })
      });
      if (res.ok) { const d = await res.json(); replyText = d.reply || ''; }
    } catch(e) { console.warn('Call cloud fetch error:', e); }

    if (!replyText) {
      const offline = getOfflineHistoryAnswer(userText);
      replyText = offline.reply;
    }

    const botMsg: Message = { role: 'assistant', text: replyText };
    setMessages(prev => [...prev, botMsg]);
    setCallSubtitle(replyText.length > 130 ? replyText.slice(0, 130) + '...' : replyText);
    speakCallAudio(replyText);
    callProcessingRef.current = false;
  };

  const toggleLiveCall = () => {
    if (isLiveCallActive) {
      setIsLiveCallActive(false);
      setCallStatus('idle');
      if (callAudioPlayerRef.current) { try { callAudioPlayerRef.current.pause(); } catch(e) {} callAudioPlayerRef.current = null; }
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      callBotSpeakingRef.current = false; setIsBotCallSpeaking(false);
      callProcessingRef.current = false;
      stopCallMicMonitor();
      if (callRecognitionRef.current) { try { callRecognitionRef.current.abort(); } catch(e) {} }
      if (callKeepAliveTimerRef.current) clearTimeout(callKeepAliveTimerRef.current);
      if (callSilenceTimerRef.current) clearTimeout(callSilenceTimerRef.current);
      callAccumulatedTranscript.current = '';
    } else {
      unlockCallAudioContext();
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      setIsLiveCallActive(true);
      setCallStatus('connecting');
      setCallSubtitle('جاري الاتصال بنقلة بوت... 📞');
      startCallMicMonitor();
      const greeting = 'أهلاً بك يا باحث التاريخ 📜⚔️! أنا نقلة بوت، أستاذك الذكي في تاريخ الصف الثاني ثانوي السوداني. تفضل بسؤالك عن أي حدث: من الغزو التركي وكورتي وشندي، إلى الاستقلال وثورة أكتوبر، والثورة الفرنسية، والوحدتين الألمانية والإيطالية، والحربين العالميتين. يمكنك مقاطعتي في أي وقت!';
      setCallSubtitle(greeting);
      speakCallAudio(greeting);
    }
  };

  const toggleCallMute = () => {
    const newMuted = !isCallMuted;
    setIsCallMuted(newMuted); callMutedRef.current = newMuted;
    if (newMuted) {
      if (callRecognitionRef.current) { try { callRecognitionRef.current.abort(); } catch(e) {} }
      if (callKeepAliveTimerRef.current) clearTimeout(callKeepAliveTimerRef.current);
      setCallSubtitle('الميكروفون مكتوم 🔇 اضغط لإلغاء الكتم'); setCallStatus('idle');
      setIsUserTalkingInCall(false); setVuBars(new Array(9).fill(3));
    } else {
      if (callActiveRef.current && !callBotSpeakingRef.current && !callProcessingRef.current) {
        setCallSubtitle('تم إلغاء الكتم! تفضل بالحديث 🎙️'); setCallStatus('listening');
        startCallListeningLoop();
      }
    }
  };

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

    // 1. Try Cloudflare Edge TTS (GET → audio blob directly)
    try {
      const ttsUrl = `${CLOUD_TTS_ENDPOINT}?text=${encodeURIComponent(clean.slice(0, 500))}&speaker=${voiceSpeaker}`;
      const res = await fetch(ttsUrl);

      if (res.ok) {
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const audio = new Audio(blobUrl);
        audioRef.current = audio;
        audio.onended = () => {
          URL.revokeObjectURL(blobUrl);
          setIsSpeaking(false);
          setActiveSpeechIdx(null);
        };
        audio.onerror = () => {
          URL.revokeObjectURL(blobUrl);
          fallbackBrowserSpeech(clean);
        };
        await audio.play();
        return;
      }
    } catch {
      // Fallback to browser speech
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
    if (textToSend.includes('رسم') || textToSend.includes('صورة') || textToSend.includes('مخطط') || textToSend.includes('خريطة') || textToSend.includes('دياجرام')) {
      if (textToSend.includes('استقلال') || textToSend.includes('أزهري') || textToSend.includes('خريجين') || textToSend.includes('علم') || textToSend.includes('أكتوبر') || textToSend.includes('أبريل')) {
        diagramToAttach = CURRICULUM_DIAGRAMS['sudan_independence_1956'];
      } else if (textToSend.includes('فرنسية') || textToSend.includes('باستيل') || textToSend.includes('تنوير') || textToSend.includes('لويس') || textToSend.includes('نابليون')) {
        diagramToAttach = CURRICULUM_DIAGRAMS['french_revolution_1789'];
      } else if (textToSend.includes('صناعية') || textToSend.includes('واط') || textToSend.includes('بخار') || textToSend.includes('قطار') || textToSend.includes('آلة')) {
        diagramToAttach = CURRICULUM_DIAGRAMS['industrial_revolution'];
      } else {
        diagramToAttach = CURRICULUM_DIAGRAMS['sudan_1821_campaign'];
      }
    }

    // 2. Call local /api/chat first (which knows Grade 2 Secondary and uses GEMINI_API_KEY if present or local Grade 2 engine)
    try {
      const historyPayload = messages.slice(-4).map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.reply || data.text) {
          answerText = data.reply || data.text;
        }
      }
    } catch (err) {
      console.warn('Local /api/chat error, trying cloud fallback:', err);
      try {
        const res = await fetch(CLOUD_MENTOR_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: textToSend,
            stage: 'history_sec2',
            subject: 'تاريخ_ثاني_ثانوي',
            history: messages.slice(-4).map((m) => ({
              role: m.role === 'user' ? 'user' : 'assistant',
              content: m.text
            }))
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.reply || data.text) {
            answerText = data.reply || data.text;
          }
        }
      } catch (cloudErr) {
        console.warn('Cloud API fallback to local history engine:', cloudErr);
      }
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
                الصف الثاني ثانوي (المرحلة الثانوية)
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

          {/* Live Call Button */}
          <button
            onClick={toggleLiveCall}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold px-3 py-2 rounded-xl shadow-md animate-pulse hover:animate-none transition-all border border-emerald-400/50 cursor-pointer"
            title="ابدأ اتصالاً مباشراً مع نقلة بوت"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.72A2 2 0 012 0h3a2 2 0 012 1.72c.127 1.003.36 1.99.7 2.94a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.14-1.34a2 2 0 012.11-.45c.95.34 1.937.573 2.94.7A2 2 0 0122 14.92v2z" /></svg>
            <span>اتصال مباشر</span>
          </button>
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
                  placeholder="اسأل الأستاذ طارق: 'لماذا غزا إسماعيل باشا السودان؟' أو 'اشرح استقلال السودان بالرسم'..."
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
                <span>أسئلة محورية من منهج الصف الثاني ثانوي</span>
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
              <span className="text-xs font-bold text-amber-400">تحدي المؤرخ الذكي 🎯</span>
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
                    <span>إجابة صحيحة ودقيقة ومتميزة! (+25 XP) 🎉</span>
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

      {/* ── Live Call Full-Screen Overlay ── */}
      {isLiveCallActive && (
        <div className="fixed inset-0 z-[999] bg-slate-950/97 backdrop-blur-md flex items-center justify-center p-4" style={{ direction: 'rtl' }}>
          <div className="w-full max-w-md bg-gradient-to-b from-[#1a1228] via-[#1a0f2e] to-[#0f0820] border-2 border-amber-600/50 rounded-[36px] p-6 shadow-[0_25px_70px_rgba(180,83,9,0.4)] flex flex-col items-center text-white relative overflow-hidden">
            <div className="w-full flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${callStatus === 'speaking' ? 'bg-amber-400 animate-pulse' : callStatus === 'listening' ? 'bg-emerald-400 animate-pulse' : callStatus === 'thinking' ? 'bg-violet-400 animate-ping' : 'bg-amber-400 animate-pulse'}`} />
                <span className={`text-xs font-black tracking-wider ${callStatus === 'speaking' ? 'text-amber-300' : callStatus === 'listening' ? 'text-emerald-300' : callStatus === 'thinking' ? 'text-violet-300' : 'text-amber-300'}`}>
                  {callStatus === 'speaking' ? 'نقلة بوت يتحدث...' : callStatus === 'listening' ? 'يستمع إليك...' : callStatus === 'thinking' ? 'يفكر...' : 'اتصال مباشر'}
                </span>
              </div>
              <div className="text-xs font-mono font-bold bg-white/10 px-3 py-1 rounded-full border border-white/20">
                {formatCallTimer(callDuration)}
              </div>
            </div>
            <div className="mb-4 bg-amber-500/10 border border-amber-400/30 text-amber-200 text-[10px] font-bold px-3 py-1 rounded-full">
              يمكنك مقاطعة نقلة بوت في أي لحظة!
            </div>
            <div className="relative flex flex-col items-center mb-4">
              <div className={`absolute w-44 h-44 rounded-full blur-xl transition-all duration-500 ${callStatus === 'speaking' ? 'bg-amber-500/25 animate-ping' : callStatus === 'thinking' ? 'bg-violet-500/20 animate-pulse' : 'bg-amber-500/10'}`} />
              <div className={`relative w-32 h-32 rounded-full border-4 flex items-center justify-center overflow-hidden transition-all duration-300 ${callStatus === 'speaking' ? 'border-amber-400' : callStatus === 'thinking' ? 'border-violet-400' : callStatus === 'listening' ? 'border-emerald-400' : 'border-amber-600/50'}`}>
                <img
                  src="/assets/naqla_bot_avatar.png"
                  alt="نقلة بوت"
                  className={`w-full h-full object-contain ${callStatus === 'speaking' ? 'animate-bounce' : callStatus === 'thinking' ? 'scale-95 opacity-80' : ''}`}
                  onError={(e) => { (e.target as HTMLImageElement).src = '/icon.svg'; }}
                />
              </div>
              <div className="mt-5 flex items-center gap-1.5 h-8">
                {vuBars.map((height, i) => (
                  <span key={i} className={`w-1.5 rounded-full transition-all duration-75 ${isUserTalkingInCall ? 'bg-amber-400' : callStatus === 'speaking' ? 'bg-amber-500' : callStatus === 'thinking' ? 'bg-violet-400' : 'bg-slate-600 opacity-40'}`}
                    style={{ height: `${height}px` }} />
                ))}
              </div>
              <h3 className="text-lg font-black mt-3">نقلة بوت <span className="text-xs bg-amber-600 text-white font-bold px-2 py-0.5 rounded-full">التاريخ ثانوي ٢</span></h3>
            </div>
            <div className={`w-full border rounded-2xl p-4 min-h-[80px] flex items-center justify-center text-center mb-6 transition-all duration-300 ${callStatus === 'speaking' ? 'bg-amber-500/10 border-amber-400/30' : callStatus === 'thinking' ? 'bg-violet-500/10 border-violet-400/30' : callStatus === 'listening' ? 'bg-emerald-500/10 border-emerald-400/30' : 'bg-white/10 border-white/20'}`}>
              <p className="text-xs sm:text-sm font-medium text-amber-100 italic leading-relaxed text-right">{callSubtitle}</p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={toggleCallMute} className={`p-4 rounded-full border-2 transition-all cursor-pointer shadow-lg hover:scale-110 ${isCallMuted ? 'bg-rose-600 border-rose-400 text-white' : 'bg-white/10 hover:bg-white/20 border-white/30 text-white'}`} title={isCallMuted ? 'إلغاء الكتم' : 'كتم'}>
                {isCallMuted ? (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="1" y1="1" x2="23" y2="23" /><path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6" /><path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v4M8 23h8" /></svg>
                ) : (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" /><path d="M19 10v2a7 7 0 01-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                )}
              </button>
              <button onClick={toggleLiveCall} className="bg-rose-600 hover:bg-rose-700 text-white font-black text-sm px-6 py-4 rounded-full shadow-[0_10px_25px_rgba(225,29,72,0.5)] border-2 border-rose-400 flex items-center gap-2 hover:scale-110 active:scale-95 transition-all cursor-pointer">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.72A2 2 0 012 0h3a2 2 0 012 1.72c.127 1.003.36 1.99.7 2.94a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.18 6.18l1.14-1.34a2 2 0 012.11-.45c.95.34 1.937.573 2.94.7A2 2 0 0122 14.92v2z" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                <span>إنهاء المكالمة</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
