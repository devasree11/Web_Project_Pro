import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react'
import { createId, nextDueDate, normalizeTask } from '../utils/taskUtils.js'
import {
  STORAGE_KEYS,
  buildSampleTasks,
  migrateLegacy,
  readJSON,
  writeJSON,
} from '../utils/storage.js'

const TaskContext = createContext(null)

const HISTORY_LIMIT = 30

const initialState = {
  tasks: [],
  past: [],
  future: [],
  sortMode: 'manual',
}

function withHistory(state, tasks) {
  return {
    ...state,
    tasks,
    past: [...state.past, state.tasks].slice(-HISTORY_LIMIT),
    future: [],
  }
}

function touch(task, patch) {
  return { ...task, ...patch, updatedAt: Date.now() }
}

function reducer(state, action) {
  switch (action.type) {
    case 'add': {
      const task = normalizeTask({
        ...action.task,
        id: action.task.id || createId(),
        order: state.tasks.length ? Math.min(...state.tasks.map((item) => item.order)) - 1 : 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      return withHistory(state, [task, ...state.tasks])
    }

    case 'update':
      return withHistory(
        state,
        state.tasks.map((task) =>
          task.id === action.id ? touch(task, normalizeTask({ ...task, ...action.patch })) : task,
        ),
      )

    case 'toggle': {
      const target = state.tasks.find((task) => task.id === action.id)
      if (!target) return state

      const completed = !target.completed
      let tasks = state.tasks.map((task) =>
        task.id === action.id
          ? touch(task, { completed, completedAt: completed ? Date.now() : 0 })
          : task,
      )

      if (completed && target.recurrence) {
        const dueDate = nextDueDate(target.recurrence, target.dueDate)
        if (dueDate) {
          const clone = normalizeTask({
            ...target,
            id: createId(),
            dueDate,
            completed: false,
            completedAt: 0,
            subtasks: target.subtasks.map((subtask) => ({ ...subtask, completed: false })),
            createdAt: Date.now(),
            updatedAt: Date.now(),
            order: Math.min(...tasks.map((item) => item.order)) - 1,
          })
          tasks = [clone, ...tasks]
        }
      }

      return withHistory(state, tasks)
    }

    case 'toggleSubtask':
      return withHistory(
        state,
        state.tasks.map((task) =>
          task.id === action.id
            ? touch(task, {
                subtasks: task.subtasks.map((subtask) =>
                  subtask.id === action.subtaskId
                    ? { ...subtask, completed: !subtask.completed }
                    : subtask,
                ),
              })
            : task,
        ),
      )

    case 'addSubtask':
      return withHistory(
        state,
        state.tasks.map((task) =>
          task.id === action.id
            ? touch(task, {
                subtasks: [
                  ...task.subtasks,
                  { id: createId(), title: action.title.trim(), completed: false },
                ],
              })
            : task,
        ),
      )

    case 'removeSubtask':
      return withHistory(
        state,
        state.tasks.map((task) =>
          task.id === action.id
            ? touch(task, {
                subtasks: task.subtasks.filter((subtask) => subtask.id !== action.subtaskId),
              })
            : task,
        ),
      )

    case 'reorder': {
      const from = state.tasks.findIndex((task) => task.id === action.draggedId)
      const to = state.tasks.findIndex((task) => task.id === action.targetId)
      if (from === -1 || to === -1 || from === to) return state

      const next = [...state.tasks]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return withHistory(state, next.map((task, index) => ({ ...task, order: index })))
    }

    case 'delete':
      return withHistory(
        state,
        state.tasks.filter((task) => task.id !== action.id),
      )

    case 'clearCompleted':
      return withHistory(state, state.tasks.filter((task) => !task.completed))

    case 'removeAll':
      return withHistory(state, [])

    case 'replaceAll':
      return withHistory(
        state,
        action.tasks.map((task, index) => normalizeTask({ ...task, order: index })),
      )

    case 'setSort':
      return { ...state, sortMode: action.sortMode }

    case 'undo': {
      if (!state.past.length) return state
      const previous = state.past[state.past.length - 1]
      return {
        ...state,
        tasks: previous,
        past: state.past.slice(0, -1),
        future: [state.tasks, ...state.future].slice(0, HISTORY_LIMIT),
      }
    }

    case 'redo': {
      if (!state.future.length) return state
      const [next, ...rest] = state.future
      return {
        ...state,
        tasks: next,
        past: [...state.past, state.tasks].slice(-HISTORY_LIMIT),
        future: rest,
      }
    }

    default:
      return state
  }
}

export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const stored = readJSON(STORAGE_KEYS.tasks, null)
    const tasks = Array.isArray(stored) && stored.length ? stored : migrateLegacy()

    return {
      ...initialState,
      tasks: tasks || [],
      sortMode: readJSON(STORAGE_KEYS.sort, 'manual'),
    }
  })

  useEffect(() => {
    writeJSON(STORAGE_KEYS.tasks, state.tasks)
  }, [state.tasks])

  useEffect(() => {
    writeJSON(STORAGE_KEYS.sort, state.sortMode)
  }, [state.sortMode])

  const actions = useMemo(
    () => ({
      addTask: (data) => {
        const result = validate(data)
        if (!result.ok) return result
        dispatch({ type: 'add', task: data })
        return { ok: true, message: 'Task added.' }
      },
      updateTask: (id, patch) => {
        const result = validate(patch)
        if (!result.ok) return result
        dispatch({ type: 'update', id, patch })
        return { ok: true, message: 'Task updated.' }
      },
      toggleTask: (id) => dispatch({ type: 'toggle', id }),
      toggleSubtask: (id, subtaskId) => dispatch({ type: 'toggleSubtask', id, subtaskId }),
      addSubtask: (id, title) => {
        if (!title.trim()) return
        dispatch({ type: 'addSubtask', id, title })
      },
      removeSubtask: (id, subtaskId) => dispatch({ type: 'removeSubtask', id, subtaskId }),
      deleteTask: (id) => dispatch({ type: 'delete', id }),
      reorderTask: (draggedId, targetId) => dispatch({ type: 'reorder', draggedId, targetId }),
      clearCompleted: () => dispatch({ type: 'clearCompleted' }),
      removeAll: () => dispatch({ type: 'removeAll' }),
      replaceAll: (tasks) => dispatch({ type: 'replaceAll', tasks }),
      loadSample: () => dispatch({ type: 'replaceAll', tasks: buildSampleTasks() }),
      undo: () => dispatch({ type: 'undo' }),
      redo: () => dispatch({ type: 'redo' }),
    }),
    [],
  )

  const value = useMemo(
    () => ({
      tasks: state.tasks,
      sortMode: state.sortMode,
      canUndo: state.past.length > 0,
      canRedo: state.future.length > 0,
      setSortMode: (sortMode) => dispatch({ type: 'setSort', sortMode }),
      ...actions,
    }),
    [state.tasks, state.sortMode, state.past.length, state.future.length, actions],
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

function validate(data) {
  if (!String(data.title || '').trim()) return { ok: false, message: 'Title is required.' }
  return { ok: true }
}

export function useTaskStore() {
  const store = useContext(TaskContext)
  if (!store) throw new Error('useTaskStore must be used inside TaskProvider')
  return store
}
