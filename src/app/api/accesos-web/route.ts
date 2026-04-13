import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decrypt } from '@/lib/encryption'

export async function GET() {
  try {
    const accesos = await prisma.accesoWeb.findMany({
      orderBy: { nombre: 'asc' },
      include: { empresa: { select: { nombre: true } } }
    })
    const decrypted = accesos.map(a => ({ 
      ...a, 
      password: a.password ? decrypt(a.password) : null 
    }))
    return NextResponse.json(decrypted)
  } catch (error) {
    console.error('Error al obtener accesos:', error)
    return NextResponse.json({ error: 'Error al obtener accesos' }, { status: 500 })
  }
}
