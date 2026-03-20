import { Home, BookOpen, Swords, Trophy, Shield, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, } from "@/components/ui/sidebar"
import { useTranslations } from "next-intl"
import { useSession } from "next-auth/react"

export function AppSidebar() {
    const { state } = useSidebar()
    const colapse = state === "collapsed"
    const router = useRouter()
    const t = useTranslations('StudentDashboardPage')
    const { data: session } = useSession()
    const userName = session?.user?.name || "N/A"


    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center gap-2">
                    <Shield className="h-7 w-7 text-primary shrink-0" />
                    {!colapse && (
                        <span className="font-display text-lg font-bold text-primary rpg-text-glow tracking-wider">
                            Arena do Saber
                        </span>
                    )}
                </div>
                <p className="text-sm text-muted-foreground">{userName}</p>
            </SidebarHeader>
            <SidebarContent className="pt-4">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={() => router.push("/student-dashboard")}
                                    className="flex items-center gap-2"
                                >
                                    <Home className="h-5 w-5" />
                                    Dashboard
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    onClick={() => router.push("/select-subject")}
                                    className="flex items-center gap-2"
                                >
                                    <BookOpen className="h-5 w-5" />
                                    Estudar
                                </SidebarMenuButton>
                                <SidebarMenuButton
                                    onClick={() => router.push("/battle-arena")}
                                    className="flex items-center gap-2"
                                >
                                    <Swords className="h-5 w-5" />
                                    Batalhar
                                </SidebarMenuButton>
                                <SidebarMenuButton
                                    onClick={() => router.push("/ranking")}
                                    className="flex items-center gap-2"
                                >
                                    <Trophy className="h-5 w-5" />
                                    Ranking
                                </SidebarMenuButton>
                                <SidebarMenuButton
                                    onClick={() => router.push("/shop")}
                                    className="flex items-center gap-2"
                                >
                                    <ShoppingCart className="h-5 w-5" />
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