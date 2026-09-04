/* ==========================================================================
   CareChronicle - Action Packages Module (v2.0 Phase 1 Architecture)
   ========================================================================== */

const PackagesModule = {
  render() {
    const container = document.getElementById('packages-view');
    if (!container) return;

    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1 class="view-title">Action Package Builders</h1>
          <p class="view-subtitle">Generate purpose-built, curated packets for consultations, second opinions, and insurance claims.</p>
        </div>
      </div>

      <div class="package-card">
        <div style="display: flex; gap: 20px; align-items: center;">
          <div class="package-icon">
            <i class="fa-solid fa-notes-medical"></i>
          </div>
          <div>
            <h3 style="font-size: 18px;">Second Opinion Package Builder</h3>
            <p style="font-size: 14px; color: var(--text-muted);">Curates pathology, radiology, surgical notes, and treatment plans into an organized clinical index with original attachments.</p>
          </div>
        </div>
        <button class="btn btn-primary" onclick="utils.showToast('Second Opinion Package Builder ready for Phase 4')">Build Packet</button>
      </div>

      <div class="package-card">
        <div style="display: flex; gap: 20px; align-items: center;">
          <div class="package-icon">
            <i class="fa-solid fa-file-invoice-dollar"></i>
          </div>
          <div>
            <h3 style="font-size: 18px;">Insurance Claims & Financial Bundle</h3>
            <p style="font-size: 14px; color: var(--text-muted);">Collates hospital invoices, pharmacy receipts, pre-authorizations, and clinical notes for an episode of care with presence auditing.</p>
          </div>
        </div>
        <button class="btn btn-secondary" onclick="utils.showToast('Insurance Bundle Builder ready for Phase 4')">Build Bundle</button>
      </div>
    `;
  }
};

window.PackagesModule = PackagesModule;
