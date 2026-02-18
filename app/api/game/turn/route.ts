import { NextRequest, NextResponse } from 'next/server'
import { callGeminiAPI } from '@/lib/ai/gemini'
import { callGLMAPI } from '@/lib/ai/glm'
import { buildSystemPrompt } from '@/lib/ai/prompt-builder'
import { Character, GameSession, GameMessage } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { playerAction, character, session, recentMessages, personality } = body as {
      playerAction: string
      character: Character
      session: GameSession
      recentMessages: GameMessage[]
      personality?: string
    }

    if (!playerAction || !character || !session) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Build system prompt with character and game context
    const systemPrompt = buildSystemPrompt(
      character,
      session,
      recentMessages || [],
      personality || 'classic_fantasy'
    )

    // Call AI to get DM response
    let dmResponse = ''
    try {
      if (session.ai_provider === 'glm') {
        dmResponse = await callGLMAPI(systemPrompt, playerAction)
      } else {
        dmResponse = await callGeminiAPI(systemPrompt, playerAction)
      }
    } catch (error) {
      console.error('AI API error:', error)
      dmResponse =
        'The DM ponders your words... but seems momentarily confused. Please try again in a moment.'
    }

    // Parse game state changes from the AI response
    let hpLost = 0
    let xpGained = 0

    const damageMatch = dmResponse.match(/damage taken:\s*(\d+)\s*HP/i)
    if (damageMatch) {
      hpLost = parseInt(damageMatch[1])
    }

    const xpMatch = dmResponse.match(/gained:\s*(\d+)\s*XP/i)
    if (xpMatch) {
      xpGained = parseInt(xpMatch[1])
    }

    const turnNumber = (session.turn_count || 0) + 1

    return NextResponse.json(
      {
        dmResponse,
        gameState: {
          turn: turnNumber,
          characterHP: Math.max(0, character.current_hp - hpLost),
          characterXP: character.xp + xpGained,
          damageDealt: hpLost,
          xpGained,
          location: session.world_state.location,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Turn processing error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
