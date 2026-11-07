import React, { useRef } from 'react'
import { Tab as TabType } from '../../store/browserStore'
import styles from './Tab.module.css'

interface Props {
  tab: TabType
  isActive: boolean
  onActivate: () => void
  onClose: (e: React.MouseEvent) => void
  onDuplicate: () => void
  onPin: () => void
  onReload: () => void
}

export default function Tab({ tab, isActive, onActivate, onClose, onDuplicate, onPin, onReload }: Props) {
  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onClose(e)
  }

  return (
    <div
      className={`${styles.tab} ${isActive ? styles.active : ''} ${tab.pinned ? styles.pinned : ''}`}
      onClick={onActivate}
      title={tab.title}
    >
      {/* Favicon / spinner */}
      <span className={styles.iconWrap}>
        {tab.isLoading ? (
          <span className={styles.spinner} />
        ) : tab.favicon ? (
          <img className={styles.favicon} src={tab.favicon} alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
        ) : (
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.1" />
            <circle cx="6.5" cy="6.5" r="2" fill="currentColor" opacity="0.4" />
          </svg>
        )}
      </span>

      {!tab.pinned && <span className={styles.title}>{tab.title || 'New Tab'}</span>}

      {/* Close button — always rendered, visible on hover/active */}
      {!tab.pinned && (
        <button
          className={styles.closeBtn}
          onMouseDown={handleClose}
          onClick={handleClose}
          title="Close tab"
          tabIndex={-1}
        >
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
}
