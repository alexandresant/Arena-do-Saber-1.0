import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FilePlus2 } from "lucide-react"

const mockTurmas = [
    { id: 1, name: "Turma A - 1º Ano" },
    { id: 2, name: "Turma B - 2º Ano" },
    { id: 3, name: "Turma C - 3º Ano" },
    { id: 4, name: "Turma D - 4º Ano" },
    { id: 5, name: "Turma E - 5º Ano" },
    { id: 6, name: "Turma F - 6º Ano" },
    { id: 7, name: "Turma G - 7º Ano" },
    { id: 8, name: "Turma H - 8º Ano" },
    { id: 9, name: "Turma I - 9º Ano" },
    { id: 10, name: "Turma J - 1º EM" }
]

const formSchema = z.object({
    question: z.string().min(3, "Digite uma questão válida  !"),
    answerA: z.string().min(1, "Digite uma resposta"),
    answerB: z.string().min(1, "Digite uma resposta"),
    answerC: z.string().min(1, "Digite uma resposta"),
    answerD: z.string().min(1, "Digite uma resposta"),
    correct: z.enum(["A", "B", "C", "D"], "Você deve indicar a opção correta!"),
    points: z.number().min(100, "Defina a quantidade de pontos, mínimo 100!"),
    class: z.string().min(1, "Turma é obrigatório!"),
    name: z.string().min(3, "Digite um nome para a sua atividade!")
})

export function CreateActivityCard() {
    const [openDialog, setOpenDialog] = useState(false)

    type FormActivty = z.infer<typeof formSchema>
    const form = useForm<FormActivty>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            question: "",
            correct: "A",
            points: 0,
            name: "",
            class: "",
            answerA: "",
            answerB: "",
            answerC: "",
            answerD: ""
        }
    })

    async function onSubmit(data: FormActivty) {
        try {
            console.log("Dados do formulário", data)
            form.reset()
            setOpenDialog(false)
        }
        catch (error) {
            console.error("Não foi possível enviar o formulário: ", error)
            form.reset()
        }
    }

    return (
        <>
            <Card
                onClick={() => setOpenDialog(true)}
            >
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>+ Criar nova atividade</CardTitle>
                        <CardDescription>Clique aqui e crie uma nova atividade</CardDescription>
                    </div>
                    <FilePlus2 className="w-8 h-8 text-blue-600" />
                </CardHeader>
            </Card>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Adicionar nova atividade</DialogTitle>
                        <DialogDescription>Adicione o nome da atividade </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="class"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Turma</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione uma classe" />
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {mockTurmas.map((op) => (
                                                    <SelectItem
                                                        key={op.id}
                                                        value={op.name}
                                                    >
                                                        {op.name}
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
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Atividade exemplo"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="question"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Questão</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Questão exemplo"
                                                {...field}
                                            />
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
                                        <FormLabel>Repostas</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Resposta A"
                                                {...field}
                                            />
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
                                        <FormControl>
                                            <Input
                                                placeholder="Resposta B"
                                                {...field}
                                            />
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
                                        <FormControl>
                                            <Input
                                                placeholder="Resposta C"
                                                {...field}
                                            />
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
                                        <FormControl>
                                            <Input
                                                placeholder="Resposta D"
                                                {...field}
                                            />
                                        </FormControl>
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
                            <Button type="submit" className="w-full">Cadastrar questão</Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}
