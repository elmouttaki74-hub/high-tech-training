"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  Users,
  Calendar,
  BookOpen,
  GraduationCap,
  UserPlus
} from "lucide-react"
import { toast } from "sonner"

interface Group {
  id: string
  name: string
  code: string
  courseId: string
  course: {
    id: string
    name: string
    language: {
      name: string
      icon: string | null
    }
  }
  teacherId: string | null
  teacher: {
    id: string
    firstName: string
    lastName: string
  } | null
  levelId: string | null
  level: {
    id: string
    name: string
  } | null
  startDate: string
  endDate: string
  maxStudents: number
  status: string
  room: string | null
  _count?: {
    enrollments: number
  }
  createdAt: string
}

interface Course {
  id: string
  name: string
  language: {
    name: string
  }
}

interface Teacher {
  id: string
  firstName: string
  lastName: string
}

interface Level {
  id: string
  name: string
}

const initialFormData = {
  name: "",
  code: "",
  courseId: "",
  teacherId: "",
  levelId: "",
  startDate: "",
  endDate: "",
  maxStudents: "20",
  status: "PLANNED",
  room: ""
}

export function GroupsSection() {
  const [groups, setGroups] = useState<Group[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [formData, setFormData] = useState(initialFormData)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchGroups()
    fetchCourses()
    fetchTeachers()
    fetchLevels()
  }, [])

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/groups')
      if (response.ok) {
        const data = await response.json()
        setGroups(data)
      }
    } catch (error) {
      console.error('Error fetching groups:', error)
      toast.error("Erreur lors du chargement des groupes")
    } finally {
      setLoading(false)
    }
  }

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      if (response.ok) {
        setCourses(await response.json())
      }
    } catch (error) {
      console.error('Error fetching courses:', error)
    }
  }

  const fetchTeachers = async () => {
    try {
      const response = await fetch('/api/teachers')
      if (response.ok) {
        setTeachers(await response.json())
      }
    } catch (error) {
      console.error('Error fetching teachers:', error)
    }
  }

  const fetchLevels = async () => {
    try {
      const response = await fetch('/api/levels')
      if (response.ok) {
        setLevels(await response.json())
      }
    } catch (error) {
      console.error('Error fetching levels:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = isEditing ? `/api/groups/${selectedGroup?.id}` : '/api/groups'
      const method = isEditing ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          maxStudents: parseInt(formData.maxStudents),
          teacherId: formData.teacherId || null,
          levelId: formData.levelId || null
        })
      })

      if (response.ok) {
        toast.success(isEditing ? "Groupe modifié avec succès" : "Groupe ajouté avec succès")
        setDialogOpen(false)
        setFormData(initialFormData)
        setSelectedGroup(null)
        setIsEditing(false)
        fetchGroups()
      } else {
        const error = await response.json()
        toast.error(error.error || "Une erreur est survenue")
      }
    } catch (error) {
      toast.error("Une erreur est survenue")
    }
  }

  const handleDelete = async () => {
    if (!selectedGroup) return
    
    try {
      const response = await fetch(`/api/groups/${selectedGroup.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success("Groupe supprimé avec succès")
        setDeleteDialogOpen(false)
        setSelectedGroup(null)
        fetchGroups()
      } else {
        toast.error("Erreur lors de la suppression")
      }
    } catch (error) {
      toast.error("Une erreur est survenue")
    }
  }

  const openEditDialog = (group: Group) => {
    setSelectedGroup(group)
    setFormData({
      name: group.name,
      code: group.code,
      courseId: group.courseId,
      teacherId: group.teacherId || "",
      levelId: group.levelId || "",
      startDate: group.startDate.split('T')[0],
      endDate: group.endDate.split('T')[0],
      maxStudents: group.maxStudents.toString(),
      status: group.status,
      room: group.room || ""
    })
    setIsEditing(true)
    setDialogOpen(true)
  }

  const openCreateDialog = () => {
    setFormData(initialFormData)
    setSelectedGroup(null)
    setIsEditing(false)
    setDialogOpen(true)
  }

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.course.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string; className?: string }> = {
      PLANNED: { variant: "outline", label: "Planifié" },
      IN_PROGRESS: { variant: "default", label: "En cours", className: "bg-green-600" },
      COMPLETED: { variant: "secondary", label: "Terminé" },
      CANCELLED: { variant: "destructive", label: "Annulé" }
    }
    const { variant, label, className } = variants[status] || { variant: "outline", label: status }
    return <Badge variant={variant} className={className}>{label}</Badge>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Groupes</h1>
          <p className="text-muted-foreground">
            Gérez les groupes et classes de formation
          </p>
        </div>
        <Button onClick={openCreateDialog} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau groupe
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{groups.length}</p>
                <p className="text-xs text-muted-foreground">Total groupes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{groups.filter(g => g.status === 'IN_PROGRESS').length}</p>
                <p className="text-xs text-muted-foreground">En cours</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{groups.filter(g => g.status === 'PLANNED').length}</p>
                <p className="text-xs text-muted-foreground">Planifiés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
                <UserPlus className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {groups.reduce((sum, g) => sum + (g._count?.enrollments || 0), 0)}
                </p>
                <p className="text-xs text-muted-foreground">Inscriptions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher un groupe..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 max-w-md"
        />
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            {searchQuery ? "Aucun groupe trouvé" : "Aucun groupe enregistré"}
          </div>
        ) : (
          filteredGroups.map((group) => {
            const enrollmentCount = group._count?.enrollments || 0
            const capacityPercent = (enrollmentCount / group.maxStudents) * 100
            
            return (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        {group.course.language.icon ? (
                          <span className="text-2xl">{group.course.language.icon}</span>
                        ) : (
                          <BookOpen className="h-6 w-6 text-indigo-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold">{group.name}</h3>
                        <p className="text-sm text-muted-foreground">{group.code}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(group)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => {
                            setSelectedGroup(group)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Formation</span>
                      <span className="text-sm font-medium">{group.course.name}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Formateur</span>
                      <span className="text-sm font-medium">
                        {group.teacher 
                          ? `${group.teacher.firstName} ${group.teacher.lastName}` 
                          : "Non assigné"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Niveau</span>
                      <span className="text-sm font-medium">
                        {group.level?.name || "Non défini"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Statut</span>
                      {getStatusBadge(group.status)}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Période</span>
                      <span className="text-sm">
                        {new Date(group.startDate).toLocaleDateString('fr-FR')} - {new Date(group.endDate).toLocaleDateString('fr-FR')}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Capacité</span>
                        <span>{enrollmentCount}/{group.maxStudents}</span>
                      </div>
                      <Progress 
                        value={capacityPercent} 
                        className={`h-2 ${capacityPercent >= 90 ? '[&>div]:bg-orange-500' : ''}`}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Modifier le groupe" : "Nouveau groupe"}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Modifiez les informations du groupe" 
                : "Remplissez les informations pour créer un nouveau groupe"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom du groupe *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Ex: GRP-ANG-01"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseId">Formation *</Label>
                <Select
                  value={formData.courseId}
                  onValueChange={(value) => setFormData({ ...formData, courseId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name} ({course.language.name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacherId">Formateur</Label>
                <Select
                  value={formData.teacherId}
                  onValueChange={(value) => setFormData({ ...formData, teacherId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.firstName} {teacher.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="levelId">Niveau</Label>
                <Select
                  value={formData.levelId}
                  onValueChange={(value) => setFormData({ ...formData, levelId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {levels.map((level) => (
                      <SelectItem key={level.id} value={level.id}>
                        {level.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxStudents">Capacité max</Label>
                <Input
                  id="maxStudents"
                  type="number"
                  min="1"
                  value={formData.maxStudents}
                  onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLANNED">Planifié</SelectItem>
                    <SelectItem value="IN_PROGRESS">En cours</SelectItem>
                    <SelectItem value="COMPLETED">Terminé</SelectItem>
                    <SelectItem value="CANCELLED">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Date de début *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Date de fin *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="room">Salle</Label>
              <Input
                id="room"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                placeholder="Ex: Salle A1"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                {isEditing ? "Modifier" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer le groupe {selectedGroup?.name} ?
              Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
