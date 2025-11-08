"use client"

import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog"
import { Switch } from "@/app/components/ui/switch"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { toast } from "react-toastify"
import Image from "next/image"
import { useSelector } from "react-redux";
import api from "@/axios/utils"
import axios from "axios"


export function FormProduct({ open, onOpenChange, mode, product, onSuccess }) {
  const { token } = useSelector((state) => state.auth);

  const categorias = [
    { id: 1, nombre: "Chatarra" },
    { id: 2, nombre: "Partes" },
    { id: 3, nombre: "Electrónicos" },
    { id: 4, nombre: "Plásticos" },
  ];

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    estado: "",
    id_categoria: "",
    cantidad: "",
    imagenes: [],
    vendido: false
  })

  const [previewImages, setPreviewImages] = useState([]) 
  const [newImages, setNewImages] = useState([]) 
  const [isSubmitting, setIsSubmitting] = useState(false)
  const notifyError = (message) => toast.error(message)
  const notifySuccess = (message) => toast.success(message)

  useEffect(() => {
    if (mode === "edit" && product) {
      setFormData({
        nombre: product.nombre,
        descripcion: product.descripcion,
        precio: product.precio,
        estado: product.estado,
        id_categoria: product.categoria_nombre,
        cantidad: product.cantidad,
        imagenes: product.imagenes || [],
        vendido: product.vendido || false,
      })
      setPreviewImages(product.imagenes || [])
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        estado: "",
        id_categoria: "",
        cantidad: "",
        imagenes: [],
      })
      setPreviewImages([])
    }
  }, [mode, product, open])

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    setNewImages((prev) => [
      ...prev,
      ...files.filter(
        (file) => !prev.some((f) => f.name === file.name && f.size === file.size)
      ),
    ]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...previews]);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url =
        mode === "create"
          ? "productos/crear/"
          : `productos/editar/${product?.id_producto}/`;

      const method = mode === "create" ? "post" : "put";

      const response = await api[method](url, {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: formData.precio,
        estado: formData.estado,
        id_categoria: categoriaSeleccionada.id,
        cantidad: Number.parseInt(formData.cantidad),
        vendido: formData.vendido,
      }, {headers: {
          Authorization: `Token ${token}`
        }});

      if (newImages.length > 0) {
        await Promise.all(
          newImages.map(async (file) => {
            const formDataImg = new FormData();
            formDataImg.append("imagen_url", file);
            formDataImg.append("id_producto", Number(response.data.id_producto));

            await axios.post("http://127.0.0.1:8000/api/productos/imagenes/crear/", formDataImg, {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Token ${token}`,
              },
            });
          })
        );
      }

      notifySuccess("Producto guardado correctamente.");
      onSuccess();
      onOpenChange(false);
      
    } catch (error) {
      console.error("Error:", error);
      const msg =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        "Error al guardar el producto.";
      notifyError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

    const categoriaSeleccionada = categorias.find(
      (c) => c.id === formData.id_categoria || c.nombre === formData.id_categoria
    );
    console.log(previewImages)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Crear Nuevo Producto" : "Editar Producto"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Completa los datos para crear un nuevo producto."
              : "Modifica los datos del producto seleccionado."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del Producto</Label>
              <Input
                id="name"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Motor"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Describe el producto..."
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.precio}
                  onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                  placeholder="100.000"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.cantidad}
                  onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                  placeholder="0"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={String(categoriaSeleccionada?.id || "")}
                  onValueChange={(value) => {
                    const categoria = categorias.find((c) => c.id === Number(value));
                    setFormData({
                      ...formData,
                      id_categoria: categoria?.id || "", 
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value) => setFormData({ ...formData, estado: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la condición" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nuevo">Nuevo</SelectItem>
                    <SelectItem value="Usado">Usado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {mode === "edit" && (
              <div className="flex items-center justify-between border rounded-lg p-3">
                <Label htmlFor="vendido" className="text-sm">¿Producto vendido?</Label>
                <Switch
                  id="vendido"
                  checked={formData.vendido}
                  onCheckedChange={(value) => setFormData({ ...formData, vendido: value })}
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="images">Imágenes del Producto</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              {previewImages.length > 0 && (
                <div className="flex gap-2 mt-2 overflow-x-auto">
                  {previewImages.map((src, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-md overflow-hidden border">
                      <Image
                        src={src.imagen_url || src }
                        alt={`preview-${idx}`}
                        unoptimized
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary/90">
              {isSubmitting ? "Guardando..." : mode === "create" ? "Crear" : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
