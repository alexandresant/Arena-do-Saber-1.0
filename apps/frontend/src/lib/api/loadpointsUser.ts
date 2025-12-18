    import axios from "axios"
import { getSession } from "next-auth/react"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL

export async function getUserPoints() {
  const session = await getSession()
  const jwt = session?.jwt

  if (!jwt) {
    console.warn("Usuário não autenticado ou JWT ausente")
    return null
  }

  // 🔹 Busca apenas o campo 'points' do usuário autenticado
  const res = await axios.get(`${STRAPI_URL}/api/users/me?fields=points`, {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  })

  const user = res.data
  //console.log("Pontos do usuário:", user.points)

  return user.points
}
