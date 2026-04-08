export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { target } = req.body
  if (!target || !target.trim()) {
    return res.status(400).json({ error: 'Target is required' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' })
  }

  const prompt = `You are an industry analyst specializing in waste management economics. Provide a comprehensive industry audit for: "${target}"

Your analysis MUST follow this exact structure and include all five frameworks:

1. EXECUTIVE SUMMARY (3 sentences, "Bottom Line Up Front")
2. PORTER'S FIVE FORCES (analyze each force with 2-3 sentences)
3. PESTEL ANALYSIS (Political, Economic, Social, Technological, Environmental, Legal)
4. CIRCULARITY GAP ANALYSIS (assess current vs. potential circular processes)
5. SWOT ANALYSIS (Strengths, Weaknesses, Opportunities, Threats)
6. VALUE CHAIN ANALYSIS (from collection to final disposition)
7. THE MOAT ASSESSMENT (barriers to entry: permits, capital, route density)
8. UNIT ECONOMICS (EBITDA drivers: tipping fees, fuel exposure, labor elasticity - use HTML table format)
9. REGULATORY & ESG FRICTION (legislative risks, carbon/methane liabilities)
10. STRATEGIC RED FLAGS (bulleted list of failure modes)

CRITICAL OPERATIONAL GUARDRAILS:
- NEVER treat Municipal Solid Waste (MSW) and Hazardous Waste as the same asset class
- NEVER present "Advanced/Chemical Recycling" as proven; mark as speculative R&D
- ALWAYS distinguish between "Hauling" (low margin) and "Post-Collection/Disposal" (high margin)
- ALWAYS state when data is lagging or permitting data unavailable
- Target audience: Board-level executives seeking asymmetric risk identification
- Use HTML tables for all quantitative comparisons
- Be crisp, logical, no fluff or "planet-saving" speak unless tied to specific tax credits/revenue

For all data: Use real, researched industry benchmarks. If exact data unavailable, use (est.) notation and explain assumptions.

Format all output as clean HTML with proper section headers and tables. Make it board-ready.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      return res.status(response.status).json({
        error: err.error?.message || `Anthropic API error: ${response.status}`,
      })
    }

    const data = await response.json()
    return res.status(200).json({ content: data.content[0].text })
  } catch (err) {
    console.error('Analyze handler error:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
