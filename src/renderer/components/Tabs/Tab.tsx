import React from 'react'
import { Tab as TabType } from '../../store/browserStore'
import styles from './Tab.module.css'

interface Props {
  tab: TabType
  isActive: boolean
  onActivate: () => void
  onClose: () => void
}

export default function Tab({ tab, isActive, onActivate, onClose }: Props) {
  return (
    <div
      className={`${styles.tab} ${isActive ? styles.active : ''}`}
      onClick={onActivate}
      title={tab.title}
    >
      {tab.isLoading ? (
        <span className={styles.spinner} />
      ) : tab.favicon ? (
        <img className={styles.favicon} src={tab.favicon} alt="" />
      ) : (
        <span className={styles.faviconPlaceholder}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </span>
      )}
      <span className={styles.title}>{tab.title}</span>
      <button
        className={styles.close}
        onClick={(e) => { e.stopPropagation(); onClose() }}
        title="Close tab"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path d="M2 2l6 6M8 2l-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

