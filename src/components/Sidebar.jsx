import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Sidebar = ({ className, closeSidebar }) => {
  return (
    <aside
      className={`${className} bg-dark text-light w-64 h-full fixed top-0 left-0 z-50 shadow-lg md:relative md:z-auto transition-transform duration-300 ease-in-out`}
      onClick={(e) => e.stopPropagation()} // Prevent click propagation
    >
      <div className="p-6">
        <h2 className="text-3xl font-bold">DASHBOARD</h2>
      </div>
      <ul className="space-y-6 text-lg px-6">
        <li>
          <Link to="/" className="block hover:bg-primary hover:text-white px-4 py-2 rounded transition">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/users" className="block hover:bg-primary hover:text-white px-4 py-2 rounded transition">
            Users
          </Link>
        </li>
        <li>
          <Link to="/portfolio" className="block hover:bg-primary hover:text-white px-4 py-2 rounded transition">
            Portfolio
          </Link>
        </li>
        <li>
          <Link to="/blogs" className="block hover:bg-primary hover:text-white px-4 py-2 rounded transition">
            Blogs
          </Link>
        </li>
        <li>
          <Link to="/testimonial" className="block hover:bg-primary hover:text-white px-4 py-2 rounded transition">
            Testimonial
          </Link>
        </li>
        <li>
          <Link to="/contact" className="block hover:bg-primary hover:text-white px-4 py-2 rounded transition">
            Contact
          </Link>
        </li>
      </ul>
    </aside>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  closeSidebar: PropTypes.func,
};

export default Sidebar;
