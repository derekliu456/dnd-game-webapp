'use client'

import { useState } from 'react'

interface PlayerInputProps {
  onSubmit: (action: string) => Promise<void>
  disabled?: boolean
  sessionId: string
}

export default function PlayerInput({ onSubmit, disabled = false, sessionId }: PlayerInputProps) {
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    try {
      await onSubmit(input)
      setInput('')
    } catch (error) {
      console.error('Failed to submit action:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-slate-700 p-4 bg-slate-900">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="What do you do?"
          disabled={disabled || isLoading}
          className="flex-1 bg-slate-800 border border-slate-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
        <button
          type="submit"
          disabled={disabled || isLoading || !input.trim()}
          className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white px-4 py-2 rounded font-semibold transition"
        >
          {isLoading ? 'Thinking...' : 'Act'}
        </button>
      </div>
    </form>
  )
}
