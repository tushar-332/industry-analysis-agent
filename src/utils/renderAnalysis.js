// Mirrors the render methods from industry_analysis_agent22.html

function scoreClass(n) {
  if (n >= 7) return 'score-high'
  if (n >= 4) return 'score-mid'
  return 'score-low'
}

function scoreBarColor(n) {
  if (n >= 7) return 'var(--green-mid)'
  if (n >= 4) return 'var(--amber-mid)'
  return 'var(--red-mid)'
}

function marginClass(m) {
  const v = (m || '').toLowerCase()
  if (v.includes('high')) return 'margin-high'
  if (v.includes('medium') || v.includes('med')) return 'margin-medium'
  if (v.includes('low')) return 'margin-low'
  return 'margin-variable'
}

function impactClass(impact) {
  const v = (impact || '').toLowerCase()
  if (v === 'positive') return 'impact-positive'
  if (v === 'negative') return 'impact-negative'
  return 'impact-neutral'
}

function timelineClass(t) {
  const v = (t || '').toLowerCase()
  if (v.includes('active')) return 'timeline-active'
  if (v.includes('proposed')) return 'timeline-proposed'
  return 'timeline-future'
}

function moatClass(m) {
  const v = (m || '').toLowerCase()
  if (v === 'high') return 'moat-high'
  if (v === 'medium') return 'moat-medium'
  return 'moat-low'
}

export function renderOverview(a) {
  const meta = a.metadata || {}
  const dq = meta.data_quality || ''
  return `
    <div class="exec-summary-text">${a.executive_summary || 'No summary available.'}</div>
    <div class="card">
      <div class="card-title">Analysis Metadata</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;">
        <span class="data-quality-badge">📊 ${dq.replace(/_/g, ' ')}</span>
        <span class="data-quality-badge">🏭 ${meta.industry || 'waste_management'}</span>
        <span class="data-quality-badge">📅 ${meta.analysis_date || ''}</span>
      </div>
    </div>`
}

export function renderPorters(a) {
  const pf = a.porters_five_forces || {}
  const forceKeys = [
    { key: 'supplier_power',        label: 'Supplier Power' },
    { key: 'buyer_power',            label: 'Buyer Power' },
    { key: 'threat_of_substitutes',  label: 'Threat of Substitutes' },
    { key: 'threat_of_new_entrants', label: 'New Entrant Threat' },
    { key: 'competitive_rivalry',    label: 'Competitive Rivalry' },
  ]
  const rows = forceKeys.map(({ key, label }) => {
    const f = pf[key] || {}
    const score = f.score || 0
    const pct = (score / 10) * 100
    return `
      <div class="force-row">
        <div class="score-badge ${scoreClass(score)}">${score}</div>
        <div class="force-content">
          <div class="force-label">${label}</div>
          <div class="force-bar-wrap">
            <div class="force-bar" style="width:${pct}%;background:${scoreBarColor(score)};"></div>
          </div>
          <div class="force-narrative">${f.narrative || ''}</div>
        </div>
      </div>`
  }).join('')
  const aScore = pf.industry_attractiveness_score || 0
  return `
    <div class="card">${rows}</div>
    <div class="attractiveness-banner">
      <div class="big-score">${aScore}</div>
      <div class="label">
        <strong>Industry Attractiveness Score</strong>
        Score out of 10 — higher = more structurally attractive for investment
      </div>
    </div>`
}

export function renderPestel(a) {
  const pestel = a.pestel || {}
  const sections = [
    { key: 'political',     label: 'Political',     color: 'var(--amber-mid)', bg: 'var(--amber-bg)' },
    { key: 'economic',      label: 'Economic',      color: 'var(--accent)',    bg: 'var(--accent-light)' },
    { key: 'social',        label: 'Social',        color: 'var(--purple)',    bg: 'var(--purple-bg)' },
    { key: 'technological', label: 'Technological', color: 'var(--navy)',      bg: 'var(--bg-sunken)' },
    { key: 'environmental', label: 'Environmental', color: 'var(--green)',     bg: 'var(--green-bg)' },
    { key: 'legal',         label: 'Legal',         color: 'var(--red-mid)',   bg: 'var(--red-bg)' },
  ]
  const cards = sections.map(({ key, label, color, bg }) => {
    const item = pestel[key] || {}
    return `
      <div class="pestel-card">
        <div class="pestel-header">
          <div style="display:flex;align-items:center;gap:10px;">
            <div class="pestel-letter" style="background:${bg};color:${color};">${label[0]}</div>
            <span class="pestel-name">${label}</span>
          </div>
          <span class="impact-badge ${impactClass(item.impact)}">${item.impact || 'neutral'}</span>
        </div>
        <div class="pestel-factors">${item.key_factors || ''}</div>
        <div class="pestel-narrative">${item.narrative || ''}</div>
      </div>`
  }).join('')
  return `<div class="pestel-grid">${cards}</div>`
}

