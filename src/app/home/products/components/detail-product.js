"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/app/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog"
import { Badge } from "@/app/components/ui/badge"

export function DetailProduct({ open, onOpenChange, product, onEdit, onDelete }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  if (!product) return null

  const getConditionColor = (condition) => {
    switch (condition) {
      case "Nuevo":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "Usado":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
    }
  }

  console.log(product)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.nombre}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="relative h-96 bg-muted rounded-lg overflow-hidden">
              <Image
                src={product.imagenes[currentImageIndex].imagen_url|| ""}
                alt={product.nombre}
                unoptimized
                fill
                className="object-cover"
              />

              {product.imagenes.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? product.imagenes.length - 1 : prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev === product.imagenes.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {product.imagenes.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product?.imagenes?.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-20 h-20 shrink-0 rounded-md overflow-hidden border-2 transition-colors ${
                      index === currentImageIndex ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={image?.imagen_url}
                      alt={`${product.nombre} ${index + 1}`}
                      unoptimized
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getConditionColor(product.condition)}>
                {product.condition}
              </Badge>
              <Badge variant="secondary">{product.category}</Badge>
            </div>

            <div>
              <p className="text-3xl font-bold text-primary">${product.precio}</p>
              <p className="text-sm text-muted-foreground mt-1">Stock disponible: {product.cantidad} unidades</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Descripción</h3>
              <p className="text-muted-foreground leading-relaxed">{product.descripcion}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-muted-foreground">ID del Producto</p>
                <p className="font-medium">{product.id_producto}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Vendido</p>
                <p className="font-medium">{product.vendido ? "Sí" : "No"}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button onClick={onDelete} className="bg-chart-3 hover:bg-primary/90 mr-4">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Eliminar Producto
            </Button>
            <Button onClick={onEdit} className="bg-primary hover:bg-primary/90">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Editar Producto
            </Button>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
