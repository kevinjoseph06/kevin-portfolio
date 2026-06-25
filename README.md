# Kevin Joseph | Full Stack Developer Portfolio 🚀

A highly interactive, visually striking personal portfolio built with modern web technologies, showcasing engineering capabilities through cinematic 3D effects, physics-based animations, and responsive layouts.

## 🌟 Live Demo
[*https://kevinjoseph.vercel.app/*](#)

## 🛠️ Technology Stack
This portfolio is engineered for maximum performance and visual impact using:
- **Core:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Animations:** GSAP (GreenSock), Framer Motion
- **Scroll Physics:** Lenis (for buttery-smooth desktop scrolling)
- **Icons:** Lucide React

## ✨ Key Features
- **Cinematic Hero:** Features mouse-tracking telemetry, dynamic cursor spotlights, and parallax depth effects.
- **Project Prisma (3D Cube):** An interactive, draggable 3D CSS cube to explore featured projects without loading new pages.
- **System Sandbox:** A simulated network topology builder demonstrating complex layout capabilities.
- **Proficiency Matrix:** A 3D interactive Fibonacci sphere rotating skill tags.
- **Bento Analytics Grid:** A sleek, dashboard-style UI highlighting metadata, GitHub stats, and core competencies.
- **Experience Timeline:** A responsive, dynamically drawn timeline detailing academic and professional milestones.
- **Responsive Architecture:** Aggressively optimized for mobile devices with native scrolling fallbacks and compacted UI components to prevent layout shift.

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+ recommended) installed.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/kevinjoseph06/kevin-portfolio.git
   ```
2. Navigate into the project directory:
   ```bash
   cd kevin-portfolio
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally
To spin up the local development server:
```bash
npm run dev
```
Open your browser and navigate to the localhost URL provided in your terminal (usually `http://localhost:5173`).

## 📁 Project Structure
- `src/components/` - Contains all reusable modular UI elements (BentoGrid, ThreeDCube, SmoothScroller, etc.)
- `src/App.tsx` - The main layout orchestrator containing all GSAP scroll triggers and section wrappers.
- `src/index.css` - Custom CSS containing 3D perspective rules, hidden scrollbars, and keyframe animations.
- `src/data.ts` - Local data store for projects and timeline events.

## 🎨 Design Philosophy
The UI follows a strict dark-mode aesthetic utilizing deep blacks (`#030303`), subtle atmospheric glows, cyan/purple accent gradients, and monospace telemetry typography to mimic an advanced operational dashboard.

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).

---
*Engineered by Kevin Joseph © 2026*
