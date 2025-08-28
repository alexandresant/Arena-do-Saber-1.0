export interface UserProps {
  email: string
  password: string
  role?: "admin" | "teacher" | "student"
  name?: string
}

export interface StrapiUser {
  id: number
  username: string
  email: string
  role?: string
  admin_verified: boolean
}

export interface AuthResponse {
  jwt: string
  user: StrapiUser
}

export interface RegisterProps {
  email: string
  username: string
  password: string
}
export interface Character {
  userId?: number
  characterId?: number
  name: string
  nickName: string
  description?: string
  image?: string
  strength: number
  intelligence: number
  constitution: number
  agility: number
  experience: number
  nivel: number
}
export interface CharacterTemplate {
  id: number
  name: string
  description: string
  image: string
  level: number
  strenghtBase: number
  intelligenceBase: number
  constitutionBase: number
  agilityBase: number
}
export interface CombatentStats{
  totalHp: number
  totalMana: number
  mana: number
  hp: number
  phisicalAtack: number
  magicAtack: number
  evasion: number
  defense: number
}