"use client"

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, ClipboardList, Award, GraduationCap } from "lucide-react"
import { DisciplineCard } from "@/components/layout/student/SelectSubject"
import { DashboardLayout } from './Dashboard'
import { SelectActivities } from "@/components/layout/student/SelectActivites"
import { JoinClassForm } from './SelectClassCard'
// import { SelectCertificate } from "./SelectCertificate"

export function StudentDashboardArea() {
    return (
        <DashboardLayout>
            <div className="w-full space-y-8">
            {/* Cabeçalho da Área do Aluno */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                    <GraduationCap className="h-8 w-8 text-primary" />
                    Área do Estudante
                </h1>
                <p className="text-muted-foreground">
                    Gerencie seus estudos, atividades e conquistas em um só lugar.
                </p>
            </div>

            <Tabs defaultValue="materias" className="w-full">
                {/* Menu de Abas Estilizado */}
                <TabsList className="grid w-full grid-cols-3 mb-8 h-12 bg-muted/50 p-1">
                    <TabsTrigger value="materias" className="flex items-center gap-2 text-base">
                        <BookOpen className="h-4 w-4" />
                        Matérias
                    </TabsTrigger>
                    <TabsTrigger value="questionarios" className="flex items-center gap-2 text-base">
                        <ClipboardList className="h-4 w-4" />
                        Questionários
                    </TabsTrigger>
                    <TabsTrigger value="certificados" className="flex items-center gap-2 text-base">
                        <Award className="h-4 w-4" />
                        Certificados
                    </TabsTrigger>
                </TabsList>

                {/* Conteúdo das Matérias */}
                <TabsContent value="materias" className="border-none p-0 outline-none">
                    <DisciplineCard />
                </TabsContent>

                {/* Conteúdo dos Questionários */}
                <TabsContent value="questionarios" className="border-none p-0 outline-none">
                   <JoinClassForm />
                </TabsContent>

                {/* Conteúdo dos Certificados */}
                <TabsContent value="certificados" className="border-none p-0 outline-none">
                    <Card className="border-dashed bg-background/50">
                        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                            {/* Aqui entra seu componente <SelectCertificate /> */}
                            <div className="rounded-full bg-primary/10 p-4 mb-4">
                                <Award className="h-8 w-8 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">Certificados</h3>
                            <p className="text-muted-foreground max-w-sm">
                                Emita seus certificados após a conclusão das disciplinas.
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
        </DashboardLayout>
    )
}