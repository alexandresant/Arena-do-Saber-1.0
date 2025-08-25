import axios from "axios"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

const jwt = localStorage.getItem('jwt_token')

async function createCharacter(userId: number, templateId: number, nickname: string){
    const response = await axios.post(`${STRAPI_URL}/api/characters/create-character`,{
        userId,
        templateId,
        nickname
    },{
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    return response.data
}