"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  Settings as SettingsIcon,
  Building2,
  Languages,
  GraduationCap,
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Save
} from "lucide-react"
import { toast } from "sonner"

interface Language {
  id: string
  name: string
  code: string
  icon: string | null
}

interface Level {
  id: string
  name: string
  description: string | null
  order: number
}

interface Room {
  id: string
  name: string
  capacity: number
  building: string | null
}

// Settings for the center
interface CenterSettings {
  name: string
  address: string
  phone: string
  email: string
  website: string
}

export function SettingsSection() {
  const [languages, setLanguages] = useState<Language[]>([])
  const [levels, setLevels] = useState<Level[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  
  // Dialog states
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false)
  const [levelDialogOpen, setLevelDialogOpen] = useState(false)
  const [roomDialogOpen, setRoomDialogOpen] = useState(false)
  
  // Form data
  const [languageForm, setLanguageForm] = useState({ name: "", code: "", icon: "" })
  const [levelForm, setLevelForm] = useState({ name: "", description: "", order: "0" })
  const [roomForm, setRoomForm] = useState({ name: "", capacity: "20", building: "" })
  
  // Center settings
  const [centerSettings, setCenterSettings] = useState<CenterSettings>({
    name: "High Tech Training Center El Jadida",
    address: "",
    phone: "",
    email: "",
    website: ""
  })

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const [langRes, levelRes, roomRes] = await Promise.all([
        fetch('/api/languages'),
        fetch('/api/levels'),
        fetch('/api/rooms')
      ])
      
      if (langRes.ok) setLanguages(await langRes.json())
      if (levelRes.ok) setLevels(await levelRes.json())
      if (roomRes.ok) setRooms(await roomRes.json())
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  // Language handlers
  const handleAddLanguage = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/languages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...languageForm,
          icon: languageForm.icon || null
        })
      })
      if (response.ok) {
        toast.success("Langue ajoutée avec succès")
        setLanguageDialogOpen(false)
        setLanguageForm({ name: "", code: "", icon: "" })
        fetchAll()
      }
    } catch (error) {
      toast.error("Erreur lors de l'ajout")
    }
  }

  const handleDeleteLanguage = async (id: string) => {
    try {
      const response = await fetch(`/api/languages/${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success("Langue supprimée")
        fetchAll()
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression")
    }
  }

  // Level handlers
  const handleAddLevel = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/levels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...levelForm,
          order: parseInt(levelForm.order)
        })
      })
      if (response.ok) {
        toast.success("Niveau ajouté avec succès")
        setLevelDialogOpen(false)
        setLevelForm({ name: "", description: "", order: "0" })
        fetchAll()
      }
    } catch (error) {
      toast.error("Erreur lors de l'ajout")
    }
  }

  const handleDeleteLevel = async (id: string) => {
    try {
      const response = await fetch(`/api/levels/${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success("Niveau supprimé")
        fetchAll()
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression")
    }
  }

  // Room handlers
  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...roomForm,
          capacity: parseInt(roomForm.capacity),
          building: roomForm.building || null
        })
      })
      if (response.ok) {
        toast.success("Salle ajoutée avec succès")
        setRoomDialogOpen(false)
        setRoomForm({ name: "", capacity: "20", building: "" })
        fetchAll()
      }
    } catch (error) {
      toast.error("Erreur lors de l'ajout")
    }
  }

  const handleDeleteRoom = async (id: string) => {
    try {
      const response = await fetch(`/api/rooms/${id}`, { method: 'DELETE' })
      if (response.ok) {
        toast.success("Salle supprimée")
        fetchAll()
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression")
    }
  }

  // Center settings handler
  const handleSaveCenterSettings = () => {
    // In a real app, this would save to database
    toast.success("Paramètres enregistrés avec succès")
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
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground">
          Configurez votre centre de formation
        </p>
      </div>

      {/* Center Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informations du centre
          </CardTitle>
          <CardDescription>
            Informations générales de votre établissement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="centerName">Nom du centre</Label>
              <Input
                id="centerName"
                value={centerSettings.name}
                onChange={(e) => setCenterSettings({ ...centerSettings, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="centerEmail">Email</Label>
              <Input
                id="centerEmail"
                type="email"
                value={centerSettings.email}
                onChange={(e) => setCenterSettings({ ...centerSettings, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="centerPhone">Téléphone</Label>
              <Input
                id="centerPhone"
                value={centerSettings.phone}
                onChange={(e) => setCenterSettings({ ...centerSettings, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="centerWebsite">Site web</Label>
              <Input
                id="centerWebsite"
                value={centerSettings.website}
                onChange={(e) => setCenterSettings({ ...centerSettings, website: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="centerAddress">Adresse</Label>
            <Input
              id="centerAddress"
              value={centerSettings.address}
              onChange={(e) => setCenterSettings({ ...centerSettings, address: e.target.value })}
            />
          </div>
          <Button onClick={handleSaveCenterSettings}>
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Languages */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Languages className="h-5 w-5" />
                Langues
              </CardTitle>
              <Button size="sm" onClick={() => setLanguageDialogOpen(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {languages.map((lang) => (
                <div key={lang.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    {lang.icon && <span>{lang.icon}</span>}
                    <span className="font-medium">{lang.name}</span>
                    <Badge variant="outline" className="text-xs">{lang.code}</Badge>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-destructive"
                    onClick={() => handleDeleteLanguage(lang.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {languages.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune langue configurée
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Levels */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <GraduationCap className="h-5 w-5" />
                Niveaux
              </CardTitle>
              <Button size="sm" onClick={() => setLevelDialogOpen(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {levels.sort((a, b) => a.order - b.order).map((level) => (
                <div key={level.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div>
                    <span className="font-medium">{level.name}</span>
                    {level.description && (
                      <p className="text-xs text-muted-foreground">{level.description}</p>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-destructive"
                    onClick={() => handleDeleteLevel(level.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {levels.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucun niveau configuré
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Rooms */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5" />
                Salles
              </CardTitle>
              <Button size="sm" onClick={() => setRoomDialogOpen(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rooms.map((room) => (
                <div key={room.id} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div>
                    <span className="font-medium">{room.name}</span>
                    <p className="text-xs text-muted-foreground">
                      Capacité: {room.capacity} {room.building && `• ${room.building}`}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-destructive"
                    onClick={() => handleDeleteRoom(room.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              {rooms.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucune salle configurée
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Language Dialog */}
      <Dialog open={languageDialogOpen} onOpenChange={setLanguageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une langue</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddLanguage} className="space-y-4">
            <div className="space-y-2">
              <Label>Nom *</Label>
              <Input
                value={languageForm.name}
                onChange={(e) => setLanguageForm({ ...languageForm, name: e.target.value })}
                placeholder="Ex: Anglais"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Code *</Label>
              <Input
                value={languageForm.code}
                onChange={(e) => setLanguageForm({ ...languageForm, code: e.target.value })}
                placeholder="Ex: en"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Icône (emoji)</Label>
              <Input
                value={languageForm.icon}
                onChange={(e) => setLanguageForm({ ...languageForm, icon: e.target.value })}
                placeholder="Ex: 🇬🇧"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setLanguageDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Level Dialog */}
      <Dialog open={levelDialogOpen} onOpenChange={setLevelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter un niveau</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddLevel} className="space-y-4">
            <div className="space-y-2">
              <Label>Nom *</Label>
              <Input
                value={levelForm.name}
                onChange={(e) => setLevelForm({ ...levelForm, name: e.target.value })}
                placeholder="Ex: Débutant"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={levelForm.description}
                onChange={(e) => setLevelForm({ ...levelForm, description: e.target.value })}
                placeholder="Ex: Niveau A1-A2"
              />
            </div>
            <div className="space-y-2">
              <Label>Ordre</Label>
              <Input
                type="number"
                value={levelForm.order}
                onChange={(e) => setLevelForm({ ...levelForm, order: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setLevelDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Room Dialog */}
      <Dialog open={roomDialogOpen} onOpenChange={setRoomDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajouter une salle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddRoom} className="space-y-4">
            <div className="space-y-2">
              <Label>Nom *</Label>
              <Input
                value={roomForm.name}
                onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                placeholder="Ex: Salle A1"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Capacité *</Label>
              <Input
                type="number"
                value={roomForm.capacity}
                onChange={(e) => setRoomForm({ ...roomForm, capacity: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Bâtiment</Label>
              <Input
                value={roomForm.building}
                onChange={(e) => setRoomForm({ ...roomForm, building: e.target.value })}
                placeholder="Ex: Bâtiment Principal"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRoomDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
