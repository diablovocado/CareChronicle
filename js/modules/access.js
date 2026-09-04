/* ==========================================================================
   CareChronicle - Access & Privacy Module (v2.0 Phase 1 Architecture)
   ========================================================================== */

const AccessModule = {
  render() {
    const container = document.getElementById('access-view');
    if (!container) return;

    const permissions = store.getState().permissions.filter(p => p.caseId === store.getState().activeCaseId);

    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1 class="view-title">Access & Privacy Controls</h1>
          <p class="view-subtitle">Manage shared permissions, audit access history, and enforce zero-trust privacy controls.</p>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title"><i class="fa-solid fa-users"></i> Authorized Caregivers & Collaborators</div>
          <button class="btn btn-primary btn-sm" onclick="utils.showToast('Invite Caregiver feature ready for Phase 4')">
            <i class="fa-solid fa-user-plus"></i> Invite Caregiver
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 12px;">
          ${permissions.map(perm => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--light-pink);">
              <div>
                <div style="font-weight: 600; font-size: 14px;">${perm.name} (${perm.relation})</div>
                <div style="font-size: 12px; color: var(--text-muted);">${perm.email}</div>
              </div>
              <div>
                <span class="badge-prov original" style="margin-right: 10px;">${perm.role}</span>
                <button class="btn btn-outline btn-sm" onclick="utils.showToast('Access permissions updated')">Edit Access</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }
};

window.AccessModule = AccessModule;
