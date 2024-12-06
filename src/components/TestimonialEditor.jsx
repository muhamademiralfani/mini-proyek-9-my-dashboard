/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createTestimonial, updateTestimonial, fetchTestimonialDetails } from '../redux/async/testimonialSlice';

const TestimonialEditor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { testimonialDetails, status } = useSelector((state) => state.testimonial);

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
      dispatch(fetchTestimonialDetails(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (isEditMode && testimonialDetails) {
      setFormData({
        name: testimonialDetails.name || '',
        title: testimonialDetails.title || '',
        foto_profile: null,
        message: testimonialDetails.message || '',
      });
    }
  }, [isEditMode, testimonialDetails]);

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

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          {isEditMode ? 'Edit Testimonial' : 'Create New Testimonial'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-primary focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-primary focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring focus:ring-primary focus:outline-none"
              rows="4"
            ></textarea>
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Photo Profile</label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                name="foto_profile"
                id="foto_profile"
                onChange={handleChange}
                className="hidden"
              />
              <label
                htmlFor="foto_profile"
                className="cursor-pointer bg-primary text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-opacity-90 transition"
              >
                Choose File
              </label>
              <span className="text-gray-500 text-sm truncate">
                {formData.foto_profile ? formData.foto_profile.name : 'No file selected'}
              </span>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/testimonial')}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
            <button type="submit" className="bg-primary text-white py-2 px-4 rounded-lg">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestimonialEditor;
