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

// Interface para estado da batalha - Sincronizada com Código 1
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

  // Função para converter characters para GameUsers - Referência do Código 1
  const convertCharactersToGameUsers = useCallback((chars: Character[]): GameUser[] => {
    return chars.map((character, index) => ({
      id: character.id,
      nickName: `Adversário ${index + 1}`,
      level: character.level || 1,
      character: character
    }))
  }, [])

  // Função para verificar e carregar dados via hydrateAll
  const loadData = useCallback(async () => {
    console.log("RPGBattle: Verificando dados...")
    
    // CORREÇÃO: Usa characters se gameUsers estiver vazio (Padrão Código 1)
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
    
    // Listener para atualizações em tempo real conforme Código 1
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
      console.log("Iniciando batalha entre:", state.player.nickName, "vs", state.selectedUser.character.nickName)
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

  // Estado de Erro estilizado conforme Código 1
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
    <div className="min-h-[100dvh] bg-[#0a0f1e] flex flex-col items-center p-4 md:p-8">
      <div className="max-w-7xl w-full space-y-8">
        <header className="flex flex-col md:flex-row md:justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-7xl font-bold text-primary font-mono tracking-wider italic">ARENA RPG</h1>
            <p className="text-gray-400 font-mono">Escolha seu adversário e inicie a batalha</p>
          </div>
          <Button variant="outline" onClick={handleGoHome} className="border-gray-700 text-gray-200 hover:bg-gray-800">
            <Home className="mr-2 h-4 w-4" /> Home
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* SEU HERÓI */}
          <Card className="p-6 bg-gray-900/50 border-2 border-primary/30 text-white shadow-2xl">
            <h2 className="text-xl font-mono mb-6 flex items-center gap-2">
              <UserCircle className="text-primary" /> SEU HERÓI
            </h2>
            {state.player && (
              <div className="flex flex-col items-center gap-4 bg-primary/5 p-8 rounded-xl border border-primary/10">
                <div className="text-8xl mb-2 animate-bounce">{state.player.image}</div>
                <h3 className="text-3xl font-black text-white italic tracking-tighter">{state.player.nickName}</h3>
                <p className="text-primary font-mono">{state.player.name}</p>
                <div className="grid grid-cols-2 gap-4 w-full mt-4">
                  <div className="bg-black/40 p-3 rounded text-center border border-white/5">
                    <p className="text-xs text-gray-500 uppercase">Nível</p>
                    <p className="text-xl font-bold">{state.player.level || 1}</p>
                  </div>
                  <div className="bg-black/40 p-3 rounded text-center border border-white/5">
                    <p className="text-xs text-gray-500 uppercase">HP Máximo</p>
                    <p className="text-xl font-bold">{state.player.maxHp}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* ADVERSÁRIOS */}
          <Card className="p-6 bg-gray-900/50 border-2 border-gray-700 text-white">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-mono flex items-center gap-2">
                <Swords className="text-secondary" /> ADVERSÁRIOS
              </h2>
              <span className="text-xs font-mono text-gray-500">{state.opponents.length} prontos</span>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {state.opponents.map((user) => (
                <div
                  key={user.id}
                  onClick={() => setState(prev => ({ ...prev, selectedUser: user, error: null }))}
                  className={`p-4 cursor-pointer transition-all border-2 rounded-xl flex items-center gap-4 ${
                    state.selectedUser?.id === user.id 
                      ? "border-secondary bg-secondary/10 shadow-[0_0_15px_rgba(var(--secondary),0.1)]" 
                      : "border-gray-800 bg-black/20 hover:border-gray-600"
                  }`}
                >
                  <div className="text-4xl bg-black/40 p-2 rounded-lg">{user.character?.image || "👤"}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white italic">{user.character?.nickName} (Lvl {user.level})</h3>
                    <p className="text-ls text-gray-400 font-mono">{user.character?.name}</p>

                  </div>
                  <Trophy className={`h-5 w-5 ${state.selectedUser?.id === user.id ? "text-secondary" : "text-gray-700"}`} />
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* BOTÃO DE INICIAR */}
        <div className="flex flex-col items-center gap-6 pt-8">
          <Button
            size="lg"
            onClick={handleStartBattle}
            disabled={!state.selectedUser?.character || !state.player}
            className="w-full md:w-auto px-20 py-10 text-2xl font-black font-mono bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all active:scale-95 shadow-xl disabled:opacity-50"
          >
            {!state.selectedUser ? (
              "SELECIONE UM ADVERSÁRIO"
            ) : (
              <>
                <Swords className="mr-4 h-8 w-8" />
                BATALHAR: {state.player?.nickName} VS {state.selectedUser.character?.nickName}
              </>
            )}
          </Button>
          <p className="text-gray-500 text-sm font-mono animate-pulse">Prepare-se para o combate...</p>
        </div>
      </div>
    </div>
  )
}