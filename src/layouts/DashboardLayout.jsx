import React, { useEffect } from 'react';
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

  useEffect(() => {
    const tokenExpiration = localStorage.getItem('token_expiration');
    if (tokenExpiration && Date.now() > parseInt(tokenExpiration)) {
      localStorage.removeItem('token');
      localStorage.removeItem('token_expiration');
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className='flex flex-col md:flex-row h-screen'>
      <Sidebar className='hidden md:block bg-gray-800 text-white w-64' />
      <div className='flex-1 flex flex-col bg-gray-50'>
        <Navbar className='bg-white shadow-md' />
        <main className='p-6 md:p-10 lg:p-14 flex-1 overflow-y-auto'>
          <Routes>
            <Route path='/' element={<Dashboard />} />
            <Route path='/users' element={<Users />} />
            <Route path='/create-user' element={<CreateUser />} />
            <Route path='/users/:id' element={<Profile />} />
            <Route path='/blogs/' element={<BlogList />} />
            <Route path='/blogs/add' element={<BlogEditor />} />
            <Route path='/blogs/:id' element={<BlogEditor />} />
            <Route path='/portfolio/add' element={<PortfolioEditor />} />
            <Route path='/portfolio/' element={<PortfolioList />} />
            <Route path='/portfolio/:id/edit' element={<PortfolioEditor />} />
            <Route path='/testimonial' element={<TestimonialList />} />
            <Route path='/testimonial/add' element={<TestimonialEditor />} />
            <Route path='/testimonial/:id/edit' element={<TestimonialEditor />} />
            <Route path='/contact' element={<ContactList />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
