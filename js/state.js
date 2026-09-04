/* ==========================================================================
   CareChronicle - Centralized Application State Management (v2.0 Phase 2)
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
        vaultFilterType: 'all',
        vaultFilterProvider: 'all',
        vaultFilterProvenance: 'all',
        vaultFilterStatus: 'all',
        searchQuery: '',
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

  subscribe(callback) {
    this._subscribers.push(callback);
    return () => {
      this._subscribers = this._subscribers.filter(sub => sub !== callback);
    };
  }

  _notify(keyChanged) {
    this._subscribers.forEach(cb => cb(this._state, keyChanged));
  }

  setState(newState) {
    this._state = { ...this._state, ...newState };
    this._notify('all');
  }

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

  getActiveCase() {
    return this._state.cases.find(c => c.id === this._state.activeCaseId) || this._state.cases[0];
  }

  switchCase(newCaseId) {
    if (this._state.activeCaseId === newCaseId) return;
    this.updateState({ activeCaseId: newCaseId });
    this._notify('caseSwitch');
  }

  getActiveDocuments() {
    return this._state.documents.filter(d => d.caseId === this._state.activeCaseId);
  }

  getUnverifiedDocuments() {
    return this.getActiveDocuments().filter(d => d.status === 'Verification Required' || d.confidence < 0.85);
  }

  getActiveAppointments() {
    return this._state.appointments.filter(a => a.caseId === this._state.activeCaseId);
  }

  getActiveTimeline() {
    return this._state.timelineEvents.filter(t => t.caseId === this._state.activeCaseId);
  }

  // Phase 2 State Actions: Document Verification & Editing
  verifyField(docId, fieldKey, newValue = null) {
    const doc = this._state.documents.find(d => d.id === docId);
    if (!doc || !doc.extractedData[fieldKey]) return;

    if (newValue !== null) {
      doc.extractedData[fieldKey].value = newValue;
      doc.extractedData[fieldKey].provenance = 'User-Entered';
    } else {
      doc.extractedData[fieldKey].provenance = 'User-Entered';
    }

    doc.status = 'Verified';
    doc.confidence = 1.0;
    this._notify('documentVerified');
  }

  updateDocMetadata(docId, metadataObj) {
    const doc = this._state.documents.find(d => d.id === docId);
    if (!doc) return;

    Object.assign(doc, metadataObj);
    doc.provenance = 'User-Entered';
    doc.status = 'Verified';
    this._notify('documentUpdated');
  }

  linkAppointmentToDoc(docId, appointmentId) {
    const doc = this._state.documents.find(d => d.id === docId);
    if (!doc) return;

    doc.appointmentId = appointmentId;
    const apt = this._state.appointments.find(a => a.id === appointmentId);
    if (apt && !apt.linkedDocIds.includes(docId)) {
      apt.linkedDocIds.push(docId);
    }
    this._notify('appointmentLinked');
  }

  addDocument(docObj) {
    this._state.documents.unshift(docObj);
    
    // Add timeline event automatically
    this._state.timelineEvents.unshift({
      id: 'evt_' + Date.now(),
      caseId: docObj.caseId,
      date: docObj.date,
      title: 'Uploaded: ' + docObj.title,
      category: docObj.documentType,
      description: docObj.summary,
      linkedDocId: docObj.id
    });

    this._notify('documentAdded');
  }
}

window.store = new CareStore();
