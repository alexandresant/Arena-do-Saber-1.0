export interface UserProps{
    name: string
    senha: string
    role: "admin" | "teacher" | "student"
}