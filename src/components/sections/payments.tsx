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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  CreditCard,
  Euro,
  CheckCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  TrendingDown
} from "lucide-react"
import { toast } from "sonner"

interface Payment {
  id: string
  studentId: string
  student: {
    firstName: string
    lastName: string
    email: string
  }
  enrollmentId: string | null
  enrollment: {
    group: {
      name: string
      course: {
        name: string
      }
    }
  } | null
  amount: number
  paymentType: string
  paymentMethod: string
  reference: string | null
  status: string
  dueDate: string | null
  paidDate: string | null
  notes: string | null
  createdAt: string
}

interface Student {
  id: string
  firstName: string
  lastName: string
  email: string
}

interface Enrollment {
  id: string
  studentId: string
  group: {
    name: string
    course: {
      name: string
    }
  }
}

const initialFormData = {
  studentId: "",
  enrollmentId: "",
  amount: "",
  paymentType: "TUITION",
  paymentMethod: "CASH",
  reference: "",
  status: "PENDING",
  dueDate: "",
  paidDate: "",
  notes: ""
}

export function PaymentsSection() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [formData, setFormData] = useState(initialFormData)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    fetchPayments()
    fetchStudents()
    fetchEnrollments()
  }, [])

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/payments')
      if (response.ok) {
        const data = await response.json()
        setPayments(data)
      }
    } catch (error) {
      console.error('Error fetching payments:', error)
      toast.error("Erreur lors du chargement des paiements")
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await fetch('/api/students')
      if (response.ok) {
        setStudents(await response.json())
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    }
  }

  const fetchEnrollments = async () => {
    try {
      const response = await fetch('/api/enrollments')
      if (response.ok) {
        setEnrollments(await response.json())
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = isEditing ? `/api/payments/${selectedPayment?.id}` : '/api/payments'
      const method = isEditing ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          enrollmentId: formData.enrollmentId || null,
          dueDate: formData.dueDate || null,
          paidDate: formData.paidDate || null
        })
      })

      if (response.ok) {
        toast.success(isEditing ? "Paiement modifié avec succès" : "Paiement ajouté avec succès")
        setDialogOpen(false)
        setFormData(initialFormData)
        setSelectedPayment(null)
        setIsEditing(false)
        fetchPayments()
      } else {
        const error = await response.json()
        toast.error(error.error || "Une erreur est survenue")
      }
    } catch (error) {
      toast.error("Une erreur est survenue")
    }
  }

  const handleDelete = async () => {
    if (!selectedPayment) return
    
    try {
      const response = await fetch(`/api/payments/${selectedPayment.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success("Paiement supprimé avec succès")
        setDeleteDialogOpen(false)
        setSelectedPayment(null)
        fetchPayments()
      } else {
        toast.error("Erreur lors de la suppression")
      }
    } catch (error) {
      toast.error("Une erreur est survenue")
    }
  }

  const openEditDialog = (payment: Payment) => {
    setSelectedPayment(payment)
    setFormData({
      studentId: payment.studentId,
      enrollmentId: payment.enrollmentId || "",
      amount: payment.amount.toString(),
      paymentType: payment.paymentType,
      paymentMethod: payment.paymentMethod,
      reference: payment.reference || "",
      status: payment.status,
      dueDate: payment.dueDate ? payment.dueDate.split('T')[0] : "",
      paidDate: payment.paidDate ? payment.paidDate.split('T')[0] : "",
      notes: payment.notes || ""
    })
    setIsEditing(true)
    setDialogOpen(true)
  }

  const openCreateDialog = () => {
    setFormData(initialFormData)
    setSelectedPayment(null)
    setIsEditing(false)
    setDialogOpen(true)
  }

  const filteredPayments = payments.filter(payment =>
    `${payment.student.firstName} ${payment.student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.student.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string; icon?: React.ReactNode }> = {
      PENDING: { variant: "outline", label: "En attente", icon: <Clock className="h-3 w-3" /> },
      PAID: { variant: "default", label: "Payé", icon: <CheckCircle className="h-3 w-3" /> },
      PARTIAL: { variant: "secondary", label: "Partiel" },
      CANCELLED: { variant: "destructive", label: "Annulé" },
      REFUNDED: { variant: "destructive", label: "Remboursé" }
    }
    const { variant, label } = variants[status] || { variant: "outline", label: status }
    return <Badge variant={variant}>{label}</Badge>
  }

  const getPaymentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      REGISTRATION: "Inscription",
      TUITION: "Formation",
      MATERIAL: "Matériel",
      EXAM: "Examen",
      CERTIFICATE: "Certificat",
      OTHER: "Autre"
    }
    return labels[type] || type
  }

  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      CASH: "Espèces",
      CHECK: "Chèque",
      CARD: "Carte",
      TRANSFER: "Virement",
      ONLINE: "En ligne"
    }
    return labels[method] || method
  }

  // Calculate stats
  const totalRevenue = payments
    .filter(p => p.status === 'PAID')
    .reduce((sum, p) => sum + p.amount, 0)
  
  const pendingPayments = payments
    .filter(p => p.status === 'PENDING')
    .reduce((sum, p) => sum + p.amount, 0)
  
  const paidCount = payments.filter(p => p.status === 'PAID').length
  const pendingCount = payments.filter(p => p.status === 'PENDING').length

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
          <h1 className="text-3xl font-bold">Paiements</h1>
          <p className="text-muted-foreground">
            Gérez les paiements et factures
          </p>
        </div>
        <Button onClick={openCreateDialog} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau paiement
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalRevenue.toLocaleString('fr-FR')} DH</p>
                <p className="text-xs text-muted-foreground">Revenus totaux</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingPayments.toLocaleString('fr-FR')} DH</p>
                <p className="text-xs text-muted-foreground">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{paidCount}</p>
                <p className="text-xs text-muted-foreground">Paiements reçus</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <Clock className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingCount}</p>
                <p className="text-xs text-muted-foreground">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader className="pb-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un paiement..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Apprenant</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Méthode</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? "Aucun paiement trouvé" : "Aucun paiement enregistré"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.student.firstName} {payment.student.lastName}</p>
                          <p className="text-xs text-muted-foreground">{payment.student.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">{payment.amount.toLocaleString('fr-FR')} DH</span>
                      </TableCell>
                      <TableCell>{getPaymentTypeLabel(payment.paymentType)}</TableCell>
                      <TableCell>{getPaymentMethodLabel(payment.paymentMethod)}</TableCell>
                      <TableCell>{getStatusBadge(payment.status)}</TableCell>
                      <TableCell>
                        {new Date(payment.createdAt).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditDialog(payment)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-destructive"
                              onClick={() => {
                                setSelectedPayment(payment)
                                setDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Modifier le paiement" : "Nouveau paiement"}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Modifiez les informations du paiement" 
                : "Enregistrez un nouveau paiement"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="studentId">Apprenant *</Label>
                <Select
                  value={formData.studentId}
                  onValueChange={(value) => setFormData({ ...formData, studentId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.firstName} {student.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="enrollmentId">Inscription</Label>
                <Select
                  value={formData.enrollmentId}
                  onValueChange={(value) => setFormData({ ...formData, enrollmentId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {enrollments.map((enrollment) => (
                      <SelectItem key={enrollment.id} value={enrollment.id}>
                        {enrollment.group.name} - {enrollment.group.course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Montant (DH) *</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentType">Type *</Label>
                <Select
                  value={formData.paymentType}
                  onValueChange={(value) => setFormData({ ...formData, paymentType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="REGISTRATION">Inscription</SelectItem>
                    <SelectItem value="TUITION">Formation</SelectItem>
                    <SelectItem value="MATERIAL">Matériel</SelectItem>
                    <SelectItem value="EXAM">Examen</SelectItem>
                    <SelectItem value="CERTIFICATE">Certificat</SelectItem>
                    <SelectItem value="OTHER">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Méthode *</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Espèces</SelectItem>
                    <SelectItem value="CHECK">Chèque</SelectItem>
                    <SelectItem value="CARD">Carte</SelectItem>
                    <SelectItem value="TRANSFER">Virement</SelectItem>
                    <SelectItem value="ONLINE">En ligne</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    <SelectItem value="PENDING">En attente</SelectItem>
                    <SelectItem value="PAID">Payé</SelectItem>
                    <SelectItem value="PARTIAL">Partiel</SelectItem>
                    <SelectItem value="CANCELLED">Annulé</SelectItem>
                    <SelectItem value="REFUNDED">Remboursé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dueDate">Date d'échéance</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paidDate">Date de paiement</Label>
                <Input
                  id="paidDate"
                  type="date"
                  value={formData.paidDate}
                  onChange={(e) => setFormData({ ...formData, paidDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Référence</Label>
              <Input
                id="reference"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                placeholder="Numéro de facture, référence..."
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
                {isEditing ? "Modifier" : "Enregistrer"}
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
              Êtes-vous sûr de vouloir supprimer ce paiement ?
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
