import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  return (
    <nav className="navBar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/edit">Edit</Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
