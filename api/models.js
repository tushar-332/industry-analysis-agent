export default async function handler(req, res) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not set in environment' })

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
  )
  const data = await response.json()

  if (!response.ok) return res.status(response.status).json(data)

  // Filter to only models that support generateContent
  const usable = (data.models || [])
    .filter(m => (m.supportedGenerationMethods || []).includes('generateContent'))
    .map(m => m.name)

  return res.status(200).json({ usable_models: usable, total: usable.length })
}
