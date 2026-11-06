import React from 'react'
import Logo from '../Logo/Logo'
import styles from './TitleBar.module.css'

export default function TitleBar() {
  const minimize = () => window.electronAPI?.window.minimize()
  const maximize = () => window.electronAPI?.window.maximize()
  const close = () => window.electronAPI?.window.close()

  return (
    <div className={styles.titleBar}>
      {/* macOS-style traffic lights (left side) */}
      <div className={styles.controls}>
        <button className={`${styles.btn} ${styles.btnClose}`} onClick={close} title="Close" />
        <button className={`${styles.btn} ${styles.btnMinimize}`} onClick={minimize} title="Minimize" />
        <button className={`${styles.btn} ${styles.btnMaximize}`} onClick={maximize} title="Maximize" />
      </div>

      {/* Centred logo + name — drag region */}
      <div className={styles.dragRegion}>
        <Logo size={18} showText />
      </div>
    </div>
  )
}
