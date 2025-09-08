"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClassCard } from "./ClassCard"
import { StudentQtdCard } from "./StudentQtdCard"
import { CreateClassCard } from "./CreateClassCard"
import { CreateActivityCard } from "./CreateActivityCard"
import { RegisteredStudents } from "./RegisteredStudents"
import { useState, useEffect } from "react"
import type { ClassProps } from "@/types/types"
import { ActivtyClass } from "./ActivityClass"
import { loadClass } from "@/lib/api/createClass"

export function TeacherDashboard() {
    const [turmaSelecionada, setTurmaSelecionada] = useState<ClassProps | null>(null)
    const [turmas, setTurmas] = useState<ClassProps[]>([])

    useEffect(() => {
        async function fetchTurmas() {
            try {
                const data = await loadClass();
                setTurmas(data);
            } catch (error) {
                console.error('Failed to load classes:', error);
            }
        }

        fetchTurmas()
    }, [])

    if (turmas.length === 0) {
        return <div>Carregando turmas...</div>;
    }


    const teacher = "Alexandre Buhrer"
    return (
        <Card>
            <CardHeader>
                <CardTitle>Arena do Saber Painel do Professor</CardTitle>
                <CardDescription>Bem vindo de volta professor {teacher}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <ClassCard
                        turmas={turmas}
                        turmaSelecionada={turmaSelecionada}
                        onClassSelect={setTurmaSelecionada}
                    />
                    <StudentQtdCard qtdAlunos={turmaSelecionada?.student.length} />
                    <CreateClassCard />
                    <CreateActivityCard />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 mt-2 gap-2">
                    <RegisteredStudents turma={turmaSelecionada} />
                    <ActivtyClass
                        turma={turmaSelecionada} />
                </div>
            </CardContent>
        </Card>
    )
}