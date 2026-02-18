'use client'

import { useEffect, useState } from 'react'
import { Character, GameSession, GameMessage } from '@/types'
import * as store from '@/lib/store'
import MessageDisplay from './MessageDisplay'
import PlayerInput from './PlayerInput'
import CharacterSheet from './CharacterSheet'

interface GameBoardProps {
  sessionId: string
  characterId: string
}

export default function GameBoard({ sessionId, characterId }: GameBoardProps) {
  const [character, setCharacter] = useState<Character | null>(null)
  const [session, setSession] = useState<GameSession | null>(null)
  const [messages, setMessages] = useState<GameMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const char = store.getCharacter(characterId)
    if (char) setCharacter(char)

    const sess = store.getSession(sessionId)
    if (sess) setSession(sess)

    const msgs = store.getMessages(sessionId)
    setMessages(msgs)

    setIsLoading(false)
  }, [characterId, sessionId])

  const handleAction = async (action: string) => {
    if (!session || !character) return

    try {
      const turnNumber = (session.turn_count || 0) + 1
      const playerMsg: GameMessage = {
        id: crypto.randomUUID(),
        session_id: sessionId,
        turn_number: turnNumber,
        message_type: 'player_action',
        content: action,
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, playerMsg])
      store.addMessage(playerMsg)

      const recentMessages = store.getRecentMessages(sessionId, 5)

      const res = await fetch('/api/game/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerAction: action,
          character,
          session,
          recentMessages,
        }),
      })

      if (!res.ok) throw new Error('Failed to process action')

      const data = await res.json()

      const dmMsg: GameMessage = {
        id: crypto.randomUUID(),
        session_id: sessionId,
        turn_number: data.gameState.turn,
        message_type: 'dm_response',
        content: data.dmResponse,
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, dmMsg])
      store.addMessage(dmMsg)

      const updatedChar = {
        ...character,
        current_hp: data.gameState.characterHP,
        xp: data.gameState.characterXP,
      }
      setCharacter(updatedChar)
      store.saveCharacter(updatedChar)

      const updatedSession = {
        ...session,
        turn_count: data.gameState.turn,
        last_action_at: new Date().toISOString(),
        world_state: {
          ...session.world_state,
          location: data.gameState.location,
        },
      }
      setSession(updatedSession)
      store.saveSession(updatedSession)
    } catch (err) {
      console.error('Action failed:', err)
      setError(`Failed to process action: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-white">
        <p>Loading adventure...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-red-400">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex">
      <div className="flex-1 flex flex-col">
        <div className="bg-slate-900 border-b border-slate-700 px-6 py-4">
          <h1 className="text-2xl font-bold text-amber-400">
            🐉 {session?.world_state.location || 'Adventure'}
          </h1>
          <p className="text-sm text-gray-400">Turn {session?.turn_count || 0}</p>
        </div>

        <MessageDisplay messages={messages} />
        <PlayerInput onSubmit={handleAction} sessionId={sessionId} />
      </div>

      <div className="w-80 border-l border-slate-700 p-4">
        <CharacterSheet character={character} />
      </div>
    </div>
  )
}
