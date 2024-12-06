import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { createUser } from '../redux/async/userSlice';
import { showSuccessAlert } from '../utils/SweetAlert';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    photo: null,
    name: '',
    title: '',
    email: '',
    username: '',
    password: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate function

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      Object.keys(formData).forEach((key) => {
        payload.append(key, formData[key]);
      });

      await dispatch(createUser(payload)).unwrap();

      // Show SweetAlert and redirect on confirmation
      await showSuccessAlert('Success!', 'User created successfully.').then(() => {
        navigate('/users'); // Redirect to User List
      });
    } catch (error) {
      console.error('User creation failed', error);
    }
  };

  return (
    <div className='flex items-center justify-center bg-gray-50 px-4 h-full'>
      <form onSubmit={handleSubmit} className='bg-white p-8 rounded-lg shadow-md w-full max-w-4xl'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6'>Create User</h2>

        {/* Form Grid */}
        <div className='grid grid-cols-2 gap-6'>
          {/* Name */}
          <div>
            <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-2'>
              Name
            </label>
            <input type='text' name='name' id='name' value={formData.name} onChange={handleChange} placeholder='Full Name' className='w-full p-3 border rounded-md focus:outline-primary focus:ring-2 focus:ring-primary transition' />
          </div>

          {/* Title */}
          <div>
            <label htmlFor='title' className='block text-sm font-medium text-gray-700 mb-2'>
              Title
            </label>
            <input type='text' id='title' name='title' value={formData.title} onChange={handleChange} placeholder='Job Title' className='w-full p-3 border rounded-md focus:outline-primary focus:ring-2 focus:ring-primary transition' />
          </div>

          {/* Email */}
          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
              Email
            </label>
            <input type='email' id='email' name='email' value={formData.email} onChange={handleChange} placeholder='Email Address' className='w-full p-3 border rounded-md focus:outline-primary focus:ring-2 focus:ring-primary transition' />
          </div>

          {/* Username */}
          <div>
            <label htmlFor='username' className='block text-sm font-medium text-gray-700 mb-2'>
              Username
            </label>
            <input
              type='text'
              id='username'
              name='username'
              value={formData.username}
              onChange={handleChange}
              placeholder='Username'
              className='w-full p-3 border rounded-md focus:outline-primary focus:ring-2 focus:ring-primary transition'
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
              Password
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              placeholder='Password'
              className='w-full p-3 border rounded-md focus:outline-primary focus:ring-2 focus:ring-primary transition'
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label htmlFor='photo' className='block text-sm font-medium text-gray-700 mb-2'>
              Photo
            </label>
            <div className='flex items-center gap-4'>
              <input type='file' name='photo' id='photo' onChange={handleChange} className='hidden' />
              <label htmlFor='photo' className='cursor-pointer bg-primary text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-opacity-90 transition'>
                Choose File
              </label>
              <span className='text-gray-500 text-sm'>{formData.photo ? formData.photo.name : 'No file selected'}</span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className='mt-8'>
          <button type='submit' className='w-full bg-primary text-white py-3 rounded-md font-bold hover:bg-opacity-90 shadow-md transition'>
            Create User
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
