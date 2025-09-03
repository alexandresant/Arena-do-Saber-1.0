"use client"
import React, { useEffect } from "react"
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
  email: z.email().min(1, "Digite um email válido"),
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
      // Faz login com credentials
      const response = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      })

      if (response?.error) {
        alert("Credenciais inválidas. Por favor, tente novamente.")
        return
      }

      const session = await getSession()
      if (!session || !session.user || !session.jwt) {
        alert("Erro ao obter a sessão do usuário. Por favor, tente novamente.")
        return
      }

      const jwt = session?.jwt
      //console.log("JWT: " + jwt)

      const userRole = session.user.role || "Authenticated"

      const { hasCharacter } = await getUserCharacters(jwt)
      //console.log("hasCharacter do back-end:", hasCharacter);

      // Redireciona conforme a role
      if (userRole === "Authenticated") {
        if (hasCharacter) {
          router.replace("/student-dashboard")
        }
        else {
          router.replace("/create-character")
        }
      } else if (userRole === "Teacher") {
        router.replace("/teacher-dashboard")
      } else if (userRole === "Admin") {
        router.replace("/admin-dashboard")
      }
    } catch (error) {
      if (error instanceof Error) alert(error.message)
      else alert("Erro desconhecido")
    } finally {
      form.reset()
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
                <Link href="/forgot-password" className="hover:text-muted-foreground">{t('forgotPassword')}</Link>
              </div>

              <Button className="w-full mt-2">{t('loginButton')}</Button>
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
