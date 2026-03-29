import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const certificates = await db.certificate.findMany({
      include: {
        student: true
      },
      orderBy: { issueDate: 'desc' }
    })
    return NextResponse.json(certificates)
  } catch (error) {
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const certificate = await db.certificate.create({
      data: {
        studentId: data.studentId,
        type: data.type,
        courseId: data.courseId || null,
        issueDate: new Date(data.issueDate),
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
        grade: data.grade || null,
        reference: data.reference,
        notes: data.notes || null
      },
      include: { student: true }
    })
    return NextResponse.json(certificate)
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Cette référence existe déjà' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
  }
}
