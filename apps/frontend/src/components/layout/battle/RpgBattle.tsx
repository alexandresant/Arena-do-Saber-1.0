"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BattleArena } from "@/components/layout/battle/BattleArena"
import { 
  mainPlayer, 
  gameUsers, 
  hydrateAll, 
  characters, 
  GameUser, 
  Character
} from "@/lib/CharacterData"
import { 
  Swords, 
  UserCircle, 
  Loader2, 
  Home, 
  AlertCircle, 
  Trophy,
  Shield,
  Zap
} from "lucide-react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "../student/Dashboard"

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
      }
      return false
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: "Erro ao carregar dados.",
      }))
      return false
    }
  }, [convertCharactersToGameUsers])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleStartBattle = () => {
    if (state.player && state.selectedUser?.character) {
      setState(prev => ({ ...prev, battleStarted: true }))
    }
  }

  if (state.loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Iniciando Arena...</p>
        </div>
      </div>
    )
  }

  if (state.battleStarted && state.player && state.selectedUser) {
    return (
      <BattleArena 
        player1={state.player} 
        player2={state.selectedUser.character} 
        onReset={() => setState(prev => ({ ...prev, battleStarted: false, selectedUser: null }))}
      />
    )
  }

  return (
    <DashboardLayout>
      <main className="container mx-auto min-h-screen p-4 md:p-8 space-y-8">
        {/* Header Section */}
        <section className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground shadow">
            MODO ARENA
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
            Arena de Combate
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl">
            Selecione um oponente à altura e prove seu valor no campo de batalha.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Lado Esquerdo: Seu Personagem */}
          <Card className="overflow-hidden border-2 transition-all hover:border-primary/50">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle className="flex items-center gap-2 text-xl">
                <UserCircle className="h-5 w-5 text-primary" />
                Seu Herói
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {state.player && (
                <div className="flex flex-col items-center gap-6">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                    <div className="relative text-7xl md:text-8xl bg-background rounded-full p-4 border shadow-sm">
                      {state.player.image}
                    </div>
                  </div>
                  
                  <div className="w-full text-center space-y-2">
                    <h3 className="text-2xl font-bold italic text-primary">{state.player.nickName}</h3>
                    <Badge variant="outline">{state.player.name}</Badge>
                  </div>

                  <div className="grid grid-cols-2 w-full gap-4 pt-4">
                    <div className="rounded-lg bg-muted/40 p-3 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase font-bold">
                        <Zap className="h-3 w-3 text-yellow-500" /> Ataque
                      </div>
                      <p className="text-xl font-bold">{state.player.attack || "--"}</p>
                    </div>
                    <div className="rounded-lg bg-muted/40 p-3 space-y-1">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase font-bold">
                        <Shield className="h-3 w-3 text-blue-500" /> Defesa
                      </div>
                      <p className="text-xl font-bold">{state.player.defense || "--"}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lado Direito: Seleção de Oponentes */}
          <Card className="flex flex-col border-2 h-full max-h-[600px]">
            <CardHeader className="bg-muted/50 border-b">
              <CardTitle className="flex items-center justify-between text-xl">
                <div className="flex items-center gap-2">
                  <Swords className="h-5 w-5 text-destructive" />
                  Oponentes
                </div>
                <span className="text-xs font-normal text-muted-foreground">
                  {state.opponents.length} disponíveis
                </span>
              </CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {state.opponents.map((user) => {
                  const isSelected = state.selectedUser?.id === user.id
                  return (
                    <motion.div
                      key={user.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setState(prev => ({ ...prev, selectedUser: user }))}
                    >
                      <Card className={`cursor-pointer transition-all ${
                        isSelected 
                          ? "ring-2 ring-primary border-primary bg-primary/5" 
                          : "hover:bg-accent"
                      }`}>
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className="text-4xl bg-muted rounded-md p-2">
                            {user.character?.image || "👤"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-bold truncate">{user.character?.nickName}</span>
                              <Badge variant="secondary" className="text-[10px]">
                                LVL {user.level}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground italic">{user.character?.name}</p>
                          </div>
                          {isSelected && (
                            <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </ScrollArea>
          </Card>
        </div>

        {/* Action Bar */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
          <Button
            size="lg"
            className="w-full h-16 text-lg font-bold shadow-2xl transition-all active:scale-95"
            disabled={!state.selectedUser}
            onClick={handleStartBattle}
          >
            {state.selectedUser ? (
              <>
                <Swords className="mr-2 h-6 w-6" />
                ENTRAR NA BATALHA
              </>
            ) : (
              "SELECIONE SEU ALVO"
            )}
          </Button>
        </div>
      </main>
    </DashboardLayout>
  )
}