import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const languages = await db.language.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(languages)
  } catch (error) {
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const language = await db.language.create({
      data: {
        name: data.name,
        code: data.code.toUpperCase(),
        icon: data.icon || null
      }
    })
    return NextResponse.json(language)
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Ce code existe déjà' }, { status: 400 })
    }
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
  }
}
