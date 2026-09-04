/* ==========================================================================
   CareChronicle - Appointments Module (v2.0 Phase 1 Architecture)
   ========================================================================== */

const AppointmentsModule = {
  render() {
    const container = document.getElementById('appointments-view');
    if (!container) return;

    const apts = store.getActiveAppointments();
    const upcomingApt = apts.find(a => a.status === 'Upcoming') || apts[0];

    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1 class="view-title">Appointment Dossiers</h1>
          <p class="view-subtitle">Visit-centered organization, pre-consultation preparation, and evidence summaries.</p>
        </div>
      </div>

      ${!upcomingApt ? utils.createEmptyState('No Appointments Scheduled', 'Create an appointment to begin preparing.') : `
        <div class="card" style="border-top: 4px solid var(--primary-pink);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
            <div>
              <span class="badge-prov generated" style="margin-bottom: 8px;">Dossier Workspace</span>
              <h2 style="font-size: 22px;">${upcomingApt.title}</h2>
              <p style="color: var(--text-muted); font-size: 14px; margin-top: 4px;">
                <i class="fa-solid fa-calendar"></i> ${upcomingApt.date} at ${upcomingApt.time} • ${upcomingApt.provider} (${upcomingApt.location})
              </p>
            </div>
            <span class="badge-prov user">${upcomingApt.status}</span>
          </div>

          <!-- Delta Summary -->
          <div style="background: var(--ultra-light-pink); border: 1px solid var(--soft-pink); border-radius: var(--radius-md); padding: 18px; margin-bottom: 24px;">
            <div style="font-weight: 700; font-size: 14px; color: var(--dark-pink); margin-bottom: 6px;">
              <i class="fa-solid fa-sparkles" style="color: var(--primary-pink);"></i> "Since Your Last Visit" Delta Summary
            </div>
            <p style="font-size: 14px; color: var(--text-main);">${upcomingApt.sinceLastVisitSummary}</p>
          </div>

          <!-- Questions -->
          <div>
            <div class="card-title" style="font-size: 16px; margin-bottom: 12px;">
              <i class="fa-solid fa-circle-question"></i> Patient Questions for Consultation
            </div>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${upcomingApt.patientQuestions.map((q, idx) => `
                <div style="background: white; border: 1px solid var(--soft-pink); border-radius: var(--radius-sm); padding: 12px; font-size: 14px; display: flex; justify-content: space-between;">
                  <span><strong>Q${idx+1}:</strong> ${q}</span>
                  <span class="badge-prov user">User-Entered</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `}
    `;
  }
};

window.AppointmentsModule = AppointmentsModule;
