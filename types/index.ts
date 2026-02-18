export interface Character {
  id: string
  name: string
  class: 'Warrior' | 'Mage' | 'Rogue' | 'Cleric'
  level: number
  xp: number
  max_hp: number
  current_hp: number
  stats: CharacterStats
  backstory?: string
  created_at: string
}

export interface CharacterStats {
  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
}

export interface GameSession {
  id: string
  character_id: string
  ai_provider: 'gemini' | 'glm'
  started_at: string
  last_action_at: string
  world_state: WorldState
  turn_count: number
  is_active: boolean
  created_at: string
}

export interface WorldState {
  location: string
  time_of_day: string
  season: string
  events: string[]
}

export interface GameMessage {
  id: string
  session_id: string
  turn_number: number
  message_type: 'player_action' | 'dm_response'
  content: string
  created_at: string
}

export interface InventoryItem {
  id: string
  character_id: string
  item_name: string
  item_type: 'weapon' | 'armor' | 'consumable' | 'quest_item'
  quantity: number
  properties?: Record<string, any>
  added_at: string
}

export interface Spell {
  id: string
  character_id: string
  spell_name: string
  slot_type: 'ability' | 'cantrip' | '1st_level' | '2nd_level'
  damage_dice?: string
  description: string
  learned_at: string
}
