"use client"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { useAppStore } from "@/store/app-store"
import { DashboardSection } from "@/components/sections/dashboard"
import { StudentsSection } from "@/components/sections/students"
import { TeachersSection } from "@/components/sections/teachers"
import { CoursesSection } from "@/components/sections/courses"
import { GroupsSection } from "@/components/sections/groups"
import { ScheduleSection } from "@/components/sections/schedule"
import { PaymentsSection } from "@/components/sections/payments"
import { AttendanceSection } from "@/components/sections/attendance"
import { CertificatesSection } from "@/components/sections/certificates"
import { SettingsSection } from "@/components/sections/settings"
import { cn } from "@/lib/utils"

export default function Home() {
  const { currentView } = useAppStore()

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardSection />
      case "students":
        return <StudentsSection />
      case "teachers":
        return <TeachersSection />
      case "courses":
        return <CoursesSection />
      case "groups":
        return <GroupsSection />
      case "schedule":
        return <ScheduleSection />
      case "payments":
        return <PaymentsSection />
      case "attendance":
        return <AttendanceSection />
      case "certificates":
        return <CertificatesSection />
      case "settings":
        return <SettingsSection />
      default:
        return <DashboardSection />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <main className={cn(
        "transition-all duration-300 min-h-screen",
        "md:ml-64 p-4 md:p-6 pt-16 md:pt-6"
      )}>
        {renderContent()}
      </main>
    </div>
  )
}
