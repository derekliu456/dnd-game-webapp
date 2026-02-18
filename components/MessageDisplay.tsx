'use client'

import { GameMessage } from '@/types'
import { useEffect, useRef } from 'react'

interface MessageDisplayProps {
  messages: GameMessage[]
}

export default function MessageDisplay({ messages }: MessageDisplayProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-900 to-slate-800 p-4 space-y-3">
      {messages.length === 0 ? (
        <div className="text-center text-gray-400 mt-8">
          <p className="text-lg">Your adventure awaits...</p>
          <p className="text-sm mt-2">What is your first action?</p>
        </div>
      ) : (
        messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg ${
              msg.message_type === 'player_action'
                ? 'bg-blue-900/50 text-blue-100 ml-auto max-w-xs'
                : 'bg-amber-900/50 text-amber-50 mr-auto max-w-2xl'
            }`}
          >
            <p className="text-xs font-semibold mb-1 opacity-75">
              {msg.message_type === 'player_action' ? 'You' : 'Dungeon Master'}
            </p>
            <p className="text-sm leading-relaxed">{msg.content}</p>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}
