import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createBlog, updateBlog, fetchBlogDetails } from '../redux/async/blogSlice';

const BlogEditor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { blogDetails, status } = useSelector((state) => state.blogs);

  const [blogData, setBlogData] = useState({
    title: '',
    content: '',
    meta_title: '',
    meta_desc: '',
    published: false,
    banner: null,
  });

  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch blog details jika ada ID (edit mode)
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      dispatch(fetchBlogDetails(id));
    }
  }, [id, dispatch]);

  // Sinkronisasi `blogDetails` ke state lokal
  useEffect(() => {
    if (isEditMode && status === 'succeeded' && blogDetails && blogDetails.id === parseInt(id)) {
      console.log('Fetched blog details:', blogDetails); // Debugging log
      setBlogData({
        title: blogDetails.title || '',
        content: blogDetails.content || '',
        meta_title: blogDetails.meta_title || '',
        meta_desc: blogDetails.meta_desc || '',
        published: blogDetails.published || false,
        banner: null, // Banner tidak dapat langsung disinkronkan
      });
    }
  }, [isEditMode, blogDetails, id, status]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBlogData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  console.log(blogDetails);
  

  const handleContentChange = (data) => {
    setBlogData((prev) => ({
      ...prev,
      content: data,
    }));
  };

  const handleFileChange = (e) => {
    setBlogData((prev) => ({
      ...prev,
      banner: e.target.files[0],
    }));
  };

  const handleSave = async () => {
    const formData = new FormData();
    Object.keys(blogData).forEach((key) => {
      if (blogData[key] !== null) {
        formData.append(key, blogData[key]);
      }
    });

    if (isEditMode) {
      dispatch(updateBlog({ id, blogData: formData }));
    } else {
      dispatch(createBlog(formData));
    }
    navigate('/blogs');
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div className='bg-white shadow rounded-lg p-6 max-w-4xl mx-auto'>
        <h2 className='text-2xl font-bold mb-4'>{isEditMode ? 'Edit Blog' : 'Create New Blog'}</h2>
        <div className='mb-4'>
          <label className='block text-gray-700 font-semibold mb-2'>Title</label>
          <input type='text' name='title' value={blogData.title} onChange={handleChange} className='w-full p-3 border rounded-lg focus:outline-primary focus:ring-2 focus:ring-primary transition' />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 font-semibold mb-2'>Content</label>
          <CKEditor
            editor={ClassicEditor}
            data={blogData.content}
            onChange={(event, editor) => {
              const data = editor.getData();
              handleContentChange(data);
            }}
            config={{
              licenseKey : 'GPL',
              toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', '|', 'undo', 'redo'],
            }}
          />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 font-semibold mb-2'>Meta Title</label>
          <input type='text' name='meta_title' value={blogData.meta_title} onChange={handleChange} className='w-full p-3 border rounded-lg' />
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 font-semibold mb-2'>Meta Description</label>
          <textarea name='meta_desc' value={blogData.meta_desc} onChange={handleChange} className='w-full p-3 border rounded-lg' />
        </div>
        <div className='mb-4'>
          <label className='flex items-center space-x-3'>
            <input type='checkbox' name='published' checked={blogData.published} onChange={handleChange} className='form-checkbox h-5 w-5 text-primary' />
            <span className='text-gray-700 font-semibold'>Published</span>
          </label>
        </div>
        <div className='mb-6'>
          <label className='block text-gray-700 font-semibold mb-2'>Banner</label>
          <input type='file' name='banner' onChange={handleFileChange} className='block w-full text-gray-500' />
        </div>
        <div className='flex justify-end space-x-4'>
          <button onClick={() => navigate('/blogs')} className='bg-gray-300 text-gray-700 py-2 px-4 rounded-lg shadow-md'>
            Cancel
          </button>
          <button onClick={handleSave} className='bg-primary text-white py-2 px-4 rounded-lg shadow-md'>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;
