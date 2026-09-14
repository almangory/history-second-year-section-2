(function () {
  const currentScript = document.currentScript;
  const CLOUD_FALLBACK_ENDPOINT = 'https://local-ai-arsenal.pages.dev/api/mentor/chat';
  let cachedApiEndpoint = CLOUD_FALLBACK_ENDPOINT;

  const scriptStage = currentScript ? currentScript.getAttribute('data-stage') : null;
  const urlParamStage = (new URLSearchParams(window.location.search)).get('stage');
  let activeStage = (scriptStage || urlParamStage || 'general').toLowerCase();

  const defaultTitle = activeStage === 'kg' ? 'المعلّم الذكي للبراعم والروضة 🧸' : (activeStage === 'chemistry' ? '🧪 معلّم كيمياء الشهادة السودانية الذكي ⚗️' : (activeStage === 'geography' ? '🌍 معلم جغرافيا الصف السادس الذكي 🇸🇩' : (activeStage === 'history' ? '🏛️ معلم تاريخ الصف السادس الذكي 🇸🇩' : 'المعلّم والمدرّب الذاتي الذكي 🎓')));
  const TITLE = currentScript && currentScript.getAttribute('data-title') ? currentScript.getAttribute('data-title') : defaultTitle;
  const PRIMARY_COLOR = currentScript && currentScript.getAttribute('data-color') ? currentScript.getAttribute('data-color') : (activeStage === 'kg' ? '#f59e0b' : (activeStage === 'chemistry' ? '#0284c7' : (activeStage === 'geography' ? '#4A6741' : (activeStage === 'history' ? '#8C6239' : '#4f46e5'))));

  async function resolveMentorEndpoint() {
    // 1. Direct Localhost Connection (if on local dev or testing)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://127.0.0.1:8000/api/mentor/chat';
    }

    const custom = currentScript ? currentScript.getAttribute('data-api-url') : null;
    if (custom && custom !== 'auto' && custom.trim() !== '' && !custom.includes('xxxx.') && !custom.includes('something.')) {
      return custom.replace(/\/+$/, '') + (custom.includes('/api/mentor/chat') || custom.includes('/api/chat') ? '' : '/api/mentor/chat');
    }

    // 2. ⚡ 24/7 Autonomous Cloudflare Edge AI (Primary Sovereign Engine with GPT-OSS-120B / Qwen-27B Curriculum RAG)
    return CLOUD_FALLBACK_ENDPOINT;
  }

  // Inject Styles
  const style = document.createElement('style');
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');
    
    .mentor-floating-btn {
      position: fixed;
      bottom: 24px;
      left: 24px;
      padding: 12px 20px;
      border-radius: 50px;
      background: linear-gradient(135deg, ${PRIMARY_COLOR}, #7c3aed);
      color: #fff;
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'Tajawal', sans-serif;
      font-weight: 700;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 10px 25px rgba(79, 70, 229, 0.4);
      z-index: 999999;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      border: 1px solid rgba(255, 255, 255, 0.2);
      outline: none;
    }
    .mentor-floating-btn:hover {
      transform: translateY(-4px) scale(1.03);
      box-shadow: 0 15px 30px rgba(79, 70, 229, 0.6);
    }
    
    .mentor-modal {
      position: fixed;
      bottom: 85px;
      left: 24px;
      width: 440px;
      max-width: calc(100vw - 32px);
      height: 640px;
      max-height: calc(100vh - 110px);
      background: #0f172a;
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 24px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.6);
      display: none;
      flex-direction: column;
      z-index: 999999;
      overflow: hidden;
      font-family: 'Tajawal', sans-serif;
      animation: mentorSlideIn 0.3s ease-out forwards;
      direction: rtl;
      transition: width 0.25s ease, height 0.25s ease, max-width 0.25s ease, max-height 0.25s ease, bottom 0.25s ease, left 0.25s ease, border-radius 0.25s ease;
    }

    .mentor-modal.mentor-maximized {
      bottom: 16px;
      left: 16px;
      width: calc(100vw - 32px);
      max-width: 1100px;
      height: calc(100vh - 32px);
      max-height: calc(100vh - 32px);
      border-radius: 16px;
      box-shadow: 0 25px 60px rgba(0,0,0,0.85);
    }

    /* 🧭 تنسيقات نظام الفهرسة والتأشير التفاعلي في الصفحة (Site Indexer & Target Highlighting) */
    .naqla-target-highlighted {
      position: relative !important;
      outline: 4px solid #f59e0b !important;
      box-shadow: 0 0 0 6px rgba(245, 158, 11, 0.45), 0 0 45px rgba(99, 102, 241, 0.85) !important;
      animation: naqlaPulseHighlight 1.1s infinite alternate ease-in-out !important;
      border-radius: 16px !important;
      transition: all 0.3s ease !important;
      z-index: 9999 !important;
    }
    @keyframes naqlaPulseHighlight {
      0% { transform: scale(1); box-shadow: 0 0 0 4px rgba(245, 158, 11, 0.4), 0 0 20px rgba(245, 158, 11, 0.5); }
      100% { transform: scale(1.025); box-shadow: 0 0 0 10px rgba(245, 158, 11, 0.85), 0 0 55px rgba(99, 102, 241, 1); }
    }
    .mentor-modal.mentor-temporarily-minimized {
      transform: translateY(calc(100% - 65px)) scale(0.92) !important;
      opacity: 0.9 !important;
      box-shadow: 0 10px 30px rgba(0,0,0,0.6) !important;
    }
    .naqla-return-pill {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: linear-gradient(135deg, #1e1b4b, #4338ca);
      color: #fff;
      padding: 10px 20px;
      border-radius: 50px;
      box-shadow: 0 12px 35px rgba(0,0,0,0.65);
      border: 2px solid #f59e0b;
      z-index: 9999999;
      font-family: 'Tajawal', sans-serif;
      font-size: 13px;
      font-weight: bold;
      display: none;
      align-items: center;
      gap: 12px;
      direction: rtl;
      animation: mentorFadeIn 0.3s ease-out;
    }
    .naqla-return-pill button {
      background: #f59e0b;
      color: #1e1b4b;
      border: none;
      padding: 6px 14px;
      border-radius: 20px;
      font-weight: 800;
      cursor: pointer;
      font-family: 'Tajawal', sans-serif;
      font-size: 12px;
      transition: transform 0.2s ease, background 0.2s ease;
    }
    .naqla-return-pill button:hover {
      transform: scale(1.06);
      background: #fbbf24;
    }
    .mentor-resource-card {
      margin-top: 12px;
      background: linear-gradient(135deg, rgba(30, 27, 75, 0.96), rgba(15, 23, 42, 0.98));
      border: 1.5px solid rgba(245, 158, 11, 0.55);
      border-radius: 14px;
      padding: 12px 14px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.45);
      font-family: 'Tajawal', sans-serif;
      direction: rtl;
      text-align: right;
    }
    .m-res-hdr {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 11px;
      color: #cbd5e1;
    }
    .m-res-type-badge {
      background: rgba(245, 158, 11, 0.2);
      color: #fbbf24;
      border: 1px solid rgba(245, 158, 11, 0.45);
      padding: 2px 8px;
      border-radius: 6px;
      font-weight: bold;
      font-size: 10px;
    }
    .m-res-title {
      font-size: 14px;
      font-weight: 800;
      color: #fff;
      margin-bottom: 4px;
    }
    .m-res-section {
      font-size: 11px;
      color: #94a3b8;
      margin-bottom: 10px;
    }
    .m-res-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .m-res-link-btn {
      flex: 1;
      min-width: 140px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background: linear-gradient(135deg, #10b981, #059669);
      color: #fff !important;
      text-decoration: none;
      font-size: 12px;
      font-weight: bold;
      padding: 8px 12px;
      border-radius: 10px;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
    .m-res-link-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(16, 185, 129, 0.5);
    }
    .m-res-locate-btn {
      flex: 1;
      min-width: 140px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: #1e1b4b;
      border: none;
      font-size: 12px;
      font-weight: 800;
      padding: 8px 12px;
      border-radius: 10px;
      cursor: pointer;
      font-family: 'Tajawal', sans-serif;
      transition: all 0.2s ease;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    }
    .m-res-locate-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(245, 158, 11, 0.5);
    }

    @keyframes mentorSlideIn {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    
    /* 📞 واجهة المكالمة الصوتية المباشرة المستمرة (Continuous Voice-to-Voice Call) */
    .mentor-call-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, #090d16 0%, #0f172a 100%);
      z-index: 50;
      display: none;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      box-sizing: border-box;
      animation: mentorFadeIn 0.25s ease-out forwards;
    }
    @keyframes mentorFadeIn {
      from { opacity: 0; transform: scale(0.97); }
      to { opacity: 1; transform: scale(1); }
    }
    .m-call-avatar-wrap {
      position: relative;
      margin: 10px 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .m-call-pulse-ring {
      position: absolute;
      width: 130px;
      height: 130px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(14, 165, 233, 0.4) 0%, rgba(14, 165, 233, 0) 70%);
      animation: mCallPulse 2s infinite ease-out;
      pointer-events: none;
    }
    .m-call-pulse-ring.m-speaking {
      background: radial-gradient(circle, rgba(244, 63, 94, 0.5) 0%, rgba(244, 63, 94, 0) 70%);
      animation: mCallPulseFast 0.9s infinite ease-out;
    }
    .m-call-pulse-ring.m-listening {
      background: radial-gradient(circle, rgba(16, 185, 129, 0.5) 0%, rgba(16, 185, 129, 0) 70%);
      animation: mCallPulse 1.4s infinite ease-out;
    }
    @keyframes mCallPulse {
      0% { transform: scale(0.85); opacity: 0.8; }
      50% { transform: scale(1.3); opacity: 0.25; }
      100% { transform: scale(1.6); opacity: 0; }
    }
    @keyframes mCallPulseFast {
      0% { transform: scale(0.9); opacity: 0.9; }
      50% { transform: scale(1.35); opacity: 0.35; }
      100% { transform: scale(1.7); opacity: 0; }
    }
    .m-call-avatar {
      width: 88px;
      height: 88px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1e293b, #0f172a);
      border: 3px solid #38bdf8;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 42px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.6);
      position: relative;
      z-index: 2;
      transition: all 0.3s ease;
      cursor: pointer;
    }
    .m-call-avatar.m-speaking {
      border-color: #f43f5e;
      box-shadow: 0 0 30px rgba(244, 63, 94, 0.6);
    }
    .m-call-avatar.m-listening {
      border-color: #10b981;
      box-shadow: 0 0 30px rgba(16, 185, 129, 0.6);
    }
    .m-call-waves {
      display: flex;
      align-items: center;
      gap: 5px;
      height: 24px;
    }
    .m-call-wave-bar {
      width: 4px;
      height: 6px;
      background: #38bdf8;
      border-radius: 4px;
      transition: height 0.15s ease;
    }
    .m-call-waves.m-active .m-call-wave-bar {
      animation: mWaveBounce 0.9s infinite ease-in-out;
    }
    .m-call-waves.m-speaking .m-call-wave-bar {
      background: #f43f5e;
      animation: mWaveBounce 0.6s infinite ease-in-out;
    }
    .m-call-waves.m-listening .m-call-wave-bar {
      background: #10b981;
      animation: mWaveBounce 1.1s infinite ease-in-out;
    }
    .m-call-waves.m-active .m-call-wave-bar:nth-child(1) { animation-delay: 0.1s; }
    .m-call-waves.m-active .m-call-wave-bar:nth-child(2) { animation-delay: 0.2s; }
    .m-call-waves.m-active .m-call-wave-bar:nth-child(3) { animation-delay: 0.3s; }
    .m-call-waves.m-active .m-call-wave-bar:nth-child(4) { animation-delay: 0.4s; }
    .m-call-waves.m-active .m-call-wave-bar:nth-child(5) { animation-delay: 0.15s; }
    @keyframes mWaveBounce {
      0%, 100% { height: 5px; }
      50% { height: 22px; }
    }
    @keyframes mPulseDot {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }

    .mentor-header {
      background: linear-gradient(135deg, #1e1b4b, #312e81);
      padding: 16px;
      color: #fff;
      display: flex;
      flex-direction: column;
      gap: 8px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }
    
    .mentor-stats-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(0,0,0,0.3);
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 11px;
    }

    .mentor-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .mentor-msg-user {
      align-self: flex-start;
      background: #334155;
      color: #fff;
      padding: 10px 14px;
      border-radius: 16px 16px 4px 16px;
      font-size: 13px;
      max-width: 85%;
      line-height: 1.5;
    }

    .mentor-msg-bot {
      align-self: flex-end;
      background: rgba(30, 27, 75, 0.8);
      border: 1px solid rgba(99, 102, 241, 0.4);
      color: #f1f5f9;
      padding: 12px 14px;
      border-radius: 16px 16px 16px 4px;
      font-size: 13px;
      max-width: 90%;
      line-height: 1.6;
    }

    .mentor-tool-badge {
      display: inline-block;
      background: rgba(99, 102, 241, 0.3);
      border: 1px solid rgba(129, 140, 248, 0.4);
      color: #c7d2fe;
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 6px;
      margin-bottom: 6px;
    }

    .mentor-chips {
      display: flex;
      gap: 6px;
      padding: 8px 16px;
      overflow-x: auto;
      border-top: 1px solid #1e293b;
      background: #090d16;
    }

    .mentor-chip {
      background: #1e293b;
      border: 1px solid #334155;
      color: #94a3b8;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s;
    }
    .mentor-chip:hover {
      background: #312e81;
      color: #fff;
      border-color: #6366f1;
    }

    .mentor-input-bar {
      padding: 12px;
      background: #090d16;
      border-top: 1px solid #1e293b;
      display: flex;
      gap: 8px;
    }

    .mentor-input {
      flex: 1;
      background: #1e293b;
      border: 1px solid #334155;
      color: #fff;
      padding: 10px 14px;
      border-radius: 12px;
      font-size: 13px;
      font-family: inherit;
      outline: none;
    }
    .mentor-input:focus {
      border-color: #6366f1;
    }

    .mentor-send {
      background: #4f46e5;
      color: #fff;
      border: none;
      padding: 0 16px;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 700;
      font-size: 13px;
      transition: background 0.2s;
    }
    .mentor-send:hover { background: #4338ca; }

  
    /* 🎨 بطاقة الرسوم التعليمية وبنك الصور المعتمد */
    .mentor-image-card {
      margin-top: 12px;
      padding: 12px;
      background: rgba(15, 23, 42, 0.95);
      border: 1.5px solid #06b6d4;
      border-radius: 14px;
      box-shadow: 0 4px 18px rgba(6, 182, 212, 0.25);
      text-align: right;
    }
    .mentor-image-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      gap: 6px;
    }
    .mentor-image-title {
      font-size: 12px;
      color: #38bdf8;
      font-weight: 700;
      flex: 1;
    }
    .mentor-image-badge {
      font-size: 10px;
      padding: 2px 8px;
      border-radius: 8px;
      font-weight: 700;
      white-space: nowrap;
    }
    .badge-cached {
      background: rgba(16, 185, 129, 0.2);
      color: #34d399;
      border: 1px solid rgba(52, 211, 153, 0.4);
    }
    .badge-official {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(245, 158, 11, 0.25));
      color: #fef08a;
      border: 1px solid rgba(245, 158, 11, 0.6);
      box-shadow: 0 0 12px rgba(245, 158, 11, 0.2);
    }
    .badge-new {
      background: rgba(168, 85, 247, 0.2);
      color: #c084fc;
      border: 1px solid rgba(192, 132, 252, 0.4);
    }
    .mentor-image-wrapper {
      position: relative;
      width: 100%;
      border-radius: 10px;
      overflow: hidden;
      background: #020617;
      min-height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #1e293b;
      cursor: zoom-in;
    }
    .mentor-image-preview {
      width: 100%;
      height: auto;
      max-height: 240px;
      object-fit: cover;
      display: none;
      transition: transform 0.3s ease;
    }
    .mentor-image-wrapper:hover .mentor-image-preview {
      transform: scale(1.02);
    }
    .mentor-image-skeleton {
      font-size: 11px;
      color: #94a3b8;
      padding: 20px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .mentor-image-desc {
      font-size: 11px;
      color: #cbd5e1;
      margin-top: 8px;
      line-height: 1.5;
    }
    .mentor-image-actions {
      display: flex;
      gap: 6px;
      margin-top: 10px;
      flex-wrap: wrap;
    }
    .mentor-img-action-btn {
      flex: 1;
      min-width: 80px;
      padding: 5px 8px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      text-align: center;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      transition: all 0.2s;
      border: none;
    }
    .btn-zoom {
      background: #0284c7;
      color: #fff;
    }
    .btn-zoom:hover { background: #0369a1; }
    .btn-download {
      background: #059669;
      color: #fff;
    }
    .btn-download:hover { background: #047857; }
    .btn-copy {
      background: #334155;
      color: #e2e8f0;
    }
    .btn-copy:hover { background: #475569; }

    /* Lightbox Modal */
    .mentor-lightbox-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0,0,0,0.85);
      backdrop-filter: blur(6px);
      z-index: 10000000;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
      box-sizing: border-box;
      animation: mentorFadeIn 0.2s ease-out forwards;
    }
    .mentor-lightbox-content {
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
      background: #0f172a;
      border: 1px solid rgba(255,255,255,0.2);
      border-radius: 16px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 25px 60px rgba(0,0,0,0.9);
    }
    .mentor-lightbox-img {
      max-width: 100%;
      max-height: 75vh;
      object-fit: contain;
      border-radius: 10px;
    }
    .mentor-lightbox-header {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }
    .mentor-lightbox-close {
      background: #dc2626;
      border: none;
      color: #fff;
      border-radius: 8px;
      padding: 4px 10px;
      font-size: 12px;
      cursor: pointer;
      font-weight: bold;
    }

  `;
  document.head.appendChild(style);

  // Floating Button
  const btn = document.createElement('button');
  btn.className = 'mentor-floating-btn';
  btn.innerHTML = `<span>${activeStage === 'kg' ? '🧸' : (activeStage === 'arabic' ? '📖' : (activeStage === 'geography' ? '🌍' : (activeStage === 'history' ? '🏛️' : '🎓')))}</span> <span id="m-btn-label">${TITLE}</span>`;
  document.body.appendChild(btn);

  // Modal Container
  const modal = document.createElement('div');
  modal.className = 'mentor-modal';
  modal.innerHTML = `
    <div class="mentor-header">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span id="m-hdr-icon" style="font-size:20px;">${activeStage === 'kg' ? '🧸' : (activeStage === 'arabic' ? '📖' : (activeStage === 'geography' ? '🌍' : (activeStage === 'history' ? '🏛️' : '🎓')))}</span>
          <div>
            <div id="m-hdr-title" style="font-weight:700; font-size:14px;">${TITLE}</div>
            <div id="m-hdr-sub" style="font-size:10px; color:#a5b4fc;">${activeStage === 'kg' ? 'معلم سوداني • أسلوب البراعم ومرحلة الروضة 🧸🎨' : (activeStage === 'arabic' ? 'معلم سوداني • لغة عربية، نحو، بلاغة وقراءة 📖✍️' : (activeStage === 'chemistry' ? 'معلم سوداني • كيمياء الشهادة السودانية 🧪' : (activeStage === 'geography' ? 'معلم سوداني • جغرافيا الصف السادس الابتدائي 🌍🇸🇩' : (activeStage === 'history' ? 'معلم سوداني • تاريخ الصف السادس الابتدائي 🏛️🇸🇩' : 'معلم سوداني'))))}</div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          <button id="m-voice-btn" title="اختيار صوت المتحدث (المعلم عثمان / المعلمة إسراء)" style="background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.25); color:#a7f3d0; border-radius:8px; padding:3px 8px; font-size:11px; cursor:pointer; font-weight:bold; transition:all 0.2s;">
            🎙️ 👨 عثمان
          </button>
          <button id="m-stage-btn" title="التبديل بين وضع الروضة والتعليم العام" style="background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.25); color:#fef08a; border-radius:8px; padding:3px 8px; font-size:11px; cursor:pointer; font-weight:bold; transition:all 0.2s;">
            ${activeStage === 'kg' ? '🧸 وضع الروضة' : (activeStage === 'arabic' ? '📖 لغة عربية' : (activeStage === 'chemistry' ? '🧪 كيمياء الشهادة' : (activeStage === 'geography' ? '🌍 جغرافيا 6' : (activeStage === 'history' ? '🏛️ تاريخ 6' : '🎓 التعليم العام'))))}
          </button>
          <button id="mentor-max-btn" title="تكبير / استعادة الإطار" style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); color:#cbd5e1; border-radius:8px; width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; font-size:13px; transition:all 0.2s;">⛶</button>
          <button id="mentor-close-btn" title="إغلاق" style="background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); color:#cbd5e1; border-radius:8px; width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; font-size:14px; transition:all 0.2s;">✕</button>
        </div>
      </div>
      <div class="mentor-stats-bar">
        <span>🌟 <strong id="m-xp">50 XP</strong></span>
        <span>🎖️ <strong id="m-level">${activeStage === 'kg' ? 'برعم ذكي 🌟' : (activeStage === 'arabic' ? 'فارس لغة الضاد 📖' : (activeStage === 'chemistry' ? 'عالم كيمياء واعد 🧪' : (activeStage === 'geography' ? 'جغرافي واعد 🌍' : (activeStage === 'history' ? 'مؤرخ واعد 🏛️' : 'مبتدئ شغوف 🌟'))))}</strong></span>
        <span>🔥 <strong id="m-streak">0</strong></span>
      </div>
    </div>

    
    <!-- 📞 واجهة المكالمة الصوتية المباشرة المتطورة (Enhanced Duplex Voice Call Engine) -->
    <div class="mentor-call-overlay" id="m-call-overlay">
      <div style="width:100%; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.12); padding-bottom:10px;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-size:18px;">📞</span>
          <span style="font-weight:700; font-size:13px; color:#fff;">مكالمة صوتية مباشرة</span>
          <span id="m-call-timer" style="font-family:monospace; font-size:11px; font-weight:700; background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); border-radius:12px; padding:2px 8px; color:#38bdf8;">00:00</span>
        </div>
        <div style="display:flex; align-items:center; gap:6px;">
          <button id="m-call-nearvoice-btn" title="تبديل وضع عزل الصوت القريب والضوضاء المحيطة" style="background:rgba(16,185,129,0.18); border:1px solid rgba(16,185,129,0.4); color:#6ee7b7; border-radius:8px; padding:3px 8px; font-size:11px; cursor:pointer; font-weight:bold; transition:all 0.2s;">
            🎯 عزل الصوت: ذكي
          </button>
          <button id="m-call-speaker-btn" title="تبديل صوت المتحدث" style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:#a7f3d0; border-radius:8px; padding:3px 8px; font-size:11px; cursor:pointer; font-weight:bold; transition:all 0.2s;">
            🎙️ 👨 عثمان
          </button>
        </div>
      </div>

      <!-- Near Voice & Instant Interruption Guidance Pill -->
      <div id="m-call-guidance-pill" style="display:flex; align-items:center; justify-content:center; gap:6px; margin-top:8px; background:rgba(16,185,129,0.12); border:1px solid rgba(16,185,129,0.3); border-radius:14px; padding:4px 10px; font-size:10px; color:#6ee7b7; font-weight:bold; transition:all 0.3s;">
        <span>🎯 عزل الصوت القريب مفعّل: يتجاهل أصوات المحيط ويستمع لصوتك المباشر</span>
      </div>

      <div class="m-call-avatar-wrap" style="margin-top:10px;">
        <div class="m-call-pulse-ring" id="m-call-pulse"></div>
        <div class="m-call-avatar" id="m-call-avatar" title="اضغط للمقاطعة والتحدث">👨‍🏫</div>
      </div>

      <div style="text-align:center; margin-top:10px; width:100%;">
        <div id="m-call-teacher-name" style="font-size:16px; font-weight:800; color:#fff; margin-bottom:4px;">المعلم عثمان</div>
        <div id="m-call-status-badge" style="display:inline-flex; align-items:center; gap:6px; background:rgba(16,185,129,0.2); border:1px solid rgba(16,185,129,0.4); color:#6ee7b7; padding:4px 12px; border-radius:20px; font-size:12px; font-weight:bold; transition:all 0.3s;">
          <span id="m-call-status-dot" style="width:8px; height:8px; border-radius:50%; background:#10b981; display:inline-block;"></span>
          <span id="m-call-status-text">المعلم يستمع لصوتك الآن... تفضل</span>
        </div>

        <!-- 7-Bar Dynamic VU Meter Sound Waves -->
        <div class="m-call-waves m-active" id="m-call-waves" style="justify-content:center; margin:12px auto; display:flex; align-items:flex-end; gap:5px; height:28px;">
          <div class="m-call-wave-bar" style="width:4px; border-radius:3px; background:#38bdf8; height:6px; transition:height 0.08s ease, background 0.2s;"></div>
          <div class="m-call-wave-bar" style="width:4px; border-radius:3px; background:#38bdf8; height:10px; transition:height 0.08s ease, background 0.2s;"></div>
          <div class="m-call-wave-bar" style="width:4px; border-radius:3px; background:#38bdf8; height:18px; transition:height 0.08s ease, background 0.2s;"></div>
          <div class="m-call-wave-bar" style="width:4px; border-radius:3px; background:#38bdf8; height:24px; transition:height 0.08s ease, background 0.2s;"></div>
          <div class="m-call-wave-bar" style="width:4px; border-radius:3px; background:#38bdf8; height:18px; transition:height 0.08s ease, background 0.2s;"></div>
          <div class="m-call-wave-bar" style="width:4px; border-radius:3px; background:#38bdf8; height:10px; transition:height 0.08s ease, background 0.2s;"></div>
          <div class="m-call-wave-bar" style="width:4px; border-radius:3px; background:#38bdf8; height:6px; transition:height 0.08s ease, background 0.2s;"></div>
        </div>

        <!-- Subtitles / Live Transcript -->
        <div id="m-call-subtitle-box" style="margin-top:6px; min-height:50px; max-height:85px; overflow-y:auto; background:rgba(0,0,0,0.45); border:1px solid rgba(255,255,255,0.12); border-radius:12px; padding:8px 12px; font-size:12px; color:#e2e8f0; line-height:1.5; text-align:center; transition:border-color 0.3s;">
          تحدث بصوتك وسيرد عليك المعلم صوتياً بشكل مستمر...
        </div>
      </div>

      <!-- Call Action Controls -->
      <div style="width:100%; display:flex; justify-content:center; align-items:center; gap:8px; margin-top:12px; flex-wrap:wrap;">
        <button id="m-call-mute-btn" title="كتم / تشغيل الميكروفون" style="background:rgba(255,255,255,0.12); border:1px solid rgba(255,255,255,0.25); color:#fff; padding:8px 14px; border-radius:14px; font-size:11px; font-weight:bold; cursor:pointer; display:flex; align-items:center; gap:5px; transition:all 0.2s;">
          <span>🎙️ كتم الصوت</span>
        </button>

        <button id="m-call-interrupt-btn" title="مقاطعة المعلم والتحدث فوراً" style="background:#0284c7; border:none; color:#fff; padding:8px 16px; border-radius:14px; font-size:12px; font-weight:bold; cursor:pointer; display:flex; align-items:center; gap:6px; box-shadow:0 4px 15px rgba(2,132,199,0.4); transition:all 0.2s;">
          <span>⚡ تحدث الآن</span>
        </button>

        <button id="m-call-end-btn" title="إنهاء المكالمة" style="background:#dc2626; border:none; color:#fff; padding:8px 16px; border-radius:14px; font-size:12px; font-weight:bold; cursor:pointer; display:flex; align-items:center; gap:6px; box-shadow:0 4px 15px rgba(220,38,38,0.4); transition:all 0.2s;">
          <span>🔴 إنهاء المكالمة</span>
        </button>
      </div>
    </div>

    <div class="mentor-messages" id="mentor-msg-box">
      <div class="mentor-msg-bot" id="m-welcome-msg">
        ${activeStage === 'kg' ?
          'أهلاً يا عسولنا الحلو وبطلنا الشاطر! 🧸🌟 أنا فرحان جداً إني صديقك الجديد في عالم الحروف والأرقام والألوان المبهجة!<br><br>أنا مساعد ذكاء صناعي مُطوّر من قِبَل منصة نقلة للمناهج الإلكترونية، وأنا هنا أحبك وأفرح بيك كل يوم! 🎈<br><br>قولي — عايز نغني أنشودة الحروف سوا؟ ولا نحكي قصة بطل شاطر؟ ولا نتعلم عد الأرقام؟ 🍎🔢🎨' :
          (activeStage === 'chemistry' ?
          'أهلاً بك يا بطل ويا عالم كيمياء المستقبل! 🧪⚗️ والله فرحان بوجودك معي في رحلة التفوق واكتشاف أسرار الكيمياء.<br><br>أنا مساعد ذكاء صناعي مُطوّر من قِبَل منصة نقلة للمناهج الإلكترونية لكيمياء الشهادة الثانوية السودانية (بخت الرضا).<br><br>سواءً كانت مسألة حساب كيميائي، موازنة معادلة، أو تعليلات الكيمياء العضوية — اطرح سؤالك وهيّا بنا نفككه خطوة بخطوة! 🔬🌟🇸🇩' :
          (activeStage === 'geography' ?
          'أهلاً وسهلاً يا بطل الجغرافيا والاستكشاف! 🌍🇸🇩 أنا فرحان شديد إني رفيقك ومعلمك الذكي (الأستاذ نزار) في رحلة التعرف على وطننا الحبيب السودان وبيئاته وتضاريسه وثرواته الطبيعية.<br><br>أنا مساعد ذكاء اصطناعي مُطوّر من قِبَل منصة نقلة للمناهج الإلكترونية، لمقرر الجغرافيا للصف السادس الابتدائي (بخت الرضا).<br><br>سواءً كان سؤالك عن بيئات السودان (السافانا الفقيرة والغنية)، خزان سنار ومشروع الجزيرة، طق الصمغ العربي، أو خطوط الطول ودوائر العرض — اطرح سؤالك وخلينا نستكشفه سوا خطوة بخطوة! 🗺️🧭🇸🇩' :
          (activeStage === 'history' ?
          'أهلاً وسهلاً يا بطل التاريخ والاستكشاف! 🏛️📜 أنا فرحان شديد إني رفيقك ومعلمك الذكي (الأستاذ طارق) في رحلة الغوص في أمجاد تاريخ السودان، الحضارة العباسية، ممالك إفريقيا الإسلامية، وعصر النهضة والمواطنة.<br><br>أنا مساعد ذكاء اصطناعي مُطوّر من قِبَل منصة نقلة للمناهج الإلكترونية، لمقرر التاريخ والتربية الوطنية للصف السادس الابتدائي (بخت الرضا).<br><br>سواءً كان سؤالك عن حملة 1821م والمك نمر، تخطيط بغداد المدورة، حج منسا موسى الذهبي، الآلة البخارية للثورة الصناعية، أو مقومات الدولة — اطرح سؤالك وخلينا نبحر في التاريخ سوا خطوة بخطوة! 📜🏛️🇸🇩' :
          (activeStage === 'stem' ?
          'أهلاً بعلماء المستقبل وأبطال المختبرات! 🔬⚡ والله فرحان بوجودك معايا في رحلة استكشاف أسرار الطبيعة والعلم الجميل.<br><br>أنا مساعد ذكاء صناعي مُطوّر من قِبَل منصة نقلة للمناهج الإلكترونية، ومتخصص في تبسيط القوانين بالأمثلة الحية والرسوم الدقيقة.<br><br>هات سؤالك — فيزياء، كيمياء، رياضيات، أحياء — وهيّا بنا نكشف أسرارها سوا! 🧪🔭💡' :
          'أهلاً وسهلاً يا بطل العلوم! 🌟📚 أنا فرحان شديد إني رفيقك ومعلمك الذكي في رحلة التفوق والفهم.<br><br>أنا مساعد ذكاء اصطناعي مُطوّر من قِبَل منصة نقلة للمناهج الإلكترونية، وأنا هنا عشانك ما تمشي لحدة.<br><br>سواءً كانت مسألة فيزياء مقفلة، معادلة كيمياء محيّرة، مسألة رياضيات، أو درس ما اتمشيّل — اطرح سؤالك وخلينا نفككه سوا خطوة بخطوة! 🔬💡'
          ))))
        }
      </div>
    </div>

    <div class="mentor-chips" id="m-chips-box">
    </div>

    <div class="mentor-input-bar">
      <input type="file" id="m-cam-file" accept="image/*" capture="environment" style="display:none;" />
      <button class="mentor-cam-btn" id="m-cam-btn" title="📷 التقاط صورة للمسألة بالكاميرا" style="background:#1e293b; border:1px solid #475569; border-radius:10px; color:#fbbf24; padding:8px 12px; cursor:pointer; font-size:16px;">📷</button>
      <button class="mentor-voice-btn" id="m-mic-btn" title="تحدث بالصوت" style="background:#1e293b; border:1px solid #475569; border-radius:10px; color:#e2e8f0; padding:8px 12px; cursor:pointer; font-size:16px;">🎤</button>
      <input type="text" class="mentor-input" id="mentor-txt" placeholder="${activeStage === 'kg' ? 'اكتب أو تحدث مع معلم البراعم 🧸🎤...' : (activeStage === 'geography' ? 'اسأل الأستاذ نزار عن جغرافيا السودان، الخرائط، أو تحدث بالصوت 🎤...' : (activeStage === 'history' ? 'اسأل الأستاذ طارق عن تاريخ السودان، بغداد، منسا موسى، أو تحدث بالصوت 🎤...' : 'اكتب، التقط صورة 📷، أو تحدث بالصوت 🎤...'))}" />
      <button class="mentor-send" id="mentor-btn">إرسال</button>
    </div>
  `;
  document.body.appendChild(modal);

  function renderWidgetChips() {
    const chipsBox = document.getElementById('m-chips-box');
    if (!chipsBox) return;
    if (activeStage === 'kg') {
      chipsBox.innerHTML = `
        <div class="mentor-chip" id="m-call-chip" onclick="window.toggleWidgetCall()" style="border-color:#f59e0b; color:#fde68a; font-weight:bold;">📞 مكالمة صوتية مستمرة</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('احكي لي قصة حلوة يا معلمي 🧸')">🧸 احكي لي قصة</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('علمني حرف الألف 🔤')">🔤 حرف الألف</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('يلا نعد الأرقام 1 2 3 🔢')">🔢 نعد الأرقام</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('علمني الألوان الجميلة 🎨')">🎨 الألوان</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('كيف صوت الأسد والحيوانات؟ 🦁')">🦁 صوت الأسد</div>
      `;
        } else if (activeStage === 'arabic') {
      chipsBox.innerHTML = `
        <div class="mentor-chip" id="m-call-chip" onclick="window.toggleWidgetCall()" style="border-color:#059669; color:#6ee7b7; font-weight:bold;">📞 مكالمة صوتية مستمرة</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('اشرح لي قواعد النحو وعلامات الإعراب للأفعال والأسماء')">📝 النحو والإعراب</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('كيف أستخرج الفكرة الرئيسة وأفهم معاني الكلمات من النص؟')">📖 القراءة وفهم المقروء</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('ما هي قواعد كتابة الهمزة المتوسطة والمتطرفة؟')">✍️ الإملاء والهمزات</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('اشرح لي أركان التشبيه والفرق بين الاستعارة المكنية والتصريحية')">🎨 البلاغة والبيان</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('اديني الزيت في مادة اللغة العربية وطريقة الإجابة في الامتحانات')">💡 الزيت في العربي!</div>
      `;
    } else if (activeStage === 'chemistry') {
      chipsBox.innerHTML = `
        <div class="mentor-chip" id="m-call-chip" onclick="window.toggleWidgetCall()" style="border-color:#0284c7; color:#7dd3fc; font-weight:bold;">📞 مكالمة صوتية مستمرة</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('اشرح لي موازنة معادلات الأكسدة والاختزال بوسط حمضي')">⚖️ وزن معادلة</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('علل: حرارة تعادل حمض قوي مع قاعدة قوية ثابتة؟')">❓ علل لما يأتي</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('كيف أميز بين الكحولات والإسترات في العضوية؟')">🧪 تمييز عضوي</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('اشرح لي تطبيق قاعدة لوشاتيليه على الاتزان الكيميائي')">⚗️ قاعدة لوشاتيليه</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('مسألة حسابية في معايرة التعادل وحساب المولارية')">🧮 مسألة معايرة</div>
      `;
    } else if (activeStage === 'geography') {
      chipsBox.innerHTML = `
        <div class="mentor-chip" id="m-call-chip" onclick="window.toggleWidgetCall()" style="border-color:#4A6741; color:#FAF4ED; background:#3B5334; font-weight:bold;">📞 مكالمة صوتية مستمرة</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('ما الفرق بين بيئة السافانا الفقيرة والسافانا الغنية؟')">🌍 بيئات السودان (السافانا)</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('اشرح أهمية خزان سنار ومشروع الجزيرة والري الانسيابي')">🌊 خزان سنار والجزيرة</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('كيف تتم عملية طق الصمغ العربي من شجرة الهشاب وما أهميته؟')">🌳 الصمغ العربي والهشاب</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('ما هو موقع السودان الفلكي بين خطوط الطول ودوائر العرض وتأثيره المناخي؟')">🧭 خطوط الطول والعرض</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('ما هي مخاطر استخدام مادتي الزئبق والسيانيد في التعدين الأهلي للذهب؟')">⚠️ مخاطر تعدين الذهب</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('كيف نحسب الكثافة السكانية لمساحة معينة مع مثال تطبيقي؟')">👥 حساب الكثافة السكانية</div>
      `;
    } else if (activeStage === 'history') {
      chipsBox.innerHTML = `
        <div class="mentor-chip" id="m-call-chip" onclick="window.toggleWidgetCall()" style="border-color:#8C6239; color:#FAF4ED; background:#5C3A14; font-weight:bold;">📞 مكالمة صوتية مستمرة</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('لماذا غزا محمد علي باشا السودان عام 1821م وما هي مسارات الحملات؟')">⚔️ حملة 1821م ومحمد علي</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('اشرح معركة كورتي وصمود قبيلة الشايقية ودور مهيرة بت عبود')">🛡️ معركة كورتي ومهيرة</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('كيف كانت حيلة المك نمر ومقتل إسماعيل باشا في شندي 1822م؟')">🔥 المك نمر وحريق شندي</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('صف التخطيط الهندسي لمدينة بغداد المدورة التي بناها أبو جعفر المنصور')">🏛️ مدينة بغداد المدورة</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('أخبرني عن إمبراطورية مالي ورحلة حج منسا موسى الذهبي 1324م')">👑 حج منسا موسى ومالي</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('كيف بدأت الثورة الصناعية وما أثر الآلة البخارية لجيمس واط؟')">⚙️ الثورة الصناعية وآلة واط</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('ما هي مقومات الدولة الأساسية وحقوق وواجبات المواطنة للصف السادس؟')">🇸🇩 مقومات الدولة والمواطنة</div>
      `;
    } else {
      chipsBox.innerHTML = `
        <div class="mentor-chip" id="m-call-chip" onclick="window.toggleWidgetCall()" style="border-color:#6366f1; color:#c7d2fe; font-weight:bold;">📞 مكالمة صوتية مستمرة</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('أديني تلميح يا أستاذ')">💡 أديني تلميح</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('اختبرني بسؤال تحدي')">🎯 سؤال تحدي</div>
        <div class="mentor-chip" onclick="window.sendMentorChip('كم نقاطي ومستواي الدراسي الآن؟')">📊 تقرير إنجازاتي</div>
      `;
    }
  }
  renderWidgetChips();

  let widgetSpeaker = localStorage.getItem('mentor_speaker') || 'osman';
  const voiceBtn = document.getElementById('m-voice-btn');
  if (voiceBtn) {
    function updateWidgetVoiceUI() {
      voiceBtn.innerHTML = widgetSpeaker === 'israa' ? '🎙️ 👩 إسراء' : '🎙️ 👨 عثمان';
      voiceBtn.style.color = widgetSpeaker === 'israa' ? '#f472b6' : '#a7f3d0';
      voiceBtn.style.borderColor = widgetSpeaker === 'israa' ? '#f472b6' : 'rgba(255,255,255,0.25)';
    }
    updateWidgetVoiceUI();
    voiceBtn.onclick = () => {
      widgetSpeaker = widgetSpeaker === 'osman' ? 'israa' : 'osman';
      localStorage.setItem('mentor_speaker', widgetSpeaker);
      updateWidgetVoiceUI();
      if (typeof window.setMentorVoice === 'function') {
        window.setMentorVoice(widgetSpeaker);
      }
    };
  }

  const stageBtn = document.getElementById('m-stage-btn');
  if (stageBtn) {
    stageBtn.onclick = () => {
      if (activeStage === 'history') {
        activeStage = 'arabic';
      } else if (activeStage === 'arabic') {
        activeStage = 'general';
      } else if (activeStage === 'geography') {
        activeStage = 'history';
      } else if (activeStage === 'kg') {
        activeStage = 'geography';
      } else {
        activeStage = 'arabic';
      }
      stageBtn.textContent = activeStage === 'kg' ? '🧸 وضع الروضة' : (activeStage === 'arabic' ? '📖 لغة عربية' : (activeStage === 'geography' ? '🌍 جغرافيا 6' : (activeStage === 'history' ? '🏛️ تاريخ 6' : '🎓 التعليم العام')));
      const hdrIcon = document.getElementById('m-hdr-icon');
      const hdrSub = document.getElementById('m-hdr-sub');
      const lvl = document.getElementById('m-level');
      const input = document.getElementById('mentor-txt');
      if (hdrIcon) hdrIcon.textContent = activeStage === 'kg' ? '🧸' : (activeStage === 'arabic' ? '📖' : (activeStage === 'geography' ? '🌍' : (activeStage === 'history' ? '🏛️' : '🎓')));
      if (hdrSub) hdrSub.textContent = activeStage === 'kg' ? 'معلم سوداني • أسلوب البراعم ومرحلة الروضة 🧸🎨' : (activeStage === 'chemistry' ? 'معلم سوداني • كيمياء الشهادة السودانية 🧪' : (activeStage === 'geography' ? 'معلم سوداني • جغرافيا الصف السادس الابتدائي 🌍🇸🇩' : (activeStage === 'history' ? 'معلم سوداني • تاريخ الصف السادس الابتدائي 🏛️🇸🇩' : 'معلم سوداني')));
      if (lvl) lvl.textContent = activeStage === 'kg' ? 'برعم ذكي 🌟' : (activeStage === 'arabic' ? 'فارس لغة الضاد 📖' : (activeStage === 'geography' ? 'جغرافي واعد 🌍' : (activeStage === 'history' ? 'مؤرخ واعد 🏛️' : 'مبتدئ شغوف 🌟')));
      if (input) input.placeholder = activeStage === 'kg' ? 'اكتب أو تحدث مع معلم البراعم 🧸🎤...' : (activeStage === 'geography' ? 'اسأل الأستاذ نزار عن جغرافيا السودان، الخرائط، أو تحدث بالصوت 🎤...' : (activeStage === 'history' ? 'اسأل الأستاذ طارق عن تاريخ السودان، بغداد، منسا موسى، أو تحدث بالصوت 🎤...' : 'اكتب، التقط صورة 📷، أو تحدث بالصوت 🎤...'));
      renderWidgetChips();

      const msgBox = document.getElementById('mentor-msg-box');
      const notice = document.createElement('div');
      notice.className = 'mentor-msg-bot';
      notice.style.borderColor = activeStage === 'kg' ? '#f59e0b' : (activeStage === 'geography' ? '#4A6741' : (activeStage === 'history' ? '#8C6239' : '#6366f1'));
      notice.innerHTML = activeStage === 'kg' ?
        '🧸 <strong>تم تفعيل وضع البراعم ومرحلة الروضة (KG)!</strong><br>أهلاً يا عسولنا الحلو! أنا صديقك الجديد من <strong>منصة نقلة للمناهج الإلكترونية</strong>، ويلا نلعب ونتعلم سوا! 🍼🧸🎈' :
        (activeStage === 'geography' ?
        '🌍 <strong>تم تفعيل وضع جغرافيا الصف السادس الابتدائي (بخت الرضا)!</strong><br>أهلاً وسهلاً يا بطل الجغرافيا! 🌟 رفيقك ومعلمك الذكي (الأستاذ نزار) جاهز لمساعدتك في استكشاف بيئات السودان وخرائطه وثرواته الطبيعية. 🗺️🧭🇸🇩' :
        (activeStage === 'history' ?
        '🏛️ <strong>تم تفعيل وضع تاريخ الصف السادس الابتدائي (بخت الرضا)!</strong><br>أهلاً وسهلاً يا بطل التاريخ! 🌟 رفيقك ومعلمك الذكي (الأستاذ طارق) جاهز لمساعدتك في الإبحار في تاريخ السودان والحضارات الإسلامية والإفريقية وعصر النهضة. 📜🏛️🇸🇩' :
        '🎓 <strong>تم تفعيل وضع التعليم العام للمراحل المتقدمة!</strong><br>أهلاً وسهلاً يا بطل العلوم! 🌟 رفيقك ومعلمك الذكي من <strong>منصة نقلة للمناهج الإلكترونية</strong> جاهز لمساعدتك وتفوقك خطوة بخطوة. 📚🚀🇸🇩'
        ));
      msgBox.appendChild(notice);
      msgBox.scrollTop = msgBox.scrollHeight;
    };
  }

  /* =========================================================================
     🧭 محرك الفهرسة الذاتية الفورية للموقع المضيف (Host Site Autonomous Indexer)
     ========================================================================= */
  let lastUserQuery = '';

  const HostSiteIndexer = {
    resources: [],
    lastIndexedUrl: '',
    lastIndexedAt: 0,

    normalizeArabic(str) {
      if (!str) return '';
      return String(str)
        .toLowerCase()
        .replace(/[\u064B-\u065F]/g, '')
        .replace(/[أإآ]/g, 'ا')
        .replace(/ة/g, 'ه')
        .replace(/ى/g, 'ي')
        .replace(/[^\w\s\u0600-\u06FF]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    },

    indexHostSite() {
      if (typeof document === 'undefined') return;
      const now = Date.now();
      if (this.lastIndexedUrl === window.location.href && (now - this.lastIndexedAt) < 2500) {
        return;
      }
      this.lastIndexedUrl = window.location.href;
      this.lastIndexedAt = now;

      const found = [];
      let idCounter = 1;

      // 1. مسح كافة روابط الكتب والمستندات والمنصات التفاعلية والبطاقات
      const candidates = document.querySelectorAll('a[href], button, [role="button"], [data-pdf-url], [data-interactive-url], [data-subject], [id*="pri"], [id*="sec"]');
      candidates.forEach(el => {
        if (el.closest('.mentor-modal') || el.closest('.mentor-floating-btn') || el.closest('#mentor-lightbox') || el.closest('#naqla-return-pill')) return;

        const href = el.getAttribute('href') || el.getAttribute('data-pdf-url') || el.getAttribute('data-interactive-url') || '';
        const rawText = (el.textContent || '').trim();
        const ariaLabel = (el.getAttribute('aria-label') || '').trim();
        const titleAttr = (el.getAttribute('title') || '').trim();

        const card = el.closest('[class*="card"], [class*="item"], article, section, li, tr, [data-subject], [id*="pri"], [id*="sec"]');
        const cardText = card ? (card.textContent || '').trim() : '';

        let sectionTitle = '';
        if (card) {
          const heading = card.closest('section, div, main')?.querySelector('h1, h2, h3, h4, [class*="title"], [class*="heading"]');
          if (heading && heading !== el) {
            sectionTitle = (heading.textContent || '').trim();
          }
        }

        const combined = `${rawText} ${ariaLabel} ${titleAttr} ${cardText.slice(0, 250)}`;
        const norm = this.normalizeArabic(combined);

        let subject = '';
        if (norm.includes('رياضيات') || norm.includes('حساب') || norm.includes('math')) subject = 'الرياضيات';
        else if (norm.includes('جغرافيا') || norm.includes('بيئات السودان') || norm.includes('تضاريس')) subject = 'الجغرافيا';
        else if (norm.includes('تاريخ') || norm.includes('كوش') || norm.includes('مروي') || norm.includes('سلاطين')) subject = 'التاريخ';
        else if (norm.includes('علوم') || norm.includes('احياء') || norm.includes('كيمياء') || norm.includes('فيزياء') || norm.includes('science')) subject = 'العلوم';
        else if (norm.includes('لغه عربيه') || norm.includes('عربي') || norm.includes('قواعد')) subject = 'اللغة العربية';
        else if (norm.includes('تربيه اسلاميه') || norm.includes('اسلاميه') || norm.includes('قران') || norm.includes('فقه')) subject = 'التربية الإسلامية';
        else if (norm.includes('انجليزي') || norm.includes('english')) subject = 'اللغة الإنجليزية';
        else if (norm.includes('حاسوب') || norm.includes('تكنولوجيا') || norm.includes('ict')) subject = 'تكنولوجيا المعلومات';
        else if (norm.includes('تربيه وطنيه') || norm.includes('مواطنه')) subject = 'التربية الوطنية';
        else if (norm.includes('فنون') || norm.includes('موسيقى') || norm.includes('رسم')) subject = 'الفنون والموسيقى';

        const isPdf = href.includes('.pdf') || href.includes('drive.google.com') || href.includes('docs.google.com') || norm.includes('كتاب') || norm.includes('تحميل pdf') || norm.includes('تنزيل الكتاب');
        const isInteractive = href.includes('vercel.app') || href.includes('pages.dev') || href.includes('/app') || href.includes('/interactive') || norm.includes('تفاعلي') || norm.includes('منصه');
        const isWorksheet = norm.includes('ورقه عمل') || norm.includes('اوراق عمل') || norm.includes('نشاط');
        const isExam = norm.includes('امتحان') || norm.includes('اختبار') || norm.includes('تحدي') || norm.includes('مسابقه');
        const isMap = norm.includes('خريطه') || norm.includes('map');

        if (isPdf || isInteractive || isWorksheet || isExam || isMap || subject) {
          let type = isPdf ? 'كتاب PDF' : (isInteractive ? 'منصة تفاعلية' : (isWorksheet ? 'ورقة عمل' : (isExam ? 'امتحان وتحديات' : (isMap ? 'خريطة تفاعلية' : 'مورد تعليمي'))));

          let title = rawText;
          if (!title || title.length < 4 || title.includes('تحميل') || title.includes('فتح') || title.includes('عرض') || title.includes('تنزيل')) {
            if (subject) {
              title = `${type.includes('كتاب') ? 'كتاب' : (type.includes('منصة') ? 'منصة' : 'مورد')} ${subject}`;
            } else if (card) {
              const titleEl = card.querySelector('h1, h2, h3, h4, h5, [class*="title"], [class*="name"], .font-bold');
              if (titleEl) title = (titleEl.textContent || '').trim();
            }
          }
          if (!title) title = `${subject || 'مورد'} (${type})`;

          const resId = 'naqla-res-' + (idCounter++);
          el.setAttribute('data-naqla-res-id', resId);
          if (card && !card.hasAttribute('data-naqla-card-id')) {
            card.setAttribute('data-naqla-card-id', resId);
          }

          const isDup = found.some(f => f.title === title && f.url === href);
          if (!isDup) {
            found.push({
              id: resId,
              title: title.slice(0, 80),
              subject: subject || 'عام',
              type: type,
              url: href.startsWith('http') ? href : (href.startsWith('/') ? window.location.origin + href : href),
              section: sectionTitle.slice(0, 70) || 'الموقع العام',
              elementId: resId
            });
          }
        }
      });

      // 2. مسح أزرار وتبويبات التنقل داخل الصفحة والتطبيقات (مثل أزرار التاريخ والجغرافيا)
      const navButtons = document.querySelectorAll('button[id*="nav"], [role="tab"], .nav-item, nav button, nav a');
      navButtons.forEach(btn => {
        if (btn.closest('.mentor-modal') || btn.closest('.mentor-floating-btn') || btn.closest('#naqla-return-pill')) return;
        const txt = (btn.textContent || '').trim();
        const norm = this.normalizeArabic(txt);
        if (norm.length > 2 && (norm.includes('خريطه') || norm.includes('ورق') || norm.includes('تحدي') || norm.includes('اختبار') || norm.includes('خط زمني') || norm.includes('رئيسي') || norm.includes('شرف') || norm.includes('اوسمه') || norm.includes('معلم') || norm.includes('كتاب'))) {
          const resId = 'naqla-res-' + (idCounter++);
          btn.setAttribute('data-naqla-res-id', resId);
          found.push({
            id: resId,
            title: txt,
            subject: 'أقسام وتحديات المنصة',
            type: 'تبويب / قسم تفاعلي',
            url: '',
            section: 'شريط التنقل',
            elementId: resId
          });
        }
      });

      this.resources = found;
    },

    search(query) {
      if (!query || this.resources.length === 0) return null;
      const nq = this.normalizeArabic(query);

      let bestMatch = null;
      let highestScore = 0;

      this.resources.forEach(res => {
        let score = 0;
        const nt = this.normalizeArabic(res.title);
        const ns = this.normalizeArabic(res.subject);

        if (ns && ns !== 'عام' && nq.includes(ns)) score += 55;
        if (nt && nq.includes(nt)) score += 45;

        if (nq.includes('رياضيات') && (nt.includes('رياضيات') || ns.includes('رياضيات'))) score += 65;
        if (nq.includes('جغرافيا') && (nt.includes('جغرافيا') || ns.includes('جغرافيا'))) score += 65;
        if (nq.includes('تاريخ') && (nt.includes('تاريخ') || ns.includes('تاريخ'))) score += 65;
        if (nq.includes('علوم') && (nt.includes('علوم') || ns.includes('علوم'))) score += 65;
        if (nq.includes('عربي') && (nt.includes('عربي') || ns.includes('عربي') || nt.includes('لغه عربيه'))) score += 65;
        if (nq.includes('اسلاميه') && (nt.includes('اسلاميه') || ns.includes('اسلاميه') || nt.includes('دين'))) score += 65;
        if (nq.includes('انجليزي') && (nt.includes('انجليزي') || ns.includes('انجليزي') || nt.includes('english'))) score += 65;
        if (nq.includes('حاسوب') && (nt.includes('حاسوب') || ns.includes('تكنولوجيا'))) score += 65;

        if ((nq.includes('كتاب') || nq.includes('pdf') || nq.includes('تنزيل') || nq.includes('تحميل')) && res.type.includes('كتاب')) score += 35;
        if ((nq.includes('منصه') || nq.includes('تفاعلي') || nq.includes('موقع') || nq.includes('تطبيق')) && res.type.includes('تفاعلية')) score += 35;
        if ((nq.includes('ورقه') || nq.includes('اوراق') || nq.includes('نشاط')) && res.type.includes('ورقة')) score += 40;
        if ((nq.includes('امتحان') || nq.includes('تحدي') || nq.includes('اختبار')) && res.type.includes('امتحان')) score += 40;
        if ((nq.includes('خريطه') || nq.includes('خرائط')) && (res.type.includes('خريطة') || nt.includes('خريطه'))) score += 45;

        if (score > highestScore && score >= 40) {
          highestScore = score;
          bestMatch = res;
        }
      });

      return bestMatch;
    },

    highlightAndScroll(resId) {
      if (!resId) return;
      const targetEl = document.querySelector(`[data-naqla-card-id="${resId}"]`) || document.querySelector(`[data-naqla-res-id="${resId}"]`);
      if (!targetEl) {
        alert('المورد متوفر بالرابط المباشر، ولكن لم يتم العثور على موضعه المرئي في الصفحة الحالية (قد يتطلب التبديل للقسم المعني).');
        return;
      }

      const modalEl = document.querySelector('.mentor-modal');
      if (modalEl) {
        modalEl.classList.add('mentor-temporarily-minimized');
      }

      let returnPill = document.getElementById('naqla-return-pill');
      if (!returnPill) {
        returnPill = document.createElement('div');
        returnPill.id = 'naqla-return-pill';
        returnPill.className = 'naqla-return-pill';
        document.body.appendChild(returnPill);
      }
      returnPill.innerHTML = `
        <span>👉 تم التأشير على المورد في الصفحة!</span>
        <button type="button" onclick="window.restoreMentorModalFromHighlight()">💬 العودة للمحادثة</button>
      `;
      returnPill.style.display = 'flex';

      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      targetEl.classList.add('naqla-target-highlighted');

      setTimeout(() => {
        targetEl.classList.remove('naqla-target-highlighted');
      }, 6000);
    }
  };

  window.restoreMentorModalFromHighlight = function() {
    const modalEl = document.querySelector('.mentor-modal');
    if (modalEl) modalEl.classList.remove('mentor-temporarily-minimized');
    const pill = document.getElementById('naqla-return-pill');
    if (pill) pill.style.display = 'none';
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', () => HostSiteIndexer.indexHostSite());
    window.HostSiteIndexer = HostSiteIndexer;
  }

  let isOpen = false;
  btn.onclick = () => {
    isOpen = !isOpen;
    modal.style.display = isOpen ? 'flex' : 'none';
    if (isOpen) {
      HostSiteIndexer.indexHostSite();
      document.getElementById('mentor-txt').focus();
    }
  };

  let isMaximized = false;
  const maxBtn = document.getElementById('mentor-max-btn');
  if (maxBtn) {
    maxBtn.onclick = () => {
      isMaximized = !isMaximized;
      if (isMaximized) {
        modal.classList.add('mentor-maximized');
        maxBtn.innerHTML = '🗗';
        maxBtn.title = 'استعادة الحجم الأصلي';
      } else {
        modal.classList.remove('mentor-maximized');
        maxBtn.innerHTML = '⛶';
        maxBtn.title = 'تكبير الإطار';
      }
    };
  }

  document.getElementById('mentor-close-btn').onclick = () => {
    isOpen = false;
    modal.style.display = 'none';
  };

  const history = [];

  async function sendMessage(text) {
    const msgBox = document.getElementById('mentor-msg-box');
    const input = document.getElementById('mentor-txt');
    const sendBtn = document.getElementById('mentor-btn');

    if (!text) return;
    input.value = '';

    // 🧭 فحص وفهرسة الموقع المضيف واستخراج المورد المطابق لنية الطالب فورياً
    lastUserQuery = text;
    HostSiteIndexer.indexHostSite();
    const matchedResource = HostSiteIndexer.search(text);

    // تجهيز ملخص الفهرس لحقنه في سياق النموذج (Host Context Grounding)
    const hostContextPayload = {
      title: document.title || '',
      url: window.location.href,
      resources_count: HostSiteIndexer.resources.length,
      resources: HostSiteIndexer.resources.slice(0, 25).map(r => ({
        title: r.title,
        subject: r.subject,
        type: r.type,
        url: r.url,
        section: r.section
      }))
    };

    // User message
    const uEl = document.createElement('div');
    uEl.className = 'mentor-msg-user';
    uEl.textContent = text;
    msgBox.appendChild(uEl);
    msgBox.scrollTop = msgBox.scrollHeight;

    // Loading
    const loadEl = document.createElement('div');
    loadEl.className = 'mentor-msg-bot';
    loadEl.style.opacity = '0.7';
    loadEl.innerHTML = '✍️ جاري الكتابة...';
    msgBox.appendChild(loadEl);
    msgBox.scrollTop = msgBox.scrollHeight;
    sendBtn.disabled = true;

    try {
      const endpoint = await resolveMentorEndpoint();
      let res = null;

      // 1. 💻 Sovereign Primary Engine: Local AI Arsenal (الترسانة المحلية أولاً)
      const isLocalOrTunnel = endpoint && (
        endpoint.includes('trycloudflare.com') ||
        endpoint.includes('127.0.0.1') ||
        endpoint.includes('localhost') ||
        !endpoint.includes('local-ai-arsenal.pages.dev')
      );

      if (isLocalOrTunnel) {
        try {
          const localController = new AbortController();
          const localTimeoutId = setTimeout(() => localController.abort(), 12000);
          res = await fetch(endpoint, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'ngrok-skip-browser-warning': '69420'
            },
            body: JSON.stringify(payload),
            signal: localController.signal
          });
          clearTimeout(localTimeoutId);
          if (!res || !res.ok) throw new Error('Local server status ' + (res ? res.status : 'null'));
        } catch (localErr) {
          console.warn('[Widget Router] Local AI Arsenal unreachable, falling back to Cloud Edge:', localErr.message);
          res = null;
        }
      }

      // 2. 🌐 Secondary Backup Engine: Cloud Edge AI (احتياطي فقط عند غياب السيرفر المحلي)
      if (!res || !res.ok) {
        try {
          const cloudController = new AbortController();
          const cloudTimeoutId = setTimeout(() => cloudController.abort(), 7000);
          res = await fetch(CLOUD_FALLBACK_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: cloudController.signal
          });
          clearTimeout(cloudTimeoutId);
          if (!res.ok) throw new Error('Cloud HTTP ' + res.status);
        } catch (cloudErr) {
          console.warn('[Widget Router] Cloud Edge failed too:', cloudErr.message);
        }
      }

      if (!res || !res.ok) throw new Error('فشل الاتصال بالمعلم المحلي والسحابي');
      const data = await res.json();
      loadEl.remove();

      history.push({ role: 'user', content: text });
      history.push({ role: 'assistant', content: data.reply || '' });

      renderWidgetBotMessage(data, matchedResource);

      if (isWidgetCallActive && data.reply) {
        setCallSubtitle(`👨‍🏫 المعلم: ${data.reply}`);
        speakCallAudio(data.reply);
      }
    } catch (e) {
      loadEl.remove();
      const errEl = document.createElement('div');
      errEl.className = 'mentor-msg-bot';
      errEl.style.borderColor = '#ef4444';
      if (matchedResource) {
        errEl.innerHTML = `
          عذراً يا بطل، حدث عارض مؤقت في الاتصال السحابي، ولكن تم العثور على مكان المورد المطلوب مباشرة في الموقع:
          <div class="mentor-resource-card">
            <div class="m-res-hdr">
              <span>📍 تم العثور على مكان المورد في هذا الموقع:</span>
              <span class="m-res-type-badge">${matchedResource.type || 'مورد تعليمي'}</span>
            </div>
            <div class="m-res-title">📘 ${matchedResource.title}</div>
            ${matchedResource.section ? `<div class="m-res-section">🏷️ القسم / المرحلة: ${matchedResource.section}</div>` : ''}
            <div class="m-res-actions">
              ${matchedResource.url ? `<a href="${matchedResource.url}" target="_blank" rel="noopener noreferrer" class="m-res-link-btn">📥 فتح / تحميل المورد مباشرة ↗</a>` : ''}
              ${matchedResource.elementId ? `<button type="button" class="m-res-locate-btn" onclick="HostSiteIndexer.highlightAndScroll('${matchedResource.elementId}')">🎯 أشر لي عليه في الصفحة</button>` : ''}
            </div>
          </div>
        `;
      } else {
        errEl.textContent = 'حدث عارض مؤقت في الاتصال. يرجى إعادة المحاولة وسأجيبك فوراً!';
      }
      msgBox.appendChild(errEl);
    } finally {
      sendBtn.disabled = false;
      msgBox.scrollTop = msgBox.scrollHeight;
    }
  }

  function renderWidgetBotMessage(data, clientMatchedResource) {
    const msgBox = document.getElementById('mentor-msg-box');
    if (data.student_stats) {
      document.getElementById('m-xp').textContent = `${data.student_stats.xp} XP`;
      document.getElementById('m-level').textContent = data.student_stats.level_title || 'مبتدئ شغوف';
      document.getElementById('m-streak').textContent = data.student_stats.streak || 0;
    }

    const bEl = document.createElement('div');
    bEl.className = 'mentor-msg-bot';

    let toolBadge = '';
    if (data.tools_used && data.tools_used.length > 0) {
      const toolsText = data.tools_used.map(t => {
        if (t.tool === 'search_curriculum') return '🔍 بحث في المنهج';
        if (t.tool === 'calculate_math') return '🧮 تدقيق حسابي';
        if (t.tool === 'award_student_xp') return '🌟 نقاط تميز';
        if (t.tool === 'generate_quiz_challenge') return '🎯 سؤال تحدي';
        return t.tool;
      }).join(' • ');
      toolBadge = `<div class="mentor-tool-badge">🛠️ ${toolsText}</div><br>`;
    }

    let diagHtml = '';
    if (data.diagram && data.diagram.svg) {
      diagHtml = `<div style="margin-top:10px; padding:8px; background:rgba(15,23,42,0.9); border:1px solid #4f46e5; border-radius:12px; text-align:center;">
        <div style="font-size:11px; color:#a5b4fc; font-weight:bold; margin-bottom:6px;">🎨 ${data.diagram.title || 'رسم توضيحي علمي'}</div>
        ${data.diagram.svg}
      </div>`;
    }

    let vidHtml = '';
    const v = data.media;
    if (v && v.embed_url) {
      const watchUrl = v.watch_url || v.embed_url.replace('/embed/', '/watch?v=');
      vidHtml = `
        <div style="margin-top:12px; padding:10px; background:rgba(15,23,42,0.95); border:1.5px solid #ef4444; border-radius:14px; box-shadow:0 4px 15px rgba(239,68,68,0.25);">
          <div style="font-size:12px; color:#f87171; font-weight:bold; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
            <span>🎥 ${v.title || 'شرح الدرس المرئي (YouTube)'}</span>
            <span style="font-size:10px; background:#ef4444; color:#fff; padding:1px 6px; border-radius:6px;">يوتيوب</span>
          </div>
          <div style="position:relative; width:100%; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:10px; background:#000;">
            <iframe src="${v.embed_url}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
          <div style="margin-top:8px; text-align:center;">
            <a href="${watchUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:6px; background:#dc2626; color:#fff; padding:6px 14px; border-radius:8px; font-size:11px; font-weight:bold; text-decoration:none; box-shadow:0 2px 8px rgba(220,38,38,0.4);">
              <span>▶️</span> فتح ومشاهدة الفيديو في YouTube مباشرة ↗
            </a>
          </div>
        </div>
      `;
    } else if (v && (v.search_url || v.watch_url)) {
      const clickUrl = v.search_url || v.watch_url;
      vidHtml = `
        <div style="margin-top:12px; padding:12px; background:rgba(15,23,42,0.95); border:1.5px solid #ef4444; border-radius:14px; text-align:center; box-shadow:0 4px 15px rgba(239,68,68,0.25);">
          <div style="font-size:12px; color:#f87171; font-weight:bold; margin-bottom:6px;">🎥 ${v.title || 'شروحات وتجارب الدرس على YouTube'}</div>
          <p style="font-size:11px; color:#cbd5e1; margin-bottom:8px;">اضغط على الزر أدناه لمشاهدة شروحات وتجارب الدرس المعتمدة:</p>
          <a href="${clickUrl}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:6px; background:#dc2626; color:#fff; padding:8px 16px; border-radius:10px; font-size:12px; font-weight:bold; text-decoration:none; box-shadow:0 2px 10px rgba(220,38,38,0.5);">
            <span>▶️</span> مشاهدة شروحات الدرس على YouTube مباشرة ↗
          </a>
        </div>
      `;
    }

    // فحص ذكي في نص الرسالة إذا تضمن رابط يوتيوب حقيقي ولم يكن هناك كائن فيديو
    if (!vidHtml && data.reply) {
      const ytMatch = data.reply.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (ytMatch && !ytMatch[1].startsWith('example')) {
        const vidId = ytMatch[1];
        vidHtml = `
          <div style="margin-top:12px; padding:10px; background:rgba(15,23,42,0.95); border:1.5px solid #ef4444; border-radius:14px;">
            <div style="font-size:12px; color:#f87171; font-weight:bold; margin-bottom:8px;">🎥 درس يوتيوب مقترح</div>
            <div style="position:relative; width:100%; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:10px; background:#000;">
              <iframe src="https://www.youtube-nocookie.com/embed/${vidId}" style="position:absolute; top:0; left:0; width:100%; height:100%; border:none;" allowfullscreen></iframe>
            </div>
            <div style="margin-top:8px; text-align:center;">
              <a href="https://www.youtube.com/watch?v=${vidId}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:6px; background:#dc2626; color:#fff; padding:6px 14px; border-radius:8px; font-size:11px; font-weight:bold; text-decoration:none;">
                <span>▶️</span> فتح ومشاهدة الفيديو في YouTube مباشرة ↗
              </a>
            </div>
          </div>
        `;
      }
    }

    const formatted = (data.reply || '')
      .replace(/\[([^\]]+)\]\(https?:\/\/(?:www\.)?youtube\.com\/watch\?v=example[^\)]*\)/g, '🎬 <strong>$1</strong> (متاح في مشغل الفيديو المرفق أدناه)')
      .replace(/https?:\/\/(?:www\.)?youtube\.com\/watch\?v=example[^\s<]+/g, '')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\[(.*?)\]\((https?:\/\/[^\s\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:4px; color:#93c5fd; background:rgba(59,130,246,0.15); padding:2px 8px; border-radius:6px; text-decoration:underline; font-weight:bold; margin:2px 0;">🔗 $1 ↗</a>');

    const voiceBar = `
      <div style="margin-top:10px; padding-top:6px; border-top:1px solid rgba(255,255,255,0.08); display:flex; justify-content:space-between; align-items:center;">
        <button class="m-spk-btn" style="background:#1e293b; border:1px solid #6366f1; color:#c7d2fe; border-radius:8px; padding:4px 8px; font-size:11px; cursor:pointer;">🔊 استمع للشرح</button>
        <button class="m-stp-btn" style="display:none; background:#e11d48; border:none; color:#fff; border-radius:8px; padding:4px 8px; font-size:11px; cursor:pointer;">⏹️ إيقاف الصوت</button>
      </div>
    `;

    
    let imgHtml = '';
    const img = data.image;
    if (img && img.url) {
      try {
        saveEducationalImageToLocalBank(img, (data.user_text || ''));
      } catch (e) {}

      let badgeText = img.cached 
        ? '💾 رسمة محفوظة من بنك المعرفة' 
        : '🎨 رسمة تعليمية ذكية';
      let badgeClass = img.cached ? 'badge-cached' : 'badge-new';

      if (img.source === 'official_curriculum') {
        badgeText = img.badge || '🏛️ رسمة معتمدة من كتاب الوزارة (بخت الرضا)';
        badgeClass = 'badge-official';
      }
      const safeTitle = (img.title || 'رسم توضيحي علمي').replace(/"/g, '&quot;');
      const safeUrl = img.url.replace(/"/g, '&quot;');

      imgHtml = `
        <div class="mentor-image-card">
          <div class="mentor-image-header">
            <div class="mentor-image-title">🖼️ ${safeTitle}</div>
            <span class="mentor-image-badge ${badgeClass}">${badgeText}</span>
          </div>
          <div class="mentor-image-wrapper" onclick="openMentorImageLightbox('${safeUrl}', '${safeTitle}')" title="انقر لتكبير الرسمة بملء الشاشة">
            <div class="mentor-image-skeleton">
              <span style="font-size:22px;">🎨</span>
              <span>جاري تحميل الرسمة التوضيحية بدقة عالية...</span>
            </div>
            <img class="mentor-image-preview" src="${safeUrl}" alt="${safeTitle}" loading="lazy" onload="this.previousElementSibling.style.display='none'; this.style.display='block';" onerror="this.onerror=null; this.previousElementSibling.innerHTML='⚠️ تعذر تحميل المعاينة المباشرة.<br><a href=\'${safeUrl}\' target=\'_blank\' style=\'color:#38bdf8; text-decoration:underline; font-weight:bold; margin-top:4px;\'>اضغط هنا لفتح الرسمة مباشرة ↗</a>';">
          </div>
          ${img.book_title ? `<div style="font-size:10px; color:#fde047; font-weight:bold; margin-top:6px; display:flex; align-items:center; gap:4px;"><span>📚</span><span>المصدر: ${img.book_title} ${img.page_num ? '• صفحة ' + img.page_num : ''}</span></div>` : ''}
          ${img.description ? `<div class="mentor-image-desc">${img.description}</div>` : ''}
          <div class="mentor-image-actions">
            <button type="button" class="mentor-img-action-btn btn-zoom" onclick="openMentorImageLightbox('${safeUrl}', '${safeTitle}')">🔍 تكبير الرسمة</button>
            <a href="${safeUrl}" target="_blank" download="educational-diagram.jpg" class="mentor-img-action-btn btn-download">📥 تحميل الرسمة</a>
            <button type="button" class="mentor-img-action-btn btn-copy" onclick="copyMentorImageUrl('${safeUrl}', this)">📋 نسخ الرابط</button>
          </div>
        </div>
      `;
    }

    let resourceCardHtml = '';
    const res = clientMatchedResource || (data.matched_resource || (lastUserQuery ? HostSiteIndexer.search(lastUserQuery) : null));
    if (res) {
      resourceCardHtml = `
        <div class="mentor-resource-card">
          <div class="m-res-hdr">
            <span>📍 تم العثور على مكان المورد في هذا الموقع:</span>
            <span class="m-res-type-badge">${res.type || 'مورد تعليمي'}</span>
          </div>
          <div class="m-res-title">📘 ${res.title}</div>
          ${res.section ? `<div class="m-res-section">🏷️ القسم / المرحلة: ${res.section}</div>` : ''}
          <div class="m-res-actions">
            ${res.url ? `<a href="${res.url}" target="_blank" rel="noopener noreferrer" class="m-res-link-btn">📥 فتح / تحميل المورد مباشرة ↗</a>` : ''}
            ${res.elementId ? `<button type="button" class="m-res-locate-btn" onclick="HostSiteIndexer.highlightAndScroll('${res.elementId}')">🎯 أشر لي عليه في الصفحة</button>` : ''}
          </div>
        </div>
      `;
    }

    bEl.innerHTML = toolBadge + formatted + diagHtml + imgHtml + vidHtml + resourceCardHtml + voiceBar;
    const spk = bEl.querySelector('.m-spk-btn');
    const stp = bEl.querySelector('.m-stp-btn');
    if (spk && stp) {
      spk.onclick = () => widgetSpeak(data.reply || '', spk, stp);
      stp.onclick = () => widgetStopSpeak(spk, stp);
    }
    msgBox.appendChild(bEl);
    msgBox.scrollTop = msgBox.scrollHeight;
  }

  function safeCleanWidgetTtsText(rawText) {
  if (!rawText) return '';
  let s = typeof rawText === 'string' ? rawText : String(rawText);
  if (typeof s.toWellFormed === 'function') {
    s = s.toWellFormed();
  }
  s = s.replace(/<[^>]*>/g, '');
  s = s.replace(/[*#_`~]/g, '');
  try {
    s = s.replace(/\p{Extended_Pictographic}/gu, '');
  } catch (e) {
    s = s.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '');
  }
  s = s.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '');
  return s.trim();
}

