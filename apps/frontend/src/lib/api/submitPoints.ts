import axios from "axios"
import { getSession } from "next-auth/react"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL

export async function submitPoints(points: number, userId: string): Promise<boolean> {
  try {
    if (!STRAPI_URL) {
      console.error("STRAPI_URL não definida")
      return false
    }

    const session = await getSession()
    const jwt = session?.jwt

    if (!jwt) {
      console.warn("JWT ausente")
      return false
    }

    // ================= USER =================
    const resUser = await axios.get(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    })

    const user = resUser.data
    const effectiveUserId = userId || user?.id

    if (!effectiveUserId) {
      console.error("UserId inválido")
      return false
    }

    const updatedPoints = (user?.points ?? 0) + points

    await axios.put(
      `${STRAPI_URL}/api/users/${user.id}`,
      { points: updatedPoints },
      { headers: { Authorization: `Bearer ${jwt}` } }
    )

    // ================= CHARACTER =================
    try {
      const response = await axios.get(
        `${STRAPI_URL}/api/characters?filters[users_permissions_user][id][$eq]=${effectiveUserId}&populate=*`,
        { headers: { Authorization: `Bearer ${jwt}` } }
      )

      console.log("Character response:", response.data)

      let character: any = null

      // ✅ formato custom detectado no seu log
      if (response.data?.character) {
        character = response.data.character
      }

      // ✅ formato padrão Strapi
      else if (Array.isArray(response.data?.data) && response.data.data.length > 0) {
        character = response.data.data[0]
      }

      if (!character) {
        console.warn("Personagem não encontrado para usuário:", effectiveUserId)
        return true
      }

      const characterId = character.id
      const currentCharPoints = character.attributes?.points ?? character.points ?? 0
      const updatedCharPoints = currentCharPoints + points

      await axios.put(
        `${STRAPI_URL}/api/characters/${characterId}`,
        {
          data: { points: updatedCharPoints },
        },
        {
          headers: { Authorization: `Bearer ${jwt}` },
        }
      )

      console.log("✅ Pontuação do personagem atualizada:", updatedCharPoints)

    } catch (err: any) {
      console.error("Erro ao atualizar personagem:", err?.response?.data || err.message)
    }

    console.log("✅ Pontuação do usuário atualizada:", updatedPoints)
    return true

  } catch (err: any) {
    console.error("Erro geral:", err?.response?.data || err.message)
    return false
  }
}