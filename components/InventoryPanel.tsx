'use client'

import { useEffect, useState } from 'react'
import { InventoryItem } from '@/types'
import * as store from '@/lib/store'

interface InventoryPanelProps {
  characterId: string
}

const itemTypeIcons: Record<string, string> = {
  weapon: '⚔️',
  armor: '🛡️',
  consumable: '🧪',
  quest_item: '📜',
}

export default function InventoryPanel({ characterId }: InventoryPanelProps) {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen || !characterId) return
    setItems(store.getInventory(characterId))
  }, [characterId, isOpen])

  const handleDropItem = (itemId: string) => {
    store.removeInventoryItem(itemId)
    setItems((prev) => prev.filter((i) => i.id !== itemId))
  }

  return (
    <div className="border hover:border-primary/50 transition-colors rounded-lg bg-card/30 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex justify-between items-center text-left hover:bg-muted/50 transition"
      >
        <span className="text-sm font-semibold font-serif text-primary">🎒 Inventory</span>
        <span className="text-muted-foreground text-xs font-mono">
          {items.length} items {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 space-y-2 border-t border-border/50 pt-3">
          {items.length === 0 ? (
            <p className="text-xs text-muted-foreground italic text-center py-2">Empty — find loot on your adventure!</p>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-secondary/30 border border-border rounded-lg px-3 py-2 group hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-lg">{itemTypeIcons[item.item_type] || '📦'}</span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.item_name}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.item_type.replace('_', ' ')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {item.quantity > 1 && (
                    <span className="text-xs border border-border px-1.5 py-0.5 rounded bg-background text-muted-foreground font-mono">×{item.quantity}</span>
                  )}
                  <button
                    onClick={() => handleDropItem(item.id)}
                    className="text-destructive hover:bg-destructive/10 rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition text-xs"
                    title="Drop item"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
