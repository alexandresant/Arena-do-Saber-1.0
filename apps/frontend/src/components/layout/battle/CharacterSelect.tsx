"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Character } from "@/lib/CharacterData"
import { useCharacters } from "@/lib/hooks/useCharacters"
import { Shield, Swords, Zap, Heart, Droplet, Target } from "lucide-react"

interface CharacterSelectProps {
  selectedCharacter: Character | null
  onSelectCharacter: (character: Character) => void
  disabled?: string
}

export default function CharacterSelect({
  selectedCharacter,
  onSelectCharacter,
  disabled,
}: CharacterSelectProps) {

  const { characters, isLoading } = useCharacters()

  if (isLoading) {
    return <div className="text-muted-foreground">Carregando personagens...</div>
  }

  return (
    <div className="space-y-4">
      {characters.map((character) => {
        const isSelected = selectedCharacter?.id === character.id
        const isDisabled = disabled === character.id

        return (
          <Card
            key={character.id}
            className={`p-4 cursor-pointer transition-all border-2 ${
              isSelected
                ? "border-primary bg-primary/10 scale-105"
                : isDisabled
                ? "border-muted opacity-50 cursor-not-allowed"
                : "border-border hover:border-primary/50 hover:bg-card/80"
            }`}
            onClick={() => !isDisabled && onSelectCharacter(character)}
          >
            <div className="flex items-start gap-4">
              <div className="text-6xl flex-shrink-0">{character.image}</div>

              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-xl font-bold font-mono">
                    {character.nickName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {character.name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Stat icon={<Heart className="h-3 w-3 text-destructive" />} label="HP" value={character.maxHp} />
                  <Stat icon={<Droplet className="h-3 w-3 text-accent" />} label="Mana" value={character.maxMana} />
                  <Stat icon={<Swords className="h-3 w-3 text-primary" />} label="Atq. Fís" value={character.attack} />
                  <Stat icon={<Zap className="h-3 w-3 text-secondary" />} label="Atq. Mág" value={character.magicAttack} />
                  <Stat icon={<Shield className="h-3 w-3 text-chart-3" />} label="Defesa" value={character.defense} />
                  <Stat icon={<Target className="h-3 w-3 text-chart-4" />} label="Destreza" value={character.dexterity} />
                </div>
              </div>
            </div>

            {isSelected && (
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-4 font-mono bg-transparent"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectCharacter(null as any)
                }}
              >
                Desselecionar
              </Button>
            )}
          </Card>
        )
      })}
    </div>
  )
}

function Stat({ icon, label, value }: any) {
  return (
    <div className="flex items-center gap-1">
      {icon}
      <span className="font-mono">
        {label}: {value}
      </span>
    </div>
  )
}
