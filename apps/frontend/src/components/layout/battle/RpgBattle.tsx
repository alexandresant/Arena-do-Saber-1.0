"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BattleArena } from "@/components/layout/battle/BattleArena"
import { 
  mainPlayer, 
  gameUsers, 
  hydrateAll, 
  characters, 
  GameUser, 
  Character
} from "@/lib/CharacterData"
import { Swords, UserCircle, Loader2, Home, AlertCircle, Trophy } from "lucide-react"
import { useRouter } from "next/navigation"

interface BattleState {
  loading: boolean
  error: string | null
  player: Character | null
  opponents: GameUser[]
  selectedUser: GameUser | null
  battleStarted: boolean
}

export default function RPGBattle() {
  const [state, setState] = useState<BattleState>({
    loading: true,
    error: null,
    player: null,
    opponents: [],
    selectedUser: null,
    battleStarted: false,
  })

  const router = useRouter()

  const convertCharactersToGameUsers = useCallback((chars: Character[]): GameUser[] => {
    return chars.map((character, index) => ({
      id: character.id,
      nickName: `Adversário ${index + 1}`,
      level: character.level || 1,
      character: character
    }))
  }, [])

  const loadData = useCallback(async () => {
    const availableOpponents = gameUsers.length > 0 
      ? gameUsers 
      : convertCharactersToGameUsers(characters)
    
    if (mainPlayer && availableOpponents.length > 0) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
        player: mainPlayer,
        opponents: [...availableOpponents],
      }))
      return true
    }

    try {
      await hydrateAll()
      const updatedOpponents = gameUsers.length > 0 
        ? gameUsers 
        : convertCharactersToGameUsers(characters)
      
      if (mainPlayer && updatedOpponents.length > 0) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: null,
          player: mainPlayer,
          opponents: [...updatedOpponents],
        }))
        return true
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: "Não foi possível carregar os personagens. Tente novamente.",
        }))
        return false
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: `Erro ao carregar dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`,
      }))
      return false
    }
  }, [convertCharactersToGameUsers])

  useEffect(() => {
    loadData()
    const handleUpdate = () => {
      const availableOpponents = gameUsers.length > 0 
        ? gameUsers 
        : convertCharactersToGameUsers(characters)
      if (mainPlayer && availableOpponents.length > 0) {
        setState(prev => ({
          ...prev,
          player: mainPlayer,
          opponents: [...availableOpponents],
        }))
      }
    }
    window.addEventListener("characters:update", handleUpdate)
    return () => window.removeEventListener("characters:update", handleUpdate)
  }, [loadData, convertCharactersToGameUsers])

  const handleStartBattle = () => {
    if (state.player && state.selectedUser?.character) {
      setState(prev => ({ ...prev, battleStarted: true, error: null }))
    } else {
      setState(prev => ({ ...prev, error: "Não é possível iniciar a batalha. Dados incompletos." }))
    }
  }

  const handleResetBattle = () => {
    setState(prev => ({ ...prev, battleStarted: false, selectedUser: null }))
  }

  const handleGoHome = () => {
    try {
      router.push("/student-dashboard")
    } catch (error) {
      window.location.href = "/student-dashboard"
    }
  }

  if (state.loading) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center text-white space-y-4 p-4">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
        <p className="font-mono text-primary animate-pulse">Buscando heróis na taverna...</p>
      </div>
    )
  }

  if (state.error && !state.battleStarted) {
    return (
      <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center text-white space-y-6 p-6">
        <AlertCircle className="h-16 w-16 text-red-500" />
        <h2 className="text-2xl font-bold text-red-400">Erro ao Carregar</h2>
        <p className="text-gray-300 text-center max-w-md">{state.error}</p>
        <div className="flex gap-4 mt-4">
          <Button onClick={loadData} variant="outline" className="text-white">Tentar Novamente</Button>
          <Button onClick={handleGoHome}><Home className="mr-2" /> Voltar para Home</Button>
        </div>
      </div>
    )
  }

  if (state.battleStarted && state.player && state.selectedUser) {
    return (
      <BattleArena 
        player1={state.player} 
        player2={state.selectedUser.character} 
        onReset={handleResetBattle}
      />
    )
  }

  return (
    <div className="min-h-[100dvh] bg-[#0a0f1e] flex flex-col items-center justify-start md:justify-center p-3 md:p-8 overflow-y-auto">
      <div className="max-w-7xl w-full space-y-4 md:space-y-8">
        {/* HEADER ADAPTADO DO SEGUNDO CÓDIGO */}
        <div className="text-center space-y-2 md:space-y-4 pt-2 md:pt-0 relative">
          <Button 
            variant="ghost" 
            onClick={handleGoHome} 
            className="absolute right-0 top-0 text-gray-400 hover:text-white hidden md:flex"
          >
            <Home className="mr-2 h-4 w-4" /> Home
          </Button>
          <h1 className="text-3xl md:text-7xl font-bold text-primary pixel-pulse font-mono tracking-wider">
            {"ARENA RPG"}
          </h1>
          <p className="text-sm md:text-xl text-muted-foreground font-mono">
            {"Escolha seu adversário e inicie a batalha!"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* SEU PERSONAGEM - ESTILO CÓDIGO 2 */}
          <Card className="p-4 md:p-6 bg-[#111827] border-2 border-primary/30">
            <div className="flex items-center justify-center gap-2 mb-3 md:mb-6">
              <UserCircle className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <h2 className="text-lg md:text-2xl font-bold text-center text-primary font-mono">{"SEU PERSONAGEM"}</h2>
            </div>

            {state.player && (
              <Card className="p-4 md:p-6 bg-primary/5 border-2 border-primary">
                <div className="flex items-center md:flex-col gap-4">
                  <div className="text-5xl md:text-7xl animate-bounce flex-shrink-0">{state.player.image}</div>

                  <div className="text-left md:text-center space-y-1 md:space-y-2 flex-1 min-w-0 text-white">
                    <h3 className="text-lg md:text-2xl font-bold font-mono text-primary truncate italic">{state.player.nickName}</h3>
                    <p className="text-sm md:text-lg text-gray-400 font-mono">{state.player.name}</p>

                    <div className="grid grid-cols-2 gap-2 md:gap-4 mt-2 md:mt-4 text-xs md:text-sm font-mono">
                      <div className="space-y-0.5 md:space-y-1">
                        <div className="flex justify-between border-b border-white/5">
                          <span className="text-gray-500">{"Nível:"}</span>
                          <span className="font-bold">{state.player.level || 1}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5">
                          <span className="text-gray-500">{"HP Máx:"}</span>
                          <span className="font-bold">{state.player.maxHp}</span>
                        </div>
                      </div>
                      <div className="space-y-0.5 md:space-y-1">
                        <div className="flex justify-between border-b border-white/5">
                          <span className="text-gray-500">{"Defesa:"}</span>
                          <span className="font-bold">{state.player.defense || "--"}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5">
                          <span className="text-gray-500">{"Ataque:"}</span>
                          <span className="font-bold">{state.player.attack || "--"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </Card>

          {/* ADVERSÁRIOS - ESTILO CÓDIGO 2 */}
          <Card className="p-4 md:p-6 bg-[#111827] border-2 border-secondary/30">
            <div className="flex items-center justify-center gap-2 mb-3 md:mb-6">
              <Swords className="h-5 w-5 md:h-6 md:w-6 " />
              <h2 className="text-lg md:text-2xl font-bold text-center  font-mono">{"DESAFIAR JOGADOR"}</h2>
            </div>
            
            <div className="space-y-2 md:space-y-3 max-h-[40vh] md:max-h-[500px] overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
              {state.opponents.map((user) => {
                const isSelected = state.selectedUser?.id === user.id

                return (
                  <Card
                    key={user.id}
                    className={`p-3 md:p-4 cursor-pointer transition-all border-2 text-white ${
                      isSelected
                        ? "border-secondary bg-secondary/10 scale-[1.02] md:scale-105"
                        : "border-gray-800 bg-black/40 hover:border-secondary/50 hover:bg-gray-800/80"
                    }`}
                    onClick={() => setState(prev => ({ ...prev, selectedUser: user, error: null }))}
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="text-3xl md:text-5xl flex-shrink-0 bg-black/20 p-2 rounded-lg">
                        {user.character?.image || "👤"}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 md:mb-1 flex-wrap">
                          <h3 className="text-sm md:text-lg font-bold font-mono truncate italic">{user.character?.nickName}</h3>
                          <div className="flex items-center gap-1 text-[10px] md:text-xs bg-primary/20 text-primary px-1.5 md:px-2 py-0.5 rounded font-mono">
                            <Trophy className="h-2.5 w-2.5 md:h-3 md:w-3" />
                            <span>
                              {"Lv "}
                              {user.level}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs md:text-sm text-gray-400 mb-1 md:mb-2 font-mono truncate">
                          {user.character?.name}
                        </p>
                        <div className="grid grid-cols-3 gap-1 text-[10px] md:text-xs font-mono text-gray-500">
                          <span>{"HP:"} {user.character?.maxHp}</span>
                          <span>{"ATQ:"} {user.character?.attack || "--"}</span>
                          <span>{"DEF:"} {user.character?.defense || "--"}</span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex-shrink-0 hidden md:block">
                          <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded font-mono text-xs font-bold animate-pulse">
                            {"ALVO"}
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

        {/* BOTÃO DE INICIAR - ESTILO CÓDIGO 2 */}
        <div className="flex flex-col items-center gap-4 justify-center pb-4 md:pb-0">
          <Button
            size="lg"
            onClick={handleStartBattle}
            disabled={!state.selectedUser || !state.player}
            className="text-base md:text-xl px-8 md:px-12 py-4 md:py-8 font-bold font-mono bg-primary hover:bg-primary/90 disabled:opacity-50 w-full md:w-auto shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all active:scale-95"
          >
            <Swords className="mr-2 h-5 w-5 md:h-6 md:w-6" />
            {!state.selectedUser ? "SELECIONE UM ADVERSÁRIO" : "INICIAR BATALHA"}
          </Button>
          <p className="text-gray-500 text-xs font-mono animate-pulse uppercase tracking-widest">
            Prepare-se para o combate
          </p>
        </div>
      </div>
    </div>
  )
}