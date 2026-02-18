'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Sword, MapPin, Clock, Bot, Skull, Plus, Shield, User } from 'lucide-react'
import { Character, GameSession } from '@/types'
import * as store from '@/lib/store'

export default function DashboardPage() {
  const router = useRouter()
  const [characters, setCharacters] = useState<Character[]>([])
  const [sessions, setSessions] = useState<GameSession[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setCharacters(store.getCharacters())
    setSessions(store.getSessions().filter((s) => s.is_active))
    setLoaded(true)
  }, [])

  const handleStartGame = (characterId: string) => {
    const session: GameSession = {
      id: crypto.randomUUID(),
      character_id: characterId,
      ai_provider: 'gemini',
      started_at: new Date().toISOString(),
      last_action_at: new Date().toISOString(),
      world_state: {
        location: 'The Rusty Dragon Tavern',
        time_of_day: 'evening',
        season: 'autumn',
        events: [],
      },
      turn_count: 0,
      is_active: true,
      created_at: new Date().toISOString(),
    }
    store.saveSession(session)
    router.push(`/game/${session.id}?characterId=${characterId}`)
  }

  const handleResumeGame = (sessionId: string, characterId: string) => {
    router.push(`/game/${sessionId}?characterId=${characterId}`)
  }

  const handleDeleteCharacter = (characterId: string) => {
    if (!confirm('Are you sure? This will also delete all associated game sessions.')) return
    store.deleteCharacter(characterId)
    setCharacters(store.getCharacters())
    setSessions(store.getSessions().filter((s) => s.is_active))
  }

  if (!loaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground">
        <p className="text-xl animate-pulse font-serif">Loading your tavern...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-4xl font-bold font-serif text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              The Tavern
            </h1>
            <p className="text-muted-foreground mt-2">Where legends begin.</p>
          </div>
          <Link 
            href="/characters/create"
            className="inline-flex items-center justify-center rounded-md bg-primary py-2 px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            Create New Hero
          </Link>
        </header>

        {/* Active Sessions */}
        {sessions.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold font-serif mb-6 flex items-center gap-2">
              <span className="text-accent">⚔️</span> Active Adventures
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sessions.map((session) => {
                const char = (characters || []).find(c => c.id === session.character_id)
                return (
                  <div
                    key={session.id}
                    className="group relative overflow-hidden rounded-xl border border-border bg-card text-card-foreground p-6 hover:shadow-lg hover:shadow-primary/10 hover:border-primary/50 transition-all duration-300 cursor-pointer"
                    onClick={() => handleResumeGame(session.id, session.character_id)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-bold font-serif text-foreground group-hover:text-primary transition-colors">
                            {char?.name || 'Unknown Hero'}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {char?.class} Lv.{char?.level}
                          </p>
                        </div>
                        <span className="px-2 py-1 rounded bg-secondary text-xs text-muted-foreground font-mono">
                          Turn {session.turn_count}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm text-muted-foreground border-t border-border/50 pt-4 mt-2">
                        <p className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center text-[10px]">📍</span> 
                          {session.world_state?.location || 'Unknown Location'}
                        </p>
                        <p className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[10px]">🤖</span> 
                          {session.ai_provider?.toUpperCase()} Model
                        </p>
                      </div>

                      <button className="mt-6 w-full py-2 rounded-lg text-sm font-semibold border border-primary/20 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all">
                        Continue Adventure
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Characters */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold font-serif flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" /> Your Roster
            </h2>
          </div>

          {characters.length === 0 ? (
            <div className="bg-card border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">No Heroes Found</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">The tavern is empty. Create a hero to begin your journey.</p>
              <Link
                href="/characters/create"
                className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                Create New Character
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {characters.map((char) => (
                <div
                  key={char.id}
                  className="group bg-card text-card-foreground border border-border rounded-xl p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-border">
                        <span className="font-serif font-bold text-primary">{char.name[0]}</span>
                      </div>
                      <div>
                        <h3 className="font-bold font-serif leading-none group-hover:text-primary transition-colors">{char.name}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {char.class} • Level {char.level}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Health</span>
                      <span>{char.current_hp} / {char.max_hp}</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          char.current_hp / char.max_hp > 0.5
                            ? 'bg-gradient-to-r from-green-500 to-emerald-400'
                            : char.current_hp / char.max_hp > 0.25
                              ? 'bg-gradient-to-r from-yellow-500 to-amber-400'
                              : 'bg-gradient-to-r from-red-600 to-red-400'
                        }`}
                        style={{ width: `${(char.current_hp / char.max_hp) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-border/50">
                    <button
                      onClick={() => handleStartGame(char.id)}
                      className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground py-2 rounded-lg text-xs font-semibold uppercase tracking-wide transition-colors"
                    >
                      New Adventure
                    </button>
                    <button
                      onClick={() => handleDeleteCharacter(char.id)}
                      className="px-3 py-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors group/delete"
                      title="Delete Character"
                    >
                      <Skull className="w-4 h-4 group-hover/delete:animate-shake" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
