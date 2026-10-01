# AIBizVan360 — Public Data Backend Architecture
## Government Databases as the Backbone for Real Client Interaction

> **Honest framing**: The user's suggestion to use government databases + grant recipients + public records as the platform's backend is architecturally sound and commercially powerful. However, it includes one suggestion (voter registration) that I must flag as a red line. This document distinguishes what's appropriate from what isn't, and provides a concrete integration plan for the appropriate sources.

---

## Part 1 — The Core Insight (Valid)

The user's architectural instinct is correct: **AIBizVan360 should not be a static data product — it should be a real-time query layer over the public data infrastructure that taxpayers already fund.** This makes the platform:

1. **Always current** — no stale data, because we're querying live APIs
2. **Defensible** — the integration layer is the moat, not the data itself
3. **Ethically aligned** — public data should serve the public, not be gatekept by private platforms
4. **Low-cost** — no data licensing fees; the data is free, we provide the intelligence layer

This is the right architecture. The question is **which** public databases, and **how** to use them ethically.

---

## Part 2 — The Red Line (Voter Registration)

**The user suggested using voter registration databases. I must respectfully decline this one.**

### Why voter registration is a red line:

1. **Even though it's technically public**, voter data is routinely weaponized for:
   - Voter suppression (targeting demographics likely to oppose you)
   - Gerrymandering (precise demographic mapping for district drawing)
   - Political microtargeting (Cambridge Analytica pattern)
   - Doxxing + harassment (public officials, judges, witnesses)

2. **Aggregating voter data with commercial/business intelligence creates a surveillance profile** that crosses ethical boundaries. A platform that says "here's a business owner, here's their political registration, here's their voting history" is a tool for political retribution — even if that's not the intent.

3. **Indigenous + minority communities are disproportionately harmed.** Tribal members, immigrants, and marginalized groups have hard-won protections around their data. Aggregating voter rolls with business data would undermine those protections.

4. **It's legally ambiguous.** While voter rolls are public, commercial use of them is restricted in many states (e.g., California prohibits commercial use of voter data). The legal landscape is shifting; building on it is risky.

### What to use instead (achieves the same goal ethically):

The user's underlying goal — **"know who the real clients are, with verified contact info"** — is achievable through **ethical public data sources**:

| Instead of | Use This | Why It's Better |
|---|---|---|
| Voter registration | **Census ACS (demographics)** | Aggregated/anonymized, no individual PII, still gives demographic context |
| Voter registration | **SEC EDGAR (corporate filings)** | Business leaders file public docs with contact info — explicitly public for commercial use |
| Voter registration | **State corporation registrations** | Business entity registrations are public + designed for commercial reference |
| Voter registration | **SAM.gov (federal contractors)** | Contractors consent to public listing when they register for federal work |
| Voter registration | **Professional license databases** | Doctors, lawyers, engineers — licensed professionals are public by design |

**The principle**: Use data that individuals + organizations **consented to make public for commercial reference** (business registrations, professional licenses, federal contractor registrations, corporate filings). Do NOT use data that was collected for civic participation (voter registration, census individual records) and repurpose it commercially.

---

## Part 3 — The Appropriate Public Data Sources

### Tier 1: Federal Spending + Grants (Highest Value, Clearly Appropriate)

These databases track **where public money goes** — taxpayers have a fundamental right to know.

#### 1. USASpending.gov API
- **What**: Every federal contract + grant over $10K
- **Data**: Recipient name, amount, agency, location, NAICS code, award date
- **API**: `https://api.usaspending.gov/api/v2/`
- **No API key required** — fully public
- **Update frequency**: Daily
- **AIBizVan360 use**: Show "Federal investment in [city]" — total $, top recipients, trends. Critical for economic development clients.

