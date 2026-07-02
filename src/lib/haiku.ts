const SYSTEM = `Tu es un assistant académique concis. Tu analyses l'écart entre la note prédite et la note réelle d'un étudiant en Bachelor Data & Business. En 1-2 phrases maximum, donne un insight actionnable sur ce que ça révèle et comment ajuster la préparation. Sois direct, pas encourageant pour rien.`

export async function getGradeInsight(
  subject: string,
  predicted: number,
  actual: number
): Promise<string> {
  const delta = actual - predicted
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      system: SYSTEM,
      messages: [
        {
          role: 'user',
          content: `Matière: ${subject}. Note prédite: ${predicted}/20. Note réelle: ${actual}/20. Delta: ${delta >= 0 ? '+' : ''}${delta.toFixed(1)} pts.`,
        },
      ],
    }),
  })
  if (!response.ok) throw new Error(`Haiku API error: ${response.status}`)
  const data = await response.json()
  return data.content[0].text as string
}
