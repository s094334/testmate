import { useEffect, useState } from 'react'

export function Countdown({
  label,
  deadline,
  className,
  urgent = false,
}: {
  label: string
  deadline: string
  className: string
  // Red the whole time, not only in the last day
  urgent?: boolean
}) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])

  const end = new Date(deadline)
  const secondsLeft = Math.floor((end.getTime() - now) / 1000)
  const pad = (n: number) => String(n).padStart(2, '0')
  const days = Math.floor(secondsLeft / 86400)

  return (
    <p className={`leading-[1.4] ${className}`}>
      <span>
        {label}{' '}
        <time dateTime={deadline}>
          {end.getFullYear()}/{pad(end.getMonth() + 1)}/{pad(end.getDate())}{' '}
          {pad(end.getHours())}:{pad(end.getMinutes())}
        </time>
      </span>
      <b
        className={`tablet:text-[18px] tabular-nums ${urgent || secondsLeft < 86400 ? 'text-status-dispute-text' : 'text-role-text'}`}
      >
        {secondsLeft <= 0
          ? '已超過期限'
          : `剩下 ${days > 0 ? `${days} 天 ` : ''}${pad(Math.floor((secondsLeft % 86400) / 3600))} 時 ${pad(Math.floor((secondsLeft % 3600) / 60))} 分`}
      </b>
    </p>
  )
}
