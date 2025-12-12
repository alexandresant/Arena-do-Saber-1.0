import axios from "axios"
import { getSession } from "next-auth/react"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

export interface ActivityProps {
    name: string
    classId: string
}
const session = await getSession()
const jwt = session?.jwt

export async function createActivity({ name, classId }: ActivityProps) {
 

    if (!jwt) throw new Error("Usuário não autenticado!")

    const response = await axios.post(`${STRAPI_URL}/api/activities`, {
        data: {
            name,
            classId
        }
    },
        {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        }
    )
    return response.data
}

export async function loadActivity({classId}: ActivityProps){
    if (!jwt){
         throw new Error("Usuário não autenticado!")
    }
    
    const response = await axios.get(`${STRAPI_URL}/api/activities?filters[class][id][$eq]=${classId}`, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    console.log("Dados retornados pelo strapi: ", response.data)
    return response.data
}
