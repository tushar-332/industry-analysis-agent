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
        hasResult={!!analysisResult}
        onPresent={generatePresentation}
      />
      {error && <ErrorMessage message={error} />}
      {analysisResult ? (
        <div>
          <MetaInfo target={analysisResult.target} timestamp={analysisResult.timestamp} />
          <TabNavigation tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
          <ContentArea content={analysisResult.content} />
        </div>
      ) : isLoading ? (
        <LoadingState target={searchInput} />
      ) : (
        <EmptyState />
      )}
    </div>
  )
}
