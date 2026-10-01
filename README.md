# AIBizVan360 — Cascadia Corridor Intelligence Platform

> **AI-powered 360-degree regional intelligence platform for the Vancouver-Seattle-Portland Cascadia Innovation Corridor.**
> Live 24/7/365 public preview — no NDA required.

---

## 🌐 Live Preview (24/7/365 — No NDA Required)

**🔗 https://testdemoqwenai2025-creator.github.io/Demo4VanSea/**

This public preview is available 24 hours a day, 365 days a year. Investors, startups, seed funders, researchers, and the general public can observe the full platform without any NDA complications. No login required. No access restrictions. No gated content.

---

## 📋 What This Is

AIBizVan360 is a comprehensive regional intelligence platform covering the Cascadia bioregion — Vancouver BC, Seattle, Portland, and 30+ surrounding cities across Washington, Oregon, and British Columbia. The platform provides:

- **Real-time environmental intelligence** — air quality, water conditions, weather alerts, wildfire risk, facility emissions, energy mix (auto-refreshing every 15 minutes from public taxpayer-funded APIs)
- **Biodiversity intelligence** — citizen-science species observations, migration patterns, conservation project tracker, field research travel guide
- **Economic intelligence** — Cascadia Investor Readiness Score (CIRS), Deep Dive Reports, Four Moats (Founder Outcome Panel, Regulatory Diff Engine, Cryptographic Provenance, Cross-Border Friction Model)
- **Infrastructure project registry** — $60B+ in decade-ahead projects (HSR, hydrogen hub, I-5 bridge, salmon restoration, wildfire resilience, Indigenous conservation)
- **Research hub** — 13 universities, 13 funding opportunities, 15 student tools, 30 open datasets

---

## 🚀 Quick Start

### For Investors & Seed Funders
1. **Visit the live preview**: https://testdemoqwenai2025-creator.github.io/Demo4VanSea/
2. **Review the Market Assessment**: https://testdemoqwenai2025-creator.github.io/Demo4VanSea/MARKET_ASSESSMENT.md
3. **Explore the Dashboard**: https://testdemoqwenai2025-creator.github.io/Demo4VanSea/dashboard-2.html
4. **Check the Investor Readiness Scores**: https://testdemoqwenai2025-creator.github.io/Demo4VanSea/economics.html (scroll to CIRS section)
5. **Review the Four Moats**: https://testdemoqwenai2025-creator.github.io/Demo4VanSea/economics.html (scroll to Four Moats section)

### For Startups & Founders
1. **Find your city's score**: Economics page → CIRS section → select your city
2. **Generate a Deep Dive Report**: Economics page → Deep Dive Reports → select city + report type
3. **Calculate cross-border friction**: Economics page → Four Moats → Cross-Border Friction Model
4. **Browse funding opportunities**: Research Hub → Funding tab
5. **Find research collaborators**: Research Hub → Universities tab

### For Researchers & Students
1. **Browse open datasets**: Research Hub → Datasets tab (30+ free APIs)
2. **Find universities + contact emails**: Research Hub → Universities tab
3. **Access student tools**: Research Hub → Student Tools tab (filter by UG/Grad)
4. **Track biodiversity observations**: Biodiversity page → Load Gallery
5. **Monitor environmental data**: Environment Agency page (9 tabs of live data)

---

## 📊 Platform Statistics

| Metric | Value |
|---|---|
| **Total pages** | 50+ HTML pages |
| **Live data sources** | 30+ public APIs (all taxpayer-funded) |
| **Cities covered** | 10 anchor cities + 30 city detail pages |
| **Cascadia projects tracked** | 12 major projects ($60B+ decade investment) |
| **Universities in Research Hub** | 13 |
| **Funding opportunities listed** | 13 |
| **Open datasets catalogued** | 30 |
| **Auto-refresh intervals** | 10 min (weather), 15 min (environment), daily (regulatory) |
| **Cost to access** | $0 (public, no NDA) |
| **Uptime target** | 24/7/365 |

---

## 🏗️ Repository Structure

