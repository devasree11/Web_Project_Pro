import { useUi } from '../context/UiContext.jsx'
import Modal from './Modal.jsx'

export default function ConfirmDialog() {
  const { pending, resolveConfirm } = useUi()

  return (
    <Modal open={Boolean(pending)} title={pending?.title} onClose={() => resolveConfirm(false)}>
      {pending && (
        <div className="confirm">
          <p className="muted">{pending.message}</p>
          <div className="form-actions">
            <button
              type="button"
              className={pending.tone === 'danger' ? 'button danger' : 'button'}
              onClick={() => resolveConfirm(true)}
            >
              {pending.confirmLabel}
            </button>
            <button type="button" className="button ghost" onClick={() => resolveConfirm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </Modal>
  )
}
