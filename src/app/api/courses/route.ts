import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const courses = await db.course.findMany({
      include: {
        language: true,
        _count: {
          select: { groups: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const course = await db.course.create({
      data: {
        name: data.name,
        code: data.code,
        description: data.description || null,
        duration: parseInt(data.duration),
        price: parseFloat(data.price),
        languageId: data.languageId
      },
      include: { language: true }
    })
    return NextResponse.json(course)
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Ce code existe déjà' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
  }
}
