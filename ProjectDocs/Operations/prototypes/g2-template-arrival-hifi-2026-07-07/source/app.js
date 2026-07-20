const content = {
  en: {
    bcTemplateName: "Event Registration",
    statusBadge: "Template Preview",
    badge: "Template Context",
    title: "Your event registration form is ready",
    subtitle: "Create it first, then adjust fields, theme, and publishing settings.",
    evidenceTitle: "Event Registration",
    chips: ["Name", "Email", "Session / Event slot", "Number of attendees", "Notes"],
    primaryCTA: "Create this form",
    secondaryCTA: "Preview fields",
    loginNote: "Sign in is required to save and publish. We'll bring you back to this form after sign-in.",
    
    // Preview form fields
    formTitle: "Event Registration Form",
    formDesc: "Please fill out this form to register for the upcoming event.",
    lblName: "Full Name",
    lblEmail: "Email Address",
    lblSession: "Session / Event slot",
    lblAttendees: "Number of attendees",
    lblNotes: "Notes",
    optSession: "Morning Session (9:00 AM - 12:00 PM)",
    btnSubmit: "Submit",
    
    chromeAddress: "localhost:3000/forms/preview"
  },
  zh: {
    bcTemplateName: "活动报名表",
    statusBadge: "模板预览",
    badge: "模板上下文",
    title: "你的活动报名表已经准备好",
    subtitle: "可以先使用此模板创建表单，之后再调整字段、主题和发布设置。",
    evidenceTitle: "活动报名",
    chips: ["姓名", "电子邮箱", "场次 / 活动时间", "参加人数", "备注"],
    primaryCTA: "使用此模板创建表单",
    secondaryCTA: "预览字段",
    loginNote: "需要登录后保存和发布；登录后会回到当前表单。",
    
    // Preview form fields
    formTitle: "活动报名表",
    formDesc: "请填写以下表单以报名参加即将举行的活动。",
    lblName: "姓名",
    lblEmail: "电子邮箱",
    lblSession: "场次 / 活动时间",
    lblAttendees: "参加人数",
    lblNotes: "备注",
    optSession: "上午场 (9:00 AM - 12:00 PM)",
    btnSubmit: "提交",
    
    chromeAddress: "localhost:3000/forms/preview"
  }
};

function setLanguage(lang) {
  const t = content[lang];
  
  // Update Header / Workspace Breadcrumbs
  document.getElementById('bc-template-name').textContent = t.bcTemplateName;
  document.getElementById('status-badge').textContent = t.statusBadge;
  document.getElementById('badge').textContent = t.badge;
  
  // Update Action Panel Content
  document.getElementById('title').textContent = t.title;
  document.getElementById('subtitle').textContent = t.subtitle;
  document.getElementById('evidence-title').textContent = t.evidenceTitle;
  
  // Update chips
  document.getElementById('chip-1').textContent = t.chips[0];
  document.getElementById('chip-2').textContent = t.chips[1];
  document.getElementById('chip-3').textContent = t.chips[2];
  document.getElementById('chip-4').textContent = t.chips[3];
  document.getElementById('chip-5').textContent = t.chips[4];
  
  // Update buttons & CTA
  document.getElementById('primary-cta').textContent = t.primaryCTA;
  document.getElementById('secondary-cta').textContent = t.secondaryCTA;
  document.getElementById('mobile-cta').textContent = t.primaryCTA;
  
  // Update login notes
  document.getElementById('login-note-text').textContent = t.loginNote;
  document.getElementById('mobile-login-note-text').textContent = t.loginNote;
  
  // Update Form Preview content
  document.getElementById('form-preview-title').textContent = t.formTitle;
  document.getElementById('form-preview-desc').textContent = t.formDesc;
  document.getElementById('lbl-name').textContent = t.lblName;
  document.getElementById('lbl-email').textContent = t.lblEmail;
  document.getElementById('lbl-session').textContent = t.lblSession;
  document.getElementById('lbl-attendees').textContent = t.lblAttendees;
  document.getElementById('lbl-notes').textContent = t.lblNotes;
  document.getElementById('opt-session').textContent = t.optSession;
  document.getElementById('btn-submit').textContent = t.btnSubmit;
  
  document.documentElement.lang = lang;
  
  // Update URL parameter without reload
  const url = new URL(window.location);
  url.searchParams.set('lang', lang);
  window.history.replaceState({}, '', url);
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Language switching logic
  const urlParams = new URLSearchParams(window.location.search);
  let currentLang = urlParams.get('lang');
  if (currentLang !== 'zh' && currentLang !== 'en') {
    currentLang = 'en';
  }
  
  setLanguage(currentLang);
  
  // Language button highlights
  const langBtns = document.querySelectorAll('.lang-btn');
  langBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-lang') === currentLang) {
      btn.classList.add('active');
    }
    
    btn.addEventListener('click', (e) => {
      langBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const lang = btn.getAttribute('data-lang');
      setLanguage(lang);
    });
  });
  
  // 2. Viewport switching logic (Desktop / Mobile Preview)
  const desktopBtn = document.getElementById('desktop-view-btn');
  const mobileBtn = document.getElementById('mobile-view-btn');
  const previewDevice = document.getElementById('preview-device');
  
  desktopBtn.addEventListener('click', () => {
    desktopBtn.classList.add('active');
    mobileBtn.classList.remove('active');
    previewDevice.classList.remove('mobile-preview');
    previewDevice.classList.add('desktop-preview');
  });
  
  mobileBtn.addEventListener('click', () => {
    mobileBtn.classList.add('active');
    desktopBtn.classList.remove('active');
    previewDevice.classList.remove('desktop-preview');
    previewDevice.classList.add('mobile-preview');
  });
});
