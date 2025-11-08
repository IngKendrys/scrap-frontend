"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { CardProduct } from "./components/card-product"
import { DetailProduct } from "./components/detail-product"
import { FormProduct } from "./components/form"
import api from "@/axios/utils"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import { useRouter } from "next/navigation"

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [conditionFilter, setConditionFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState("create")
  const { token } = useSelector((state) => state.auth)
  const router = useRouter();

  const productsPerPage = 9

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchTerm, categoryFilter, conditionFilter, statusFilter])

  const fetchProducts = async () => {
    try {
      const response = await api.get("productos/mis-productos/", { headers: { Authorization: `Token ${token}`} });
      setProducts(response.data.results)
    } catch (error) {
      console.error("Error al obtener productos:", error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await api.get("productos/categorias/", { headers: { Authorization: `Token ${token}`} })
      setCategories(response.data.results)
    } catch (error) {
      console.error("Error al obtener categorías:", error)
    }
  }

  const filterProducts = () => {
    let filtered = [...products]

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        (product) =>
          product.categoria_nombre === categoryFilter.toLowerCase()
      )
    }

    if (conditionFilter !== "all") {
      filtered = filtered.filter(
        (product) => product.estado.toLowerCase() === conditionFilter.toLowerCase()
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (product) =>  {
          console.log(product)
          const venta = product.vendido ? "Vendido" : "Disponible"
          return venta === statusFilter}

      )
    }

    setFilteredProducts(filtered)
    setCurrentPage(1)
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setIsDetailOpen(true)
  }

  const handleEditFromDetail = () => {
    setIsDetailOpen(false)
    setFormMode("edit")
    setIsFormOpen(true)
  }

  const handleCreateNew = () => {
    setSelectedProduct(null)
    setFormMode("create")
    setIsFormOpen(true)
  }


  const handleDeleteFromDetail = async () => {
    try {
      const response = await api.delete(
        `/productos/eliminar/${selectedProduct.id_producto}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      )

      if (response.status === 204 || response.status === 200) {
        toast.success("Producto eliminado correctamente ✅");
        router.refresh();
      } 
    } catch (error) {
      console.error("Error al eliminar el producto:", error)
      const msg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Error al intentar eliminar el producto ❌"
      toast.error(msg)
    }
  }

  console.log(products)
  const handleFormSuccess = () => {
    setIsFormOpen(false)
    fetchProducts()
  }

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Productos</h1>
        <Button onClick={handleCreateNew} className="bg-primary hover:bg-primary/90">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Crear Producto
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id_categoria} value={cat.nombre}>
                {cat.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={conditionFilter} onValueChange={setConditionFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Condición" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las condiciones</SelectItem>
            <SelectItem value="Nuevo">Nuevo</SelectItem>
            <SelectItem value="Usado">Usado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Venta" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados de venta</SelectItem>
            <SelectItem value="Vendido">Vendido</SelectItem>
            <SelectItem value="Disponible">Disponible</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {currentProducts?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentProducts?.map((product) => (
            <CardProduct
              key={product.id_producto}
              product={product}
              onClick={() => handleProductClick(product)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron productos</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? "bg-primary hover:bg-primary/90" : ""}
              >
                {page}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}

      <DetailProduct
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        product={selectedProduct}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteFromDetail}
      />

      <FormProduct
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        mode={formMode}
        product={selectedProduct}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}
