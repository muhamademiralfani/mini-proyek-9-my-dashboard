import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTestimonials, deleteTestimonial } from '../redux/async/testimonialSlice';
import { useNavigate } from 'react-router-dom';

const TestimonialList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { testimonials, status, error } = useSelector((state) => state.testimonial);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleFetch = () => {
    dispatch(fetchTestimonials({ page: currentPage, limit: 5, search }));
  };

  useEffect(() => {
    handleFetch();
  }, [currentPage, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    handleFetch();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this testimonial?')) {
      dispatch(deleteTestimonial(id)).then(() => handleFetch());
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Testimonial List</h2>
        <div className="flex justify-between items-center mb-6">
          <form onSubmit={handleSearch} className="flex items-center space-x-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Testimonials"
              className="p-2 border rounded-lg"
            />
            <button type="submit" className="bg-primary text-white py-2 px-4 rounded-lg">
              Search
            </button>
          </form>
          <button
            onClick={() => navigate('/testimonial/add')}
            className="bg-primary text-white py-2 px-4 rounded-lg shadow-md hover:bg-opacity-80 transition"
          >
            Add Testimonial
          </button>
        </div>

        {status === 'loading' && <p>Loading testimonials...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="p-4 bg-gray-100 rounded-lg shadow">
              <img
                src={testimonial.foto_profile}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full object-cover mb-2"
              />
              <h3 className="text-lg font-semibold">{testimonial.name}</h3>
              <p>{testimonial.message}</p>
              <p className="text-sm text-gray-500">{testimonial.title}</p>
              <div className="mt-2 flex space-x-4">
                <button
                  onClick={() => navigate(`/testimonial/edit/${testimonial.id}`)}
                  className="text-blue-500 font-bold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="text-red-500 font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`py-2 px-4 rounded-lg font-bold shadow-md ${currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'bg-primary text-white'}`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="py-2 px-4 bg-primary text-white rounded-lg font-bold shadow-md"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialList;
