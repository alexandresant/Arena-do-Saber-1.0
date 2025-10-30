import axios from "axios"
import { getSession } from "next-auth/react"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

export async function loadActivities() {
    const session = await getSession()

    const jwt = session?.jwt
    if (!jwt) {
        console.warn("Usuário não autenticado ou JWT ausente")
        return []
    }

    try {
        const response = await axios.get(`${STRAPI_URL}/api/activities?populate=questions`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        }
        )
        const activities = response.data.data
        console.log("Dados das atividades carregadas: ", activities)
        return activities
    }
    catch (error) {
        console.error("Erro ao carregar atividades: ", error)
        return []
    }
}