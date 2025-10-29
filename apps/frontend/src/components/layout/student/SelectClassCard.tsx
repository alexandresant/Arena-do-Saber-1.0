// JoinClassForm.tsx
"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"
import { loadClasses } from "@/lib/api/loadClasses"

import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, BookOpen } from "lucide-react"

const joinClassSchema = z.object({
  code: z.string()
    .min(1, { message: "O código da turma é obrigatório" })
    .regex(/^[a-zA-Z0-9]+$/, { message: "O código deve conter apenas letras e números" })
})

type JoinClassFormValues = z.infer<typeof joinClassSchema>

interface Class {
  id: string
  code: string
  name: string
  teacher: string
  subject: string
  activityCount: number
}

export function JoinClassForm() {
  const t = useTranslations("StudentDashboardPage.JoinClassForm")

  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [classes, setClasses] = useState<Class[]>([])
  const [isLoadingClasses, setIsLoadingClasses] = useState(true)

  const form = useForm<JoinClassFormValues>({
    resolver: zodResolver(joinClassSchema),
    defaultValues: { code: "" },
  })

  // 🔹 Carrega turmas com tratamento seguro
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoadingClasses(true)
        const response = await loadClasses()

        const mappedClasses: Class[] = response.map((c: any) => ({
          id: c?.id ?? "",
          code: c?.code ?? "",
          name: c?.name ?? t("unknownClass"),
          teacher: c?.teacher?.username ?? t("unknownTeacher"),
          subject: c?.subject ?? t("unknownSubject"),
          activityCount: c?.activityCount ?? 0,
        }))

        setClasses(mappedClasses)
      } catch (err) {
        console.error("Erro ao carregar turmas:", err)
      } finally {
        setIsLoadingClasses(false)
      }
    }

    fetchClasses()
  }, [t])

  const onSubmit = async (data: JoinClassFormValues) => {
    setLoading(true)
    setMessage(null)

    try {
      // Lógica simulada de inscrição
      await new Promise(resolve => setTimeout(resolve, 1000))
      setMessage(t("success"))
      form.reset()
    } catch (err: any) {
      setMessage(err?.message ?? t("error"))
    } finally {
      setLoading(false)
    }
  }

  const handleClassClick = (classId: string) => {
    alert(t("navigate", { id: classId }))
  }

  return (
    <div className="space-y-6">
      {/* Formulário para entrar em turma */}
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("classCodeLabel")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("classCodePlaceholder")}
                        {...field}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("loading")}
                  </>
                ) : t("submit")}
              </Button>
              {message && (
                <p className={`text-sm ${message.includes("sucesso") ? "text-green-600" : "text-destructive"}`}>
                  {message}
                </p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Lista de turmas */}
      <Card>
        <CardHeader>
          <CardTitle>{t("myClassesTitle")}</CardTitle>
          <CardDescription>{t("myClassesDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingClasses ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : classes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>{t("noClasses")}</p>
              <p className="text-sm">{t("joinWithCode")}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("subject")}</TableHead>
                  <TableHead>{t("class")}</TableHead>
                  <TableHead>{t("teacher")}</TableHead>
                  <TableHead className="text-center">{t("activities")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((classItem) => (
                  <TableRow
                    key={classItem.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleClassClick(classItem.id)}
                  >
                    <TableCell>{classItem.subject}</TableCell>
                    <TableCell>
                      <div>{classItem.name}</div>
                      <div className="text-sm text-muted-foreground">{classItem.code}</div>
                    </TableCell>
                    <TableCell>{classItem.teacher}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant={classItem.activityCount > 0 ? "default" : "secondary"}>
                        {classItem.activityCount}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
