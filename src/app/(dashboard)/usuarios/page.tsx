'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface Usuario {
  id: string
  email: string
  name: string | null
  createdAt: string
}

export default function UsuariosPage() {
  const { data: session } = useSession()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editItem, setEditItem] = useState<Usuario | null>(null)

  useEffect(() => {
    fetchUsuarios()
  }, [])

  async function fetchUsuarios() {
    try {
      const res = await fetch('/api/usuarios')
      const data = await res.json()
      if (Array.isArray(data)) {
        setUsuarios(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return
    
    try {
      await fetch(`/api/usuarios?id=${id}`, { method: 'DELETE' })
      setUsuarios(usuarios.filter(u => u.id !== id))
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const isCurrentUser = (email: string) => session?.user?.email === email

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-500 mt-1">Administra todos los usuarios del sistema</p>
        </div>
        <button
          onClick={() => { setEditItem(null); setShowModal(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <span>+</span> Nuevo Usuario
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Usuario</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Email</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Fecha de registro</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {usuarios.map((usuario) => (
              <tr key={usuario.id} className={isCurrentUser(usuario.email) ? 'bg-blue-50' : ''}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {usuario.name?.[0] || usuario.email[0].toUpperCase()}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900">{usuario.name || '-'}</span>
                      {isCurrentUser(usuario.email) && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Tú</span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{usuario.email}</td>
                <td className="px-6 py-4 text-gray-600">
                  {new Date(usuario.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => { setEditItem(usuario); setShowModal(true); }}
                    className="text-blue-600 hover:text-blue-700 text-sm mr-4"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(usuario.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <ModalUsuario
          editItem={editItem}
          onClose={() => { setShowModal(false); setEditItem(null); }}
          onSuccess={() => {
            setShowModal(false)
            setEditItem(null)
            fetchUsuarios()
          }}
        />
      )}
    </div>
  )
}

function ModalUsuario({ editItem, onClose, onSuccess }: { editItem: Usuario | null; onClose: () => void; onSuccess: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name || '',
        email: editItem.email,
        password: '',
      })
    } else {
      setFormData({ name: '', email: '', password: '' })
    }
  }, [editItem])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (editItem) {
        const res = await fetch('/api/usuarios', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editItem.id,
            name: formData.name,
            ...(formData.password ? { password: formData.password } : {})
          }),
        })
        if (!res.ok) throw new Error('Error al actualizar usuario')
      } else {
        const res = await fetch('/api/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Error al crear usuario')
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
      <div className="bg-white rounded-2xl w-full max-w-md">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {editItem ? 'Editar Usuario' : 'Nuevo Usuario'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              required
              disabled={!!editItem}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña {editItem ? '(dejar vacío para no cambiar)' : '*'}
            </label>
            <input
              type="password"
              required={!editItem}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
