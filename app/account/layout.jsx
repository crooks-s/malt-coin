import Header from "@/components/header";
import Footer from "@/components/footer";

export default function AccountLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
