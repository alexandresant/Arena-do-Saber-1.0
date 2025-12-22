// BattleArena.tsx

"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Character } from "@/lib/CharacterData"
import { Home, RotateCcw, Sparkles, Coins } from "lucide-react"
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
  isCriticalHit: boolean
}

const determineFirstTurn = (p1: Character, p2: Character): "player1" | "player2" => {
  const p1Evasion = p1.dexterity || 0;
  const p2Evasion = p2.dexterity || 0;

  if (p1Evasion === p2Evasion) {
    return Math.random() > 0.5 ? "player1" : "player2";
  }
  return p1Evasion > p2Evasion ? "player1" : "player2";
};

export default function BattleArena({ player1, player2, onReset }: BattleArenaProps) {
  // Dentro do export default function BattleArena...
  const [battleState, setBattleState] = useState<BattleState>({
    player1Hp: player1.maxHp,
    player2Hp: player2.maxHp,
    player1Mana: player1.maxMana,
    player2Mana: player2.maxMana,
    // ALTERAÇÃO AQUI:
    currentTurn: determineFirstTurn(player1, player2),
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
    const timer = setTimeout(() => executeTurn(), 2000)
    return () => clearTimeout(timer)
  }, [battleState.currentTurn, battleState.winner, battleState.isAnimating])

  const executeTurn = () => {
    const isP1 = battleState.currentTurn === "player1";
    const attacker = isP1 ? player1 : player2;
    const defender = isP1 ? player2 : player1;
    const currentMana = isP1 ? battleState.player1Mana : battleState.player2Mana;

    // --- DETECÇÃO DE TIPO DE PERSONAGEM ---
    const isMagicUser = attacker.magicAttack > attacker.attack;

    // Guerreiros não gastam mana, Magos gastam 20.
    const MANA_COST = isMagicUser ? 20 : 0;

    // --- LÓGICA DE MEDITAÇÃO (APENAS PARA MAGOS) ---
    if (isMagicUser && currentMana < MANA_COST) {
      const manaRecovered = Math.floor(attacker.maxMana * 0.30);
      const newMana = Math.min(attacker.maxMana, currentMana + manaRecovered);

      setBattleState((prev) => ({
        ...prev,
        player1Mana: isP1 ? newMana : prev.player1Mana,
        player2Mana: !isP1 ? newMana : prev.player2Mana,
        battleLog: [`✨ ${attacker.nickName} focou sua energia e recuperou mana!`, ...prev.battleLog],
        currentTurn: isP1 ? "player2" : "player1",
        isAnimating: false
      }));
      return; // Encerra o turno aqui para o mago meditando
    }

    // --- LOGICA DE ATAQUE (PARA TODOS) ---
    const { didHit, isCritical } = calculateHitChance(attacker, defender);

    // O dano só leva em conta a mana se for um usuário de magia
    const damage = didHit ? calculateDamage(attacker, defender, currentMana, isCritical) : 0;

    // Inicia animação de ataque
    setBattleState(prev => ({
      ...prev,
      player1Animation: isP1 ? "attack" : prev.player1Animation,
      player2Animation: !isP1 ? "attack" : prev.player2Animation,
      isAnimating: true,
      isCriticalHit: isCritical
    }));

    // Aplica o resultado após o delay (500ms)
    setTimeout(() => {
      setBattleState((prev) => {
        const isP1Turn = prev.currentTurn === "player1";
        const newDefHp = Math.max(0, (isP1Turn ? prev.player2Hp : prev.player1Hp) - damage);

        // Só subtrai mana se for o custo definido (0 para guerreiros)
        const newAtkMana = Math.max(0, (isP1Turn ? prev.player1Mana : prev.player2Mana) - MANA_COST);

        const winner = newDefHp === 0 ? (isP1Turn ? "player1" : "player2") : null;

        return {
          ...prev,
          player1Hp: isP1Turn ? prev.player1Hp : newDefHp,
          player2Hp: isP1Turn ? newDefHp : prev.player2Hp,
          player1Mana: isP1Turn ? newAtkMana : prev.player1Mana,
          player2Mana: !isP1Turn ? newAtkMana : prev.player2Mana,
          battleLog: [
            didHit ? `${attacker.nickName} causou ${damage}${isCritical ? " 🔥" : ""}!` : `${attacker.nickName} errou!`,
            ...prev.battleLog
          ].slice(0, 8),
          winner,
          currentTurn: winner ? prev.currentTurn : (isP1Turn ? "player2" : "player1"),
          showDamage: isP1Turn ? { player1: false, player2: true } : { player1: true, player2: false },
          lastDamage: isP1Turn ? { player1: 0, player2: damage } : { player1: damage, player2: 0 },
          player1Animation: isP1Turn ? "attack" : (didHit ? "hit" : "idle"),
          player2Animation: !isP1Turn ? "attack" : (didHit ? "hit" : "idle"),
        };
      });
    }, 500);

    // Finaliza animação (1200ms)
    setTimeout(() => {
      setBattleState(prev => ({
        ...prev,
        isAnimating: false,
        showDamage: { player1: false, player2: false },
        player1Animation: "idle",
        player2Animation: "idle"
      }));
    }, 1200);
  };

  // Cálculos de Percentual
  const p1HpPerc = (battleState.player1Hp / player1.maxHp) * 100
  const p2HpPerc = (battleState.player2Hp / player2.maxHp) * 100
  const p1ManaPerc = (battleState.player1Mana / player1.maxMana) * 100
  const p2ManaPerc = (battleState.player2Mana / player2.maxMana) * 100

  return (
    <div className="min-h-screen flex flex-col p-4 relative overflow-hidden bg-[#0a0f1e]">
      {/* CENÁRIO (ESTILO IMAGEM GERADA) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-black/60" />

        {/* CHÃO VERDE MUSGO COM CONTRASTE */}
        <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-b from-[#1a2e1a] via-[#101a10] to-[#050505]">
          <div className="w-full h-1.5 bg-green-500/40 shadow-[0_0_20px_rgba(34,197,94,0.5)]" />
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4ade80 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto space-y-6 flex-1 flex flex-col relative z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            BATTLE <span className="text-primary">ARENA</span>
          </h1>
          <Button variant="outline" size="sm" onClick={onReset} className="bg-background/80 backdrop-blur border-primary/50">
            <Home className="h-4 w-4 mr-2" /> Voltar
          </Button>
        </div>

        {/* HUD DE STATUS (HP E MANA COM VALORES NUMÉRICOS) */}
        <div className="grid grid-cols-2 gap-8 mb-4">
          {/* Player 1 HUD */}
          <div className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="font-black text-white text-xl italic tracking-tighter">{player1.nickName}</span>
              <span className="text-red-400 font-mono text-xs font-bold">HP {battleState.player1Hp}/{player1.maxHp}</span>
            </div>
            {/* Barra de HP */}
            <div className="h-5 bg-black/60 rounded-sm border border-white/10 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] relative">
              <div
                className="h-full bg-gradient-to-r from-red-700 via-red-500 to-red-400 transition-all duration-500"
                style={{ width: `${p1HpPerc}%` }}
              />
              <div className="absolute inset-0 flex justify-center items-center text-[10px] font-black text-white drop-shadow-md">
                {Math.round(p1HpPerc)}%
              </div>
            </div>
            {/* Barra de Mana e Valor */}
            <div className="flex items-center gap-2">
              <div className="h-2.5 bg-black/60 rounded-sm border border-white/5 overflow-hidden flex-1 relative">
                <div
                  className="h-full bg-gradient-to-r from-blue-700 to-cyan-400 transition-all duration-500"
                  style={{ width: `${p1ManaPerc}%` }}
                />
              </div>
              <span className="text-blue-400 font-mono text-[10px] font-bold min-w-[60px] text-right">
                MP {battleState.player1Mana}
              </span>
            </div>
          </div>

          {/* Player 2 HUD */}
          <div className="space-y-2 text-right">
            <div className="flex justify-between items-end flex-row-reverse">
              <span className="font-black text-white text-xl italic tracking-tighter">{player2.nickName}</span>
              <span className="text-red-400 font-mono text-xs font-bold">HP {battleState.player2Hp}/{player2.maxHp}</span>
            </div>
            {/* Barra de HP */}
            <div className="h-5 bg-black/60 rounded-sm border border-white/10 overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] relative">
              <div
                className="h-full bg-gradient-to-l from-red-700 via-red-500 to-red-400 transition-all duration-500"
                style={{ width: `${p2HpPerc}%` }}
              />
              <div className="absolute inset-0 flex justify-center items-center text-[10px] font-black text-white drop-shadow-md">
                {Math.round(p2HpPerc)}%
              </div>
            </div>
            {/* Barra de Mana e Valor */}
            <div className="flex items-center gap-2 flex-row-reverse">
              <div className="h-2.5 bg-black/60 rounded-sm border border-white/5 overflow-hidden flex-1 relative">
                <div
                  className="h-full bg-gradient-to-l from-blue-700 to-cyan-400 transition-all duration-500"
                  style={{ width: `${p2ManaPerc}%` }}
                />
              </div>
              <span className="text-blue-400 font-mono text-[10px] font-bold min-w-[60px] text-left">
                MP {battleState.player2Mana}
              </span>
            </div>
          </div>
        </div>
        {/* ARENA DE PERSONAGENS */}
        <div className="relative flex-1 flex items-end justify-between px-12 py-20">

          {/* PLAYER 1 CONTAINER - REMOVI A ANIMAÇÃO DA DIV PAI */}
          <div className="relative">
            {/* Div apenas para o Sprite que treme */}
            <div className={battleState.showDamage.player1 ? "animate-super-shake" : ""}>
              <AnimatedSprite
                characterClass={player1.name}
                animation={battleState.player1Animation}
                position="left"
                isLoser={battleState.winner === "player2"}
                isCritical={battleState.isCriticalHit && battleState.currentTurn === "player1"}
              />
            </div>

            {battleState.showDamage.player1 && (
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 z-[100] pointer-events-none animate-damage-rpg !bg-transparent !border-none !shadow-none flex flex-col items-center">
                <span className={`
      text-7xl font-black italic tracking-tighter text-shadow-damage leading-none
      ${battleState.isCriticalHit ? "text-yellow-400" : "text-red-600"}
    `}>
                  {battleState.lastDamage.player1 > 0 ? `-${battleState.lastDamage.player1}` : "MISS"}
                </span>
                {battleState.isCriticalHit && (
                  <span className="text-yellow-500 font-mono text-sm font-bold uppercase tracking-widest text-shadow-crit animate-pulse">
                    CRITICAL!
                  </span>
                )}
              </div>
            )}
          </div>

          {/* PLAYER 2 CONTAINER */}
          <div className="relative">
            <div className={battleState.showDamage.player2 ? "animate-super-shake" : ""}>
              <AnimatedSprite
                characterClass={player2.name}
                animation={battleState.player2Animation}
                position="right"
                isLoser={battleState.winner === "player1"}
                isCritical={battleState.isCriticalHit && battleState.currentTurn === "player2"}
              />
            </div>

            {/* PLAYER 2 DAMAGE RESET */}
            {battleState.showDamage.player2 && (
              <div className="absolute -top-32 left-1/2 -translate-x-1/2 z-[100] pointer-events-none animate-damage-rpg !bg-transparent !border-none !shadow-none flex flex-col items-center">
                <span className={`
      text-7xl font-black italic tracking-tighter text-shadow-damage leading-none
      ${battleState.isCriticalHit ? "text-yellow-400" : "text-red-600"}
    `}>
                  {battleState.lastDamage.player2 > 0 ? `-${battleState.lastDamage.player2}` : "MISS"}
                </span>
                {battleState.isCriticalHit && (
                  <span className="text-yellow-500 font-mono text-sm font-bold uppercase tracking-widest text-shadow-crit animate-pulse">
                    CRITICAL!
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* LOG DE BATALHA */}
        <Card className="p-4 bg-black/60 backdrop-blur border-primary/20">
          <div className="font-mono text-xs space-y-1">
            {battleState.battleLog.map((log, i) => (
              <div key={i} className={i === 0 ? "text-white" : "text-slate-500"}>
                {`> ${log}`}
              </div>
            ))}
          </div>
        </Card>

        {/* MODAL DE VITÓRIA */}
        {battleState.winner && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 animate-in zoom-in duration-300">
            <Card className="p-10 w-full max-w-md bg-[#161b22] border-t-4 border-primary shadow-2xl text-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-6xl font-black text-white italic tracking-tighter drop-shadow-lg">
                  VITÓRIA!
                </h2>
                {/* EXIBE O NOME DO VENCEDOR AQUI */}
                <p className="text-primary font-mono text-xl font-bold uppercase tracking-widest">
                  {battleState.winner === "player1" ? player1.nickName : player2.nickName}
                </p>
              </div>

              <div className="flex justify-center py-4">
                <div className="text-8xl animate-bounce">
                  {battleState.winner === "player1" ? player1.image : player2.image}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Recompensas... */}
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <Sparkles className="mx-auto text-yellow-400 mb-2" />
                  <p className="text-[10px] uppercase text-slate-500 font-bold">Experiência</p>
                  <p className="text-2xl font-mono text-yellow-400">+{Math.floor(player2.maxHp * 0.7)}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <Coins className="mx-auto text-amber-500 mb-2" />
                  <p className="text-[10px] uppercase text-slate-500 font-bold">Gold</p>
                  <p className="text-2xl font-mono text-amber-500">+{Math.floor(player2.maxHp * 0.4)}</p>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <Button onClick={onReset} size="lg" className="w-full bg-primary hover:bg-primary/80 text-primary-foreground font-black text-lg h-14 rounded-2xl">
                  <RotateCcw className="mr-2" /> REVANCHE
                </Button>
                <Button onClick={onReset} variant="ghost" className="w-full text-slate-400 hover:text-white">Voltar ao Menu</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}