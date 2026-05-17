import { Navbar } from "@/views/navbar/Navbar";
import { FloatingQR } from "@/views/shared/FloatingQR";
import { QrSpotlightProvider } from "@/views/shared/useQrSpotlight";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QrSpotlightProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <FloatingQR />
      </div>
    </QrSpotlightProvider>
  );
}
