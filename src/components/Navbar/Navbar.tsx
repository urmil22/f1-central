import { NavLink } from "react-router";
import "./navbar.css";

const Navbar = () => {
  const links = [
    { to: "/", label: "Home" },
    { to: "/drivers", label: "Drivers" },
    { to: "/constructors", label: "Constructors" },
    // { to: "/circuits", label: "Circuits" },
  ];

  return (
    <nav className="navbar">
      <div className="logo">
        🏁 <NavLink to="/">F1 Central</NavLink>
      </div>

      <ul className="nav-links">
        {links.map((link) => (
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
    </nav>
  );
};

export default Navbar;
