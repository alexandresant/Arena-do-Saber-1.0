"use client"

import { useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FilePlus2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { createActivity } from "@/lib/api/createActivty"
import { CreateQuestionDialog } from "./CreateQuestionsDialog"

const mockTurmas = [
  { id: 1, name: "Turma A - 1º Ano" },
  { id: 2, name: "Turma B - 2º Ano" },
  { id: 3, name: "Turma C - 3º Ano" },
  { id: 4, name: "Turma D - 4º Ano" },
]

const activitySchema = z.object({
  name: z.string().min(3, "Digite um nome para a atividade!"),
  classId: z.string().min(1, "Turma é obrigatória!"),
})

type ActivityForm = z.infer<typeof activitySchema>

export function CreateActivityCard() {
  const [openActivityDialog, setOpenActivityDialog] = useState(false)
  const [openQuestionDialog, setOpenQuestionDialog] = useState(false)
  const [activityId, setActivityId] = useState<number | null>(null)

  const form = useForm<ActivityForm>({
    resolver: zodResolver(activitySchema),
    defaultValues: { name: "", classId: "" },
  })

  async function onSubmit(values: ActivityForm) {
    try {
      const res = await createActivity(values)
      const id = res.data.id

      setActivityId(id)
      setOpenActivityDialog(false)
      setOpenQuestionDialog(true) // abre dialog de questões automaticamente
    } catch (err) {
      console.error("Erro ao criar atividade", err)
    }
  }

  return (
    <>
      <Card onClick={() => setOpenActivityDialog(true)}>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>+ Criar nova atividade</CardTitle>
            <CardDescription>Clique aqui e crie uma nova atividade</CardDescription>
          </div>
          <FilePlus2 className="w-8 h-8 text-blue-600" />
        </CardHeader>
      </Card>

      <Dialog open={openActivityDialog} onOpenChange={setOpenActivityDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar nova atividade</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="classId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Turma</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione uma turma" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {mockTurmas.map((t) => (
                          <SelectItem key={t.id} value={String(t.id)}>
                            {t.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Atividade</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Prova de Matemática" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Criar Atividade
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {activityId && (
        <CreateQuestionDialog
          open={openQuestionDialog}
          onOpenChange={setOpenQuestionDialog}
          activityId={activityId}
        />
      )}
    </>
  )
}
