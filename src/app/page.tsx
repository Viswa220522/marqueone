import Hero from '@/components/Hero';
import GarageSection from '@/components/GarageSection';
import MotorClubSection from '@/components/MotorClubSection';
import LifestyleSection from '@/components/LifestyleSection';
import ContactSection from '@/components/ContactSection';
import ScrollToTop from '@/components/ScrollToTop';
import Footer from '@/components/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import Navbar from '@/components/Navbar';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <SmoothScroll />
      <Navbar />
      <Hero />
      <GarageSection />
      <MotorClubSection />
      <LifestyleSection />
      <ContactSection />
      <Footer />
      <ScrollToTop />
    </main>
  );
}
