export const SCHOOL_NAME = 'St. Xavier Public School'

export const STORAGE_KEY = 'report_card_students'

export const THEME_KEY = 'report_card_theme'

export const MAX_MARKS = 100

export const DEFAULT_YEAR = '2025-2026'

export const GRADE_ORDER = ['A+', 'A', 'B+', 'B', 'C', 'F']

export const SUBJECTS = [
  { key: 'mathematics', label: 'Mathematics' },
  { key: 'physics', label: 'Physics' },
  { key: 'chemistry', label: 'Chemistry' },
  { key: 'computer', label: 'Computer Science' },
  { key: 'english', label: 'English' },
]

export function getGrade(percentage) {
  if (percentage >= 90) return 'A+'
  if (percentage >= 80) return 'A'
  if (percentage >= 70) return 'B+'
  if (percentage >= 60) return 'B'
  if (percentage >= 50) return 'C'
  return 'F'
}

export function getSubjectGrade(mark) {
  return getGrade(Number(mark) || 0)
}

export function computeStudentStats(subjects) {
  let total = 0
  SUBJECTS.forEach((subject) => {
    total += Number(subjects?.[subject.key]) || 0
  })
  const maxTotal = SUBJECTS.length * MAX_MARKS
  const percentage = maxTotal ? Math.round((total / maxTotal) * 10000) / 100 : 0
  const grade = getGrade(percentage)
  const failed = SUBJECTS.some((subject) => (Number(subjects?.[subject.key]) || 0) < 35)
  const result = failed ? 'FAIL' : 'PASS'
  return { total, maxTotal, percentage, grade, result }
}

export function getClassList(students) {
  return [...new Set(students.map((student) => student.cls).filter(Boolean))].sort()
}

export function getClassStats(students) {
  const subjectAverages = {}
  const gradeCounts = {}
  GRADE_ORDER.forEach((grade) => {
    gradeCounts[grade] = 0
  })

  SUBJECTS.forEach((subject) => {
    const values = students.map((student) => Number(student.subjects?.[subject.key]) || 0)
    subjectAverages[subject.key] = values.length
      ? Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10
      : 0
  })

  students.forEach((student) => {
    const stats = computeStudentStats(student.subjects)
    gradeCounts[stats.grade] = (gradeCounts[stats.grade] || 0) + 1
  })

  return { subjectAverages, gradeCounts }
}

export function getRank(students, student) {
  const percentage = computeStudentStats(student.subjects).percentage
  return students.filter((item) => computeStudentStats(item.subjects).percentage > percentage).length + 1
}

export function exportStudentsCsv(students) {
  const header = [
    'Student ID',
    'Name',
    'Class',
    'Academic Year',
    'Total',
    'Max Marks',
    'Percentage',
    'Grade',
    'Result',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Computer Science',
    'English',
  ]
  const rows = students.map((student) => {
    const stats = computeStudentStats(student.subjects)
    return [
      student.id,
      student.name,
      student.cls,
      student.year,
      stats.total,
      stats.maxTotal,
      stats.percentage,
      stats.grade,
      stats.result,
      student.subjects.mathematics,
      student.subjects.physics,
      student.subjects.chemistry,
      student.subjects.computer,
      student.subjects.english,
    ]
  })

  const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`
  const csv = [header, ...rows].map((row) => row.map(escape).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `students_report_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export const seedStudents = [
  {
    id: 'STU101',
    name: 'Rahul Sharma',
    cls: '12-A',
    year: '2025-2026',
    subjects: { mathematics: 92, physics: 85, chemistry: 78, computer: 95, english: 88 },
  },
  {
    id: 'STU102',
    name: 'Priya Patel',
    cls: '12-A',
    year: '2025-2026',
    subjects: { mathematics: 88, physics: 76, chemistry: 82, computer: 74, english: 91 },
  },
  {
    id: 'STU103',
    name: 'Amit Kumar',
    cls: '12-B',
    year: '2025-2026',
    subjects: { mathematics: 55, physics: 48, chemistry: 60, computer: 65, english: 52 },
  },
  {
    id: 'STU104',
    name: 'Sneha Gupta',
    cls: '12-B',
    year: '2025-2026',
    subjects: { mathematics: 30, physics: 45, chemistry: 38, computer: 42, english: 35 },
  },
  {
    id: 'STU105',
    name: 'Rohan Das',
    cls: '12-A',
    year: '2025-2026',
    subjects: { mathematics: 98, physics: 91, chemistry: 89, computer: 96, english: 90 },
  },
]

export function loadStudents() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (error) {
    console.error('Failed to read students from localStorage', error)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seedStudents))
  return seedStudents
}

export function saveStudents(students) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students))
  } catch (error) {
    console.error('Failed to save students to localStorage', error)
  }
}