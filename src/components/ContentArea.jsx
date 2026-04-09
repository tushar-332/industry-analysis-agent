import { renderTabContent } from '../utils/renderAnalysis'

export default function ContentArea({ analysis, activeTab }) {
  const html = renderTabContent(activeTab, analysis)
  return (
    <div className="content-area" dangerouslySetInnerHTML={{ __html: html }} />
  )
}
