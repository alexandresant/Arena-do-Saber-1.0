"use client"

import { useState } from "react"
import { getClasses } from "@/lib/api/classService"

export function JoinClassForm() {
  const [code, setCode] = useState("")
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleJoin = async () => {
    if (!code) return setMessage("Digite o código da turma.")

    setLoading(true)
    setMessage(null)

    try {
      const result = await getClasses(code)
      setMessage(result.message || "Inscrição realizada com sucesso!")
    } catch (err: any) {
      setMessage(err.message || "Erro ao entrar na turma")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded max-w-md">
      <h2 className="text-lg font-semibold mb-2">Entrar em uma turma</h2>
      
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Digite o código da turma"
          className="border p-2 rounded flex-1"
        />
        <button
          onClick={handleJoin}
          disabled={loading}
          className="p-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </div>

      {message && (
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          {message}
        </p>
      )}
    </div>
  )
}
