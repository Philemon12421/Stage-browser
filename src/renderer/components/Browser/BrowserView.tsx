import React, { useEffect, useRef } from 'react'
import { Tab } from '../../store/browserStore'
import { useBrowserStore } from '../../store/browserStore'
import styles from './BrowserView.module.css'

interface Props {
  tab: Tab
  isActive: boolean
  registerRef: (el: Electron.WebviewTag | null) => void
}

export default function BrowserView({ tab, isActive, registerRef }: Props) {
  const webviewRef = useRef<Electron.WebviewTag>(null)
  const { updateTab } = useBrowserStore()

  useEffect(() => {
    registerRef(webviewRef.current)
    return () => registerRef(null)
  }, [registerRef])

  useEffect(() => {
    const wv = webviewRef.current
    if (!wv) return

    const onStartLoad = () => {
      updateTab(tab.id, { isLoading: true })
    }

    const onStopLoad = () => {
      updateTab(tab.id, { isLoading: false })
      if (wv.getURL) {
        const currentUrl = wv.getURL()
        const title = wv.getTitle?.() || currentUrl
        updateTab(tab.id, { url: currentUrl, title: title || 'New Tab' })
      }
    }

    const onTitleUpdate = (e: Electron.PageTitleUpdatedEvent) => {
      updateTab(tab.id, { title: e.title || 'New Tab' })
    }

    const onFaviconUpdate = (e: Electron.PageFaviconUpdatedEvent) => {
      if (e.favicons && e.favicons.length > 0) {
        updateTab(tab.id, { favicon: e.favicons[0] })
      }
    }

    const onNavigate = (e: Electron.DidNavigateEvent) => {
      updateTab(tab.id, { url: e.url })
    }

    wv.addEventListener('did-start-loading', onStartLoad)
    wv.addEventListener('did-stop-loading', onStopLoad)
    wv.addEventListener('page-title-updated', onTitleUpdate)
    wv.addEventListener('page-favicon-updated', onFaviconUpdate)
    wv.addEventListener('did-navigate', onNavigate)
    wv.addEventListener('did-navigate-in-page', onNavigate as any)

    return () => {
      wv.removeEventListener('did-start-loading', onStartLoad)
      wv.removeEventListener('did-stop-loading', onStopLoad)
      wv.removeEventListener('page-title-updated', onTitleUpdate)
      wv.removeEventListener('page-favicon-updated', onFaviconUpdate)
      wv.removeEventListener('did-navigate', onNavigate)
      wv.removeEventListener('did-navigate-in-page', onNavigate as any)
    }
  }, [tab.id, updateTab])

  return (
    <div className={`${styles.container} ${isActive ? styles.active : styles.hidden}`}>
      {/* @ts-ignore — webview is a custom Electron element not in React's JSX types */}
      <webview
        ref={webviewRef}
        className={styles.webview}
        src={tab.url}
        allowpopups="false"
        partition="persist:main"
        webpreferences="contextIsolation=yes, javascript=yes"
      />
    </div>
  )
}

