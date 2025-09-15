"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select"
import { ClassCardProps, ClassProps } from "@/types/types"

import { BookUser } from "lucide-react"
import { useState } from "react"
import { id } from "zod/v4/locales"


export function ClassCard({turmas, turmaSelecionada, onClassSelect }: ClassCardProps) {
    const [openDialog, setOpenDialog] = useState(false)

    function handleSelectChange(value: string){
        const id = Number(value)
        const turma = turmas.find((tu) => tu.id === id)
        if (turma){
            onClassSelect(turma)
        }
        setOpenDialog(false)
    }
    return (
        <>
            <Card
                onClick={() => setOpenDialog(true)}
            >
                <CardContent>
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-col space-y-2">
                            <Label>Turma</Label>
                            <Label className="text-muted-foreground">
                                {turmaSelecionada?.name ?? "Selecione uma turma para ver as informações"
                                }
                            </Label>
                        </div>
                        <BookUser className="h-8 w-8 text-blue-600" />
                    </div>
                </CardContent>
            </Card>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Selecione um turma</DialogTitle>
                        <DialogDescription>Selecione uma turma para mostrar as informações e criar atividades</DialogDescription>
                    </DialogHeader>
                    <Select value={turmaSelecionada?.name} onValueChange={handleSelectChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Escolha uma turma"/>
                        </SelectTrigger>
                        <SelectContent>
                            {turmas.map((op) => (
                                <SelectItem
                                    key={op.id}
                                    value={String(op.id)}
                                >
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