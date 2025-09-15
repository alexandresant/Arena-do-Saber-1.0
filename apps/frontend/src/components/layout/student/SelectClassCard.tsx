"use client"

import { useState, useEffect } from "react"
import { getClasses } from "@/lib/api/classService"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
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
import { Loader2, Users, BookOpen } from "lucide-react"

// Esquema de validação com Zod
const joinClassSchema = z.object({
  code: z.string()
    .min(1, { message: "O código da turma é obrigatório" })
    .regex(/^[a-zA-Z0-9]+$/, { message: "O código deve conter apenas letras e números" })
})

// Tipo inferido a partir do esquema Zod
type JoinClassFormValues = z.infer<typeof joinClassSchema>

// Interface para os dados da turma
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

// Dados mockados para as turmas do usuário
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
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [userClasses, setUserClasses] = useState<Class[]>([])
  const [isLoadingClasses, setIsLoadingClasses] = useState(true)

  // Simula o carregamento das turmas do usuário
  useEffect(() => {
    const loadUserClasses = async () => {
      // Simula um delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000))
      setUserClasses(mockClasses)
      setIsLoadingClasses(false)
    }

    loadUserClasses()
  }, [])

  // Configuração do formulário com React Hook Form e validação Zod
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
      // Simula a chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Verifica se o código já existe
      const classExists = mockClasses.some(c => c.code === data.code)
      
      if (classExists) {
        setMessage("Você já está nesta turma!")
      } else {
        // Adiciona uma nova turma à lista (apenas para demonstração)
        const newClass: Class = {
          id: (mockClasses.length + 1).toString(),
          code: data.code,
          name: `Nova Turma ${data.code}`,
          teacher: "Professor",
          subject: "Matéria",
          studentCount: 20,
          activityCount: 0,
          joinedAt: new Date().toISOString().split('T')[0]
        }
        
        setUserClasses(prev => [...prev, newClass])
        setMessage("Inscrição realizada com sucesso!")
      }
      
      form.reset() // Limpar o formulário após sucesso
    } catch (err: any) {
      setMessage(err.message || "Erro ao entrar na turma")
    } finally {
      setLoading(false)
    }
  }

  // Função para simular a navegação para a página da turma
  const handleClassClick = (classId: string) => {
    // Aqui você pode usar o useRouter do Next.js quando implementar
    console.log(`Navegando para a turma: ${classId}`)
    // router.push(`/class/${classId}`)
    alert(`Navegando para a página da turma ${classId}. Esta funcionalidade será implementada.`)
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Entrar em uma turma</CardTitle>
          <CardDescription>
            Digite o código da turma fornecida pelo seu professor
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
                    <FormLabel>Código da turma</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: ABC123" 
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
                    Entrando...
                  </>
                ) : (
                  "Entrar na turma"
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
          <CardTitle>Minhas Turmas</CardTitle>
          <CardDescription>
            Turmas que você está participando
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
              <p>Você não está em nenhuma turma ainda.</p>
              <p className="text-sm">Entre em uma turma usando o código fornecido pelo seu professor.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matéria</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Professor</TableHead>         
                  <TableHead className="text-center">Atividades</TableHead>
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