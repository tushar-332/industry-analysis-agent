const INDUSTRY_CONTEXT = {
  waste_management:    'Landfill permitting = moat (5-10yr, $50-200M/site). Hauling 8-12% EBITDA, disposal 25-35%. PFAS/methane/EPR key ESG risks. Peers: WM, RSG, WCN.',
  healthcare_services: 'Reimbursement model (FFS/VBC/capitated) = key lever. MLR, member churn critical. CMS rule changes = regulatory risk. Peers: UNH, CVS, HUM.',
  technology_saas:     'NRR >110% = compounding moat. Rule of 40 (growth%+EBITDA%) ≥40 healthy. CAC payback <18mo ideal. AI commoditization risk. Peers: CRM, WDAY, DDOG.',
  manufacturing:       'CapEx intensity + commodity input exposure (steel/aluminum/energy). Book-to-bill = demand signal. Working capital cycle critical. Peers: CAT, IR, HON.',
  retail_consumer:     'Brand moat + inventory turns + repeat purchase rate. Omnichannel table stakes. Markdown risk. Gross margin 35-50%. Peers: AMZN, WMT, category leaders.',
  real_estate:         'FFO/AFFO (not GAAP) = key metric. Cap rate spread vs. debt cost. Lease expiration waterfall. Office distressed; industrial strong. Peers: PLD, AVB.',
  energy:              'Regulated (PUC ROE 9-11%) vs. merchant (commodity risk). Energy transition = stranded asset risk. Hedge ratios matter. Peers: NEE, DUK, LNG.',
  telecom:             'ARPU trend + monthly churn = value drivers. Fiber capex $900-1200/home. 5G ROI unproven. Bundling = retention. Peers: VZ, T, TMUS.',
  financial_services:  'NIM compression/expansion drives banks. CET1 ratio = capital buffer. Fintech = deposit flight risk. ESG: CRA, fair lending. Peers: JPM, GS, V.',
  pharma_biotech:      'Pipeline probability (Ph3→approval ~60%). Patent cliff timing. IRA drug pricing risk. CMC scale-up risk for biologics. Peers: PFE, MRNA, VRTX.',
}

const SCOPE_SECTIONS = {
  regulatory_deep_dive: 'executive_summary, pestel, regulatory_and_esg_friction, red_flags',
  competitor:           'executive_summary, porters_five_forces, swot, moat_assessment',
  investment_stage:     'executive_summary, unit_economics, moat_assessment, red_flags',
  acquisition_target:   'executive_summary, swot, unit_economics, red_flags',
  regional:             'executive_summary, porters_five_forces, pestel, regulatory_and_esg_friction',
}

const FRAMEWORK_SECTIONS = {
  porters_only:         'executive_summary, porters_five_forces',
  pestel_only:          'executive_summary, pestel',
  swot_moat:            'executive_summary, swot, moat_assessment',
  economics_regulatory: 'executive_summary, unit_economics, regulatory_and_esg_friction',
}

