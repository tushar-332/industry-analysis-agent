export default function LoadingState({ target, step, steps }) {
  const currentMsg = steps?.[step] || 'Analyzing…'
  const totalSteps = steps?.length || 6
  const progress = Math.round(((step + 1) / totalSteps) * 100)

  return (
    <div className="loading-state">
      <div className="status">
        <span className="spinner" />
        Analyzing {target}…
      </div>
      <div className="loading-step">{currentMsg}</div>
      <div className="loading-progress-bar">
        <div className="loading-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="loading-steps-list">
        {(steps || []).map((s, i) => (
          <div key={i} className={`loading-step-item ${i < step ? 'done' : i === step ? 'active' : 'pending'}`}>
            <span className="step-icon">{i < step ? '✓' : i === step ? '●' : '○'}</span>
            {s}
          </div>
        ))}
      </div>
      <div className="details">PE-grade analysis typically takes 20–40 seconds.</div>
    </div>
  )
}
