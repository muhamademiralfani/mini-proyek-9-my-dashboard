import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, getProfile } from '../redux/async/authSlice';
import { useState, useEffect, useRef } from 'react';

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white text-dark px-4 py-4 flex justify-between items-center shadow-md">
      <button
        className="text-2xl md:hidden"
        onClick={toggleSidebar}
      >
        ☰
      </button>

      <div className="relative" ref={dropdownRef}>
        <div className="flex items-center space-x-2 cursor-pointer" onClick={toggleDropdown}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-300">
            <span className="text-lg font-semibold text-gray-700">
              {user?.username?.charAt(0).toUpperCase()}
            </span>
          </div>
        </div>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md overflow-hidden w-40">
            <div className="px-4 py-2 text-gray-700 border-b font-semibold">{user?.username || 'Guest'}</div>
            <button onClick={handleLogout} className="block w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
