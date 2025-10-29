"use client"

import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen } from "lucide-react"
import { useTranslations } from "next-intl"
import { useState, useEffect } from "react"
import { ActivityProps } from "@/types/types"

// === MOCK DATA ===
export const mockActivity: ActivityProps = {
  name: "Introdução ao Arduino",
  classId: 1,
  attributes: {
    name: "Introdução ao Arduino",
    questions: {
      data: [
        {
          id: 1,
          attributes: {
            description: "O que é o Arduino?",
            answerA: "Um software de edição de imagens",
            answerB: "Uma plataforma de prototipagem eletrônica de hardware e software livre",
            answerC: "Um tipo de sensor utilizado em robótica",
            answerD: "Um microcontrolador proprietário da Intel",
            correct: "B",
            points: 10,
          },
        },
        {
          id: 2,
          attributes: {
            description: "Qual é a função principal da placa Arduino Uno?",
            answerA: "Executar sistemas operacionais complexos",
            answerB: "Compilar programas escritos em Python",
            answerC: "Controlar circuitos eletrônicos a partir de código carregado na placa",
            answerD: "Fazer medições de temperatura ambiente apenas",
            correct: "C",
            points: 10,
          },
        },
        {
          id: 3,
          attributes: {
            description: "Em qual linguagem de programação o Arduino é programado?",
            answerA: "C/C++",
            answerB: "Java",
            answerC: "Python",
            answerD: "Assembly",
            correct: "A",
            points: 10,
          },
        },
        {
          id: 4,
          attributes: {
            description: "Qual pino do Arduino é geralmente usado para enviar sinais PWM?",
            answerA: "Pinos marcados com o símbolo ~ (til)",
            answerB: "Pino A0",
            answerC: "Pino GND",
            answerD: "Pino VIN",
            correct: "A",
            points: 10,
          },
        },
        {
          id: 5,
          attributes: {
            description: "Qual componente é usado para carregar o código na placa Arduino?",
            answerA: "Cabo de energia de 12V",
            answerB: "Cartão SD",
            answerC: "Cabo USB",
            answerD: "Conexão Bluetooth",
            correct: "C",
            points: 10,
          },
        },
      ],
    },
  },
}

// === COMPONENTE ===
export function SelectActivities() {
  const t = useTranslations("SelectActivities")

  const [activities, setActivities] = useState<ActivityProps[]>([])
  const [selectedActivity, setSelectedActivity] = useState<ActivityProps | null>(null)
  const [answers, setAnswers] = useState<Record<number, "A" | "B" | "C" | "D">>({})

  useEffect(() => {
    setActivities([mockActivity])
  }, [])

  const getQuestionCount = (activity: ActivityProps): number => {
    return activity.attributes.questions?.data?.length || 0
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
            <p className="text-sm">{t("joinWithCode")}</p>
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
                      key={activity.classId}
                      className="cursor-pointer hover:bg-muted"
                      onClick={() => {
                        setSelectedActivity(activity)
                        setAnswers({}) // limpa respostas anteriores
                      }}
                    >
                      <TableCell className="font-medium">{activity.attributes.name}</TableCell>
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
                  Perguntas de: {selectedActivity.attributes.name}
                </h3>

                {selectedActivity.attributes.questions.data.map((q) => (
                  <Card key={q.id} className="bg-muted">
                    <CardContent>
                      <p className="font-medium mb-2">{q.attributes.description}</p>
                      <ul className="list-none space-y-2">
                        {(["A", "B", "C", "D"] as const).map((option) => {
                          const text = q.attributes[`answer${option}`]
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
