import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchBlogs, deleteBlog } from '../redux/async/blogSlice';

const BlogList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blogs = [], status, error, pagination = { currentPage: 1, totalPages: 1 } } = useSelector((state) => state.blogs);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  // Fetch blogs saat pertama kali komponen dimuat atau ketika search query atau page berubah
  useEffect(() => {
    dispatch(fetchBlogs({ page: currentPage, limit: 5, search: searchQuery }));
  }, [dispatch, currentPage, searchQuery]);

  // Fungsi untuk menangani input pencarian dengan debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout); // Batalkan timeout sebelumnya
    }

    const timeout = setTimeout(() => {
      setCurrentPage(1); // Reset ke halaman pertama setiap kali search berubah
    }, 500); // Delay 500ms

    setDebounceTimeout(timeout);
  };

  // Fungsi untuk memicu pencarian manual
  const handleSearchSubmit = () => {
    setCurrentPage(1);
    dispatch(fetchBlogs({ page: 1, limit: 5, search: searchQuery }));
  };

  // Fungsi untuk menghapus blog
  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this blog?');
    if (confirmed) {
      await dispatch(deleteBlog(id));
      dispatch(fetchBlogs({ page: currentPage, limit: 5, search: searchQuery })); // Refresh data setelah delete
    }
  };

  // Fungsi untuk navigasi ke halaman berikutnya
  const handleNextPage = () => {
    if (currentPage < pagination.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Fungsi untuk navigasi ke halaman sebelumnya
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <div className='bg-white shadow rounded-lg p-6 max-w-4xl mx-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold'>Blog List</h2>
          <button onClick={() => navigate('/blogs/add')} className='bg-primary text-white py-2 px-4 rounded-lg font-bold shadow-md hover:bg-opacity-80 transition'>
            Add Blog
          </button>
        </div>

        {/* Search Input and Button */}
        <div className='mb-4 flex items-center gap-2'>
          <input type='text' value={searchQuery} onChange={handleSearchChange} placeholder='Search Blogs' className='flex-grow p-3 border rounded-lg' />
          <button onClick={handleSearchSubmit} className='bg-primary text-white py-2 px-4 rounded-lg font-bold shadow-md hover:bg-opacity-80 transition'>
            Search
          </button>
        </div>

        {/* Status Loading */}
        {status === 'loading' && <p>Loading...</p>}

        {/* Error Handling */}
        {error && <p className='text-red-500'>Error: {typeof error === 'string' ? error : JSON.stringify(error)}</p>}

        {/* Blog List */}
        <div className='space-y-4'>
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <div key={blog.id} className='p-4 bg-gray-100 rounded-lg shadow'>
                <h3 className='text-lg font-semibold'>{blog.title}</h3>
                <p className='text-sm text-gray-600' dangerouslySetInnerHTML={{ __html: blog.meta_desc }} />
                <div className='mt-2 flex space-x-4'>
                  <button onClick={() => navigate(`/blogs/${blog.id}`)} className='text-primary font-bold'>
                    View
                  </button>
                  <button onClick={() => navigate(`/blogs/edit/${blog.id}`)} className='text-blue-500 font-bold'>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(blog.id)} className='text-red-500 font-bold'>
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No blogs available.</p>
          )}
        </div>

        {/* Pagination */}
        <div className='flex justify-between items-center mt-6'>
          <button onClick={handlePreviousPage} disabled={currentPage === 1} className={`py-2 px-4 rounded-lg font-bold shadow-md ${currentPage === 1 ? 'bg-gray-300 text-gray-500' : 'bg-primary text-white'}`}>
            Previous
          </button>
          <span>
            Page {currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === pagination.totalPages}
            className={`py-2 px-4 rounded-lg font-bold shadow-md ${currentPage === pagination.totalPages ? 'bg-gray-300 text-gray-500' : 'bg-primary text-white'}`}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogList;
