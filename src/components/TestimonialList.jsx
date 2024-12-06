import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchTestimonials, deleteTestimonial } from '../redux/async/testimonialSlice';

const TestimonialList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { testimonials, status, error } = useSelector((state) => state.testimonial);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    dispatch(fetchTestimonials({ page: currentPage, limit, search: searchQuery }));
  }, [dispatch, currentPage, limit, searchQuery]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      await dispatch(deleteTestimonial(id));
      dispatch(fetchTestimonials({ page: currentPage, limit, search: searchQuery }));
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    dispatch(fetchTestimonials({ page: 1, limit, search: searchQuery }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div className='bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto'>
        <div className='flex flex-col lg:flex-row justify-between items-center mb-6 space-y-4 lg:space-y-0'>
          <h2 className='text-2xl font-bold'>Testimonial List</h2>
          <div className='flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4'>
            <input type='text' placeholder='Search testimonials...' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className='p-2 border rounded-lg w-full lg:w-auto' />
            <button onClick={handleSearch} className='bg-primary text-white py-2 px-4 rounded-lg shadow-md hover:bg-opacity-80 transition w-full lg:w-auto'>
              Search
            </button>
            <button onClick={() => navigate('/testimonial/add')} className='bg-green-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-opacity-80 transition w-full lg:w-auto'>
              Add Testimonial
            </button>
          </div>
        </div>
        <div className='space-y-4'>
          {status === 'loading' && <p>Loading...</p>}
          {error && <p className='text-red-500'>{error}</p>}
          {Array.isArray(testimonials) && testimonials.length > 0 ? (
            testimonials.map((testimonial) => (
              <div key={testimonial.id} className='p-4 bg-gray-100 rounded-lg shadow'>
                <h3 className='text-lg font-bold'>{testimonial.name}</h3>
                <p className='text-sm text-gray-600'>{testimonial.message}</p>
                <div className='mt-2 flex space-x-4'>
                  <button onClick={() => navigate(`/testimonial/${testimonial.id}/edit`)} className='text-blue-500 font-bold'>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(testimonial.id)} className='text-red-500 font-bold'>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No testimonials available.</p>
          )}
        </div>
        <div className='mt-6 flex justify-center space-x-2'>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`py-2 px-4 rounded-lg ${currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white'}`}>
            Previous
          </button>
          <button onClick={() => handlePageChange(currentPage + 1)} className='bg-primary text-white py-2 px-4 rounded-lg'>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialList;
