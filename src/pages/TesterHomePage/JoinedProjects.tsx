import { Link } from 'react-router'
import { useEngagements } from '@/api/engagements'
import { StatusTag } from '@/components/StatusTag'

// Two columns: text on the left, status on the right.
// Mobile: status sits next to the title; owner and devices use the full width below.
// Desktop: status is centered against all three lines, light green on hover.
export function JoinedProjects() {
  const { data, isPending } = useEngagements()

  if (!data) {
    return (
      <p className="text-ink-muted desktop:px-6 desktop:py-[22px] p-4">
        {isPending ? '載入中…' : '專案載入失敗，請重新整理再試一次。'}
      </p>
    )
  }

  // No design for this. assumption: grey text, like 還沒有人申請 on the owner side
  if (data.items.length === 0) {
    return (
      <p className="text-ink-muted desktop:px-6 desktop:py-[22px] p-4">
        還沒有參與的專案
      </p>
    )
  }

  return (
    <div>
      {data.items.map((engagement) => (
        <Link
          key={engagement.id}
          to={`/tester/engagements/${engagement.id}`}
          className="border-line -outline-offset-2 desktop:gap-x-6 desktop:px-6 desktop:py-[22px] desktop:hover:bg-role-soft grid grid-cols-[1fr_auto] items-start gap-3 border-b p-4 transition-colors duration-150 ease-out"
        >
          <h3 className="desktop:text-[20px] min-w-0 text-[18px] leading-[1.4] font-bold">
            {engagement.project.name}
          </h3>

          <div className="desktop:row-span-3 desktop:self-center flex">
            <StatusTag status={engagement.status} />
          </div>

          <p className="text-ink-muted desktop:col-span-1 col-span-2">
            {engagement.counterpart_name}
          </p>
          <div className="desktop:col-span-1 col-span-2 flex flex-wrap items-center gap-x-4 gap-y-2">
            {/* The same tags as the 搜尋專案 list */}
            {engagement.project.devices.length === 0 && (
              <span className="bg-tester-soft text-tester-text rounded-[4px] px-3 font-bold">
                不限裝置
              </span>
            )}
            {[
              ...new Set(
                engagement.project.devices.map(
                  (device) => device.device_tag?.name ?? device.custom_name
                )
              ),
            ].map((name) => (
              <span
                key={name}
                className="bg-tester-soft text-tester-text rounded-[4px] px-3 font-bold"
              >
                {name}
              </span>
            ))}
            {/* The deadline the current status waits on. assumption: shown
                like the mock's 截止; an ended engagement has none */}
            {engagement.next_due_at && (
              <span className="text-ink-subtle">
                截止{' '}
                {new Date(engagement.next_due_at).toLocaleDateString('zh-TW', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                })}
              </span>
            )}
          </div>
        </Link>
      ))}
    </div>
  )
}
