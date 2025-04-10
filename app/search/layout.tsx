import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-[#fcf8f8]">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
