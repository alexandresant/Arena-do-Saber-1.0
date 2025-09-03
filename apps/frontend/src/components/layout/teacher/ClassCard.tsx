"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select"

import { BookOpenIcon } from "lucide-react"
import { useState } from "react"

const mockTurmas = [
    { id: 1, name: "Turma A - 1º Ano" },
    { id: 2, name: "Turma B - 2º Ano" },
    { id: 3, name: "Turma C - 3º Ano" },
    { id: 4, name: "Turma D - 4º Ano" },
    { id: 5, name: "Turma E - 5º Ano" },
    { id: 6, name: "Turma F - 6º Ano" },
    { id: 7, name: "Turma G - 7º Ano" },
    { id: 8, name: "Turma H - 8º Ano" },
    { id: 9, name: "Turma I - 9º Ano" },
    { id: 10, name: "Turma J - 1º EM" }
]

export function ClassCard() {
    const [openDialog, setOpenDialog] = useState(false)
    const [className, setClassName] = useState("")

    function handleSelectChange(value: string){
        setClassName(value)
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
                                {className ?
                                    className : "Selecione uma turma"
                                }
                            </Label>
                        </div>
                        <BookOpenIcon className="h-8 w-8 text-blue-600" />
                    </div>
                </CardContent>
            </Card>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Selecione um turma</DialogTitle>
                        <DialogDescription>Selecione uma turma para mostrar as informações e criar atividades</DialogDescription>
                    </DialogHeader>
                    <Select value={className} onValueChange={handleSelectChange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Escolha uma turma"/>
                        </SelectTrigger>
                        <SelectContent>
                            {mockTurmas.map((op) => (
                                <SelectItem
                                    key={op.id}
                                    value={op.name}
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