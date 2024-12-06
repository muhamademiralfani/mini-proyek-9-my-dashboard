import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardTotals } from '../redux/async/dashboardSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { totals, status, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardTotals());
  }, [dispatch]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className='text-red-500'>Error: {error}</p>;
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8'>
        <div className='bg-primary text-white p-6 rounded-lg shadow hover:shadow-lg transition duration-200'>
          <h3 className='text-lg font-semibold'>Portfolio</h3>
          <p className='text-3xl font-bold mt-4'>{totals.portfolios}</p>
        </div>
        <div className='bg-primary text-white p-6 rounded-lg shadow hover:shadow-lg transition duration-200'>
          <h3 className='text-lg font-semibold'>Blogs</h3>
          <p className='text-3xl font-bold mt-4'>{totals.blogs}</p>
        </div>
        <div className='bg-primary text-white p-6 rounded-lg shadow hover:shadow-lg transition duration-200'>
          <h3 className='text-lg font-semibold'>Testimonials</h3>
          <p className='text-3xl font-bold mt-4'>{totals.testimonials}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
