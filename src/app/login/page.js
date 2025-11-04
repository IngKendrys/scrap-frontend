import Input from "../components/input";
import Button from "../components/button";
export default function LoginPage() {
  return (
    <form className="w-full max-w-sm">
      <label>Correo</label>
      <Input type="email" placeholder="scrap@gmail.com" />
      <label>Contraseña</label>
      <Input type="password" placeholder="*********" />
      <Button type="submit" text="Iniciar sesión" color="primary" />
    </form>
  );
}
