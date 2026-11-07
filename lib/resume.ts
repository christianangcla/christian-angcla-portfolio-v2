// ============================================================================
// Christian's Lab // Verified Resume & Professional Profile Data
// Factual details for Christian Constantino Angcla (DOST-ASTI & NU Manila)
// ============================================================================

export interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  badge: string;
  highlights: string[];
  tags?: string[];
}

export interface EducationItem {
  degree: string;
  field: string;
  institution: string;
  location: string;
  period: string;
  status: string;
  highlights: string[];
  tags?: string[];
}

export interface SkillCategory {
  title: string;
  code: string;
  description: string;
  skills: string[];
}

export interface CredentialItem {
  id: string;
  title: string;
  issuer: string;
  period: string;
  badge: string;
  summary: string;
  highlights?: string[];
  tags?: string[];
  verified: boolean;
}

export interface LabPillarItem {
  code: string;
  title: string;
  subtitle: string;
  description: string;
  metrics: string;
}

export interface FutureWorkItem {
  code: string;
  status: string;
  title: string;
  domain: string;
  description: string;
  stack: string[];
}

export const PROFILE_INFO = {
  fullName: "Christian Constantino Angcla",
  preferredName: "Christian C. Angcla",
  title: "Intern Software Developer • Full-Stack & Mobile Engineer",
  role: "Intern Software Developer — DOST-ASTI",
  tagline: "Intern Software Developer @ DOST-ASTI • BSIT @ NU Manila",
  location: "Manila / Cainta, Rizal, Philippines",
  email: "christianangcla4@gmail.com",
  github: "https://github.com/ChristianAngcla",
  linkedin: "https://linkedin.com/in/christianangcla",
  scholarships: "DOST-SEI JLSS Scholar • Doña Miguela M. Jhocson BLUE Scholar • Dean's Lister",
  summary:
    "BSIT student specializing in Mobile and Web Applications at National University Manila and Intern Software Developer at the DOST Advanced Science and Technology Institute (DOST-ASTI). Hands-on experience developing and deploying full-stack Web and Android applications using Flutter, React, Node.js, Express, MongoDB, and Firebase. Experienced in REST API development, authentication and RBAC, production deployment, API security, real-time notifications, data visualization, and regression testing. DOST-SEI JLSS Scholar and Dean's Lister.",
};

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: "exp-dost-asti",
    role: "Intern Software Developer",
    organization: "DOST Advanced Science and Technology Institute (DOST-ASTI)",
    location: "Diliman, Quezon City • Metro Manila",
    period: "2026 — Present",
    badge: "CURRENT INTERNSHIP",
    highlights: [
      "Engineering research-grade web and software systems at the Department of Science and Technology — Advanced Science and Technology Institute.",
      "Building modular full-stack features, REST API integrations, role-based access controls, and interactive telemetry interfaces.",
      "Collaborating with R&D engineers on software reliability, data validation, and deployment workflows.",
    ],
    tags: ["Full-Stack R&D", "REST APIs", "RBAC Security", "Telemetry Systems", "DOST-ASTI"],
  },
  {
    id: "exp-floodguard",
    role: "Mobile Developer / Full-Stack Contributor",
    organization: "FloodGuard Capstone Development Project • National University – Manila",
    location: "Sampaloc, Manila",
    period: "2025 — 2026",
    badge: "CAPSTONE LEAD ENGINEER",
    highlights: [
      "Architected the Flutter/Dart Android app (OpenStreetMap/Leaflet) and React/Vite Admin Dashboard with Firebase Auth, FCM push alerts, and barangay-scoped RBAC.",
      "Integrated station-specific OLS Multiple Linear Regression models (C13, C4, C8) for Sto. Niño, Nangka, and Tumana verified via strict 24/24 observations, MAE, RMSE, Mean Bias, and signed error.",
      "Hardened production Node.js/Express & MongoDB Atlas APIs with rate limiting, HTTP 429 protection, request coalescing, and regression tests.",
    ],
    tags: ["Flutter & Dart", "React & Vite", "Node.js & MongoDB", "OLS Forecasting", "Firebase FCM"],
  },
];

