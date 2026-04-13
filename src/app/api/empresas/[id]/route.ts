import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const empresa = await prisma.empresa.findUnique({
      where: { id },
      include: {
        empleados: true,
        correos: true,
        servidores: true,
        equipos: true,
        licencias: true,
        accesosWeb: true,
        dominios: true
      }
    })

    if (!empresa) {
      return NextResponse.json(
        { error: 'Empresa no encontrada' },
        { status: 404 }
      )
    }

    try {
      const empresaConPasswords = {
        ...empresa,
        correos: empresa.correos.map(c => ({
          ...c,
          password: decrypt(c.password)
        })),
        servidores: empresa.servidores.map(s => ({
          ...s,
          password: s.password ? decrypt(s.password) : null
        })),
        accesosWeb: empresa.accesosWeb.map(a => ({
          ...a,
          password: a.password ? decrypt(a.password) : null
        })),
        dominios: empresa.dominios.map(d => ({
          ...d,
          password: d.password ? decrypt(d.password) : null
        }))
      }
      return NextResponse.json(empresaConPasswords)
    } catch (decryptError) {
      console.error('Error desencriptando:', decryptError)
      return NextResponse.json(empresa)
    }
  } catch (error) {
    console.error('Error GET empresa:', error)
    return NextResponse.json(
      { error: 'Error al obtener la empresa' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const data = await request.json()

    const empresa = await prisma.empresa.update({
      where: { id },
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
    console.error('Error PUT empresa:', error)
    return NextResponse.json(
      { error: 'Error al actualizar la empresa' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await prisma.empresa.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error DELETE empresa:', error)
    return NextResponse.json(
      { error: 'Error al eliminar la empresa' },
      { status: 500 }
    )
  }
}
