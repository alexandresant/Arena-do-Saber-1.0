"use client"

import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"
import { ActivityProps } from "@/types/types"
import { loadActivities } from "@/lib/api/loadActivities"

// === COMPONENTE ===
export function SelectActivities() {
  const t = useTranslations("SelectActivities")

  const [activities, setActivities] = useState<ActivityProps[]>([])
  const [selectedActivity, setSelectedActivity] = useState<ActivityProps | null>(null)
  const [answers, setAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({})

  useEffect(() => {
    const fetchActivities = async () => {
      const loadedActivities = await loadActivities()
      setActivities(loadedActivities)
    }

    fetchActivities()
  }, [])


  const getQuestionCount = (activity: ActivityProps): number => {
    return activity.questions?.length || 0
  }

  // Seleciona a resposta para uma pergunta
  const selectAnswer = (questionId: number, option: "A" | "B" | "C" | "D") => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Turma Arduino</CardTitle>
        <CardDescription>Selecione uma atividade</CardDescription>
      </CardHeader>

      <CardContent>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <BookOpen className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>{t("noActivities")}</p>
          </div>
        ) : (
          <>
            {/* TABELA DE ATIVIDADES */}
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
                        setAnswers({}) // limpa respostas anteriores
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

            {/* SEÇÃO DE QUESTÕES */}
            {selectedActivity && (
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
                              className={`p-2 border rounded cursor-pointer hover:bg-primary/10 ${
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
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
