// src/components/Navbar.tsx
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/drivers", label: "Drivers" },
    { to: "/constructors", label: "Constructors" },
    { to: "/calendar", label: "Calendar" },
    { to: "/standings", label: "Standings" },
    { to: "/circuits", label: "Circuits" },
  ];

  return (
    <nav className="navbar">
      <div className="logo">
        🏁 <NavLink to="/">F1 Central</NavLink>
      </div>

      <ul className="nav-links desktop-only">
        {links.map(link => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {isOpen && (
          <motion.ul
            className="nav-links mobile-menu"
            initial={{ y: -200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -200, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {links.map(link => (
              <li key={link.to} onClick={() => setIsOpen(false)}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) => (isActive ? "active" : "")}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
