import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const enrollments = await db.enrollment.findMany({
      include: {
        student: true,
        group: {
          include: { course: true }
        }
      },
      orderBy: { enrollDate: 'desc' }
    })
    return NextResponse.json(enrollments)
  } catch (error) {
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const enrollment = await db.enrollment.create({
      data: {
        studentId: data.studentId,
        groupId: data.groupId,
        status: data.status || 'ACTIVE'
      },
      include: { student: true, group: { include: { course: true } } }
    })
    return NextResponse.json(enrollment)
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Cet étudiant est déjà inscrit à ce groupe' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
  }
}
