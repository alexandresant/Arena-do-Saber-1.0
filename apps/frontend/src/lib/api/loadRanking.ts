import axios from "axios"
import { getSession } from "next-auth/react"
import type { FighterProps, ranckingUserProps } from "@/types/types"
import { vi } from "zod/v4/locales"

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

export async function loadRankingUser(): Promise<ranckingUserProps[]> {
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

    //Remove usuários sem pontos
    const filtered = unique.filter((user) => user.points > 0)

    // 🔥 Ordena por pontuação
    const sorted = filtered.sort(
      (a: ranckingUserProps, b: ranckingUserProps) => b.points - a.points
    )

    return sorted
  } catch (err) {
    console.error("Erro ao carregar ranking:", err)
    return []
  }

}

export async function loadRankingFighters(): Promise<FighterProps[]> {
  const session = await getSession();

  const jwt = session?.jwt;
  if (!jwt) {
    console.warn("Usuário não autenticado ou JWT ausente");
    return [];
  }

  try {
    const response = await axios.get(`${STRAPI_URL}/api/characters/ranking`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    // Aqui: response.data é diretamente um array
    const fighters = Array.isArray(response.data) ? response.data : [];

    const normalized: FighterProps[] = fighters.map((fighter: any) => ({
      id: fighter.id,
      nickName: fighter.nickName ?? fighter.name ?? "Sem Nome",
      points: Number(fighter.points ?? 0),
      level: Number(fighter.level ?? 1),
      victories: Number(fighter.victories ?? 0),
    }));

    //console.log("Ranking de lutadores (sem filtragem):", normalized);
    const sorted = normalized.sort((a: FighterProps, b: FighterProps) => b.victories - a.victories);
    //console.log("Ranking de lutadores (ordenado):", sorted);

    return sorted;
  } catch (err) {
    console.error("Erro ao carregar ranking de lutadores:", err);
    return [];
  }
}
