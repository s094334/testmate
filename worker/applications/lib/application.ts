import { z } from '@hono/zod-openapi'
import { applicationSources, applicationStatuses } from '../../db/schema'
import { projectCardSchema } from '../../projects/lib/project'

// API.md `Application`. `tester` is for the project's owner, who gets the
// applicant list in a later step; a tester reading their own gets null
export const applicationSchema = z.object({
  id: z.uuid(),
  project: projectCardSchema,
  source: z.enum(applicationSources),
  status: z.enum(applicationStatuses),
  created_at: z.iso.datetime(),
  tester: z.null(),
})
