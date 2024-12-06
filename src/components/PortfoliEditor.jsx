/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createPortfolio, updatePortfolio, fetchPortfolioDetails } from '../redux/async/portfolioSlice';

const PortfolioEditor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { portfolioDetails, status } = useSelector((state) => state.portfolio);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    image: null,
  });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      dispatch(fetchPortfolioDetails(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (isEditMode && portfolioDetails) {
      setFormData({
        title: portfolioDetails.title || '',
        description: portfolioDetails.content || '',
        content: portfolioDetails.content || '',
        image: null,
      });
    }
  }, [isEditMode, portfolioDetails]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleContentChange = (data) => {
    setFormData((prev) => ({
      ...prev,
      content: data,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const portfolioData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null) {
        portfolioData.append(key, formData[key]);
      }
    });

    if (isEditMode) {
      dispatch(updatePortfolio({ id, portfolioData }));
    } else {
      dispatch(createPortfolio(portfolioData));
    }
    navigate('/portfolio');
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div className='bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto'>
        <h2 className='text-2xl font-bold mb-4'>{isEditMode ? 'Edit Portfolio' : 'Create New Portfolio'}</h2>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Title</label>
            <input type='text' name='title' value={formData.title} onChange={handleChange} className='w-full p-3 border rounded-lg focus:ring focus:ring-primary focus:outline-none' required />
          </div>
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Description</label>
            <textarea name='description' value={formData.description} onChange={handleChange} className='w-full p-3 border rounded-lg focus:ring focus:ring-primary focus:outline-none' rows='3'></textarea>
          </div>
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Content</label>
            <CKEditor
              editor={ClassicEditor}
              data={formData.content}
              onChange={(event, editor) => {
                const data = editor.getData();
                handleContentChange(data);
              }}
              config={{
                licenseKey: 'GPL',
                toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo'],
              }}
            />
          </div>
          <div>
            <label className='block text-gray-700 font-semibold mb-2'>Image</label>
            <div className='flex items-center gap-4'>
              <input type='file' name='image' id='image' onChange={handleChange} className='hidden' />
              <label htmlFor='image' className='cursor-pointer bg-primary text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-opacity-90 transition'>
                Choose File
              </label>
              <span className='text-gray-500 text-sm truncate'>{formData.image ? formData.image.name : 'No file selected'}</span>
            </div>
          </div>
          <div className='flex justify-end space-x-4'>
            <button type='button' onClick={() => navigate('/portfolio')} className='bg-gray-300 text-gray-700 py-2 px-4 rounded-lg'>
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

export default PortfolioEditor;
