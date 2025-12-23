"use client"

import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Home } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { loadSubjects } from "@/lib/api/loadSubjects"
import { PdfLink } from "@/types/types"

export function SelectLessons() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const subjectSlug = searchParams.get("subject")

  const [lessons, setLessons] = useState<PdfLink[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true)
      const allSubjects = await loadSubjects()
      
      const filtered = allSubjects.filter(item => {
        if (!item.subject || !subjectSlug) return false
        return item.subject.toLowerCase().trim() === subjectSlug.toLowerCase().trim()
      })

      setLessons(filtered)
      setLoading(false)
    }
    fetchLessons()
  }, [subjectSlug])

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <div>
          <CardTitle>Aulas: {subjectSlug}</CardTitle>
          <CardDescription>Clique para visualizar o conteúdo</CardDescription>
        </div>
        <Button variant="outline" onClick={() => router.push("/student-dashboard")}>
          <Home className="mr-2 h-4 w-4" /> Home
        </Button>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="text-center py-10">Carregando...</p>
        ) : (
          <Table>
            <TableBody>
              {lessons.map((lesson) => (
                <TableRow key={lesson.id}>
                  <TableCell>
                    <div className="font-bold">{lesson.name}</div>
                    <div className="text-sm text-muted-foreground">{lesson.description}</div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button onClick={() => window.open(lesson.url, "_blank")}>
                      Abrir PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}