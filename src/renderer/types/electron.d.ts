// Global type augmentation for the contextBridge API surface exposed by preload/index.ts

interface WindowControls {
  minimize: () => void
  maximize: () => void
  close: () => void
}

interface AppAPI {
  getVersion: () => Promise<string>
}

interface ElectronAPI {
  window: WindowControls
  app: AppAPI
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}

