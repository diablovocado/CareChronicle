/* ==========================================================================
   CareChronicle - Sample Fictional Data (v2.0 Phase 1)
   Fictional Cases:
   1. Self — Aarav Mehta (Oncology Care)
   2. Parent — Meera Mehta (Senior Cardiac Care)
   3. Family Member — Rajesh Mehta (General Care)
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
      category: 'Pathology',
      documentDate: '2026-08-10',
      provider: 'Dr. Ramesh Kumar, MD',
      facility: 'Apollo Pathology Services',
      appointmentId: 'apt_01',
      provenance: 'Original',
      verificationState: 'Verified',
      confidenceScore: 0.98,
      fileSize: '2.1 MB',
      summary: 'Infiltrating moderately differentiated adenocarcinoma. Tumor extends into submucosa. Surgical margins clear.',
      extractedData: {
        specimen: 'Sigmoid Colon Biopsy',
        histologicType: 'Adenocarcinoma',
        grade: 'Grade 2 (Moderately Differentiated)',
        margins: 'Negative'
      }
    },
    {
      id: 'doc_02',
      caseId: 'case_aarav_01',
      title: 'Contrast-Enhanced CT Abdomen & Pelvis',
      category: 'Imaging',
      documentDate: '2026-08-14',
      provider: 'Dr. Priya Nair (Radiology)',
      facility: 'Apollo Diagnostic Imaging',
      appointmentId: 'apt_01',
      provenance: 'Extracted',
      verificationState: 'Verified',
      confidenceScore: 0.94,
      fileSize: '4.5 MB',
      summary: '3.1 cm focal wall thickening in sigmoid colon. No evidence of distant hepatic or pulmonary metastasis.',
      extractedData: {
        lesionSize: '3.1 x 2.4 cm',
        stageEstimate: 'T2 N0 M0',
        metastasis: 'None detected'
      }
    },
    {
      id: 'doc_03',
      caseId: 'case_aarav_01',
      title: 'Pre-Operative CBC & Coagulation Profile',
      category: 'Lab Results',
      documentDate: '2026-08-28',
      provider: 'Central Clinical Labs',
      facility: 'Apollo Hospital Labs',
      appointmentId: 'apt_02',
      provenance: 'Extracted',
      verificationState: 'Verified',
      confidenceScore: 0.96,
      fileSize: '1.2 MB',
      summary: 'Hemoglobin 13.2 g/dL, Platelets 220,000 /uL, INR 1.05. Normal coagulation for scheduled resection.',
      extractedData: {
        hemoglobin: '13.2 g/dL',
        wbc: '6.4 x10^3/uL',
        platelets: '220,000 /uL',
        inr: '1.05'
      }
    },
    {
      id: 'doc_04',
      caseId: 'case_aarav_01',
      title: 'Surgical Oncology Consultation & Plan',
      category: 'Doctor Note',
      documentDate: '2026-08-15',
      provider: 'Dr. Ananya Sharma',
      facility: 'Apollo Cancer Centre',
      appointmentId: 'apt_01',
      provenance: 'Extracted',
      verificationState: 'Verified',
      confidenceScore: 0.97,
      fileSize: '780 KB',
      summary: 'Laparoscopic Sigmoid Colectomy planned for Sept 12, 2026. Pre-hab dietary and physical instructions provided.',
      extractedData: {
        plannedProcedure: 'Laparoscopic Sigmoid Colectomy',
        scheduledDate: '2026-09-12',
        hospitalStay: '3-4 Days'
      }
    },
    {
      id: 'doc_05',
      caseId: 'case_meera_02',
      title: '24-Hour Holter ECG Monitoring Report',
      category: 'Cardiology',
      documentDate: '2026-07-22',
      provider: 'Dr. Vikram Patel',
      facility: 'Max Super Speciality Hospital',
      appointmentId: 'apt_03',
      provenance: 'Original',
      verificationState: 'Verified',
      confidenceScore: 0.95,
      fileSize: '3.4 MB',
      summary: 'Sinus rhythm with occasional premature atrial contractions (PACs). No prolonged sinus pauses observed.',
      extractedData: {
        avgHeartRate: '72 bpm',
        maxHeartRate: '118 bpm',
        pacs: '142 total events'
      }
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
