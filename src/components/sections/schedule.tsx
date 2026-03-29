"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { 
  Plus, 
  Pencil, 
  Trash2,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  BookOpen,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { toast } from "sonner"
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from "date-fns"
import { fr } from "date-fns/locale"

interface Schedule {
  id: string
  groupId: string
  group: {
    id: string
    name: string
    course: {
      name: string
      language: {
        name: string
        icon: string | null
      }
    }
  }
  teacherId: string | null
  teacher: {
    firstName: string
    lastName: string
  } | null
  roomId: string | null
  room: {
    name: string
  } | null
  date: string
  startTime: string
  endTime: string
  topic: string | null
  notes: string | null
  status: string
  createdAt: string
}

interface Group {
  id: string
  name: string
  course: {
    name: string
  }
}

interface Teacher {
  id: string
  firstName: string
  lastName: string
}

interface Room {
  id: string
  name: string
}

const initialFormData = {
  groupId: "",
  teacherId: "",
  roomId: "",
  date: "",
  startTime: "09:00",
  endTime: "11:00",
  topic: "",
  notes: "",
  status: "SCHEDULED"
}

export function ScheduleSection() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null)
  const [formData, setFormData] = useState(initialFormData)
  const [isEditing, setIsEditing] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  useEffect(() => {
    fetchSchedules()
    fetchGroups()
    fetchTeachers()
    fetchRooms()
  }, [])

  const fetchSchedules = async () => {
    try {
      const response = await fetch('/api/schedules')
      if (response.ok) {
        const data = await response.json()
        setSchedules(data)
      }
    } catch (error) {
      console.error('Error fetching schedules:', error)
      toast.error("Erreur lors du chargement du planning")
    } finally {
      setLoading(false)
    }
  }

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/groups')
      if (response.ok) {
        setGroups(await response.json())
      }
    } catch (error) {
      console.error('Error fetching groups:', error)
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

  const fetchRooms = async () => {
    try {
      const response = await fetch('/api/rooms')
      if (response.ok) {
        setRooms(await response.json())
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = isEditing ? `/api/schedules/${selectedSchedule?.id}` : '/api/schedules'
      const method = isEditing ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          teacherId: formData.teacherId || null,
          roomId: formData.roomId || null
        })
      })

      if (response.ok) {
        toast.success(isEditing ? "Séance modifiée avec succès" : "Séance ajoutée avec succès")
        setDialogOpen(false)
        setFormData(initialFormData)
        setSelectedSchedule(null)
        setIsEditing(false)
        fetchSchedules()
      } else {
        const error = await response.json()
        toast.error(error.error || "Une erreur est survenue")
      }
    } catch (error) {
      toast.error("Une erreur est survenue")
    }
  }

  const handleDelete = async () => {
    if (!selectedSchedule) return
    
    try {
      const response = await fetch(`/api/schedules/${selectedSchedule.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success("Séance supprimée avec succès")
        setDeleteDialogOpen(false)
        setSelectedSchedule(null)
        fetchSchedules()
      } else {
        toast.error("Erreur lors de la suppression")
      }
    } catch (error) {
      toast.error("Une erreur est survenue")
    }
  }

  const openEditDialog = (schedule: Schedule) => {
    setSelectedSchedule(schedule)
    setFormData({
      groupId: schedule.groupId,
      teacherId: schedule.teacherId || "",
      roomId: schedule.roomId || "",
      date: schedule.date.split('T')[0],
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      topic: schedule.topic || "",
      notes: schedule.notes || "",
      status: schedule.status
    })
    setIsEditing(true)
    setDialogOpen(true)
  }

  const openCreateDialog = (date?: Date) => {
    setFormData({
      ...initialFormData,
      date: date ? format(date, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
    })
    setSelectedSchedule(null)
    setIsEditing(false)
    setDialogOpen(true)
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      SCHEDULED: { variant: "outline", label: "Planifié" },
      COMPLETED: { variant: "default", label: "Terminé" },
      CANCELLED: { variant: "destructive", label: "Annulé" },
      RESCHEDULED: { variant: "secondary", label: "Reporté" }
    }
    const { variant, label } = variants[status] || { variant: "outline", label: status }
    return <Badge variant={variant}>{label}</Badge>
  }

  // Get schedules for selected date
  const selectedDateSchedules = selectedDate 
    ? schedules.filter(s => isSameDay(new Date(s.date), selectedDate))
    : []

  // Get all dates with schedules for calendar highlighting
  const scheduledDates = schedules.map(s => new Date(s.date))

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
          <h1 className="text-3xl font-bold">Planning</h1>
          <p className="text-muted-foreground">
            Gérez le planning des cours et séances
          </p>
        </div>
        <Button onClick={() => openCreateDialog()} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle séance
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {format(currentMonth, 'MMMM yyyy', { locale: fr })}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {eachDayOfInterval({
                start: startOfMonth(currentMonth),
                end: endOfMonth(currentMonth)
              }).map((day, index) => {
                const hasSchedule = scheduledDates.some(d => isSameDay(d, day))
                const isSelected = selectedDate && isSameDay(day, selectedDate)
                const isCurrentMonth = isSameMonth(day, currentMonth)
                const isTodayDate = isToday(day)
                
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedDate(day)
                      if (hasSchedule) {
                        // Show schedules for this date
                      }
                    }}
                    className={`
                      aspect-square p-2 text-sm rounded-lg transition-colors relative
                      ${!isCurrentMonth && 'text-muted-foreground opacity-50'}
                      ${isSelected && 'bg-primary text-primary-foreground'}
                      ${isTodayDate && !isSelected && 'border-2 border-primary'}
                      ${hasSchedule && !isSelected && 'bg-primary/10'}
                      hover:bg-accent
                    `}
                  >
                    {format(day, 'd')}
                    {hasSchedule && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary" />
                    )}
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Schedules */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {selectedDate ? format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr }) : 'Séances du jour'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedDateSchedules.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucune séance prévue</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => openCreateDialog(selectedDate)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </div>
              ) : (
                selectedDateSchedules.map((schedule) => (
                  <div 
                    key={schedule.id} 
                    className="p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {schedule.group.course.language.icon && (
                          <span>{schedule.group.course.language.icon}</span>
                        )}
                        <span className="font-medium text-sm">{schedule.group.name}</span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6">
                            <span className="sr-only">Actions</span>
                            •••
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEditDialog(schedule)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => {
                              setSelectedSchedule(schedule)
                              setDeleteDialogOpen(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {schedule.startTime} - {schedule.endTime}
                      </div>
                      {schedule.room && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {schedule.room.name}
                        </div>
                      )}
                    </div>
                    {schedule.topic && (
                      <p className="text-xs mt-2 text-muted-foreground">{schedule.topic}</p>
                    )}
                    <div className="mt-2">
                      {getStatusBadge(schedule.status)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Modifier la séance" : "Nouvelle séance"}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Modifiez les informations de la séance" 
                : "Planifiez une nouvelle séance de cours"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="groupId">Groupe *</Label>
                <Select
                  value={formData.groupId}
                  onValueChange={(value) => setFormData({ ...formData, groupId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name} - {group.course.name}
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
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Début *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">Fin *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roomId">Salle</Label>
                <Select
                  value={formData.roomId}
                  onValueChange={(value) => setFormData({ ...formData, roomId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    <SelectItem value="SCHEDULED">Planifié</SelectItem>
                    <SelectItem value="COMPLETED">Terminé</SelectItem>
                    <SelectItem value="CANCELLED">Annulé</SelectItem>
                    <SelectItem value="RESCHEDULED">Reporté</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic">Sujet / Thème</Label>
              <Input
                id="topic"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="Ex: Grammaire - Les temps du passé"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
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
              Êtes-vous sûr de vouloir supprimer cette séance ?
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
