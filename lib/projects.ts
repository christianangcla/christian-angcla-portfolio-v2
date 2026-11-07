export interface ProjectRepoLink {
  label: string;
  url: string;
}

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  description: string;
  image: string;
  gallery?: { src: string; label: string }[];
  tags: string[];
  highlights: string[];
  repoUrl?: string;
  repoUrls?: ProjectRepoLink[];
  demoUrl?: string;
  demoVideoUrl?: string;
  status:
    | "Capstone Production System"
    | "Full-Stack Application"
    | "Active Prototype"
    | "Completed Prototype"
    | "Prototype"
    | "Playable Prototype"
    | "Playable Showcase";
  year: string;
}

export const FEATURED_PROJECTS: Project[] = [
  {
    slug: "floodguard",
    title: "FloodGuard",
    tagline: "Full-stack Android & Web flood-risk monitoring and OLS regression early-warning system",
    category: "Geospatial Flood Forecasting & Full-Stack System",
    description:
      "Production-deployed capstone platform for flood-risk monitoring, station-specific OLS Multiple Linear Regression forecasting (Sto. Niño, Nangka, and Tumana), and real-time emergency coordination across Flutter Android and React/Vite web clients.",
    image: "/images/projects/floodguard.jpg",
    repoUrl: "https://github.com/christianangcla/FloodGuard-AI-Mobile",
    repoUrls: [
      {
        label: "Source (Mobile)",
        url: "https://github.com/christianangcla/FloodGuard-AI-Mobile",
      },
      {
        label: "Source (Web · Team)",
        url: "https://github.com/Migihhhh/FloodGuard-Website",
      },
    ],
    tags: [
      "Flutter & Dart",
      "React & Vite",
      "Node.js & Express",
      "MongoDB Atlas",
      "OpenStreetMap",
      "OLS Regression (C13/C4/C8)",
      "Firebase Auth & FCM",
      "JWT & RBAC",
      "Render",
    ],
    highlights: [
      "Developed Flutter/Dart Android app with OpenStreetMap geospatial risk mapping, Firebase Phone Auth, FCM alerts, emergency Help Requests, and production APK deployment",
      "Built React/Vite admin modules for operational dashboard, Forecast History, predicted-vs-actual analysis (MAE, RMSE, Mean Bias, signed error), Historical Replay, and audit logs",
      "Integrated station-specific OLS Multiple Linear Regression forecasting for Sto. Niño, Nangka, and Tumana using certified C13, C4, and C8 models with strict 24/24 observations",
      "Strengthened reliability with barangay-scoped RBAC, endpoint API rate limiting, brute-force & HTTP 429 protection, request coalescing, and automated regression testing",
    ],
    status: "Capstone Production System",
    year: "2025 — 2026",
  },
  {
    slug: "bulldogs-exchange",
    title: "Bulldogs Exchange",
    tagline: "Full-stack e-commerce platform with role-scoped workflows & transactional inventory",
    category: "Full-Stack E-Commerce Web Application",
    description:
      "A full-stack university e-commerce platform featuring product discovery, shopping carts, transactional checkout, order tracking, reviews, user profiles, and role-specific workflows for customers, sellers, and administrators.",
    image: "/images/projects/bulldogs-exchange-products.png",
    repoUrl: "https://github.com/christianangcla/BulldogsExchange-EcommerceWebsite",
    repoUrls: [
      {
        label: "Source",
        url: "https://github.com/christianangcla/BulldogsExchange-EcommerceWebsite",
      },
    ],
    gallery: [
      {
        src: "/images/projects/bulldogs-exchange-products.png",
        label: "01 · PRODUCTS CATALOG",
      },
      {
        src: "/images/projects/bulldogs-exchange-categories.png",
        label: "02 · SHOP CATEGORIES",
      },
    ],
    tags: [
      "React",
      "Vite",
      "Node.js",
      "Express",
      "MongoDB & Mongoose",
      "JWT Authentication",
      "bcrypt",
      "Tailwind CSS",
    ],
    highlights: [
      "Built RESTful APIs using Node.js, Express, and MongoDB/Mongoose across user, product, category, cart, order, and review modules",
      "Implemented bcrypt password hashing, JWT authentication, role-based access control (RBAC), protected routes, and seller-level ownership checks",
      "Engineered server-side validation and inventory safeguards including transactional checkout, stock deduction/restoration upon cancellation, and preorder rules",
      "Elevated UX with responsive layouts, reusable UI components, loading indicators, toast notifications, and destructive-action confirmation dialogs",
    ],
    status: "Full-Stack Application",
    year: "2026",
  },
  {
    slug: "intertwine",
    title: "Intertwine",
    tagline: "Cross-platform mobile social networking application",
    category: "Mobile & Real-Time Systems",
    description:
      "A solo-built Flutter and Dart mobile social networking prototype created as an Advanced Mobile Programming course exam project, featuring a home feed, user names and avatars, likes and comments on posts and notifications, and persistent likes and comments across logouts.",
    image: "/images/projects/intertwine.jpg",
    repoUrl: "https://github.com/christianangcla/Intertwine-SocialMediaApp",
    repoUrls: [
      {
        label: "Source",
        url: "https://github.com/christianangcla/Intertwine-SocialMediaApp",
      },
    ],
    tags: ["Flutter", "Dart", "Provider", "State Management"],
    highlights: [
      "Cross-platform mobile user interface built with Flutter, Dart, and Provider state management",
      "Interactive home feed with user names and avatars, plus likes and comments on posts and notifications",
      "Solo-built for an Advanced Mobile Programming course; likes and comments persist across logouts",
    ],
    status: "Prototype",
    year: "2026",
  },
  {
    slug: "how-to-train-your-birdie",
    title: "How to Train Your Birdie",
    tagline: "2D Android space shooter game built with Java & LibGDX for NU Tech Fiesta",
    category: "Android Game Development (Java & LibGDX)",
    description:
      "A 2D Android space shooter game developed for NU Tech Fiesta featuring multi-stage gameplay, animated enemies, boss battles, scoring, cutscenes, audio, and bilingual English/Tagalog content.",
    image: "/images/projects/birdie.jpg",
    tags: ["Java", "LibGDX", "Android"],
    highlights: [
      "Developed a playable 2D space shooter Android showcase project for NU Tech Fiesta with English/Tagalog localization, cutscenes, and audio",
      "Implemented Java/LibGDX gameplay systems for player movement, combat, animated enemies, scoring, health mechanics, and screen transitions",
      "Engineered multi-stage progression and custom boss battles",
    ],
    status: "Playable Showcase",
    year: "2025",
  },
];
