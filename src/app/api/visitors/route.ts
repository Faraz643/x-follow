import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const COOKIE_NAME = 'x-follow-visitor'
const MAX_AGE = 60 * 60 * 24 * 365

export async function POST(req: NextRequest) {
  try {
    let visitorKey = req.cookies.get(COOKIE_NAME)?.value
    const isNewVisitor = !visitorKey

    if (!visitorKey) visitorKey = crypto.randomUUID()

    await prisma.visitor.upsert({
      where: { visitorKey },
      update: { lastSeen: new Date() },
      create: { visitorKey },
    })

    const total = await prisma.visitor.count()
    const response = NextResponse.json({ total, isNewVisitor })

    if (isNewVisitor) {
      response.cookies.set({
        name: COOKIE_NAME,
        value: visitorKey,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: MAX_AGE,
        path: '/',
      })
    }

    return response
  } catch {
    return NextResponse.json({ error: 'Unable to update visitor count.' }, { status: 500 })
  }
}
