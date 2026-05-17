import { FloatingQR } from "@/views/shared/FloatingQR";
import { QrSpotlightProvider } from "@/views/shared/useQrSpotlight";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QrSpotlightProvider>
      <div className="min-h-screen">{children}</div>
      <FloatingQR />
    </QrSpotlightProvider>
  );
}
