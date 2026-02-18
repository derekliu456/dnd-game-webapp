interface GLMMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export async function callGLMAPI(systemPrompt: string, userMessage: string): Promise<string> {
  try {
    const messages: GLMMessage[] = [
      {
        role: 'user',
        content: `${systemPrompt}\n\nUser message: ${userMessage}`,
      },
    ]

    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GLM_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'glm-4',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      throw new Error(`GLM API returned ${response.status}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
  } catch (error) {
    console.error('GLM API Error:', error)
    throw new Error(`Failed to get response from GLM: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
