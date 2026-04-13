import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { encrypt, decrypt } from '@/lib/encryption'

export async function GET() {
  try {
    const servidores = await prisma.servidor.findMany({
      orderBy: { nombre: 'asc' },
      include: { empresa: { select: { nombre: true } } }
    })
    const decrypted = servidores.map(s => ({ 
      ...s, 
      password: s.password ? decrypt(s.password) : null 
    }))
    return NextResponse.json(decrypted)
  } catch (error) {
    console.error('Error al obtener servidores:', error)
    return NextResponse.json({ error: 'Error al obtener servidores' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    const createData: any = {
      nombre: data.nombre,
      empresaId: data.empresaId
    }
    
    if (data.ip) createData.ip = data.ip
    if (data.tipo) createData.tipo = data.tipo
    if (data.usuario) createData.usuario = data.usuario
    if (data.password) createData.password = encrypt(data.password)
    if (data.puerto) createData.puerto = parseInt(data.puerto)
    if (data.notas) createData.notas = data.notas
    
    const servidor = await prisma.servidor.create({
      data: createData
    })
    
    return NextResponse.json({ 
      ...servidor, 
      password: data.password || null 
    })
  } catch (error: any) {
    console.error('Error al crear servidor:', error)
    return NextResponse.json({ 
      error: 'Error al crear servidor: ' + (error?.message || 'Unknown error')
    }, { status: 500 })
  }
}
