"use client"
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut, LayoutDashboard, User, BookOpen, Trophy } from "lucide-react"
import { NivelCard } from "./NivelCard"
import { CoinsCard } from "./CoinsCard"
import { ContentsCard } from "./ContentsCards"
import { VictoryCard } from "./VictoryCard"
import { CharacterCard } from "./CharacterCard"
import { SubjectCard } from "./SubjectCard"
import { useTranslations } from "next-intl"
import { useSession, signOut } from "next-auth/react"
import { StatsCombatentCard } from "./StatsCombatentCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RankingStudentsCard } from "./RankingStudentsCard"
import { RankingFightersCard } from "./RankingFightersCard"
import { useEffect, useState } from "react"
import type { Character, FighterProps } from "@/types/types"
import { getCharacterStatus } from "@/lib/api/createCharacter"
import { JoinClassForm } from "./SelectClassCard"
import { getUserPoints } from "@/lib/api/loadpointsUser"
import { useRouter } from "next/navigation"
import { loadRankingFighters } from "@/lib/api/loadRanking"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { DashboardLayout } from "./Dashboard"
import { DailyMissions } from "./DailyMissions"

export function StudentIndex() {
    const t = useTranslations('StudentDashboardPage')
    const { data: session } = useSession()
    const userName = session?.user?.name || "N/A"
    
    const [characterStatus, setCharacterStatus] = useState<Character | null>(null)
    const [userPoints, setUserPoints] = useState<number | null>(null)
    const [victories, setVictories] = useState(0)
    const [rankingData, setRankingData] = useState<FighterProps[]>([])

    const coins = 50

    useEffect(() => {
        async function fetchData() {
            if (!session?.jwt || !session?.user?.id) return

            try {
                const [charData, points, ranking] = await Promise.all([
                    getCharacterStatus(session.user.id),
                    getUserPoints(),
                    loadRankingFighters()
                ])

                if (charData.character) setCharacterStatus(charData.character)
                if (points !== null) setUserPoints(points)
                setRankingData(ranking)
                
                const myVictories = ranking.find(f => f.id === charData.character?.id)?.victories ?? 0
                setVictories(myVictories)
            } catch (error) {
                console.error("Erro ao carregar dados do dashboard", error)
            }
        }
        fetchData()
    }, [session])

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id)
        if (element) {
            element.style.scrollMarginTop = "20px"
            element.scrollIntoView({ behavior: "smooth" })
        }
    }

    return (
        <DashboardLayout>
            <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6 space-y-6">
                {/* QUICK NAV - Apenas Mobile (Otimizado) */}
                <nav className="grid grid-cols-4 gap-2 md:hidden">
                    {[
                        { id: "status", icon: LayoutDashboard, label: "Status" },
                        { id: "character", icon: User, label: "Perfil" },
                        { id: "subjects", icon: BookOpen, label: "Aulas" },
                        { id: "ranking", icon: Trophy, label: "Rank" },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => scrollToSection(item.id)}
                            className="flex flex-col items-center justify-center p-3 bg-card border rounded-lg text-[10px] font-medium active:scale-95 transition"
                        >
                            <item.icon className="h-5 w-5 mb-1 text-primary" />
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* STATS DE TOPO - Grid Responsivo */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <NivelCard nivel={characterStatus?.level ?? 1} />
                    <CoinsCard coins={coins} />
                    <ContentsCard contents={userPoints ?? 0} />
                    <VictoryCard victory={victories} />
                </section>

                {/* GRID PRINCIPAL - Layout em 'L' para Desktop */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    
                    {/* COLUNA ESQUERDA: Personagem e Stats */}
                    <div id="character" className="xl:col-span-1 space-y-6">
                        <StatsCombatentCard
                            id={characterStatus?.id ?? 0}
                            points={characterStatus?.points ?? 0}
                            level={characterStatus?.level ?? 1}
                            name={characterStatus?.name ?? "N/A"}
                            nickName={characterStatus?.nickName ?? "N/A"}
                            totalHp={characterStatus?.hp ?? 0}
                            totalMana={characterStatus?.mana ?? 0}
                            phisicalAttack={characterStatus?.attack ?? 0}
                            magicAttack={characterStatus?.magicAttack ?? 0}
                            evasion={characterStatus?.evasion ?? 0}
                            defense={characterStatus?.defense ?? 0}
                            experience={characterStatus?.experience ?? 0}
                        />
                    </div>

                    {/* COLUNA CENTRAL/DIREITA: Conteúdo e Social */}
                    <div className="xl:col-span-2 space-y-6">
                        <DailyMissions />
                    </div>
                </div>
            </main>
        </DashboardLayout>
    )
}
