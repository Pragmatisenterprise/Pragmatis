import { Helmet } from "react-helmet-async";
import { Benefits } from "@/components/Benefits";
import { Blog } from "@/components/Blog";
import { CoreFeatures } from "@/components/CoreFeatures";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Platform } from "@/components/Platform";
import { Projects } from "@/components/Projects";
import { Security } from "@/components/Security";
import { Testimonials } from "@/components/Testimonials";
import { site } from "@/config/site";

export default function Home() {
  return (
    <>
      <Helmet><title>{`${site.name} | ${site.tagline}`}</title></Helmet>
      <Header />
      <main>
        <Hero />
        <Benefits />
        <CoreFeatures />
        <Platform />
        <Security />
        <Projects />
        <Testimonials />
        <Blog />
      </main>
      <Footer />
    </>
  );
}
