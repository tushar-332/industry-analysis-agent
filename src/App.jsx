import { useAnalysis } from './hooks/useAnalysis'
import { TABS } from './constants/tabs'
import Header from './components/Header'
import SearchBar from './components/SearchBar'
import ErrorMessage from './components/ErrorMessage'
import MetaInfo from './components/MetaInfo'
import TabNavigation from './components/TabNavigation'
import ContentArea from './components/ContentArea'
import LoadingState from './components/LoadingState'
import EmptyState from './components/EmptyState'

export default function App() {
  const {
    searchInput, setSearchInput,
    selectedFramework, setSelectedFramework,
    selectedScope, setSelectedScope,
    isLoading, analysisResult,
    activeTab, setActiveTab,
    error, runAudit, generatePresentation,
  } = useAnalysis()

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
      {error && <ErrorMessage message={error} />}
      {analysisResult ? (
        <div>
          <div className="meta-bar">
            <div className="meta-info">
              <strong>{analysisResult.target}</strong>
              &nbsp;·&nbsp; {analysisResult.timestamp}
            </div>
            <div className="export-buttons">
              <button className="button button-secondary" onClick={generatePresentation}>Gamma →</button>
            </div>
          </div>
          <TabNavigation tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
          <ContentArea analysis={analysisResult.analysis} activeTab={activeTab} />
        </div>
      ) : isLoading ? (
        <LoadingState target={searchInput} />
      ) : (
        <EmptyState />
      )}
    </div>
  )
}
