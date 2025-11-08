"use client"

import { useState } from "react"
import { Switch } from "@/app/components/ui/switch"
import {toast} from "react-toastify"

export function ButtonSwitch(props) {
  const [isEnabled, setIsEnabled] = useState(props.initialStatus)
  const [isLoading, setIsLoading] = useState(false)
  const notifyError = (message) => toast.error(message);
  const notifySuccess = (message) => toast.success(message);

  const handleToggle = async (checked) => {
    setIsLoading(true)
    try {
      await props.onStatusChange(props.businessId, checked)
      setIsEnabled(checked)
      notifySuccess(`Estado de la cuenta del negocio ${checked ? "activado" : "desactivado"} exitosamente.`)
    } catch (error) {
      console.error("Error toggling business status:", error)
      notifyError("Error al cambiar el estado de la cuenta del negocio.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center">
      <Switch checked={isEnabled} onCheckedChange={handleToggle} disabled={isLoading} />
    </div>
  )
}
