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
import { createCharacter, getCharacterTemplates } from "@/lib/api/createCharacter"
import type { CharacterTemplate } from "@/types/types"
import { useSession } from "next-auth/react"


const formSchema = z.object({
    characterId: z.number().min(1, "O personagem é obrigatório"),
    nickName: z.string().min(3, "O apelido é obrigatório").max(10, "O apelido deve ter no máximo 10 caracteres"),
    userId: z.number().min(1),
})

export function CreateCharacter() {
    const t = useTranslations("CreateCharacterPage")
    const [userId, setUserId] = useState(0)
    const [characterTemplates, setCharacterTemplates] = useState<CharacterTemplate[]>([])

    const { data: session } = useSession()

    type FormCreateCharacter = z.infer<typeof formSchema>
    const form = useForm<FormCreateCharacter>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            characterId: 0,
            userId: userId || 0,
            nickName: "",
        }
    })

    async function onSubmit(data: FormCreateCharacter) {
        try {
            const responseData = await createCharacter(data.userId, data.characterId, data.nickName)
            console.log(responseData)
        }
        catch (error) {
            console.error("Erro ao criar personagem:", error)
        }
    }

    const handleCharacterSelect = (char: Character) => {
        form.setValue("characterId", char.characterId)
    }

    useEffect(() => {
        if (session?.user) {
            form.setValue("userId", Number(session.user.id))
        }
    }, [session, form])

    useEffect(() => {
        const fetchCharacterTemplates = async () => {
            try {
                const templatesData = await getCharacterTemplates()
                if (templatesData) {
                    setCharacterTemplates(templatesData.data)
                }
            }
            catch (error) {
                console.error("Erro ao buscar templates de personagens:", error)
            }
        }
        fetchCharacterTemplates()
    }, [])

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
                                                {characterTemplates.map((char) => (
                                                    <Card
                                                        key={char.id}
                                                        className={`cursor-pointer transition-all duration-200 hover:scale-[1.03] ${field.value === char.id
                                                            ? "ring-2 ring-primary ring-offset-2"
                                                            : ""
                                                            }`}
                                                        onClick={() => field.onChange(char.id)}
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
                                                                <span>{char.strenghtBase}</span>
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