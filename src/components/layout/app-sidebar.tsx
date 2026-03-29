"use client"

import { useAppStore, ViewType } from "@/store/app-store"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  CreditCard,
  ClipboardCheck,
  Award,
  Settings,
  Menu,
  X,
  Languages,
  Building2,
  Globe2,
  LanguagesIcon,
  School,
  BookMarked
} from "lucide-react"
import { Button } from "@/components/ui/button"

const menuItems: { id: ViewType; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Tableau de bord", icon: <LayoutDashboard className="h-5 w-5" /> },
  { id: "students", label: "Apprenants", icon: <Users className="h-5 w-5" /> },
  { id: "teachers", label: "Formateurs", icon: <GraduationCap className="h-5 w-5" /> },
  { id: "courses", label: "Formations", icon: <BookOpen className="h-5 w-5" /> },
  { id: "groups", label: "Groupes", icon: <Languages className="h-5 w-5" /> },
  { id: "schedule", label: "Planning", icon: <Calendar className="h-5 w-5" /> },
  { id: "payments", label: "Paiements", icon: <CreditCard className="h-5 w-5" /> },
  { id: "attendance", label: "Présences", icon: <ClipboardCheck className="h-5 w-5" /> },
  { id: "certificates", label: "Certificats", icon: <Award className="h-5 w-5" /> },
  { id: "settings", label: "Paramètres", icon: <Settings className="h-5 w-5" /> },
]

export function AppSidebar() {
  const { currentView, setCurrentView, sidebarOpen, setSidebarOpen } = useAppStore()

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-50 transition-transform duration-300",
          "md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 p-6 border-b border-border">
          <img 
            src="/favicon.png" 
            alt="Logo" 
            className="h-10 w-10 rounded-lg object-contain"
          />
          <div>
            <h1 className="font-bold text-base leading-tight">High Tech Training</h1>
            <p className="text-xs text-muted-foreground">Center El Jadida</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id)
                setSidebarOpen(false)
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                currentView === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-muted-foreground">Administrateur</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
