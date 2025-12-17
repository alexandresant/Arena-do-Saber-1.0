
"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Home } from "lucide-react"
import React, { useState, useEffect } from 'react'
import { loadSubjects } from '@/lib/api/loadSubjects'
import { PdfLink } from '@/types/types'

// Adicionando 'arduino' ao mapeamento
const DISCIPLINE_MAP = [
    { slug: "arduino", icon: "🤖", tKey: "arduino" }, // <-- NOVO ITEM ADICIONADO AQUI
    { slug: "arte", icon: "🎨", tKey: "art" },
    { slug: "biologia", icon: "🧬", tKey: "biology" },
    { slug: "educacao-fisica", icon: "⚽", tKey: "physicalEducation" },
    { slug: "filosofia", icon: "🏛️", tKey: "philosophy" },
    { slug: "fisica", icon: "⚡", tKey: "physical" },
    { slug: "geografia", icon: "🌍", tKey: "geography" },
    { slug: "historia", icon: "📜", tKey: "history" },
    { slug: "ingles", icon: "🇬🇧", tKey: "english" },
    {slug: "matematica", icon: "🧮", tKey: "math"}
];

export function DisciplineCard() {
    const t = useTranslations('StudentDashboardPage.availableDiscipline')
    const router = useRouter()
    
    // Estados para carregar os dados
    const [pdfLinks, setPdfLinks] = useState<PdfLink[]>([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null)

    // Estado para mapear slug (da lista estática) para a URL carregada
    const [urlMap, setUrlMap] = useState<Map<string, string>>(new Map());

    // Lógica de Carregamento (useEffect)
    useEffect(() => {
        const fetchLinks = async () => {
            setLoading(true)
            setError(null)
            
            try {
                const links = await loadSubjects() // Carrega os links do Strapi
                setPdfLinks(links)

                // Constrói o Map (Slug -> URL)
                const newMap = new Map<string, string>();
                links.forEach(link => {
                    // Normaliza o nome da matéria do Strapi para um slug (ex: "Arduino" -> "arduino")
                    const slug = link.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    newMap.set(slug, link.url);
                });
                setUrlMap(newMap);

            } catch (err) {
                console.error("Erro ao carregar os materiais:", err);
                setError("Ocorreu um erro ao carregar os materiais.");
            } finally {
                setLoading(false)
            }
        };

        fetchLinks();
    }, []);

    // Função de Clique: Abre o PDF se a URL existir
    const handleCardClick = (url: string | undefined) => {
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        } else {
            console.warn("PDF não encontrado para esta disciplina.");
        }
    };
    
    // Renderização Condicional
    if (loading) {
        // Renderiza um placeholder ou loading spinner
        return (
            <Card>
                <CardContent className="text-center py-10">
                    <p>Carregando disciplinas e verificando materiais...</p>
                </CardContent>
            </Card>
        )
    }

    if (error) {
        return (
            <Card>
                <CardContent className="text-center py-10">
                    <p style={{ color: 'red' }}>{error}</p>
                </CardContent>
            </Card>
        )
    }


    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                {/* ... Header e botão Home ... */}
                <div>
                    <CardTitle>{t('title')}</CardTitle>
                    <CardDescription>{t('description')}</CardDescription>
                </div>

                <div>
                    <Button
                        className="bg-transparent border text-gray-100 hover:text-gray-700"
                        onClick={() => router.push("/student-dashboard")}
                    >
                        <Home className="mr-2 h-4 w-4" />
                        Home
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                    {/* Mapeamento da Lista Estática para Renderização */}
                    {DISCIPLINE_MAP.map((discipline) => {
                        const slug = discipline.slug;
                        // Tenta obter a URL carregada do mapa usando o slug
                        const pdfUrl = urlMap.get(slug);
                        
                        // Determina se o link está disponível
                        const isAvailable = !!pdfUrl;

                        return (
                            <Card
                                key={slug}
                                className={`text-center flex flex-col items-center gap-1 transition-all duration-200 
                                    ${isAvailable 
                                        ? 'cursor-pointer hover:scale-[1.01]' 
                                        : 'cursor-not-allowed opacity-50'
                                    }`
                                }
                                // Chama a função de clique com a URL encontrada (ou undefined)
                                onClick={() => handleCardClick(pdfUrl)}
                            >
                                <Label className="text-2xl">{discipline.icon}</Label>
                                <Label>{t(discipline.tKey)}</Label>
                            </Card>
                        );
                    })}

                </div>
                
            </CardContent>
        </Card>
    )
}