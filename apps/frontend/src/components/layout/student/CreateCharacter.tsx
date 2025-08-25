"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { set, z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormItem, FormMessage, FormField, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import type { Character } from "@/types/types"

const characters: Character[] = [
    {
        characterId: 1,
        name: "Arqueira",
        description: "A Arqueira é a personificação da agilidade e da precisão. Com sua extraordinária Destreza, ela é capaz de identificar e encontrar as informações mais rapidamente, aplicando-o conhecimento de forma eficaz e sem erros. Ela é o personagem ideal para quem valoriza a eficiência e a velocidade para atingir seus objetivos.",
        image: "/arqueira.png",
        strengthBase: 15,
        intelligenceBase: 15,
        constitutionBase: 25,
        agilityBase: 35,
    },
    {
        characterId: 2,
        name: "Guerreiro",
        description: "O Guerreiro é a representação da pura força e da resiliência inabalável. Com sua imensa Força e alta Constituição, ele é o guerreiro que nunca se cansa, capaz de enfrentar as tarefas mais difíceis e absorver vastos volumes de informação. É o personagem para quem enfrenta os desafios de frente e persevera até o fim.",
        image: "/guerreiro.png",
        strengthBase: 35,
        intelligenceBase: 15,
        constitutionBase: 25,
        agilityBase: 15,
    },
    {
        characterId: 3,
        name: "Maga",
        description: "A Maga domina o poder do intelecto. Sua elevada Inteligência permite que ela resolva problemas complexos e compreenda as teorias mais abstratas. Ela é a manifestação da sabedoria, ideal para o estudante que se aprofunda nos conceitos e busca a maestria sobre a lógica e o conhecimento.",
        image: "/maga.png",
        strengthBase: 15,
        intelligenceBase: 35,
        constitutionBase: 25,
        agilityBase: 15,
    },
    {
        characterId: 4,
        name: "Mestre das Feras",
        description: "O Mestre das Feras é o mais versátil de todos. Possui uma distribuição equilibrada de Força, Inteligência, Destreza e Constituição, o que o torna incrivelmente adaptável. Ele representa o estudante que se sente à vontade em qualquer área do conhecimento, conectando diferentes disciplinas e aprendendo com tudo ao seu redor.",
        image: "/mestreDasFeras.png",
        strengthBase: 25,
        intelligenceBase: 25,
        constitutionBase: 25,
        agilityBase: 15,
    },
]
const formSchema = z.object({
    characterId: z.number().min(1, "O personagem é obrigatório"),
    nickName: z.string().min(3, "O apelido é obrigatório").max(10, "O apelido deve ter no máximo 10 caracteres"),
    userId: z.number().min(1),
    strengthBase: z.number().min(1),
    intelligenceBase: z.number().min(1),
    constitutionBase: z.number().min(1),
    agilityBase: z.number().min(1),
})

export function CreateCharacter() {
    const t = useTranslations("CreateCharacterPage")
    const [userId, setUserId] = useState(0)

    type FormCreateCharacter = z.infer<typeof formSchema>
    const form = useForm<FormCreateCharacter>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            characterId: 0,
            userId: userId || 0,
            nickName: "",
            strengthBase: 0,
            intelligenceBase: 0,
            constitutionBase: 0,
            agilityBase: 0,
        }
    })

    async function onSubmit(data: FormCreateCharacter) {
        console.log("Dados completos para enviar:", data)
    }

    const handleCharacterSelect = (char: Character) => {
        form.setValue("characterId", char.characterId, { shouldValidate: true, shouldDirty: true })
        form.setValue("strengthBase", char.strengthBase)
        form.setValue("intelligenceBase", char.intelligenceBase)
        form.setValue("constitutionBase", char.constitutionBase)
        form.setValue("agilityBase", char.agilityBase)
    }

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const sessionResponse = await fetch("/api/auth/session")
                const sessionData = await sessionResponse.json()
                const fetchedUserId = sessionData?.user?.id
                if (fetchedUserId) {
                    setUserId(fetchedUserId)
                    form.setValue("userId", fetchedUserId)
                }
            } catch (error) {
                console.error("Falha ao buscar a sessão:", error)
                setUserId(0)
            } finally {

            }
        }
        fetchSession()
    }, [form])

    return (
        <div className="items-center text-center">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{t("title")}</CardTitle>
                    <CardDescription className="text-lg">{t("description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8  w-full max-w-full">
                            <FormField
                                control={form.control}
                                name="characterId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                {characters.map((char) => (
                                                    <Card
                                                        key={char.characterId}
                                                        className={`cursor-pointer transition-all duration-200 hover:scale-[1.03] ${field.value === char.characterId
                                                            ? "ring-2 ring-primary ring-offset-2"
                                                            : ""
                                                            }`}
                                                        onClick={() => handleCharacterSelect(char)}
                                                    >
                                                        <CardHeader>
                                                            <div className="relative flex flex-col items-center justify-center p-2">
                                                                <Image
                                                                    src={char.image}
                                                                    alt={char.name}
                                                                    width={350}
                                                                    height={350}
                                                                    className="w-full h-full object-contain"
                                                                />
                                                            </div>
                                                            <CardTitle className="text-center mt-2">{char.name}</CardTitle>
                                                            <CardDescription className="text-center">{char.description}</CardDescription>
                                                        </CardHeader>
                                                        <CardContent className="flex flex-col gap-1 items-start p- pt-0">
                                                            <div className="flex justify-between w-full">
                                                                <Label>{t('strength')}</Label>
                                                                <span>{char.strengthBase}</span>
                                                            </div>
                                                            <div className="flex justify-between w-full">
                                                                <Label>{t('intelligence')}</Label>
                                                                <span>{char.intelligenceBase}</span>
                                                            </div>
                                                            <div className="flex justify-between w-full">
                                                                <Label>{t('agility')}</Label>
                                                                <span>{char.agilityBase}</span>
                                                            </div>
                                                            <div className="flex justify-between w-full">
                                                                <Label>{t('constitution')}</Label>
                                                                <span>{char.constitutionBase}</span>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="w-full max-w-sm mx-auto">
                                <FormField
                                    control={form.control}
                                    name="nickName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t('nickNameCharacter')}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t('nickNameCharacterPlaceholder')}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                                    
                            <Button type="submit" className="w-[300px]">{t('buttonCreateCharacter')}</Button>
                        </form>

                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}