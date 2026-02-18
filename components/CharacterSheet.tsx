'use client'

import { Character } from '@/types'
import { Heart, Zap, Shield, Skull, Crown, Star, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CharacterSheetProps {
  character: Character | null
  className?: string
}

export default function CharacterSheet({ character, className }: CharacterSheetProps) {
  if (!character) {
    return (
      <div className={cn("h-full flex items-center justify-center p-8 text-muted-foreground animate-pulse", className)}>
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4" />
          <p>Summoning Hero...</p>
        </div>
      </div>
    )
  }

  const hpPercent = (character.current_hp / character.max_hp) * 100

  return (
    <div className={cn("bg-card text-card-foreground p-6 rounded-xl border shadow-lg h-full overflow-y-auto w-full max-w-md mx-auto relative", className)}>
      
      {/* Header / Avatar Area */}
      <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border/50">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center border-2 border-primary/30 shadow-inner">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-1 border border-border">
            <div className="bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              {character.level}
            </div>
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold font-serif bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            {character.name}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Crown className="w-3 h-3" />
            {character.class}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Vitals Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-end mb-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Heart className="w-3 h-3 text-red-500" /> Health
            </label>
            <span className="text-sm font-bold tabular-nums">
              {character.current_hp} <span className="text-muted-foreground">/ {character.max_hp}</span>
            </span>
          </div>
          
          <div className="h-4 bg-secondary/50 rounded-full overflow-hidden border border-border/50 relative shadow-inner">
             {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('/stripes.svg')] bg-repeat-x" />
            
            <div
              className={cn(
                "h-full transition-all duration-500 ease-out flex items-center justify-end pr-1 relative",
                hpPercent > 50 ? "bg-gradient-to-r from-green-600 to-green-500" :
                hpPercent > 25 ? "bg-gradient-to-r from-yellow-600 to-yellow-500" :
                "bg-gradient-to-r from-red-600 to-red-500"
              )}
              style={{ width: `${Math.max(0, hpPercent)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="bg-secondary/20 p-4 rounded-xl border border-border/50 backdrop-blur-sm">
          <h4 className="text-xs font-semibold uppercase text-muted-foreground mb-3 flex items-center gap-2">
            <Shield className="w-3 h-3" /> Attributes
          </h4>
          
          <div className="grid grid-cols-3 gap-3">
             <AttributeBox label="STR" value={character.stats.strength} color="text-red-400" />
             <AttributeBox label="DEX" value={character.stats.dexterity} color="text-green-400" />
             <AttributeBox label="CON" value={character.stats.constitution} color="text-amber-400" />
             <AttributeBox label="INT" value={character.stats.intelligence} color="text-blue-400" />
             <AttributeBox label="WIS" value={character.stats.wisdom} color="text-purple-400" />
             <AttributeBox label="CHA" value={character.stats.charisma} color="text-pink-400" />
          </div>
        </div>
        
        {/* XP Progress (Mini) */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground bg-secondary/30 p-2 rounded-lg">
          <Zap className="w-3 h-3 text-yellow-500" />
          <span className="flex-1">Experience</span>
          <span className="font-mono text-foreground">{character.xp} XP</span>
        </div>

      </div>
    </div>
  )
}

function AttributeBox({ label, value, color }: { label: string, value: number, color?: string }) {
  return (
    <div className="flex flex-col items-center bg-background/50 p-2 rounded-lg border border-border/30 hover:border-primary/30 transition-colors text-center">
      <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wide block mb-1">{label}</span>
      <span className={cn("text-lg font-bold font-serif leading-none", color)}>
        {value}
      </span>
    </div>
  )
}