export const EDUCATION_DATA: EducationItem[] = [
  {
    degree: "Bachelor of Science in Information Technology",
    field: "Specialization in Mobile and Web Applications",
    institution: "National University, Manila",
    location: "Sampaloc, Manila",
    period: "August 2023 — Present",
    status: "DOST-SEI JLSS Scholar • Dean's Lister",
    highlights: [
      "Awarded the national DOST-SEI Junior Level Science Scholarship (JLSS) for merit in science and technology.",
      "Recipient of the Doña Miguela M. Jhocson BLUE Scholarship and consistent Dean's Lister (2023–Present).",
      "Specializing in cross-platform mobile development, full-stack web architecture, database systems, and information security.",
    ],
    tags: ["DOST-SEI JLSS Scholar", "BLUE Scholar", "Dean's Lister", "Mobile & Web Track"],
  },
  {
    degree: "Science, Technology, Engineering, and Mathematics (STEM)",
    field: "Senior High School — Academic Track",
    institution: "Arellano University, ABC Campus",
    location: "Caniogan, Pasig City",
    period: "2021 — 2023",
    status: "Graduated with High Honors • GPA 97",
    highlights: [
      "Graduated with High Honors, achieving a cumulative General Weighted Average (GPA) of 97.",
      "Built a rigorous foundation in calculus, quantitative statistics, physics, and scientific computing.",
      "Led research and analytical capstone projects preparing for university-level software engineering.",
    ],
    tags: ["High Honors (GPA 97)", "Quantitative Analysis", "STEM Research", "Academic Excellence"],
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: "Mobile & Frontend Engineering",
    code: "DOM_MOB",
    description:
      "Cross-platform Android and full-stack web interfaces, reactive state management, geospatial mapping, and responsive UI components.",
    skills: [
      "Flutter",
      "Dart",
      "React",
      "Vite",
      "JavaScript",
      "Tailwind CSS",
      "Chart.js & Leaflet",
      "HTML5 & CSS3",
      "Java (LibGDX)",
    ],
  },
  {
    title: "Backend, APIs & Security",
    code: "SRV_SEC",
    description:
      "RESTful API design, JWT authentication, role-based access control, endpoint rate limiting, scheduled jobs, and defensive reliability safeguards.",
    skills: [
      "Node.js",
      "Express.js",
      "REST APIs",
      "JWT Authentication",
      "Role-Based Access Control (RBAC)",
      "bcrypt Password Hashing",
      "API Rate Limiting & HTTP 429",
      "Scheduled Jobs",
      "Python (Basic)",
    ],
  },
  {
    title: "Databases, Cloud & Forecasting",
    code: "CLD_DAT",
    description:
      "Cloud-hosted persistence, real-time push notifications, production hosting, geospatial mapping, and station-specific OLS regression telemetry.",
    skills: [
      "MongoDB & Mongoose",
      "MongoDB Atlas",
      "MySQL",
      "Firebase Authentication",
      "Firebase Cloud Messaging (FCM)",
      "Firebase Hosting",
      "Render",
      "OpenStreetMap",
      "OLS Multiple Linear Regression",
    ],
  },
  {
    title: "Testing, Tooling & Practices",
    code: "QA_OPS",
    description:
      "Automated regression testing, API/integration verification, network packet inspection, and production Android APK release builds.",
    skills: [
      "Flutter Test",
      "API / Integration Testing",
      "Android APK Release Builds",
      "Git-based Deployment",
      "Git & GitHub",
      "Postman",
      "Wireshark",
      "Android Studio & VS Code",
    ],
  },
];

