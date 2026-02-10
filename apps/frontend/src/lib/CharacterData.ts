// @/lib/CharacterData
import { loadRankingFighters, loadRankingUser } from "./api/loadRanking"
import { getCharacterStatus } from "@/lib/api/createCharacter"
import { getSession } from "next-auth/react"

export interface Character {
  id: string;
  nickName: string;
  name: string;
  image: string;
  maxHp: number;
  maxMana: number;
  attack: number;
  magicAttack: number;
  defense: number;
  dexterity: number;
  // 🔹 NOVOS CAMPOS ADICIONADOS AQUI:
  level?: number;
  experience?: number;
  gold?: number;
  points?: number;
  victories?: number;
}

export interface GameUser {
  id: string; username: string; level: number; character: Character;
}

export let mainPlayer: Character | null = null;
export const characters: Character[] = []; // Mudei de allCharacters para characters
export const gameUsers: GameUser[] = [];

let isHydrated = false;

// Função para notificar o Hook da mudança
export function notifyUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("characters:update")); // <--- MESMO NOME AQUI
  }
}

function mapImage(className: string) {
  const images: Record<string, string> = {
    "Maga": "🧙‍♀️", "Mestre das Feras": "🐺", "Guerreiro": "⚔️", "Arqueira": "🏹"
  };
  return images[className] || "❓";
}

export async function hydrateAll() {
  console.log("Iniciando hidratação...")

  // Se já tem dados, retorna logo os dados existentes
  if (isHydrated && characters.length > 0) {
    console.log("Já estava hidratado com dados.")
    return characters
  }

  try {
    const session = await getSession()
    const userId = session?.user?.id

    if (userId) {
      const resp = await getCharacterStatus(userId)
      if (resp?.character) {
        const c = resp.character
        mainPlayer = {
          id: String(c.id),
          nickName: c.nickName || "Herói",
          name: c.name || "Classe",
          image: mapImage(c.name),
          maxHp: c.hp || 100,
          maxMana: c.mana || 50,
          attack: c.attack || 10,
          magicAttack: c.magicAttack || 10,
          defense: c.defense || 5,
          dexterity: c.evasion || 5,
          level: Number(c.level || 1),
          experience: Number(c.experience || 0),
          gold: Number(c.gold || 0),
          points: Number(c.points || 0),
          victories: Number(c.victories || 0)
        }
      }
    }

    const fighters = await loadRankingFighters()
    console.log("Fighters recebidos da API:", fighters.length)

    const mappedFighters = fighters
      .filter(f => String(f.id) !== String(mainPlayer?.id))
      .map(f => ({
        id: String(f.id),
        nickName: f.nickName || "Inimigo",
        name: f.name || "Guerreiro",
        image: mapImage(f.name),
        maxHp: f.hp || 100,
        maxMana: f.mana || 50,
        attack: f.attack || 10,
        magicAttack: f.magicAttack || 10,
        defense: f.defense || 5,
        dexterity: f.evasion || 5
      }))

    if (mappedFighters.length === 0) {
      mappedFighters.push({
        id: "bot-training",
        nickName: "Mestre de Treino",
        name: "Guerreiro",
        image: "⚔️",
        maxHp: 150, maxMana: 50, attack: 12, magicAttack: 10, defense: 8, dexterity: 5
      })
    }

    // Atualiza a global
    characters.splice(0, characters.length, ...mappedFighters)

    isHydrated = true
    console.log("Hidratação concluída. Total:", characters.length)
    
    notifyUpdate()
    
    return characters // <--- RETORNE O ARRAY AQUI
  } catch (e) {
    console.error("Erro na hidratação:", e)
    isHydrated = false
    return []
  }
}