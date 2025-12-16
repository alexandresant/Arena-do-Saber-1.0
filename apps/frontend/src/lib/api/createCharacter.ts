import axios from "axios"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL


export async function createCharacter(userId: number, id: number, nickName: string, jwt: string) {
    const response = await axios.post(`${STRAPI_URL}/api/characters/create-character`, {
        userId,
        id,
        nickName,
    }, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    return response.data
}
export async function getUserCharacters(jwt: string) {
    try {
        const response = await axios.get(`${STRAPI_URL}/api/characters/check-character`, {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        // Retorne os dados recebidos da API do Strapi
        return response.data;
    } catch (error) {
        // Se ocorrer um erro (ex: 401 Unauthorized, 500 Internal Server Error),
        // você pode tratar aqui e retornar um valor padrão para evitar falhas no front.
        console.error("Erro ao verificar personagem:", error);
        return { hasCharacter: false, character: null };
    }
}

export async function getCharacterTemplates(jwt: string) {
    const response = await axios.get(`${STRAPI_URL}/api/character-templates`, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    //console.log("Templates recebidos da API:", response.data)
    return response.data
}

export async function getCharacterStatus(jwt: string, userId: number) {
  try {
    const response = await axios.get(
      `${STRAPI_URL}/api/characters?filters[users_permissions_user][id][$eq]=${userId}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    //console.log("Dados do personagem" , response.data)
    return response.data;
  } catch (error) {
    //console.error("Erro ao carregar status do personagem.", error);
    //throw new Error("Erro ao carregar dados do personagem.");
  }
}



