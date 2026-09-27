import { useRef } from 'react'
import { useTaskStore } from '../context/TaskContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useUi } from '../context/UiContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { STORAGE_KEYS, downloadJSON, parseBackup, serializeTasks } from '../utils/storage.js'

export default function Settings() {
  const { tasks, replaceAll, loadSample, removeAll, clearCompleted } = useTaskStore()
  const { theme, setTheme } = useTheme()
  const { confirm, toggleHelp } = useUi()
  const { success, notify } = useToast()
  const fileRef = useRef(null)

  function handleExport() {
    downloadJSON(`todo-backup-${new Date().toISOString().slice(0, 10)}.json`, serializeTasks(tasks))
    success('Backup downloaded.')
  }

  async function handleImport(event) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const imported = parseBackup(await file.text())
      const ok = await confirm({
        title: 'Import backup',
        message: `Replace the current ${tasks.length} task(s) with ${imported.length} imported task(s)?`,
        confirmLabel: 'Import',
        tone: 'brand',
      })
      if (ok) {
        replaceAll(imported)
        success(`Imported ${imported.length} task(s).`)
      }
    } catch (error) {
      notify(error.message || 'Could not read that file.', 'error')
    } finally {
      event.target.value = ''
    }
  }

  async function handleLoadSample() {
    const ok = await confirm({
      title: 'Load sample data',
      message: 'This replaces everything currently in the list.',
      confirmLabel: 'Load sample',
      tone: 'brand',
    })
    if (ok) {
      loadSample()
      success('Sample data loaded. Ctrl+Z restores your old list.')
    }
  }

  async function handleClearCompleted() {
    const ok = await confirm({
      title: 'Clear completed',
      message: 'All completed tasks will be removed.',
      confirmLabel: 'Clear',
    })
    if (ok) {
      clearCompleted()
      success('Completed tasks cleared.')
    }
  }

  async function handleRemoveAll() {
    const ok = await confirm({
      title: 'Delete everything',
      message: 'Every task will be removed. You can still undo afterwards.',
      confirmLabel: 'Delete all',
    })
    if (ok) {
      removeAll()
      success('All tasks deleted. Ctrl+Z restores them.')
    }
  }

  function handleResetStorage() {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key))
    window.location.reload()
  }

  return (
    <section className="narrow">
      <h1>Settings</h1>
      <p className="muted">Data lives in this browser only, so back it up now and then.</p>

      <div className="panel">
        <h3>Appearance</h3>
        <div className="segmented">
          {['light', 'dark'].map((option) => (
            <button
              key={option}
              type="button"
              className={theme === option ? 'segment active' : 'segment'}
              onClick={() => setTheme(option)}
            >
              {option === 'light' ? 'Light' : 'Dark'}
            </button>
          ))}
        </div>
        <button type="button" className="link-button" onClick={toggleHelp}>
          View keyboard shortcuts
        </button>
      </div>

      <div className="panel">
        <h3>Backup</h3>
        <p className="muted">
          {tasks.length} task(s) stored under <code>{STORAGE_KEYS.tasks}</code>.
        </p>
        <div className="form-actions">
          <button type="button" className="button" onClick={handleExport} disabled={!tasks.length}>
            Export JSON
          </button>
          <button type="button" className="button ghost" onClick={() => fileRef.current?.click()}>
            Import JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={handleImport}
          />
        </div>
      </div>

      <div className="panel">
        <h3>Danger zone</h3>
        <div className="form-actions">
          <button type="button" className="button ghost" onClick={handleLoadSample}>
            Load sample data
          </button>
          <button type="button" className="delete" onClick={handleClearCompleted}>
            Clear completed
          </button>
          <button type="button" className="delete" onClick={handleRemoveAll}>
            Delete all tasks
          </button>
          <button type="button" className="link-button danger-text" onClick={handleResetStorage}>
            Reset saved data
          </button>
        </div>
      </div>
    </section>
  )
}
