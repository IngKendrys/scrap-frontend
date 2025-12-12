"use client"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { LogOut } from "@deemlol/next-icons";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/features/userSlice";
import { useRouter } from "next/navigation";
import api from "@/axios/utils";

export default function Profile() {
    const { user, token } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const router = useRouter();

    const LogOutHandler = () => {
      api.post('usuarios/logout/', {}, {
        headers: {
          Authorization: `Token ${token}`
        }
      })
        .then(() => {
          dispatch(logout());
          router.push("/login");
        })
        .catch((error) => {
          console.error('Error during logout:', error);
        });
    };

    return (
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{user?.nombre_negocio}</p>
                <p className="text-xs text-muted-foreground">{user?.is_superuser ? "Administrador" : "Negocio"}</p>
              </div>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="start" className="bg-background border border-border rounded-md shadow-md p-2">
            <DropdownMenu.Item className="text-red-600 items-center flex mt-2" onClick={LogOutHandler}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar sesión
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
}
