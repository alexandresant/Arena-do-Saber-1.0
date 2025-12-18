import { loadRankingFighters, loadRankingUser } from "./api/loadRanking"
import { getCharacterStatus } from "@/lib/api/createCharacter"
import { getSession } from "next-auth/react"

/* =========================
   Interfaces (INALTERADAS)
========================= */

export interface Character {
  id: string
  nickName: string
  name: string
  image: string
  maxHp: number
  maxMana: number
  attack: number
  magicAttack: number
  defense: number
  dexterity: number
}

export interface GameUser {
  id: string
  username: string
  level: number
  character: Character
}

/* =========================
   FALLBACK (MESMA REFERÊNCIA)
========================= */

const fallbackCharacter: Character = {
  id: "fallback",
  nickName: "Desconhecido",
  name: "Desconhecido",
  image: "❓",
  maxHp: 0,
  maxMana: 0,
  attack: 0,
  magicAttack: 0,
  defense: 0,
  dexterity: 0,
}

function notifyCharactersUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("characters:update"))
  }
}

/* =========================
   EXPORTS (INALTERADOS)
========================= */

export const characters: Character[] = [fallbackCharacter]

export const gameUsers: GameUser[] = [
  {
    id: "loading",
    username: "Carregando...",
    level: 1,
    character: fallbackCharacter,
  },
]

/* =========================
   HIDRATA FALLBACK PELO STATUS DO PERSONAGEM
========================= */

async function hydrateFallbackCharacter() {
  try {
    console.log("[Fallback] Iniciando hidratação via getCharacterStatus")

    const session = await getSession()
    console.log("[Fallback] Session:", session)

    const userId = session?.user?.id
    console.log("[Fallback] userId:", userId)

    if (!userId) {
      console.warn("[Fallback] userId ausente. Abortando hidratação.")
      return
    }

    const response = await getCharacterStatus(Number(userId))
    console.log("[Fallback] Resposta bruta de getCharacterStatus:", response)

    const character = response?.character
    console.log("[Fallback] Character selecionado:", character)

    if (!character) {
      console.warn(
        "[Fallback] Nenhum personagem encontrado para o usuário. Mantendo fallback padrão."
      )
      return
    }

    fallbackCharacter.id = String(character.id)
    fallbackCharacter.nickName = character.nickName ?? "Desconhecido"
    fallbackCharacter.name = character.name ?? "Desconhecido"
    fallbackCharacter.maxHp = character.hp ?? 0
    fallbackCharacter.maxMana = character.mana ?? 0
    fallbackCharacter.attack = character.attack ?? 0
    fallbackCharacter.magicAttack = character.magicAttack ?? 0
    fallbackCharacter.defense = character.defense ?? 0
    fallbackCharacter.dexterity = character.evasion ?? 0

    let image = "❓"
    if (character.name === "Maga") image = "🧙‍♀️"
    if (character.name === "Mestre das Feras") image = "🐺"
    if (character.name === "Guerreiro") image = "⚔️"
    if (character.name === "Arqueira") image = "🏹"

    fallbackCharacter.image = image

    /* 🔴 FORÇA REATIVIDADE */
    characters.splice(0, characters.length, fallbackCharacter)
    notifyCharactersUpdate()

    console.log(
      "[Fallback] fallbackCharacter aplicado ao array characters:",
      fallbackCharacter
    )
  } catch (error) {
    console.error("[Fallback] Erro ao hidratar fallbackCharacter:", error)
  }
}

/* =========================
   CARGA REAL DO STRAPI
========================= */

async function hydrateCharacters() {
  const fighters = await loadRankingFighters()
  if (!fighters.length) return

  characters.splice(
    0,
    characters.length,
    ...fighters.map((fighter) => {
      const name = fighter.nickName ?? "Sem Nome"

    let image = "❓"
    if (fighter.name === "Maga") image = "🧙‍♀️"
    if (fighter.name === "Mestre das Feras") image = "🐺"
    if (fighter.name === "Guerreiro") image = "⚔️"
    if (fighter.name === "Arqueira") image = "🏹"

      return {
        id: String(fighter.id),
        nickName: fighter.nickName ?? "Sem Nick",
        name: fighter.name ?? "Sem Nome",
        image,
        maxHp: fighter.hp ?? 0,
        maxMana: fighter.mana ?? 0,
        attack: fighter.attack ?? 0,
        magicAttack: fighter.magicAttack ?? 0,
        defense: fighter.defense ?? 0,
        dexterity: fighter.evasion ?? 0,
      }
    })
  )
  notifyCharactersUpdate()
}

async function hydrateGameUsers() {
  const users = await loadRankingUser()
  if (!users.length) return

  gameUsers.splice(
    0,
    gameUsers.length,
    ...users.map((user, index) => ({
      id: String(user.id),
      username: user.username,
      level: Math.max(1, Math.floor((user.points ?? 0) / 100)),
      character: characters[index % characters.length] ?? fallbackCharacter,
    }))
  )
  notifyCharactersUpdate()
}

/* =========================
   API DE HIDRATAÇÃO
========================= */

export async function hydrateAllCharacters() {
  await hydrateFallbackCharacter()
  await hydrateCharacters()
  await hydrateGameUsers()
}