export function renderCircularity(a) {
  const c = a.circularity_gap_analysis || {}
  const barriers = c.barriers || {}
  const gapStr = c.gap_percentage || ''
  const match = gapStr.match(/(\d+)/)
  const gapPct = match ? parseInt(match[1]) : 60
  const circPct = 100 - gapPct
  return `
    <div class="card" style="margin-bottom:14px;">
      <div class="card-title">Current State</div>
      <div class="card-body">${c.current_state || ''}</div>
    </div>
    <div class="card" style="margin-bottom:14px;">
      <div class="card-title">Circularity vs. Landfill Split (est.)</div>
      <div class="gap-bar-wrap">
        <div class="gap-bar-circular" style="width:${circPct}%;">
          <span class="gap-bar-label">${circPct}% circular / recovered</span>
        </div>
      </div>
      <div style="font-size:12px;color:var(--text-3);">Gap: ${gapStr}</div>
    </div>
    <div class="barrier-grid">
      <div class="barrier-card">
        <div class="barrier-type">⚙ Technical Barriers</div>
        <div class="barrier-text">${barriers.technical || ''}</div>
      </div>
      <div class="barrier-card">
        <div class="barrier-type">💰 Economic Barriers</div>
        <div class="barrier-text">${barriers.economic || ''}</div>
      </div>
      <div class="barrier-card">
        <div class="barrier-type">⚖ Regulatory Barriers</div>
        <div class="barrier-text">${barriers.regulatory || ''}</div>
      </div>
    </div>
    <div class="card" style="margin-top:14px;">
      <div class="card-title">Upside Scenario</div>
      <div class="card-body">${c.upside_scenario || ''}</div>
      <div style="margin-top:10px;font-size:12px;color:var(--text-2);">${c.narrative || ''}</div>
    </div>`
}

export function renderSwot(a) {
  const s = a.swot || {}
  const quad = (cls, label, items) => `
    <div class="swot-quadrant ${cls}">
      <div class="swot-label">${label}</div>
      <ul class="swot-list">
        ${(items || []).map(i => `<li>${i}</li>`).join('')}
      </ul>
    </div>`
  return `
    <div class="swot-grid">
      ${quad('swot-s', '💪 Strengths',    s.strengths)}
      ${quad('swot-w', '⚠ Weaknesses',    s.weaknesses)}
      ${quad('swot-o', '🚀 Opportunities', s.opportunities)}
      ${quad('swot-t', '🔥 Threats',       s.threats)}
    </div>`
}

export function renderValueChain(a) {
  const vc = a.value_chain_analysis || {}
  const steps = [
    { key: 'collection',         label: 'Collection' },
    { key: 'transport',          label: 'Transport' },
    { key: 'sorting_processing', label: 'Sorting' },
    { key: 'disposal',           label: 'Disposal' },
    { key: 'recycling',          label: 'Recycling' },
  ]
  const stepHtml = steps.map(({ key, label }) => {
    const v = vc[key] || {}
    return `
      <div class="chain-step">
        <div class="chain-step-label">${label}</div>
        <span class="chain-step-margin ${marginClass(v.margin || v.commodity_price_sensitivity)}">${v.margin || 'variable'}</span>
      </div>`
  }).join('')
  const cards = steps.map(({ key, label }) => {
    const v = vc[key] || {}
    const moatStr = v.moat_strength || 'low'
    return `
      <div class="chain-card">
        <div class="chain-card-header">
          <div class="chain-card-title">${label}</div>
          <span class="moat-pill ${moatClass(moatStr)}">
            <span class="moat-dot"></span>moat: ${moatStr}
          </span>
        </div>
        <div style="font-size:12px;color:var(--text-2);line-height:1.6;">${v.narrative || ''}</div>
      </div>`
  }).join('')
  return `
    <div class="chain-flow">${stepHtml}</div>
    <div class="chain-detail-grid">${cards}</div>`
}

