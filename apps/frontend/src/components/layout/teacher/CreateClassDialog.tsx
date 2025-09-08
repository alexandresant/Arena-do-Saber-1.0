"use client"
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Dispatch, SetStateAction, useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { createClass } from "@/lib/api/createClass"


const formSchema = z.object({
    name: z.string().min(3, "O nome da turma deve ter no mínimo 3 letras"),
    code: z.string().min(4, "Código deve ter ao menos 4 digitos"),
    subject: z.string().min(3, "Digite uma matéria para a turma"),
})

export function CreateClassDialog({ openDialog, setOpenDialog }: { openDialog: boolean, setOpenDialog: Dispatch<SetStateAction<boolean>> }) {
    type FormClass = z.infer<typeof formSchema>
    const form = useForm<FormClass>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            code: "",
            subject: ""
        }
    })

    async function onSubmit(data: FormClass) {
        try {
            const response = await createClass(data)
            form.reset()
            setOpenDialog(false)
        }
        catch (error) {
            
            console.error("Erro ao enviar formulário" + error)
        }
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className="gap-2">
                <DialogHeader>
                    <DialogTitle>Cadastrar nova turma</DialogTitle>
                    <DialogDescription>Adicione os dados da turma</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="mt-3">
                                    <FormLabel>Nome da turma</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Digite um nome para a sua turma"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem className="mt-3">
                                    <FormLabel>Matéria</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Digite uam nova Matéria"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                         <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem className="mt-3">
                                    <FormLabel>Crie um código de acesso para a sua turma</FormLabel>
                                    <FormControl>
                                        <Input 
                                            placeholder="Código"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="mt-2 w-full">Cadastrar</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}