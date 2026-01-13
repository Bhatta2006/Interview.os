import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const userId = req.headers.get('x-user-id') || 'demo-user-id'

  try {
    const company = await prisma.company.findFirst({
      where: {
        OR: [
          { id: id },
          { slug: id }
        ]
      },
      include: {
        questions: {
          orderBy: { title: 'asc' },
          include: {
            progress: {
              where: { userId: userId || 'invalid-id' }
            }
          }
        }
      }
    })

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    return NextResponse.json(company)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch company' }, { status: 500 })
  }
}
