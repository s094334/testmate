import { z } from '@hono/zod-openapi'
import { avatarShapes } from '../../../shared/avatar-shapes'
import { applicationSources, applicationStatuses } from '../../db/schema'
import { projectCardSchema } from '../../projects/lib/project'

// API.md `TesterCard`, with the nickname in place of masked_name: no real
// name, email or phone before payment. avatar_shape and custom_name are not
// in API.md; the applicant list draws the avatar and names custom devices.
export const testerCardSchema = z.object({
  tester_id: z.uuid(),
  // null for testers who signed up before nicknames existed. Not the real
  // name or a masked one: a masked name of two characters is easy to guess
  nickname: z.string().nullable(),
  avatar_shape: z.enum(avatarShapes),
  city: z.string(),
  // null: no QA experience. 0: some, under a year
  qa_years: z.int().nullable(),
  languages: z.array(z.object({ name: z.string(), native: z.boolean() })),
  devices: z.array(
    z.object({
      device_tag_name: z.string().nullable(),
      brand: z.string().nullable(),
      model: z.string().nullable(),
      os_version: z.string().nullable(),
      custom_name: z.string().nullable(),
    })
  ),
  interests: z.array(z.string()),
  average_score: z.number().nullable(),
  rating_count: z.int(),
})

// API.md `Application`. `tester` is only for the project's owner; a tester
// reading their own gets null
export const applicationSchema = z.object({
  id: z.uuid(),
  project: projectCardSchema,
  source: z.enum(applicationSources),
  status: z.enum(applicationStatuses),
  created_at: z.iso.datetime(),
  tester: testerCardSchema.nullable(),
})
