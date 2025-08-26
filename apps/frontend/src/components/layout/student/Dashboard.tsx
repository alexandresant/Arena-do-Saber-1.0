import { Card, CardContent, CardHeader, CardDescription, CardTitle} from "@/components/ui/card"

export function StudentDashboard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Dashboard do Estudante</CardTitle>
                <CardDescription>Bem-vindo ao seu painel!</CardDescription>
            </CardHeader>
            <CardContent>
                <p>Aqui você pode ver suas atividades recentes, progresso e muito mais.</p>
            </CardContent>
        </Card>
    )
}