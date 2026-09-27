import { useRef, useState } from 'react'
import { useClickOutside } from '../hooks/useUi.js'

export default function TagInput({ tags, onChange, suggestions = [] }) {
  const [draft, setDraft] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useClickOutside(containerRef, () => setOpen(false))

  function add(value) {
    const tag = String(value).trim().replace(/,$/, '')
    if (!tag) return
    if (tags.some((item) => item.toLowerCase() === tag.toLowerCase())) {
      setDraft('')
      return
    }
    onChange([...tags, tag])
    setDraft('')
  }

  function remove(tag) {
    onChange(tags.filter((item) => item !== tag))
  }

  const unused = suggestions.filter((tag) => !tags.includes(tag)).slice(0, 6)

  return (
    <div className="tag-field" ref={containerRef}>
      <div className="tag-input">
        {tags.map((tag) => (
          <span className="tag" key={tag}>
            #{tag}
            <button type="button" onClick={() => remove(tag)} aria-label={`Remove ${tag}`}>
              x
            </button>
          </span>
        ))}
        <input
          type="text"
          value={draft}
          placeholder={tags.length ? 'Add tag' : 'Add tags'}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setDraft(event.target.value)
            setOpen(true)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ',') {
              event.preventDefault()
              add(draft)
            }
            if (event.key === 'Backspace' && !draft && tags.length) {
              remove(tags[tags.length - 1])
            }
          }}
        />
      </div>

      {open && unused.length > 0 && (
        <div className="tag-suggestions">
          {unused.map((tag) => (
            <button type="button" key={tag} onClick={() => add(tag)}>
              #{tag}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
