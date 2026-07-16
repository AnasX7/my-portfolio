import {
  Children,
  cloneElement,
  isValidElement,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react'
import './scroll-stack.css'

interface ScrollStackItemProps {
  children: ReactNode
  itemClassName?: string
  stackIndex?: number
}

export function ScrollStackItem({
  children,
  itemClassName = '',
  stackIndex = 0,
}: ScrollStackItemProps) {
  const stackStyle = {
    '--mobile-stack-offset': `${stackIndex * 0.375}rem`,
    '--desktop-stack-offset': `${stackIndex * 1.25}rem`,
    zIndex: stackIndex + 1,
  } as CSSProperties

  return (
    <div className={`scroll-stack-card ${itemClassName}`.trim()} style={stackStyle}>
      {children}
    </div>
  )
}

interface ScrollStackProps {
  children: ReactNode
  className?: string
}

export default function ScrollStack({ children, className = '' }: ScrollStackProps) {
  const indexedChildren = Children.map(children, (child, index) => {
    if (!isValidElement(child)) return child

    return cloneElement(child as ReactElement<ScrollStackItemProps>, { stackIndex: index })
  })

  return (
    <div className={`scroll-stack-scroller ${className}`.trim()}>
      <div className='scroll-stack-inner'>
        {indexedChildren}
        <div className='scroll-stack-runway' aria-hidden='true' />
      </div>
    </div>
  )
}
