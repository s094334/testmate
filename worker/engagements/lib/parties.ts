import { eq } from 'drizzle-orm'
import type { Db } from '../../db'
import { engagements, projects } from '../../db/schema'

export type Side = 'owner' | 'tester'

// The engagement with its project's owner: enough to tell who is asking
export async function findParties(db: Db, id: string) {
  const [row] = await db
    .select({ ownerId: projects.ownerId, engagement: engagements })
    .from(engagements)
    .innerJoin(projects, eq(projects.id, engagements.projectId))
    .where(eq(engagements.id, id))
  return row
}

export function sideOf(
  parties: NonNullable<Awaited<ReturnType<typeof findParties>>>,
  userId: string
): Side | null {
  if (userId === parties.ownerId) return 'owner'
  if (userId === parties.engagement.testerId) return 'tester'
  return null
}
