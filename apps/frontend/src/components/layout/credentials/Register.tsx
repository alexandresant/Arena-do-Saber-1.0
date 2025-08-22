"use client"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Image from "next/image"
import logo from "../../../../public/logo.png"
import { useTranslations } from "next-intl"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
  firstName: z.string().min(3, "Nome é obrigatório"),
  lastName: z.string().min(3, "Sobrenome é obrigatório"),
  email: z.email("Digite um email válido"),
  username: z.string().min(3, "Digite um nome de usuário"),
  password: z.string().min(6, "Senha é obrigatória"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
})

export function Register() {
  const t = useTranslations("RegisterPage")
  type RegisterFormData = z.infer<typeof formSchema>

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: ""
    }
  })

  async function onSubmit(data: RegisterFormData) {
    console.log("Dados do formulário:", data)
    // Aqui você chamaria a API do Strapi para criar o usuário
  }

  return (
    <div className="flex justify-center text-center mt-10">
      <Card className="w-[550px]">
        <CardHeader className="gap-1">
          <div className="flex flex-col items-center justify-center gap-2">
            <Image src={logo} alt="Logo" width={150} height={150} />
            <CardTitle className="text-2xl">{t('title')}</CardTitle>
          </div>
          <CardDescription className="text-lg">{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 text-left">
              
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('formLabelFirstName')}</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('formLabelLastName')}</FormLabel>
                    <FormControl>
                      <Input placeholder="Sobrenome" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('formLabelEmail')}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="E-mail" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('formLabelUsername')}</FormLabel>
                    <FormControl>
                      <Input placeholder="Usuário" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('formLabelPassword')}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('formLabelConfirmPassword')}</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Confirmar Senha" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full mt-4">
                {t('submit')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
