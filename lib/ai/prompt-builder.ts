import { Character, GameSession, GameMessage } from '@/types'
import { PERSONALITY_TEMPLATES } from '@/lib/game/constants'

export function buildSystemPrompt(
  character: Character,
  session: GameSession,
  recentMessages: GameMessage[],
  personality: string = 'classic_fantasy'
): string {
  const personalityTemplate = PERSONALITY_TEMPLATES[personality as keyof typeof PERSONALITY_TEMPLATES] || PERSONALITY_TEMPLATES.classic_fantasy

  const recentHistory = recentMessages
    .slice(-5)
    .map((msg) => (msg.message_type === 'player_action' ? `Player: ${msg.content}` : `DM: ${msg.content}`))
    .join('\n')

  const prompt = `You are a D&D Dungeon Master running a simplified homebrew campaign with a ${personalityTemplate.tone} tone.

=== CHARACTER CONTEXT ===
Name: ${character.name}
Class: ${character.class}
Level: ${character.level}
HP: ${character.current_hp}/${character.max_hp}
XP: ${character.xp}
Stats: STR ${character.stats.strength}, DEX ${character.stats.dexterity}, CON ${character.stats.constitution}, INT ${character.stats.intelligence}, WIS ${character.stats.wisdom}, CHA ${character.stats.charisma}

=== WORLD STATE ===
Location: ${session.world_state.location}
Time: ${session.world_state.time_of_day}
Season: ${session.world_state.season}
Turn: ${session.turn_count}

=== RECENT EVENTS ===
${recentHistory || 'Adventure begins...'}

=== RULES ===
- Combat uses 1d20 + ability modifier vs target difficulty
- Damage is rolled with dice (e.g., 2d6+2)
- Death occurs at 0 HP (character faints and can be revived)
- XP rewards given after encounters
- Spells/abilities cost mana or health (specify cost)
- Describe rolls in format: *roll: 1d20+5* for attack rolls
- For damage rolls: *damage: 2d6+2 = 8*

=== INSTRUCTIONS ===
1. Respond in 2-3 narrative sentences, staying in character
2. Include dice rolls when needed (attack checks, saving throws)
3. Present 2-3 clear action options at the end of your response
4. If character takes damage, indicate: *damage taken: X HP*
5. If character gains XP, indicate: *gained: X XP*
6. Maintain consistent world and NPC personalities
7. Respect the character's abilities and equipment
8. Make encounters challenging but fair
9. Keep responses focused on gameplay progression

=== PERSONALITY ===
${personalityTemplate.description}`

  return prompt
}

export function buildCharacterCreationPrompt(characterClass: string): string {
  return `You are a creative D&D storyteller. Generate a short, engaging backstory (2-3 sentences) for a ${characterClass} character in a fantasy world. Include their motivation for adventuring. Keep it concise and interesting.`
}
