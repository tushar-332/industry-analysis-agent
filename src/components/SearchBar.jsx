export default function SearchBar({ value, onChange, onSubmit, isLoading, hasResult, onPresent }) {
  function handleKeyPress(e) {
    if (e.key === 'Enter') onSubmit()
  }

  return (
    <div className="search-section">
      <div className="form-group">
        <label>Company or Sub-Sector</label>
        <input
          type="text"
          placeholder="e.g., Waste Management Inc., Medical Waste Disposal, Recycling Operations"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>
      <button
        className="button button-primary"
        onClick={onSubmit}
        disabled={isLoading}
      >
        {isLoading ? 'Analyzing...' : 'Run Audit'}
      </button>
      {hasResult && (
        <button
          className="button button-secondary"
          onClick={onPresent}
          disabled={isLoading}
        >
          Generate Presentation →
        </button>
      )}
    </div>
  )
}
