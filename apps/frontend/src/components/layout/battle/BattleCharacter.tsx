"use client"
import { Card } from "@/components/ui/card"
import type { Character } from "@/lib/CharacterData"
import { Heart, Droplet } from "lucide-react"
import AnimatedSprite from "./AnimatedSprite"

interface Props {
  character: Character; hp: number; mana: number; isActive: boolean;
  isWinner: boolean; isLoser: boolean; showDamage: boolean;
  damage: number; position: "left" | "right";
}

export default function BattleCharacter({ character, hp, mana, isActive, isWinner, isLoser, showDamage, damage, position }: Props) {
  const hpPercent = (hp / character.maxHp) * 100;
  const anim = showDamage ? "hit" : (isActive && !isWinner ? "attack" : "idle");

  return (
    <Card className={`p-6 w-80 transition-all ${isActive ? "ring-4 ring-primary scale-105" : "opacity-90"}`}>
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold">{character.nickName}</h3>
        <p className="text-xs text-muted-foreground">{character.name}</p>
      </div>

      <div className="relative h-48 flex items-center justify-center mb-6">
        <AnimatedSprite characterClass={character.name} animation={anim} position={position} isLoser={isLoser} />
        {showDamage && (
          <div className="absolute top-0 text-red-500 text-4xl font-bold animate-bounce">-{damage}</div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Heart className="text-red-500 h-4 w-4" />
          <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-red-500 transition-all duration-500" style={{ width: `${hpPercent}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Droplet className="text-blue-500 h-4 w-4" />
          <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${(mana/character.maxMana)*100}%` }} />
          </div>
        </div>
      </div>
    </Card>
  );
}