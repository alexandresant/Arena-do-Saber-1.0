import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useTranslations } from "next-intl"
import type { CombatentStats } from "@/types/types"

export function StatsCombatentCard({ totalHp, totalMana, mana, hp, phisicalAtack, magicAtack, evasion, defense }: CombatentStats) {
    const t = useTranslations('StudentDashboardPage.characters')

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('combatentStats')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-row items-center justify-between text-muted-foreground">
                    <div className="w-[45%] space-y-1">
                        <div className="flex flex-row items-center justify-between">
                            <Label>{t('hp')}</Label>
                            <Label>{hp} / {totalHp}</Label>
                        </div>
                        <Progress value={(hp / totalHp) * 100} className="[&>div]:bg-red-600"/>
                    </div>

                    <div className="w-[45%] space-y-1">
                        <div className="flex flex-row items-center justify-between">
                            <Label>{t('mana')}</Label>
                            <Label>{mana} / {totalMana}</Label>
                        </div>
                        <Progress value={(mana / totalMana) * 100} className="[&>div]:bg-blue-600"/>
                    </div>
                </div>

                <div className="flex flex-row items-center justify-between mt-4 text-muted-foreground">
                    <div className="flex flex-col items-center space-y-2">
                        <Label>{t('physicalAttack')}</Label>
                        <Label>{phisicalAtack}</Label>
                    </div>

                    <div className="flex flex-col items-center space-y-2">
                        <Label>{t('magicAttack')}</Label>
                        <Label>{magicAtack}</Label>
                    </div>
                    
                    <div className="flex flex-col items-center space-y-2">
                        <Label>{t('evasion')}</Label>
                        <Label>{evasion}</Label>
                    </div>
                </div>
            </CardContent>
        </Card>
    )

}