import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { encrypt, decrypt } from '@/lib/encryption'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const acceso = await prisma.accesoWeb.findUnique({
      where: { id },
      include: { empresa: { select: { nombre: true } } }
    })
    if (!acceso) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json({ ...acceso, password: acceso.password ? decrypt(acceso.password) : null })
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
      usuario: data.usuario || null,
      notas: data.notas || null
    }
    
    if (data.password) {
      updateData.password = encrypt(data.password)
    }
    
    const acceso = await prisma.accesoWeb.update({
      where: { id },
      data: updateData
    })
    
    return NextResponse.json({ ...acceso, password: data.password || null })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.accesoWeb.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
