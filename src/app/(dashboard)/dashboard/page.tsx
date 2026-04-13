'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface Stats {
  totalEmpresas: number
  totalEmpleados: number
  totalEquipos: number
  totalLicencias: number
  totalServidores: number
  totalCorreos: number
  totalAccesos: number
  totalDominios: number
}

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
    servidores: number
    correos: number
    accesosWeb: number
    dominios: number
  }
}

const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#84CC16']

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ 
    totalEmpresas: 0, 
    totalEmpleados: 0, 
    totalEquipos: 0, 
    totalLicencias: 0,
    totalServidores: 0,
    totalCorreos: 0,
    totalAccesos: 0,
    totalDominios: 0
  })
  const [empresas, setEmpresas] = useState<Empresa[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/empresas')
        const empresasData = await res.json()
        
        let totalEmpleados = 0
        let totalEquipos = 0
        let totalLicencias = 0
        let totalServidores = 0
        let totalCorreos = 0
        let totalAccesos = 0
        let totalDominios = 0

        empresasData.forEach((e: any) => {
          totalEmpleados += e._count.empleados
          totalEquipos += e._count.equipos
          totalLicencias += e._count.licencias
          totalServidores += e._count.servidores
          totalCorreos += e._count.correos
          totalAccesos += e._count.accesosWeb
          totalDominios += e._count.dominios
        })

        setStats({
          totalEmpresas: empresasData.length,
          totalEmpleados,
          totalEquipos,
          totalLicencias,
          totalServidores,
          totalCorreos,
          totalAccesos,
          totalDominios,
        })
        
        setEmpresas(empresasData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const chartData = empresas.map((e, index) => ({
    name: e.nombre.length > 15 ? e.nombre.substring(0, 15) + '...' : e.nombre,
    empleados: e._count.empleados,
    servidores: e._count.servidores,
    equipos: e._count.equipos,
    licencias: e._count.licencias,
    correos: e._count.correos,
    accesos: e._count.accesosWeb,
    dominios: e._count.dominios,
    color: COLORS[index % COLORS.length]
  }))

  const statsData = [
    { label: 'Empresas', value: stats.totalEmpresas, key: 'empresas' },
    { label: 'Empleados', value: stats.totalEmpleados, key: 'empleados' },
    { label: 'Servidores', value: stats.totalServidores, key: 'servidores' },
    { label: 'Equipos', value: stats.totalEquipos, key: 'equipos' },
    { label: 'Licencias', value: stats.totalLicencias, key: 'licencias' },
    { label: 'Correos', value: stats.totalCorreos, key: 'correos' },
    { label: 'Dominios', value: stats.totalDominios, key: 'dominios' },
    { label: 'Accesos', value: stats.totalAccesos, key: 'accesos' },
  ]

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">Resumen general del sistema</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {statsData.map((stat) => (
          <div key={stat.key} className="bg-white rounded-lg p-4 border border-gray-100">
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Distribución por Empresa</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
                <Tooltip 
                  contentStyle={{ fontSize: 12 }}
                  itemStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="empleados" stackId="a" fill="#3B82F6" name="Empleados" />
                <Bar dataKey="servidores" stackId="a" fill="#10B981" name="Servidores" />
                <Bar dataKey="equipos" stackId="a" fill="#8B5CF6" name="Equipos" />
                <Bar dataKey="licencias" stackId="a" fill="#F59E0B" name="Licencias" />
                <Bar dataKey="correos" stackId="a" fill="#EF4444" name="Correos" />
                <Bar dataKey="accesos" stackId="a" fill="#06B6D4" name="Accesos" />
                <Bar dataKey="dominios" stackId="a" fill="#84CC16" name="Dominios" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
            {[
              { color: '#3B82F6', label: 'Empleados' },
              { color: '#10B981', label: 'Servidores' },
              { color: '#8B5CF6', label: 'Equipos' },
              { color: '#F59E0B', label: 'Licencias' },
              { color: '#EF4444', label: 'Correos' },
              { color: '#06B6D4', label: 'Accesos' },
              { color: '#84CC16', label: 'Dominios' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Detalle por Empresa</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {empresas.map((empresa, index) => (
              <Link 
                key={empresa.id} 
                href={`/empresas/${empresa.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm font-medium text-gray-900">{empresa.nombre}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {empresa._count.empleados + empresa._count.servidores + empresa._count.equipos + empresa._count.licencias + empresa._count.correos + empresa._count.accesosWeb + empresa._count.dominios} items
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {empresas.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">No hay empresas registradas</p>
              <Link href="/empresas" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                Agregar empresa
              </Link>
            </div>
          )}
        </div>
      </div>

      {empresas.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900">Resumen por Empresa</h2>
            <Link href="/empresas" className="text-sm text-blue-600 hover:underline">
              Ver todas →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-xs font-medium text-gray-500">Empresa</th>
                  <th className="text-center py-2 text-xs font-medium text-gray-500">Emp</th>
                  <th className="text-center py-2 text-xs font-medium text-gray-500">Srv</th>
                  <th className="text-center py-2 text-xs font-medium text-gray-500">Eq</th>
                  <th className="text-center py-2 text-xs font-medium text-gray-500">Lic</th>
                  <th className="text-center py-2 text-xs font-medium text-gray-500">Corr</th>
                  <th className="text-center py-2 text-xs font-medium text-gray-500">Acc</th>
                  <th className="text-center py-2 text-xs font-medium text-gray-500">Dom</th>
                </tr>
              </thead>
              <tbody>
                {empresas.slice(0, 5).map((empresa, index) => (
                  <tr key={empresa.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <Link href={`/empresas/${empresa.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                          {empresa.nombre}
                        </Link>
                      </div>
                    </td>
                    <td className="text-center py-3 text-sm text-gray-600">{empresa._count.empleados}</td>
                    <td className="text-center py-3 text-sm text-gray-600">{empresa._count.servidores}</td>
                    <td className="text-center py-3 text-sm text-gray-600">{empresa._count.equipos}</td>
                    <td className="text-center py-3 text-sm text-gray-600">{empresa._count.licencias}</td>
                    <td className="text-center py-3 text-sm text-gray-600">{empresa._count.correos}</td>
                    <td className="text-center py-3 text-sm text-gray-600">{empresa._count.accesosWeb}</td>
                    <td className="text-center py-3 text-sm text-gray-600">{empresa._count.dominios}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
