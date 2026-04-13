import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const equipo = await prisma.equipo.findUnique({
      where: { id },
      include: { empresa: { select: { nombre: true } } }
    })
    if (!equipo) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json(equipo)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = await request.json()
    
    const updateData: any = {
      nombre: data.nombre,
      tipo: data.tipo || null,
      marca: data.marca || null,
      modelo: data.modelo || null,
      serie: data.serie || null,
      estado: data.estado || 'activo',
      ubicacion: data.ubicacion || null,
      notas: data.notas || null,
    }
    
    const equipo = await prisma.equipo.update({
      where: { id },
      data: updateData
    })
    
    return NextResponse.json(equipo)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.equipo.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
