"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Home } from "lucide-react"


export function DisciplineCard() {
    const t = useTranslations('StudentDashboardPage.availableDiscipline')
    const router = useRouter()

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>{t('title')}</CardTitle>
                    <CardDescription>{t('description')}</CardDescription>
                </div>

                <div>
                    <Button
                        className="bg-transparent border text-gray-100 hover:text-gray-700"
                        onClick={() => router.push("/student-dashboard")}
                    >
                        <Home />
                        Home
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                    <Card
                        className="text-center flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                        onClick={() => router.replace("/arte")}
                    >
                        <Label className="text-2xl">🎨</Label>
                        <Label>{t('art')}</Label>
                    </Card>

                    <Card
                        className="text-center flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                        onClick={() => router.replace("/biologia")}
                    >
                        <Label className="text-2xl">🧬</Label>
                        <Label>{t('biology')}</Label>
                    </Card>

                    <Card
                        className="text-center flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                        onClick={() => router.replace("/educacao-fisica")}
                    >
                        <Label className="text-2xl">⚽</Label>
                        <Label>{t('physicalEducation')}</Label>
                    </Card>

                    <Card
                        className="text-center flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                        onClick={() => router.replace("/filosofia")}
                    >
                        <Label className="text-2xl">🏛️</Label>
                        <Label>{t('philosophy')}</Label>
                    </Card>

                    <Card
                        className="text-center flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                        onClick={() => router.replace("/fisica")}
                    >
                        <Label className="text-2xl">⚡</Label>
                        <Label>{t('physical')}</Label>
                    </Card>

                    <Card
                        className="text-center flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                        onClick={() => router.replace("/geografia")}
                    >
                        <Label className="text-2xl">🌍</Label>
                        <Label>{t('geography')}</Label>
                    </Card>

                    <Card
                        className="text-center flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                        onClick={() => router.replace("/historia")}
                    >
                        <Label className="text-2xl">📜</Label>
                        <Label>{t('history')}</Label>
                    </Card>

                    <Card
                        className="text-center flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
                        onClick={() => router.replace("/ingles")}
                    >
                        <Label className="text-2xl">🇬🇧</Label>
                        <Label>{t('english')}</Label>
                    </Card>
                </div>
                <Button
                    className="w-full bg-transparent border text-gray-100 hover:text-gray-800"
                    onClick={() => router.replace("/allDiscipline")}
                >
                    {t('allDisciplinesButton')}
                </Button>
            </CardContent>
        </Card>
    )
}