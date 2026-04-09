// ── Industry-specific context overlays ──────────────────────────────────────
const INDUSTRY_CONTEXT = {
  waste_management: `
INDUSTRY: Waste Management
KEY DYNAMICS:
- MSW (municipal solid waste) ≠ hazardous waste — different margin profiles and regulatory regimes
- Hauling: EBITDA 8-12% (low moat, route density matters, price-sensitive)
- Disposal/Landfill: EBITDA 25-35% (high moat, permitting-protected, sticky tipping fees)
- Landfill permitting: 5-10 year process, $50-200M per site — primary barrier to entry
- Tipping fees: regionally variable $35-120/ton; pricing power = competitive moat
- PFAS, methane/LFG, leachate = material balance sheet risks
- Advanced recycling (chemical/pyrolysis) = speculative R&D, NOT proven at scale
- EPR (Extended Producer Responsibility) shifting cost burden upstream
BENCHMARK PEERS: Waste Management Inc (WM), Republic Services (RSG), Waste Connections (WCN)`,

  healthcare_services: `
INDUSTRY: Healthcare Services
KEY DYNAMICS:
- Reimbursement model (fee-for-service vs. value-based vs. capitated) drives economics
- CMS, state insurance boards, accreditation bodies = regulatory moat or friction
- Clinical staff shortage + wage pressure = operating leverage risk
- EHR integration, proprietary algorithms = technology moat
- Patient access, outcomes data, workforce diversity = ESG drivers
- Government payer mix (Medicare/Medicaid %) = reimbursement risk
MARGIN STRUCTURE: Managed care 20-40%, providers 15-25%, specialty pharma 30-50%
BENCHMARK PEERS: UnitedHealth Group, CVS Health, Humana, Elevance Health`,

  technology_saas: `
INDUSTRY: Technology / SaaS
KEY DYNAMICS:
- Unit economics: CAC, LTV/CAC ratio (>3x healthy), CAC payback period (<18mo ideal)
- Net Revenue Retention (NRR) >110% = compounding moat; <100% = leaking bucket
- Land-and-expand: initial contract ACV vs. 3-year expansion TAM
- Switching costs: API/integration depth, data lock-in, workflow dependency
- Rule of 40: growth rate % + EBITDA margin % ≥ 40 = healthy; <20 = at risk
- AI disruption risk: LLM commoditization of feature sets
MARGIN STRUCTURE: Gross margin 70-85%, EBITDA 20-35% at scale
BENCHMARK PEERS: Vary by segment — Salesforce, Workday, Datadog, ServiceNow`,

  manufacturing: `
INDUSTRY: Manufacturing / Industrial
KEY DYNAMICS:
- Capital intensity: maintenance CapEx + growth CapEx as % of revenue drives returns
- Supply chain resilience: nearshoring, vertical integration, single-source risk
- Commodity price exposure: input costs (steel, aluminum, energy) → margin volatility
- Order backlog quality: book-to-bill ratio, contract type (fixed-price vs. T&M)
- Automation and IP: proprietary processes, robotics ROI, workforce displacement
- Working capital cycle: inventory turns, DSO, DPO optimization
MARGIN STRUCTURE: EBITDA 10-20%, highly variable by subsegment
BENCHMARK PEERS: Vary by subsegment — Caterpillar, Ingersoll Rand, Honeywell`,

  retail_consumer: `
INDUSTRY: Retail / Consumer
KEY DYNAMICS:
- Omnichannel is table stakes; differentiation is brand, loyalty, or exclusive product
- Sales per square foot (physical) vs. CAC and repeat purchase rate (e-commerce)
- Inventory risk: markdown pressure, clearance cycles, fashion/obsolescence
- Brand moat: customer loyalty scores, pricing power, private label penetration
- Supply chain ESG: labor conditions, carbon footprint, conflict materials
- Consumer sentiment and discretionary spend sensitivity to macro cycles
MARGIN STRUCTURE: Gross margin 35-50%, EBITDA 8-15% for mass; 20-35% for luxury
BENCHMARK PEERS: Amazon, Walmart, Target, category-specific leaders`,

  real_estate: `
INDUSTRY: Real Estate / REIT
KEY DYNAMICS:
- FFO (Funds From Operations) and AFFO, not GAAP earnings, are key metrics
- Tenant credit quality + lease expiration waterfall = cash flow visibility
- Cap rate spread vs. debt cost = accretion/dilution on acquisitions
- Sector divergence: industrial/logistics (strong), office (distressed), multifamily (supply risk)
- NAV premium/discount signals market sentiment on portfolio quality
- Interest rate sensitivity: rising rates compress cap rate spreads
MARGIN STRUCTURE: FFO yield 3-6%, debt/EBITDA 4-7x typical
BENCHMARK PEERS: Prologis (industrial), AvalonBay (multifamily), Vornado (office)`,

  energy: `
INDUSTRY: Energy / Utilities
KEY DYNAMICS:
- Regulated (PUC-approved ROE, 9-11%) vs. unregulated (merchant, commodity risk)
- Energy transition: renewable penetration %, stranded asset risk, grid modernization capex
- Commodity price risk: Henry Hub, WTI, power curve — hedge ratios and duration
- Capacity factor and plant utilization: drives returns on capital-intensive assets
- FERC, state PUC, EPA rulings = regulatory risk; social license = ESG risk
- Carbon regulation: IRA credits, CBAM exposure, Scope 1 intensity targets
MARGIN STRUCTURE: Regulated utilities EBITDA 30-40%; merchant/IPP 25-35%
BENCHMARK PEERS: NextEra Energy, Duke Energy, Cheniere Energy, AES Corp`,

  telecom: `
INDUSTRY: Telecommunications
KEY DYNAMICS:
- ARPU trend and monthly churn rate are the primary value drivers
- Network capex intensity: fiber deployment ($900-1,200/home), spectrum cost ($B)
- Bundling strategy: wireless + broadband + content as retention tool
- 5G ROI uncertainty: enterprise use cases (private 5G, IoT) not yet proven at scale
- Regulatory: net neutrality, spectrum auctions, merger review (DOJ/FCC)
- Digital divide and universal service obligations = ESG/regulatory obligation
MARGIN STRUCTURE: Gross margin 60-75%, EBITDA 30-45%
BENCHMARK PEERS: Verizon, AT&T, T-Mobile, Comcast`,

  financial_services: `
INDUSTRY: Financial Services
KEY DYNAMICS:
- NIM (net interest margin) compression/expansion drives bank profitability
- Credit quality: NPL ratio, provision coverage, CRE concentration risk
- Capital adequacy: CET1 ratio, leverage ratio, stress test buffer
- Fintech disruption: deposit migration to high-yield accounts, embedded finance
- Regulatory: Basel III endgame, DORA (EU), Consumer Financial Protection Bureau
- ESG: CRA compliance, lending discrimination risk, data privacy (GDPR/CCPA)
MARGIN STRUCTURE: Banks ROE 10-15%; payments/fintech 25-40%; asset managers 30-50%
BENCHMARK PEERS: JPMorgan Chase, Goldman Sachs, PayPal, Visa`,

  pharma_biotech: `
INDUSTRY: Pharma / Biotech
KEY DYNAMICS:
- Pipeline probability: Phase I→approval ~10%; Phase III→approval ~60%
- Patent cliff: loss of exclusivity dates, biosimilar entry lag (12-24mo)
- FDA timeline risk: PDUFA dates, complete response letters, label negotiations
- CMC readiness: manufacturing scale-up risk for biologics and cell/gene therapy
- Payer access: net price after rebates, formulary tier, step therapy requirements
- IRA drug pricing negotiation: 10-drug list expanding; direct negotiation risk
MARGIN STRUCTURE: Pre-revenue to 60%+ EBITDA for established blockbusters
BENCHMARK PEERS: Pfizer, Moderna, Vertex Pharmaceuticals, Regeneron`,
}

