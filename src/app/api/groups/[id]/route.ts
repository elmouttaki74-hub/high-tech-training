import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    const group = await db.group.update({
      where: { id },
      data: {
        name: data.name,
        code: data.code,
        courseId: data.courseId,
        teacherId: data.teacherId || null,
        levelId: data.levelId || null,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        maxStudents: parseInt(data.maxStudents) || 20,
        status: data.status,
        room: data.room || null
      },
      include: {
        course: { include: { language: true } },
        teacher: true,
        level: true
      }
    })
    return NextResponse.json(group)
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Ce code existe déjà' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.group.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}
