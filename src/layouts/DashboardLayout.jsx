import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';
import Users from '../components/Users';
import CreateUser from '../components/CreateUser';
import Profile from '../components/Profile';
import BlogEditor from '../components/BlogEditor';
import BlogList from '../components/BlogList';
import PortfolioEditor from '../components/PortfoliEditor';
import PortfolioList from '../components/PortfolioList';
import TestimonialEditor from '../components/TestimonialEditor';
import TestimonialList from '../components/TestimonialList';
import ContactList from '../components/ContactList';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    const tokenExpiration = localStorage.getItem('token_expiration');
    if (tokenExpiration && Date.now() > parseInt(tokenExpiration)) {
      localStorage.removeItem('token');
      localStorage.removeItem('token_expiration');
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className='flex h-screen overflow-hidden'>
      {/* Overlay for mobile */}
      {sidebarOpen && <div className='fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden' onClick={closeSidebar}></div>}

      {/* Sidebar */}
      <Sidebar className={`transform fixed z-50 md:relative bg-gray-800 text-white w-64 h-full transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`} />

      {/* Main Content */}
      <div className='flex-1 flex flex-col bg-gray-50'>
        <Navbar toggleSidebar={toggleSidebar} />
        <main className='p-6 md:p-10 lg:p-14 flex-1 overflow-y-auto'>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/users' element={<Users />} />
            <Route path='/users/add' element={<CreateUser />} />
            <Route path='/users/edit/:id' element={<CreateUser />} />
            <Route path='/users/:id' element={<Profile />} />
            <Route path='/blogs/' element={<BlogList />} />
            <Route path='/blogs/add' element={<BlogEditor />} />
            <Route path='/blogs/:id' element={<BlogEditor />} />
            <Route path='/blogs/edit/:id' element={<BlogEditor />} />
            <Route path='/portfolio/add' element={<PortfolioEditor />} />
            <Route path='/portfolio/' element={<PortfolioList />} />
            <Route path='/portfolio/edit/:id' element={<PortfolioEditor />} />
            <Route path='/testimonial' element={<TestimonialList />} />
            <Route path='/testimonial/add' element={<TestimonialEditor />} />
            <Route path='/testimonial/edit/:id/' element={<TestimonialEditor />} />
            <Route path='/contact' element={<ContactList />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
