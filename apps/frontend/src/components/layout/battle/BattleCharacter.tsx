"use client"

import { Card } from "@/components/ui/card"
import type { Character } from "@/lib/CharacterData"
import { Heart, Droplet, Shield, Swords, Zap, Target } from "lucide-react"
import AnimatedSprite from "@/components/layout/battle/AnimatedSprite"

interface BattleCharacterProps {
  character: Character
  hp: number
  mana: number
  isActive: boolean
  isWinner: boolean
  isLoser: boolean
  showDamage: boolean
  damage: number
  position: "left" | "right"
}

export default function BattleCharacter({
  character,
  hp,
  mana,
  isActive,
  isWinner,
  isLoser,
  showDamage,
  damage,
  position,
}: BattleCharacterProps) {
  const hpPercentage = (hp / character.maxHp) * 100
  const manaPercentage = (mana / character.maxMana) * 100

  const animation = showDamage ? "hit" : isActive && !isWinner ? "attack" : "idle"

  return (
    <div className="flex flex-col gap-4">
      <Card
        className={`p-6 border-2 transition-all relative ${
          isActive
            ? "border-primary bg-primary/10 scale-105"
            : isWinner
              ? "border-chart-3 bg-chart-3/10"
              : isLoser
                ? "border-destructive/50 bg-destructive/5 opacity-60"
                : "border-border"
        } ${isActive && !isWinner && !isLoser ? "pixel-pulse" : ""}`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold font-mono">{character.nickName}</h2>
              <p className="text-sm text-muted-foreground">{character.name}</p>
            </div>
            {isActive && !isWinner && (
              <span className="text-xs font-mono text-primary bg-primary/20 px-3 py-1 rounded-full animate-pulse">
                TURNO
              </span>
            )}
            {isWinner && (
              <span className="text-xs font-mono text-chart-3 bg-chart-3/20 px-3 py-1 rounded-full">VENCEDOR</span>
            )}
          </div>

          <div className={`my-6 transition-transform ${showDamage ? "shake" : ""}`}>
            <AnimatedSprite
              characterClass={character.name}
              animation={animation}
              position={position}
              isLoser={isLoser}
            />
          </div>

          {showDamage && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-bold text-destructive damage-pop pointer-events-none z-10">
              -{damage}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-destructive" />
                  <span className="text-sm font-mono">HP</span>
                </div>
                <span className="text-sm font-mono">
                  {hp} / {character.maxHp}
                </span>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden border border-border">
                <div
                  className={`h-full transition-all duration-500 ${
                    hpPercentage > 50 ? "bg-chart-3" : hpPercentage > 25 ? "bg-primary" : "bg-destructive"
                  }`}
                  style={{ width: `${hpPercentage}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Droplet className="h-4 w-4 text-accent" />
                  <span className="text-sm font-mono">MANA</span>
                </div>
                <span className="text-sm font-mono">
                  {mana} / {character.maxMana}
                </span>
              </div>
              <div className="h-4 bg-muted rounded-full overflow-hidden border border-border">
                <div className="h-full bg-accent transition-all duration-500" style={{ width: `${manaPercentage}%` }} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm">
              <Swords className="h-4 w-4 text-primary" />
              <span className="font-mono">Fís: {character.attack}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="h-4 w-4 text-secondary" />
              <span className="font-mono">Mág: {character.magicAttack}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-chart-3" />
              <span className="font-mono">Def: {character.defense}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Target className="h-4 w-4 text-chart-4" />
              <span className="font-mono">Dex: {character.dexterity}</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
