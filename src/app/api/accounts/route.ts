import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const createSchema = z.object({
  username: z.string().trim().regex(/^@?[A-Za-z0-9_]{1,15}$/),
  categoryId: z.string().min(1),
  userId: z.string().min(1),
})

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  const q = p.get('q')?.trim() || ''
  const category = p.get('category') || undefined
  const take = Math.min(Number(p.get('limit') || 24), 50)
  const accounts = await prisma.xAccount.findMany({
    where: { active: true, ...(category ? { categories: { some: { category: { slug: category } } } } : {}), ...(q ? { OR: [{ username: { contains: q.replace(/^@/, ''), mode: 'insensitive' } }, { displayName: { contains: q, mode: 'insensitive' } }, { bio: { contains: q, mode: 'insensitive' } }] } : {}) },
    include: { categories: { include: { category: true } } },
    orderBy: { createdAt: 'desc' }, take,
  })
  return NextResponse.json(accounts)
}

export async function POST(req: NextRequest) {
  const parsed = createSchema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  const { username, categoryId, userId } = parsed.data
  const handle = username.replace(/^@/, '')
  // Profile enrichment is intentionally server-side. In production, replace this fallback
  // with the X API user lookup using X_CLIENT_ID/X_CLIENT_SECRET or an app access token.
  const account = await prisma.xAccount.upsert({
    where: { username: handle },
    update: { active: true, categories: { connect: { accountId_categoryId: { accountId: '', categoryId: '' } } } },
    create: { xUserId: `pending:${handle}`, username: handle, displayName: handle, bio: null, profileImageUrl: null, profileUrl: `https://x.com/${handle}`, submittedById: userId, categories: { create: { categoryId } } },
  }).catch(async () => prisma.xAccount.findUnique({ where: { username: handle } }))
  if (!account) return NextResponse.json({ error: 'Unable to add account' }, { status: 500 })
  await prisma.submission.upsert({ where: { userId_accountId: { userId, accountId: account.id } }, update: { categoryId }, create: { userId, accountId: account.id, categoryId } })
  return NextResponse.json(account, { status: 201 })
}
