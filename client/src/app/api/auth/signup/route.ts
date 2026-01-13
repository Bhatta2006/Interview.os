import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    const hash = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hash,
        name: name || email.split('@')[0]
      }
    })

    // Return success
    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
