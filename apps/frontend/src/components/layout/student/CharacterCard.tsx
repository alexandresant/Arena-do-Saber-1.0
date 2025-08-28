"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Sword, Wand, BowArrow, PawPrint, Brain, Heart, Zap} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

import type { Character } from "@/types/types"
import { useTranslations } from "next-intl"

export function CharacterCard({ name, nickName, strength, agility, constitution, intelligence, experience, nivel }: Character) {
    const t = useTranslations('StudentDashboardPage.characters')

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>{nickName}</CardTitle>
                    <CardDescription className="mt-2">{name}</CardDescription>
                </div>
                <Badge className="bg-yellow-500">{t('nivel', { nivel })}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1">
                    <div className="flex flex-row justify-between items-center">
                        <Label>{t('experience')}</Label>
                        <Label>50/100</Label>
                    </div>
                    <Progress value={50} className="w-[100%]"></Progress>
                </div>
                <div className="mt-6 space-y-4">
                    <Label>{t('attributes')}</Label>
                    <div className="flex flex-row justify-between items-center mt">
                        <div className="flex flex-row items-center space-x-2 text-muted-foreground">
                            <Sword className="h-4 w-4" />
                            <Label>{t('stregth')}</Label>
                        </div>
                        <Badge>{strength}</Badge>
                    </div>

                    <div className="flex flex-row justify-between items-center mt">
                        <div className="flex flex-row items-center space-x-2 text-muted-foreground">
                            <Zap className="h-4 w-4" />
                            <Label>{t('agility')}</Label>
                        </div>
                        <Badge>{agility}</Badge>
                    </div>

                    <div className="flex flex-row justify-between items-center mt">
                        <div className="flex flex-row items-center space-x-2 text-muted-foreground">
                            <Brain className="h-4 w-4" />
                            <Label>{t('intelligence')}</Label>
                        </div>
                        <Badge>{intelligence}</Badge>
                    </div>

                    <div className="flex flex-row justify-between items-center mt">
                        <div className="flex flex-row items-center space-x-2 text-muted-foreground">
                            <Heart className="h-4 w-4" />
                            <Label>{t('constitution')}</Label>
                        </div>
                        <Badge>{constitution}</Badge>
                    </div>
                </div>
                


            </CardContent>
        </Card>
    )
}   
