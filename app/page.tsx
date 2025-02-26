import Image from "next/image";
import Header from "./components/header";
import Footer from "./components/footer";
import FormularioIniciativas from "./components/form";



export default function Home() {
  return (
    <>
      <Header />
      {/* Contenedor de la imagen grande */}
      <div className="relative w-full h-[500px]">
        <Image
          src="/image.png" // Reemplaza con la ruta de tu imagen
          alt="Imagen grande"
          fill
          className="object-cover"
        />
      </div>
      <FormularioIniciativas />
      <Footer />
    </>
  );
}
