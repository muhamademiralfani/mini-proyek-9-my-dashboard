import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, getProfile } from '../redux/async/authSlice';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.users);

  const email = localStorage.getItem('userEmail'); // Ambil email dari localStorage
  const loggedInUser = users.find((u) => u.email === email);
  const { user } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null); // Referensi untuk dropdown

  const handleViewProfile = async () => {
    try {
      await dispatch(getProfile(loggedInUser.id)).unwrap();
      navigate(`/users/${loggedInUser.id}`); // Redirect ke halaman profil
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap(); // Panggil API logout
      navigate('/login'); // Redirect ke login
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Tutup dropdown jika klik di luar area
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
    <nav className='bg-white text-dark px-4 md:px-8 py-4 flex justify-between items-center shadow-md'>
      {/* Logo or Dashboard Title */}
      <h1 className='text-2xl md:text-3xl font-bold tracking-wide cursor-pointer' onClick={() => navigate('/')}>
        Dashboard
      </h1>

      {/* User Dropdown */}
      <div className='relative' ref={dropdownRef}>
        <div className='flex items-center space-x-2 cursor-pointer' onClick={toggleDropdown}>
          <div className='w-10 h-10 rounded-full flex items-center justify-center'>
            <span className='text-xl font-semibold text-gray-700'>
              <img src={loggedInUser?.photo} className='w-10 h-10 rounded-full object-cover' alt='' />
            </span>
          </div>
        </div>

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className='absolute right-0 mt-2 bg-white shadow-lg rounded-md overflow-hidden w-40'>
            <div className='px-4 py-2 text-gray-700 border-b font-semibold'>{user?.username || 'Guest'}</div>
            <button onClick={handleViewProfile} className='block w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition'>
              View Profile
            </button>
            <button onClick={handleLogout} className='block w-full px-4 py-2 text-left text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition'>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
