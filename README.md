<div align="center">

# Yash Savaliya — Full Stack .NET Developer Portfolio

[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)

<p align="center">
  A high-performance, modern, and aesthetically crafted personal portfolio engineered for <strong>Yash Savaliya</strong>, Full Stack .NET Developer and Data Analyst. Built with Next.js 15 App Router (Static Export), React 19, TypeScript, and Tailwind CSS v4.
</p>

[**View Live Portfolio**](https://yashsavaliya1113.github.io/portfolio/) &nbsp;|&nbsp; [**llms.txt**](https://yashsavaliya1113.github.io/portfolio/llms.txt)

---

### Lighthouse results (measured, local static export)

Lighthouse 13, default throttling, run against `out/` served under `/portfolio/`. Scores vary a little between runs.

| Page | Mobile (P / A / BP / SEO) | Desktop (P / A / BP / SEO) |
| :--- | :---: | :---: |
| Home | 95 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| AI Lab | 94 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| Blog list | 98 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |
| Blog article | 94 / 100 / 100 / 100 | 100 / 100 / 100 / 100 |

CLS is 0 on all four pages. Mobile LCP is about 2.2 to 2.6 s under simulated slow 4G.

</div>

---

## Highlights & Features

- **Blazing Fast Performance**: Statically exported with Next.js (`output: 'export'`) for instant CDN edge delivery with zero server latency.
- **Search and AI discoverability (SEO + GEO)**:
  - One canonical URL per page (trailing slash, matching the real route), unique titles and descriptions, Open Graph and Twitter cards.
  - JSON-LD: `Person` and `WebSite` site-wide, `ProfilePage` + `FAQPage` on the home page, `BlogPosting`, `Blog`, `CollectionPage`, `BreadcrumbList`, and project `CreativeWork`/`SoftwareSourceCode`. Only facts visible on the site are described, and `sameAs` lists verified profiles only.
  - Plain-text identity and a visible FAQ, plus a standard `llms.txt` and an open `robots.txt` with the sitemap.
- **SEO & Social Sharing**:
  - Dynamically generated `sitemap.xml` and `rss.xml` feeds for all static and dynamic project/blog routes.
  - Granular OpenGraph and Twitter card metadata with fallback image assets.
  - Strictly enforced heading hierarchy (`<h1>` through `<h3>`) across all pages.
- **Responsive Dark / Light Mode**:
  - System-aware and persistent theme toggle.
  - Curated contrast ratios meeting WCAG 2.1 AA and AAA standards across both color modes.
- **Interactive Pages & Sections**:
  - **Hero**: Clean typographic introduction with WebP profile avatar and direct action triggers.
  - **About**: Professional journey timeline spanning 2020 to 2026.
  - **Skills Matrix**: Categorized technical competencies (.NET, Angular, Azure, Microservices, CQRS, AI).
  - **Projects**: In-depth architecture breakdown, problem statements, API designs, and metrics for enterprise SaaS applications.
  - **AI Lab**: Honestly labelled AI experiments (built, learning, planned) with a working in-browser retrieval demo over the blog.
  - **Blog**: Technical articles rendered from Markdown/MDX with estimated reading time and syntax styling.
  - **Resume**: Full digital resume view with direct PDF download integration.

---

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Static HTML Export)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS custom design tokens
- **Type Safety**: [TypeScript 6](https://www.typescriptlang.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Content & Markdown**: `gray-matter`, `marked`, `reading-time`
- **Image Processing**: `sharp` (WebP conversion and multi-size icon generator)
- **Deployment**: [GitHub Actions](https://github.com/features/actions) & [GitHub Pages](https://pages.github.com/)

---

## Project Structure

```text
portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml            # Automated GitHub Pages CI/CD pipeline
├── content/
│   └── blog/                     # Markdown/MDX articles
│       └── building-saas-dotnet.mdx
├── public/                       # Static public assets
│   ├── avatar.webp               # Next-Gen WebP profile picture
│   ├── avatar.jpg                # Fallback JPEG profile picture
│   ├── favicon.png               # Optimized 48x48 PNG favicon
│   ├── favicon-32x32.png         # 32x32 PNG icon
│   ├── apple-touch-icon.png      # 180x180 iOS touch icon
│   ├── icon.svg                  # Vector SVG favicon
│   ├── llms.txt                  # LLM standard directory (llmstxt.org)
│   ├── resume.pdf                # Downloadable PDF resume
│   └── robots.txt                # Allow-all robots file with the sitemap
├── scripts/
│   ├── audit-all.mjs             # Post-build audit: metadata, JSON-LD, sitemap, links, anchors
│   ├── generate-seo.mjs          # Sitemap.xml & RSS.xml generation script
│   ├── optimize-assets.mjs       # Image and icon optimization script
│   └── test-server.mjs           # Local HTTP test server with Gzip & Cache-Control
├── src/
│   ├── app/                      # Next.js App Router routes & layouts
│   │   ├── layout.tsx            # Global layout with ProfilePage JSON-LD schema
│   │   ├── page.tsx              # Landing page (Hero, About, Skills, Projects, Contact)
│   │   ├── ai-lab/page.tsx       # AI Lab showcase
│   │   ├── blog/                 # Blog listing & article reader
│   │   ├── projects/[slug]/      # Case study detail pages
│   │   └── resume/page.tsx       # Interactive Resume page
│   ├── components/               # UI components & section modules
│   ├── config/                   # Site, profile, projects, and skills configuration
│   ├── lib/                      # Content parsing and helper utilities
│   ├── styles/
│   │   └── globals.css           # Tailwind v4 theme tokens & WCAG color schemes
│   └── types/                    # TypeScript interfaces
├── next.config.ts                # Next.js configuration (static export & base paths)
├── package.json                  # Scripts & project dependencies
└── tsconfig.json                 # TypeScript compiler configuration
```

---

## Getting Started

### 1. Prerequisites
- **Node.js**: v20 or higher
- **npm**: v10 or higher

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/yashsavaliya1113/portfolio.git
cd portfolio
npm install
```

### 3. Local Development
Run the local Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build & Static Export
Compile TypeScript, generate static HTML, sitemap, RSS feed, and AI manifests:
```bash
npm run build
```
The production bundle will be generated in the `out/` folder.

### 5. Automated Audit (SEO, structured data, links)
After a build, check titles, descriptions, canonicals, JSON-LD, the sitemap and every internal link and anchor. The CI deploy fails if any check fails:
```bash
npm run audit
```

### 6. Asset Optimization
Regenerate and optimize all icons, favicons, and WebP images:
```bash
npm run optimize-assets
```

---

## Deployment

The repository includes a GitHub Actions workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

Every push to the `main` branch automatically:
1. Installs dependencies (`npm ci`).
2. Runs the production build (`npm run build`).
3. Generates the sitemap, RSS feed and `llms.txt`, then runs the audit.
4. Uploads the `out/` directory as a GitHub Pages artifact.
5. Deploys the site live to GitHub Pages.

---

## Author & Contact

**Yash Savaliya**  
*Full Stack .NET Developer and Data Analyst*  
- **Location**: Ahmedabad, Gujarat, India  
- **Email**: [tpyashsavaliya13092002@gmail.com](mailto:tpyashsavaliya13092002@gmail.com)  
- **LinkedIn**: [linkedin.com/in/yash-savaliya-70989a1b4](https://www.linkedin.com/in/yash-savaliya-70989a1b4/)  
- **GitHub**: [github.com/yashsavaliya](https://github.com/yashsavaliya)  
- **Website**: [https://yashsavaliya1113.github.io/portfolio/](https://yashsavaliya1113.github.io/portfolio/)  
- **Live Deployment**: [https://yashsavaliya1113.github.io/portfolio/](https://yashsavaliya1113.github.io/portfolio/)

---

## License

This project is open-source and available under the [MIT License](LICENSE).
