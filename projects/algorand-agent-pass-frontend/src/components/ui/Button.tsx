import { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
}

const classNames = (...values: Array<string | false | null | undefined>) => values.filter(Boolean).join(' ')

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classNames(
        'neo-button',
        `neo-button--${variant}`,
        `neo-button--${size}`,
        fullWidth && 'neo-button--full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