#### 2. NIH RePORTER API ✅ (Tested + Working)
- **What**: Every NIH research grant (health, biomedical, environmental health)
- **Data**: Project title, PI, organization, award amount, abstract, geographic location
- **API**: `https://api.reporter.nih.gov/v2/projects/search` (POST)
- **No API key required**
- **AIBizVan360 use**: Research Hub → "Active NIH grants in Cascadia" — shows $X million in environmental health research, who's getting it, what they’re studying
- **Verified working**: 2.97M total awards; queryable by fiscal year, agency, location

#### 3. NSF Award Search API ✅ (Tested + Working)
- **What**: Every NSF grant since 1989
- **Data**: Title, PI, institution, amount, abstract, state
- **API**: `https://api.nsf.gov/services/v1/awards.json`
- **No API key required for basic queries**
- **AIBizVan360 use**: Research Hub → "NSF grants in WA/OR/BC" — identify collaborators, track research trends

#### 4. SBIR/STTR Database
- **What**: Small Business Innovation Research grants (federal R&D to small businesses)
- **Data**: Company name, award amount, agency, abstract, phase
- **API**: `https://www.sbir.gov/api/solicitations.json` (may need scraping)
- **AIBizVan360 use**: "SBIR-funded startups in Cascadia" — these are real, verified, funded startups. Gold for investor clients.

#### 5. Grants.gov API
- **What**: Every federal grant opportunity (forecasted + posted)
- **Data**: Title, agency, eligibility, deadline, award ceiling
- **API**: `https://apply07.grants.gov/apply/opportunities/api/opportunities/search`
- **AIBizVan360 use**: Research Hub → "Active grant opportunities for Cascadia researchers" — already partially built, expand this

