import { ReactNode, useEffect, useRef, useState } from 'react'

interface DropdownOption {
  value: string
  label: string
  hint?: string
  icon?: ReactNode
}

interface DropdownProps {
  options: DropdownOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

const classNames = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(' ')

export function Dropdown({ options, value, onChange, placeholder = 'Select', disabled = false }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find((option) => option.value === value)

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    }

    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isOpen])

  return (
    <div className="neo-dropdown" ref={containerRef}>
      <button
        type="button"
        className={classNames('neo-dropdown__trigger', isOpen && 'neo-dropdown__trigger--open')}
        disabled={disabled}
        onClick={() => {
          if (!disabled) setIsOpen((open) => !open)
        }}
      >
        <span className="neo-dropdown__value">
          {selectedOption?.icon}
          <span>{selectedOption?.label ?? placeholder}</span>
        </span>
        <span className={classNames('neo-dropdown__chevron', isOpen && 'neo-dropdown__chevron--open')}>▾</span>
      </button>

      {isOpen && (
        <div className="neo-dropdown__menu">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={classNames('neo-dropdown__option', value === option.value && 'neo-dropdown__option--selected')}
              onClick={() => {
                onChange?.(option.value)
                setIsOpen(false)
              }}
            >
              <span className="neo-dropdown__value">
                {option.icon}
                <span>{option.label}</span>
              </span>
              {option.hint && <span className="neo-dropdown__hint">{option.hint}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
