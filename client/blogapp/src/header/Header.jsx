import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';
import synapticaLogo from '../assets/logo_synaptica.jpg';
import { useSelector, useDispatch } from 'react-redux';
import { resetState } from '../redux/slices/userAuthorSlice';

function Header() {
  const { isLoggedIn, currentUser } = useSelector(state => state.userAuthorLoginReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function signOut(e) {
    e.preventDefault(); // Prevent default navigation
    localStorage.removeItem('token');
    dispatch(resetState());
    navigate('/login');
  }

  return (
    <header className="header-container">
      <div className="logo">
        <img src={synapticaLogo} alt="Synaptica Logo" className='logoimg' />
      </div>
      <div className="brand">
        <h1>Synaptica</h1>
        <p className="caption">Connecting Thoughts, Igniting Insights</p>
      </div>
      <nav>
        <ul>
          {!isLoggedIn ? (
            <>
              <li>
                <NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : ''}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/register" className={({ isActive }) => isActive ? 'active-link' : ''}>
                  SignUp
                </NavLink>
              </li>
              <li>
                <NavLink to="/login" className={({ isActive }) => isActive ? 'active-link' : ''}>
                  SignIn
                </NavLink>
              </li>
            </>
          ) : (
            <>
              <li className="user-welcome">
                <span className="welcome-text">Welcome, <strong>{currentUser?.username}</strong></span>
              </li>
              {currentUser?.userType === 'user' && (
                <li>
                  <NavLink to="/user-profile" className={({ isActive }) => isActive ? 'active-link' : ''}>
                    User Profile
                  </NavLink>
                </li>
              )}
              {currentUser?.userType === 'author' && (
                <>
                  <li>
                    <NavLink to="/author-profile" className={({ isActive }) => isActive ? 'active-link' : ''}>
                      Author Profile
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/author-profile/new-article" className={({ isActive }) => isActive ? 'active-link' : ''}>
                      Create Post
                    </NavLink>
                  </li>
                  <li>
                    {/* Dynamically insert the author's username in the URL */}
                    <NavLink to={`/author-profile/articles-by-author/${currentUser.username}`} className={({ isActive }) => isActive ? 'active-link' : ''}>
                      My Posts
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/edit-profile" className={({ isActive }) => isActive ? 'active-link' : ''}>
                      Edit Profile
                    </NavLink>
                  </li>
                </>
              )}
              <li>
                <button onClick={signOut} className="signout-btn">SignOut</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;
