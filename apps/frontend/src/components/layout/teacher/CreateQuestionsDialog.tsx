"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { createQuestion } from "@/lib/api/createQuestions"
import { useState } from "react"

const questionSchema = z.object({
  description: z.string().min(3, "Digite uma questão válida!"),
  answerA: z.string().min(1, "Digite uma resposta"),
  answerB: z.string().min(1, "Digite uma resposta"),
  answerC: z.string().min(1, "Digite uma resposta"),
  answerD: z.string().min(1, "Digite uma resposta"),
  correct: z.enum(["A", "B", "C", "D"], "Selecione a opção correta"),
  points: z.number().min(1, "Defina os pontos da questão"),
})

type QuestionForm = z.infer<typeof questionSchema>

export function CreateQuestionDialog({
  open,
  onOpenChange,
  activityId,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  activityId: number
}) {
  const form = useForm<QuestionForm>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      description: "",
      answerA: "",
      answerB: "",
      answerC: "",
      answerD: "",
      correct: "A",
      points: 0,
    },
  })

  async function onSubmit(data: QuestionForm) {
    try {
      //console.log("Id enviado: ", activityId)
      await createQuestion({ ...data, activityId }) // envia para a Activity correta
      form.reset()
    } catch (err) {
      console.error("Erro ao enviar questão", err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Questão</DialogTitle>
          <DialogDescription>Cadastre as questões da atividade</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Questão</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descrição da questão" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answerA"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resposta A</FormLabel>
                  <FormControl>
                    <Input placeholder="Resposta A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answerB"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resposta B</FormLabel>
                  <FormControl>
                    <Input placeholder="Resposta B" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answerC"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resposta C</FormLabel>
                  <FormControl>
                    <Input placeholder="Resposta C" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answerD"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resposta D</FormLabel>
                  <FormControl>
                    <Input placeholder="Resposta D" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="correct"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opção correta</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a opção correta" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="points"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pontos</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value === 0 ? "" : field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Cadastrar Questão
            </Button>
            
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
