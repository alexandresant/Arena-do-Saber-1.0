"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DashboardLayout } from "../student/Dashboard"

export function Shop() {
    return (
        <DashboardLayout>
            <Card>
                <CardHeader>
                    <CardTitle>Loja</CardTitle>
                    <CardDescription>Em desenvolvimento</CardDescription>
                </CardHeader>
                <CardContent>
                    Em breve aqui loja de itens, skins e muito mais!
                </CardContent>

            </Card>
        </DashboardLayout>
    )
}