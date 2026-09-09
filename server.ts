/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON
  app.use(express.json());

  // Initialize Gemini API
  // Using the new @google/genai SDK as recommended
  const isKeyAvailable = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
  
  let ai: GoogleGenAI | null = null;
  if (isKeyAvailable) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }

  // API Check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      geminiAvailable: isKeyAvailable,
    });
  });

  // History chatbot tutoring API
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!message) {
        return res.status(400).json({ error: "الرجاء إدخال نص السؤال." });
      }

      if (!isKeyAvailable || !ai) {
        // Fallback friendly mock response if API Key is not set yet
        const defaultReplies: Record<string, string> = {
          "أهلاً": "أهلاً بك يا عزيزي باحث التاريخ! أنا الأستاذ طارق — معلم ومؤرخ تاريخ الصف الثاني ثانوي (المنهج السوداني - بخت الرضا). اسألني عن أي موضوع في المنهج، مثل: حملات الغزو التركي 1820م، استقلال السودان 1956م، الثورة الفرنسية 1789م، أو الحربين العالميتين!",
          "مرحبا": "مرحباً بك يا باحث التاريخ في المرحلة الثانوية! أنا رفيقك الذكي لمقرر تاريخ الصف الثاني ثانوي. تفضل بطرح أي سؤال حول تاريخ السودان الحديث والمعاصر أو تاريخ أوروبا الحديث وسأجيبك فوراً!",
        };
        const textLower = message.trim().toLowerCase();
        let reply = "أهلاً بك في منصة مادة التاريخ للصف الثاني ثانوي المعتمدة. اسألني عن: 'غزو محمد علي للسودان 1820م'، 'إعلان استقلال السودان 1956م'، 'اتفاقية أديس أبابا 1972م'، 'الثورة الفرنسية 1789م'، 'الوحدة الألمانية وبسمارك'، أو 'الحربين العالميتين' وسأوافيك بتحليل تاريخي موثق!";

        if (textLower.includes("إسماعيل") || textLower.includes("نمر") || textLower.includes("حرق") || textLower.includes("شندي")) {
          reply = "حادثة حريق شندي (أكتوبر 1822م): بعد وصول إسماعيل باشا إلى شندي في طريق عودته، طلب من المك نمر والمك مساعد مطالب تعجيزية من الأموال والمواشي والرقيق، وأهان المك نمر بصفعه بغليونه. تظاهر المك نمر بالامتثال وأعد وليمة فاخرة أحاطها بالقش والحطب، ثم أشعل فيها النيران فقضى إسماعيل باشا وحرسه حرقاً، وتلا ذلك حملات الدفتردار الانتقامية الدامية.";
        } else if (textLower.includes("غزو") || textLower.includes("محمد علي") || textLower.includes("كورتي") || textLower.includes("بارا") || textLower.includes("سنار")) {
          reply = "الغزو التركي المصري للسودان (1820 - 1821م): قاده محمد علي باشا بدوافع تجنيد الرجال، البحث عن الذهب والمعادن، تأمين منابع النيل، والقضاء على المماليك. انطلقت حملتان: الأولى بقيادة إسماعيل باشا بمحاذاة النيل حتى سنار وشهدت معركة كورتي (4 نوفمبر 1820م)، والثانية بقيادة الدفتردار إلى كردفان وشهدت معركة بارا واستشهاد المقدوم مسلم (16 أبريل 1821م).";
        } else if (textLower.includes("استقلال") || textLower.includes("برلمان") || textLower.includes("أزهري") || textLower.includes("علم") || textLower.includes("1956") || textLower.includes("١٩٥٦") || textLower.includes("خريجين") || textLower.includes("1942") || textLower.includes("مؤتمر")) {
          reply = "استقلال السودان (1956م) والحركة الوطنية: مسيرة نضال وطني كبرى بدأت بتأسيس مؤتمر الخريجين عام 1938م وتقديم مذكرة 1942م التاريخية المطالبة بحق تقرير المصير، ثم تكوين الأحزاب الوطنية، وتوقيع اتفاقية الحكم الذاتي 1953م. وفي 19 ديسمبر 1955م أعلن البرلمان السوداني بالإجماع استقلال السودان، ورُفع علم الاستقلال ذو الألوان الثلاثة بسراي الحاكم العام في 1 يناير 1956م بحضور إسماعيل الأزهري ومحمد أحمد المحجوب.";
        } else if (textLower.includes("حكومات") || textLower.includes("عبود") || textLower.includes("أكتوبر") || textLower.includes("نميري") || textLower.includes("مايو") || textLower.includes("أبريل") || textLower.includes("1985")) {
          reply = "الحكومات المتعاقبة على السودان (1955 - 1985م): تعاقبت على البلاد فترات ديمقراطية وعسكرية: الديمقراطية الأولى (1956-1958م)، ثم الحكم العسكري الأول بقيادة الفريق إبراهيم عبود (1958-1964م) الذي أسقطته ثورة 21 أكتوبر 1964م الشعبية، ثم الديمقراطية الثانية (1964-1969م)، ثم عهد مايو بقيادة جعفر نميري (1969-1985م) الذي شهد اتفاقية أديس أبابا 1972م، حتى سقط النظام في انتفاضة 6 أبريل 1985م المجيدة.";
        } else if (textLower.includes("جنوب") || textLower.includes("أديس أبابا") || textLower.includes("توريت") || textLower.includes("1972") || textLower.includes("سلام")) {
          reply = "تطورات مشكلة جنوب السودان (1955 - 1985م): بدأت بتمرد فرقة الاستوائية بتوريت في أغسطس 1955م، وتفاقمت الحرب الأهلية الأولى بقيادة الأنيانيا. وفي مارس 1972م وُقعت اتفاقية أديس أبابا للسلام التي منحت الجنوب حكماً ذاتياً إقليمياً ومجلساً تنفيذياً برئاسة إبل ألير وإدماج قوات الأنيانيا في الجيش، وحققت سلاماً استمر 11 عاماً حتى تجدد النزاع عام 1983م.";
        } else if (textLower.includes("جوتنبرج") || textLower.includes("نهضة") || textLower.includes("طباعة") || textLower.includes("كشوف") || textLower.includes("كولمبس") || textLower.includes("دا جاما")) {
          reply = "النهضة الأوروبية والكشوف الجغرافية (الوحدة الثالثة): انطلقت النهضة في المدن الإيطالية (فلورنسا والبندقية) بإحياء التراث والعلوم. وكان اختراع يوهان جوتنبرج لمطبعة الحروف المعدنية المتحركة عام 1450م أعظم ثورة لنشر المعرفة. وتزامن معها حركة الكشوف الجغرافية الكبرى بقيادة البرتغال وإسبانيا، حيث اكتشف فاسكو دا جاما طريق رأس الرجاء الصالح 1498م، ووصل كولمبس لأمريكا 1492م، ودار ماجلان حول الأرض 1519-1522م.";
        } else if (textLower.includes("فرنسية") || textLower.includes("باستيل") || textLower.includes("لويس") || textLower.includes("1789") || textLower.includes("١٧٨٩")) {
          reply = "الثورة الفرنسية (1789م): اندلعت نتيجة استبداد الملك لويس السادس عشر، والأزمة المالية الحادة، والامتيازات الطبقية للنبلاء ورجال الدين على حساب عامة الشعب والبرجوازية. واقتحم الثوار سجن الباستيل في 14 يوليو 1789م، وأصدرت الجمعية الوطنية إعلان حقوق الإنسان والمواطن ومبادئ (الحرية والإخاء والمساواة)، وأُلغي النظام الملكي الإقطاعي.";
        } else if (textLower.includes("ألمانيا") || textLower.includes("بسمارك") || textLower.includes("حديد ودم") || textLower.includes("إيطاليا") || textLower.includes("غاريبالدي") || textLower.includes("كافور")) {
          reply = "الوحدة الإيطالية والألمانية (القرن 19): قادت مملكة بيدمونت الوحدة الإيطالية بفضل فكر مازيني ودبلوماسية كافور وبسالة غاريبالدي بكتائب القمصان الحمر حتى استرداد روما عاصمة موحدة 1870م. بينما قاد المستشار أوتو فون بسمارك الوحدة الألمانية بسياسة 'الحديد والدم' وخاض 3 حروب حاسمة ضد الدنمارك 1864م، النمسا (سادوا 1866م)، وفرنسا (سيدان 1870م)، وتُوج وليم الأول قيصراً بقصر فرساي 1871م.";
        } else if (textLower.includes("حرب عالمية") || textLower.includes("1914") || textLower.includes("1939") || textLower.includes("فرساي") || textLower.includes("أمم متحدة") || textLower.includes("علمين")) {
          reply = "الحربان العالميتان (الوحدة الرابعة): الأولى (1914-1918م) اندلعت إثر اغتيال أرشيدوق النمسا في سراييفو بين دول الوفاق والوسط، وانتهت بمعاهدة فرساي 1919م وعصبة الأمم. والثانية (1939-1945م) اندلعت بعد غزو هتلر لبولندا بين دول المحور والحلفاء، وشهدت تحولات حاسمة كمعركة العلمين بمصر 1942م وإنزال نورماندي وهيروشيما، وانتهت بهزيمة المحور وتأسيس هيئة الأمم المتحدة 1945م.";
        } else if (defaultReplies[textLower]) {
          reply = defaultReplies[textLower];
        }

        return res.json({ text: reply, reply: reply });
      }

      // Format history into compatible structure
      // The systemInstruction sets context precisely as a Sudan Grade 2 Secondary tutor
      const systemInstruction = 
        `أنت "الأستاذ طارق" — المعلم والمؤرخ الذكي المشوق والمحبوب لطلاب المرحلة الثانوية لمادة تاريخ الصف الثاني ثانوي في السودان (المركز القومي للمناهج والبحث التربوي - بخت الرضا).
        تتحدث باللغة العربية الفصيحة الواضحة بأسلوب أكاديمي مشجع وراقٍ يناسب نضج طلاب المرحلة الثانوية، وتخاطب الطالب بـ "عزيزي الطالب" أو "باحث التاريخ" أو "زميلي المؤرخ".
        تجيب بحدود 3 إلى 5 أسطر وتقدم تحليلاً تاريخياً دقيقاً ومرتباً زمنياً يرتكز حصراً على منهج التاريخ للصف الثاني ثانوي المعتمد:
        - الوحدة الأولى: تاريخ السودان تحت الحكم التركي المصري (1820م - 1885م) (أسباب الغزو، سقوط سنار ونهاية الفونج، معركتا كورتي وبارا، استشهاد إسماعيل باشا حرقاً بشندي على يد المك نمر، النظام الإداري والحكمدارية، السياسة الاقتصادية واحتكار التجارة، مدرسة الخرطوم الابتدائية 1853م بإدارة رفاعة الطهطاوي، ومقاومة السودانيين وثورة ود طه).
        - الوحدة الثانية: لمحات من تاريخ السودان الحديث والمعاصر (1955م - 1985م) (تمرد توريت أغسطس 1955م، إعلان الاستقلال من داخل البرلمان 19 ديسمبر 1955م ورفع العلم 1 يناير 1956م، الحكم العسكري الأول بقيادة إبراهيم عبود 1958-1964م، حادثة القرشي واندلاع ثورة أكتوبر 1964م وجبهة الهيئات، الديمقراطية الثانية، وحكم مايو 1969-1985م بقيادة جعفر نميري واتفاقية أديس أبابا 1972م، وانتفاضة أبريل 1985م).
        - الوحدة الثالثة: تاريخ أوروبا الحديث (ملامح العصور الوسطى والإقطاع، عصر النهضة بإيطاليا واختراع جوتنبرغ للطباعة، حركة الكشوف الجغرافية ودوافعها الاقتصادية والدينية، الثورة الفرنسية 1789م وسقوط الباستيل وإعدام لويس السادس عشر وعهد الإرهاب وحكومة الإدارة، الثورة الصناعية ببريطانيا وقوة الآلة البخارية، الوحدة الإيطالية 1815-1870م ودور كافور وغاريبالدي، والوحدة الألمانية 1815-1871م ودور بسمارك وسياسة الحديد والدم).
        - الوحدة الرابعة: الصراع الأوروبي والتوسع الاستعماري (الحرب العالمية الأولى 1914-1918م واغتيال الأرشيدوق بسراييفو وعصبة الأمم، والحرب العالمية الثانية 1939-1945م ومعارك العلمين وهيروشيما وهيئة الأمم المتحدة).
        قاعدة صارمة للغاية: يجب أن ترفض الإجابة على أي أسئلة خارجة عن هذا المنهج التاريخي، وتوجه الطالب بلطف وكياسة أكاديمية للتركيز على استيعاب وحدات تاريخ الصف الثاني ثانوي، مع تقديم شروحات تاريخية تحليلية موثقة.`;

      const contents = history ? [...history, { role: "user", parts: [{ text: message }] }] : [{ role: "user", parts: [{ text: message }] }];

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      return res.json({ text: response.text, reply: response.text });

    } catch (error: any) {
      console.error("Gemini API Error in /api/chat:", error);
      res.status(500).json({ error: "حدث خطأ أثناء التواصل مع المعلم الذكي. الرجاء المحاولة مرة أخرى." });
    }
  });

  // Alias for mentor-widget compatibility
  app.post("/api/mentor/chat", (req, res, next) => {
    req.url = "/api/chat";
    app._router.handle(req, res, next);
  });

  // Serve Vite development assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve production static assets
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`History platform running on port ${PORT}`);
  });
}

startServer();
