import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "next-intl"
import { TrendingUp } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { use, useEffect, useState } from "react"
import { loadRankingFighters } from "@/lib/api/loadRanking"
import { FighterProps } from "@/types/types"

export function RankingFightersCard(){
    const t = useTranslations('StudentDashboardPage.ranking')
    const [rankingData, setRankingData] = useState<FighterProps[]>([])

    useEffect(() => {
        async function fetchRanking() {
            const data = await loadRankingFighters()
            setRankingData(data)
        }
        fetchRanking()  
    }, [])

    return(
        <Card>
            <CardHeader>
                <CardTitle className="flex flex-row items-center gap-1">
                    <TrendingUp />
                    {t('rankingFighters')}
            </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Lutador</TableHead>
                            <TableHead>Nível</TableHead>
                            
                            <TableHead>Vitórias</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rankingData.map((fighter, index) => (
                            <TableRow key={fighter.id}>
                                <TableCell>{index + 1}º - {fighter.nickName}</TableCell>
                                <TableCell>{fighter.level}</TableCell>
                                <TableCell>{fighter.victories}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
