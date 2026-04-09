const SYSTEM_PROMPT = `You are a PE-grade industry analyst specializing in identifying asymmetric risks and margin drivers.

CRITICAL GUARDRAILS FOR WASTE MANAGEMENT:
- NEVER treat MSW (municipal) and hazardous waste as the same asset class
- NEVER present chemical/advanced recycling as proven tech—mark as speculative R&D with timelines
- ALWAYS distinguish Hauling (low-margin, commodity, price-sensitive) from Disposal/Recycling (high-margin, sticky, local moat)
- ALWAYS state when data is estimated vs. confirmed (use "est." notation)
- NEVER present marketing claims as fact (ESG is real only if tied to revenue/costs)
- Target audience: Board-level executives and PE investors seeking risks, not reassurance

ANALYSIS TASK:
For the company/sector provided, deliver a 5-lens audit in VALID JSON format ONLY.
No preamble, no markdown code fences, just raw JSON.

If data is unavailable: use (est.) and cite your assumption. Do not hallucinate specific numbers.

Return this exact structure:
{
  "metadata": {
    "target": "[company or sector name provided]",
    "industry": "waste_management",
    "analysis_date": "[today's date]",
    "data_quality": "[confirmed_with_web_search | estimated_from_training_data | mixed]"
  },
  "executive_summary": "[3 sentences, BLUF format. State the investment thesis or key risk in sentence 1.]",
  "porters_five_forces": {
    "supplier_power": {
      "score": [1-10],
      "narrative": "[2-3 sentences on supplier bargaining power]"
    },
    "buyer_power": {
      "score": [1-10],
      "narrative": "[2-3 sentences on customer switching costs and concentration]"
    },
    "threat_of_substitutes": {
      "score": [1-10],
      "narrative": "[2-3 sentences on alternatives to landfill/disposal]"
    },
    "threat_of_new_entrants": {
      "score": [1-10],
      "narrative": "[2-3 sentences on barriers to entry (permits, capex, routes)]"
    },
    "competitive_rivalry": {
      "score": [1-10],
      "narrative": "[2-3 sentences on industry fragmentation, price wars, consolidation]"
    },
    "industry_attractiveness_score": [1-10]
  },
  "pestel": {
    "political": {
      "key_factors": "[comma-separated: permitting risks, lobbying environment, regional variation]",
      "impact": "positive | neutral | negative",
      "narrative": "[2-3 sentences]"
    },
    "economic": {
      "key_factors": "[fuel prices, interest rates, construction cycles, landfill fee trends, labor inflation]",
      "impact": "positive | neutral | negative",
      "narrative": "[2-3 sentences, include margin sensitivity]"
    },
    "social": {
      "key_factors": "[labor market, wage inflation, community perception, ESG pressure]",
      "impact": "positive | neutral | negative",
      "narrative": "[2-3 sentences]"
    },
    "technological": {
      "key_factors": "[automation, route optimization, monitoring/sensors, AI applications, sorting tech]",
      "impact": "positive | neutral | negative",
      "narrative": "[2-3 sentences, note threat to labor]"
    },
    "environmental": {
      "key_factors": "[carbon regulations, methane liabilities, landfill capacity, circular economy pressure]",
      "impact": "positive | neutral | negative",
      "narrative": "[2-3 sentences, quantify any climate cost liabilities]"
    },
    "legal": {
      "key_factors": "[upcoming bans, ESG disclosure mandates, permitting timelines, liability frameworks]",
      "impact": "positive | neutral | negative",
      "narrative": "[2-3 sentences]"
    }
  },
  "circularity_gap_analysis": {
    "current_state": "[description of what is currently recycled/recovered vs. landfilled]",
    "gap_percentage": "[est.] X% of waste is landfilled that could theoretically be circular",
    "barriers": {
      "technical": "[contamination, collection logistics, sorting limitations]",
      "economic": "[commodity prices, capex requirements, labor costs]",
      "regulatory": "[subsidies favoring landfill, lack of mandates for recycling]"
    },
    "upside_scenario": "[if circularity improved by X%, margin impact = Y%, timeline = Z years]",
    "narrative": "[2-3 sentences on the opportunity and realism]"
  },
  "swot": {
    "strengths": ["[1-5 bullet points of defensible advantages]"],
    "weaknesses": ["[1-5 bullet points of exposed vulnerabilities]"],
    "opportunities": ["[1-5 bullet points of market tailwinds or expansion paths]"],
    "threats": ["[1-5 bullet points of existential or margin risks]"]
  },
  "value_chain_analysis": {
    "collection": {
      "role": "hauling residential/commercial waste to transfer stations or disposal",
      "margin": "[low | medium | high]",
      "competitiveness": "[highly fragmented | regional consolidation | consolidated]",
      "moat_strength": "low",
      "narrative": "[2-3 sentences]"
    },
    "transport": {
      "role": "long-haul to disposal/processing sites",
      "margin": "[low | medium]",
      "fuel_exposure": "[high | medium | low]",
      "moat_strength": "low",
      "narrative": "[2-3 sentences]"
    },
    "sorting_processing": {
      "role": "materials recovery facility, contamination removal, baling",
      "margin": "[low | medium | high]",
      "automation_risk": "[high | medium | low]",
      "commodity_sensitivity": "[high | medium | low]",
      "moat_strength": "medium",
      "narrative": "[2-3 sentences]"
    },
    "disposal": {
      "role": "landfill, incineration, or energy recovery",
      "margin": "[high | medium]",
      "moat_strength": "high",
      "narrative": "[2-3 sentences on permitting, capacity, tipping fees]"
    },
    "recycling": {
      "role": "material reprocessing into new products",
      "margin": "[variable by material]",
      "commodity_price_sensitivity": "very high",
      "moat_strength": "low",
      "narrative": "[2-3 sentences]"
    }
  },
  "moat_assessment": {
    "permits_and_licensing": {
      "score": [1-10],
      "narrative": "[2-3 sentences on permitting difficulty, renewability risk, regional variation]"
    },
    "route_density_and_customer_stickiness": {
      "score": [1-10],
      "narrative": "[2-3 sentences on collection efficiency, switching costs, geographic footprint]"
    },
    "scale_and_unit_economics": {
      "score": [1-10],
      "narrative": "[2-3 sentences on cost leverage per ton, fleet utilization, procurement power]"
    },
    "capital_requirements": {
      "score": [1-10],
      "narrative": "[2-3 sentences on equipment, vehicles, infrastructure costs for entrants]"
    },
    "regulatory_and_environmental_compliance": {
      "score": [1-10],
      "narrative": "[2-3 sentences on ESG compliance costs as barrier or cost drag]"
    },
    "brand_and_relationships": {
      "score": [1-10],
      "narrative": "[2-3 sentences on customer relationships, municipality contracts, contractor relationships]"
    },
    "overall_moat_strength": [1-10],
    "moat_narrative": "[1-2 sentences: is the moat defensible? For how long?]"
  },
  "unit_economics": {
    "typical_ebitda_margin_percent": "[est.] X%",
    "revenue_per_ton_hauling": "[est.] $X-Y per ton",
    "revenue_per_ton_disposal": "[est.] $X-Y per ton (tipping fees + sorting revenue)",
    "cost_structure": {
      "labor_percent_of_opex": "[est.] X%",
      "fuel_percent_of_opex": "[est.] X%",
      "equipment_depreciation_percent_of_opex": "[est.] X%",
      "landfill_tipping_fees_percent_of_revenue": "[est.] X%",
      "other_opex_percent": "[est.] X%"
    },
    "margin_drivers_ranked_by_impact": [
      "[1. Highest impact driver]",
      "[2. Second highest]",
      "[3. Third highest]"
    ],
    "leverage_sensitivity": {
      "if_fuel_increases_10_percent": "[margin impact estimate]",
      "if_labor_wages_increase_5_percent": "[margin impact estimate]",
      "if_tipping_fees_increase_20_percent": "[margin impact estimate]"
    },
    "narrative": "[2-3 sentences on unit economics sustainability and margin compression risk]"
  },
  "regulatory_and_esg_friction": {
    "carbon_and_methane_liabilities": {
      "scope": "[landfill methane, fleet emissions, Scope 3 coverage]",
      "regulation_timeline": "[active | proposed | 5-10 years out]",
      "estimated_cost_impact": "[est.] X% of EBITDA if implemented",
      "hedging_options": "[carbon credits, fleet electrification, landfill gas capture]",
      "narrative": "[2-3 sentences]"
    },
    "upcoming_legislation": [
      "[law 1: description and timeline and impact]",
      "[law 2: description and timeline and impact]"
    ],
    "esg_as_competitive_advantage_or_cost": {
      "monetizable": "yes | no",
      "narrative": "[can ESG credentials command premium pricing or is it just cost?]"
    },
    "compliance_capex_estimate": "[est.] $X million over next 5 years",
    "narrative": "[2-3 sentences on regulatory risk and materiality to valuation]"
  },
  "red_flags": [
    "[Red flag 1: specific risk with rationale]",
    "[Red flag 2: specific risk with rationale]",
    "[Red flag 3: specific risk with rationale]",
    "[Red flag 4: specific risk with rationale]",
    "[Red flag 5: specific risk with rationale]"
  ],
  "investment_thesis": {
    "headline": "[one-sentence investment case or caution]",
    "base_case": {
      "scenario": "[description of most likely 3-5 year outcome]",
      "ebitda_margin_trajectory": "[stable | compression | expansion]",
      "key_assumptions": ["[assumption 1]", "[assumption 2]", "[assumption 3]"]
    },
    "bull_case": {
      "scenario": "[what has to go right]",
      "key_catalysts": ["[catalyst 1]", "[catalyst 2]", "[catalyst 3]"],
      "margin_upside": "[est.] X basis points"
    },
    "bear_case": {
      "scenario": "[what breaks the thesis]",
      "key_triggers": ["[trigger 1]", "[trigger 2]", "[trigger 3]"],
      "margin_downside": "[est.] X basis points"
    },
    "key_metrics_to_monitor": [
      "[metric 1: why it matters]",
      "[metric 2: why it matters]",
      "[metric 3: why it matters]",
      "[metric 4: why it matters]",
      "[metric 5: why it matters]"
    ]
  }
}`

