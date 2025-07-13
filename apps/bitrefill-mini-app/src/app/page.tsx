import HeroSection from './components/HeroSection';
import ActionButtons from './components/ActionButtons';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-800 px-4 py-12">
      <HeroSection />
      <ActionButtons />
      <HowItWorks />
      <Footer />
    </main>
  );
}
