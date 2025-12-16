"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function SubjectCard() {

    const router = useRouter()
    return (
        <Card>
            <CardHeader>
                <CardTitle>Estude um contéudo</CardTitle>
                <CardDescription>Clique no botão e escolha uma disciplina para começar a estudar</CardDescription>
            </CardHeader>
            <CardContent>
                <Button
                    className="w-full"
                    onClick={() => router.push("/select-subject")}
                >
                    Escolher disciplina
                </Button>
            </CardContent>
        </Card>
    )

}