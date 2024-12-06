// Sidebar Component
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchUsers } from '../redux/async/userSlice';
import PropTypes from 'prop-types';
const Sidebar = ({ className }) => {
  return (
    <aside className={`${className} bg-dark text-light w-full md:w-64 h-full p-6 shadow-lg md:h-screen flex-none transition duration-300 ease-in-out`}>
      <div className='mb-8'>
        <h2 className='text-3xl font-bold'>DASHBOARD</h2>
      </div>
      <ul className='space-y-6 text-lg'>
        <Link to={'/'} className='hover:bg-primary hover:text-white px-4 py-2 rounded cursor-pointer transition flex items-center space-x-3'>
          <span className='iconify' data-icon='mdi:view-dashboard'></span>
          <span>Dashboard</span>
        </Link>
        <Link to={'/users'} className='hover:bg-primary hover:text-white px-4 py-2 rounded cursor-pointer transition flex items-center space-x-3'>
          <span className='iconify' data-icon='mdi:account-multiple'></span>
          <span>Users</span>
        </Link>
        <Link to={'/portfolio'} className='hover:bg-primary hover:text-white px-4 py-2 rounded cursor-pointer transition flex items-center space-x-3'>
          <span className='iconify' data-icon='mdi:account-plus'></span>
          <span>Portfolio</span>
        </Link>
        <Link to={'/blogs'} className='hover:bg-primary hover:text-white px-4 py-2 rounded cursor-pointer transition flex items-center space-x-3'>
          <span className='iconify' data-icon='mdi:chart-line'></span>
          <span>blogs</span>
        </Link>
        <Link to={'/testimonial'} className='hover:bg-primary hover:text-white px-4 py-2 rounded cursor-pointer transition flex items-center space-x-3'>
          <span className='iconify' data-icon='mdi:cog'></span>
          <span>Testimonial</span>
        </Link>
        <Link to={'/contact'} className='hover:bg-primary hover:text-white px-4 py-2 rounded cursor-pointer transition flex items-center space-x-3'>
          <span className='iconify' data-icon='mdi:cog'></span>
          <span>Contact</span>
        </Link>
      </ul>
    </aside>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
};

export default Sidebar;