```
AISeaVanBiz4/                          # Private source repository
├── built-output/                      # Generated HTML files (auto-syncs to public)
│   ├── index.html                     # Overview page
│   ├── dashboard.html                 # Dashboard v1
│   ├── dashboard-2.html               # Dashboard v2 — Command Center
│   ├── economics.html                 # Economics + CIRS + Four Moats + Projects
│   ├── environment-agency.html        # Real-time environmental data (9 tabs)
│   ├── biodiversity.html              # Species observations + travel guide
│   ├── research-hub.html              # Universities + Funding + Tools + Datasets
│   ├── government.html                # Government & policy
│   ├── technology.html                # Technology sector
│   ├── transportation.html            # Transportation
│   ├── demographics.html              # Demographics
│   ├── resources.html                 # Resources
│   ├── environment.html               # Environment (static)
│   ├── sports.html                    # Sports business
│   ├── leisure.html                   # Leisure & attractions
│   ├── travel.html                    # Travel & hotels
│   ├── whatif-scenario.html           # What-If scenario engine
│   ├── city-compare.html              # City vs City comparison
│   ├── login.html                     # Login/Signup
│   ├── city-*.html                    # 30+ city detail pages
│   ├── cities-data.json               # 10-city economic data (CIRS backbone)
│   ├── investor-readiness-score.js    # CIRS scoring engine
│   ├── founder-outcomes.json          # Founder Outcome Panel data
│   ├── project-registry.json          # 12 decade-ahead projects
│   ├── banners/                       # 10 AI-generated city banners
│   ├── images/sectors/                # 6 AI-generated sector images
│   └── moats/                         # Four Moats data (regulatory, provenance, friction)
├── scripts/                           # Build + injection scripts
│   ├── audit-enhanced.py              # Pre-push audit (16 checks)
│   ├── comprehensive-site-fix.py      # Site-wide fix script
│   ├── add-research-hub-nav.py        # Nav link injector
│   └── ...                            # Other build scripts
├── docs/                              # Documentation
│   ├── MARKET_ASSESSMENT.md           # Investor brief
│   ├── development-log.md             # Sprint-by-sprint log
│   ├── TWENTY-YEAR-ROADMAP.md         # 2026-2046 evolution plan
│   └── STRATEGIC-ENHANCEMENT-MEMO.md  # Feature roadmap
└── .github/workflows/
    └── sync-to-preview.yml            # Auto-sync to public repo (with safety checks)
```

