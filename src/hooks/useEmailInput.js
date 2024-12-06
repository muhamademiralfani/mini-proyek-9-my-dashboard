import { useState, useEffect } from 'react';

const useEmailInput = (key = 'userEmail', initialValue = '') => {
  const [email, setEmail] = useState(() => {
    return localStorage.getItem(key) || initialValue;
  });
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    localStorage.setItem(key, email);
  }, [key, email]);

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsValid(emailRegex.test(value));
  };

  return {
    email,
    setEmail,
    isValid,
    handleChange,
  };
};

export default useEmailInput;
