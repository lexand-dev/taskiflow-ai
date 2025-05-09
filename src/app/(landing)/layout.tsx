import { Footer } from "./components/footer";
import { Navbar } from "./components/navbar";

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <Navbar />
      <main className="pt-40 pb-20 h-screen gradient-bg">{children} </main>
      <Footer />
    </div>
  );
};

export default MarketingLayout;
