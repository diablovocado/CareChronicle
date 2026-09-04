/* ==========================================================================
   CareChronicle - Timeline Module (v2.0 Phase 1 Architecture)
   ========================================================================== */

const TimelineModule = {
  render() {
    const container = document.getElementById('timeline-view');
    if (!container) return;

    const timeline = store.getActiveTimeline();

    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1 class="view-title">Care Timeline</h1>
          <p class="view-subtitle">Chronological progression of diagnostic milestones, treatments, labs, and admissions.</p>
        </div>
      </div>

      ${timeline.length === 0 ? utils.createEmptyState('No Timeline Events', 'Events will appear chronologically as records are uploaded.') : `
        <div class="timeline-container">
          ${timeline.map(evt => {
            const linkedDoc = store.getState().documents.find(d => d.id === evt.linkedDocId);
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
                      <button class="btn btn-outline btn-sm" onclick="app.openDocModal('${linkedDoc.id}')">
                        <i class="fa-solid fa-file-pdf" style="color: var(--primary-pink);"></i> View Source Record (${linkedDoc.title})
                      </button>
                    </div>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    `;
  }
};

window.TimelineModule = TimelineModule;
