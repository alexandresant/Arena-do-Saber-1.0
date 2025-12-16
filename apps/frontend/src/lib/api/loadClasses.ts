import axios from "axios"
import type { CreateClassProps } from "@/types/types"
import { getSession } from "next-auth/react"
const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL

export async function loadClasses() {
    const session = await getSession()

    const jwt = session?.jwt
    if (!jwt) {
        console.warn("Usuário não autenticado ou JWT ausente")
        return []
    }

    try {
        const response = await axios.get(
            `${STRAPI_URL}/api/classes?populate[teacher][populate]=classes`,
            {
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            }
        )

        const classes = response.data.data
        //console.log("Dados das turmas carregadas: ", classes)

        return classes
    } catch (err) {
        console.error("Erro ao carregar turmas do Strapi:", err)
        return []
    }
}