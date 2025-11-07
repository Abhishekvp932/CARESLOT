import { useNavigate, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { logOut } from "@/features/auth/authSlice";
import { useLogOutMutation } from "@/features/auth/authApi";
import NotificationComponent from "@/components/common/notifications";
import LiveNotifications from "@/components/common/LiveNotification";

import {
  Bell,
  Menu,
  X,
  User,
  LogOut as LogOutIcon,
  ChevronDown,
} from "lucide-react";

const Header = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notiCount, setCount] = useState<number>(0);


  const user = useSelector((state: RootState) => state.auth.user);

  const handleNotificationCount = (count: number) => {
    setCount(count);
  };
  const [LogOut] = useLogOutMutation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogin = () => navigate("/login");

  const handleLogout = async () => {
    try {
      await LogOut().unwrap();
      dispatch(logOut());
      navigate("/login");
      setIsDropdownOpen(false);
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProfile = () => {
    navigate("/profile");
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
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

  useEffect(() => {
    closeMobileMenu();
  }, [navigate]);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <h2 className="text-2xl font-bold text-blue-600">CARESLOT</h2>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/doctors"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Doctors
            </Link>
            <Link
              to="/service"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Services
            </Link>
            <Link
              to="/about-page"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Contact
            </Link>
          </nav>

          <div className="hidden md:flex items-center gap-4" ref={dropdownRef}>
            {user ? (
              <div className="flex items-center gap-3 relative">
                <LiveNotifications userId={user?._id} />

                <button
                  className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setIsDropdownOpen(false);
                  }}
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {notiCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                      {notiCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 top-14 w-96 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
                    <NotificationComponent
                      patientId={user?._id}
                      onCountChange={handleNotificationCount}
                    />
                  </div>
                )}

                <button
                  className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    setIsDropdownOpen(!isDropdownOpen);
                    setShowNotifications(false);
                  }}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                    {user?.name ? user?.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-gray-700 font-medium">
                    {user?.name || "User"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 top-14 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                    <button
                      className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                      onClick={handleProfile}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <button
                      className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                      onClick={handleLogout}
                    >
                      <LogOutIcon className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                onClick={handleLogin}
              >
                Login
              </button>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-6 space-y-4">
            <nav className="space-y-2">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                to="/doctors"
                onClick={closeMobileMenu}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                Doctors
              </Link>
              <Link
                to="/service"
                onClick={closeMobileMenu}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                Services
              </Link>
              <Link
                to="/about-page"
                onClick={closeMobileMenu}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={closeMobileMenu}
                className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors"
              >
                Contact
              </Link>
            </nav>

            <div className="pt-4 border-t border-gray-200">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
                      {user?.name ? user?.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {user?.name || "User"}
                      </p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>

                  <button
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors"
                    onClick={() => {
                      setShowNotifications(!showNotifications);
                    }}
                  >
                    <Bell className="w-5 h-5" />
                    Notifications
                  </button>

                  {showNotifications && (
                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg mb-2">
                      <NotificationComponent patientId={user?._id} />
                    </div>
                  )}

                  <button
                    className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg flex items-center gap-2 transition-colors"
                    onClick={handleProfile}
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </button>

                  <button
                    className="w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOutIcon className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  onClick={() => {
                    handleLogin();
                    closeMobileMenu();
                  }}
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
