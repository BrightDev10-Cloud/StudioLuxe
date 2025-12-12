import Hero from "@/components/Hero/Hero";
import ServicesCloud from "@/components/Services/ServicesCloud";
import Manifesto from "@/components/Manifesto/Manifesto";
import SelectedWork from "@/components/SelectedWork/SelectedWork";
import OurValues from "@/components/Values/OurValues";
import Team from "@/components/Team/Team";
import Footer from "@/components/Footer/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <ServicesCloud />
      <Manifesto />
      <SelectedWork />
      <OurValues />
      <Team />
      <Footer />
    </main>
  );
}
