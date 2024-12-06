import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, deleteUser } from '../redux/async/userSlice';
import { showConfirmationAlert, showSuccessAlert, showErrorAlert } from '../utils/SweetAlert';

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, status, error } = useSelector((state) => state.users);

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10; // Fixed limit per page

  useEffect(() => {
    dispatch(fetchUsers({ search: searchQuery, page, limit }));
  }, [dispatch, searchQuery, page, limit]);

  const handleSearch = () => {
    setPage(1); // Reset to the first page when searching
    dispatch(fetchUsers({ search: searchQuery, page: 1, limit }));
  };

  const handleDelete = async (id) => {
    const confirmation = await showConfirmationAlert('Are you sure?', 'This action cannot be undone.');

    if (confirmation.isConfirmed) {
      try {
        await dispatch(deleteUser(id)).unwrap();
        showSuccessAlert('Deleted!', 'The user has been successfully deleted.');
      } catch (error) {
        showErrorAlert('Error!', error.message);
      }
    }
  };

  const handleViewProfile = (id) => {
    navigate(`/users/${id}`); // Navigate to profile with user ID
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 1));
  };

  if (status === 'loading') {
    return <p>Loading users...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className='p-6 bg-white rounded-lg shadow-md'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold'>Users List</h2>

        <button
          onClick={() => navigate('/create-user')}
          className='bg-primary text-white py-2 px-4 rounded-lg font-bold shadow-md hover:bg-opacity-80 transition'
        >
          Add User
        </button>
      </div>

      <div className='mb-6 flex items-center gap-2'>
        <input
          type='text'
          placeholder='Search by name, title, or email'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='w-full p-3 border rounded-lg focus:outline-primary focus:ring-2 focus:ring-primary transition'
        />
        <button
          onClick={handleSearch}
          className='bg-primary text-white py-2 px-4 rounded-lg font-bold shadow-md hover:bg-opacity-80 transition'
        >
          Search
        </button>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='p-3 font-bold text-gray-600 uppercase border-b'>Author</th>
              <th className='p-3 font-bold text-gray-600 uppercase border-b'>Title</th>
              <th className='p-3 font-bold text-gray-600 uppercase border-b'>View Profile</th>
              <th className='p-3 font-bold text-gray-600 uppercase border-b'>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className='border-b hover:bg-gray-50'>
                <td className='p-3 flex items-center space-x-3'>
                  <img
                    src={user.photo || 'https://via.placeholder.com/40'}
                    alt={user.name}
                    className='w-10 h-10 rounded-full object-cover'
                  />
                  <div>
                    <p className='font-bold'>{user.name}</p>
                    <p className='text-sm text-gray-600'>{user.email}</p>
                  </div>
                </td>

                <td className='p-3'>
                  <p className='font-semibold'>{user.title}</p>
                </td>

                <td className='p-3'>
                  <button
                    onClick={() => handleViewProfile(user.id)}
                    className='text-primary font-bold underline hover:no-underline'
                  >
                    View Profile
                  </button>
                </td>

                <td className='p-3 text-red-500 font-bold cursor-pointer'>
                  <button onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className='flex justify-between items-center mt-6'>
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className='py-2 px-4 bg-gray-200 text-gray-600 rounded-lg font-bold shadow-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition'
        >
          Previous
        </button>

        <span className='font-bold'>Page {page}</span>

        <button
          onClick={handleNextPage}
          className='py-2 px-4 bg-gray-200 text-gray-600 rounded-lg font-bold shadow-md hover:bg-gray-300 transition'
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Users;
