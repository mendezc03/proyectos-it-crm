import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { encrypt, decrypt } from '@/lib/encryption'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const correo = await prisma.correo.findUnique({
      where: { id },
      include: { empresa: { select: { nombre: true } } }
    })
    if (!correo) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
    return NextResponse.json({ ...correo, password: decrypt(correo.password) })
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
      email: data.email,
      proveedor: data.proveedor || null
    }
    
    if (data.password) {
      updateData.password = encrypt(data.password)
    }
    
    const correo = await prisma.correo.update({
      where: { id },
      data: updateData
    })
    
    return NextResponse.json({ ...correo, password: data.password || '••••••••' })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await prisma.correo.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
  }
}
