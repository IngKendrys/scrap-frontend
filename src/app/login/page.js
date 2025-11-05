"use client";
import Input from "../components/input";
import Button from "../components/button";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/features/userSlice";
import { useRouter } from "next/navigation";



export default function LoginPage() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://127.0.0.1:8000/api/usuarios/login/", { correo, password })
      .then((response) => {
        console.log("Login successful:", response.data);
        dispatch(setUser(response.data));
        router.push("/home");
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  }

  return (
    <form className="w-full max-w-sm" onSubmit={handleSubmit}>
      <label>Correo</label>
      <Input type="email" placeholder="scrap@gmail.com" value={correo} onChange={(e) => setCorreo(e.target.value)} />
      <label>Contraseña</label>
      <Input type="password" placeholder="*********" value={password} onChange={(e) => setPassword(e.target.value)} />
      <Button type="submit" text="Iniciar sesión" color="primary" />
    </form>
  );
}
