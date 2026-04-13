import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const equipos = await prisma.equipo.findMany({
      orderBy: { nombre: 'asc' },
      include: { empresa: { select: { nombre: true } } }
    })
    return NextResponse.json(equipos)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener equipos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const equipo = await prisma.equipo.create({
      data: {
        nombre: data.nombre,
        tipo: data.tipo || null,
        marca: data.marca || null,
        modelo: data.modelo || null,
        serie: data.serie || null,
        estado: data.estado || 'activo',
        ubicacion: data.ubicacion || null,
        notas: data.notas || null,
        empresaId: data.empresaId
      }
    })
    
    return NextResponse.json(equipo)
  } catch (error) {
    console.error('Error al crear equipo:', error)
    return NextResponse.json(
      { error: 'Error al crear equipo: ' + (error as Error).message },
      { status: 500 }
    )
  }
}
