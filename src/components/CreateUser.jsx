import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createUser, updateUser, fetchUserDetails } from '../redux/async/userSlice';
import { showSuccessAlert } from '../utils/SweetAlert';

const CreateUser = () => {
  const { id } = useParams(); // Ambil ID dari URL untuk mode edit
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.users);
  const [formData, setFormData] = useState({
    photo: null,
    name: '',
    title: '',
    email: '',
    username: '',
    password: '',
    linkedin: '',
    instagram: '',
  });

  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch user details untuk mode edit
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      dispatch(fetchUserDetails(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchUserDetails(id));
    }
  }, [isEditMode, id, dispatch]);

  // Sinkronisasi data userDetails dari Redux ke formData
  useEffect(() => {
    if (isEditMode && user && user.id === parseInt(id, 10)) {
      setFormData({
        ...user,
        photo: null, // Reset photo untuk mengunggah ulang jika diperlukan
      });
    }
  }, [isEditMode, user, id]);

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
        if (formData[key] !== null) {
          payload.append(key, formData[key]);
        }
      });

      if (isEditMode) {
        await dispatch(updateUser({ id, userData: payload })).unwrap();
        await showSuccessAlert('Success!', 'User updated successfully.');
      } else {
        await dispatch(createUser(payload)).unwrap();
        await showSuccessAlert('Success!', 'User created successfully.');
      }

      navigate('/users'); // Redirect ke halaman daftar pengguna
    } catch (error) {
      console.error('User operation failed', error);
    }
  };

  return (
    <div className='flex items-center justify-center bg-gray-50 px-4 h-full'>
      <form onSubmit={handleSubmit} className='bg-white p-8 rounded-lg shadow-md w-full max-w-4xl'>
        <h2 className='text-2xl font-bold text-gray-800 mb-6'>{isEditMode ? 'Edit User' : 'Create User'}</h2>

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

          {/* LinkedIn */}
          <div>
            <label htmlFor='linkedin' className='block text-sm font-medium text-gray-700 mb-2'>
              LinkedIn Profile
            </label>
            <input
              type='text'
              id='linkedin'
              name='linkedin'
              value={formData.linkedin}
              onChange={handleChange}
              placeholder='LinkedIn Profile Link'
              className='w-full p-3 border rounded-md focus:outline-primary focus:ring-2 focus:ring-primary transition'
            />
          </div>

          {/* Instagram */}
          <div>
            <label htmlFor='instagram' className='block text-sm font-medium text-gray-700 mb-2'>
              Instagram Profile
            </label>
            <input
              type='text'
              id='instagram'
              name='instagram'
              value={formData.instagram}
              onChange={handleChange}
              placeholder='Instagram Profile Link'
              className='w-full p-3 border rounded-md focus:outline-primary focus:ring-2 focus:ring-primary transition'
            />
          </div>

          {/* Photo Upload */}
          <div className='col-span-2'>
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
            {isEditMode ? 'Update User' : 'Create User'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
