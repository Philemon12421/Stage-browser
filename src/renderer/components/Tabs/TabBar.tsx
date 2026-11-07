import React from 'react'
import { useBrowserStore } from '../../store/browserStore'
import Tab from './Tab'
import styles from './TabBar.module.css'

interface Props {
  onReload?: () => void
}

export default function TabBar({ onReload }: Props) {
  const { tabs, activeTabId, addTab, closeTab, setActiveTab, duplicateTab, pinTab, restoreLastClosedTab, closedTabs } = useBrowserStore()

  const handleClose = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    closeTab(id)
  }

  return (
    <div className={styles.bar}>
      {/* Scrollable tab list */}
      <div className={styles.tabList}>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            tab={tab}
            isActive={tab.id === activeTabId}
            onActivate={() => setActiveTab(tab.id)}
            onClose={handleClose(tab.id)}
            onDuplicate={() => duplicateTab(tab.id)}
            onPin={() => pinTab(tab.id)}
            onReload={onReload ?? (() => {})}
          />
        ))}
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        {/* Restore closed tab */}
        {closedTabs.length > 0 && (
          <button
            className={styles.ctrl}
            onClick={restoreLastClosedTab}
            title={`Restore "${closedTabs[0]?.title}"`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7a5 5 0 1 0 1-2.9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M2 3v4h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* New tab */}
        <button
          className={styles.ctrl}
          onClick={() => addTab()}
          title="New Tab  (Ctrl+T)"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}
