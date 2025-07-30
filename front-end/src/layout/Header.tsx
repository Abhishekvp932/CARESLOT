import '../css/Header.css'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { logOut, setCredentials } from '@/features/auth/authSlice';
import { useLogOutMutation } from '@/features/auth/authApi';

const Header = () => {
  const dispatch = useDispatch()
  const  user = useSelector((state: RootState) => state.auth.user)

  console.log('usersss is ', user)
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [LogOut] = useLogOutMutation()
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    try {
      await LogOut().unwrap()
      dispatch(logOut())
      navigate('/login')
      setCredentials(null);
      setIsDropdownOpen(false);
    } catch (error) {
      console.log(error)
    }
  }

  const handleProfile = () => {
    navigate('/profile');
    setIsDropdownOpen(false);
  };

  const handleNotifications = () => {
    navigate('/notifications');
    setIsDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h2>CARESLOT</h2>
        </div>

        <nav className="nav desktop-nav">
          <ul className="nav-links">
            <li><a href='/'>Home</a></li>
            <li><a href="/doctors">Doctors</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>

        <div className="auth-buttons desktop-auth">
          {user ? (
            <div className="user-dropdown" ref={dropdownRef}>
              <button className="user-profile-btn" onClick={toggleDropdown}>
                <div className="user-avatar">
                  {user?.name ? user?.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="user-name">{user?.name || 'User'}</span>
                <svg 
                  className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`} 
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none"
                >
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button className="dropdown-item" onClick={handleProfile}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z" fill="currentColor"/>
                      <path d="M8 10C3.58172 10 0 13.5817 0 18H16C16 13.5817 12.4183 10 8 10Z" fill="currentColor"/>
                    </svg>
                    Profile
                  </button>
                  <button className="dropdown-item" onClick={handleNotifications}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 16C9.1 16 10 15.1 10 14H6C6 15.1 6.9 16 8 16ZM14 11V7C14 4.24 12.36 1.95 9.5 1.63V1C9.5 0.45 9.05 0 8.5 0H7.5C6.95 0 6.5 0.45 6.5 1V1.63C3.64 1.95 2 4.24 2 7V11L0 13V14H16V13L14 11Z" fill="currentColor"/>
                    </svg>
                    Notifications
                  </button>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M6 14H3C2.45 14 2 13.55 2 13V3C2 2.45 2.45 2 3 2H6V0H3C1.35 0 0 1.35 0 3V13C0 14.65 1.35 16 3 16H6V14Z" fill="currentColor"/>
                      <path d="M11.5 12L14.5 9H6V7H14.5L11.5 4L12.5 3L16.5 7L12.5 11L11.5 12Z" fill="currentColor"/>
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn-signup" onClick={handleLogin}>Login</button>
          )}
        </div>

        <button
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>

        <nav className={`mobile-nav ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul className="mobile-nav-links">
            <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
            <li><a href="#doctors" onClick={closeMobileMenu}>Doctors</a></li>
            <li><a href="#services" onClick={closeMobileMenu}>Services</a></li>
            <li><a href="#about" onClick={closeMobileMenu}>About</a></li>
            <li><a href="#contact" onClick={closeMobileMenu}>Contact</a></li>
          </ul>
          <div className="mobile-auth">
            {user ? (
              <>
                
                <button className="mobile-dropdown-item" onClick={() => { handleProfile(); closeMobileMenu(); }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 8C10.2091 8 12 6.20914 12 4C12 1.79086 10.2091 0 8 0C5.79086 0 4 1.79086 4 4C4 6.20914 5.79086 8 8 8Z" fill="currentColor"/>
                    <path d="M8 10C3.58172 10 0 13.5817 0 18H16C16 13.5817 12.4183 10 8 10Z" fill="currentColor"/>
                  </svg>
                  Profile
                </button>
                <button className="mobile-dropdown-item" onClick={() => { handleNotifications(); closeMobileMenu(); }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 16C9.1 16 10 15.1 10 14H6C6 15.1 6.9 16 8 16ZM14 11V7C14 4.24 12.36 1.95 9.5 1.63V1C9.5 0.45 9.05 0 8.5 0H7.5C6.95 0 6.5 0.45 6.5 1V1.63C3.64 1.95 2 4.24 2 7V11L0 13V14H16V13L14 11Z" fill="currentColor"/>
                  </svg>
                  Notifications
                </button>
                <button className="mobile-dropdown-item logout" onClick={() => { handleLogout(); closeMobileMenu(); }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 14H3C2.45 14 2 13.55 2 13V3C2 2.45 2.45 2 3 2H6V0H3C1.35 0 0 1.35 0 3V13C0 14.65 1.35 16 3 16H6V14Z" fill="currentColor"/>
                    <path d="M11.5 12L14.5 9H6V7H14.5L11.5 4L12.5 3L16.5 7L12.5 11L11.5 12Z" fill="currentColor"/>
                  </svg>
                  Logout
                </button>
               
              </>
            ) : (
              <>
                <button className="btn-signup" onClick={() => { handleLogin(); closeMobileMenu(); }}>
                  Login
                </button>
              </>
            )}
          </div>
        </nav>
        {isMobileMenuOpen && (
          <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
        )}
      </div>
    </header>
  );
};

export default Header;