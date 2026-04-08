export default function MetaInfo({ target, timestamp }) {
  return (
    <div className="meta-info">
      <strong>Target:</strong> {target} | <strong>Generated:</strong> {timestamp}
    </div>
  )
}
