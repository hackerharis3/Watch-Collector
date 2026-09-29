import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import GallerySection from "../components/GallerySection";
import OccasionsSection from "../components/OccasionsSection";
import AnalyzerSection from "../components/AnalyzerSection";

import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      
      <main>
        <HeroSection />
        
        <GallerySection />
        
        <OccasionsSection />
        
        <AnalyzerSection />
        

      </main>

      <Footer />
    </>
  );
}
