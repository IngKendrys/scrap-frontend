"use client"
import Profile from "./profile"

export default function Header() {
  return (
    <header className="h-16 w-full bg-white border-b border-gray-200 shadow-sm flex items-center justify-between px-8">
      <div className="flex items-center gap-6">
        <div>
          <p className="text-sm text-gray-500">
             Bienvenido a tu <span className="text-yellow-500">negocio</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Profile />
      </div>
    </header>
  )
}
