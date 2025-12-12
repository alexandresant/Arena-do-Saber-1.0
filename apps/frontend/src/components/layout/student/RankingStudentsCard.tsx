"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "next-intl"
import { TrendingUp } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { loadRankingUser } from "@/lib/api/loadRanking"
import type { ranckingUserProps } from "@/types/types"

export function RankingStudentsCard() {
    const t = useTranslations('StudentDashboardPage.ranking')
    const [rankingData, setRankingData] = useState<ranckingUserProps[]>([])

    useEffect(() => {
        async function fetchRanking() {
            const data = await loadRankingUser()
            setRankingData(data)
        }
        fetchRanking()
    }, [])

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex flex-row items-center gap-1">
                    <TrendingUp />
                    {t('rankingStudents')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Aluno</TableHead>
                            <TableHead>Pontos</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rankingData.map((user, index) => (
                            <TableRow key={user.id}>
                                <TableCell>{index + 1}º - {user.username}</TableCell>
                                <TableCell>{user.points}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>

                </Table>
            </CardContent>
        </Card>
    )
}