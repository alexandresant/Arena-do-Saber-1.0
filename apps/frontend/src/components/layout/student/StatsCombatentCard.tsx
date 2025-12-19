import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useTranslations } from "next-intl"
import type { CombatentStats } from "@/types/types"
import { Badge } from "@/components/ui/badge"
import { Wand, Sword, Shield, Rabbit, ForkKnife, Swords } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function StatsCombatentCard({ totalHp, totalMana, phisicalAttack, magicAttack, evasion, defense }: CombatentStats) {
    const t = useTranslations('StudentDashboardPage.characters')
    const router = useRouter()

    return (
        <Card className="gap-4">
            <CardHeader>
                <CardTitle>{t('combatentStats')}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-row items-center justify-between text-muted-foreground">
                    <div className="w-[45%] space-y-1">
                        <div className="flex flex-row items-center justify-between">
                            <Label>{t('hp')}</Label>
                            <Label>{totalHp}</Label>
                        </div>
                        <Progress value={totalHp} className="[&>div]:bg-red-600" />
                    </div>

                    <div className="w-[45%] space-y-1">
                        <div className="flex flex-row items-center justify-between">
                            <Label>{t('mana')}</Label>
                            <Label>{totalMana}</Label>
                        </div>
                        <Progress value={totalMana} className="[&>div]:bg-blue-600" />
                    </div>
                </div>

                <div className="flex flex-col mt-4 text-muted-foreground space-y-2">
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center space-x-2">
                            <Sword className="h-4 w-4" />
                            <Label>{t('physicalAttack')}</Label>
                        </div>

                        <Badge>{phisicalAttack}</Badge>
                    </div>

                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center space-x-2">
                            <Wand className="w-4 h-4" />
                            <Label>{t('magicAttack')}</Label>
                        </div>
                        <Badge>{magicAttack}</Badge>
                    </div>

                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center space-x-2">
                            <Rabbit className="w-4 h-4" />
                            <Label>{t('evasion')}</Label>
                        </div>
                        <Badge>{evasion}</Badge>
                    </div>
                    <div className="flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center space-x-2">
                            <Shield className="h-4 w-4" />
                            <Label>{t('defense')}</Label>
                        </div>
                        <Badge>{defense}</Badge>
                    </div>
                </div>
                <Button
                    className="w-full mt-4"
                    onClick={() => router.push("/battle-arena")}
                >
                    <Swords />
                    Batalhar
                </Button>
            </CardContent>
        </Card>
    )

}