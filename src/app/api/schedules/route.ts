import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const groupId = searchParams.get('groupId')
    
    const where = groupId ? { groupId } : {}
    
    const schedules = await db.schedule.findMany({
      where,
      include: {
        group: {
          include: {
            course: {
              include: { language: true }
            }
          }
        },
        teacher: true,
        room: true
      },
      orderBy: { date: 'asc' }
    })
    return NextResponse.json(schedules)
  } catch (error) {
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const schedule = await db.schedule.create({
      data: {
        groupId: data.groupId,
        teacherId: data.teacherId || null,
        roomId: data.roomId || null,
        date: new Date(data.date),
        startTime: data.startTime,
        endTime: data.endTime,
        topic: data.topic || null,
        notes: data.notes || null,
        status: data.status || 'SCHEDULED'
      },
      include: {
        group: { include: { course: { include: { language: true } } } },
        teacher: true,
        room: true
      }
    })
    return NextResponse.json(schedule)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
  }
}
