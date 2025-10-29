"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClassProps } from "@/types/types"
import { useTranslations } from "next-intl"

export function ActivtyClass({ turma }: { turma: ClassProps | null }) {
    const t = useTranslations("TeacherDashboardPage.ActivtyClass")

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("CardTitle")}</CardTitle>
                <CardDescription>{t("CardDescriptionPrefix")} {turma?.name}</CardDescription>
            </CardHeader>
            <CardContent>
                <ul>
                    {turma?.activities?.map((op) => (
                        <li key={op.id}>{op.name}</li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
