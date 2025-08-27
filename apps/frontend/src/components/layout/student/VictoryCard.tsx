import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Trophy } from "lucide-react"
import { useTranslations } from "next-intl"

export function VictoryCard({victory}: {victory: number}){
    const t = useTranslations('StudentDashboardPage.topCards')

    return(
        <Card>
            <CardContent className="flex flex-row justify-between items-center">
                <div className="flex flex-col ">
                    <Label className="text-muted-foreground">{t('victory')}</Label>
                    <Label className="text-2xl">{victory}</Label>
                </div>
                <Trophy className="w-8 h-8  text-green-500"/>
            </CardContent>
        </Card>
    )
}