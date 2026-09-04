/* ==========================================================================
   CareChronicle - Application Controller & View Renderers (v2.0)
   Handles SPA routing, state rendering, Document Intelligence simulation,
   modal popups, and export package generation.
   ========================================================================== */

const app = {
  activeView: 'home-view',
  activeVaultFilter: 'all',

  init() {
    this.bindNavigation();
    this.bindSearch();
    this.bindUploadDropzone();
    this.renderActiveView();
    this.renderCaregivers();
  },

  // ------------------------------------------------------------------------
  // SPA Navigation & Routing
  // ------------------------------------------------------------------------
  bindNavigation() {
    const navButtons = document.querySelectorAll('.nav-item button');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetView = btn.getAttribute('data-target');
        this.switchView(targetView);
      });
    });

    // Vault Filter Pills
    const filterButtons = document.querySelectorAll('#vaultFilterPills button');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active', 'btn-secondary'));
        filterButtons.forEach(b => b.classList.add('btn-outline'));
        
        btn.classList.remove('btn-outline');
        btn.classList.add('active', 'btn-secondary');
        
        this.activeVaultFilter = btn.getAttribute('data-filter');
        this.renderVault();
      });
    });
  },

  switchView(targetViewId) {
    this.activeView = targetViewId;

    // Update Sidebar Navigation state
    document.querySelectorAll('.nav-item').forEach(item => {
      const button = item.querySelector('button');
      if (button.getAttribute('data-target') === targetViewId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Update Panels
    document.querySelectorAll('.view-panel').forEach(panel => {
      if (panel.id === targetViewId) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });

    this.renderActiveView();
  },

  renderActiveView() {
    switch (this.activeView) {
      case 'home-view':
        this.renderHome();
        break;
      case 'vault-view':
        this.renderVault();
        break;
      case 'appointments-view':
        this.renderAppointments();
        break;
      case 'timeline-view':
        this.renderTimeline();
        break;
      case 'what-changed-view':
        this.renderWhatChanged('cbc');
        break;
      case 'packages-view':
        // Packages view is static buttons
        break;
      case 'access-view':
        this.renderCaregivers();
        break;
    }
  },

  // ------------------------------------------------------------------------
  // 1. Home View Renderer
  // ------------------------------------------------------------------------
  renderHome() {
    const docs = CareState.getCaseDocuments();
    const recentDocsGrid = document.getElementById('recentDocsGrid');
    if (!recentDocsGrid) return;

    recentDocsGrid.innerHTML = docs.slice(0, 4).map(doc => this.createDocCardHTML(doc)).join('');
  },

  // ------------------------------------------------------------------------
  // 2. Vault Renderer & Search Filter
  // ------------------------------------------------------------------------
  renderVault() {
    let docs = CareState.getCaseDocuments();
    
    if (this.activeVaultFilter !== 'all') {
      docs = docs.filter(d => d.category === this.activeVaultFilter);
    }

    const searchVal = document.getElementById('globalSearchInput').value.toLowerCase().trim();
    if (searchVal) {
      docs = docs.filter(d => 
        d.title.toLowerCase().includes(searchVal) ||
        d.category.toLowerCase().includes(searchVal) ||
        d.provider.toLowerCase().includes(searchVal) ||
        d.summary.toLowerCase().includes(searchVal)
      );
    }

    const fullVaultGrid = document.getElementById('fullVaultGrid');
    if (!fullVaultGrid) return;

    if (docs.length === 0) {
      fullVaultGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
          <i class="fa-solid fa-folder-open" style="font-size: 40px; margin-bottom: 12px; color: var(--soft-pink);"></i>
          <p>No medical records match your selected filter.</p>
        </div>
      `;
    } else {
      fullVaultGrid.innerHTML = docs.map(doc => this.createDocCardHTML(doc)).join('');
    }
  },

  bindSearch() {
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        if (this.activeView !== 'vault-view') {
          this.switchView('vault-view');
        } else {
          this.renderVault();
        }
      });
    }
  },

  createDocCardHTML(doc) {
    const provBadgeClass = doc.provenance.toLowerCase();
    let categoryIcon = 'fa-file-medical';

    switch (doc.category) {
      case 'Pathology': categoryIcon = 'fa-microscope'; break;
      case 'Lab Results': categoryIcon = 'fa-vial'; break;
      case 'Imaging': categoryIcon = 'fa-x-ray'; break;
      case 'Doctor Note': categoryIcon = 'fa-user-doctor'; break;
      case 'Prescription': categoryIcon = 'fa-pills'; break;
      case 'Billing': categoryIcon = 'fa-receipt'; break;
    }

    return `
      <div class="doc-card" onclick="app.openDocDetailModal('${doc.id}')">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="doc-type-icon">
              <i class="fa-solid ${categoryIcon}"></i>
            </div>
            <span class="badge-prov ${provBadgeClass}">${doc.provenance}</span>
          </div>
          <div class="doc-title">${doc.title}</div>
          <div class="doc-meta">
            <span><i class="fa-regular fa-calendar"></i> ${doc.documentDate}</span>
            <span><i class="fa-regular fa-building"></i> ${doc.facility}</span>
          </div>
        </div>
        <div class="doc-footer">
          <span style="font-size: 11px; color: var(--status-success); font-weight: 600;">
            <i class="fa-solid fa-circle-check"></i> ${doc.verificationState}
          </span>
          <span style="font-size: 12px; color: var(--primary-pink); font-weight: 600;">
            View Source <i class="fa-solid fa-arrow-right"></i>
          </span>
        </div>
      </div>
    `;
  },

  // ------------------------------------------------------------------------
  // 3. Appointments Dossier Renderer
  // ------------------------------------------------------------------------
  renderAppointments() {
    const appointments = CareState.getCaseAppointments();
    const container = document.getElementById('appointmentDossierContainer');
    if (!container) return;

    const upcomingApt = appointments.find(a => a.status === 'Upcoming') || appointments[0];
    const linkedDocs = CareState.documents.filter(d => upcomingApt.linkedDocIds.includes(d.id));

    container.innerHTML = `
      <div class="card" style="border-top: 4px solid var(--primary-pink);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
          <div>
            <span class="badge-prov generated" style="margin-bottom: 8px;">Dossier Workspace</span>
            <h2 style="font-size: 22px;">${upcomingApt.title}</h2>
            <p style="color: var(--text-muted); font-size: 14px; margin-top: 4px;">
              <i class="fa-solid fa-calendar"></i> ${upcomingApt.date} at ${upcomingApt.time} • ${upcomingApt.provider} (${upcomingApt.location})
            </p>
          </div>
          <span style="background: var(--light-pink); color: var(--dark-pink); font-weight: 700; padding: 6px 14px; border-radius: 20px; font-size: 13px;">
            ${upcomingApt.status}
          </span>
        </div>

        <!-- "Since Last Visit" Delta Summary Card -->
        <div style="background: var(--ultra-light-pink); border: 1px solid var(--soft-pink); border-radius: var(--radius-md); padding: 18px; margin-bottom: 24px;">
          <div style="font-weight: 700; font-size: 14px; color: var(--dark-pink); margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-sparkles" style="color: var(--primary-pink);"></i> AI "Since Your Last Visit" Delta Summary
          </div>
          <p style="font-size: 14px; color: var(--text-main); line-height: 1.5;">
            ${upcomingApt.sinceLastVisitSummary}
          </p>
          <div style="margin-top: 10px; font-size: 11px; color: var(--text-muted);">
            <i class="fa-solid fa-link"></i> Linked to 2 verified evidence records: <a href="#" onclick="app.openDocDetailModal('doc_lab_cbc_01'); return false;">CBC & CMP (Sept 2)</a> and <a href="#" onclick="app.openDocDetailModal('doc_bill_01'); return false;">Infusion Receipt (Sept 1)</a>.
          </div>
        </div>

        <!-- Patient Questions Builder -->
        <div style="margin-bottom: 24px;">
          <div class="card-header">
            <div class="card-title" style="font-size: 16px;">
              <i class="fa-solid fa-circle-question"></i> Prepared Patient Questions (${upcomingApt.patientQuestions.length})
            </div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px;" id="questionsList">
            ${upcomingApt.patientQuestions.map((q, idx) => `
              <div style="background: white; border: 1px solid var(--soft-pink); border-radius: var(--radius-sm); padding: 12px; font-size: 14px; display: flex; justify-content: space-between; align-items: center;">
                <span><strong>Q${idx+1}:</strong> ${q}</span>
                <span class="badge-prov user">User-Entered</span>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; gap: 10px;">
            <input type="text" id="newQuestionInput" class="btn btn-outline" style="flex: 1; text-align: left; background: white;" placeholder="Type a question for your doctor...">
            <button class="btn btn-primary btn-sm" onclick="app.addQuestion('${upcomingApt.id}')">Add Question</button>
          </div>
        </div>

        <!-- Linked Documents Dossier -->
        <div>
          <div class="card-title" style="font-size: 16px; margin-bottom: 14px;">
            <i class="fa-solid fa-paperclip"></i> Linked Medical Records for this Visit (${linkedDocs.length})
          </div>
          <div class="document-grid">
            ${linkedDocs.map(d => this.createDocCardHTML(d)).join('')}
          </div>
        </div>
      </div>
    `;
  },

  addQuestion(aptId) {
    const input = document.getElementById('newQuestionInput');
    if (!input || !input.value.trim()) return;

    CareState.addPatientQuestion(aptId, input.value.trim());
    this.showToast('Question added to visit dossier!');
    this.renderAppointments();
  },

  generateDoctorSummary() {
    const modalTitle = document.getElementById('packageModalTitle');
    const modalBody = document.getElementById('packageModalBody');
    if (!modalTitle || !modalBody) return;

    modalTitle.innerText = '1-Page Clinical Visit Summary';
    modalBody.innerHTML = `
      <div style="border: 1px solid var(--soft-pink); border-radius: var(--radius-md); padding: 20px; background: white;">
        <div style="text-align: center; border-bottom: 2px solid var(--primary-pink); padding-bottom: 12px; margin-bottom: 16px;">
          <h2 style="font-size: 20px;">CARECHRONICLE PATIENT CLINICAL SUMMARY</h2>
          <p style="font-size: 12px; color: var(--text-muted);">Patient: Eleanor Vance (DOB: 1972-04-12) • Medical Case: Stage II Breast Cancer</p>
        </div>

        <div style="margin-bottom: 14px;">
          <h4 style="font-size: 14px; color: var(--dark-pink);">1. RECENT CARE EVENTS & DELTAS</h4>
          <p style="font-size: 13px; color: var(--text-main);">• 2026-09-02: Blood Work — WBC 4.2 x10^3/uL, Hgb 11.8 g/dL (Mild drop), Platelets 210 x10^3/uL.<br>• 2026-09-01: Chemotherapy Cycle 1 Infusion administered without acute reaction.</p>
        </div>

        <div style="margin-bottom: 14px;">
          <h4 style="font-size: 14px; color: var(--dark-pink);">2. PRIMARY PATHOLOGY SUMMARY</h4>
          <p style="font-size: 13px; color: var(--text-main);">Invasive Ductal Carcinoma, Grade 2 (ER+ 90%, PR+ 70%, HER2 3+ IHC). [Source: Pathology Report 2026-08-18]</p>
        </div>

        <div style="margin-bottom: 16px;">
          <h4 style="font-size: 14px; color: var(--dark-pink);">3. PATIENT QUESTIONS FOR CONSULTATION</h4>
          <p style="font-size: 13px; color: var(--text-main);">1. Anti-nausea medication timing adjustment.<br>2. Evaluation of mild anemia (Hgb 11.8).</p>
        </div>

        <div style="text-align: right; border-top: 1px solid var(--light-pink); padding-top: 12px;">
          <button class="btn btn-primary btn-sm" onclick="app.showToast('1-Page PDF Summary Downloaded!'); app.closeModal('packageModal');">
            <i class="fa-solid fa-download"></i> Download PDF
          </button>
        </div>
      </div>
    `;
    this.openModal('packageModal');
  },

  // ------------------------------------------------------------------------
  // 4. Care Timeline Renderer
  // ------------------------------------------------------------------------
  renderTimeline() {
    const timeline = CareState.getCaseTimeline();
    const container = document.getElementById('timelineList');
    if (!container) return;

    container.innerHTML = timeline.map(evt => {
      const linkedDoc = CareState.documents.find(d => d.id === evt.linkedDocId);
      return `
        <div class="timeline-item">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <span class="timeline-date">${evt.date}</span>
              <span class="badge-prov original">${evt.category}</span>
            </div>
            <div class="timeline-title">${evt.title}</div>
            <div class="timeline-description">${evt.description}</div>
            ${linkedDoc ? `
              <div class="timeline-evidence">
                <button class="btn btn-outline btn-sm" onclick="app.openDocDetailModal('${linkedDoc.id}')">
                  <i class="fa-solid fa-file-pdf" style="color: var(--primary-pink);"></i> View Source Record (${linkedDoc.title})
                </button>
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  },

  // ------------------------------------------------------------------------
  // 5. "What Changed?" Evidence Comparison Renderer
  // ------------------------------------------------------------------------
  renderWhatChanged(type = 'cbc') {
    const container = document.getElementById('comparisonContent');
    const select = document.getElementById('comparisonSelect');
    if (!container) return;

    if (select) {
      select.onchange = (e) => this.renderWhatChanged(e.target.value);
    }

    if (type === 'cbc') {
      container.innerHTML = `
        <div class="card" style="border-top: 4px solid var(--primary-pink); margin-bottom: 20px;">
          <div style="font-weight: 700; font-size: 15px; color: var(--dark-pink); margin-bottom: 8px;">
            <i class="fa-solid fa-code-compare"></i> Extracted Differences: Mid-Cycle Blood Work (Sept 2) vs Baseline (Aug 20)
          </div>
          <p style="font-size: 13px; color: var(--text-muted);">
            CareChronicle surfaces recorded value changes directly from lab reports with source document provenance links.
          </p>
        </div>

        <div class="comparison-grid">
          <div class="comparison-column">
            <div class="comparison-header">
              <span class="badge-prov original">Prior Baseline</span>
              <h3 style="font-size: 16px; margin-top: 4px;">Baseline Blood Panel (2026-08-20)</h3>
              <p style="font-size: 12px; color: var(--text-muted);">St. Jude Cancer Center Labs</p>
            </div>
            <div class="comparison-item">
              <span>White Blood Cells (WBC)</span>
              <strong>5.8 x10^3/uL</strong>
            </div>
            <div class="comparison-item">
              <span>Hemoglobin (Hgb)</span>
              <strong>12.6 g/dL</strong>
            </div>
            <div class="comparison-item">
              <span>Platelet Count</span>
              <strong>245 x10^3/uL</strong>
            </div>
            <div class="comparison-item">
              <span>ALT (Liver Enzyme)</span>
              <strong>21 U/L</strong>
            </div>
          </div>

          <div class="comparison-column" style="border-color: var(--primary-pink);">
            <div class="comparison-header">
              <span class="badge-prov extracted">Latest Record</span>
              <h3 style="font-size: 16px; margin-top: 4px;">Mid-Cycle Panel (2026-09-02)</h3>
              <p style="font-size: 12px; color: var(--text-muted);">St. Jude Cancer Center Labs</p>
            </div>
            <div class="comparison-item">
              <span>White Blood Cells (WBC)</span>
              <div>
                <strong>4.2 x10^3/uL</strong>
                <span class="delta-indicator unchanged">Normal (-1.6)</span>
              </div>
            </div>
            <div class="comparison-item">
              <span>Hemoglobin (Hgb)</span>
              <div>
                <strong>11.8 g/dL</strong>
                <span class="delta-indicator increased">Mild Drop (-0.8)</span>
              </div>
            </div>
            <div class="comparison-item">
              <span>Platelet Count</span>
              <div>
                <strong>210 x10^3/uL</strong>
                <span class="delta-indicator unchanged">Normal (-35)</span>
              </div>
            </div>
            <div class="comparison-item">
              <span>ALT (Liver Enzyme)</span>
              <div>
                <strong>24 U/L</strong>
                <span class="delta-indicator unchanged">Normal (+3)</span>
              </div>
            </div>
          </div>
        </div>

        <div style="text-align: right;">
          <button class="btn btn-outline btn-sm" onclick="app.openDocDetailModal('doc_lab_cbc_01')">
            <i class="fa-solid fa-file-pdf"></i> View Source Document (doc_lab_cbc_01)
          </button>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="card" style="border-top: 4px solid var(--primary-pink); margin-bottom: 20px;">
          <div style="font-weight: 700; font-size: 15px; color: var(--dark-pink); margin-bottom: 8px;">
            <i class="fa-solid fa-code-compare"></i> Extracted Differences: Diagnostic MRI (Aug 14) vs Initial Ultrasound
          </div>
        </div>
        <div class="comparison-grid">
          <div class="comparison-column">
            <div class="comparison-header">
              <span class="badge-prov original">Ultrasound</span>
              <h3 style="font-size: 16px; margin-top: 4px;">Initial Ultrasound (2026-08-05)</h3>
            </div>
            <div class="comparison-item">
              <span>Lesion Measurement</span>
              <strong>2.1 cm Mass</strong>
            </div>
            <div class="comparison-item">
              <span>BI-RADS Classification</span>
              <strong>Category 4C</strong>
            </div>
          </div>
          <div class="comparison-column" style="border-color: var(--primary-pink);">
            <div class="comparison-header">
              <span class="badge-prov extracted">Diagnostic MRI</span>
              <h3 style="font-size: 16px; margin-top: 4px;">Diagnostic MRI (2026-08-14)</h3>
            </div>
            <div class="comparison-item">
              <span>Lesion Measurement</span>
              <div>
                <strong>2.3 cm Mass</strong>
                <span class="delta-indicator increased">+0.2 cm</span>
              </div>
            </div>
            <div class="comparison-item">
              <span>BI-RADS Classification</span>
              <div>
                <strong>Category 5</strong>
                <span class="delta-indicator increased">Confirmed</span>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  },

  // ------------------------------------------------------------------------
  // 6. Action Package Builders
  // ------------------------------------------------------------------------
  openPackageModal(type) {
    const modalTitle = document.getElementById('packageModalTitle');
    const modalBody = document.getElementById('packageModalBody');
    if (!modalTitle || !modalBody) return;

    const docs = CareState.getCaseDocuments();

    if (type === 'second-opinion') {
      modalTitle.innerText = 'Build Second Opinion Package';
      modalBody.innerHTML = `
        <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 16px;">
          Select medical records to include in the Second Opinion clinical packet. A chronological index will be generated with original PDF attachments.
        </p>

        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; max-height: 250px; overflow-y: auto;">
          ${docs.map(d => `
            <label style="display: flex; items-center: center; gap: 10px; padding: 10px; border: 1px solid var(--soft-pink); border-radius: var(--radius-sm); font-size: 13px;">
              <input type="checkbox" checked value="${d.id}">
              <span><strong>[${d.category}]</strong> ${d.title} (${d.documentDate})</span>
            </label>
          `).join('')}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 12px; color: var(--text-muted);">${docs.length} Documents Selected</span>
          <button class="btn btn-primary" onclick="app.showToast('Second Opinion Package Exported (ZIP + Index PDF)'); app.closeModal('packageModal');">
            <i class="fa-solid fa-download"></i> Export Packet
          </button>
        </div>
      `;
    } else {
      modalTitle.innerText = 'Build Insurance Claims Bundle';
      modalBody.innerHTML = `
        <p style="font-size: 14px; color: var(--text-muted); margin-bottom: 16px;">
          Collates hospital invoices, diagnostic reports, and discharge notes. CareChronicle highlights document presence transparently.
        </p>

        <div style="background: var(--ultra-light-pink); border: 1px solid var(--soft-pink); border-radius: var(--radius-md); padding: 14px; margin-bottom: 16px; font-size: 13px;">
          <div style="font-weight: 700; color: var(--dark-pink); margin-bottom: 6px;">Document Presence Checklist:</div>
          <div style="color: var(--status-success);"><i class="fa-solid fa-circle-check"></i> Chemotherapy Infusion Receipt ($14,250.00) — Found</div>
          <div style="color: var(--status-success);"><i class="fa-solid fa-circle-check"></i> Initial Consultation Note — Found</div>
          <div style="color: var(--status-warning);"><i class="fa-solid fa-circle-exclamation"></i> Pre-Authorization Approval Form — Not found in CareChronicle</div>
        </div>

        <div style="text-align: right;">
          <button class="btn btn-primary" onclick="app.showToast('Insurance Bundle Exported!'); app.closeModal('packageModal');">
            <i class="fa-solid fa-download"></i> Export Insurance Bundle
          </button>
        </div>
      `;
    }

    this.openModal('packageModal');
  },

  // ------------------------------------------------------------------------
  // 7. Document Intelligence Upload Simulation
  // ------------------------------------------------------------------------
  bindUploadDropzone() {
    const openBtn = document.getElementById('openUploadBtn');
    const fileInput = document.getElementById('fileInput');
    const dropzone = document.getElementById('fileDropzone');

    if (openBtn) openBtn.onclick = () => this.openUploadModal();

    if (fileInput) {
      fileInput.onchange = (e) => {
        if (e.target.files.length > 0) {
          this.processSimulatedUpload(e.target.files[0].name);
        }
      };
    }
  },

  openUploadModal() {
    document.getElementById('uploadProgressArea').style.display = 'none';
    document.getElementById('fileDropzone').style.display = 'block';
    this.openModal('uploadModal');
  },

  processSimulatedUpload(fileName) {
    document.getElementById('fileDropzone').style.display = 'none';
    const progressArea = document.getElementById('uploadProgressArea');
    const progressBar = document.getElementById('uploadProgressBar');
    const statusText = document.getElementById('uploadStatusText');

    progressArea.style.display = 'block';
    progressBar.style.width = '10%';
    statusText.innerText = '1/4 Encrypting & Preserving Original File...';

    setTimeout(() => {
      progressBar.style.width = '45%';
      statusText.innerText = '2/4 Running Document Intelligence OCR Engine...';
    }, 800);

    setTimeout(() => {
      progressBar.style.width = '80%';
      statusText.innerText = '3/4 Extracting Metadata, Provider & Appointment Links...';
    }, 1600);

    setTimeout(() => {
      progressBar.style.width = '100%';
      statusText.innerText = '4/4 Extraction Complete! Preserved in Medical Vault.';

      // Add new document to state
      const newDoc = {
        id: 'doc_uploaded_' + Date.now(),
        caseId: CareState.activeCaseId,
        title: fileName.replace(/\.[^/.]+$/, "") || 'Uploaded Medical Record',
        category: 'Lab Results',
        documentDate: new Date().toISOString().split('T')[0],
        provider: 'St. Jude Diagnostic Services',
        facility: 'St. Jude Cancer Center',
        appointmentId: 'apt_upcoming_02',
        provenance: 'EXTRACTED',
        verificationState: 'Verified',
        confidenceScore: 0.94,
        fileSize: '1.8 MB',
        summary: 'Uploaded record extracted successfully with verified OCR metadata.',
        extractedData: {
          status: 'Normal',
          source: fileName
        }
      };

      CareState.addDocument(newDoc);

      setTimeout(() => {
        this.closeModal('uploadModal');
        this.showToast(`Document "${fileName}" successfully ingested & preserved!`);
        this.renderActiveView();
      }, 600);

    }, 2400);
  },

  // ------------------------------------------------------------------------
  // 8. Document Detail Viewer Modal
  // ------------------------------------------------------------------------
  openDocDetailModal(docId) {
    const doc = CareState.documents.find(d => d.id === docId);
    if (!doc) return;

    const modalTitle = document.getElementById('modalDocTitle');
    const modalProv = document.getElementById('modalDocProv');
    const modalBody = document.getElementById('modalDocBody');

    modalTitle.innerText = doc.title;
    modalProv.innerText = doc.provenance;
    modalProv.className = `badge-prov ${doc.provenance.toLowerCase()}`;

    modalBody.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <div style="background: var(--ultra-light-pink); border: 1px solid var(--soft-pink); border-radius: var(--radius-md); padding: 16px;">
          <div style="font-size: 12px; font-weight: 700; color: var(--dark-pink); text-transform: uppercase; margin-bottom: 8px;">Metadata & Lineage</div>
          <div style="font-size: 13px; display: flex; flex-direction: column; gap: 6px;">
            <div><strong>Category:</strong> ${doc.category}</div>
            <div><strong>Document Date:</strong> ${doc.documentDate}</div>
            <div><strong>Provider:</strong> ${doc.provider}</div>
            <div><strong>Facility:</strong> ${doc.facility}</div>
            <div><strong>File Size:</strong> ${doc.fileSize}</div>
            <div><strong>Verification:</strong> <span style="color: var(--status-success); font-weight: 600;"><i class="fa-solid fa-circle-check"></i> ${doc.verificationState} (${Math.round(doc.confidenceScore * 100)}% Confidence)</span></div>
          </div>
        </div>

        <div style="background: #FFFFFF; border: 1px solid var(--soft-pink); border-radius: var(--radius-md); padding: 16px;">
          <div style="font-size: 12px; font-weight: 700; color: var(--dark-pink); text-transform: uppercase; margin-bottom: 8px;">AI Extracted Entities</div>
          <pre style="font-size: 12px; font-family: monospace; white-space: pre-wrap; background: var(--neutral-surface); padding: 10px; border-radius: 6px; color: var(--text-main);">${JSON.stringify(doc.extractedData, null, 2)}</pre>
        </div>
      </div>

      <div style="background: var(--ultra-light-pink); border: 1px solid var(--soft-pink); border-radius: var(--radius-md); padding: 16px; margin-bottom: 20px;">
        <div style="font-size: 12px; font-weight: 700; color: var(--dark-pink); text-transform: uppercase; margin-bottom: 6px;">
          <i class="fa-solid fa-sparkles"></i> Provenance Summary
        </div>
        <p style="font-size: 13px; color: var(--text-main);">${doc.summary}</p>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center;">
        <button class="btn btn-outline btn-sm" onclick="app.showToast('Original PDF Downloaded!');">
          <i class="fa-solid fa-file-pdf" style="color: var(--primary-pink);"></i> Download Original Source PDF
        </button>
        <button class="btn btn-secondary btn-sm" onclick="app.closeModal('docDetailModal');">Close</button>
      </div>
    `;

    this.openModal('docDetailModal');
  },

  // ------------------------------------------------------------------------
  // 9. Caregiver Access Renderer
  // ------------------------------------------------------------------------
  renderCaregivers() {
    const list = document.getElementById('caregiversList');
    if (!list) return;

    list.innerHTML = CareState.caregivers.map(cg => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--light-pink);">
        <div>
          <div style="font-weight: 600; font-size: 14px;">${cg.name} (${cg.relation})</div>
          <div style="font-size: 12px; color: var(--text-muted);">${cg.email} • Granted ${cg.accessGrantedDate}</div>
        </div>
        <div>
          <span class="badge-prov original" style="margin-right: 10px;">${cg.role}</span>
          <button class="btn btn-outline btn-sm" onclick="app.showToast('Permissions updated');">Edit Access</button>
        </div>
      </div>
    `).join('');
  },

  // ------------------------------------------------------------------------
  // UI Helpers: Modals & Toasts
  // ------------------------------------------------------------------------
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  },

  showToast(message) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: var(--primary-pink);"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideInRight 0.3s ease reverse forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};

// Initialize Application when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});

window.app = app;
