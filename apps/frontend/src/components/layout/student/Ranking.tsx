"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Trophy } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslations } from "next-intl"
import { RankingStudentsCard } from "./RankingStudentsCard"
import { RankingFightersCard } from "./RankingFightersCard"
import { DashboardLayout } from "./Dashboard"
export function Ranking() {
    const t = useTranslations('StudentDashboardPage')
    return (
        <DashboardLayout>
            <Card id="ranking" className="shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Trophy className="h-5 w-5 text-yellow-500" />
                        Classificação Geral
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="topStudents" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="topStudents">{t('topStudents')}</TabsTrigger>
                            <TabsTrigger value="topFighters">{t('topFighters')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="topStudents" className="mt-0">
                            <RankingStudentsCard />
                        </TabsContent>
                        <TabsContent value="topFighters" className="mt-0">
                            <RankingFightersCard />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </DashboardLayout>
    )
}