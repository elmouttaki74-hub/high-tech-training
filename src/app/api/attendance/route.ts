import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const scheduleId = searchParams.get('scheduleId')
    const groupId = searchParams.get('groupId')
    
    if (scheduleId) {
      // Get attendance for a specific schedule
      const schedule = await db.schedule.findUnique({
        where: { id: scheduleId },
        include: { group: true }
      })
      
      if (!schedule) {
        return NextResponse.json([])
      }
      
      // Get all enrolled students
      const enrollments = await db.enrollment.findMany({
        where: { groupId: schedule.groupId, status: 'ACTIVE' },
        include: { student: true }
      })
      
      // Get existing attendance records
      const attendance = await db.attendance.findMany({
        where: { scheduleId }
      })
      
      // Combine data
      const result = enrollments.map(enrollment => {
        const record = attendance.find(a => a.studentId === enrollment.studentId)
        return {
          id: record?.id || enrollment.id,
          studentId: enrollment.studentId,
          student: enrollment.student,
          scheduleId,
          status: record?.status || 'ABSENT',
          notes: record?.notes || null
        }
      })
      
      return NextResponse.json(result)
    }
    
    // General attendance query
    const where = groupId ? { groupId } : {}
    const attendance = await db.attendance.findMany({
      where,
      include: {
        student: true,
        schedule: {
          include: { group: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(attendance)
  } catch (error) {
    console.error('Error fetching attendance:', error)
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    // Upsert attendance record
    const attendance = await db.attendance.upsert({
      where: {
        studentId_scheduleId: {
          studentId: data.studentId,
          scheduleId: data.scheduleId
        }
      },
      update: {
        status: data.status,
        notes: data.notes || null
      },
      create: {
        studentId: data.studentId,
        scheduleId: data.scheduleId,
        groupId: data.groupId,
        status: data.status,
        notes: data.notes || null
      },
      include: { student: true }
    })
    
    return NextResponse.json(attendance)
  } catch (error) {
    console.error('Error saving attendance:', error)
    return NextResponse.json({ error: 'Erreur lors de l\'enregistrement' }, { status: 500 })
  }
}