const SYSTEM_PROMPT = `You are a fast PE analyst. Produce terse, investment-grade analysis.

RULES:
- Output JSON only. No preamble, no markdown fences.
- Only populate sections listed by the user. Return {} for all others.
- 2-3 key points per section. No filler sentences.
- Source every claim: (per 10-K, High) | (est., Medium) | (benchmark, High)
- 1 competitor comparison per section where relevant.
- Assign investment_grade A/B/C in metadata.

JSON SCHEMA (populate requested sections only):
{
  "metadata": {"target":"","industry":"","analysis_date":"","data_quality":"","investment_grade":"A|B|C","grade_rationale":"","sources_cited":[]},
  "executive_summary": {"company_positioning":"","moat_strength":"","base_case_thesis":"","bull_case_catalyst":"","bear_case_risk":"","key_findings":""},
  "porters_five_forces": {
    "supplier_power":        {"score":0,"confidence":"","narrative":"","competitive_benchmarks":{"target":"","peer_1":"","delta":""}},
    "buyer_power":           {"score":0,"confidence":"","narrative":"","competitive_benchmarks":{"target":"","peer_1":"","delta":""}},
    "threat_of_substitutes": {"score":0,"confidence":"","narrative":"","competitive_benchmarks":{"target":"","peer_1":"","delta":""}},
    "threat_of_new_entrants":{"score":0,"confidence":"","narrative":"","competitive_benchmarks":{"target":"","peer_1":"","delta":""}},
    "competitive_rivalry":   {"score":0,"confidence":"","narrative":"","competitive_benchmarks":{"target":"","peer_1":"","delta":""}},
    "industry_attractiveness_score":0
  },
  "pestel": {
    "political":    {"key_factors":"","impact":"positive|neutral|negative","confidence":"","narrative":""},
    "economic":     {"key_factors":"","impact":"positive|neutral|negative","confidence":"","narrative":""},
    "social":       {"key_factors":"","impact":"positive|neutral|negative","confidence":"","narrative":""},
    "technological":{"key_factors":"","impact":"positive|neutral|negative","confidence":"","narrative":""},
    "environmental":{"key_factors":"","impact":"positive|neutral|negative","confidence":"","narrative":""},
    "legal":        {"key_factors":"","impact":"positive|neutral|negative","confidence":"","narrative":""}
  },
  "circularity_gap_analysis": {"current_state":"","gap_percentage":"","confidence":"","barriers":{"technical":"","economic":"","regulatory":""},"upside_scenario":"","narrative":""},
  "swot": {"strengths":[],"weaknesses":[],"opportunities":[],"threats":[]},
  "value_chain_analysis": {
    "collection":        {"role":"","margin":"","margin_range":"","moat_strength":"","narrative":""},
    "transport":         {"role":"","margin":"","margin_range":"","fuel_exposure":"","moat_strength":"","narrative":""},
    "sorting_processing":{"role":"","margin":"","margin_range":"","automation_risk":"","moat_strength":"","narrative":""},
    "disposal":          {"role":"","margin":"","margin_range":"","moat_strength":"","narrative":""},
    "recycling":         {"role":"","margin":"variable","margin_range":"","moat_strength":"","narrative":""}
  },
  "moat_assessment": {
    "permits_and_licensing":                   {"score":0,"confidence":"","narrative":"","competitive_benchmarks":{"target":"","peer_1":"","delta":""}},
    "route_density_and_customer_stickiness":   {"score":0,"confidence":"","narrative":"","competitive_benchmarks":{"target":"","peer_1":"","delta":""}},
    "scale_and_unit_economics":                {"score":0,"confidence":"","narrative":"","competitive_benchmarks":{"target":"","peer_1":"","delta":""}},
    "capital_requirements":                    {"score":0,"confidence":"","narrative":"","competitive_benchmarks":{"target":"","peer_1":"","delta":""}},
    "regulatory_and_environmental_compliance": {"score":0,"confidence":"","narrative":"","competitive_benchmarks":{"target":"","peer_1":"","delta":""}},
    "brand_and_relationships":                 {"score":0,"confidence":"","narrative":"","competitive_benchmarks":{"target":"","peer_1":"","delta":""}},
    "overall_moat_strength":0,"moat_narrative":""
  },
  "unit_economics": {
    "typical_ebitda_margin_percent":"","revenue_per_ton_hauling":"","revenue_per_ton_disposal":"","confidence":"",
    "cost_structure":{"labor_percent_of_opex":"","fuel_percent_of_opex":"","equipment_depreciation_percent_of_opex":"","landfill_tipping_fees_percent_of_revenue":"","other_opex_percent":""},
    "margin_drivers_ranked_by_impact":[],
    "leverage_sensitivity":{"if_fuel_increases_10_percent":"","if_labor_wages_increase_5_percent":"","if_tipping_fees_increase_20_percent":""},
    "competitive_benchmarks":{"target_ebitda_margin":"","peer_1_ebitda_margin":"","delta":""},
    "narrative":""
  },
  "regulatory_and_esg_friction": {
    "carbon_and_methane_liabilities":{"scope":"","regulation_timeline":"","estimated_cost_impact":"","confidence":"","hedging_options":"","narrative":""},
    "upcoming_legislation":[],
    "esg_as_competitive_advantage_or_cost":{"monetizable":"yes|no","narrative":""},
    "compliance_capex_estimate":"","confidence":"","narrative":""
  },
  "red_flags":[{"title":"","description":"","probability":"High|Medium|Low","timeline":"","magnitude":"","trigger":"","mitigation":"","portfolio_impact":""}],
  "investment_thesis":{
    "headline":"",
    "base_case":{"scenario":"","ebitda_margin_trajectory":"stable|compression|expansion","key_assumptions":[]},
    "bull_case":{"scenario":"","key_catalysts":[],"margin_upside":""},
    "bear_case":{"scenario":"","key_triggers":[],"margin_downside":""},
    "key_metrics_to_monitor":[]
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

  const sectionsStr = SCOPE_SECTIONS[scope] || FRAMEWORK_SECTIONS[framework] || null
  const industryCtx = INDUSTRY_CONTEXT[industry] || (industry && industry !== 'auto' ? `Industry: ${industry}.` : '')

  const parts = [`Analyze: ${company_name.trim()}`]
  if (industryCtx) parts.push(`Industry context: ${industryCtx}`)
  if (sectionsStr) parts.push(`Sections to include: ${sectionsStr}. Return {} for all others.`)
  else parts.push('Include all sections.')

  const userMessage = parts.join('\n')

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
        max_tokens: 2000,
        temperature: 0,
        system: SYSTEM_PROMPT,
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
        error: "⏱️ Still timing out. Try Porter's Only or PESTEL Only for fastest results.",
        partial: true,
      })
    }
    console.error('Anthropic fetch error:', err)
    return res.status(500).json({ error: 'Failed to reach Anthropic API' })
  }

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
    console.error('Non-JSON response:', rawText.slice(0, 500))
    return res.status(502).json({ error: 'Model returned non-JSON. Try again.', raw: rawText.slice(0, 500) })
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
