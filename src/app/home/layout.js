"use client";
import Sidebar from "./components/sidebar";
import Header from "./components/header";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function HomeLayout({ children }) {
  const router = useRouter();
  const { token } = useSelector((state) => state.auth);
  const notifyError = (message) => toast.error(message);

  useEffect(() => {
    const localToken = cookieStore.get("token")?.value;
    if (!token && !localToken) {
      router.push("/login");
      notifyError("Por favor, inicie sesión para continuar.");
    }
  }, [token, router]);

  return (
     <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
