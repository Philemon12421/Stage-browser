import React, { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { useAppStore } from '../../store/appStore'
import styles from './NavigationBar.module.css'

interface Props {
  url: string
  isLoading: boolean
  canGoBack: boolean
  canGoForward: boolean
  onNavigate: (url: string) => void
  onBack: () => void
  onForward: () => void
  onReload: () => void
  onStop: () => void
}

const SEARCH_ENGINES = {
  google: 'https://www.google.com/search?q=',
  bing: 'https://www.bing.com/search?q=',
  duckduckgo: 'https://duckduckgo.com/?q=',
  brave: 'https://search.brave.com/search?q=',
}

export function normalizeUrl(input: string, engine: keyof typeof SEARCH_ENGINES = 'google'): string {
  const t = input.trim()
  if (!t || t === 'stage://newtab') return t
  if (/^[a-z][a-z0-9+\-.]*:\/\//i.test(t)) return t
  if (/^localhost(:\d+)?/.test(t) || /^127\.|^192\.|^10\./.test(t)) return `http://${t}`
  if (!t.includes(' ') && t.includes('.') && t.length > 2) return `https://${t}`
  return `${SEARCH_ENGINES[engine]}${encodeURIComponent(t)}`
}

export default function NavigationBar({ url, isLoading, canGoBack, canGoForward, onNavigate, onBack, onForward, onReload, onStop }: Props) {
  const { settings, addBookmark, removeBookmark, isBookmarked } = useAppStore()
  const [inputVal, setInputVal] = useState(url === 'stage://newtab' ? '' : url)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const bookmarked = isBookmarked(url)

  useEffect(() => {
    if (!focused) setInputVal(url === 'stage://newtab' ? '' : url)
  }, [url, focused])

  const commit = (val: string) => {
    const normalized = normalizeUrl(val, settings.searchEngine)
    if (normalized) {
      onNavigate(normalized)
      setInputVal(normalized)
    }
    inputRef.current?.blur()
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commit(inputVal)
    if (e.key === 'Escape') { setInputVal(url === 'stage://newtab' ? '' : url); inputRef.current?.blur() }
  }

  const toggleBookmark = () => {
    if (bookmarked) {
      const bm = useAppStore.getState().bookmarks.find((b) => b.url === url)
      if (bm) removeBookmark(bm.id)
    } else {
      addBookmark({ title: document.title || url, url })
    }
  }

  const isStageUrl = url === 'stage://newtab'

  return (
    <div className={styles.bar}>
      <button className={styles.navBtn} onClick={onBack} disabled={!canGoBack} title="Back">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M9.5 2.5L4.5 7.5l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <button className={styles.navBtn} onClick={onForward} disabled={!canGoForward} title="Forward">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
          <path d="M5.5 2.5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <button
        className={styles.navBtn}
        onClick={isLoading ? onStop : onReload}
        title={isLoading ? 'Stop' : 'Reload'}
      >
        {isLoading ? (
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M3.5 3.5l8 8M11.5 3.5l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M12.5 7.5A5 5 0 1 1 7.5 2.5a5 5 0 0 1 3.54 1.46M12.5 2v4h-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Address bar */}
      <div className={`${styles.addressWrap} ${focused ? styles.focused : ''}`}>
        {/* Lock icon */}
        {!focused && !isStageUrl && (
          <span className={`${styles.lockIcon} ${url.startsWith('https://') ? styles.secure : styles.insecure}`}>
            {url.startsWith('https://') ? (
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <rect x="1.5" y="4.5" width="8" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.1"/>
                <path d="M3.5 4.5V3a2 2 0 0 1 4 0v1.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <circle cx="5.5" cy="5.5" r="4.5" stroke="currentColor" strokeWidth="1.1"/>
                <path d="M5.5 3.5v3M5.5 8h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
            )}
          </span>
        )}

        <input
          ref={inputRef}
          className={styles.input}
          value={focused ? inputVal : (isStageUrl ? '' : inputVal)}
          onChange={(e) => setInputVal(e.target.value)}
          onFocus={() => { setFocused(true); setTimeout(() => inputRef.current?.select(), 0) }}
          onBlur={() => { setFocused(false); setInputVal(url === 'stage://newtab' ? '' : url) }}
          onKeyDown={handleKey}
          placeholder={focused ? 'Search or enter URL' : (isStageUrl ? 'Search or enter URL' : '')}
          spellCheck={false}
          autoComplete="off"
        />

        {focused && inputVal && (
          <button className={styles.clearBtn} onMouseDown={() => { setInputVal(''); inputRef.current?.focus() }} tabIndex={-1}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 2l6 6M8 2L2 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* Bookmark toggle */}
      {!isStageUrl && (
        <button
          className={`${styles.navBtn} ${bookmarked ? styles.bookmarked : ''}`}
          onClick={toggleBookmark}
          title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path
              d="M3 2h9a1 1 0 0 1 1 1v10.5l-5.5-3L2 13.5V3a1 1 0 0 1 1-1Z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
              fill={bookmarked ? 'currentColor' : 'none'}
            />
          </svg>
        </button>
      )}
    </div>
  )
}
