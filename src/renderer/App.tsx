import React, { useCallback, useRef } from 'react'
import { useBrowserStore, HOME_URL } from './store/browserStore'
import { useAppStore } from './store/appStore'
import { WebviewHandle } from './components/Browser/BrowserView'

import TitleBar from './components/TitleBar/TitleBar'
import TabBar from './components/Tabs/TabBar'
import NavigationBar from './components/Browser/NavigationBar'
import BrowserView from './components/Browser/BrowserView'
import HomePage from './components/HomePage/HomePage'
import BottomNav from './components/BottomNav/BottomNav'
import SettingsPage from './components/Pages/SettingsPage'
import { BookmarksPage, HistoryPage, DownloadsPage, ExtensionsPage } from './components/Pages/InnerPages'

export default function App() {
  const { tabs, activeTabId, addTab, updateTab } = useBrowserStore()
  const { currentPage, navigateTo } = useAppStore()

  // Map tab id → webview imperative handle
  const webviewRefs = useRef<Map<string, WebviewHandle>>(new Map())

  const setRef = useCallback((id: string) => (handle: WebviewHandle | null) => {
    if (handle) webviewRefs.current.set(id, handle)
    else webviewRefs.current.delete(id)
  }, [])

  const activeTab = tabs.find((t) => t.id === activeTabId) ?? null
  const activeWv = () => activeTabId ? webviewRefs.current.get(activeTabId) ?? null : null

  const isHome = activeTab?.url === HOME_URL || !activeTab?.url

  // Navigation actions
  const handleNavigate = (url: string) => {
    if (!activeTabId) { addTab(url); return }
    updateTab(activeTabId, { url, title: 'Loading…', isLoading: true })
    if (!isHome) {
      activeWv()?.loadURL(url)
    } else {
      // Was showing homepage — now has a real URL, webview will mount with it
      updateTab(activeTabId, { url })
    }
    navigateTo('browser')
  }

  const handleHomeNavigate = (url: string) => {
    handleNavigate(url)
  }

  const isBrowserPage = currentPage === 'browser'

  // Inner page navigate: open in new tab and switch to browser view
  const openInTab = (url: string) => {
    addTab(url)
    navigateTo('browser')
  }

  return (
    <div style={S.root}>
      {/* Fixed chrome at the top */}
      <TitleBar />

      <div style={S.body}>
        {/* Tab bar + nav bar — always visible in browser mode */}
        {isBrowserPage && (
          <div style={S.chromeTop}>
            <TabBar onReload={() => activeWv()?.reload()} />
            <NavigationBar
              url={activeTab?.url ?? ''}
              isLoading={activeTab?.isLoading ?? false}
              canGoBack={activeTab?.canGoBack ?? false}
              canGoForward={activeTab?.canGoForward ?? false}
              onNavigate={handleNavigate}
              onBack={() => activeWv()?.goBack()}
              onForward={() => activeWv()?.goForward()}
              onReload={() => activeWv()?.reload()}
              onStop={() => activeWv()?.stop()}
            />
          </div>
        )}

        {/* Main content area */}
        <div style={S.content}>
          {/* Browser tabs layer */}
          {isBrowserPage && (
            <div style={S.browserArea}>
              {/* HomePage rendered as React — only for active new-tab */}
              {activeTab && isHome && (
                <div style={S.homeLayer}>
                  <HomePage onNavigate={handleHomeNavigate} />
                </div>
              )}

              {/* WebViews — mounted for all non-home tabs */}
              {tabs.map((tab) => (
                tab.url !== HOME_URL ? (
                  <BrowserView
                    key={tab.id}
                    ref={setRef(tab.id)}
                    tab={tab}
                    isActive={tab.id === activeTabId}
                  />
                ) : null
              ))}
            </div>
          )}

          {/* Inner pages */}
          {currentPage === 'bookmarks' && <BookmarksPage onNavigate={openInTab} />}
          {currentPage === 'history' && <HistoryPage onNavigate={openInTab} />}
          {currentPage === 'downloads' && <DownloadsPage />}
          {currentPage === 'extensions' && <ExtensionsPage />}
          {currentPage === 'settings' && <SettingsPage />}

          {/* Floating bottom navbar */}
          <BottomNav />
        </div>
      </div>
    </div>
  )
}

const S: Record<string, React.CSSProperties> = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    background: 'var(--bg-base)',
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    overflow: 'hidden',
  },
  chromeTop: {
    flexShrink: 0,
  },
  content: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  browserArea: {
    position: 'absolute',
    inset: 0,
  },
  homeLayer: {
    position: 'absolute',
    inset: 0,
    zIndex: 1,
  },
}
