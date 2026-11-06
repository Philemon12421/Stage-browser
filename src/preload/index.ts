import { contextBridge, ipcRenderer } from 'electron'

// Expose a safe, typed API to the renderer process.
// Nothing from Node.js / Electron leaks into the renderer beyond this surface.
contextBridge.exposeInMainWorld('electronAPI', {
  // ── Window controls ────────────────────────────────────────────────────────
  window: {
    minimize: () => ipcRenderer.send('window:minimize'),
    maximize: () => ipcRenderer.send('window:maximize'),
    close: () => ipcRenderer.send('window:close'),
  },

  // ── App ───────────────────────────────────────────────────────────────────
  app: {
    getVersion: (): Promise<string> => ipcRenderer.invoke('app:getVersion'),
  },
})

