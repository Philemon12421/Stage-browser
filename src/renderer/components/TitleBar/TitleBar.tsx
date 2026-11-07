import React from 'react'
import Logo from '../Logo/Logo'
import styles from './TitleBar.module.css'

export default function TitleBar() {
  return (
    <div className={styles.bar}>
      <div className={styles.trafficLights}>
        <button
          className={`${styles.dot} ${styles.close}`}
          onClick={() => window.electronAPI?.window.close()}
          title="Close"
        />
        <button
          className={`${styles.dot} ${styles.minimize}`}
          onClick={() => window.electronAPI?.window.minimize()}
          title="Minimize"
        />
        <button
          className={`${styles.dot} ${styles.maximize}`}
          onClick={() => window.electronAPI?.window.maximize()}
          title="Maximize"
        />
      </div>

      <div className={styles.drag}>
        <Logo size={16} showText />
      </div>

      <div className={styles.spacer} />
    </div>
  )
}
