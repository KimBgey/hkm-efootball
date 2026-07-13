import type { Metadata } from "next";
import { Bangers, Chakra_Petch } from "next/font/google";
import "./globals.css";

const bangers = Bangers({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bangers",
  display: "swap",
});

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-chakra",
  display: "swap",
});

const siteUrl = "https://hkm-efootball-kings.vercel.app";
const title = "hkm eFootball Kings — Ici, on ne joue pas. On règne.";
const description =
  "Tournoi eFootball (PS3) à Calavi Parana le 08 Août 2026. Inscription 10.000 F CFA, jusqu'à 80.000 F CFA à gagner. Inscris-toi maintenant.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: "hkm eFootball Kings",
    images: [{ url: "/og-image.jpg", width: 1200, height: 1500 }],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: "/fav-noir.png", media: "(prefers-color-scheme: light)" },
      { url: "/fav.png", media: "(prefers-color-scheme: dark)" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${bangers.variable} ${chakraPetch.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
