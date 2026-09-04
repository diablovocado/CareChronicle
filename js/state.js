/* ==========================================================================
   CareChronicle - Centralized Application State Management (v2.0 Phase 1)
   ========================================================================== */

class CareStore {
  constructor() {
    this._state = {
      activeCaseId: 'case_aarav_01',
      cases: SampleData.cases,
      documents: SampleData.documents,
      appointments: SampleData.appointments,
      timelineEvents: SampleData.timelineEvents,
      packages: SampleData.packages,
      permissions: SampleData.permissions,
      ui: {
        activeView: 'home-view',
        vaultCategoryFilter: 'all',
        searchQuery: '',
        isLoading: false,
        activeModal: null,
        activeDrawer: null
      }
    };

    this._subscribers = [];
  }

  // Pure State Getters
  getState() {
    return this._state;
  }

  // Subscribe for State Change Notifications
  subscribe(callback) {
    this._subscribers.push(callback);
    return () => {
      this._subscribers = this._subscribers.filter(sub => sub !== callback);
    };
  }

  // Notify Subscribers
  _notify(keyChanged) {
    this._subscribers.forEach(cb => cb(this._state, keyChanged));
  }

  // Set Entire State
  setState(newState) {
    this._state = { ...this._state, ...newState };
    this._notify('all');
  }

  // Update Partial State
  updateState(partialState) {
    this._state = {
      ...this._state,
      ...partialState,
      ui: {
        ...this._state.ui,
        ...(partialState.ui || {})
      }
    };
    this._notify('partial');
  }

  // Helper: Get Currently Active Patient Case
  getActiveCase() {
    return this._state.cases.find(c => c.id === this._state.activeCaseId) || this._state.cases[0];
  }

  // Helper: Switch Active Patient Case
  switchCase(newCaseId) {
    if (this._state.activeCaseId === newCaseId) return;
    this.updateState({ activeCaseId: newCaseId });
    this._notify('caseSwitch');
  }

  // Helper: Get Documents for Active Case
  getActiveDocuments() {
    return this._state.documents.filter(d => d.caseId === this._state.activeCaseId);
  }

  // Helper: Get Appointments for Active Case
  getActiveAppointments() {
    return this._state.appointments.filter(a => a.caseId === this._state.activeCaseId);
  }

  // Helper: Get Timeline Events for Active Case
  getActiveTimeline() {
    return this._state.timelineEvents.filter(t => t.caseId === this._state.activeCaseId);
  }
}

// Global Store Instance
window.store = new CareStore();
