"use client";

import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/features/userSlice";
import { useRouter } from "next/navigation";
import api from "@/axios/utils";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const notifyError = (message) => toast.error(message);
  const notifySuccess = (message) => toast.success(message);

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post("usuarios/login/", { correo, password })
      .then((response) => {
        dispatch(setUser(response.data));
        router.push("/home");
        notifySuccess(response.data.message);
      })
      .catch((error) => {
        notifyError(error.message || "Error al iniciar sesión.");
      });
  }

  return (
    <form className="w-full max-w-sm" onSubmit={handleSubmit}>
      <label>Correo</label>
      <Input className="mt-1 mb-3" type="email" placeholder="scrap@gmail.com" value={correo} onChange={(e) => setCorreo(e.target.value)} />
      <label>Contraseña</label>
      <Input className="mt-1" type="password" placeholder="*********" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button type="submit" text="Iniciar sesión" color="primary" className="font-bold mt-4">
        Iniciar sesión
      </Button>
    </form>
  );
}
