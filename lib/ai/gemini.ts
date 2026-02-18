import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function callGeminiAPI(systemPrompt: string, userMessage: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt,
    })

    const result = await model.generateContent(userMessage)
    const response = result.response
    const text = response.text()

    return text
  } catch (error) {
    console.error('Gemini API Error:', error)
    throw new Error(`Failed to get response from Gemini: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
