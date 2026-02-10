"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Character } from "@/lib/CharacterData"
import { characters, hydrateAll } from "@/lib/CharacterData"
import { Shield, Swords, Zap, Heart, Droplet, Target, Loader2 } from "lucide-react"
import { useEffect, useState, useCallback, useMemo } from "react"

interface CharacterSelectProps {
  selectedCharacter: Character | null
  onSelectCharacter: (character: Character | null) => void
  disabled?: string | number
}

export default function CharacterSelect({ selectedCharacter, onSelectCharacter, disabled }: CharacterSelectProps) {
  const [characterList, setCharacterList] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)

  // 1. Memorizamos a lista filtrada para evitar que o cálculo no return falhe por delay de prop
  const adversaries = useMemo(() => {
    return characterList.filter(c => String(c.id) !== String(disabled))
  }, [characterList, disabled])

  const sync = useCallback(() => {
    // Forçamos a criação de uma nova referência de array
    const data = [...characters]
    console.log("Sync executado. Itens na global:", data.length)
    setCharacterList(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    let isMounted = true

    // Ouvinte para atualizações externas
    const handleUpdate = () => {
      if (isMounted) sync()
    }

    window.addEventListener("characters:update", handleUpdate)
    
    async function init() {
      try {
        // Se já temos dados na global (conforme seus logs indicam), sync imediato
        if (characters.length > 0) {
          sync()
        }

        // Independente de ter dados, rodamos o hydrate para garantir atualização
        await hydrateAll()
        
        if (isMounted) {
          sync()
        }
      } catch (err) {
        console.error("Erro no init:", err)
        if (isMounted) setLoading(false)
      }
    }

    init()

    return () => {
      isMounted = false
      window.removeEventListener("characters:update", handleUpdate)
    }
  }, [sync])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-mono text-muted-foreground">Carregando classes...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Usamos a lista memorizada 'adversaries' para garantir consistência */}
      {adversaries.map((character) => {
        const isSelected = selectedCharacter?.id === character.id

        return (
          <Card
            key={character.id}
            className={`p-4 cursor-pointer transition-all border-2 ${
              isSelected
                ? "border-primary bg-primary/10 scale-105"
                : "border-border hover:border-primary/50 hover:bg-card/80"
            }`}
            onClick={() => onSelectCharacter(character)}
          >
            <div className="flex items-start gap-4">
              <div className="text-6xl flex-shrink-0 animate-float">{character.image}</div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-xl font-bold font-mono">{character.nickName}</h3>
                  <p className="text-sm text-muted-foreground">{character.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-destructive" />
                    <span className="font-mono">HP: {character.maxHp}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Droplet className="h-3 w-3 text-accent" />
                    <span className="font-mono">Mana: {character.maxMana}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Swords className="h-3 w-3 text-primary" />
                    <span className="font-mono">Atq. Fís: {character.attack}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-secondary" />
                    <span className="font-mono">Atq. Mág: {character.magicAttack}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3 text-chart-3" />
                    <span className="font-mono">Defesa: {character.defense}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3 text-chart-4" />
                    <span className="font-mono">Destreza: {character.dexterity}</span>
                  </div>
                </div>
              </div>
            </div>

            {isSelected && (
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-4 font-mono bg-transparent hover:bg-destructive/10 hover:text-destructive border-destructive/50"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectCharacter(null)
                }}
              >
                Remover Seleção
              </Button>
            )}
          </Card>
        )
      })}

      {adversaries.length === 0 && (
        <div className="p-8 border-2 border-dashed border-muted rounded-lg text-center">
          <p className="text-muted-foreground font-mono">Nenhum adversário disponível.</p>
          <p className="text-[10px] text-muted-foreground/50 mt-2">ID Logado: {disabled || 'null'}</p>
        </div>
      )}
    </div>
  )
}