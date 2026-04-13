import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    // Verificar si ya existe algún usuario
    const existingUsers = await prisma.user.findMany()
    
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: 'Ya existe al menos un usuario. Usa /api/auth/register para crear más.' },
        { status: 400 }
      )
    }

    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || 'Admin'
      }
    })

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      message: 'Usuario creado exitosamente'
    })
  } catch (error) {
    console.error('Error al crear usuario:', error)
    return NextResponse.json(
      { error: 'Error al crear el usuario', details: String(error) },
      { status: 500 }
    )
  }
}