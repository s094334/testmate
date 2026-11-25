import { z } from '@hono/zod-openapi'
import { and, eq } from 'drizzle-orm'
import {
  isPhone,
  normalizePhone,
  phoneFormatMessage,
} from '../../../shared/phone'
import type { Db } from '../../db'
import {
  minQaYearsOptions,
  tagCategories,
  tags,
  testerDevices,
  testerProfileTags,
  testerProfiles,
} from '../../db/schema'

const tag = z.object({
  id: z.uuid(),
  category: z.enum(tagCategories),
  name: z.string(),
})

// Both roles' signup and PUT /api/auth/profile. The forms check with the same isPhone.
export const phoneField = z
  .string({ error: '請輸入手機號碼' })
  .overwrite(normalizePhone)
  .refine(isPhone, phoneFormatMessage)

// Signup and PUT /api/auth/profile both take it. Same as maxLength on both forms.
export const nicknameField = z
  .string({ error: '請輸入暱稱' })
  .trim()
  .min(1, '請輸入暱稱')
  .max(12, '暱稱最多 12 字')

// `TesterProfile`, returned by both GET and PUT /api/auth/profile
export const testerProfileSchema = z.object({
  real_name: z.string(),
  // '' for testers who signed up before nicknames existed
  nickname: z.string(),
  email: z.string(),
  phone: z.string(),
  city: z.string(),
  has_qa_experience: z.boolean(),
  experiences: z.array(
    z.object({ company: z.string(), years: z.enum(minQaYearsOptions) })
  ),
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

// Profiles saved before years became a code have a number of years
export function yearsCodeOf(
  years: (typeof minQaYearsOptions)[number] | number
): (typeof minQaYearsOptions)[number] {
  if (typeof years === 'string') return years
  if (years < 1) return 'under_1'
  if (years <= 2) return '1_to_2'
  if (years <= 5) return '3_to_5'
  return 'over_5'
}

// 暫定, not decided yet: each experience counts as the lowest number of
// years in its range (超過 5 年 as 6)
export function qaYearsOf(
  experiences: { years: (typeof minQaYearsOptions)[number] }[]
) {
  return experiences.reduce(
    (sum, { years }) =>
      sum + { under_1: 0, '1_to_2': 1, '3_to_5': 3, over_5: 6 }[years],
    0
  )
}

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

  const experiences = profile.experiences.map((experience) => ({
    company: experience.company,
    years: yearsCodeOf(experience.years),
  }))

  return {
    real_name: profile.realName,
    nickname: profile.nickname,
    email: user.email,
    phone: profile.phone,
    city: profile.city,
    has_qa_experience: profile.hasQaExperience,
    experiences,
    // Read-only: always worked out from experiences, not the stored qa_years column
    qa_years: qaYearsOf(experiences),
    languages: profile.languages,
    devices,
    interests,
    updated_at: profile.updatedAt,
  }
}
