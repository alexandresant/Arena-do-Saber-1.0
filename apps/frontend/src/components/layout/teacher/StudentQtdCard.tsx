"use client"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap } from "lucide-react"
import { useTranslations } from "next-intl"

export function StudentQtdCard({ qtdAlunos }: { qtdAlunos: number }) {
    const t = useTranslations("TeacherDashboardPage.StudentQtdCard")

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-col space-y-2">
                        <CardTitle>{t("CardTitle")}</CardTitle>
                        <CardDescription>{qtdAlunos} {t("StudentsInClass")}</CardDescription>
                    </div>
                    <GraduationCap className="h-8 w-8 text-blue-600"/>
                </div>
            </CardHeader>
        </Card>
    )
}
