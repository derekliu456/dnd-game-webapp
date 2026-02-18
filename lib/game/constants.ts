interface ClassStats {
  class: string
  maxHp: number
  attack: number
  defense: number
  abilities: string[]
}

export const CHARACTER_CLASSES: Record<string, ClassStats> = {
  Warrior: {
    class: 'Warrior',
    maxHp: 30,
    attack: 3,
    defense: 2,
    abilities: ['Power Attack', 'Shield Bash', 'Parry'],
  },
  Mage: {
    class: 'Mage',
    maxHp: 15,
    attack: 0,
    defense: 0,
    abilities: ['Fireball', 'Ice Storm', 'Teleport'],
  },
  Rogue: {
    class: 'Rogue',
    maxHp: 20,
    attack: 2,
    defense: 1,
    abilities: ['Backstab', 'Dodge', 'Pickpocket'],
  },
  Cleric: {
    class: 'Cleric',
    maxHp: 25,
    attack: 1,
    defense: 2,
    abilities: ['Heal', 'Smite', 'Blessing'],
  },
}

export const XP_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 100,
  3: 250,
  4: 450,
  5: 700,
  6: 1000,
  7: 1350,
  8: 1750,
  9: 2200,
  10: 2700,
}

export const PERSONALITY_TEMPLATES = {
  classic_fantasy: {
    name: 'Classic Fantasy',
    description: 'Medieval, serious, traditional fantasy setting',
    tone: 'formal and dramatic',
  },
  humorous: {
    name: 'Humorous',
    description: 'Silly, comedic encounters, funny NPCs',
    tone: 'playful and comedic',
  },
  dark_fantasy: {
    name: 'Dark Fantasy',
    description: 'Grim, dangerous world with high stakes',
    tone: 'dark and dangerous',
  },
}

// Default spells available to learn
export const AVAILABLE_SPELLS = {
  Warrior: [
    { name: 'Power Attack', damage: '2d6+2', cost: 10, description: 'A devastating melee attack' },
    { name: 'Shield Bash', damage: '1d8+1', cost: 5, description: 'Bash with shield for crowd control' },
    { name: 'Whirlwind', damage: '2d6', cost: 15, description: 'Attack all enemies around you' },
  ],
  Mage: [
    { name: 'Fireball', damage: '3d6', cost: 20, description: 'Hurl a ball of flames' },
    { name: 'Ice Storm', damage: '2d8', cost: 25, description: 'Freeze enemies in ice' },
    { name: 'Teleport', damage: '0', cost: 10, description: 'Escape to safety' },
  ],
  Rogue: [
    { name: 'Backstab', damage: '2d8+3', cost: 10, description: 'Sneak attack from shadows' },
    { name: 'Dodge', damage: '0', cost: 5, description: 'Avoid incoming attacks' },
    { name: 'Poison Blade', damage: '1d6+3', cost: 15, description: 'Coat weapon with poison' },
  ],
  Cleric: [
    { name: 'Heal', damage: '-3d6', cost: 15, description: 'Restore health to self or ally' },
    { name: 'Smite', damage: '2d6+2', cost: 20, description: 'Holy strike against evil' },
    { name: 'Blessing', damage: '0', cost: 10, description: 'Strengthen yourself or an ally' },
  ],
}

// Combat difficulty constants
export const COMBAT_DIFFICULTY = {
  EASY: 10,
  MODERATE: 12,
  HARD: 15,
  VERY_HARD: 18,
  DEADLY: 20,
}
