'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

type Tab = 'info' | 'empleados' | 'correos' | 'servidores' | 'equipos' | 'licencias' | 'accesos' | 'dominios'

interface Empresa {
  id: string
  nombre: string
  rut: string | null
  direccion: string | null
  telefono: string | null
  emailContacto: string | null
  notas: string | null
  empleados: any[]
  correos: any[]
  servidores: any[]
  equipos: any[]
  licencias: any[]
  accesosWeb: any[]
  dominios: any[]
}

export default function EmpresaDetallePage() {
  const params = useParams()
  const router = useRouter()
  const [empresa, setEmpresa] = useState<Empresa | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('info')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEmpresa() {
      const id = params.id
      if (id) {
        await fetchEmpresa(id as string)
      }
    }
    loadEmpresa()
  }, [params.id])

  async function fetchEmpresa(id: string) {
    try {
      const res = await fetch(`/api/empresas/${id}`)
      if (!res.ok) throw new Error('Empresa no encontrada')
      const data = await res.json()
      setEmpresa(data)
    } catch (error) {
      console.error('Error:', error)
      router.push('/empresas')
    } finally {
      setLoading(false)
    }
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'info', label: 'Información', icon: 'ℹ️' },
    { id: 'empleados', label: 'Empleados', icon: '👥' },
    { id: 'correos', label: 'Correos', icon: '📧' },
    { id: 'servidores', label: 'Servidores', icon: '🖥️' },
    { id: 'equipos', label: 'Equipos', icon: '💻' },
    { id: 'licencias', label: 'Licencias', icon: '🔑' },
    { id: 'accesos', label: 'Accesos Web', icon: '🌐' },
    { id: 'dominios', label: 'Dominios', icon: '🌍' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!empresa) return null

  return (
    <div>
      <div className="mb-6">
        <Link href="/empresas" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
          ← Volver a empresas
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">{empresa.nombre}</h1>
        {empresa.rut && <p className="text-gray-500">RUT: {empresa.rut}</p>}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
              {tab.id !== 'info' && (
                <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {empresa[tab.id === 'empleados' ? 'empleados' : 
                    tab.id === 'correos' ? 'correos' : 
                    tab.id === 'servidores' ? 'servidores' : 
                    tab.id === 'equipos' ? 'equipos' : 
                    tab.id === 'licencias' ? 'licencias' : 
                    tab.id === 'accesos' ? 'accesosWeb' : 
                    'dominios'].length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'info' && <InfoTab empresa={empresa} />}
      {activeTab === 'empleados' && <EmpleadosTab empresaId={empresa.id} empleados={empresa.empleados} refresh={() => fetchEmpresa(empresa.id)} />}
      {activeTab === 'correos' && <CorreosTab empresaId={empresa.id} correos={empresa.correos} refresh={() => fetchEmpresa(empresa.id)} />}
      {activeTab === 'servidores' && <ServidoresTab empresaId={empresa.id} servidores={empresa.servidores} refresh={() => fetchEmpresa(empresa.id)} />}
      {activeTab === 'equipos' && <EquiposTab empresaId={empresa.id} equipos={empresa.equipos} refresh={() => fetchEmpresa(empresa.id)} />}
      {activeTab === 'licencias' && <LicenciasTab empresaId={empresa.id} licencias={empresa.licencias} refresh={() => fetchEmpresa(empresa.id)} />}
      {activeTab === 'accesos' && <AccesosTab empresaId={empresa.id} accesos={empresa.accesosWeb} refresh={() => fetchEmpresa(empresa.id)} />}
      {activeTab === 'dominios' && <DominiosTab empresaId={empresa.id} dominios={empresa.dominios} refresh={() => fetchEmpresa(empresa.id)} />}
    </div>
  )
}

function InfoTab({ empresa }: { empresa: Empresa }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Información General</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoField label="Nombre" value={empresa.nombre} />
        <InfoField label="RUT" value={empresa.rut} />
        <InfoField label="Dirección" value={empresa.direccion} />
        <InfoField label="Teléfono" value={empresa.telefono} />
        <InfoField label="Email de contacto" value={empresa.emailContacto} />
        <div className="md:col-span-2">
          <InfoField label="Notas" value={empresa.notas} />
        </div>
      </div>
    </div>
  )
}

