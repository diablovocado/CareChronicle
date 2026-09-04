/* ==========================================================================
   CareChronicle - Medical Vault & Ingestion Module (v2.0 Phase 2 Complete)
   ========================================================================== */

const VaultModule = {
  filters: {
    type: 'all',
    provider: 'all',
    provenance: 'all',
    status: 'all',
    dateType: 'all'
  },

  render() {
    const container = document.getElementById('vault-view');
    if (!container) return;

    let docs = store.getActiveDocuments();
    const activeCase = store.getActiveCase();

    // Apply Filters
    if (this.filters.type !== 'all') {
      docs = docs.filter(d => d.documentType === this.filters.type);
    }
    if (this.filters.provider !== 'all') {
      docs = docs.filter(d => d.provider === this.filters.provider);
    }
    if (this.filters.provenance !== 'all') {
      docs = docs.filter(d => d.provenance === this.filters.provenance);
    }
    if (this.filters.status !== 'all') {
      docs = docs.filter(d => d.status === this.filters.status);
    }
    if (this.filters.dateType !== 'all') {
      docs = docs.filter(d => d.dateType === this.filters.dateType);
    }

    // Apply Search
    const searchVal = (store.getState().ui.searchQuery || '').toLowerCase().trim();
    if (searchVal) {
      docs = docs.filter(d => 
        d.title.toLowerCase().includes(searchVal) ||
        d.documentType.toLowerCase().includes(searchVal) ||
        d.provider.toLowerCase().includes(searchVal) ||
        d.facility.toLowerCase().includes(searchVal) ||
        d.summary.toLowerCase().includes(searchVal) ||
        (d.tags && d.tags.some(t => t.toLowerCase().includes(searchVal))) ||
        d.date.includes(searchVal)
      );
    }

    // Unverified Count Notice
    const unverifiedDocs = store.getUnverifiedDocuments();

    // Unique Providers List for Filter
    const allProviders = Array.from(new Set(store.getActiveDocuments().map(d => d.provider)));

    container.innerHTML = `
      <!-- View Header -->
      <div class="view-header">
        <div>
          <h1 class="view-title">Medical Vault</h1>
          <p class="view-subtitle">Immutable medical records for <strong>${activeCase.name}</strong>. Raw evidence preserved as source of truth.</p>
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

      <!-- Filters & Search Toolbar Card -->
      <div class="card" style="margin-bottom: 24px; padding: 18px;">
        <div style="display: flex; gap: 12px; flex-wrap: wrap; align-items: center; justify-content: space-between;">
          <div style="display: flex; gap: 10px; flex-wrap: wrap; align-items: center;">
            <!-- Document Type Filter -->
            <select class="chip" onchange="VaultModule.setFilter('type', this.value)">
              <option value="all" ${this.filters.type === 'all' ? 'selected' : ''}>Type: All Document Types</option>
              <option value="Pathology" ${this.filters.type === 'Pathology' ? 'selected' : ''}>Pathology</option>
              <option value="Imaging" ${this.filters.type === 'Imaging' ? 'selected' : ''}>Imaging</option>
              <option value="Laboratory" ${this.filters.type === 'Laboratory' ? 'selected' : ''}>Laboratory</option>
              <option value="Prescription" ${this.filters.type === 'Prescription' ? 'selected' : ''}>Prescription</option>
              <option value="Consultation Note" ${this.filters.type === 'Consultation Note' ? 'selected' : ''}>Consultation Note</option>
              <option value="Cardiology" ${this.filters.type === 'Cardiology' ? 'selected' : ''}>Cardiology</option>
            </select>

            <!-- Provider Filter -->
            <select class="chip" onchange="VaultModule.setFilter('provider', this.value)">
              <option value="all" ${this.filters.provider === 'all' ? 'selected' : ''}>Provider: All Providers</option>
              ${allProviders.map(p => `<option value="${p}" ${this.filters.provider === p ? 'selected' : ''}>${p}</option>`).join('')}
            </select>

            <!-- Provenance Filter -->
            <select class="chip" onchange="VaultModule.setFilter('provenance', this.value)">
              <option value="all" ${this.filters.provenance === 'all' ? 'selected' : ''}>Provenance: All Provenance</option>
              <option value="Original" ${this.filters.provenance === 'Original' ? 'selected' : ''}>Original</option>
              <option value="Extracted" ${this.filters.provenance === 'Extracted' ? 'selected' : ''}>Extracted</option>
              <option value="User-Entered" ${this.filters.provenance === 'User-Entered' ? 'selected' : ''}>User-Entered</option>
              <option value="Suggested" ${this.filters.provenance === 'Suggested' ? 'selected' : ''}>Suggested</option>
            </select>

            <!-- Status Filter -->
            <select class="chip" onchange="VaultModule.setFilter('status', this.value)">
              <option value="all" ${this.filters.status === 'all' ? 'selected' : ''}>Status: All Statuses</option>
              <option value="Verified" ${this.filters.status === 'Verified' ? 'selected' : ''}>Verified</option>
              <option value="Verification Required" ${this.filters.status === 'Verification Required' ? 'selected' : ''}>Verification Required</option>
            </select>
          </div>

          <!-- Clear All Filters -->
          <button class="btn btn-outline btn-sm" onclick="VaultModule.clearAllFilters()">
            <i class="fa-solid fa-filter-circle-xmark"></i> Clear All
          </button>
        </div>
      </div>

      <!-- Vault Grid / List -->
      ${docs.length === 0 ? utils.createEmptyState('No Medical Records Found', 'No records match your selected filters. Try clearing filters or uploading a new document.', 'fa-folder-open') : `
        <div class="document-grid">
          ${docs.map(d => this.createDocCardHTML(d)).join('')}
        </div>
      `}
    `;
  },

  createDocCardHTML(doc) {
    const provBadgeClass = doc.provenance.toLowerCase();
    const apt = store.getState().appointments.find(a => a.id === doc.appointmentId);

    let categoryIcon = 'fa-file-medical';
    switch (doc.documentType) {
      case 'Pathology': categoryIcon = 'fa-microscope'; break;
      case 'Imaging': categoryIcon = 'fa-x-ray'; break;
      case 'Laboratory': categoryIcon = 'fa-vial'; break;
      case 'Consultation Note': categoryIcon = 'fa-user-doctor'; break;
      case 'Prescription': categoryIcon = 'fa-pills'; break;
      case 'Cardiology': categoryIcon = 'fa-heart-pulse'; break;
    }

    return `
      <div class="doc-card" onclick="VaultModule.openDocDetailWorkspace('${doc.id}')">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="doc-type-icon">
              <i class="fa-solid ${categoryIcon}"></i>
            </div>
            <span class="badge-prov ${provBadgeClass}">${doc.provenance}</span>
          </div>
          
          <div class="doc-title">${doc.title}</div>
          
          <div class="doc-meta">
            <div style="display: flex; align-items: center; gap: 6px;">
              <i class="fa-regular fa-calendar"></i> ${doc.date}
              ${utils.renderDateTypeBadge(doc.dateType)}
            </div>
            <div><i class="fa-regular fa-building"></i> ${doc.facility} (${doc.provider})</div>
          </div>
        </div>

        <div style="margin-bottom: 12px;">
          ${utils.renderConfidenceBadge(doc.confidence)}
        </div>

        <div class="doc-footer">
          <span style="font-size: 11px; color: ${doc.status === 'Verified' ? 'var(--status-success)' : 'var(--status-warning)'}; font-weight: 600;">
            <i class="fa-solid ${doc.status === 'Verified' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i> ${doc.status}
          </span>
          <span style="font-size: 12px; color: var(--primary-pink); font-weight: 600;">
            Inspect Record <i class="fa-solid fa-arrow-right"></i>
          </span>
        </div>
      </div>
    `;
  },

  setFilter(key, value) {
    this.filters[key] = value;
    this.render();
  },

  clearAllFilters() {
    this.filters = { type: 'all', provider: 'all', provenance: 'all', status: 'all', dateType: 'all' };
    store.updateState({ ui: { searchQuery: '' } });
    const searchInput = document.getElementById('globalSearchInput');
    if (searchInput) searchInput.value = '';
    this.render();
  },

  // Document Detail Workspace Drawer / Modal
  openDocDetailWorkspace(docId) {
    const doc = store.getState().documents.find(d => d.id === docId);
    if (!doc) return;

    const apt = store.getState().appointments.find(a => a.id === doc.appointmentId);
    const provClass = doc.provenance.toLowerCase();

    let modal = document.getElementById('docWorkspaceModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'docWorkspaceModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const extractedRows = Object.entries(doc.extractedData || {}).map(([key, valObj]) => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px dashed var(--light-pink);">
        <div>
          <span style="font-weight: 600; font-size: 13px; text-transform: capitalize;">${key}:</span>
          <span style="font-size: 13px; color: var(--text-main); margin-left: 6px;">${valObj.value || valObj}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="badge-prov ${valObj.provenance ? valObj.provenance.toLowerCase() : 'extracted'}">${valObj.provenance || 'Extracted'}</span>
          <button class="btn btn-outline btn-sm" style="padding: 2px 8px; font-size: 11px;" onclick="VaultModule.openFieldVerification('${doc.id}', '${key}')">Verify</button>
        </div>
      </div>
    `).join('');

    modal.innerHTML = `
      <div class="modal-content" style="max-width: 780px;">
        <div class="modal-header">
          <div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <h3 style="font-size: 18px;">${doc.title}</h3>
              <span class="badge-prov ${provClass}">${doc.provenance}</span>
            </div>
            <p style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">Original File: ${doc.originalFileName} (${doc.fileSize})</p>
          </div>
          <i class="fa-solid fa-xmark modal-close" onclick="utils.closeModal('docWorkspaceModal')"></i>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <!-- Left: Original Document Preview Simulation -->
          <div style="background: var(--ultra-light-pink); border: 1px solid var(--soft-pink); border-radius: var(--radius-md); padding: 16px;">
            <div style="font-size: 12px; font-weight: 700; color: var(--dark-pink); text-transform: uppercase; margin-bottom: 8px; display: flex; justify-content: space-between;">
              <span><i class="fa-solid fa-file-pdf"></i> Original Source Evidence</span>
              <span class="badge-prov original">Immutable</span>
            </div>
            <div style="font-family: monospace; font-size: 12px; white-space: pre-wrap; background: white; border: 1px solid var(--soft-pink); padding: 12px; border-radius: 6px; height: 180px; overflow-y: auto;">${doc.originalContent || doc.summary}</div>
            <div style="margin-top: 10px; text-align: right;">
              <button class="btn btn-outline btn-sm" onclick="utils.showToast('Original PDF Downloaded!')">
                <i class="fa-solid fa-download"></i> Download Source File
              </button>
            </div>
          </div>

          <!-- Right: Extracted Metadata & Lineage -->
          <div style="background: white; border: 1px solid var(--soft-pink); border-radius: var(--radius-md); padding: 16px;">
            <div style="font-size: 12px; font-weight: 700; color: var(--dark-pink); text-transform: uppercase; margin-bottom: 8px;">Metadata & Classification</div>
            <div style="font-size: 13px; display: flex; flex-direction: column; gap: 6px;">
              <div><strong>Document Type:</strong> ${doc.documentType}</div>
              <div><strong>Date:</strong> ${doc.date} (${utils.renderDateTypeBadge(doc.dateType)})</div>
              <div><strong>Provider:</strong> ${doc.provider}</div>
              <div><strong>Facility:</strong> ${doc.facility}</div>
              <div><strong>Linked Visit:</strong> ${apt ? apt.title : 'Unlinked'}</div>
              <div><strong>Confidence Score:</strong> ${utils.renderConfidenceBadge(doc.confidence)}</div>
            </div>
          </div>
        </div>

        <!-- AI Extracted Fields Table -->
        <div style="background: white; border: 1px solid var(--soft-pink); border-radius: var(--radius-md); padding: 16px; margin-bottom: 20px;">
          <div style="font-size: 12px; font-weight: 700; color: var(--dark-pink); text-transform: uppercase; margin-bottom: 10px; display: flex; justify-content: space-between;">
            <span>AI Extracted Fields & Provenance</span>
            <span style="font-size: 11px; color: var(--text-muted);">Edits update provenance to User-Entered</span>
          </div>
          ${extractedRows}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <button class="btn btn-secondary btn-sm" onclick="VaultModule.openAppointmentLinker('${doc.id}')">
            <i class="fa-solid fa-link"></i> Link to Appointment
          </button>
          <button class="btn btn-primary btn-sm" onclick="utils.closeModal('docWorkspaceModal')">Done</button>
        </div>
      </div>
    `;

    utils.openModal('docWorkspaceModal');
  },

  // Field Verification Action Prompt
  openFieldVerification(docId, fieldKey) {
    const doc = store.getState().documents.find(d => d.id === docId);
    if (!doc || !doc.extractedData[fieldKey]) return;

    const currentVal = doc.extractedData[fieldKey].value || doc.extractedData[fieldKey];

    const newValue = prompt(`Verify extracted field "${fieldKey}":`, currentVal);
    if (newValue !== null) {
      store.verifyField(docId, fieldKey, newValue.trim());
      utils.showToast(`Verified "${fieldKey}". Provenance updated to User-Entered.`);
      utils.closeModal('docWorkspaceModal');
      this.openDocDetailWorkspace(docId);
    }
  },

  // Appointment Linking Drawer / Dialog
  openAppointmentLinker(docId) {
    const doc = store.getState().documents.find(d => d.id === docId);
    if (!doc) return;

    const apts = store.getActiveAppointments();

    const options = apts.map(a => `
      <div style="background: white; border: 1px solid var(--soft-pink); border-radius: var(--radius-md); padding: 12px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div style="font-weight: 600; font-size: 14px;">${a.title}</div>
          <div style="font-size: 12px; color: var(--text-muted);">${a.date} • ${a.provider}</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="store.linkAppointmentToDoc('${doc.id}', '${a.id}'); utils.showToast('Linked to ${a.title}'); utils.closeModal('linkAptModal');">
          Link Visit
        </button>
      </div>
    `).join('');

    let modal = document.getElementById('linkAptModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'linkAptModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    modal.innerHTML = `
      <div class="modal-content" style="max-width: 500px;">
        <div class="modal-header">
          <h3>Link Document to Appointment</h3>
          <i class="fa-solid fa-xmark modal-close" onclick="utils.closeModal('linkAptModal')"></i>
        </div>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
          Select an appointment dossier to link "${doc.title}".
        </p>

        <!-- Suggested Appointment Prompt -->
        <div style="background: var(--ultra-light-pink); border: 1px dashed var(--primary-pink); border-radius: var(--radius-md); padding: 12px; margin-bottom: 16px; font-size: 13px;">
          <div style="font-weight: 700; color: var(--dark-pink);"><i class="fa-solid fa-wand-magic-sparkles"></i> AI Suggested Match:</div>
          <div>Oncology Pre-Surgical Review (Sept 10, 2026) — 84% Match Confidence</div>
        </div>

        <div>${options}</div>
      </div>
    `;

    utils.openModal('linkAptModal');
  },

  // Verification Drawer for Low-Confidence Documents
  openVerificationDrawer(docId) {
    const doc = store.getState().documents.find(d => d.id === docId);
    if (!doc) return;

    let drawer = document.getElementById('verificationDrawer');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'verificationDrawer';
      drawer.className = 'drawer-overlay';
      document.body.appendChild(drawer);
    }

    drawer.innerHTML = `
      <div class="drawer-content">
        <div class="drawer-header">
          <div>
            <h3 style="font-size: 18px;">Verification Queue</h3>
            <span class="badge-confidence low">Action Required</span>
          </div>
          <i class="fa-solid fa-xmark modal-close" onclick="utils.closeDrawer('verificationDrawer')"></i>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 16px;">${doc.title}</h4>
          <p style="font-size: 13px; color: var(--text-muted);">Uploaded file: ${doc.originalFileName}</p>
        </div>

        <div style="background: var(--status-error-bg); border-left: 4px solid var(--status-error); padding: 12px; border-radius: 6px; margin-bottom: 20px; font-size: 13px; color: var(--status-error);">
          <strong>Low-Confidence Detection (64%):</strong> Field "INR / Coagulation Value" extracted with low certainty.
        </div>

        <div style="background: white; border: 1px solid var(--soft-pink); border-radius: var(--radius-md); padding: 16px; margin-bottom: 24px;">
          <div style="font-size: 13px; font-weight: 700; margin-bottom: 8px;">Extracted Field: INR Coagulation</div>
          <div style="font-size: 14px; font-weight: 600; color: var(--dark-pink); margin-bottom: 12px;">Detected Value: 1.05</div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-primary btn-sm" onclick="store.verifyField('${doc.id}', 'inr'); utils.showToast('Accepted field extraction'); utils.closeDrawer('verificationDrawer');">
              <i class="fa-solid fa-check"></i> Accept Extraction
            </button>
            <button class="btn btn-outline btn-sm" onclick="VaultModule.openFieldVerification('${doc.id}', 'inr'); utils.closeDrawer('verificationDrawer');">
              <i class="fa-solid fa-pen"></i> Edit Field
            </button>
          </div>
        </div>

        <div style="text-align: right;">
          <button class="btn btn-secondary btn-sm" onclick="utils.closeDrawer('verificationDrawer')">Close Drawer</button>
        </div>
      </div>
    `;

    utils.openDrawer('verificationDrawer');
  }
};

window.VaultModule = VaultModule;
