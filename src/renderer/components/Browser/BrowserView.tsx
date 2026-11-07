import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import { Tab, HOME_URL } from '../../store/browserStore'
import { useBrowserStore } from '../../store/browserStore'
import { useAppStore } from '../../store/appStore'
import styles from './BrowserView.module.css'

export interface WebviewHandle {
  goBack: () => void
  goForward: () => void
  reload: () => void
  stop: () => void
  loadURL: (url: string) => void
}

interface Props {
  tab: Tab
  isActive: boolean
}

const BrowserView = forwardRef<WebviewHandle, Props>(({ tab, isActive }, ref) => {
  const wvRef = useRef<Electron.WebviewTag>(null)
  const { updateTab } = useBrowserStore()
  const { addHistory } = useAppStore()

  useImperativeHandle(ref, () => ({
    goBack: () => wvRef.current?.goBack(),
    goForward: () => wvRef.current?.goForward(),
    reload: () => wvRef.current?.reload(),
    stop: () => wvRef.current?.stop(),
    loadURL: (url: string) => wvRef.current?.loadURL(url),
  }))

  useEffect(() => {
    const wv = wvRef.current
    if (!wv) return

    const onStart = () => updateTab(tab.id, { isLoading: true })

    const onStop = () => {
      const url = wv.getURL?.() ?? tab.url
      const title = wv.getTitle?.() || 'New Tab'
      updateTab(tab.id, {
        isLoading: false,
        url,
        title,
        canGoBack: wv.canGoBack?.() ?? false,
        canGoForward: wv.canGoForward?.() ?? false,
      })
      if (url && url !== HOME_URL && !url.startsWith('chrome-error://')) {
        addHistory({ title, url })
      }
    }

    const onTitle = (e: Electron.PageTitleUpdatedEvent) => {
      updateTab(tab.id, { title: e.title || 'New Tab' })
    }

    const onFavicon = (e: Electron.PageFaviconUpdatedEvent) => {
      if (e.favicons?.[0]) updateTab(tab.id, { favicon: e.favicons[0] })
    }

    const onNavigate = (e: Electron.DidNavigateEvent) => {
      updateTab(tab.id, {
        url: e.url,
        canGoBack: wv.canGoBack?.() ?? false,
        canGoForward: wv.canGoForward?.() ?? false,
      })
    }

    const onInPageNav = (e: any) => {
      updateTab(tab.id, { url: e.url })
    }

    const onFailLoad = (e: Electron.DidFailLoadEvent) => {
      if (e.errorCode !== -3) { // -3 = aborted (user navigated away)
        updateTab(tab.id, { isLoading: false, title: 'Error' })
      }
    }

    wv.addEventListener('did-start-loading', onStart)
    wv.addEventListener('did-stop-loading', onStop)
    wv.addEventListener('page-title-updated', onTitle)
    wv.addEventListener('page-favicon-updated', onFavicon)
    wv.addEventListener('did-navigate', onNavigate)
    wv.addEventListener('did-navigate-in-page', onInPageNav)
    wv.addEventListener('did-fail-load', onFailLoad)

    return () => {
      wv.removeEventListener('did-start-loading', onStart)
      wv.removeEventListener('did-stop-loading', onStop)
      wv.removeEventListener('page-title-updated', onTitle)
      wv.removeEventListener('page-favicon-updated', onFavicon)
      wv.removeEventListener('did-navigate', onNavigate)
      wv.removeEventListener('did-navigate-in-page', onInPageNav)
      wv.removeEventListener('did-fail-load', onFailLoad)
    }
  }, [tab.id])

  // Don't render webview for new-tab home page
  if (tab.url === HOME_URL) {
    return <div className={`${styles.container} ${isActive ? styles.active : styles.hidden}`} />
  }

  return (
    <div className={`${styles.container} ${isActive ? styles.active : styles.hidden}`}>
      {/* @ts-ignore */}
      <webview
        ref={wvRef}
        className={styles.webview}
        src={tab.url}
        partition="persist:main"
        allowpopups=""
        webpreferences="contextIsolation=yes,javascript=yes,images=yes"
      />
    </div>
  )
})

BrowserView.displayName = 'BrowserView'
export default BrowserView
