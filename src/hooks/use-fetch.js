import { useState } from 'react';

const useFetch = (callback, initialData = null) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(initialData);

  const execute = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await callback(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err?.message || 'An error occurred. Please try again.';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, data, execute, fn: execute };
};

export default useFetch;