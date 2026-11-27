import { useRef, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router'
import { ApiError } from '@/api/client'
import { useEngagement, useNda, useSignNda } from '@/api/engagements'
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon'
import { toast } from '@/components/ui/toast'
import { joinedProjectDetails, joinedProjects, tester } from '@/data/tester'
import { NdaPage } from './NdaPage'

// The mock projects, /tester/projects/:id/nda
export function TesterNdaPage() {
  const { id = '' } = useParams()
  const [signedAt, setSignedAt] = useState<string | null>(null)
  const project = joinedProjects.find((joined) => joined.id === id)
  const detail = joinedProjectDetails[id]

  if (!project || !detail) return <Navigate to="/tester" replace />
  if (project.status !== 'PENDING_NDA') {
    return <Navigate to={`/tester/projects/${id}`} replace />
  }

  return (
    <NdaPage
      projectPath={`/tester/projects/${id}`}
      companyName={project.owner}
      testerName={tester.name}
      signedAt={signedAt}
      busy={false}
      onSign={() => {
        setSignedAt(new Date().toISOString())
        window.scrollTo({ top: 0 })
      }}
    />
  )
}

// A real engagement, /tester/engagements/:id/nda. The text stays here; the
// names and the time come from GET /api/engagements/{id}/nda
export function TesterEngagementNdaPage() {
  const { id = '' } = useParams()
  const engagementQuery = useEngagement(id)
  const ndaQuery = useNda(id)
  const sign = useSignNda(id)
  // isPending only shows on the next render, and a second press can come first
  const sending = useRef(false)
  const engagement = engagementQuery.data
  const nda = ndaQuery.data
  const error = engagementQuery.error ?? ndaQuery.error

  if (!engagement || !nda) {
    return (
      <div className="tablet:px-6 tablet:gap-6 desktop:pt-12 desktop:pb-16 mx-auto flex w-full max-w-[1040px] flex-col gap-5 px-4 pt-6 pb-12">
        <Link
          to={`/tester/engagements/${id}`}
          className="link inline-flex min-h-11 items-center gap-1.5 self-start"
        >
          <ChevronDownIcon className="rotate-90" />
          上一頁
        </Link>

        <div className="bg-surface border-ink rounded-md border">
          <p className="text-ink-muted tablet:px-6 tablet:py-8 px-4 py-6">
            {!error
              ? '載入中…'
              : error instanceof ApiError &&
                  [400, 403, 404].includes(error.status)
                ? '找不到這個專案。'
                : '專案載入失敗，請重新整理再試一次。'}
          </p>
        </div>
      </div>
    )
  }

  // Signed already, or cancelled. Not while signing here: the engagement is
  // read again before the mutation settles
  if (engagement.status !== 'PENDING_NDA' && !sign.isPending && !sign.data) {
    return <Navigate to={`/tester/engagements/${id}`} replace />
  }

  return (
    <NdaPage
      projectPath={`/tester/engagements/${id}`}
      companyName={nda.company_name}
      testerName={nda.tester_name}
      signedAt={sign.data?.nda_signed_at ?? null}
      busy={sign.isPending}
      onSign={async () => {
        if (sending.current) return
        sending.current = true
        try {
          await sign.mutateAsync()
          window.scrollTo({ top: 0 })
        } catch (error) {
          toast.add({
            title:
              error instanceof ApiError
                ? error.message
                : '無法連線，請稍後再試',
            timeout: 4000,
          })
        } finally {
          sending.current = false
        }
      }}
    />
  )
}
