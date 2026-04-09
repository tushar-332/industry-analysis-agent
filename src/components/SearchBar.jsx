export default function SearchBar({
  value, onChange, onSubmit, isLoading,
  selectedIndustry, onIndustryChange,
  customIndustry, onCustomIndustryChange,
  selectedFramework, onFrameworkChange,
  selectedScope, onScopeChange,
}) {
  return (
    <div className="search-panel">
      <div className="form-group" style={{ marginBottom: '10px' }}>
        <label>Company Name or Industry Sector</label>
        <input
          type="text"
          placeholder="e.g., 'Waste Management Inc', 'UnitedHealth Group', 'Datadog'"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') onSubmit() }}
        />
      </div>

      <div className="form-group" style={{ marginBottom: '10px' }}>
        <label>Industry / Sector</label>
        <select
          className="filter-select"
          value={selectedIndustry}
          onChange={(e) => onIndustryChange(e.target.value)}
        >
          <option value="auto">Auto-detect from company name</option>
          <option value="waste_management">Waste Management</option>
          <option value="healthcare_services">Healthcare Services</option>
          <option value="technology_saas">Technology / SaaS</option>
          <option value="manufacturing">Manufacturing / Industrial</option>
          <option value="retail_consumer">Retail / Consumer</option>
          <option value="real_estate">Real Estate / REIT</option>
          <option value="energy">Energy / Utilities</option>
          <option value="telecom">Telecommunications</option>
          <option value="financial_services">Financial Services</option>
          <option value="pharma_biotech">Pharma / Biotech</option>
          <option value="custom">Custom Industry (describe below)</option>
        </select>
      </div>

      {selectedIndustry === 'custom' && (
        <div className="form-group" style={{ marginBottom: '10px' }}>
          <label>Describe Custom Industry</label>
          <input
            type="text"
            className="custom-industry-input"
            placeholder="e.g., 'Commercial space launch' or 'Digital advertising networks'"
            value={customIndustry}
            onChange={(e) => onCustomIndustryChange(e.target.value)}
          />
        </div>
      )}

      <div className="filter-grid">
        <div className="form-group">
          <label>Analysis Framework</label>
          <select
            className="filter-select"
            value={selectedFramework}
            onChange={(e) => onFrameworkChange(e.target.value)}
          >
            <option value="comprehensive">Comprehensive (All Frameworks)</option>
            <option value="porters_only">Porter's 5 Forces Only</option>
            <option value="pestel_only">PESTEL Only</option>
            <option value="swot_moat">SWOT &amp; Moat</option>
            <option value="economics_regulatory">Unit Economics &amp; Regulatory</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        <div className="form-group">
          <label>Scope &amp; Context</label>
          <select
            className="filter-select"
            value={selectedScope}
            onChange={(e) => onScopeChange(e.target.value)}
          >
            <option value="global">Global</option>
            <option value="regional">Regional</option>
            <option value="competitor">Competitor Analysis</option>
            <option value="investment_stage">Investment Stage</option>
            <option value="acquisition_target">Acquisition Target</option>
            <option value="regulatory_deep_dive">Regulatory Deep Dive</option>
          </select>
        </div>
      </div>

      <div style={{ marginTop: '12px' }}>
        <button
          className="button button-primary"
          style={{ width: '100%' }}
          onClick={onSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing…' : 'Run Analysis'}
        </button>
      </div>
    </div>
  )
}