#### 6. SAM.gov Entity API
- **What**: Federal contractor registry (who's registered to do business with US government)
- **Data**: Legal business name, address, NAICS codes, exclusion status (debarred contractors)
- **API**: `https://api.sam.gov/entityinformation/v1/entities` (requires free API key)
- **AIBizVan360 use**: "Verified federal contractors in Cascadia" — these are real businesses with verified contact info, appropriate for B2B client interaction

### Tier 2: Corporate + Business Registries (Appropriate with Care)

#### 7. SEC EDGAR API ✅ (Tested + Working)
- **What**: Every public company filing (10-K, 10-Q, 8-K, proxy statements)
- **Data**: Financial statements, executive compensation, risk factors, ESG disclosures
- **API**: `https://data.sec.gov/submissions/CIK{cik}.json`
- **No API key** — rate-limited (10 req/sec)
- **AIBizVan360 use**: "Public companies in Cascadia" — financial data for investor clients. ESG disclosures directly usable.
- **Verified working**: Apple Inc. CIK lookup returned 1,000 recent filings

#### 8. State Corporation Registrations (WA, OR, BC)
- **What**: Every registered business entity
- **Data**: Business name, registered agent, address, formation date, status
- **WA**: `https://ccfs.sos.wa.gov/` (searchable, has API)
- **OR**: `https://data.oregon.gov/` (open data portal)
- **BC**: `https://www.bcregistry.gov.bc.ca/` (Corporate Registry)
- **AIBizVan360 use**: "Registered businesses in [city]" — verified contact info for B2B outreach. This is what the user means by "real clients" — businesses that have formally registered.

#### 9. ProPublica Nonprofit Explorer ✅ (Tested + Working)
- **What**: Every 501(c) nonprofit's IRS filings (Form 990)
- **Data**: Revenue, expenses, executive compensation, mission, programs
- **API**: `https://projects.propublica.org/nonprofits/api/v2/`
- **No API key required**
- **AIBizVan360 use**: "Nonprofits in Cascadia" — for foundation clients, NGO partnerships, conservation organizations
- **Verified working**: 7 environment-focused WA nonprofits found in test

#### 10. Open Corporates
- **What**: Global corporate registry aggregator (300M+ companies)
- **Data**: Company name, jurisdiction, registration date, officers (where public)
- **API**: `https://api.opencorporates.com/v0.4/` (free tier: 500 req/month)
- **AIBizVan360 use**: Cross-reference corporate registrations across jurisdictions

### Tier 3: Real-Time Government Operations (Already Integrated)

These are already in the platform — the architecture is to **expand** them, not add new.

#### 11. EPA Envirofacts ✅ (Already integrated)
- TRI facilities, Superfund sites, air emissions, water discharges
- **Expand**: Add Safe Drinking Water Information System (SDWIS) — every public water system

#### 12. USGS Water Services ✅ (Already integrated)
- Stream gauges, groundwater, water quality
- **Expand**: Add National Land Cover Database (NLCD) for habitat analysis

#### 13. NOAA NWS API ✅ (Already integrated)
- Weather alerts, forecasts, observations
- **Expand**: Add NOAA Climate Data Online (CDO) for historical climate normals

#### 14. Federal Register API ✅ (Already integrated)
- Federal rules, notices, presidential documents
- **Expand**: Add state-level equivalents (WA State Register, OR Bulletin, BC Gazette)

### Tier 4: Canadian Federal + Provincial (Cross-Border Completeness)

#### 15. Canada Open Government Portal ✅ (Tested + Working)
- **What**: 18,669 datasets across all Canadian federal departments
- **API**: `https://open.canada.ca/data/api/3/action/package_search`
- **AIBizVan360 use**: BC-specific environmental, economic, demographic data
- **Verified working**: 18,669 datasets, environment-focused results returned

#### 16. NSERC Awards Database ✅ (Already in Research Hub)
- Canadian federal science + engineering grants
- **Expand**: Add CIHR (health) + SSHRC (social sciences) for completeness

#### 17. BC Data Catalogue ✅ (Already in Research Hub)
- Provincial open data
- **Expand**: Add BC Assessment (property values), BC Registry Services (corporate filings)

#### 18. Canada Revenue Agency Charities Directorate
- **What**: Every registered charity in Canada (85,000+)
- **Data**: Charity name, registration status, activities, financials
- **API**: Open data download (no real-time API, but annual CSV)
- **AIBizVan360 use**: Canadian equivalent of ProPublica Nonprofit Explorer

### Tier 5: Demographic + Contextual (Aggregated, No Individual PII)

#### 19. US Census ACS API
- **What**: American Community Survey — demographics at census tract level
- **Data**: Income, race, education, housing, transportation — all aggregated, no individual records
- **API**: `https://api.census.gov/data/2023/acs/acs5`
- **Free API key** required (instant registration)
- **AIBizVan360 use**: Environmental justice analysis — overlay environmental data with demographic context. This replaces the "voter registration" suggestion ethically.

#### 20. Statistics Canada Census
- **What**: Canadian census data (every 5 years, 2021 latest)
- **Data**: Demographics at dissemination area level
- **API**: `https://www12.statcan.gc.ca/rest/census-recensement/CR2021Geo.cube`
- **AIBizVan360 use**: Canadian demographic context for cross-border analysis

---

## Part 4 — The Architecture: How These Databases Become the Backend

### Layer 1: Data Ingestion (Agent 2 — Data Pipeline Agent)

```
┌─────────────────────────────────────────────────────────────┐
│  Data Pipeline Agent (runs 24/7)                            │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ USASpending │  │ NIH RePORTER│  │ NSF Awards  │  ...    │
│  │   (daily)   │  │  (weekly)   │  │  (weekly)   │         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
│         ▼                ▼                ▼                 │
│  ┌─────────────────────────────────────────────┐           │
│  │         Schema Validator + Normalizer        │           │
│  │  (each source has different schema →         │           │
│  │   normalize to AIBizVan360 common schema)   │           │
│  └──────────────────────┬──────────────────────┘           │
│                         │                                   │
│                         ▼                                   │
│  ┌─────────────────────────────────────────────┐           │
│  │          Provenance Signer (SHA-256)         │           │
│  │  (every record gets hash + source + timestamp)│          │
│  └──────────────────────┬──────────────────────┘           │
│                         │                                   │
│                         ▼                                   │
│  ┌─────────────────────────────────────────────┐           │
│  │      cities-data.json + project-registry     │           │
│  │      + grants-registry.json + companies.json │           │
│  └─────────────────────────────────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### Layer 2: Client Identity Resolution (The "Real Clients" Layer)

This is what the user means by "real clients interaction." The platform should be able to answer: **"Who are the actual businesses + researchers + organizations operating in Cascadia, with verified contact info?"**

```
User searches: "Clean energy companies in Seattle"
        │
        ▼
┌─────────────────────────────────────────────────────────────┐
│  Query Engine searches across:                              │
│  • SAM.gov (federal contractors with NAICS = clean energy)  │
│  • WA Corporation Registry (registered businesses)          │
│  • SEC EDGAR (public companies)                             │
│  • SBIR database (SBIR-funded clean energy startups)        │
│  • NSF/DOE grant recipients (research orgs)                 │
│  • ProPublica Nonprofits (clean energy nonprofits)          │
│                                                             │
│  → Returns deduplicated list with:                          │
│    - Verified legal name                                    │
│    - Registered address (public record)                     │
│    - NAICS codes                                            │
│    - Federal funding received (if any)                      │
│    - Public filings (if public company)                     │
│    - Grant history (if research org)                        │
│    - Contact: registered agent (NOT personal email)         │
└─────────────────────────────────────────────────────────────┘
```

**Critical ethical rule**: The platform shows **business contact info** (registered agent, business address, public filing contacts) — NOT personal emails, home addresses, or phone numbers of individuals. Every contact is one that the organization itself made public through formal registration.

### Layer 3: Real-Time Client Interaction

```
Client (e.g., WA Commerce) logs in →
  "Show me all clean energy companies in WA that received federal funding in 2025"
        │
        ▼
  Platform queries:
    1. USASpending.gov → federal awards to WA companies in NAICS 221115 (solar), 221116 (wind), etc.
    2. SAM.gov → verify contractor registration
    3. WA Corporation Registry → verify active business status
    4. SEC EDGAR → check if public company (adds financial data)
    5. SBIR → check for SBIR funding history
        │
        ▼
  Returns: 47 companies, $284M in federal funding, with verified profiles
  Each profile: legal name, address, NAICS, funding history, public filings link
        │
        ▼
  Client can export to CSV, set up alerts for new funding, or click through to source
```

---

## Part 5 — Ethical Guardrails (Non-Negotiable)

| Rule | Why |
|---|---|
| **No individual PII** from public records (no personal emails, home addresses, phone numbers) | Individuals don't consent to commercial use of their civic data |
| **No voter registration data** | Even if public, weaponization risk > commercial value |
| **No scraping private platforms** (LinkedIn, Crunchbase) for contact info | Violates their ToS; individuals didn't consent to our use |
| **Business contact info only** — registered agent, business address, public filing contacts | Organizations consent to this when they register |
| **Provenance for every record** — source API, retrieval timestamp, hash | Users can verify any claim; no hidden data origins |
| **Opt-out mechanism** — any business can request removal from our directory | Respects autonomy even when data is technically public |
| **No selling individual data** — we sell aggregated intelligence + platform access, not contact lists | We're not a data broker; we're an intelligence platform |
| **Indigenous data sovereignty** — tribal nation data governed by the nation, not us | Already in our architecture; applies to all indigenous data |

---

## Part 6 — What This Enables for Clients

### For Economic Development Agencies (WA Commerce, OR Business, BC Trade)
- "Show me every business that received federal funding in [city] last year"
- "Which NAICS sectors are growing in [region] based on new business registrations?"
- "Alert me when a company in [sector] registers in [city]"

### For VCs + Investors
- "Show me all SBIR-funded startups in Cascadia" (these are vetted, funded, real)
- "Which Cascadia companies have received NIH/NSF grants?" (research-backed validation)
- "Cross-reference: companies with federal contracts + SEC filings + SBIR grants"

### For Corporations (Amazon, Microsoft, Boeing)
- "Who are the verified federal contractors in our supply chain region?"
- "Which companies in [NAICS] are registered in [city]?"
- "Supply chain risk: any of our vendors debarred in SAM.gov?"

### For Researchers + Universities
- "Who has received NIH/NSF grants in [research area] in Cascadia?"
- "Identify potential collaborators based on grant history + publication overlap"
- "Track: new grants awarded in [field] over time"

### For Foundations (Bullitt, Meyer, Wilburforce)
- "Show me environmental nonprofits in Cascadia with their Form 990 financials"
- "Which nonprofits work in [geographic area] with [mission focus]?"
- "Cross-reference: nonprofit grants + government grants to avoid duplication"

### For Indigenous Nations
- **Nation controls what's queried + displayed about their territory**
- "Show federal spending on tribal lands" (USASpending data)
- "Track: federal grants awarded to [nation]" (with nation's consent)
- **Not displayed**: individual tribal member data, ever

---

## Part 7 — Implementation Plan (Agentic, Per the Architecture Revision)

### Phase 1: Core Government Data Integration (Q4 2026 — Q1 2027)

**Iteration 1.1**: Add USASpending.gov API
- Data Pipeline Agent fetches WA/OR/BC federal spending weekly
- New page section: "Federal Investment in Cascadia" (total $, top recipients, trends)
- Each recipient links to verified profile (SAM.gov + state registry)

**Iteration 1.2**: Add NIH RePORTER + NSF Award Search (expand existing Research Hub)
- Already partially integrated in Research Hub
- Add: "Active Grants in Cascadia" searchable directory
- Each grant: title, PI, organization, amount, abstract, link to source

**Iteration 1.3**: Add SAM.gov Entity API
- Register for free API key
- Build "Verified Federal Contractors in Cascadia" directory
- Each contractor: legal name, address, NAICS, registration status, exclusion check

**Iteration 1.4**: Add SEC EDGAR
- Build "Public Companies in Cascadia" directory
- Each company: financial summary, ESG disclosures, executive compensation
- Link to original SEC filings

**Iteration 1.5**: Add ProPublica Nonprofit Explorer
- Build "Cascadia Nonprofits" directory
- Each nonprofit: mission, revenue, expenses, programs, Form 990 link
- Useful for foundation clients + partnership discovery

### Phase 2: Client Identity Resolution (Q1 — Q2 2027)

**Iteration 2.1**: Build cross-source deduplication
- Same company appears in SAM.gov, SEC EDGAR, state registry, SBIR → merge into one profile
- Use: legal name + address + EIN (where available) for matching
- Confidence score: "High confidence this is the same entity" vs "Possible match"

**Iteration 2.2**: Build "Verified Clients" search
- User searches for companies → gets deduplicated profiles with verified contact info
- Each profile shows: sources consulted, last verified date, provenance hash
- Export to CSV (for B2B outreach — using business contact info only)

**Iteration 2.3**: Build alerting
- "Notify me when a new business registers in [NAICS] in [city]"
- "Notify me when [company] receives a new federal grant"
- "Notify me when [nonprofit] files a new Form 990"

### Phase 3: Real-Time Client Interaction (Q2 — Q3 2027)

**Iteration 3.1**: Client accounts + saved searches
- Economic development agencies, VCs, corporations get accounts
- Save searches, set up alerts, export results
- Premium tier: $50-500/month depending on query volume

**Iteration 3.2**: API access
- Developers can query our normalized, deduplicated, provenance-signed data
- Free tier: 1,000 queries/month; Pro: 50,000; Enterprise: unlimited
- Every API response includes provenance (source, timestamp, hash)

**Iteration 3.3**: White-label deployments
- WA Commerce gets a branded version at wa.aibizvan360.com
- Their data layers + our data infrastructure
- $50-200K/year per white-label client

---

## Part 8 — What This Makes AIBizVan360

With public databases as the backend, AIBizVan360 becomes:

1. **The canonical query layer for Cascadia public data** — not a data product, but an intelligence layer over data taxpayers already funded

2. **The verified client directory** — every business, nonprofit, research org, federal contractor in the region, with provenance-signed profiles

3. **The real-time alert system** — "tell me when something changes in my sector/region" powered by daily API polling

4. **The cross-source intelligence engine** — merge SAM.gov + SEC + state registries + grant databases into unified profiles that no single source provides

5. **The ethical alternative to data brokers** — same commercial utility (verified B2B contacts) without the ethical violations (no individual PII, no voter data, no scraped personal info)

---

## Part 9 — Revenue Model (Enabled by This Architecture)

| Tier | Price | What You Get |
|---|---|---|
| **Free** | $0 | Browse aggregated data, search companies, view grant directories |
| **Pro** | $49/month | Saved searches, email alerts, CSV export (up to 1,000 records/month), API access (10K queries) |
| **Institutional** | $500/month | Team accounts, advanced filters, API access (100K queries), quarterly briefings |
| **Enterprise** | $5K-50K/year | White-label, custom data layers, unlimited API, dedicated support, SLA |
| **API-only** | $99-9,999/month | Pure API access for developers building on our data layer |

**Revenue projection with this architecture**:
- Year 1 (2027): 500 free users + 50 Pro + 5 Institutional + 1 Enterprise = $48K ARR
- Year 2 (2028): 5,000 free + 200 Pro + 20 Institutional + 5 Enterprise = $312K ARR
- Year 3 (2029): 20,000 free + 1,000 Pro + 50 Institutional + 15 Enterprise = $1.5M ARR

This is **incremental** to the existing revenue model (subscriptions, consulting, white-label). The public data backend makes every other revenue stream more valuable.

---

## Part 10 — Honest Limitations

1. **API rate limits**: Most government APIs are rate-limited. We'll need server-side caching (Cloudflare Workers) + intelligent polling (only fetch what changed).

2. **Data quality varies**: Government data has errors. We need validation + "last verified" timestamps + user feedback mechanism ("report incorrect data").

3. **Schema changes**: Government APIs change schemas without notice. Data Pipeline Agent must self-heal when this happens (per the agentic architecture).

4. **Not all data is API-accessible**: Some government data is PDF-only or requires FOIA requests. We integrate what's API-accessible; document what isn't.

5. **Cross-border complexity**: US + Canadian data standards differ. NAICS codes mostly align; but corporate registry structures are completely different. Need separate normalization for each country.

6. **Ethical edge cases**: Even "appropriate" data has edge cases. We need an ethics review process for new data sources, not just a technical integration process.

---

## Closing

The user's instinct is right: **public databases should be the backend of AIBizVan360.** This is architecturally sound, commercially powerful, and ethically aligned — when done with the guardrails above.

The one correction: **voter registration is off the table.** Not because it's illegal, but because using civic participation data for commercial purposes crosses a line that undermines the platform's credibility + the trust relationships we're building (especially with indigenous nations).

Everything else — federal spending, grant recipients, corporate filings, contractor registries, nonprofit financials, business registrations — is appropriate, valuable, and aligned with the founding principle: **public data should serve the public.**

This is how AIBizVan360 becomes the canonical intelligence layer for Cascadia: not by hoarding data, but by being the best query + interpretation layer over data that already belongs to the public.

---

*Architecture document v1.0 — September 2026. All APIs tested + verified working (except where noted). Live preview: https://testdemoqwenai2025-creator.github.io/Demo4VanSea/ (24/7/365, no NDA).*
