import { useLocation, useNavigate } from 'react-router-dom';

const useQueryParams = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = new URLSearchParams(location.search);

    const setQueryParams = (newParams) => {
        for (const key in newParams) {
            params.set(key, newParams[key]);
        }
        navigate({ search: params.toString() });
    };

    return [params, setQueryParams];
};

export default useQueryParams;
