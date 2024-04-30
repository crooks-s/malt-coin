import Header from "@/components/header";
import Footer from "@/components/footer";

export default function LoginLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
