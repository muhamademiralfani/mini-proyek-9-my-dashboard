import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createTestimonial, updateTestimonial, fetchTestimonialDetails } from '../redux/async/testimonialSlice';

const TestimonialEditor = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    foto_profile: null,
    message: '',
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      dispatch(fetchTestimonialDetails(id)).then((response) => {
        const testimonial = response.payload;
        if (testimonial) {
          setFormData({
            ...testimonial,
            foto_profile: null, // Reset file field for editing
          });
        }
      });
    }
  }, [id, dispatch]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const testimonialData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        testimonialData.append(key, formData[key]);
      }
    });

    if (isEditMode) {
      dispatch(updateTestimonial({ id, testimonialData }));
    } else {
      dispatch(createTestimonial(testimonialData));
    }
    navigate('/testimonial');
  };

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div className='bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto'>
        <h2 className='text-2xl font-bold mb-4'>{isEditMode ? 'Edit Testimonial' : 'Create Testimonial'}</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Name</label>
            <input type='text' name='name' value={formData.name} onChange={handleChange} className='w-full p-3 border rounded-lg' />
          </div>
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Title</label>
            <input type='text' name='title' value={formData.title} onChange={handleChange} className='w-full p-3 border rounded-lg' />
          </div>
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Profile Picture</label>
            <input type='file' name='foto_profile' onChange={handleChange} className='w-full p-3 border rounded-lg' />
          </div>
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Message</label>
            <textarea name='message' value={formData.message} onChange={handleChange} className='w-full p-3 border rounded-lg' rows='4' />
          </div>
          <div className='flex justify-end space-x-4'>
            <button type='button' onClick={() => navigate('/testimonial')} className='bg-gray-300 text-gray-700 py-2 px-4 rounded-lg'>
              Cancel
            </button>
            <button type='submit' className='bg-primary text-white py-2 px-4 rounded-lg'>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestimonialEditor;
