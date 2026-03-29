import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const rooms = await db.room.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(rooms)
  } catch (error) {
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const room = await db.room.create({
      data: {
        name: data.name,
        capacity: data.capacity || 20,
        building: data.building || null,
        floor: data.floor || null
      }
    })
    return NextResponse.json(room)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
  }
}
