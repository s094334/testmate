import { z } from '@hono/zod-openapi'
import { eq } from 'drizzle-orm'
import type { Db } from '../../db'
import { companies, tagCategories, tags } from '../../db/schema'
import { phoneField, realNameField } from './profile'

// An owner's signup profile and PUT /api/auth/company take the same fields
export const companyFields = {
  real_name: realNameField,
  phone: phoneField,
  name: z
    .string({ error: '請輸入公司名稱' })
    .trim()
    .min(1, '請輸入公司名稱')
    .max(100, '公司名稱最多 100 字'),
  tax_id: z
    .string({ error: '統一編號須為 8 碼數字' })
    .regex(/^([0-9]{8})?$/, '統一編號須為 8 碼數字')
    .nullish()
    .transform((value) => value || null),
  industry_tag_id: z.uuid({ error: '請選擇產業' }),
  address: z
    .string({ error: '請輸入地址' })
    .trim()
    .min(1, '請輸入地址')
    .max(200, '地址最多 200 字'),
}

// Tags are seed data that no API changes, so the category read here
// cannot change before the company is saved
export async function isIndustryTag(db: Db, tagId: string) {
  const [tag] = await db
    .select({ category: tags.category })
    .from(tags)
    .where(eq(tags.id, tagId))

  return tag?.category === 'industry'
}

// API.md `Company`, returned by both GET and PUT /api/auth/company
export const companySchema = z.object({
  real_name: z.string(),
  email: z.string(),
  phone: z.string(),
  name: z.string(),
  tax_id: z.string().nullable(),
  industry_tag: z.object({
    id: z.uuid(),
    category: z.enum(tagCategories),
    name: z.string(),
  }),
  address: z.string(),
})

// The email is not stored with the company; it comes from the logged-in account
export async function findCompany(db: Db, user: { id: string; email: string }) {
  const [company] = await db
    .select({
      real_name: companies.realName,
      phone: companies.phone,
      name: companies.name,
      tax_id: companies.taxId,
      industry_tag: { id: tags.id, category: tags.category, name: tags.name },
      address: companies.address,
    })
    .from(companies)
    .innerJoin(tags, eq(tags.id, companies.industryTagId))
    .where(eq(companies.userId, user.id))

  if (!company) return null

  return {
    real_name: company.real_name,
    email: user.email,
    phone: company.phone,
    name: company.name,
    tax_id: company.tax_id,
    industry_tag: company.industry_tag,
    address: company.address,
  }
}
