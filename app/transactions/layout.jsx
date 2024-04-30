import Header from "@/components/header";
import Footer from "@/components/footer";

export default function TransactionsLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
