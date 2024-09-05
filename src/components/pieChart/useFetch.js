import { useState, useEffect } from 'react';

function useFetch(fetchFunction) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);  // Dastlab false bo'ladi
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);  // Faqat fetchData ishlaganda loading boshlanadi
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false); // Fetch tugaganda loading to'xtaydi
    }
  };

  const refetch = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData(); // Faqat bir marta render bo'lganda ishlaydi
  }, []);

  return { data, loading, error, refetch };
}

export default useFetch;
