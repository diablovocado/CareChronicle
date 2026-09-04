/* ==========================================================================
   CareChronicle - Vault Module (v2.0 Phase 1 Architecture)
   ========================================================================== */

const VaultModule = {
  activeFilter: 'all',

  render() {
    const container = document.getElementById('vault-view');
    if (!container) return;

    let docs = store.getActiveDocuments();

    if (this.activeFilter !== 'all') {
      docs = docs.filter(d => d.category === this.activeFilter);
    }

    const state = store.getState();
    const query = (state.ui.searchQuery || '').toLowerCase().trim();
    if (query) {
      docs = docs.filter(d => 
        d.title.toLowerCase().includes(query) ||
        d.category.toLowerCase().includes(query) ||
        d.summary.toLowerCase().includes(query)
      );
    }

    container.innerHTML = `
      <div class="view-header">
        <div>
          <h1 class="view-title">Medical Vault</h1>
          <p class="view-subtitle">Immutable source records with searchable OCR extractions & verified metadata.</p>
        </div>
        <button class="btn btn-primary" onclick="utils.openModal('uploadModal')">
          <i class="fa-solid fa-cloud-arrow-up"></i> Upload Document
        </button>
      </div>

      <!-- Filter Chips -->
      <div style="display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap;" id="vaultFilterChips">
        <button class="chip ${this.activeFilter === 'all' ? 'active' : ''}" onclick="VaultModule.setFilter('all')">All Records</button>
        <button class="chip ${this.activeFilter === 'Pathology' ? 'active' : ''}" onclick="VaultModule.setFilter('Pathology')">Pathology</button>
        <button class="chip ${this.activeFilter === 'Lab Results' ? 'active' : ''}" onclick="VaultModule.setFilter('Lab Results')">Lab Results</button>
        <button class="chip ${this.activeFilter === 'Imaging' ? 'active' : ''}" onclick="VaultModule.setFilter('Imaging')">Imaging</button>
        <button class="chip ${this.activeFilter === 'Doctor Note' ? 'active' : ''}" onclick="VaultModule.setFilter('Doctor Note')">Doctor Notes</button>
      </div>

      ${docs.length === 0 ? utils.createEmptyState('No Records Found', 'Try adjusting your search query or filter chip.') : `
        <div class="document-grid">
          ${docs.map(d => HomeModule.createDocCardHTML(d)).join('')}
        </div>
      `}
    `;
  },

  setFilter(filterName) {
    this.activeFilter = filterName;
    this.render();
  }
};

window.VaultModule = VaultModule;
