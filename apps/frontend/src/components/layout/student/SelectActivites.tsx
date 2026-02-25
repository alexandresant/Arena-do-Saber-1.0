"use client"

import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen, Home, Trophy } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"
import { ActivityProps } from "@/types/types"
import { loadActivities } from "@/lib/api/loadActivities"
import { Button } from "@/components/ui/button"
import { useRouter } from "@/i18n/navigation"
import { useSearchParams } from "next/navigation"
import { submitPoints } from "@/lib/api/submitPoints"
// 🎯 Importação do Sonner
import { toast } from "sonner" 
import { useSession } from "next-auth/react"

export function SelectActivities() {
  const t = useTranslations("SelectActivities")
  const router = useRouter()
  const searchParams = useSearchParams()
  // ❌ REMOVIDO: const { toast } = useToast() 
  const classId = searchParams.get("classId")
  const className = searchParams.get("className")

  const [activities, setActivities] = useState<ActivityProps[]>([])
  const [selectedActivity, setSelectedActivity] = useState<ActivityProps | null>(null)
  const [answers, setAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({})
  const [isFinished, setIsFinished] = useState(false)
  const [score, setScore] = useState({ correctCount: 0, totalPoints: 0 })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const session = useSession()

  useEffect(() => {
    const fetchActivities = async () => {
      const loadedActivities = await loadActivities(classId || "")
      setActivities(loadedActivities)
    }
    fetchActivities()
  }, [classId])

  const getQuestionCount = (activity: ActivityProps): number => {
    return activity.questions?.length || 0
  }

  const selectAnswer = (questionId: number, option: "A" | "B" | "C" | "D") => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }))
  }

  const allAnswered =
    selectedActivity &&
    selectedActivity.questions.every((q) => answers[q.id] !== undefined)

  const finishActivity = () => {
    if (!selectedActivity) return

    let correctCount = 0
    let totalPoints = 0

    selectedActivity.questions.forEach((q) => {
      if (answers[q.id] === q.correct) {
        correctCount++
        totalPoints += q.points
      }
    })

    setScore({ correctCount, totalPoints })
    setIsFinished(true)
  }

  const resetActivity = () => {
    setIsFinished(false)
    setAnswers({})
    setScore({ correctCount: 0, totalPoints: 0 })
    setIsSubmitted(false)
  }

  // ✅ Função que envia a pontuação usando o Sonner
  const submmitActivityPoints = async () => {
    try {
      setIsSubmitting(true)
      const success = await submitPoints(score.totalPoints, session.data?.user.id || "")
      setIsSubmitting(false)
      setIsSubmitted(success)

      if (success) {
        // Sonner para sucesso: mensagem simples e opcionalmente um título
        toast.success("Pontuação enviada!", {
          description: `Você ganhou ${score.totalPoints} pontos nesta atividade.`,
        })
      } else {
        // Sonner para erro: usa toast.error() para estilo destrutivo
        toast.error("Erro ao enviar pontuação", {
          description: "Tente novamente mais tarde.",
        })
      }
    } catch (error) {
      console.error("Erro ao enviar pontuação:", error)
      setIsSubmitting(false)
      // Sonner para erro inesperado
      toast.error("Erro inesperado", {
        description: "Ocorreu um erro ao enviar sua pontuação.",
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col-2 gap-2 justify-between items-center">
        <div>
          <CardTitle>Turma {className}</CardTitle>
          <CardDescription>Selecione uma atividade</CardDescription>
        </div>
        <div>
          <Button
            className="bg-transparent border text-gray-100 hover:text-gray-700"
            onClick={() => router.push("/student-dashboard")}
          >
            <Home />
            Home
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>{t("noActivities")}</p>
          </div>
        ) : (
          <>
            {/* LISTA DE ATIVIDADES */}
            {!selectedActivity && (
              <div className="overflow-x-auto mb-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome da Atividade</TableHead>
                      <TableHead className="text-right">Questões</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {activities.map((activity) => (
                      <TableRow
                        key={activity.id}
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => {
                          setSelectedActivity(activity)
                          setAnswers({})
                          setIsFinished(false)
                        }}
                      >
                        <TableCell className="font-medium">{activity.name}</TableCell>
                        <TableCell className="text-right">
                          {getQuestionCount(activity)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* QUESTÕES */}
            {selectedActivity && !isFinished && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">
                  Perguntas de: {selectedActivity.name}
                </h3>

                {selectedActivity.questions.map((q) => (
                  <Card key={q.id} className="bg-muted">
                    <CardContent>
                      <p className="font-medium mb-2">{q.description}</p>
                      <ul className="list-none space-y-2">
                        {(["A", "B", "C", "D"] as const).map((option) => {
                          const text = q[`answer${option}`]
                          const isSelected = answers[q.id] === option
                          return (
                            <li
                              key={option}
                              className={`p-2 border rounded cursor-pointer hover:bg-primary/10 transition-colors ${
                                isSelected ? "bg-primary/20 border-primary" : "border-transparent"
                              }`}
                              onClick={() => selectAnswer(q.id, option)}
                            >
                              {option}: {text}
                            </li>
                          )
                        })}
                      </ul>
                    </CardContent>
                  </Card>
                ))}

                {allAnswered && (
                  <div className="text-center mt-6">
                    <Button onClick={finishActivity}>Finalizar Atividade</Button>
                  </div>
                )}
              </div>
            )}

            {/* RESULTADO */}
            {isFinished && selectedActivity && (
              <div className="text-center space-y-4">
                <Trophy className="mx-auto h-10 w-10 text-yellow-500" />
                <h3 className="text-xl font-semibold">Resultado</h3>
                <p>
                  Você acertou{" "}
                  <strong>{score.correctCount}</strong> de{" "}
                  <strong>{selectedActivity.questions.length}</strong> questões!
                </p>
                <p>
                  Pontuação total:{" "}
                  <strong>{score.totalPoints}</strong> pontos
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
                  <Button variant="outline" onClick={resetActivity}>
                    Refazer Atividade
                  </Button>

                  <Button
                    onClick={submmitActivityPoints}
                    disabled={isSubmitting || isSubmitted}
                  >
                    {isSubmitting
                      ? "Enviando..."
                      : isSubmitted
                      ? "Pontuação Enviada ✅"
                      : "Enviar Pontuação"}
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}