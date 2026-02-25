"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { useTranslations } from "next-intl"
import type { CombatentStats } from "@/types/types"
import { Badge } from "@/components/ui/badge"
import { Wand, Sword, Shield, Rabbit, Swords, CircleDot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useMemo, useState, useEffect, useRef } from "react"
import type { LucideIcon } from "lucide-react"
import { updateBuild } from "@/lib/api/updateBuild"
import { Loader2, Check, Save } from "lucide-react"


export function StatsCombatentCard({
    id,
    points,
    experience,
    name,
    nickName,
    totalHp,
    totalMana,
    phisicalAttack,
    magicAttack,
    evasion,
    defense,
    level
}: CombatentStats) {

    const t = useTranslations('StudentDashboardPage.characters')
    const router = useRouter()
    const initializedRef = useRef(false)

    /* =========================
       VALORES MÍNIMOS POR CLASSE
    ========================== */
    const minimalStats = useMemo(() => {
        // Normalizamos o nome para evitar erros de digitação (ex: guerreiro vs Guerreiro)
        const normalizedName = name?.trim()

        switch (normalizedName) {
            case "Maga":
                return { defense: 15, magicAttack: 55, evasion: 15, phisicalAttack: 10 }
            case "Arqueira":
                return { defense: 15, magicAttack: 10, evasion: 45, phisicalAttack: 25 }
            case "Mestre das feras":
                return { defense: 18, magicAttack: 40, evasion: 20, phisicalAttack: 20 }
            case "Guerreiro":
                return { defense: 20, magicAttack: 10, evasion: 15, phisicalAttack: 30 }
            default:
                // O ERRO ESTAVA AQUI: 
                // Se não encontrar a classe, retornamos valores base fixos (10 ou o que desejar),
                // e não as props atuais, que já contém os pontos distribuídos.
                return { defense: 10, magicAttack: 10, evasion: 10, phisicalAttack: 10 }
        }
        // Removemos defense, magicAttack, etc das dependências para o mínimo ser estático
    }, [name])

    const MIN_HP = 100
    const MIN_MANA = 100

    /* =========================
       ESTADO DOS ATRIBUTOS
    ========================== */
    const [stats, setStats] = useState({
        totalHp,
        totalMana,
        phisicalAttack,
        magicAttack,
        evasion,
        defense,
    })

    const [availablePoints, setAvailablePoints] = useState(points)

    /* =========================
       INCREMENTO
    ========================== */
    const increaseStat = (key: keyof typeof stats) => {
        if (availablePoints < 10) return

        setStats(prev => ({
            ...prev,
            [key]: prev[key] + 10
        }))

        setAvailablePoints(prev => prev - 10)
    }

    /* =========================
      RESET CORRETO
   ========================== */
    const resetBuild = () => {
        const spentPoints = calculateSpentPoints(stats)

        initializedRef.current = true

        setStats({
            totalHp: MIN_HP,
            totalMana: MIN_MANA,
            phisicalAttack: minimalStats.phisicalAttack,
            magicAttack: minimalStats.magicAttack,
            evasion: minimalStats.evasion,
            defense: minimalStats.defense,
        })

        setAvailablePoints(prev => prev + spentPoints)
    }

    const attributes: {
        key: keyof typeof stats
        icon: LucideIcon
        value: number
    }[] = [
            { key: "phisicalAttack", icon: Sword, value: stats.phisicalAttack },
            { key: "magicAttack", icon: Wand, value: stats.magicAttack },
            { key: "evasion", icon: Rabbit, value: stats.evasion },
            { key: "defense", icon: Shield, value: stats.defense },
        ]

    useEffect(() => {
        if (initializedRef.current || totalHp === 0 || totalMana === 0) return

        setStats({
            totalHp,
            totalMana,
            phisicalAttack,
            magicAttack,
            evasion,
            defense,
        })
        setAvailablePoints(points)
        initializedRef.current = true
    }, [totalHp, totalMana, phisicalAttack, magicAttack, evasion, defense, points])

    const calculateSpentPoints = (currentStats: typeof stats) => {
        const spent =
            (currentStats.totalHp - MIN_HP) / 10 +
            (currentStats.totalMana - MIN_MANA) / 10 +
            (currentStats.phisicalAttack - minimalStats.phisicalAttack) / 10 +
            (currentStats.magicAttack - minimalStats.magicAttack) / 10 +
            (currentStats.evasion - minimalStats.evasion) / 10 +
            (currentStats.defense - minimalStats.defense) / 10

        return Math.round(Math.max(spent * 10, 0))
    }

    // Adicione estes estados no topo do componente
    const [isSaving, setIsSaving] = useState(false)
    const [hasSaved, setHasSaved] = useState(false)

    const handleSaveBuild = async () => {
        setIsSaving(true) // Inicia animação de loading
        setHasSaved(false)

        try {
            const success = await updateBuild({
                id: id,
                totalHp: stats.totalHp,
                totalMana: stats.totalMana,
                phisicalAttack: stats.phisicalAttack,
                magicAttack: stats.magicAttack,
                evasion: stats.evasion,
                defense: stats.defense,
                points: availablePoints,
            })

            if (success) {
                setHasSaved(true)
                router.refresh()
                // Remove o check verde após 3 segundos
                setTimeout(() => setHasSaved(false), 3000)

            } else {
                alert("Erro ao salvar build") // Ou use um Toast
            }
        } catch (error) {
            console.error("Erro ao salvar:", error)
        } finally {
            setIsSaving(false) // Para o loading
        }
    }


    return (
        <Card className="gap-4">
            <CardHeader className="flex flex-row justify-between items-center">
                <div className="gap-1">
                    <CardTitle>{nickName}</CardTitle>
                    <CardDescription className="mt-2">{name}</CardDescription>
                </div>
                <Badge className="bg-yellow-500">{t('nivel', { level })}</Badge>
            </CardHeader>

            <CardContent>
                <div className="space-y-1 mb-3">
                    <div className="flex flex-row justify-between items-center">
                        <Label>{t('experience')}</Label>
                        <Label>{experience}</Label>
                    </div>
                    <Progress
                        value={(experience / (level * 100)) * 100}
                        className="h-2"
                    />
                </div>

                {/* HP / MANA */}
                <div className="flex flex-row items-center justify-between text-muted-foreground">
                    <div className="w-[45%] space-y-1">
                        <div className="flex justify-between items-center">
                            <Label>{t('hp')}</Label>
                            <div className="flex gap-2 items-center">
                                <Label>{stats.totalHp}</Label>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    disabled={availablePoints < 10}
                                    onClick={() => increaseStat("totalHp")}
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                        {/* HP */}
                        <Progress
                            value={100} // No dashboard de build, a barra deve estar cheia ou representar o progresso até um teto
                            className="[&>div]:bg-red-600"
                        />
                    </div>

                    <div className="w-[45%] space-y-1">
                        <div className="flex justify-between items-center">
                            <Label>{t('mana')}</Label>
                            <div className="flex gap-2 items-center">
                                <Label>{stats.totalMana}</Label>
                                <Button
                                    size="icon"
                                    variant="outline"
                                    disabled={availablePoints < 10}
                                    onClick={() => increaseStat("totalMana")}
                                >
                                    +
                                </Button>
                            </div>
                        </div>
                        <Progress value={100} className="[&>div]:bg-blue-600" />


                    </div>
                </div>

                {/* ATRIBUTOS */}
                <div className="flex flex-col mt-4 space-y-2 text-muted-foreground">
                    {attributes.map(({ key, icon: Icon, value }) => (
                        <div key={key} className="flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <Icon className="h-4 w-4" />
                                <Label>{t(key)}</Label>
                            </div>
                            <Badge
                                className={`cursor-pointer ${availablePoints < 10 ? "opacity-50 cursor-not-allowed" : ""}`}
                                onClick={() => increaseStat(key)}
                            >
                                {value}
                            </Badge>
                        </div>
                    ))}

                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <CircleDot className="h-4 w-4" />
                            <Label>{t('points')}</Label>
                        </div>
                        <Badge>{availablePoints}</Badge>
                    </div>
                </div>

                <Button variant="destructive" className="w-full mt-2" onClick={resetBuild}>
                    Resetar Build
                </Button>

                <Button
                    className={`w-full mt-2 transition-all ${hasSaved ? "bg-green-600 hover:bg-green-700" : ""}`}
                    onClick={handleSaveBuild}
                    disabled={isSaving}
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                        </>
                    ) : hasSaved ? (
                        <>
                            <Check className="mr-2 h-4 w-4" />
                            Build Salva!
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar Build
                        </>
                    )}
                </Button>

                <Button className="w-full mt-4" onClick={() => router.push("/battle-arena")}>
                    <Swords />
                    Batalhar
                </Button>
            </CardContent>
        </Card>
    )
}
