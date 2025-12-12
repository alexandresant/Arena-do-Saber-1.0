"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select"
import { ClassCardProps, ClassProps } from "@/types/types"

import { BookUser } from "lucide-react"
import { useState } from "react"
import { useTranslations } from "next-intl"

export function ClassCard({ turmas, turmaSelecionada, onClassSelect }: ClassCardProps) {
    const [openDialog, setOpenDialog] = useState(false)
    const t = useTranslations("TeacherDashboardPage.ClassCard")

    function handleSelectChange(value: string) {
        const id = Number(value)
        const turma = turmas.find((tu) => tu.id === id)
        if (turma) {
            onClassSelect(turma)
        }
        setOpenDialog(false)
    }

    return (
        <>
            <Card onClick={() => setOpenDialog(true)}>
                <CardContent>
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-col space-y-2">
                            <Label>{t("LabelClass")}</Label>
                            <Label className="text-muted-foreground">
                                {turmaSelecionada?.name ?? t("LabelSelectPrompt")}
                            </Label>
                        </div>
                        <BookUser className="h-8 w-8 text-blue-600" />
                    </div>
                </CardContent>
            </Card>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("DialogTitle")}</DialogTitle>
                        <DialogDescription>{t("DialogDescription")}</DialogDescription>
                    </DialogHeader>
                    <Select value={turmaSelecionada?.name} onValueChange={handleSelectChange}>
                        <SelectTrigger>
                            <SelectValue placeholder={t("SelectPlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                            {turmas.map((op) => (
                                <SelectItem key={op.id} value={String(op.id)}>
                                    {op.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </DialogContent>
            </Dialog>
        </>
    )
}
