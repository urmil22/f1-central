import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const RootLayout = () => {
    return (
        <>
            <Navbar />
            <main style={{ minHeight: "80vh", padding: "1rem" }}>
                <Outlet />
            </main>
            <Footer />
        </>
    );
};

export default RootLayout;