// ── Scope-based framework filtering ──────────────────────────────────────────
const SCOPE_SECTIONS = {
  regulatory_deep_dive: ['executive_summary', 'pestel', 'regulatory_and_esg_friction', 'red_flags'],
  competitor:           ['executive_summary', 'porters_five_forces', 'swot', 'moat_assessment'],
  investment_stage:     ['executive_summary', 'unit_economics', 'moat_assessment', 'investment_thesis', 'red_flags'],
  acquisition_target:   ['executive_summary', 'swot', 'unit_economics', 'red_flags', 'investment_thesis'],
  regional:             ['executive_summary', 'porters_five_forces', 'pestel', 'regulatory_and_esg_friction', 'red_flags'],
  global:               null, // all sections
}

// ── Framework-based filtering ─────────────────────────────────────────────────
const FRAMEWORK_SECTIONS = {
  porters_only:         ['executive_summary', 'porters_five_forces'],
  pestel_only:          ['executive_summary', 'pestel'],
  swot_moat:            ['executive_summary', 'swot', 'moat_assessment'],
  economics_regulatory: ['executive_summary', 'unit_economics', 'regulatory_and_esg_friction'],
  comprehensive:        null,
  custom:               null,
}

// ── Scope modifier instructions ───────────────────────────────────────────────
const SCOPE_INSTRUCTIONS = {
  regional:             'SCOPE: Focus on sub-national dynamics — regional tipping fees, local permitting, state-specific mandates, metro-level route density.',
  competitor:           'SCOPE: Competitor tear-down. For every dimension, lead with Target vs. Peer comparison. Quantify each competitive delta.',
  investment_stage:     'SCOPE: Late-stage growth equity lens. Emphasize unit economics scalability, tuck-in M&A multiples, EBITDA→FCF conversion, leverage capacity.',
  acquisition_target:   'SCOPE: M&A due diligence. Flag integration risks, hidden liabilities, synergy potential, off-balance-sheet items, post-close capex requirements.',
  regulatory_deep_dive: 'SCOPE: Double depth on regulatory and ESG. Reference specific laws, PDUFA/EPA/FERC/SEC timelines, carbon pricing scenarios, compliance cost ranges.',
  global:               null,
}

