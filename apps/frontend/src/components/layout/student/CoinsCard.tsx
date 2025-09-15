import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Coins } from "lucide-react"
import { useTranslations } from "next-intl"

export function CoinsCard({coins}: {coins: number}) {
    const t = useTranslations('StudentDashboardPage.topCards')
    return (
        <Card>
            <CardContent className="flex flex-row gap-2 justify-between items-center">
                <div className="flex flex-col">
                    <Label className="text-muted-foreground">{t('coins')}</Label>
                    <Label className="text-2xl">{coins}</Label>
                </div>
                <Coins className="h-8 w-8 text-yellow-500"/>
            </CardContent>
        </Card>
    )
}