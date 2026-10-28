import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function NotFound() {
  return (
    <>
      <Helmet><title>Página no encontrada | Pragmatis</title><meta name="robots" content="noindex" /></Helmet>
      <Header />
      <main className="grid min-h-screen place-items-center px-6 pt-20 text-center">
        <div>
          <p className="text-sm font-medium text-violet">404</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight">Esta página no existe</h1>
          <Link to="/" className="btn-dark mt-8">Volver al inicio</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
