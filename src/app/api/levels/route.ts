import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const levels = await db.level.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(levels)
  } catch (error) {
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const level = await db.level.create({
      data: {
        name: data.name,
        description: data.description || null,
        order: data.order || 0
      }
    })
    return NextResponse.json(level)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
  }
}
