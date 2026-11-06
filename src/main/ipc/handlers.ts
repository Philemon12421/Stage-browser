import { ipcMain, BrowserWindow, app } from 'electron'

export function registerIpcHandlers(): void {
  // ── Window controls ────────────────────────────────────────────────────────
  ipcMain.on('window:minimize', () => {
    BrowserWindow.getFocusedWindow()?.minimize()
  })

  ipcMain.on('window:maximize', () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win?.isMaximized()) {
      win.unmaximize()
    } else {
      win?.maximize()
    }
  })

  ipcMain.on('window:close', () => {
    BrowserWindow.getFocusedWindow()?.close()
  })

  // ── App info ───────────────────────────────────────────────────────────────
  ipcMain.handle('app:getVersion', () => app.getVersion())
}

