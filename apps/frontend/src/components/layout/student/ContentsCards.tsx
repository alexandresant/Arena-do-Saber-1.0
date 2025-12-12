import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { BookOpen, CircleDot } from "lucide-react"
import { useTranslations } from "next-intl"

export function ContentsCard({contents}: {contents : number}){
    const t = useTranslations('StudentDashboardPage.topCards')

    return(
        <Card>
            <CardContent className="flex flex-row justify-between items-center">
                <div className="flex flex-col">
                    <Label className="text-muted-foreground">{t('content')}</Label>
                    <Label className="text-2xl">{contents}</Label>
                </div>
                <CircleDot className="w-8 h-8 text-blue-500"/>
            </CardContent>
        </Card>
    )
}