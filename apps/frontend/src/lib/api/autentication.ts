import axios, { isAxiosError } from "axios"
import type { RegisterProps, UserProps } from "@/types/types"
import { User } from "next-auth"
import type { AuthResponse } from "@/types/types"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"

export async function loginUser({ email, password }: UserProps): Promise<AuthResponse> {
  try {
    const response = await axios.post(`${STRAPI_URL}/api/auth/local`, {
      identifier: email,
      password: password
    })

    return response.data
  }
  catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage = error.response.data.error.message
      throw new Error("Credenciais inválidas. Por favor, tente novamente.")
    }
    else if (error instanceof Error) {
      console.error("Erro desconhecido: ", error)
      throw new Error("Falha na autenticação. Verifique suas credenciais")
    }
    else {
      console.error("Erro desconhecido: ", error);
      throw new Error("Ocorreu um erro inesperado.");
    }

  }
}

export async function getAuthenticatedUser(jwt: string) {
  try {
    const response = await axios.get(`${STRAPI_URL}/api/me-full`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });
    //console.log("Resposta completa da API:", response);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados do usuário:", error);
    throw new Error("Não foi possível carregar os dados do usuário.");
  }
}

export async function SignUp({
  email,
  username,
  password,
}: RegisterProps) {
  try{
    const response = await axios.post(`${STRAPI_URL}/api/auth/local/register`, {
    email,
    username,
    password,
  })
  return response.data
  }
  catch(error ){
     if (axios.isAxiosError(error) && error.response){
      const errorMessage = error.response.data.error.message
      throw new Error("Usuário ou email já esta cadastrado: " + errorMessage)
    }
    else if(error instanceof Error){
      console.log("Erro ao registrar usuário:", error.message)
      throw new Error("Erro ao cadastrar usuário")
    }
    
    throw new Error("Não foi possível registrar o usuário")
  }
  
}

