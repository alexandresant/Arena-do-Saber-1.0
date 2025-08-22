export interface UserProps{
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
  jwt: string;
  user: StrapiUser;
}
