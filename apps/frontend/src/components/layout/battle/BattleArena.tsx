"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Character } from "@/lib/CharacterData"
import { Home, RotateCcw } from "lucide-react"
import { calculateDamage, calculateHitChance } from "@/lib/BattleLogic"
import AnimatedSprite from "@/components/layout/battle/AnimatedSprite"

interface BattleArenaProps {
  player1: Character
  player2: Character
  onReset: () => void
}

interface BattleState {
  player1Hp: number
  player2Hp: number
  player1Mana: number
  player2Mana: number
  currentTurn: "player1" | "player2"
  battleLog: string[]
  winner: "player1" | "player2" | null
  isAnimating: boolean
  lastDamage: { player1: number; player2: number }
  showDamage: { player1: boolean; player2: boolean }
  player1Animation: "idle" | "attack" | "hit"
  player2Animation: "idle" | "attack" | "hit"
}

export default function BattleArena({ player1, player2, onReset }: BattleArenaProps) {
  const [battleState, setBattleState] = useState<BattleState>({
    player1Hp: player1.maxHp,
    player2Hp: player2.maxHp,
    player1Mana: player1.maxMana,
    player2Mana: player2.maxMana,
    currentTurn: "player1",
    battleLog: ["A batalha começou!"],
    winner: null,
    isAnimating: false,
    lastDamage: { player1: 0, player2: 0 },
    showDamage: { player1: false, player2: false },
    player1Animation: "idle",
    player2Animation: "idle",
  })

  useEffect(() => {
    if (battleState.winner || battleState.isAnimating) return

    const timer = setTimeout(() => {
      executeTurn()
    }, 2000)

    return () => clearTimeout(timer)
  }, [battleState.currentTurn, battleState.winner, battleState.isAnimating])

  const executeTurn = () => {
    const attacker = battleState.currentTurn === "player1" ? player1 : player2
    const defender = battleState.currentTurn === "player1" ? player2 : player1
    const attackerState =
      battleState.currentTurn === "player1"
        ? { hp: battleState.player1Hp, mana: battleState.player1Mana }
        : { hp: battleState.player2Hp, mana: battleState.player2Mana }

    const useMagic = attackerState.mana >= 20 && attacker.magicAttack > attacker.attack
    const manaCost = useMagic ? 20 : 0

    const didHit = calculateHitChance(attacker, defender)
    const damage = didHit ? calculateDamage(attacker, defender, useMagic) : 0

    setBattleState((prev) => ({
      ...prev,
      player1Animation: prev.currentTurn === "player1" ? "attack" : prev.player1Animation,
      player2Animation: prev.currentTurn === "player2" ? "attack" : prev.player2Animation,
      isAnimating: true,
    }))

    setTimeout(() => {
      setBattleState((prev) => {
        const isPlayer1Attacker = prev.currentTurn === "player1"
        const newDefenderHp = isPlayer1Attacker
          ? Math.max(0, prev.player2Hp - damage)
          : Math.max(0, prev.player1Hp - damage)

        const newAttackerMana = isPlayer1Attacker ? prev.player1Mana - manaCost : prev.player2Mana - manaCost

        const attackType = useMagic ? "mágico" : "físico"
        const newLog = didHit
          ? [`${attacker.nickName} usou ataque ${attackType} e causou ${damage} de dano!`, ...prev.battleLog]
          : [`${attacker.nickName} atacou mas ${defender.nickName} desviou! MISS!`, ...prev.battleLog]

        const winner = newDefenderHp === 0 ? (isPlayer1Attacker ? "player1" : "player2") : null

        if (winner) {
          newLog.unshift(`${isPlayer1Attacker ? player1.nickName : player2.nickName} venceu a batalha!`)
        }

        return {
          ...prev,
          player1Hp: isPlayer1Attacker ? prev.player1Hp : newDefenderHp,
          player2Hp: isPlayer1Attacker ? newDefenderHp : prev.player2Hp,
          player1Mana: isPlayer1Attacker ? newAttackerMana : prev.player1Mana,
          player2Mana: isPlayer1Attacker ? prev.player2Mana : newAttackerMana,
          battleLog: newLog.slice(0, 8),
          winner,
          currentTurn: winner ? prev.currentTurn : isPlayer1Attacker ? "player2" : "player1",
          lastDamage: isPlayer1Attacker ? { player1: 0, player2: damage } : { player1: damage, player2: 0 },
          showDamage: isPlayer1Attacker ? { player1: false, player2: true } : { player1: true, player2: false },
          player1Animation: isPlayer1Attacker ? "attack" : didHit ? "hit" : "idle",
          player2Animation: isPlayer1Attacker ? (didHit ? "hit" : "idle") : "attack",
        }
      })
    }, 500)

    setTimeout(() => {
      setBattleState((prev) => ({
        ...prev,
        isAnimating: false,
        showDamage: { player1: false, player2: false },
        player1Animation: "idle",
        player2Animation: "idle",
      }))
    }, 1200)
  }

  const player1HpPercent = (battleState.player1Hp / player1.maxHp) * 100
  const player2HpPercent = (battleState.player2Hp / player2.maxHp) * 100
  const player1ManaPercent = (battleState.player1Mana / player1.maxMana) * 100
  const player2ManaPercent = (battleState.player2Mana / player2.maxMana) * 100

  return (
    <div className="min-h-screen flex flex-col p-4 relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/30 via-purple-900/20 to-transparent" />

        <svg className="absolute bottom-0 w-full h-64 opacity-20" viewBox="0 0 1000 300" preserveAspectRatio="none">
          <path d="M0,300 L0,200 L200,100 L400,150 L600,80 L800,120 L1000,100 L1000,300 Z" fill="#1e293b" />
          <path d="M0,300 L0,220 L150,140 L350,180 L550,120 L750,160 L1000,140 L1000,300 Z" fill="#0f172a" />
        </svg>

        <div className="absolute top-10 left-10 w-32 h-16 bg-slate-700/20 rounded-full blur-xl animate-float" />
        <div
          className="absolute top-20 right-20 w-40 h-20 bg-slate-600/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-32 left-1/3 w-36 h-18 bg-slate-700/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        />

        <div className="absolute bottom-0 left-0 right-0 h-48">
          <div className="absolute inset-0 bg-gradient-to-t from-green-950/40 via-green-950/30 to-transparent" />
          <svg className="absolute bottom-0 w-full h-24" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <rect x="0" y="80" width="1000" height="20" fill="#166534" opacity="0.3" />
            {[...Array(50)].map((_, i) => (
              <rect key={i} x={i * 20} y="75" width="2" height="8" fill="#15803d" opacity="0.4" />
            ))}
          </svg>
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-amber-700/30 to-transparent" />
        </div>

        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-400/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60 + 10}%`,
              animationDuration: `${3 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl w-full mx-auto space-y-6 flex-1 flex flex-col relative z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-5xl font-bold text-primary font-mono drop-shadow-lg">BATALHA ÉPICA</h1>
          <Button variant="outline" size="sm" onClick={onReset} className="font-mono bg-background/80 backdrop-blur">
            <Home className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        <div className="flex-1 flex flex-col justify-center relative">
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{player1.image}</span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm font-mono mb-1">
                    <span className="font-bold">{player1.nickName}</span>
                    <span className="text-red-500">
                      HP: {battleState.player1Hp}/{player1.maxHp}
                    </span>
                  </div>
                  <div className="h-4 bg-background/50 rounded-full overflow-hidden border-2 border-foreground/20">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500"
                      style={{ width: `${player1HpPercent}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 pl-10">
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-blue-400">
                      MANA: {battleState.player1Mana}/{player1.maxMana}
                    </span>
                  </div>
                  <div className="h-2 bg-background/50 rounded-full overflow-hidden border border-foreground/20">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-500"
                      style={{ width: `${player1ManaPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="flex justify-between text-sm font-mono mb-1">
                    <span className="text-red-500">
                      HP: {battleState.player2Hp}/{player2.maxHp}
                    </span>
                    <span className="font-bold">{player2.nickName}</span>
                  </div>
                  <div className="h-4 bg-background/50 rounded-full overflow-hidden border-2 border-foreground/20">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all duration-500"
                      style={{ width: `${player2HpPercent}%` }}
                    />
                  </div>
                </div>
                <span className="text-2xl">{player2.image}</span>
              </div>
              <div className="flex items-center gap-2 pr-10">
                <div className="flex-1">
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-blue-400">
                      MANA: {battleState.player2Mana}/{player2.maxMana}
                    </span>
                  </div>
                  <div className="h-2 bg-background/50 rounded-full overflow-hidden border border-foreground/20">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                      style={{ width: `${player2ManaPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex items-end justify-between px-8 py-16 min-h-[500px]">
            <div
              className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] h-8 bg-gradient-to-b from-stone-600/40 to-stone-800/40 rounded-t-lg border-t-2 border-stone-500/30"
              style={{
                boxShadow: "0 10px 40px rgba(0,0,0,0.5), inset 0 2px 4px rgba(255,255,255,0.1)",
              }}
            />
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-[90%] h-2 bg-stone-900/50" />

            <div className="absolute bottom-20 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

            <div className="relative flex-1 flex justify-center items-end">
              <div
                className={`relative transition-all duration-300 ${
                  battleState.currentTurn === "player1" && !battleState.winner
                    ? "scale-110 brightness-110"
                    : "scale-100"
                } ${battleState.showDamage.player1 ? "animate-shake" : ""}`}
              >
                <AnimatedSprite
                  characterClass={player1.name}
                  animation={battleState.player1Animation}
                  position="left"
                  isLoser={battleState.winner === "player2"}
                />
                {battleState.showDamage.player1 && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 text-3xl font-bold animate-float-up drop-shadow-lg">
                    {battleState.lastDamage.player1 === 0 ? (
                      <span className="text-gray-400">MISS!</span>
                    ) : (
                      <span className="text-red-500">-{battleState.lastDamage.player1}</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="text-6xl font-bold text-primary/30 font-mono drop-shadow-2xl">VS</div>
            </div>

            <div className="relative flex-1 flex justify-center items-end">
              <div
                className={`relative transition-all duration-300 ${
                  battleState.currentTurn === "player2" && !battleState.winner
                    ? "scale-110 brightness-110"
                    : "scale-100"
                } ${battleState.showDamage.player2 ? "animate-shake" : ""}`}
              >
                <AnimatedSprite
                  characterClass={player2.name}
                  animation={battleState.player2Animation}
                  position="right"
                  isLoser={battleState.winner === "player1"}
                />
                {battleState.showDamage.player2 && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 text-3xl font-bold animate-float-up drop-shadow-lg">
                    {battleState.lastDamage.player2 === 0 ? (
                      <span className="text-gray-400">MISS!</span>
                    ) : (
                      <span className="text-red-500">-{battleState.lastDamage.player2}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <Card className="p-4 bg-background/80 backdrop-blur border-2 border-primary/30">
          <h3 className="text-lg font-bold mb-2 font-mono text-primary">LOG DE BATALHA</h3>
          <div className="space-y-1 max-h-24 overflow-y-auto">
            {battleState.battleLog.map((log, index) => (
              <p key={index} className="text-xs font-mono text-muted-foreground animate-in fade-in slide-in-from-top-2">
                {log}
              </p>
            ))}
          </div>
        </Card>

        {battleState.winner && (
          <div className="fixed inset-0 bg-background/95 flex items-center justify-center z-50 animate-in fade-in backdrop-blur">
            <Card className="p-12 text-center space-y-6 border-4 border-primary max-w-md mx-4 animate-in zoom-in">
              <div className="text-8xl animate-bounce">
                {battleState.winner === "player1" ? player1.image : player2.image}
              </div>
              <div>
                <h2 className="text-5xl font-bold text-primary font-mono mb-2 animate-pulse">VITÓRIA!</h2>
                <p className="text-3xl font-mono font-bold">
                  {battleState.winner === "player1" ? player1.nickName : player2.nickName}
                </p>
                <p className="text-muted-foreground mt-2 text-lg">venceu a batalha épica!</p>
              </div>
              <div className="flex gap-4 justify-center">
                <Button size="lg" onClick={onReset} className="font-mono bg-primary">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Nova Batalha
                </Button>
                <Button size="lg" variant="outline" onClick={onReset} className="font-mono bg-transparent">
                  <Home className="h-4 w-4 mr-2" />
                  Menu
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
