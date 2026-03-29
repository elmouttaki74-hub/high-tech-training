import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const [
      totalStudents,
      activeStudents,
      totalTeachers,
      activeTeachers,
      totalCourses,
      totalGroups,
      activeGroups,
      payments
    ] = await Promise.all([
      db.student.count(),
      db.student.count({ where: { status: 'ACTIVE' } }),
      db.teacher.count(),
      db.teacher.count({ where: { status: 'ACTIVE' } }),
      db.course.count(),
      db.group.count(),
      db.group.count({ where: { status: 'IN_PROGRESS' } }),
      db.payment.findMany({
        where: { status: 'PAID' },
        select: { amount: true }
      })
    ])

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0)
    const pendingPayments = await db.payment.count({ where: { status: 'PENDING' } })

    return NextResponse.json({
      totalStudents,
      activeStudents,
      totalTeachers,
      activeTeachers,
      totalCourses,
      totalGroups,
      activeGroups,
      totalRevenue,
      pendingPayments,
      upcomingClasses: 0
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({
      totalStudents: 0,
      activeStudents: 0,
      totalTeachers: 0,
      activeTeachers: 0,
      totalCourses: 0,
      totalGroups: 0,
      activeGroups: 0,
      totalRevenue: 0,
      pendingPayments: 0,
      upcomingClasses: 0
    })
  }
}
