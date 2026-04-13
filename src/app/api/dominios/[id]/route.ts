import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { encrypt, decrypt } from '@/lib/encryption'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const dominio = await prisma.dominio.findUnique({
      where: { id },
      include: { empresa: { select: { nombre: true } } }
    })
    if (!dominio) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json({ ...dominio, password: dominio.password ? decrypt(dominio.password) : null })
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
      url: data.url,
      fechaVenc: data.fechaVenc ? new Date(data.fechaVenc) : null,
      renovacion: data.renovacion || null,
      proveedor: data.proveedor || null,
      usuario: data.usuario || null,
      dns1: data.dns1 || null,
      dns2: data.dns2 || null,
      notas: data.notas || null
    }
    
    if (data.password) {
      updateData.password = encrypt(data.password)
    }
    
    const dominio = await prisma.dominio.update({
      where: { id },
      data: updateData
    })
    
    return NextResponse.json({ ...dominio, password: data.password || null })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.dominio.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
