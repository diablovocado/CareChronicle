/* ==========================================================================
   CareChronicle - Sample Fictional Data (v2.0 Phase 2 Extended Schema)
   ========================================================================== */

const SampleData = {
  cases: [
    {
      id: 'case_aarav_01',
      name: 'Aarav Mehta',
      relationship: 'Self',
      age: 48,
      condition: 'Stage II Colon Adenocarcinoma',
      primaryPhysician: 'Dr. Ananya Sharma (Surgical Oncology)',
      hospital: 'Apollo Cancer Centre',
      avatarInitials: 'AM',
      createdDate: '2026-07-10'
    },
    {
      id: 'case_meera_02',
      name: 'Meera Mehta',
      relationship: 'Parent',
      age: 74,
      condition: 'Hypertension & Cardiac Arrhythmia',
      primaryPhysician: 'Dr. Vikram Patel (Cardiology)',
      hospital: 'Max Super Speciality Hospital',
      avatarInitials: 'MM',
      createdDate: '2026-05-15'
    },
    {
      id: 'case_rajesh_03',
      name: 'Rajesh Mehta',
      relationship: 'Family Member',
      age: 52,
      condition: 'Type 2 Diabetes & Routine Care',
      primaryPhysician: 'Dr. Sunita Rao (Internal Medicine)',
      hospital: 'Fortis Healthcare',
      avatarInitials: 'RM',
      createdDate: '2026-03-20'
    }
  ],

  documents: [
    {
      id: 'doc_01',
      caseId: 'case_aarav_01',
      title: 'Colonoscopy Pathology & Biopsy Report',
      documentType: 'Pathology',
      originalFileName: 'Apollo_Pathology_Biopsy_Aarav.pdf',
      date: '2026-08-10',
      dateType: 'report date',
      provider: 'Dr. Ramesh Kumar, MD',
      facility: 'Apollo Pathology Services',
      status: 'Verified',
      source: 'PDF',
      appointmentId: 'apt_01',
      careEventId: 'evt_01',
      tags: ['Biopsy', 'Pathology', 'Colon', 'Cancer'],
      originalContent: 'APOLLO PATHOLOGY REPORT\nPatient: Aarav Mehta (Age 48)\nSpecimen: Sigmoid Colon Biopsy\nDiagnosis: Moderately differentiated adenocarcinoma, Grade 2.',
      extractedData: {
        specimen: { value: 'Sigmoid Colon Biopsy', confidence: 0.98, provenance: 'Extracted' },
        histologicType: { value: 'Adenocarcinoma', confidence: 0.96, provenance: 'Extracted' },
        grade: { value: 'Grade 2 (Moderately Differentiated)', confidence: 0.94, provenance: 'Extracted' },
        margins: { value: 'Negative (Clear)', confidence: 0.92, provenance: 'Extracted' }
      },
      confidence: 0.98,
      provenance: 'Original',
      uploadedAt: '2026-08-11T10:14:00Z',
      fileSize: '2.1 MB',
      summary: 'Infiltrating moderately differentiated adenocarcinoma. Tumor extends into submucosa. Surgical margins clear.'
    },
    {
      id: 'doc_02',
      caseId: 'case_aarav_01',
      title: 'Contrast-Enhanced CT Abdomen & Pelvis',
      documentType: 'Imaging',
      originalFileName: 'CT_Scan_Abdomen_Aarav.dcm.pdf',
      date: '2026-08-14',
      dateType: 'appointment date',
      provider: 'Dr. Priya Nair (Radiology)',
      facility: 'Apollo Diagnostic Imaging',
      status: 'Verified',
      source: 'Scan',
      appointmentId: 'apt_01',
      careEventId: 'evt_02',
      tags: ['CT Scan', 'Imaging', 'Staging', 'Abdomen'],
      originalContent: 'CT ABDOMEN & PELVIS WITH CONTRAST\nIndication: Staging for colon adenocarcinoma.\nFindings: 3.1 cm focal wall thickening in sigmoid colon.',
      extractedData: {
        lesionSize: { value: '3.1 x 2.4 cm', confidence: 0.95, provenance: 'Extracted' },
        stageEstimate: { value: 'T2 N0 M0', confidence: 0.91, provenance: 'Extracted' },
        metastasis: { value: 'None detected', confidence: 0.93, provenance: 'Extracted' }
      },
      confidence: 0.94,
      provenance: 'Extracted',
      uploadedAt: '2026-08-14T16:30:00Z',
      fileSize: '4.5 MB',
      summary: '3.1 cm focal wall thickening in sigmoid colon. No evidence of distant hepatic or pulmonary metastasis.'
    },
    {
      id: 'doc_03',
      caseId: 'case_aarav_01',
      title: 'Pre-Operative CBC & Coagulation Profile',
      documentType: 'Laboratory',
      originalFileName: 'CBC_Lab_Result_Aug28.pdf',
      date: '2026-08-28',
      dateType: 'report date',
      provider: 'Central Clinical Labs',
      facility: 'Apollo Hospital Labs',
      status: 'Verification Required',
      source: 'PDF',
      appointmentId: 'apt_02',
      careEventId: 'evt_04',
      tags: ['Blood Panel', 'CBC', 'Coagulation', 'Pre-Op'],
      originalContent: 'LAB REPORT: Complete Blood Count\nHemoglobin: 13.2 g/dL\nWBC: 6.4 x10^3/uL\nPlatelets: 220,000 /uL\nINR: 1.05',
      extractedData: {
        hemoglobin: { value: '13.2 g/dL', confidence: 0.96, provenance: 'Extracted' },
        wbc: { value: '6.4 x10^3/uL', confidence: 0.94, provenance: 'Extracted' },
        platelets: { value: '220,000 /uL', confidence: 0.92, provenance: 'Extracted' },
        inr: { value: '1.05', confidence: 0.64, provenance: 'Suggested' } // Low confidence trigger!
      },
      confidence: 0.64,
      provenance: 'Extracted',
      uploadedAt: '2026-08-28T09:12:00Z',
      fileSize: '1.2 MB',
      summary: 'Hemoglobin 13.2 g/dL, Platelets 220,000 /uL, INR 1.05. Normal coagulation for scheduled resection.'
    },
    {
      id: 'doc_04',
      caseId: 'case_aarav_01',
      title: 'Surgical Oncology Consultation Note',
      documentType: 'Consultation Note',
      originalFileName: 'Surgical_Consult_DrSharma.pdf',
      date: '2026-08-15',
      dateType: 'appointment date',
      provider: 'Dr. Ananya Sharma',
      facility: 'Apollo Cancer Centre',
      status: 'Verified',
      source: 'PDF',
      appointmentId: 'apt_01',
      careEventId: 'evt_03',
      tags: ['Consultation', 'Surgical Plan', 'Oncology'],
      originalContent: 'SURGICAL ONCOLOGY CONSULTATION NOTE\nPatient: Aarav Mehta\nPlan: Laparoscopic Sigmoid Colectomy scheduled for Sept 12, 2026.',
      extractedData: {
        plannedProcedure: { value: 'Laparoscopic Sigmoid Colectomy', confidence: 0.98, provenance: 'Extracted' },
        scheduledDate: { value: '2026-09-12', confidence: 0.95, provenance: 'Extracted' }
      },
      confidence: 0.97,
      provenance: 'Extracted',
      uploadedAt: '2026-08-15T14:20:00Z',
      fileSize: '780 KB',
      summary: 'Laparoscopic Sigmoid Colectomy planned for Sept 12, 2026. Pre-hab dietary and physical instructions provided.'
    },
    {
      id: 'doc_05',
      caseId: 'case_meera_02',
      title: '24-Hour Holter ECG Monitoring Report',
      documentType: 'Cardiology',
      originalFileName: 'Holter_ECG_Meera.pdf',
      date: '2026-07-22',
      dateType: 'report date',
      provider: 'Dr. Vikram Patel',
      facility: 'Max Super Speciality Hospital',
      status: 'Verified',
      source: 'PDF',
      appointmentId: null,
      careEventId: null,
      tags: ['ECG', 'Holter', 'Cardiac', 'Arrhythmia'],
      originalContent: '24-HOUR HOLTER MONITORING REPORT\nPatient: Meera Mehta (Age 74)\nFindings: Sinus rhythm with occasional premature atrial contractions (PACs).',
      extractedData: {
        avgHeartRate: { value: '72 bpm', confidence: 0.95, provenance: 'Extracted' },
        pacs: { value: '142 total events', confidence: 0.92, provenance: 'Extracted' }
      },
      confidence: 0.95,
      provenance: 'Original',
      uploadedAt: '2026-07-23T11:00:00Z',
      fileSize: '3.4 MB',
      summary: 'Sinus rhythm with occasional premature atrial contractions (PACs). No prolonged sinus pauses observed.'
    }
  ],

  appointments: [
    {
      id: 'apt_02',
      caseId: 'case_aarav_01',
      title: 'Pre-Surgical Clearance & Anesthesia Review',
      date: '2026-09-10',
      time: '11:00 AM',
      provider: 'Dr. Ananya Sharma & Anesthesia Team',
      specialty: 'Surgical Oncology',
      location: 'Apollo Cancer Centre, OPD 3rd Floor',
      status: 'Upcoming',
      linkedDocIds: ['doc_03', 'doc_04'],
      patientQuestions: [
        'How many days before surgery should I discontinue blood-thinning supplements?',
        'What is the expected recovery timeline before resuming normal activities?'
      ],
      sinceLastVisitSummary: 'Completed pre-op blood panel (Hgb 13.2). Cardiac clearance obtained.'
    },
    {
      id: 'apt_01',
      caseId: 'case_aarav_01',
      title: 'Initial Surgical Oncology Consultation',
      date: '2026-08-15',
      time: '02:30 PM',
      provider: 'Dr. Ananya Sharma',
      specialty: 'Surgical Oncology',
      location: 'Apollo Cancer Centre, Suite 201',
      status: 'Completed',
      linkedDocIds: ['doc_01', 'doc_02', 'doc_04'],
      patientQuestions: [
        'Is minimally invasive laparoscopic surgery feasible?',
        'Will post-operative chemotherapy be required?'
      ],
      sinceLastVisitSummary: 'Biopsy and CT scans reviewed. Surgical resection agreed upon.'
    }
  ],

  timelineEvents: [
    {
      id: 'evt_01',
      caseId: 'case_aarav_01',
      date: '2026-08-10',
      title: 'Colonoscopy & Biopsy Confirmation',
      category: 'Diagnostic',
      description: 'Moderately differentiated adenocarcinoma confirmed.',
      linkedDocId: 'doc_01'
    },
    {
      id: 'evt_02',
      caseId: 'case_aarav_01',
      date: '2026-08-14',
      title: 'Staging CT Scan Abdomen/Pelvis',
      category: 'Imaging',
      description: 'T2 N0 M0 localized sigmoid tumor.',
      linkedDocId: 'doc_02'
    },
    {
      id: 'evt_03',
      caseId: 'case_aarav_01',
      date: '2026-08-15',
      title: 'Surgical Treatment Plan Established',
      category: 'Consultation',
      description: 'Scheduled for Laparoscopic Sigmoid Colectomy.',
      linkedDocId: 'doc_04'
    },
    {
      id: 'evt_04',
      caseId: 'case_aarav_01',
      date: '2026-08-28',
      title: 'Pre-Operative Blood & Coagulation Panel',
      category: 'Lab Work',
      description: 'Hemoglobin 13.2 g/dL, INR 1.05.',
      linkedDocId: 'doc_03'
    }
  ],

  packages: [
    {
      id: 'pkg_01',
      caseId: 'case_aarav_01',
      title: 'Surgical Second Opinion Packet',
      type: 'Second Opinion',
      createdDate: '2026-08-20',
      docCount: 3,
      expiryDate: '2026-10-20'
    }
  ],

  permissions: [
    {
      id: 'perm_01',
      caseId: 'case_aarav_01',
      name: 'Priya Mehta',
      relation: 'Spouse',
      role: 'Contribute',
      email: 'priya.mehta@example.com'
    },
    {
      id: 'perm_02',
      caseId: 'case_aarav_01',
      name: 'Karan Mehta',
      relation: 'Son',
      role: 'View Only',
      email: 'karan.mehta@example.com'
    }
  ]
};

window.SampleData = SampleData;
