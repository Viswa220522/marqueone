import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marque One | Automotive Excellence",
  description: "Experience the ultimate luxury automotive ecosystem.",
  icons: {
    icon: "/hero_images/marqueone_weblogo.png",
    shortcut: "/hero_images/marqueone_weblogo.png",
    apple: "/hero_images/marqueone_weblogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className={`${inter.className} min-h-full bg-black text-white`}>
        {children}
      </body>
    </html>
  );
}
