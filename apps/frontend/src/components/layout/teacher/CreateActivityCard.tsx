import { Card } from "@/components/ui/card"
import { Dialog } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import{useForm} from "react-hook-form"

const formSchema = z.object({
    question: z.string().min(20, "A questão deve ter no mínimp 20 caracteres"),
    correct: z.enum(["A", "B", "C", "D"], "Você deve indicar a opção correta!"), 
    points: z.number().min(1, "Defina a quantidade de pontos para esta questão!")
})