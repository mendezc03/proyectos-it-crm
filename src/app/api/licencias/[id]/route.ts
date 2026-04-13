import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const licencia = await prisma.licencia.findUnique({
      where: { id },
      include: { empresa: { select: { nombre: true } } }
    })
    if (!licencia) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(licencia)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()
    
    const licencia = await prisma.licencia.update({
      where: { id },
      data: {
        nombre: data.nombre,
        tipo: data.tipo || null,
        clave: data.clave || null,
        fechaInicio: data.fechaInicio ? new Date(data.fechaInicio) : null,
        fechaVenc: data.fechaVenc ? new Date(data.fechaVenc) : null,
        costo: data.costo ? parseFloat(data.costo) : null,
        notas: data.notas || null
      }
    })
    
    return NextResponse.json(licencia)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.licencia.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
