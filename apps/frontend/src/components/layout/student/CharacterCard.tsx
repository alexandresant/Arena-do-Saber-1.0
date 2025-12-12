"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Sword, Wand, CircleDot, Brain, Heart, Zap } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

import type { Character } from "@/types/types"
import { useTranslations } from "next-intl"

export function CharacterCard({ name, nickName, strength, agility, constitution, intelligence, experience, level, points }: Character) {
    const t = useTranslations('StudentDashboardPage.characters')

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>{nickName}</CardTitle>
                    <CardDescription className="mt-2">{name}</CardDescription>
                </div>
                <Badge className="bg-yellow-500">{t('nivel', { level })}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-1">
                    <div className="flex flex-row justify-between items-center">
                        <Label>{t('experience')}</Label>
                        <Label>{experience} / 100</Label>
                    </div>
                    <Progress value={experience} className="w-[100%]"></Progress>
                </div>
                <div className="mt-6 space-y-4">
                    <Label>{t('attributes')}</Label>
                    <div className="flex flex-row justify-between items-center mt">
                        <div className="flex flex-row items-center space-x-2 text-muted-foreground">
                            <Sword className="h-4 w-4" />
                            <Label>{t('stregth')}</Label>
                        </div>
                        <div className=" justify-between items-center flex flex-row space-x-1">
                            <Button className="w-4 h-5">+</Button>
                            <Badge>{strength}</Badge>
                            <Button className="w-3 h-5">-</Button>
                        </div>

                    </div>

                    <div className="flex flex-row justify-between items-center mt">
                        <div className="flex flex-row items-center space-x-2 text-muted-foreground">
                            <Zap className="h-4 w-4" />
                            <Label>{t('agility')}</Label>
                        </div>
                        <div className=" justify-between items-center flex flex-row space-x-1">
                            <Button className="w-4 h-5">+</Button>
                            <Badge>{agility}</Badge>
                            <Button className="w-3 h-5">-</Button>
                        </div>
                        
                    </div>

                    <div className="flex flex-row justify-between items-center mt">
                        <div className="flex flex-row items-center space-x-2 text-muted-foreground">
                            <Brain className="h-4 w-4" />
                            <Label>{t('intelligence')}</Label>
                        </div>
                        <div className=" justify-between items-center flex flex-row space-x-1">
                            <Button className="w-4 h-5">+</Button>
                            <Badge>{intelligence}</Badge>
                            <Button className="w-3 h-5">-</Button>
                        </div>
                        
                    </div>

                    <div className="flex flex-row justify-between items-center mt">
                        <div className="flex flex-row items-center space-x-2 text-muted-foreground">
                            <Heart className="h-4 w-4" />
                            <Label>{t('constitution')}</Label>
                        </div>
                        <div className=" justify-between items-center flex flex-row space-x-1">
                            <Button className="w-4 h-5">+</Button>
                            <Badge>{constitution}</Badge>
                            <Button className="w-3 h-5">-</Button>
                        </div>

                    </div>

                    <div className="flex flex-row justify-between items-center mt">
                        <div className="flex flex-row items-center space-x-2 text-muted-foreground">
                            <CircleDot className="h-4 w-4" />
                            <Label>{t('points')}</Label>
                        </div>
                        <Badge>{points}</Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}   
