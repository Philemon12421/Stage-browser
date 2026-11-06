import { create } from 'zustand'

export interface Tab {
  id: string
  title: string
  url: string
  favicon?: string
  isLoading: boolean
}

interface BrowserState {
  tabs: Tab[]
  activeTabId: string | null

  // Actions
  addTab: (url?: string) => void
  closeTab: (id: string) => void
  setActiveTab: (id: string) => void
  updateTab: (id: string, patch: Partial<Tab>) => void
}

let _nextId = 1
const newId = () => String(_nextId++)

const DEFAULT_URL = 'https://www.google.com'

export const useBrowserStore = create<BrowserState>((set, get) => ({
  tabs: [
    { id: '1', title: 'New Tab', url: DEFAULT_URL, isLoading: false },
  ],
  activeTabId: '1',

  addTab: (url = DEFAULT_URL) => {
    const id = newId()
    set((s) => ({
      tabs: [...s.tabs, { id, title: 'New Tab', url, isLoading: false }],
      activeTabId: id,
    }))
  },

  closeTab: (id) => {
    set((s) => {
      const remaining = s.tabs.filter((t) => t.id !== id)
      if (remaining.length === 0) {
        // Always keep at least one tab
        const fresh: Tab = { id: newId(), title: 'New Tab', url: DEFAULT_URL, isLoading: false }
        return { tabs: [fresh], activeTabId: fresh.id }
      }
      const nextActive =
        s.activeTabId === id
          ? remaining[Math.max(0, s.tabs.findIndex((t) => t.id === id) - 1)].id
          : s.activeTabId
      return { tabs: remaining, activeTabId: nextActive }
    })
  },

  setActiveTab: (id) => set({ activeTabId: id }),

  updateTab: (id, patch) =>
    set((s) => ({
      tabs: s.tabs.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })),
}))

