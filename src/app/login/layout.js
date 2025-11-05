import Image from "next/image";
export default function LoginLayout({ children }) {
  return (
    <div className="flex">
      <section className="w-3/4 h-screen flex-1 items-center justify-center ">
        <div className="mb-8 flex flex-col items-center">
          <Image
            src="/logo_scrap.png"
            alt="Scrap Software"
            width={200}
            height={200}
          />
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bienvenido
          </h1>
          <p className="text-muted-foreground text-center">
            Ingresa tus credenciales para acceder a tu negocio
          </p>
        </div>
        <div className="flex items-center justify-center">{children}</div>
      </section>
      <section className="bg-primary lg:w-2/4 h-screen flex items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute w-96 h-96 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon
                points="50 1 95 25 95 75 50 99 5 75 5 25"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
              />
            </svg>
          </div>
          <div className="absolute w-72 h-72 opacity-20">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon
                points="50 1 95 25 95 75 50 99 5 75 5 25"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </svg>
          </div>
          <div className="absolute w-48 h-48 opacity-30">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <polygon
                points="50 1 95 25 95 75 50 99 5 75 5 25"
                fill="none"
                stroke="white"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>
        <div className="absolute bottom-10  text-white">
          <h2 className="text-xl font-bold text-balance">
            Gestiona tu chatarreria con eficiencia
          </h2>
          <p className="text-lg opacity-90 text-pretty">
            Scrap Software te ayuda a optimizar tu flujo de trabajo.
          </p>
        </div>
      </section>
    </div>
  );
}
