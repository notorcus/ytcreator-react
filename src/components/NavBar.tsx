import { Link, useLocation } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  const location = useLocation();

  return (
    <nav className="navBar">
      <ul>
        <li className={location.pathname === "/" ? "active" : ""}>
          <Link to="/">Home</Link>
        </li>
        <li className={location.pathname === "/edit" ? "active" : ""}>
          <Link to="/edit">Edit</Link>
        </li>
        <li className={location.pathname === "/videos" ? "active" : ""}>
          <Link to="/videos">Videos</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
