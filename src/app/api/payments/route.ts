import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const payments = await db.payment.findMany({
      include: {
        student: true,
        enrollment: {
          include: {
            group: {
              include: { course: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(payments)
  } catch (error) {
    return NextResponse.json([])
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const payment = await db.payment.create({
      data: {
        studentId: data.studentId,
        enrollmentId: data.enrollmentId || null,
        amount: parseFloat(data.amount),
        paymentType: data.paymentType,
        paymentMethod: data.paymentMethod,
        reference: data.reference || null,
        status: data.status || 'PENDING',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        paidDate: data.paidDate ? new Date(data.paidDate) : null,
        notes: data.notes || null
      },
      include: { student: true }
    })
    return NextResponse.json(payment)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
  }
}
