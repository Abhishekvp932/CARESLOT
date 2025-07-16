import '../css/Header.css'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {useState } from 'react';
import {useDispatch,useSelector } from 'react-redux';
import type { RootState } from '@/app/store';
import { logOut ,setCredentials} from '@/features/auth/authSlice';
import { useLogOutMutation } from '@/features/auth/authApi';
const Header = () => {
  const dispatch = useDispatch()
  const {token} = useSelector((state : RootState) => state.auth)
  const auth = useSelector((state : RootState) => state.auth)
  console.log('user is ',auth)
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const [LogOut] = useLogOutMutation()
  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async()=>{
  
    try {
      await LogOut().unwrap()
       dispatch(logOut())
      navigate('/login')
     
      setCredentials(null);
    } catch (error) {
      console.log(error)
    }
  }
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h2>CARESLOT</h2>
        </div>
        
       
        <nav className="nav desktop-nav">
          <ul className="nav-links">
            <li><a href='/'>Home</a></li>
            <li><a href="#doctors">Doctors</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>

        
        <div className="auth-buttons desktop-auth">
         {token ? (
           <button className="btn-signup" onClick={handleLogout}>Logout</button>
         ):(
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
            {token ? (
              <>
              <button className="btn-signup" onClick={() => {handleLogout(); closeMobileMenu();}}>
              Logout
            </button>
              </>
            ):(
               <>
              <button className="btn-signup" onClick={() => {handleLogin(); closeMobileMenu();}}>
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