/* ==========================================================================
   CareChronicle - Home Module (v2.0 Phase 1)
   ========================================================================== */

const HomeModule = {
  render() {
    const container = document.getElementById('home-view');
    if (!container) return;

    const activeCase = store.getActiveCase();
    const docs = store.getActiveDocuments();
    const apts = store.getActiveAppointments();
    const timeline = store.getActiveTimeline();

    const upcomingApt = apts.find(a => a.status === 'Upcoming') || apts[0];

    container.innerHTML = `
      <!-- Welcome Header -->
      <div class="view-header">
        <div>
          <h1 class="view-title">Care Summary</h1>
          <p class="view-subtitle">Organized medical story for <strong>${activeCase.name}</strong> (${activeCase.condition}).</p>
        </div>
        <div style="display: flex; gap: 10px;">
          <button class="btn btn-primary" onclick="HomeModule.handleQuickAction('upload')">
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
          <button class="action-tile" onclick="HomeModule.handleQuickAction('upload')">
            <i class="fa-solid fa-upload tile-icon"></i>
            <span class="tile-label">Upload Record</span>
            <span class="tile-desc">Preserve raw document & extract</span>
          </button>
          <button class="action-tile" onclick="HomeModule.handleQuickAction('timeline')">
            <i class="fa-solid fa-timeline tile-icon"></i>
            <span class="tile-label">View Timeline</span>
            <span class="tile-desc">Chronological care journey</span>
          </button>
          <button class="action-tile" onclick="HomeModule.handleQuickAction('appointment')">
            <i class="fa-solid fa-stethoscope tile-icon"></i>
            <span class="tile-label">Prepare Visit</span>
            <span class="tile-desc">Dossier & question builder</span>
          </button>
          <button class="action-tile" onclick="HomeModule.handleQuickAction('package')">
            <i class="fa-solid fa-box-archive tile-icon"></i>
            <span class="tile-label">Create Package</span>
            <span class="tile-desc">Export curated clinical packet</span>
          </button>
        </div>
      </div>

      <!-- Dashboard Main Grid -->
      <div class="dashboard-grid">
        <div>
          <!-- Upcoming Appointment Placeholder / Highlights -->
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
              <div class="card-title"><i class="fa-solid fa-file-medical"></i> Recent Medical Evidence</div>
              <button class="btn btn-outline btn-sm" onclick="app.navigateTo('vault-view')">View Vault</button>
            </div>
            <div class="document-grid">
              ${docs.slice(0, 3).map(d => HomeModule.createDocCardHTML(d)).join('')}
            </div>
          </div>
        </div>

        <!-- Right Column: Provenance Legend & Care Snapshot -->
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

  createDocCardHTML(doc) {
    const provBadgeClass = doc.provenance.toLowerCase();
    return `
      <div class="doc-card" onclick="app.openDocModal('${doc.id}')">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="doc-type-icon">
              <i class="fa-solid fa-file-medical"></i>
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

  handleQuickAction(action) {
    switch (action) {
      case 'upload':
        utils.openModal('uploadModal');
        break;
      case 'timeline':
        app.navigateTo('timeline-view');
        break;
      case 'appointment':
        app.navigateTo('appointments-view');
        break;
      case 'package':
        app.navigateTo('packages-view');
        break;
    }
  }
};

window.HomeModule = HomeModule;