export function renderMoat(a) {
  const m = a.moat_assessment || {}
  const dimensions = [
    { key: 'permits_and_licensing',                   label: 'Permits & Licensing' },
    { key: 'route_density_and_customer_stickiness',   label: 'Route Density & Stickiness' },
    { key: 'scale_and_unit_economics',                label: 'Scale & Unit Economics' },
    { key: 'capital_requirements',                    label: 'Capital Requirements' },
    { key: 'regulatory_and_environmental_compliance', label: 'Regulatory Compliance' },
    { key: 'brand_and_relationships',                 label: 'Brand & Relationships' },
  ]
  const cards = dimensions.map(({ key, label }) => {
    const d = m[key] || {}
    const score = d.score || 0
    return `
      <div class="moat-card">
        <div class="moat-card-header">
          <div class="score-badge ${scoreClass(score)}">${score}</div>
          <div class="moat-card-title">${label}</div>
        </div>
        <div style="font-size:12px;color:var(--text-2);line-height:1.6;">${d.narrative || ''}</div>
      </div>`
  }).join('')
  const overall = m.overall_moat_strength || 0
  return `
    <div class="moat-grid">${cards}</div>
    <div class="overall-moat">
      <div class="big-score">${overall}</div>
      <div class="label">
        <strong>Overall Moat Strength</strong>
        ${m.moat_narrative || ''}
      </div>
    </div>`
}

export function renderEconomics(a) {
  const ue = a.unit_economics || {}
  const cs = ue.cost_structure || {}
  const ls = ue.leverage_sensitivity || {}
  const stats = `
    <div class="econ-hero">
      <div class="econ-stat">
        <div class="econ-stat-value">${ue.typical_ebitda_margin_percent || '—'}</div>
        <div class="econ-stat-label">EBITDA Margin</div>
      </div>
      <div class="econ-stat">
        <div class="econ-stat-value" style="font-size:16px;">${ue.revenue_per_ton_hauling || '—'}</div>
        <div class="econ-stat-label">Revenue / ton (Hauling)</div>
      </div>
      <div class="econ-stat">
        <div class="econ-stat-value" style="font-size:16px;">${ue.revenue_per_ton_disposal || '—'}</div>
        <div class="econ-stat-label">Revenue / ton (Disposal)</div>
      </div>
    </div>`
  const costRows = [
    ['Labor', cs.labor_percent_of_opex],
    ['Fuel', cs.fuel_percent_of_opex],
    ['Equipment Depreciation', cs.equipment_depreciation_percent_of_opex],
    ['Landfill Tipping Fees', cs.landfill_tipping_fees_percent_of_revenue],
    ['Other OpEx', cs.other_opex_percent],
  ].map(([label, val]) => `<tr><td>${label}</td><td>${val || '—'}</td></tr>`).join('')
  const drivers = (ue.margin_drivers_ranked_by_impact || []).map((d, i) =>
    `<tr><td style="font-weight:600;color:var(--accent);">#${i+1}</td><td>${d}</td></tr>`
  ).join('')
  const sensitivityRows = [
    { label: 'Fuel +10%',        val: ls.if_fuel_increases_10_percent },
    { label: 'Labor wages +5%',  val: ls.if_labor_wages_increase_5_percent },
    { label: 'Tipping fees +20%',val: ls.if_tipping_fees_increase_20_percent },
  ].map(({ label, val }) => `
    <div class="sensitivity-row">
      <span class="sensitivity-label">${label}</span>
      <span class="sensitivity-impact">${val || '—'}</span>
    </div>`).join('')
  return `
    ${stats}
    <div class="card" style="margin-bottom:14px;">
      <div class="card-title">Cost Structure</div>
      <table class="econ-table">
        <thead><tr><th>Cost Component</th><th>% of OpEx / Revenue</th></tr></thead>
        <tbody>${costRows}</tbody>
      </table>
    </div>
    <div class="card" style="margin-bottom:14px;">
      <div class="card-title">Margin Drivers (Ranked by Impact)</div>
      <table class="econ-table">
        <thead><tr><th>Rank</th><th>Driver</th></tr></thead>
        <tbody>${drivers}</tbody>
      </table>
    </div>
    <div class="card" style="margin-bottom:14px;">
      <div class="card-title">Leverage Sensitivity</div>
      ${sensitivityRows}
    </div>
    <div class="card">
      <div class="card-title">Analyst Note</div>
      <div class="card-body">${ue.narrative || ''}</div>
    </div>`
}

