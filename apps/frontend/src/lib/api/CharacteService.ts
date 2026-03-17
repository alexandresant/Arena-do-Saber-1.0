import axios from "axios"
import { getSession } from "next-auth/react"
import { getCharacterStatus } from "@/lib/api/createCharacter"
import { mainPlayer } from "@/lib/CharacterData"

interface BattleRewards {
  exp: number
  gold: number
  isVictory: boolean
}

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL

export const updateBattleResults = async (character: any, rewards: BattleRewards) => {
  try {
    const session = await getSession()
    const jwt = session?.jwt
    const userId = session?.user?.id

    if (!jwt || !userId) return { success: false }

    // 1. BUSCA DADOS REAIS
    const statusResponse = await getCharacterStatus((userId))
    
    // Tenta pegar o personagem da resposta ou usa o 'character' que veio por parâmetro como fallback
    const charData = statusResponse?.data?.data?.[0] || statusResponse?.character;
    
    // Se ainda assim não achar, usamos o ID do personagem passado na função
    const finalId = charData?.id || character?.id;

    if (!finalId) {
      console.error("❌ Erro: ID do personagem não localizado.");
      return { success: false }
    }

    // Pegamos os atributos atuais do banco (ou do objeto local se o banco falhar na busca)
    const dbChar = charData?.attributes || charData || character;

    // 2. CÁLCULOS
    const currentVictories = Number(dbChar.victories || 0);
    const newVictories = rewards.isVictory ? currentVictories + 1 : currentVictories;
    
    const currentGold = Number(dbChar.gold || 0);
    const newGold = currentGold + rewards.gold;

    let currentExp = Number(dbChar.experience || 0) + rewards.exp;
    let currentLevel = Number(dbChar.level || 1);
    let currentPoints = Number(dbChar.points || 0);

    // Lógica de Level Up
    while (currentExp >= currentLevel * 100) {
      currentExp -= currentLevel * 100;
      currentLevel++;
      currentPoints += 10;
    }

    const payload = {
      data: {
        experience: currentExp,
        level: currentLevel,
        gold: newGold,
        victories: newVictories,
        points: currentPoints
      }
    };

    // 3. SALVAR NO STRAPI
    // Importante: use o ID que o Strapi espera (muitas vezes é o documentId ou ID numérico)
    const updateId = finalId;

    await axios.put(
      `${STRAPI_URL}/api/characters/${updateId}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      }
    )

    // 4. ATUALIZAR CACHE LOCAL (Para refletir no CharacterSelect)
    if (mainPlayer) {
      // Usando as propriedades que o mainPlayer reconhece
      Object.assign(mainPlayer, {
        experience: currentExp,
        level: currentLevel,
        gold: newGold,
        victories: newVictories,
        points: currentPoints
      });
    }

    // Notifica todos os componentes para renderizarem os dados novos
    window.dispatchEvent(new CustomEvent("characters:update"));

    console.log("✅ Batalha sincronizada! Vitórias:", newVictories);
    return { success: true }

  } catch (error: any) {
    console.error("❌ Falha no updateBattleResults:", error.response?.data || error.message);
    return { success: false }
  }
}