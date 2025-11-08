import { useState, useEffect } from "react"
import { Button } from "@/app/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription, 
  DialogFooter,
} from "@/app/components/ui/dialog"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import api from "@/axios/utils"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"

export default function BusinessForm({ open, onOpenChange, mode, business, onSuccess }) {
  const [formData, setFormData] = useState({
    nombre_negocio: "",
    correo: "",
    telefono: "",
    direccion: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const notifyError = (message) => toast.error(message);
  const notifySuccess = (message) => toast.success(message);


  useEffect(() => {
    if (mode === "edit" && business) {
      setFormData({
        nombre_negocio: business.nombre_negocio,
        correo: business.correo,
        telefono: business.telefono,
        direccion: business.direccion,
        password: business.password,
      })
    } else {
      setFormData({
        nombre_negocio: "",
        correo: "",
        telefono: "",
        direccion: "",
        password: "",
      })
    }
  }, [mode, business, open])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const endpoint = mode === "create" ? "usuarios/registro/" : `usuarios/actualizar/${business?.id}/`;
      const method = mode === "create" ? "post" : "put";

      const response = await api[method](endpoint, formData, { headers: { Authorization: `Token ${token}` } });

      if (response.status >= 200 && response.status < 300) {
        onSuccess();
        notifySuccess(mode === "create" ? "Negocio creado exitosamente." : "Negocio actualizado exitosamente.");
      }
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
      notifyError(error.response?.data?.message || "Error al procesar la solicitud.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Crear Nuevo Negocio" : "Editar Negocio"}</DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Completa los datos para crear un nuevo negocio."
              : "Modifica los datos del negocio seleccionado."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre_negocio">Nombre del Negocio</Label>
              <Input
                id="nombre_negocio"
                value={formData.nombre_negocio}
                onChange={(e) => setFormData({ ...formData, nombre_negocio: e.target.value })}
                placeholder="Ej: Restaurante El Buen Sabor"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="correo">Correo</Label>
              <Input
                id="correo"
                value={formData.correo}
                onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                placeholder="Ej: Juan Pérez"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                type="tel"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="Ej: 314 619 1234"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                placeholder="Ej: Calle 123"
                required
              />
            </div>
            {mode === "create" && (
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Ej: ********"
                required
              />
            </div>)}
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
