"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { User, ShoppingBag } from "@deemlol/next-icons";
import { useSelector} from "react-redux";
import { useRouter } from "next/navigation";

const menuItemsAdmin = [
  {
    name: "Negocios",
    icon: <User className="w-5 h-5" />,
    href: "/home/users",
  },
]

const menuItemsUser = [
    {
        name: "Productos",
        icon: <ShoppingBag className="w-5 h-5" />,
        href: "/home/products",
    }
]

export default function Sidebar() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const menuItems = user?.is_superuser === true ? menuItemsAdmin : menuItemsUser;
  const [activeItem, setActiveItem] = useState(menuItems[0].href);
  const [isCollapsed, setIsCollapsed] = useState(false);    
  useEffect(()=>{
    router.push(activeItem)
  },[])

  return (
    <aside
      className={`bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      } flex flex-col`}
    >
      <div className="h-16 flex items-center justify-center border-b border-sidebar-border px-4">
        {!isCollapsed ? (
          <div className="flex items-center gap-3">
            <Image src="/logo_scrap.png" alt="Scrap Software" width={40} height={40} />
            <span className="font-bold text-lg text-sidebar-foreground">Scrap</span>
          </div>
        ) : (
          <Image src="/logo_scrap.png" alt="Scrap Software" width={32} height={32} />
        )}
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeItem === item.href
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              } ${isCollapsed ? "justify-center" : ""}`}
              title={isCollapsed ? item.name : undefined}
            >
              {item.icon}
              {!isCollapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
        >
          <svg
            className={`w-5 h-5 transition-transform ${isCollapsed ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          {!isCollapsed && <span className="text-sm font-medium"></span>}
        </button>
      </div>
    </aside>
  )
}
