// @/lib/CharacterData
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
  console.log("Iniciando hidratação...");

  // 1. Se já tem dados, não faz nada.
  if (isHydrated && characters.length > 0) {
    console.log("Já estava hidratado com dados.");
    return;
  }

  try {
    const session = await getSession();
    const userId = session?.user?.id;

    // Carrega o Player...
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

    // 2. Carrega Lutadores
    const fighters = await loadRankingFighters();
    console.log("Fighters recebidos:", fighters.length);

    const mappedFighters = fighters
      .filter(f => String(f.id) !== String(mainPlayer?.id)) // Comparação segura de String
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
      }));

    // Caso de segurança: se não houver outros jogadores, cria um bot
    if (mappedFighters.length === 0) {
      mappedFighters.push({
        id: "bot-training",
        nickName: "Mestre de Treino",
        name: "Guerreiro",
        image: "⚔️",
        maxHp: 150, maxMana: 50, attack: 12, magicAttack: 10, defense: 8, dexterity: 5
      });
    }

    characters.splice(0, characters.length, ...mappedFighters);

    // 3. Carrega Usuários
    const users = await loadRankingUser();
    gameUsers.splice(0, gameUsers.length, ...users.map((u, i) => ({
      id: String(u.id),
      username: u.username,
      level: Math.max(1, Math.floor((u.points ?? 0) / 100)),
      character: characters[i % characters.length] || mainPlayer
    })));

    // ⚠️ SÓ AGORA marcamos como hidratado e notificamos o Hook!
    isHydrated = true;
    console.log("Hidratação concluída com sucesso. Personagens:", characters.length);
    notifyUpdate();

  } catch (e) {
    console.error("Erro na hidratação:", e);
    // Mesmo em erro, paramos o loading para não travar a tela
    isHydrated = false; 
    notifyUpdate();
  }
}