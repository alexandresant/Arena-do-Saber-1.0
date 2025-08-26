import axios from "axios"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

const sessionResponse = await fetch("/api/auth/session")
const sessionData = await sessionResponse.json()
const jwt = sessionData?.jwt

export async function createCharacter(userId: number, characterId: number, nickName: string) {
    const response = await axios.post(`${STRAPI_URL}/api/characters/create-character`, {
        userId,
        characterId,
        nickName,
    }, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    return response.data
}
export async function getUserCharacters(userId: number) {
    const response = await axios.get(`${STRAPI_URL}/api/characters/user/${userId}`, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    return response.data
}
export async function getCharacterTemplates() {
    const response = await axios.get(`${STRAPI_URL}/api/character-templates`, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    console.log("Templates recebidos da API:", response.data)
    return response.data
}
