import { CharacterStats } from '@/types'

interface DiceRoll {
  roll: number
  calculation: string
}

export function rollD20(modifier: number = 0): DiceRoll {
  const roll = Math.floor(Math.random() * 20) + 1
  const total = roll + modifier
  return {
    roll,
    calculation: `1d20${modifier > 0 ? '+' : ''}${modifier} = ${total}`,
  }
}

export function parseDiceDamage(diceString: string): number {
  // Parse strings like "2d6+3" or "1d8"
  const match = diceString.match(/(\d+)d(\d+)(?:\+(\d+))?/)
  if (!match) return 0

  const numDice = parseInt(match[1])
  const diceSize = parseInt(match[2])
  const modifier = parseInt(match[3]) || 0

  let total = 0
  for (let i = 0; i < numDice; i++) {
    total += Math.floor(Math.random() * diceSize) + 1
  }

  return total + modifier
}

export function rollAttackDamage(diceString: string): { damage: number; calculation: string } {
  const match = diceString.match(/(\d+)d(\d+)(?:\+(\d+))?/)
  if (!match) return { damage: 0, calculation: 'No damage' }

  const numDice = parseInt(match[1])
  const diceSize = parseInt(match[2])
  const modifier = parseInt(match[3]) || 0

  let total = 0
  const rolls: number[] = []

  for (let i = 0; i < numDice; i++) {
    const roll = Math.floor(Math.random() * diceSize) + 1
    rolls.push(roll)
    total += roll
  }

  total += modifier

  const rollsStr = rolls.join('+')
  const calc = modifier > 0 ? `${rollsStr}+${modifier}` : rollsStr

  return {
    damage: total,
    calculation: `${diceString} = ${total}`,
  }
}

export function calculateModifier(stat: number): number {
  // Standard D&D modifier calculation
  return Math.floor((stat - 10) / 2)
}

export function calculateAttackBonus(baseAttack: number, stats: CharacterStats, dexterity = false): number {
  const modifier = dexterity
    ? calculateModifier(stats.dexterity)
    : calculateModifier(stats.strength)
  return baseAttack + modifier
}

export function predictDamage(diceString: string, rolls: number = 100): { min: number; max: number; average: number } {
  const match = diceString.match(/(\d+)d(\d+)(?:\+(\d+))?/)
  if (!match) return { min: 0, max: 0, average: 0 }

  const numDice = parseInt(match[1])
  const diceSize = parseInt(match[2])
  const modifier = parseInt(match[3]) || 0

  const min = numDice * 1 + modifier
  const max = numDice * diceSize + modifier
  const average = (numDice * ((diceSize + 1) / 2) + modifier)

  return { min, max, average }
}

export function isHit(attackRoll: number, targetAC: number): boolean {
  return attackRoll >= targetAC
}

export function resolveAttack(
  attackBonus: number,
  targetAC: number,
  damageFormula: string
): {
  hit: boolean
  attackRoll: number
  damage: number
  description: string
} {
  const attackResult = rollD20(attackBonus)
  const attackTotal = parseInt(attackResult.calculation.split(' = ')[1])
  const hit = isHit(attackTotal, targetAC)

  if (!hit) {
    return {
      hit: false,
      attackRoll: attackTotal,
      damage: 0,
      description: `Attack Roll: ${attackTotal} vs AC ${targetAC} - MISS!`,
    }
  }

  const dmg = rollAttackDamage(damageFormula)

  return {
    hit: true,
    attackRoll: attackTotal,
    damage: dmg.damage,
    description: `Attack Roll: ${attackTotal} vs AC ${targetAC} - HIT! Damage: ${dmg.damage}`,
  }
}

// Default enemy AC values
export function getEnemyAC(difficulty: string): number {
  const acMap: Record<string, number> = {
    'goblin': 12,
    'orc': 13,
    'troll': 15,
    'dragon': 18,
    'bandit': 11,
    'skeleton': 11,
    'undead': 14,
  }

  return acMap[difficulty.toLowerCase()] || 12
}
