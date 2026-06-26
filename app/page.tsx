import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Process } from "@/components/sections/Process";
import { Work } from "@/components/sections/Work";
import { Clients } from "@/components/sections/Clients";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <Work />
        <Process />
        <Clients />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
