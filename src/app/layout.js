import "./globals.css";
import AppShell from "../components/layout/AppShell";
import { Cinzel, Inter, JetBrains_Mono } from "next/font/google";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heritage",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
});

export const metadata = {
  title: "Horological Vault — Watch Collection & Analyzer",
  description: "A premium digital vault for cataloging, filtering, and analyzing your personal watch collection. Explore movements, occasions, and discover new timepieces.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        {/* Ambient Background */}
        <div className="bg-grid"></div>
        <div className="bg-gradient-orbs"></div>
        
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
