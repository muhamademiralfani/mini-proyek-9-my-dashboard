import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchContacts } from '../redux/async/contactSlice';

const ContactList = () => {
  const dispatch = useDispatch();
  const { contacts, status, error } = useSelector((state) => state.contact);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(5);

  // Fetch contacts on mount and whenever currentPage or searchQuery changes
  useEffect(() => {
    dispatch(fetchContacts({ page: currentPage, limit, search: searchQuery }));
  }, [dispatch, currentPage, limit, searchQuery]);

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on new search
    dispatch(fetchContacts({ page: 1, limit, search: searchQuery }));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6 space-y-4 lg:space-y-0">
          <h2 className="text-2xl font-bold">Contact List</h2>
          <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border rounded-lg w-full lg:w-auto"
            />
            <button
              onClick={handleSearch}
              className="bg-primary text-white py-2 px-4 rounded-lg shadow-md hover:bg-opacity-80 transition w-full lg:w-auto"
            >
              Search
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {status === 'loading' && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {Array.isArray(contacts) && contacts.length > 0 ? (
            contacts.map((contact) => (
              <div key={contact.id} className="p-4 bg-gray-100 rounded-lg shadow">
                <h3 className="text-lg font-bold">{contact.name}</h3>
                <p className="text-sm text-gray-600">{contact.email}</p>
                <p className="text-sm text-gray-600">{contact.phone}</p>
              </div>
            ))
          ) : (
            <p>No contacts available.</p>
          )}
        </div>
        {/* Pagination Controls */}
        <div className="mt-6 flex justify-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`py-2 px-4 rounded-lg ${
              currentPage === 1 ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-white'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="bg-primary text-white py-2 px-4 rounded-lg"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactList;