function InfoField({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-gray-900">{value || '-'}</p>
    </div>
  )
}

function EmpleadosTab({ empresaId, empleados, refresh }: { empresaId: string; empleados: any[]; refresh: () => void }) {
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [viewItem, setViewItem] = useState<any>(null)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Empleados ({empleados.length})</h2>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          + Agregar
        </button>
      </div>

      {empleados.length === 0 ? (
        <EmptyState message="No hay empleados registrados" />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Nombre</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Cargo</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Email</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {empleados.map((emp) => (
                <tr key={emp.id}>
                  <td className="px-6 py-4 font-medium text-gray-900">{emp.nombre}</td>
                  <td className="px-6 py-4 text-gray-600">{emp.cargo || '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{emp.email || '-'}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setViewItem(emp)} className="text-gray-600 hover:text-gray-800 text-sm mr-3">
                      📋 Detalle
                    </button>
                    <button onClick={() => { setEditItem(emp); setShowModal(true); }} className="text-blue-600 hover:text-blue-700 text-sm mr-3">
                      Editar
                    </button>
                    <button onClick={() => handleDelete('empleados', emp.id, refresh)} className="text-red-600 hover:text-red-700 text-sm">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <FormModal 
          title={editItem ? 'Editar Empleado' : 'Nuevo Empleado'} 
          endpoint="/api/empleados" 
          empresaId={empresaId} 
          editItem={editItem}
          fields={[
            { name: 'nombre', label: 'Nombre', required: true },
            { name: 'cargo', label: 'Cargo' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'telefono', label: 'Teléfono' },
            { name: 'notas', label: 'Notas', type: 'textarea' },
          ]} 
          onClose={() => { setShowModal(false); setEditItem(null); }} 
          onSuccess={() => { setShowModal(false); setEditItem(null); refresh(); }} 
        />
      )}

      {viewItem && (
        <DetalleModal 
          title="Detalle del Empleado" 
          item={viewItem}
          fields={[
            { name: 'nombre', label: 'Nombre' },
            { name: 'cargo', label: 'Cargo' },
            { name: 'email', label: 'Email' },
            { name: 'telefono', label: 'Teléfono' },
            { name: 'notas', label: 'Notas' },
          ]}
          onClose={() => setViewItem(null)} 
        />
      )}
    </div>
  )
}

function CorreosTab({ empresaId, correos, refresh }: { empresaId: string; correos: any[]; refresh: () => void }) {
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [showPassword, setShowPassword] = useState<string | null>(null)
  const [viewItem, setViewItem] = useState<any>(null)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Correos Corporativos ({correos.length})</h2>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          + Agregar
        </button>
      </div>

      {correos.length === 0 ? (
        <EmptyState message="No hay correos registrados" />
      ) : (
        <div className="grid gap-4">
          {correos.map((correo) => (
            <div key={correo.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{correo.email}</p>
                  {correo.proveedor && <p className="text-sm text-gray-500">Proveedor: {correo.proveedor}</p>}
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-gray-500">
                      Contraseña: {showPassword === correo.id ? correo.password : '••••••••'}
                    </p>
                    <button 
                      onClick={() => setShowPassword(showPassword === correo.id ? null : correo.id)}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      {showPassword === correo.id ? 'Ocultar' : 'Ver'}
                    </button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setViewItem(correo)} className="text-gray-600 hover:text-gray-800 text-sm">
                    📋
                  </button>
                  <button onClick={() => { setEditItem(correo); setShowModal(true); }} className="text-blue-600 hover:text-blue-700 text-sm">
                    Editar
                  </button>
                  <button onClick={() => handleDelete('correos', correo.id, refresh)} className="text-red-600 hover:text-red-700 text-sm">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <FormModal 
          title={editItem ? 'Editar Correo' : 'Nuevo Correo'} 
          endpoint="/api/correos" 
          empresaId={empresaId} 
          editItem={editItem}
          fields={[
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'password', label: 'Contraseña', type: 'password', required: !editItem },
            { name: 'proveedor', label: 'Proveedor (Gmail, Outlook, etc.)' },
          ]} 
          onClose={() => { setShowModal(false); setEditItem(null); }} 
          onSuccess={() => { setShowModal(false); setEditItem(null); refresh(); }} 
        />
      )}

      {viewItem && (
        <DetalleModal 
          title="Detalle del Correo" 
          item={viewItem}
          fields={[
            { name: 'email', label: 'Email' },
            { name: 'password', label: 'Contraseña', isPassword: true },
            { name: 'proveedor', label: 'Proveedor' },
            { name: 'notas', label: 'Notas' },
          ]}
          onClose={() => setViewItem(null)} 
        />
      )}
    </div>
  )
}

function ServidoresTab({ empresaId, servidores, refresh }: { empresaId: string; servidores: any[]; refresh: () => void }) {
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [showPassword, setShowPassword] = useState<string | null>(null)
  const [viewItem, setViewItem] = useState<any>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Servidores ({servidores.length})</h2>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          + Agregar
        </button>
      </div>

      {servidores.length === 0 ? (
        <EmptyState message="No hay servidores registrados" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {servidores.map((srv) => {
            const ipCompleta = srv.ip && srv.puerto ? `${srv.ip}:${srv.puerto}` : srv.ip || ''
            return (
              <div key={srv.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{srv.nombre}</p>
                    <p className="text-sm text-gray-500">{srv.tipo}</p>
                    {ipCompleta && (
                      <div className="flex items-center gap-2 mt-1 bg-gray-100 px-2 py-1 rounded">
                        <code className="text-sm text-gray-800">{ipCompleta}</code>
                        <button 
                          onClick={() => copyToClipboard(ipCompleta, srv.id)}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          {copied === srv.id ? '✓ Copiado' : '📋 Copiar'}
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setViewItem(srv)} className="text-gray-600 hover:text-gray-800 text-sm">
                      📋
                    </button>
                    <button onClick={() => { setEditItem(srv); setShowModal(true); }} className="text-blue-600 hover:text-blue-700 text-sm">
                      Editar
                    </button>
                    <button onClick={() => handleDelete('servidores', srv.id, refresh)} className="text-red-600 hover:text-red-700 text-sm">
                      Eliminar
                    </button>
                  </div>
                </div>
                {srv.usuario && <p className="text-sm mt-2">Usuario: {srv.usuario}</p>}
                {srv.password && (
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-sm text-gray-500">
                      Contraseña: {showPassword === srv.id ? srv.password : '••••••••'}
                    </p>
                    <button 
                      onClick={() => setShowPassword(showPassword === srv.id ? null : srv.id)}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      {showPassword === srv.id ? 'Ocultar' : 'Ver'}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <FormModal 
          title={editItem ? 'Editar Servidor' : 'Nuevo Servidor'} 
          endpoint="/api/servidores" 
          empresaId={empresaId} 
          editItem={editItem}
          fields={[
            { name: 'nombre', label: 'Nombre del servidor', required: true },
            { name: 'ip', label: 'IP (ej: 192.168.1.1)' },
            { name: 'tipo', label: 'Tipo (Linux, Windows, etc.)' },
            { name: 'usuario', label: 'Usuario' },
            { name: 'password', label: 'Contraseña', type: 'password', required: !editItem },
            { name: 'puerto', label: 'Puerto (ej: 22, 3389, 8080)', type: 'number' },
            { name: 'notas', label: 'Notas', type: 'textarea' },
          ]} 
          onClose={() => { setShowModal(false); setEditItem(null); }} 
          onSuccess={() => { setShowModal(false); setEditItem(null); refresh(); }} 
        />
      )}

      {viewItem && (
        <DetalleModal 
          title="Detalle del Servidor" 
          item={viewItem}
          fields={[
            { name: 'nombre', label: 'Nombre' },
            { name: 'ip', label: 'Dirección IP' },
            { name: 'puerto', label: 'Puerto' },
            { name: 'tipo', label: 'Tipo' },
            { name: 'usuario', label: 'Usuario' },
            { name: 'password', label: 'Contraseña', isPassword: true },
            { name: 'notas', label: 'Notas' },
          ]}
          onClose={() => setViewItem(null)} 
        />
      )}
    </div>
  )
}

function EquiposTab({ empresaId, equipos, refresh }: { empresaId: string; equipos: any[]; refresh: () => void }) {
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [viewItem, setViewItem] = useState<any>(null)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Equipos / Inventario ({equipos.length})</h2>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          + Agregar
        </button>
      </div>

      {equipos.length === 0 ? (
        <EmptyState message="No hay equipos registrados" />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Nombre</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Tipo</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Marca/Modelo</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Estado</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {equipos.map((eq) => (
                <tr key={eq.id}>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{eq.nombre}</span>
                    {eq.ubicacion && <p className="text-xs text-gray-500">{eq.ubicacion}</p>}
                  </td>
                  <td className="px-6 py-4 text-gray-600">{eq.tipo || '-'}</td>
                  <td className="px-6 py-4 text-gray-600">{eq.marca} {eq.modelo && `/ ${eq.modelo}`}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      eq.estado === 'activo' ? 'bg-green-100 text-green-700' :
                      eq.estado === 'inactivo' ? 'bg-gray-100 text-gray-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {eq.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setViewItem(eq)} className="text-gray-600 hover:text-gray-800 text-sm mr-3">
                      📋
                    </button>
                    <button onClick={() => { setEditItem(eq); setShowModal(true); }} className="text-blue-600 hover:text-blue-700 text-sm mr-3">
                      Editar
                    </button>
                    <button onClick={() => handleDelete('equipos', eq.id, refresh)} className="text-red-600 hover:text-red-700 text-sm">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <EquipoModal 
          editItem={editItem}
          empresaId={empresaId}
          onClose={() => { setShowModal(false); setEditItem(null); }} 
          onSuccess={() => { setShowModal(false); setEditItem(null); refresh(); }} 
        />
      )}

      {viewItem && (
        <DetalleModal 
          title="Detalle del Equipo" 
          item={viewItem}
          fields={[
            { name: 'nombre', label: 'Nombre' },
            { name: 'tipo', label: 'Tipo' },
            { name: 'marca', label: 'Marca' },
            { name: 'modelo', label: 'Modelo' },
            { name: 'serie', label: 'Número de serie' },
            { name: 'estado', label: 'Estado' },
            { name: 'ubicacion', label: 'Ubicación' },
            { name: 'notas', label: 'Notas' },
          ]}
          onClose={() => setViewItem(null)} 
        />
      )}
    </div>
  )
}

function EquipoModal({ editItem, empresaId, onClose, onSuccess }: { 
  editItem: any; 
  empresaId: string; 
  onClose: () => void; 
  onSuccess: () => void 
}) {
  const [formData, setFormData] = useState({
    nombre: editItem?.nombre || '',
    tipo: editItem?.tipo || '',
    marca: editItem?.marca || '',
    modelo: editItem?.modelo || '',
    serie: editItem?.serie || '',
    estado: editItem?.estado || 'activo',
    ubicacion: editItem?.ubicacion || '',
    notas: editItem?.notas || '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editItem) {
      setFormData({
        nombre: editItem.nombre || '',
        tipo: editItem.tipo || '',
        marca: editItem.marca || '',
        modelo: editItem.modelo || '',
        serie: editItem.serie || '',
        estado: editItem.estado || 'activo',
        ubicacion: editItem.ubicacion || '',
        notas: editItem.notas || '',
      })
    }
  }, [editItem])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const url = editItem ? `/api/equipos/${editItem.id}` : '/api/equipos'
      const method = editItem ? 'PUT' : 'POST'
      
      const body: any = {
        nombre: formData.nombre,
        tipo: formData.tipo || null,
        marca: formData.marca || null,
        modelo: formData.modelo || null,
        serie: formData.serie || null,
        estado: formData.estado,
        ubicacion: formData.ubicacion || null,
        notas: formData.notas || null,
      }
      
      if (!editItem) {
        body.empresaId = empresaId
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) throw new Error('Error al guardar')
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Error al guardar')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {editItem ? 'Editar Equipo' : 'Nuevo Equipo'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
            <input
              type="text"
              required
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ej: EQ0015"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                value={formData.tipo}
                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Seleccionar...</option>
                <option value="PC">PC</option>
                <option value="Laptop">Laptop</option>
                <option value="Servidor">Servidor</option>
                <option value="All-in-One">All-in-One</option>
                <option value="Tablet">Tablet</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
                <option value="en_reparacion">En reparación</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
              <input
                type="text"
                value={formData.marca}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
              <input
                type="text"
                value={formData.modelo}
                onChange={(e) => setFormData({ ...formData, modelo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Serie</label>
              <input
                type="text"
                value={formData.serie}
                onChange={(e) => setFormData({ ...formData, serie: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
              <input
                type="text"
                value={formData.ubicacion}
                onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
            <textarea
              rows={2}
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function LicenciasTab({ empresaId, licencias, refresh }: { empresaId: string; licencias: any[]; refresh: () => void }) {
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [viewItem, setViewItem] = useState<any>(null)
  const [showClave, setShowClave] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Licencias ({licencias.length})</h2>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          + Agregar
        </button>
      </div>

      {licencias.length === 0 ? (
        <EmptyState message="No hay licencias registradas" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {licencias.map((lic) => (
            <div key={lic.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{lic.nombre}</p>
                  <p className="text-sm text-gray-500">{lic.tipo}</p>
                </div>
                {lic.fechaVenc && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    new Date(lic.fechaVenc) < new Date() ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {new Date(lic.fechaVenc) < new Date() ? 'Vencida' : 'Activa'}
                  </span>
                )}
              </div>
              {lic.fechaVenc && <p className="text-sm mt-2">Vence: {new Date(lic.fechaVenc).toLocaleDateString()}</p>}
              {lic.clave && (
                <div className="flex items-center gap-2 mt-2 bg-gray-100 px-2 py-1 rounded">
                  <code className="text-sm text-gray-800">{showClave === lic.id ? lic.clave : '••••••••••••'}</code>
                  <button 
                    onClick={() => setShowClave(showClave === lic.id ? null : lic.id)}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    {showClave === lic.id ? 'Ocultar' : 'Ver'}
                  </button>
                  <button 
                    onClick={() => copyToClipboard(lic.clave, lic.id)}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    {copiedId === lic.id ? '✓ Copiado' : '📋 Copiar'}
                  </button>
                </div>
              )}
              <div className="mt-2 flex gap-2">
                <button onClick={() => setViewItem(lic)} className="text-gray-600 hover:text-gray-800 text-sm">
                  📋 Detalle
                </button>
                <button onClick={() => { setEditItem(lic); setShowModal(true); }} className="text-blue-600 hover:text-blue-700 text-sm">
                  Editar
                </button>
                <button onClick={() => handleDelete('licencias', lic.id, refresh)} className="text-red-600 hover:text-red-700 text-sm">
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <FormModal 
          title={editItem ? 'Editar Licencia' : 'Nueva Licencia'} 
          endpoint="/api/licencias" 
          empresaId={empresaId} 
          editItem={editItem}
          fields={[
            { name: 'nombre', label: 'Nombre de la licencia', required: true },
            { name: 'tipo', label: 'Tipo (Office, Adobe, etc.)' },
            { name: 'clave', label: 'Clave/Serial' },
            { name: 'fechaInicio', label: 'Fecha de inicio', type: 'date' },
            { name: 'fechaVenc', label: 'Fecha de vencimiento', type: 'date' },
            { name: 'costo', label: 'Costo', type: 'number' },
            { name: 'notas', label: 'Notas', type: 'textarea' },
          ]} 
          onClose={() => { setShowModal(false); setEditItem(null); }} 
          onSuccess={() => { setShowModal(false); setEditItem(null); refresh(); }} 
        />
      )}

      {viewItem && (
        <DetalleModal 
          title="Detalle de la Licencia" 
          item={viewItem}
          fields={[
            { name: 'nombre', label: 'Nombre' },
            { name: 'tipo', label: 'Tipo' },
            { name: 'clave', label: 'Clave/Serial' },
            { name: 'fechaInicio', label: 'Fecha de inicio', isDate: true },
            { name: 'fechaVenc', label: 'Fecha de vencimiento', isDate: true },
            { name: 'costo', label: 'Costo' },
            { name: 'notas', label: 'Notas' },
          ]}
          onClose={() => setViewItem(null)} 
        />
      )}
    </div>
  )
}

function AccesosTab({ empresaId, accesos, refresh }: { empresaId: string; accesos: any[]; refresh: () => void }) {
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [showPassword, setShowPassword] = useState<string | null>(null)
  const [viewItem, setViewItem] = useState<any>(null)

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Accesos Web ({accesos.length})</h2>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          + Agregar
        </button>
      </div>

      {accesos.length === 0 ? (
        <EmptyState message="No hay accesos web registrados" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {accesos.map((acc) => (
            <div key={acc.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{acc.nombre}</p>
                  <a href={acc.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700">{acc.url}</a>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setViewItem(acc)} className="text-gray-600 hover:text-gray-800 text-sm">
                    📋
                  </button>
                  <button onClick={() => { setEditItem(acc); setShowModal(true); }} className="text-blue-600 hover:text-blue-700 text-sm">
                    Editar
                  </button>
                  <button onClick={() => handleDelete('accesos-web', acc.id, refresh)} className="text-red-600 hover:text-red-700 text-sm">
                    Eliminar
                  </button>
                </div>
              </div>
              {acc.usuario && <p className="text-sm mt-2">Usuario: {acc.usuario}</p>}
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-500">
                  Contraseña: {showPassword === acc.id ? (acc.password || 'No definida') : '••••••••'}
                </p>
                <button 
                  onClick={() => setShowPassword(showPassword === acc.id ? null : acc.id)}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  {showPassword === acc.id ? 'Ocultar' : 'Ver'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <FormModal 
          title={editItem ? 'Editar Acceso Web' : 'Nuevo Acceso Web'} 
          endpoint="/api/accesos-web" 
          empresaId={empresaId} 
          editItem={editItem}
          fields={[
            { name: 'nombre', label: 'Nombre', required: true },
            { name: 'url', label: 'URL', required: true },
            { name: 'usuario', label: 'Usuario' },
            { name: 'password', label: 'Contraseña', type: 'password', required: !editItem },
            { name: 'notas', label: 'Notas', type: 'textarea' },
          ]} 
          onClose={() => { setShowModal(false); setEditItem(null); }} 
          onSuccess={() => { setShowModal(false); setEditItem(null); refresh(); }} 
        />
      )}

      {viewItem && (
        <DetalleModal 
          title="Detalle del Acceso Web" 
          item={viewItem}
          fields={[
            { name: 'nombre', label: 'Nombre' },
            { name: 'url', label: 'URL' },
            { name: 'usuario', label: 'Usuario' },
            { name: 'password', label: 'Contraseña', isPassword: true },
            { name: 'notas', label: 'Notas' },
          ]}
          onClose={() => setViewItem(null)} 
        />
      )}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
      <p className="text-gray-500">{message}</p>
    </div>
  )
}

function DetalleModal({ title, item, fields, onClose }: {
  title: string
  item: any
  fields: { name: string; label: string; isPassword?: boolean; isDate?: boolean }[]
  onClose: () => void
}) {
  const formatValue = (value: any, field: any) => {
    if (!value) return '-'
    if (field.isDate) {
      return new Date(value).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
    }
    if (field.isPassword) return '••••••••'
    return value
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.name} className="border-b border-gray-100 pb-3">
                <p className="text-sm text-gray-500 mb-1">{field.label}</p>
                <p className="text-gray-900">{formatValue(item[field.name], field)}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
          <button onClick={onClose} className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

function FormModal({ title, endpoint, empresaId, editItem, fields, onClose, onSuccess }: {
  title: string
  endpoint: string
  empresaId: string
  editItem: any | null
  fields: { name: string; label: string; type?: string; required?: boolean; options?: string[] }[]
  onClose: () => void
  onSuccess: () => void
}) {
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editItem) {
      const initialData: Record<string, string> = {}
      fields.forEach(field => {
        if (field.name === 'fechaInicio' || field.name === 'fechaVenc') {
          initialData[field.name] = editItem[field.name] ? editItem[field.name].split('T')[0] : ''
        } else {
          initialData[field.name] = editItem[field.name] || ''
        }
      })
      setFormData(initialData)
    } else {
      setFormData({})
    }
  }, [editItem, fields])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const method = editItem ? 'PUT' : 'POST'
      const url = editItem ? `${endpoint}/${editItem.id}` : endpoint
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, empresaId }),
      })

      let data
      try {
        data = await res.json()
      } catch {
        throw new Error('Error del servidor')
      }
      
      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar')
      }
      onSuccess()
    } catch (err: any) {
      setError(err.message || 'Error al guardar')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label} {field.required && '*'}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  rows={3}
                />
              ) : field.type === 'select' ? (
                <select
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                >
                  <option value="">Seleccionar...</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || 'text'}
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

async function handleDelete(type: string, id: string, refresh: () => void) {
  if (!confirm('¿Estás seguro de eliminar?')) return
  try {
    const endpoint = type === 'correos' ? '/api/correos' :
                     type === 'servidores' ? '/api/servidores' :
                     type === 'equipos' ? '/api/equipos' :
                     type === 'licencias' ? '/api/licencias' :
                     type === 'accesos-web' ? '/api/accesos-web' :
                     type === 'dominios' ? '/api/dominios' :
                     '/api/empleados'
    await fetch(`${endpoint}/${id}`, { method: 'DELETE' })
    refresh()
  } catch (error) {
    console.error('Error:', error)
  }
}

function DominiosTab({ empresaId, dominios, refresh }: { empresaId: string; dominios: any[]; refresh: () => void }) {
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [viewItem, setViewItem] = useState<any>(null)
  const [showPassword, setShowPassword] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getDiasRestantes = (fechaVenc: string | null) => {
    if (!fechaVenc) return null
    const hoy = new Date()
    const venc = new Date(fechaVenc)
    const diff = Math.ceil((venc.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const getEstadoVencimiento = (fechaVenc: string | null) => {
    const dias = getDiasRestantes(fechaVenc)
    if (dias === null) return { color: 'gray', texto: 'Sin fecha' }
    if (dias < 0) return { color: 'red', texto: 'Vencido hace ' + Math.abs(dias) + ' días' }
    if (dias <= 30) return { color: 'orange', texto: 'Vence en ' + dias + ' días' }
    if (dias <= 60) return { color: 'yellow', texto: 'Vence en ' + dias + ' días' }
    return { color: 'green', texto: 'Válido (' + dias + ' días)' }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">Dominios Web ({dominios.length})</h2>
        <button onClick={() => { setEditItem(null); setShowModal(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
          + Agregar
        </button>
      </div>

      {dominios.length === 0 ? (
        <EmptyState message="No hay dominios registrados" />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {dominios.map((dom) => {
            const estado = getEstadoVencimiento(dom.fechaVenc)
            return (
              <div key={dom.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900">{dom.nombre}</p>
                    <a href={dom.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-700">{dom.url}</a>
                    {dom.proveedor && <p className="text-sm text-gray-500">Proveedor: {dom.proveedor}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setViewItem(dom)} className="text-gray-600 hover:text-gray-800 text-sm">📋 Detalle</button>
                    <button onClick={() => { setEditItem(dom); setShowModal(true); }} className="text-blue-600 hover:text-blue-700 text-sm">Editar</button>
                    <button onClick={() => handleDelete('dominios', dom.id, refresh)} className="text-red-600 hover:text-red-700 text-sm">Eliminar</button>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    estado.color === 'red' ? 'bg-red-100 text-red-700' :
                    estado.color === 'orange' ? 'bg-orange-100 text-orange-700' :
                    estado.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                    estado.color === 'green' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {estado.texto}
                  </span>
                  {dom.renovacion && (
                    <span className="text-xs text-gray-500">Renovación: {dom.renovacion}</span>
                  )}
                </div>
                {dom.fechaVenc && (
                  <p className="text-sm text-gray-500 mt-1">Vence: {new Date(dom.fechaVenc).toLocaleDateString('es-ES')}</p>
                )}
                {dom.usuario && (
                  <div className="flex items-center gap-2 mt-2 bg-gray-100 px-2 py-1 rounded">
                    <code className="text-sm">User: {dom.usuario}</code>
                    <button onClick={() => copyToClipboard(dom.usuario, dom.id + '-user')} className="text-xs text-blue-600 hover:text-blue-700">
                      {copiedId === dom.id + '-user' ? '✓' : '📋'}
                    </button>
                  </div>
                )}
                {dom.password && (
                  <div className="flex items-center gap-2 mt-2 bg-gray-100 px-2 py-1 rounded">
                    <code className="text-sm">Pass: {showPassword === dom.id ? dom.password : '••••••••'}</code>
                    <button onClick={() => setShowPassword(showPassword === dom.id ? null : dom.id)} className="text-xs text-blue-600 hover:text-blue-700">
                      {showPassword === dom.id ? 'Ocultar' : 'Ver'}
                    </button>
                    <button onClick={() => copyToClipboard(dom.password, dom.id + '-pass')} className="text-xs text-blue-600 hover:text-blue-700">
                      {copiedId === dom.id + '-pass' ? '✓' : '📋'}
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <FormModal 
          title={editItem ? 'Editar Dominio' : 'Nuevo Dominio'} 
          endpoint="/api/dominios" 
          empresaId={empresaId} 
          editItem={editItem}
          fields={[
            { name: 'nombre', label: 'Nombre del dominio', required: true },
            { name: 'url', label: 'URL (ej: https://ejemplo.com)', type: 'url', required: true },
            { name: 'fechaVenc', label: 'Fecha de vencimiento', type: 'date' },
            { name: 'renovacion', label: 'Periodicidad', type: 'select', options: ['anual', 'semestral', 'trimestral', 'mensual'] },
            { name: 'proveedor', label: 'Proveedor (GoDaddy, Namecheap, etc.)' },
            { name: 'usuario', label: 'Usuario del panel' },
            { name: 'password', label: 'Contraseña del panel', type: 'password', required: !editItem },
            { name: 'dns1', label: 'Nameserver 1' },
            { name: 'dns2', label: 'Nameserver 2' },
            { name: 'notas', label: 'Notas', type: 'textarea' },
          ]} 
          onClose={() => { setShowModal(false); setEditItem(null); }} 
          onSuccess={() => { setShowModal(false); setEditItem(null); refresh(); }} 
        />
      )}

      {viewItem && (
        <DetalleModal 
          title="Detalle del Dominio" 
          item={viewItem}
          fields={[
            { name: 'nombre', label: 'Nombre' },
            { name: 'url', label: 'URL' },
            { name: 'proveedor', label: 'Proveedor' },
            { name: 'fechaVenc', label: 'Fecha de vencimiento', isDate: true },
            { name: 'renovacion', label: 'Periodicidad de renovación' },
            { name: 'usuario', label: 'Usuario del panel' },
            { name: 'password', label: 'Contraseña', isPassword: true },
            { name: 'dns1', label: 'Nameserver 1' },
            { name: 'dns2', label: 'Nameserver 2' },
            { name: 'notas', label: 'Notas' },
          ]}
          onClose={() => setViewItem(null)} 
        />
      )}
    </div>
  )
}
