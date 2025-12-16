import axios from "axios";
import type { CreateClassProps } from "@/types/types";
import { getSession } from "next-auth/react";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL
const session = await getSession()
    const jwt = session?.jwt;
    const idTeacher = session?.user.id

export async function createClass({ name, code, subject }: CreateClassProps) {
  try {

    if (!jwt) throw new Error("Usuário não autenticado")

    const response = await axios.post(
      `${STRAPI_URL}/api/classes`,
      {
        data: {
          name,
          teacher: idTeacher,
          code,
          subject
        },
        
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }
    );
    //console.log("Dados enviados: " , response.data)
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
    console.error("Erro Strapi:", error.response?.data)
  } else {
    console.error("Erro desconhecido:", error)
  }
  throw new Error("Falha ao criar turma!")
  }
}

export async function loadClass(){
  const response = await axios.get(`${STRAPI_URL}/api/classes?populate[student][populate]=classes`, {
    headers:{
      Authorization: `Bearer ${jwt}`
    }
  })
  console.log("Dados das turmas: ", response.data)
  return response.data.data
}



