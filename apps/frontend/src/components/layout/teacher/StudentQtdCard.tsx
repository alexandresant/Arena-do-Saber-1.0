"use client"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap } from "lucide-react"

export function StudentQtdCard({ qtdAlunos }: { qtdAlunos: number }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex flex-row items-center justify-between">
                    <div className="flex flex-col space-y-2">
                        <CardTitle>Quantidade de alunos na turma</CardTitle>
                        <CardDescription>{qtdAlunos} Alunos nesta turma </CardDescription>
                    </div>
                    <GraduationCap className="h-8 w-8 text-blue-600"/>
                </div>
            </CardHeader>
        </Card>)
}