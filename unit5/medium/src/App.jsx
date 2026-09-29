import { useEffect } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { TaskProvider } from './context/TaskContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { UiProvider } from './context/UiContext.jsx'
import Navbar from './components/Navbar.jsx'
import Toasts from './components/Toasts.jsx'
import ConfirmDialog from './components/ConfirmDialog.jsx'
import CommandPalette from './components/CommandPalette.jsx'
import ShortcutsHelp from './components/ShortcutsHelp.jsx'
import useHotkeys from './hooks/useHotkeys.js'
import Dashboard from './pages/Dashboard.jsx'
import TaskList from './pages/TaskList.jsx'
import AddTask from './pages/AddTask.jsx'
import EditTask from './pages/EditTask.jsx'
import Calendar from './pages/Calendar.jsx'
import Analytics from './pages/Analytics.jsx'
import Completed from './pages/Completed.jsx'
import Settings from './pages/Settings.jsx'
import NotFound from './pages/NotFound.jsx'

function Shell() {
  useHotkeys()

  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/new" element={<AddTask />} />
          <Route path="/tasks/:id/edit" element={<EditTask />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/completed" element={<Completed />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/tasks/:id" element={<Navigate to="/tasks" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <CommandPalette />
      <ShortcutsHelp />
      <ConfirmDialog />
      <Toasts />
    </>
  )
}

export default function App() {
  useEffect(() => {
    document.title = 'To-Do | Advanced Version'
  }, [])

  return (
    <ThemeProvider>
      <ToastProvider>
        <UiProvider>
          <TaskProvider>
            <HashRouter>
              <Shell />
            </HashRouter>
          </TaskProvider>
        </UiProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
