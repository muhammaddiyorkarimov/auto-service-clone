import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function useSearch(fetchFunction, defaultParams = {}) {
    const location = useLocation();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [searchParams, setSearchParams] = useState({
        ...defaultParams,
        ...Object.fromEntries(new URLSearchParams(location.search)),
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetchFunction(searchParams);
                setData(response);
            } catch (error) {
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchParams]);

    const updateSearchParams = (newParams) => {
        setSearchParams((prevParams) => ({
            ...prevParams,
            ...newParams,
        }));
    };

    return { data, loading, error, updateSearchParams, searchParams };
}

export default useSearch;
