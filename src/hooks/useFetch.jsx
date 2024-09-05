// useFetch.js
import { useEffect, useRef, useState } from "react";

const useFetch = (fetchData, query = {}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const hasFetched = useRef(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const queryString = new URLSearchParams(query).toString();
                const result = await fetchData(queryString);
                setData(result);
                setLoading(false);
                hasFetched.current = true;
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        loadData();
    }, [fetchData, JSON.stringify(query)]);

    return { data, loading, error };
};

export default useFetch;
