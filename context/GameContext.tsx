'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { Character, GameSession, GameMessage } from '@/types'
import * as store from '@/lib/store'

interface GameContextType {
  character: Character | null
  session: GameSession | null
  messages: GameMessage[]
  isLoading: boolean
  error: string | null
  setCharacter: (character: Character | null) => void
  setSession: (session: GameSession | null) => void
  setMessages: (messages: GameMessage[]) => void
  addMessage: (message: GameMessage) => void
  updateCharacterState: (updates: Partial<Character>) => void
  updateSessionState: (updates: Partial<GameSession>) => void
  loadGameData: (sessionId: string, characterId: string) => void
  submitAction: (action: string) => Promise<void>
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [character, setCharacter] = useState<Character | null>(null)
  const [session, setSession] = useState<GameSession | null>(null)
  const [messages, setMessages] = useState<GameMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addMessage = useCallback((message: GameMessage) => {
    setMessages((prev) => [...prev, message])
  }, [])

  const updateCharacterState = useCallback((updates: Partial<Character>) => {
    setCharacter((prev) => {
      if (!prev) return null
      const updated = { ...prev, ...updates } as Character
      store.saveCharacter(updated)
      return updated
    })
  }, [])

  const updateSessionState = useCallback((updates: Partial<GameSession>) => {
    setSession((prev) => {
      if (!prev) return null
      const updated = { ...prev, ...updates } as GameSession
      store.saveSession(updated)
      return updated
    })
  }, [])

  const loadGameData = useCallback((sessionId: string, characterId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const char = store.getCharacter(characterId)
      if (char) setCharacter(char)

      const sess = store.getSession(sessionId)
      if (sess) setSession(sess)

      const msgs = store.getMessages(sessionId)
      setMessages(msgs)
    } catch (err) {
      console.error('Failed to load game data:', err)
      setError('Failed to load game data.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const submitAction = useCallback(
    async (action: string) => {
      if (!session || !character) return

      // Add player action optimistically
      const turnNumber = (session.turn_count || 0) + 1
      const playerMsg: GameMessage = {
        id: crypto.randomUUID(),
        session_id: session.id,
        turn_number: turnNumber,
        message_type: 'player_action',
        content: action,
        created_at: new Date().toISOString(),
      }
      addMessage(playerMsg)
      store.addMessage(playerMsg)

      try {
        const recentMessages = store.getRecentMessages(session.id, 5)

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

        // Add DM response
        const dmMsg: GameMessage = {
          id: crypto.randomUUID(),
          session_id: session.id,
          turn_number: data.gameState.turn,
          message_type: 'dm_response',
          content: data.dmResponse,
          created_at: new Date().toISOString(),
        }
        addMessage(dmMsg)
        store.addMessage(dmMsg)

        // Update character and session state (also persists to localStorage)
        updateCharacterState({
          current_hp: data.gameState.characterHP,
          xp: data.gameState.characterXP,
        })
        updateSessionState({
          turn_count: data.gameState.turn,
          last_action_at: new Date().toISOString(),
          world_state: {
            ...session.world_state,
            location: data.gameState.location,
          },
        })
      } catch (err) {
        setError(`Failed to process action: ${err instanceof Error ? err.message : 'Unknown error'}`)
      }
    },
    [session, character, addMessage, updateCharacterState, updateSessionState]
  )

  return (
    <GameContext.Provider
      value={{
        character,
        session,
        messages,
        isLoading,
        error,
        setCharacter,
        setSession,
        setMessages,
        addMessage,
        updateCharacterState,
        updateSessionState,
        loadGameData,
        submitAction,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export function useGameContext() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider')
  }
  return context
}
