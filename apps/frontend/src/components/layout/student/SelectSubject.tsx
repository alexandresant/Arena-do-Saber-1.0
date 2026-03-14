"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Home, BookOpen, Lock, GraduationCap } from "lucide-react"
import React, { useState, useEffect } from 'react'
import { loadSubjects } from '@/lib/api/loadSubjects'
import { PdfLink } from '@/types/types'
import { DashboardLayout } from "@/components/layout/student/Dashboard"

const DISCIPLINE_MAP = [
    { slug: "arduino", icon: "🤖", tKey: "arduino" },
    { slug: "arte", icon: "🎨", tKey: "art" },
    { slug: "biologia", icon: "🧬", tKey: "biology" },
    { slug: "educacao-fisica", icon: "⚽", tKey: "physicalEducation" },
    { slug: "filosofia", icon: "🏛️", tKey: "philosophy" },
    { slug: "fisica", icon: "⚡", tKey: "physical" },
    { slug: "geografia", icon: "🌍", tKey: "geography" },
    { slug: "história", icon: "📜", tKey: "history" },
    { slug: "ingles", icon: "🇬🇧", tKey: "english" },
    { slug: "matematica", icon: "➗", tKey: "math" },
    { slug: "portugues", icon: "📚", tKey: "portuguese" },
    { slug: "quimica", icon: "⚗️", tKey: "chemistry" }
]

export function DisciplineCard() {
    const t = useTranslations('StudentDashboardPage.availableDiscipline')
    const router = useRouter()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [urlMap, setUrlMap] = useState<Map<string, string>>(new Map())

    useEffect(() => {
        const fetchLinks = async () => {
            setLoading(true)
            try {
                const links = await loadSubjects()
                const newMap = new Map<string, string>()
                links.forEach(link => {
                    const slug = link.subject.toLowerCase().replace(/[^a-z0-9]+/g, '-')
                    newMap.set(slug, link.url)
                })
                setUrlMap(newMap)
            } catch (err) {
                setError("Erro ao carregar materiais")
            } finally {
                setLoading(false)
            }
        }
        fetchLinks()
    }, [])

    if (loading) return (
        <Card className="border-none shadow-none bg-transparent">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-40 bg-muted rounded-xl" />
                ))}
            </div>
        </Card>
    )

    return (
            <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="px-0 pt-0 pb-8 flex flex-row items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-3xl font-bold flex items-center gap-2">
                            <GraduationCap className="h-8 w-8 text-primary" />
                            {t('title')}
                        </CardTitle>
                        <CardDescription className="text-lg">
                            {t('description')}
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="px-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {DISCIPLINE_MAP.map((discipline) => {
                            const isAvailable = urlMap.has(discipline.slug)
                            
                            return (
                                <Card 
                                    key={discipline.slug}
                                    className={`group transition-all duration-300 border-2 
                                        ${isAvailable 
                                            ? 'cursor-pointer hover:border-primary hover:shadow-lg bg-card' 
                                            : 'opacity-60 bg-muted/50 grayscale cursor-not-allowed'
                                        }
                                    `}
                                    onClick={() => isAvailable && router.push(`/lessons?subject=${discipline.slug}`)}
                                >
                                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                                        <div className="text-6xl group-hover:scale-110 transition-transform">
                                            {discipline.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-xl mb-2">{t(discipline.tKey)}</h3>
                                            {isAvailable ? (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                                                    <BookOpen className="w-3 h-3 mr-1" /> Disponível
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="text-muted-foreground">
                                                    <Lock className="w-3 h-3 mr-1" /> Bloqueado
                                                </Badge>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
    )
}