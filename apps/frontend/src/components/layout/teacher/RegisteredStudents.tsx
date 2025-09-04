import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ClassProps } from "@/types/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function RegisteredStudents({ turma }: { turma: ClassProps | null }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Alunos nesta turma</CardTitle>
                <CardDescription>Turma {turma?.nome}</CardDescription>
            </CardHeader>
            <CardContent>
                {turma ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>NickName</TableHead>
                                <TableHead>Nivel</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {turma.alunos.map((tu) => (
                                <TableRow
                                    key={tu.id}
                                >
                                    <TableCell>{tu.nome}</TableCell>
                                    <TableCell>{tu.nickName}</TableCell>
                                    <TableCell>{tu.level}</TableCell>
                                </TableRow>
                            ))}

                        </TableBody>
                    </Table>
                ) : (
                    <Label>Selecione uma turma para ver os alunos</Label>
                )}
            </CardContent>
        </Card>
    )
}