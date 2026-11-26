import { z } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'
import type { Db } from '../../db'
import {
  tags,
  testerDevices,
  testerProfileTags,
  testerProfiles,
} from '../../db/schema'

// GLOSSARY「去識別化姓名」: 王小平 → 王Ｏ平, 王平 → 王Ｏ
export function maskName(name: string) {
  const chars = Array.from(name)
  if (chars.length <= 1) return name
  if (chars.length === 2) return `${chars[0]}Ｏ`
  return `${chars[0]}${'Ｏ'.repeat(chars.length - 2)}${chars.at(-1)}`
}

// API.md `TesterCard`. custom_name is not in API.md: without it a custom
// device would arrive as four nulls
export const testerCardSchema = z.object({
  tester_id: z.uuid(),
  masked_name: z.string(),
  city: z.string(),
  qa_years: z.int(),
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

export async function findTesterCard(db: Db, testerId: string) {
  const [profile] = await db
    .select({
      realName: testerProfiles.realName,
      city: testerProfiles.city,
      qaYears: testerProfiles.qaYears,
      languages: testerProfiles.languages,
    })
    .from(testerProfiles)
    .where(eq(testerProfiles.userId, testerId))

  if (!profile) return null

  const devices = await db
    .select({
      device_tag_name: tags.name,
      brand: testerDevices.brand,
      model: testerDevices.model,
      os_version: testerDevices.osVersion,
      custom_name: testerDevices.customName,
    })
    .from(testerDevices)
    .leftJoin(tags, eq(tags.id, testerDevices.deviceTagId))
    .where(eq(testerDevices.userId, testerId))
    .orderBy(testerDevices.sortOrder, testerDevices.id)

  const interests = await db
    .select({ name: tags.name })
    .from(testerProfileTags)
    .innerJoin(tags, eq(tags.id, testerProfileTags.tagId))
    .where(
      and(eq(testerProfileTags.userId, testerId), eq(tags.category, 'interest'))
    )
    .orderBy(tags.sortOrder)

  return {
    tester_id: testerId,
    masked_name: maskName(profile.realName),
    city: profile.city,
    qa_years: profile.qaYears,
    languages: profile.languages,
    devices,
    interests: interests.map((interest) => interest.name),
    // Ratings do not exist yet
    average_score: null,
    rating_count: 0,
  }
}
