import Header from "@/components/header";
import StatusBar from "@/components/StatusBar";
export default function MainLayout({ children, modal }: { children: React.ReactNode; modal?: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      {modal}
      {/* <StatusBar /> */}
    </>
  );
}