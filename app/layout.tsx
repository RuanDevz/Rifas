import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RifasProvider } from "@/context/RifasContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rifas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <RifasProvider>
        <body className={inter.className}>{children}</body>
      </RifasProvider>
    </html>
  );
}