function safeEncodeWidgetUri(str) {
  try {
    return encodeURIComponent(str || '');
  } catch (e) {
    const repaired = (str || '').replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '');
    return encodeURIComponent(repaired);
  }
}

  async function resolveTtsUrl(cleanText, speaker) {
    const encText = safeEncodeWidgetUri(cleanText);
    const encSpeaker = safeEncodeWidgetUri(speaker);
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://127.0.0.1:8000/api/tts?text=' + encText + '&speaker=' + encSpeaker;
    }
    return 'https://local-ai-arsenal.pages.dev/api/tts?text=' + encText + '&speaker=' + encSpeaker;
  }

  let widgetAudioPlayer = null;

  function widgetStopSpeak(spk, stp) {
    if (widgetAudioPlayer) {
      try {
        widgetAudioPlayer.pause();
        widgetAudioPlayer.currentTime = 0;
      } catch(e) {}
      widgetAudioPlayer = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (spk) spk.style.display = 'inline-block';
    if (stp) stp.style.display = 'none';
  }

  async function widgetSpeak(text, spk, stp) {
    widgetStopSpeak(spk, stp);
    const clean = safeCleanWidgetTtsText(text);
    if (!clean) return;

    if (spk) spk.style.display = 'none';
    if (stp) {
      stp.style.display = 'inline-block';
      stp.textContent = '⏳ تحضير الصوت...';
    }

    try {
      const primaryUrl = await resolveTtsUrl(clean, widgetSpeaker);
      let res = null;
      try {
        res = await fetch(primaryUrl);
        if (!res.ok) throw new Error('Status ' + res.status);
      } catch(primaryErr) {
        const fallbackUrl = 'https://local-ai-arsenal.pages.dev/api/tts?text=' + safeEncodeWidgetUri(clean) + '&speaker=' + safeEncodeWidgetUri(widgetSpeaker);
        res = await fetch(fallbackUrl);
        if (!res || !res.ok) throw primaryErr;
      }

      const ctype = res.headers.get('content-type') || '';
      if (!ctype.includes('audio') && !ctype.includes('mpeg') && !ctype.includes('octet-stream')) {
        throw new Error('Expected audio but got ' + ctype);
      }

      if (!res || !res.ok) throw new Error('TTS response not ok: ' + (res ? res.status : 'null'));
      const blob = await res.blob();
      if (blob.size < 500) throw new Error('Audio blob too small (' + blob.size + ' bytes)');
      const blobUrl = URL.createObjectURL(blob);
      const audio = new Audio(blobUrl);
      audio.volume = 1.0;
      audio.muted = false;
      widgetAudioPlayer = audio;

      audio.onplay = () => {
        if (stp) stp.textContent = widgetSpeaker === 'israa' ? '⏹️ إيقاف المعلمة إسراء' : '⏹️ إيقاف المعلم عثمان';
      };

      audio.onended = () => {
        URL.revokeObjectURL(blobUrl);
        widgetStopSpeak(spk, stp);
        if (isWidgetCallActive) setTimeout(startWidgetListening, 500);
      };

      audio.onerror = () => {
        URL.revokeObjectURL(blobUrl);
        fallbackWidgetBrowserSpeak(clean, spk, stp);
      };

      await audio.play();
    } catch(e) {
      fallbackWidgetBrowserSpeak(clean, spk, stp);
    }
  }

  function fallbackWidgetBrowserSpeak(clean, spk, stp) {
    if (!('speechSynthesis' in window)) {
      widgetStopSpeak(spk, stp);
      return;
    }
    try {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
    } catch(e) {}
    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.lang = 'ar-SA';
    utterance.volume = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const arVoices = voices.filter(v => v.lang.startsWith('ar') || v.lang.includes('Arabic'));
    if (widgetSpeaker === 'israa') {
      utterance.pitch = 1.15;
      utterance.rate = 1.0;
      if (arVoices.length > 0) {
        const f = arVoices.find(v => v.name.toLowerCase().includes('female') || v.name.includes('Hoda') || v.name.includes('Salma') || v.name.includes('Zariyah') || v.name.includes('Laila') || v.name.includes('Muna'));
        utterance.voice = f || arVoices[0];
      }
    } else {
      // Osman: Strict Male Baritone Voice Guarantee
      const m = arVoices.find(v => v.name.toLowerCase().includes('male') || v.name.includes('Hamed') || v.name.includes('Shakir') || v.name.includes('Tarik') || v.name.includes('Naayf') || v.name.includes('Hamid') || v.name.includes('Omar') || v.name.includes('Bassam'));
      if (m) {
        utterance.voice = m;
        utterance.pitch = 0.95;
        utterance.rate = 1.0;
      } else if (arVoices.length > 0) {
        utterance.voice = arVoices[0];
        utterance.pitch = 0.58; // Formant pitch-shift transforms female voice into deep dignified male voice!
        utterance.rate = 0.92;
      } else {
        utterance.pitch = 0.58;
        utterance.rate = 0.92;
      }
    }

    utterance.onstart = () => {
      if (spk) spk.style.display = 'none';
      if (stp) {
        stp.style.display = 'inline-block';
        stp.textContent = '⏹️ إيقاف الصوت';
      }
    };
    utterance.onend = () => {
      widgetStopSpeak(spk, stp);
      if (isWidgetCallActive) setTimeout(startWidgetListening, 500);
    };
    utterance.onerror = () => {
      widgetStopSpeak(spk, stp);
      if (isWidgetCallActive) setTimeout(startWidgetListening, 1000);
    };
    window.speechSynthesis.speak(utterance);
  }

  // 📞 Live Continuous Voice-to-Voice Calling Engine (صوت إلى صوت مستمر - Enhanced Architecture)
  let isWidgetCallActive = false;
  let isBotSpeaking = false;
  let isAudioActuallyPlaying = false;
  let callStartTime = 0;
  let callAudioElement = null;
  let isProcessingCall = false;
  let callKeepAliveTimer = null;
  let audioContextUnlocked = false;
  let callTimerInterval = null;
  let callDurationSeconds = 0;
  let isCallMuted = false;

  // 🎯 Web Audio API Near-Field Voice Isolation & Intelligent VAD Engine
  let nearVoiceMode = localStorage.getItem('mentor_near_voice_mode') || 'smart'; // 'smart', 'aggressive', 'normal'
  let ambientNoiseFloor = 14; // Adaptive baseline of room background noise
  let isNearVoiceActive = false;
  let lastNearVoiceTime = Date.now();
  let nearVoiceSustainCount = 0;
  let callSpeechBuffer = '';
  let speechDebounceTimer = null;
  let micAudioContext = null;
  let micAnalyser = null;
  let micStream = null;
  let micCheckInterval = null;
  let isUserTalkingInCall = false;
  let micHighPass = null;
  let micLowPass = null;
  let micPeaking = null;

  function updateNearVoiceUI() {
    const btn = document.getElementById('m-call-nearvoice-btn');
    if (!btn) return;
    if (nearVoiceMode === 'aggressive') {
      btn.innerHTML = '🛡️ عزل فائق';
      btn.style.background = 'rgba(239,68,68,0.2)';
      btn.style.borderColor = 'rgba(239,68,68,0.5)';
      btn.style.color = '#fca5a5';
      btn.title = 'عزل فائق: للمحيط الصاخب جداً (مروحة، تلفاز، حركة)';
    } else if (nearVoiceMode === 'normal') {
      btn.innerHTML = '🎙️ حساسية عادية';
      btn.style.background = 'rgba(148,163,184,0.18)';
      btn.style.borderColor = 'rgba(148,163,184,0.35)';
      btn.style.color = '#cbd5e1';
      btn.title = 'حساسية عادية: للغرف الهادئة';
    } else {
      btn.innerHTML = '🎯 عزل ذكي';
      btn.style.background = 'rgba(16,185,129,0.2)';
      btn.style.borderColor = 'rgba(16,185,129,0.45)';
      btn.style.color = '#6ee7b7';
      btn.title = 'عزل ذكي: يتكيف تلقائياً مع مستوى ضوضاء محيط الطالب (موصى به)';
    }
  }

  function cycleNearVoiceMode() {
    if (nearVoiceMode === 'smart') {
      nearVoiceMode = 'aggressive';
    } else if (nearVoiceMode === 'aggressive') {
      nearVoiceMode = 'normal';
    } else {
      nearVoiceMode = 'smart';
    }
    localStorage.setItem('mentor_near_voice_mode', nearVoiceMode);
    updateNearVoiceUI();
    const modeTitles = {
      smart: '🎯 تم تفعيل (العزل الذكي): عزل ضوضاء الغرفة والتركيز التام على صوت الطالب القريب',
      aggressive: '🛡️ تم تفعيل (العزل الفائق): حماية قصوى ضد ضوضاء المراوح والأصوات المحيطية الصاخبة',
      normal: '🎙️ تم تفعيل (الحساسية العادية): مناسبة للغرف الهادئة والتحدث الهامس'
    };
    setCallSubtitle(modeTitles[nearVoiceMode]);
  }

  function unlockAudioContext() {
    if (audioContextUnlocked) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        ctx.resume();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        gain.gain.value = 0.0001; // Silent 50ms pulse to unlock WebKit audio
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(0);
        osc.stop(0.05);
        setTimeout(() => { try { ctx.close(); } catch(e){} }, 200);
      }
      audioContextUnlocked = true;
    } catch(e) {}
  }

  function formatCallTimer(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function startCallTimer() {
    callDurationSeconds = 0;
    const timerEl = document.getElementById('m-call-timer');
    if (timerEl) timerEl.textContent = '00:00';
    if (callTimerInterval) clearInterval(callTimerInterval);
    callTimerInterval = setInterval(() => {
      callDurationSeconds++;
      if (timerEl) timerEl.textContent = formatCallTimer(callDurationSeconds);
    }, 750);
  }

  function stopCallTimer() {
    if (callTimerInterval) {
      clearInterval(callTimerInterval);
      callTimerInterval = null;
    }
  }

  // ⚡ VAD Microphone Monitor with Near-Field DSP Filter Graph & Noise Floor Tracking
  async function startCallMicMonitor() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1
        }
      });
      micStream = stream;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      micAudioContext = new AudioCtx();
      if (micAudioContext.state === 'suspended') {
        try { await micAudioContext.resume(); } catch(e){}
      }

      const source = micAudioContext.createMediaStreamSource(stream);

      // Filter 1: Highpass 160Hz (Cut low frequency fans, desk thumps, AC rumble)
      micHighPass = micAudioContext.createBiquadFilter();
      micHighPass.type = 'highpass';
      micHighPass.frequency.value = 160;

      // Filter 2: Lowpass 3600Hz (Cut ambient hiss, room squeaks, high frequency background)
      micLowPass = micAudioContext.createBiquadFilter();
      micLowPass.type = 'lowpass';
      micLowPass.frequency.value = 3600;

      // Filter 3: Peaking 1800Hz (+3.5dB boost at primary human voice intelligibility band)
      micPeaking = micAudioContext.createBiquadFilter();
      micPeaking.type = 'peaking';
      micPeaking.frequency.value = 1800;
      micPeaking.Q.value = 1.2;
      micPeaking.gain.value = 3.5;

      const analyser = micAudioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.45;

      // Connect DSP chain: source -> HighPass -> LowPass -> Peaking -> Analyser
      source.connect(micHighPass);
      micHighPass.connect(micLowPass);
      micLowPass.connect(micPeaking);
      micPeaking.connect(analyser);
      micAnalyser = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      if (micCheckInterval) clearInterval(micCheckInterval);
      micCheckInterval = setInterval(() => {
        if (!isWidgetCallActive || !micAnalyser || isCallMuted) return;

        micAnalyser.getByteFrequencyData(dataArray);

        // Focus energy analysis strictly on human vocal formants (~200Hz - 3400Hz, bins 1 to 19)
        let voiceSum = 0;
        let voiceBins = 0;
        const maxBin = Math.min(19, dataArray.length);
        for (let i = 1; i < maxBin; i++) {
          voiceSum += dataArray[i];
          voiceBins++;
        }
        const voiceAvg = voiceSum / Math.max(1, voiceBins);
        const normalized = Math.min(100, Math.round((voiceAvg / 128) * 100));

        // Adaptive Noise Floor Calibration: tracks ambient floor when user is not actively speaking
        if (!isNearVoiceActive && !isBotSpeaking) {
          ambientNoiseFloor = (ambientNoiseFloor * 0.96) + (normalized * 0.04);
          ambientNoiseFloor = Math.max(6, Math.min(42, ambientNoiseFloor));
        }

        // Determine near-voice threshold based on mode and adaptive background noise
        let requiredMargin = 12;
        let minFloorGate = 22;
        let botBargeInGate = 28;

        if (nearVoiceMode === 'aggressive') {
          requiredMargin = 18;
          minFloorGate = 30;
          botBargeInGate = 35;
        } else if (nearVoiceMode === 'normal') {
          requiredMargin = 8;
          minFloorGate = 16;
          botBargeInGate = 24;
        }

        const snr = normalized - ambientNoiseFloor;
        const isNearVoiceFrame = (normalized >= minFloorGate) && (snr >= requiredMargin);

        if (isNearVoiceFrame) {
          nearVoiceSustainCount++;
          if (nearVoiceSustainCount >= 3) { // Require sustained speech (>150ms) to ignore transient clicks
            isNearVoiceActive = true;
            lastNearVoiceTime = Date.now();
            isUserTalkingInCall = true;

            // Controlled barge-in: ONLY if audio is ACTUALLY playing sound AND energy is loud & sustained (>250ms)
            if (isAudioActuallyPlaying && Date.now() - callStartTime >= 3500) {
              if (normalized >= Math.max(ambientNoiseFloor + 26, botBargeInGate + 4) && nearVoiceSustainCount >= 3) {
                triggerCallBargeIn();
              }
            }
          }
        } else {
          nearVoiceSustainCount = Math.max(0, nearVoiceSustainCount - 1);
          // 400ms hangover to prevent gate chatter between speech syllables
          if (Date.now() - lastNearVoiceTime > 400) {
            isNearVoiceActive = false;
            isUserTalkingInCall = false;
          }
        }

        updateLiveVuBars(normalized, dataArray, isNearVoiceActive);
      }, 50);
    } catch(err) {
      console.warn('[Naqla Mentor] Mic monitor init error:', err);
    }
  }

  function stopCallMicMonitor() {
    if (micCheckInterval) { clearInterval(micCheckInterval); micCheckInterval = null; }
    if (speechDebounceTimer) { clearTimeout(speechDebounceTimer); speechDebounceTimer = null; }
    callSpeechBuffer = '';
    if (micStream) {
      try { micStream.getTracks().forEach(t => t.stop()); } catch(e){}
      micStream = null;
    }
    if (micAudioContext) {
      try { micAudioContext.close(); } catch(e){}
      micAudioContext = null;
    }
    micAnalyser = null;
    micHighPass = null;
    micLowPass = null;
    micPeaking = null;
    resetLiveVuBars();
  }

  function updateLiveVuBars(volume, dataArray, isNearVoice) {
    const waveBox = document.getElementById('m-call-waves');
    if (!waveBox) return;
    const bars = waveBox.querySelectorAll('.m-call-wave-bar');
    if (!bars || bars.length === 0) return;

    if (isBotSpeaking) {
      bars.forEach(bar => {
        const randH = Math.max(4, Math.floor(Math.random() * 24) + 4);
        bar.style.height = `${randH}px`;
        bar.style.background = '#38bdf8';
      });
    } else if (isNearVoice && volume > 10) {
      // Confirmed near-field student voice: vibrant golden amber waves!
      bars.forEach((bar, i) => {
        const binIndex = Math.floor((i / bars.length) * (dataArray ? dataArray.length : 1));
        const val = dataArray ? (dataArray[binIndex] || 0) : 0;
        const h = Math.max(6, Math.round((val / 255) * 26));
        bar.style.height = `${h}px`;
        bar.style.background = '#fbbf24';
      });
    } else if (volume > (ambientNoiseFloor + 3)) {
      // Ambient noise detected but rejected (filtered out): calm muted slate bars
      bars.forEach(bar => {
        bar.style.height = '6px';
        bar.style.background = '#475569';
      });
    } else if (isProcessingCall) {
      bars.forEach((bar, i) => {
        const h = Math.max(4, Math.floor(Math.sin(Date.now() / 250 + i) * 8) + 12);
        bar.style.height = `${h}px`;
        bar.style.background = '#a855f7';
      });
    } else {
      bars.forEach(bar => {
        bar.style.height = '4px';
        bar.style.background = '#334155';
      });
    }
  }

  function resetLiveVuBars() {
    const waveBox = document.getElementById('m-call-waves');
    if (!waveBox) return;
    const bars = waveBox.querySelectorAll('.m-call-wave-bar');
    bars.forEach(b => { b.style.height = '4px'; b.style.background = '#334155'; });
  }

  let callSpeakingWatchdog = null;

  function finishBotSpeech() {
    if (callSpeakingWatchdog) {
      clearTimeout(callSpeakingWatchdog);
      callSpeakingWatchdog = null;
    }
    isBotSpeaking = false;
    isAudioActuallyPlaying = false;
    if (isWidgetCallActive && !isCallMuted) {
      setCallStatus('listening', isEnglishStage(activeStage) ? 'Naqla Bot is listening... Speak anytime! 🎙️' : 'المعلم يستمع لصوتك الآن... تفضل بسؤالك 👂✨');
      setTimeout(startContinuousListening, 300);
    }
  }

  // ⚡ Instant Barge-in Interruption (مقاطعة فورية مع حماية ضد الضوضاء)
  function triggerCallBargeIn(force = false) {
    // Safety Guard 1: Never interrupt during the first 3.5 seconds of call start (let greeting be heard!)
    if (!force && Date.now() - callStartTime < 3500) {
      return;
    }
    // Safety Guard 2: Never interrupt while audio is still downloading / preparing (sound not yet emitting)
    if (!force && !isAudioActuallyPlaying) {
      return;
    }

    if (isBotSpeaking || force) {
      if (callSpeakingWatchdog) {
        clearTimeout(callSpeakingWatchdog);
        callSpeakingWatchdog = null;
      }
      isAudioActuallyPlaying = false;
      widgetStopSpeak();
      if (callAudioElement) {
        try { callAudioElement.pause(); callAudioElement.currentTime = 0; } catch(e){}
      }
      if (widgetAudioPlayer) {
        try { widgetAudioPlayer.pause(); widgetAudioPlayer.currentTime = 0; } catch(e){}
        widgetAudioPlayer = null;
      }
      if ('speechSynthesis' in window) {
        try { window.speechSynthesis.cancel(); } catch(e){}
      }
      window.__naqlaActiveUtterance = null;
      isBotSpeaking = false;
      isProcessingCall = false;
      setCallStatus('listening', 'سمعتك يا بطل! المعلم يستمع لصوتك الآن... 👂✨');
      setCallSubtitle('تفضل بسؤالك، أنا استمع إليك باهتمام... 👂✨');
      startContinuousListening();
    }
  }

  function setCallStatus(state, statusText) {
    const pulse = document.getElementById('m-call-pulse');
    const avatar = document.getElementById('m-call-avatar');
    const txt = document.getElementById('m-call-status-text');
    const badge = document.getElementById('m-call-status-badge');
    const dot = document.getElementById('m-call-status-dot');
    const subtitleBox = document.getElementById('m-call-subtitle-box');

    if (txt) txt.textContent = statusText;

    if (pulse) {
      pulse.className = 'm-call-pulse-ring' + (state === 'speaking' ? ' m-speaking' : (state === 'listening' ? ' m-listening' : (state === 'thinking' ? ' m-thinking' : '')));
    }
    if (avatar) {
      avatar.className = 'm-call-avatar' + (state === 'speaking' ? ' m-speaking' : (state === 'listening' ? ' m-listening' : ''));
    }

    if (badge) {
      if (state === 'speaking') {
        badge.style.background = 'rgba(56,189,248,0.2)';
        badge.style.borderColor = 'rgba(56,189,248,0.5)';
        badge.style.color = '#7dd3fc';
        if (dot) dot.style.background = '#38bdf8';
        if (subtitleBox) subtitleBox.style.borderColor = 'rgba(56,189,248,0.4)';
      } else if (state === 'listening') {
        badge.style.background = 'rgba(16,185,129,0.2)';
        badge.style.borderColor = 'rgba(16,185,129,0.5)';
        badge.style.color = '#6ee7b7';
        if (dot) dot.style.background = '#10b981';
        if (subtitleBox) subtitleBox.style.borderColor = 'rgba(16,185,129,0.4)';
      } else if (state === 'thinking') {
        badge.style.background = 'rgba(168,85,247,0.2)';
        badge.style.borderColor = 'rgba(168,85,247,0.5)';
        badge.style.color = '#d8b4fe';
        if (dot) dot.style.background = '#a855f7';
        if (subtitleBox) subtitleBox.style.borderColor = 'rgba(168,85,247,0.4)';
      } else {
        badge.style.background = 'rgba(100,116,139,0.2)';
        badge.style.borderColor = 'rgba(100,116,139,0.4)';
        badge.style.color = '#cbd5e1';
        if (dot) dot.style.background = '#94a3b8';
      }
    }
  }

  function setCallSubtitle(subText) {
    const box = document.getElementById('m-call-subtitle-box');
    if (box) {
      box.textContent = subText;
      box.scrollTop = box.scrollHeight;
    }
  }

  function updateCallOverlaySpeakerUI() {
    const spkBtn = document.getElementById('m-call-speaker-btn');
    const nameEl = document.getElementById('m-call-teacher-name');
    const avatar = document.getElementById('m-call-avatar');

    if (spkBtn) {
      spkBtn.textContent = widgetSpeaker === 'israa' ? '🎙️ 👩 المعلمة إسراء' : '🎙️ 👨 المعلم عثمان';
      spkBtn.style.color = widgetSpeaker === 'israa' ? '#f472b6' : '#a7f3d0';
    }
    if (nameEl) {
      nameEl.textContent = widgetSpeaker === 'israa' ? 'المعلمة إسراء 👩‍🏫' : 'المعلم عثمان 👨‍🏫';
    }
    if (avatar) {
      avatar.textContent = widgetSpeaker === 'israa' ? '👩‍🏫' : '👨‍🏫';
    }
  }

  window.toggleWidgetCall = (forceState) => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert('متصفحك لا يدعم الإدخال الصوتي المباشر. يرجى استخدام متصفح حديث مثل Chrome أو Edge.');
      return;
    }

    unlockAudioContext();

    if (typeof forceState === 'boolean') {
      isWidgetCallActive = forceState;
    } else {
      isWidgetCallActive = !isWidgetCallActive;
    }

    const overlay = document.getElementById('m-call-overlay');
    const chip = document.getElementById('m-call-chip');

    if (isWidgetCallActive) {
      if (overlay) overlay.style.display = 'flex';
      if (chip) {
        chip.style.background = '#059669';
        chip.style.color = '#fff';
        chip.style.borderColor = '#34d399';
        chip.textContent = '🟢 مكالمة صوتية نشطة';
      }
      isCallMuted = false;
      callSpeechBuffer = '';
      lastNearVoiceTime = Date.now();
      nearVoiceSustainCount = 0;
      isNearVoiceActive = false;
      ambientNoiseFloor = 14;
      const muteBtn = document.getElementById('m-call-mute-btn');
      if (muteBtn) {
        muteBtn.innerHTML = '<span>🎙️ كتم الصوت</span>';
        muteBtn.style.background = 'rgba(255,255,255,0.12)';
      }
      callStartTime = Date.now();
      isAudioActuallyPlaying = false;
      if (!callAudioElement) {
        try { callAudioElement = new Audio(); } catch(e){}
      }
      if (callAudioElement) {
        try {
          callAudioElement.volume = 1.0;
          callAudioElement.muted = false;
          // Pre-warm audio pipeline with silent wav on user click to unlock mobile/desktop autoplay
          callAudioElement.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
          const p = callAudioElement.play();
          if (p) p.catch(() => {});
        } catch(e){}
      }
      if ('speechSynthesis' in window) {
        try { if (window.speechSynthesis.paused) window.speechSynthesis.resume(); } catch(e){}
      }
      startCallTimer();
      startCallMicMonitor();
      updateCallOverlaySpeakerUI();
      updateNearVoiceUI();
      playCallGreeting();
    } else {
      if (overlay) overlay.style.display = 'none';
      if (chip) {
        chip.style.background = 'rgba(255,255,255,0.06)';
        chip.style.color = '#c7d2fe';
        chip.style.borderColor = '#6366f1';
        chip.textContent = '📞 مكالمة صوتية مستمرة';
      }
      widgetStopSpeak();
      stopCallTimer();
      stopCallMicMonitor();
      isBotSpeaking = false;
      isProcessingCall = false;
      if (callKeepAliveTimer) { clearTimeout(callKeepAliveTimer); callKeepAliveTimer = null; }
      if (wRec) { try { wRec.abort(); } catch(e) {} }
    }
  };

  function playCallGreeting() {
    let greeting = 'أهلاً بك يا دكتور! أنا معك في المكالمة الصوتية المباشرة، تفضل بسؤالك وسأشرحه لك فوراً.';
    if (activeStage === 'kg') {
      greeting = 'أهلاً يا عسول! أنا سامعك في المكالمة المباشرة، قولي عاوز نلعب أو نتعلم شنو سوا؟';
    } else if (activeStage === 'arabic') {
      greeting = 'أهلاً بك يا فارس لغة الضاد وبطل الفصاحة! أنا معك في المكالمة الصوتية المباشرة لمادة اللغة العربية، تفضل بسؤالك في النحو، الإعراب، القراءة، أو البلاغة وسأشرحه لك فوراً وبأبسط أسلوب!';
    } else if (isEnglishStage(activeStage)) {
      greeting = 'Hello superstar! I am Naqla Bot, your English tutor! I can hear you clearly. You can speak to me or interrupt me anytime!';
    } else if (activeStage === 'chemistry') {
      greeting = 'أهلاً بك يا بطل! أنا معك في المكالمة الصوتية المباشرة، تفضل بسؤالك أو معادلتك وسأشرحها لك فوراً.';
    } else if (activeStage === 'geography') {
      greeting = 'أهلاً يا بطل الجغرافيا! أنا معك في المكالمة المباشرة، اسألني عن بيئات السودان، الخرائط، أو أي درس في الجغرافيا وسأشرحه لك فوراً.';
    } else if (activeStage === 'history') {
      greeting = 'أهلاً يا بطل التاريخ! أنا معك في المكالمة المباشرة، اسألني عن تاريخ السودان، الحضارات، أو أي معركة وحدث تاريخي وسأشرحه لك فوراً.';
    }

    setCallSubtitle(greeting);
    speakCallAudio(greeting);
  }

  async function speakCallAudio(text) {
    if (!isWidgetCallActive) return;
    isBotSpeaking = true;
    isAudioActuallyPlaying = false;
    if (wRec) { try { wRec.abort(); } catch(e) {} }

    setCallStatus('speaking', 'المعلم يشرح لك صوتياً الآن...');

    const clean = safeCleanWidgetTtsText(text);
    if (!clean) {
      finishBotSpeech();
      return;
    }

    const isEng = isEnglishStage(activeStage);

    // In live voice call: Speak concise, direct pedagogical summary (~220 chars) for instant audio response
    let speechSnippet = clean;
    if (speechSnippet.length > 250) {
      const sentences = speechSnippet.split(/(?<=[.!\?؟\n])\s+/);
      let acc = '';
      for (const s of sentences) {
        if ((acc + ' ' + s).length <= 260) {
          acc += (acc ? ' ' : '') + s;
        } else {
          break;
        }
      }
      speechSnippet = acc || speechSnippet.slice(0, 220) + '... وتفضل بمراجعة كامل الشرح والمخطط على الشاشة!';
    }

    // Watchdog safety timer: Guarantees the bot will NEVER stay stuck in "المعلم يشرح لك"
    if (callSpeakingWatchdog) clearTimeout(callSpeakingWatchdog);
    const maxSpeechTime = Math.max(4000, Math.min(25000, speechSnippet.length * 110 + 2500));
    callSpeakingWatchdog = setTimeout(() => {
      if (isBotSpeaking) {
        console.warn('[Naqla Live Call] Speech watchdog fired: auto-releasing bot to listening');
        finishBotSpeech();
      }
    }, maxSpeechTime);

    try {
      const primaryUrl = await resolveTtsUrl(speechSnippet, widgetSpeaker);
      const controller = new AbortController();
      const fetchTimer = setTimeout(() => controller.abort(), 6000);

      let res = null;
      try {
        res = await fetch(primaryUrl, { signal: controller.signal });
        clearTimeout(fetchTimer);
        if (!res.ok) throw new Error('Status ' + res.status);
      } catch(primaryErr) {
        clearTimeout(fetchTimer);
        const fallbackVercelUrl = 'https://sudan-interactive-curricula.vercel.app/api/tts?text=' + safeEncodeWidgetUri(clean) + '&speaker=' + safeEncodeWidgetUri(widgetSpeaker);
        try {
          const fallbackCtrl = new AbortController();
          const fallbackTimer = setTimeout(() => fallbackCtrl.abort(), 6000);
          res = await fetch(fallbackVercelUrl, { signal: fallbackCtrl.signal });
          clearTimeout(fallbackTimer);
          if (!res || !res.ok) throw new Error('Vercel status ' + (res ? res.status : 'none'));
        } catch(vercelErr) {
          const fallbackCfUrl = 'https://local-ai-arsenal.pages.dev/api/tts?text=' + safeEncodeWidgetUri(clean) + '&speaker=' + safeEncodeWidgetUri(widgetSpeaker);
          const cfCtrl = new AbortController();
          const cfTimer = setTimeout(() => cfCtrl.abort(), 6000);
          res = await fetch(fallbackCfUrl, { signal: cfCtrl.signal });
          clearTimeout(cfTimer);
          if (!res || !res.ok) throw primaryErr;
        }
      }

      if (!res || !res.ok) throw new Error('TTS response not ok: ' + (res ? res.status : 'null'));
      const ctype = res.headers.get('content-type') || '';
      if (!ctype.includes('audio') && !ctype.includes('mpeg') && !ctype.includes('octet-stream')) {
        throw new Error('Expected audio MIME but got ' + ctype);
      }
      const blob = await res.blob();
      if (blob.size < 400) throw new Error('Audio blob too small (' + blob.size + ' bytes)');
      const blobUrl = URL.createObjectURL(blob);
      
      const audio = callAudioElement || new Audio();
      callAudioElement = audio;
      widgetAudioPlayer = audio;
      audio.volume = 1.0;
      audio.muted = false;
      audio.src = blobUrl;

      audio.onplay = () => {
        isAudioActuallyPlaying = true;
        setCallStatus('speaking', isEng ? 'Naqla Bot is speaking...' : 'المعلم يشرح لك صوتياً الآن...');
      };

      audio.onended = () => {
        isAudioActuallyPlaying = false;
        URL.revokeObjectURL(blobUrl);
        widgetAudioPlayer = null;
        finishBotSpeech();
      };

      audio.onerror = (aErr) => {
        console.warn('[Naqla Live Call] Audio element error, falling back:', aErr);
        isAudioActuallyPlaying = false;
        URL.revokeObjectURL(blobUrl);
        widgetAudioPlayer = null;
        fallbackCallBrowserSpeak(clean, isEng);
      };

      await audio.play().catch(playErr => {
        console.warn('[Naqla Live Call] Audio autoplay blocked or failed, falling back to browser speech:', playErr);
        isAudioActuallyPlaying = false;
        URL.revokeObjectURL(blobUrl);
        widgetAudioPlayer = null;
        fallbackCallBrowserSpeak(clean, isEng);
      });
    } catch(e) {
      fallbackCallBrowserSpeak(clean, isEng);
    }
  }

  function fallbackCallBrowserSpeak(clean, isEng) {
    if (!('speechSynthesis' in window)) {
      finishBotSpeech();
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(clean);
      window.__naqlaActiveUtterance = utterance; // Keep global ref to prevent GC in Chrome!

      utterance.lang = isEng ? 'en-US' : 'ar-SA';
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      if (isEng) {
        utterance.rate = 0.94;
        utterance.pitch = 1.0;
        const enVoice = voices.find(v => v.lang.startsWith('en-US') && v.name.toLowerCase().includes('natural')) ||
                        voices.find(v => v.lang.startsWith('en-US')) ||
                        voices.find(v => v.lang.startsWith('en'));
        if (enVoice) utterance.voice = enVoice;
      } else {
        const arVoices = voices.filter(v => v.lang.startsWith('ar') || v.lang.includes('Arabic'));
        if (widgetSpeaker === 'israa') {
          utterance.pitch = 1.15;
          utterance.rate = 1.0;
          if (arVoices.length > 0) {
            const f = arVoices.find(v => v.name.toLowerCase().includes('female') || v.name.includes('Hoda') || v.name.includes('Salma') || v.name.includes('Zariyah') || v.name.includes('Laila') || v.name.includes('Muna'));
            utterance.voice = f || arVoices[0];
          }
        } else {
          // Osman: Strict Male Baritone Voice Guarantee
          const m = arVoices.find(v => v.name.toLowerCase().includes('male') || v.name.includes('Hamed') || v.name.includes('Shakir') || v.name.includes('Tarik') || v.name.includes('Naayf') || v.name.includes('Hamid') || v.name.includes('Omar') || v.name.includes('Bassam'));
          if (m) {
            utterance.voice = m;
            utterance.pitch = 0.95;
            utterance.rate = 1.0;
          } else if (arVoices.length > 0) {
            utterance.voice = arVoices[0];
            utterance.pitch = 0.58; // Formant pitch-shift transforms female voice into deep dignified male voice!
            utterance.rate = 0.92;
          } else {
            utterance.pitch = 0.58;
            utterance.rate = 0.92;
          }
        }
      }

      utterance.onstart = () => {
        isAudioActuallyPlaying = true;
        setCallStatus('speaking', isEng ? 'Naqla Bot is speaking...' : 'المعلم يشرح لك صوتياً الآن...');
      };
      utterance.onend = () => {
        isAudioActuallyPlaying = false;
        window.__naqlaActiveUtterance = null;
        finishBotSpeech();
      };
      utterance.onerror = (uErr) => {
        console.warn('[Naqla Live Call] Utterance error:', uErr);
        isAudioActuallyPlaying = false;
        window.__naqlaActiveUtterance = null;
        finishBotSpeech();
      };
      utterance.onpause = () => {
        try { window.speechSynthesis.resume(); } catch(e){}
      };

      setTimeout(() => {
        try {
          if (window.speechSynthesis.paused) window.speechSynthesis.resume();
          window.speechSynthesis.speak(utterance);
        } catch(e) {
          finishBotSpeech();
        }
      }, 50);
    } catch(err) {
      console.warn('[Naqla Live Call] Browser speech synthesis error:', err);
      finishBotSpeech();
    }
  }

  function startContinuousListening() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec || !isWidgetCallActive || isBotSpeaking || isProcessingCall || isCallMuted) return;

    if (wRec) { try { wRec.abort(); } catch(e) {} }

    const isEng = isEnglishStage(activeStage);
    setCallStatus('listening', isEng ? 'Naqla Bot is listening... Speak in English! 🎙️' : 'المعلم يستمع لصوتك الآن... (تحدث بحرية)');

    wRec = new SpeechRec();
    wRec.lang = isEng ? 'en-US' : 'ar-SA';
    wRec.continuous = false; // Resilient keepalive pattern prevents browser hangs
    wRec.interimResults = true;

    let hasReceivedFinal = false;

    wRec.onsoundstart = () => {
      if (isBotSpeaking) triggerCallBargeIn();
    };

    wRec.onspeechstart = () => {
      if (isBotSpeaking) triggerCallBargeIn();
      isUserTalkingInCall = true;
      setCallStatus('listening', isEng ? 'Naqla Bot is listening... 🎙️' : 'المعلم يستمع لصوتك الآن... 👂✨');
    };

    wRec.onstart = () => {
      isWRecording = true;
      if (micBtn) micBtn.style.background = '#e11d48';
    };

    wRec.onresult = (e) => {
      if (!isWidgetCallActive) return;
      // If bot is speaking and student talks close to mic, trigger barge-in!
      if (isBotSpeaking) {
        if (isNearVoiceActive || isUserTalkingInCall) {
          triggerCallBargeIn();
        }
        return;
      }

      let interim = '';
      let final = '';

      for (let i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
          final += e.results[i][0].transcript;
        } else {
          interim += e.results[i][0].transcript;
        }
      }

      const liveText = (final || interim).trim();
      const currentCombined = (callSpeechBuffer ? (callSpeechBuffer + ' ' + liveText) : liveText).trim();
      if (currentCombined) {
        setCallSubtitle(`🗣️ "${currentCombined}"`);
      }

      if (final.trim()) {
        const timeSinceNearVoice = Date.now() - lastNearVoiceTime;
        // Near-Field Verification: Only reject ambient speech in 'aggressive' isolation mode
        // In 'smart' and 'normal' modes, always accept speech (the DSP filters handle noise)
        if (nearVoiceMode === 'aggressive' && timeSinceNearVoice > 2500 && !isNearVoiceActive) {
          console.log('[Naqla Mentor] Aggressive mode: Ignored distant ambient speech:', final.trim());
          return;
        }

        // Accumulate in buffer
        callSpeechBuffer = (callSpeechBuffer ? (callSpeechBuffer + ' ' + final.trim()) : final.trim());
        setCallSubtitle(`🗣️ "${callSpeechBuffer}"`);

        // Smart Debounce Window (1000ms): Allow student to pause, think, and complete sentence without premature cutoff
        if (speechDebounceTimer) clearTimeout(speechDebounceTimer);
        speechDebounceTimer = setTimeout(() => {
          if (callSpeechBuffer && isWidgetCallActive && !isProcessingCall && !isBotSpeaking) {
            const textToSend = callSpeechBuffer.trim();
            callSpeechBuffer = '';
            hasReceivedFinal = true;
            isWRecording = false;
            try { wRec.abort(); } catch(err) {}
            handleCallUserSpeech(textToSend);
          }
        }, 750);
      }
    };

    wRec.onerror = (e) => {
      isWRecording = false;
      if (isWidgetCallActive && !isBotSpeaking && !isProcessingCall && !isCallMuted) {
        if (e.error === 'no-speech') {
          setCallStatus('listening', isEng ? 'Waiting for your question... Speak anytime! 🎙️' : 'المعلم في انتظار سؤالك... (تحدث في أي وقت)');
        }
        if (callKeepAliveTimer) clearTimeout(callKeepAliveTimer);
        callKeepAliveTimer = setTimeout(() => {
          if (isWidgetCallActive && !isBotSpeaking && !isProcessingCall && !isCallMuted) {
            startContinuousListening();
          }
        }, 500);
      }
    };

    wRec.onend = () => {
      isWRecording = false;
      if (micBtn) micBtn.style.background = '#1e293b';

      // If we have buffered speech waiting, let the debounce timer finish or dispatch if silence passed
      if (callSpeechBuffer && !hasReceivedFinal && isWidgetCallActive && !isProcessingCall && !isBotSpeaking) {
        if (!speechDebounceTimer) {
          speechDebounceTimer = setTimeout(() => {
            if (callSpeechBuffer && isWidgetCallActive && !isProcessingCall && !isBotSpeaking) {
              const textToSend = callSpeechBuffer.trim();
              callSpeechBuffer = '';
              handleCallUserSpeech(textToSend);
            }
          }, 800);
        }
      }

      if (isWidgetCallActive && !isBotSpeaking && !isProcessingCall && !hasReceivedFinal && !isCallMuted) {
        if (callKeepAliveTimer) clearTimeout(callKeepAliveTimer);
        callKeepAliveTimer = setTimeout(() => {
          if (isWidgetCallActive && !isBotSpeaking && !isProcessingCall && !isCallMuted) {
            startContinuousListening();
          }
        }, 400);
      }
    };

    try {
      wRec.start();
    } catch(e) {
      if (isWidgetCallActive && !isBotSpeaking && !isCallMuted) {
        setTimeout(startContinuousListening, 800);
      }
    }
  }

  function handleCallUserSpeech(text) {
    if (!text || !text.trim() || !isWidgetCallActive || isProcessingCall) return;

    if (speechDebounceTimer) {
      clearTimeout(speechDebounceTimer);
      speechDebounceTimer = null;
    }
    callSpeechBuffer = '';

    isProcessingCall = true;
    setCallStatus('thinking', 'المعلم يحلل ويفكر في الرد... 🤖💭');
    setCallSubtitle(`🗣️ سؤالك: "${text}"`);

    sendMessage(text);
  }

  function interruptCall() {
    if (!isWidgetCallActive) return;
    if (speechDebounceTimer) {
      clearTimeout(speechDebounceTimer);
      speechDebounceTimer = null;
    }
    // Instant submission: If user was accumulating speech in buffer, dispatch it immediately!
    if (callSpeechBuffer && callSpeechBuffer.trim()) {
      const textToSend = callSpeechBuffer.trim();
      callSpeechBuffer = '';
      if (wRec) { try { wRec.abort(); } catch(e){} }
      handleCallUserSpeech(textToSend);
      return;
    }
    triggerCallBargeIn(true);
  }

  // Setup Call Overlay Event Listeners
  const callInterruptBtn = document.getElementById('m-call-interrupt-btn');
  const callEndBtn = document.getElementById('m-call-end-btn');
  const callSpeakerBtn = document.getElementById('m-call-speaker-btn');
  const callNearVoiceBtn = document.getElementById('m-call-nearvoice-btn');
  const callMuteBtn = document.getElementById('m-call-mute-btn');
  const callAvatar = document.getElementById('m-call-avatar');

  if (callNearVoiceBtn) {
    callNearVoiceBtn.onclick = cycleNearVoiceMode;
    updateNearVoiceUI();
  }

  if (callInterruptBtn) callInterruptBtn.onclick = interruptCall;
  if (callAvatar) callAvatar.onclick = interruptCall;
  if (callEndBtn) callEndBtn.onclick = () => window.toggleWidgetCall(false);

  if (callMuteBtn) {
    callMuteBtn.onclick = () => {
      isCallMuted = !isCallMuted;
      if (isCallMuted) {
        if (wRec) { try { wRec.abort(); } catch(e){} }
        if (callKeepAliveTimer) clearTimeout(callKeepAliveTimer);
        if (speechDebounceTimer) clearTimeout(speechDebounceTimer);
        callSpeechBuffer = '';
        callMuteBtn.innerHTML = '<span>🔇 تم الكتم</span>';
        callMuteBtn.style.background = '#dc2626';
        setCallStatus('idle', 'الميكروفون مكتوم 🔇');
        setCallSubtitle('الميكروفون مكتوم 🔇 اضغط على الزر لإلغاء الكتم');
        resetLiveVuBars();
      } else {
        callMuteBtn.innerHTML = '<span>🎙️ كتم الصوت</span>';
        callMuteBtn.style.background = 'rgba(255,255,255,0.12)';
        setCallStatus('listening', 'المعلم يستمع لصوتك الآن...');
        setCallSubtitle('تم إلغاء الكتم! تفضل بالحديث 🎙️');
        startContinuousListening();
      }
    };
  }

  if (callSpeakerBtn) {
    callSpeakerBtn.onclick = () => {
      widgetSpeaker = widgetSpeaker === 'osman' ? 'israa' : 'osman';
      localStorage.setItem('mentor_speaker', widgetSpeaker);
      updateWidgetVoiceUI();
      updateCallOverlaySpeakerUI();
      if (isBotSpeaking) interruptCall();
    };
  }

  // 📷 Camera Question Scanner for Widget
  const camBtn = document.getElementById('m-cam-btn');
  const camFile = document.getElementById('m-cam-file');
  if (camBtn && camFile) {
    camBtn.onclick = () => camFile.click();
    camFile.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (ev) => {
        const imgSrc = ev.target.result;
        const uEl = document.createElement('div');
        uEl.className = 'mentor-msg-user';
        uEl.innerHTML = `<img src="${imgSrc}" style="max-height:140px; border-radius:8px; display:block; margin-bottom:4px; object-fit:contain; background:#000;" /><span style="font-size:11px; color:#fbbf24;">📷 سؤال ملتقط بالكاميرا</span>`;
        msgBox.appendChild(uEl);
        msgBox.scrollTop = msgBox.scrollHeight;

        const loadEl = document.createElement('div');
        loadEl.className = 'mentor-msg-bot';
        loadEl.style.opacity = '0.7';
        loadEl.innerHTML = '📷 جاري قراءة السؤال بالكاميرا...';
        msgBox.appendChild(loadEl);
        msgBox.scrollTop = msgBox.scrollHeight;

        try {
          const endpoint = await resolveMentorEndpoint();
          const scanUrl = endpoint.replace('/api/mentor/chat', '/api/mentor/scan-camera-question');
          const formData = new FormData();
          formData.append('image', file);
          formData.append('history', JSON.stringify(history.slice(-6)));
          formData.append('stage', activeStage);

          const res = await fetch(scanUrl, {
            method: 'POST',
            body: formData
          });

          if (!res.ok) throw new Error('فشل فحص الصورة');
          const data = await res.json();
          loadEl.remove();

          if (data.extracted_text) {
            history.push({ role: 'user', content: `[سؤال بالكاميرا]: ${data.extracted_text}` });
          }
          history.push({ role: 'assistant', content: data.reply || '' });

          renderWidgetBotMessage(data);

          if (isWidgetCallActive && data.reply) {
            widgetSpeak(data.reply);
          }
        } catch (err) {
          loadEl.remove();
          const errEl = document.createElement('div');
          errEl.className = 'mentor-msg-bot';
          errEl.style.borderColor = '#ef4444';
          errEl.textContent = 'تعذر قراءة الصورة بالكاميرا. تأكد من وضوح الإضاءة.';
          msgBox.appendChild(errEl);
        }
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    };
  }

  // Audio Speech Recognition setup
  const micBtn = document.getElementById('m-mic-btn');
  const inputEl = document.getElementById('mentor-txt');
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  let isWRecording = false;
  let wRec = null;

  if (SpeechRec && micBtn) {
    micBtn.onclick = () => {
      if (isWRecording && wRec) {
        wRec.stop();
        isWRecording = false;
        micBtn.style.background = '#1e293b';
        return;
      }
      wRec = new SpeechRec();
      wRec.lang = 'ar-SA';
      wRec.onstart = () => {
        isWRecording = true;
        micBtn.style.background = '#e11d48';
        inputEl.placeholder = '🎙️ جاري الاستماع لصوتك...';
      };
      wRec.onresult = (e) => {
        inputEl.value = e.results[0][0].transcript;
        inputEl.placeholder = 'اكتب سؤالك أو تحدث بالصوت للمعلم...';
        sendMessage(inputEl.value);
      };
      wRec.onerror = () => {
        isWRecording = false;
        micBtn.style.background = '#1e293b';
        inputEl.placeholder = 'اكتب سؤالك أو تحدث بالصوت للمعلم...';
      };
      wRec.onend = () => {
        isWRecording = false;
        micBtn.style.background = '#1e293b';
        inputEl.placeholder = 'اكتب سؤالك أو تحدث بالصوت للمعلم...';
      };
      wRec.start();
    };
  } else if (micBtn) {
    micBtn.style.display = 'none';
  }

  document.getElementById('mentor-btn').onclick = () => {
    sendMessage(document.getElementById('mentor-txt').value.trim());
  };

  document.getElementById('mentor-txt').onkeypress = (e) => {
    if (e.key === 'Enter') {
      sendMessage(document.getElementById('mentor-txt').value.trim());
    }
  };

  window.sendMentorChip = (txt) => {
    sendMessage(txt);
  };

  // ── Educational Image Bank & Lightbox Support ──────────────────────────────
  const MENTOR_IMG_BANK_KEY = 'naqla_mentor_image_bank_v1';
  function saveEducationalImageToLocalBank(imageObj, queryText) {
    if (!imageObj || !imageObj.url) return;
    try {
      const raw = localStorage.getItem(MENTOR_IMG_BANK_KEY);
      const bank = raw ? JSON.parse(raw) : {};
      const key = (imageObj.id || imageObj.title || queryText || ('img_' + Date.now())).toLowerCase().trim();
      bank[key] = {
        url: imageObj.url,
        title: imageObj.title,
        description: imageObj.description,
        timestamp: Date.now()
      };
      localStorage.setItem(MENTOR_IMG_BANK_KEY, JSON.stringify(bank));
    } catch (e) {}
  }

  window.openMentorImageLightbox = function(url, title) {
    const lb = document.getElementById('mentor-lightbox');
    const img = document.getElementById('mentor-lightbox-img');
    const t = document.getElementById('mentor-lightbox-title');
    const d = document.getElementById('mentor-lightbox-download');
    if (lb && img) {
      img.src = url;
      if (t) t.textContent = title || '🖼️ رسمة تعليمية توضيحية';
      if (d) d.href = url;
      lb.style.display = 'flex';
    }
  };

  window.closeMentorImageLightbox = function() {
    const lb = document.getElementById('mentor-lightbox');
    if (lb) lb.style.display = 'none';
  };

  window.copyMentorImageUrl = function(url, btnEl) {
    if (!url) return;
    navigator.clipboard.writeText(url).then(() => {
      if (btnEl) {
        const old = btnEl.textContent;
        btnEl.textContent = '✅ تم النسخ!';
        setTimeout(() => { btnEl.textContent = old; }, 2000);
      }
    }).catch(() => {
      prompt('انسخ رابط الرسمة من هنا:', url);
    });
  };

  // Create and append Lightbox element to body
  const mentorLb = document.createElement('div');
  mentorLb.className = 'mentor-lightbox-overlay';
  mentorLb.id = 'mentor-lightbox';
  mentorLb.innerHTML = `
    <div class="mentor-lightbox-content">
      <div class="mentor-lightbox-header">
        <span id="mentor-lightbox-title">🖼️ رسمة تعليمية توضيحية</span>
        <button type="button" class="mentor-lightbox-close" onclick="closeMentorImageLightbox()">✕ إغلاق</button>
      </div>
      <img id="mentor-lightbox-img" class="mentor-lightbox-img" src="" alt="رسمة توضيحية">
      <div style="margin-top:12px; display:flex; gap:8px; width:100%; justify-content:center;">
        <a id="mentor-lightbox-download" href="" target="_blank" download="educational-diagram.jpg" class="mentor-img-action-btn btn-download" style="max-width:180px;">📥 تحميل الرسمة بجودة عالية</a>
        <button type="button" class="mentor-img-action-btn btn-copy" style="max-width:140px;" onclick="copyMentorImageUrl(document.getElementById('mentor-lightbox-img').src, this)">📋 نسخ الرابط</button>
      </div>
    </div>
  `;
  mentorLb.onclick = (e) => {
    if (e.target === mentorLb) closeMentorImageLightbox();
  };
  document.body.appendChild(mentorLb);

})();