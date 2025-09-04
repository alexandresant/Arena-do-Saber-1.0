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
  id?: number
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
  level: number
  experienceToNextLevel?: number
  defense?: number
  attack?: number
  hp?: number
  mana?: number
  magicAttack?: number
  evasion?: number
}
export interface CharacterTemplate {
  id: number
  name: string
  description: string
  image: string
  level: number
  strengthBase: number
  intelligenceBase: number
  constitutionBase: number
  agilityBase: number
}
export interface CombatentStats{
  totalHp: number
  totalMana: number
  mana: number
  hp: number
  phisicalAttack: number
  magicAttack: number
  evasion: number
  defense: number
}
export interface TeacherDashboardProps{
  teacher: string
}

export interface ClassProps{
  id: number
  nome: string
  alunos: {
    id?: number
    nome: string
    level: number
    nickName: string
  }[]
}

export interface ClassCardProps{
  turmas: ClassProps[]
  turmaSelecionada: ClassProps | null
  onClassSelect: (turma: ClassProps) => void
}