export const CREDENTIALS_DATA: CredentialItem[] = [
  {
    id: "cert-its-cyber",
    title: "IT Specialist – Cybersecurity",
    issuer: "Certiport, a Pearson VUE Business",
    period: "May 2026",
    badge: "CERTIFICATION",
    summary:
      "Industry certification validating core cybersecurity principles, threat mitigation, network defense, and security operations.",
    highlights: [
      "Validated defensive security principles, threat landscape analysis, and vulnerability mitigation.",
      "Covered authentication controls, encryption standards, network defense, and incident response.",
    ],
    tags: ["Network Defense", "Threat Mitigation", "Access Control", "SecOps"],
    verified: true,
  },
  {
    id: "cert-its-db",
    title: "IT Specialist – Databases",
    issuer: "Certiport, a Pearson VUE Business",
    period: "October 2026",
    badge: "CERTIFICATION",
    summary:
      "Industry certification covering relational database design, SQL querying, data integrity, indexing, and database administration.",
    highlights: [
      "Demonstrated proficiency in relational schema design, normalization, and referential integrity.",
      "Examined on complex SQL DDL/DML queries, indexing, transactions, and database security.",
    ],
    tags: ["Relational Schema", "SQL Optimization", "Data Integrity", "Indexing"],
    verified: true,
  },
  {
    id: "cert-pmi",
    title: "PMI – Project Management Ready",
    issuer: "Certiport / Project Management Institute",
    period: "October 2026",
    badge: "CERTIFICATION",
    summary:
      "Certified in traditional plan-based and agile project management methodologies, scope governance, and delivery workflows.",
    highlights: [
      "Certified in both traditional plan-based and Agile/Scrum software delivery frameworks.",
      "Validated competency in project scope governance, risk tracking, and stakeholder alignment.",
    ],
    tags: ["Agile & Scrum", "Scope Governance", "Risk Management", "PMI Standard"],
    verified: true,
  },
  {
    id: "cert-cisco",
    title: "Networking Basics • Networking Devices & Initial Config • Computer Hardware Basics",
    issuer: "Cisco Networking Academy",
    period: "June 2025",
    badge: "CISCO NETACAD",
    summary:
      "Completed three Cisco Networking Academy credentials covering network protocols, router/switch configuration, and hardware architecture.",
    highlights: [
      "Completed 3 Cisco NetAcad tracks covering IPv4/IPv6 addressing, OSI/TCP-IP layers, and packet inspection.",
      "Configured initial router/switch topologies, diagnostic CLI workflows, and computer hardware systems.",
    ],
    tags: ["TCP/IP & OSI", "Router/Switch CLI", "Packet Analysis", "Hardware Systems"],
    verified: true,
  },
  {
    id: "lead-aws",
    title: "Vice Chief Finance Officer — AWS Learning Club - Legarda",
    issuer: "Amazon Web Services Learning Club",
    period: "2026",
    badge: "LEADERSHIP",
    summary:
      "Assisted in managing operational resources and club assets, distributing AWS training materials, and coordinating logistics for student tech bootcamps and certification workshops.",
    highlights: [
      "Co-directed operational budgeting, resource allocation, and asset tracking for club initiatives.",
      "Coordinated distribution of AWS cloud training materials and certification study resources.",
      "Managed end-to-end event logistics for student cloud bootcamps and technical workshops.",
    ],
    tags: ["Resource Governance", "AWS Cloud Bootcamps", "Operations & Logistics"],
    verified: true,
  },
  {
    id: "lead-jbecp",
    title: "Treasurer — Junior Blockchain Education Consortium of the Philippines (NU Chapter)",
    issuer: "JBECP – NU Manila",
    period: "2024",
    badge: "FINANCE AWARD",
    summary:
      "Managed organizational finances and reporting, earning Outstanding Finance Officer recognition with an Unqualified Opinion.",
    highlights: [
      "Directed full-cycle financial stewardship, budget disbursements, and transparent audit reporting.",
      "Awarded Outstanding Finance Officer recognition for exemplary fiscal governance.",
      "Achieved an Unqualified Opinion—the highest audit rating for complete financial accuracy.",
    ],
    tags: ["Outstanding Finance Officer", "Unqualified Audit Opinion", "Fiscal Stewardship"],
    verified: true,
  },
  {
    id: "lead-ctf",
    title: "Capture the Flag (CTF) Cybersecurity Competition Participant",
    issuer: "National University Manila",
    period: "2024",
    badge: "CYBERSECURITY",
    summary:
      "Represented NU Manila in competitive cybersecurity challenges requiring analytical thinking, teamwork, and rapid problem-solving.",
    highlights: [
      "Selected to represent National University Manila in competitive Capture the Flag security events.",
      "Solved time-critical challenges across network forensics, cryptography, and web exploitation.",
      "Collaborated under pressure using Wireshark, packet inspection, and defensive analysis.",
    ],
    tags: ["Network Forensics", "Web Exploitation", "Cryptography", "Team Competition"],
    verified: true,
  },
];