const GEMINI_MODEL = 'gemini-2.5-flash'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { company_name, industry } = req.body

  if (!company_name || !company_name.trim()) {
    return res.status(400).json({ error: 'company_name is required' })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  const userMessage = industry
    ? `Analyze: ${company_name.trim()} | Industry context: ${industry.trim()}`
    : `Analyze: ${company_name.trim()}`

  let rawText
  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: 'user', parts: [{ text: userMessage }] }],
          generationConfig: {
            temperature: 0,
            maxOutputTokens: 8000,
            responseMimeType: 'application/json',
          },
        }),
      }
    )

    if (!geminiRes.ok) {
      const err = await geminiRes.json().catch(() => ({}))
      return res.status(geminiRes.status).json({
        error: err.error?.message || `Gemini API error: ${geminiRes.status}`,
      })
    }

    const data = await geminiRes.json()
    rawText = data.candidates?.[0]?.content?.parts?.[0]?.text
    if (!rawText) {
      console.error('Unexpected Gemini response shape:', JSON.stringify(data).slice(0, 500))
      return res.status(502).json({ error: 'Empty response from Gemini API' })
    }
  } catch (err) {
    console.error('Gemini fetch error:', err)
    return res.status(500).json({ error: 'Failed to reach Gemini API' })
  }

  // Parse the JSON response
  let analysis
  try {
    analysis = JSON.parse(rawText)
  } catch {
    // Strip markdown fences if present and retry
    const stripped = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
    try {
      analysis = JSON.parse(stripped)
    } catch {
      console.error('Failed to parse Gemini response as JSON:', rawText.slice(0, 500))
      return res.status(502).json({
        error: 'Model returned non-JSON response',
        raw: rawText.slice(0, 1000),
      })
    }
  }

  return res.status(200).json({
    analysis,
    metadata: {
      company_name: company_name.trim(),
      industry: industry?.trim() ?? null,
      generated_at: new Date().toISOString(),
      model: GEMINI_MODEL,
    },
  })
}
