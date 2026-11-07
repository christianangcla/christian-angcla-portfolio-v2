# Christian's Lab — Software Engineering Portfolio

Personal engineering portfolio and interactive 3D project showcase of **Christian Constantino Angcla** (Intern Software Developer at DOST-ASTI; BSIT specializing in Mobile and Web Applications at National University Manila; DOST-SEI JLSS Scholar & Doña Miguela M. Jhocson BLUE Scholar).

## Overview

Christian's Lab presents selected full-stack web and mobile applications, technical disciplines, academic credentials, and certifications across two viewing modes:
- **Editorial Portfolio (`PhaseOnePortfolio`)**: Structured showcase of featured engineering case studies (including FloodGuard, Bulldogs Exchange, QuicKita, Intertwine, and How to Train Your Birdie), technical capabilities, education, certifications, and leadership history.
- **3D Expedition Mode (`CosmicWorld` + `UniverseOverlay`)**: An interactive WebGL solar system where visitors can navigate between project destinations and inspect project dossiers.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **UI & Runtime:** React 19, TypeScript 5
- **Styling:** Tailwind CSS v4, custom CSS variables & stage styles
- **3D & Motion:** Three.js (`three`), GSAP (`gsap`), Lenis (`lenis`)
- **Typography:** Geist Sans & Geist Mono (`next/font/google`)

## Getting Started

### Prerequisites
- Node.js 20+ and npm

### Installation & Local Development

```bash
# Install dependencies
npm install

# Start the development server at http://localhost:3000
npm run dev
```

### Production Build

```bash
# Create an optimized production build
npm run build

# Start the production server
npm run start
```

## Project Structure

```text
├── app/
│   ├── layout.tsx              # Root layout, fonts, theme script, and global shell
│   ├── page.tsx                # Entry point switching between Portfolio and 3D Expedition modes
│   └── globals.css             # Global design tokens and base styles
├── components/
│   ├── layout/                 # SiteHeader, SiteFooter, GalaxyNav, ThemeToggle
│   ├── portfolio/              # PhaseOnePortfolio, PortfolioHero, CinematicStage, HeroEnvironment
│   ├── scroll/                 # SmoothScroll (Lenis + GSAP ScrollTrigger synchronization)
│   ├── theme/                  # ThemeProvider (light/dark state management)
│   ├── universe/               # UniverseOverlay (3D Expedition HUD and project dossiers)
│   └── visual/                 # CosmicWorld (Three.js WebGL background canvas)
├── lib/
│   ├── projects.ts             # Featured project metadata, highlights, and repository links
│   ├── resume.ts               # Profile summary, education, experience, skills, and certifications
│   └── universeNavigation.ts   # External store managing 3D flight coordinates and mode state
├── public/
│   ├── images/projects/        # Project screenshots and gallery assets
│   └── resume.pdf              # Downloadable single-page CV/resume (user-supplied)
└── docs/
    ├── AUDIT.md                # Comprehensive engineering & design audit
    └── AUDIT-SUMMARY.md        # Compact audit summary
```

## Contact

- **Email:** [christianangcla4@gmail.com](mailto:christianangcla4@gmail.com)
- **GitHub:** [github.com/ChristianAngcla](https://github.com/ChristianAngcla)
- **LinkedIn:** [linkedin.com/in/christianangcla](https://linkedin.com/in/christianangcla)
