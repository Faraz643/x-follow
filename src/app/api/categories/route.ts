import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { DEFAULT_CATEGORIES } from '@/lib/categories'

export async function GET() {
  const count = await prisma.category.count()
  if (!count) await prisma.category.createMany({ data: DEFAULT_CATEGORIES.map(([name, slug]) => ({ name, slug })) })
  return NextResponse.json(await prisma.category.findMany({ orderBy: { name: 'asc' } }))
}
