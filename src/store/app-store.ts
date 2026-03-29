import { create } from 'zustand'

export type ViewType = 'dashboard' | 'students' | 'teachers' | 'courses' | 'groups' | 'schedule' | 'payments' | 'attendance' | 'certificates' | 'settings'

interface AppState {
  currentView: ViewType
  setCurrentView: (view: ViewType) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentView: 'dashboard',
  setCurrentView: (view) => set({ currentView: view }),
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}))
