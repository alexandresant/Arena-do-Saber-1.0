import axios from "axios"
import { getSession } from "next-auth/react"
import type { QuestionProps } from "@/types/types"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

export async function createQuestion({
  description,
  answerA,
  answerB,
  answerC,
  answerD,
  correct,
  points,
  activityId,
}: QuestionProps) {
  const session = await getSession()
  const jwt = session?.jwt

  if (!jwt) throw new Error("Usuário não autenticado!")

  const response = await axios.post(
    `${STRAPI_URL}/api/questions`,
    {
      data: {
        description,
        answerA,
        answerB,
        answerC,
        answerD,
        correct,
        points,
        activityId: activityId
      },
    },
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
  )
  //console.log("Dados: ", response.data)
  return response.data
}