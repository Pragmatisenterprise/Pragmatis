import { Helmet } from "react-helmet-async";
import { About } from "@/components/About";
import { Blog } from "@/components/Blog";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Process } from "@/components/Process";
import { Projects } from "@/components/Projects";
import { Services } from "@/components/Services";
import { Templates } from "@/components/Templates";
import { Testimonials } from "@/components/Testimonials";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { site } from "@/config/site";

export default function Home() {
  return (
    <>
      <Helmet><title>{`${site.name} | ${site.tagline}`}</title></Helmet>
      <Header />
      <main>
        <Hero />
        <Services />
        <Process />
        <Templates />
        <Projects />
        <Testimonials />
        <About />
        <Blog />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
