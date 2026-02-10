// RpgBattle.tsx
"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import BattleArena from "@/components/layout/battle/BattleArena"
import { mainPlayer, gameUsers, hydrateAll, GameUser } from "@/lib/CharacterData"
import { Swords, UserCircle, Loader2, Home } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RPGBattle() {
  const [loading, setLoading] = useState(!mainPlayer || gameUsers.length === 0);
  const [player, setPlayer] = useState(mainPlayer);
  const [opponents, setOpponents] = useState(gameUsers);
  const [selectedUser, setSelectedUser] = useState<GameUser | null>(null);
  const [battleStarted, setBattleStarted] = useState(false);
  const router = useRouter()

    useEffect(() => {
  const init = async () => {
    await hydrateAll()

    console.log("AFTER HYDRATE:", {
      mainPlayer,
      gameUsersLen: gameUsers.length
    })

    setPlayer({ ...mainPlayer! })
    setOpponents([...gameUsers])
    setLoading(false)
  }

  init()
}, [])

  if (loading) return (
    <div className="min-h-screen bg-[#0a0f1e] flex flex-col items-center justify-center text-white space-y-4">
      <Loader2 className="animate-spin h-12 w-12 text-primary" />
      <p className="font-mono text-primary animate-pulse">Buscando heróis na taverna...</p>
    </div>
  );
  if (battleStarted && player && selectedUser) {
    return <BattleArena player1={player} player2={selectedUser.character} onReset={() => setBattleStarted(false)} />;
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-8">
          <h1 className="text-5xl font-bold text-center text-primary font-mono">ARENA RPG</h1>
          <Button
            className="bg-transparent border text-gray-100 hover:text-gray-700"
            onClick={() => router.push("/student-dashboard")}
          >
            <Home />
            Home
          </Button>
        </div>


        <div className="grid md:grid-cols-2 gap-8">
          {/* PLAYER CARD */}
          <Card className="p-6 border-2 border-primary">
            <h2 className="text-xl font-mono mb-4 flex items-center gap-2"><UserCircle /> SEU HERÓI</h2>
            {player ? (
              <div className="text-center">
                <div className="text-7xl mb-4">{player.image}</div>
                <h3 className="text-2xl font-bold">{player.nickName}</h3>
                <p className="text-muted-foreground">{player.name}</p>
              </div>
            ) : <p>Personagem não encontrado.</p>}
          </Card>

          {/* OPPONENT LIST */}
          <Card className="p-6">
            <h2 className="text-xl font-mono mb-4 flex items-center gap-2"><Swords /> ADVERSÁRIOS</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {opponents.map(user => (
                <div
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedUser?.id === user.id ? 'border-secondary bg-secondary/10' : 'border-slate-700'}`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{user.character.image}</span>
                    <div>
                      <p className="font-bold">{user.username} (Nível {user.level})</p>
                      <p className="text-xs text-muted-foreground">{user.character.nickName}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <Button
          disabled={!selectedUser || !player}
          onClick={() => setBattleStarted(true)}
          className="w-full py-8 text-2xl font-mono"
        >
          INICIAR BATALHA
        </Button>
      </div>
    </div>
  );
}
