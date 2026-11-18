import { z } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'
import type { Db } from '../../db'
import {
  tagCategory,
  tags,
  testerDevices,
  testerProfileTags,
  testerProfiles,
} from '../../db/schema'

const tag = z.object({
  id: z.uuid(),
  category: z.enum(tagCategory.enumValues),
  name: z.string(),
})

// `TesterProfile`, returned by both GET and PUT /api/auth/profile
export const testerProfileSchema = z.object({
  real_name: z.string(),
  email: z.string(),
  phone: z.string(),
  city: z.string(),
  has_qa_experience: z.boolean(),
  experiences: z.array(z.object({ company: z.string(), years: z.int() })),
  qa_years: z.int(),
  languages: z.array(z.object({ name: z.string(), native: z.boolean() })),
  devices: z.array(
    z.object({
      id: z.uuid(),
      device_tag: tag.nullable(),
      brand: z.string().nullable(),
      model: z.string().nullable(),
      os_version: z.string().nullable(),
      custom_name: z.string().nullable(),
    })
  ),
  interests: z.array(tag),
  updated_at: z.iso.datetime(),
})

// The email is not stored with the profile; it comes from the logged-in account
export async function findTesterProfile(
  db: Db,
  user: { id: string; email: string }
) {
  const [profile] = await db
    .select()
    .from(testerProfiles)
    .where(eq(testerProfiles.userId, user.id))

  if (!profile) return null

  const devices = await db
    .select({
      id: testerDevices.id,
      // A custom device has no tag; drizzle turns the all-null object into null
      device_tag: { id: tags.id, category: tags.category, name: tags.name },
      brand: testerDevices.brand,
      model: testerDevices.model,
      os_version: testerDevices.osVersion,
      custom_name: testerDevices.customName,
    })
    .from(testerDevices)
    .leftJoin(tags, eq(tags.id, testerDevices.deviceTagId))
    .where(eq(testerDevices.userId, user.id))
    .orderBy(testerDevices.sortOrder, testerDevices.id)

  // Industry and audience tags saved before they were dropped from the profile stay
  // in the table but are not returned
  const interests = await db
    .select({ id: tags.id, category: tags.category, name: tags.name })
    .from(testerProfileTags)
    .innerJoin(tags, eq(tags.id, testerProfileTags.tagId))
    .where(
      and(eq(testerProfileTags.userId, user.id), eq(tags.category, 'interest'))
    )
    .orderBy(tags.sortOrder)

  return {
    real_name: profile.realName,
    email: user.email,
    phone: profile.phone,
    city: profile.city,
    has_qa_experience: profile.hasQaExperience,
    experiences: profile.experiences,
    // Read-only: always the sum of experiences, not the stored qa_years column
    qa_years: profile.experiences.reduce((sum, { years }) => sum + years, 0),
    languages: profile.languages,
    devices,
    interests,
    updated_at: profile.updatedAt,
  }
}
