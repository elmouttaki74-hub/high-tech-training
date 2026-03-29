"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  ClipboardCheck,
  CheckCircle,
  XCircle,
  Clock,
  UserX,
  Users,
  Calendar
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
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
  date: string
  startTime: string
  endTime: string
  status: string
}

interface AttendanceRecord {
  id: string
  studentId: string
  student: {
    firstName: string
    lastName: string
  }
  scheduleId: string
  status: string
  notes: string | null
}

interface Group {
  id: string
  name: string
  course: {
    name: string
  }
}

export function AttendanceSection() {
  const [groups, setGroups] = useState<Group[]>([])
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGroupId, setSelectedGroupId] = useState<string>("")
  const [selectedScheduleId, setSelectedScheduleId] = useState<string>("")

  useEffect(() => {
    fetchGroups()
  }, [])

  useEffect(() => {
    if (selectedGroupId) {
      fetchSchedules(selectedGroupId)
    }
  }, [selectedGroupId])

  useEffect(() => {
    if (selectedScheduleId) {
      fetchAttendance(selectedScheduleId)
    }
  }, [selectedScheduleId])

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/groups')
      if (response.ok) {
        setGroups(await response.json())
      }
    } catch (error) {
      console.error('Error fetching groups:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSchedules = async (groupId: string) => {
    try {
      const response = await fetch(`/api/schedules?groupId=${groupId}`)
      if (response.ok) {
        const data = await response.json()
        setSchedules(data)
        if (data.length > 0 && !selectedScheduleId) {
          setSelectedScheduleId(data[0].id)
        }
      }
    } catch (error) {
      console.error('Error fetching schedules:', error)
    }
  }

  const fetchAttendance = async (scheduleId: string) => {
    try {
      const response = await fetch(`/api/attendance?scheduleId=${scheduleId}`)
      if (response.ok) {
        setAttendance(await response.json())
      }
    } catch (error) {
      console.error('Error fetching attendance:', error)
    }
  }

  const updateAttendance = async (studentId: string, status: string) => {
    try {
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          scheduleId: selectedScheduleId,
          groupId: selectedGroupId,
          status
        })
      })

      if (response.ok) {
        toast.success("Présence enregistrée")
        fetchAttendance(selectedScheduleId)
      } else {
        toast.error("Erreur lors de l'enregistrement")
      }
    } catch (error) {
      toast.error("Une erreur est survenue")
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string; className?: string }> = {
      PRESENT: { variant: "default", label: "Présent", className: "bg-green-600" },
      ABSENT: { variant: "destructive", label: "Absent" },
      LATE: { variant: "secondary", label: "Retard", className: "bg-orange-500" },
      EXCUSED: { variant: "outline", label: "Excusé" }
    }
    const { variant, label, className } = variants[status] || { variant: "outline", label: status }
    return <Badge variant={variant} className={className}>{label}</Badge>
  }

  const getStatusButton = (currentStatus: string, studentId: string) => (
    <div className="flex gap-1">
      {(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as const).map((status) => {
        const isActive = currentStatus === status
        const colors: Record<string, string> = {
          PRESENT: 'bg-green-600 hover:bg-green-700',
          ABSENT: 'bg-red-600 hover:bg-red-700',
          LATE: 'bg-orange-500 hover:bg-orange-600',
          EXCUSED: 'bg-gray-500 hover:bg-gray-600'
        }
        return (
          <Button
            key={status}
            size="sm"
            variant={isActive ? "default" : "outline"}
            className={`h-8 px-2 ${isActive ? colors[status] : ''}`}
            onClick={() => updateAttendance(studentId, status)}
          >
            {status === 'PRESENT' && <CheckCircle className="h-4 w-4" />}
            {status === 'ABSENT' && <XCircle className="h-4 w-4" />}
            {status === 'LATE' && <Clock className="h-4 w-4" />}
            {status === 'EXCUSED' && <UserX className="h-4 w-4" />}
          </Button>
        )
      })}
    </div>
  )

  // Calculate attendance stats
  const presentCount = attendance.filter(a => a.status === 'PRESENT').length
  const absentCount = attendance.filter(a => a.status === 'ABSENT').length
  const lateCount = attendance.filter(a => a.status === 'LATE').length
  const excusedCount = attendance.filter(a => a.status === 'EXCUSED').length

  const selectedSchedule = schedules.find(s => s.id === selectedScheduleId)

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
      <div>
        <h1 className="text-3xl font-bold">Présences</h1>
        <p className="text-muted-foreground">
          Gérez les feuilles de présence des cours
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-64">
          <label className="text-sm font-medium mb-2 block">Groupe</label>
          <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un groupe" />
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
        <div className="w-full sm:w-64">
          <label className="text-sm font-medium mb-2 block">Séance</label>
          <Select 
            value={selectedScheduleId} 
            onValueChange={setSelectedScheduleId}
            disabled={!selectedGroupId}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une séance" />
            </SelectTrigger>
            <SelectContent>
              {schedules.map((schedule) => (
                <SelectItem key={schedule.id} value={schedule.id}>
                  {format(new Date(schedule.date), 'd MMMM yyyy', { locale: fr })} ({schedule.startTime} - {schedule.endTime})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      {selectedScheduleId && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{presentCount}</p>
                  <p className="text-xs text-muted-foreground">Présents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{absentCount}</p>
                  <p className="text-xs text-muted-foreground">Absents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{lateCount}</p>
                  <p className="text-xs text-muted-foreground">Retards</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-900/30">
                  <UserX className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{excusedCount}</p>
                  <p className="text-xs text-muted-foreground">Excusés</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Attendance Table */}
      {selectedSchedule && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardCheck className="h-5 w-5" />
              Feuille de présence
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {selectedSchedule.group.name} - {format(new Date(selectedSchedule.date), 'EEEE d MMMM yyyy', { locale: fr })}
              {' '}({selectedSchedule.startTime} - {selectedSchedule.endTime})
            </p>
          </CardHeader>
          <CardContent>
            {attendance.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Aucun apprenant inscrit dans ce groupe</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Apprenant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-sm font-medium">
                                {record.student.firstName[0]}{record.student.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{record.student.firstName} {record.student.lastName}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(record.status)}
                        </TableCell>
                        <TableCell>
                          {getStatusButton(record.status, record.studentId)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedGroupId && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Sélectionnez un groupe pour voir les séances</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
