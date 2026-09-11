import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  username: z.string().trim().regex(/^@?[A-Za-z0-9_]{1,15}$/),
  profileUrl: z.string().url(),
  displayName: z.string().trim().min(1).max(80),
  bio: z.string().trim().max(280).optional().default(''),
  profileImageUrl: z.string().url().optional().or(z.literal('')).default(''),
  categoryId: z.string().min(1),
  email: z.string().email(),
})

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  const q = p.get('q')?.trim() || ''
  const category = p.get('category') || undefined
  const take = Math.min(Math.max(Number(p.get('limit') || 24), 1), 50)
  const accounts = await prisma.xAccount.findMany({
    where: { active: true, ...(category ? { categories: { some: { category: { slug: category } } } } : {}), ...(q ? { OR: [{ username: { contains: q.replace(/^@/, ''), mode: 'insensitive' } }, { displayName: { contains: q, mode: 'insensitive' } }, { bio: { contains: q, mode: 'insensitive' } }] } : {}) },
    include: { categories: { include: { category: true } } },
    orderBy: { createdAt: 'desc' }, take,
  })
  return NextResponse.json(accounts)
}

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json())
  if (!parsed.success) return NextResponse.json({ error: 'Please provide a valid X profile, name, category and email.' }, { status: 400 })
  const data = parsed.data
  const handle = data.username.replace(/^@/, '').toLowerCase()
  const profile = new URL(data.profileUrl)
  if (!['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com'].includes(profile.hostname.toLowerCase())) return NextResponse.json({ error: 'Profile URL must be an X or Twitter profile URL.' }, { status: 400 })
  if (profile.pathname.replace(/^\//, '').split('/')[0].toLowerCase() !== handle) return NextResponse.json({ error: 'The username and profile URL do not match.' }, { status: 400 })
  const category = await prisma.category.findUnique({ where: { id: data.categoryId } })
  if (!category) return NextResponse.json({ error: 'Category not found.' }, { status: 404 })
  const user = await prisma.user.upsert({ where: { email: data.email.toLowerCase() }, update: { name: data.displayName }, create: { email: data.email.toLowerCase(), name: data.displayName } })
  const account = await prisma.xAccount.upsert({
    where: { username: handle },
    update: { displayName: data.displayName, bio: data.bio || null, profileImageUrl: data.profileImageUrl || null, profileUrl: `https://x.com/${handle}`, active: true },
    create: { xUserId: `manual:${handle}`, username: handle, displayName: data.displayName, bio: data.bio || null, profileImageUrl: data.profileImageUrl || null, profileUrl: `https://x.com/${handle}`, submittedById: user.id },
  })
  await prisma.accountCategory.upsert({ where: { accountId_categoryId: { accountId: account.id, categoryId: category.id } }, update: {}, create: { accountId: account.id, categoryId: category.id } })
  await prisma.submission.upsert({ where: { userId_accountId: { userId: user.id, accountId: account.id } }, update: { categoryId: category.id }, create: { userId: user.id, accountId: account.id, categoryId: category.id } })
  return NextResponse.json(account, { status: 201 })
}
