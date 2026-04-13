import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { encrypt, decrypt } from '@/lib/encryption'

export async function GET() {
  try {
    const dominios = await prisma.dominio.findMany({
      orderBy: { nombre: 'asc' },
      include: { empresa: { select: { nombre: true } } }
    })
    const decrypted = dominios.map(d => ({ 
      ...d, 
      password: d.password ? decrypt(d.password) : null 
    }))
    return NextResponse.json(decrypted)
  } catch (error) {
    console.error('Error al obtener dominios:', error)
    return NextResponse.json({ error: 'Error al obtener dominios' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const dominio = await prisma.dominio.create({
      data: {
        nombre: data.nombre,
        url: data.url,
        fechaVenc: data.fechaVenc ? new Date(data.fechaVenc) : null,
        renovacion: data.renovacion || null,
        proveedor: data.proveedor || null,
        usuario: data.usuario || null,
        password: data.password ? encrypt(data.password) : null,
        dns1: data.dns1 || null,
        dns2: data.dns2 || null,
        notas: data.notas || null,
        empresaId: data.empresaId
      }
    })
    
    return NextResponse.json({ ...dominio, password: data.password || null })
  } catch (error: any) {
    console.error('Error al crear dominio:', error)
    return NextResponse.json({ 
      error: 'Error al crear dominio: ' + (error?.message || 'Unknown error')
    }, { status: 500 })
  }
}
