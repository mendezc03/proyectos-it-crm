import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function GET() {
  try {
    const usuarios = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(usuarios)
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })
    
    if (existingUser) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 })
    }
    
    const hashedPassword = await hash(data.password, 12)
    
    const usuario = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name || null
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      }
    })
    
    return NextResponse.json(usuario)
  } catch (error) {
    console.error('Error al crear usuario:', error)
    return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    
    const updateData: { name?: string; password?: string } = {}
    
    if (data.name !== undefined) {
      updateData.name = data.name
    }
    
    if (data.password) {
      updateData.password = await hash(data.password, 12)
    }
    
    const usuario = await prisma.user.update({
      where: { id: data.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      }
    })
    
    return NextResponse.json(usuario)
  } catch (error) {
    console.error('Error al actualizar usuario:', error)
    return NextResponse.json({ error: 'Error al actualizar usuario' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }
    
    await prisma.user.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 })
  }
}