export const LAB_PILLARS: LabPillarItem[] = [
  {
    code: "LAB_01 // APPLIED R&D",
    title: "Research-to-Production Systems",
    subtitle: "DOST-ASTI & Academic Engineering",
    description:
      "Christian’s Lab is an active software engineering proving ground where scientific research, hydrological telemetry, and academic prototypes are forged into resilient, user-ready software.",
    metrics: "PUBLIC R&D · TELEMETRY · REAL-WORLD IMPACT",
  },
  {
    code: "LAB_02 // END-TO-END STACK",
    title: "Unified Mobile & Web Architecture",
    subtitle: "Flutter · React · Node.js · MongoDB",
    description:
      "Every build is engineered across the entire vertical—pairing responsive React/Vite web consoles and cross-platform Flutter Android clients with modular Express and MongoDB REST backends.",
    metrics: "5 DEPLOYED WORLDS · CROSS-PLATFORM SYNC",
  },
  {
    code: "LAB_03 // DEFENSIVE BY DEFAULT",
    title: "Security & Transactional Integrity",
    subtitle: "RBAC · JWT · Rate Limiting · QA",
    description:
      "Security is treated as core architecture, not an afterthought—enforcing role-scoped permissions, bcrypt hashing, HTTP 429 rate-limit guards, and atomic inventory/state transitions.",
    metrics: "ZERO-TRUST API GUARDS · VERIFIED BUILDS",
  },
  {
    code: "LAB_04 // SPATIAL & KINETIC",
    title: "Predictive & Interactive Computing",
    subtitle: "OLS Forecasting · WebGL · GSAP Motion",
    description:
      "Combining mathematical modeling—such as station-specific OLS Multiple Linear Regression—with 60fps 3D spatial interfaces and choreographed stage transitions.",
    metrics: "3D SOLAR EXPEDITION · V5.2 CINEMATIC ENGINE",
  },
];

export const FUTURE_WORKS_DATA: FutureWorkItem[] = [
  {
    code: "HORIZON_01",
    status: "ACTIVE R&D // 2026",
    title: "Public-Sector R&D Software Systems",
    domain: "DOST Advanced Science and Technology Institute",
    description:
      "Developing and hardening scalable web modules, telemetry pipelines, and research-backed software systems as an Intern Software Developer at DOST-ASTI.",
    stack: ["Full-Stack Web", "REST APIs", "RBAC & Security", "Telemetry Visualization"],
  },
  {
    code: "HORIZON_02",
    status: "NEXT ITERATION",
    title: "FloodGuard v2: Multi-Basin AI & Mesh Alerts",
    domain: "Hydrological Early-Warning Evolution",
    description:
      "Expanding FloodGuard beyond Marikina River OLS regression into hybrid LSTM/ensemble forecasting, automated IoT water-level ingestion, and offline-first barangay SMS/mesh relays.",
    stack: ["Flutter", "Python / ML", "OLS + Time-Series", "Offline-First Sync"],
  },
  {
    code: "HORIZON_03",
    status: "ARCHITECTURE TRACK",
    title: "Distributed Microservices & DevSecOps Lab",
    domain: "High-Concurrency Backend Engineering",
    description:
      "Evolving campus and community platforms like Bulldogs Exchange and QuicKita with Dockerized services, Redis caching, automated CI/CD security scans, and load-tested API gateways.",
    stack: ["Node.js", "Docker", "Redis", "Automated QA & CI/CD"],
  },
  {
    code: "HORIZON_04",
    status: "CREATIVE TECH TRACK",
    title: "Spatial Telemetry & Interactive Simulation v6",
    domain: "WebGL / Three.js / Real-Time Shaders",
    description:
      "Pushing Christian’s Lab into live 3D geospatial command centers—merging real-time environmental feeds with interactive GPU particle physics and custom GLSL shaders.",
    stack: ["Three.js", "WebGL / GLSL", "GSAP", "Real-Time Data Streams"],
  },
];
