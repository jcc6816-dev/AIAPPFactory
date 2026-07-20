const urlParams = new URLSearchParams(window.location.search);
const state = urlParams.get('state') || 'context-loaded';
const lang = urlParams.get('lang') || 'en';

const t = {
  en: {
    generateForm: "Generate this form",
    publishForm: "Publish form",
    sendFreeTest: "Send free test",
    submitTest: "Submit test response",
    shareForm: "Share public form",
    sendTestSub: "Send test submission",
    pubSuccess: "Successfully Published",
    pubSuccessDesc: "Awesome! Your form is live and ready to collect responses.",
    editFields: "Edit fields",
    settings: "Settings",
    draftReady: "Draft ready",
    publicLink: "Your public link:",
    noSubmissions: "No submissions yet",
    noSubDesc: "You haven't received any submissions for this form. Share your form link or send a test entry to get started."
  },
  zh: {
    generateForm: "生成表单",
    publishForm: "发布表单",
    sendFreeTest: "发送免费测试",
    submitTest: "提交测试响应",
    shareForm: "分享公开表单",
    sendTestSub: "发送测试提交",
    pubSuccess: "发布成功",
    pubSuccessDesc: "太棒了！您的表单已上线，随时可以收集回复。",
    editFields: "编辑字段",
    settings: "设置",
    draftReady: "草稿已就绪",
    publicLink: "您的公开链接：",
    noSubmissions: "暂无提交",
    noSubDesc: "您还没有收到该表单的任何提交。分享表单链接或发送测试条目以开始使用。"
  },
  es: {
    generateForm: "Generar este formulario",
    publishForm: "Publicar formulario",
    sendFreeTest: "Enviar prueba gratuita",
    submitTest: "Enviar respuesta de prueba",
    shareForm: "Compartir formulario público",
    sendTestSub: "Enviar envío de prueba",
    pubSuccess: "Publicación exitosa",
    pubSuccessDesc: "¡Felicidades! Tu contenido ya está en línea y visible para tu audiencia.",
    editFields: "Editar campos",
    settings: "Configuración",
    draftReady: "Borrador listo",
    publicLink: "Tu enlace público:",
    noSubmissions: "Aún no hay envíos",
    noSubDesc: "Aún no has recibido ningún envío para este formulario. Comparte el enlace del formulario o envía una prueba para comenzar."
  }
};

const texts = t[lang] || t.en;

const formHTML = `
  <div class="form-title">Tech Conference 2026 Registration</div>
  <div class="form-desc">Join us for the biggest tech event of the year. Please fill out the form below to secure your spot.</div>
  
  <div class="form-row">
    <div class="form-group">
      <label>First Name</label>
      <input type="text" class="form-control" value="Alex" readonly>
    </div>
    <div class="form-group">
      <label>Last Name</label>
      <input type="text" class="form-control" value="Rivera" readonly>
    </div>
  </div>
  <div class="form-group">
    <label>Email Address</label>
    <input type="email" class="form-control" value="alex.rivera@example.com" readonly>
  </div>
  <div class="form-group">
    <label>Job Title</label>
    <input type="text" class="form-control" value="Senior Product Designer" readonly>
  </div>
  <div class="form-group">
    <label>Dietary Requirements</label>
    <select class="form-control" disabled>
      <option selected>Vegetarian</option>
    </select>
  </div>
`;

