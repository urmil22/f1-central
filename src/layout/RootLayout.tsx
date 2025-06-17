import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer/Footer";

const RootLayout = () => {
    return (
        <div className="root-layout">
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
};

export default RootLayout;
