export default function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">📊</div>
      <p>Enter a company name or industry sector to begin.</p>
      <p>
        Supports waste management, healthcare, technology, manufacturing, retail,
        real estate, energy, telecom, financial services, pharma/biotech, and custom industries.
      </p>
      <p style={{ marginTop: '8px', fontSize: '12px' }}>
        Delivers Porter's 5 Forces · PESTEL · SWOT · Value Chain · Moat · Unit Economics · Regulatory · Red Flags · Investment Thesis
      </p>
    </div>
  )
}
