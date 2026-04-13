import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { encrypt, decrypt } from '@/lib/encryption'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const servidor = await prisma.servidor.findUnique({
      where: { id },
      include: { empresa: { select: { nombre: true } } }
    })
    if (!servidor) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json({ ...servidor, password: servidor.password ? decrypt(servidor.password) : null })
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
      ip: data.ip || null,
      tipo: data.tipo || null,
      usuario: data.usuario || null,
      puerto: data.puerto ? parseInt(data.puerto) : null,
      notas: data.notas || null
    }
    
    if (data.password) {
      updateData.password = encrypt(data.password)
    }
    
    const servidor = await prisma.servidor.update({
      where: { id },
      data: updateData
    })
    
    return NextResponse.json({ ...servidor, password: data.password || null })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.servidor.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
