import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'company'
  const query = searchParams.get('query') || ''
  const userId = req.headers.get('x-user-id') || 'demo-user-id'

  try {
    const where: any = {}

    if (query) {
      if (type === 'company') {
        where.name = { contains: query, mode: 'insensitive' }
      } else if (type === 'topic') {
        where.questions = { some: { topic: { contains: query, mode: 'insensitive' } } }
      } else if (type === 'question') {
        where.questions = { some: { title: { contains: query, mode: 'insensitive' } } }
      }
    }

    const companies = await prisma.company.findMany({
      where,
      include: {
        _count: {
          select: { questions: true }
        },
        questions: userId && userId !== 'demo-user-id' ? {
          where: {
            progress: {
              some: {
                userId: userId,
                status: 'DONE'
              }
            }
          },
          select: { id: true }
        } : false
      },
      orderBy: { name: 'asc' }
    })

    const response = companies.map((c: any) => ({
      ...c,
      solvedCount: c.questions ? c.questions.length : 0,
      questions: undefined
    }))

    return NextResponse.json(response)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch companies' }, { status: 500 })
  }
}
