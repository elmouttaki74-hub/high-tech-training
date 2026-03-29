import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const students = await db.student.findMany({
      include: {
        _count: {
          select: { enrollments: true, payments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(students)
  } catch (error) {
    console.error('Error fetching students:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const student = await db.student.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone || null,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        address: data.address || null,
        status: data.status || 'ACTIVE'
      }
    })
    return NextResponse.json(student)
  } catch (error: any) {
    console.error('Error creating student:', error)
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Cet email existe déjà' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
  }
}
