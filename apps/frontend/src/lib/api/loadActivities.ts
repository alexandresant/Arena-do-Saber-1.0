import axios from "axios"
import { getSession } from "next-auth/react"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

export async function loadActivities(classId: string) {
    const session = await getSession()

    const jwt = session?.jwt
    if (!jwt) {
        console.warn("Usuário não autenticado ou JWT ausente")
        return []
    }

    const queryString = `filters[classId][id][$eq]=${classId}&populate=questions`
    try {
        const response = await axios.get(`${STRAPI_URL}/api/activities?${queryString}`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        }
        )
        const activities = response.data.data
        console.log(`Dados das atividades da Turma ID ${classId} carregadas: `, activities)
        return activities
    }
    catch (error) {
        console.error("Erro ao carregar atividades: ", error)
        return []
    }
}