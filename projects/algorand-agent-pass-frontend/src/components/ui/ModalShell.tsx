import { ReactNode } from 'react'

interface ModalShellProps {
  open: boolean
  onClose: () => void
  title: string
  eyebrow?: string
  description?: string
  children: ReactNode
  footer?: ReactNode
}

export function ModalShell({ open, onClose, title, eyebrow, description, children, footer }: ModalShellProps) {
  if (!open) {
    return null
  }

  return (
    <div
      className="modal-shell"
      role="dialog"
      aria-modal="true"
      onClick={() => {
        onClose()
      }}
    >
      <div
        className="modal-shell__panel neo-card"
        onClick={(event) => {
          event.stopPropagation()
        }}
      >
        <div className="modal-shell__header">
          <div>
            {eyebrow && <p className="section-kicker">{eyebrow}</p>}
            <h2 className="modal-shell__title">{title}</h2>
            {description && <p className="modal-shell__description">{description}</p>}
          </div>
          <button type="button" className="modal-shell__close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <div className="modal-shell__body">{children}</div>
        {footer && <div className="modal-shell__footer">{footer}</div>}
      </div>
    </div>
  )
}
