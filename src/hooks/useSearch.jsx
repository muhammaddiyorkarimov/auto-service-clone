import { useEffect, useRef, useState } from "react";

const useSearch = (fetchData, query, dependencies = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const queryRef = useRef(query);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchData(query);
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    // Faqat query o'zgarganida so'rov yuboriladi
    if (JSON.stringify(queryRef.current) !== JSON.stringify(query)) {
      queryRef.current = query;
      loadData();
    }
  }, [fetchData, JSON.stringify(query), ...dependencies]);

  return { data, loading, error };
};

export default useSearch;
