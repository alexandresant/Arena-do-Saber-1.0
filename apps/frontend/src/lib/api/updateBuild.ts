import axios from "axios"
import { getSession } from "next-auth/react"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL

interface UpdateBuildPayload {
    id: number
    totalHp: number
    totalMana: number
    phisicalAttack: number
    magicAttack: number
    evasion: number
    defense: number
    points: number
}

export async function updateBuild(payload: UpdateBuildPayload): Promise<boolean> {
    try {
        const session = await getSession()
        const jwt = session?.jwt

        if (!jwt) {
            console.warn("JWT ausente")
            return false
        }

        await axios.put(
            `${STRAPI_URL}/api/characters/${payload.id}`,
            {
                data: {
                    hp: payload.totalHp,        // Strapi usa 'hp'
                    mana: payload.totalMana,    // Strapi usa 'mana'
                    attack: payload.phisicalAttack, // Strapi usa 'attack'
                    magicAttack: payload.magicAttack,
                    evasion: payload.evasion,
                    defense: payload.defense,
                    points: payload.points,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                    "Content-Type": "application/json",
                },
            }
        )

        console.log("✅ Build do personagem atualizada com sucesso")
        return true
    } catch (error) {
        console.error("❌ Erro ao salvar build do personagem:", error)
        return false
    }
}
