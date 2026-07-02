interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-card border border-subtle rounded-card ${
        onClick ? 'cursor-pointer active:opacity-80 transition-opacity' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
