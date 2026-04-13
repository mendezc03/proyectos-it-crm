import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const empleados = await prisma.empleado.findMany({
      orderBy: { nombre: 'asc' },
      include: { empresa: { select: { nombre: true } } }
    })
    return NextResponse.json(empleados)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener empleados' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const empleado = await prisma.empleado.create({
      data: {
        nombre: data.nombre,
        cargo: data.cargo || null,
        email: data.email || null,
        telefono: data.telefono || null,
        notas: data.notas || null,
        empresaId: data.empresaId
      }
    })
    return NextResponse.json(empleado)
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear empleado' }, { status: 500 })
  }
}
