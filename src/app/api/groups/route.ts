import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const groups = await db.group.findMany({
      include: {
        course: {
          include: { language: true }
        },
        teacher: true,
        level: true,
        _count: {
          select: { enrollments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(groups)
  } catch (error) {
    console.error('Error fetching groups:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const group = await db.group.create({
      data: {
        name: data.name,
        code: data.code,
        courseId: data.courseId,
        teacherId: data.teacherId || null,
        levelId: data.levelId || null,
        languageId: data.languageId || null,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        maxStudents: parseInt(data.maxStudents) || 20,
        status: data.status || 'PLANNED',
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
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
  }
}
