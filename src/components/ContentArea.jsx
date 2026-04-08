export default function ContentArea({ content }) {
  // dangerouslySetInnerHTML is intentional here — content is Claude's HTML response
  // from a controlled Anthropic API call, not user input
  return (
    <div className="content-area">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
