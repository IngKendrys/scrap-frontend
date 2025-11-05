import "./globals.css";
import ReduxProvider from "../redux/provider";
import { Nunito } from "next/font/google";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata = {
  title: "Scrap Software",
  description: "Gestiona tu chatarreria con eficiencia",
  icons:{
    icon: "/icon.png",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={nunito.className}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
