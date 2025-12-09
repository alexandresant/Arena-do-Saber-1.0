import axios from "axios"
import { getSession } from "next-auth/react"
import type { ranckingUserProps } from "@/types/types"

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

export async function loadRanking(): Promise<ranckingUserProps[]> {
  const session = await getSession()

  const jwt = session?.jwt
  if (!jwt) {
    console.warn("Usuário não autenticado ou JWT ausente")
    return []
  }

  try {
    const response = await axios.get(
      `${STRAPI_URL}/api/users?populate[character][populate]=*`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    )

    const users = response.data

    const normalized: ranckingUserProps[] = users.map((user: any) => ({
      id: user.id,
      username: user.username,
      points: user.points ?? 0,
    }))

    // 🔥 Remove duplicados usando id
    const unique = normalized.filter(
      (value: ranckingUserProps, index: number, self: ranckingUserProps[]) =>
        index === self.findIndex((u: ranckingUserProps) => u.id === value.id)
    )

    // 🔥 Ordena por pontuação
    const sorted = unique.sort(
      (a: ranckingUserProps, b: ranckingUserProps) => b.points - a.points
    )

    return sorted
  } catch (err) {
    console.error("Erro ao carregar ranking:", err)
    return []
  }
}
