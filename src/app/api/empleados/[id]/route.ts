import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const empleado = await prisma.empleado.findUnique({
      where: { id },
      include: { empresa: { select: { nombre: true } } }
    })
    if (!empleado) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(empleado)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()
    
    const empleado = await prisma.empleado.update({
      where: { id },
      data: {
        nombre: data.nombre,
        cargo: data.cargo || null,
        email: data.email || null,
        telefono: data.telefono || null,
        notas: data.notas || null
      }
    })
    
    return NextResponse.json(empleado)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.empleado.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
