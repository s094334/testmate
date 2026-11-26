import { and, eq, inArray, type SQLWrapper } from 'drizzle-orm'
import type { Db } from '../../db'
import {
  tags,
  testerDevices,
  testerProfileTags,
  testerProfiles,
  users,
} from '../../db/schema'

// `testerCardSchema` (applications/lib/application.ts) for each tester with a
// profile, in no particular order. testerIds can be a subquery, so a long
// applicant list stays under D1's 100 bound parameters per query
export async function findTesterCards(
  db: Db,
  testerIds: SQLWrapper | string[]
) {
  const profiles = await db
    .select({
      testerId: testerProfiles.userId,
      nickname: testerProfiles.nickname,
      avatarShape: users.avatarShape,
      city: testerProfiles.city,
      hasQaExperience: testerProfiles.hasQaExperience,
      qaYears: testerProfiles.qaYears,
      languages: testerProfiles.languages,
    })
    .from(testerProfiles)
    .innerJoin(users, eq(users.id, testerProfiles.userId))
    .where(inArray(testerProfiles.userId, testerIds))

  const devices = await db
    .select({
      testerId: testerDevices.userId,
      deviceTagName: tags.name,
      brand: testerDevices.brand,
      model: testerDevices.model,
      osVersion: testerDevices.osVersion,
      customName: testerDevices.customName,
    })
    .from(testerDevices)
    .leftJoin(tags, eq(tags.id, testerDevices.deviceTagId))
    .where(inArray(testerDevices.userId, testerIds))
    .orderBy(testerDevices.sortOrder, testerDevices.id)

  const interests = await db
    .select({ testerId: testerProfileTags.userId, name: tags.name })
    .from(testerProfileTags)
    .innerJoin(tags, eq(tags.id, testerProfileTags.tagId))
    .where(
      and(
        inArray(testerProfileTags.userId, testerIds),
        eq(tags.category, 'interest')
      )
    )
    .orderBy(tags.sortOrder)

  return profiles.map((profile) => ({
    tester_id: profile.testerId,
    nickname: profile.nickname || null,
    avatar_shape: profile.avatarShape,
    city: profile.city,
    qa_years: profile.hasQaExperience ? profile.qaYears : null,
    languages: profile.languages,
    devices: devices
      .filter((device) => device.testerId === profile.testerId)
      .map((device) => ({
        device_tag_name: device.deviceTagName,
        brand: device.brand,
        model: device.model,
        os_version: device.osVersion,
        custom_name: device.customName,
      })),
    interests: interests
      .filter((interest) => interest.testerId === profile.testerId)
      .map((interest) => interest.name),
    // Ratings do not exist yet
    average_score: null,
    rating_count: 0,
  }))
}

export async function findTesterCard(db: Db, testerId: string) {
  const [card] = await findTesterCards(db, [testerId])
  return card ?? null
}
