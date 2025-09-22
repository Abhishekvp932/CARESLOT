import "../css/Header.css";
import { useNavigate, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { logOut } from "@/features/auth/authSlice";
import { useLogOutMutation } from "@/features/auth/authApi";
import NotificationComponent from "@/components/common/notifications"; 
import LiveNotifications from "@/components/common/LiveNotification";
const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const [LogOut] = useLogOutMutation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogin = () => navigate("/login");

  const handleLogout = async () => {
    try {
      await LogOut().unwrap();
      dispatch(logOut());
      navigate("/login");
      setIsDropdownOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProfile = () => {
    navigate("/profile");
    setIsDropdownOpen(false);
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h2>CARESLOT</h2>
        </div>

        {/* Desktop Nav */}
        <nav className="nav desktop-nav">
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/doctors">Doctors</Link></li>
            <li><a href="#services">Services</a></li>
            <li><Link to='/about-page'>About</Link></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>

        <div className="auth-buttons desktop-auth" ref={dropdownRef}>
          {user ? (
            <div className="flex items-center gap-4 relative">
              {/* 🔔 Bell Icon */}
              <button
                className="relative p-2 rounded-full hover:bg-gray-100"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setIsDropdownOpen(false);
                }}
              >
                <span className="text-xl">🔔</span>
              </button>

              
              <LiveNotifications userId={user?._id}/>
              {showNotifications && (
                <div className="absolute right-0 top-12 w-96 bg-white border rounded-lg shadow-lg z-50">
                  <NotificationComponent patientId={user?._id}/>
                </div>
              )}

              <button
                className="user-profile-btn"
                onClick={() => {
                  setIsDropdownOpen(!isDropdownOpen);
                  setShowNotifications(false);
                }}
              >
                <div className="user-avatar">
                  {user?.name ? user?.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="user-name">{user?.name || "User"}</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white border rounded-lg shadow-lg z-50">
                  <button className="dropdown-item" onClick={handleProfile}>
                    Profile
                  </button>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn-signup" onClick={handleLogin}>
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        <button
          className="mobile-menu-btn"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger ${isMobileMenuOpen ? "active" : ""}`}>
            <span></span><span></span><span></span>
          </span>
        </button>

        <nav className={`mobile-nav ${isMobileMenuOpen ? "active" : ""}`}>
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
                <button
                  className="mobile-dropdown-item"
                  onClick={() => {
                    handleProfile();
                    closeMobileMenu();
                  }}
                >
                  Profile
                </button>
                <button
                  className="mobile-dropdown-item"
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    closeMobileMenu();
                  }}
                >
                  Notifications
                </button>
                <button
                  className="mobile-dropdown-item logout"
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                className="btn-signup"
                onClick={() => {
                  handleLogin();
                  closeMobileMenu();
                }}
              >
                Login
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
