"use client"

import { SelectLessons } from "@/components/layout/student/SelectLessons"
import { Suspense } from "react"

export default function LessonsPage() {
  return (
    <main className="flex-1 space-y-4 p-8 pt-6">
      <Suspense fallback={<div>Carregando lista de aulas...</div>}>
        <SelectLessons />
      </Suspense>
    </main>
  )
}