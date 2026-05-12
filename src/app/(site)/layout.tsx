import { Navbar } from "@/views/navbar/Navbar";
import { FloatingQR } from "@/views/shared/FloatingQR";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <FloatingQR />
    </div>
  );
}