function render() {
  const workspace = document.getElementById('workspace');
  const actionRail = document.getElementById('action-rail');
  const stickyCta = document.getElementById('mobile-sticky-cta');
  
  let wsContent = '';
  let railContent = '';
  let stickyContent = '';
  let mainBtn = '';

  if (state === 'context-loaded') {
    mainBtn = `<button class="btn btn-primary"><i class="ph ph-magic-wand"></i> ${texts.generateForm}</button>`;
    wsContent = `
      <div class="split-view">
        <div class="prompt-editor">
          <div class="context-banner">
            <h2><i class="ph-fill ph-sparkle"></i> Event Registration Form</h2>
            <p>We've loaded the 'Tech Conference' template. Add any specific fields or custom branding instructions below.</p>
          </div>
          <textarea placeholder="e.g. Add a question asking about dietary restrictions and t-shirt size.">Please include fields for Job Title and Dietary Requirements.</textarea>
        </div>
        <div class="preview-panel">
          <div class="form-preview compact">
            ${formHTML}
          </div>
        </div>
      </div>
    `;
    railContent = `
      <h3>Actions</h3>
      ${mainBtn}
    `;
    stickyContent = mainBtn;
  } 
  else if (state === 'generated-draft') {
    mainBtn = `<button class="btn btn-primary"><i class="ph ph-paper-plane-tilt"></i> ${texts.publishForm}</button>`;
    wsContent = `
      <div style="display:flex; flex-direction:column; align-items:center; width: 100%;">
        <div class="context-banner" style="background: transparent; border-color: var(--border-color); display: ${document.body.classList.contains('mobile') ? 'none' : 'block'}">
          <h2 style="color: var(--text-main); font-size: 16px;"><i class="ph-fill ph-check-circle" style="color: var(--success-teal)"></i> ${texts.draftReady}</h2>
          <p style="color: var(--text-muted);">Your form has been generated. Review and publish.</p>
        </div>
        <div class="form-preview">
          ${formHTML}
        </div>
      </div>
    `;
    railContent = `
      <h3>${texts.draftReady}</h3>
      <p style="font-size:13px; color:var(--text-muted); margin-bottom: 16px;">Everything looks good. You can edit individual fields or publish directly.</p>
      ${mainBtn}
      <button class="btn btn-secondary"><i class="ph ph-pencil-simple"></i> ${texts.editFields}</button>
      <button class="btn btn-ghost"><i class="ph ph-gear"></i> ${texts.settings}</button>
    `;
    stickyContent = `
      ${mainBtn}
      <button class="btn btn-secondary"><i class="ph ph-dots-three"></i> More Options</button>
    `;
  }
  else if (state === 'publish-success') {
    mainBtn = `<button class="btn btn-primary"><i class="ph ph-paper-plane-right"></i> ${texts.sendFreeTest}</button>`;
    wsContent = `
      <div class="success-view">
        <div class="success-icon"><i class="ph-bold ph-check"></i></div>
        <h1>${texts.pubSuccess}</h1>
        <p>${texts.pubSuccessDesc}</p>
        
        <div class="url-box">
          <div class="url-box-label">${texts.publicLink}</div>
          <div class="url-input-wrapper">
            <i class="ph ph-link"></i>
            <input type="text" value="https://genforms.ai/f/evt_techconf_2026" readonly>
            <button class="btn btn-secondary" style="padding: 6px 12px;">Copy</button>
          </div>
        </div>

        <div class="share-group">
          <button class="btn btn-secondary"><i class="ph ph-qr-code"></i> QR Code</button>
          <button class="btn btn-secondary"><i class="ph ph-whatsapp-logo"></i> WhatsApp</button>
        </div>
      </div>
    `;
    railContent = `
      <h3>Next Steps</h3>
      ${mainBtn}
      <button class="btn btn-ghost">Go to Dashboard</button>
    `;
    stickyContent = mainBtn;
  }
  else if (state === 'test-runner') {
    mainBtn = `<button class="btn btn-primary"><i class="ph ph-check-circle"></i> ${texts.submitTest}</button>`;
    wsContent = `
      <div class="test-mode-banner">
        <i class="ph-fill ph-warning-circle"></i> Test Mode Active - No external notifications will be sent
      </div>
      <div class="form-preview" style="margin-top: 40px;">
        ${formHTML}
      </div>
    `;
    railContent = `
      <h3>Test Environment</h3>
      <p style="font-size:13px; color:var(--text-muted); margin-bottom: 16px;">This submission will be marked as a test and won't affect analytics.</p>
      ${mainBtn}
      <button class="btn btn-ghost">Exit Test</button>
    `;
    stickyContent = mainBtn;
  }
  else if (state === 'first-result') {
    mainBtn = `<button class="btn btn-primary"><i class="ph ph-share-network"></i> ${texts.shareForm}</button>`;
    wsContent = `
      <div class="result-view">
        <div class="result-header">
          <h3>Submission #1</h3>
          <span class="badge-test"><i class="ph-fill ph-flask"></i> Test</span>
        </div>
        <div class="result-body">
          <div class="data-pair">
            <div class="data-label">First Name</div>
            <div class="data-value">Alex</div>
          </div>
          <div class="data-pair">
            <div class="data-label">Last Name</div>
            <div class="data-value">Rivera</div>
          </div>
          <div class="data-pair">
            <div class="data-label">Email Address</div>
            <div class="data-value">alex.rivera@example.com</div>
          </div>
          <div class="data-pair">
            <div class="data-label">Job Title</div>
            <div class="data-value">Senior Product Designer</div>
          </div>
          <div class="data-pair">
            <div class="data-label">Dietary Requirements</div>
            <div class="data-value">Vegetarian</div>
          </div>
        </div>
      </div>
    `;
    railContent = `
      <h3>Result Detail</h3>
      <p style="font-size:13px; color:var(--text-muted); margin-bottom: 16px;">Received just now. Everything looks great.</p>
      ${mainBtn}
      <button class="btn btn-secondary">Delete Test Data</button>
    `;
    stickyContent = mainBtn;
  }
  else if (state === 'empty-submissions') {
    mainBtn = `<button class="btn btn-primary"><i class="ph ph-paper-plane-right"></i> ${texts.sendTestSub}</button>`;
    wsContent = `
      <div class="empty-state">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="color: var(--text-muted); margin-bottom: 16px;">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="9" y1="21" x2="9" y2="9"></line>
        </svg>
        <h3>${texts.noSubmissions}</h3>
        <p>${texts.noSubDesc}</p>
        <div style="display: none;" class="desktop-main-btn-container">
            ${mainBtn}
        </div>
      </div>
    `;
    railContent = `
      <h3>Inbox</h3>
      <p style="font-size:13px; color:var(--text-muted); margin-bottom: 16px;">Waiting for responses.</p>
      ${mainBtn}
    `;
    stickyContent = mainBtn;
  }

  workspace.innerHTML = wsContent;
  actionRail.innerHTML = railContent;
  stickyCta.innerHTML = stickyContent;
  
  if (state === 'empty-submissions' && !document.body.classList.contains('mobile')) {
      const btnContainer = workspace.querySelector('.desktop-main-btn-container');
      if(btnContainer) {
          btnContainer.style.display = 'block';
      }
      actionRail.innerHTML = '';
  }
}

render();
