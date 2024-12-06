import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const { id } = useParams(); // Get user ID from route params
  const { users } = useSelector((state) => state.users); // Access all users from Redux state

  // Find the user by ID
  const user = users.find((user) => user.id === id);

  useEffect(() => {
    if (!user) {
      console.error(`User with ID ${id} not found`);
    }
  }, [user, id]);

  if (!user) {
    return <p className='text-center text-red-500 mt-6'>User not found.</p>;
  }

  return (
    <div className='bg-gray-50 min-h-screen py-10 px-6'>
      <div className='bg-white shadow-lg rounded-lg max-w-4xl mx-auto p-8'>
        {/* Header */}
        <div className='flex flex-col items-center text-center'>
          <img
            src={user.photo || 'https://via.placeholder.com/100'}
            alt={`${user.name}'s avatar`}
            className='w-28 h-28 rounded-full border shadow-sm'
          />
          <h1 className='mt-4 text-3xl font-bold text-gray-800'>{user.name || 'User Name'}</h1>
          <p className='text-gray-500'>{user.title || 'User Title'}</p>
        </div>

        {/* Divider */}
        <div className='mt-8 border-b border-gray-200'></div>

        {/* Content */}
        <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* About */}
          <div>
            <h2 className='text-lg font-semibold text-gray-700 mb-4'>About</h2>
            <ul className='space-y-3 text-sm text-gray-600'>
              <li>
                <strong className='text-gray-700'>Email:</strong> {user.email || 'N/A'}
              </li>
              <li>
                <strong className='text-gray-700'>Username:</strong> {user.username || 'N/A'}
              </li>
              <li>
                <strong className='text-gray-700'>Created At:</strong>{' '}
                {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </li>
              <li>
                <strong className='text-gray-700'>Updated At:</strong>{' '}
                {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
              </li>
            </ul>
          </div>

          {/* Additional Info */}
          <div>
            <h2 className='text-lg font-semibold text-gray-700 mb-4'>Other Info</h2>
            <div className='text-sm text-gray-600'>
              <p>This section can include additional information about the user.</p>
              <p>Customize it as per your needs!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;