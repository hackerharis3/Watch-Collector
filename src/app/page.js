import HeroSection from "../components/HeroSection";

export const metadata = {
  title: "Dashboard — Horological Vault",
  description: "Your digital watch vault dashboard.",
};

export default function Home() {
  return (
    <>
      <main>
        <HeroSection />
        {/* Additional dashboard components will go here */}
      </main>
    </>
  );
}
