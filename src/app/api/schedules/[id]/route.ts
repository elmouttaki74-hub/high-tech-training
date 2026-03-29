import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    const schedule = await db.schedule.update({
      where: { id },
      data: {
        groupId: data.groupId,
        teacherId: data.teacherId || null,
        roomId: data.roomId || null,
        date: new Date(data.date),
        startTime: data.startTime,
        endTime: data.endTime,
        topic: data.topic || null,
        notes: data.notes || null,
        status: data.status
      },
      include: {
        group: { include: { course: { include: { language: true } } } },
        teacher: true,
        room: true
      }
    })
    return NextResponse.json(schedule)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.schedule.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}
