"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react"

interface DashboardStats {
  totalStudents: number
  activeStudents: number
  totalTeachers: number
  activeTeachers: number
  totalCourses: number
  totalGroups: number
  activeGroups: number
  totalRevenue: number
  pendingPayments: number
  upcomingClasses: number
}

interface RecentActivity {
  id: string
  type: string
  description: string
  date: string
  status: string
}

export function DashboardSection() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activitiesRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/activities')
      ])
      
      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }
      
      if (activitiesRes.ok) {
        const activitiesData = await activitiesRes.json()
        setRecentActivities(activitiesData)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: "Apprenants",
      value: stats?.totalStudents || 0,
      subtitle: `${stats?.activeStudents || 0} actifs`,
      icon: <Users className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30"
    },
    {
      title: "Formateurs",
      value: stats?.totalTeachers || 0,
      subtitle: `${stats?.activeTeachers || 0} actifs`,
      icon: <GraduationCap className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30"
    },
    {
      title: "Groupes actifs",
      value: stats?.activeGroups || 0,
      subtitle: `sur ${stats?.totalGroups || 0} groupes`,
      icon: <BookOpen className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30"
    },
    {
      title: "Revenus du mois",
      value: `${(stats?.totalRevenue || 0).toLocaleString('fr-FR')} DH`,
      subtitle: `${stats?.pendingPayments || 0} paiements en attente`,
      icon: <CreditCard className="h-5 w-5" />,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <p className="text-muted-foreground">
          Bienvenue sur le système de gestion de High Tech Training Center El Jadida
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <span className={stat.color}>{stat.icon}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Classes */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Prochains cours
            </CardTitle>
            <CardDescription>
              Les cours planifiés pour les prochains jours
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length > 0 ? recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.date}</p>
                  </div>
                  <Badge variant={activity.status === 'scheduled' ? 'default' : 'secondary'}>
                    {activity.type}
                  </Badge>
                </div>
              )) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Aucun cours planifié</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Statistiques rapides</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Taux de présence</span>
                <span className="font-medium">87%</span>
              </div>
              <Progress value={87} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Taux de réussite</span>
                <span className="font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Capacité groupes</span>
                <span className="font-medium">73%</span>
              </div>
              <Progress value={73} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Paiements reçus</span>
                <span className="font-medium">95%</span>
              </div>
              <Progress value={95} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enrollments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Inscriptions récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-sm">Marie Dupont</p>
                  <p className="text-xs text-muted-foreground">Anglais Intermédiaire</p>
                </div>
                <Badge variant="outline">Aujourd'hui</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-sm">Jean Martin</p>
                  <p className="text-xs text-muted-foreground">Espagnol Débutant</p>
                </div>
                <Badge variant="outline">Hier</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-sm">Sophie Bernard</p>
                  <p className="text-xs text-muted-foreground">Allemand Avancé</p>
                </div>
                <Badge variant="outline">2 jours</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Actions en attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                <div>
                  <p className="font-medium text-sm">Paiements en retard</p>
                  <p className="text-xs text-muted-foreground">3 paiements dépassés</p>
                </div>
                <Badge variant="destructive">Urgent</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
                <div>
                  <p className="font-medium text-sm">Certificats à émettre</p>
                  <p className="text-xs text-muted-foreground">5 certificats prêts</p>
                </div>
                <Badge variant="secondary">À traiter</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                <div>
                  <p className="font-medium text-sm">Groupes à planifier</p>
                  <p className="text-xs text-muted-foreground">2 nouveaux groupes</p>
                </div>
                <Badge variant="outline">Planifier</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
