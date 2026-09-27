import "./globals.css";

export const metadata = {
  title: "Horological Vault — Watch Collection & Analyzer",
  description: "A premium digital vault for cataloging, filtering, and analyzing your personal watch collection. Explore movements, occasions, and discover new timepieces.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Ambient Background */}
        <div className="bg-grid"></div>
        <div className="bg-gradient-orbs"></div>
        
        {children}
      </body>
    </html>
  );
}
