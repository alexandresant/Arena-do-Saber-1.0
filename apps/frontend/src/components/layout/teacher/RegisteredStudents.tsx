import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ClassProps } from "@/types/types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTranslations } from "next-intl"

export function RegisteredStudents({ turma }: { turma: ClassProps | null }) {
    const t = useTranslations("TeacherDashboardPage.RegisteredStudents")

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("CardTitle")}</CardTitle>
                <CardDescription>{t("ClassLabel")} {turma?.name}</CardDescription>
            </CardHeader>
            <CardContent>
                {turma ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("TableHeadName")}</TableHead>
                                <TableHead>{t("TableHeadNickName")}</TableHead>
                                <TableHead>{t("TableHeadLevel")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {turma.student.map((tu) => (
                                <TableRow key={tu.id}>
                                    <TableCell>{tu.username}</TableCell>
                                    <TableCell>{tu.nickName}</TableCell>
                                    <TableCell>{tu.level}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Label>{t("SelectClassLabel")}</Label>
                )}
            </CardContent>
        </Card>
    )
}
