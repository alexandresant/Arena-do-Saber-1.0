"use client"

import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

export default function Home() {
  const t = useTranslations("page");

  const { status } =  useSession()
  const router = useRouter()

  useEffect(() =>{
    if (status === 'authenticated'){
      router.replace('/student/dasboard')
    }
    else if(status === 'unauthenticated'){
      router.replace('/login')
    }
  }, [status, router])
  
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  )
}
