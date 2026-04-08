import { useState } from 'react'

export function useAnalysis() {
  const [searchInput, setSearchInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [error, setError] = useState(null)

  async function runAudit() {
    if (!searchInput.trim()) {
      setError('Please enter a company name or sub-sector.')
      return
    }

    setIsLoading(true)
    setError(null)
    setAnalysisResult(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company_name: searchInput }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || `API error: ${response.status}`)
      }

      const data = await response.json()

      setAnalysisResult({
        target: searchInput,
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
      setIsLoading(false)
    }
  }

  function generatePresentation() {
    if (!analysisResult) {
      setError('Please run an audit first.')
      return
    }

    const presentationContent = `Based on this industry analysis for ${analysisResult.target}:

${JSON.stringify(analysisResult.analysis, null, 2)}

Create a concise Gamma presentation outline with:
- 5-7 slide titles
- 1-2 executive-ready bullet points per slide
- Key data points formatted for visual display
- Focus on executive summary, Porter's Forces, SWOT, moat assessment, and strategic recommendations`

    navigator.clipboard.writeText(presentationContent).then(() => {
      alert('Presentation outline copied to clipboard. Paste into Gamma or your preferred presentation tool.')
    }).catch(() => {
      alert('Presentation content ready. Please copy from the analysis above.')
    })
  }

  return {
    searchInput,
    setSearchInput,
    isLoading,
    analysisResult,
    activeTab,
    setActiveTab,
    error,
    runAudit,
    generatePresentation,
  }
}
