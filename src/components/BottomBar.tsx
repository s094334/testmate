import { useEffect, useRef, type ReactNode } from 'react'

const bars = new Set<HTMLDivElement>()

// A fixed bar is out of the page flow, so it would cover the footer and the last field.
// The layouts pad their bottom by --bottom-bar-height to make room.
// Only bars that are fixed at the current width count: from some widths up a bar
// goes back into the page (tabs, signup buttons), and hidden tabs keep theirs mounted at 0px.
function updateBottomBarHeight() {
  const tallest = Math.max(
    0,
    ...[...bars].map((bar) =>
      getComputedStyle(bar).position === 'fixed' ? bar.offsetHeight : 0
    )
  )
  document.documentElement.style.setProperty(
    '--bottom-bar-height',
    `${tallest}px`
  )
}

// For a bar that is another component, like a TabsList, instead of a BottomBar
export function useBottomBar() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = ref.current
    if (!bar) return
    bars.add(bar)
    const observer = new ResizeObserver(updateBottomBarHeight)
    observer.observe(bar)
    return () => {
      observer.disconnect()
      bars.delete(bar)
      updateBottomBarHeight()
    }
  }, [])

  return ref
}

export function BottomBar({
  className,
  children,
}: {
  className: string
  children: ReactNode
}) {
  const ref = useBottomBar()

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
