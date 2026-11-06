# Stage Browser

A premium Chromium-based desktop browser built with Electron, React, TypeScript and Vite.

> ⚡ Fast · 🔒 Secure · 🎨 Beautiful

---

## Screenshots

> _Coming soon — UI polish is in progress._

---

## Features

- **Chromium engine** — full web compatibility via Electron's `<webview>` tag
- **Multi-tab browsing** — open, close and switch tabs; each tab preserves its own state
- **Smart address bar** — enter a URL or search term; automatically prepends `https://` or routes to Google Search
- **Navigation controls** — back, forward, reload
- **Collapsible sidebar** — home, history, bookmarks, downloads, settings (UI scaffold)
- **Custom title bar** — frameless window with macOS-style traffic-light controls
- **Premium dark glassmorphism UI** — 3D depth, blur layers, accent glow, animated gradients
- **Secure process model** — `contextIsolation`, no `nodeIntegration`, `contextBridge` API surface only

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | [Electron](https://www.electronjs.org/) 33 |
| UI framework | [React](https://react.dev/) 18 |
| Language | [TypeScript](https://www.typescriptlang.org/) 5 |
| Bundler | [electron-vite](https://electron-vite.org/) + [Vite](https://vitejs.dev/) 5 |
| State | [Zustand](https://zustand-demo.pmnd.rs/) 5 |
| Styling | CSS Modules + CSS custom properties |

---

## Project Structure

```
Stage Browser/
├── src/
│   ├── main/                  # Electron main process
│   │   ├── index.ts           # App entry — BrowserWindow creation
│   │   └── ipc/
│   │       └── handlers.ts    # IPC handler registration
│   ├── preload/
│   │   └── index.ts           # contextBridge API (window controls)
│   └── renderer/              # React application
│       ├── index.html
│       ├── main.tsx           # React entry point
│       ├── App.tsx            # Root layout
│       ├── store/
│       │   └── browserStore.ts  # Zustand tab store
│       ├── styles/
│       │   └── globals.css    # Design tokens + CSS reset
│       └── components/
│           ├── TitleBar/      # Frameless window title bar
│           ├── Tabs/          # Tab bar + individual tab
│           ├── Browser/       # NavigationBar + BrowserView (<webview>)
│           └── Sidebar/       # Collapsible navigation sidebar
├── electron.vite.config.ts    # Build orchestration
├── tsconfig.json
└── package.json
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 10
- A Linux/macOS/Windows desktop with a display server

### Install

```bash
cd "Stage Browser"
npm install
```

### Development

```bash
npm run dev
```

Starts the Vite dev server and launches Electron with hot-reload.

> **Note (Linux):** If your environment sets `ELECTRON_RUN_AS_NODE=1` (e.g. inside some CI or agent sandboxes), the `dev` script automatically clears it so Electron runs in full browser-process mode.

### Production Build

```bash
npm run build
```

Output is written to `out/`.

---

## Security Model

| Setting | Value |
|---------|-------|
| `nodeIntegration` | `false` |
| `contextIsolation` | `true` |
| `sandbox` (preload) | `false` (preload needs limited Node access) |
| `webviewTag` | `true` (required for `<webview>`) |
| `webview` partition | `persist:main` (isolated session) |
| Window open handler | External URLs → OS default browser |

The renderer communicates with the main process exclusively through the `contextBridge` API defined in [`src/preload/index.ts`](src/preload/index.ts).

---

## Roadmap

- [x] Electron + React + TypeScript + Vite foundation
- [x] Secure main / preload / renderer process architecture
- [x] Multi-tab state management (Zustand)
- [x] `<webview>` integration with real URL loading
- [x] Navigation bar (back / forward / reload / URL input)
- [x] Premium dark glassmorphism UI
- [x] Custom frameless title bar
- [x] Collapsible sidebar
- [ ] Browser history panel
- [ ] Bookmarks
- [ ] Downloads manager
- [ ] Settings page
- [ ] Extensions support
- [ ] Application packaging (`electron-builder`)

---

## License

MIT © Stage Browser Team

# Stage-browser
