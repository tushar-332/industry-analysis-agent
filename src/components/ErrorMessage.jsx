export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message">
      <span>⚠ {message}</span>
      {onRetry && (
        <button className="retry-button" onClick={onRetry}>
          ↺ Retry
        </button>
      )}
    </div>
  )
}
