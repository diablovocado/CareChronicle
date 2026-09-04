/* ==========================================================================
   CareChronicle - Main Application Controller (v2.0 Phase 1 Entry Point)
   ========================================================================== */

const app = {
  init() {
    this.bindNavigation();
    this.bindCaseSwitcher();
    this.bindSearch();
    this.bindAccessibility();
    
    // Subscribe State Manager to re-render views on case changes
    store.subscribe((state, reason) => {
      this.renderCurrentView();
      if (reason === 'caseSwitch') {
        const activeCase = store.getActiveCase();
        utils.showToast(`Switched active patient context to ${activeCase.name}`);
      }
    });

    this.renderCurrentView();
  },

  // Navigation (Desktop Sidebar & Mobile Bottom Nav)
  bindNavigation() {
    const navButtons = document.querySelectorAll('[data-target]');
    navButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetView = btn.getAttribute('data-target');
        this.navigateTo(targetView);
      });
    });
  },

  navigateTo(viewId) {
    store.updateState({ ui: { activeView: viewId } });

    // Update active styles on desktop & mobile buttons
    document.querySelectorAll('[data-target]').forEach(btn => {
      if (btn.getAttribute('data-target') === viewId) {
        btn.classList.add('active');
        if (btn.parentElement && btn.parentElement.classList.contains('nav-item')) {
          btn.parentElement.classList.add('active');
        }
      } else {
        btn.classList.remove('active');
        if (btn.parentElement && btn.parentElement.classList.contains('nav-item')) {
          btn.parentElement.classList.remove('active');
        }
      }
    });

    // Toggle View Panels
    document.querySelectorAll('.view-panel').forEach(panel => {
      if (panel.id === viewId) {
        panel.classList.add('active');
        panel.setAttribute('aria-hidden', 'false');
      } else {
        panel.classList.remove('active');
        panel.setAttribute('aria-hidden', 'true');
      }
    });

    this.renderCurrentView();
  },

  renderCurrentView() {
    const activeCase = store.getActiveCase();
    
    // Update case selector UI
    const caseNameEl = document.getElementById('currentCaseName');
    const caseCondEl = document.getElementById('currentCaseCondition');
    if (caseNameEl) caseNameEl.innerText = `${activeCase.name} (${activeCase.relationship})`;
    if (caseCondEl) caseCondEl.innerText = activeCase.condition;

    const currentView = store.getState().ui.activeView;

    switch (currentView) {
      case 'home-view':
        HomeModule.render();
        break;
      case 'vault-view':
        VaultModule.render();
        break;
      case 'timeline-view':
        TimelineModule.render();
        break;
      case 'appointments-view':
        AppointmentsModule.render();
        break;
      case 'packages-view':
        PackagesModule.render();
        break;
      case 'access-view':
        AccessModule.render();
        break;
    }
  },

  // Patient / Case Context Switcher
  bindCaseSwitcher() {
    const btn = document.getElementById('switchCaseBtn');
    if (!btn) return;

    btn.onclick = () => {
      const cases = store.getState().cases;
      const currentCase = store.getActiveCase();
      
      const caseOptions = cases.map(c => 
        `<button class="btn btn-outline" style="width:100%; justify-content: space-between; margin-bottom: 8px; ${c.id === currentCase.id ? 'border-color: var(--primary-pink); background: var(--ultra-light-pink);' : ''}" onclick="store.switchCase('${c.id}'); utils.closeModal('caseSwitchModal');">
          <span><strong>${c.name}</strong> (${c.relationship})</span>
          <span style="font-size: 11px; color: var(--text-muted);">${c.condition}</span>
        </button>`
      ).join('');

      let modal = document.getElementById('caseSwitchModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'caseSwitchModal';
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
      }

      modal.innerHTML = `
        <div class="modal-content" style="max-width: 480px;">
          <div class="modal-header">
            <h3>Switch Patient Case Context</h3>
            <i class="fa-solid fa-xmark modal-close" onclick="utils.closeModal('caseSwitchModal')"></i>
          </div>
          <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 16px;">
            Select a patient profile to switch the active medical vault, timeline, and appointments.
          </p>
          <div>${caseOptions}</div>
        </div>
      `;

      utils.openModal('caseSwitchModal');
    };
  },

  // Global Search Input
  bindSearch() {
    const searchInput = document.getElementById('globalSearchInput');
    if (!searchInput) return;

    searchInput.oninput = (e) => {
      store.updateState({ ui: { searchQuery: e.target.value } });
      if (store.getState().ui.activeView !== 'vault-view') {
        this.navigateTo('vault-view');
      } else {
        VaultModule.render();
      }
    };
  },

  // Document Detail Viewer Modal
  openDocModal(docId) {
    const doc = store.getState().documents.find(d => d.id === docId);
    if (!doc) return;

    let modal = document.getElementById('docDetailModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'docDetailModal';
      modal.className = 'modal-overlay';
      document.body.appendChild(modal);
    }

    const provClass = doc.provenance.toLowerCase();

    modal.innerHTML = `
      <div class="modal-content" style="max-width: 680px;">
        <div class="modal-header">
          <div>
            <h3 style="font-size: 18px;">${doc.title}</h3>
            <span class="badge-prov ${provClass}">${doc.provenance}</span>
          </div>
          <i class="fa-solid fa-xmark modal-close" onclick="utils.closeModal('docDetailModal')"></i>
        </div>

        <div style="background: var(--ultra-light-pink); border: 1px solid var(--soft-pink); border-radius: var(--radius-md); padding: 16px; margin-bottom: 16px;">
          <div style="font-size: 12px; font-weight: 700; color: var(--dark-pink); margin-bottom: 6px;">
            <i class="fa-solid fa-file-pdf"></i> Preserved Original Document Details
          </div>
          <div style="font-size: 13px; display: flex; flex-direction: column; gap: 4px;">
            <div><strong>Category:</strong> ${doc.category}</div>
            <div><strong>Document Date:</strong> ${doc.documentDate}</div>
            <div><strong>Facility/Provider:</strong> ${doc.facility} (${doc.provider})</div>
            <div><strong>Verification State:</strong> <span style="color: var(--status-success); font-weight: 600;"><i class="fa-solid fa-circle-check"></i> ${doc.verificationState} (${Math.round(doc.confidenceScore * 100)}%)</span></div>
          </div>
        </div>

        <div style="margin-bottom: 20px;">
          <h4 style="font-size: 14px; color: var(--dark-pink); margin-bottom: 6px;">Document Summary</h4>
          <p style="font-size: 13px; color: var(--text-main); line-height: 1.5;">${doc.summary}</p>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <button class="btn btn-outline btn-sm" onclick="utils.showToast('Original PDF Downloaded!')">
            <i class="fa-solid fa-download"></i> Download Source File (${doc.fileSize})
          </button>
          <button class="btn btn-secondary btn-sm" onclick="utils.closeModal('docDetailModal')">Close</button>
        </div>
      </div>
    `;

    utils.openModal('docDetailModal');
  },

  // Accessibility Enhancements (Keyboard Esc to close modals)
  bindAccessibility() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => {
          utils.closeModal(m.id);
        });
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  app.init();
});

window.app = app;
