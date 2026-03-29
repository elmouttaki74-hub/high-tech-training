import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()
    const payment = await db.payment.update({
      where: { id },
      data: {
        studentId: data.studentId,
        enrollmentId: data.enrollmentId || null,
        amount: parseFloat(data.amount),
        paymentType: data.paymentType,
        paymentMethod: data.paymentMethod,
        reference: data.reference || null,
        status: data.status,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        paidDate: data.paidDate ? new Date(data.paidDate) : null,
        notes: data.notes || null
      },
      include: { student: true }
    })
    return NextResponse.json(payment)
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la modification' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await db.payment.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors de la suppression' }, { status: 500 })
  }
}
