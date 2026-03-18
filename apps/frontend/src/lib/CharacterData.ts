// @/lib/CharacterData.ts - Correção
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
  level?: number;
  experience?: number;
  gold?: number;
  points?: number;
  victories?: number;
}

export interface GameUser {
  id: string; 
  nickName: string; 
  level: number; 
  character: Character;
}

export let mainPlayer: Character | null = null;
export const characters: Character[] = [];
export const gameUsers: GameUser[] = []; // Será preenchido

let isHydrated = false;

export function notifyUpdate() {
  if (typeof window !== "undefined") {
    console.log("CharacterData: Disparando evento characters:update");
    window.dispatchEvent(new CustomEvent("characters:update"));
  }
}

function mapImage(className: string) {
  const images: Record<string, string> = {
    "Maga": "🧙‍♀️", 
    "Mestre das Feras": "🐺", 
    "Guerreiro": "⚔️", 
    "Arqueira": "🏹"
  };
  return images[className] || "❓";
}

export async function hydrateAll() {
  console.log("Iniciando hidratação...");

  if (isHydrated && characters.length > 0) {
    console.log("Já estava hidratado com dados.");
    return characters;
  }

  try {
    const session = await getSession();
    const userId = session?.user?.id;

    if (userId) {
      const resp = await getCharacterStatus(userId);
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
          dexterity: c.evasion || 5,
          level: c.level || 1,
          experience: Number(c.experience || 0),
          gold: Number(c.gold || 0),
          points: Number(c.points || 0),
          victories: Number(c.victories || 0)
        };
      }
    }

    const fighters = await loadRankingFighters();
    console.log("Fighters recebidos da API:", fighters);

    // Preenche characters (personagens para batalha)
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
        dexterity: f.evasion || 5,
        level: f.level || 1,
      }));

    if (mappedFighters.length === 0) {
      mappedFighters.push({
        id: "bot-training",
        nickName: "Mestre de Treino",
        name: "Guerreiro",
        image: "⚔️",
        maxHp: 150, 
        maxMana: 50, 
        attack: 12, 
        magicAttack: 10, 
        defense: 8, 
        dexterity: 5,
        level: 5
      });
    }

    // Atualiza characters
    characters.splice(0, characters.length, ...mappedFighters);
    
    // 🔥 CORREÇÃO CRÍTICA: Preenche gameUsers também!
    // Transforma cada personagem em um GameUser
    gameUsers.splice(0, gameUsers.length, ...mappedFighters.map((character, index) => ({
      id: character.id,
      nickName: `Player${index + 1}`, // Ou use outro campo se disponível
      level: 1, // Defina o nível apropriado
      character: character
    })));

    isHydrated = true;
    console.log("Hidratação concluída. Total characters:", characters.length, "Total gameUsers:", gameUsers.length);
    
    notifyUpdate();
    
    return characters;
  } catch (e) {
    console.error("Erro na hidratação:", e);
    isHydrated = false;
    return [];
  }
}
