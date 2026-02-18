'use client'

import { useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { GameProvider, useGameContext } from '@/context/GameContext'
import MessageDisplay from '@/components/MessageDisplay'
import PlayerInput from '@/components/PlayerInput'
import CharacterSheet from '@/components/CharacterSheet'
import InventoryPanel from '@/components/InventoryPanel'
import SpellsPanel from '@/components/SpellsPanel'

function GameContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const sessionId = params.sessionId as string
  const characterId = searchParams.get('characterId') || ''
  const {
    character,
    session,
    messages,
    isLoading,
    error,
    loadGameData,
    submitAction,
  } = useGameContext()

  useEffect(() => {
    if (sessionId && characterId) {
      loadGameData(sessionId, characterId)
    }
  }, [sessionId, characterId, loadGameData])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground animate-pulse">
        <div className="text-center space-y-4">
          <p className="text-2xl font-serif text-primary">⚔️ Loading adventure...</p>
          <p className="text-muted-foreground">Preparing the dungeon...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8 border border-destructive/50 rounded-lg bg-destructive/10">
          <p className="text-destructive text-lg mb-4">{error}</p>
          <a href="/dashboard" className="text-primary hover:text-primary/80 underline font-semibold">
            Return to Dashboard
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      {/* Main game area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Header */}
        <header className="bg-card/90 backdrop-blur border-b border-border px-6 py-4 flex justify-between items-center shadow-md z-20">
          <div>
            <h1 className="text-2xl font-bold font-serif text-primary flex items-center gap-2">
              <span className="text-accent">🐉</span> {session?.world_state?.location || 'Unknown Lands'}
            </h1>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mt-1 flex gap-3">
              <span>Turn {session?.turn_count || 0}</span>
              <span>•</span>
              <span>{session?.world_state?.time_of_day || 'Time Unknown'}</span>
              <span>•</span>
              <span>{session?.world_state?.season || 'Season Unknown'}</span>
            </p>
          </div>
          <a
            href="/dashboard"
            className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary px-4 py-2 rounded-md transition-colors border border-transparent hover:border-border"
          >
            ← Leave Tavern
          </a>
        </header>

        {/* Messages - Takes remaining height but leaves room for input */}
        <div className="flex-1 overflow-y-auto scroll-smooth">
          <MessageDisplay messages={messages} />
        </div>

        {/* Input - Sticky at bottom */}
        <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm z-20">
          <PlayerInput onSubmit={submitAction} sessionId={sessionId} />
        </div>
      </div>

      {/* Sidebar - Collapsible on mobile? For now static */}
      <aside className="w-80 border-l border-border bg-card/30 backdrop-blur-sm overflow-y-auto h-screen hidden md:block z-20 shadow-xl">
        <CharacterSheet character={character} className="border-none shadow-none bg-transparent" />
        {character && (
          <div className="p-4 space-y-4">
            <InventoryPanel characterId={character.id} />
            <SpellsPanel characterId={character.id} characterClass={character.class} />
          </div>
        )}
      </aside>
    </div>
  )
}

export default function GamePage() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  )
}
