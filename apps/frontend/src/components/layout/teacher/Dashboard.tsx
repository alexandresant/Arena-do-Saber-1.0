"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { TeacherDashboardProps } from "@/types/types"
import { ClassCard } from "./ClassCard"
import { StudentQtdCard } from "./StudentQtdCard"
import { CreateClassCard } from "./CreateClassCard"


export function TeacherDashboard(){
    const teacher = "Alexandre Buhrer"
    return(
        <Card>
            <CardHeader>
                <CardTitle>Arena do Saber Painel do Professor</CardTitle>
                <CardDescription>Bem vindo de volta professor {teacher}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                    <ClassCard />
                    <StudentQtdCard 
                        qtdAlunos={10}
                    />
                    <CreateClassCard />
                </div>
            </CardContent>
        </Card>
    )
}