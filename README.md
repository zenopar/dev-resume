# DevResume — Single-Page A4 Developer Resume Builder

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/CVA-Class_Variance_Authority-violet?style=for-the-badge" alt="CVA" />
  <img src="https://img.shields.io/badge/PDF_Engine-@react--pdf/renderer-red?style=for-the-badge" alt="React PDF" />
</p>

A privacy-focused, single-page A4 developer resume generator built for software engineers, systems architects, and technical leads. DevResume enforces a strict 1-page boundary through real-time page budget monitoring, customizable typographic density scaling, and pure client-side vector PDF generation.

---

## Key Features

- **Strict 1-Page A4 Constraint**: Built-in dynamic height calculation with live visual feedback (`PageBudgetMeter`) to guarantee content fits on a single physical page.
- **Typographic Density Controls**: Granular control over font sizing and vertical spacing multipliers with automatic zoom fitting.
- **Pure Vector PDF Export**: Uses `@react-pdf/renderer` with locally bundled Unicode **Roboto** fonts for crisp, selectable vector text with full Latin Extended / Czech diacritics (`Ě, Š, Č, Ř, Ž, Ů, Ť, Ď, Ň`).
- **3 Curated Developer Templates**:
  - **Modern Monospace**: High-signal developer layout with monospaced metadata and clear technical hierarchy.
  - **Compact Split Sidebar**: High-density 2-column layout (58% / 38%) tailored for extensive skill matrices.
  - **Technical Minimal**: Academic LaTeX-inspired single-column format.
- **Resume Localization**: Toggle resume output between English (EN) and Czech (CS) without altering the editor interface.
- **Dual Storage Modes with Multi-CV Management**:
  - **Local SQLite Database (`USE_DB=true`)**: Automatically persists multiple CV profiles to a local SQLite database (`data/resumes.db`) powered by Node.js built-in `node:sqlite` and Next.js Server Actions.
  - **Browser LocalStorage (`USE_DB=false`)**: Zero-backend offline mode that also supports multiple CV profiles, switching, duplicating, renaming, and auto-saving directly in your browser.
- **Native Print Engine**: Clean `@media print` stylesheet optimized with 1:1 paper geometry for direct browser printing (`Ctrl + P`).
- **CVA Design System**: Component library built with `class-variance-authority`, `clsx`, and `tailwind-merge`.

---

## Configuration (`.env`)

You can configure persistence and security options in `.env`:

```env
# Storage Mode: Local SQLite database or browser localStorage
USE_DB=true

# Optional Password: If set, visitors must enter this password to view or edit CVs
# PASSWORD=your-secure-password
```

---

## Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Core**: [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/)
- **Backend / Persistence**: Next.js Server Actions, [node:sqlite](https://nodejs.org/api/sqlite.html)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Component Variants**: [Class Variance Authority (CVA)](https://cva.style/docs), [tailwind-merge](https://github.com/dcastil/tailwind-merge), [clsx](https://github.com/lukeed/clsx)
- **Vector PDF Engine**: [@react-pdf/renderer](https://react-pdf.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Architecture

```
src/
├── components/ui/       # CVA design system primitives (Button, Input, Card, Modal, Slider, etc.)
├── features/
│   ├── editor/          # 3x3 category navigation grid and section form controller
│   ├── personal-info/   # Personal info & contact details forms
│   ├── about-me/        # Professional summary form
│   ├── experience/      # Work experience timeline & markdown bullet support
│   ├── projects/        # Highlighted projects & live repositories
│   ├── skills/          # Categorized technical skill matrix
│   ├── education/       # Degrees, institutions & coursework
│   ├── certifications/  # Certifications & credentials
│   ├── awards/          # Competitions, hackathons & honors
│   ├── languages/       # CEFR language proficiency levels
│   ├── preview/         # A4 preview canvas, page budget meter, density controls & templates
│   ├── pdf/             # Vector PDF documents, styles, and local fonts
│   ├── auth/            # Optional master password security (PasswordGate, actions & cookie session)
│   └── resume/          # Resume feature domain:
│       ├── actions/     # Server Actions (resume.action.ts) & reducer actions
│       ├── components/  # Multi-CV switcher (CvSwitcher.tsx)
│       ├── services/    # Data persistence service (resume.service.ts)
│       ├── resumeContext.tsx # Global state provider
│       └── useLocalStorage.ts # Dual-mode storage adapter
├── lib/
│   ├── db.ts            # Native node:sqlite database operations
│   └── utils.ts         # cn utility helper
└── types/
    └── sqlite.d.ts      # TypeScript declarations for node:sqlite
```

---

## Installation & Usage

### Prerequisites
Before you begin, ensure you have the following installed on your system:
- **[Docker](https://docs.docker.com/get-docker/)** (Docker Desktop for Windows/Mac, or Docker Engine with the Compose plugin for Linux)
- **[Git](https://git-scm.com/downloads)** (to clone the repository)
- *(Optional for local development without Docker)*: **[Node.js](https://nodejs.org/)** (`v20+`, `v22.5+` or `v24+` recommended for the built-in SQLite engine) and `npm` / `pnpm` / `bun`.

### Quick Start

The recommended way to deploy DevResume is using Docker Compose.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/zenopar/cv-generator.git
   cd cv-generator
   ```

2. **Configure environment variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and set your desired storage mode (`USE_DB=true` to persist multiple CVs in local SQLite database `data/resumes.db`, or `USE_DB=false` for browser localStorage). You can also optionally set `PASSWORD=your-password` to require password authentication.

3. **Start the platform:**
   To start the platform using the pre-built Docker image, first pull the latest image and then start the services:
   ```bash
   docker compose pull
   docker compose up -d
   ```
   *(Optional: If you prefer to build the image locally from source, you can run `docker compose -f docker-compose.yml -f docker-compose.build.yml up -d --build` instead).*

4. **Access the application:**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

---

### Local Development (Node.js)

If you prefer to run the project directly on your host machine without Docker:

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/zenopar/cv-generator.git
   cd cv-generator
   cp .env.example .env
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Building for production:**
   ```bash
   npm run build
   npm run start
   ```





## License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
