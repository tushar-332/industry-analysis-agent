import { useAnalysis } from './hooks/useAnalysis'
import { TABS } from './constants/tabs'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import ErrorMessage from './components/ErrorMessage'
import TabNavigation from './components/TabNavigation'
import ContentArea from './components/ContentArea'
import LoadingState from './components/LoadingState'
import EmptyState from './components/EmptyState'

export default function App() {
  const {
    searchInput, setSearchInput,
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
  } = useAnalysis()

  const meta = analysisResult?.analysis?.metadata || {}
  const grade = meta.investment_grade
  const gradeCls = grade === 'A' ? 'grade-a' : grade === 'B' ? 'grade-b' : grade === 'C' ? 'grade-c' : ''

  return (
    <div className="container">
      <Header />
      <SearchBar
        value={searchInput}
        onChange={setSearchInput}
        onSubmit={runAudit}
        isLoading={isLoading}
        selectedFramework={selectedFramework}
        onFrameworkChange={setSelectedFramework}
        selectedScope={selectedScope}
        onScopeChange={setSelectedScope}
      />
      {error && <ErrorMessage message={error} onRetry={() => { setError(null); runAudit() }} />}
      {analysisResult ? (
        <div>
          <div className="meta-bar">
            <div className="meta-info">
              <strong>{analysisResult.target}</strong>
              <span className="meta-sep">·</span>
              {analysisResult.timestamp}
              {grade && <span className={`grade-pill ${gradeCls}`}>Grade {grade}</span>}
            </div>
            <div className="export-buttons">
              <button className="button button-secondary" onClick={generatePresentation}>Gamma →</button>
              <button className="button button-secondary" onClick={exportMarkdown}>↓ Markdown</button>
              <button className="button button-secondary" onClick={exportJson}>↓ JSON</button>
            </div>
          </div>
          <TabNavigation tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
          <ContentArea analysis={analysisResult.analysis} activeTab={activeTab} />
        </div>
      ) : isLoading ? (
        <LoadingState target={searchInput} step={loadingStep} steps={LOADING_STEPS} />
      ) : (
        <EmptyState />
      )}
    </div>
  )
}
