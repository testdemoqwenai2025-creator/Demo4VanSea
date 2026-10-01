/**
 * Cascadia Investor Readiness Score (CIRS) v1.0.0
 * ---------------------------------------------------
 * A data-driven readiness score computed ENTIRELY from real economic indicators.
 * No self-reported quiz. No vibes. Just calibrated outputs from public data.
 *
 * Architecture:
 *   - 5 weighted dimensions, each 0–20 pts (total 0–100)
 *   - Each dimension = weighted sum of normalized indicators
 *   - Normalization = min-max scaled against the Cascadia cohort (in this dataset)
 *   - Tier mapping + per-indicator explanation generated automatically
 *
 * Public API:
 *   CIRS.compute(cityRecord)        → Score object
 *   CIRS.tier(score)                → { label, color, blurb }
 *   CIRS.explain(cityRecord)        → human-readable breakdown (HTML-safe string)
 *   CIRS.compare(cityA, cityB)      → differential analysis
 *
 * Designed to drop into the existing Demo4VanSea project with no dependencies.
 */

(function (global) {
  'use strict';

  // ───────────────────────────────────────────────────────────────
  // 1. SCORING CONFIG — weights & normalizers
  // ───────────────────────────────────────────────────────────────

  const DIMENSIONS = {
    marketMomentum: {
      label: 'Market Momentum',
      weight: 0.20, // 20 pts
      blurb: 'Is the regional economy growing and is entrepreneurship accelerating?',
      indicators: [
        { id: 'gdp_growth',     source: 'gdp_growth_5yr_pct',            weight: 0.30, direction: 'positive', label: '5-yr GDP Growth',          unit: '%' },
        { id: 'biz_formation',  source: 'business_formations_per_1k',    weight: 0.35, direction: 'positive', label: 'Business Formations',      unit: '/1k pop' },
        { id: 'sector_lq_max',  source: '_derived_top_sector_lq',        weight: 0.35, direction: 'positive', label: 'Top Sector Concentration', unit: '× natl avg' }
      ]
    },
    capitalAccess: {
      label: 'Capital Access',
      weight: 0.20,
      blurb: 'Can you actually raise money here? VC presence, angel density proxy, R&D capacity.',
      indicators: [
        { id: 'vc_presence',       source: 'vc_presence_score_1_10',         weight: 0.45, direction: 'positive', label: 'VC Presence',         unit: '/10' },
        { id: 'median_income',     source: 'median_household_income_usd',    weight: 0.25, direction: 'positive', label: 'Median HH Income',    unit: 'USD' },
        { id: 'research_dollars',  source: '_derived_research_dollars',      weight: 0.30, direction: 'positive', label: 'Univ. Research $',    unit: 'M USD' }
      ]
    },
    talentPipeline: {
      label: 'Talent Pipeline',
      weight: 0.20,
      blurb: 'Will you be able to hire technical people now and in 5 years?',
      indicators: [
        { id: 'cs_grads',          source: '_derived_cs_grads',              weight: 0.45, direction: 'positive', label: 'Annual CS Graduates', unit: 'count' },
        { id: 'metro_pop',         source: 'population_metro',               weight: 0.25, direction: 'positive', label: 'Metro Population',    unit: '' },
        { id: 'tech_employment',   source: '_derived_tech_employment_share', weight: 0.30, direction: 'positive', label: 'Tech Employment',     unit: '% of workforce' }
      ]
    },
    costEfficiency: {
      label: 'Cost Efficiency',
      weight: 0.20,
      blurb: 'How much runway does a dollar buy? Lower costs = longer survival window.',
      indicators: [
        { id: 'office_rent',       source: 'office_rent_psf_annual_usd',     weight: 0.40, direction: 'negative', label: 'Office Rent',         unit: 'USD/ft²/yr' },
        { id: 'cost_of_living',    source: 'cost_of_living_index',           weight: 0.40, direction: 'negative', label: 'Cost of Living',      unit: 'index (US=100)' },
        { id: 'comp_pressure',     source: 'median_household_income_usd',    weight: 0.20, direction: 'negative', label: 'Wage Pressure',       unit: 'USD HH income' }
      ]
    },
    resilienceQuality: {
      label: 'Resilience & Quality',
      weight: 0.20,
      blurb: 'Will climate, infrastructure, and livability keep your team here in 10 years?',
      indicators: [
        { id: 'climate_risk',      source: '_derived_climate_risk',          weight: 0.35, direction: 'negative', label: 'Climate Risk',        unit: 'index (lower=better)' },
        { id: 'air_quality',       source: '_derived_aqi_inverted',          weight: 0.20, direction: 'positive', label: 'Air Quality',         unit: 'AQI (higher=better)' },
        { id: 'transit_bike',      source: '_derived_transit_bike_avg',      weight: 0.25, direction: 'positive', label: 'Transit + Bike',      unit: '/100 avg' },
        { id: 'healthcare',        source: 'quality.hospital_beds_per_1k',   weight: 0.20, direction: 'positive', label: 'Hospital Beds',       unit: '/1k pop' }
      ]
    }
  };

  // ───────────────────────────────────────────────────────────────
  // 2. DERIVED FIELD COMPUTATION
  // ───────────────────────────────────────────────────────────────

  function derivedFields(city) {
    const d = {};

    // Highest sector location quotient — proxy for cluster strength
    d._derived_top_sector_lq = Math.max(...city.top_sectors.map(s => s.location_quotient));

    // Sum of all university research dollars
    d._derived_research_dollars = city.universities.reduce((sum, u) => sum + (u.research_dollars_musd || 0), 0);

    // Total annual CS graduates across all universities
    d._derived_cs_grads = city.universities.reduce((sum, u) => sum + (u.cs_grads_annual || 0), 0);

    // Tech sector employment share (sum of any sector tagged "Technology")
    const techSector = city.top_sectors.find(s => s.sector === 'Technology');
    d._derived_tech_employment_share = techSector ? techSector.employment_share_pct : 0;

    // Climate risk composite (1–4 scale × smoke days penalty)
    const riskLevels = { low: 1, moderate: 2, high: 3, severe: 4 };
    const c = city.climate;
    d._derived_climate_risk =
      (riskLevels[c.quake_risk_level] || 1) +
      (riskLevels[c.wildfire_risk_level] || 1) +
      (riskLevels[c.flood_risk_level] || 1) +
      (c.smoke_days_avg / 10); // smoke days add fractional penalty

    // AQI inverted (higher = better) — capped at 100
    d._derived_aqi_inverted = Math.max(0, 100 - city.quality.aqi_avg);

    // Transit + bike average
    d._derived_transit_bike_avg = (city.quality.transit_score_1_100 + city.quality.bike_score_1_100) / 2;

    return d;
  }

  // ───────────────────────────────────────────────────────────────
  // 3. COHORT NORMALIZATION
  //    Each indicator is min-max scaled across all cities in the dataset
  //    so scores reflect relative standing within Cascadia, not absolutes.
  // ───────────────────────────────────────────────────────────────

  function buildCohort(allCities) {
    const cohort = {};
    // Merge city fields + derived fields into a flat lookup
    const enriched = allCities.map(c => Object.assign({}, c, derivedFields(c)));

    Object.keys(DIMENSIONS).forEach(dimKey => {
      DIMENSIONS[dimKey].indicators.forEach(ind => {
        const values = enriched.map(c => resolveField(c, ind.source));
        cohort[ind.source] = {
          min: Math.min(...values),
          max: Math.max(...values),
          range: Math.max(...values) - Math.min(...values) || 1
        };
      });
    });
    return cohort;
  }

  function resolveField(record, path) {
    if (path.startsWith('_derived_')) return record[path];
    // support dot notation for nested fields (quality.x)
    return path.split('.').reduce((o, k) => (o == null ? o : o[k]), record);
  }

  function normalize(value, cohortEntry, direction) {
    const { min, range } = cohortEntry;
    let normalized = (value - min) / range; // 0–1
    if (direction === 'negative') normalized = 1 - normalized; // invert for cost/risk
    return Math.max(0, Math.min(1, normalized));
  }

  // ───────────────────────────────────────────────────────────────
  // 4. CORE SCORING
  // ───────────────────────────────────────────────────────────────

  function compute(city, allCities) {
    if (!allCities) allCities = [city]; // fallback: normalize to self
    const cohort = buildCohort(allCities);
    const enriched = Object.assign({}, city, derivedFields(city));

    const dimensions = {};
    let total = 0;

    Object.keys(DIMENSIONS).forEach(dimKey => {
      const dim = DIMENSIONS[dimKey];
      let dimScore = 0;
      const indicators = {};

      dim.indicators.forEach(ind => {
        const rawValue = resolveField(enriched, ind.source);
        const norm = normalize(rawValue, cohort[ind.source], ind.direction);
        const contribution = norm * ind.weight * 20; // 20 pts per dimension
        indicators[ind.id] = {
          label: ind.label,
          unit: ind.unit,
          rawValue,
          normalized: norm,
          weight: ind.weight,
          direction: ind.direction,
          contribution,
          source: ind.source
        };
        dimScore += contribution;
      });

      dimensions[dimKey] = {
        label: dim.label,
        blurb: dim.blurb,
        weight: dim.weight,
        score: dimScore,
        maxScore: 20,
        indicators
      };
      total += dimScore;
    });

    return {
      city_id: city.id,
      city_name: city.name,
      score: Math.round(total * 10) / 10,
      maxScore: 100,
      tier: tier(total).label,
      tierColor: tier(total).color,
      tierBlurb: tier(total).blurb,
      dimensions,
      computed_at: new Date().toISOString()
    };
  }

  // ───────────────────────────────────────────────────────────────
  // 5. TIER MAPPING
  // ───────────────────────────────────────────────────────────────

  function tier(score) {
    if (score >= 80) return {
      label: 'Premier',
      color: '#1B5E3F',
      blurb: 'Top-tier Cascadia market. Strong across all five dimensions. Premium costs offset by deep capital and talent pools.'
    };
    if (score >= 60) return {
      label: 'Strong',
      color: '#2E7D5B',
      blurb: 'Above-average readiness with one or two watch-areas. Suitable for founders who can leverage the strengths and absorb the gaps.'
    };
    if (score >= 40) return {
      label: 'Developing',
      color: '#B07D2E',
      blurb: 'Mid-pack with meaningful constraints. Often a fit for sector-specific plays (e.g., outdoor industry in Bend) but not generalist startups.'
    };
    return {
      label: 'Emerging',
      color: '#9B3D3D',
      blurb: 'Early-stage ecosystem. Low costs and uncrowded talent markets, but capital and infrastructure gaps require creative fundraising.'
    };
  }

  // ───────────────────────────────────────────────────────────────
  // 6. EXPLAINABILITY — generates per-indicator narrative
  // ───────────────────────────────────────────────────────────────

  function explain(scoreResult) {
    const lines = [];
    lines.push(`<h3>${scoreResult.city_name} — Investor Readiness: <span style="color:${scoreResult.tierColor}">${scoreResult.score}/100</span> <small>(${scoreResult.tier})</small></h3>`);
    lines.push(`<p class="tier-blurb">${scoreResult.tierBlurb}</p>`);

    Object.keys(scoreResult.dimensions).forEach(dimKey => {
      const dim = scoreResult.dimensions[dimKey];
      lines.push(`<div class="dim-block">`);
      lines.push(`<h4>${dim.label} — ${dim.score.toFixed(1)}/20</h4>`);
      lines.push(`<p class="dim-blurb">${dim.blurb}</p>`);
      lines.push(`<ul class="indicators">`);
      Object.keys(dim.indicators).forEach(indKey => {
        const ind = dim.indicators[indKey];
        const arrow = ind.direction === 'positive'
          ? (ind.normalized > 0.6 ? '▲' : ind.normalized < 0.4 ? '▼' : '■')
          : (ind.normalized > 0.6 ? '▼' : ind.normalized < 0.4 ? '▲' : '■');
        lines.push(`<li><span class="ind-label">${ind.label}</span> <code>${ind.rawValue} ${ind.unit}</code> <span class="ind-contrib">+${ind.contribution.toFixed(2)} pts</span> <span class="ind-arrow" style="color:${ind.normalized > 0.6 ? '#1B5E3F' : ind.normalized < 0.4 ? '#9B3D3D' : '#B07D2E'}">${arrow}</span></li>`);
      });
      lines.push(`</ul></div>`);
    });

    return lines.join('\n');
  }

  // ───────────────────────────────────────────────────────────────
  // 7. COMPARISON — differential analysis between two cities
  // ───────────────────────────────────────────────────────────────

  function compare(cityA, cityB, allCities) {
    const a = compute(cityA, allCities);
    const b = compute(cityB, allCities);
    const diff = a.score - b.score;
    const winner = diff > 0 ? cityA.name : diff < 0 ? cityB.name : 'Tie';

    const dims = {};
    Object.keys(a.dimensions).forEach(k => {
      dims[k] = {
        label: a.dimensions[k].label,
        a: a.dimensions[k].score,
        b: b.dimensions[k].score,
        delta: a.dimensions[k].score - b.dimensions[k].score
      };
    });

    return {
      city_a: { name: cityA.name, score: a.score, tier: a.tier },
      city_b: { name: cityB.name, score: b.score, tier: b.tier },
      overall_delta: diff,
      overall_winner: winner,
      dimensions: dims
    };
  }

  // ───────────────────────────────────────────────────────────────
  // 8. EXPORT
  // ───────────────────────────────────────────────────────────────

  global.CIRS = {
    DIMENSIONS,
    compute,
    tier,
    explain,
    compare,
    derivedFields,
    buildCohort,
    version: '1.0.0'
  };

})(typeof window !== 'undefined' ? window : globalThis);
