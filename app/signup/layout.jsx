import Header from "@/components/header";
import Footer from "@/components/footer";

export default function SignUpLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
