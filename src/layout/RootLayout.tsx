import { Outlet } from "react-router";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const RootLayout = () => {
  return (
    <div className="root-layout">
      <div className="background-layers" aria-hidden="true">
        <div className="background-gradient" />
        <div className="background-glow background-glow--left" />
        <div className="background-glow background-glow--right" />
        <div className="background-pattern" />
      </div>

      <div className="layout-shell">
        <header className="layout-header">
          <Navbar />
        </header>

        <main className="layout-main">
          <div className="layout-main__inner">
            <Outlet />
          </div>
        </main>

        <footer className="layout-footer">
          <Footer />
        </footer>
      </div>
    </div>
  );
};

export default RootLayout;
