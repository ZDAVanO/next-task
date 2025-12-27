import Header from "@/components/header";
export default function MainLayout({ children, modal }: { children: React.ReactNode; modal?: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      {modal}
    </>
  );
}