'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Empresa {
  id: string
  nombre: string
  rut: string | null
  telefono: string | null
  emailContacto: string | null
  _count: {
    empleados: number
    equipos: number
    licencias: number
    correos: number
    servidores: number
    accesosWeb: number
    dominios: number
  }
}

export default function EmpresasPage() {
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<Empresa | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchEmpresas()
  }, [])

  async function fetchEmpresas() {
    try {
      const res = await fetch('/api/empresas')
      const data = await res.json()
      if (Array.isArray(data)) {
        setEmpresas(data)
      } else {
        console.error('Error fetching empresas:', data)
        setEmpresas([])
      }
    } catch (error) {
      console.error('Error:', error)
      setEmpresas([])
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar esta empresa?')) return
    
    try {
      await fetch(`/api/empresas/${id}`, { method: 'DELETE' })
      setEmpresas(empresas.filter(e => e.id !== id))
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const filteredEmpresas = empresas.filter(e =>
    e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.rut && e.rut.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Empresas</h1>
          <p className="text-gray-500 mt-1">Gestiona tus clientes y su información</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <span>+</span> Nueva Empresa
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar empresa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredEmpresas.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <span className="text-6xl mb-4 block">🏢</span>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No se encontraron empresas' : 'No hay empresas registradas'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? 'Intenta con otro término de búsqueda' : 'Comienza agregando tu primera empresa'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Agregar Empresa
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmpresas.map((empresa) => (
            <div key={empresa.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{empresa.nombre}</h3>
                    {empresa.rut && <p className="text-sm text-gray-500">RUT: {empresa.rut}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setEditItem(empresa); setShowModal(true); }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <Link
                      href={`/empresas/${empresa.id}`}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="Ver detalles"
                    >
                      👁️
                    </Link>
                    <button
                      onClick={() => handleDelete(empresa.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                {empresa.emailContacto && (
                  <p className="text-sm text-gray-600 mb-2">📧 {empresa.emailContacto}</p>
                )}
                {empresa.telefono && (
                  <p className="text-sm text-gray-600 mb-4">📞 {empresa.telefono}</p>
                )}

                <div className="grid grid-cols-4 gap-2 pt-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">{empresa._count.empleados}</p>
                    <p className="text-xs text-gray-500">Empleados</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">{empresa._count.equipos}</p>
                    <p className="text-xs text-gray-500">Equipos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">{empresa._count.servidores}</p>
                    <p className="text-xs text-gray-500">Servidores</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-gray-900">{empresa._count.dominios}</p>
                    <p className="text-xs text-gray-500">Dominios</p>
                  </div>
                </div>
              </div>

              <Link
                href={`/empresas/${empresa.id}`}
                className="block px-6 py-3 bg-gray-50 text-center text-sm font-medium text-blue-600 hover:bg-gray-100 transition"
              >
                Ver más detalles →
              </Link>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ModalEmpresa
          editItem={editItem}
          onClose={() => { setShowModal(false); setEditItem(null); }}
          onSuccess={() => {
            setShowModal(false)
            setEditItem(null)
            fetchEmpresas()
          }}
        />
      )}
    </div>
  )
}

function ModalEmpresa({ editItem, onClose, onSuccess }: { editItem: Empresa | null; onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    nombre: editItem?.nombre || '',
    rut: editItem?.rut || '',
    direccion: '',
    telefono: editItem?.telefono || '',
    emailContacto: editItem?.emailContacto || '',
    notas: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const url = editItem ? `/api/empresas/${editItem.id}` : '/api/empresas'
      const method = editItem ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error(editItem ? 'Error al actualizar empresa' : 'Error al crear empresa')
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar la empresa')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{editItem ? 'Editar Empresa' : 'Nueva Empresa'}</h2>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RUT</label>
            <input
              type="text"
              value={formData.rut}
              onChange={(e) => setFormData({ ...formData, rut: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <input
              type="text"
              value={formData.direccion}
              onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <input
              type="text"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email de contacto</label>
            <input
              type="email"
              value={formData.emailContacto}
              onChange={(e) => setFormData({ ...formData, emailContacto: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
            <textarea
              rows={3}
              value={formData.notas}
              onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
