import { and, eq } from 'drizzle-orm'
import type { Db } from '../../db'
import {
  tags,
  testerDevices,
  testerProfileTags,
  testerProfiles,
  users,
} from '../../db/schema'

// One tester's `testerCardSchema` (applications/lib/application.ts), built
// the same way as each applicant in GET /api/applications
export async function findTesterCard(db: Db, testerId: string) {
  const [profile] = await db
    .select({
      nickname: testerProfiles.nickname,
      avatarShape: users.avatarShape,
      city: testerProfiles.city,
      hasQaExperience: testerProfiles.hasQaExperience,
      qaYears: testerProfiles.qaYears,
      languages: testerProfiles.languages,
    })
    .from(testerProfiles)
    .innerJoin(users, eq(users.id, testerProfiles.userId))
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
    nickname: profile.nickname || null,
    avatar_shape: profile.avatarShape,
    city: profile.city,
    qa_years: profile.hasQaExperience ? profile.qaYears : null,
    languages: profile.languages,
    devices,
    interests: interests.map((interest) => interest.name),
    // Ratings do not exist yet
    average_score: null,
    rating_count: 0,
  }
}
