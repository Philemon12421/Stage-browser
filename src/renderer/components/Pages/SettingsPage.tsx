import React, { useState } from 'react'
import { useAppStore } from '../../store/appStore'
import styles from './SettingsPage.module.css'

type Section = 'general' | 'appearance' | 'search' | 'privacy' | 'downloads' | 'performance' | 'about'

const SECTIONS: { id: Section; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'search', label: 'Search Engine' },
  { id: 'privacy', label: 'Privacy & Security' },
  { id: 'downloads', label: 'Downloads' },
  { id: 'performance', label: 'Performance' },
  { id: 'about', label: 'About' },
]

export default function SettingsPage() {
  const [section, setSection] = useState<Section>('general')
  const { settings, updateSettings, clearHistory } = useAppStore()

  return (
    <div className={styles.page}>
      {/* Sidebar nav */}
      <nav className={styles.nav}>
        <div className={styles.navHeader}>Settings</div>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            className={`${styles.navItem} ${section === s.id ? styles.navActive : ''}`}
            onClick={() => setSection(s.id)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <div className={styles.content}>
        {section === 'general' && (
          <Section title="General">
            <Field label="Home page" description="The page loaded when you open the browser.">
              <input
                className={styles.input}
                value={settings.homePage}
                onChange={(e) => updateSettings({ homePage: e.target.value })}
                placeholder="https://www.google.com"
              />
            </Field>
            <Field label="New tab page" description="What to show when opening a new tab.">
              <select className={styles.select} value={settings.newTabPage} onChange={(e) => updateSettings({ newTabPage: e.target.value as any })}>
                <option value="stage">Stage Browser New Tab</option>
                <option value="blank">Blank page</option>
              </select>
            </Field>
          </Section>
        )}

        {section === 'appearance' && (
          <Section title="Appearance">
            <Field label="Theme" description="Choose a custom theme for the browser.">
              <select className={styles.select} value={settings.theme} onChange={(e) => updateSettings({ theme: e.target.value as any })}>
                <option value="dark">Dark (Liquid Black)</option>
                <option value="google">Light (Google Clone)</option>
                <option value="midnight">Midnight Blue</option>
                <option value="ocean">Ocean Teal</option>
                <option value="forest">Forest Green</option>
                <option value="sunset">Sunset Red</option>
              </select>
            </Field>
            <Field label="Bookmarks bar" description="Show saved bookmarks below the address bar.">
              <Toggle
                checked={settings.showBookmarksBar}
                onChange={(v) => updateSettings({ showBookmarksBar: v })}
              />
            </Field>
          </Section>
        )}

        {section === 'search' && (
          <Section title="Search Engine">
            <Field label="Default search engine" description="Used when you type in the address bar.">
              <select className={styles.select} value={settings.searchEngine} onChange={(e) => updateSettings({ searchEngine: e.target.value as any })}>
                <option value="google">Google</option>
                <option value="bing">Microsoft Bing</option>
                <option value="duckduckgo">DuckDuckGo</option>
                <option value="brave">Brave Search</option>
              </select>
            </Field>
          </Section>
        )}

        {section === 'privacy' && (
          <Section title="Privacy & Security">
            <Field label="Browsing history" description="Clear your visited pages history.">
              <button className={styles.dangerBtn} onClick={clearHistory}>Clear History</button>
            </Field>
            <Field label="Cookies & data" description="Stored website data is managed per-session via Electron's partition system.">
              <span className={styles.infoText}>Using partition: persist:main</span>
            </Field>
          </Section>
        )}

        {section === 'downloads' && (
          <Section title="Downloads">
            <Field label="Download location" description="Where downloaded files are saved.">
              <input
                className={styles.input}
                value={settings.downloadPath}
                onChange={(e) => updateSettings({ downloadPath: e.target.value })}
                placeholder="~/Downloads"
              />
            </Field>
          </Section>
        )}

        {section === 'performance' && (
          <Section title="Performance">
            <Field label="Hardware acceleration" description="Use GPU rendering for better performance. Restart required.">
              <Toggle
                checked={settings.hardwareAcceleration}
                onChange={(v) => updateSettings({ hardwareAcceleration: v })}
              />
            </Field>
          </Section>
        )}

        {section === 'about' && (
          <Section title="About Stage Browser">
            <div className={styles.about}>
              <div className={styles.aboutLogo}>STAGE</div>
              <p className={styles.aboutVersion}>Version 0.1.0</p>
              <p className={styles.aboutDesc}>
                A premium Chromium-based desktop browser built with Electron, React and TypeScript.
              </p>
              <div className={styles.aboutMeta}>
                <div className={styles.metaRow}><span>Electron</span><span>33.x</span></div>
                <div className={styles.metaRow}><span>Chromium</span><span>130.x</span></div>
                <div className={styles.metaRow}><span>Node.js</span><span>20.x</span></div>
              </div>
            </div>
          </Section>
        )}
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <div className={styles.fields}>{children}</div>
    </div>
  )
}

function Field({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className={styles.field}>
      <div className={styles.fieldText}>
        <span className={styles.fieldLabel}>{label}</span>
        {description && <span className={styles.fieldDesc}>{description}</span>}
      </div>
      <div className={styles.fieldControl}>{children}</div>
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      className={`${styles.toggle} ${checked ? styles.toggleOn : ''}`}
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
    >
      <span className={styles.toggleThumb} />
    </button>
  )
}