export function renderRegulatory(a) {
  const reg = a.regulatory_and_esg_friction || {}
  const cm = reg.carbon_and_methane_liabilities || {}
  const esg = reg.esg_as_competitive_advantage_or_cost || {}
  return `
    <div class="reg-grid">
      <div class="reg-card">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <div style="font-size:12px;font-weight:600;color:var(--text-1);">Carbon & Methane Liabilities</div>
          <span class="timeline-badge ${timelineClass(cm.regulation_timeline)}">${cm.regulation_timeline || ''}</span>
        </div>
        <div style="font-size:12px;color:var(--text-2);margin-bottom:8px;">${cm.narrative || ''}</div>
        <div style="font-size:11px;color:var(--text-3);">
          <strong>Scope:</strong> ${cm.scope || ''}<br>
          <strong>Est. cost impact:</strong> ${cm.estimated_cost_impact || ''}<br>
          <strong>Hedging options:</strong> ${cm.hedging_options || ''}
        </div>
      </div>
      <div class="reg-card">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <div style="font-size:12px;font-weight:600;color:var(--text-1);">ESG: Advantage or Cost?</div>
          <span class="impact-badge ${esg.monetizable === 'yes' ? 'impact-positive' : 'impact-negative'}">
            ${esg.monetizable === 'yes' ? 'Monetizable' : 'Cost Center'}
          </span>
        </div>
        <div style="font-size:12px;color:var(--text-2);">${esg.narrative || ''}</div>
      </div>
    </div>
    <div class="card" style="margin-bottom:14px;">
      <div class="card-title">Upcoming Legislation</div>
      <ul class="legislation-list">
        ${(reg.upcoming_legislation || []).map(l => `<li>${l}</li>`).join('')}
      </ul>
    </div>
    <div class="card" style="margin-bottom:14px;">
      <div class="card-title">Compliance CapEx Estimate</div>
      <div style="font-size:20px;font-weight:700;color:var(--red-mid);margin-bottom:6px;">${reg.compliance_capex_estimate || '—'}</div>
      <div class="card-body">${reg.narrative || ''}</div>
    </div>`
}

export function renderRedFlags(a) {
  const flags = a.red_flags || []
  const items = flags.map((flag, i) => `
    <div class="red-flag-item">
      <div class="flag-number">${i + 1}</div>
      <div class="flag-text">${flag}</div>
    </div>`).join('')
  return `<div class="card"><ul class="red-flags-list">${items}</ul></div>`
}

export function renderThesis(a) {
  const t = a.investment_thesis || {}
  const base = t.base_case || {}
  const bull = t.bull_case || {}
  const bear = t.bear_case || {}
  const trajBadge = (traj) => {
    const cls = traj === 'expansion' ? 'impact-positive' : traj === 'compression' ? 'impact-negative' : 'impact-neutral'
    return `<span class="impact-badge ${cls}">${traj || ''}</span>`
  }
  return `
    <div class="thesis-headline">${t.headline || ''}</div>
    <div class="scenarios-grid">
      <div class="scenario-card scenario-base">
        <div class="scenario-label">📊 Base Case ${trajBadge(base.ebitda_margin_trajectory)}</div>
        <div class="scenario-text">${base.scenario || ''}</div>
        <ul class="scenario-items">
          ${(base.key_assumptions || []).map(i => `<li>${i}</li>`).join('')}
        </ul>
      </div>
      <div class="scenario-card scenario-bull">
        <div class="scenario-label">🚀 Bull Case — Upside: ${bull.margin_upside || ''}</div>
        <div class="scenario-text">${bull.scenario || ''}</div>
        <ul class="scenario-items">
          ${(bull.key_catalysts || []).map(i => `<li>${i}</li>`).join('')}
        </ul>
      </div>
      <div class="scenario-card scenario-bear">
        <div class="scenario-label">⚠ Bear Case — Downside: ${bear.margin_downside || ''}</div>
        <div class="scenario-text">${bear.scenario || ''}</div>
        <ul class="scenario-items">
          ${(bear.key_triggers || []).map(i => `<li>${i}</li>`).join('')}
        </ul>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Key Metrics to Monitor</div>
      <ul class="metrics-list">
        ${(t.key_metrics_to_monitor || []).map(m => `<li>${m}</li>`).join('')}
      </ul>
    </div>`
}

export function renderTabContent(activeTab, analysis) {
  if (!analysis) return '<div class="card"><div class="card-body">No data available.</div></div>'
  switch (activeTab) {
    case 'overview':    return renderOverview(analysis)
    case 'forces':      return renderPorters(analysis)
    case 'pestel':      return renderPestel(analysis)
    case 'circularity': return renderCircularity(analysis)
    case 'swot':        return renderSwot(analysis)
    case 'value_chain': return renderValueChain(analysis)
    case 'moat':        return renderMoat(analysis)
    case 'economics':   return renderEconomics(analysis)
    case 'regulatory':  return renderRegulatory(analysis)
    case 'red_flags':   return renderRedFlags(analysis)
    case 'thesis':      return renderThesis(analysis)
    default:            return '<div class="card"><div class="card-body">Select a tab above.</div></div>'
  }
}
