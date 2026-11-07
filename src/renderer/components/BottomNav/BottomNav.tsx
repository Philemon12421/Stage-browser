import React, { useState } from 'react'
import { AppPage, useAppStore } from '../../store/appStore'
import styles from './BottomNav.module.css'

const NAV_ITEMS: { id: AppPage | 'browser'; label: string; icon: React.ReactNode }[] = [
  {
    id: 'browser',
    label: 'Home',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M2.5 8.5L10 3l7.5 5.5V17a1 1 0 0 1-1 1H3.5a1 1 0 0 1-1-1V8.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M7 18v-6.5h6V18" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'bookmarks',
    label: 'Bookmarks',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M4.5 3h11a1 1 0 0 1 1 1v13.5l-6-3.5-6 3.5V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'history',
    label: 'History',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M10 6v4.5l3 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'downloads',
    label: 'Downloads',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 3v10M6 9l4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M3 15.5h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'extensions',
    label: 'Extensions',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="11" y="3" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <rect x="3" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M14 11v6M11 14h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="2.75" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.4 4.4l1.42 1.42M14.18 14.18l1.42 1.42M15.6 4.4l-1.42 1.42M5.82 14.18l-1.42 1.42" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
]

export default function BottomNav() {
  const { currentPage, navigateTo } = useAppStore()
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className={styles.wrapper}>
      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const active = currentPage === item.id
          return (
            <button
              key={item.id}
              className={`${styles.item} ${active ? styles.active : ''}`}
              onClick={() => navigateTo(item.id as AppPage)}
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered(null)}
              title={item.label}
            >
              {/* Tooltip */}
              {hovered === item.id && !active && (
                <span className={styles.tooltip}>{item.label}</span>
              )}

              <span className={styles.iconWrap}>{item.icon}</span>

              {active && <span className={styles.activeDot} />}
            </button>
          )
        })}
      </nav>
    </div>
  )
}
