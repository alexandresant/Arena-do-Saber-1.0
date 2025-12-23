import axios from "axios"
import { getSession } from "next-auth/react"
import { PdfLink, StrapiItem } from "@/types/types"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL

export const loadSubjects = async (): Promise<PdfLink[]> => {
  const session = await getSession()
  const jwt = session?.jwt

  if (!jwt || !STRAPI_URL) return []

  try {
    const response = await axios.get<any>(`${STRAPI_URL}/api/subjects`, {
      headers: { Authorization: `Bearer ${jwt}` }
    })

    const subjects: StrapiItem[] = response.data.data

    return subjects
      .map(item => {
        if (!item.googleDriveId) return null

        // Extrai apenas o ID, caso tenha sido colado o link inteiro
        const driveIdMatch = item.googleDriveId.match(/\/d\/([a-zA-Z0-9_-]+)/)
        const cleanId = driveIdMatch ? driveIdMatch[1] : item.googleDriveId.trim()

        return {
          id: item.id,
          name: item.name,
          subject: item.subject,
          description: item.description,
          googleDriveId: cleanId,
          // Link oficial de visualização do Google Drive (evita download automático)
          url: `https://drive.google.com/file/d/${cleanId}/view`
        }
      })
      .filter((link): link is PdfLink => link !== null)
  } catch (error) {
    console.error("Erro ao carregar matérias:", error)
    return []
  }
}