"use client"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { CreateClassDialog } from "./CreateClassDialog"
import { BookUser } from "lucide-react"

export function CreateClassCard() {
    const [openDialog, setOpenDialog] = useState(false)
    return (
        <>
            <Card
                onClick={() => setOpenDialog(true)}
            >
                <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex flex-col space-y-2">
                        <CardTitle>+ Criar nova turma</CardTitle>
                        <CardDescription>Clique para criar uma nova turma</CardDescription>
                    </div>

                    <BookUser className="h-8 w-8 text-blue-600" />
                </CardHeader>
            </Card>
            <CreateClassDialog
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
            />
        </>
    )
}