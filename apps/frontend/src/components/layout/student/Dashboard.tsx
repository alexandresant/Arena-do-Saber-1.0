"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="min-h-screen w-full flex flex-col">
                <div className="m-4 flex items-center gap-4">
                    <SidebarTrigger />
                    <Button 
                        variant ="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-destructive transition-colors ml-auto"
                        onClick={() => signOut()}
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sair
                    </Button>
                </div>
                {/* Removido o flex-row daqui para o main ocupar a linha toda abaixo do trigger */}
                <main className="flex-1 m-4 mt-0 bg-background p-4 md:p-6 space-y-6 rounded-xl border shadow-sm w-[calc(100%-2rem)]">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}