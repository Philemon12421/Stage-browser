import React, { useState, useRef, useEffect, KeyboardEvent } from 'react'
import styles from './NavigationBar.module.css'

interface Props {
  url: string
  isLoading: boolean
  onNavigate: (url: string) => void
  onBack: () => void
  onForward: () => void
  onReload: () => void
}

function normalizeUrl(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return 'about:blank'
  // If it looks like a URL (has a dot or is localhost), add https://
  const hasProtocol = /^[a-z][a-z0-9+\-.]*:\/\//i.test(trimmed)
  if (hasProtocol) return trimmed
  // Heuristic: looks like a domain if contains a dot and no spaces
  if (!trimmed.includes(' ') && trimmed.includes('.')) {
    return `https://${trimmed}`
  }
  // Otherwise treat as a Google search
  return `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`
}

export default function NavigationBar({ url, isLoading, onNavigate, onBack, onForward, onReload }: Props) {
  const [inputValue, setInputValue] = useState(url)
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Keep the displayed URL in sync unless the user is typing
  useEffect(() => {
    if (!isFocused) setInputValue(url)
  }, [url, isFocused])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const normalized = normalizeUrl(inputValue)
      setInputValue(normalized)
      onNavigate(normalized)
      inputRef.current?.blur()
    } else if (e.key === 'Escape') {
      setInputValue(url)
      inputRef.current?.blur()
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    // Select all on focus for quick replacement
    setTimeout(() => inputRef.current?.select(), 0)
  }

  const handleBlur = () => {
    setIsFocused(false)
    setInputValue(url)
  }

  return (
    <div className={styles.navBar}>
      {/* Back */}
      <button className={styles.navBtn} onClick={onBack} title="Back">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Forward */}
      <button className={styles.navBtn} onClick={onForward} title="Forward">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Reload / Stop */}
      <button className={styles.navBtn} onClick={onReload} title={isLoading ? 'Stop' : 'Reload'}>
        {isLoading ? (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13.5 8A5.5 5.5 0 1 1 8 2.5a5.5 5.5 0 0 1 4 1.72M13.5 2v3.5H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Address bar */}
      <div className={`${styles.addressWrapper} ${isFocused ? styles.focused : ''}`}>
        {/* Lock icon for https */}
        {!isFocused && url.startsWith('https://') && (
          <span className={styles.lockIcon}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="2" y="5" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M4 5V3.5a2 2 0 0 1 4 0V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </span>
        )}
        <input
          ref={inputRef}
          className={styles.addressInput}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search or enter URL"
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  )
}

