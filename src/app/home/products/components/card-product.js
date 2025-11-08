"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"

export function CardProduct({ product, onClick }) {
  const images = product.imagenes?.map((img) => img.imagen_url) || []
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handlePrevImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImage = (e) => {
    e.stopPropagation()
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const getConditionColor = (condition) => {
    switch (condition) {
      case "Nuevo":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "Usado":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  const getSoldColor = (vendido) => {
    return vendido
      ? "bg-gray-500/10 text-gray-500 border-gray-500/20"
      : "bg-green-500/10 text-green-500 border-green-500/20"
  }

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative h-64 bg-muted">
          <Image
            src={images[currentImageIndex] || ""}
            alt={product.nombre}
            fill
            unoptimized
            className="object-cover"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="font-semibold text-lg leading-tight line-clamp-2">
              {product.nombre}
            </h3>
            <div className="flex gap-2">
              <Badge variant="outline" className={getConditionColor(product.estado)}>
                {product.estado}
              </Badge>
              <Badge variant="outline" className={getSoldColor(product.vendido)}>
                {product.vendido ? "Vendido" : "Disponible"}
              </Badge>
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.descripcion}
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-primary">${product.precio}</p>
          <p className="text-xs text-muted-foreground">
            Stock: {product.cantidad} unidades
          </p>
        </div>
        <Badge variant="secondary">
          {product.categoria_nombre || "Sin categoría"}
        </Badge>
      </CardFooter>
    </Card>
  )
}
