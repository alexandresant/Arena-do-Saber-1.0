import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "next-intl"
import { TrendingUp } from "lucide-react"

export function RankingFightersCard(){
    const t = useTranslations('StudentDashboardPage.ranking')

    return(
        <Card>
            <CardHeader>
                <CardTitle className="flex flex-row items-center gap-1">
                    <TrendingUp />
                    {t('rankingFighters')}
            </CardTitle>
            </CardHeader>
        </Card>
    )
}