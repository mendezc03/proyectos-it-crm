# Proyectos-IT CRM

Sistema de gestión de clientes y soporte técnico para Proyectos-IT.

## Características

- **Gestión de Empresas**: CRUD completo de empresas clientes
- **Empleados**: Registro de empleados por empresa
- **Correos Corporativos**: Gestión de cuentas de correo (cifradas)
- **Servidores**: Información de servidores con acceso cifrado
- **Equipos/Inventario**: Inventario de equipos por empresa
- **Licencias**: Seguimiento de licencias de software
- **Accesos Web**: Gestión de credenciales de portales (cifradas)
- **Autenticación**: Sistema de login para el equipo
- **Cifrado AES-256**: Contraseñas y credenciales cifradas

## Requisitos

- Node.js 20+
- Docker y Docker Compose (opcional)
- Linux (para despliegue en servidor)

## Instalación Local (Desarrollo)

```bash
# 1. Entrar al directorio
cd proyectos-it-crm

# 2. Instalar dependencias
npm install

# 3. Generar cliente Prisma
npx prisma generate

# 4. Crear base de datos
npx prisma db push

# 5. Ejecutar en desarrollo
npm run dev
```

Abrir http://localhost:3000 y registrar el primer usuario.

## Despliegue en Servidor Linux

### Opción 1: Con Docker (Recomendado)

```bash
# 1. Copiar proyecto al servidor
scp -r proyectos-it-crm user@servidor:/opt/

# 2. Entrar al directorio
cd /opt/proyectos-it-crm

# 3. Editar docker-compose.yml y cambiar:
#    - NEXTAUTH_SECRET (generar uno nuevo)
#    - ENCRYPTION_KEY (32 caracteres)

# 4. Construir e iniciar
docker-compose up -d

# 5. Crear la base de datos
docker-compose exec app npx prisma db push
```

### Opción 2: Sin Docker

```bash
# 1. Instalar Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -S bash -
sudo apt-get install -y nodejs

# 2. Instalar dependencias
npm install
npm install -g prisma

# 3. Generar cliente Prisma
npx prisma generate

# 4. Crear base de datos
npx prisma db push

# 5. Construir
npm run build

# 6. Ejecutar
npm start
```

## Configuración

Variables de entorno en `.env`:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="genera-una-clave-secreta-larga"
NEXTAUTH_URL="http://tu-ip:3000"
ENCRYPTION_KEY="clave-de-32-caracteres-para-aes"
```

## Acceso

- URL: `http://[IP-SERVIDOR]:3000`
- Red local: acceso directo
- Remoto: conectar VPN OPNsense primero

## Estructura del Proyecto

```
proyectos-it-crm/
├── src/
│   ├── app/
│   │   ├── (dashboard)/     # Páginas protegidas
│   │   │   ├── dashboard/    # Dashboard principal
│   │   │   └── empresas/     # Gestión de empresas
│   │   ├── api/             # Rutas API
│   │   ├── login/           # Página de login
│   │   └── register/        # Registro de usuarios
│   ├── lib/
│   │   ├── auth.ts          # Configuración NextAuth
│   │   ├── prisma.ts       # Cliente Prisma
│   │   └── encryption.ts   # Funciones de cifrado
│   └── components/          # Componentes React
├── prisma/
│   └── schema.prisma        # Modelos de datos
├── Dockerfile
├── docker-compose.yml
└── .env
```

## Modelo de Datos

- **Empresa**: Información general del cliente
- **Empleado**: Personal de la empresa
- **Correo**: Cuentas de correo corporativas
- **Servidor**: Servidores y sus credenciales
- **Equipo**: Inventario de hardware
- **Licencia**: Licencias de software
- **AccesoWeb**: URLs y credenciales de portales
- **User**: Usuarios del sistema (tu equipo)

## Seguridad

- Contraseñas de usuarios: bcrypt (hash)
- Credenciales de clientes: AES-256 (cifrado)
- Autenticación: NextAuth con JWT
- Base de datos: SQLite (local)

## Soporte

Para acceder desde fuera de la oficina:
1. Conectar a VPN OPNsense
2. Abrir http://[IP-SERVIDOR]:3000
3. Iniciar sesión con credenciales
