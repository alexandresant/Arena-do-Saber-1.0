"use client"
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"
import { BookOpen } from "lucide-react"

export function DailyMissions() {

    return (
        <Card>
            <CardHeader>
                <CardTitle>Missões Diárias</CardTitle>
                <CardDescription>Complete as missões para ganhar pontos e subir no ranking!</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
                <div className="flex flex-row justify-between items-center space-x-4">
                    <BookOpen className="mr-2 h-6 w-6" />
                    <div className="flex-1">
                        <span>Faça login diário</span>
                        <Progress value={100} />
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <span>Missão 2</span>
                    <Progress value={30} />
                </div>
                <div className="flex items-center justify-between">
                    <span>Missão 3</span>
                    <Progress value={70} />
                </div>
            </CardContent>
        </Card>
    )

}