import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

async function main() {
  console.log('Conectando a la base de datos...')
  
  try {
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('Conexión exitosa:', result)
    
    // Crear usuario de prueba
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const user = await prisma.user.create({
      data: {
        email: 'admin@proyectos-it.com',
        password: hashedPassword,
        name: 'Administrador'
      }
    })
    
    console.log('Usuario creado:', user)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()