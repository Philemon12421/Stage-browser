import React from 'react'
import { useAppStore } from '../../store/appStore'
import styles from './InnerPage.module.css'

export function BookmarksPage({ onNavigate }: { onNavigate: (url: string) => void }) {
  const { bookmarks, removeBookmark } = useAppStore()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Bookmarks</h2>
        <p className={styles.subtitle}>{bookmarks.length} saved</p>
      </div>
      <div className={styles.list}>
        {bookmarks.length === 0 && (
          <div className={styles.empty}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M12 6h24a2 2 0 0 1 2 2v34l-14-9-14 9V8a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
            <p>No bookmarks yet</p>
            <span>Bookmark pages by clicking the star in the address bar.</span>
          </div>
        )}
        {bookmarks.map((bm) => (
          <div key={bm.id} className={styles.row} onClick={() => onNavigate(bm.url)}>
            {bm.favicon && <img src={bm.favicon} alt="" className={styles.favicon} onError={(e) => { (e.target as HTMLImageElement).style.display='none' }} />}
            <div className={styles.info}>
              <span className={styles.rowTitle}>{bm.title}</span>
              <span className={styles.rowUrl}>{bm.url}</span>
            </div>
            <button className={styles.deleteBtn} onClick={(e) => { e.stopPropagation(); removeBookmark(bm.id) }} title="Remove">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function HistoryPage({ onNavigate }: { onNavigate: (url: string) => void }) {
  const { history, clearHistory } = useAppStore()

  const grouped = history.reduce((acc, item) => {
    const date = new Date(item.visitedAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    if (!acc[date]) acc[date] = []
    acc[date].push(item)
    return acc
  }, {} as Record<string, typeof history>)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>History</h2>
        {history.length > 0 && (
          <button className={styles.actionBtn} onClick={clearHistory}>Clear All</button>
        )}
      </div>
      <div className={styles.list}>
        {history.length === 0 && (
          <div className={styles.empty}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="18" stroke="currentColor" strokeWidth="1.5"/><path d="M24 14v10l6 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <p>No history yet</p>
            <span>Visited pages will appear here.</span>
          </div>
        )}
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <div className={styles.groupLabel}>{date}</div>
            {items.map((item) => (
              <div key={item.id} className={styles.row} onClick={() => onNavigate(item.url)}>
                {item.favicon && <img src={item.favicon} alt="" className={styles.favicon} onError={(e)=>{(e.target as HTMLImageElement).style.display='none'}} />}
                <div className={styles.info}>
                  <span className={styles.rowTitle}>{item.title}</span>
                  <span className={styles.rowUrl}>{item.url}</span>
                </div>
                <span className={styles.rowTime}>{new Date(item.visitedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function DownloadsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Downloads</h2>
      </div>
      <div className={styles.list}>
        <div className={styles.empty}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M24 8v24M14 22l10 10 10-10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 38h32" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <p>No downloads</p>
          <span>Downloaded files will appear here.</span>
        </div>
      </div>
    </div>
  )
}

export function ExtensionsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.title}>Extensions</h2>
        <p className={styles.subtitle}>Manage your browser extensions</p>
      </div>
      <div className={styles.list}>
        <div className={styles.empty}>
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><rect x="6" y="6" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/><rect x="26" y="6" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/><rect x="6" y="26" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5"/><path d="M34 26v16M26 34h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          <p>No extensions installed</p>
          <span>Extension support is coming soon to Stage Browser.</span>
        </div>
      </div>
    </div>
  )
}
