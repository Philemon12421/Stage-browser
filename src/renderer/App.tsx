import React, { useCallback, useRef, useEffect } from 'react'
import { useBrowserStore } from './store/browserStore'
import TitleBar from './components/TitleBar/TitleBar'
import TabBar from './components/Tabs/TabBar'
import NavigationBar from './components/Browser/NavigationBar'
import BrowserView from './components/Browser/BrowserView'
import Sidebar from './components/Sidebar/Sidebar'

export default function App() {
  const { tabs, activeTabId, updateTab } = useBrowserStore()
  const webviewRefs = useRef<Map<string, Electron.WebviewTag>>(new Map())

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? null

  const registerWebview = useCallback(
    (id: string, el: Electron.WebviewTag | null) => {
      if (el) {
        webviewRefs.current.set(id, el)
      } else {
        webviewRefs.current.delete(id)
      }
    },
    []
  )

  const getActiveWebview = () =>
    activeTabId ? webviewRefs.current.get(activeTabId) ?? null : null

  const handleNavigate = (url: string) => {
    const wv = getActiveWebview()
    if (wv) wv.loadURL(url)
    if (activeTabId) updateTab(activeTabId, { url })
  }

  const handleBack = () => getActiveWebview()?.goBack()
  const handleForward = () => getActiveWebview()?.goForward()
  const handleReload = () => getActiveWebview()?.reload()

  return (
    <div style={styles.root}>
      <TitleBar />
      <div style={styles.chrome}>
        <Sidebar />
        <div style={styles.main}>
          <TabBar />
          <NavigationBar
            url={activeTab?.url ?? ''}
            isLoading={activeTab?.isLoading ?? false}
            onNavigate={handleNavigate}
            onBack={handleBack}
            onForward={handleForward}
            onReload={handleReload}
          />
          <div style={styles.browserArea}>
            {tabs.map((tab) => (
              <BrowserView
                key={tab.id}
                tab={tab}
                isActive={tab.id === activeTabId}
                registerRef={(el) => registerWebview(tab.id, el)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    background: 'var(--bg-base)',
    overflow: 'hidden',
  },
  chrome: {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
  },
  browserArea: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
}

