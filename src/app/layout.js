import "./globals.css";
import { Nunito } from "next/font/google";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata = {
  title: "Scrap Software",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={nunito.className}>
        {children}
      </body>
    </html>
  );
}
