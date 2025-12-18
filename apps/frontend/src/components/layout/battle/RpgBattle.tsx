"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import BattleArena from "@/components/layout/battle/BattleArena"
import type { Character, GameUser } from "@/lib/CharacterData"
import { characters, gameUsers } from "@/lib/CharacterData"
import { Swords, UserCircle, Trophy } from "lucide-react"

export default function RPGBattle() {
  const [player] = useState<Character>(characters[0])
  const [selectedUser, setSelectedUser] = useState<GameUser | null>(null)
  const [battleStarted, setBattleStarted] = useState(false)

  const handleStartBattle = () => {
    if (player && selectedUser) {
      setBattleStarted(true)
    }
  }

  const handleReset = () => {
    setSelectedUser(null)
    setBattleStarted(false)
  }

  if (battleStarted && player && selectedUser) {
    return <BattleArena player1={player} player2={selectedUser.character} onReset={handleReset} />
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <div className="max-w-7xl w-full space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-7xl font-bold text-primary pixel-pulse font-mono tracking-wider">
            {"ARENA RPG"}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-mono">
            {"Desafie outros jogadores para uma batalha épica!"}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6 bg-card border-2 border-primary/30">
            <div className="flex items-center justify-center gap-2 mb-6">
              <UserCircle className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold text-center text-primary font-mono">{"SEU PERSONAGEM"}</h2>
            </div>

            <Card className="p-6 bg-primary/5 border-2 border-primary">
              <div className="flex flex-col items-center gap-4">
                <div className="text-7xl float">{player.image}</div>

                <div className="text-center space-y-2 w-full">
                  <h3 className="text-2xl font-bold font-mono text-primary">{player.nickName}</h3>
                  <p className="text-lg text-muted-foreground font-mono">{player.name}</p>

                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm font-mono">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{"HP:"}</span>
                        <span className="font-bold">{player.maxHp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{"Mana:"}</span>
                        <span className="font-bold">{player.maxMana}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{"ATQ Físico:"}</span>
                        <span className="font-bold">{player.attack}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{"ATQ Mágico:"}</span>
                        <span className="font-bold">{player.magicAttack}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{"Defesa:"}</span>
                        <span className="font-bold">{player.defense}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">{"Destreza:"}</span>
                        <span className="font-bold">{player.dexterity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Card>

          <Card className="p-6 bg-card border-2 border-secondary/30">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Swords className="h-6 w-6 text-secondary" />
              <h2 className="text-2xl font-bold text-center text-secondary font-mono">{"DESAFIAR JOGADOR"}</h2>
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {gameUsers.map((user) => {
                const isSelected = selectedUser?.id === user.id

                return (
                  <Card
                    key={user.id}
                    className={`p-4 cursor-pointer transition-all border-2 ${
                      isSelected
                        ? "border-secondary bg-secondary/10 scale-105"
                        : "border-border hover:border-secondary/50 hover:bg-card/80"
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-5xl flex-shrink-0 float">{user.character.image}</div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold font-mono">{user.username}</h3>
                          <div className="flex items-center gap-1 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded font-mono">
                            <Trophy className="h-3 w-3" />
                            <span>
                              {"Nível "}
                              {user.level}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2 font-mono">
                          {user.character.nickName} {"- "}
                          {user.character.name}
                        </p>
                        <div className="grid grid-cols-3 gap-1 text-xs font-mono">
                          <span>
                            {"HP:"} {user.character.maxHp}
                          </span>
                          <span>
                            {"ATQ:"} {user.character.attack}
                          </span>
                          <span>
                            {"DEF:"} {user.character.defense}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex-shrink-0">
                          <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded font-mono text-xs font-bold">
                            {"SELECIONADO"}
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          </Card>
        </div>

        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleStartBattle}
            disabled={!selectedUser}
            className="text-xl px-12 py-6 font-bold font-mono bg-primary hover:bg-primary/90 disabled:opacity-50"
          >
            <Swords className="mr-2 h-6 w-6" />
            {"INICIAR BATALHA"}
          </Button>
        </div>
      </div>
    </div>
  )
}
