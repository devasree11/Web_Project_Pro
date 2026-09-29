import { createContext, useContext, useEffect, useState } from 'react'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Students from './pages/Students'
import AddStudent from './pages/AddStudent'
import ReportCard from './pages/ReportCard'
import { THEME_KEY, loadStudents, saveStudents, seedStudents } from './data'
import './App.css'

const StudentsContext = createContext(null)
const ThemeContext = createContext(null)

export function useStudents() {
  return useContext(StudentsContext)
}

export function useTheme() {
  return useContext(ThemeContext)
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || 'light'
    } catch {
      return 'light'
    }
  })
  const [students, setStudents] = useState(loadStudents)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem(THEME_KEY, theme)
    } catch (error) {
      console.error('Failed to save theme', error)
    }
  }, [theme])

  useEffect(() => {
    saveStudents(students)
  }, [students])

  const addStudent = (student) => {
    setStudents((prev) => [...prev, student])
  }

  const updateStudent = (student) => {
    setStudents((prev) => prev.map((item) => (item.id === student.id ? student : item)))
  }

  const deleteStudent = (id) => {
    setStudents((prev) => prev.filter((item) => item.id !== id))
  }

  const getStudent = (id) => students.find((item) => item.id === id)

  const resetStudents = () => {
    setStudents([...seedStudents])
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <StudentsContext.Provider
        value={{ students, addStudent, updateStudent, deleteStudent, getStudent, resetStudents }}
      >
        <HashRouter>
          <Navbar />
          <main className="container main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/students" element={<Students />} />
              <Route path="/add-student" element={<AddStudent />} />
              <Route path="/report/:id" element={<ReportCard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </HashRouter>
      </StudentsContext.Provider>
    </ThemeContext.Provider>
  )
}