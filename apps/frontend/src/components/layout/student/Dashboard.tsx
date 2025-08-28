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

export function StudentDashboard() {

    const t = useTranslations('StudentDashboardPage')
    const session = useSession()
    const userName = session.data?.user.name || "N/A"

    const nivel = 10
    const coins = 50
    const contents = 10
    const victory = 54
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
                        nivel={nivel}
                    />
                    <CoinsCard
                        coins={coins}
                    />
                    <ContentsCard
                        contents={contents}
                    />
                    <VictoryCard
                        victory={victory}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
                    <div className="flex flex-col gap-2 ">
                        <CharacterCard
                            name="Maga"
                            nickName="Magali"
                            strength={250}
                            agility={300}
                            constitution={450}
                            intelligence={2000}
                            experience={1500}
                            nivel={200}
                        />

                        <StatsCombatentCard
                            totalHp={500}
                            totalMana={1500}
                            mana={1500}
                            hp={350}
                            phisicalAtack={350}
                            magicAtack={1500}
                            evasion={15}
                            defense={500}
                        />
                    </div>
                    <div>
                        <DisciplineCard />
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