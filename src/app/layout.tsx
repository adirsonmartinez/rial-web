import type { Metadata } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/views/navbar/Navbar";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["100", "400", "500", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Rial | La primera App de finanzas de Venezuela",
    template: "Rial | %s",
  },
  description: "Tu app de finanzas personales para Venezuela",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${sora.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500&family=Google+Sans+Text:wght@400;500&display=swap"
        />
      </head>
      <body className="min-h-full flex flex-col font-[family-name:var(--font-body)]">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
