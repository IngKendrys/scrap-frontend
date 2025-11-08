"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/app/components/ui/select"
import BusinessForm from "@/app/home/users/components/form"
import TableUsers from "@/app/home/users/components/table"
import { useSelector } from "react-redux"
import api from "@/axios/utils"

export default function NegociosPage() {
  const [businesses, setBusinesses] = useState([])
  const [filteredBusinesses, setFilteredBusinesses] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState("create")
  const [selectedIds, setSelectedIds] = useState([])
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchBusinesses()
  }, [])

  useEffect(() => {
    let filtered = businesses

    if (searchQuery) {
      filtered = filtered.filter(
        (business) =>
          business.nombre_negocio.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business.correo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          business.telefono.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((business) => business.is_active === (statusFilter === "active" ? true : false))
    }

    setFilteredBusinesses(filtered)
  }, [businesses, searchQuery, statusFilter])

  const fetchBusinesses = async () => {
    try {
      const response = await api.get("usuarios/", { headers: { Authorization: `Token ${token}` } });
      setBusinesses(response.data.results);
    } catch (error) {
      console.error("Error fetching businesses:", error.response?.data || error.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`usuarios/estado/${id}/`, { is_active: newStatus }, { headers: { Authorization: `Token ${token}` } });

      setBusinesses((prev) =>
        prev.map((business) =>
          business.id === id ? { ...business, is_active: newStatus } : business
        )
      );
    } catch (error) {
      console.error("Error updating business status:", error.response?.data || error.message);
    }
  };

  const handleCreate = () => {
    setFormMode("create")
    setSelectedBusiness(null)
    setIsFormOpen(true)
  }

  const handleEdit = () => {
    if (selectedIds.length !== 1) {
      alert("Por favor, selecciona un solo negocio para editar")
      return
    }
    const business = businesses.find((b) => b.id === selectedIds[0])
    if (business) {
      setFormMode("edit")
      setSelectedBusiness(business)
      setIsFormOpen(true)
    }
  }

  const handleFormSuccess = () => {
    fetchBusinesses()
    setIsFormOpen(false)
    setSelectedIds([])
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredBusinesses.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredBusinesses.map((b) => b.id))
    }
  }

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Negocios</h1>
        <div className="flex gap-3">
          <Button onClick={handleCreate} className="bg-primary hover:bg-primary/90">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Crear
          </Button>
          <Button
            onClick={handleEdit}
            variant="outline"
            disabled={selectedIds.length !== 1}
            className="border-primary text-primary hover:bg-primary/10 bg-transparent"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Editar
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <Input
                placeholder="Buscar por nombre, dueño o email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <TableUsers
            filteredBusinesses={filteredBusinesses}
            selectedIds={selectedIds}
            toggleSelectAll={toggleSelectAll}
            toggleSelect={toggleSelect}
            handleStatusChange={handleStatusChange}
        />
      </div>

      <BusinessForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        business={selectedBusiness}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}
