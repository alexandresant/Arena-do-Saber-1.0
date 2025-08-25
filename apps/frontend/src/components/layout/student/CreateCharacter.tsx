"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function CreateCharacter(){
    return(
        <Card>
            <CardHeader>
                <CardTitle>Crie seu personagem</CardTitle>
                <CardDescription>Escolha entre os valorosos personagens e embarque nesta aventura de aprendizado</CardDescription>
            </CardHeader>
            <CardContent>
                Guerreiro
                Mago
                Arqueiro
                Mestre das Feras
            </CardContent>
        </Card>
    )
}