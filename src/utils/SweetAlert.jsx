import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// Inisialisasi SweetAlert dengan React
const MySwal = withReactContent(Swal);

// Konfigurasi tema SweetAlert
const defaultOptions = {
  customClass: {
    container: 'custom-swal-container',
    popup: 'bg-white rounded-lg shadow-lg p-6',
    header: 'mb-4 text-center',
    title: 'text-lg font-bold text-gray-800',
    closeButton: 'text-gray-600 hover:text-gray-800',
    icon: 'text-primary',
    content: 'text-gray-600 text-sm',
    actions: 'mt-4 flex justify-center space-x-3',
    confirmButton: 'focus:outline-none',
    cancelButton: 'focus:outline-none',
    footer: 'mt-4 text-gray-500 text-xs',
  },
  buttonsStyling: false, // Styling akan dikontrol secara manual menggunakan Tailwind CSS
};

// Success Alert
export const showSuccessAlert = async (title, text) => {
  return await MySwal.fire({
    title: title || 'Success!',
    text: text || 'Your operation was successful.',
    icon: 'success',
    confirmButtonText: 'OK',
    confirmButtonClass: 'bg-green-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-600 transition focus:ring-2 focus:ring-offset-2 focus:ring-green-500',
    ...defaultOptions,
  });
};

// Error Alert
export const showErrorAlert = async (title, text) => {
  return await MySwal.fire({
    title: title || 'Error!',
    text: text || 'Something went wrong.',
    icon: 'error',
    confirmButtonText: 'Try Again',
    confirmButtonClass: 'bg-red-500 text-white py-2 px-6 rounded-lg font-semibold hover:bg-red-600 transition focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
    ...defaultOptions,
  });
};

// Confirmation Alert
export const showConfirmationAlert = async (title, text) => {
  return await MySwal.fire({
    title: title || 'Are you sure?',
    text: text || 'This action cannot be undone.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    confirmButtonClass: 'bg-primary text-white py-2 px-6 rounded-lg font-semibold hover:bg-primary-dark transition focus:ring-2 focus:ring-offset-2 focus:ring-primary',
    cancelButtonClass: 'bg-gray-300 text-gray-700 py-2 px-6 rounded-lg font-semibold hover:bg-gray-400 transition focus:ring-2 focus:ring-offset-2 focus:ring-gray-300',
    ...defaultOptions,
  });
};
