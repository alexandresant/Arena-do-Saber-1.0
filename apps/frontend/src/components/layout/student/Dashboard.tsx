"use client"
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

import { NivelCard } from "./NivelCard"
import { CoinsCard } from "./CoinsCard"
import { ContentsCard } from "./ContentsCards"
import { VictoryCard } from "./VictoryCard"
import { CharacterCard } from "./CharacterCard"

import { useTranslations } from "next-intl"
import { useSession, signOut } from "next-auth/react"
import { StatsCombatentCard } from "./StatsCombatentCard"
import { DisciplineCard } from "./DisciplineCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RankingStudentsCard } from "./RankingStudentsCard"
import { RankingFightersCard } from "./RankingFightersCard"
import { use, useEffect, useState } from "react"
import type { Character } from "@/types/types"
import { getCharacterStatus } from "@/lib/api/createCharacter"
import { JoinClassForm } from "./SelectClassCard"
import { getUserPoints } from "@/lib/api/loadpointsUser"

export function StudentDashboard() {

    const t = useTranslations('StudentDashboardPage')
    const session = useSession()
    const userName = session.data?.user.name || "N/A"
    const [characterStatus, setCharacterStatus] = useState<Character | null>(null)
    const [userPoints, setUserPoints] = useState<number | null>(null)

    const coins = 50
    const victory = 32  

    useEffect(() => {
        const fetchCharacterStatus = async () => {
            if (!session?.data?.jwt) return
            try {
                const characterData = await getCharacterStatus(session?.data.jwt, Number(session.data.user.id))
                if (characterData.character) {
                    setCharacterStatus(characterData.character)
                   //console.log("Dados carregados: ", characterData.character)
                }
            }
            catch (error) {
                console.error("Erro ao buscar status do personagem. " + error)
            }
        }
        fetchCharacterStatus()
    }, [session])
    useEffect(() => {
        const fetchUserData = async () => {
            if (!session?.data?.jwt) return
            try {
                const userPointsValue = await getUserPoints()
                if (userPointsValue !== null && userPointsValue !== undefined) {
                    setUserPoints(userPointsValue)
                    //console.log("Pontos do usuário carregados:", userPointsValue)
                }
            } catch (error) {
                //console.error("Erro ao buscar pontos do usuário.", error)
            }
        }
        fetchUserData()
    }, [session])

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div className="flex flex-col">
                    <CardTitle className="text-2xl">{t('title')}</CardTitle>
                    <CardDescription>{t('description', { userName })}</CardDescription>

                </div>
                <Button
                    className="bg-transparent border text-gray-100 hover:text-gray-700"
                    onClick={() => signOut()}
                >
                    <LogOut className="h-8 w-8" />
                    Sair
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                    <NivelCard
                        nivel={characterStatus?.level ?? 1}
                    />
                    <CoinsCard
                        coins={coins}
                    />
                    <ContentsCard
                        contents={userPoints ?? 0}
                    />
                    <VictoryCard
                        victory={victory}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                    <div className="flex flex-col gap-2 ">
                        <CharacterCard
                            name={characterStatus?.name ?? "N/A"}
                            nickName={characterStatus?.nickName ?? "N/A"}
                            strength={characterStatus?.strength ?? 0}
                            agility={characterStatus?.agility ?? 0}
                            constitution={characterStatus?.constitution ?? 0}
                            intelligence={characterStatus?.intelligence ?? 0}
                            experience={characterStatus?.experience ?? 0}
                            level={characterStatus?.level ?? 1}
                            points={characterStatus?.points ?? 0}
                        />

                        <StatsCombatentCard
                            totalHp={characterStatus?.hp ?? 0}
                            totalMana={characterStatus?.mana ?? 0}
                            mana={(characterStatus?.mana ?? 0)}
                            hp={(characterStatus?.hp ?? 0)}
                            phisicalAttack={characterStatus?.attack ?? 0}
                            magicAttack={characterStatus?.magicAttack ?? 0}
                            evasion={characterStatus?.evasion ?? 0}
                            defense={characterStatus?.defense ?? 0}
                        />
                    </div>
                    <div>
                        {/*<DisciplineCard />*/}
                        <JoinClassForm />
                    </div>
                    <div className="flex flex-col">
                        <div>
                            <Tabs defaultValue="topStudents">
                                <TabsList className="w-full">
                                    <TabsTrigger value="topStudents">{t('topStudents')}</TabsTrigger>
                                    <TabsTrigger value="topFighters">{t('topFighters')}</TabsTrigger>
                                </TabsList>
                                <TabsContent value="topStudents">
                                    <RankingStudentsCard />
                                </TabsContent>
                                <TabsContent value="topFighters">
                                    <RankingFightersCard />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}