import React from 'react'
import { useBrowserStore } from '../../store/browserStore'
import Tab from './Tab'
import styles from './TabBar.module.css'

export default function TabBar() {
  const { tabs, activeTabId, addTab, closeTab, setActiveTab } = useBrowserStore()

  return (
    <div className={styles.tabBar}>
      <div className={styles.tabList}>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTabId}
            onActivate={() => setActiveTab(tab.id)}
            onClose={() => closeTab(tab.id)}
          />
        ))}
      </div>
      <button className={styles.newTab} onClick={() => addTab()} title="New Tab">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}

