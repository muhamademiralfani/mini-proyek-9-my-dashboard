import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../redux/async/authSlice';
import { fetchUsers } from '../redux/async/userSlice';
import { useNavigate } from 'react-router-dom';
import useEmailInput from '../hooks/useEmailInput';

const Login = () => {
  const { email, isValid, handleChange: handleEmailChange, setEmail } = useEmailInput();
  const [formData, setFormData] = useState({
    password: '',
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Mencegah reload halaman
    if (!isValid) {
      alert('Please enter a valid email');
      return;
    }

    try {
      await dispatch(
        loginUser({
          email,
          ...formData,
        })
      ).unwrap();

      // Simpan email ke localStorage jika Remember Me dipilih
      if (formData.rememberMe) {
        localStorage.setItem('email', email);
      }

      // Navigasi ke dashboard
      navigate('/');
      dispatch(fetchUsers()); // Ambil data pengguna setelah login
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-light px-4'>
      <form onSubmit={handleSubmit} className='bg-white p-8 rounded-lg shadow-lg w-full max-w-sm'>
        <h2 className='text-3xl font-bold text-dark mb-4'>Login</h2>
        <input
          type='email'
          name='email'
          id='email'
          value={email}
          onChange={handleEmailChange}
          placeholder='Email'
          className={`w-full p-3 mb-4 border rounded-lg focus:outline-primary focus:ring-2 focus:ring-primary transition ${isValid ? 'border-gray-300' : 'border-red-500'}`}
        />
        {!isValid && <p className='text-red-500 text-sm'>Invalid email address</p>}
        <div className='relative w-full mb-4'>
          <input
            id='password'
            type={showPassword ? 'text' : 'password'}
            name='password'
            value={formData.password}
            onChange={handleChange}
            placeholder='Password'
            className='w-full p-3 border rounded-lg focus:outline-primary focus:ring-2 focus:ring-primary transition'
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-3 text-sm font-bold text-primary focus:outline-none'
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <div className='flex items-center mb-4'>
          <input
            type='checkbox'
            name='rememberMe'
            id='rememberMe'
            checked={formData.rememberMe}
            onChange={handleChange}
            className='mr-2'
          />
          <label htmlFor='rememberMe'>Remember Me</label>
        </div>
        <button
          type='submit'
          className='w-full bg-primary text-white py-3 rounded-lg font-bold shadow-lg hover:bg-opacity-80 transition'
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
