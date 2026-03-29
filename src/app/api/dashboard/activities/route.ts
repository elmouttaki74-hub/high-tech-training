import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const schedules = await db.schedule.findMany({
      where: {
        date: {
          gte: new Date()
        },
        status: 'SCHEDULED'
      },
      include: {
        group: {
          include: {
            course: {
              include: {
                language: true
              }
            }
          }
        }
      },
      orderBy: { date: 'asc' },
      take: 5
    })

    const activities = schedules.map(s => ({
      id: s.id,
      type: s.group.course.language.name,
      description: `${s.group.name} - ${s.group.course.name}`,
      date: `${s.date.toLocaleDateString('fr-FR')} ${s.startTime}-${s.endTime}`,
      status: 'scheduled'
    }))

    return NextResponse.json(activities)
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json([])
  }
}
