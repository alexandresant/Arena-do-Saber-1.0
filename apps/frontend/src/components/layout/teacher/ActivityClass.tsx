"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClassProps } from "@/types/types"

export function ActivtyClass({ turma}: {turma: ClassProps | null}) {
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Atividades nesta turma</CardTitle>
                <CardDescription>Turma {turma?.name}</CardDescription>
            </CardHeader>
            <CardContent>
                <ul>
                    {turma?.activities?.map((op) =>(
                        <li
                            key={op.id}
                        >
                            {op.name}
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}