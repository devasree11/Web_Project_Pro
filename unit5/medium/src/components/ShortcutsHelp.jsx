import Modal from './Modal.jsx'
import { useUi } from '../context/UiContext.jsx'

const groups = [
  {
    title: 'General',
    items: [
      ['Ctrl + K', 'Open command palette'],
      ['n', 'New task'],
      ['/', 'Focus search box'],
      ['t', 'Toggle dark mode'],
      ['?', 'Show this help'],
      ['Esc', 'Close overlay'],
    ],
  },
  {
    title: 'Navigate',
    items: [
      ['d', 'Dashboard'],
      ['l', 'Task list'],
      ['c', 'Calendar'],
      ['a', 'Analytics'],
    ],
  },
  {
    title: 'Editing',
    items: [
      ['Ctrl + Z', 'Undo'],
      ['Ctrl + Shift + Z', 'Redo'],
      ['x', 'Clear completed tasks'],
      ['Drag handle', 'Reorder tasks (manual sort)'],
    ],
  },
]

export default function ShortcutsHelp() {
  const { helpOpen, toggleHelp } = useUi()

  return (
    <Modal open={helpOpen} title="Keyboard shortcuts" onClose={toggleHelp} wide>
      <div className="shortcuts">
        {groups.map((group) => (
          <div key={group.title}>
            <h4>{group.title}</h4>
            <dl>
              {group.items.map(([keys, description]) => (
                <div className="shortcut-row" key={keys}>
                  <dt>
                    <kbd>{keys}</kbd>
                  </dt>
                  <dd>{description}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </Modal>
  )
}
