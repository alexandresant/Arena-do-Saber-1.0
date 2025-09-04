"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClassCard } from "./ClassCard"
import { StudentQtdCard } from "./StudentQtdCard"
import { CreateClassCard } from "./CreateClassCard"
import { CreateActivityCard } from "./CreateActivityCard"
import { RegisteredStudents } from "./RegisteredStudents"
import { useState } from "react"
import type { ClassProps } from "@/types/types"
import { ActivtyClass } from "./ActivityClass"

export const mockTurmas = [
    {
        id: 1,
        nome: "Turma A - 1º Ano",
        alunos: [
            { id: 1, nome: "Ana Santos", nickName: "LadyArcana", level: 85 },
            { id: 2, nome: "João Silva", nickName: "ShadowMage", level: 42 },
            { id: 3, nome: "Maria Oliveira", nickName: "MysticLuna", level: 91 },
            { id: 4, nome: "Pedro Lima", nickName: "SirValorant", level: 67 },
            { id: 5, nome: "Camila Pereira", nickName: "CrimsonThief", level: 55 },
            { id: 6, nome: "Lucas Souza", nickName: "DragonSlayer", level: 78 },
            { id: 7, nome: "Beatriz Costa", nickName: "AetherBlade", level: 88 },
            { id: 8, nome: "Gabriel Martins", nickName: "NightProwler", level: 94 },
            { id: 9, nome: "Isabela Fernandes", nickName: "Faelan", level: 73 },
            { id: 10, nome: "Thiago Rocha", nickName: "ThunderStrike", level: 81 },
        ],
    },
    {
        id: 2,
        nome: "Turma B - 2º Ano",
        alunos: [
            { id: 11, nome: "Larissa Almeida", nickName: "StarGazer", level: 96 },
            { id: 12, nome: "Rafael Ribeiro", nickName: "BladeRider", level: 62 },
            { id: 13, nome: "Juliana Castro", nickName: "JulietteGrace", level: 75 },
            { id: 14, nome: "Felipe Gomes", nickName: "GhostWalker", level: 89 },
            { id: 15, nome: "Sofia Cardoso", nickName: "SoulHarvester", level: 58 },
            { id: 16, nome: "Daniel Mendes", nickName: "Dreadnought", level: 90 },
            { id: 17, nome: "Amanda Dias", nickName: "Amaterasu", level: 45 },
            { id: 18, nome: "Gustavo Ferreira", nickName: "Vanguard", level: 84 },
            { id: 19, nome: "Bruna Gonçalves", nickName: "BrujaEscarlate", level: 77 },
            { id: 20, nome: "Eduardo Henrique", nickName: "VoidBreaker", level: 93 },
            { id: 23, nome: "Alex Henrique", nickName: "AlexTheGrey", level: 69 },
        ],
    },
    {
        id: 3,
        nome: "Turma C - 3º Ano",
        alunos: [
            { id: 24, nome: "Mariana Costa", nickName: "IronMaiden", level: 98 },
            { id: 25, nome: "Lucas Pereira", nickName: "Emberheart", level: 71 },
            { id: 26, nome: "Gabriela Almeida", nickName: "Gryphon", level: 82 },
            { id: 27, nome: "Bruno Silva", nickName: "AxeFury", level: 86 },
            { id: 28, nome: "Julia Santos", nickName: "FrostBite", level: 60 },
            { id: 29, nome: "Leonardo Mendes", nickName: "SentinelPrime", level: 95 },
            { id: 30, nome: "Carla Ribeiro", nickName: "Wildflame", level: 53 },
        ],
    },
];


export function TeacherDashboard() {
    const [turmaSelecionada, setTurmaSelecionada] = useState<ClassProps | null>(null)

    function turmasFiltradas({ turmas }: { turmas: ClassProps }) {
        const turmasFiltradas = turmas
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
                        turmas={mockTurmas}
                        turmaSelecionada={turmaSelecionada}
                        onClassSelect={setTurmaSelecionada}
                    />
                    <StudentQtdCard qtdAlunos={turmaSelecionada?.alunos.length ?? 0} />
                    <CreateClassCard />
                    <CreateActivityCard />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 mt-2 gap-2">
                    <RegisteredStudents turma={turmaSelecionada} />
                    <ActivtyClass />
                </div>
            </CardContent>
        </Card>
    )
}