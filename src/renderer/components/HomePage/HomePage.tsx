import React, { useState, useRef, KeyboardEvent } from 'react'
import { normalizeUrl } from '../Browser/NavigationBar'
import { useAppStore } from '../../store/appStore'
import styles from './HomePage.module.css'

const QUICK_LINKS = [
  { label: 'Google', url: 'https://www.google.com', icon: 'G' },
  { label: 'YouTube', url: 'https://www.youtube.com', icon: 'Y' },
  { label: 'GitHub', url: 'https://www.github.com', icon: '⌥' },
  { label: 'Reddit', url: 'https://www.reddit.com', icon: 'R' },
  { label: 'X', url: 'https://www.x.com', icon: 'X' },
  { label: 'Wikipedia', url: 'https://www.wikipedia.org', icon: 'W' },
]

interface Props {
  onNavigate: (url: string) => void
}

export default function HomePage({ onNavigate }: Props) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const { settings } = useAppStore()
  const inputRef = useRef<HTMLInputElement>(null)

  const submit = (val: string) => {
    const url = normalizeUrl(val.trim() || 'https://www.google.com', settings.searchEngine)
    if (url) onNavigate(url)
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') submit(query)
    if (e.key === 'Escape') { setQuery(''); inputRef.current?.blur() }
  }

  return (
    <div className={styles.page}>
      {/* Ambient glow orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.content}>
        {/* STAGE wordmark */}
        <div className={styles.wordmarkWrap}>
          <h1 className={styles.wordmark}>STAGE</h1>
          <p className={styles.tagline}>Your premium browsing experience</p>
        </div>

        {/* Search box */}
        <div className={styles.searchArea}>
          <div className={`${styles.searchBox} ${focused ? styles.searchFocused : ''}`}>
            <span className={styles.searchIcon}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12.5 12.5L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </span>
            <input
              ref={inputRef}
              className={styles.searchInput}
              type="text"
              placeholder="Search the web or enter a URL…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onKeyDown={handleKey}
              autoComplete="off"
              spellCheck={false}
            />
            {query && (
              <button className={styles.clearBtn} onMouseDown={() => { setQuery(''); inputRef.current?.focus() }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 2l8 8M10 2L2 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            )}
            <button className={styles.searchBtn} onClick={() => submit(query)}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Quick links */}
        <div className={styles.quickLinks}>
          {QUICK_LINKS.map((link) => (
            <button
              key={link.url}
              className={styles.quickLink}
              onClick={() => onNavigate(link.url)}
              title={link.url}
            >
              <span className={styles.qlIcon}>{link.icon}</span>
              <span className={styles.qlLabel}>{link.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
