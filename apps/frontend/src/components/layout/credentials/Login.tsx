"use client"
import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import Link from "next/link"

import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Image from "next/image"
import { useRouter } from "@/i18n/navigation"
import { signIn, getSession } from "next-auth/react"
import { getUserCharacters } from "@/lib/api/createCharacter"

import logo from "../../../../public/logo.png"

const formSchema = z.object({
  email: z.string().email("Digite um email válido").min(1, "Email é obrigatório"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 digitos"),
  rememberme: z.boolean().optional()
})

export function Login() {
  const router = useRouter()
  const t = useTranslations("LoginPage")

  type FormLogin = z.infer<typeof formSchema>
  const form = useForm<FormLogin>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberme: false
    }
  })

  async function onSubmit(data: FormLogin) {
    try {
      // 1. Faz o login sem redirecionamento automático
      const response = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (response?.error) {
        alert("Credenciais inválidas. Por favor, tente novamente.")
        return
      }

      // 2. Aguarda a sessão ser escrita e sincronizada
      const session = await getSession()
      
      if (!session || !session.user) {
        // Se a sessão falhar na primeira tentativa, forçamos um refresh e paramos
        router.refresh()
        return
      }

      const jwt = (session as any).jwt
      const userRole = session.user.role

      // 3. Busca dados adicionais do Strapi usando o JWT da sessão
      const { hasCharacter } = await getUserCharacters(jwt)
      
      // 4. Determina a rota de destino
      let targetPath = "/login"

      if (userRole === "Authenticated") {
        targetPath = hasCharacter ? "/student-dashboard" : "/create-character"
      } else if (userRole === "Teacher") {
        targetPath = "/teacher-dashboard"
      } else if (userRole === "Admin") {
        targetPath = "/admin-dashboard"
      }

      // 5. Refresh limpa o cache do roteador para que o Middleware veja o novo cookie
      router.refresh()

      // 6. Pequeno delay para garantir persistência do cookie antes da navegação
      setTimeout(() => {
        router.replace(targetPath)
      }, 150)

    } catch (error) {
      if (error instanceof Error) alert(error.message)
      else alert("Erro desconhecido")
    }
  }

  return (
    <div className="flex justify-center text-center mt-36">
      <Card className="w-[550px] h-[550px]">
        <CardHeader className="gap-1">
          <div className="flex items-center justify-center">
            <Image
              src={logo}
              alt="Logo"
              width={150}
              height={150}
            />
            <CardTitle className="text-2xl">{t('title')}</CardTitle>
          </div>
          <CardDescription className="text-lg">{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('formLabelEmail')}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={t('placeholderEmail')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="mt-4">
                    <FormLabel>{t('formLabelPassword')}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={t('placeholderPassword')}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-row items-center justify-between mt-4">
                <div className="flex flex-row gap-2">
                  <FormField
                    control={form.control}
                    name="rememberme"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Label>{t('checkbox')}</Label>
                </div>
                <Link href="/forgot-password" className="text-sm hover:text-muted-foreground">{t('forgotPassword')}</Link>
              </div>

              <Button type="submit" className="w-full mt-2" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "..." : t('loginButton')}
              </Button>
            </form>
          </Form>
          <div className="mt-4 hover:text-muted-foreground">
            <Link href="/register">{t('register')}</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
