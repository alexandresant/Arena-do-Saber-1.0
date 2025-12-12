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
  evasion?: number,
  points?: number
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
export interface CombatentStats {
  totalHp: number
  totalMana: number
  mana: number
  hp: number
  phisicalAttack: number
  magicAttack: number
  evasion: number
  defense: number
}
export interface TeacherDashboardProps {
  teacher: string
}

export interface ClassProps {
  id: number
  name: string
  student: {
    id?: number
    username: string
    level: number
    nickName: string
  }[]
  activities?: {
    id: number
    name: string
  }[]
}

export interface ClassCardProps {
  turmas: ClassProps[]
  turmaSelecionada: ClassProps | null
  onClassSelect: (turma: ClassProps) => void
}

export interface ActivityProps {
  name: string
  id: number
  questions: {
    id: number
    description: string
    answerA: string
    answerB: string
    answerC: string
    answerD: string
    correct: "A" | "B" | "C" | "D"
    points: number
  }[]
}

export interface CreateClassProps {
  name: string
  code: string
  teacher?: number
  subject: string
}

export interface QuestionProps {
  description: string
  answerA: string
  answerB: string
  answerC: string
  answerD: string
  correct: "A" | "B" | "C" | "D"
  points: number
  activityId: number
}

export interface ranckingUserProps {
  id: number
  username: string
  points: number
  characterName: string
  characterLevel: number
}

export interface FighterProps {
  id: number
  nickName: string
  points: number
  level: number
  victories: number
}

