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
  isCriticalHit: boolean // Nova propriedade para o efeito visual
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
    isCriticalHit: false,
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

    // Destruturação da nova lógica de acerto
    const { didHit, isCritical } = calculateHitChance(attacker, defender)
    const damage = didHit ? calculateDamage(attacker, defender, useMagic, isCritical) : 0

    const xpGained = Math.floor(defender.maxHp * 0.5 + Math.random() * 50);
    const coinsGained = Math.floor(defender.maxHp * 0.2 + Math.random() * 20);

    setBattleState((prev) => ({
      ...prev,
      player1Animation: prev.currentTurn === "player1" ? "attack" : prev.player1Animation,
      player2Animation: prev.currentTurn === "player2" ? "attack" : prev.player2Animation,
      isAnimating: true,
      isCriticalHit: isCritical, // Define se o ataque atual é crítico
    }))

    setTimeout(() => {
      setBattleState((prev) => {
        const isPlayer1Attacker = prev.currentTurn === "player1"
        const newDefenderHp = isPlayer1Attacker
          ? Math.max(0, prev.player2Hp - damage)
          : Math.max(0, prev.player1Hp - damage)

        const newAttackerMana = isPlayer1Attacker ? prev.player1Mana - manaCost : prev.player2Mana - manaCost

        const critText = isCritical ? " 🔥 CRÍTICO!" : ""
        const newLog = didHit
          ? [`${attacker.nickName} causou ${damage}${critText} de dano!`, ...prev.battleLog]
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
        isCriticalHit: false, // Reseta o estado de crítico
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
      {/* Background Dinâmico (Mantido igual) */}
      <div className="absolute inset-0 z-0 opacity-50">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-900/30 via-purple-900/20 to-transparent" />
      </div>

      <div className="max-w-7xl w-full mx-auto space-y-6 flex-1 flex flex-col relative z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-5xl font-bold text-primary font-mono drop-shadow-lg">ARENA DE BATALHA</h1>
          <Button variant="outline" size="sm" onClick={onReset} className="font-mono bg-background/80 backdrop-blur">
            <Home className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        <div className="flex-1 flex flex-col justify-center relative">
          {/* HUD de Status (Mantido igual) */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Player 1 Stats */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-mono text-red-500">
                <span className="font-bold text-white uppercase">{player1.nickName}</span>
                <span>HP: {battleState.player1Hp}/{player1.maxHp}</span>
              </div>
              <div className="h-4 bg-background/50 rounded-full border-2 border-foreground/20 overflow-hidden">
                <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${player1HpPercent}%` }} />
              </div>
            </div>
            {/* Player 2 Stats */}
            <div className="space-y-2 text-right">
              <div className="flex justify-between text-sm font-mono text-red-500">
                <span>HP: {battleState.player2Hp}/{player2.maxHp}</span>
                <span className="font-bold text-white uppercase">{player2.nickName}</span>
              </div>
              <div className="h-4 bg-background/50 rounded-full border-2 border-foreground/20 overflow-hidden">
                <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${player2HpPercent}%` }} />
              </div>
            </div>
          </div>

          <div className="relative flex items-end justify-between px-8 py-16 min-h-[500px]">
            {/* FUNDO E CHÃO MELHORADOS */}
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-black/40" />

              {/* O NOVO CHÃO (ESTILO IMAGEM) */}
              <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-gradient-to-b from-[#1a2e1a] to-[#050505]">
                {/* Linha de horizonte brilhante para dar contraste */}
                <div className="w-full h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent shadow-[0_0_15px_rgba(34,197,94,0.4)]" />

                {/* Grama/Textura pontilhada */}
                <div className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: 'radial-gradient(#22c55e 1px, transparent 1px)', size: '20px 20px' }} />
              </div>
            </div>
            {/* Personagem 1 */}
            <div className="relative flex-1 flex justify-center items-end">
              <div
                className={`relative transition-all duration-300 ${battleState.showDamage.player1 ? (battleState.isCriticalHit ? "animate-[super-shake_0.4s_infinite]" : "animate-shake") : ""
                  }`}
              >
                <AnimatedSprite
                  characterClass={player1.name}
                  animation={battleState.player1Animation}
                  position="left"
                  isLoser={battleState.winner === "player2"}
                  isCritical={battleState.isCriticalHit && battleState.currentTurn === "player1"} // Atacante brilha
                />
                {battleState.showDamage.player1 && (
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 font-bold animate-float-up drop-shadow-lg ${battleState.isCriticalHit ? "text-5xl text-yellow-400" : "text-3xl text-red-500"}`}>
                    {battleState.lastDamage.player1 === 0 ? "MISS!" : `-${battleState.lastDamage.player1}${battleState.isCriticalHit ? "!" : ""}`}
                  </div>
                )}
              </div>
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20">
              <div className="text-8xl font-black italic text-primary font-mono">VS</div>
            </div>

            {/* Personagem 2 */}
            <div className="relative flex-1 flex justify-center items-end">
              <div
                className={`relative transition-all duration-300 ${battleState.showDamage.player2 ? (battleState.isCriticalHit ? "animate-[super-shake_0.4s_infinite]" : "animate-shake") : ""
                  }`}
              >
                <AnimatedSprite
                  characterClass={player2.name}
                  animation={battleState.player2Animation}
                  position="right"
                  isLoser={battleState.winner === "player1"}
                  isCritical={battleState.isCriticalHit && battleState.currentTurn === "player2"} // Atacante brilha
                />
                {battleState.showDamage.player2 && (
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 font-bold animate-float-up drop-shadow-lg ${battleState.isCriticalHit ? "text-5xl text-yellow-400" : "text-3xl text-red-500"}`}>
                    {battleState.lastDamage.player2 === 0 ? "MISS!" : `-${battleState.lastDamage.player2}${battleState.isCriticalHit ? "!" : ""}`}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Log de Batalha */}
        <Card className="p-4 bg-slate-900/80 backdrop-blur border-2 border-primary/30">
          <h3 className="text-sm font-bold mb-2 font-mono text-primary uppercase tracking-tighter">Histórico de Combate</h3>
          <div className="space-y-1 max-h-28 overflow-y-auto">
            {battleState.battleLog.map((log, index) => (
              <p key={index} className={`text-xs font-mono animate-in fade-in slide-in-from-left-2 ${log.includes("CRÍTICO") ? "text-yellow-400 font-bold" : "text-slate-400"}`}>
                {`> ${log}`}
              </p>
            ))}
          </div>
        </Card>

        {/* MODAL DE VITÓRIA ESTILO IMAGEM */}
        {battleState.winner && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 animate-in fade-in">
            <Card className="p-8 w-full max-w-md bg-[#1e293b] border-2 border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.3)] text-center">
              <div className="space-y-6">
                <h2 className="text-5xl font-black text-purple-400 italic tracking-tighter drop-shadow-sm">
                  VITÓRIA!
                </h2>

                <p className="text-slate-300 font-mono">
                  {battleState.winner === "player1" ? player1.nickName : player2.nickName} dominou o campo!
                </p>

                {/* GRIDS DE RECOMPENSA (IGUAL A IMAGEM) */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900/50 p-4 rounded-xl border border-yellow-500/30 flex flex-col items-center gap-2">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-500 text-2xl">✨</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">XP Ganho</p>
                      <p className="text-xl font-mono text-yellow-500">+{Math.floor(player2.maxHp * 0.8)}</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-xl border border-amber-600/30 flex flex-col items-center gap-2">
                    <div className="w-10 h-10 bg-amber-600/20 rounded-lg flex items-center justify-center">
                      <span className="text-amber-500 text-2xl">💰</span>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Gold</p>
                      <p className="text-xl font-mono text-amber-500">+{Math.floor(player2.maxHp * 0.3)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button onClick={onReset} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold h-12 rounded-xl">
                    <RotateCcw className="mr-2 h-5 w-5" /> REVANCHE
                  </Button>
                  <Button onClick={onReset} variant="ghost" className="text-slate-400 hover:text-white">
                    Voltar para o Menu
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}