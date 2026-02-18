'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CHARACTER_CLASSES } from '@/lib/game/constants'
import { saveCharacter } from '@/lib/store'
import { Character } from '@/types'

const classIcons: Record<string, string> = {
  Warrior: '⚔️',
  Mage: '🧙',
  Rogue: '🗡️',
  Cleric: '✨',
}

export default function CreateCharacterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !selectedClass) return

    setError('')

    try {
      const classStats = CHARACTER_CLASSES[selectedClass]
      const character: Character = {
        id: crypto.randomUUID(),
        name: name.trim(),
        class: selectedClass as Character['class'],
        level: 1,
        xp: 0,
        max_hp: classStats.maxHp,
        current_hp: classStats.maxHp,
        stats: {
          strength: 10 + (selectedClass === 'Warrior' ? 4 : 0),
          dexterity: 10 + (selectedClass === 'Rogue' ? 4 : 0),
          constitution: 10 + (selectedClass === 'Cleric' ? 2 : 0),
          intelligence: 10 + (selectedClass === 'Mage' ? 4 : 0),
          wisdom: 10 + (selectedClass === 'Cleric' ? 2 : 0),
          charisma: 10,
        },
        created_at: new Date().toISOString(),
      }

      saveCharacter(character)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create character')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-2xl border border-slate-700">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-amber-400">Create Your Hero</h1>
          <p className="text-gray-400 mt-2">Choose wisely, adventurer</p>
        </div>

        {error && (
          <div className="bg-red-900/50 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Character Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Character Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={30}
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
              placeholder="Enter a heroic name..."
            />
          </div>

          {/* Class Selection */}
          <div>
            <label className="block text-sm text-gray-300 mb-3">Choose Your Class</label>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(CHARACTER_CLASSES).map(([className, stats]) => (
                <button
                  key={className}
                  type="button"
                  onClick={() => setSelectedClass(className)}
                  className={`p-4 rounded-xl border-2 text-left transition ${
                    selectedClass === className
                      ? 'border-amber-500 bg-amber-900/30'
                      : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{classIcons[className]}</span>
                    <h3 className="text-lg font-bold text-white">{className}</h3>
                  </div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <p>❤️ HP: {stats.maxHp}</p>
                    <p>⚔️ ATK: +{stats.attack} | 🛡️ DEF: +{stats.defense}</p>
                    <p className="text-amber-400/80">
                      Abilities: {stats.abilities.join(', ')}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected class preview */}
          {selectedClass && (
            <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-amber-400 mb-2">
                {classIcons[selectedClass]} {selectedClass} Preview
              </h4>
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="bg-slate-800 rounded p-2">
                  <p className="text-gray-400">HP</p>
                  <p className="text-lg font-bold text-green-400">
                    {CHARACTER_CLASSES[selectedClass].maxHp}
                  </p>
                </div>
                <div className="bg-slate-800 rounded p-2">
                  <p className="text-gray-400">Attack</p>
                  <p className="text-lg font-bold text-red-400">
                    +{CHARACTER_CLASSES[selectedClass].attack}
                  </p>
                </div>
                <div className="bg-slate-800 rounded p-2">
                  <p className="text-gray-400">Defense</p>
                  <p className="text-lg font-bold text-blue-400">
                    +{CHARACTER_CLASSES[selectedClass].defense}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !selectedClass}
              className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-600 text-white py-3 rounded-lg font-semibold transition"
            >
              Create Character
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
