/* ==========================================================================
   CareChronicle - Central Reactive State Store (v2.0)
   Pre-loaded with a realistic longitudinal cancer care journey.
   ========================================================================== */

const CareState = {
  activeCaseId: 'case_eleanor_01',
  
  cases: [
    {
      id: 'case_eleanor_01',
      patientName: 'Eleanor Vance',
      age: 54,
      condition: 'Stage II Invasive Ductal Carcinoma (Oncology)',
      primaryPhysician: 'Dr. Sarah Jenkins (Medical Oncology)',
      hospital: 'St. Jude Comprehensive Cancer Center'
    },
    {
      id: 'case_robert_02',
      patientName: 'Robert Vance (Father)',
      age: 81,
      condition: 'Chronic Cardiac & Renal Care',
      primaryPhysician: 'Dr. Marcus Vance (Cardiology)',
      hospital: 'Memorial General Hospital'
    }
  ],

  // 5-Tier Information Provenance Types:
  // ORIGINAL | EXTRACTED | USER_ENTERED | SUGGESTED | GENERATED

  documents: [
    {
      id: 'doc_pathology_01',
      caseId: 'case_eleanor_01',
      title: 'Breast Core Needle Biopsy Pathology Report',
      category: 'Pathology',
      documentDate: '2026-08-18',
      provider: 'Dr. Aris Thorne, MD (Pathology)',
      facility: 'St. Jude Pathology Laboratories',
      appointmentId: 'apt_initial_01',
      provenance: 'ORIGINAL',
      verificationState: 'Verified',
      confidenceScore: 0.98,
      fileSize: '2.4 MB',
      summary: 'Invasive Ductal Carcinoma, Grade 2. ER positive (90%), PR positive (70%), HER2 3+ positive. Ki-67 index: 28%.',
      extractedData: {
        specimen: 'Left Breast 2 oclock mass',
        histologicGrade: 'Grade 2 (Intermediate)',
        erStatus: 'Positive (90% strong staining)',
        prStatus: 'Positive (70% moderate staining)',
        her2Status: 'Positive (3+ by IHC)'
      }
    },
    {
      id: 'doc_lab_cbc_01',
      caseId: 'case_eleanor_01',
      title: 'Complete Blood Count (CBC) & Comprehensive Metabolic Panel',
      category: 'Lab Results',
      documentDate: '2026-09-02',
      provider: 'Central Diagnostics Lab',
      facility: 'St. Jude Cancer Center Labs',
      appointmentId: 'apt_upcoming_02',
      provenance: 'EXTRACTED',
      verificationState: 'Verified',
      confidenceScore: 0.95,
      fileSize: '1.1 MB',
      summary: 'WBC 4.2 x10^3/uL (Normal), Hemoglobin 11.8 g/dL (Mild Anemia), Platelets 210 x10^3/uL, ALT 24 U/L, AST 22 U/L.',
      extractedData: {
        wbc: '4.2 x10^3/uL',
        hemoglobin: '11.8 g/dL (Slight decrease from 12.6)',
        platelets: '210 x10^3/uL',
        alt: '24 U/L',
        ast: '22 U/L',
        creatinine: '0.82 mg/dL'
      }
    },
    {
      id: 'doc_imaging_mri_01',
      caseId: 'case_eleanor_01',
      title: 'Bilateral Diagnostic Mammogram & Breast MRI',
      category: 'Imaging',
      documentDate: '2026-08-14',
      provider: 'Dr. Michael Chen (Radiology)',
      facility: 'St. Jude Advanced Imaging',
      appointmentId: 'apt_initial_01',
      provenance: 'EXTRACTED',
      verificationState: 'Verified',
      confidenceScore: 0.92,
      fileSize: '4.8 MB',
      summary: '2.3 cm irregular mass in upper outer quadrant of left breast. BI-RADS Category 5 (Highly Suggestive of Malignancy). No abnormal axillary lymph nodes identified.',
      extractedData: {
        biRads: 'Category 5',
        lesionSize: '2.3 x 1.9 x 2.1 cm',
        location: 'Left Breast Upper Outer Quadrant',
        lymphNodes: 'No pathological lymphadenopathy'
      }
    },
    {
      id: 'doc_consult_01',
      caseId: 'case_eleanor_01',
      title: 'Initial Medical Oncology Consultation Note',
      category: 'Doctor Note',
      documentDate: '2026-08-24',
      provider: 'Dr. Sarah Jenkins, MD',
      facility: 'St. Jude Cancer Center',
      appointmentId: 'apt_initial_01',
      provenance: 'EXTRACTED',
      verificationState: 'Verified',
      confidenceScore: 0.97,
      fileSize: '850 KB',
      summary: 'Plan formulated for Neoadjuvant Chemotherapy (Paclitaxel + Trastuzumab) followed by surgical evaluation. Baseline MUGA scan ordered.',
      extractedData: {
        diagnosis: 'Stage IIA Left Breast Cancer (T2N0M0, HER2+)',
        treatmentPlan: 'Neoadjuvant Chemotherapy + Targeted HER2 Therapy',
        regimen: 'Paclitaxel weekly x 12 weeks + Trastuzumab q3w'
      }
    },
    {
      id: 'doc_script_01',
      caseId: 'case_eleanor_01',
      title: 'Prescription & Supportive Care Medication List',
      category: 'Prescription',
      documentDate: '2026-08-25',
      provider: 'Dr. Sarah Jenkins, MD',
      facility: 'St. Jude Oncology Pharmacy',
      appointmentId: 'apt_initial_01',
      provenance: 'EXTRACTED',
      verificationState: 'Verified',
      confidenceScore: 0.96,
      fileSize: '420 KB',
      summary: 'Ondansetron 8mg PO q8h PRN nausea; Dexamethasone 4mg PO pre-infusion; Filgrastim 300mcg SQ days 3-7.',
      extractedData: {
        medications: [
          'Ondansetron 8mg (Anti-nausea)',
          'Dexamethasone 4mg (Pre-medication)',
          'Filgrastim 300mcg (White blood cell support)'
        ]
      }
    },
    {
      id: 'doc_bill_01',
      caseId: 'case_eleanor_01',
      title: 'Chemotherapy Infusion Center Invoice & Receipt',
      category: 'Billing',
      documentDate: '2026-09-01',
      provider: 'St. Jude Patient Financial Services',
      facility: 'St. Jude Cancer Center',
      appointmentId: 'apt_upcoming_02',
      provenance: 'ORIGINAL',
      verificationState: 'Verified',
      confidenceScore: 1.0,
      fileSize: '1.3 MB',
      summary: 'Outpatient Infusion Cycle 1 Invoice. Total Billed: $14,250.00. Insurance Coverage Pending.',
      extractedData: {
        totalAmount: '$14,250.00',
        copayPaid: '$250.00',
        claimStatus: 'Submitted to BlueCross'
      }
    }
  ],

  appointments: [
    {
      id: 'apt_upcoming_02',
      caseId: 'case_eleanor_01',
      title: 'Oncology Chemotherapy Cycle 2 Review & Lab Check',
      date: '2026-09-15',
      time: '10:30 AM',
      provider: 'Dr. Sarah Jenkins, MD',
      specialty: 'Medical Oncology',
      location: 'St. Jude Cancer Center, Suite 400',
      status: 'Upcoming',
      linkedDocIds: ['doc_lab_cbc_01', 'doc_bill_01'],
      patientQuestions: [
        'How should I adjust anti-nausea medication timing if mild nausea occurs in the evening?',
        'Is my hemoglobin level (11.8) safe to proceed with Cycle 2 without additional supplements?',
        'When will the post-cycle 4 response assessment MRI be scheduled?'
      ],
      sinceLastVisitSummary: 'New blood panel completed on Sept 2 showing stable WBC (4.2) and slight drop in Hemoglobin (11.8). Chemotherapy Cycle 1 completed without fever or acute complications.'
    },
    {
      id: 'apt_initial_01',
      caseId: 'case_eleanor_01',
      title: 'Initial Multidisciplinary Breast Oncology Consultation',
      date: '2026-08-24',
      time: '02:00 PM',
      provider: 'Dr. Sarah Jenkins, MD',
      specialty: 'Medical Oncology',
      location: 'St. Jude Cancer Center, Suite 400',
      status: 'Completed',
      linkedDocIds: ['doc_pathology_01', 'doc_imaging_mri_01', 'doc_consult_01', 'doc_script_01'],
      patientQuestions: [
        'What is the recommended sequence of chemo vs surgery?',
        'What genetic testing panel is recommended?'
      ],
      sinceLastVisitSummary: 'Biopsy confirmed HER2+ Invasive Ductal Carcinoma. Treatment regimen established.'
    }
  ],

  timelineEvents: [
    {
      id: 'evt_01',
      caseId: 'case_eleanor_01',
      date: '2026-08-14',
      title: 'Diagnostic Imaging (Mammogram & MRI)',
      category: 'Imaging',
      description: 'BI-RADS Category 5 lesion identified in left breast.',
      linkedDocId: 'doc_imaging_mri_01'
    },
    {
      id: 'evt_02',
      caseId: 'case_eleanor_01',
      date: '2026-08-18',
      title: 'Core Needle Biopsy Pathology Confirmation',
      category: 'Pathology',
      description: 'Confirmed Invasive Ductal Carcinoma (Grade 2, ER+/PR+/HER2+).',
      linkedDocId: 'doc_pathology_01'
    },
    {
      id: 'evt_03',
      caseId: 'case_eleanor_01',
      date: '2026-08-24',
      title: 'Medical Oncology Treatment Plan Consultation',
      category: 'Consultation',
      description: 'Neoadjuvant Paclitaxel + Trastuzumab protocol established.',
      linkedDocId: 'doc_consult_01'
    },
    {
      id: 'evt_04',
      caseId: 'case_eleanor_01',
      date: '2026-09-01',
      title: 'Chemotherapy Infusion Cycle 1 Completed',
      category: 'Treatment',
      description: 'First outpatient infusion administered successfully at St. Jude.',
      linkedDocId: 'doc_bill_01'
    },
    {
      id: 'evt_05',
      caseId: 'case_eleanor_01',
      date: '2026-09-02',
      title: 'Mid-Cycle Blood Work (CBC & CMP)',
      category: 'Lab Work',
      description: 'WBC 4.2 x10^3/uL, Hemoglobin 11.8 g/dL.',
      linkedDocId: 'doc_lab_cbc_01'
    }
  ],

  caregivers: [
    {
      id: 'cg_01',
      name: 'David Vance',
      relation: 'Spouse',
      role: 'Contribute',
      email: 'david.vance@example.com',
      accessGrantedDate: '2026-08-15'
    },
    {
      id: 'cg_02',
      name: 'Maya Vance',
      relation: 'Daughter',
      role: 'View Only',
      email: 'maya.vance@example.com',
      accessGrantedDate: '2026-08-20'
    }
  ],

  // State Manipulation Helper Functions
  getActiveCase() {
    return this.cases.find(c => c.id === this.activeCaseId) || this.cases[0];
  },

  getCaseDocuments() {
    return this.documents.filter(d => d.caseId === this.activeCaseId);
  },

  getCaseAppointments() {
    return this.appointments.filter(a => a.caseId === this.activeCaseId);
  },

  getCaseTimeline() {
    return this.timelineEvents.filter(t => t.caseId === this.activeCaseId);
  },

  addDocument(docObj) {
    this.documents.unshift(docObj);
    // Also create timeline event automatically if applicable
    this.timelineEvents.unshift({
      id: 'evt_' + Date.now(),
      caseId: docObj.caseId,
      date: docObj.documentDate,
      title: 'Uploaded: ' + docObj.title,
      category: docObj.category,
      description: docObj.summary,
      linkedDocId: docObj.id
    });
  },

  addPatientQuestion(appointmentId, questionText) {
    const apt = this.appointments.find(a => a.id === appointmentId);
    if (apt) {
      apt.patientQuestions.push(questionText);
    }
  }
};

window.CareState = CareState;
