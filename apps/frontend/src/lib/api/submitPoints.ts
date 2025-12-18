import axios from "axios"
import { getSession } from "next-auth/react"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL

/**
 * Envia a pontuação da atividade para o Strapi.
 * 
 * @param {number} points - Pontos obtidos na atividade
 * @returns {boolean} - Retorna true se a atualização for bem-sucedida, false caso contrário
 */
export async function submitPoints(points: number): Promise<boolean> {
  try {
    const session = await getSession()
    const jwt = session?.jwt

    if (!jwt) {
      console.warn("Usuário não autenticado ou JWT ausente")
      return false
    }

    // Busca o usuário logado no Strapi
    const resUser = await axios.get(`${STRAPI_URL}/api/users/me`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })

    const user = resUser.data
    const currentPoints = user.points || 0
    const updatedPoints = currentPoints + points

    // Atualiza o campo de pontos do usuário
    await axios.put(
      `${STRAPI_URL}/api/users/${user.id}`,
      { points: updatedPoints },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      }
    )

    try {
      const resCharacter = await axios.get(`${STRAPI_URL}/api/characters`, {
        params: {
          "filters[user][id][$eq]": user.id,
        },
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      })

      const character = resCharacter.data.data[0]

      if (character) {
        const characterId = character.id
        const currentCharPoints = character.attributes.points || 0
        const updatedCharPoints = currentCharPoints + points

        await axios.put(
          `${STRAPI_URL}/api/characters/${characterId}`,
          { points: updatedCharPoints },
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
              "Content-Type": "application/json",
            },
          }
        )
        console.log(`✅ Pontuação do personagem atualizada com sucesso: ${updatedCharPoints} pontos totais`)
      }
      else {
        console.warn("Personagem não encontrado para o usuário")
      }
    }
    catch (error) {
      console.error("❌ Erro ao atualizar pontuação do personagem: ", error)
    }
    console.log(`✅ Pontuação atualizada com sucesso: ${updatedPoints} pontos totais`)
    return true
  } catch (error) {
    console.error("❌ Erro ao enviar pontuação: ", error)
    return false
  }
}
