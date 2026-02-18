import { Character, GameSession, GameMessage, InventoryItem, Spell } from '@/types'

const KEYS = {
  CHARACTERS: 'dnd_characters',
  SESSIONS: 'dnd_sessions',
  MESSAGES: 'dnd_messages',
  INVENTORY: 'dnd_inventory',
  SPELLS: 'dnd_spells',
}

function getItem<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function setItem<T>(key: string, items: T[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(items))
}

// --- Characters ---

export function getCharacters(): Character[] {
  return getItem<Character>(KEYS.CHARACTERS)
}

export function getCharacter(id: string): Character | undefined {
  return getCharacters().find((c) => c.id === id)
}

export function saveCharacter(character: Character): Character {
  const chars = getCharacters()
  const idx = chars.findIndex((c) => c.id === character.id)
  if (idx >= 0) {
    chars[idx] = character
  } else {
    chars.push(character)
  }
  setItem(KEYS.CHARACTERS, chars)
  return character
}

export function deleteCharacter(id: string): void {
  setItem(KEYS.CHARACTERS, getCharacters().filter((c) => c.id !== id))
  // Also delete related sessions, messages, inventory, spells
  const sessions = getSessions().filter((s) => s.character_id === id)
  sessions.forEach((s) => deleteSession(s.id))
  setItem(KEYS.INVENTORY, getItem<InventoryItem>(KEYS.INVENTORY).filter((i) => i.character_id !== id))
  setItem(KEYS.SPELLS, getItem<Spell>(KEYS.SPELLS).filter((s) => s.character_id !== id))
}

// --- Sessions ---

export function getSessions(): GameSession[] {
  return getItem<GameSession>(KEYS.SESSIONS)
}

export function getSession(id: string): GameSession | undefined {
  return getSessions().find((s) => s.id === id)
}

export function saveSession(session: GameSession): GameSession {
  const sessions = getSessions()
  const idx = sessions.findIndex((s) => s.id === session.id)
  if (idx >= 0) {
    sessions[idx] = session
  } else {
    sessions.push(session)
  }
  setItem(KEYS.SESSIONS, sessions)
  return session
}

export function deleteSession(id: string): void {
  setItem(KEYS.SESSIONS, getSessions().filter((s) => s.id !== id))
  setItem(KEYS.MESSAGES, getItem<GameMessage>(KEYS.MESSAGES).filter((m) => m.session_id !== id))
}

// --- Messages ---

export function getMessages(sessionId: string): GameMessage[] {
  return getItem<GameMessage>(KEYS.MESSAGES).filter((m) => m.session_id === sessionId)
}

export function getRecentMessages(sessionId: string, count: number): GameMessage[] {
  return getMessages(sessionId).slice(-count)
}

export function addMessage(message: GameMessage): void {
  const messages = getItem<GameMessage>(KEYS.MESSAGES)
  messages.push(message)
  setItem(KEYS.MESSAGES, messages)
}

// --- Inventory ---

export function getInventory(characterId: string): InventoryItem[] {
  return getItem<InventoryItem>(KEYS.INVENTORY).filter((i) => i.character_id === characterId)
}

export function addInventoryItem(item: InventoryItem): void {
  const items = getItem<InventoryItem>(KEYS.INVENTORY)
  items.push(item)
  setItem(KEYS.INVENTORY, items)
}

export function removeInventoryItem(itemId: string): void {
  setItem(KEYS.INVENTORY, getItem<InventoryItem>(KEYS.INVENTORY).filter((i) => i.id !== itemId))
}

// --- Spells ---

export function getSpells(characterId: string): Spell[] {
  return getItem<Spell>(KEYS.SPELLS).filter((s) => s.character_id === characterId)
}

export function addSpell(spell: Spell): void {
  const spells = getItem<Spell>(KEYS.SPELLS)
  spells.push(spell)
  setItem(KEYS.SPELLS, spells)
}

export function removeSpell(spellId: string): void {
  setItem(KEYS.SPELLS, getItem<Spell>(KEYS.SPELLS).filter((s) => s.id !== spellId))
}
