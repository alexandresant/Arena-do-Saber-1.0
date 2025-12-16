import axios from "axios"
import { getSession } from "next-auth/react"
import { PdfLink, StrapiItem } from "@/types/types"

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL

export const loadSubjects = async (): Promise<PdfLink[]> => {
    const session = await getSession();
    const jwt = session?.jwt;

    if (!jwt) {
        console.warn("Usuário não autenticado ou JWT ausente")
        return [];
    }

    if (!STRAPI_URL) {
        console.error("Variável de ambiente NEXT_PUBLIC_STRAPI_URL não definida.")
        return [];
    }

    try {
        const response = await axios.get<any>(`${STRAPI_URL}/api/subjects?populate=pdf`, {
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });
        console.log("RESPOSTA BRUTA DO STRAPI:", JSON.stringify(response.data, null, 2));

        const subjects: StrapiItem[] = response.data.data;

        const pdfLinks: PdfLink[] = subjects
  .map(item => {
    const fileObject = item.pdf?.[0];

    const fileName = item.name;
    const fileUrl = fileObject?.url;

    if (fileUrl && fileName && item.id) {
      return {
        id: item.id,
        name: fileName,
        url: `${STRAPI_URL}${fileUrl}`,
      };
    }

    return null;
  })
  .filter((link): link is PdfLink => link !== null);

        console.log("Links de PDF carregados: ", pdfLinks)
        return pdfLinks;
    }
    catch (error) {
        console.error("Erro ao carregar as matérias: ", error)
        return [];
    }
};