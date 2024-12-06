// Dashboard Component
const Dashboard = () => {
  return (
    <div className='bg-white p-6 rounded-lg shadow-md'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <div className='bg-primary text-white p-6 rounded-lg shadow hover:shadow-lg transition duration-200'>
          <h3 className='text-lg font-semibold'>Spent this month</h3>
          <p className='text-3xl font-bold mt-4'>$682.5</p>
        </div>
        <div className='bg-primary text-white p-6 rounded-lg shadow hover:shadow-lg transition duration-200'>
          <h3 className='text-lg font-semibold'>New Clients</h3>
          <p className='text-3xl font-bold mt-4'>321</p>
        </div>
        <div className='bg-primary text-white p-6 rounded-lg shadow hover:shadow-lg transition duration-200'>
          <h3 className='text-lg font-semibold'>Earnings</h3>
          <p className='text-3xl font-bold mt-4'>$350.40</p>
        </div>
        <div className='bg-primary text-white p-6 rounded-lg shadow hover:shadow-lg transition duration-200'>
          <h3 className='text-lg font-semibold'>Activity</h3>
          <p className='text-3xl font-bold mt-4'>$540.50</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
