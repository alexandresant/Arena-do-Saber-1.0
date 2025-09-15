import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Star } from "lucide-react"
import { useTranslations } from "next-intl"
export function NivelCard({nivel}: {nivel: number}) {
    const t = useTranslations('StudentDashboardPage.topCards')
    return (
        <Card>
            <CardContent className="flex flex-row gap-2 justify-between items-center">
                <div className="flex flex-col">
                    <Label className="text-muted-foreground">{t('nivel')}</Label>
                    <Label className="text-2xl">{nivel}</Label>
                </div>
                <Star className="h-8 w-8 text-yellow-500"/>
            </CardContent>
        </Card>
    )
}