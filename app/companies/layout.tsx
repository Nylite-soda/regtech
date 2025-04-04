import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import SeoImage from "@/components/seoImage";

export const Head = () => (
  <>
    <SeoImage />
  </>
);

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