// ── Core PE-grade system prompt (industry-agnostic base) ────────────────────
const BASE_SYSTEM_PROMPT = `You are a PE-grade strategic analyst. Your reports go to investment committees at top-tier PE firms.

MANDATORY STANDARDS (violations invalidate the report):
1. SOURCE EVERY CLAIM: Use "(per [Company] 10-K 2024, High)" or "(est., Medium, assumes X)" or "(industry benchmark, High)"
2. COMPETITIVE BENCHMARKS: Compare target to 2-3 named peers on every major dimension. Quantify the delta.
3. RISK QUANTIFICATION: Every red flag needs probability + magnitude (bps/$ impact) + timeline + trigger + mitigation
4. INVESTMENT GRADE: Assign A / B / C at the end (A = PE-ready, B = needs work, C = not ready)

UNIVERSAL FRAMEWORKS TO COVER (unless scope restricts):
executive_summary, porters_five_forces, pestel, circularity_gap_analysis, swot,
value_chain_analysis, moat_assessment, unit_economics, regulatory_and_esg_friction,
red_flags, investment_thesis

OUTPUT: Valid JSON only. No markdown fences. No preamble.
Be CONCISE — target 4-5KB output. Prioritize signal over length.
Use short sentences. Omit filler. Every word earns its place.

JSON STRUCTURE:
{
  "metadata": {
    "target": "string",
    "industry": "string",
    "analysis_date": "string",
    "data_quality": "confirmed_with_web_search | estimated_from_training_data | mixed",
    "investment_grade": "A | B | C",
    "grade_rationale": "string",
    "sources_cited": ["string"]
  },
  "executive_summary": {
    "company_positioning": "string (sourced)",
    "moat_strength": "string (quantified)",
    "base_case_thesis": "string",
    "bull_case_catalyst": "string",
    "bear_case_risk": "string",
    "key_findings": "string (3 BLUF sentences)"
  },
  "porters_five_forces": {
    "supplier_power": { "score": 0, "source": "string", "confidence": "High|Medium|Low", "narrative": "string", "competitive_benchmarks": { "target": "string", "peer_1": "string", "peer_2": "string", "delta": "string" } },
    "buyer_power": { "score": 0, "source": "string", "confidence": "High|Medium|Low", "narrative": "string", "competitive_benchmarks": { "target": "string", "peer_1": "string", "peer_2": "string", "delta": "string" } },
    "threat_of_substitutes": { "score": 0, "source": "string", "confidence": "High|Medium|Low", "narrative": "string", "competitive_benchmarks": { "target": "string", "peer_1": "string", "peer_2": "string", "delta": "string" } },
    "threat_of_new_entrants": { "score": 0, "source": "string", "confidence": "High|Medium|Low", "narrative": "string", "competitive_benchmarks": { "target": "string", "peer_1": "string", "peer_2": "string", "delta": "string" } },
    "competitive_rivalry": { "score": 0, "source": "string", "confidence": "High|Medium|Low", "narrative": "string", "competitive_benchmarks": { "target": "string", "peer_1": "string", "peer_2": "string", "delta": "string" } },
    "industry_attractiveness_score": 0
  },
  "pestel": {
    "political":     { "key_factors": "string", "impact": "positive|neutral|negative", "confidence": "High|Medium|Low", "narrative": "string" },
    "economic":      { "key_factors": "string", "impact": "positive|neutral|negative", "confidence": "High|Medium|Low", "narrative": "string" },
    "social":        { "key_factors": "string", "impact": "positive|neutral|negative", "confidence": "High|Medium|Low", "narrative": "string" },
    "technological": { "key_factors": "string", "impact": "positive|neutral|negative", "confidence": "High|Medium|Low", "narrative": "string" },
    "environmental": { "key_factors": "string", "impact": "positive|neutral|negative", "confidence": "High|Medium|Low", "narrative": "string" },
    "legal":         { "key_factors": "string", "impact": "positive|neutral|negative", "confidence": "High|Medium|Low", "narrative": "string" }
  },
  "circularity_gap_analysis": {
    "current_state": "string", "gap_percentage": "string", "confidence": "High|Medium|Low",
    "barriers": { "technical": "string", "economic": "string", "regulatory": "string" },
    "upside_scenario": "string", "narrative": "string"
  },
  "swot": {
    "strengths": ["string"], "weaknesses": ["string"], "opportunities": ["string"], "threats": ["string"]
  },
  "value_chain_analysis": {
    "collection":         { "role": "string", "margin": "low|medium|high", "margin_range": "string", "moat_strength": "string", "narrative": "string" },
    "transport":          { "role": "string", "margin": "low|medium|high", "margin_range": "string", "fuel_exposure": "string", "moat_strength": "string", "narrative": "string" },
    "sorting_processing": { "role": "string", "margin": "low|medium|high", "margin_range": "string", "automation_risk": "string", "moat_strength": "string", "narrative": "string" },
    "disposal":           { "role": "string", "margin": "high|medium|low", "margin_range": "string", "moat_strength": "string", "narrative": "string" },
    "recycling":          { "role": "string", "margin": "variable by material", "margin_range": "string", "moat_strength": "string", "narrative": "string" }
  },
  "moat_assessment": {
    "permits_and_licensing":                   { "score": 0, "source": "string", "confidence": "High|Medium|Low", "narrative": "string", "competitive_benchmarks": { "target": "string", "peer_1": "string", "peer_2": "string", "delta": "string" } },
    "route_density_and_customer_stickiness":   { "score": 0, "source": "string", "confidence": "High|Medium|Low", "narrative": "string", "competitive_benchmarks": { "target": "string", "peer_1": "string", "peer_2": "string", "delta": "string" } },
    "scale_and_unit_economics":                { "score": 0, "source": "string", "confidence": "High|Medium|Low", "narrative": "string", "competitive_benchmarks": { "target": "string", "peer_1": "string", "peer_2": "string", "delta": "string" } },
    "capital_requirements":                    { "score": 0, "source": "string", "confidence": "High|Medium|Low", "narrative": "string", "competitive_benchmarks": { "target": "string", "peer_1": "string", "peer_2": "string", "delta": "string" } },
    "regulatory_and_environmental_compliance": { "score": 0, "source": "string", "confidence": "High|Medium|Low", "narrative": "string", "competitive_benchmarks": { "target": "string", "peer_1": "string", "peer_2": "string", "delta": "string" } },
    "brand_and_relationships":                 { "score": 0, "source": "string", "confidence": "High|Medium|Low", "narrative": "string", "competitive_benchmarks": { "target": "string", "peer_1": "string", "peer_2": "string", "delta": "string" } },
    "overall_moat_strength": 0,
    "moat_narrative": "string"
  },
  "unit_economics": {
    "typical_ebitda_margin_percent": "string", "revenue_per_ton_hauling": "string", "revenue_per_ton_disposal": "string", "confidence": "High|Medium|Low",
    "cost_structure": { "labor_percent_of_opex": "string", "fuel_percent_of_opex": "string", "equipment_depreciation_percent_of_opex": "string", "landfill_tipping_fees_percent_of_revenue": "string", "other_opex_percent": "string" },
    "margin_drivers_ranked_by_impact": ["string"],
    "leverage_sensitivity": { "if_fuel_increases_10_percent": "string", "if_labor_wages_increase_5_percent": "string", "if_tipping_fees_increase_20_percent": "string" },
    "competitive_benchmarks": { "target_ebitda_margin": "string", "peer_1_ebitda_margin": "string", "peer_2_ebitda_margin": "string", "delta": "string" },
    "narrative": "string"
  },
  "regulatory_and_esg_friction": {
    "carbon_and_methane_liabilities": { "scope": "string", "regulation_timeline": "active|proposed|5-10 years out", "estimated_cost_impact": "string", "confidence": "High|Medium|Low", "hedging_options": "string", "narrative": "string" },
    "upcoming_legislation": ["string"],
    "esg_as_competitive_advantage_or_cost": { "monetizable": "yes|no", "narrative": "string" },
    "compliance_capex_estimate": "string", "confidence": "High|Medium|Low", "narrative": "string"
  },
  "red_flags": [
    { "title": "string", "description": "string", "probability": "High|Medium|Low", "timeline": "string", "magnitude": "string", "trigger": "string", "mitigation": "string", "portfolio_impact": "string" }
  ],
  "investment_thesis": {
    "headline": "string",
    "base_case": { "scenario": "string", "ebitda_margin_trajectory": "stable|compression|expansion", "key_assumptions": ["string"] },
    "bull_case": { "scenario": "string", "key_catalysts": ["string"], "margin_upside": "string" },
    "bear_case": { "scenario": "string", "key_triggers": ["string"], "margin_downside": "string" },
    "key_metrics_to_monitor": ["string"]
  }
}`

