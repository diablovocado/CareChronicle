/* ==========================================================================
   CareChronicle - Global UI Utilities & Component Helpers (v2.0 Phase 1)
   ========================================================================== */

const utils = {
  // ------------------------------------------------------------------------
  // Toast Notification Infrastructure
  // ------------------------------------------------------------------------
  showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'warning') icon = 'fa-circle-exclamation';
    if (type === 'error') icon = 'fa-circle-xmark';

    toast.innerHTML = `
      <i class="fa-solid ${icon}"></i>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideInRight 0.3s ease reverse forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  // ------------------------------------------------------------------------
  // Modal Infrastructure
  // ------------------------------------------------------------------------
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  },

  // ------------------------------------------------------------------------
  // Drawer Infrastructure
  // ------------------------------------------------------------------------
  openDrawer(drawerId) {
    const drawer = document.getElementById(drawerId);
    if (drawer) {
      drawer.classList.add('active');
      drawer.setAttribute('aria-hidden', 'false');
    }
  },

  closeDrawer(drawerId) {
    const drawer = document.getElementById(drawerId);
    if (drawer) {
      drawer.classList.remove('active');
      drawer.setAttribute('aria-hidden', 'true');
    }
  },

  // ------------------------------------------------------------------------
  // Confirmation Dialog System
  // ------------------------------------------------------------------------
  confirmDialog(title, message, onConfirm) {
    let confirmModal = document.getElementById('globalConfirmModal');
    if (!confirmModal) {
      confirmModal = document.createElement('div');
      confirmModal.id = 'globalConfirmModal';
      confirmModal.className = 'modal-overlay';
      confirmModal.innerHTML = `
        <div class="modal-content" style="max-width: 440px;">
          <div class="modal-header">
            <h3 id="confirmTitle" style="font-size: 18px;">Confirm Action</h3>
            <i class="fa-solid fa-xmark modal-close" onclick="utils.closeModal('globalConfirmModal')"></i>
          </div>
          <p id="confirmMessage" style="font-size: 14px; color: var(--text-muted); margin-bottom: 20px;"></p>
          <div style="display: flex; justify-content: flex-end; gap: 12px;">
            <button class="btn btn-outline btn-sm" onclick="utils.closeModal('globalConfirmModal')">Cancel</button>
            <button class="btn btn-primary btn-sm" id="confirmActionBtn">Confirm</button>
          </div>
        </div>
      `;
      document.body.appendChild(confirmModal);
    }

    document.getElementById('confirmTitle').innerText = title;
    document.getElementById('confirmMessage').innerText = message;
    
    const actionBtn = document.getElementById('confirmActionBtn');
    actionBtn.onclick = () => {
      utils.closeModal('globalConfirmModal');
      if (onConfirm) onConfirm();
    };

    utils.openModal('globalConfirmModal');
  },

  // ------------------------------------------------------------------------
  // Loading & Empty States
  // ------------------------------------------------------------------------
  createEmptyState(title, subtitle, icon = 'fa-folder-open') {
    return `
      <div class="empty-state">
        <div class="empty-state-icon">
          <i class="fa-solid ${icon}"></i>
        </div>
        <h4 class="empty-state-title">${title}</h4>
        <p class="empty-state-subtitle">${subtitle}</p>
      </div>
    `;
  },

  formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

window.utils = utils;
