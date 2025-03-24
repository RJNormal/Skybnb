import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import logo from './logo.png'

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <nav className="navbar">
      {/* Left Side - Logo */}
      <NavLink to="/" className="navbar-logo">
        <img src={logo} alt="Website Logo" />
      </NavLink>

      {/* Right Side - Navigation Links */}
      <div className="navbar-menu">
        {sessionUser && (
          <NavLink to="/spots/new" className="nav-link">
            Create a New Spot
          </NavLink>
        )}
        {isLoaded && <ProfileButton user={sessionUser} className = "profile-button" />}
      </div>
    </nav>
  );
}

export default Navigation;