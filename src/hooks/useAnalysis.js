import { useState } from 'react'

export function useAnalysis() {
  const [searchInput, setSearchInput] = useState('')
  const [selectedIndustry, setSelectedIndustry] = useState('auto')
  const [customIndustry, setCustomIndustry] = useState('')
  const [selectedFramework, setSelectedFramework] = useState('comprehensive')
  const [selectedScope, setSelectedScope] = useState('global')
  const [isLoading, setIsLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [error, setError] = useState(null)

  const LOADING_STEPS = [
    'Connecting to analysis engine…',
    'Fetching company data…',
    'Applying frameworks…',
    'Benchmarking against peers…',
    'Quantifying risks…',
    'Finalizing report…',
  ]

  async function runAudit() {
    if (!searchInput.trim()) {
      setError('Please enter a company name or sub-sector.')
      return
    }

    setIsLoading(true)
    setLoadingStep(0)
    setError(null)
    setAnalysisResult(null)

    // Step through loading messages while waiting
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => Math.min(prev + 1, LOADING_STEPS.length - 1))
    }, 5000)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: searchInput,
          industry: selectedIndustry === 'custom' ? customIndustry : selectedIndustry,
          framework: selectedFramework,
          scope: selectedScope,
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || `API error: ${response.status}`)
      }

      const data = await response.json()

      setAnalysisResult({
        target: searchInput.trim(),
        analysis: data.analysis,
        metadata: data.metadata,
        timestamp: new Date().toLocaleString(),
      })
      setActiveTab('overview')
      setError(null)
    } catch (err) {
      setError(err.message || 'Failed to run analysis. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      clearInterval(stepInterval)
      setIsLoading(false)
      setLoadingStep(0)
    }
  }

  function exportJson() {
    if (!analysisResult) return
    const blob = new Blob(
      [JSON.stringify({ metadata: analysisResult.metadata, analysis: analysisResult.analysis }, null, 2)],
      { type: 'application/json' }
    )
    downloadBlob(blob, `${sanitizeFilename(analysisResult.target)}_analysis.json`)
  }

  function exportMarkdown() {
    if (!analysisResult) return
    const md = buildMarkdown(analysisResult.analysis)
    const blob = new Blob([md], { type: 'text/markdown' })
    downloadBlob(blob, `${sanitizeFilename(analysisResult.target)}_analysis.md`)
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  function sanitizeFilename(name) {
    return name.replace(/[^a-z0-9]/gi, '_').toLowerCase()
  }

  function buildMarkdown(a) {
    const lines = []
    const h1 = t => lines.push(`# ${t}`, '')
    const h2 = t => lines.push(`## ${t}`, '')
    const h3 = t => lines.push(`### ${t}`, '')
    const p  = t => lines.push(t, '')
    const li = t => lines.push(`- ${t}`)
    const nl = () => lines.push('')

    const meta = a.metadata || {}
    const es = typeof a.executive_summary === 'object' ? a.executive_summary : { key_findings: a.executive_summary }

    h1(`Industry Analysis: ${meta.target || 'Unknown'}`)
    p(`*Generated: ${meta.analysis_date || new Date().toLocaleDateString()} | Investment Grade: ${meta.investment_grade || 'N/A'} | Data quality: ${meta.data_quality || 'N/A'}*`)
    if (meta.grade_rationale) p(`**Grade Rationale:** ${meta.grade_rationale}`)

    h2('Executive Summary')
    if (es.key_findings) p(es.key_findings)
    if (es.company_positioning) p(`**Company Positioning:** ${es.company_positioning}`)
    if (es.moat_strength) p(`**Moat Strength:** ${es.moat_strength}`)
    if (es.base_case_thesis) p(`**Base Case:** ${es.base_case_thesis}`)
    if (es.bull_case_catalyst) p(`**Bull Case:** ${es.bull_case_catalyst}`)
    if (es.bear_case_risk) p(`**Bear Case:** ${es.bear_case_risk}`)

    h2("Porter's Five Forces")
    const pf = a.porters_five_forces || {}
    if (!pf.note) {
      ;['supplier_power','buyer_power','threat_of_substitutes','threat_of_new_entrants','competitive_rivalry'].forEach(k => {
        const f = pf[k] || {}
        h3(`${k.replace(/_/g,' ')} — Score: ${f.score || '—'}/10 (${f.confidence || ''})`)
        if (f.source) p(`*Source: ${f.source}*`)
        p(f.narrative || '')
        const cb = f.competitive_benchmarks
        if (cb) {
          Object.entries(cb).forEach(([key, val]) => li(`${key.replace(/_/g,' ')}: ${val}`))
          nl()
        }
      })
      p(`**Industry Attractiveness Score:** ${pf.industry_attractiveness_score || '—'}/10`)
    }

    h2('PESTEL')
    const pestel = a.pestel || {}
    if (!pestel.note) {
      ;['political','economic','social','technological','environmental','legal'].forEach(k => {
        const item = pestel[k] || {}
        h3(`${k.charAt(0).toUpperCase() + k.slice(1)} — ${item.impact || ''} (${item.confidence || ''})`)
        p(`*Factors: ${item.key_factors || ''}*`)
        p(item.narrative || '')
      })
    }

    h2('SWOT')
    const s = a.swot || {}
    if (!s.note) {
      h3('Strengths'); (s.strengths || []).forEach(li); nl()
      h3('Weaknesses'); (s.weaknesses || []).forEach(li); nl()
      h3('Opportunities'); (s.opportunities || []).forEach(li); nl()
      h3('Threats'); (s.threats || []).forEach(li); nl()
    }

    h2('Moat Assessment')
    const m = a.moat_assessment || {}
    if (!m.note) {
      ;['permits_and_licensing','route_density_and_customer_stickiness','scale_and_unit_economics',
        'capital_requirements','regulatory_and_environmental_compliance','brand_and_relationships'].forEach(k => {
        const item = m[k] || {}
        h3(`${k.replace(/_/g,' ')} — ${item.score || '—'}/10 (${item.confidence || ''})`)
        if (item.source) p(`*Source: ${item.source}*`)
        p(item.narrative || '')
      })
      p(`**Overall Moat Strength:** ${m.overall_moat_strength || '—'}/10`)
      p(m.moat_narrative || '')
    }

    h2('Unit Economics')
    const ue = a.unit_economics || {}
    if (!ue.note) {
      p(`**EBITDA Margin:** ${ue.typical_ebitda_margin_percent || ''} (${ue.confidence || ''})`)
      p(`**Revenue/ton Hauling:** ${ue.revenue_per_ton_hauling || ''}`)
      p(`**Revenue/ton Disposal:** ${ue.revenue_per_ton_disposal || ''}`)
      h3('Margin Drivers'); (ue.margin_drivers_ranked_by_impact || []).forEach(li); nl()
      p(ue.narrative || '')
    }

    h2('Red Flags')
    const flags = a.red_flags || []
    flags.forEach((flag, i) => {
      if (typeof flag === 'string') {
        li(flag)
      } else {
        h3(`${i+1}. ${flag.title || ''}`)
        p(flag.description || '')
        if (flag.probability) p(`**Probability:** ${flag.probability} — ${flag.timeline || ''}`)
        if (flag.magnitude) p(`**Magnitude:** ${flag.magnitude}`)
        if (flag.trigger) p(`**Trigger:** ${flag.trigger}`)
        if (flag.mitigation) p(`**Mitigation:** ${flag.mitigation}`)
        if (flag.portfolio_impact) p(`**Portfolio Impact:** ${flag.portfolio_impact}`)
      }
    })
    nl()

    h2('Investment Thesis')
    const t = a.investment_thesis || {}
    if (!t.note) {
      p(`**${t.headline || ''}**`)
      const base = t.base_case || {}
      const bull = t.bull_case || {}
      const bear = t.bear_case || {}
      h3('Base Case'); p(base.scenario || ''); (base.key_assumptions || []).forEach(li); nl()
      h3('Bull Case'); p(bull.scenario || ''); (bull.key_catalysts || []).forEach(li); nl()
      h3('Bear Case'); p(bear.scenario || ''); (bear.key_triggers || []).forEach(li); nl()
      h3('Key Metrics to Monitor'); (t.key_metrics_to_monitor || []).forEach(li)
    }

    if ((meta.sources_cited || []).length) {
      h2('Sources Cited')
      meta.sources_cited.forEach(li)
    }

    return lines.join('\n')
  }

  function generatePresentation() {
    if (!analysisResult) { setError('Please run an audit first.'); return }
    const content = `Industry Analysis for ${analysisResult.target}

${JSON.stringify(analysisResult.analysis, null, 2)}

Create a 7-9 slide executive presentation:
- Slide titles for: Executive Summary, Porter's Forces, PESTEL, SWOT, Moat Assessment, Unit Economics, Red Flags, Investment Thesis
- 1-2 executive-ready bullet points per slide
- Key data points formatted visually
- Investment grade and key thesis prominently featured`
    navigator.clipboard.writeText(content)
      .then(() => alert('Copied to clipboard. Paste into Gamma or your presentation tool.'))
      .catch(() => alert('Could not access clipboard.'))
  }

  return {
    searchInput, setSearchInput,
    selectedIndustry, setSelectedIndustry,
    customIndustry, setCustomIndustry,
    selectedFramework, setSelectedFramework,
    selectedScope, setSelectedScope,
    isLoading, loadingStep, LOADING_STEPS,
    analysisResult,
    activeTab, setActiveTab,
    error, setError,
    runAudit,
    exportJson,
    exportMarkdown,
    generatePresentation,
  }
}
