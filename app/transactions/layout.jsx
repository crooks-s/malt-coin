import Header from "@/components/header";
import Footer from "@/components/footer";

export default function SettingsLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
