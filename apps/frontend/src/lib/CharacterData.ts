import { loadRankingFighters, loadRankingUser } from "./api/loadRanking"
import { getCharacterStatus } from "@/lib/api/createCharacter"
import { getSession } from "next-auth/react"

export interface Character {
  id: string; nickName: string; name: string; image: string;
  maxHp: number; maxMana: number; attack: number;
  magicAttack: number; defense: number; dexterity: number;
}

export interface GameUser {
  id: string; username: string; level: number; character: Character;
}

// Armazenamento volátil
export let mainPlayer: Character | null = null;
export const allCharacters: Character[] = [];
export const gameUsers: GameUser[] = [];

let isHydrated = false;

export function notifyUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("gameData:updated"));
  }
}

function mapImage(className: string) {
  const images: Record<string, string> = {
    "Maga": "🧙‍♀️", "Mestre das Feras": "🐺", "Guerreiro": "⚔️", "Arqueira": "🏹"
  };
  return images[className] || "❓";
}

export async function hydrateAll() {
  if (isHydrated) return;
  
  try {
    const session = await getSession();
    const userId = session?.user?.id;

    // 1. Carrega o Player Principal (Não entra na lista geral)
    if (userId) {
      const resp = await getCharacterStatus(Number(userId));
      if (resp?.character) {
        const c = resp.character;
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
          dexterity: c.evasion || 5
        };
      }
    }

    // 2. Carrega Lutadores (Fighters)
    const fighters = await loadRankingFighters();
    allCharacters.splice(0, allCharacters.length, ...fighters
      .filter(f => String(f.id) !== mainPlayer?.id) // Remove o player da lista
      .map(f => ({
        id: String(f.id),
        nickName: f.nickName || "Inimigo",
        name: f.name || "Classe",
        image: mapImage(f.name),
        maxHp: f.hp || 0,
        maxMana: f.mana || 0,
        attack: f.attack || 0,
        magicAttack: f.magicAttack || 0,
        defense: f.defense || 0,
        dexterity: f.evasion || 0
      })));

    // 3. Carrega Usuários
    const users = await loadRankingUser();
    gameUsers.splice(0, gameUsers.length, ...users.map((u, i) => ({
      id: String(u.id),
      username: u.username,
      level: Math.max(1, Math.floor((u.points ?? 0) / 100)),
      character: allCharacters[i % allCharacters.length] || mainPlayer
    })));

    isHydrated = true;
    notifyUpdate();
  } catch (e) {
    console.error("Erro na hidratação:", e);
  }
}