import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";
import { VisitorTracker } from "@/src/components/VisitorTracker";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <VisitorTracker />
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
