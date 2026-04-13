import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { decrypt, encrypt } from '@/lib/encryption'

export async function GET() {
  try {
    const correos = await prisma.correo.findMany({
      orderBy: { email: 'asc' },
      include: { empresa: { select: { nombre: true } } }
    })
    const decrypted = correos.map(c => ({ 
      ...c, 
      password: decrypt(c.password) 
    }))
    return NextResponse.json(decrypted)
  } catch (error) {
    console.error('Error al obtener correos:', error)
    return NextResponse.json({ error: 'Error al obtener correos' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const correo = await prisma.correo.create({
      data: {
        email: data.email,
        password: encrypt(data.password),
        proveedor: data.proveedor || null,
        empresaId: data.empresaId
      }
    })
    
    return NextResponse.json({ 
      ...correo, 
      password: data.password 
    })
  } catch (error: any) {
    console.error('Error al crear correo:', error)
    return NextResponse.json({ 
      error: 'Error al crear correo: ' + (error?.message || 'Unknown error')
    }, { status: 500 })
  }
}
