import { create } from 'zustand'

export type AppPage = 'browser' | 'bookmarks' | 'history' | 'downloads' | 'extensions' | 'settings'

export interface Bookmark {
  id: string
  title: string
  url: string
  favicon?: string
  addedAt: number
}

export interface HistoryEntry {
  id: string
  title: string
  url: string
  favicon?: string
  visitedAt: number
}

export interface AppSettings {
  homePage: string
  searchEngine: 'google' | 'bing' | 'duckduckgo' | 'brave'
  theme: 'dark' | 'google' | 'midnight' | 'ocean' | 'forest' | 'sunset'
  newTabPage: 'stage' | 'blank'
  showBookmarksBar: boolean
  downloadPath: string
  hardwareAcceleration: boolean
}

const DEFAULT_SETTINGS: AppSettings = {
  homePage: 'https://www.google.com',
  searchEngine: 'google',
  theme: 'dark',
  newTabPage: 'stage',
  showBookmarksBar: false,
  downloadPath: '~/Downloads',
  hardwareAcceleration: true,
}

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem('stage:settings')
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {}
  return DEFAULT_SETTINGS
}

function saveSettings(s: AppSettings) {
  try {
    localStorage.setItem('stage:settings', JSON.stringify(s))
  } catch {}
}

function loadBookmarks(): Bookmark[] {
  try {
    const raw = localStorage.getItem('stage:bookmarks')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function loadHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem('stage:history')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

interface AppState {
  currentPage: AppPage
  settings: AppSettings
  bookmarks: Bookmark[]
  history: HistoryEntry[]

  navigateTo: (page: AppPage) => void
  updateSettings: (patch: Partial<AppSettings>) => void
  addBookmark: (b: Omit<Bookmark, 'id' | 'addedAt'>) => void
  removeBookmark: (id: string) => void
  isBookmarked: (url: string) => boolean
  addHistory: (entry: Omit<HistoryEntry, 'id' | 'visitedAt'>) => void
  clearHistory: () => void
}

let _bid = 1
const bid = () => `bm-${Date.now()}-${_bid++}`
let _hid = 1
const hid = () => `h-${Date.now()}-${_hid++}`

export const useAppStore = create<AppState>((set, get) => ({
  currentPage: 'browser',
  settings: loadSettings(),
  bookmarks: loadBookmarks(),
  history: loadHistory(),

  navigateTo: (page) => set({ currentPage: page }),

  updateSettings: (patch) => {
    set((s) => {
      const next = { ...s.settings, ...patch }
      saveSettings(next)
      return { settings: next }
    })
  },

  addBookmark: (b) => {
    set((s) => {
      const next = [
        { ...b, id: bid(), addedAt: Date.now() },
        ...s.bookmarks,
      ]
      localStorage.setItem('stage:bookmarks', JSON.stringify(next))
      return { bookmarks: next }
    })
  },

  removeBookmark: (id) => {
    set((s) => {
      const next = s.bookmarks.filter((b) => b.id !== id)
      localStorage.setItem('stage:bookmarks', JSON.stringify(next))
      return { bookmarks: next }
    })
  },

  isBookmarked: (url) => get().bookmarks.some((b) => b.url === url),

  addHistory: (entry) => {
    set((s) => {
      const next = [
        { ...entry, id: hid(), visitedAt: Date.now() },
        ...s.history.filter((h) => h.url !== entry.url),
      ].slice(0, 500)
      localStorage.setItem('stage:history', JSON.stringify(next))
      return { history: next }
    })
  },

  clearHistory: () => {
    localStorage.removeItem('stage:history')
    set({ history: [] })
  },
}))
