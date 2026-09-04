/* ==========================================================================
   CareChronicle - Home Module & Staged Processing Controller (v2.0 Phase 2)
   ========================================================================== */

const HomeModule = {
  render() {
    const container = document.getElementById('home-view');
    if (!container) return;

    const activeCase = store.getActiveCase();
    const docs = store.getActiveDocuments();
    const apts = store.getActiveAppointments();
    const timeline = store.getActiveTimeline();
    const unverifiedDocs = store.getUnverifiedDocuments();

    const upcomingApt = apts.find(a => a.status === 'Upcoming') || apts[0];

    container.innerHTML = `
      <!-- Welcome Header -->
      <div class="view-header">
        <div>
          <h1 class="view-title">Care Summary</h1>
          <p class="view-subtitle">Organized medical story for <strong>${activeCase.name}</strong> (${activeCase.condition}).</p>
        </div>
        <div style="display: flex; gap: 10px;">
          ${unverifiedDocs.length > 0 ? `
            <button class="btn btn-secondary" onclick="VaultModule.openVerificationDrawer('${unverifiedDocs[0].id}')">
              <i class="fa-solid fa-triangle-exclamation" style="color: var(--status-warning);"></i> Verification Queue (${unverifiedDocs.length})
            </button>
          ` : ''}
          <button class="btn btn-primary" onclick="utils.openModal('uploadModal')">
            <i class="fa-solid fa-cloud-arrow-up"></i> Upload Record
          </button>
        </div>
      </div>

      <!-- Active Patient Case Card -->
      <div class="hero-banner">
        <div class="banner-content">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
            <span class="badge-prov original">${activeCase.relationship}</span>
            <span style="font-size: 13px; color: var(--text-muted);">Case ID: ${activeCase.id}</span>
          </div>
          <h2>${activeCase.name}</h2>
          <p style="margin-bottom: 12px;">${activeCase.condition} • Primary Physician: <strong>${activeCase.primaryPhysician}</strong> (${activeCase.hospital})</p>
          <div style="display: flex; gap: 16px; font-size: 13px; color: var(--dark-pink); font-weight: 600;">
            <span><i class="fa-solid fa-folder-open"></i> ${docs.length} Records Preserved</span>
            <span><i class="fa-solid fa-calendar-day"></i> ${apts.length} Appointments Dossiers</span>
            <span><i class="fa-solid fa-timeline"></i> ${timeline.length} Journey Milestones</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions Grid -->
      <div class="card" style="margin-bottom: 28px;">
        <div class="card-title" style="font-size: 16px; margin-bottom: 16px;">
          <i class="fa-solid fa-bolt" style="color: var(--primary-pink);"></i> Quick Actions
        </div>
        <div class="quick-actions-grid">
          <button class="action-tile" onclick="utils.openModal('uploadModal')">
            <i class="fa-solid fa-upload tile-icon"></i>
            <span class="tile-label">Upload Record</span>
            <span class="tile-desc">Preserve raw document & extract</span>
          </button>
          <button class="action-tile" onclick="app.navigateTo('timeline-view')">
            <i class="fa-solid fa-timeline tile-icon"></i>
            <span class="tile-label">View Timeline</span>
            <span class="tile-desc">Chronological care journey</span>
          </button>
          <button class="action-tile" onclick="app.navigateTo('appointments-view')">
            <i class="fa-solid fa-stethoscope tile-icon"></i>
            <span class="tile-label">Prepare Visit</span>
            <span class="tile-desc">Dossier & question builder</span>
          </button>
          <button class="action-tile" onclick="app.navigateTo('packages-view')">
            <i class="fa-solid fa-box-archive tile-icon"></i>
            <span class="tile-label">Create Package</span>
            <span class="tile-desc">Export curated clinical packet</span>
          </button>
        </div>
      </div>

      <!-- Dashboard Main Grid -->
      <div class="dashboard-grid">
        <div>
          <!-- Upcoming Visit Highlight -->
          ${upcomingApt ? `
            <div class="appointment-highlight-card">
              <div class="appointment-date-badge">
                <i class="fa-solid fa-calendar"></i> Next Visit: ${upcomingApt.date} • ${upcomingApt.time}
              </div>
              <h3>${upcomingApt.title}</h3>
              <div class="provider-info" style="margin-top: 8px;">
                <p><i class="fa-solid fa-user-doctor"></i> ${upcomingApt.provider} (${upcomingApt.specialty})</p>
                <p><i class="fa-solid fa-location-dot"></i> ${upcomingApt.location}</p>
              </div>
              <div class="appointment-details">
                <span style="font-size: 13px;">${upcomingApt.linkedDocIds.length} Linked Documents</span>
                <button class="btn btn-outline" style="background: white; color: var(--dark-pink);" onclick="app.navigateTo('appointments-view')">
                  Open Dossier
                </button>
              </div>
            </div>
          ` : ''}

          <!-- Recent Preserved Records -->
          <div class="card">
            <div class="card-header">
              <div class="card-title"><i class="fa-solid fa-file-medical"></i> Recent Preserved Evidence</div>
              <button class="btn btn-outline btn-sm" onclick="app.navigateTo('vault-view')">View Vault</button>
            </div>
            <div class="document-grid">
              ${docs.slice(0, 3).map(d => VaultModule.createDocCardHTML(d)).join('')}
            </div>
          </div>
        </div>

        <!-- Right Column: Provenance Legend & Verification Status -->
        <div>
          <div class="card" style="border-left: 4px solid var(--primary-pink);">
            <div class="card-title" style="margin-bottom: 12px; font-size: 16px;">
              <i class="fa-solid fa-shield-halved" style="color: var(--primary-pink);"></i> Provenance System
            </div>
            <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 14px;">
              Every record preserves original evidence. Derived fields & AI summaries are visually distinguished.
            </p>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              <span class="badge-prov original"><i class="fa-solid fa-file-pdf"></i> Original → Source File</span>
              <span class="badge-prov extracted"><i class="fa-solid fa-robot"></i> Extracted → OCR Field</span>
              <span class="badge-prov user"><i class="fa-solid fa-user-check"></i> User-Entered → Patient Input</span>
              <span class="badge-prov suggested"><i class="fa-solid fa-wand-magic-sparkles"></i> Suggested → Awaiting Check</span>
              <span class="badge-prov generated"><i class="fa-solid fa-sparkles"></i> Generated → AI Packet/Summary</span>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // Staged Processing Animation Simulation (Phase 2 Upload Pipeline)
  startStagedUploadSimulation(fileObj) {
    const dropzone = document.getElementById('fileDropzone');
    const progressArea = document.getElementById('uploadProgressArea');
    const stagesContainer = document.getElementById('stagedProcessingSteps');

    if (dropzone) dropzone.style.display = 'none';
    if (progressArea) progressArea.style.display = 'block';

    const stages = [
      '1. Uploading file securely...',
      '2. Preserving raw original artifact...',
      '3. Reading document OCR layout...',
      '4. Extracting metadata & dates...',
      '5. Classifying document category...',
      '6. Matching appointment & care context...',
      '7. Verification complete — Saved to Medical Vault!'
    ];

    let currentStep = 0;

    const renderSteps = () => {
      if (!stagesContainer) return;
      stagesContainer.innerHTML = stages.map((stg, i) => {
        let cls = 'processing-step';
        if (i < currentStep) cls += ' done';
        if (i === currentStep) cls += ' active';
        return `<div class="${cls}"><i class="fa-solid ${i < currentStep ? 'fa-circle-check' : (i === currentStep ? 'fa-spinner fa-spin' : 'fa-circle')}"></i> <span>${stg}</span></div>`;
      }).join('');
    };

    renderSteps();

    const interval = setInterval(() => {
      currentStep++;
      renderSteps();

      if (currentStep >= stages.length - 1) {
        clearInterval(interval);

        // Ingest new document into state for active case
        const newDoc = {
          id: 'doc_ingested_' + Date.now(),
          caseId: store.getState().activeCaseId,
          title: fileObj.name.replace(/\.[^/.]+$/, "") || 'Uploaded Medical Record',
          documentType: 'Laboratory',
          originalFileName: fileObj.name,
          date: new Date().toISOString().split('T')[0],
          dateType: 'report date',
          provider: 'Apollo Clinical Diagnostic Labs',
          facility: 'Apollo Cancer Centre',
          status: 'Verified',
          source: 'PDF',
          appointmentId: 'apt_02',
          careEventId: 'evt_04',
          tags: ['Uploaded', 'Lab Work'],
          originalContent: `RAW PRESERVED RECORD CONTENT\nFile: ${fileObj.name}\nTimestamp: ${new Date().toLocaleString()}`,
          extractedData: {
            specimen: { value: 'Blood Panel', confidence: 0.96, provenance: 'Extracted' },
            status: { value: 'Normal', confidence: 0.94, provenance: 'Extracted' }
          },
          confidence: 0.96,
          provenance: 'Extracted',
          uploadedAt: new Date().toISOString(),
          fileSize: (fileObj.size ? (fileObj.size / 1024 / 1024).toFixed(1) + ' MB' : '1.5 MB'),
          summary: 'Newly uploaded medical record ingested into Medical Vault with verified OCR extractions.'
        };

        store.addDocument(newDoc);

        setTimeout(() => {
          utils.closeModal('uploadModal');
          utils.showToast(`Document "${fileObj.name}" successfully ingested & preserved!`, 'success');
          app.renderCurrentView();
        }, 800);
      }
    }, 500);
  }
};

window.HomeModule = HomeModule;
