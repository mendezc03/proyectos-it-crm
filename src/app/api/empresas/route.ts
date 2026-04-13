import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const empresas = await prisma.empresa.findMany({
      orderBy: { nombre: 'asc' },
      include: {
        _count: {
          select: {
            empleados: true,
            equipos: true,
            licencias: true,
            correos: true,
            servidores: true,
            accesosWeb: true,
            dominios: true
          }
        }
      }
    })

    return NextResponse.json(empresas)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener las empresas' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const empresa = await prisma.empresa.create({
      data: {
        nombre: data.nombre,
        rut: data.rut || null,
        direccion: data.direccion || null,
        telefono: data.telefono || null,
        emailContacto: data.emailContacto || null,
        notas: data.notas || null
      }
    })

    return NextResponse.json(empresa)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear la empresa' },
      { status: 500 }
    )
  }
}
