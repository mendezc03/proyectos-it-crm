import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const licencias = await prisma.licencia.findMany({
      orderBy: { nombre: 'asc' },
      include: { empresa: { select: { nombre: true } } }
    })
    return NextResponse.json(licencias)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener licencias' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const licencia = await prisma.licencia.create({
      data: {
        nombre: data.nombre,
        tipo: data.tipo || null,
        clave: data.clave || null,
        fechaInicio: data.fechaInicio ? new Date(data.fechaInicio) : null,
        fechaVenc: data.fechaVenc ? new Date(data.fechaVenc) : null,
        costo: data.costo ? parseFloat(data.costo) : null,
        notas: data.notas || null,
        empresaId: data.empresaId
      }
    })
    
    return NextResponse.json(licencia)
  } catch (error) {
    console.error('Error al crear licencia:', error)
    return NextResponse.json(
      { error: 'Error al crear licencia: ' + (error as Error).message },
      { status: 500 }
    )
  }
}
