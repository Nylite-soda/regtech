import { BackButton } from "@/components/ui/back-button";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <BackButton className="absolute top-6 left-8" />
      {children}
    </>
  );
}
