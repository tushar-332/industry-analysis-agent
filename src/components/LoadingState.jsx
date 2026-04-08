export default function LoadingState({ target }) {
  return (
    <div className="loading-state">
      <div className="status">
        <span className="spinner" />
        Analyzing {target}...
      </div>
      <div className="details">
        Fetching live data, applying frameworks, identifying asymmetric risks.
      </div>
    </div>
  )
}
