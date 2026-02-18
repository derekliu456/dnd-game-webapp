'use client'

import { useEffect, useState } from 'react'
import { Spell } from '@/types'
import { AVAILABLE_SPELLS } from '@/lib/game/constants'
import * as store from '@/lib/store'

interface SpellsPanelProps {
  characterId: string
  characterClass: string
}

export default function SpellsPanel({ characterId, characterClass }: SpellsPanelProps) {
  const [learnedSpells, setLearnedSpells] = useState<Spell[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [showLearnModal, setShowLearnModal] = useState(false)

  const availableSpells = AVAILABLE_SPELLS[characterClass as keyof typeof AVAILABLE_SPELLS] || []

  useEffect(() => {
    if (!isOpen || !characterId) return
    setLearnedSpells(store.getSpells(characterId))
  }, [characterId, isOpen])

  const handleLearnSpell = (spell: (typeof availableSpells)[0]) => {
    const newSpell: Spell = {
      id: crypto.randomUUID(),
      character_id: characterId,
      spell_name: spell.name,
      slot_type: 'ability',
      damage_dice: spell.damage,
      description: spell.description,
      learned_at: new Date().toISOString(),
    }
    store.addSpell(newSpell)
    setLearnedSpells((prev) => [...prev, newSpell])
    setShowLearnModal(false)
  }

  const unlearnedSpells = availableSpells.filter(
    (as) => !learnedSpells.some((ls) => ls.spell_name === as.name)
  )

  return (
    <div className="border hover:border-primary/50 transition-colors rounded-lg bg-card/30 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex justify-between items-center text-left hover:bg-muted/50 transition"
      >
        <span className="text-sm font-semibold font-serif text-primary">📖 Spells & Abilities</span>
        <span className="text-muted-foreground text-xs font-mono">
          {learnedSpells.length} learned {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-3 border-t border-border/50 pt-3">
            <>
              {learnedSpells.length === 0 ? (
                <p className="text-xs text-gray-500">No spells learned yet</p>
              ) : (
                learnedSpells.map((spell) => (
                  <div
                    key={spell.id}
                    className="bg-secondary/30 border border-border rounded-lg px-3 py-2"
                  >
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold font-serif text-foreground">{spell.spell_name}</p>
                      {spell.damage_dice && spell.damage_dice !== '0' && (
                        <span className="text-xs font-mono text-destructive">
                          {spell.damage_dice.startsWith('-') ? '💚' : '💥'} {spell.damage_dice}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{spell.description}</p>
                  </div>
                ))
              )}

              {unlearnedSpells.length > 0 && (
                <button
                  onClick={() => setShowLearnModal(!showLearnModal)}
                  className="w-full text-xs text-primary hover:text-primary/80 mt-2 py-2 border border-dashed border-primary/30 rounded hover:bg-primary/5 transition font-medium"
                >
                  {showLearnModal ? 'Close' : `+ Learn new spell (${unlearnedSpells.length} available)`}
                </button>
              )}

              {showLearnModal && (
                <div className="space-y-2 mt-2 pt-2 border-t border-border/30">
                  {unlearnedSpells.map((spell) => (
                    <button
                      key={spell.name}
                      onClick={() => handleLearnSpell(spell)}
                      className="w-full bg-secondary/20 hover:bg-secondary/40 border border-border/50 rounded-lg px-3 py-2 text-left transition group"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-serif text-foreground group-hover:text-primary transition-colors">{spell.name}</span>
                        {spell.damage !== '0' && (
                          <span className="text-xs font-mono text-muted-foreground">{spell.damage}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{spell.description}</p>
                    </button>
                  ))}
                </div>
              )}
            </>
        </div>
      )}
    </div>
  )
}
