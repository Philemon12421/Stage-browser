import { create } from 'zustand'

export const HOME_URL = 'stage://newtab'

export interface Tab {
  id: string
  title: string
  url: string
  favicon?: string
  isLoading: boolean
  pinned?: boolean
  canGoBack?: boolean
  canGoForward?: boolean
}

export interface ClosedTab {
  id: string
  title: string
  url: string
  favicon?: string
  closedAt: number
}

interface BrowserState {
  tabs: Tab[]
  activeTabId: string | null
  closedTabs: ClosedTab[]

  addTab: (url?: string) => string
  closeTab: (id: string) => void
  setActiveTab: (id: string) => void
  updateTab: (id: string, patch: Partial<Tab>) => void
  duplicateTab: (id: string) => void
  pinTab: (id: string) => void
  restoreLastClosedTab: () => void
  moveTab: (fromIdx: number, toIdx: number) => void
}

let _nextId = 2
const newId = () => String(_nextId++)

export const useBrowserStore = create<BrowserState>((set, get) => ({
  tabs: [
    { id: '1', title: 'New Tab', url: HOME_URL, isLoading: false, canGoBack: false, canGoForward: false },
  ],
  activeTabId: '1',
  closedTabs: [],

  addTab: (url = HOME_URL) => {
    const id = newId()
    set((s) => ({
      tabs: [
        ...s.tabs.filter((t) => t.pinned),
        ...s.tabs.filter((t) => !t.pinned),
        { id, title: 'New Tab', url, isLoading: false, canGoBack: false, canGoForward: false },
      ],
      activeTabId: id,
    }))
    return id
  },

  closeTab: (id) => {
    set((s) => {
      const tab = s.tabs.find((t) => t.id === id)
      const closedEntry: ClosedTab | null = tab
        ? { id: tab.id, title: tab.title, url: tab.url, favicon: tab.favicon, closedAt: Date.now() }
        : null

      const remaining = s.tabs.filter((t) => t.id !== id)
      if (remaining.length === 0) {
        const freshId = newId()
        return {
          tabs: [{ id: freshId, title: 'New Tab', url: HOME_URL, isLoading: false }],
          activeTabId: freshId,
          closedTabs: closedEntry ? [closedEntry, ...s.closedTabs].slice(0, 20) : s.closedTabs,
        }
      }

      let nextActive = s.activeTabId
      if (s.activeTabId === id) {
        const idx = s.tabs.findIndex((t) => t.id === id)
        nextActive = remaining[Math.min(idx, remaining.length - 1)].id
      }

      return {
        tabs: remaining,
        activeTabId: nextActive,
        closedTabs: closedEntry ? [closedEntry, ...s.closedTabs].slice(0, 20) : s.closedTabs,
      }
    })
  },

  setActiveTab: (id) => set({ activeTabId: id }),

  updateTab: (id, patch) =>
    set((s) => ({
      tabs: s.tabs.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    })),

  duplicateTab: (id) => {
    const tab = get().tabs.find((t) => t.id === id)
    if (!tab) return
    get().addTab(tab.url)
  },

  pinTab: (id) => {
    set((s) => ({
      tabs: s.tabs.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t)),
    }))
  },

  restoreLastClosedTab: () => {
    set((s) => {
      if (s.closedTabs.length === 0) return s
      const [last, ...rest] = s.closedTabs
      const id = newId()
      return {
        tabs: [...s.tabs, { id, title: last.title, url: last.url, favicon: last.favicon, isLoading: false }],
        activeTabId: id,
        closedTabs: rest,
      }
    })
  },

  moveTab: (fromIdx, toIdx) => {
    set((s) => {
      const tabs = [...s.tabs]
      const [moved] = tabs.splice(fromIdx, 1)
      tabs.splice(toIdx, 0, moved)
      return { tabs }
    })
  },
}))
