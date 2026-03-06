import {Home, BookOpen, Swords, Trophy, Shield, ShoppingCart} from "lucide-react"
import { useRouter } from "next/navigation"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, } from "@/components/ui/sidebar"

export function AppSidebar() {
    const {state} = useSidebar()
    const colapse = state === "collapsed"
    const router = useRouter()

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="p-4 border-b border-border">
                <div className="flex items-center gap-2">
                    <Shield className="h-7 w-7 text-primary shrink-0"/>
                    {!colapse && (
                        <span className="font-display text-lg font-bold text-primary rpg-text-glow tracking-wider">
                            Arena do Saber
                        </span>
                    )}
                </div>
            </SidebarHeader>

            <SidebarContent className="pt-4">
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        onClick={() => router.push("/student/dashboard")}
                                        className="flex items-center gap-2"
                                    >
                                        <Home className="h-5 w-5"/>
                                        Dashboard
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        onClick={() => router.push("/student/subjects")}
                                        className="flex items-center gap-2"
                                    >
                                        <BookOpen className="h-5 w-5"/>
                                        Estudar
                                    </SidebarMenuButton>
                                    <SidebarMenuButton
                                        onClick={() => router.push("/student/stats-combatente")}
                                        className="flex items-center gap-2"
                                    >
                                        <Swords className="h-5 w-5"/>
                                        Batalhar
                                    </SidebarMenuButton>
                                    <SidebarMenuButton
                                        onClick={() => router.push("/student/ranking")}
                                        className="flex items-center gap-2"
                                    >
                                        <Trophy className="h-5 w-5"/>
                                        Ranking
                                    </SidebarMenuButton>
                                    <SidebarMenuButton
                                        onClick={() => router.push("/student/shop")}
                                        className="flex items-center gap-2"
                                    >
                                        <ShoppingCart className="h-5 w-5"/>
                                        Loja
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}