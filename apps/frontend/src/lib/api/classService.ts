// classService.ts
import axios from "axios";
import { getSession } from "next-auth/react";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function getClasses(code: string) {
  const session = await getSession();
  const jwt = session?.jwt;
  const userId = session?.user.id;

  if (!jwt || !userId) {
    throw new Error("Usuário não autenticado");
  }

  try {
    // Buscar turma pelo código e popular os students
    const response = await axios.get(
      `${STRAPI_URL}/api/classes?filters[code][$eq]=${code}&populate=student`,
      { headers: { Authorization: `Bearer ${jwt}` } }
    );

    console.log("Full API response:", response.data);

    if (!response.data.data || response.data.data.length === 0) {
      throw new Error("Turma não encontrada");
    }

    if (response.data.data.length > 1) {
      console.warn("Múltiplas turmas encontradas com o mesmo código");
    }

    const classData = response.data.data[0];
    console.log("Class data structure:", classData);

    const classId = classData.documentId; // Strapi v5 usa documentId no PUT
    const students = classData.students || [];

    console.log("Students found:", students);

    // Verifica se o aluno já está inscrito
    const alreadyIn = students.some((s: any) => s.id === userId);
    if (alreadyIn) {
      throw new Error("Você já está inscrito nesta turma");
    }

    // Adiciona o usuário à turma
    const updatedStudents = [...students.map((s: any) => s.id), userId];

    const updateResponse = await axios.put(
      `${STRAPI_URL}/api/classes/${classId}`,
      { data: { student: updatedStudents } },
      { headers: { Authorization: `Bearer ${jwt}` } }
    );

    console.log("Turma atualizada com sucesso:", updateResponse.data);

    return {
      message: "Inscrição realizada com sucesso!",
      classId: classData.id,
    };
  } catch (error) {
    console.error("Erro em getClasses:", error);
    throw error;
  }
}

export async function loadClass() {
  const session = await getSession();
  const jwt = session?.jwt;

  const response = await axios.get(`${STRAPI_URL}/api/classes`,{
    headers:{
      Authorization: `Bearer ${jwt}`
    }
  })
  return response.data
}
