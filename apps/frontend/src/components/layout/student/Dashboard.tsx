"use client"
import { Card, CardContent, CardHeader, CardDescription, CardTitle} from "@/components/ui/card"

import { NivelCard } from "./NivelCard"
import { CoinsCard } from "./CoinsCard"

import { useTranslations } from "next-intl"
import { useSession } from "next-auth/react"
import { ContentsCard } from "./ContentsCards"
import { VictoryCard } from "./VictoryCard"

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
            <CardHeader>
                <CardTitle className="text-2xl">{t('title')}</CardTitle>
                <CardDescription>{t('description',{userName})}</CardDescription>
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
            </CardContent>
        </Card>
    )
}