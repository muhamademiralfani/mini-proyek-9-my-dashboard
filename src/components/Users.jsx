import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, deleteUser, fetchUserDetails } from '../redux/async/userSlice';
import { showConfirmationAlert, showSuccessAlert, showErrorAlert } from '../utils/SweetAlert';

const Users = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users = [], status, error, pagination = { currentPage: 1, totalPages: 1 } } = useSelector((state) => state.users);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    dispatch(fetchUsers({ search: searchQuery, page: currentPage, limit }));
  }, [dispatch, searchQuery, currentPage, limit]);

  const handleSearch = () => {
    setCurrentPage(1); // Reset ke halaman pertama
    dispatch(fetchUsers({ search: searchQuery, page: 1, limit }));
  };

  const handleDelete = async (id) => {
    const confirmation = await showConfirmationAlert('Are you sure?', 'This action cannot be undone.');
    if (confirmation.isConfirmed) {
      try {
        await dispatch(deleteUser(id)).unwrap();
        showSuccessAlert('Deleted!', 'The user has been successfully deleted.');
        dispatch(fetchUsers({ search: searchQuery, page: currentPage, limit })); // Refresh data
      } catch (error) {
        showErrorAlert('Error!', error.message);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/users/edit/${id}`); // Navigasi ke CreateUser dengan ID user
    dispatch(fetchUserDetails(id));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className='p-6 bg-white rounded-lg shadow-md'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold'>Users List</h2>
        <button onClick={() => navigate('/users/add')} className='bg-primary text-white py-2 px-4 rounded-lg font-bold shadow-md hover:bg-opacity-80 transition'>
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
        <button onClick={handleSearch} className='bg-primary text-white py-2 px-4 rounded-lg font-bold shadow-md hover:bg-opacity-80 transition'>
          Search
        </button>
      </div>

      {status === 'loading' && <p>Loading users...</p>}
      {error && <p>Error: {error}</p>}

      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='p-3 font-bold text-gray-600 uppercase border-b'>Author</th>
              <th className='p-3 font-bold text-gray-600 uppercase border-b'>Title</th>
              <th className='p-3 font-bold text-gray-600 uppercase border-b'>Edit</th>
              <th className='p-3 font-bold text-gray-600 uppercase border-b'>Delete</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className='border-b hover:bg-gray-50'>
                <td className='p-3 flex items-center space-x-3'>
                  <img src={user.photo || 'https://via.placeholder.com/40'} alt={user.name} className='w-10 h-10 rounded-full object-cover' />
                  <div>
                    <p className='font-bold'>{user.name}</p>
                    <p className='text-sm text-gray-600'>{user.email}</p>
                  </div>
                </td>
                <td className='p-3'>
                  <p className='font-semibold'>{user.title}</p>
                </td>
                <td className='p-3'>
                  <button onClick={() => handleEdit(user.id)} className='text-blue-500 font-bold underline hover:no-underline'>
                    Edit
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

      <div className='flex justify-between items-center mt-6'>
        <button onClick={handlePreviousPage} disabled={currentPage === 1} className='py-2 px-4 bg-gray-200 text-gray-600 rounded-lg font-bold shadow-md hover:bg-gray-300 disabled:opacity-50 transition'>
          Previous
        </button>
        <span className='font-bold'>Page {currentPage}</span>
        <button onClick={handleNextPage} className='py-2 px-4 bg-gray-200 text-gray-600 rounded-lg font-bold shadow-md hover:bg-gray-300 transition'>
          Next
        </button>
      </div>
    </div>
  );
};

export default Users;
