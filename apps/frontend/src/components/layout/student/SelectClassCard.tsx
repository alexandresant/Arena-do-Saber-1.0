"use client"

import { useState, useEffect } from "react"
import { getClasses } from "@/lib/api/classService"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTranslations } from "next-intl"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, BookOpen } from "lucide-react"

import { loadClassStudents } from "@/lib/api/classService"

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
  studentCount: number
  activityCount: number
  joinedAt: string
}

const mockClasses: Class[] = [
  {
    id: "1",
    code: "MAT2024",
    name: "Matemática Avançada",
    teacher: "Prof. Silva",
    subject: "Matemática",
    studentCount: 32,
    activityCount: 5,
    joinedAt: "2024-01-15"
  },
  {
    id: "2",
    code: "FIS101",
    name: "Física Básica",
    teacher: "Prof. Costa",
    subject: "Física",
    studentCount: 28,
    activityCount: 3,
    joinedAt: "2024-02-10"
  },
  {
    id: "3",
    code: "PROG123",
    name: "Programação Web",
    teacher: "Prof. Oliveira",
    subject: "Informática",
    studentCount: 25,
    activityCount: 7,
    joinedAt: "2024-01-20"
  }
]

export function JoinClassForm() {
  const t = useTranslations("StudentDashboardPage.JoinClassForm")

  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [userClasses, setUserClasses] = useState<Class[]>([])
  const [isLoadingClasses, setIsLoadingClasses] = useState(true)
  const [turmas, setTurmas] = useState<Class[]>([])

  useEffect(() => {
    const loadUserClasses = async () =>{
      const classes = await loadClassStudents()
      setTurmas(classes)
    }
    loadUserClasses()

  }, [])

  useEffect(() => {
    const loadUserClasses = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUserClasses(mockClasses)
      setIsLoadingClasses(false)
    }
    loadUserClasses()
  }, [])

  const form = useForm<JoinClassFormValues>({
    resolver: zodResolver(joinClassSchema),
    defaultValues: {
      code: "",
    },
  })

  const onSubmit = async (data: JoinClassFormValues) => {
    setLoading(true)
    setMessage(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const classExists = mockClasses.some(c => c.code === data.code)
      
      if (classExists) {
        setMessage(t("alreadyEnrolled"))
      } else {
        const newClass: Class = {
          id: (mockClasses.length + 1).toString(),
          code: data.code,
          name: t("newClass", { code: data.code }),
          teacher: t("defaultTeacher"),
          subject: t("defaultSubject"),
          studentCount: 20,
          activityCount: 0,
          joinedAt: new Date().toISOString().split('T')[0]
        }
        
        setUserClasses(prev => [...prev, newClass])
        setMessage(t("success"))
      }
      
      form.reset()
    } catch (err: any) {
      setMessage(err.message || t("error"))
    } finally {
      setLoading(false)
    }
  }

  const handleClassClick = (classId: string) => {
    console.log(`Navegando para a turma: ${classId}`)
    alert(t("navigate", { id: classId }))
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>
            {t("description")}
          </CardDescription>
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
              
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("loading")}
                  </>
                ) : (
                  t("submit")
                )}
              </Button>
              
              {message && (
                <p className={`text-sm ${
                  message.includes("sucesso") || !message.includes("Erro")
                    ? "text-green-600" 
                    : "text-destructive"
                }`}>
                  {message}
                </p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("myClassesTitle")}</CardTitle>
          <CardDescription>
            {t("myClassesDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingClasses ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : userClasses.length === 0 ? (
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
                {userClasses.map((classItem) => (
                  <TableRow 
                    key={classItem.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleClassClick(classItem.id)}
                  >
                    <TableCell>
                      <div className="font-medium">{classItem.subject}</div>
                    </TableCell>
                    <TableCell>
                      <div>{classItem.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {classItem.code}
                      </div>
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