**Public mirror**: [Demo4VanSea](https://github.com/testdemoqwenai2025-creator/Demo4VanSea) — auto-synced from `built-output/` on every push to private repo.

---

## 🔄 Sync Pipeline

```
Private repo (AISeaVanBiz4)
    │
    │ git push to main
    │
    ▼
GitHub Actions: sync-to-preview.yml
    │
    │ Pre-flight safety check:
    │   - Diffs file lists between public + private
    │   - ABORTS if unexpected files would be deleted
    │   - Prevents destructive syncs
    │
    │ rsync built-output/ → Demo4VanSea/
    │
    ▼
Public repo (Demo4VanSea)
    │
    │ GitHub Pages auto-deploy
    │
    ▼
https://testdemoqwenai2025-creator.github.io/Demo4VanSea/  (24/7/365)
```

---

## 🛡️ Audit & Quality Assurance

Before every push, `audit-enhanced.py` runs 16 checks on all 50+ pages:

1. Basic HTML structure (html/head/body tags)
2. Viewport meta (responsive)
3. Title present
4. Header presence (bvs-header or nav-bar)
5. Theme toggle button present
6. Footer present
7. dashboard-2 link in nav
8. **CSS classes used but not defined** (catches missing CSS injection)
9. Unclosed script/style tags
10. **JS outside script blocks** (orphaned code)
11. Tag balance (header/footer/main/section/nav)
12. Duplicate IDs
13. Image references exist
14. Inline event handlers referencing undefined functions
15. External script/CSS references exist
16. Grid template columns mismatch

**Current audit status**: 50 pass, 0 warn, 0 fail ✅

---

## 🎨 Design System

- **Primary color**: `#4ecdc4` (Cascadia teal)
- **Background**: `#0d1212` (dark) / `#f5f7f7` (light)
- **Typography**: System font stack (San Francisco / Segoe UI / Inter)
- **Card radius**: 8px
- **Banner style**: "Cascadia Through the Mist" — per-city AI-generated banners with locked style suffix
- **Theme**: Dark (default) + Light toggle (persists via localStorage)

---

## 📈 Key Features

### Cascadia Investor Readiness Score (CIRS)
- 10 cities scored across 5 weighted dimensions (Market Momentum, Capital Access, Talent Pipeline, Cost Efficiency, Resilience & Quality)
- 20 indicators, min-max normalized across cohort
- Live computation in-browser from `cities-data.json`
- Tier system: Premier (80+) / Strong (60-79) / Developing (40-59) / Emerging (<40)

### Four Moats (Uncopyable Capabilities)
1. **Founder Outcome Panel** — 50 synthetic founders tracked 2015-2025 (real recruitment begins Q4 2026)
2. **Real-Time Regulatory Diff Engine** — US Federal Register API, 109 publications in past 30 days
3. **Cryptographic Provenance Layer** — 190 field-level SHA-256 hashes, 130/190 from taxpayer-funded sources
4. **Cross-Border Friction Model** — US/CA-specific calculator (currency, tax, immigration, customs, healthcare)

### Environment Agency (9 tabs, 15-min refresh)
- Air Quality (8 cities, Open-Meteo API)
- Water (7 USGS stream gauges)
- Weather Alerts (NOAA NWS)
- Facility Emissions (EPA Envirofacts, 1,010 WA TRI facilities)
- Energy Mix (WA/OR/BC)
- Climate Analysis (expected vs observed, 6 cities)
- Wildfire Risk (WA/OR/BC profiles + 6 live resources)
- Wildlife Migration (8 species, seasonal iNaturalist data)
- Agency Budget (EPA $9.13B + WA $510M + OR $350M + BC $302M CAD)
- Projects Decade ($60B+ in 12 projects)

### Biodiversity (lazy-loaded)
- 10 species categories, iNaturalist API
- Click-to-load gallery (no bandwidth wasted)
- Observation density grid (8×5, 40 cells, batch-fetched)
- Seasonal wildlife calendar
- Field research travel guide (4 seasons)
- Conservation project tracker

### Research Hub
- 13 universities with contact emails (pre-filled mailto: links)
- 13 funding opportunities (NSF, EPA, NASA, DOE, NSERC + foundations)
- 15 student tools (UG/Grad filter)
- 30 open datasets (quality-rated, with API links)

---

## 🔓 Data Philosophy

All data on this platform comes from **public, taxpayer-funded sources**:

| Source | Type | License |
|---|---|---|
| EPA (AirNow, Envirofacts, EJScreen, SDWIS) | US Federal | Public domain |
| USGS (Water Services, NLCD) | US Federal | Public domain |
| NOAA (NWS, Climate Data Online, Storm Events) | US Federal | Public domain |
| NASA (FIRMS) | US Federal | Public domain |
| EIA (electricity) | US Federal | Public domain |
| NSF (Award Search) | US Federal | Public domain |
| NSERC (Canadian grants) | Canadian Federal | Public |
| Statistics Canada | Canadian Federal | Open Government License |
| BC Data Catalogue | Provincial | Open Government License BC |
| WA Dept of Ecology Open Data | State | Public |
| Open-Meteo (ERA5 reanalysis) | EU-funded | CC-BY 4.0 |
| iNaturalist | Citizen science | CC-BY observations |
| GBIF | International | CC-BY 4.0 |
| Crossref | Non-profit | CC0 |

**No government should restrict public access to public data. No private platform should gate it behind subscriptions.** This platform is built entirely from public sources to demonstrate that defensibility comes from integration and interpretation, not data hoarding.

---

## 📞 Contact

- **Live preview**: https://testdemoqwenai2025-creator.github.io/Demo4VanSea/
- **Market assessment**: https://testdemoqwenai2025-creator.github.io/Demo4VanSea/MARKET_ASSESSMENT.md
- **Investor inquiries**: Contact via the live preview (no NDA required)
- **Research collaborations**: Research Hub → Universities tab → email research offices directly

---

## 📄 License

- **Code**: MIT
- **Data**: Respective public source licenses (see Data Philosophy above)
- **AI-generated images**: CC-BY 4.0 (generated via z-ai-web-dev-sdk)
- **Content**: CC-BY 4.0

---

## 🙏 Acknowledgments

Built with data from: EPA, USGS, NOAA, NASA, EIA, NSF, NSERC, Statistics Canada, BC Data Catalogue, WA Dept of Ecology, Open-Meteo, iNaturalist, GBIF, Crossref, and dozens of other public sources.

Taxpayer-funded data should be freely accessible to the public. This platform exists to demonstrate that principle.

---

*v1.0 — September 2026. Live 24/7/365 at https://testdemoqwenai2025-creator.github.io/Demo4VanSea/*