const CLAUDE_MODEL = 'claude-sonnet-4-5'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { company_name, industry, framework, scope } = req.body

  if (!company_name || !company_name.trim()) {
    return res.status(400).json({ error: 'company_name is required' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  // Build industry-specific system prompt
  const industryCtx = INDUSTRY_CONTEXT[industry] || ''
  const systemPrompt = industryCtx
    ? `${BASE_SYSTEM_PROMPT}\n\n${industryCtx}`
    : BASE_SYSTEM_PROMPT

  // Determine which sections to include
  const scopeSections  = SCOPE_SECTIONS[scope]     || null
  const frameworkSects = FRAMEWORK_SECTIONS[framework] || null
  const sectionsToInclude = scopeSections || frameworkSects || null

  // Build the scope modifier instruction
  const scopeNote = SCOPE_INSTRUCTIONS[scope] || null

  // Build user message
  let parts = [`Analyze: ${company_name.trim()}`]
  if (industry && industry !== 'auto') parts.push(`Industry: ${industry.replace(/_/g, ' ')}`)
  if (scope) parts.push(`Scope: ${scope}`)
  if (sectionsToInclude) {
    parts.push(`Include ONLY these JSON sections: ${sectionsToInclude.join(', ')}. Return empty object {} for all other sections.`)
  }
  if (scopeNote) parts.push(scopeNote)

  const userMessage = parts.join('\n')

  // 55-second abort controller (Vercel max is 60s)
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 55000)

  let rawText
  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 5000,
        temperature: 0,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userMessage },
          { role: 'assistant', content: '{' },
        ],
      }),
    })

    clearTimeout(timeoutId)

    if (!anthropicRes.ok) {
      const err = await anthropicRes.json().catch(() => ({}))
      return res.status(anthropicRes.status).json({
        error: err.error?.message || `Anthropic API error: ${anthropicRes.status}`,
      })
    }

    const data = await anthropicRes.json()
    rawText = '{' + data.content[0].text

  } catch (err) {
    clearTimeout(timeoutId)
    if (err.name === 'AbortError') {
      return res.status(504).json({
        error: '⏱️ Analysis timed out (>55s). Try a narrower scope (e.g., "Porter\'s Only") or a more specific company name.',
        partial: true,
      })
    }
    console.error('Anthropic fetch error:', err)
    return res.status(500).json({ error: 'Failed to reach Anthropic API' })
  }

  // JSON extraction — 3 strategies
  const tryParse = (str) => { try { return JSON.parse(str) } catch { return null } }

  let analysis = tryParse(rawText)

  if (!analysis) {
    const stripped = rawText.replace(/^```(?:json)?\s*/im, '').replace(/\s*```\s*$/m, '').trim()
    analysis = tryParse(stripped)
  }

  if (!analysis) {
    const match = rawText.match(/\{[\s\S]*\}/)
    if (match) analysis = tryParse(match[0])
  }

  if (!analysis) {
    console.error('Non-JSON response (first 500 chars):', rawText.slice(0, 500))
    return res.status(502).json({
      error: 'Model returned non-JSON response. Try again.',
      raw: rawText.slice(0, 500),
    })
  }

  return res.status(200).json({
    analysis,
    metadata: {
      company_name: company_name.trim(),
      industry: industry ?? null,
      framework: framework ?? 'comprehensive',
      scope: scope ?? 'global',
      generated_at: new Date().toISOString(),
      model: CLAUDE_MODEL,
    },
  })
}
